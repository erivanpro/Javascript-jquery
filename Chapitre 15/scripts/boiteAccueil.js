function BoiteAccueil(titre, image, texte, instructions, fonction)
{
	$('.voile, .boiteAccueil').remove();
	$('body').append('<div class="voile"></div><div class="boiteAccueil"><img class="BALogo" src="' + image + '"><label class="BATitre">' + titre + '</label><p class="BATexte">' + texte + '<p class="BAInstructions">' + instructions + '</p><button>Démarrer une partie</button></div>');
 	$('.boiteAccueil')
 		.animate ({top: '330px'},500)
 		.on (
 				'click',	
 				'button',
 				function ()
 				{
					if (fonction)
 					{
					 	$('.boiteAccueil')
				 			.animate 	(
				 							{top: '-500px'},	
 									    	500,
				 			    			function ()
				 			    			{
		 										$('.voile, .boiteAccueil')	.remove();
			 					    		}
			 					    	);
 						fonction();
 					}
 					else
 					{
						$('.messageErreur')
							.remove();
						$('<label class="messageErreur">La fonction de démarrage est inconnue...</label>')
						 	.insertAfter('.BAInstructions');
 						console.error('La fonction de démarrage est inconnue...');
 					}
 				}
 			);
 	}
