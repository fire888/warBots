/**
|***************************************; 
*  Project        : BotWars 
*  Program name   : Constructor of game Objects 
*  Author         : www.otrisovano.ru
*  Date           : 11.10.2017 
*  Purpose        : check animation    
|***************************************;
*/  

/***************************************\
* CONSTRUCTOR ROBOT
\***************************************/  
  
BOT = function(g, m, kX, kZ, color, fract){ 
         
	// vars
		
	BOT.ID ++;
	this.fract = fract;
	this.health = 20;
	this.study = "none";
				
	this.arrBotArr;
	this.arrFlame = []; 
	this.arrExpl  = [];
	this.arrExplSpd  = [];		
	this.spdYY = 0.01;
		
	var periodCount = 0; 	
	
	if (this.fract == "hero"){ 			
		this.listMemory = [ "move forward","move forward", "fire", "fire", "move forward","move forward", "move forward","move forward", "move forward","move forward",]; 
	}
	if (this.fract == "enemy"){
		this.listMemory = [ "move forward", "move forward","move forward","move forward","move forward","move forward","move forward","move forward","move forward","move forward"]; 			  
	}			
		
	this.currentCommand = 0;	  
	
	this.material = m;
	this.material.morphTargets = true;
	this.material.color.setHex( color );
		
	this.geometry = g;
	  
	this.mesh  = new THREE.Mesh(this.geometry, this.material);
	scene.add(this.mesh);
		
	var plane = new THREE.PlaneGeometry(6, 6, 1,1);
	var mat = new THREE.MeshBasicMaterial();
	mat.map = new THREE.ImageUtils.loadTexture("model/shadow_mask.png");
	mat.shading = THREE.SmoothShading;
	mat.transparent = true;
	mat.depthWrite = false;
	mat.color = new THREE.Color(0x4e594c);			 
	var shadow = new THREE.Mesh(plane, mat);
	shadow.position.set(0, 0, 0);
	shadow.rotation.x = -0.5 * Math.PI;			  
	this.mesh.add(shadow);			
	   
	this.id =  BOT.ID; 

	var stepKv = 7.0;	
		
	this.mesh.position.x =  kX*stepKv + stepKv/2 + stepKv*2;		  		 	
	this.mesh.position.z =  stepKv/2 - 3*stepKv;
		
	if (this.fract == "enemy"){
		this.mesh.rotation.y = 3.2;			
		this.mesh.position.x = stepKv*(Math.floor(Math.random()*10)-5) + kX*stepKv + stepKv/2; 			
		this.mesh.position.z = stepKv*(Math.floor(Math.random()*5)+15) + kZ*stepKv + stepKv/2; 
	}
		
	this.mesh.position.y = -2;
		
	this.posKvadrant = [ Math.floor(Math.floor(this.mesh.position.x/stepKv)+0.05), Math.floor(Math.floor(this.mesh.position.z/stepKv)+0.05)];		
	this.targetKvadrant = [ Math.floor(Math.floor(this.mesh.position.x/stepKv)+0.05), Math.floor(Math.floor(this.mesh.position.z/stepKv)+0.05)];
	this.targetPoint = [];		
	this.spd = Math.random()*0.05+0.03;	
	this.spdX = this.spd;
	this.spdZ = this.spd;		
	this.tgtRot;		
		
	//MIXER
		
	this.delta = 0;
	this.prevTime = Date.now();	
	this.animTimer;		
		
	this.mixer = new THREE.AnimationMixer(this.mesh);
		
	var go1 = [];
	for ( var aa=0; aa<20; aa++ ){
		go1.push(this.geometry.morphTargets[aa]); 
	}
		
		
	var fire1 = [];
	for (aa=21; aa<31; aa++ ){
		fire1.push(this.geometry.morphTargets[aa]); 
	}

	var die1 = [];
	for (aa=32; aa<44; aa++ ){
		die1.push(this.geometry.morphTargets[aa]); 
	}				
         
	var stay1 = [];
	stay1.push(this.geometry.morphTargets[21]);
	stay1.push(this.geometry.morphTargets[21]);

	var telo = [];
	telo.push(this.geometry.morphTargets[44]);
	telo.push(this.geometry.morphTargets[44]);		

	var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('ttt', go1, 5);	
		
	var clipstay = THREE.AnimationClip.CreateFromMorphTargetSequence('ttt', stay1, 0);			
	var clipfire = THREE.AnimationClip.CreateFromMorphTargetSequence('ttt', fire1, 5);
	var clipdie = THREE.AnimationClip.CreateFromMorphTargetSequence('ttt', die1, 5);	
	var cliptelo = THREE.AnimationClip.CreateFromMorphTargetSequence('ttt', telo, 0);
		
	// check command every frame 
	
	this.updateFrame = function(arrBotsVal){	
		this.arrBotArr = arrBotsVal;	

		if (this.currentCommand == this.listMemory.length -1){
			this.mixer.clipAction(clipstay).setDuration(1).play();			   
		}
			
		if (this.listMemory[this.currentCommand] == "move forward"){
			   this.moveForward();	
		}	
			
		if (this.listMemory[this.currentCommand] == "fire")	{
			this.fire();	
		}	

		if (this.listMemory[this.currentCommand] == "turn left"){
			this.turnLeft(); 	 
		} 

		if (this.listMemory[this.currentCommand] == "turn right"){
			this.turnRight(); 	 
		}			

		var time = Date.now();
			
		if (this.listMemory[this.currentCommand] != "fire")	{	
			this.mixer.update((time - this.prevTime) * (this.spd*0.028));
		}else{
			this.mixer.update((time - this.prevTime) * 0.0055);			
		}				
		this.prevTime = time;
			
		if (this.currentCommand == "die"){
			this.die();
		}

		if (this.fract == "enemy"){ 				
			if (this.mesh.position.z < 40){
				if (Math.random()*1000<1){
					this.listMemory = ["turn left",  "fire", "move forward", "turn left",  "turn left", "fire", "move forward" ]; 					   
				}					   
			}
			   
			if (this.mesh.position.z < -20){   
				this.listMemory = ["turn left",  "fire", "move forward", "turn left",  "turn left", "fire", "move forward" ]; 					   					   
			}			   
		}				   
	}
		
	// chek rotation of bot;
		
	this.checkRotationTarget = function(){  
		if (this.mesh.rotation.y == 3.2){			 
			this.spdX = 0;
			this.spdZ = (-1)*this.spd;
			this.targetKvadrant = [ Math.floor(this.mesh.position.x/stepKv), Math.floor(this.mesh.position.z/stepKv)-1];	
			this.targetPoint = [ this.mesh.position.x,  this.mesh.position.z - stepKv ];				 
		}
		if (this.mesh.rotation.y == 0){			  	
			this.spdX = 0;
			this.spdZ = this.spd;				
			this.targetKvadrant = [ Math.floor(Math.floor(this.mesh.position.x/stepKv)+0.05), Math.floor(Math.floor(this.mesh.position.z/stepKv)+0.05)+1];	
			this.targetPoint = [ this.mesh.position.x,  this.mesh.position.z + stepKv ];					
		}				 
		if (this.mesh.rotation.y == 1.6){		 
			this.spdX = this.spd*(1);
			this.spdZ = 0;
			this.targetKvadrant = [ Math.floor(Math.floor(this.mesh.position.x/stepKv)+0.05)+1, Math.floor(Math.floor(this.mesh.position.z/stepKv)+0.05)];	
			this.targetPoint = [ this.mesh.position.x+stepKv,  this.mesh.position.z ];					
		}
		if (this.mesh.rotation.y == 4.8){	 		 
			this.spdX = this.spd*(-1);
			this.spdZ = 0;
			this.targetKvadrant = [ Math.floor(Math.floor(this.mesh.position.x/stepKv)+0.05)-1, Math.floor(Math.floor(this.mesh.position.z/stepKv)+0.05)];
			this.targetPoint = [  this.targetKvadrant[0]*stepKv+stepKv/2,  this.targetKvadrant[1]*stepKv+stepKv/2 ];					
		}
	} 		
				
	//functions making every frame 
		
	this.moveForward = function(){
		if (periodCount == 0 ){	
			this.mixer.clipAction(clip).setDuration(1).play();		  
			this.checkRotationTarget();	  			   	  	  		 
		}	
		this.posKvadrant = [ Math.floor(this.mesh.position.x/stepKv), Math.floor(this.mesh.position.z/stepKv)];			  
		periodCount ++;	
		   
		movetrue = true;    
		for (var nn =0; nn<arrBots.length; nn++ ){
			if (arrBots[nn].id != this.id){
				if ( this.targetKvadrant[0] == arrBots[nn].posKvadrant[0] && this.targetKvadrant[1] == arrBots[nn].posKvadrant[1]){					  
					movetrue = false;
				} 
				if ( this.targetKvadrant[0] == arrBots[nn].targetKvadrant[0] && this.targetKvadrant[1] == arrBots[nn].targetKvadrant[1]){					  
					movetrue = false;
				}				  
			}				  
		}
           		  
		if (movetrue == true){
			this.mesh.position.x += this.spdX;
			this.mesh.position.z += this.spdZ;			  
		}			  
		  			  
		if ( Math.abs(this.mesh.position.x - this.targetPoint[0]) < this.spdX+3 && 
		Math.abs(this.mesh.position.z - this.targetPoint[1]) < this.spdZ+3){		   
			periodCount = 0;
			this.currentCommand ++;
			this.mixer.clipAction(clip).setDuration(1).stop();			  
		}			  
	}
				
	this.fire = function(){			  
		if (periodCount == 0 ){			  
			this.mixer.clipAction(clipfire).setDuration(1).play();
			this.animTimer = setTimeout(this.endFire, 2000)
			periodCount = 0;			 
		}	
		periodCount ++;
		  
		if ( periodCount == 10 || periodCount == 20 || periodCount == 30 ){ 
			this.checkRotationTarget();
			spds = [ this.spdX, this.spdZ];
			bul = new BULLET(this.mesh.position.x, this.mesh.position.z, spds, this.id );
			arrBullets.push(bul);
		}	  
			  
		if (periodCount > 40){
			this.mixer.clipAction(clipfire).setDuration(1).stop();			  
			periodCount = 0;
			this.currentCommand ++;	
			this.targetKvadrant = this.posKvadrant;			
		}			  
	}

	this.turnLeft = function(){
		if (periodCount == 0 ){			   
			this.mixer.clipAction(clip).setDuration(1).play();
			this.tgtRot = this.mesh.rotation.y + 1.6;				 
		}	
		periodCount++
		this.mesh.rotation.y += 0.5*this.spd;
		   
		if (Math.abs(this.mesh.rotation.y-this.tgtRot)<2.0*this.spd)
		{ 			   
			this.mesh.rotation.y = this.tgtRot;
			if(this.mesh.rotation.y > (6.1)){
				this.mesh.rotation.y = 0;				 
			}	
			if(this.mesh.rotation.y< 0.5 ){ 
				this.mesh.rotation.y = 0;			 
			}		
			  
			if (this.mesh.rotation.y < 3.6 && this.mesh.rotation.y  > 2.8 ){
				this.mesh.rotation.y = 3.2;				 
			}				  
			  
			if (this.mesh.rotation.y < 1.9 && this.mesh.rotation.y  > 1.2 ){
				this.mesh.rotation.y = 1.6;				 
			}	 

			if (this.mesh.rotation.y < 5.3 && this.mesh.rotation.y  > 4.0 ){
				this.mesh.rotation.y = 4.8;				  
			}				  
			  
			periodCount = 0;
			this.currentCommand ++;	
			this.mixer.clipAction(clip).setDuration(1).stop();	
			this.targetKvadrant = this.posKvadrant;				  
		}			   
	} 

	this.turnRight = function(){
		if (periodCount == 0 ){			   
			this.mixer.clipAction(clip).setDuration(1).play();
			this.tgtRot = this.mesh.rotation.y - 1.6;				 
		}	
		periodCount++
		this.mesh.rotation.y -= 0.5*this.spd;
		   
		if (Math.abs(this.mesh.rotation.y-this.tgtRot)<2.0*this.spd){ 			      
			this.mesh.rotation.y = this.tgtRot;
			if(this.mesh.rotation.y < 1.0&& this.mesh.rotation.y> -0.4){
				this.mesh.rotation.y = 0;				 
			}			  
			if(this.mesh.rotation.y < -0.5){
				this.mesh.rotation.y = 4.8;				 
			}		
			  
			if (this.mesh.rotation.y < 3.8 && this.mesh.rotation.y  > 2.6 ){
				this.mesh.rotation.y = 3.2;				 
			}			  
			  
			if (this.mesh.rotation.y < 1.95 && this.mesh.rotation.y  > 1.0 ){
				this.mesh.rotation.y = 1.6; 				 
			}	 

			if (this.mesh.rotation.y < 5.3 && this.mesh.rotation.y > 4.0 ){
				this.mesh.rotation.y = 4.8;				  
			}				  
			  
			periodCount = 0;
			this.currentCommand ++;	
			this.mixer.clipAction(clip).setDuration(1).stop();			  
		}				   
	}	

	this.die = function(){
		if ( periodCount == 0){
			this.study == "animDie";	 
			this.mixer.clipAction(clip).setDuration(1).stop();				
			this.mixer.clipAction(clipdie).setDuration(5).play();
			
			var geometry = new THREE.SphereGeometry( 0.1, 5, 5 );
			var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
			this.sphere = new THREE.Mesh( geometry, material );			   
		}
			
		if (periodCount < 40){	
			shadow.position.y +=0.04 
			this.mesh.position.y -=0.04;
		}   
		if (periodCount == 30){	
			this.study == "fire";	 		
			this.mixer.clipAction(clipdie).setDuration(5).stop();				
			this.mixer.clipAction(cliptelo).setDuration(1).play();		   
		}
			
		if (periodCount < 150){
			if (Math.random()*10 < 1){				   
				sp = this.sphere.clone();
				sp.scale.set(Math.random()*4,Math.random()*4,Math.random()*4);				  
				this.arrFlame.push(sp);
				sp.position.set(this.mesh.position.x+Math.random()*3-1.5, 
				this.mesh.position.y+Math.random()*1, 
				this.mesh.position.z+Math.random()*3-1.5);
				scene.add(sp);					 
			}									 
		}

		for (var fl=0; fl< this.arrFlame.length; fl ++){				
			this.arrFlame[fl].position.y += 0.3;
			if ( this.arrFlame[fl].position.y > 2 ){
				if (Math.random()*100<8){	 
					mdfl = this.arrFlame[fl];
					this.arrFlame.splice(fl, 1);
					fl --;
					scene.remove(mdfl);
					mdfl = null;
				}	
			}					
		}

		if (periodCount == 150){
			for (var exdet = 0; exdet< 15; exdet++ ){  
				sp1 = this.sphere.clone();
				sp1.position.set(this.mesh.position.x+Math.random()*3-1.5, 
				this.mesh.position.y, 
				this.mesh.position.z+Math.random()*3-1.5);											
				sp1.scale.set(Math.random()*4,Math.random()*4,Math.random()*4);					  
				this.arrExpl.push(sp1);
				scene.add(this.arrExpl[exdet]);					  
				this.arrExplSpd.push([Math.random()*0.5- 0.25, Math.random()*0.5, Math.random()*0.5-0.25 ]);
			}
			scene.remove(this.mesh);			   
		}		
			
		if ( this.arrExpl.length > 0 ){
			this.study = "expl";				
			for (var e2 = 0; e2< this.arrExpl.length; e2 ++){
				this.arrExpl[e2].position.x += this.arrExplSpd[e2][0];
				this.arrExpl[e2].position.z += this.arrExplSpd[e2][2];
				this.arrExpl[e2].position.y += this.arrExplSpd[e2][1];
				this.arrExplSpd[e2][1] -= this.spdYY;	
                     
				if (this.arrExpl[e2].position.y < -10 ){
					md =  this.arrExpl[e2];
					scene.remove(md);						 
					this.arrExpl.splice(e2, 1);	
					this.arrExplSpd.splice(e2, 1);						 					 
					e2--;
					md = null;					  
				}
			}					 
		}			
						
		if ( this.study == "expl" && this.arrExpl.length == 0 ){	
			this.mustDie = true;		 				
		}
 
		periodCount ++; 	
	}		
		
	//function which call from main code 
	this.startProgram = function(){
		if (this.health > 0 ){				
			periodCount = 0;
			this.currentCommand = 0;
		}			   
	}

	this.getHit = function(){
		this.health -= 1;
		if (this.health == 0){
			this.currentCommand = "die";
			periodCount = 0;
		}				
	}

	// delete all object params	
	this.removeAll = function(){		
		this.arrFlame = null; 
		this.arrExpl  = null;
		this.arrExplSpd  = null;		
		this.spdYY = null;	
				 
		this.fract = null;	
		periodCount = null;					
		this.listMemory = null; 		
		this.currentCommand = null;	  	  
		this.material = null;	
		this.geometry = null;

		this.id =  null;
		stepKv = null;			
		this.posKvadrant = null;		
		this.targetKvadrant = null;
		this.spd = null;		
		this.spdX = null;
		this.spdZ = null;		
		this.tgtRot = null;		
	
		//MIXER
		this.delta = null;
		this.prevTime = null;	
		this.animTimer= null;		

		this.mixer = null;
		go1 = null;		
		fire1 = null
		die1 = null;         
		stay1 = null;
		telo = null;
		clip = null;
		clipstay = null;
		clipdie = null;	
		cliptelo = null;  
		
		this.mesh  = null;					 
	}			
}	
  
