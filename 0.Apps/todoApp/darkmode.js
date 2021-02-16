
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