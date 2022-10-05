import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./firestore.js"
import { loadDataTable } from "./paintDataTable.js"
//import saveTask from "./firestore.js"
const taskForm = document.getElementById("task-form");
const tabla = document.getElementById("tasksTable");
// Obtener la referencia del elemento body
const body = document.getElementsByTagName("body")[0];
// Crea un elemento <table> y un elemento <tbody>
const tblBody = document.createElement("tbody");
// DataTable
var tableDT = null;
// id obtenido al agregar Doc en Firestore
var idObt = null;
// Creamos constantes para los iconos editar y borrar    
const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

let contRows = 0;
let editStatus = false;
let id = "";
let idNuevo = null;
let ban = false;
window.addEventListener("load", async () => {
    console.log("ingreso a Load");
    onGetTasks((querySnapshot) => {
        console.log("Obtiene Snapshot");
        let cont = 0;
        querySnapshot.forEach((doc) => {
            cont += 1;
            const task = doc.data()
            const row = document.createElement("tr");
            row.id = cont;

            const celda = document.createElement("td");
            const textoCelda = document.createTextNode(doc.id);
            celda.appendChild(textoCelda);
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
            const btnA = document.createElement("button");
            btnA.type = "button"
            btnA.setAttribute("data-id", doc.id);
            btnA.classList.value = "btn btn-primary btn-edit btn-sm";
            btnA.setAttribute("data-bs-toggle", "modal");
            btnA.setAttribute("data-bs-target", "#ventanaModal");
            btnA.id = doc.id;
            btnA.innerHTML = iconoEditar;
            celda5.appendChild(btnA);
            row.appendChild(celda5);

            const celda6 = document.createElement("td");
            const btnE = document.createElement("button");
            btnA.type = "button"
            btnE.setAttribute("data-id", doc.id);
            btnE.classList.value = "btn-delete btn btn-danger  btn-sm";
            btnE.id = doc.id;
            btnE.innerHTML = iconoBorrar;
            celda6.appendChild(btnE);
            row.appendChild(celda6);

            tblBody.appendChild(row);

            const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            //console.log(source, " data: ", doc.data());
            if (source == "Local") {
                //idNuevo = doc.data().codigo;
                var cod = doc.data().codigo;
                var fec = doc.data().fecha;
                var des = doc.data().description;
                var est = doc.data().estado;
                console.log("Dentro de Local idObt: " + idObt);
                const btnActu = "<button type='" + "button" + "' data-id='" + (idObt) + "' class='" + "btn btn-primary btn-edit btn-sm" + "' data-bs-toggle='" + "modal" + "' data-bs-target='" + "#ventanaModal" + "' id='" + (idObt) + "'>" + iconoEditar + "</button>";
                const btnElim = "<button data-id='" + (idObt) + "' class=" + "'btn btn-danger btn-delete btn-sm'" + " id='" + (idObt) + "'>" + iconoBorrar + "</button>";
                tableDT.row.add(["idObt", cod, fec, des, est, btnActu, btnElim]).draw();//.node()//.id=(contRows+1);
                console.log("Antes de Reload")

            }
        })
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tabla);
        console.log("Termino de Construir Tabla");
        contRows = cont;
        cont = 0;

        tableDT = loadDataTable();

        ban = true;

        // querySnapshot.docChanges().forEach((change) => {
        //     console.log(change.type);
        //     if (change.type === "added") {
        //         console.log("New Data: ", change.doc.data());
        //     }
        //     if (change.type === "modified") {
        //         console.log("Modified Data: ", change.doc.data());
        //     }
        //     if (change.type === "removed") {
        //         console.log("Removed Data: ", change.doc.data());
        //     }
        // });
        // Al hacer clich en Boton Eliminar
        var btnsDelete = tabla.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            btn.addEventListener("click", ({ target: { dataset } }) => {
                console.log("Click en Boton Eliminar" + btnsDelete);
                console.log("dataset: " + dataset.id);
                var resultado = window.confirm('Estas seguro?');
                if (resultado === true) {
                    deleteTask(dataset.id);
                    tableDT.row(".selected").remove().draw(false);
                }
            })
        })

        // $('#tasksTable tbody').on('click', 'tr', function () {
        //     console.log("Entro a Click");
        //     // Check for 'selected' class and remove
        //     if ($(this).hasClass('selected')) {
        //         $(this).removeClass('selected');
        //     }
        //     else {
        //         tableDT.$('tr.selected').removeClass('selected');
        //         $(this).addClass('selected');
        //     }
        // });

        // Al hacer clich en Boton Editar
        const btnsEdit = document.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                console.log(btn.getAttribute("id"));
                const doc = await getTask(btn.getAttribute("id"));
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

    })
    contRows = 0;

});

// Al hacer click en Nuevo
const btnNew = document.getElementById("btn-Nuevo");
btnNew.addEventListener("click", (e) => {
    console.log("Click en Boton Nuevo");
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



// Al hacer clich en Guardar
taskForm.addEventListener("submit", (e) => {
    console.log("Ingreso a Guardar/Actu");
    e.preventDefault();
    const codigo = (taskForm["task-codigo"]).value;
    const fecha = (taskForm["task-fecha"]).value;
    const description = (taskForm["task-description"]).value;
    const estado = (taskForm["task-estado"]).value;
    if (!editStatus) {
        console.log("Antes de Agregar Nuevo");
        idObt = saveTask(codigo, fecha, description, estado).then(function (mensaje) {
            console.log("Ingreso Correcto: " + idObt + " Mensaje: " + mensaje);

        }).catch(function (error) {
            console.log("error:" + error.message)
        })
    } else {
        updateTask(id, { codigo: codigo, fecha: fecha, description: description, estado: estado });
        const rowId = tableDT.row({ selected: true }).count();
        console.log("Entro a Update Id: " + id + " row: " + rowId);
        const btnActu = "<button type='" + "button" + "' data-id='" + (id) + "' class='" + "btn btn-primary btn-edit btn-sm" + "' data-bs-toggle='" + "modal" + "' data-bs-target='" + "#ventanaModal" + "' id='" + (id) + "'>" + iconoEditar + "</button>";
        const btnElim = "<button data-id='" + (id) + "' class=" + "'btn btn-danger btn-delete btn-sm'" + " id='" + (id) + "'>" + iconoBorrar + "</button>";
        // tableDT.row(rowId).data([ id, codigo, fecha, description, estado, btnActu, btnElim ]).draw();
        editStatus = false;
    }
    console.log("Antes de loadDataTable");
    //eliminarRows();
    //$('#tasksTable').remove();
    //$('#tasksTable').draw();

    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
});



// Al HAcer CLick en Cerrar dentro de Modal
taskForm.addEventListener("reset", (e) => {
    e.preventDefault();
    taskForm["btn-task-save"].innerText = "Guardar";
    taskForm.reset();
    const ventModal = document.getElementById("ventanaModal");
    editStatus = false;
    ventModal.classList.remove("show");
    ventModal.style.display = "none";
})
// Al hacer click en X
const btnX = document.getElementById("btn-X");
btnX.addEventListener("click", (e) => {
    const ventModal = document.getElementById("ventanaModal");
    ventModal.classList.remove("show");
    ventModal.style.display = "none";
})

//Eliminar Rows de la Tabla
function eliminarRows() {
    //tableDT.destroy();
}

function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.append(script);
}

