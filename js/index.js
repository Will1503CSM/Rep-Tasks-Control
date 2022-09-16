import{saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask} from "./firestore.js"
    const taskForm = document.getElementById("task-form");
    const tasksContainer = document.getElementById("tasks-container");
    let editStatus = false;
    let id="";
    let ban = false;
    
window.addEventListener("DOMContentLoaded", async() =>  {
    onGetTasks((querySnapshot) =>{
        let chtml ="";
        let cont=0;
        tasksContainer.innerHTML = "";
        chtml += `
            <table id="tasksTable" class="table table-hover">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Código</th>
                        <th>Fecha</th>
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
                        <tr id="${doc.id}">
                            <th>${cont}</th>
                            <td>${task.codigo}</td>
                            <td>${task.fecha}</td>
                            <td>${task.description}</td>
                            <td><button class="btn btn-primary btn-delete" data-id="${doc.id}" >Eliminar</button></td>                        
                            <td><button type="button" class="btn btn-secondary btn-edit" data-id="${doc.id}" data-bs-toggle="modal" data-bs-target="#ventanaModal">Editar</button></td>                      
                        </tr>
                    `;
        })
        chtml += `
                <tfoot>
                    <tr>
                        <td>Número de Tareas: ${cont}</td>
                    </tr>
                </tfoot>
            </tbody>
            </table>
        `
        cont = 0;
        tasksContainer.innerHTML += chtml;
        // Al hacer clich en Boton Eliminar
        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn =>{
            btn.addEventListener("click",({target:{dataset}}) =>{
                var resultado = window.confirm('Estas seguro?');
                if (resultado === true) {
                    deleteTask(dataset.id);
                    taskForm["btn-task-save"].innerText = "Guardar";
                    taskForm.reset();
                } 
            })
        })
        // Al hacer clich en Boton Editar
        const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
        //let ban = false;
        btnsEdit.forEach(btn =>{
            btn.addEventListener("click",async(e) =>{
                console.log("EN Bton Editar");
                console.log(e.target.dataset.id);
                const doc = await getTask(e.target.dataset.id);
                const task = doc.data();
                taskForm["task-codigo"].value = task.codigo;
                taskForm["task-fecha"].value = task.fecha;
                taskForm["task-description"].value = task.description;
                editStatus = true;
                id = doc.id;
                taskForm["btn-task-save"].innerText = "Actualizar";
                ban = true;
            })
        })
        // Al hacer click en la Fila de la Tabla
           
            // const tasksTable = document.getElementById("tasksTable");
            // tasksTable.addEventListener("click", async(e)=>{
            //     console.log("Entro a Click en Fila");
            //     console.log("parent: "+e.target.parentElement.id);
            //     console.log("dataset: "+e.target.dataset.id);
            //     let doc=null;
            //     if(ban){
            //         console.log("1 "+ban)
            //         doc = await getTask(e.target.parentElement.id);
            //         ban == false;
            //         console.log("1 "+ban)
            //     }else{
            //         console.log("0 "+ban)
            //         doc = await getTask(e.target.dataset.id);
            //         console.log("0")
            //     }
            //     console.log(doc)
            //     const task = doc.data();
            //     taskForm["task-title"].value = task.title;
            //     taskForm["task-description"].value = task.description;
            //     editStatus = true;
            //     id = doc.id;
            //     taskForm["btn-task-save"].innerText = "Actualizar";
            //     //Abrir Modal
            //     const ventModal = document.getElementById("ventanaModal");
            //     ventModal.classList.add("show");
            //     ventModal.style.display="block";
            // })

    })
});
// Al HAcer CLick en Cerrar dentro de Modal
taskForm.addEventListener("reset", (e)=>{
    e.preventDefault();
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
    const ventModal = document.getElementById("ventanaModal");
    ventModal.classList.remove("show");
    ventModal.style.display="none";
})

// Al hacer clich en Guardar
taskForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const codigo  = taskForm["task-codigo"];
    const fecha  = taskForm["task-fecha"];
    const description = taskForm["task-description"];
    
    if(!editStatus){
        saveTask(codigo.value, fecha.value, description.value);
    }else{
        updateTask(id,{codigo: codigo.value, fecha: fecha.value, description: description.value});
        editStatus = false;
    }
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
});
// Al hacer click en X
const btnX = document.getElementById("btn-X");
btnX.addEventListener("click",(e) => {
    const ventModal = document.getElementById("ventanaModal");
    ventModal.classList.remove("show");
    ventModal.style.display="none";
})
// Al hacer click en Nuevo
const btnNew = document.getElementById("btn-Nuevo");
btnNew.addEventListener("click",(e) => {
    let date = new Date();
    let fechaNormal = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    let fechaCod = String(date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') );
    console.log("entro a New");
    taskForm["task-codigo"].value = "R"+fechaCod;
    taskForm["task-fecha"].value = fechaNormal;
    taskForm["task-description"].value = "";
    //taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
})