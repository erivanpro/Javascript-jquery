var currentCollectionId;
var currentCollection = {};
var currentFieldId;

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
																	prepareDrag();
																	drawCollectionFields();
																	$('.fieldList')
																	.on (
																			'dblclick',
																			'.fieldLine',			  					 		
																			editField
																	 	);
																	$('.cardLayout')
																		.on  (
																				'click',
																				'.layoutFieldset',
																				f => 	{
																							$('.selectedComponent')
																								.removeClass('selectedComponent');
																							$(f.currentTarget)
																								.addClass('selectedComponent');
																							$('#hPosition')
																								.val($('.selectedComponent').offset().left - $('.cardLayout').offset().left);
																							$('#vPosition')
																								.attr('min', parseInt($('.selectedComponent').css('top')) - ($('.selectedComponent').offset().top - $('.cardLayout').offset().top))
																								.val($('.selectedComponent').offset().top - $('.cardLayout').offset().top);
																							$('#hLabelSize')
																								.val($('.selectedComponent>label').width());
																							$('#hComponentSize')
																								.val($('.selectedComponent>*:last').width());
																							if ($('.selectedComponent>label').css('font-weight') > 500)
																							{
																								$('.formatBold')
																									.addClass('selectedFormatTool');
																							}
																							else
																							{
																								$('.formatBold')
																									.removeClass('selectedFormatTool');
																							}
																							if ($('.selectedComponent>label').css('font-style') == 'italic')
																							{
																								$('.formatItalic')
																									.addClass('selectedFormatTool');
																							}
																							else
																							{
																								$('.formatItalic')
																									.removeClass('selectedFormatTool');
																							}
																							if ($('.selectedComponent>label').css('text-decoration').indexOf('underline') > -1)
																							{
																								$('.formatUnderline')
																									.addClass('selectedFormatTool');
																							}
																							else
																							{
																								$('.formatUnderline')
																									.removeClass('selectedFormatTool');
																							}
																							if ($('.selectedComponent>label').css('display') == 'none')
																							{
																								$('.formatNoDisplay')
																									.addClass('selectedFormatTool');
																							}
																							else
																							{
																								$('.formatNoDisplay')
																									.removeClass('selectedFormatTool');
																							}
																							if ($('.selectedComponent>label').css('display') == 'none')
																							{
																								$('.formatNoDisplay')
																									.addClass('selectedFormatTool');
																							}
																							else
																							{
																								$('.formatNoDisplay')
																									.removeClass('selectedFormatTool');
																							}
																						}
																			);
											    				}
										    		);
									 }
							    }
			    );
}

