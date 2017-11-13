/**
|***************************************\ 
*  Project        : BotWars 
*  Program name   : Inteface 
*  Author         : www.otrisovano.ru
*  Date           : 11.10.2017 
*  Purpose        : good start   
|***************************************/   


/***************************************\ 
*       START WINDOW
\***************************************/   
      
var pointsLoading = 0;
var intervalLoading = setInterval( setPointLoading, 500 );
function setPointLoading(){ 
	pointsLoading++;
	$("#loadingMess").append(" .  ");	
	if ( pointsLoading> 5)
	{
        $("#loadingMess").html("Loading");
        pointsLoading =0;	   
	}			   
}	  
   
/***************************************\
*  READY TO GAME WINDOW
\***************************************/     
  
function gameReadyWindow(){
	clearInterval(intervalLoading);
	$("#loadingMess").css("visibility", "hidden");
	$("#loadingMess").remove(); 
	butStart.style.visibility = 'visible'; 
	$("#startGame").animate( {height:45}, 300); 			
}  
  
var butStart = document.getElementById("startGame");
butStart.onclick = function(){	 
	$("#myCanvas").css("margin-left", 0); 
	$("#startGame").remove(); 
	$("#gameMessage").hide(); 
	$("#copyRight").hide(); 		   
	$("#gameFrontPanel" ).fadeTo( 1000 , 0.1, function() { $("#gameFrontPanel").hide() });	
	$("#messageStartDesk").css("display", "none"); 		 
	startPersonCamera(); 
}

/***************************************\
* END GAME WINDOW
\***************************************/   
  
function playerDeath(){
	$("#playerDeath").css("visibility", "visible");
	$("#playerDeath").animate( { opacity:.85 }, 200); 
	endUi("You died.");	 
	stopPersonCamera();
	startDeathCamera();	   	   
}
  
function endUi(val){	  
	$("#gameMessage").fadeTo( 10 , 0.0) 
 	$("#messVictory").css("visibility", "visible"); 
	$("#messVictory").html(val);		
    var finishTimer = setTimeout(stopGame, 5000);			 		
}  
  
function stopGame(){		
	stopPersonCamera();	
	gamePaused = true;	
	gameStatus = "endEnterface";
	   			
	$("#copyRight").show(); 		   
	$("#gameFrontPanel").show(); 		   
	$("#gameFrontPanel" ).fadeTo( 1000 , 1);	
 
	setTimeout(showGameEndMess, 2000); 	   	   
}
  
function showGameEndMess(){
	$("#gameMessage").show();
	$("#messageEndDesk").css("display", "block");	   
	$("#messVictory").fadeTo( 500 , 0.0, function(){$("#gameMessage").fadeTo( 1000 , 1);});	    
}
    	
 