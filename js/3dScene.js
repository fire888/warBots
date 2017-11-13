/**
|***************************************; 
*  Project        : BotWars 
*  Program name   : Threejs scene 
*  Author         : www.otrisovano.ru
*  Date           : 11.10.2017 
*  Purpose        : check brain   
|***************************************;
*/  
 
/***************************************\
* GAME VARS
\***************************************/
   
var gameStatus = "play"; 
var arrBots = [ ];
var arrEnemies = [];   
var arrBullets = [];
var changeCommands = false;
var botID = null; 
var stepKv;  
  
/***************************************\
*  ROBOT COMMANDS INTERFACE HOOK 
\***************************************/
 
var pInterface = new pannelCommands(document);   
var listCommandsGlobal = ["move forward", "fire", "turn left", "turn right"];

var gamePaused = false;
document.onkeydown = keyPressed;
	
function keyPressed(e){
	keyCode = e.which;
	if (keyCode == 32){
		if (gameStatus == "play" || gameStatus == "end" ){				 
			if ( gamePaused == false){	
				stopPersonCamera();
				
				if ( changeCommands == true ){ 
					r=document.getElementById("redact");
					r.style.marginTop = -500;	
				   
					pInterface.draw( arrBots[botID].listMemory, listCommandsGlobal,  function( val1 ){  
						dd = document.getElementById('mess');
						dd.innerHTML = "press 'Space' for Pause";

						startPersonCamera();
						   		   					   					   
						arrBots[botID].listMemory = val1;						   
						arrBots[botID].startProgram();
						   
						gamePaused = false;	
					});	
				}	 			 
			}	
			 
			if ( gamePaused == true && changeCommands == false ){
				startPersonCamera();				 
			}

			if ( gamePaused == true && changeCommands == true ){
				startPersonCamera();
				pInterface.clearHidePannelMemory(); 				 
			}
			 
			if ( gamePaused == true){
				dd = document.getElementById('mess');
				dd.innerHTML = "press 'Space' for Pause";
				gamePaused = false;	
			}else{
				dd = document.getElementById('mess');
				dd.innerHTML = "press 'Space' for Go";				 
				gamePaused = true;				 
			} 
		}	 			  
	}
} 

/***************************************\
*  CAMERA FUNCTIONS
\***************************************/
  
function startPersonCamera(){
	if (!player)
	{	 
		player = new THREE.FirstPersonControls(camera);
		player.setRotationCamera( playerTargetPosition );
		startAnimationScene();
	}	 
} 
 
function stopPersonCamera(){	
	if(player){	 
		playerTargetPosition = [player.target.x, player.target.y,  player.target.z, player.lat, player.lon, player.phi, player.theta];
		player = null;
	}		   
} 	 
	 
/***************************************\
*  MAKING 3D SCENE
\***************************************/		 

//SCENE VARS	
var camera, scene, renderer, player, playerTargetVals = [], clock;
var INV_MAX_FPS = 0.01, frameDelta = 0;
var myCanvas = document.getElementById('myCanvas');	

//RENDERER
renderer = new THREE.WebGLRenderer({
	canvas: myCanvas, 
	antialias: true
});
	
renderer.setClearColor(0xc9cc9c);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 1;
camera.rotation.y = 1.5;

clock = new THREE.Clock();
player = new THREE.FirstPersonControls(camera);
playerTargetPosition = [player.target.x, player.target.y,  player.target.z, player.lat, player.lon, player.phi, player.theta];
player = null;	
	 
//SCENE
scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xc9cc9c, 0.015);
	
//LIGHTS
var light = new THREE.AmbientLight(0x9b9b9b, 0.8 );
light.position.set(5, 5, 5);
scene.add(light);
var light2 = new THREE.DirectionalLight( 0x828c6d, 0.9 );
scene.add(light2);
light2.position.set(-20,20,5);
	
//FLOOR
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 5, 5);
var floorMaterial = new THREE.MeshPhongMaterial({color:"#c3cabd", shininess: 80});
floorMaterial.map = THREE.ImageUtils.loadTexture("model/floor_dif.jpg");
floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
floorMaterial.map.repeat.set(40,40); 	
floorMaterial.bumpMap = THREE.ImageUtils.loadTexture("model/floor_bump.jpg");
floorMaterial.bumpMap.wrapS = floorMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
floorMaterial.bumpMap.repeat.set(40, 40);	
floorMaterial.specularMap = THREE.ImageUtils.loadTexture("model/floor_spec.jpg");	
var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.receiveShadow = true;
floorMesh.position.x = -300; 
floorMesh.position.y = -2.1;		
floorMesh.rotation.x = -0.5 * Math.PI;
scene.add(floorMesh); 
	
//LOAD MODEL BOT
var loader = new THREE.JSONLoader();
loader.load('model/bot.json', handle_load);	
var mesh;
	
