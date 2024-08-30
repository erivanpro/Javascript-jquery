function TraficManager(pistes)
{
	this.partieEnCours = 0;
	this.pistes = pistes;
 	this.avionsEnJeu = [];
	this.avionsTraites = {atterrissages: 0, decollages: 0, transits: 0};
	this.risquesDeCollision = {};
}

TraficManager
	.prototype
	.calculerOrientation = 	function (x1, y1, x2, y2)
 			    			{
						 		return -((Math.atan2(x2 - x1, y2 - y1) * 180 / Math.PI) - 90);
	  		    			}

TraficManager
	.prototype
	.obtenirVariablesVol = 	function (vol)
							{
								var horizontalMax = $('.map').width() - 50;
								var verticalMax = $('.map').height() - 50;
								var position = {};
								vol.altitude = (Math.floor(Math.random() * 20) * 500) + 2500;
								vol.vitesse = (Math.ceil(Math.random() * 6) * 50) + 600;
								vol.direction = vol.cible.toLowerCase();
								switch (vol.type)
								{
									case "Atterrissage":
										vol.statut = "en approche";
										vol.positionOrigine = obtenirPosition(vol.origine);
										vol.positionCible = {left: this.pistes.atterrissage.bout.left, top: this.pistes.atterrissage.bout.top, orientation: this.pistes.atterrissage.orientation};
										vol.positionOrigine.orientation = this.calculerOrientation(vol.positionOrigine.left, vol.positionOrigine.top, this.pistes.atterrissage.bout.left, this.pistes.atterrissage.bout.top);
										vol.trajets.push({attente: 0, left: this.pistes.atterrissage.bout.left, top: this.pistes.atterrissage.bout.top, vitesse: 350, altitude: 400, orientation: vol.positionOrigine.orientation, temps: this.calculerTemps(vol.positionOrigine.left, vol.positionOrigine.top, this.pistes.atterrissage.bout.left, this.pistes.atterrissage.bout.top, vol.vitesse)});
										vol.trajets.push ({attente: 0, left: this.pistes.atterrissage.roulage.left, top: this.pistes.atterrissage.roulage.top, temps: 3000, altitude: 0, vitesse: 200, orientation: this.pistes.atterrissage.orientation});
										vol.trajets.push ({attente: 0, left: this.pistes.atterrissage.fin.left, top: this.pistes.atterrissage.fin.top, temps: 14000, altitude: 0, vitesse: 0, orientation: this.pistes.atterrissage.orientation, inertie: 'easeOutQuad'});
										break;
									case "Decollage":
										vol.statut = "en attente";
										vol.positionCible = obtenirPosition(vol.cible);
										vol.positionCible.orientation = this.calculerOrientation(this.pistes.decollage.fin.left, this.pistes.decollage.fin.top, vol.positionCible.left, vol.positionCible.top);
										vol.trajets.push ({attente: 3000, left: this.pistes.decollage.roulage.left, top: this.pistes.decollage.roulage.top, temps: 2000, altitude: 0, vitesse: Math.floor((Math.random() * 50) + 100), orientation: -36, inertie: 'easeInQuad', statut: 'Decollage'});
										vol.trajets.push ({attente: 0, left: this.pistes.decollage.fin.left, top: this.pistes.decollage.fin.top, temps: 2500, altitude: Math.floor((Math.random() * 200) + 250), vitesse: Math.floor((Math.random() * 100) + 300), orientation: -36});
										vol.trajets.push ({attente: 0, left: vol.positionCible.left, top: vol.positionCible.top, temps: this.calculerTemps(this.pistes.decollage.fin.left, this.pistes.decollage.fin.top, vol.positionCible.left, vol.positionCible.top, vol.vitesse), altitude: vol.altitude, vitesse: vol.vitesse, orientation: vol.positionCible.orientation});
										vol.altitude = 0;
										vol.vitesse = 0;
										vol.positionOrigine = {left: this.pistes.decollage.bout.left, top: this.pistes.decollage.bout.top, orientation: -36};
										break;
									default:
										vol.statut = "en vol";
										vol.positionOrigine = obtenirPosition(vol.origine);
										vol.positionCible = obtenirPosition(vol.cible);
										vol.positionOrigine.orientation = this.calculerOrientation(vol.positionOrigine.left, vol.positionOrigine.top, vol.positionCible.left, vol.positionCible.top);
										vol.trajets.push({attente: 0, left: vol.positionCible.left, top: vol.positionCible.top, temps: this.calculerTemps(vol.positionOrigine.left, vol.positionOrigine.top, vol.positionCible.left, vol.positionCible.top, vol.vitesse), altitude: vol.altitude, vitesse: vol.vitesse, orientation: vol.positionOrigine.orientation});
										break;
								}
								vol.cap = vol.positionOrigine.orientation.toFixed(0);
								function obtenirPosition(sens)
								{
									var position = {};
									switch (sens)
									{
										case "Nord":
											position.top = -(Math.floor(Math.random() * 50) + 10);
											position.left = Math.floor(Math.random() * horizontalMax) + 25;
											break;
										case "Sud":
											position.top = verticalMax + (Math.floor(Math.random() * 50) + 10);
											position.left = Math.floor(Math.random() * horizontalMax) + 25;
											break;
										case "Est":
											position.top = Math.floor(Math.random() * verticalMax) + 25;
											position.left = horizontalMax + (Math.floor(Math.random() * 50) + 10);
											break;
										case "Ouest":
											position.top = Math.floor(Math.random() * verticalMax) + 25;
											position.left = -(Math.floor(Math.random() * 50) + 10);
											break;
										default:
											break;
									}
									return position;
								}
							}

