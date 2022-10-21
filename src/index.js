import "./styles/style.scss"

const todoTitle = document.getElementById("title");
const todoDesc = document.getElementById("desc");
const submitTodoButton = document.getElementById("submit");
const mainList = document.getElementById("main");
const toastifyElement = document.getElementById("alert");
 

function getLocatedTodos(){
    const savedLcTodos = localStorage.getItem("todosList");
    return JSON.parse(savedLcTodos)?.sort((a,b)=> a.id - b.id) || [];
};
 
let saveTodos = [...getLocatedTodos()];


const createNewTodo = (title,desc,id,checked) =>{
    const listItem = document.createElement("li");
    listItem.id = id;

    const todoTitleHeading = document.createElement("h3");
    const todoTitleInput = document.createElement("input");
    todoTitleInput.disabled = true ;
    todoTitleInput.className ="title-input "
    todoTitleInput.defaultValue = title;
    todoTitleHeading.appendChild(todoTitleInput);
    
    
    if(checked) {
        todoTitleHeading.style.color="rgb(190, 148, 113)";
        todoTitleHeading.innerHTML = title + "  *";
    };

    const todoDescPara = document.createElement("p");
    todoDescPara.innerHTML = desc;

    listItem.appendChild(todoTitleHeading);
    listItem.appendChild(todoDescPara);

    const todoDel = document.createElement("button");
    todoDel.innerText = "Delete";
     
    

    const todoEdit = document.createElement("button");
    todoEdit.innerText = "Edit";
     

    const todoUp = document.createElement("button");
    todoUp.innerText = "CHECK";
     
    

    todoDel.className = "btnclass";
    todoEdit.className = "btnclass";
    todoUp.className ="btnclass";

    listItem.appendChild(todoDel);
    listItem.appendChild(todoEdit);
    listItem.appendChild(todoUp);

    listItem.style.color= "#daad81c9";
    listItem.style.marginTop= "2rem";

    mainList.appendChild(listItem);
};

function renderTodoElement(){
    getLocatedTodos().forEach((todo)=>createNewTodo(todo.title,todo.desc,todo.id,todo.checked));
}
renderTodoElement();

const handleCreateNewTodo = (event) => {
    event.preventDefault();

    if(!todoTitle.value) return toastify("please inter valid title..." ,{
        time: "2000" , type:"warn"
    });

    const newTodo = {
        title : todoTitle.value,
        desc : todoDesc.value,
        id : Date.now(),
        checked : false,
    };
    
    saveTodos =[...getLocatedTodos()];
    saveTodos.push(newTodo);
    localStorage.setItem("todosList" , JSON.stringify(saveTodos));
    

    createNewTodo(newTodo.title,newTodo.desc,newTodo.id,newTodo.checked);
     
};

submitTodoButton.addEventListener("click", handleCreateNewTodo);


mainList.addEventListener("click", (e)=> {
    if (e.target.innerText ==="Delete") {
        const todoEl = e.target.parentElement;
        console.log(todoEl.id);
        const filtredTodos = getLocatedTodos().filter(
            (item)=> item.id !==Number(todoEl.id)
        );
        localStorage.setItem("todosList",JSON.stringify(filtredTodos));
        mainList.innerHTML="";
        renderTodoElement();
    }else if(e.target.innerText==="CHECK"){
        const todoEl = e.target.parentElement;
        console.log(todoEl.id);
        const filtredTodo = getLocatedTodos().filter(
            (item)=> item.id === Number(todoEl.id)
        );
        const updateFiltredTodo = {...filtredTodo[0], checked: true };
        const filtredTodos = getLocatedTodos().filter(
            (item)=> item.id !==Number(todoEl.id)
        );
        const updateSavedTodos =[...filtredTodos,updateFiltredTodo];
        localStorage.setItem("todosList", JSON.stringify(updateSavedTodos));
        mainList.innerHTML="";
        renderTodoElement();
    }else if (e.target.innerText==="Edit"){
        const todoEl = e.target.parentElement;
        todoEl.children[0].children[0].disabled = false ;
        todoEl.children[0].children[0].select();
        todoEl.children[0].children[0].style.backgroundColor = "#d3a783";
        e.target.innerText="Save";
        e.target.addEventListener("click", ()=>{
            const filtredTodo = getLocatedTodos().filter(
                (item)=> item.id === Number(todoEl.id)
            );
            const updateFiltredTodo = {...filtredTodo[0],title: todoEl.children[0].children[0].value};
            const filtredTodos = getLocatedTodos().filter(
                (item)=> item.id !==Number(todoEl.id)
            );
            const updateSavedTodos =[...filtredTodos,updateFiltredTodo];
            localStorage.setItem("todosList", JSON.stringify(updateSavedTodos));
            mainList.innerHTML="";
            renderTodoElement();
        })

    }
});

const toastify = (msg , options) => {
    toastifyElement.style.right ="0%";

    switch (options.type) {
        case "warn":
            toastifyElement.style.backgroundColor ="rgb(241, 187, 150)";
            break;
        case "error":
            toastifyElement.style.backgroundColor ="tomato";
            break;
        default:
            toastifyElement.style.backgroundColor ="gainsbro";
            break;
    };

    toastifyElement.children[0].innerHTML = msg ;
    toastifyElement.children[1].addEventListener("click", ()=>{
        toastifyElement.style.right="-100%";
    });
    setTimeout(function() {
        toastifyElement.style.right="-100%"; 
    } ,options.time || 3000);
};
