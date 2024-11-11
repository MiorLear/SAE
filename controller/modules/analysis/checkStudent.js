class content {
    constructor(params) {
        this.user = params["user"];
        this.settupEventListeners();
        this.loadComplementsSelect();
    }
    async loadComplementsSelect() {
        let formData = new FormData();
        formData.append("action", "getEvents");

        let eventsInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventsInfo['result'] !== 'success') {
            console.error(eventsInfo);
            return;
        }

        const events = eventsInfo["content"];
        let eventsOption = "";

        for (let index = 0; index < Object.entries(events).length; index++) {
            const element = Object.entries(events)[index][1];
            eventsOption += `<option data-tokens="${element["name"]}" value="${element["id"]}">${element["name"]}</option>`;
        }

        $('.form-select').selectpicker({
            locale: 'es'
        });
        $("select#events").html(eventsOption);
        $("select#events").selectpicker("refresh");

    }
    async settupEventListeners() {
        const self = this;
        $(document).on("click", "#printContent", async (e) => {
            e.preventDefault();
            self.printPDF();
        });
        $(document).on("click", "#saveContent", async (e) => {
            e.preventDefault();
            self.savePDF();
        });
        $(document).on("submit", "form.checkCard", async (e) => {
            e.preventDefault();

            let notFilled = [];
            let validInputs = {};

            $(e.currentTarget).find("input, select").each(function () {
                var formElement = this;
                var formElementVal = $(formElement).val();

                if (!$(formElement).attr("id")) return;

                $(`.form-control-${$(formElement).attr("id")}-feedback`).css("display", "none");
                $(`.form-${$(formElement).attr("id")}`).removeClass('has-warning');

                if (formElementVal == "") {
                    notFilled.push(formElement);
                } else {
                    validInputs[$(formElement).attr("id")] = formElementVal;
                }
            })

            notFilled.forEach(input => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css("display", "block").text(`Por favor, ${$(input).attr('placeholder')}.`);
                $(`.form-${$(input).attr("id")}`).addClass('has-warning');
                $(input).focus(); // Corrected: Using 'cardInput'
            });


            if (!notFilled.length)
                this.checkStudent(validInputs["checkCardInput"], validInputs["events"]);
        });
    }
    printPDF() {
        const self = this;
        html2canvas($(".checkContent")[0]).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

            var topPadding = 25;

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            let imgWidth = pageWidth;
            let imgHeight = ((canvas.height * imgWidth) / canvas.width);

            if (imgHeight > pageHeight) {
                topPadding = 10;
                const scaleFactor = pageHeight / imgHeight;
                imgWidth *= scaleFactor;
                imgHeight *= scaleFactor;
            }

            pdf.addImage(imgData, 'PNG', 0, topPadding, imgWidth, imgHeight);

            self.pdfBlob = pdf.output('blob');

            //   pdf.save("Revisión de Tarjeta");

            const pdfUrl = URL.createObjectURL(self.pdfBlob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = pdfUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            //   pdf.print();

            //   const pdfUrl = URL.createObjectURL(self.pdfBlob);
            //   self.iframeElement.attr('src', pdfUrl);

            //   self.modalElement.modal('show');
        });
    }
    savePDF() {
        const self = this;
        html2canvas($(".checkContent")[0]).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

            var topPadding = 25;

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            let imgWidth = pageWidth;
            let imgHeight = ((canvas.height * imgWidth) / canvas.width);

            if (imgHeight > pageHeight) {
                topPadding = 10;
                const scaleFactor = pageHeight / imgHeight;
                imgWidth *= scaleFactor;
                imgHeight *= scaleFactor;
            }

            pdf.addImage(imgData, 'PNG', 0, topPadding, imgWidth, imgHeight);

            self.pdfBlob = pdf.output('blob');

            pdf.save("Revisión de Tarjeta por Estudiante");

        });
    }
    async checkStudent(carnet, event) {

        if (isNaN(carnet))
            return console.error({
                'error': "Carnet Inválido.",
                'errorType': 'User Error',
                'suggestion': 'El carnet ingresado no es válido.'
            });

        let formData = new FormData();
        formData.append("action", "getStudentIdFromCarnet");
        formData.append("studentCarnet", carnet);

        let studentInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (studentInfo['result'] !== 'success') {
            console.error(studentInfo);
            return;
        }

        const student = studentInfo['content'];

        if (!student)
            return console.error(
                {
                    'error': "Carnet Incorrecto.",
                    'errorType': 'User Error',
                    'suggestion': 'No hay ningún estudiante registrado con el carnet brindado.'
                });


        formData.set("action", "getCardOnlyFromStudentCheck");
        formData.append("studentId", student["id"]);
        formData.append("id", event);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const events = eventInfo["content"];

        if (!events || Object.entries(events).length == 0)
            return console.error(
                {
                    'error': "No se han encontrado tarjetas.",
                    'errorType': 'User Error',
                    'suggestion': 'No se han encontrado tarjetas relacionadas a la familia ' + student["name"] + '.'
                });

        var cardContent = "";


        const cards = JSON.parse(events["cards"]);
        if (!cards || cards == '{}')
            return console.error(
                {
                    'error': "No se Econtraron tarjetas.",
                    'errorType': 'User Error',
                    'suggestion': 'El estudiante no tiene tarjetas de la familia en el evento seleccionado.'
                });

        for (let eventIndex = 0; eventIndex < Object.entries(cards).length; eventIndex++) {
            const card = Object.entries(cards)[eventIndex][1];

            let cardPrice = parseFloat(events["price"]);

            var complements = ""

            console.log(card);

            if (card?.["complements"] || card["complements"] !== '{}')
                for (let complementIndex = 0; complementIndex < Object.entries(card["complements"]).length; complementIndex++) {
                    const element = Object.entries(card["complements"])[complementIndex][1];
                    const complement = await this.getComplement(element["id"], event)
                    complements += `${complement["title"]} (${element["exchanged"] ? 'Canjeado el ' + element["exchangedDate"] : 'Pendiente de Canjear'}) <br>`;
                    cardPrice += parseFloat(complement["price"]);
                }

            cardContent += `
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Código de Tarjeta</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${card["card_id"]}
                        </div>
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Nombre del Evento</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${events["name"]}
                        </div>
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Precio de la Tarjeta</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            $${cardPrice}
                        </div>
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Estudiante</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${student["name"]}
                        </div>
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Tipo de Tarjeta</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${card["type"] == "assignedCard" ? "Tarjeta Asignada" : "Tarjeta Añadida"}
                        </div>        
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Estado de Canjeo</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${card["exchanged"] ? 'Canjeado el ' + card["exchangedDate"] : "Tarjeta Pendiente de Canjear"}
                        </div>        
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Estado de Pago</h6>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                            ${card["payed"] ? 'Pagado el ' + card["payedDate"] : "Tarjeta Pendiente de Pago"}
                        </div>        
                    </div>
                    <hr class="px-4 mx-4">
                    <div class="row px-4 mx-4">
                        <div class="col-lg-3 col-md-3 col-sm-12">
                            <h6 class="mb-0">Complementos de la tarjeta</h6>
                        </div>
                    <div class="col-lg-9 col-md-9 col-sm-12 mt-2 py-2 text-secondary">
                            ${complements}
                        </div>        
                    </div>
        
                    <hr class="px-2 mx-2 pt-5 mt-5">    
                    `;
        }




        $(".checkContent").html(cardContent);

        $(".bd-checkModal-lg").modal("show");
    }
    async getComplement(complementId, eventId) {
        let formData = new FormData();
        formData.append("action", "getComplement");
        formData.append("complementId", complementId);
        formData.append("id", eventId);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }
        return JSON.parse(response["content"]);
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
        $(document).off("click", "#printContent");
        $(document).off("click", "#saveContent");
        $(document).off("submit", "form.checkCard");
    }
}

export default content;