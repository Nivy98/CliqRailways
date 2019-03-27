var autocomplete = (function(){
	//datalist
	var stations = ["Chengalpattu", "Guduvancheri", "Urapakkam", "Vandalur", "Perungulathur", "Tambaram", "Meenambakkam", "Tirusulam", "Palavanthangal", "Guindy", "Kodambakkam", "Chennai Beach"];

	/**
	 * @param {Object} input_text The Dom object of input field
	 */
	var autocomplete = function(input_text) {

		var highlighted_text;
	
		input_text.addEventListener("input", function () {
	
			var normal_text;
			var	bold_text;
			var	input_value = this.value;
	
			clearStationsList();
	
			if (!input_value) { //prevent search for empty search box
				return false
			}
	
			highlighted_text = -1;
	
			//add css properties and set attributes for the items displaying in drop down  
			normal_text = document.createElement("DIV");
			normal_text.setAttribute("id", this.id + "list");
			normal_text.setAttribute("class", "autocomplete-items");
	
			this.parentNode.appendChild(normal_text);//appending the search items below searchbox
	
			for (var index = 0; index < stations.length; index++) {
	
				 //comparing input field value with stations array
				if (stations[index].substr(0, input_value.length).toUpperCase() == input_value.toUpperCase()) { 
	
					//bold text for matching characters
					bold_text = document.createElement("DIV");
					bold_text.innerHTML = "<b>" + stations[index].substr(0, input_value.length) + "</b>";
					bold_text.innerHTML += stations[index].substr(input_value.length);
					bold_text.innerHTML += "<input type='hidden' value='" + stations[index] + "'>";

					//display the selected item on textbox when mouse clicked          
					bold_text.addEventListener("click", function (e) {
						console.log(e, this.getElementsByTagName("input"));
						input_text.value = this.getElementsByTagName("input")[0].value;
	
						clearStationsList();
					});
					normal_text.appendChild(bold_text);//combine normal text properties with bold text
				}
			}
		});
	
		input_text.addEventListener("keydown", function (event) {
	
			var individual_item = document.getElementById(this.id + "list");
	
			if (individual_item != null) {// preventing the value from being null
	
				individual_item = individual_item.getElementsByTagName("div");
				if (event.keyCode == 40) {//move up
					highlighted_text++;
					highlightedFocus(individual_item);
				}
				else if (event.keyCode == 38) { //move down
					highlighted_text--;
					highlightedFocus(individual_item);
				}
				else if (event.keyCode == 13) { //on enter clicked
					event.preventDefault();
					if (individual_item) {
						if(highlighted_text == -1){
							individual_item[0].click();
						}
						else{
						individual_item[highlighted_text].click();
						}
					}
				}
			}
		});
	
		var highlightedFocus = function(item) {
	
			normalFocus(item);
	
			if (highlighted_text != null) {
	
				if (highlighted_text >= item.length) {
					highlighted_text = 0;
				}
				if (highlighted_text < 0) {
					highlighted_text = item.length - 1;
				}
	
				console.log(item[highlighted_text])
				item[highlighted_text].classList.add("autocomplete-active");//adding a css property via class autocomplete-active highlights the desired text	
			}
		}
	
		var normalFocus = function(item) {
			if (item != null) {
				for (var index = 0; index < item.length; index++) {
					item[index].classList.remove("autocomplete-active");//removing class removes the css property and hence the highlighted part is disappeared
				}
			}
	
		}
	
		var clearStationsList = function(ele) {
	
			var items = document.getElementsByClassName("autocomplete-items");
			for (var index = 0; index < items.length; index++) {
				if (ele != items[index] && ele != input_text) {
					items[index].parentNode.removeChild(items[index]); //removing previous searched items and updating the div based on new text entered
				}
			}
		}
	}

	var autoCompleteFromText = autocomplete(document.getElementById("from"))
	var autoCompleteToText = autocomplete(document.getElementById("to"));

	return {
		autoCompleteFromText,
		autoCompleteToText,
		stations
	}

})();




