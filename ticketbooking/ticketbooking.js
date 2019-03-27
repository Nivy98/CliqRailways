/** 
 * ticketbooking.js TicketBooking
 * @author nived <nived.m@zohocorp.com>
*/

var ticketbooking = (function() {

	//Initialise variables from DOM
	var	available_trains_table = document.getElementById("available_trains_table");
	var	all_trains_table = document.getElementById("all_trains_table");
	var	suggested_trains_table = document.getElementById("suggested_trains_table");
	var	available_trains_error = document.getElementById("available_train_error");
	
	var	boarding_point_dom; 
	var	destination_point_dom; 
	var	date_dom = document.getElementById("datepicker");
	var	passengers_dom; 
		
	var getCurrentUser = function() {

		var current_user;

		return  window.localStorage ?
				current_user = JSON.parse(localStorage.getItem("current_session")) || [] :
				alert("Oops! Your broswer does not support local storage");
	}
		
	document.getElementById("welcome_user").innerText = getCurrentUser().username;

	//Retrieve the trains list from local storage
	var getTrains = function() {
		var trainslist;

		return  window.localStorage ?
				trainslist = JSON.parse(localStorage.getItem("trains_list")) || [] :
				alert("Oops! Your broswer does not support local storage");
	}

	//Error handler for from station input field
	var boardingDomError = function () {
		
		var boarding_point_error = document.getElementById("from_error");
		var stations_length = autocomplete.stations.length;

		for (var index = 0; index < stations_length; index++) {

			if ( boarding_point_dom.toLowerCase() == autocomplete.stations[index].toLowerCase() ) {
				boarding_point_error.style.display = "none";
				return true;
			}
		}
		boarding_point_error.style.display = "block";
		return false;  
	}
		
	//Error handler for to station input field
	var destinationDomError = function () {

		var	destination_point_error = document.getElementById("to_error");
		var stations_length = autocomplete.stations.length;

		for (var index = 0; index < stations_length; index++) {

			if ( destination_point_dom.toLowerCase() == autocomplete.stations[index].toLowerCase() ) {
				destination_point_error.style.display = "none";
				return true;	
			}
		}
		destination_point_error.style.display = "block";
		return false;
	}

	//Error handler for from station and to station input field
	var samePlacesDomError = function () {
		
		var from_to_error = document.getElementById("fromto_error");

		if(boarding_point_dom == destination_point_dom) {	
			from_to_error.style.display = "block";
			return false;
		}
		else {
			from_to_error.style.display = "none";
			return true;
		}

	}

	//Error handler for date input field
	var dateDomError = function () {

		var date_error = document.getElementById("date_error");

		if(date_dom.value == "") {

			date_error.style.display = "block";
			return false
		}
		date_error.style.display = "none";
		return true;
	}

	//Error handler for passengers input field
	var passengersDomError = function () {
		var passengers_error = document.getElementById("passenger_error");
		
		if(passengers_dom >= 1 && passengers_dom <= 6) {
			passengers_error.style.display = "none";	
			return true;
		}
		else {
			passengers_error.style.display = "block";		
			return false;
		}
	}

	/**
	 * Displays the current date
	 */
	var currentDatePicker = function () {

		var current_date = new Date();
		var month = current_date.getUTCMonth()+1;
		var year = current_date.getUTCFullYear();
		var day = current_date.getUTCDate()

		if (month < 10) {
			month = "0" + month;
		}

		date_dom.defaultValue = year + "-" + month + "-" + day;
		date_dom.min = year + "-" + month + "-" + day;
	}

	//Validate all input fields
	var validateBookingPage = function() {

		available_trains_table.style.display="none";

		if ( boardingDomError() && destinationDomError() && samePlacesDomError() && dateDomError() && passengersDomError() ) {

			clearErrors();
			available_trains_table.style.display="none";
			return true;
			}

		else {
			return false;
		}	
	}

	/**
	 * ticketbooking.findTrains
	 * The boarding station,reaching station and destination station of all trains is compared with user input.
	 * The list of trains matching all three data is displayed as Available trains.
	 * The list matching only two data boarding station and reaching station is displayed as Suggested trains.
	 */

	/**
	 * Deletes the previous table data when switching between available trains and sugested trains
	 */

	var deleteTableData = function () {
		document.querySelectorAll("td").forEach(e => e.parentNode.removeChild(e));
	}
	
	/**
	 * Search for trains matching user input
	 * If boarding point, destination point and journey date matches show available trains
	 * If boarding point and destination point only matches show suggested trains
	 */
	var findTrains = function() {	
		
		//close already opened tables
		all_trains_table.style.display = "none";
		suggested_trains_table.style.display = "none";
		deleteTableData();

		var trainslist = getTrains();
		boarding_point_dom =  document.getElementById("from").value;
		destination_point_dom =  document.getElementById("to").value;
		passengers_dom = document.getElementById("passenger_count").value;
		
		if(validateBookingPage()) {
			
			var flagBoarding;
			var flagDestination;
			var finalDOJ = false;
			var boarding_time_index;
			var destination_time_index;
			var min_tickets;
			var train_DOJ;
			var user_date = new Date(date_dom.value);

			for(var trainIndex in trainslist) {

				flagBoarding = false;
				flagDestination = false;	
				min_tickets = 30;
				train_DOJ = new Date (trainslist[ trainIndex ].journey_date)

				for ( var routeIndex in trainslist[ trainIndex ].route ) {

					//Compare available boarding places in trainslist with user entered boarding place
					if ( trainslist[ trainIndex ].route[ routeIndex ].station.toLowerCase() == boarding_point_dom.toLowerCase() ) {

							//Matched index of boarding station
							boarding_time_index = routeIndex;
							flagBoarding = true;
					}
		
					if( flagBoarding == true ) {

						//Compare available destination places in trainslist with user entered destination places
						if ( trainslist[ trainIndex ].route[ routeIndex ].station.toLowerCase() == destination_point_dom.toLowerCase() ) {

							//Matched index of destination station
							destination_time_index = routeIndex;
							flagDestination = true;
						}
					}

					if(flagDestination == true) {

						for ( var index = boarding_time_index; index < destination_time_index ;index++) {
							
							//finding minimum tickets available in stations
							if ( min_tickets > trainslist[ trainIndex ].route[ index ].tickets ) {
								min_tickets = trainslist[ trainIndex ].route[ index ].tickets
							}
						}

						//Compare the train's journey date with user entered date
						if(train_DOJ.toDateString() == user_date.toDateString()) {

							//Create available trains table that matches user's input
							createAvailableTrainsTable(trainslist[trainIndex],boarding_time_index,destination_time_index,min_tickets);
							finalDOJ = true;
							break;
						}
						else{

							//Create suggested trains table for user's input
							createSuggestedTrainsTable(trainslist[trainIndex],boarding_time_index,destination_time_index,min_tickets);
							break;
						}
					}
				}
			}	

			//Display available trains if finalDOJ is true or suggested trains if finalDOJ is false
			if(finalDOJ == false) {

				available_trains_table.style.display = "none";
				all_trains_table.style.display = "none";
				available_trains_error.style.display = "block";
				suggested_trains_table.style.display = "block";	

			}	
		}
	}

	/**
	 * ticketbooking.createAvailableTrainsTable
	 * @param {Object} train complete list of trains
	 * @param {Number} arrival_time boarding station index
	 * @param {Number} reaching_time destination station index
	 * @param {Number} min_tickets minimum tickets between stations
	 */
	var createAvailableTrainsTable = function(train,arrival_time,reaching_time,min_tickets) {
		
		available_trains_error.style.display = "none";
		available_trains_table.style.display = "block";
		document.getElementById("arrive_at").innerText = boarding_point_dom;
		document.getElementById("destination_at").innerText = destination_point_dom;
		available_trains_table.insertAdjacentHTML ("beforeend", "<tr><td>" + train.train_no + "</td><td>" +train.train_name + "</td><td>" + train.route[arrival_time].time + "</td><td>"+train.route[reaching_time].time + "</td><td ><center><span id = seatof" + train.train_no + ">" + min_tickets + "</span><span style='padding:12px;'></span><button id=" + train.train_no + ">Book</button></center></td></tr>");
	}

	/**
	 * ticketbooking.createSuggestedTrainsTable
	 * @param {Object} train complete list of trains
	 * @param {Number} arrival_time boarding station index
	 * @param {Number} reaching_time destination station index
	 * @param {Number} min_tickets minimum tickets between stations
	 */
	var createSuggestedTrainsTable = function(train,arrival_time,reaching_time,min_tickets) {

		document.getElementById( "suggested_arrive_at" ).innerText = boarding_point_dom;
		document.getElementById( "suggested_destination_at" ).innerText = destination_point_dom;
		suggested_trains_table.insertAdjacentHTML( "beforeend", "<tr><td>" + train.train_no + "</td><td>"+train.train_name + "</td><td>"+new Date(train.journey_date).toDateString() + "</td><td>"+train.route[arrival_time].time + "</td><td>" + train.route[reaching_time].time + "</td><td ><center><span id = seatof" + train.train_no+ ">" + min_tickets + "</span><span style='padding:12px;'></span><button id=" + train.train_no + ">Book</button></center></td></tr>");

	}

	/**
	 * ticketbooking.createAllTrainsTable
	 * Displays all the available trains that are stored in local storage
	 */
	var createAllTrainsTable = function () {
		clearErrors();
		available_trains_error.style.display = "none";
		available_trains_table.style.display="none";
		suggested_trains_table.style.display = "none";
		all_trains_table.style.display = "block";
		deleteTableData();
		var trainslist = getTrains();

		for(var index = 0;index < trainslist.length ;index++){
			all_trains_table.insertAdjacentHTML( "beforeend", "<tr><td>"+trainslist[index].train_no+"</td><td>"+trainslist[index].train_name+"</td><td>"+new Date(trainslist[index].journey_date).toDateString()+"</ctd><td>"+trainslist[index].route[0].station+"</td><td>"+trainslist[index].route[trainslist[index].route.length - 1].station+"</td></tr>" );		
		}
	}

	/**
	 * 
	 * @param {String} booked_ticket_train_no 
	 * @param {String} booked_ticket_train_name 
	 * @param {Date Object} booked_ticket_train_DOJ 
	 * @param {String} booked_ticket_train_boarding 
	 * @param {String} booked_ticket_train_reaching 
	 * @param {Number} booked_ticket_train_tickets 
	 * Constructor for storing the booked tickets info in current_user object
	 */
	function BookedTickets(booked_ticket_train_no,booked_ticket_train_name,booked_ticket_train_DOJ,booked_ticket_train_boarding,booked_ticket_train_reaching,booked_ticket_train_tickets){

		this.booked_ticket_train_no = booked_ticket_train_no;
		this.booked_ticket_train_name = booked_ticket_train_name;
		this.booked_ticket_train_DOJ = booked_ticket_train_DOJ;
		this.booked_ticket_train_boarding = booked_ticket_train_boarding;
		this.booked_ticket_train_reaching = booked_ticket_train_reaching;
		this.booked_ticket_train_tickets = booked_ticket_train_tickets;
	}

	/**
	 * assigining train info and travel info in current users object
	 * @param {Object} selected_train 
	 * @param {Number} boarding_point_index 
	 * @param {Number} destination_point_index 
	 */
	var getBookedTicketsInfo = function(selected_train,boarding_point_index,destination_point_index){

		var current_user = getCurrentUser();
		var booked_ticket_train_no = selected_train.train_no;
		var booked_ticket_train_name = selected_train.train_name;
		var booked_ticket_train_DOJ = selected_train.journey_date;
		var booked_ticket_train_boarding = selected_train.route [boarding_point_index].station;
		var booked_ticket_train_reaching = selected_train.route [destination_point_index].station;
		var booked_ticket_train_tickets = passengers_dom;
		console.log(current_user.booked_tickets);
		current_user.booked_tickets.push(new BookedTickets(booked_ticket_train_no,booked_ticket_train_name,booked_ticket_train_DOJ,booked_ticket_train_boarding,booked_ticket_train_reaching,booked_ticket_train_tickets));
		localStorage.setItem("current_session",JSON.stringify(current_user));
	}

	/**
	 * @param {String} selected_train_no 
	 * Selected train no is the key value.
	 * When a button is clicked the train number is passed as key
	 */
	var bookTickets = function(selected_train_no){
		
		var selected_seat = document.getElementById("seatof"+selected_train_no);
		var selected_train = {};
		var selected_index = 0;
		var min_tickets = 30;
		var	flagBoarding = false;
		var	flagDestination = false;
		var	flagTickets = true;
		var	finalFlag = false;
		var	boarding_point_index;
		var	destination_point_index;
		var trainslist = getTrains();

			//Retrieve the selected train and store it in a new object
			for ( var trainIndex in trainslist ) {

				//Compare selected train number with available train numbers
				if ( trainslist[trainIndex].train_no == selected_train_no ) {
					selected_train = trainslist[trainIndex];
					selected_index = trainIndex;
					break;
				}
			}
			
			//Retrieve the boarding and reaching point of a train to handle the tickets booked
			for(var routeIndex in selected_train.route) {

				//Break after finding the boarding and reaching stations
				if(finalFlag == true) {
					break;
				}
				else {

					//Finding the boarding point index from the route of selected train
					if ( selected_train.route[ routeIndex ].station == boarding_point_dom ) {

						boarding_point_index = routeIndex;
						flagBoarding = true;
					}
					if ( flagBoarding == true ) {

						if ( selected_train.route[ routeIndex ].station == destination_point_dom ) {
							destination_point_index = routeIndex; 
							flagDestination = true;
						}
					}
					if ( flagDestination == true ) {

						//Reduce the tickets from boarding station to destination station
						for ( var index = boarding_point_index; index < destination_point_index; index++) {

							if(selected_train.route[index].tickets  > 1) {

								if(selected_train.route[index].tickets < passengers_dom) {

									alert("Only "+selected_train.route[index].tickets+" tickets available");
									break;
								}
								else {
									//Reduce the tickets in every train
									selected_train.route[index].tickets = selected_train.route[index].tickets - passengers_dom ;
									//Show the minimum tickets present in the booking page
									if ( min_tickets > selected_train.route[ index ].tickets ) {
										min_tickets = selected_train.route[ index ].tickets;
									}
									selected_seat.innerText = min_tickets;
									selected_seat.style.color = "green";
								}
							}
							else {
								//If tickets are full display in red color
								selected_train.route[index].tickets = 0;
								selected_seat.innerText = "FULL";
								selected_seat.style.color = "red";
								flagTickets = false;
								break;
							}
						}
						//make flag true after finding the boarding and destination index
						finalFlag =true;
						getBookedTicketsInfo(selected_train,boarding_point_index,destination_point_index)
						break;
					}
				}
			}	
			if ( flagTickets ) {

				var current_user = getCurrentUser();
				//current_user.booked_tickets.no = Number(current_user.booked_tickets) + Number(passengers_dom);
				localStorage.setItem("current_session",JSON.stringify(current_user));
				window.location.href = "C:\Users\Nived\Downloads\Cliq Railways Update 5\booked_tickets\booked_tickets.html";
			}
			trainslist[ selected_index ] = selected_train;
			
			localStorage.setItem("trains_list",JSON.stringify(trainslist));	
	}	

	var refillSeats = function() {

		var trainslist = getTrains();
		for(var index=0;index < trainslist.length; index++) {
			for(var routeIndex = 0; routeIndex < trainslist[index].route.length; routeIndex++){
			trainslist[index].route[routeIndex].tickets = 30;
			}
		}
		localStorage.setItem("trains_list",JSON.stringify(trainslist));
	}

	var clearErrors = function() {
		var boarding_point_error = document.getElementById("from_error");
		var	destination_point_error = document.getElementById("to_error");
		var from_to_error = document.getElementById("fromto_error");
		var date_error = document.getElementById("date_error");
		var nop_error = document.getElementById("passenger_error");

		boarding_point_error.style.display = "none";
		destination_point_error.style.display ="none";
		from_to_error.style.display ="none";
		date_error.style.display = "none";
		nop_error.style.display = "none";
	}
	
	
	//logout handler
	var logout = function (){
		var current_user = getCurrentUser();
		current_user.login_session = false;
		window.location.href =  "../login/login.html";
	}

	/**
	 * Refresh dates of trains based on today's date
	 */
	var refreshDates =function(){

		var train_date_today;
		var trainslist = getTrains();

		for(var trainIndex in trainslist){
			if(trainIndex <= 3){
				train_date_today = new Date();
				trainslist[trainIndex].journey_date = train_date_today;
			}
			if(trainIndex > 3 && trainIndex <=7){
				train_date_today = new Date();
				train_date_today.setDate(train_date_today.getDate() + 1);
				trainslist[trainIndex].journey_date = train_date_today;
			}
			if(trainIndex > 7 && trainIndex <=11){
				train_date_today = new Date();
				train_date_today.setDate(train_date_today.getDate() + 2);
				trainslist[trainIndex].journey_date = train_date_today;
			}
		}
		localStorage.setItem("trains_list",JSON.stringify(trainslist));
	
	}

	
	/**
	 * Event listener for all click functions
	 */
	document.addEventListener("click",function(e) {

		var selected_train_no;

		if(e.target.id == "find_trains") {
			ticketbooking.findTrains();
		}
		else if(e.target.innerText == "Book" ) {
			selected_train_no = e.target.id;
			ticketbooking.bookTickets(selected_train_no);
		}
		else if(e.target.id == "switch_stations") {
			
			var temp_switch;
			temp_switch = document.getElementById("from").value;
			document.getElementById("from").value = document.getElementById("to").value;
			document.getElementById("to").value = temp_switch;
			e.preventDefault();
		}
		else if(e.target.id == "datepicker") {
			ticketbooking.currentDatePicker();		
		}
		else if(e.target.id == "all_trains") {
			ticketbooking.createAllTrainsTable();
		}
		else if(e.target.id == "logout") {
			ticketbooking.logout();
		}
		e.stopPropagation();
	});

	return {
		findTrains,
		createAllTrainsTable,
		currentDatePicker,
		bookTickets,
		getTrains,
		//refillSeats,
		createSuggestedTrainsTable,
		logout,
		//refreshDates
	}
})();







