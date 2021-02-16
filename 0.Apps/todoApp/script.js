                
                   //DARKMODE CLASS AND LOCALSTORAGE TOGGLE

const darkmodeToggle =  document.querySelector('#darkmode-switch');
let { checked } = darkmodeToggle;

const bodyClass = document.querySelector('.body');
const toggleClass = document.querySelector('.toggle');
const darkClass = document.querySelector('.dark');
const lightClass = document.querySelector('.light');
const crescentClassMainCircle = document.querySelector('.crescent');
const crescentClasses = document.querySelectorAll('.crescent');
const smallCircleClasses = document.querySelectorAll('.small-circle');
const mainCircleClass = document.querySelector('.main-circle');
const newTodoInput = document.querySelector('.new-todo-light');
const btnAddTodo = document.querySelector('.btn-add-todo-light');
let doneBtns = document.querySelectorAll('.done-btn');

//SWITCH TO DARKMODE
function setDarkMode(){
    checked = true;
    bodyClass.classList.add("bodyDarkmode");
    toggleClass.classList.add("toggleDarkmode");
    darkClass.classList.add("darkDarkmode");
    lightClass.classList.add("lightDarkmode");
    crescentClassMainCircle.classList.add("crescentDarkmode");
    mainCircleClass.classList.add("mainCircleDarkmode");
    newTodoInput.classList.add("newTodoDarkmode");
    btnAddTodo.classList.add("btn-add-todo-dark");

    for(let circle of smallCircleClasses){
        circle.classList.add("smallCircleDarkmode");
    }
    for(let crescent of crescentClasses){
        crescent.classList.add("crescentDarkmode");
    }
    for(let button of doneBtns){
        button.classList.add("done-btn-dark");
    }
}

//INITIAL DARKMODE SETUP IF PREFERENCE IN LOCALSTORAGE
if(localStorage.getItem('darkmodeEnabled') === "true") {
        setDarkMode();
}

//DARKMODE TOGGLE
darkmodeToggle.addEventListener("click", function(e){
    if (!checked){
        localStorage.setItem('darkmodeEnabled', true);
        doneBtns = document.querySelectorAll('.done-btn');
        setDarkMode();
    }
    else{
        localStorage.setItem('darkmodeEnabled', false);
        checked = false;
        doneBtns = document.querySelectorAll('.done-btn');

        bodyClass.classList.remove("bodyDarkmode");
        toggleClass.classList.remove("toggleDarkmode");
        darkClass.classList.remove("darkDarkmode");
        lightClass.classList.remove("lightDarkmode");
        crescentClassMainCircle.classList.remove("crescentDarkmode");
        mainCircleClass.classList.remove("mainCircleDarkmode");
        newTodoInput.classList.remove("newTodoDarkmode");
        btnAddTodo.classList.remove("btn-add-todo-dark");
    
        for(let circle of smallCircleClasses){
            circle.classList.remove("smallCircleDarkmode");
        }
        for(let crescent of crescentClasses){
            crescent.classList.remove("crescentDarkmode");
        }
        for(let button of doneBtns){
            button.classList.remove("done-btn-dark");
        }
    }
})

                   
                    // TODO APP


const todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];

const form = document.querySelector('#todo-form');
let itemWrapper = document.querySelector('.item-button-wrapper');                 
const doneButtons = document.querySelectorAll('.done-btn');
const input = document.querySelector('#new-todo');
const todoList = document.querySelector('.todo-content');
let itemWrappers = document.querySelectorAll('.item-button-wrapper');

// LOAD PREVIOUS TODO ITEMS FROM LOCAL STORAGE; UPDATE DONE BUTTON TO DARKMODE IF SET
function loadLocalItems(){
    for (let item of todoItems) {
    
        const newDiv = document.createElement('div');
        newDiv.classList.add('item-button-wrapper');
        todoList.appendChild(newDiv);
    
        const newP = document.createElement('p');
        newP.innerText = item.taskId;
        newP.classList.add('item');
        newDiv.appendChild(newP);
        input.value='';
    
        const newBtn = document.createElement('button');
        newBtn.innerText = "DONE!";
    
        if(localStorage.getItem('darkmodeEnabled') === "true"){
            newBtn.classList.add('done-btn');
            newBtn.classList.add('done-btn-dark');
        } else{
            newBtn.classList.add('done-btn');
        }
        newDiv.appendChild(newBtn);
    }
}

//ADD NEW TODO FUNCTION
function addNewTodo(){
   
    const newDiv = document.createElement('div');
    newDiv.classList.add('item-button-wrapper');
    todoList.appendChild(newDiv);

    const newP = document.createElement('p');
    newP.innerText = input.value;
    newP.classList.add('item');
    newDiv.appendChild(newP);
    input.value='';

    const newBtn = document.createElement('button');
    newBtn.innerText = "DONE!";

    if(localStorage.getItem('darkmodeEnabled') === "true"){
        newBtn.classList.add('done-btn');
        newBtn.classList.add('done-btn-dark');
    } else{
        newBtn.classList.add('done-btn');
    }
    newDiv.appendChild(newBtn);

        //SAVE TODOITEMS IN LOCALSTORAGE
    todoItems.push({taskId: newDiv.firstChild.innerText});
    localStorage.setItem("todoItems", JSON.stringify(todoItems)); 
}

// REMOVE TODO FUNCTION
function removeTodo(e){
    if(e.target.classList.contains('done-btn')){
        e.target.parentElement.remove();
   } 
}


    //EVENT HANDLERS

//ADD NEW TODO CALL, CHECKING FOR BLANK AND DUPLICATES
form.addEventListener("submit", function(e){
    e.preventDefault();
    var notDuplicateOrBlank = true;

    if(input.value.length === 0){
        alert("I think you left it blank!");
        notDuplicateOrBlank = false;
    }
    //elif
    for (let item of todoItems) {
        if(item.taskId === input.value){
            alert("Looks like it might be a duplicate!");
            notDuplicateOrBlank = false;
        } 
    }
    if(notDuplicateOrBlank === true){
        addNewTodo();
    }

});

//REMOVE TODO ITEM(ALSO REMOVED FROM LOCALSTORAGE) WITH EVENT DELEGATION
todoList.addEventListener('click', function(e){
    console.log(e.target.classList);
    console.log(todoItems);
    
    let clickedItemTaskId = e.target.previousElementSibling.innerText;

    for(let i = 0; i <todoItems.length; i++){
        if(todoItems[i].taskId === clickedItemTaskId){
            todoItems.splice(i,1);
            console.log(todoItems);
            localStorage.setItem("todoItems", JSON.stringify(todoItems)); 
        }
     }
    removeTodo(e);
});

loadLocalItems();

