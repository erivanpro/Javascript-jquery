var columnsDefinitions;
var collectionRecords;
var currentElementId;

function showCollection(e)
{
	currentCollectionId = $(e.currentTarget).parents('.collectionButton').attr('data-collectionId');
	var collection = $(e.currentTarget).find('label').text();
	$.post	(
		  'php/getData.php',
  		  {
			domain: 'collection',
			command: 'getCollectionData',
			record: currentCollectionId
	  	  },
	  	  serverData => {
						    $('.container')
							.load	(
										'collectionList.html',
										serverResult => {
															manageCollection (serverResult, serverData, collection);
															$('.recordContainer')
																.on (
																		'click',
																		'.recordLine',
																		e => 	{
																					currentElementId = $(e.currentTarget).attr('data-id');
																					$('.selectedElement')
																						.removeClass('selectedElement');
																					$(e.currentTarget)
																						.addClass('selectedElement');
																				}
																		)
																.on (
																		'scroll', 
																		e => 	{
																					$('.recordTableHeader')
																						.scrollLeft($('.recordContainer').scrollLeft());
																				}
																	)
																.on (
																		'dblclick',
																		'.recordLine',
																		editElement
																    );
									     				}
									);
				  		}
		);
}

function manageCollection(serverResult, serverData, collection)
{
	var data = JSON.parse(serverData);
	if (data.error < 0)
	{
		notifyUser('error', data.errorMessage);
	}
	else
	{
		collectionRecords = data.data.collectionRecords;
		columnsDefinitions = data.data.columnsDefinitions;
		$('.subTitle')
			.text('Eléments de la collection : "' + collection + '"');
		drawHeaders();
		drawRecords();
	}
}

function drawHeaders()
{
	columnsDefinitions
		.filter (
				e => 	{
						return ['oui/non', 'image'].indexOf(e.FLD_type) == -1;
					}
			)
		.forEach (
				e =>	{
						var filterField = $('<fieldset class="filterFieldset"><label>' + e.FLD_label + '</label><input type="text" data-field="FLD_' + e.FLD_id + '"></fieldset>');
						var headerField = $('<label class="lblColumHeader" data-field="FLD_' + e.FLD_id + '">' + e.FLD_label + '</label>');
						$('.collectionFilterZone')
 							.append(filterField);
						$('.recordTableHeader')
							.append(headerField);
					}
			);
	$('.collectionFilterZone')
		.on (
			'keyup',
			'.filterFieldset',
			e => 	{
						filterElements();
					}
		    );
}

function setComponentsListeners()
{
 	$('.newElementContainer')
	.on (
			'keydown',
			'.realCardFieldset>.textListComponent>input',
		e => 	{
					if (e.key == 'Enter')
					{
						var text = $(e.currentTarget).val();
					if (text != '')
						{
							$(e.currentTarget)
								.parents('.textListComponent')
								.find('.content')
								.append('<label class="lblInput">' + text + '</label>');
						$(e.currentTarget)
								.val('');
						}
					}
				}
		    );
	$('.newElementContainer')
	.on (
			'dblclick',
			'.realCardFieldset>.textListComponent>.content>label',
			e => 	{
						$(e.currentTarget)
							.remove();
					}
	    );
	$('.newElementContainer')
		.on (
			'dblclick',
			'.realCardFieldset>.imageComponent',
			e => 	{
						$(e.currentTarget)
							.parents('.realCardFieldset')
							.find('input')
							.trigger('click');
					}
    	    );
	$('.newElementContainer')
		.on (
				'change',
				'.realCardFieldset>.hiddenInputFile',
				e => 	{
							var files = $(e.currentTarget)[0].files;
							var reader = new FileReader();
							$(reader)
								.on (
										'load',
										f => 	{
													$(e.currentTarget)
														.parents('.realCardFieldset')
														.find('img')
														.data('imageBytesArray', f.target.result);
												}
									);
							if (files.length > 0 && files[0].type.indexOf('image') > -1)
							{
								var fileName = files[0].name;
								$(e.currentTarget)
									.parents('.realCardFieldset')
									.find('img')
									.attr('src', window.URL.createObjectURL(files[0]));
								var theFile = files[0];
								var tmp = reader.readAsDataURL(theFile);
							}
						}
			);
}

