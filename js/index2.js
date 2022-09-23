import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./firestore.js"
const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
let editStatus = false;
let id = "";
let ban = false;

window.addEventListener("DOMContentLoaded", async () => {
    onGetTasks((querySnapshot) => {
        alert("Entro a Crear Tabla");
        let chtml = "";
        let cont = 0;
        tasksContainer.innerHTML = "";

        querySnapshot.forEach(doc => {
            cont += 1;
            const task = doc.data()
            chtml += `
                        <tr  id="${doc.id}">
                            <th style="width:5%">
                                <fieldset class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="optionsRadios" id="${doc.id}" value="option2">
                                    </div>
                                </fieldset>
                            </th>
                            <td style="width:10%">${task.codigo}</td>
                            <td style="width:10%">${task.fecha}</td>
                            <td style="width:60%">${task.description}</td>
                            <td style="width:5%">${task.estado}</td></td>
                            <td style="width:5%"><button class="btn btn-primary btn-delete btn-sm" data-id="${doc.id}" >Eliminar</button></td>       
                            <td style="width:5%"><button type="button" class="btn btn-secondary btn-edit btn-sm" data-id="${doc.id}" data-bs-toggle="modal" data-bs-target="#ventanaModal">Editar</button></td>     
                        </tr>
                    `;
        })

        //<tfoot>
        //<tr>
        //    <td colspan="7">Número de Tareas: ${cont}</td>
        //</tr>
        //</tfoot>
        //genera_tabla();
        cont = 0;
        tasksContainer.innerHTML += chtml;
        genera_tabla();
        // let table = new DataTable('#tasksTable', {
        //     // options
        // });

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

function genera_tabla() {
    // Obtener la referencia del elemento body
    var body = document.getElementsByTagName("body")[0];

    // Crea un elemento <table> y un elemento <tbody>
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tasksTable");
    tabla.setAttribute("class", "table table-hover");

    var tblBody = document.createElement("tbody");

    // Crea las celdas
    for (var i = 0; i < 6; i++) {
        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");

        for (var j = 0; j < 6; j++) {
            // Crea un elemento <td> y un nodo de texto, haz que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la hilera de la tabla
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode("celda en la hilera " + i + ", columna " + j);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }

        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(hilera);
    }

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    //tabla.setAttribute("border", "2");
}