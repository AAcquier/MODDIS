
//Handles the tabs
$(document).ready(function() {
    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
		Pace.restart();			//start the loading bar
        // Show/Hide Tabs
		$('.tabs ' + currentAttrValue).show().siblings().hide();
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
    });
});

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginLeft = "0";
}

//Handles the change of tabs with the sidebar menu
$(document).ready(function() {
    $('.sidenav .sidenavList a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
		Pace.restart();			//start the loading bar
        // Show/Hide Tabs
		$('.tabs ' + currentAttrValue).show().siblings().hide();
        // Change/remove current tab to active
	    $("[href='" + currentAttrValue +"']").parent("li").addClass('active').siblings().removeClass('active');
    });
});

var evLisFFCounter = 0;
var evLisSFCounter = 0;
//Requesting the motes details
var getMotes = new XMLHttpRequest();

getMotes.onload = function(){
	
	 moteJson = JSON.parse(this.responseText);
	
	//Requestinng the sensors details
	var getModality = new XMLHttpRequest();

	getModality.onload = function(){
		 modalityJson = JSON.parse(this.responseText);
		
		setMoteId();
		setMotesLocation();
		
		//Requesting the motes data for the ground floor
		var getMotesdataGF = new XMLHttpRequest();
		
		getMotesdataGF.onload = function(){
			motesDataJsonGF = JSON.parse(this.responseText);
			
			GFDataProcessAndDisplay();
			setLocationGF();;
		};
		getMotesdataGF.open("get", "getMotesDataGF.php",true);
		getMotesdataGF.send();
		
		//Event listener to load data of the first floor through the sidemenu
		document.getElementById("FirstFloor").addEventListener("click", function(){
			
			if (evLisFFCounter==0){
				evLisFFCounter++;
				var getMotesdataFF = new XMLHttpRequest();
			
				getMotesdataFF.onload = function(){
					motesDataJsonFF = JSON.parse(this.responseText);
					
					FFDataProcessAndDisplay();
					setLocationFF();				
				};
			
			getMotesdataFF.open("get", "getMotesDataFF.php",true);
			getMotesdataFF.send();
			}
		})
		
		//Event listener to load data of the first floor through the tabs
		document.getElementById("FirstFloor2").addEventListener("click", function(){
			
			if (evLisFFCounter==0){
				evLisFFCounter++;
				var getMotesdataFF = new XMLHttpRequest();
			
				getMotesdataFF.onload = function(){
					motesDataJsonFF = JSON.parse(this.responseText);
					
					FFDataProcessAndDisplay();
					setLocationFF();				
				};
			
			getMotesdataFF.open("get", "getMotesDataFF.php",true);
			getMotesdataFF.send();
			}
		})
		
		//Event listener to load data of the first floor through the sidemenu
		document.getElementById("SecondFloor").addEventListener("click", function(){
			
			if (evLisSFCounter==0) {
				evLisSFCounter++;
				var getMotesdataSF = new XMLHttpRequest();
			
				getMotesdataSF.onload = function(){
					motesDataJsonSF = JSON.parse(this.responseText);
					
					SFDataProcessAndDisplay();
					setLocationSF();
				};
				
			getMotesdataSF.open("get", "getMotesDataSF.php",true);
			getMotesdataSF.send();
			}
		})
		
		//Event listener to load data of the first floor through the tabs
		document.getElementById("SecondFloor2").addEventListener("click", function(){
			
			if (evLisSFCounter==0) {
				evLisSFCounter++;
				var getMotesdataSF = new XMLHttpRequest();
			
				getMotesdataSF.onload = function(){
					motesDataJsonSF = JSON.parse(this.responseText);
					
					SFDataProcessAndDisplay();
					setLocationSF();
				};
				
			getMotesdataSF.open("get", "getMotesDataSF.php",true);
			getMotesdataSF.send();
			}
		})
	};

	getModality.open("get", "getModality.php", true);
	getModality.send();
};
	
getMotes.open("get", "getMotes.php", true);
getMotes.send();


//This allow to create an array populated with the mote_id of the motes generating data 
var moteId = [];
function setMoteId(){
	for (var i=0; i<moteJson.length; i++){
		for (var j=0; j<modalityJson.length; j++){
			if(moteJson[i].mote_id == modalityJson[j].mote_id){
				var newMoteId = moteJson[i].mote_id								
					if (moteId.indexOf(newMoteId)== -1) {
						moteId.push(newMoteId);
				}
			}
		}
	}
}
						
						
//Sorts out the motes in function of which floor they are located
var groundFloor = [];
var firstFloor = [];
var secondFloor = [];
function setMotesLocation(){
	for (var i=0; i<moteJson.length; i++){
		if(moteJson[i].mote_id	== moteId[i]){
			if (moteJson[i].Floor == "S"){
				secondFloor.push(moteId[i]);
			}
			else if ( moteJson[i].Floor == "G"){
				groundFloor.push(moteId[i]);
			}
			else {
				firstFloor.push(moteId[i]);
			}
		}
	}
	//Creates the cookies storing the mote id to request the data in the php files
	var now = new Date();
	var time = now.getTime();
	time += 3600 * 1000;
	now.setTime(time);
	document.cookie = "mote_IDGF= "+ JSON.stringify(groundFloor)+"; expires =" + now.toUTCString();
	document.cookie = "mote_IDFF= "+ JSON.stringify(firstFloor)+"; expires =" + now.toUTCString();
	document.cookie = "mote_IDSF= "+ JSON.stringify(secondFloor)+"; expires =" + now.toUTCString();
}

//Initializing variables to calculate the mean and the standard deviation
var dayTot = 0;
var dayPop = 0;
var weekTot = 0;
var weekPop = 0;
var dayReading = 0;
var dayReadMinMeanSqrt = 0;
var totDayReadMinMeanSqrt = 0;
var weekReading = 0;
var weekReadMinMeanSqrt = 0;
var totWeekReadMinMeanSqrt = 0;
											
// Function to calculate the last 24hr mean
function meanDay(){
	var dayMean = dayTot/dayPop;
	return dayMean;
}
												
// Function to calculate the last 24hr and the last week standard deviation
function stdDay(){
	var dayStd = Math.sqrt((totDayReadMinMeanSqrt / dayPop));
	return dayStd;
}

// Function to calculate the last 24hr and the last week mean
function meanWeek(){
	var weekMean = weekTot/weekPop;;
	return weekMean;
}
						
						
// Function to calculate the last 24hr and the last week standard deviation
function stdWeek(){
	var weekStd = Math.sqrt((totWeekReadMinMeanSqrt / weekPop));
	return weekStd;
}


//Stores mote id and time stamp to access the activity of the mote for the ground floor
var checkIdGF = [];
var checkTimeGF = [];
var countGF =0;
var moteProcessedDataGF = [];
var allMoteData=[];
						