TraficManager
	.prototype
	.inventerVol = 	function (forcerTypeVol)
					{
		 				var vol = {};
		 				var temp;
						var hasard = Math.random();
						if (((hasard < .2 && forcerTypeVol == undefined) || forcerTypeVol == 'D') && this.avionsEnJeu.filter(e => {return e.statut == 'en attente';}).length == 0)
						{
			 				vol.type = "Decollage";
						}
						else if ((hasard > .8 && forcerTypeVol == undefined) || forcerTypeVol == 'A')
		 				{
		 					vol.type = "Atterrissage";
						}
						else
		 				{
		 					vol.type = "Transit";
						}
	 					temp = this.choisirVol(vol.type);
						vol.de = temp.de;
		 				vol.vers = temp.vers;
		 				vol.trajets = [];
		 				vol.pays = temp.pays;
		 				vol.origine = temp.origine;
		 				vol.cible = vol.type == 'Decollage' ? vol.origine : cibles[vol.origine];
		 				vol.avion = Math.random() > .5 ? 'A320' : 'B747';
		 				temp = compagnies.filter (
 													function (e)
													{
													 	return e.pays == vol.pays;
		 											}
		 										);
		 				temp = temp[Math.floor(Math.random() * temp.length)];
						vol.compagnie = temp.nom;
		 				vol.code = temp.code + '-' + (Math.floor(Math.random() * 8000) + 1000);
		 				vol.positionActuelle = {code: vol.code};
		 				this.obtenirVariablesVol(vol);
						this.avionsEnJeu.push(vol);
						return vol;
					}

TraficManager
	.prototype
	.choisirVol = 	function (typeDeVol)
	 		 		{
						var temp;
						temp = 	vols
 									.filter (
												function (e)
												{
													var de = e.de.substring(0, 3);
													var vers = e.vers.substring(0, 3);
													return 	(de == 'TLS' && typeDeVol == 'Decollage') ||
												  			(vers == 'TLS' && typeDeVol == 'Atterrissage') ||
												  			(de != 'TLS' && vers != 'TLS' && typeDeVol == 'Transit');
												}
											);
				   		temp = temp[Math.floor(Math.random() * temp.length)];
 						return temp;
 			 		}

