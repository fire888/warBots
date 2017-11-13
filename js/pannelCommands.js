/**
|***************************************; 
*  Project        : BotWars 
*  Program name   : Module making interface commands 
*  Author         : www.otrisovano.ru
*  Date           : 11.10.2017 
*  Purpose        : check making modules    
|***************************************;
*/  

/**
*   MODULE Pannel Commands
*   
*   In HTML file write:
*   <div id = "pMemory"></div> 
*   <div id = "pCommands"></div>
*  
*   For init this module in main.js 
*   and return value 'param',  
*   where 'param' is array, print:
*  
*   var param = []; 
*   var pInterface = new pannelCommands( function(val){ 
*         param = val;
*		});
* 
*   For draw pannel in window in main.js
*   where 'param' and 'param2' is arrays
*   print:
*
*   var param = ['aa','bb','cc']; 
*   var param2 = ['aa','bb','cc'];
*
*   pInterface.draw(param, param2, function(val){
*       robot.arrCommands =  
*   });
* 
*/

function pannelCommands( document ){ 	
	var doc = document;
	var returnListCommandsStart;
	var idCommand = null;
	var listOfCommands, listOfMemory; 
	var listEndRedactButtonS ;   
   
	this.draw = function(lm, lc, func){	
		listOfMemory = lm;		
		listOfCommands =  lc; 	 
		returnListCommandsStart = func;
	
		drawPannelCommands();
		reDrawPannelMemory();	
		addListenersButtomsPannelMemory();	   
    }


    function reDrawPannelMemory(){
		pMemory = document.getElementById("pMemory");
		pMemory.innerHTML = "";	   
		commands = "";
		for (var i = 0; i< 20 ;i++ ){   
			stroke = "";			  
			stroke  += "<div class='str'>" +
			"<div class='numberCommand'>" + (i+1) + "</div>";
			if (listOfMemory[i]){
				stroke += "<div class='command'>" +  listOfMemory[i]  + "</div>"+			
				"<div class ='butMinusWrp'><button class='commandMinus' data-val=" + i + "> - </button></div>"+ 
				"<div class ='butPlusWrp'><button class='commandPlus' data-val=" + i + "> + </button></div>";
			}
			if (i == (listOfMemory.length)){
				stroke += "<div class='command'></div>"+			
				"<div class ='butMinusWrp'>&nbsp;</div>"+ 
				"<div class ='butPlusWrp'><button class='commandPlus' data-val=" + i + "> + </button></div>";
			}		
			stroke += "</div>";			
			commands += stroke; 		 
		}  
		pMemory.innerHTML += "<div id='mWrapper'>" + commands + "</div>";	   
		pMemory.innerHTML += "- press 'Spase' to exit without save -<br/><br/>";	 	   
		pMemory.innerHTML += "<button id = 'endRedactStart' class = 'closePannel'>Save And Start Program</button>";
        
		w = doc.getElementById('mWrapper');
		w.style.height = doc.documentElement.clientHeight*0.7; 
		bS = document.getElementById('endRedactStart'); 
		listEndRedactButtonS = bS.addEventListener('click', function(e){
			pMemory = document.getElementById("pMemory");
			pMemory.innerHTML = "";  
			returnListCommandsStart( listOfMemory );			   
		});  		   
	}
	
	this.clearHidePannelMemory = function (){
		pMemory = document.getElementById("pMemory");
		pMemory.innerHTML = ""; 		
	}
	
	function addListenersButtomsPannelMemory(){
	
		btnsMinus = document.getElementsByClassName("commandMinus");	
		for (t=0; t<btnsMinus.length; t++){		
			btnsMinus[t].addEventListener('click', function(e){
				var val = e.target.getAttribute('data-val');
				listOfMemory.splice(val ,1); 
				reDrawPannelMemory();
				addListenersButtomsPannelMemory();			  
			});
		}

		btnsPlus = document.getElementsByClassName("commandPlus");	
	    for (t=0; t<btnsPlus.length; t++){		
			btnsPlus[t].addEventListener('click', function(e){
				idCommand  = e.target.getAttribute('data-val');
				showPannelCommands();
				listOfMemory.splice(idCommand ,0, "........"); 
				reDrawPannelMemory();			  
				if (listOfMemory.length>20){	  
					listOfMemory.length = 20;
				}				  
			});
		}	
	}

  
	function drawPannelCommands(){
		pCommands = document.getElementById("pCommands");
		pCommands.innerHTML = "";
		for(cc=0; cc<listOfCommands.length; cc++){
			stroke = "";
			stroke += "<div class='str'>" +
			"<div class = 'butWrp'><button class='listArrow' data-val =" + cc + "> <-- </button></div>"+		
			"<div class = 'command'>" + listOfCommands[cc] + "</div>"+
			"</div>";
			pCommands.innerHTML += stroke;			
		}
		btnsList = document.getElementsByClassName("listArrow");	
		for (t=0; t<btnsList.length; t++){		
			btnsList[t].addEventListener('click', function(e){
				var val = e.target.getAttribute('data-val');
				listOfMemory.splice(idCommand,1, listOfCommands[val] ); 
				hidePannelCommands();
				reDrawPannelMemory();	
				addListenersButtomsPannelMemory(); 			  
			});
		}	
	}

	function showPannelCommands(){
		pCommands = document.getElementById("pCommands");
		pCommands.style.marginTop = "20px";	
	}

	function hidePannelCommands(){
		pCommands = document.getElementById("pCommands");
		pCommands.style.marginTop = "-500px";	
	}
}