var manager = new TraficManager(pistesAeroport);
var joueur = {};
var niveauEnCours = 1;

$(document).ready(init);

function init()
{
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
	afficherAccueil();
}

function commencerPartie()
{
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

function initialiserPartie()
{
 	joueur = {niveau: 1, score: 0, avions: 0};
 	avions = [];
	$('body')
		.append('<div class="messageRadios"></div><div class="statistiques"><fieldset class="statLine"><label class="statLabel">Niveau :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Appareils en vol :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Score :</label><label class="statValue"></label></fieldset><fieldset class="statLine"><label class="statLabel">Appareils traités :</label><label class="statValue"></label></fieldset></div>');
	$('.map')
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
					if (vol.statut != 'Décollage' && vol.statut != 'Atterrissage')
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
						$('button:not(.largeButton)')
							.prop('disabled', vol.type == 'Decollage');
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

function controlerAvion()
{
	var command = $(e.currentTarget).text();
	var vol = manager.avionsEnJeu.find (f => {return f.code == $(e.currentTarget).parents('.avion').attr('data-numero-vol');});
	switch (command)
	{
		case "Autorisation décollage":
			cacherControleAvion();
			break;
		case "Accélerer":
			cacherControleAvion();
			break;
		case "Ralentir":
			cacherControleAvion();
			break;
		case "Monter":
			cacherControleAvion();
			break;
		case "Descendre":
			cacherControleAvion();
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
	// manager.observerTrafic();
}

function bougerAppareil(vol)
{
	$('.avion[data-numero-vol="' + vol.code + '"]')
		.animate 	(
						{
							left: vol.positionCible.left,
							top: vol.positionCible.top
						},
						manager.calculerTemps(vol.positionOrigine.left, vol.positionOrigine.top, vol.positionCible.left, vol.positionCible.top, vol.vitesse),
						'linear'
					);
}

function ajouterMessageRadio(sens, message)
{
	$('.messageRadios')
		.prepend('<label class="messageRadio ' + sens + '">' + message + '</label>');
	$('.messageRadio:first')
		.delay(5000)
		.fadeOut(8000);
}

