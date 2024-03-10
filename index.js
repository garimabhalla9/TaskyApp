const state = {
    taskList: [],
}

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");



const htmlTaskContent = ({id, title, description, type, url}) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
        <div class="card shadow-sm task__card">
            <div class="card-header d-flex justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick='editTask.apply(this, arguments)'>
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                  <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick='deleteTask.apply(this, arguments)'>
                    <i class="fas fa-trash-alt" name=${id}></i>
                </button>
            </div>
            <div class="card-body">
            ${
                url ? `<img width="100%" src=${url} alt="card image cap" class="card-image-top md-3 rounded-lg"/>` :
                 `<img width="100%" src="https://tse4.mm.bing.net/th?id=OIP.F00dCf4bXxX0J-qEEf4qIQHaD6&pid=Api&P=0&h=180">`
            }
            <h4 class="card-title">${title}</h4>
            <p class="card-title trim-3-lines text-muted">${description}</p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge bg-primary m-1">
                    ${type}
                </span>
            </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" id=${id} onclick='openTask.apply(this, arguments)'>
                    Open Task
                </button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({id, title, description, url}) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
     ${
                url ? `<img width="100%" src=${url} alt="card image cap" class="img-fluid md-3 rounded-lg"/>` :
                `<img width="100%" src="https://tse4.mm.bing.net/th?id=OIP.F00dCf4bXxX0J-qEEf4qIQHaD6&pid=Api&P=0&h=180">`
            }
            <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
            <p class="lead">${description}</p>
    </div>
    `
}



const updateLocalStorage = () => {
    localStorage.setItem('task', JSON.stringify({
        tasks: state.taskList,
    }))
}


const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList = localStorageCopy.tasks


    state.taskList.map((cardDate)=>{
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate))
    })
}

const handleSubmit = () => {
    const id = `${Date.now()}`
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        type: document.getElementById('tags').value,
    };

    taskContents.insertAdjacentHTML("beforeend", htmlModalContent({
        ...input, id
    }))

    state.taskList.push({...input, id});
    updateLocalStorage()
}



const openTask = (e) => {
    if(!e) e= window.event;

    const getTask = state.taskList.find(({id}) => id === e.target.id)
    taskModal.innerHTML = htmlModalContent(getTask);
}


const deleteTask = (e) => {
    if(!e) e= window.event;

    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
    // console.log(type)
    const removeTask = state.taskList.filter(({id})=>id!==targetId);
    state.taskList = removeTask
    // console.log(removeTask)

    updateLocalStorage();
    
    if(type === "BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode)
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        )
    }
     return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode
        )
}


const editTask = (e) => {
    if(!e) e= window.event;

 const targetId = e.target.id;
 const type =  e.target.tagName;

 let parentNode;
 let taskTitle;
 let taskDescription;
 let tags;
 let submitButton;

 if(type==="BUTTON"){
    parentNode = e.target.parentNode.parentNode
 }else{
 parentNode = e.target.parentNode.parentNode.parentNode
 }

 taskTitle = parentNode.childNodes[3].childNodes[3];
 
taskDescription = parentNode.childNodes[3].childNodes[5];
tags = parentNode.childNodes[3].childNodes[7].childNodes[1];

submitButton = parentNode.childNodes[5].childNodes[1];


taskTitle.setAttribute("contenteditable", "true")
taskDescription.setAttribute("contenteditable", "true")
tags.setAttribute("contenteditable", "true")

submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments)")
submitButton.removeAttribute("data-bs-toggle");
submitButton.removeAttribute("data-bs-target");
submitButton.innerHTML = "Save Changes"
}
