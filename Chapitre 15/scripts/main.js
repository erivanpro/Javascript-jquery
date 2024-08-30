var manager = new TraficManager(pistesAeroport);
var joueur = {};
var niveauEnCours = 1;

$(document).ready(init);

function init()
{
	$.extend 	(
					$.easing,
					{
					    easeInQuad: 	function (x, t, b, c, d)
					    				{
											return c * (t /= d) * t + b;
										},
					    easeOutQuad: 	function (x, t, b, c, d)
					    				{
					        				return -c * (t /= d) * (t - 2) + b;
				    					}
					}
				);
	$('header').fadeOut(5000);
	$('.map')
		.on (
				'enAttentePartie',
				commencerPartie
			);
	$('.controleBox')
		.hide()
		.on (
				'click',
				'button',
				controlerAvion
			);
	$(manager)
		.on (
				'risqueDeCollision',
				montrerRisque
			)
		.on (
				'finDeRisque',
				supprimerRisque
			)
		.on (
				'crash',
				terminerPartie
			)
		.on (
				'changementDeRisque',
				modifierRisque
			);
	afficherAccueil();
}

function commencerPartie()
{
	afficherNiveau();
	manager.partieEnCours = true;
	partieEnCours = setInterval(testerEtAjouterVol, 1000);
	placerAppareil(manager.inventerVol());
	afficherStatistiques();
}

function afficherAccueil()
{
	var accueil = new BoiteAccueil 	(
										"Contrôle aérien ENI", 
										"images/A320.png",
										"Prenez la place d'un aiguilleur du ciel. Assurez la sécurité de milliers de passagers en prenant en charge le survol de votre espace aérien par leurs appareils.",
										"Pour jouer, cliquez sur l'avion que vous désirez contrôler pour ouvrir sa boite de commandes et effectuez la commande désirée. Pour donner une direction à l'avion sélectionné, cliquez sur la carte.",
										initialiserPartie
									);
}

function terminerVol(vol)
{
	$('.avion[data-numero-vol="' + vol.code + '"]')
		.delay(1000)
		.queue	(
					function ()
					{
						var message;
						switch (vol.type)
						{
							case "Atterrissage":
								message = "Ok tour de contrôle, vol " + vol.code + " bien atterri. En roulage vers zone de débarquement. Over.";
								ajouterMessageRadio('messageIn', message);
								manager.avionsTraites.atterrissages++;
								break;
							default:
								message = "Ok tour de contrôle, vol " + vol.code + " en sortie de l'espace aérien, cap " + calculerCap(vol) + ". Au revoir, over.";
								ajouterMessageRadio('messageIn', message);
								if (vol.type == 'transit')
								{
									manager.avionsTraites.transits++;
								}
								else
								{
									manager.avionsTraites.decollages++;
								}
								break;
						}
						joueur.score += vol.type == "Transit" ? 500 : 750;
						joueur.avions++;
						$('.avion[data-numero-vol="' + vol.code + '"]')
							.remove();
						manager
							.avionsEnJeu
							.splice(manager.avionsEnJeu.indexOf(manager.avionsEnJeu.find(e => {return e.code == vol.code;})), 1);
						if (joueur.avions == niveauEnCours * 4)
						{
							niveauEnCours++;
							afficherNiveau();
						}
					}
				);
}

function initialiserPartie()
{
 	joueur = {niveau: 1, score: 0, avions: 0};
	$('body')
		.append('<div class="messageRadios"></div><div class="statistiques"><fieldset class="statLine"><label class="statLabel">Niveau :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Appareils en vol :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Score :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Appareils traités :</label><label class="statValue"></label></fieldset></div>');
	$('.map')
		.on (
				'click',
				routerAvion
			)
 		.trigger('enAttentePartie');
 }

function afficherStatistiques()
{
	$('.statValue:first').text(niveauEnCours);
	$('.statValue:eq(1)').text(manager.avionsEnJeu.length);
	$('.statValue:eq(2)').text(joueur.score);
	$('.statValue:last').text(joueur.avions);
}

