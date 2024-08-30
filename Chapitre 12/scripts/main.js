var balls = [];
var playfieldWidth, playfieldHeight;
var gameRefresh;
var ballSize;
var curLevel;
var bricks = []; 
var racket;

$(document).ready(init);

function init()
{
	curLevel = 0;
    playfieldWidth = $('.playfield').width();
    playfieldHeight = $('.playfield').height();
	drawPlayfield();
	gameRefresh = setInterval(drawBalls, 10);
	$(window).on('mousemove', drawRacket);
	racket = {width: $('.racket').width(), top: $('.racket').offset().top - $('.playfield').offset().top};
}

function addBall()
{
	if( balls.length < 10)
	{
		$('.playfield').prepend('<div class="ball" data-id="' + balls.length + '"></div>');
        ballSize = $('.ball:first').width();
		balls.push 	(
						{
							id: balls.length, 
							left: Math.random() * (playfieldWidth - ballSize), 
							top: ($('.brickLine').length * 34) + ballSize, 
							hSpeed: 2, 
							vSpeed: 2
						}
					);
	}
}

function drawRacket(e)
{
	racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, e.offsetX));
	$('.racket').css ('left', racket.left + 'px');
}


function drawBalls()
{

	balls.forEach (function (e)
                   {
						if (e.left > playfieldWidth - ballSize)
						{
							e.hSpeed = -e.hSpeed;
						}
						if (e.top > playfieldHeight - ballSize)
						{
							e.vSpeed = -e.vSpeed;
						}
				       	e.left += e.hSpeed;
						e.top += e.vSpeed;
                        var nearBricks = bricks.filter(function (f)
 						   {
 							return f.top + 34 > e.top && f.left <= e.left && f.left + 100 >= e.left + ballSize;
						   });
 				if (nearBricks.length > 0)
 				{
 				    $('.brick[data-id="' + nearBricks[0].id + '"]').remove();
 				    bricks.splice(bricks.indexOf(nearBricks[0]), 1);
				    e.vSpeed = -e.vSpeed;
 				}
				if (e.left < 0)
				{
					e.hSpeed = -e.hSpeed;
				}
				if (e.top < 0)
				{
					e.vSpeed = -e.vSpeed;
				}
				if (e.left > playfieldWidth)
				{
					e.hSpeed = -e.hSpeed;
				}
				if (e.top > playfieldHeight)
				{
					e.vSpeed = -e.vSpeed;
				}
				if (e.top > racket.top)
				{
					$('.ball[data-id="' + e.id + '"]').remove();
					balls.splice(balls.indexOf(e), 1);
				}
				if (e.top + ballSize >= racket.top)
				{
					if (e.left >= racket.left && e.left <= racket.left + racket.width - ballSize)
					{
						e.vSpeed = -e.vSpeed;
					}
				}
 	 	       $('.ball[data-id="' + e.id + '"]').css({
						left: e.left + 'px',
						top: e.top + 'px'
				});
	   });
}

function drawPlayfield()
{
	showCurrentLevel();
	levels[curLevel].forEach(function (e, i)
                             {
								  var line = $('<div class="brickLine"></div>');
			          				  e.forEach (function (f, j)
			                                       {
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
			                           	addBall();
									}
							     });
				   });
}

function showCurrentLevel()
{
 	$('.lblCurrentLevel')
 		.text('Niveau ' + (curLevel + 1))
 		.fadeOut(3000);
}
