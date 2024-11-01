import dashboard from "../../plugins/dashBoard.js";

class content extends dashboard{
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

        console.log(graphs);

        
        $(".eventsNumber").text(graphs["totalEvents"]);
        $(".anualRevenues").text("$"+graphs["eventsTotalRevenue"]);

        const data = graphs["eventRevenues"];
    
        // Transformar los datos
        const stackedData = data.map(item => {
            return {
                y: item.event_name,
                a: parseInt(item.total_value) * 1, // Por ejemplo, 40% para la categoría a
                
            };
        });
    
        this.createStackedChart(
            'morris-bar-stacked',
            stackedData,
            'y',
            ['a'],
            ['Ganancias Estimadas'],
            ['#23cbe0']
        );

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