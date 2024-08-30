$(document).ready(init);

function init()
{
	$(document)
   		.attr('unselectable', 'on')
    	.css('user-select', 'none')
    	.css('MozUserSelect', 'none')
    	.on('selectstart', false);
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
 
function notifyUser (notificationType, message)
{
 	var notification;
	$('body')
	  .append('<div class="notification notify_' + notificationType + '">' + message + '</div>');
	notification = $('.notification:last');
	notification
	  .fadeOut (3000, e => {notification.remove();});
}

function createField(theField, type)
{
	var newField = $('<fieldset class="' + type + 'Fieldset" data-id="' + theField.FLD_id + '"><label>' + theField.FLD_label + '</label></fieldset>');
	switch (theField.FLD_type)
	{
		case 'texte':
		case 'date':
		case 'nombre':
			newField
				.append('<input type="text">');
			break;
		case 'oui/non':
			newField
			  .append('<input type="checkbox" id="chk_' + theField.FLD_id + '"><label for="chk_' + theField.FLD_id + '"></label>');
			break;
		case 'choix':
			newField
				.append('<select><option></option></select>');
			theField
				.FLD_choiceList
				.split(';')
				.forEach	(
							e =>	{
									newField
									.find('select')
									.append('<option>' + e + '</option>');
								}
						);
			break;
		case 'choix multiple':
			newField
				.append('<div class="multiChoiceBox"></div>');
			theField
				.FLD_choiceList
				.split(';')
				.forEach	(
							(e, i) =>{
									newField
								.find('.multiChoiceBox')
								.append('<div class="choiceContent"><input type="checkbox" id="chk_' + i + '"><label for="chk_' + i + '">' + e + '</label></div>');
								}
						);
			newField
				.css('height', (theField.FLD_choiceList.split(';').length * 19) + 'px');
			break;
		case 'liste de textes':
			newField
				.append('<div class="textListComponent"><div class="content"></div><input type="text"></div>');
			newField
				.css('height', '180px');
			break;
		case 'image':
			newField
				.append('<img class="imageComponent" src="images/imageDef.png"><input type="file" class="hiddenInputFile">');
			newField
				.css('height', '180px');
			break;
	}
	if (theField.FLD_geometry)
	{
		var geometry = JSON.parse(theField.FLD_geometry);
		newField
		  .css	(
			  {
			    left: geometry.left,
			    top: geometry.top,
			    width: geometry.labelSize + geometry.componentSize + 10
			  }
			);
		newField
			.find ('label:first')
			.css (
			      {
				  width: geometry.labelSize,
				  fontWeight: geometry.fontWeight,
				  fontStyle: geometry.fontStyle,
				  textDecoration: geometry.textDecoration,
				  display: geometry.labelDisplay
				}
			     );
		newField
			.find ('*:not(label,[type="checkbox"])')
			.css (
				{
				  width: geometry.componentSize - 10
				}
			     );
	}
	return newField;
}