//Processing and displaying data for the ground floor
function GFDataProcessAndDisplay() {
	//Setting object to store processed data
	function processedGFData() {
		this.moteid = idMote;
		this.sensorType = sensorType;
		this.lastTimestamp = lastTimeStamp;
		this.lastValue = lastValue;
		this.arrayValuesDay = valuesDay;
		this.populationDay = populationDay;
		this.arrayValuesWeek = valuesWeek;
		this.populationWeek = populationWeek;
		this.platform = platform;
		this.unit= unit;
	}					
	//Setting up variables
	var valuesDay = [];
	var valuesWeek = [];
	var populationDay = 0;
	var populationWeek = 0;
	var sensorType = "" ;
	var checkSensorType = [];
	var lastDay = new Date("2016-09-13 00:00:00");
	var day = 60*60*24*1000;
	var week = day * 7;
	var oneDay = lastDay.getTime() - day;
	var oneWeek = lastDay.getTime() - week;
	var platform;
	var unit;
	var sensor = [];
							
	//This allow to extract the nescessary data for the calculation and the display
	for (var i=0; i<groundFloor.length; i++){
		var idMote = groundFloor[i];// Get the mote_id
		for (var k=0; k<modalityJson.length;k++) {
			var lastTimeStamp = "1970-01-01 00:00:00"; //Reset the timestamp
			for (var j=0; j<motesDataJsonGF.length; j++){			
				if (groundFloor[i] == motesDataJsonGF[j].mote_id && motesDataJsonGF[j].sensor_type == modalityJson[k].sensor_type && motesDataJsonGF[j].mote_id == modalityJson[k].mote_id){
										
					sensorType = modalityJson[k].sensor_type;//Get the sensor type
					unit =  modalityJson[k].measurement_unit;//Get the unit of the sensor
					 
					 //Get the mote platform
					 for (l=0; l<moteJson.length;l++){
						 if (moteJson[l].mote_id==groundFloor[i]){
							 platform = moteJson[l].platform;
						 }
					 }
												
					// Storing the data to calculate the standard deviation for the last 24hrs
					if (new Date(motesDataJsonGF[j].date_time)>oneDay){
						valuesDay.push(motesDataJsonGF[j].observation);
						populationDay++;
					}
					// Storing the data to calculate the standard deviation for the last week
					if (new Date(motesDataJsonGF[j].date_time)>oneWeek){
						valuesWeek.push(motesDataJsonGF[j].observation);
						populationWeek++;
					}
												
					//Sets up the time and value of the last reading																	
					if (new Date (motesDataJsonGF[j].date_time)> new Date (lastTimeStamp)){
						lastTimeStamp = motesDataJsonGF[j].date_time;
						var lastValue = motesDataJsonGF[j].observation;
					}											
				}
			}
			//Creates an object only if the there is data to display
			if ( populationDay>0 && populationWeek>0){
				//Create the objects to store the data
				var dayObj = new processedGFData(idMote, lastTimeStamp, sensorType, lastValue, valuesDay, populationDay, valuesWeek, populationWeek, platform, unit);
				moteProcessedDataGF.push(dayObj);
				allMoteData.push(dayObj);
				valuesDay =[];
				populationDay = 0;
				valuesWeek = [];
				populationWeek = 0;
			}
			checkSensorType.push(sensorType);
			if (sensor.indexOf(sensorType) == -1 && sensorType!= ""){ //extract the different types of sensors in this floor
				sensor.push(sensorType);
			}
		}
	}
	checkSensorType = [];
	
	for (var n =0; n<groundFloor.length; n++){
		var motNum = "";
		var stamp = "";
								
		for (var i=0; i<moteProcessedDataGF.length; i++){
			if (groundFloor[n] ==  moteProcessedDataGF[i].moteid){
								
				if (motNum == "" && stamp == ""){
					motNum = moteProcessedDataGF[i].moteid;
					stamp = moteProcessedDataGF[i].lastTimestamp;
					checkIdGF.push(motNum);
					checkTimeGF.push(stamp);										
				}
			}
		}
	}
	//Creating the object  and variables to store the max values data
	function store (){
		this.sensor =senType;
		this.unit = thisUnit;
		this.reading=maxRead;
		this.moteId = idMote;
	}
	var storeTable=[];
	
	//Extracting the max data
	for (var p=0; p<sensor.length; p++){
		var senType =sensor[p];
		var maxRead = 0;
		var idMote = "";
		var thisUnit = ""
		for (var q =0; q<motesDataJsonGF.length; q++){
			 if( sensor[p] == motesDataJsonGF[q].sensor_type && motesDataJsonGF[q].observation > maxRead){
				 maxRead = motesDataJsonGF[q].observation;
				 idMote = motesDataJsonGF[q].mote_id
			 }
			 for (var r=0; r<modalityJson.length; r++){
				 if(modalityJson[r].sensor_type == sensor[p]){
					thisUnit =  modalityJson[r].measurement_unit;
				 }
			 }
		}
		var tableObj = new store(senType, maxRead, idMote, thisUnit);
		 storeTable.push(tableObj);
	}
	
	//Creating  and populating the table with max values an inserting it in the webpage
	var maxTable = "<p> Maximum values over the last week:</p><table style= 'width: 100%' class ='maxTable'><tbody><tr><th class='border'>Sensor Type</th><th class='border'>Max Reading</th><th class='border'>Mote Id</th></tr>";
	
	for (var i=0; i<storeTable.length; i++){
		maxTable+="<tr><td class='border'>" + storeTable[i].sensor + " (" + storeTable[i].unit + ") </td><td class='border' id='data'>" + storeTable[i].reading + "</td><td class='border' id='data'>" + storeTable[i].moteId + "</td></tr>";
	}
	maxTable+= "</tbody></table>";
	var div = document.getElementById("maxTableGF");
	div.innerHTML =   maxTable + div.innerHTML;
}

//Stores mote id and time stamp to access the activity of the mote for the first floor
var checkIdFF = [];
var checkTimeFF = [];
var countFF =0;
var moteProcessedDataFF = [];
						
