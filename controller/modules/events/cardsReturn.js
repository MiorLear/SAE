class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        console.log("cardsReturn isn't finished");
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
                            'error': "Módulo no disponible.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un módulo no disponible por el momento.',
                            "back": true
                        });
                }
            },
            "Inicializado": {
                load() {
                    return console.error(
                        {
                            'error': "Módulo no disponible.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un módulo no disponible por el momento.',
                            "back": true
                        });
                }
            },
            "Listo": {
                load() {
                    return console.error(
                        {
                            'error': "Módulo no disponible.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un módulo no disponible por el momento.',
                            "back": true
                        });
                }
            },
            "En Curso": {
                load() {
                    return console.error(
                        {
                            'error': "Módulo no disponible.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un módulo no disponible por el momento.',
                            "back": true
                        });
                }
            },
            "Finalizado": {
                load() {

                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;

                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "manage-events-title" &&
                            $(sideBarTab).attr("id") !== "event-management-analysis-title" &&
                            $(sideBarTab).attr("id") !== "cardsReturn" &&
                            $(sideBarTab).attr("id") !== "eventAnalysis" &&
                            $(sideBarTab).attr("id") !== "checkEvent" &&
                            $(sideBarTab).attr("id") !== "checkEventCard" &&
                            $(sideBarTab).attr("id") !== "checkEventStudent")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Devolución de Tarjetas' ||
                            permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                            permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                            permission.name === 'Análisis del Evento' ||
                            permission.name === 'Gestión y Análisis de Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        if ($(sideBarTab).attr("id") === "manage-events-title")
                            if (permissions.some(permission =>
                                permission.name === 'Devolución de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "event-management-analysis-title")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Análisis del Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");


                        if ($(sideBarTab).attr("id") === "cardsReturn")
                            if (permissions.some(permission =>
                                permission.name === 'Devolución de Tarjetas' ||
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

                        if ($(sideBarTab).attr("id") === "eventAnalysis")
                            if (permissions.some(permission =>
                                permission.name === 'Análisis del Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");
                    });

                }
            },
        }

        sideBarStatus[event["status"]].load();

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