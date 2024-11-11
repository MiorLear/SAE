class content {
    constructor(params) {
        this.user = params["user"];
        this.settupEventListeners();
        this.loadComplementsSelect();
        this.cardId;
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
        $("select#events").selectpicker("refresh"); // Correct: Refresh selectpicker

        // Now, you can setup event listeners
    }
    async settupEventListeners() {
        const self = this;
        $(document).on("click", "#payCardContent", async (e) => {
            e.preventDefault();
            if (!self.cardId || !self.eventId || !self.cashier || !self.client || !self.description || !self.paymentId || !self.total)
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
                this.checkCard(validInputs["checkCardInput"], validInputs["events"], validInputs["clientName"]);
        });
    }
    async payCard(cardId = this.cardId, eventId = this.eventId) {
        let formData = new FormData();
        formData.append("action", "payCard");
        formData.append("id", eventId);
        formData.append("cardId", cardId);
        formData.append("paymentId", this.paymentId);
        formData.append("cashier", this.cashier);
        formData.append("total", this.total);
        formData.append("description", this.description);
        formData.append("client", this.client);

        const self = this;

        console.log(cardId + " " + eventId);

        let payCard = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (payCard['result'] !== 'success') {
            return console.error(payCard);
        }

        // self.savePDF();
        // self.printPDF();

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
    async checkCard(cardId, eventId, clientName) {
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

        console.log(card);

        if (!card)
            return console.error(
                {
                    'error': "Tarjeta Inexistente.",
                    'errorType': 'User Error',
                    'suggestion': 'La tarjeta Ingresada no existe en el evento seleccionado.'
                });

        if (card["type"] == "assignedCard") {
            formData.set("action", "callName");
            formData.set("id", card["family_id"]);

            let studentName = await this.ajaxRequest(`../model/classes/students.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (studentName['result'] !== 'success') {
                console.error(studentName);
                return;
            }
            var student = ["content"]["name"];
        }else{
            var student = card["family_id"];
        }


        formData.set("action", "getCardToPay");
        formData.set("id", eventId);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const event = eventInfo["content"];

        let cardPrice = parseFloat(event["price"]);

        var payRows = `
        <tr>
            <th scope="row">1</th>
            <td>Tarjeta #${cardId}</td>
            <td>1</td>
            <td>$${event["price"]}</td>
            <td>$${event["price"]}</td>
        </tr>
        `;

        var complements = ""

        if (card["complements"] !== '{}')
            for (let index = 0; index < Object.entries(card["complements"]).length; index++) {
                const element = Object.entries(card["complements"])[index][1];
                const complement = await this.getComplement(element["id"], eventId)
                complements += `${complement["title"]} (${element["exchanged"] ? 'Canjeado el ' + element["exchangedDate"] : 'Pendiente de Canjear'}) <br>`;
                payRows +=
                    `
            <tr>
                <th scope="row">${index + 2}</th>
                <td>${complement["title"]}</td>
                <td>1</td>
                <td>$${complement["price"]}</td>
                <td>$${complement["price"]}</td>
            </tr>
            `;
                cardPrice += parseFloat(complement["price"]);
            }

        payRows += `
        <tfooter style="background-color:#84B0CA ;" class="text-white">
              <tr>
                <th scope="col">Total</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col">$${cardPrice}</th>
              </tr>
        </tfooter>
        `;

        var cardContent = `<div class="card">
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

        this.cardId = cardId;
        this.eventId = eventId;
        this.paymentId = event["paymentId"];
        this.client = clientName;
        this.total = cardPrice;
        this.description = "Pago de Tarjeta #" + cardId;
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