//Processing and displaying data for the first floor
function FFDataProcessAndDisplay() {
	//Setting object to store processed data
	function processedFFData() {
		this.moteid = idMote;
		this.sensorType = sensorType;
		this.lastTimestamp = lastTimeStamp;
		this.lastValue = lastValue;
		this.arrayValuesDay = valuesDay;
		this.populationDay = populationDay;
		this.arrayValuesWeek = valuesWeek;
		this.populationWeek = populationWeek;
		this.platform = platform;
		this.unit = unit;
	}
							
	//Setting up variables
	var valuesDay = [];
	var valuesWeek = [];
	var populationDay = 0;
	var populationWeek = 0;
	var sensorType = "" ;
	var checkSensorType = [];
	var lastDay = new Date("2016-09-13 00:00:00");
	var day = 60*60*24*1000;
	var week = day * 7;
	var oneDay = lastDay.getTime() - day;
	var oneWeek = lastDay.getTime() - week;
	var platform;
	var sensor = [];
							
	//This allow to extract the nescessary data for the calculation and the display
	for (var i=0; i<firstFloor.length; i++){
		var idMote = firstFloor[i];// Get the mote_id
		for (var k=0; k<modalityJson.length;k++) {
			var lastTimeStamp = "1970-01-01 00:00:00"; //Reset the timestamp
			for (var j=0; j<motesDataJsonFF.length; j++){										
				if (firstFloor[i] == motesDataJsonFF[j].mote_id && motesDataJsonFF[j].sensor_type == modalityJson[k].sensor_type && motesDataJsonFF[j].mote_id == modalityJson[k].mote_id){
										
					sensorType = modalityJson[k].sensor_type;//Get the sensor type
					unit =  modalityJson[k].measurement_unit;//Get the unit of the sensor
					 
					 //Get the mote platform
					 for (l=0; l<moteJson.length;l++){
						 if (moteJson[l].mote_id==firstFloor[i]){
							 platform = moteJson[l].platform;
						 }
					 }
												
					// Storing the data to calculate the standard deviation for the last 24hrs
					if (new Date(motesDataJsonFF[j].date_time)>oneDay){
						valuesDay.push(motesDataJsonFF[j].observation);
						populationDay++;
					}
					// Storing the data to calculate the standard deviation for the last week
					if (new Date(motesDataJsonFF[j].date_time)>oneWeek){
						valuesWeek.push(motesDataJsonFF[j].observation);
						populationWeek++;
					}
												
					//Sets up the time and value of the last reading																	
					if (new Date (motesDataJsonFF[j].date_time)> new Date (lastTimeStamp)){
						lastTimeStamp = motesDataJsonFF[j].date_time;
						var lastValue = motesDataJsonFF[j].observation;
					}											
				}
			}
			//Creates an object only if the there is data to display
			if ( populationDay>0 && populationWeek>0){
				//Create the objects to store the data
				var dayObj = new processedFFData(idMote, lastTimeStamp, sensorType, lastValue, valuesDay, populationDay, valuesWeek, populationWeek, platform,unit);
				moteProcessedDataFF.push(dayObj);
				allMoteData.push(dayObj);
				valuesDay =[];
				populationDay = 0;
				valuesWeek = [];
				populationWeek = 0;
			}
			checkSensorType.push(sensorType);
			if (sensor.indexOf(sensorType) == -1 && sensorType!= ""){ //extract the different types of sensors in this floor
				sensor.push(sensorType);
			}
		}
	}
	checkSensorType = [];
	for (var n =0; n<firstFloor.length; n++){
		var motNum = "";
		var stamp = "";
								
		for (var i=0; i<moteProcessedDataFF.length; i++){
			if (firstFloor[n] ==  moteProcessedDataFF[i].moteid){
								
				if (motNum == "" && stamp == ""){
					motNum = moteProcessedDataFF[i].moteid;
					stamp = moteProcessedDataFF[i].lastTimestamp;
					checkIdFF.push(motNum);
					checkTimeFF.push(stamp);
				}	
			}
		}
	}
	//Creating the object  and variables to store the max values data
	function store (){
		this.sensor =senType;
		this.unit = thisUnit;
		this.reading=maxRead;
		this.moteId = idMote;
	}
	var storeTable=[];
	
	//Extracting the max data
	for (var p=0; p<sensor.length; p++){
		var senType =sensor[p];
		var maxRead = 0;
		var idMote = "";
		var thisUnit = ""
		for (var q =0; q<motesDataJsonFF.length; q++){
			 if( sensor[p] == motesDataJsonFF[q].sensor_type && motesDataJsonFF[q].observation > maxRead){
				 maxRead = motesDataJsonFF[q].observation;
				 idMote = motesDataJsonFF[q].mote_id;
			 }
			 for (var r=0; r<modalityJson.length; r++){
				 if(modalityJson[r].sensor_type == sensor[p]){
					thisUnit =  modalityJson[r].measurement_unit;
				 }
			 }
		}
		var tableObj = new store(senType, maxRead, idMote, thisUnit);
		 storeTable.push(tableObj);
	}
	//Creating  and populating the table with max values an inserting it in the webpage
	var maxTable = "<p> Maximum values over the last week:</p><table style= 'width: 100%' class ='maxTable'><tbody><tr><th class='border'>Sensor Type</th><th class='border'>Max Reading</th><th class='border'>Mote Id</th></tr>";
	
	for (var i=0; i<storeTable.length; i++){
		maxTable+="<tr><td class='border'>" + storeTable[i].sensor + " (" + storeTable[i].unit + ") </td><td class='border' id='data'>" + storeTable[i].reading + "</td><td class='border' id='data'>" + storeTable[i].moteId + "</td></tr>";
	}
	maxTable+= "</tbody></table>";
	var div = document.getElementById("maxTableFF");
	div.innerHTML =   maxTable + div.innerHTML;
}

//Stores mote id and time stamp to access the activity of the mote for the second floor
var checkIdSF = [];
var checkTimeSF = [];
var countSF =0;
var moteProcessedDataSF = [];
						
//Processing and displaying data for the second floor
function SFDataProcessAndDisplay() {
	//Setting object to store processed data
	function processedSFData() {
		this.moteid = idMote;
		this.sensorType = sensorType;
		this.lastTimestamp = lastTimeStamp;
		this.lastValue = lastValue;
		this.arrayValuesDay = valuesDay;
		this.populationDay = populationDay;
		this.arrayValuesWeek = valuesWeek;
		this.populationWeek = populationWeek;
		this.platform = platform;
		this.unit = unit;
	}
							
	//Setting up variables
	var valuesDay = [];
	var valuesWeek = [];
	var populationDay = 0;
	var populationWeek = 0;
	var sensorType = "" ;
	var checkSensorType = [];
	var lastDay = new Date("2016-09-13 00:00:00");
	var day = 60*60*24*1000;
	var week = day * 7;
	var oneDay = lastDay.getTime() - day;
	var oneWeek = lastDay.getTime() - week;
	var platform;
	var sensor = [];
							
	//This allow to extract the nescessary data for the calculation and the display
	for (var i=0; i<secondFloor.length; i++){
		var idMote = secondFloor[i];// Get the mote_id
		for (var k=0; k<modalityJson.length;k++) {
			var lastTimeStamp = "1970-01-01 00:00:00"; //Reset the timestamp
			for (var j=0; j<motesDataJsonSF.length; j++){										
				if (secondFloor[i] == motesDataJsonSF[j].mote_id && motesDataJsonSF[j].sensor_type == modalityJson[k].sensor_type && motesDataJsonSF[j].mote_id == modalityJson[k].mote_id){
										
					sensorType = modalityJson[k].sensor_type;//Get the sensor type
					unit =  modalityJson[k].measurement_unit;//Get the unit of the sensor
					 
					 //Get the mote platform
					 for (l=0; l<moteJson.length;l++){
						 if (moteJson[l].mote_id==secondFloor[i]){
							 platform = moteJson[l].platform;
						 }
					 }
												
					// Storing the data to calculate the standard deviation for the last 24hrs
					if (new Date(motesDataJsonSF[j].date_time)>oneDay){
						valuesDay.push(motesDataJsonSF[j].observation);
						populationDay++;
					}
					// Storing the data to calculate the standard deviation for the last week
					if (new Date(motesDataJsonSF[j].date_time)>oneWeek){
						valuesWeek.push(motesDataJsonSF[j].observation);
						populationWeek++;
					}
												
					//Sets up the time and value of the last reading																	
					if (new Date (motesDataJsonSF[j].date_time)> new Date (lastTimeStamp)){
						lastTimeStamp = motesDataJsonSF[j].date_time;
						var lastValue = motesDataJsonSF[j].observation;
					}											
				}
			}
			//Creates an object only if the there is data to display
			if ( populationDay>0 && populationWeek>0){
				//Create the objects to store the data
				var dayObj = new processedSFData(idMote, lastTimeStamp, sensorType, lastValue, valuesDay, populationDay, valuesWeek, populationWeek, platform);
				moteProcessedDataSF.push(dayObj);
				allMoteData.push(dayObj);
				valuesDay =[];
				populationDay = 0;
				valuesWeek = [];
				populationWeek = 0;
			}
			checkSensorType.push(sensorType);
			if (sensor.indexOf(sensorType) == -1 && sensorType!= ""){ //extract the different types of sensors in this floor
				sensor.push(sensorType);
			}
		}
	}
	checkSensorType = [];
			
	for (var n =0; n<secondFloor.length; n++){
		var motNum = "";
		var stamp = "";
								
		for (var i=0; i<moteProcessedDataSF.length; i++){
			if (secondFloor[n] ==  moteProcessedDataSF[i].moteid){
								
				if (motNum == "" && stamp == ""){
					motNum = moteProcessedDataSF[i].moteid;
					stamp = moteProcessedDataSF[i].lastTimestamp;
					checkIdSF.push(motNum);
					checkTimeSF.push(stamp);
				}
			}
		}
	}
	//Creating the object  and variables to store the max values data
	function store (){
		this.sensor =senType;
		this.unit = thisUnit;
		this.reading=maxRead;
		this.moteId = idMote;
	}
	var storeTable=[];
	
	//Extracting the max data
	for (var p=0; p<sensor.length; p++){
		var senType =sensor[p];
		var maxRead = 0;
		var idMote = "";
		var thisUnit = ""
		for (var q =0; q<motesDataJsonSF.length; q++){
			 if( sensor[p] == motesDataJsonSF[q].sensor_type && motesDataJsonSF[q].observation > maxRead){
				 maxRead = motesDataJsonSF[q].observation;
				 idMote = motesDataJsonSF[q].mote_id
			 }
			 for (var r=0; r<modalityJson.length; r++){
				 if(modalityJson[r].sensor_type == sensor[p]){
					thisUnit =  modalityJson[r].measurement_unit;
				 }
			 }
		}
		var tableObj = new store(senType, maxRead, idMote, thisUnit);
		 storeTable.push(tableObj);
	}
	
	//Creating  and populating the table with max values an inserting it in the webpage
	var maxTable = "<p> Maximum values over the last week:</p><table style= 'width: 100%' class ='maxTable'><tbody><tr><th class='border'>Sensor Type</th><th class='border'>Max Reading</th><th class='border'>Mote Id</th></tr>";
	
	for (var i=0; i<storeTable.length; i++){
		maxTable+="<tr><td class='border'>" + storeTable[i].sensor + " (" + storeTable[i].unit + ") </td><td class='border' id='data'>" + storeTable[i].reading + "</td><td class='border' id='data'>" + storeTable[i].moteId + "</td></tr>";
	}
	maxTable+= "</tbody></table>";
	var div = document.getElementById("maxTableSF");
	div.innerHTML =   maxTable + div.innerHTML;
}