function calculerCap(vol)
{
	return (Number(vol.cap) + 90 < 0 ? (360 + Number(vol.cap) + 90) : (Number(vol.cap) + 90));
}

function placerAppareil(vol)
{
	var message;
	$('.map')
		.append ('<div class="avion" data-numero-vol="' + vol.code + '"><img src="images/' + vol.avion + '.png"><div class="feuilleDeVol ' + vol.direction + ' ' + vol.type.toLowerCase() + '"><label class="compagnie">' + vol.compagnie + '</label><label class="volDe">' + vol.de + '</label><label class="code">' + vol.code + '</label><label class="cap">' + calculerCap(vol) + '°</label><label class="altitude">' + vol.altitude + 'ft</label><label class="vitesse">' + vol.vitesse + 'km/h</label><label class="volVers">' + vol.vers + '</label></div></div>');
	$('.avion[data-numero-vol="' + vol.code + '"]')
		.find('.compagnie, .volDe, .volVers')
		.hide();
 	$('.avion[data-numero-vol="' + vol.code + '"]')
		.css 	(
					{
						left: vol.positionOrigine.left,
						top: vol.positionOrigine.top,
					}
				);
	$('.avion[data-numero-vol="' + vol.code + '"] img')
		.hover(
				function (e)
				{
 					$(this)
						.css('filter', 'sepia() hue-rotate(90deg) saturate(3) drop-shadow(20px 40px 2px #303030)');
					$('div[data-numero-vol="' + vol.code + '"]')
						.find('.compagnie, .volDe, .volVers')							
						.show();
				},
				function (e)
				{
					$(this)
						.css('filter', 'drop-shadow(20px 40px 2px #303030)');
					$('div[data-numero-vol="' + vol.code + '"]')
						.find('.compagnie, .volDe, .volVers')
						.hide();
				}
			)
		.click (
				function (e)
				{
					if (vol.statut != 'Decollage' && vol.statut != 'Atterrissage')
					{
						$('.sousControle')
							.removeClass('sousControle');
						$('div[data-numero-vol="' + vol.code + '"] img')
							.addClass('sousControle');
						$('.controleBox')
							.appendTo($('div[data-numero-vol="' + vol.code + '"] > .feuilleDeVol'));
						$('.controleBox')
							.show();
						$('.largeButton')
							.prop('disabled', vol.type != 'Decollage' || vol.statut != 'en attente');
						$('button:not(.largeButton,.fermerControle)')
							.prop('disabled', vol.type == 'Decollage' || vol.type == 'Atterrissage');
						$('.map')
							.css('cursor', vol.type != 'Decollage' ? 'crosshair' : 'initial');
					}
				}
			);
	$('.avion[data-numero-vol="' + vol.code + '"] img')
		.css 	(
					{
						transform: 'rotate(' + vol.positionOrigine.orientation + 'deg)',
					}
				);
	message = vol.code + ' : Bonjour tour de contrôle. Vol ' + vol.compagnie + ' ' + vol.code + (vol.type == 'Decollage' ? " à destination de " + vol.vers + " demande autorisation de décollage." : vol.type == 'Atterrissage' ? " en provenance de " + vol.de + " demande la permission d'atterrir." : " en provenance de " + vol.de + " et à destination de " + vol.vers + " penètre votre espace aérien et demande prise en charge pour guidage.") + ' Over.';
	ajouterMessageRadio('messageIn', message);
	bougerAppareil(vol);
}

function cacherControleAvion()
{
	$('.sousControle')
		.removeClass('sousControle');
	$('.controleBox')
		.appendTo($('.map'));
	$('.controleBox')
		.hide();
	$('.map')
		.css('cursor', 'initial');
}

