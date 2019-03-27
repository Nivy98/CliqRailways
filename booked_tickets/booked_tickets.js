
var booked_tickets = (function(){

	var current_user = JSON.parse(localStorage.getItem("current_session"))
	document.getElementById("booked_page_username").innerText = current_user.username;
	var booked_tickets_table = document.getElementById("booked_tickets_table");

	var bookAgain = function(){
		window.location.href = "../ticketbooking/ticketbooking.html";
	}
	
	var logOut = function(){
		current_user.login_session = false;
		window.location.href =  "../login/login.html";
	}

	var createBookedTicketsTable = function(){

		for(var row in current_user.booked_tickets){
			booked_tickets_table.insertAdjacentHTML("beforeend","<tr><td>" + current_user.booked_tickets[row].booked_ticket_train_no +"</td> <td>" + current_user.booked_tickets[row].booked_ticket_train_name +"</td> <td>" + new Date(current_user.booked_tickets[row].booked_ticket_train_DOJ).toDateString() +"</td> <td>" + current_user.booked_tickets[row].booked_ticket_train_boarding +"</td> <td>" + current_user.booked_tickets[row].booked_ticket_train_reaching +"</td> <td>" + current_user.booked_tickets[row].booked_ticket_train_tickets +"</td></tr>");
		}
	}
		
	document.addEventListener("click",function(e){
	
		if(e.target.id == "book_again_button") {
			bookAgain();
		}	
		else if(e.target.id == "booked_tickets_logout") {
			logOut();
		}
		e.stopPropagation();
	});
	
	return {
		bookAgain,
		logOut,
		createBookedTicketsTable,
	}
})();

booked_tickets.createBookedTicketsTable();