//This function set the location of the motes
function setLocationGF(){
	
	for (i=0; i<moteJson.length; i++){		
		if (groundFloor.indexOf(moteJson[i].mote_id) !== -1){
			
			//Creates the interactive button for the sensor id, location and platform
			var button = document.createElement("input");
			button.type ="button";
			button.value = moteJson[i].mote_id;
			button.name = moteJson[i].mote_id;
			button.id =  moteJson[i].mote_id;
			button.className = "button";
			button.style.position = "absolute";
			button.style.border = "4px solid black";
			button.style.backgroundColor = setFillStyleGF();
			button.setAttribute("onmouseover","handler(this)");
			
			//Allows to jump straight to the table when this one is created
			a = document.createElement('a');
			a.href = "#GFDisplay";
			a.className = "tooltip";
			a.style.left= moteJson[i].X_Coordinates+"px";
			a.style.top=moteJson[i].Y_Coordinates+"px";
			a.appendChild(button);
			
			//Target the div into index.html
			var canvas = document.getElementById("buttonDispGF");
			canvas.appendChild(a);
		}
	}
}


function setLocationFF(){
	
	for (i=0; i<moteJson.length; i++){	
		if (firstFloor.indexOf(moteJson[i].mote_id) !== -1){
			
			//Creates the interactive button for the sensor id, location and platform
			var button = document.createElement("input");
			button.type ="button";
			button.value = moteJson[i].mote_id;
			button.name = moteJson[i].mote_id;
			button.id =  moteJson[i].mote_id;
			button.className = "button";
			button.style.position = "absolute";
			button.style.border = "4px solid black";
			button.style.backgroundColor = setFillStyleFF();
			button.setAttribute("onmouseover","handler(this)");
			
			//Allows to jump straight to the table ewhen this one is created
			a = document.createElement('a');
			a.href = "#FFDisplay";
			a.className = "tooltip";
			a.style.left= moteJson[i].X_Coordinates+"px";
			a.style.top=moteJson[i].Y_Coordinates+"px";
			a.appendChild(button);
			
			//Target the div into index.html
			var canvas = document.getElementById("buttonDispFF");
			canvas.appendChild(a);
		}
	}
}


function setLocationSF(){
	
	for (i=0; i<moteJson.length; i++){		
		if (secondFloor.indexOf(moteJson[i].mote_id) !== -1){
			
			//Creates the interactive button for the sensor id, location and platform
			var button = document.createElement("input");
			button.type ="button";
			button.value = moteJson[i].mote_id;
			button.name = moteJson[i].mote_id;
			button.id =  moteJson[i].mote_id;
			button.className = "button";
			button.style.position = "absolute";
			button.style.border = "4px solid black";
			button.style.backgroundColor = setFillStyleSF();
			button.setAttribute("onmouseover","handler(this)");
			
			//Allows to jump straight to the table ewhen this one is created
			a = document.createElement('a');
			a.href = "#SFDisplay";
			a.className = "tooltip";
			a.style.left= moteJson[i].X_Coordinates+"px";
			a.style.top=moteJson[i].Y_Coordinates+"px";
			a.appendChild(button);
			
			//Target the div into index.html
			var canvas = document.getElementById("buttonDispSF");
			canvas.appendChild(a);
		}
	}
}

var displayForGF = "";
var displayForFF = "";
var displayForSF = "";
var storeIdGF = [];
var storeIdFF = [];
var storeIdSF = [];
var checkClearGF = 0;
var checkClearFF = 0;
var checkClearSF = 0;
var storeIdGF2 = [];
var storeIdFF2 = [];
var storeIdSF2 = [];
//Get the information when the the motes buttons are clicked
function reply_clickGF(e){
	// collect the id of the button clicked
	e= e || window.event;
	e = e.target || e.srcElement;
	var clickId = e.id;
	
	//Check of the data has been cleared and if so sets up new values
	if (checkClearGF == 1){
		displayForGF = "";
		checkClearGF = 0;
		storeIdGF=[];
		storeIdGF2=[];
	}
	
	if (groundFloor.indexOf(clickId)){
		var motNum = "";
		var stamp = "";
		var motePlatform = "";
								
		if (storeIdGF.indexOf(clickId)== -1){
			storeIdGF.push(clickId);
			storeIdGF2.push(parseInt(clickId));
		
			for (var i=0; i<moteProcessedDataGF.length; i++){
				if (clickId ==  moteProcessedDataGF[i].moteid){
									
					if (motNum == "" && stamp == ""){
						motNum = moteProcessedDataGF[i].moteid;
						stamp = moteProcessedDataGF[i].lastTimestamp;
						motePlatform = moteProcessedDataGF[i].platform;
						countGF++;										
												
						//Starting to build the data to be displayed as well as the head of the table
						displayForGF += "<div class='tables'  id='ground" + countGF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
					}
											
					// Generating the data to calculate the means
					for (var j=0; j<moteProcessedDataGF[i].arrayValuesDay.length; j++){
						 dayTot += moteProcessedDataGF[i].arrayValuesDay[j];
						 dayPop = moteProcessedDataGF[i].populationDay; 									
					}
								
					for (var k=0; k<moteProcessedDataGF[i].arrayValuesWeek.length; k++){
						weekTot += moteProcessedDataGF[i].arrayValuesWeek[k];
						weekPop = moteProcessedDataGF[i].populationWeek; 
					}
											
					//Calculating the means										
					var dayMean = meanDay(dayTot, dayPop).toFixed(2);
					var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
									
					// Generating the data to calculate the standard deviations
					for (var l=0; l<moteProcessedDataGF[i].arrayValuesDay.length; l++){
						dayReading =  moteProcessedDataGF[i].arrayValuesDay[l];
						dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
						totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
					}
											
					for (var m=0; m<moteProcessedDataGF[i].arrayValuesWeek.length; m++){
						weekReading =  moteProcessedDataGF[i].arrayValuesWeek[m];
						weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
						totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
					}
											
					//Calculating the standard deviations
					var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
					var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
									
					//Display the data of each sensor in one row
					displayForGF += "<tr><td class ='border' >" +  moteProcessedDataGF[i].sensorType + "  (" +  moteProcessedDataGF[i].unit + ") </td><td id='data' class ='border'>" +  moteProcessedDataGF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
									dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
									
					//Resetting variables
					dayTot = 0;
					dayPop = 0;
					weekTot = 0;
					weekPop = 0;
					dayReading = 0;
					dayReadMinMeanSqrt = 0;
					totDayReadMinMeanSqrt = 0;
					weekReading = 0;
					weekReadMinMeanSqrt = 0;
					totWeekReadMinMeanSqrt = 0;
				}
			}
			displayForGF += "</tbody></table></div>";
			
			//Handling the absence of data for one mote
			if ( checkIdGF.indexOf(parseInt(clickId))==-1  && clickId != "buttonDispGF"){
				countGF++;
				displayForGF += "<div class='tables' id='ground" + countGF + "'><hr class = 'line'><ul><li class= 'close' onclick = 'removeTable(this)' id = '"+ motNum + "'>&times;</li></ul><p> Mote ID: " + clickId + "<br>NO DATA, Please check the device</p></div>"
			} 
		}
		//Populating the html table
		var div =document.getElementById("GFDisplay");
		div.innerHTML = div.innerHTML + displayForGF;
		displayForGF = "";
		return storeIdGF2;
	}	
}

