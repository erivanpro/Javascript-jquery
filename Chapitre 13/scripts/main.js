var balls = [];
var playfieldWidth, playfieldHeight;
var gameRefresh;
var ballSize;
var curLevel;
var realLevel;
var bricks = []; 
var racket;
var playerScore = 0;
var bestScore = 0;
var colorArray = ["green", "yellow", "red", "blue"];
var racketNumber = 3;
var inversionMode = false;
var protectMode = false;

$(document).ready(init);

function init()
{
	curLevel = 0;
	realLevel = 0;
    playfieldWidth = $('.playfield').width();
    playfieldHeight = $('.playfield').height();
	drawPlayfield();
	$(window).on('mousemove', drawRacket);
	racket = {width: $('.racket').width(), top: $('.racket').offset().top - $('.playfield').offset().top};
	showPlayerScore();
	showRemainingLifes();
	bestScore = localStorage.getItem('CB_bestScore') || 0;
 	$('.lblBestScore').text('Meilleur score : ' + bestScore);
}

function addBall()
{
	var idBall = createId();
	if( balls.length < 10)
	{
		$('.playfield').prepend('<div class="ball" data-id="' + idBall + '"></div>');
        ballSize = $('.ball:first').width();
		balls.push 	(
						{
							id: idBall, 
							left: Math.random() * (playfieldWidth - ballSize), 
							top: ($('.brickLine').length * 34) + ballSize, 
							isSuperBall: false,
							hSpeed: Math.random() > .5 ? 2 : -2, 
							vSpeed: 2
						}
					);
	}
}

function drawRacket(e)
{
	if (gameRefresh != undefined)
	{
		racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, inversionMode ? playfieldWidth - e.offsetX : e.offsetX));
		$('.racket').css ('left', racket.left + 'px');
	}
}

function getNearBricks(e)
{
	e.newDirection = undefined;
	return 	bricks
				.filter (
							function (f)
							{
								if 	(
										e.vSpeed < 0 && f.top + 30 > e.top && f.top < e.top &&
										(
											f.left <= e.left && f.left + 100 >= e.left + ballSize
										)
									)
								{
									e.newDirection = 	{
															hSpeed: e.hSpeed,
															vSpeed: -e.vSpeed
														};
								}
								else if (
											e.vSpeed > 0 && e.top > f.top && e.top < f.top + 30 && 
											(
												f.left <= e.left && f.left + 100 >= e.left + ballSize
											)
										)
								{
									e.newDirection = 	{
															hSpeed: e.hSpeed,
															vSpeed: -e.vSpeed
														};
								}
								else if (
											e.hSpeed > 0 && e.left > f.left && e.left < f.left + 100 && 
											(
												f.top <= e.top && f.top + 30 >= e.top + ballSize
											)
										)
								{
									e.newDirection = 	{
															hSpeed: -e.hSpeed,
															vSpeed: e.vSpeed
														};
								}
								else if (
											e.hSpeed < 0 && e.left < f.left && e.left > f.left + 100 && 
											(
												f.top <= e.top && f.top + 30 >= e.top + ballSize
											)
										)
								{
									e.newDirection = 	{
															hSpeed: -e.hSpeed,
															vSpeed: e.vSpeed
														};
								}
								return e.newDirection != undefined;
							}
						);
}

function checkBorders(e)
{
	if (e.left < 0)
	{
		e.hSpeed = -e.hSpeed;
	}
	if (e.top < 0)
	{
		e.vSpeed = -e.vSpeed;
	}
	if (e.left > playfieldWidth - ballSize)
	{
		e.hSpeed = -e.hSpeed;
	}
	if (e.top > playfieldHeight - ballSize)
	{
		e.vSpeed = -e.vSpeed;
	}
}

function looseBall(e)
{
	$('.ball[data-id="' + e.id + '"]').remove();
	balls.splice(balls.indexOf(e), 1);
	if (balls.length == 0)
	{
		if (racketNumber > 0)
		{
			racketNumber--;
			$('.racket')
		 		.fadeOut 	(
								500, 
								function ()
								{
									$(this).show();
								}
							);
			if (racketNumber > 0)
		 	{
				showRemainingLifes();
				setTimeout	(
								addBall,
								2500
							);
			}
			else
			{
				showGameOver();
			}
		}
	}
}

