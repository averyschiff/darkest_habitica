/* Always reload the options selected
 * by the user, expand default dictionary.
 */
chrome.storage.sync.get(null, function(items) {
	var allKeys = Object.keys(items);
	allKeys.forEach(key => {
		chrome.storage.sync.get(key, (res) => {
			ddDict[key.trim()] = res[key];
		});
	});
});

/* Create event listeners for tasks
 * and habits. Refreshes the listeners
 * every second to avoid issues with loading pages
 */
window.addEventListener("load", () =>{

	setInterval( () => {

		negHabClick();
		posHabClick();
		taskClick();
		
	}, 1000);
	
});

/*Retrieve list of currently visible tasks*/
/*Returns list of titles as array */
function getTaskNames() {

	let tasks = document.querySelectorAll(".task-title:not(.reward-content)"); //exclude rewards
	var titles = new Array (tasks.length);

	for (var i=0; i<tasks.length; i++){
		titles[i] = tasks[i].textContent;
	}

	return titles;
}

/*Messsage handler*/
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		let task;
		switch(message.type) {

			//Get list of tasks
			case "getText":
				var titles = getTaskNames();
				sendResponse(titles.toString());
				break;

			//Add entry to the dictionary
			case "dictAdd":
				task = message.t.trim();

				//check if key exists
				if (task in ddDict){
					ddDict[task].push(message.newFile);
				} else {
					ddDict[task] = [message.newFile];
				}

				sendResponse(ddDict);
				break;

			//Remove entry from the dictionary
			case "dictRem":
				task = message.t.trim();
				let index = ddDict[task].indexOf(message.newFile);
				ddDict[task].splice(index, 1);
				sendResponse(ddDict);
				break;

			//Request entire dictionary
			case "dictReq":
				sendResponse(ddDict);
				break;
		}
	}
);