function controlerAvion(e)
{
	var message;
	var command = $(e.currentTarget).text();
	var vol = manager.avionsEnJeu.find (f => {return f.code == $(e.currentTarget).parents('.avion').attr('data-numero-vol');});
	switch (command)
	{
		case "Autorisation décollage":
			cacherControleAvion();
			message = "Bonjour vol " + vol.code + ". Vous êtes autorisé à décoller. Bon vol. Over.";
			ajouterMessageRadio('messageOut', message);
			vol.statut = "Décollage";
			bougerAppareil(vol);
			break;
		case "Accélérer":
			cacherControleAvion();
			ajouterMessageRadio('messageOut', 'Attention vol ' + vol.code + ', vous êtes priés d\'augmenter votre vitesse à ' + (vol.vitesse + 100) + 'km/h. Over.');
			vol.changerVitesse = vol.vitesse + 100;
			break;
		case "Ralentir":
			cacherControleAvion();
			ajouterMessageRadio('messageOut', 'Attention vol ' + vol.code + ', vous êtes priés de réduire votre vitesse à ' + (vol.vitesse - 100) + 'km/h. Over.');
			vol.changerVitesse = vol.vitesse - 100;
			break;
		case "Monter":
			cacherControleAvion();
			ajouterMessageRadio('messageOut', 'Attention vol ' + vol.code + ', vous êtes priés d\'augmenter votre altitude à ' + (vol.altitude + 1000) + ' pieds. Over.');
			vol.changerAltitude = vol.altitude + 1000;
			break;
		case "Descendre":
			cacherControleAvion();
			ajouterMessageRadio('messageOut', 'Attention vol ' + vol.code + ', vous êtes priés de réduire votre altitude à ' + (vol.altitude - 1000) + ' pieds. Over.');
			vol.changerAltitude = vol.altitude - 1000;
			break;
		case 'X':
			cacherControleAvion();
			break;
		default:
			break;
	}
}

function testerEtAjouterVol()
{
	if (Math.random() > (.90 - (.05 * niveauEnCours)) && manager.avionsEnJeu.length < 4 + niveauEnCours)
	{
		placerAppareil(manager.inventerVol());
	}
	afficherStatistiques();
	bougerRisques();
	manager.observerTrafic();
}

function afficherNiveau()
{
	$('.niveauJeu')
		.text('Niveau ' + niveauEnCours)
		.fadeIn(0)
		.fadeOut(6000);
}

function bougerAppareil(vol)
{
	var trajet;
	if (vol.statut != "en attente")
	{
		trajet = vol.trajets.shift();
		if (trajet)
		{
			vol.trajetEnCours = trajet;
			$('.avion[data-numero-vol="' + vol.code + '"]')
				.delay 	(trajet.attente)
				.animate(
							{
								left: trajet.left,
								top: trajet.top,
								altitude: trajet.altitude,
								vitesse: trajet.vitesse,
							},
							{
								duration: trajet.temps,
								easing: trajet.inertie == undefined ? 'linear' : trajet.inertie,
								step: function (e, p)
								{
									vol.positionActuelle[p.prop] = p.now;
									if (vol.changerVitesse != undefined)
									{
										trajet.vitesse = vol.changerVitesse;
										if (vol.vitesse < vol.changerVitesse)
										{
											vol.vitesse += .25;
										}
										else if (vol.vitesse > vol.changerVitesse)
										{
											vol.vitesse -= .25;
										}
										else
										{
											vol.changerVitesse = undefined;
											ajouterMessageRadio('messageIn', vol.code + ' : Vitesse demandée atteinte. Over.');
										}
									}
									if (vol.changerAltitude != undefined)
									{
										trajet.altitude = vol.changerAltitude;
										if (vol.altitude < vol.changerAltitude)
										{
											vol.altitude += 5;
										}
										else if (vol.altitude > vol.changerAltitude)
										{
											vol.altitude -= 5;
										}
										else
										{
											vol.changerAltitude = undefined;
											ajouterMessageRadio('messageIn', vol.code + ' : Altitude demandée atteinte. Over.');
										}
									}
									$('.avion[data-numero-vol="' + vol.code + '"] img')
										.css 	(													{
													transform: 'rotate(' + trajet.orientation + 'deg)',
												}
											);
									$('.avion[data-numero-vol="' + vol.code + '"] .vitesse')
										.text(vol.vitesse + (trajet.vitesse > vol.vitesse ? Number(((trajet.vitesse - vol.vitesse) * p.pos).toFixed(0)) : trajet.vitesse < vol.vitesse ? -Number(((vol.vitesse - trajet.vitesse) * p.pos).toFixed(0)) : 0) + ' km/h');
									$('.avion[data-numero-vol="' + vol.code + '"] .altitude')
										.text(vol.altitude + (trajet.altitude > vol.altitude ? Number(((trajet.altitude - vol.altitude) * p.pos).toFixed(0)) : trajet.altitude < vol.altitude ? -Number(((vol.altitude - trajet.altitude) * p.pos).toFixed(0)) : 0) + ' ft');
								},
								complete: function ()
										{
											vol.altitude = trajet.altitude;
											vol.vitesse = trajet.vitesse;
											vol.statut = trajet.statut == undefined ? 'en vol' : trajet.statut;
											if (vol.trajets.length > 0)
											{
												bougerAppareil(vol);
											}
											else
											{
												terminerVol(vol);
											}
										}
							}
						);
		}
	}
}