function setLayoutTools()
{
	$('#hPosition')
		.on (
			'input',
			f => 	{
					$('.selectedComponent')
					.css 	(
							{
								left: $('#hPosition')
									.val() + 'px'
							}
						);
					saveFieldProperties();
				}
			);
	$('#vPosition')
		.on (
			'input',
			f => 	{
					$('.selectedComponent')
					.css 	(
							{
							top: $('#vPosition')
									.val() + 'px'
							}
						);
					saveFieldProperties();
				}
			);
	$('#hLabelSize')
		.on (
			'input',
			f => 	{
					$('.selectedComponent>label')
						.css 	(
							{
								width: $('#hLabelSize')
									.val() + 'px'
							}
							);
					$('.selectedComponent')
						.css 	(
							{
								width: ($('.selectedComponent>*').not('label').width() + 10 + Number($('#hLabelSize').val())) + 'px'
							}
						);
					saveFieldProperties();
				}
			);
	$('#hComponentSize')
		.on (
			'input',
			f => 	{
					$('.selectedComponent>*, .selectedComponent>.textListComponent>*')
						.not('label')	
						.css 	(
							{
								width: $('#hComponentSize')
									.val() + 'px'
							}
							);
					$('.selectedComponent')
						.css 	(
							{
								width: ($('.selectedComponent>label').width() + 10 + Number($('#hComponentSize').val())) + 'px'
							}
							);
					saveFieldProperties();
				}
			);
	$('.formatTool')
		.on (
			'click',
			f => 	{
					if ($(f.currentTarget).hasClass('selectedFormatTool'))
					{
					$(f.currentTarget)
						.removeClass('selectedFormatTool');
					if ($(f.currentTarget).hasClass('formatBold'))
					{
						$('.selectedComponent>label')
							.css('font-weight', 400);
					}
					if ($(f.currentTarget).hasClass('formatItalic'))
					{
						$('.selectedComponent>label')
							.css('font-style', 'normal');
					}
					if ($(f.currentTarget).hasClass('formatUnderline'))
					{
						$('.selectedComponent>label')
							.css('text-decoration', 'none');
					}
					if ($(f.currentTarget).hasClass('formatNoDisplay'))
					{
						$('.selectedComponent>label').css('display', 'inline-block');
					}
				}
				else
				{
					$(f.currentTarget)
						.addClass('selectedFormatTool');
					if ($(f.currentTarget).hasClass('formatBold'))
					{
						$('.selectedComponent>label')
							.css('font-weight', 700);
					}
					if ($(f.currentTarget).hasClass('formatItalic'))
					{
						$('.selectedComponent>label')
							.css('font-style', 'italic');
					}
					if ($(f.currentTarget).hasClass('formatUnderline'))
					{
						$('.selectedComponent>label')
							.css('text-decoration', 'underline');
					}
					if ($(f.currentTarget).hasClass('formatNoDisplay'))
					{
						$('.selectedComponent>label').css('display', 'none');	
					}
				}
					saveFieldProperties();
			}
		);
	$('.layoutRemoveButton')
		.on (
			'click',
			f => 	{
			var lineId = $('.selectedComponent').attr('data-id');
			$('.fieldList>.fieldLine[data-id="' + lineId + '"]')
				.attr('draggable', true)
					.css 	(
						{
							fontStyle: 'normal',
							color: 'black'
						}
					);
			$('.selectedComponent')
					.remove();
				if ($('.cardLayout>.layoutFieldset').length == 0)
				{
					$('.layoutTools').remove();
				}
				else
				{
					$('.cardLayout>.layoutFieldset:last')
						.addClass('selectedComponent');
				}
			deleteFieldProperties();
			}
	   );
}

function prepareDrag()
{
	$('.cardLayout')
		.on	(
				'dragover',
				f => 	{
						f.preventDefault();
					}
			)
		.on (
			'drop',
			insertFieldInLayout
	           );
	$('.fieldList')
		.on(
			'dragstart',
			'.fieldLine',
			f => 	{
					draggedField = currentCollection.dataFields.find(g => {return g.FLD_id == $(f.currentTarget).attr('data-id');});
				}
		   );
}

function insertFieldInLayout(e)
{
	e.preventDefault();
	appendField(draggedField);
}

function appendField(theField)
{
	$('.fieldList>.fieldLine[data-id="' + theField.FLD_id + '"]')
		.attr('draggable', false)
		.css 	(
					{
						fontStyle: 'italic',
						color: 'grey'
					}
				);
	var newField = createField(theField, 'layout');
	$('.cardLayout')
		.append(newField);
	$('.selectedComponent')
		.removeClass('selectedComponent');
	$('.layoutFieldset:last')
		.addClass('selectedComponent');
 	addLayoutToolbox();
	saveFieldProperties();
}

function addLayoutToolbox()
{
	if ($('.layoutTools').length == 0)
	{
		$('body')
			.append('<div class="layoutTools"><label class="lblToolboxTitle">Outils</label><label class="smallToolLabel">Position horizontale</label><input id="hPosition" type="range" min="0" max="' + ($('.cardLayout').width()).toFixed(0) + '" value="' + ( 0) + '"><label class="smallToolLabel">Position verticale</label><input id="vPosition" type="range" max="' + ($('.cardLayout').height()).toFixed(0) + '" value="' + ($('.selectedComponent').offset().top - $('.cardLayout').offset().top) + '"><label class="smallToolLabel">Largeur étiquette</label><input id="hLabelSize" type="range" min="50" max="' + ($('.cardLayout').height()).toFixed(0) + '" value="' + $('.selectedComponent>label').width() + '"><label class="smallToolLabel">Largeur composant</label><input id="hComponentSize" type="range" min="50" max="' + ($('.cardLayout').width()).toFixed(0) + '" value="' + $('.selectedComponent>*:last').width() + '"><label class="smallToolLabel">Format étiquette</label><div class="formatTool formatBold">G</div><div class="formatTool formatItalic">I</div><div class="formatTool formatUnderline">S</div><div class="formatTool formatNoDisplay">X</div><button class="layoutRemoveButton">Enlever</button></div>');
		$('.layoutTools')
			.css 	(
				  {
				    right: '330px',
				    top: '10px',
				  }
				);
		setLayoutTools();
	}
}

