class sessionManager {
    constructor() {
        // this.checkSession();
    }

    async checkSession(src) {
        const formData = new FormData()
        formData.append("action", 'checkUserSession');

        let response = await this.ajaxRequest(src, formData)
            .catch(e => (
                {
                    'error': e['error'] !== 'Request failed'
                        ? e
                        : {
                            "error": "Petición Fallida.",
                            "errorType": "Client Error",
                            "errorCode": "404",
                            "errorDetails": `La peticion no se pudo realizar correctamente.`,
                            "suggestion": "Verifica tu conexión a internet.",
                            "logout": true
                        }
                }));

        if (response['result'] !== 'success') {
            return response;
        }

        return response;
    }

    async deleteSession(src) {
        const formData = new FormData()
        formData.append("action", 'signOutUserSession');

        let response = await this.ajaxRequest(src, formData)
            .catch(e => (
                {
                    'error': e['error'] !== 'Request failed'
                        ? e
                        : {
                            "error": "Petición Fallida.",
                            "errorType": "Client Error",
                            "errorCode": "404",
                            "errorDetails": `La peticion no se pudo realizar correctamente.`,
                            "suggestion": "Verifica tu conexión a internet.",
                            "logout": true
                        }
                }));

        if (response['result'] !== 'success') {
            return response;
        }

        return(response);
    }

    async startSession(mail, password, src) {
        var formData = new FormData()
        formData.append("action", 'startUserSession');
        formData.append("mail", mail);
        formData.append("password", password);

        let response = await this.ajaxRequest(src, formData)
            .catch(e => (
                {
                    'error': e['error'] !== 'Request failed'
                        ? e
                        : {
                            "error": "Petición Fallida.",
                            "errorType": "Client Error",
                            "errorCode": "404",
                            "errorDetails": `La peticion no se pudo realizar correctamente.`,
                            "suggestion": "Verifica tu conexión a internet.",
                            'logout': true
                        }
                }
            ));

        if (response['result'] !== 'success') {
            console.error(response);
        }

        return response;
    }

    ajaxRequest(url, formData) {
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

}
export default sessionManager;