function addElement()
{
	currentElementId = undefined;
	$('.tool[data-cmd="goToMenu"]')
		.fadeOut();
	var newWindow = $('<div class="newElementWindow"><label class="lblNewElementTitle">Créer un nouvel élément</label><div class="newElementContainer"></div><div class="newElementToolbox"><button class="tool" data-cmd="saveElement">Valider</button><button class="tool" data-cmd="cancelElement">Annuler</button></div></div>');
	$('body')
		.append(newWindow);
	columnsDefinitions
		.forEach 	(
						e => 	{
									var newField = createField(e, 'realCard');
									$('.newElementContainer')
										.append(newField);
								}
					);
	setComponentsListeners();
}

function getElementValues()
{
	var elementData = {};
	$('.newElementContainer>.realCardFieldset')
		.each 	(
					(i, e) => 	{
									if ($(e).find('.imageComponent').length > 0) 
									{
										elementData['FLD_' + $(e).attr('data-id')] = $(e).find('.imageComponent').attr('src');
										if (elementData['FLD_' + $(e).attr('data-id')] == "images/imageDef.png")
										{
											elementData['FLD_' + $(e).attr('data-id')] = '';
										}
										else
										{
											elementData['FLD_' + $(e).attr('data-id')] = $(e).find('.imageComponent').data('imageBytesArray');
										}
									}
									else if ($(e).find('.multiChoiceBox').length > 0)
									{
										elementData['FLD_' + $(e).attr('data-id')] =	$(e)
																							.find('.multiChoiceBox>.choiceContent>input:checked')
																							.get()
																							.map(f => 	{
																											return $(f.nextSibling)
																												   .text();
																										}
																								)
																							.join(';');
									}
									else if ($(e).find('.textListComponent').length > 0)
									{
									  elementData['FLD_' + $(e).attr('data-id')] = 	$(e)
																						.find('.lblInput')
																						.get()
																						.map(f => 	{
																										return $(f).text();
																							    	}
																							)
																						.join(';');
									}
									else if ($(e).find('select').length > 0)
									{
										elementData['FLD_' + $(e).attr('data-id')] = $(e).find('select').val();
									}
									else if ($(e).find('input[type="checkbox"]').length > 0)
									{
										elementData['FLD_' + $(e).attr('data-id')] = $(e).find('input:checked').length == 0 ? 'off' : 'on';
									}
									else 
									{
										elementData['FLD_' + $(e).attr('data-id')] = $(e).find('input').val();
									}
								}
				);
	return elementData;
}

function saveElement()
{
	var dataToSave = getElementValues();
	dataToSave.COR_id = currentElementId;
	$.post	(
				'php/setData.php',
				{
					domain: 'collection',
					command: 'saveElement',
					record: currentCollectionId,
					fieldValue: JSON.stringify(dataToSave)
				},
				serverResult => {
									var result = JSON.parse(serverResult);
									if (result.error < 0)
									{
										notifyUser('error', result.errorMessage);
									}
									else
									{
										notifyUser('success', 'Les données ont été enregistrées');
										updateElement(dataToSave);
										cancelElement();
									}
								}
			);
}

function drawRecords()
{
	$('.recordContainer')
		.empty();
	collectionRecords
		.forEach 	(
						e => 	{
 									appendLine(e);
								}
				   );
}

function appendLine(e)
{
	var newLine = $('<div class="recordLine" data-id="' + e.COR_id + '"></div>');
	columnsDefinitions
	  .filter 	(
					e => 	{
								return ['oui/non', 'image'].indexOf(e.FLD_type) == -1;
							}
				)
	  .forEach (
					f => 	{
				 				newLine
								    .append ('<label class="recordFieldValue" data-field="FLD_' + f.FLD_id + '">' + e['FLD_' + f.FLD_id] + '</label>');
			     			}
		   		); 
	$('.recordContainer')
		.append(newLine); 	
}

