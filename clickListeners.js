function negHabClick(){
	$(".task-control.habit-control.habit-control-negative-enabled").off();
	$(".task-control.habit-control.habit-control-negative-enabled").on('click', (task) => {
		console.log(task.target.parentNode.parentNode.parentNode.querySelector("p"));
		try{
			var taskName = task.target.parentNode.parentNode.parentNode.querySelector("p");
			var title = taskName.textContent;
		}catch(err){
			console.log('There was an error with the text');
			var title = 'Bad generic';
		}
		ddResponse(title, "Bad generic");
	});

}

function posHabClick(){

	$(".task-control.habit-control.habit-control-positive-enabled").off();
	$(".task-control.habit-control.habit-control-positive-enabled").on('click',(task) => {
		try{
			var taskName = task.target.parentNode.parentNode.parentNode.querySelector("p");
			var title = taskName.textContent;
		}catch(err){
			console.log('There was an error with the text');
			var title = 'Generic';
		}
		ddResponse(title, "Generic");
	});
}

function taskClick(){

	$(".task-control.daily-todo-control").off();
	$(".task-control.daily-todo-control").on('click',(task) => {
		try{
			var taskName = task.target.parentNode.parentNode.parentNode.querySelector("p");
			var title = taskName.textContent;
		}catch(err){
			console.log('There was an error with the text');
			var title = 'Generic';
		}
		ddResponse(title, "Generic");
	});

}