function ajouterMessageRadio(sens, message)
{
	$('.messageRadios')
		.prepend('<label class="messageRadio ' + sens + '">' + message + '</label>');
	$('.messageRadio:first')
		.delay(5000)
		.fadeOut(8000);
}

function routerAvion(e)
{
	var vol;
	var position;
	var tmp;
	var nouvelleRoute;
	var message;
	if (e.currentTarget == e.target && $('.sousControle').length == 1)
	{
		vol = 	manager
					.avionsEnJeu
					.find 	(
								f => 	{
											return f.code == $('.sousControle').parents('.avion').attr('data-numero-vol');
										}
							);
		if (vol.statut == "en vol")
		{
			$('.avion[data-numero-vol="' + vol.code + '"]')
				.stop();
			position = $('.avion[data-numero-vol="' + vol.code + '"]').offset();
			position.left += 25;
			position.top += 25;
			nouvelleRoute = {left: e.clientX - 25, top: e.clientY - 25};
			nouvelleRoute.orientation = manager.calculerOrientation(position.left, position.top, nouvelleRoute.left, nouvelleRoute.top);
			$('.avion[data-numero-vol="' + vol.code + '"] img')
				.css 	(
							{
								transform: 'rotate(' + nouvelleRoute.orientation + 'deg)',
							}
						);
			if (vol.statut != 'transit')
			{
				tmp = vol.trajets.pop();
			}
			vol.trajets = [];
			vol
				.trajets
				.push 	(
							{
								attente: 0,
								left: e.offsetX,
								top: e.offsetY,
								vitesse: vol.vitesse,
								altitude: vol.altitude,
								orientation: nouvelleRoute.orientation,
								temps: manager.calculerTemps(position.left, position.top, nouvelleRoute.left, nouvelleRoute.top, vol.vitesse)
							}
						);
			vol
				.trajets
				.push 	(
							{
								attente: 0,
								left: vol.positionCible.left,
								top: vol.positionCible.top,
								vitesse: vol.vitesse,
								altitude: vol.altitude,
								orientation: manager.calculerOrientation(nouvelleRoute.left, nouvelleRoute.top, vol.positionCible.left, vol.positionCible.top),
								temps: manager.calculerTemps(vol.positionCible.left, vol.positionCible.top, nouvelleRoute.left, nouvelleRoute.top, vol.vitesse)
							}
						);
			if (tmp != undefined)
			{
				vol.trajets.push(tmp);
			}
			message = "Vol " + vol.code + " préparez-vous à virer. Veuillez changer votre cap au " + calculerCap(vol) + ". Over.";
			ajouterMessageRadio('messageOut', message);
			bougerAppareil(vol);
			cacherControleAvion();
		}
	}
}

