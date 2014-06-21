/*Left-Right*/

var STARS = 200;
var FAR = 4000;
var SAFE = 50;
var PHASELEN = 10000;
var NPHASES = 6;

var speed;
var score;
var phase;
var toNextPhase;
var nextFrame;
var nextP;
var hiscore;
var maxSpeed;
var niveles=1; //nuevo elemento


var cr,cg,cb;

var options = {"opt_invincible":1 , "opt_swirlonly":0 }; // For debugging purposes MODO DE PRUEBA

var lives;
var collision;

var interval,hintsTimer;
var tmp;
var fullscreen=false;

var gumSupported = false;
var cameraEnabled = false;
var messages;
var messageNow = 0;

var container;
var camera, scene, renderer;

var particles, particle, count = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var c1,c2;
var bdy = document.getElementById("body");

var animType;


function handleKey(event) {
	if (event.keyCode == 27) {
		
		interval=window.clearInterval(interval);
		gameOver();					
		
		if (event.preventDefault) event.preventDefault();
		if (event.stopPropagation) event.stopPropagation();				
	}
	
	/*Frenar con la barra espaciadora durante el juego*/
	if (event.keyCode == 32) {
		event.preventDefault();
		speed = 2;
		score=score-1;
	}
}			

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, FAR - 250 );
camera.position.z = FAR;

scene = new THREE.Scene();

scene.add(camera);

init();

reset();
titleScreen();
//start();

function html(id,txt) {
	var o = document.getElementById(id);
	o.innerHTML = txt;
}

function show(id) {
	var o = document.getElementById(id);
	o.style.display='block';
}

function hide(id) {
	var o = document.getElementById(id);
	o.style.display='none';
}


/*Aqui estan las propiedades de todo lo que se muestra
en la pantalla de inicio */
function titleScreen() {
	hiscore = localStorage.getItem("hiscore");
	if ( hiscore == 0 || hiscore == undefined || hiscore == null ) hiscore = 0;
	
	html("hiscore","hi-score<br>"+hiscore);
	show("start");
	show("atras");
	hide("hiscore");
	show("title");
	show("subtitle");
	show("info");
	show("lives");
	hide("credit");
	hide("puntos");
	hide("nivel");

	if (interval != undefined) interval=window.clearInterval(interval);
	if (hintsTimer != undefined) hintsTimer=window.clearInterval(hintsTimer);
	
	animType = "demo";
	
	if (gumSupported) {
	  hintsTimer = setInterval(showHints, 4000);
	}
}

function animate() {
  if (animType == "loop") {
	loop();
  } else if (animType == "demo") {
	demo();
  }
  
  requestAnimationFrame( animate );//Si quito esta linea elimino todas las animaciones
}
/*Aqui estan las propiedades de todo lo que se muestra
en la pantalla de juego */
function start() {
	hide("start");
	hide("atras");
	hide("hiscore");
	show("info");
	hide("credit");
	show("lives");
	hide("puntos");
	show("nivel");
	show("subtitle");
	show("niveles");
    

	
	if (interval != undefined) interval=window.clearInterval(interval);
	if (hintsTimer != undefined) hintsTimer=window.clearInterval(hintsTimer);
	
	reset();
	updateLives();

	//updateNiveles();
	
	maxSpeed = 15;
	
	initPhase( 1 );
	
	animType = "loop";
	
}
/*Aqui estan las propiedades de todo lo que se muestra
en la pantalla del juego cuando se pierde lo que cambia
del boton*/
function gameOver() {
	var startext = [];
	startext[0] = "Jugar";
	startext[1] = "Prueba Otra Vez";
	startext[2] = "Vamos Una Vez Mas";
	startext[3] = "De Nuevo";
	startext[4] = "Jugar";
	bdy.style.backgroundColor = '#000000';
	
	html("start",startext[ Math.floor(Math.random() * startext.length) ]);
	
	show("start");
	hide("score");
	hide("niveles");


	
	hiscore = localStorage.getItem("hiscore");
	if ( hiscore == 0 || hiscore == undefined || hiscore == null ) hiscore = 0;
	
	if ( hiscore < score && options.opt_invincible == 0 ) {
		hiscore = score;
		localStorage.setItem("hiscore", hiscore);
	}
	
	titleScreen();
	hide("hiscore");
	show("subtitle");
}

