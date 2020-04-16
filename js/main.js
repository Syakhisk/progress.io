$(document).ready(function () {
	// $("#mdl-taskMgr").modal("show");
	// $("#mdl-createProject").modal("show");
});

$(document).ready(function () {
	// $("#mdl-taskMgr").modal("show");
	// $("#mdl-createProject").modal("show");
});

/*-----GLOBAL VARIABLE AND CONSTANTS----- */

var ProjectList = [];
var selectedProject;
var progressProject;

const dropdownTask = document.getElementById("DDTask");
const list = document.querySelector(".l-task");
const listMain = document.querySelector("#l-main");
const buttonAddTask = document.querySelector("#btn-addTask");
const buttonSaveProject = document.querySelector("#btn-saveProject");
const buttonTaskManager = document.getElementById("btn-taskMgr");
const buttonDone = document.getElementById("btn-done");
const percentage = document.querySelector(".label-percentage");
const progress = document.querySelector(".label-progress");

/*----------------------- */

/*----- FUNCTIONS ----- */

function Project(name) {
	var today = new Date();
	var hr = today.getHours();
	var min = today.getMinutes();

	this.name = name;
	this.start = hr + ":" + min;
	this.tasks = [];
	this.status = 1;
	this.addToTask = function (val) {
		var parsed = { taskItem: val, isDone: false };
		this.tasks.push(parsed);
	};
	this.deleteFromTask = function (name) {
		var arr = this.tasks;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].taskItem === name) {
				arr.splice(i, 1);
			}
		}
	};
	this.update = function (name, state) {
		var arr = this.tasks;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].taskItem === name) {
				arr[i]["isDone"] = state;
				// console.log(arr[i]["taskItem"] + " is updated to " + state);
			}
		}
	};
	this.findDone = function (r) {
		var arr = this.tasks;
		var amt = 0;
		var retArr = [];
		if (r == "length") {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i]["isDone"] === true) {
					amt++;
				}
			}
			return amt;
		} else if (r == "task") {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i]["isDone"] === true) {
					retArr.push(arr[i]["taskItem"]);
				}
			}
			return retArr;
		}
	};
	ProjectList.push(this);
}

//Refresh Dropdown
function RefreshDropdown() {
	console.log(this + " was called");

	ProjectList.forEach(function (item, index) {
		var looping = document.querySelector(
			'option.DDItem[value="' + item.name + '"]'
		);
		if (looping != undefined) {
			// console.log(item.name + " existed");
		} else {
			dropdownTask.innerHTML +=
				'<option class="DDItem" value="' +
				item.name +
				'">' +
				item.name +
				"</option>";
		}
	});
}

function RefreshMain() {
	if (selectedProject) {
		listMain.innerHTML = "";
		var taskDone = selectedProject.findDone("task");
		var doneSts = "";

		for (let i = 0; i < selectedProject.tasks.length; i++) {
			const element = selectedProject.tasks[i]["taskItem"];
			//labels for breaking loop
			loop2: for (let k = 0; k < taskDone.length; k++) {
				if (element == taskDone[k]) {
					doneSts = "done";
					break loop2;
				} else {
					doneSts = "";
				}
			}

			listMain.innerHTML +=
				'<button class="text-left list-group-item bg-medium ' +
				doneSts +
				'" onclick="checkList(this)">' +
				element +
				"</button>";
		}

		progressProject = selectedProject.findDone("length");
		progress.innerText = progressProject + "/" + selectedProject.tasks.length;
		percentage.innerText =
			Math.round((100 * progressProject) / selectedProject.tasks.length) + "%";
		if (progressProject <= 0) {
			percentage.innerText = "0%";
			runProgress(0);
		}
		runProgress(
			Math.round((100 * progressProject) / selectedProject.tasks.length)
		);
		console.log(taskDone);
	}
}

function checkList(element) {
	var name = element.innerText;
	var tog = element.classList.toggle("done");

	if (tog == true) {
		selectedProject.update(name, true);
		progressProject++;
		progress.innerText = progressProject + "/" + selectedProject.tasks.length;
		percentage.innerText =
			Math.round((100 * progressProject) / selectedProject.tasks.length) + "%";
		runProgress(
			Math.round((100 * progressProject) / selectedProject.tasks.length)
		);
	} else {
		selectedProject.update(name, false);
		progressProject--;
		progress.innerText = progressProject + "/" + selectedProject.tasks.length;
		percentage.innerText =
			Math.round((100 * progressProject) / selectedProject.tasks.length) + "%";
		runProgress(
			Math.round((100 * progressProject) / selectedProject.tasks.length)
		);
	}
	// updateProgress(element, tog);
	console.log(tog);
}