function checkRacket(e)
{
	if (e.top > racket.top)
	{
		if (protectMode)
		{
			e.vSpeed = -e.vSpeed;
			manageProtectMode('Off');
		}
		else
		{
			looseBall(e);
		}
	}
	if (e.top + ballSize >= racket.top)
	{
		if (e.left >= racket.left && e.left <= racket.left + racket.width - ballSize)
		{
			e.vSpeed = -e.vSpeed;
		}
	}
}

function drawBalls()
{
	balls
		.forEach 	(
						function (e)
                   		{
                   			var nearBricks;
                   			moveBall(e);
	                        nearBricks = getNearBricks(e);
 							touchBrick(e, nearBricks);
			 				checkBorders(e);
			 				checkRacket(e);
		   				}
		   			);
}

function moveBall(e)
{
   	e.left += e.hSpeed;
	e.top += e.vSpeed;
   	$('.ball[data-id="' + e.id + '"]')
   		.css 	(
					{
						left: e.left + 'px',
						top: e.top + 'px'
					}
				);
}

function drawPlayfield()
{
	showCurrentLevel();
	levels[curLevel].forEach(function (e, i)
                             {
								  var line = $('<div class="brickLine"></div>');
			          				  e.forEach (function (f, j)
			                                       {
			                                       	if (f == '') return;
			                                        bricks.push ({
			                                                   		id: i + '-' + j, 
			                                      		    	 	top: i * 34,										     
			                                      		     		left: j * 104
			                                                     }) ;
			                                        line.append('<div class="brick ' + f + 'Brick" data-id="' + i + '-' + j + '"></div>');
			   						   });
			    			         $('.playfield').prepend(line);
					         }
 				      );
	bricks.forEach(function (e, i)
					  {
					     $('.brick[data-id="' + e.id + '"]')
		                          .animate(
								{
								   top: e.top + 'px'
								},
								500
							     );
						}
					);
	bricks.forEach(function (e, i)
					  {
						$('.brick[data-id="' + e.id + '"]')
					          .animate(
								{
								    left: e.left + 'px'
								},
								1000,
								function ()
								{
								   	if (i == bricks.length - 1)
								    {
								    	if (gameRefresh == undefined)
								    	{
			                           		showGamePanel();	
			                           	}
			                           	else
			                           	{
			                           		addBall();
			                           	}
									}
							     });
				   });
}

function showCurrentLevel()
{
 	$('.lblCurrentLevel')
 		.text('Niveau ' + (realLevel + 1))
 		.css('opacity', 1)
 		.animate(
 					{
 						opacity: 0,
 					},
 					3000
 				);
}

function gameMessage(title, messageText, messageButton, buttonFunction, logo)
{
	$('body').append('<div class="messageBox">' + (logo != undefined ? '<img class="logo" src="' + logo + '">' : '') + '<label class="lblMessageTitle">' + title + '</label><label class="lblMessage">' + messageText + '</label><button class="btnMessage">' + messageButton + '</button></div>');
	$('.btnMessage').on ('click', buttonFunction);
}

function showGamePanel()
{
	gameMessage ("Casse-briques", "Petit jeu de raquette simple, minimaliste, servant de support de formation au développement JavaScript et jQuery", "Cliquez pour lancer une partie", startGame, 'styles/images/logo_ENI.png');
}

function cleanMessage()
{
	$('.btnMessage')
		.off ();
	$('.messageBox')
		.remove();
}

function startGame()
{
 	cleanMessage();
	addBall(); 
	gameRefresh = setInterval(drawBalls, 10);
}

function showBrickScore(theBrick, thePoints)
{
 	$('.playfield')
		.append('<label class="lblBrickScore" data-id="' + theBrick.id + '">' + thePoints + '</label>');
	$('.lblBrickScore[data-id="' + theBrick.id + '"]')
		.css(
			{
				top: (theBrick.top + 10) + 'px',
				left: (theBrick.left + 36) + 'px'
			}
		);
	$('.lblBrickScore[data-id="' + theBrick.id + '"]')
		.animate(
				{
					top: (theBrick.top - 20) + 'px',
					opacity: 0
				},
				1000,
				function ()
				{
					$(this).remove();
				}
			);	
}

