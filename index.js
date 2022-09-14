import{saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask} from "./firestore.js"

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
let editStatus = false;
let id="";

window.addEventListener("DOMContentLoaded", async() =>  {
    onGetTasks((querySnapshot) =>{
        let chtml ="";
        let cont=0;
        tasksContainer.innerHTML = "";
        chtml += `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Titulo</th>
                        <th>Descripción</th> 
                        <th>Eliminar</th>
                        <th>Actualizar</th>
                    </thead>
            <tbody>
            `;
        querySnapshot.forEach( doc => {
            cont +=1;
            const task = doc.data()
            chtml += `
                        <tr>
                            <th>${cont}</th>
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td><button class="btn btn-primary btn-delete" data-id="${doc.id}" >Eliminar</button></td>                        
                            <td><button class="btn btn-secondary btn-edit" data-id="${doc.id}" >Editar</button></td>                        
                        </tr>
                    `;
        })
        chtml += `
            </tbody>
            </table>
        `
        cont = 0;
        tasksContainer.innerHTML += chtml;
        // Al hacer clich en Eliminar
        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn =>{
            btn.addEventListener("click",({target:{dataset}}) =>{
                deleteTask(dataset.id);
                taskForm["btn-task-save"].innerText = "Guardar";
                taskForm.reset();
            })
        })
        // Al hacer clich en Actualizar
        const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn =>{
            btn.addEventListener("click",async(e) =>{
                const doc = await getTask(e.target.dataset.id);
                const task = doc.data();
                taskForm["task-title"].value = task.title;
                taskForm["task-description"].value = task.description;
                editStatus = true;
                id = doc.id;
                taskForm["btn-task-save"].innerText = "Actualizar";
                
            })
        })
    })
});
// Al hacer clich en Guardar
taskForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    if(!editStatus){
        saveTask(title.value, description.value);
    }else{
        updateTask(id,{title: title.value, description: description.value});
        editStatus = false;
    }
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
});