function initPhase( ph ) {
	phase = ph;
	toNextPhase = 3000 + Math.random() * PHASELEN;
	
	if ( options.opt_swirlonly == 1 ) phase = 3;
	
	switch ( phase ) {

		case 0:
			break;
	
		case 1:
			break;
			
		case 2:
			c1 = Math.random() * 6.28;
			if ( Math.random() > 0.5 )
				c2 = Math.random() * 0.005;
			else
				c2 = 0;
			break;								
			
		case 3:
			c1=Math.random()*500 + 10;
			c2=Math.random()*20 + 1;
			break;
			
		case 4:
			c1 = Math.random()*500 + 10;
			c2 = c1/2;
			break;									

		case 5:
			c1 = Math.random()*10 + 5;
			c2 = Math.random()*10 + 5;
			break;
			
	}
	
}

/*Aqui se escriben las vidas en la pantalla de juego*/
function updateLives() {
	var out = "";
	for ( var i = 0; i<lives ; i++ ) out += "❤";
	html("lives",out);
}

function updateNiveles() {
	var aumento=100000000000000000;
	if (score>aumento){
		niveles++,
		aumentos=aumentos+100;
	}
}

/*Aqui se resetean todos los valores al iniciar el jugo*/
function reset() {
	speed = 5;
	score = 0;
	phase = 4;
	nextFrame = 0;
	nextP = 0;			
	lives = 3;
	collision = 0;	
	niveles=1;		

	for ( var i = 0; i < STARS; i ++ ) {
		particle = particles[ i ];
		particle.position.x = (i % 2) * 1200 - 600;
		particle.position.y = -300;
		particle.position.z = i * ( FAR / STARS ) ;
		particle.scale.x = particle.scale.y = 17;
	}
}
/*Aqui es donde se dibujan las particulas*/			
function particleRender(context) {
	context.strokeStyle = "#FFD700";
	context.fillStyle = "#00008B";
	context.beginPath();
	context.arc(0,0,0.4,0,Math.PI*2,true);
	context.stroke();
	context.fill();
};
			
function init() {
	resetFont();
	
	particles = new Array();

	for ( var i = 0; i < STARS; i ++ ) {
		particle = particles[ i ] = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0xffffff, program: particleRender } ) );
		scene.add( particle );
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement );
	
	window.addEventListener('resize', onWindowResize, false );
	window.addEventListener('keypress', handleKey, true)	;
	
	animType = "demo";
	animate();
	
}

function resetFont() {
	var wh = window.innerHeight / 17;
	bdy.style.fontSize = wh+'px';
}

function onWindowResize(){
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;			
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	resetFont();
	
	fullscreen = ( window.innerWidth == window.outerWidth )
	
}

