$(document).ready(init);

function init()
{
	$('header').fadeOut(2500);
 	$.post	(
 			'php/getData.php',
 			{
 				domain: 'admin',
 				command: 'getCollectionList'
 			},
 			receiveCollectionList
 		);
		$('body')
			.on (
				'click',
				'.tool, .smallTool',
				e => {
						var command = $(e.currentTarget).attr('data-cmd');
						if (window[command])
						{
							window[command](e);
						}
						else
						{
							alert('Commande non implémentée : ' + command);
						}
				     }
			    );
}

function goToMenu()
{
	window.location = window.location;
}

function receiveCollectionList(serverResult)
{
	var result = JSON.parse(serverResult);
	if (result.error < 0)
	{
	 	alert(result.errorMessage);
	}
	else
	{
 		result
 		.data
 			.forEach 	(
						e => {
 					$('.tool[data-cmd="addCollection"]')
						.before('<div class="collectionButton" data-collectionId="' + e.COL_id + '"><button class="tool" data-cmd="showCollection" data-collectionId="' + e.COL_id + '"> ' + ( e.COL_type == '' ? '' : '<img src="images/' + e.COL_type + '.png">') + '<label>' + e.COL_label + '</label></button><div class="smallToolBox"><img class="smallTool" data-cmd="deleteCollection" src="images/trash.png"><img class="smallTool" data-cmd="editCollection" src="images/editor.png"></div></div>');
 						    }
	 				);
	}
}
