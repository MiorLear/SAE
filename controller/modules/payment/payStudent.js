class content {
    constructor(params) {
        this.user = params["user"];
        this.settupEventListeners();
        this.loadComplementsSelect();
        this.cardId = [];
        this.eventId;
        this.paymentId;
        this.client;
        this.cashier;
        this.total;
        this.description;
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
        $(document).on("click", "#payCardContent", async (e) => {
            e.preventDefault();
            if (!self.cardId[0] || !self.eventId || !self.cashier || !self.client || !self.description || !self.paymentId || !self.total)
                return console.error(
                    {
                        'error': "Información de pago no válida.",
                        'errorType': 'User Error',
                        'suggestion': 'Inténtalo Nuevamente en otro momento.'
                    });

            await this.payCard();
        });
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
                this.checkCard(validInputs["checkCardInput"], validInputs["clientName"], validInputs["events"]);
        });
    }
    async payCard(cardId = this.cardId, eventId = this.eventId) {

        let formData = new FormData();
        for (let index = 0; index < cardId.length; index++) {
            const element = cardId[index];
          
            formData.append("action", "payCardIndividual");
            formData.append("id", eventId);
            formData.append("cardId", element);
    
            let payCard = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));
    
            if (payCard['result'] !== 'success') {
                return console.error(payCard);
            }
        }

        formData.set("action", "payedRegister");
        formData.append("paymentId", this.paymentId);
        formData.append("cashier", this.cashier);
        formData.append("total", this.total);
        formData.append("description", this.description);
        formData.append("client", this.client);

        const self = this;
        let payCard = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (payCard['result'] !== 'success') {
            return console.error(payCard);
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Tarjeta Pagada Correctamente.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
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

            pdf.save("Pago Tarjeta");

        });
    }
    async checkCard(carnet, clientName, eventCode) {
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


        formData.set("action", "getCardOnlyFromStudent");
        formData.append("studentId", student["id"]);
        formData.append("id", eventCode);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const event = eventInfo["content"];

        if (!event)
            return console.error(
                {
                    'error': "No se Econtraron tarjetas.",
                    'errorType': 'User Error',
                    'suggestion': 'El estudiante no tiene tarjetas en el evento seleccionado.'
                });

        formData.set("action", "getCardToPay");
        formData.set("id", event["id"]);

        const cards = JSON.parse(event["cards"]);
        let cardPrice = 0;

        var cardContent = "";
        var payRows = "";
        const complementCounts = {};
        let absIndex = 1;

        if (!cards || cards == '{}')
            return console.error(
                {
                    'error': "No se Econtraron tarjetas.",
                    'errorType': 'User Error',
                    'suggestion': 'El estudiante no tiene tarjetas pendientes de pago en el evento seleccionado.'
                });


        for (let index = 0; index < Object.entries(cards).length; index++) {
            const card = Object.entries(cards)[index][1];

            if (!card)
                return console.error(
                    {
                        'error': "Tarjeta Inexistente.",
                        'errorType': 'User Error',
                        'suggestion': 'La tarjeta Ingresada no existe en el evento seleccionado.'
                    });

            this.cardId.push(card["card_id"]);

            cardPrice += parseFloat(event["price"]);

            payRows += `
            <tr>
                <th scope="row">${absIndex++}</th>
                <td>Tarjeta #${card["card_id"]}</td>
                <td>1</td>
                <td>$${event["price"]}</td>
                <td>$${event["price"]}</td>
            </tr>
            `;

            if (card["complements"] !== '{}')
                for (let index = 0; index < Object.entries(card["complements"]).length; index++) {
                    const element = Object.entries(card["complements"])[index][1];
                    if (complementCounts[element.id]) {
                        complementCounts[element.id]++;
                    } else {
                        complementCounts[element.id] = 1;
                    }
                }
        }

        if (complementCounts != '{}')
            for (let index = 0; index < Object.entries(complementCounts).length; index++) {
                const key = Object.entries(complementCounts)[index][0];
                const element = Object.entries(complementCounts)[index][1];
                const complement = await this.getComplement(key, eventCode)
                var subtotal = parseFloat(complement["price"]) * parseFloat(element);
                payRows +=
                    `
                        <tr>
                            <th scope="row">${absIndex++}</th>
                            <td>${complement["title"]}</td>
                            <td>${element}</td>
                            <td>$${parseFloat(complement["price"]).toFixed(2)}</td>
                            <td>$${subtotal.toFixed(2)}</td>
                        </tr>
                        `;
                cardPrice += parseFloat(subtotal);
            }

        payRows += `
            <tfooter style="background-color:#84B0CA ;" class="text-white">
                <tr>
                    <th scope="col">Total</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">$${cardPrice.toFixed(2)}</th>
                </tr>
            </tfooter>
            `;
        cardContent += `
            <div class="card">
                <div class="card-body">
                    <div class="container mb-5 mt-3">
                    <div class="container">
                        <div class="row">
                        <div class="col-xl-8">
                            <ul class="list-unstyled">
                            <li class="text-muted">Calle Don Bosco y Av. Manuel Gallardo, 1-1, Santa Tecla</li>
                            <li class="text-muted">Cajero: <span style="color:#5d9fc5 ;">${this.user["name"]}</span></li>
                            <li class="text-muted"><i class="fas fa-phone"></i> 2523 8800</li>
                            </ul>
                        </div>
                        <div class="col-xl-4">
                            <p class="text-muted">Recibo de Pago de Tarjeta</p>
                            <ul class="list-unstyled">
                            <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span
                                class="fw-bold">ID de Pago:</span>#${event["paymentId"]}</li>
                            <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span
                                class="fw-bold">Fecha: </span>${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/El_Salvador' }).replace(',', ' a las')}</li>
                            <li class="text-muted"><i class="fas fa-circle" style="color:#84B0CA ;"></i> <span
                                class="me-1 fw-bold">Cliente:</span> ${clientName}</li>
                            </ul>
                        </div>
                        </div>
                
                        <div class="row my-2 mx-1 justify-content-center">
                        <table class="table table-striped table-borderless">
                            <thead style="background-color:#84B0CA ;" class="text-white">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio Unitario</th>
                                <th scope="col">SubTotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${payRows}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>`

        this.eventId = eventCode;
        this.paymentId = event["paymentId"];
        this.client = clientName;
        this.total = cardPrice.toFixed(2);
        this.description = `Pago de ${Object.entries(cards).length} Tarjeta/s`;
        this.cashier = this.user["name"];

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
        $(document).off("click", "#payCardContent");
        $(document).off("click", "#printContent");
        $(document).off("click", "#saveContent");
        $(document).off("submit", "form.checkCard");
    }
}

export default content;