function estimerCadre(codeAppareil, codeDanger)
{
	var decalageX = $('.map').offset().left;
	var decalageY = $('.map').offset().top;
	var appareilDOM = $('.avion[data-numero-vol="' + codeAppareil + '"]');
	var dangerDOM = $('.avion[data-numero-vol="' + codeDanger + '"]');
	if (appareilDOM == undefined || dangerDOM == undefined)
	{
		return undefined;
	}
	try
	{
		var positionGauche = Math.min(appareilDOM.offset().left, dangerDOM.offset().left) - decalageX - 80;
		var dimensionH = Math.max(appareilDOM.offset().left, dangerDOM.offset().left) + 80 - positionGauche - decalageX;
		var positionHaute = Math.min(appareilDOM.offset().top, dangerDOM.offset().top) - decalageY - 80;
		var dimensionV = Math.max(appareilDOM.offset().top, dangerDOM.offset().top) + 80 - positionHaute - decalageY;
		return 	{
					gauche: positionGauche,
					haut: positionHaute,
					largeur: dimensionH,
					hauteur: dimensionV
				};
	}
	catch (e)
	{
		return undefined;
	}
}

function montrerRisque(e)
{
	var dimensionCadre = estimerCadre(e.dataRisque.appareil.code, e.dataRisque.danger.code);
	if (dimensionCadre)
	{
		$('.map')
			.append ('<div class="cadreRisque risqueN' + e.dataRisque.niveauDeRisque + '" data-code-risque="' + e.dataRisque.appareil.code + "|" + e.dataRisque.danger.code + '"></div>');
		$('.cadreRisque[data-code-risque="' + e.dataRisque.appareil.code + "|" + e.dataRisque.danger.code + '"')
			.css 	(
						{
							left: dimensionCadre.gauche,
							top: dimensionCadre.haut,
							width: dimensionCadre.largeur,
							height: dimensionCadre.hauteur
						}
					);
	}
}

function bougerRisques()
{
	$('.cadreRisque')
		.get()
		.forEach(
					e => 	{
								var codeRisque = $(e).attr('data-code-risque');
								var dimensionCadre = estimerCadre(codeRisque.split('|')[0], codeRisque.split('|')[1]);
								if (dimensionCadre != undefined)
								{
									$(e)
										.css 	(
													{
														left: dimensionCadre.gauche,
														top: dimensionCadre.haut,
														width: dimensionCadre.largeur,
														height: dimensionCadre.hauteur
													}
												);
								}
							}
				);
}

function modifierRisque(e)
{
	$('.cadreRisque[data-code-risque="' + e.dataRisque.appareil.code + '|' + e.dataRisque.danger.code + '"]')
		.removeClass('risqueN1, risqueN2, risqueN3')
		.addClass('risqueN' + e.dataRisque.niveauDeRisque);
}

function supprimerRisque(e)
{
	$('.cadreRisque[data-code-risque="' + e.dataRisque.appareil + '|' + e.dataRisque.danger + '"]')
		.remove();
}

function terminerPartie(e)
{
	clearInterval(manager.partieEnCours);
	$('.avion')
		.stop();
	$('.avion:not([data-numero-vol="' + e.dataRisque.appareil.code + '"],[data-numero-vol="' + e.dataRisque.danger.code + '"])')
		.remove();
	$('.cadreRisque:not([data-code-risque="' + e.dataRisque.appareil.code + '|' + e.dataRisque.danger.code + '"]')
		.remove();
	$('.cadreRisque')
		.removeClass('risqueN1, risqueN2, risqueN3')
		.addClass('risqueCrash');
	$('.niveauJeu')
		.text('Crash !!')
		.fadeIn(4000);
	$('.messageRadios')
		.empty()
		.append('<label class="messageRadio messageOut" style="font-size: 150%; font-weight: bold;">Une catastrophe est malheureusement survenue et la partie est terminée. Vous avez marqué ' + joueur.score + ' points, bravo !</label>');
	setTimeout 	(
					f => 	{
								window.location = window.location;
							},
					15000
				);
}
