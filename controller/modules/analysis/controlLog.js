import dataTables from '../../plugins/dataTables.js';

class content extends dataTables {
    constructor(params) {
        super("#datatable-buttons");
        this.mainDataTable = "#datatable-buttons";
        this.user = params["user"];
        this.setupListeners();
        this.callContent();
    }

    setupListeners() {
        $(document).on('click', 'a.showContentModal', (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;

            if (!id)
                console.error({
                    'error': `Error al mostrar el contenido.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Not given id in the function.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                });
            this.showContentModal(id);
        });

        $('.bd-contentModal-lg').on('hidden.bs.modal', () => {
            this.cleanModal();
        });
    }

    async callContent(mainTable = this.mainDataTable) {
        try {
            await this.initWithButtons();
            let formData = new FormData();
            formData.append("action", 'callContent');

            let response = await this.ajaxRequest(`../model/classes/controlLog.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            if (!$.fn.DataTable.isDataTable(mainTable)) {
                console.error({
                    'error': `Error al cargar el contenido.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Datatable is not loaded.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                }); return;
            }

            let dataTable = $(mainTable).DataTable();
            dataTable.clear().draw();

            response['content'].forEach(content => {
                let dataTableRow = [];
                dataTableRow.push(content["id"]);
                dataTableRow.push(
                    `${JSON.parse(content["title"])["table"]} 
                    <a class="text-info showContentModal" style="cursor:pointer" title="Ver contenido" id="${content['id']}">
                        ${content["element"]}
                    </a> 
                        ${JSON.parse(content["title"])["action"]}`);
                dataTableRow.push(content["author"]);
                dataTableRow.push(content["date"]);
                // dataTableRow.push(
                // `<a class="lead text-info showContentModal" title="Ver contenido" id="${content['id']}">
                //     <i class="fas fa-eye"></i>
                //     <span class="badge badge-info" style="font-size: 0.9rem;">
                //         (${content["element"]})
                //     </span>
                // </a>`); 
                dataTable.row.add(dataTableRow);
            });

            dataTable.draw();
        } catch (error) {
            console.error({ 'error': error, 'errorType': 'notAlert' });
        }
    }

    async cleanModal() {

    }

    async showContentModal(id) {
        let formData = new FormData();
        formData.append("action", 'readContent');
        formData.append("id", id);

        var logs = "";

        let response = await this.ajaxRequest(`../model/classes/controlLog.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        let content = JSON.parse(response["content"]);
        for (const key in content) {
            if (content.hasOwnProperty(key) && key !== "table" && key !== "title" && key !== "date" && key !== "action" && key !== "author") { // Verificar si la propiedad pertenece al objeto
                const value = content[key];
                logs +=
                    `
                <hr>
                 <div class="row">
                     <div class="col-sm-3">
                     <h6 class="mb-0">${key}</h6>
                     </div>
                     <div class="col-sm-9 text-secondary">
                     ${value}
                     </div>
                 </div>
                `;
            }
        }

        logs +=
            `
                <hr>
                 <div class="row">
                     <div class="col-sm-12">
                        <b style="font-size: 1rem;">Registro hecho el ${content["date"]} por ${content["author"]}.</b>
                     </div>
                 </div>
                `;

        $(".logs").html(logs);

        $(".bd-contentModal-lg").modal('show');
    }

    async ajaxRequest(url, formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: (response) => {
                    resolve(response);
                },
                error: async (jqXHR, textStatus, errorThrown) => {
                    await reject(
                        {
                            "error": "Petición Fallida",
                            "errorType": "Client Error",
                            "errorCode": "404",
                            "errorDetails": `Text Status: ${textStatus} \n errorThrown: ${errorThrown} \n jqXHR ${jqXHR}`,
                            "suggestion": "Verifica tu conexión a internet.",
                            'logout': true
                        }
                    );
                }
            });
        });
    }

    async cleanup() {
        $(document).off('click', 'a.showContentModal');
        $('.bd-contentModal-lg').off('hidden.bs.modal');
    }
}

export default content;