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
        lengthMenu: [ [10, 20, -1], [10, 20, "All"] ],
        columnDefs: [
            {
                targets: [0], 
                visible: false, //ocultamos la columna de ID que es la [0]                        
            },
            // {
            //     targets: -1,        
            //     defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
            // }
        ]	   
    })
    