//Erases the tables in the ground floor tab
function resetGF() { 	
	//Targeting the differnts elements
	var element = document.getElementById("GFDisplay");
	var parent = element.parentNode;
	//Creating new element
	var newElement = document.createElement('div');
	newElement.id = "GFDisplay";
    newElement.innerHTML = "";
	//Inserting new element
	parent.insertBefore(newElement, element);
	//Removing old element with tables
	parent.removeChild(element);
	
	checkClearGF=1;
}
			

function reply_clickFF(e){
	// collect the id of the button clicked
	e= e || window.event;
	e = e.target || e.srcElement;
	var clickId = e.id;
	
	//Check of the data has been cleared and if so sets up new values
	if (checkClearFF == 1){
		displayForFF = "";
		checkClearFF = 0;
		storeIdFF=[];
		storeIdFF2=[];
	}
	
	if (firstFloor.indexOf(clickId)){
								
		var motNum = "";
		var stamp = "";
		var motePlatform = "";
			
			if (storeIdFF.indexOf(clickId)== -1){
				storeIdFF.push(clickId);
				storeIdFF2.push(parseInt(clickId));		
				
				for (var i=0; i<moteProcessedDataFF.length; i++){
					if (clickId ==  moteProcessedDataFF[i].moteid){
										
						if (motNum == "" && stamp == ""){
							motNum = moteProcessedDataFF[i].moteid;
							stamp = moteProcessedDataFF[i].lastTimestamp;
							motePlatform = moteProcessedDataFF[i].platform;
							countFF++;										
													
							//Starting to build the data to be displayed as well as the head of the table
							displayForFF += "<div class='tables'  id='first" + countFF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
						}
												
						// Generating the data to calculate the means
						for (var j=0; j<moteProcessedDataFF[i].arrayValuesDay.length; j++){
							 dayTot += moteProcessedDataFF[i].arrayValuesDay[j];
							 dayPop = moteProcessedDataFF[i].populationDay; 									
						}
									
						for (var k=0; k<moteProcessedDataFF[i].arrayValuesWeek.length; k++){
							weekTot += moteProcessedDataFF[i].arrayValuesWeek[k];
							weekPop = moteProcessedDataFF[i].populationWeek; 
						}
												
						//Calculating the means										
						var dayMean = meanDay(dayTot, dayPop).toFixed(2);
						var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
										
						// Generating the data to calculate the standard deviations
						for (var l=0; l<moteProcessedDataFF[i].arrayValuesDay.length; l++){
							dayReading =  moteProcessedDataFF[i].arrayValuesDay[l];
							dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
							totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
						}
												
						for (var m=0; m<moteProcessedDataFF[i].arrayValuesWeek.length; m++){
							weekReading =  moteProcessedDataFF[i].arrayValuesWeek[m];
							weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
							totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
						}
												
						//Calculating the standard deviations
						var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
						var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
										
						//Display the data of each sensor in one row
						displayForFF += "<tr><td class ='border'>" +  moteProcessedDataFF[i].sensorType + " (" +  moteProcessedDataFF[i].unit + ") </td><td id='data' class ='border'>" +  moteProcessedDataFF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
										dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
												
						//Resetting variables
						dayTot = 0;
						dayPop = 0;
						weekTot = 0;
						weekPop = 0;
						dayReading = 0;
						dayReadMinMeanSqrt = 0;
						totDayReadMinMeanSqrt = 0;
						weekReading = 0;
						weekReadMinMeanSqrt = 0;
						totWeekReadMinMeanSqrt = 0;
					}
				}
				displayForFF += "</tbody></table></div>";
									
				//Handling the absence of data for one mote
				if (checkIdFF.indexOf(parseInt(clickId)) == -1 && clickId != "buttonDispFF"){
					countFF++;		
					displayForFF += "<div class='tables'  id='first" + countFF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + clickId + "<br>NO DATA, Please check the device</p></div>"
				}
			}
			
		//Populating the html table
		var div = document.getElementById("FFDisplay");
		div.innerHTML = div.innerHTML + displayForFF;
		displayForFF = "";
	}
	return storeIdFF2;
}

//Erases the tables in the first floor tab
function resetFF() { 	
	//Targeting the differnts elements
	var element = document.getElementById("FFDisplay");
	var parent = element.parentNode;
	//Creating new element
	var newElement = document.createElement('div');
	newElement.id = "FFDisplay";
    newElement.innerHTML = "";
	//Inserting new element
	parent.insertBefore(newElement, element);
	//Removing old element with tables
	parent.removeChild(element);
	
	checkClearFF=1;
}

function reply_clickSF(e){
	// collect the id of the button clicked
	e= e || window.event;
	e = e.target || e.srcElement;
	var clickId = e.id;
	
	//Check of the data has been cleared and if so sets up new values
	if (checkClearSF == 1){
		displayForSF = "";
		checkClearSF = 0;
		storeIdSF=[];
		storeIdSF2=[];
	}
	
	if (secondFloor.indexOf(clickId)){
		var motNum = "";
		var stamp = "";
		var motePlatform = "";
		
		if (storeIdSF.indexOf(clickId)== -1){
			storeIdSF.push(clickId);
			storeIdSF2.push(parseInt(clickId));
									
			for (var i=0; i<moteProcessedDataSF.length; i++){
				if (clickId ==  moteProcessedDataSF[i].moteid){
									
					if (motNum == "" && stamp == ""){
						motNum = moteProcessedDataSF[i].moteid;
						stamp = moteProcessedDataSF[i].lastTimestamp;
						motePlatform = moteProcessedDataSF[i].platform;
						countSF++;										
												
						//Starting to build the data to be displayed as well as the head of the table
						displayForSF += "<div class='tables'  id='second" + countSF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
					}
											
					// Generating the data to calculate the means
					for (var j=0; j<moteProcessedDataSF[i].arrayValuesDay.length; j++){
						 dayTot += moteProcessedDataSF[i].arrayValuesDay[j];
						 dayPop = moteProcessedDataSF[i].populationDay; 									
					}
								
					for (var k=0; k<moteProcessedDataSF[i].arrayValuesWeek.length; k++){
						weekTot += moteProcessedDataSF[i].arrayValuesWeek[k];
						weekPop = moteProcessedDataSF[i].populationWeek; 
					}
											
					//Calculating the means										
					var dayMean = meanDay(dayTot, dayPop).toFixed(2);
					var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
									
					// Generating the data to calculate the standard deviations
					for (var l=0; l<moteProcessedDataSF[i].arrayValuesDay.length; l++){
						dayReading =  moteProcessedDataSF[i].arrayValuesDay[l];
						dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
						totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
					}
											
					for (var m=0; m<moteProcessedDataSF[i].arrayValuesWeek.length; m++){
						weekReading =  moteProcessedDataSF[i].arrayValuesWeek[m];
						weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
						totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
					}
											
					//Calculating the standard deviations
					var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
					var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
									
					//Display the data of each sensor in one row
					displayForSF += "<tr><td class ='border'>" +  moteProcessedDataSF[i].sensorType + "  (" +  moteProcessedDataSF[i].unit + ")</td><td id='data' class ='border'>" +  moteProcessedDataSF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
									dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
											
					//Resetting variables
					dayTot = 0;
					dayPop = 0;
					weekTot = 0;
					weekPop = 0;
					dayReading = 0;
					dayReadMinMeanSqrt = 0;
					totDayReadMinMeanSqrt = 0;
					weekReading = 0;
					weekReadMinMeanSqrt = 0;
					totWeekReadMinMeanSqrt = 0;
				}
			}
			displayForSF += "</tbody></table></div>";
									
			//Handling the absence of data for one mote
			if (checkIdSF.indexOf(parseInt(clickId)) == -1 && clickId != "buttonDispSF"){
				countSF++;	
				displayForSF += "<div class='tables'  id='second" + countSF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + clickId + "<br>NO DATA, Please check the device</p></div>"
			}
		}
		//Populating the html table
		var div  = document.getElementById("SFDisplay");
		div.innerHTML = div.innerHTML + displayForSF;
		displayForSF = "";
	}
	return storeIdSF2;
}