BOT.ID = 0;  
  
/***************************************\
*  CONSTRUCTOR BULLETS
\***************************************/
  
BULLET = function( pX, pZ, vec, parentBotId ){
	this.parentBotId = parentBotId;
	this.mustDie = false; 
	var stepKv =  7.0;
	this.study = "bullet";
  
	var geometry = new THREE.SphereGeometry( 0.3, 5, 5 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	this.sphere = new THREE.Mesh( geometry, material );
	this.sphere.position.set(pX, 2.32, pZ);
	scene.add( this.sphere );
	
	this.spdX = vec[0]*10;
	this.spdZ = vec[1]*10;
	this.spdY = 0.1;
	this.spdYY = 0.01;
	
	this.posKvadrant = [ Math.floor(Math.floor(this.sphere.position.x)/stepKv), Math.floor(Math.floor(this.sphere.position.z)/stepKv)];
	this.count = 0;
	this.light = false;
	
	var arrExpl = [];
	var arrExplSpd = [];
	
	this.update = function(){	   
		if (this.study == "bullet"){ 			  
			if (this.sphere.position.y >= -1.8){ 				 
				this.sphere.position.x += this.spdX;
				this.sphere.position.z += this.spdZ;	
				this.sphere.position.y += this.spdY;
				this.spdY -= this.spdYY; 
				this.posKvadrant = [ Math.floor(Math.floor(this.sphere.position.x)/stepKv), Math.floor(Math.floor(this.sphere.position.z)/stepKv)];			  
			}else{ 	
				this.initExpl();
			}
		}
		if (this.study == "expl"){			  
			if ( arrExpl.length > 0 ){
				for (var e1 = 0; e1< arrExpl.length; e1 ++){
					arrExpl[e1].position.x += arrExplSpd[e1][0];
					arrExpl[e1].position.z += arrExplSpd[e1][2];
					arrExpl[e1].position.y += arrExplSpd[e1][1];
					arrExplSpd[e1][1] -= this.spdYY;	
                     
					if (arrExpl[e1].position.y < -10 ){
						md =  arrExpl[e1];
						scene.remove(md);						 
						arrExpl.splice(e1, 1);	
						arrExplSpd.splice(e1, 1);						 					 
						e1--;
						md = null;					  
					}						 
				}					 
			}else{
				this.mustDie = true;
			}	 
		}			 
	}

	this.initExpl = function(){
		for (var expl = 0; expl < 8; expl ++  ){
			cl = this.sphere.clone();
			cl.scale.set(Math.random()*0.3,Math.random()*0.3,Math.random()*0.3);
			arrExpl.push(cl);
			arrExplSpd.push([Math.random()*0.5- 0.25, Math.random()*0.5, Math.random()*0.5-0.25 ]);
			scene.add(arrExpl[expl]);
		}					
		scene.remove(this.sphere);
		this.study = "expl";			  
	}  	  
}
  