class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
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

        if (event < 1)
            return window.history.back();

        this.checkUpElements();
    }

    async checkUpElements(id = this.id) {
        let formData = new FormData();
        formData.append("action", "getGeneralInfo");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const event = response['content'];

        const largeDate = fechaString => {
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const [dia, mes, año] = fechaString.split('/').map(Number);
            return `${meses[mes - 1]} ${dia}, ${año}`;
        };

        $(".eventStatus").text(event['status']);
        $(".eventTitle").text(event['name']);
        $(".eventYear").text(event['year']);
        $(".eventDate").text(largeDate(event['date']));
        $(".eventPrice").text('$' + event['price']);
        $(".eventDifference").text(event['difference'] > 0 ? `El evento ya ha finalizado, hace ${event['difference']} días.` : `Faltan ${Math.abs(event['difference'])} días para el evento.`);

        var eventComplements = "";
        
        for (let index = 0; index < Object.keys(JSON.parse(event['complements'])).length; index++) {
            const id =  Object.keys(JSON.parse(event['complements']))[index];
            const element = JSON.parse(event['complements'])[id];
            eventComplements += `
             <div class="row">
              <div class="col-6 text-center">${element["title"]}</div>
              <div class="col-6">
                <span
                  class="badge badge-success mb-2 text-left"
                  style="
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    font-size: 1rem;
                  "
                  >$${element["price"]}</span
                >
              </div>
            </div>
            `;
        }
        if (0 >= Object.keys(JSON.parse(event['complements'])).length)
            $(".eventComplements").html('<p class="text-center">No posee Consumibles</p>');
        else
            $(".eventComplements").html(eventComplements);

        var eventLevels = "";
        JSON.parse(event['levels']).forEach(element => {
            eventLevels += `
            <span
              class="badge badge-secondary mb-1"
              style="
                display: flex;
                text-align: center;
                justify-content: center;
                font-size: 1rem;
              ">${element}
            </span>`
        });
        $(".eventLevels").html(eventLevels);


        var formattedDate = event['date'].split('/').reverse().join('-');


        let calendar = new FullCalendar.Calendar($("#calendar")[0], {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    id: event['id'],
                    title: event['name'],
                    start: formattedDate
                }
            ]
        });

        calendar.gotoDate(formattedDate);
        calendar.render();

        formData.set("action", "getStudentsNumber");

        let studentsResponse = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (studentsResponse['result'] !== 'success') {
            console.error(studentsResponse);
            return;
        }

        const studentsNumber = studentsResponse['content'];

        $(".studentsNumber").text(studentsNumber);

        return event;
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