////Erases the tables in the second floor tab
function resetSF() { 	
	//Targeting the differnts elements
	var element = document.getElementById("SFDisplay");
	var parent = element.parentNode;
	//Creating new element
	var newElement = document.createElement('div');
	newElement.id = "SFDisplay";
    newElement.innerHTML = "";
	//Inserting new element
	parent.insertBefore(newElement, element);
	//Removing old element with tables
	parent.removeChild(element);
	
	checkClearSF=1;
}

//Setting up the variables toestablish the colors
var lastDay = new Date("2016-09-13 00:00:00");
var timeOne = 12*60*60*1000;	//12hr in milliseconds
var timeTwo = 2*timeOne;	//24hr in milliseconds
var fillStyle = "";
var moteDoneFillGF= [];
var moteDoneFillFF= [];
var moteDoneFillSF= [];
var timeGF = [];
var timeFF = [];
var timeSF = [];
var a=0;
var b=0;
var c=0;

//The next 3 functions set the color of the motes' button in function of their activities
function setFillStyleGF(){
	
	for (var i=0; i<groundFloor.length; i++){
		if (moteDoneFillGF.indexOf(groundFloor[i]) == -1){
			moteDoneFillGF.push(groundFloor[i]);
			if (checkIdGF.indexOf(groundFloor[i]) !== -1){
				for(var j=0;j<checkTimeGF.length; j++){
					if (timeGF.indexOf(checkTimeGF[j])==-1){
							timeGF.push(checkTimeGF[j]);
							
						if (lastDay.getTime() - new Date(checkTimeGF[j]).getTime() > timeTwo){
							fillStyle = 'red';
						}
						else if (lastDay.getTime() - new Date(checkTimeGF[j]).getTime() > timeOne && lastDay.getTime() - new Date(checkTimeGF[j]).getTime() < timeTwo) {
							fillStyle = 'yellow';
						}
						else {
							fillStyle = 'green';
						}
						return fillStyle;	//Give color to the motes location			
					}
				}
			}
			//Give the colour for the button if the mote does not have any data
			else{
				fillStyle = 'red';
				return fillStyle; 
			}
		}
	}
}

function setFillStyleFF(){
	
	for (var k=0; k<firstFloor.length; k++){
		if (moteDoneFillFF.indexOf(firstFloor[k]) == -1){
				moteDoneFillFF.push(firstFloor[k]);
				if (checkIdFF.indexOf(firstFloor[k]) !== -1){
					for(var l=0; l<checkTimeFF.length; l++){
						if (timeFF.indexOf(checkTimeFF[l])==-1){
							timeFF.push(checkTimeFF[l]);
							
							if (lastDay.getTime() - new Date(checkTimeFF[l]).getTime() > timeTwo){
								fillStyle = 'red';
							}
							else if (lastDay.getTime() - new Date(checkTimeFF[l]).getTime() > timeOne && lastDay.getTime() - new Date(checkTimeFF[l]).getTime() < timeTwo) {
								fillStyle = 'yellow';
							}
							else {
								fillStyle = 'green';
							}							
							return fillStyle;	//Give color to the motes location			
						}
					}
				}
				//Give the colour for the button if the mote does not have any data
				else{
					fillStyle = 'red';
					return fillStyle; 
			}
		}
	}
}

function setFillStyleSF(){
	
	for (var k=0; k<secondFloor.length; k++){
		if (moteDoneFillSF.indexOf(secondFloor[k]) == -1){
			moteDoneFillSF.push(secondFloor[k]);
			if (checkIdSF.indexOf(secondFloor[k]) !== -1){
				for(var l=0;l<checkTimeSF.length; l++){
					if (timeSF.indexOf(checkTimeSF[l])==-1){
						timeSF.push(checkTimeSF[l]);
			
							if (lastDay.getTime() - new Date(checkTimeSF[l]).getTime() > timeTwo ){
								fillStyle = 'red';
							}
							else if (lastDay.getTime() - new Date(checkTimeSF[l]).getTime() > timeOne && lastDay.getTime() - new Date(checkTimeSF[l]).getTime() < timeTwo) {
								fillStyle = 'yellow';
							}
							else {
								fillStyle = 'green';
							}
							return fillStyle;	//Give color to the motes location			
						}
					}
				}
				//Give the colour for the button if the mote does not have any data
				else{
					fillStyle = 'red';
					return fillStyle; 
			}
		}
	}
}

//Generate the hover display
var cnt= 0;
function handler(el) {
  var target = $(el);
  var id = target.attr("id");
  if (target.is(".button")) {
    if (!target.siblings(".info").length) {
      for (i=0; i<moteJson.length; i++){
		if (moteJson[i].mote_id == id){
			var toAdd ="<div class = 'info'><p>Mote_id:  " +moteJson[i].mote_id + "</p><p> Location:  " + moteJson[i].location + "</p><p> Platform:  " + moteJson[i].platform;
		}  
	  }
	  for (j=0; j<allMoteData.length; j++){
		  if (allMoteData[j].moteid == id){
			  if(cnt == 0){
				  toAdd+="</p><p> Last Readings: ";
				  cnt++;
			  }
			  toAdd += "</p><p> " + allMoteData[j].sensorType + ": " + allMoteData[j].lastValue;
		  }
	  }
	 toAdd += "</p></div>";
	 var display =$(toAdd);
      target.after(display);
      var t = setTimeout(function() {
        display.addClass('show');
      },50)
	  var u = setTimeout(function() {
       $(".info.show").remove();
      },5000)
    }
  }
}

