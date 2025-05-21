var time;
var userName;
var timeOfDay;
var tasks = [];


class Task {
    constructor(name, isDone) {
        this.name = name;
        this.isDone = isDone;
    }
}

function changeName() {
    userName = prompt("Please enter your name:");
    save();
}

function save() {
    localStorage.setItem("userName", userName);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function load() {
    time = new Date();
    if(time.getHours() < 12) {
        timeOfDay = "morning";
    } else {
        timeOfDay = "afternoon";
    }

    if(localStorage.getItem("userName") != null && localStorage.getItem("userName") != "undefined") {
        userName = localStorage.getItem("userName");
    } else {
        changeName();
    }

    if(localStorage.getItem("tasks") != null) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        fillTasks();
    } else {
        tasks = [];
    }

    document.getElementById("greeting").innerHTML = "Good " + timeOfDay + ", " + userName + "!";
}

function addTask(taskName, taskDone) {
    var task = document.createElement("li");
    var taskNameElement = document.createElement("span");
    var taskCheckBox = document.createElement("input");
    var taskDeleteButton = document.createElement("button");
    var taskDeleteIcon = document.createElement("img");
    taskDeleteIcon.src = "images/trashcan.png";
    taskDeleteIcon.style.width = "20px";
    taskDeleteIcon.style.height = "20px";
        
    task.className = "task";
    task.style.listStyleType = "none";
    task.style.padding = "20px";
    task.style.marginTop = "20px";
    task.style.border = "none";
    task.style.backgroundColor = "white";
    task.style.borderRadius = "30px";
    task.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    task.style.alignContent = "center";
        
    taskNameElement.className = "task-name";
    taskNameElement.style.float = "left";
    taskNameElement.innerHTML = taskName;

    taskCheckBox.className = "task-checkbox";
    taskCheckBox.style.marginRight = "24px";
    taskCheckBox.style.marginLeft = "10px";
    taskCheckBox.style.marginTop = "4px";
    taskCheckBox.type = "checkbox";
    taskCheckBox.style.float = "left";

    taskDeleteButton.className = "task-delete";
    taskDeleteButton.style.float = "right";
    taskDeleteButton.style.marginRight = "10px";
    taskDeleteButton.innerHTML = taskDeleteIcon.outerHTML;
    taskDeleteButton.style.backgroundColor = "transparent";
    taskDeleteButton.style.border = "none";
    taskDeleteButton.style.cursor = "pointer";
    taskDeleteButton.style.width = "20px";
    taskDeleteButton.style.height = "20px";
    taskDeleteIcon.style.hover = "color: red";
    taskDeleteButton.addEventListener("click", function() {
        task.remove();
        tasks.splice(tasks.indexOf(taskName), 1);
        save();
    });

    if(taskDone) {
        taskCheckBox.checked = true;
        task.style.backgroundColor = "darkgray";
        taskNameElement.style.color = "gray";
        taskNameElement.style.textDecoration = "line-through";
    }

    taskCheckBox.addEventListener('change', (event) => {
    if (event.target.checked) {
        task.style.backgroundColor = "darkgray";
        taskNameElement.style.color = "gray";
        taskNameElement.style.textDecoration = "line-through";
        tasks[Array.from(document.getElementById("todo-list").children).indexOf(task)].isDone = true;
        save();
    } else {
        task.style.backgroundColor = "white";
        taskNameElement.style.color = "black";
        taskNameElement.style.textDecoration = "none";
        tasks[Array.from(document.getElementById("todo-list").children).indexOf(task)].isDone = false;
        save();
    }
    });
    
    task.appendChild(taskCheckBox);
    task.appendChild(taskNameElement);
    task.appendChild(taskDeleteButton);
        
    document.getElementById("todo-list").appendChild(task);
}

function fillTasks() {
    for(let i = 0; i < tasks.length; i++) {
        addTask(tasks[i].name, tasks[i].isDone);
    }
}

document.getElementById("change-name").addEventListener("click", function() {
    changeName();
    document.getElementById("greeting").innerHTML = "Good " + timeOfDay + ", " + userName + "!";
});

document.getElementById("clear-tasks").addEventListener("click", function() {
    tasks = [];
    document.getElementById("todo-list").innerHTML = "";
    save();
});

document.getElementById("add-todo").addEventListener("click", function() {
    var taskName = document.getElementById("todo-input").value;
    if (taskName.length === 0) {
        alert("Task name cannot be empty.");
        return;
    }
    tasks.push(new Task(taskName, false));
    addTask(taskName, false);
    document.getElementById("todo-input").value = "";
    save();
});

document.addEventListener("keydown", function(event) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
    } else{
        if (event.key === "s") {
        alert("Saving tasks...");
        save();
        }
    }
});

document.getElementById("todo-list").addEventListener("change", function(event) {
    if (event.target.className === "task-checkbox") {
        var taskIndex = Array.from(document.getElementById("todo-list").children).indexOf(event.target.parentElement);
        changeTaskStatus(tasks[taskIndex]);
        save();
    }
});

setTimeout(save, 1000 * 15);

window.onload = load;