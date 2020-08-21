let button = $('#dropdownButton');
let menu = $('#dropdownMenu');

/*Request dictionary*/
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {type:"dictReq"}, (response) => {
		ddDict = response;
	});
});

/*Function for creating a menu based on
 * currently visible tasks. Toggles
 * menu, assumes it is invisible to start
 */
function fillMenu(fMenu){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type:"getText"}, (response) => {
			var tasks = response.split(",");
			tasks.forEach(task => {
				let elem = "<p>".concat(task).concat("</p>");
				fMenu.append(elem);
			});
		});
	});

	fMenu.toggle();
}

button.on("click", (element) => {

	fillMenu(menu);

});

/*Handle task text being selected for first time*/
menu.on("click", (task) => {
	if (task.target.id!="dropdownMenu") {

		//remove menu
		menu.toggle();
		button.toggle();
		menu.contents().remove();

		//Set up selection menu
		$('#selectionMenu').toggle();
		$('#selection').append("<h1>".concat(task.target.textContent).concat("</h1>"));

		buildMenu(task.target.textContent);
	}
});
