class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        console.log("checkEventCard isn't finished");
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
                return window.history.back();
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");

                if (Object.values(permissions).filter(permission => permission.name === 'Preventa de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#cardsPresale").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Listado de Entrega de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#cardsDelivery").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Iniciar Evento' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#start").css("display", "block");

                $("li#redeem").css("display", "none");
                $("li#salesCase").css("display", "none");
                $("li#cardsReturn").css("display", "none");
                $("li#closure").css("display", "none");
                $("li#analysis").css("display", "none");
                $("li#eventAnalysis").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#checkEventCard").css("display", "block");
                break;
            case "En Curso":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");
                $("li#cardsPresale").css("display", "none");
                $("li#cardsDelivery").css("display", "none");
                $("li#start").css("display", "none");

                if (Object.values(permissions).filter(permission => permission.name === 'Canjeo' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#redeem").css("display", "block");
                else
                    $("li#redeem").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Caja de Ventas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#salesCase").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Cerrar Evento' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#closure").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#checkEventCard").css("display", "block");

                $("li#cardsReturn").css("display", "none");
                $("li#analysis").css("display", "none");
                $("li#eventAnalysis").css("display", "none");
                break;
            case "Finalizado":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");
                $("li#cardsPresale").css("display", "none");
                $("li#cardsDelivery").css("display", "none");
                $("li#start").css("display", "none");
                $("li#redeem").css("display", "none");
                $("li#salesCase").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Listado de Devolución de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#cardsReturn").css("display", "block");
                $("li#closure").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#checkEventCard").css("display", "block");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#analysis").css("display", "block");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#eventAnalysis").css("display", "block");
                break;
        }

    }
    async settupEventListeners(eventId = this.id) {

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

    }
}

export default content;