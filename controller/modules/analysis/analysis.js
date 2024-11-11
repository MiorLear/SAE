import dashboard from "../../plugins/dashBoard.js";

class content extends dashboard {
    constructor(params) {
        super()
        this.user = params["user"];
        this.loadGraphsInfo();
    }
    
    async loadGraphsInfo() {
        let formData = new FormData();
        formData.append("action", "getGraphInfo");
    
        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));
    
        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }
    
        const graphs = response["content"];
    
        $(".eventsNumber").text(graphs["totalEvents"] || "0");
        if (graphs["eventsTotalRevenue"]) {
            $(".anualRevenues").text("$" + graphs["eventsTotalRevenue"]);
        } else {
            $(".anualRevenues").text("No hay información disponible para este reporte.");
        }
    
        const data = graphs["eventRevenues"] || [];
    
        if (data.length > 0) {
            const stackedData = data.map(item => ({
                y: item.event_name,
                a: item.total_value ? parseInt(item.total_value) : 0 // Validar total_value para evitar valores nulos
            }));
    
            this.createStackedChart(
                'morris-bar-stacked',
                stackedData,
                'y',
                ['a'],
                ['Ganancias Estimadas'],
                ['#23cbe0']
            );
        } else {
            $(".barGraphContainer").text("");
        }
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