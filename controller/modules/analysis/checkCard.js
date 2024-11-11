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
        $("select#events").selectpicker("refresh"); // Correct: Refresh selectpicker

        // Now, you can setup event listeners
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


            let cardInput = $("#checkCardInput");
            let cardInputVal = $(cardInput).val(); // Corrected: Using 'cardInput'

            let eventsInput = $("#events");
            let eventsInputVal = $(eventsInput).val(); // Use selectpicker method to get value

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
                this.checkCard(validInputs["checkCardInput"], validInputs["events"]);
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

            pdf.save("Revisión de Tarjeta");

        });
    }
    async checkCard(cardId, eventId) {
        let formData = new FormData();
        formData.append("action", "getCard");
        formData.append("cardId", cardId);
        formData.append("id", eventId);

        let cardInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (cardInfo['result'] !== 'success') {
            console.error(cardInfo);
            return;
        }

        const card = JSON.parse(cardInfo['content']);
        var student;

        if (!card)
            return console.error(
                {
                    'error': "Tarjeta Inexistente.",
                    'errorType': 'User Error',
                    'suggestion': 'La tarjeta Ingresada no existe en el evento seleccionado.'
                });

        if (!isNaN(card["family_id"])) {
            formData.set("action", "callName");
            formData.set("id", card["family_id"]);

            let studentName = await this.ajaxRequest(`../model/classes/students.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (studentName['result'] !== 'success') {
                console.error(studentName);
                return;
            }
            var student = studentName["content"]["name"];
            console.log(student);
        } else {
            var student = card["family_id"];
        }


        formData.set("action", "getCardToPay");
        formData.set("id", eventId);

        formData.set("action", "getIdNameNPrice");
        formData.set("id", eventId);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const event = eventInfo["content"];

        let cardPrice = parseFloat(event["price"]);

        var complements = ""
        if (card["complements"] !== '{}')
            for (let index = 0; index < Object.entries(card["complements"]).length; index++) {
                const element = Object.entries(card["complements"])[index][1];
                const complement = await this.getComplement(element["id"], eventId)
                complements += `${complement["title"]} (${element["exchanged"] ? 'Canjeado el ' + element["exchangedDate"] : 'Pendiente de Canjear'}) <br>`;
                cardPrice += parseFloat(complement["price"]);
            }

        var cardContent = `
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
                ${event["name"]}
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
                <h6 class="mb-0">Cliente</h6>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                ${student}
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
            <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                 ${complements}
            </div>        
        </div>
        `;

        // for (let index = 0; index < Object.entries(card).length; index++) {
        //     const key = Object.entries(card)[index][0];
        //     const element = Object.entries(card)[index][1];
        //     cardInfo +=
        //         `
        //         <div class="row px-4 mx-4">
        //             <div class="col-lg-3 col-md-3 col-sm-12">
        //             <h6 class="mb-0">${key}</h6>
        //             </div>
        //             <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
        //             ${element}
        //             </div>
        //         </div>
        //         <hr class="px-4 mx-4">
        //     `;
        // }

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