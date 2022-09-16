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
        querySnapshot.forEach( doc => {
            cont +=1;
            const task = doc.data()
            chtml += `
                    <div class="card text-white bg-danger mb-3" style="max-width: 20rem;" padding="10px"> 
                    <div class="card-header">${cont}</div>
                    <div class="card-body">
                      <h4 class="card-title">${task.codigo}</h4>
                      <p class="card-text">${task.fecha}</p>
                      <p class="card-text">${task.description}</p>
                      <button class="btn btn-primary btn-delete" data-id="${doc.id}" >Eliminar</button>
                      <button class="btn btn-secondary btn-edit" data-id="${doc.id}" >Editar</button>
                    </div>
                    <br>
                    `;
        })
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
                taskForm["task-codigo"].value = task.codigo;
                taskForm["task-fecha"].value = task.fecha;
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
    const codigo = taskForm["task-codigo"];
    const fecha = taskForm["task-fecha"]
    const description = taskForm["task-description"];
    if(!editStatus){
        saveTask(codigo.value,fecha.value, description.value);
    }else{
        updateTask(id,{codigo: codigo.value,fecha: fecha.value, description: description.value});
        editStatus = false;
    }
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
});