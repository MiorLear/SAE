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

        switch (event["status"]) {
            case "Pendiente de Iniciar":
                return window.history.back();
            case "Inicializado":
                return window.history.back();
            case "Listo":
                return window.history.back();
            case "En Curso":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");
                $("li#cardsPresale").css("display", "none");
                $("li#cardsDelivery").css("display", "none");
                $("li#start").css("display", "none");
                $("li#redeem").css("display", "block");
                $("li#salesCase").css("display", "block");
                $("li#cardsReturn").css("display", "none");
                $("li#closure").css("display", "block");
                $("li#analysis").css("display", "none");
$("li#eventAnalysis").css("display", "none");
                $("li#checkEventCard").css("display", "block");
                break;
            case "Finalizado":
                return window.history.back();
        }

    }
    async settupEventListeners(eventId = this.id) {
        $(document).on("click", ".endEvent", async (e) => {
            this.endEvent();
        });
    }
    async endEvent(id = this.id) {

        let formData = new FormData();
        formData.append("action", "endEvent");
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
                text: 'Evento Finalizado Correctamente.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            }
        ).then(()=>{
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
        $(document).off("click", ".endEvent");
    }
}

export default content;