function filterElements(e)
{
	$('.recordLine')
		.show();
	$('.filterFieldset>input')
		.get()
		.forEach (
					f => 	{
								var field = $(f).attr('data-field');
								var value = $(f).val();
								$('.recordFieldValue[data-field="' + field + '"]:not(:contains("' + value + '"))')
									.parents('.recordLine')
									.hide();
							}
			);
}

function editElement(e)
{
	addElement();
	currentElementId = $(e.currentTarget).attr('data-id');
	columnsDefinitions
		.forEach 	(
						f =>	{
									switch (f.FLD_type)
									{
										case 'texte':
										case 'nombre':
										case 'date':
											$('.newElementContainer>fieldset[data-id="' + f.FLD_id + '"]>input')
												.val(collectionRecords.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id]);
											break;
										case 'oui/non':
											$('.newElementContainer>fieldset[data-id="' + f.FLD_id + '"]>input')
												.attr('checked', collectionRecords.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id] == 'on');
											break;
										case 'image':
											$('.newElementContainer>fieldset[data-id="' + f.FLD_id + '"]>img')
												.attr('src', collectionRecords.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id]);
											break;
										case 'choix':
											$('.newElementContainer>fieldset[data-id="' + f.FLD_id + '"]>select')
												.val(collectionRecords.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id]);
											break;
										case 'liste de textes':
											collectionRecords
												.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id]
												.split(';')
												.forEach 	(
																g => 	{
																			$('.realCardFieldset[data-id="' + f.FLD_id + '"]>>.content')
																				.append ('<label class="lblInput">' + g + '</label>');
																		}
															);
											break;
										case 'choix multiple':
											collectionRecords
												.find(g => {return g.COR_id == currentElementId;})['FLD_' + f.FLD_id]
												.split(';')
												.forEach 	(
																g => 	{
																			$('.realCardFieldset[data-id="' + f.FLD_id + '"]>>>label:contains("' + g + '")')
																				.parents('.choiceContent')
																				.find('input')
																				.attr('checked', true);
																		}
															);
											break;
									}
								}
					);
}

function cancelElement()
{
	$('.newElementWindow')
		.remove();
	$('.tool[data-cmd="goToMenu"]')
		.fadeIn();
}

function updateElement(e)
{
	var element =	collectionRecords
					  .find (
							    f => 	{
											return f.COR_id == e.COR_id;
										}
					  	  	);
	if (element)
	{
		Object
			.keys(element)
			.forEach 	(
							f => 	{
										element[f] = e[f];
				     				}
			   			);
	  $('.recordLine[data-id="' + e.COR_id + '"]')
		.find('.recordFieldValue')
		.get()
		.forEach 	(
			    		f => 	{
				    				$(f).text(e[$(f).attr('data-field')]);
				  				}
			   		);
	}
	else
	{
		collectionRecords
			.push(e);
		appendLine(e);
	}
}

function deleteElement()
{
	if (confirm("Attention, action irréversible! Etes-vous sûr(e) de vouloir supprimer cet élément ?"))
	{
		$.post (
					'php/setData.php?rnd' + Math.random(),
					{
						domain: 'collection',
						command: 'deleteElement',
						record: currentCollectionId,
						fieldValue: currentElementId
					},
					serverResult => {
										var result = JSON.parse(serverResult);
										if (result.error < 0)
										{
											notifyUser('error', result.errorMessage);
										}
										else
										{
											notifyUser('success', 'L\'élément a bien été supprimé.');
											$('.selectedElement')
												.remove();
											collectionRecords
												.splice(collectionRecords.indexOf(collectionRecords.find(f => {return f.COR_id == currentElementId;})), 1);
											currentElementId = undefined;
										}
									}
			);
	}
}