var checkMoteIdGF = [];
var checkMoteIdFF = [];
var checkMoteIdSF = [];
function displayAllTablesGF(){
	//Check of the data has been cleared and if so sets up new values
	if (checkClearGF == 1){
		displayForGF = "";
		checkClearGF = 0;
		storeIdGF=[];
		storeIdGF2=[];
	}
	
	for (var n =0; n<groundFloor.length; n++){
		if (storeIdGF2.indexOf(groundFloor[n])== -1){
			storeIdGF2.push(groundFloor[n]);
			storeIdGF.push(groundFloor[n].toString());
			var motNum = "";
			var stamp = "";
			var motePlatform = "";
		
			for (var i=0; i<moteProcessedDataGF.length; i++){
				if (groundFloor[n] ==  moteProcessedDataGF[i].moteid){
									
					if (motNum == "" && stamp == ""){
						motNum = moteProcessedDataGF[i].moteid;
						stamp = moteProcessedDataGF[i].lastTimestamp;
						motePlatform = moteProcessedDataGF[i].platform;
						checkMoteIdGF.push(motNum);
						countGF++;										
												
						//Starting to build the data to be displayed as well as the head of the table
					displayForGF += "<div class='tables'  id='ground" + countGF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
					}
											
					// Generating the data to calculate the means
					for (var j=0; j<moteProcessedDataGF[i].arrayValuesDay.length; j++){
						 dayTot += moteProcessedDataGF[i].arrayValuesDay[j];
						 dayPop = moteProcessedDataGF[i].populationDay; 									
					}
								
					for (var k=0; k<moteProcessedDataGF[i].arrayValuesWeek.length; k++){
						weekTot += moteProcessedDataGF[i].arrayValuesWeek[k];
						weekPop = moteProcessedDataGF[i].populationWeek; 
					}
											
					//Calculating the means										
					var dayMean = meanDay(dayTot, dayPop).toFixed(2);
					var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
									
					// Generating the data to calculate the standard deviations
					for (var l=0; l<moteProcessedDataGF[i].arrayValuesDay.length; l++){
						dayReading =  moteProcessedDataGF[i].arrayValuesDay[l];
						dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
						totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
					}
											
					for (var m=0; m<moteProcessedDataGF[i].arrayValuesWeek.length; m++){
						weekReading =  moteProcessedDataGF[i].arrayValuesWeek[m];
						weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
						totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
					}
											
					//Calculating the standard deviations
					var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
					var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
									
					//Display the data of each sensor in one row
					displayForGF += "<tr><td class ='border'>" +  moteProcessedDataGF[i].sensorType + "  (" +  moteProcessedDataGF[i].unit + ") </td><td id='data' class ='border'>" +  moteProcessedDataGF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
										dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
							
					//Resetting variables
					dayTot = 0;
					dayPop = 0;
					weekTot = 0;
					weekPop = 0;
					dayReading = 0;
					dayReadMinMeanSqrt = 0;
					totDayReadMinMeanSqrt = 0;
					weekReading = 0;
					weekReadMinMeanSqrt = 0;
					totWeekReadMinMeanSqrt = 0;
				}
			}
			displayForGF += "</tbody></table></div>";
									
			//Handling the absence of data for one mote
			if (checkMoteIdGF.indexOf(groundFloor[n]) == -1){
				countGF++;
				displayForGF += "<div class='tables'  id='ground" + countGF + "'><hr class = 'line'><ul><li class= 'close' onclick = 'removeTable(this)' id = '"+ motNum + "'>&times;</li></ul><p> Mote ID: " + groundFloor[n] + "<br>NO DATA, Please check the device</p></div>"
			}
		}
	}
	//Populating the html table
	var div = document.getElementById("GFDisplay");
	div.innerHTML = div.innerHTML + displayForGF;
	displayForGF="";
	return storeIdGF;
}

function displayAllTablesFF(){
	//Check of the data has been cleared and if so sets up new values
	if (checkClearFF == 1){
		displayForFF = "";
		checkClearFF = 0;
		storeIdFF = [];
		storeIdFF2 = [];
	}
	
	for (var n =0; n<firstFloor.length; n++){
		if (storeIdFF2.indexOf(firstFloor[n])== -1){
			storeIdFF.push(firstFloor[n].toString());
			storeIdFF2.push(firstFloor[n]);
			
			var motNum = "";
			var stamp = "";
			var motePlatform = "";
			
			for (var i=0; i<moteProcessedDataFF.length; i++){
				if (firstFloor[n] ==  moteProcessedDataFF[i].moteid){
									
					if (motNum == "" && stamp == ""){
						motNum = moteProcessedDataFF[i].moteid;
						stamp = moteProcessedDataFF[i].lastTimestamp;
						motePlatform = moteProcessedDataFF[i].platform;
						checkMoteIdFF.push(motNum);
						countFF++;										
												
						//Starting to build the data to be displayed as well as the head of the table
						displayForFF += "<div class='tables'  id='first" + countFF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
					}
											
					// Generating the data to calculate the means
					for (var j=0; j<moteProcessedDataFF[i].arrayValuesDay.length; j++){
						 dayTot += moteProcessedDataFF[i].arrayValuesDay[j];
						 dayPop = moteProcessedDataFF[i].populationDay; 									
					}
								
					for (var k=0; k<moteProcessedDataFF[i].arrayValuesWeek.length; k++){
						weekTot += moteProcessedDataFF[i].arrayValuesWeek[k];
						weekPop = moteProcessedDataFF[i].populationWeek; 
					}
											
					//Calculating the means										
					var dayMean = meanDay(dayTot, dayPop).toFixed(2);
					var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
									
					// Generating the data to calculate the standard deviations
					for (var l=0; l<moteProcessedDataFF[i].arrayValuesDay.length; l++){
						dayReading =  moteProcessedDataFF[i].arrayValuesDay[l];
						dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
						totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
					}
											
					for (var m=0; m<moteProcessedDataFF[i].arrayValuesWeek.length; m++){
						weekReading =  moteProcessedDataFF[i].arrayValuesWeek[m];
						weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
						totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
					}
											
					//Calculating the standard deviations
					var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
					var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
									
					//Display the data of each sensor in one row
					displayForFF += "<tr><td class ='border'>" +  moteProcessedDataFF[i].sensorType + "  (" +  moteProcessedDataFF[i].unit + ") </td><td id='data' class ='border'>" +  moteProcessedDataFF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
										dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
							
					//Resetting variables
					dayTot = 0;
					dayPop = 0;
					weekTot = 0;
					weekPop = 0;
					dayReading = 0;
					dayReadMinMeanSqrt = 0;
					totDayReadMinMeanSqrt = 0;
					weekReading = 0;
					weekReadMinMeanSqrt = 0;
					totWeekReadMinMeanSqrt = 0;
				}
			}
			displayForFF += "</tbody></table></div>";
									
			//Handling the absence of data for one mote
			if (checkMoteIdFF.indexOf(firstFloor[n]) == -1){
				countFF++;
				displayForFF += "<div class='tables'  id='first" + countFF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + firstFloor[n] + "<br>NO DATA, Please check the device</p></div>"
			}
		}
	}
	//Populating the html table
	var div = document.getElementById("FFDisplay");
	div.innerHTML = div.innerHTML + displayForFF;
	displayForFF = ""
	return storeIdFF;
}


