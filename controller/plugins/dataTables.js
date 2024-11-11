class dataTables {
    constructor(selector = "#datatable-buttons") {
        this.selector = selector;
        // this.initWithButtons();
    }

    initWithButtons(table = this.selector) {
        $(document).ready(() => {
            const dataTable = $(table).DataTable({
                lengthChange: true,
                buttons: [
                    'copy',
                    'excel',
                    'pdf',
                    'colvis'
                ],
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.childRowImmediate,
                        type: 'column',
                        targets: 1
                    }
                },
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
                        targets: [0],
                        visible: false
                    },
                    {
                        targets: 1,
                        responsivePriority: 1,  
                        visible: true  
                      },
                      {
                        targets: '_all', 
                        responsivePriority: 100, 
                        visible: true 
                      }
                ],
                order: [[0, "desc"]],
                pageLength: 25,
                lengthMenu: [10, 25, 50, 100],
            });
    
            dataTable.columns.adjust().responsive.recalc().buttons().container()
                .appendTo(`${table}_wrapper .col-md-6:eq(0)`);
        });
    }
    

    init(table = this.selector) {
        $(document).ready(() => {
            return $(table).DataTable({
                lengthChange: false,
                searching: false,
                paging: false,
                ordering: false,
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
                        targets: [0],
                        visible: false
                    }
                ],
                responsive: true,
                "order": [[0, "desc"]],
                "pageLength": 25,
                "lengthMenu": [10, 25, 50, 100],
            });
        });
    }
}

export default dataTables;