function loop() {

	camera.position.x += ( (mouseX/windowHalfX)*700 - camera.position.x ) * .08;
	camera.position.y += ( -(mouseY/windowHalfY)*600 - camera.position.y ) * .08;

	loopSpeed = speed;
	
	if ( speed <= 50 ) {
		cr = cg = cb = ((speed/30)*0.7)+0.1;
	} else if ( speed > 30 ) {
		cr = 1;
		cg = (40-speed)/20;
		cb = (40-speed)/20;//aqui
	}
	
	for ( var i = 0; i < STARS; i ++ ) {
		particle = particles[ i ];
		particle.position.z += loopSpeed;
		
		//AQUI PASA ALGO//var color = particles[ i ].materials[ 0 ].color;
		var color = particles[ i ].material.color;
		
			color.r = (particle.position.z / FAR ) * cr;
			color.g = (particle.position.z / FAR ) * cg;
			color.b = (particle.position.z / FAR ) * cb;
		
		if (particle.position.z > FAR) {
			particle.position.z -= FAR;
			
			nextFrame ++;
			
			switch ( phase ) {
				case 1:
					if ( Math.random() < 0.95 ) {
						particle.position.x = Math.random() * 3000 - 1500;//Aqui se crean las particulas, el radio
						particle.position.y = Math.random() * 3000 - 1500;
					} else {
						particle.position.x = camera.position.x + Math.random() * 4000;
						particle.position.y = camera.position.y + Math.random() * 4000;
					}
					break;
					
				case 2:
					tmp = Math.random() * 3000 - 1500;
					particle.position.x = camera.position.x + Math.cos(c1)*tmp;
					particle.position.y = camera.position.y + Math.sin(c1)*tmp;
					c1 += c2;
					break;								
					
				case 3:
					particle.position.x = camera.position.x + c1 * Math.cos(nextFrame/c2);
					particle.position.y = camera.position.y + c1 * Math.sin(nextFrame/c2);
					break;
					
				case 4:
					particle.position.x = camera.position.x + Math.random() * c1 - c2;
					particle.position.y = camera.position.y + Math.random() * c1 - c2;
					break;									

				case 5:
					particle.position.x = 1000 * Math.cos(nextFrame/c1);
					particle.position.y = 1000 * Math.sin(nextFrame/c2);
					break;

					
			}
			
		}
/*AQUI SE MANEJAN LAS COLICIONES*/
		if ( options.opt_invincible == 0 ) {
			if ( Math.abs( particle.position.x-camera.position.x) < SAFE && Math.abs( particle.position.y-camera.position.y) < SAFE && Math.abs( particle.position.z-camera.position.z) < SAFE ) {
				if ( collision < 0 ) {
					lives --;
					updateLives();
					score=score-2;
				}
				speed = -1.5;
				collision = 70;
			}
		}
		
	}
	
	speed += 0.01;
	maxSpeed = Math.min(maxSpeed + 0.0008 , 150 );
	
	if ( speed > maxSpeed ) {
		speed = maxSpeed;
	}

	score += (Math.round(speed/4000)+1);// AQUI DE ACTUALIZA EL PUNTAJE EN LA PANTALLA DE JUEGO
	updateNiveles();
	

	drawIdent(canvasCtx, score);
	html("niveles",niveles);//AQUI SE MUESTRAN LOS NIVELES EN LA PANTALLA DE JUAGO


				
	toNextPhase -= Math.floor(speed);
	if ( toNextPhase < 0 ) {
		initPhase( Math.floor( Math.random() * NPHASES )+1 );
	}
	
	collision --;
	if ( collision > 0 ) {
		tmp = Math.floor( Math.random()*collision*5);
		bdy.style.backgroundColor = 'rgb('+tmp+','+Math.floor( tmp/2 )+',0)';
	} else {
		bdy.style.backgroundColor = '#000000';// AQUI CAMBIAMOS EL COLOR DEL JUEGO
	}

	//html("score",score); //AQUI SE MUESTRA EL PUNTAJE EN LA PANTALLA DE JUEGO
	//html("niveles",niveles);//AQUI SE MUESTRAN LOS NIVELES EN LA PANTALLA DE JUAGO
	
	renderer.render( scene, camera );
//AQUI ES DONDE SE CONFIRMA QUE PERDIO Y PASA A LA PANTALLA GAMEOVER
	if ( collision < 0 && lives <=0 ) {
		interval=window.clearInterval(interval);
		gameOver();
	}					
	
}

function demo() {
	
	for ( var i = 0; i < STARS; i ++ ) {
		particle = particles[ i ];
		particle.position.z += 0.1;
		
		//var color = particles[ i ].materials[ 0 ].color;
		var color = particles[ i ].material.color;
		if ( Math.abs(i - collision) < 10 ) {
				color.r = (particle.position.z / FAR);
				color.g = color.b = 0;							
		} else {
			color.r = color.g = color.b = (particle.position.z / FAR * 0.33);
		}
	}
	
	collision ++;
	if ( collision >= STARS ) collision = 0;
	
	renderer.render( scene, camera );

}
/*AQUI SE CAMBIAN LOS MENSAJES DE LA INFORMACION*/
function showHints() {
	
	html("info",messages[messageNow]);
	
	messageNow++;
	if ( messageNow >= messages.length ) messageNow = 0;
}

//SEGUIMIENTO FACIAL-------------------------------------------------------------------------/
		
// First, we need a video element (EN PRIMER LUGAR NECESITAMOS UN ELEMENTO DE VIDEO)
var videoInput = document.createElement('video');
videoInput.setAttribute('loop','true');
videoInput.setAttribute('autoplay','true');
videoInput.setAttribute('width','320');
videoInput.setAttribute('height','240');
document.body.appendChild(videoInput);

// messaging stuff (COSAS DE MENSAJERIA)
//MENSAJES QUE SALEN MIENTRAS DETECTA LA CAMARA