function showPlayerScore()
{
 	$('.lblPlayerScore').text('Score : ' + playerScore);
}

function cleanLevel()
{
	$('.ball, .brickLine')
		.remove();
	balls = [];
}

function checkForExtra(position)
{
	if (Math.random() > .85)
	{
		var extraId = $('.extra').length + 1;
		$('.playfield')
			.append('<div class="extra" data-id="' + extraId + '">' + chooseExtraType() + '</div>');
		$('.extra[data-id="' + extraId+ '"]')
			.css 	(
						{
							left: (position.left + 50) + 'px',
							top: (position.top + 34) + 'px'
						}
					)
			.animate 	(
							{
								top: '600px'
							},
							{
								duration: 2500,
								easing: 'linear',
								step: function (target, properties)
								{
									controlCapture(this, target, properties);
								},
								complete: function (target, properties)
								{
									$(this)
										.fadeOut(500);
								},
							}
						);
	}
}

function chooseExtraType()
{
	var chance = Math.random();
	var type;
	if (chance < .15)
	{
		type = 'I'; // Inversion du sens de déplacement de la raquette
	}
	else if (chance < .25)
	{
		type = 'A'; // Acceleration de toutes les balles en jeu
	}
	else if (chance < .4)
	{
		type = 'P'; // Un bouclier de protection apparait et permet de sauver une balle
	}
	else if (chance < .5)
	{
		type = 'D'; // Décélération de toutes les balles en jeu
	}
	else if (chance < .65)
	{
		type = 'B'; // Ajouter une balle
	}
	else if (chance < .75)
	{
		type = 'R'; // Réductuion de la taille de la raquette
	}
	else if (chance < .80)
	{
		type = 'N'; // Taille de raquette normale
	}
	else if (chance < .85)
	{
		type = 'E'; // Augmentation de la taille de la raquette
	}
	else if (chance < .95)
	{
		type = 'S'; // Super balle : elle détruit les briques mais ne change pas de direction
	}
	else
	{
		type = 'V'; // Accorder une vie supplémentaire
	}
	return type;
}

function controlCapture(stuff, target, properties)
{
	var actualPos = $(stuff).offset();
	actualPos.top = actualPos.top - $('.playfield').offset().top;
	actualPos.left = actualPos.left - $('.playfield').offset().left;
	if (properties.prop == 'top' && properties.now + ballSize >= racket.top)
	{
		$(stuff).stop();
		if (actualPos.left >= racket.left - ballSize && actualPos.left <= (racket.left + racket.width))
		{
			applyExtra($(stuff).text());
		}
		$(stuff)
			.fadeOut(250, function (e) {$(this).remove();});
	}
}

function applyExtra(extraType)
{
	switch (extraType)
	{
		case "A":
			balls
				.forEach(
							function (e)
							{
								e.hSpeed = e.hSpeed > 0 ? Math.min(5, ++e.hSpeed) : Math.max(-5, --e.hSpeed);
								e.vSpeed = e.vSpeed > 0 ? Math.min(5, ++e.vSpeed) : Math.max(-5, --e.vSpeed);
							}
						);
			break;
		case "B":
			addBall();
			break;
		case "D":
			balls
				.forEach(
							function (e)
							{
								e.hSpeed = e.hSpeed > 0 ? Math.max(1, --e.hSpeed) : Math.min(-1, ++e.hSpeed);
								e.vSpeed = e.vSpeed > 0 ? Math.max(1, --e.vSpeed) : Math.min(-1, ++e.vSpeed);
							}
						);
			break;
		case "E":
			racket.width = 150;
			$('.racket')
				.animate(
							{
								width: '150px'
							},
							500
						);
			break;
		case "I":
			inversionMode = true;
			break;
		case "N":
			inversionMode = false;
			manageProtectMode("Off");
			racket.width = 100;
			$('.racket')
				.animate(
							{
								width: '100px'
							},
							500
						);
			balls
				.forEach(
							function (e)
							{
								e.hSpeed = 2;
								e.vSpeed = 2;
								e.isSuperBall = false;
							}
						);
			$('.ball')
				.removeClass('superball');
			break;
		case "P":
			manageProtectMode("On");
			break;
		case "R":
			racket.width = 50;
			$('.racket')
				.animate(
							{
								width: '50px'
							},
							500
						);
			break;
		case "S":
			balls
				.forEach( 
							function (e)
							{
								e.isSuperBall = true;
							}
						);
			$('.ball')
				.addClass('superball');
			break;
 		case "V":
 			racketNumber++;
 			showRemainingLifes();
 			break;
	}
}

