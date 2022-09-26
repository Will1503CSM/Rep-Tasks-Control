console.log("INICIO  paintDataTable");
$('#tasksTable').DataTable({
    destroy: true,
    language: {
        processing: "Tratamiento en curso...",
            search: "Buscar&nbsp;:",
            lengthMenu: "Agrupar de _MENU_ tareas",
            info: "Mostrando de la tarea _START_ al _END_ de un total de _TOTAL_ tareas",
            infoEmpty: "No existen datos.",
            infoFiltered: "(filtrado de _MAX_ elementos en total)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron datos con tu busqueda",
            emptyTable: "No hay datos disponibles en la tabla.",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            }
        },
       // scrollY: 600,
        lengthMenu: [ [10, 20, -1], [10, 20, "All"] ],
    })