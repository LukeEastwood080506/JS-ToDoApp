var time;
var userName;
var timeOfDay;
var tasks = [];
var latitude;
var longitude;
var weatherData;


class Task {
    constructor(name, isDone) {
        this.name = name;
        this.isDone = isDone;
    }
}

function getWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            const apiKey = ''; // OpenWeatherMap API key would go here
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            
            fetch(weatherUrl)
                .then(response => response.json())
                .then(data => {
                    weatherData = data;
                    displayWeather(weatherData);
                })
                .catch(error => {
                    console.error('Error fetching weather:', error);
                });
        });
    }
}

function displayWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = capitalizeFirstLetters(data.weather[0].description);
    const icon = data.weather[0].icon;
    var iconImg = document.createElement("img");
    iconImg.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    iconImg.style.verticalAlign = "middle";
    iconImg.style.paddingBottom = "6px";
    document.getElementById("weather").textContent = `The Weather Currently Is ${description}, ${temperature}°C`;
    document.getElementById("weather").appendChild(iconImg);
}

function capitalizeFirstLetters(str) {
  return str
    .split(' ') // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back into a single string
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

    getWeather();

    document.getElementById("greeting").textContent = "Good " + timeOfDay + ", " + userName + "!";
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
    taskNameElement.textContent = taskName;

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
    document.getElementById("greeting").textContent = "Good " + timeOfDay + ", " + userName + "!";
});

document.getElementById("clear-tasks").addEventListener("click", function() {
    tasks = [];
    document.getElementById("todo-list").textContent = "";
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

        if (event.key === "w") {
            displayWeather(weatherData);
            alert(weatherData);
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