function handle_load(geometry, materials){
		 
	//ANIMATION MESH
	colors = [0xe6e6e6, 0xe6e6e6, 0xe6e6e6, 0xe6e6e6, 0x2e0000];			
	for (var ikX=0; ikX< 4; ikX++  ){
		mesh = geometry;
		mat = materials[0].clone();
		var robot = new BOT(mesh,  mat, ikX, 0, colors[0], "hero" );
        arrBots.push(robot);	 
	}	
		
	for (var ikX=0; ikX< 5; ikX++ ){
	    for (var ikZ=0; ikZ< 5; ikZ++ ){	
			mesh = geometry;
			mat = materials[0].clone();
			var robot = new BOT(mesh,  mat, ikX, ikZ, colors[4], "enemy" );
			arrBots.push(robot);				 			 				            			 
		}
	} 
     
	gameReadyWindow(); 
}	

/***************************************\
* ANIMATION SCENE PER SECOND
\***************************************/ 	  
   
startAnimationScene();
   
function startAnimationScene(){
	  
	requestAnimationFrame(function animate() {
		if (player){
			draw();			  
		}		  
		if (player){			
			frameDelta += clock.getDelta();
			while (frameDelta >= INV_MAX_FPS){				
				player.update(INV_MAX_FPS);						
				frameDelta -= INV_MAX_FPS;
			}
			requestAnimationFrame( animate );
		}				
	});
}
   
function startDeathCamera(){
	  
	requestAnimationFrame(function animate() { 
		draw();
		camera.rotation.y+=0.005; 
		camera.rotation.z+=0.005;
		camera.position.y -=0.001;
		if( camera.position.y > -1){				   
			requestAnimationFrame( animate );
		}  
	});    	
}  
	
function draw() {
	for ( var md= 0; md<arrBots.length; md++){
		if (arrBots[md].mustDie == true){
			mdt = arrBots[md];
			arrBots.splice(md, 1);
			md--;
			mdt.removeAll();
			mdt = null;				 
		}				 
	}	   
	   
	changeCommands = false;	
	for ( var nn= 0; nn<arrBots.length; nn++){
		if (arrBots[nn].mesh){
			if (arrBots[nn].fract == "enemy"){
				if(Math.random()*1000<1){						  
					arrBots[nn].startProgram();						  
				}					   
			}	
			arrBots[nn].updateFrame(arrBots);
		}

		if (arrBots[nn].health>0 && gameStatus == "play"){	
			if ((Math.abs(camera.position.x-arrBots[nn].mesh.position.x)<5)
			&&(Math.abs(camera.position.z-arrBots[nn].mesh.position.z)<5)){ 		       
				if (arrBots[nn].fract == "hero" ){				   
					$("#redact").css("margin-top", "35%");					   
					botID = nn;					 
					changeCommands = true;
				}				   
			}
		}
		if (changeCommands == false){
			r=document.getElementById("redact");
			r.style.marginTop = -500;				
		}					
	}
			
	for ( var nb = 0; nb < arrBullets.length; nb ++ ){
		arrBullets[nb].update();
		for (var ss=0; ss<arrBots.length; ss++ ){
			if (arrBullets[nb].parentBotId != arrBots[ss].id){
				if (arrBots[ss].health > 0){	
					if ( Math.abs(arrBullets[nb].sphere.position.x - arrBots[ss].mesh.position.x) < 3.0 && 
				    Math.abs(arrBullets[nb].sphere.position.z - arrBots[ss].mesh.position.z) < 3.0){
						arrBullets[nb].initExpl();
						arrBots[ss].getHit();						
					}
				}						
			}
			if ( Math.abs(arrBullets[nb].sphere.position.x - camera.position.x) < 3.0 && 
			Math.abs(arrBullets[nb].sphere.position.z - camera.position.z) < 3.0){
				if (gameStatus == "play" &&  changeCommands == false){	 
					playerDeath();
					gameStatus = "end";					   
				}
			}				
		}
		if (arrBullets[nb].mustDie == true ){
			md = arrBullets[nb];
			arrBullets.splice(nb, 1);
			md = null;
			nb --;
		}				
	}
		
	enemiesCount = 0;
	playerBotsCount = 0;
	for (va = 0; va< arrBots.length; va++){
		if (arrBots[va].fract == "enemy" ){
			enemiesCount ++;	
		}
		if (arrBots[va].fract == "hero" ){
			playerBotsCount ++;	
		}			
	}	
		
	if (gameStatus == "play"){	
		if (enemiesCount == 0 ){	   
			endUi("Victory !!!"); //end 3d game	
			gameStatus = "end"; 			   
		}	
		if (playerBotsCount == 0 ){	   
			endUi("Fail ..."); //end 3d game	
			gameStatus = "end"; 			  
		}
	}			
	renderer.render(scene, camera);		
} 
	