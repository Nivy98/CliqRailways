/** 
 * signup.js TicketBooking
 * @author nived <nived.m@zohocorp.com>
*/

// Module pattern
var signup = (function() {

	//localise globals
	var	username_input_field = document.getElementById("username");
	var	email_input_field = document.getElementById("email");
	var	password_input_field = document.getElementById("password");
	var	confirm_password_input_field = document.getElementById("confirm_password");
	var	age_input_field = document.getElementById("age");
	var	phone_input_field = document.getElementById("phone");
	var	gender_input_field = document.getElementById("gender");

	//checks for valid username and returns false if data is invalid
	var validateName = function() {

		return username_input_field.value.match(/\d+/g) ;
	}

	//checks for valid email and returns false if data is invalid
	var validateMail = function () {

		return /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_input_field.value) 			
	}

	//checks whether user is already present or not and returns false if data is invalid
	var validateRegisteredMail = function() {

		var existing_users = getExistingUsers();

		for ( var index = 0; index < existing_users.length; index++ ) {
			if(existing_users[index].email == email.value) {
				return false;
			}
		}
		return true;
	}

	//checks for valid password and returns false if data is invalid
	var validatePassword = function () {

		return  password_input_field.value.length >= 8 
	}

	//checks for password match and returns false if data is invalid
	var validateConfirmPassword = function() {

		return confirm_password_input_field.value == password_input_field.value 
	}

	//checks for valid age and returns false if data is invalid
	var validateAge = function () {

		return  age_input_field.value != "" ||age_input_field.value >= 3 && age_input_field.value <= 120
	}

	//checks for valid phone number and returns false if data is invalid
	var validatePhone = function () {

		return !isNaN(phone.value) && phone.value.length == 10 
	}

	//retrieve registered users data from local storage
	var getExistingUsers = function() {

		var existing_users;	
		return window.localStorage ?
				existing_users = JSON.parse ( localStorage.getItem("user_details") ) || [] :
				alert ("Oops! Your Browser does not support local storage");
	}

	var validateSignUp = function() {

		var username_error = document.getElementById("username_error");
		var mail_error=document.getElementById("email_error");
		var password_error = document.getElementById("password_error");
		var confirm_password_error = document.getElementById("confirm_password_error");
		var age_error=document.getElementById("age_error");
		var phone_error=document.getElementById("phone_error");
		var already_reg_error = document.getElementById("already_registered_error");

		//Validate User credentials and display errors if any
		if (validateName()) {

			username_error.style.display = "none";
		} 
		else {

			username_error.style.display = "block";
			return false;
		}

		if (validateMail()) {

			mail_error.style.display = "none";
		}
		else {
			mail_error.style.display = "block";
			return false;
		}

		if(validateRegisteredMail()){
			already_reg_error.style.display = "none";
		} 
		else {
			already_reg_error.style.display = "block";
			return false;
		}

		if (validatePassword()) {
			password_error.style.display = "none";
		}
		else {
			password_error.style.display = "block";
			return false;
		}

		if (validateConfirmPassword()) {
			confirm_password_error.style.display = "none";
		} 
		else {
			confirm_password_error.style.display = "block";
			return false;
		}

		if (validatePhone()) {
			phone_error.style.display = "none";
		}
		else {
			phone_error.style.display = "block";
			return false;
		}

		if (validateAge()) {
			age_error.style.display = "none";
		} 
		else {
			age_error.style.display = "block";
			return false;
		}

		return true;
	}

	//Constructor
	function User(username,email,password,age,phone,gender,login_session,booked_tickets){

	this.username = username;
	this.email = email;
	this.password = password;
	this.age = age;
	this.phone = phone;
	this.gender = gender;
	this.login_session = login_session;
	this.booked_tickets = booked_tickets;
	}
		
	//Retrieve signup data from text field
	var executeSignUp = function(){

		//store existing users in an array
		var existing_users = getExistingUsers();
		var username = username_input_field.value;
		var	email = email_input_field.value;
		var	password = password_input_field.value;
		var	age = age_input_field.value;
		var	phone = phone_input_field.value;
		var	gender = gender_input_field.value;
		var	login_session = true;
		var	booked_tickets = [];
		
		//validate the user entered signup details
		if(validateSignUp()) {

			existing_users.push( new User (username, email, password, age, phone, gender, login_session, booked_tickets) );
			localStorage.setItem("user_details", JSON.stringify(existing_users));
			localStorage.setItem("current_session",JSON.stringify (new User (username, email, password, age, phone, gender, login_session, booked_tickets) ) );
			clearInputTextFields();
			alert("Registration Successful");
			window.location.href = "../ticketbooking/ticketbooking.html";	
		}
	}

	//Empty the input text box
	var clearInputTextFields = function() {
		window.location.href = "../signup/signup.html"
	}

	//Event delegation for click events
	document.addEventListener( "click", function(e) {
		//Invoke respective functions on button click
		if ( e.target.id == "signup_button" ) {
			signup.executeSignUp();
		}
		else if( e.target.id == "clear_button" ) {
			signup.clearInputTextFields();
		}
		e.stopPropagation();
	});

	return {
		executeSignUp,
		clearInputTextFields
	}

})();