function gUMnCamera() {
  gumSupported = true;
  cameraEnabled = true;
  
  messages = [
    "Detectando Rostro",
    "Por Favor Espere"
  ];
  
  showHints();
  hintsTimer = setInterval(showHints, 3000);
}

function noGUM() {
  // add messaging
  //MENSAJES DE CUANDO NO CONSIGUE LA CAMARA
  messages = [
    "Tu navegador no soporta getUserMedia"
  ];
  
  showHints();
  hintsTimer = setInterval(showHints, 3000);
}

function noCamera() {
  // change messaging
  // MENSAJES CUANDO LA CAMARA NO FUNCIONA
  messages = [
    "La camara no funciona"
  ];

  gumSupported = true;
  showHints();
  hintsTimer = setInterval(showHints, 3000);
}

function enableStart() {
  document.getElementById('but').className = '';
  
  // change button to display "start" 
  //EL BOTON DONDE SALEN LOS MENSAJES CAMBIAN PARA COLOCAR INICIO
  document.getElementById('start').innerHTML = "Jugar";
  
  // add eventlistener to button
  //AÑADE EL BOTON A LA LISTA DE EVENTOS
  document.getElementById('start').addEventListener('click',start, true);
  
  if (cameraEnabled) {
    messages = ["Rostro Detectado!"];
    messageNow = 0;
    document.getElementById('info').innerHTML = "Rostro Detectado!";
  }
}
//ESTADO DE LA DETECCTION DE ROSTROS
document.addEventListener('headtrackrStatus', function(e) {
  switch(e.status) {
    case 'camera found':
      gUMnCamera();
      break;
    case 'no getUserMedia':
      noGUM();
      break;
    case 'no camera':
      noCamera();
      break;
    case 'found':
      enableStart();
      break;
  }
}, false);

// Face detection setup
//INICIO DE LA DETECCION DEL ROSTRO

var canvasInput = document.createElement('canvas'); // compare //COMPARA

var htracker = new headtrackr.Tracker({altVideo : {"ogv" : "/media/facekat/nocamfallback.ogv", "mp4" : "/media/facekat/nocamfallback.mp4"}, smoothing : false, fadeVideo : true, ui : false});
htracker.init(videoInput, canvasInput);
htracker.start();
/*Aqui cambio la posicion del cursor que sigue la cara*/
canvasInput = document.createElement('canvas'); // ident
canvasInput.setAttribute('width','100');
canvasInput.setAttribute('height','600');
document.body.appendChild(canvasInput);
canvasInput.style.position = 'absolute';
canvasInput.style.top = '120px';
canvasInput.style.left = '-3%';
canvasInput.style.zIndex = '1002';
canvasInput.style.display = 'block';
var canvasCtx = canvasInput.getContext('2d');
//canvasCtx.strokeStyle = "#999";
//canvasCtx.lineWidth = 0;

/*Esta funcion dibuja la nave*/
var drawIdent = function(cContext,y) {

	// normalise values
	x = (canvasInput.width/2)-9;
    if (y<3380) {
    	y1 = 600 - (y/5);
  	}else{
    	niveles++;
    	html('subirnivel', '<img src="logro.jpg">')
    	
    	setTimeout(function() { html('subirnivel', ''); }, 6000);

    	speed=-1;
    	score = -310;

    if (niveles=3){
		html('finaljuego', '<img src="nave2.png">');
		setTimeout(function() { html('finaljuego', ''); }, 6000);
		setTimeout(function() { gameOver(); }, 3000);
		html('finaljuego', '<img src="nave2.png">');
		setTimeout(function() { html('finaljuego', ''); }, 3000);
		

	}

  }

	// clean canvas
	cContext.clearRect(0,0,canvasInput.width,canvasInput.height);

	// draw rectangle around canvas
	cContext.strokeRect(0,0,canvasInput.width,canvasInput.height);

	// draw marker, from x,y position

	cContext.drawImage(nave,x,y1,60,80); //Imagen, X, Y, ANCHO, ALTO
};

document.addEventListener("facetrackingEvent", function(e) {
	//drawIdent(canvasCtx, e.x, e.y);
}, false);

document.addEventListener("headtrackingEvent", function(e) {
	mouseX = e.x*50;
	mouseY = -e.y*50;
}, false);