TraficManager
	.prototype
	.calculerTemps = 	function (x1, y1, x2, y2, vitesse)
						{
							var distance;
							var etalonTemps = Math.sqrt(($('.map').width() ** 2) + ($('.map').height() ** 2)) / 60000;
						 	distance = Math.sqrt((Math.abs(x2 - x1) ** 2) + (Math.abs(y2 - y1) ** 2));
							return distance * etalonTemps * vitesse * 2.5;
						}

TraficManager
	.prototype
	.observerTrafic = 	function ()
						{
							var appareilsEnDanger = [];
							var seuilsCritiques = 	[
														{seuilH: 200, seuilV: 2000},
														{seuilH: 150, seuilV: 1500},
														{seuilH: 100, seuilV: 1000},
														{seuilH: 50, seuilV: 500},
													];
	var avionsEnVol =   this
							.avionsEnJeu
							.filter (
							          	e => 	{
						      		            	return e.positionActuelle.left;
												}
								  ); 
	avionsEnVol
		.forEach(e => {
	   				avionsEnVol
						.filter (
								f => {
										var distanceAppareils = Math.sqrt((Math.abs(f.positionActuelle.left - e.positionActuelle.left) ** 2) + (Math.abs(f.positionActuelle.top - e.positionActuelle.top) ** 2));
										return 		f.code != e.code 
												&& 
													distanceAppareils <= seuilsCritiques[0].seuilH
												&&
													(
														Math.abs(f.positionActuelle.altitude - e.positionActuelle.altitude) <= seuilsCritiques[0].seuilV
													);
									}
								)
		.forEach (
					f => {
							var distanceAppareils = Math.sqrt((Math.abs(f.positionActuelle.left - e.positionActuelle.left) ** 2) + (Math.abs(f.positionActuelle.top - e.positionActuelle.top) ** 2));
							var ecartAppareils = Math.abs(f.positionActuelle.altitude - e.positionActuelle.altitude);
							appareilsEnDanger.push 	(
														{
															appareil: f, 
															danger: e, 
															niveauDeRisque: seuilsCritiques
																			.indexOf	(
																							seuilsCritiques
																								.filter	(
																											g =>	{
																														return 	distanceAppareils < g.seuilH 
																																&& ecartAppareils < g.seuilV
																													}
																										)
																								.reverse()[0]
																						) + 1
														}
													);
 						}
		 	   );
		}
	);
	appareilsEnDanger
		.forEach(
				e => 	{
						var leRisqueUn = this.risquesDeCollision[e.appareil.code + ',' + e.danger.code];
						var leRisqueDeux = this.risquesDeCollision[e.danger.code + ',' + e.appareil.code];
						if (leRisqueUn == undefined && leRisqueDeux == undefined)
						{
							$(this).trigger({type: e.niveauDeRisque == 4 ? 'crash' : 'risqueDeCollision', dataRisque: e});
						}
						else
						{
							if (leRisqueUn != undefined && leRisqueUn != e.niveauDeRisque)
							{
								$(this).trigger({type: e.niveauDeRisque == 4 ? 'crash' : 'changementDeRisque', dataRisque: e});
							}
						}
						this.risquesDeCollision[e.appareil.code + ',' + e.danger.code] = e.niveauDeRisque;												this.risquesDeCollision[e.danger.code + ',' + e.appareil.code] = e.niveauDeRisque;											},
					this
				);
	Object
		.keys (this.risquesDeCollision)
		.forEach(
				e => 	{
						if (appareilsEnDanger.find(f => {return (f.appareil.code == e.split(',')[0] && f.danger.code == e.split(',')[1]) || (f.appareil.code == e.split(',')[1] && f.danger.code == e.split(',')[0])}) == undefined)
		 				{
							$(this).trigger({type: 'finDeRisque', dataRisque: {appareil: e.split(',')[0], danger: e.split(',')[1]}});																delete this.risquesDeCollision[e];
						}
					}
				);
			}