function editField(e)
{
	if ($(e.currentTarget).attr('draggable') == 'true')
	{
		currentFieldId = $(e.currentTarget).attr('data-id');
		var field = currentCollection.dataFields.find(f => {return f.FLD_id == currentFieldId;});
		$('body')
			.append('<div class="voile"></div><div class="alertBox"></div>');
		$('.alertBox')
			.load(
					'addNewField.html',
					function (e)
					{
						$('.lblBoxTitle')
							.text('Modifier un champ existant');
						$('.addNewField')
						.on (
								'change',
								'input, select',
								e =>  	{
											checkNewFieldInput();
										}
							);
						$("#typeChamp > select")
							.on	('change', prepareFieldDetails);
						$("#typeChamp > select")
							.val(field.FLD_type);
						$('#nomChamp > input')
							.val(field.FLD_name);
						$('#labelChamp > input')
							.val(field.FLD_label);
						$('#descriptionChamp > textarea')
							.val(field.FLD_description);
						$("#typeChamp > select")						
							.trigger('change');
						if (field.FLD_choiceList)
						{
							$('#choiceList > input')
								.val(field.FLD_choiceList);
						}
						if (field.FLD_minimum)
						{
							$('#minimum > input')
								.val(field.FLD_minimum);
						}
						if (field.FLD_maximum)
						{
							$('#maximum > input')
								.val(field.FLD_maximum);
						}
						if (field.FLD_length)
						{
							$('#length > input')
								.val(field.FLD_length);
						}
						if (field.FLD_fileType)
						{
							$('#fileType > input')
								.val(field.FLD_fileType);
						}
						$('#nomChamp > input')
							.focus();
					}
				);
	}
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

function addField()
{
	currentFieldId = undefined;
	$('body')
		.append('<div class="voile"></div><div class="alertBox"></div>');
	$('.alertBox')
		.load(
			'addNewField.html',
			function (e)
			{
				$('.addNewField')
				.on (
					'change',
					'input, select',
					e =>  	{
							checkNewFieldInput();
						}
				    );
				$("#typeChamp > select")
					.on	('change', prepareFieldDetails);
			}
		     );
}

function checkNewFieldInput()
{
	var fieldName = $('#nomChamp > input').val();
	var labelName = $('#labelChamp > input').val();
	var option = $('#typeChamp > select').val().toLowerCase();
	$('button[data-cmd="acceptNewField"]')
	  .prop('disabled', option == "" || fieldName == "" || labelName == "");
}

function prepareFieldDetails(e)
{
	var option = $('#typeChamp > select').val().toLowerCase();
	$('.fieldInformations')
		.empty();
	if (option != '' && informationsAddons[option])
	{
		$('.fieldInformations')
			.append(informationsAddons[option].html);
	}
}

function cancelNewField()
{
	$('.voile, .alertBox')
		.remove();
}

function acceptNewField()
{
	var fieldData = {};
	fieldData.FLD_id = currentFieldId;
	fieldData.name = $('#nomChamp > input').val();
	fieldData.label = $('#labelChamp > input').val();
	fieldData.description = $('#descriptionChamp > textarea').val();
	fieldData.type = $('#typeChamp > select').val().toLowerCase();
	$('.fieldInformations fieldset')
		.each	((i, e) => 	{
				var addonName;
				addonName = $(e).attr('id');
				fieldData[addonName] = $(e).find('input').val();
					}
			);
	$.post	(
			'php/setData.php',
			{
				domain: 'admin',
				command: 'saveField',
				record: currentCollectionId,
				fieldValue: JSON.stringify(fieldData)
			},
			serverResult => {
						var result = JSON.parse(serverResult);
						if (result.error < 0)
						{
							notifyUser('error', result.errorMessage);
						}
						else
						{
 							notifyUser('success', 'Les données ont été enregistrées.');
							if (!currentFieldId)
							{
								currentCollection.dataFields.push	(
																		{
																			FLD_id: result.data,
																			FLD_name: fieldData.name, 
																			FLD_label: fieldData.label, 
																			FLD_type: fieldData.type, 
																			FLD_description: fieldData.description, 
																			FLD_minimum: fieldData.minimum, 
																			FLD_maximum: fieldData.maximum, 
																			FLD_length: fieldData.length,
																			FLD_fileType: fieldData.fileType,
												 							FLD_choiceList: fieldData.choiceList
																		}
																	);
						 	}
							else
							{
								var theField = currentCollection.dataFields.find 	(
																						e => 	{
																						 		return e.FLD_id == currentFieldId;
																							}
																					);
								theField.FLD_name = fieldData.name, 
								theField.FLD_label = fieldData.label, 
								theField.FLD_type = fieldData.type, 
								theField.FLD_description = fieldData.description, 
								theField.FLD_minimum = fieldData.minimum, 
								theField.FLD_maximum = fieldData.maximum, 
								theField.FLD_length = fieldData.length,
								theField.FLD_fileType = fieldData.fileType,
								theField.FLD_choiceList = fieldData.choiceList
							}
							cancelNewField();
							drawCollectionFields();
						}
					}
	);
}

function drawCollectionFields()
{
	$('.fieldList .fieldLine')
		.remove();
	currentCollection
		.dataFields
		.forEach(
				(e, i) => 	{
								var line = $('<div class="fieldLine" draggable="true" data-id="' + e.FLD_id + '"><label class="fieldColumn columnName">' + e.FLD_name + '</label><label class="fieldColumn columnLabel">' + e.FLD_label + '</label><label class="fieldColumn columnType">' + e.FLD_type + '</label><label class="fieldColumn columnLength">' + ((e.FLD_length == null) ? 0 : e.FLD_length) + '</label><label class="fieldColumn columnMinimum">' + ((e.FLD_minimum == null) ? 0 : e.FLD_minimum) + '</label><label class="fieldColumn columnMaximum">' + ((e.FLD_maximum == null) ? 0 : e.FLD_maximum)+ '</label></div>');
								line
									.data('collectionField', e);
								$('.fieldList')
									.append(line);
								if (e.FLD_geometry)
								{
									appendField(e);
								}
							}
			);
}

function saveFieldProperties()
{
	var component = $('.selectedComponent');
	var id = component.attr('data-id');
	var field = currentCollection.dataFields.find(e => {return e.FLD_id == id});
	var geometry = {
				left: component.css('left'),
				top: component.css('top'),
				labelSize: component.find('label:first').width(),
				componentSize: component.width() - component.find('label:first').width(),
				fontWeight: component.find('label:first').css('font-weight'),
				fontStyle: component.find('label:first').css('font-style'),
				textDecoration: component.find('label:first').css('text-decoration'),
				labelDisplay: component.find('label:first').css('display'),
			};
	$.post (
			'php/setData.php?rnd' + Math.random(),
			{
				domain: 'admin',
				command: 'saveFieldGeometry',
				record: id,
				fieldValue: JSON.stringify(geometry)
			},
			serverResult => {
						var result = JSON.parse(serverResult);
						if (result.error < 0)
						{
							notifyUser('error', result.errorMessage);
						}
						else
						{
							field.geometry = geometry;
						}
					}
		);
}

function deleteFieldProperties()
{
	var component = $('.selectedComponent');
	var id = component.attr('data-id');
	var field = currentCollection.dataFields.find(e => {return e.FLD_id == id});
	$.post	(
			'php/setData.php?rnd' + Math.random(),
			{
				domain: 'admin',
				command: 'deleteFieldGeometry',
				record: id
			},
			serverResult => {
						var result = JSON.parse(serverResult);
						if (result.error < 0)
						{
							notifyUser('error', result.errorMessage);
						}
						else
						{
							delete field.geometry;
						}
					}
		);
}