function displayAllTablesSF(){
	//Check of the data has been cleared and if so sets up new values
	if (checkClearSF == 1){
		displayForSF = "";
		checkClearSF = 0;
		storeIdSF = [];
		storeIdSF2 = [];
	}
	
	for (var n =0; n<secondFloor.length; n++){
		if (storeIdSF2.indexOf(secondFloor[n])== -1){
			storeIdSF2.push(secondFloor[n]);
			storeIdSF.push(secondFloor[n].toString());
			var motNum = "";
			var stamp = "";
			var motePlatform = "";
			
			for (var i=0; i<moteProcessedDataSF.length; i++){
				if (secondFloor[n] ==  moteProcessedDataSF[i].moteid){
									
					if (motNum == "" && stamp == ""){
						motNum = moteProcessedDataSF[i].moteid;
						stamp = moteProcessedDataSF[i].lastTimestamp;
						motePlatform = moteProcessedDataSF[i].platform;
						checkMoteIdSF.push(motNum);
						countSF++;										
												
						//Starting to build the data to be displayed as well as the head of the table
						displayForSF += "<div class='tables'  id='second" + countSF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + motNum + "<br>Mote Platform: " + motePlatform +"<br>Timestamp last reading: " + stamp + "</p><table style='width:80%' id='displayData'><tbody> \
										<tr><th class ='border'>Sensor Type</th><th class ='border'>Last Reading</th><th class ='border'>Mean Last 24hr</th><th class ='border'>STD Last 24hr</th><th class ='border'>Mean Last Week</th><th class ='border'>STD Last Week</th></tr>";
					}
											
					// Generating the data to calculate the means
					for (var j=0; j<moteProcessedDataSF[i].arrayValuesDay.length; j++){
						 dayTot += moteProcessedDataSF[i].arrayValuesDay[j];
						 dayPop = moteProcessedDataSF[i].populationDay; 									
					}
								
					for (var k=0; k<moteProcessedDataSF[i].arrayValuesWeek.length; k++){
						weekTot += moteProcessedDataSF[i].arrayValuesWeek[k];
						weekPop = moteProcessedDataSF[i].populationWeek; 
					}
											
					//Calculating the means										
					var dayMean = meanDay(dayTot, dayPop).toFixed(2);
					var weekMean = meanWeek(weekTot, weekPop).toFixed(2);
									
					// Generating the data to calculate the standard deviations
					for (var l=0; l<moteProcessedDataSF[i].arrayValuesDay.length; l++){
						dayReading =  moteProcessedDataSF[i].arrayValuesDay[l];
						dayReadMinMeanSqrt = (dayReading - dayMean) * (dayReading - dayMean);
						totDayReadMinMeanSqrt += dayReadMinMeanSqrt;
					}
											
					for (var m=0; m<moteProcessedDataSF[i].arrayValuesWeek.length; m++){
						weekReading =  moteProcessedDataSF[i].arrayValuesWeek[m];
						weekReadMinMeanSqrt = (weekReading - weekMean) * (weekReading - weekMean);
						totWeekReadMinMeanSqrt +=  weekReadMinMeanSqrt;
					}
											
					//Calculating the standard deviations
					var dayStd = stdDay(totDayReadMinMeanSqrt, dayPop).toFixed(2);
					var weekStd = stdWeek(totWeekReadMinMeanSqrt, weekPop).toFixed(2);
									
					//Display the data of each sensor in one row
					displayForSF += "<tr><td class ='border'>" +  moteProcessedDataSF[i].sensorType + "  (" +  moteProcessedDataSF[i].unit + ") </td><td id='data' class ='border'>" +  moteProcessedDataSF[i].lastValue +"</td><td id='data' class ='border'>" + dayMean + "</td><td id='data' class ='border'>" + 
										dayStd + "</td><td id='data' class ='border'>" + weekMean + "</td><td id='data' class ='border'>" + weekStd + "</td></tr>";
							
					//Resetting variables
					dayTot = 0;
					dayPop = 0;
					weekTot = 0;
					weekPop = 0;
					dayReading = 0;
					dayReadMinMeanSqrt = 0;
					totDayReadMinMeanSqrt = 0;
					weekReading = 0;
					weekReadMinMeanSqrt = 0;
					totWeekReadMinMeanSqrt = 0;
				}
			}
			displayForSF += "</tbody></table></div>";
									
			//Handling the absence of data for one mote
			if (checkMoteIdSF.indexOf(secondFloor[n]) == -1){
				countSF++;
				displayForSF += "<div class='tables'  id='second" + countSF + "'><hr class = 'line'><ul><li class= 'close' id = '"+ motNum + "' onclick = 'removeTable(this)'>&times;</li></ul><p> Mote ID: " + secondFloor[n] + "<br>NO DATA, Please check the device</p></div>"
			}
		}
	}
	//Populating the html table
	var div = document.getElementById("SFDisplay");
	div.innerHTML = div.innerHTML + displayForSF;
	displayForSF = "";
	return storeIdSF;
}

//Close the modal box with the close button
function closeIt() {
	document.getElementById('modal').style.display = "none";
};

// When the user clicks anywhere outside of the modal box it closes it
window.onclick = function(e) {
	var modal =document.getElementById('modal');
    if (e.target ==  modal) {
        modal.style.display = "none";
    }
};

//Remove the tables in the display
function removeTable(e) {
	var getParent = e.parentNode.parentNode;
	var id = getParent.getAttribute("id");
	document.getElementById(id).style.display = "none";
	var getId = e.getAttribute("id");
	var parsedId =parseInt(getId);
	
	if (storeIdGF.indexOf(getId) && storeIdGF.indexOf(parsedId)){
		storeIdGF = storeIdGF.filter(item=> item !== getId);
		storeIdGF2 = storeIdGF2.filter(item=> item !== parsedId);
	}
	
	if (storeIdFF.indexOf(getId) && storeIdFF.indexOf(parsedId)){
		storeIdFF = storeIdFF.filter(item=> item !== getId);
		storeIdFF2 = storeIdFF2.filter(item=> item !== parsedId);
	}
	
	if (storeIdSF.indexOf(getId) && storeIdSF.indexOf(parsedId)){
		storeIdSF = storeIdSF.filter(item=> item !== getId);
		storeIdSF2 = storeIdSF2.filter(item=> item !== parsedId);
	}
}

//reload the page every 5 minutes
setTimeout(function () {
      location.reload();
    }, 5 * 60 * 1000);

//Display the modal box on the first loading of the page and stops the modal box to be displayed on the reload of the page
function checkRefresh(){
	var now = new Date();
	var time = now.getTime();
	time += 310 * 1000;
	now.setTime(time);
	if( document.cookie.indexOf('mycookie')==-1 ) {
		document.cookie = 'mycookie=1; expires ="'+ now.toUTCString();	//Sets the cookie if this one does not exist
		
		//Text of the modal box
		var modBox ='<div class="modalcontent"><h2>MODDIS</h2>\
		<p>MODDIS (Mote Data DIsplay System) is a web application allowing the display of live data from motes (arrays of sensors) installed in the Insight building in Galway Ireland.</p>\
		<p>The application is divided in three components which represent the three floors of the Insight building. There is two ways to access those components, the first one is to use \
				the side menu on the top left corner of the screen, the second one is to use the tabs situated at the right of the side menu. A few seconds should be allowed when either loading\
				the page or switching between the floors for the first time to allow the data to be download and processed.</p>\
				<p>Each dot on the floor plans are buttons which represent each mote and their locations in the building. When hovering over one of the buttons, a textbox should appear and it \
				should display the mote id number, location and platform. When clicking on one of the buttons, the mote id number, location and timestamp of the last reading of each of the senors of the mote should appear at the \
				bottom of the page as well as a table displaying the sensor type, the last reading, the means and standard deviations for the last 24 hours and last week for each of the sensors in \
				the mote selected excepted if this one is lacking data. Each of the table can be removed by clicking in the top right corner of their own division, the tables removed can be \
				added back up by clicking on their corresponding buttons.</p>\
				<p>A table displaying the max values of each sensor types present on this floor can be found on the right side of each floor plan as a  legend explaining the colour scheme for\
				the mote status can be found under the tables.</p>\
				<p>Two buttons can be found under the floor plan, the first one (Display All Motes Data) will display all the data for each mote at the bottom of the screen, the second one (ClearAll) \
				will clear all the data at the bottom of the screen.</p>\
				<button id="button" onclick ="closeIt()">Close</button>\
			</div>';
		document.getElementById('modal').innerHTML = modBox; //displays the modal box
	}
	else {
		document.getElementById('modal').style.display = "none";	// stops the display of the modal box
		document.cookie = 'mycookie=1; expires =' + now.toUTCString();	//reset the cookie
	}
}