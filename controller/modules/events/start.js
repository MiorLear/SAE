class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
    }
    getID() {
        var url = window.location.search;
        const param = new URLSearchParams(url);
        return param.get('event');
    }
    async checkEventExist(id = this.id) {
        let formData = new FormData();
        formData.append("action", "checkEventExist");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const event = response['content'];

        var eventExist = parseFloat(event["check"]);

        if (eventExist < 1 || Number.isNaN(eventExist))
            return window.history.back();

        const permissions = this.user["permissions"];

        switch (event["status"]) {
            case "Pendiente de Iniciar":
                return window.history.back();
            case "Inicializado":
                return window.history.back();
            case "Listo":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");

                if (Object.values(permissions).filter(permission => permission.name === 'Preventa de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#cardsPresale").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Listado de Entrega de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#cardsDelivery").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Iniciar Evento' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#start").css("display", "block");

                $("li#redeem").css("display", "none");
                $("li#salesCase").css("display", "none");
                $("li#cardsReturn").css("display", "none");
                $("li#closure").css("display", "none");
                $("li#analysis").css("display", "none");
                $("li#eventAnalysis").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length > 0)
                    $("li#checkEventCard").css("display", "block");
                break;
                break;
            case "En Curso":
                return window.history.back();
            case "Finalizado":
                return window.history.back();
        }

    }
    async settupEventListeners(eventId = this.id) {
        $(document).on("click", ".startEvent", async (e) => {
            this.startEvent();
        });
    }
    async startEvent(id = this.id) {

        let formData = new FormData();
        formData.append("action", "startEvent");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Evento Iniciado Correctamente.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            }
        ).then(() => {
            window.location.href = './main.html?content=eventPanel&event=' + id;
        });

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
        $(document).off("click", ".startEvent");
    }
}

export default content;