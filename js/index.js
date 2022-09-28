
import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./firestore.js"
//import saveTask from "./firestore.js"
const taskForm = document.getElementById("task-form");
const tabla = document.getElementById("tasksTable");
// Obtener la referencia del elemento body
const body = document.getElementsByTagName("body")[0];
// Crea un elemento <table> y un elemento <tbody>
const tblBody = document.createElement("tbody");  

let contRows=0;
let editStatus = false;
let id = "";
let ban = false;
window.addEventListener("DOMContentLoaded", async () => {
    console.log("ingreso a DOMContetLoaded");
    onGetTasks((querySnapshot) => {
        console.log("Obtiene Snap. Ban:"+ban);
        let cont = 0;
        if(ban==true){
            // const dataTab = $('#tasksTable').DataTable();
            // console.log("dataTab:" + dataTab.len());
        }
        //eliminarRows();
        querySnapshot.forEach(doc => {
            cont += 1;
            const task = doc.data()
            const row = document.createElement("tr");
            row.id = cont;

            //Agregar Radio
            const radiobox = document.createElement('input');
            radiobox.name = "rad"
            radiobox.type = "radio";
            radiobox.id = doc.id;
            radiobox.class = "form-check-input"
            radiobox.value = doc.id;

            const celda = document.createElement("td");
            celda.appendChild(radiobox);
            row.appendChild(celda);
          
            const celda1 = document.createElement("td");
            const textoCelda1 = document.createTextNode(task.codigo);
            celda1.appendChild(textoCelda1);
            row.appendChild(celda1);

            const celda2 = document.createElement("td");
            const textoCelda2 = document.createTextNode(task.fecha);
            celda2.appendChild(textoCelda2);
            row.appendChild(celda2);

            const celda3 = document.createElement("td");
            const textoCelda3 = document.createTextNode(task.description);
            celda3.appendChild(textoCelda3);
            row.appendChild(celda3);

            const celda4 = document.createElement("td");
            const textoCelda4 = document.createTextNode(task.estado);
            celda4.appendChild(textoCelda4);
            row.appendChild(celda4);

            const celda5 = document.createElement("td");
            const btnE = document.createElement("button");
            btnE.setAttribute("data-id",doc.id);
            btnE.innerHTML = "Eliminar";
            btnE.classList.value = "btn btn-primary btn-delete btn-sm";
            btnE.id = "btnEli";
            celda5.appendChild(btnE);
            row.appendChild(celda5);

            const celda6 = document.createElement("td");
            const btnA = document.createElement("button");
            btnA.type = "button"
            btnA.setAttribute("data-id",doc.id);
            btnA.classList.value="btn btn-secondary btn-edit btn-sm";
            btnE.id = "btnAct";
            btnA.setAttribute("data-bs-toggle","modal");
            btnA.setAttribute("data-bs-target","#ventanaModal");
            btnA.id = doc.id;
            btnA.innerHTML = "Editar"

            celda6.appendChild(btnA);
            row.appendChild(celda6);         

            tblBody.appendChild(row);
        
        })
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tabla);
        console.log("Termino de Construir Tabla");
        contRows = cont;
        cont = 0;
        // Al hacer clich en Boton Eliminar
        const btnsDelete = document.querySelectorAll("button.btn-delete");
        btnsDelete.forEach(btn => {
            btn.addEventListener("click", ({ target: { dataset } }) => {
                console.log(dataset.id)
                var resultado = window.confirm('Estas seguro?');
                if (resultado === true) {
                    deleteTask(dataset.id);
                    taskForm["btn-task-save"].innerText = "Guardar";
                    taskForm.reset();
                }
            })
        })
        // Al hacer clich en Boton Editar
        const btnsEdit = document.querySelectorAll("button.btn-edit");
        btnsEdit.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const doc = await getTask(e.target.dataset.id);
                const task = doc.data();
                taskForm["task-codigo"].value = task.codigo;
                taskForm["task-fecha"].value = task.fecha;
                taskForm["task-description"].value = task.description;
                taskForm["task-estado"].value = task.estado;
                editStatus = true;
                id = doc.id;
                taskForm["btn-task-save"].innerText = "Actualizar";
                ban = true;
            })
        })
        //Al hacer click en la Fila de la Tabla
        // const tasksTable = document.getElementById("tasksTable");
        // tasksTable.addEventListener("click", async (e) => {
        //     console.log("Entro a Click");
        //     console.log(e.target.parentElement.id);
        //     const doc = await getTask(e.target.parentElement.id);
        //     const task = doc.data();
        //     taskForm["task-codigo"].value = task.codigo;
        //     taskForm["task-fecha"].value = task.fecha;
        //     taskForm["task-description"].value = task.description;
        //     taskForm["task-estado"].value = task.estado;
        //     editStatus = true;
        //     id = doc.id;
        //     taskForm["btn-task-save"].innerText = "Actualizar";
        //     //Abrir Modal
        //     const ventModal = document.getElementById("ventanaModal");
        //     ventModal.classList.add("show");
        //     ventModal.style.display = "block";
        // })
        loadScript("js/paintDataTable.js");
        ban =true;
    })
    contRows = 0;
});
// Al HAcer CLick en Cerrar dentro de Modal
taskForm.addEventListener("reset", (e) => {
    e.preventDefault();
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
    const ventModal = document.getElementById("ventanaModal");
    ventModal.classList.remove("show");
    ventModal.style.display = "none";
})
// Al hacer clich en Guardar
taskForm.addEventListener("submit", async (e) => {
    console.log("Ingreso a Guardar/Actu");
    e.preventDefault();
    const codigo = (taskForm["task-codigo"]).value;
    const fecha = (taskForm["task-fecha"]).value;
    const description = (taskForm["task-description"]).value;
    const estado = (taskForm["task-estado"]).value;
    if (!editStatus) {
        const idObt = await saveTask(codigo, fecha, description, estado);
        const tabla = $('#tasksTable').DataTable();
        const input = "<input name='"+"rad"+"' type='"+"radio"+"' id='"+(idObt)+"' value='"+(idObt)+"'></input>";
        const btnElim = "<button data-id='"+(idObt)+"' class="+"'btn btn-primary btn-delete btn-sm'"+" id='"+(idObt)+"'>Eliminar</button>";
        const btnActu = "<button type='"+"button"+"' data-id='"+(idObt)+"' class='"+"btn btn-secondary btn-edit btn-sm"+"' data-bs-toggle='"+"modal"+"' data-bs-target='"+"#ventanaModal"+"' id='"+(idObt)+"'>Editar</button>";
        tabla.row.add([input, codigo, fecha, description, estado, btnElim, btnActu]).draw().node().id=(contRows+1);
        
    } else {
        await updateTask(id, { codigo: codigo, fecha: fecha, description: description, estado: estado });
        console.log("Entro a Update Id: "+id)
        const tabla = $('#tasksTable').DataTable();
        const input = "<input name='"+"rad"+"' type='"+"radio"+"' id='"+(id)+"' value='"+(id)+"'></input>";
        const btnElim = "<button data-id='"+(id)+"' class="+"'btn btn-primary btn-delete btn-sm'"+" id='"+(id)+"'>Eliminar</button>";
        const btnActu = "<button type='"+"button"+"' data-id='"+(id)+"' class='"+"btn btn-secondary btn-edit btn-sm"+"' data-bs-toggle='"+"modal"+"' data-bs-target='"+"#ventanaModal"+"' id='"+(id)+"'>Editar</button>";
        tabla.row(id).data([input,codigo, fecha, description, estado, btnElim, btnActu]).draw();
        editStatus = false;
    }
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
});
// Al hacer click en X
const btnX = document.getElementById("btn-X");
btnX.addEventListener("click", (e) => {
    const ventModal = document.getElementById("ventanaModal");
    ventModal.classList.remove("show");
    ventModal.style.display = "none";
})
// Al hacer click en Nuevo
const btnNew = document.getElementById("btn-Nuevo");
btnNew.addEventListener("click", (e) => {
    console.log("Ingreso a Nuevo");
    let date = new Date();
    let fechaNormal = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    let fechaCod = String(date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0'));
    taskForm["task-codigo"].value = "R" + fechaCod;
    taskForm["task-fecha"].value = fechaNormal;
    taskForm["task-description"].value = "";
    taskForm["task-estado"].value = "Nuevo";
    //taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
})
//Eliminar Rows de la Tabla
function eliminarRows(){
    console.log("Entro a eliminar Rows: "+ contRows);    
    for (var i = 0; i < contRows; i++) {
        console.log(document.getElementById(i+1));
        try {
            document.getElementById(i+1).remove();    
        } catch (error) {
            console.log(error);    
        }
        console.log("Eliminado")
     }
}

function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.append(script);
  }