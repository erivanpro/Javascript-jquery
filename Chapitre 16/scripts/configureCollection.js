var currentCollectionId;
var currentCollection = {};

function addCollection(e)
{
	$.post 	(
		  		'php/setData.php',
		  		{
					domain: "admin",
					command: "createCollection"
		  		},
		  		serverResult => 	{
										var result = JSON.parse(serverResult);
										if (result.error < 0)
										{
											alert (result.errorMessage);
										}
										else
										{
											currentCollectionId = result.data;
											editCollection(e);
										}
									}
		);
}

function editCollection(e)
{
	var colId = $(e.currentTarget).hasClass('tool') ? currentCollectionId : $(e.currentTarget).parents('.collectionButton').attr('data-collectionId');
	$.post 	(
				'php/getData.php?wit=' + Math.random(),
				{
					domain: 'admin',
					command: 'getCollectionDetail',
					record: colId
				},
				serverResult => {
									var result = JSON.parse(serverResult);
									if (result.error < 0)
									{
										alert(result.errorMessage);
									}
									else
									{
										currentCollection = result.data[0];
										currentCollectionId = currentCollection.COL_id;
										$('.container')
						 			    	.load 	(
											    		'editCollection.html',
											     		e => 	{
																	$('#collectionName > input')
																		.val(result.data[0].COL_label)
																		.focus();
																   	$('#collectionDescription > textarea')							
																   		.val(result.data[0].COL_description);
														 		   	if (currentCollection.COL_type != '')
																   	{
																		$('#collectionLogo > img[data-val="' + currentCollection.COL_type + '"]')
																			.addClass('selectedCollectionLogo');
																   	}
																	$('.ownProperties')
																		.on (
																			'click',
																			'#collectionLogo > img',
																			f => 	{
																					var fieldName = $(f.currentTarget).parents('#collectionLogo').attr('data-fieldName');
																					var fieldValue = $(f.currentTarget).attr('data-val');
																					var record = colId;
																					if (fieldValue != currentCollection[fieldName])
																					{
																						sendData(colId, fieldName, fieldValue);
																					}
																		$('.selectedCollectionLogo').removeClass('selectedCollectionLogo');
																		$(f.currentTarget).addClass('selectedCollectionLogo');
																				}
																		)
																	.on (
																			'blur',
																			'fieldset > input, fieldset > textarea',
																			f => 	{
																					var fieldName = $(f.currentTarget).attr('data-fieldName');
																					var fieldValue = $(f.currentTarget).val();
																					var record = colId;
																					if (fieldValue != currentCollection[fieldName])
																					{
																						sendData(colId, fieldName, fieldValue);
																					}
																				}
																		    );
											    				}
										    		);
									 }
							    }
			    );
}

function sendData(record, fieldName, fieldValue)
{
	$.post	(
				'php/setData.php',
				{
					domain: 'admin',
					command: 'updateCollectionProperty',
					fieldName: fieldName,
					fieldValue: fieldValue,
					record: record
				},
				serverResult => {
									var result = JSON.parse(serverResult);
									if (result.error < 0)
									{
							 			notifyUser('error', result.errorMessage);
									}
									else
									{
										notifyUser('success', 'Données enregistrées');
					 					currentCollection[fieldName] = fieldValue;
									}
						     	}
		);
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

function deleteCollection (e)
{
	var colId = $(e.currentTarget).parents('.collectionButton').attr('data-collectionId');
 	if (confirm("Attention, cette action est irréversible. Etes-vous sûr(e) de vouloir supprimer cette collection ?"))
 	{
       $.post (
			'php/getData.php',
			{
				domain: 'admin',
				command: 'deleteCollection',
				record: colId
			},
			serverResult => {
						var result = JSON.parse(serverResult);
						if (result.error < 0)
						{
							notifyUser('error', result.errorMessage);
						}
						else
						{
							notifyUser('success', 'La collection a été supprimée de la base de données.');
							$('.collectionButton[data-collectionId="' + colId + '"]')
								.remove();
						}
					}
		);
   }
}
