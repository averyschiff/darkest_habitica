/* Return a random int up to x */
var randomInt = function(x) {
	return Math.floor(Math.random() * x);
}

/* Select a random voice file
 * based on the task and play it
 */
var ddResponse = function(task, goodBad) {

	//Create promise of randomly selected file
	const weighted = new Promise((resolve, reject) => {
		var options = ddDict[goodBad]
		if (task in ddDict){
			var taskSpec = ddDict[task];
			var weight = 100;
			for (i = 0; i<weight; i++){
				options = options.concat(taskSpec);
			}
		}
		resolve(options);
	});
	
	//Play selected file
	weighted.then((options) => {
		var file = "DDVO/".concat(options[randomInt(options.length)]);
		var audio = new Audio(chrome.extension.getURL(file));
		audio.play();
	});

}
