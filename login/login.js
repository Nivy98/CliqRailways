/** 
 * login.js TicketBooking
 * @author nived <nived.m@zohocorp.com>
*/

//Module Pattern
var login = (function(){
	
	//initialise dom objects
	var login_usermail_dom = document.getElementById("login_usermail");
	var	login_error_dom = document.getElementById("login_error");
	var	login_password_dom = document.getElementById("login_password");

	//retrieve existing users from local storage
	var getExistingUsers = function () {

		var existing_users;
		
		return  window.localStorage ?
				existing_users = JSON.parse(localStorage.getItem("user_details")) || [] :
				alert("Oops! Your Browser doesn't support local storage");	
	}
	
	// Login a User
	var executeLogin = function() {

		var registered_users = getExistingUsers();

		//Validate Input and take user to ticket booking page
		if(validateLogin()) {

			for (var user in registered_users) {
								
				//Validating existing Email and Password
				if (login_usermail_dom.value == registered_users[user].email && login_password_dom.value == registered_users[user].password) {

					registered_users[user].login_session =  true;
					localStorage.setItem("current_session",JSON.stringify(registered_users[user]));
					return true;
				} 
			}
			return false;
		}
	}
		
	//Validates login page credentials and returns false if data is invalid
	var validateLogin = function() {

		return  ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login_usermail_dom.value) && 
				login_password_dom.value.length >= 8 );
	}

	//Event delegation for click events
	document.addEventListener("click",function(e) {

		if (e.target.id == "login_button") {

			if (login.executeLogin()) {

				login_error_dom.style.display = "none";
				window.location.href = "../ticketbooking/ticketbooking.html";

			} else {

				login_error_dom.style.display = "block";
			}

		} else if (e.target.id == "register_button") {

			window.location.href = "../signup/signup.html"
		}
		e.stopPropagation();
	});

	return {

		executeLogin,
	}

})();









