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
    async controlLog(actionDone, eventId = this.id) {

        let formData = new FormData();
        formData.append("action", "getGeneralInfo");
        formData.append("id", eventId);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const event = response['content'];

        var finalDate = new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        let log = {};

        log["author"] = this.user["name"];
        log["date"] = finalDate;
        log["ID"] = eventId;
        log["title"] = {
            "action": actionDone,
            "table": "Evento"
        }
        log["table"] = "events";
        log["Evento"] = event["name"];

        formData.set("action", "insertLog");
        formData.append("content", JSON.stringify(log));

        let logResponse = await this.ajaxRequest(
            `../model/classes/controlLog.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (logResponse["result"] !== "success") {
            console.error(logResponse);
        }

        return logResponse;
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
            return console.error(
                {
                    'error': "Evento Inexistente.",
                    'errorType': 'User Error',
                    'suggestion': 'Estás Intentando acceder a un evento inexistente',
                    "back": true
                });

        const permissions = this.user["permissions"];

        const sideBarStatus = {
            "Pendiente de Iniciar": {
                load() {
                    return console.error(
                        {
                            'error': "Evento Inexistente.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un evento inexistente',
                            "back": true
                        });
                }
            },
            "Inicializado": {
                load() {
                    return console.error(
                        {
                            'error': "Evento Inexistente.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un evento inexistente',
                            "back": true
                        });
                }
            },
            "Listo": {
                load() {
                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;
                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "manage-events-title" &&
                            $(sideBarTab).attr("id") !== "event-management-analysis-title" &&
                            $(sideBarTab).attr("id") !== "cardsPresale" &&
                            $(sideBarTab).attr("id") !== "cardsDelivery" &&
                            $(sideBarTab).attr("id") !== "start" &&
                            $(sideBarTab).attr("id") !== "checkEvent" &&
                            $(sideBarTab).attr("id") !== "checkEventCard" &&
                            $(sideBarTab).attr("id") !== "checkEventStudent")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Preventa de Tarjetas' ||
                            permission.name === 'Entrega de Tarjetas' ||
                            permission.name === 'Iniciar Evento' ||
                            permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                            permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                            permission.name === 'Gestión y Análisis de Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        if ($(sideBarTab).attr("id") === "manage-events-title")
                            if (permissions.some(permission =>
                                permission.name === 'Preventa de Tarjetas' ||
                                permission.name === 'Entrega de Tarjetas' ||
                                permission.name === 'Iniciar Evento' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "event-management-analysis-title")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "cardsPresale")
                            if (permissions.some(permission =>
                                permission.name === 'Preventa de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "cardsDelivery")
                            if (permissions.some(permission =>
                                permission.name === 'Entrega de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "start")
                            if (permissions.some(permission =>
                                permission.name === 'Iniciar Evento' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "checkEvent")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "checkEventCard")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "checkEventStudent")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");
                    });
                }
            },
            "En Curso": {
                load() {
                    return console.error(
                        {
                            'error': "Evento Inexistente.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un evento inexistente',
                            "back": true
                        });
                }
            },
            "Finalizado": {
                load() {
                    return console.error(
                        {
                            'error': "Evento Inexistente.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un evento inexistente',
                            "back": true
                        });
                }
            },
        }

        sideBarStatus[event["status"]].load();

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

        var log = await this.controlLog('Evento Iniciado');
        if (log["result"] !== "success") {
            console.error(log);
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