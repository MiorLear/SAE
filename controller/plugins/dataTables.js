class dataTables {
    constructor(selector = "#datatable-buttons") {
        this.selector = selector; // Ahora el selector es un argumento opcional
        // this.initWithButtons();
    }

    // Método para inicializar la tabla con botones y visibilidad de columnas
    initWithButtons(table = this.selector) {
        $(document).ready(() => {
            $(table).DataTable({
                lengthChange: true, // Desactivar la opción de cambiar longitud
                buttons: [
                    'copy',
                    'excel',
                    'pdf',
                    'colvis'  // Opción de visibilidad de columnas
                ],
                language: {
                    decimal: "",
                    emptyTable: "No hay datos disponibles en la tabla",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                    infoFiltered: "(filtrado de _MAX_ entradas totales)",
                    lengthMenu: "Mostrar _MENU_ entradas",
                    loadingRecords: "Cargando...",
                    processing: "Procesando...",
                    search: "Buscar:",
                    zeroRecords: "No se encontraron registros coincidentes",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                },
                columnDefs: [
                    {
                        targets: [0], // Índice de la columna que quieres ocultar
                        visible: false // Ocultar por defecto
                    }
                ],
                responsive: true,
                "order": [[0, "desc"]],
                "pageLength": 25, // Default number of rows
                "lengthMenu": [10, 25, 50, 100],
            }).buttons().container()
                .appendTo(`${table}_wrapper .col-md-6:eq(0)`);
        });
    }

    // Método para inicializar la tabla con botones y visibilidad de columnas
    init(table = this.selector) {
        $(document).ready(() => {
            return  $(table).DataTable({
                lengthChange: false, // Desactivar la opción de cambiar longitud
                searching:false,
                paging: false,
                ordering:  false,
                info: false,
                language: {
                    decimal: "",
                    emptyTable: "No hay datos disponibles en la tabla",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                    infoFiltered: "(filtrado de _MAX_ entradas totales)",
                    lengthMenu: "Mostrar _MENU_ entradas",
                    loadingRecords: "Cargando...",
                    processing: "Procesando...",
                    search: "Buscar:",
                    zeroRecords: "No se encontraron registros coincidentes",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                },
                columnDefs: [
                    {
                        targets: [0], // Índice de la columna que quieres ocultar
                        visible: false // Ocultar por defecto
                    }
                ],
                responsive: true,
                "order": [[0, "desc"]],
                "pageLength": 25, // Default number of rows
                "lengthMenu": [10, 25, 50, 100],
            });
        });
    }
}

export default dataTables;
