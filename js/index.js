import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./firestore.js"
const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = "";
let ban = false;

window.addEventListener("DOMContentLoaded", async () => {
    onGetTasks((querySnapshot) => {
        alert("Entro a Crear Tabla");
        let cont = 0;
        tasksContainer.innerHTML = "";
        const tabla = document.getElementById("tasksTable");
        // Obtener la referencia del elemento body
        const body = document.getElementsByTagName("body")[0];
        // Crea un elemento <table> y un elemento <tbody>
        const tblBody = document.createElement("tbody");  
        const group = document.createElement("form-group")
        querySnapshot.forEach(doc => {
            cont += 1;
            const task = doc.data()
            //Agregar Radio
            const radiobox = document.createElement('input');
            radiobox.name = "rad"
            radiobox.type = "radio";
            radiobox.id = doc.id;
            radiobox.class = "form-check-input"
            radiobox.value = doc.id;

            const hilera = document.createElement("tr");

            const celda = document.createElement("td");
           // const textoCelda = document.createTextNode(task.codigo);
            celda.appendChild(radiobox);
            hilera.appendChild(celda);
          
            const celda1 = document.createElement("td");
            const textoCelda1 = document.createTextNode(task.codigo);
            celda1.appendChild(textoCelda1);
            hilera.appendChild(celda1);

            const celda2 = document.createElement("td");
            const textoCelda2 = document.createTextNode(task.fecha);
            celda2.appendChild(textoCelda2);
            hilera.appendChild(celda2);

            const celda3 = document.createElement("td");
            const textoCelda3 = document.createTextNode(task.description);
            celda3.appendChild(textoCelda3);
            hilera.appendChild(celda3);

            const celda4 = document.createElement("td");
            const textoCelda4 = document.createTextNode(task.estado);
            celda4.appendChild(textoCelda4);
            hilera.appendChild(celda4);

            const celda5 = document.createElement("td");
            const btnE = document.createElement("button");
            btnE.innerHTML = "Eliminar";
            btnE.classList.value = "btn btn-primary btn-delete btn-sm";
            btnE.id = doc.id;
            console.log(btnE.id);
            celda5.appendChild(btnE);
            hilera.appendChild(celda5);

            const celda6 = document.createElement("td");
            const btnA = document.createElement("button");
            btnA.classList.value="btn btn-secondary btn-edit btn-sm"
            btnA.id = doc.id;
            btnA.innerHTML = "Actualizar"

            celda6.appendChild(btnA);
            hilera.appendChild(celda6);         
            tblBody.appendChild(hilera);
        
        })
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tabla);
        cont = 0;

        // Al hacer clich en Boton Eliminar
        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            console.log("Entro a Eliminar");
            btn.addEventListener("click", ({ target: { dataset } }) => {
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
        btnsEdit.forEach(btn => {
            console.log("Entro a Editar");
            btn.addEventListener("click", async (e) => {
                console.log("EN Bton Editar");
                console.log(e.target.dataset.id);
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


    })
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
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = taskForm["task-codigo"];
    const fecha = taskForm["task-fecha"];
    const description = taskForm["task-description"];
    const estado = taskForm["task-estado"];
    if (!editStatus) {
        //const estado = "Nuevo";
        saveTask(codigo.value, fecha.value, description.value, estado.value);
    } else {
        updateTask(id, { codigo: codigo.value, fecha: fecha.value, description: description.value, estado: estado.value });
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

//  $(document).ready(function () {
//     alert("Entro Poner Paginador")
//     $('#tasksTable').DataTable({
//         language: {
//             processing: "Tratamiento en curso...",
//             search: "Buscar&nbsp;:",
//             lengthMenu: "Agrupar de _MENU_ items",
//             info: "Mostrando del item _START_ al _END_ de un total de _TOTAL_ items",
//             infoEmpty: "No existen datos.",
//             infoFiltered: "(filtrado de _MAX_ elementos en total)",
//             infoPostFix: "",
//             loadingRecords: "Cargando...",
//             zeroRecords: "No se encontraron datos con tu busqueda",
//             emptyTable: "No hay datos disponibles en la tabla.",
//             paginate: {
//                 first: "Primero",
//                 previous: "Anterior",
//                 next: "Siguiente",
//                 last: "Ultimo"
//             },
//             aria: {
//                 sortAscending: ": active para ordenar la columna en orden ascendente",
//                 sortDescending: ": active para ordenar la columna en orden descendente"
//             }
//         },
//         scrollY: 400,
//         lengthMenu: [ [10, 25, -1], [10, 25, "All"] ],
//     });
// });