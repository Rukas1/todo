"use strict";

function actualDate() {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

function get() {
    if (localStorage.todoListStorage) {
        let data = JSON.parse(localStorage.todoListStorage);
        return data;
    }
    let baseObj = {
        lastUpdate: actualDate(),
        list: []
    }
    localStorage.setItem("todoListStorage", JSON.stringify(baseObj));
    return get();
}

function update() {
    checkboxes.forEach(el => {
        el.removeEventListener("click", line);
    })
    checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(el => {
        el.addEventListener("click", line);
    })
}

function createComponent() {
    let data = get();
    if (text.length > 0) {
        let id = (data.list.length + 1)
        data.list.push({todo: text, finished: false, id: id});
        lastUpdate.innerHTML = data.lastUpdate = actualDate();
        localStorage.setItem("todoListStorage", JSON.stringify(data));
        loadComponent();
    }
    update();
}

function loadComponent() {
    let data = get();
    lastUpdate.innerHTML = data.lastUpdate;
    todoList.innerHTML = "<p class='noTask'>No task...</p>";
    if (data.list.length > 0) {
        document.querySelector(".noTask").style.display = "none";
        for (let i = 0; i < data.list.length; i++) {
            let isFinished = data.list[i].finished
                ? 'class="line"'
                : 'class="noLine"';
            let item = `
            <div class="list-item">
              <label ${isFinished}>
                <input type="checkbox" id=${data.list[i].id}>
                <span class="checkmark"></span>
                ${data.list[i].todo}
              </label>
            </div>`
            todoList.insertAdjacentHTML("beforeend", item);
        }
    }
    update();
}

function line(e) {
    let data = get();
    data.list[e.target.id - 1].finished = !data.list[e.target.id - 1].finished
    lastUpdate.innerHTML = data.lastUpdate = actualDate();
    e
        .target
        .parentNode
        .classList
        .toggle("line");
    e
        .target
        .parentNode
        .classList
        .toggle("noLine");
    localStorage.setItem("todoListStorage", JSON.stringify(data));
}

const lastUpdate = document.querySelector(".last-update");
const todoList = document.querySelector(".list");
let checkboxes = document.querySelectorAll("input[type=checkbox]");

let text = "";

todoText.addEventListener("input", (e) => {
    text = e.target.value;
})

addBtn.addEventListener("click", () => {
    createComponent();
    text = todoText.value = "";
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "todoText") {
        createComponent();
        text = todoText.value = "";
    }
})

deleteAll.addEventListener("click", () => {
    if(confirm("⚠️ Delete all task ? ⚠️")) {
        localStorage.clear();
        location.reload();
    }
})

loadComponent();