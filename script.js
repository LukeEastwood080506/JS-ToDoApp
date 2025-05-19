var time;
var userName;
var timeOfDay;

function changeName() {
    userName = prompt("Please enter your name:");
    save();
}

function save() {
    localStorage.setItem("userName", userName);
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

    document.getElementById("greeting").innerHTML = "Good " + timeOfDay + ", " + userName + "!";
}

function addTask() {
    alert(document.getElementById("todo-input").value);
}

function removeTask() {

}

document.getElementById("change-name").addEventListener("click", function() {
    changeName();
    document.getElementById("greeting").innerHTML = "Good " + timeOfDay + ", " + userName + "!";
});

document.getElementById("add-todo").addEventListener("click", function() {
    addTask();
});

setTimeout(save, 1000 * 30);

window.onload = load;