function TraficManager(pistes)
{
	this.pistes = pistes;
 	this.avionsEnJeu = [];
	this.avionsTraites = {atterrissages: 0, decollages: 0, transits: 0};
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
										vol.statut = "en vol";
										vol.positionOrigine = obtenirPosition(vol.origine);
										vol.positionCible = {left: this.pistes.atterrissage.bout.left, top: this.pistes.atterrissage.bout.top, orientation: this.pistes.atterrissage.orientation};
										vol.positionOrigine.orientation = this.calculerOrientation(vol.positionOrigine.left, vol.positionOrigine.top, this.pistes.atterrissage.bout.left, this.pistes.atterrissage.bout.top);
										break;
									case "Decollage":
										vol.statut = "en attente";
										vol.positionCible = obtenirPosition(vol.cible);
										vol.positionCible.orientation = this.calculerOrientation(this.pistes.decollage.fin.left, this.pistes.decollage.fin.top, vol.positionCible.left, vol.positionCible.top);
										vol.altitude = 0;
										vol.vitesse = 0;
										vol.positionOrigine = {left: this.pistes.decollage.bout.left, top: this.pistes.decollage.bout.top, orientation: -36};
										break;
									default:
										vol.statut = "en vol";
										vol.positionOrigine = obtenirPosition(vol.origine);
										vol.positionCible = obtenirPosition(vol.cible);
										vol.positionOrigine.orientation = this.calculerOrientation(vol.positionOrigine.left, vol.positionOrigine.top, vol.positionCible.left, vol.positionCible.top);
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
.	inventerVol = 	function (forcerTypeVol)
					{
		 				var vol = {};
		 				var temp;
						var hasard = Math.random();
						if ((hasard < .15 && forcerTypeVol == undefined) || forcerTypeVol == 'D')
						{
			 					vol.type = "Décollage";
						}
						else if ((hasard > .85 && forcerTypeVol == undefined) || forcerTypeVol == 'A')
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
													return 	(de == 'TLS' && typeDeVol == 'Décollage') ||
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
							return distance / etalonTemps * (3000 - (vitesse * 1.5)) / 1000;
						}