function updateProgress(element, sts) {
	if (sts == true) {
		progressProject = 1;
	}
}

function addTask(namaTask) {
	var badgeBtn =
		'<i onClick="deleteTask(this)"class="btn fa fa-window-close float-right text-danger btn-x"></i>';
	list.innerHTML +=
		'<li class="list-group-item bg-dark">' + namaTask + badgeBtn + "</li>";
	// selectedProject.tasks.push(namaTask);
	selectedProject.addToTask(namaTask);
}

function deleteTask(current) {
	var element = current.parentElement;
	// console.log(element.innerText);
	element.parentElement.removeChild(element);
	// selectedProject.tasks.pop(element.innerText);
	selectedProject.deleteFromTask(element.innerText);
}

function LoadList() {
	list.innerHTML = "";

	for (let i = 0; i < selectedProject.tasks.length; i++) {
		// addTask(selectedProject.tasks[i]);
		var badgeBtn =
			'<i onClick="deleteTask(this)"class="btn fa fa-window-close float-right text-danger btn-x"></i>';
		list.innerHTML +=
			'<li class="list-group-item bg-dark">' +
			selectedProject.tasks[i]["taskItem"] +
			badgeBtn +
			"</li>";
	}
}

function selectProject(name) {
	//update selected project
	selectedProject = ProjectList.find((data) => data.name === name);

	//set label
	// document.querySelector(".label-selected-project").innerHTML = name;

	//pick project di taskmgr
	RefreshDropdown();

	//pick project dd
	// document.querySelector('option.DDItem[value="'+name+'"]').selected = true;

	console.log("Current Project: " + selectedProject.name);
}

/* ---------------------------------------------- */

/* --------------- Listeners ----------------- */

buttonAddTask.addEventListener("click", function () {
	if (!selectedProject) {
		alert('Please select a project from the dropdown list')
	}
	var taskName = document.querySelector("#f-inputTask").value;
	if (taskName == "") {
		alert("Please fill the field!");
		return;
	}
	addTask(taskName);
	document.querySelector("#f-inputTask").value = "";
	// console.log(taskName);
});

var input = document.getElementById("f-inputTask");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		buttonAddTask.click();
	}
});

dropdownTask.addEventListener("change", function () {
	selectProject(dropdownTask.value);
	LoadList();
});

var a = new Project("Sample Task 01");
// var b = new Project("Project 2");
a.addToTask("Lmao");
a.addToTask("Lol");
a.addToTask("Lmfao");
a.addToTask("Rofl");



buttonSaveProject.addEventListener("click", function () {
	// console.log('btn-save');
	
	var projectNameField = document.getElementById("f-projectName");
	var projectName = document.getElementById("f-projectName").value;

	if (projectName == "") {
		alert("Please fill the project name field!");
		return;
	} else {
		new Project(projectName);
		$("#mdl-createProject").modal("hide");
		projectNameField.value = "";
		alert('go to task manager to select your task');
		// selectProject(projectName);
		// RefreshMain();
	}
});

var input2 = document.getElementById("f-projectName");
input2.addEventListener("keydown", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		buttonSaveProject.click();
	}
});

buttonTaskManager.onclick = function () {
	RefreshDropdown();
	console.log('taskMgrbtn');
	
};

buttonDone.onclick = function () {
	// console.log('taskMgrbtn');
	if (selectedProject) {
		document.querySelector(".label-selected-project").innerHTML =
			selectedProject.name;
			alert('you have selected a project, proceed to add task below')
	} else {
		alert('select a project from the dropdown list')
	}

	RefreshMain();
};

buttonProgress = document.getElementById("btn-progress");
var bar = document.getElementById("bar");

function runProgress(value) {
	// if (bar.style.width == '0%') {
	//   bar.style.width = '100%';
	//   console.log(100);

	// } else {
	//   bar.style.width = '0%';
	//   console.log(1);

	// }
	bar.style.width = value + "%";
}



// buttonProgress.addEventListener('click', function() {
//   runProgress(50);
// });
