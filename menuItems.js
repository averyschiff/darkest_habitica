let back = $('#backButton');

function menuItem(text, prev, dict=orgDict){
	this.text = text;
	this.prev = prev;
	this.dict = dict;
}

var root = new menuItem("Dialogue menu", null);

/*Check if a file is a wav file */
function wavCheck(dict, key){
	return dict[key].toString().slice(-4) == '.wav'
}

/*Check if a take/file pairing already exists
 * in the dictionary */
function ddDictCheck(task, dict, key){
	return task.trim() in ddDict && ddDict[task.trim()].indexOf(dict[key].toString().trim())!=-1
}

/*Recursively checks if the dictionary
 * has an activated file. */
function checkForActive(task, dict){

	let promiseList = [];

	return promise = new Promise((resolve, reject) => {


		for (let k in dict){

			//check if file
			if (wavCheck(dict, k)){
				if (ddDictCheck(task, dict, k)){
					promiseList.push(Promise.resolve(true)); //active
				} else {
					promiseList.push(Promise.resolve(false)); //inactive
				}

			//else recursively search
			} else {

				promiseList.push(checkForActive(task, dict[k]));
			}
		}

		//Wait for search to complete, check for trues
		Promise.all(promiseList).then((res) => {
			for (r in res){
				if (res[r]==true){
					resolve(true);
				}
			}
			resolve(false);
		});
	});
}

/*Create a menu for navigating
 * at a level of the dictionary.
 * Should include all paths from that level
 * and a back button. Sound files have
 * a sample button as well.
 */
function buildMenu(task, base=root){

	let dict = base.dict;
	let prev = base.prev;
	let buttons = $('#buttons');
	let selection = $('#selection');
	let menu2 = $('#dropdownMenu2');
	let htmlString;

	/*Construct initial menu, including
	 * checks for whether files are active
	 */
	for (let key in dict){
		if (wavCheck(dict, key)){
			if (ddDictCheck(task, dict, key)){
				htmlString = "<div class=\"voiceFile selectedFile\">"
					.concat(key)
					.concat("<div class=\"soundBtn\"><img src=\"images/playBtn.jpg\"></img></div>")
					.concat("</div>");
			} else {
				htmlString = "<div class=\"voiceFile\">"
					.concat(key)
					.concat(
					"<div class=\"soundBtn\"><img src=\"images/playBtn.jpg\"></img></div>")
					.concat("</div>");
			}
			buttons.append(htmlString);
		} 
		else {
			checkForActive(task, dict[key]).then((res) => {
				if (res){
					htmlString = "<div class=\"selectionButton\" style=\"border-color: blue;\">"
						.concat(key)
						.concat("</div>");
				} else {
					htmlString = "<div class=\"selectionButton\">"
						.concat(key)
						.concat("</div>");
				}
				buttons.append(htmlString);
			});
		}
	}


	/*****************
	Event listeners
	****************/

	//Clicks within menu items
	buttons.toggle();
	buttons.unbind('click');
	buttons.on('click', (button) => {

		//Next layer down, recursively creates next menu
		if (button.target.className=='selectionButton'){
			let category = button.target.textContent;
			buttons.contents().remove();
			buttons.toggle();
			buildMenu(task, new menuItem(category, base, dict[category]));

		//Sound button for sampling
		} else if ($(button.target).is('img')){
			let soundFile = dict[button.target.parentNode.parentNode.textContent];
			let audio = new Audio("DDVO/".concat(soundFile));
			audio.play();

		//File that has been selected
		} else if ($(button.target).hasClass("selectedFile")) {
			console.log(button.target.textContent);
			removeFile(task, dict[button.target.textContent]);
			$(button.target).removeClass('selectedFile');

		//File that has not been selected
		} else if ($(button.target).hasClass("voiceFile")){
			addFile(task, dict[button.target.textContent]);
			$(button.target).addClass('selectedFile');
		}
	});

	//Changing the centered task
	selection.unbind('click');
	selection.on('click', (evt) => {
		fillMenu(menu2);

		//Check for new task selection
		menu2.one("click", (task) => {
			console.log('clicked');
			if (task.target.id!="dropdownMenu") {

				buttons.contents().remove();
				buttons.toggle();

				menu2.toggle();
				menu2.contents().remove();

				selection.contents().remove();
				$('#selection').append("<h1>".concat(task.target.textContent).concat("</h1>"));

				buildMenu(task.target.textContent, base);
			}
		});
	});

	//Back button
	back.unbind('click');
	if (prev){
		back.on('click', (button) => {
			buttons.contents().remove();
			buttons.toggle();
			buildMenu(task, prev);
		});
	}
}

/*Add a file to the internal storage's dictionary*/
function addFile(task, file){
	chrome.storage.sync.get(task, (res) => {
		let newKey = {};
		if (res[task]) {
			res[task].push(file);
			newKey[task] = res[task];
		} else {
			newKey[task] = [file];
		}
		chrome.storage.sync.set(newKey);
	});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "dictAdd", newFile: file, t: task}, (response) => {
			ddDict = response;
		});
	});
}

/*Remove a file from the internal storage's dictionary*/
function removeFile(task, file){
	chrome.storage.sync.get(task, (res) => {
		let newKey = {};
		let index = res[task].indexOf(file);
		res[task].splice(index, 1);
		newKey[task] = res[task];
		chrome.storage.sync.set(newKey);
	});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "dictRem", newFile: file, t: task}, (response) => {
			ddDict = response;
		});
	});
}