function createId()
{
	var code = "";
	for (var $compteur = 0; $compteur < 8; $compteur++)
	{
		code += String.fromCharCode(65 + Math.random() * 26);
	}
	return code;
}

function showRemainingLifes()
{
	$('.statusBar .life')
		.remove();
	$('.statusBar')
		.append('<div class="life"></div>'.repeat(racketNumber - 1));
}

function manageProtectMode(mode)
{
	if (mode.toLowerCase() == 'on')
	{
		if (!protectMode)
		{
			$('.playfield')
				.append('<div class="ballProtector"></div>');
			protectMode = true;
		}
	}
	if (mode.toLowerCase() == 'off')
	{
		if (protectMode)
		{
			$('.ballProtector')
				.remove();
			protectMode = false;
		}
	}
}

function showGameOver()
{
	var extraMessage = "";
	clearInterval(gameRefresh);
	gameRefresh = undefined;
	if (playerScore > bestScore)
	{
		extraMessage = " Bravo, vous avez battu le meilleur score !";
		localStorage.setItem('CB_bestScore', playerScore);
	}
	gameMessage ("Game Over !!!", "La partie est terminée. Vous avez marqué " + playerScore + ' points.' + extraMessage, "Retourner à l'accueil", restartGame, 'styles/images/logo_ENI.png');
}

function restartGame()
{
	cleanMessage();
	$('.brick, .brickLine')
		.remove();
	$(window)
		.off();
	playerScore = 0;
	racketNumber = 3;
	inversionMode = false;
	manageProtectMode("Off");
	bricks = []; 
	init();
}

function touchBrick(e, nearBricks)
{
	var touchedColor;
	var points;
	var oldScore;
	if (nearBricks.length > 0)
	{
		touchedColor = levels[curLevel][nearBricks[0].id.split('-')[0]][nearBricks[0].id.split('-')[1]];
		points = 500 * (realLevel + 1) * (colorArray.indexOf(touchedColor) + 1);
		oldScore = playerScore;
		points += Math.floor(Math.random() * 250);
		playerScore += points;
		showPlayerScore();
		$('.lblPlayerScore')
		 	.css({top: '-30px', score: oldScore})
		 	.animate(
			 			{top: '0px', score: playerScore}, 
			 			{
			 				duration: 500, 
			 				step: function (e, p)
			 				{
			 					if (p.prop == "score")
			 					{
			 						$(this).text('Score : ' + p.now.toFixed(0));
			 					}
			 				}
			 			}
			 		);
	   	showBrickScore(nearBricks[0], points); 
	    $('.brick[data-id="' + nearBricks[0].id + '"]').remove();
	    bricks.splice(bricks.indexOf(nearBricks[0]), 1);
		if (!e.isSuperBall)
		{
		    if (e.newDirection != undefined)
		    {
		    	e.hSpeed = e.newDirection.hSpeed;
		    	e.vSpeed = e.newDirection.vSpeed;
		    }
		}
	    if (bricks.length == 0)
	    {
	    	cleanLevel();
	    	curLevel++;
	    	realLevel++;
	    	if (curLevel > levels.length - 1)
	    	{
	    		curLevel = 0;
	    	}
	    	drawPlayfield();
	    }
	    else
	    {
			checkForExtra({left: nearBricks[0].left, top: nearBricks[0].top});
	    }
	}
}


