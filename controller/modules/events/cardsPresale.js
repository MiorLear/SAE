class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        this.cards = {};
        this.eventId;
        this.paymentId;
        this.client;
        this.cashier;
        this.total;
        this.description;
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
                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;
                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "manage-events-title" &&
                            $(sideBarTab).attr("id") !== "event-management-analysis-title" &&
                            $(sideBarTab).attr("id") !== "cardsPresale" &&
                            $(sideBarTab).attr("id") !== "cardsDelivery" &&
                            $(sideBarTab).attr("id") !== "start" &&
                            $(sideBarTab).attr("id") !== "checkEvent" &&
                            $(sideBarTab).attr("id") !== "checkEventCard" &&
                            $(sideBarTab).attr("id") !== "checkEventStudent")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Preventa de Tarjetas' ||
                            permission.name === 'Entrega de Tarjetas' ||
                            permission.name === 'Iniciar Evento' ||
                            permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                            permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                            permission.name === 'Gestión y Análisis de Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        if ($(sideBarTab).attr("id") === "manage-events-title")
                            if (permissions.some(permission =>
                                permission.name === 'Preventa de Tarjetas' ||
                                permission.name === 'Entrega de Tarjetas' ||
                                permission.name === 'Iniciar Evento' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "event-management-analysis-title")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "cardsPresale")
                            if (permissions.some(permission =>
                                permission.name === 'Preventa de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "cardsDelivery")
                            if (permissions.some(permission =>
                                permission.name === 'Entrega de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "start")
                            if (permissions.some(permission =>
                                permission.name === 'Iniciar Evento' ||
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
                    return console.error(
                        {
                            'error': "Módulo no disponible.",
                            'errorType': 'User Error',
                            'suggestion': 'Estás Intentando acceder a un módulo no disponible por el momento.',
                            "back": true
                        });
                }
            },
        }

        sideBarStatus[event["status"]].load();

        this.loadCardSettings();
    }
    async settupEventListeners(eventId = this.id) {
        const self = this;
        $(document).on("click", "#payCardContent", async (e) => {
            e.preventDefault();
            console.log(`eventId:${self.eventId}  cashier:${self.cashier} client:${self.client} description:${self.description} paymentId:${self.paymentId} total:${self.totaly} `);
            if (!self.eventId || !self.cashier || !self.client || !self.description || !self.paymentId || !self.total)
                return console.error(
                    {
                        'error': "Información de pago no válida.",
                        'errorType': 'User Error',
                        'suggestion': 'Inténtalo Nuevamente en otro momento.'
                    });

            await this.payCard();
        });
        $(document).on("change", "input.cardsNumber", async (e) => {
            e.preventDefault();

            let number = parseFloat($("#" + e.currentTarget.id).val());
            var cardInputs = "";

            if (number < 1 || Number.isNaN(number))
                return $(".cardsContainer").html(cardInputs);

            for (let index = 0; index < number; index++) {
                cardInputs +=
                    `<div class="form-group row"> 
                 <label for="cardNumber${index}" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col-form-label text-center"
                    >Tarjeta Extra #${index + 1}</label>
                        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 form-cardNumber${index}">
                            <input type="text" value="" id="cardNumber${index}" name="cardNumber${index}" min-length="4" maxlength="100" placeholder="Ingrese el código de la tarjeta Extra #${index + 1}" class="form-control touchSpin cardNumberType cardNumber${index}">
                            <div
                            class="form-control-cardNumber${index}-feedback"
                            style="display: none"
                            >
                            Success! You've done it.
                            </div>
                        </div>
                </div>
                `;
            }

            $(".cardsContainer").html(cardInputs);

        });
        $(document).on("submit", "form.addCards", async (e) => {
            e.preventDefault();
            this.formValidator(e.currentTarget);
        });
        $(document).on("change", "#isAnActiveFamilie", (e) => {
            if (e.currentTarget.checked) {
                $(".group-clientName").css("display", "none");
                $(".group-studentCarnet").css("display", "flex");
            }
            if (!e.currentTarget.checked) {
                $(".group-clientName").css("display", "flex");
                $(".group-studentCarnet").css("display", "none");
            }

        });
        $(document).on("change", "#addComplements", (e) => {
            if (e.currentTarget.checked) {
                $(".group-complements").css("display", "flex");
            }
            if (!e.currentTarget.checked) {
                $(".group-complements").css("display", "none");
            }

        });
        $(document).on("click", "#printContent", async (e) => {
            e.preventDefault();
            self.printPDF();
        });
        $(document).on("click", "#saveContent", async (e) => {
            e.preventDefault();
            self.savePDF();
        });
    }
    async validCardNumber(cardId, id = this.id) {
        let formData = new FormData();
        formData.append("action", "checkCardExist");
        formData.append("cardId", $("#" + cardId).val());
        formData.append("id", id);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const response = eventInfo["content"];
        return response == 0 ? true : false;
    }
    async validStudent(studentCarnet, id = this.id) {
        let formData = new FormData();
        formData.append("action", "checkStudentExist");
        formData.append("studentCarnet", studentCarnet);
        formData.append("id", id);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }
        const response = eventInfo["content"];
        return response;

    }
    async formValidator(form, id = this.id) {
        let notFilledInputs = [];
        let repeatedInputs = [];
        let minorThanZeroInputs = [];
        let notMinLengthInputs = [];
        let cardNumberType = [];
        let studentCarnetType = [];
        let invalidInputs = [];
        let validInputs = {};
        let validcardNumberType = {};

        $(form).find("input, select, button").each(function () {
            let formElement = this;
            let elementId = $(formElement).attr("id");
            if (elementId) {
                $(`.form-${elementId}`).removeClass('has-warning has-success has-danger');
                $(`.form-control-${elementId}-feedback`).css("display", "none").text('');
            }
        });

        $(form).find("input, select, button").each(function () {
            let
                formElement = this;
            let elementId = $(formElement).attr("id");
            let elementValue = $(formElement).val();
            let minLength = $(formElement).attr("min-length");

            if (!elementId) return;

            if (elementId === "isAnActiveFamilie") return;
            if (elementId === "addComplements") return;

            if (
                elementValue === "" &&
                elementId !== "clientName" && elementId !== "studentCarnet" && elementId !== "complements"
            ) {
                notFilledInputs.push(formElement);
            }
            else if (elementValue === "" && elementId == "studentCarnet" && form["isAnActiveFamilie"].checked) {
                notFilledInputs.push(formElement);
            }
            else if (elementValue === "" && elementId == "clientName" && !form["isAnActiveFamilie"].checked) {
                notFilledInputs.push(formElement);
            }
            else if (
                elementId === "complements" && elementValue == '' && form["addComplements"].checked
            ) {
                notFilledInputs.push(formElement);
            }
            else if (
                minLength && elementValue.length < minLength && elementId !== "clientName" && elementId !== "studentCarnet"
                ||
                minLength && elementValue.length < minLength && form["isAnActiveFamilie"].checked && elementId === "studentCarnet"
                ||
                minLength && elementValue.length < minLength && !form["isAnActiveFamilie"].checked && elementId === "clientName"
            ) {
                notMinLengthInputs.push(formElement);
            } else if ($(formElement).hasClass("cardNumberType")) {
                cardNumberType.push(formElement);
            } else if ($(formElement).hasClass("studentCarnet") && form["isAnActiveFamilie"].checked) {
                studentCarnetType.push(formElement);
            }
            else {
                validInputs[elementId] = elementValue;
            }
        });

        notFilledInputs.forEach(input => {
            let inputId = $(input).attr('id');
            $(`.form-control-${inputId}-feedback`).css("display", "block").text(`Por favor, ${$(input).attr('placeholder')}.`);
            $(`.form-${inputId}`).addClass('has-warning');
            $(input).focus();
        });

        for (let i = 0; i < cardNumberType.length; i++) {
            let input = cardNumberType[i];
            let cardId = $(input).attr("id");
            let cardValue = $(input).val();
        
            // Comprobamos si el cardValue ya existe como clave en el objeto
            if (validcardNumberType[cardValue]) {
                repeatedInputs.push(input);
                continue;  // Si ya existe, pasamos al siguiente input sin procesarlo
            }
        
            // Validación del número de tarjeta
            const validCard = await this.validCardNumber(cardId);
            let status = validCard ? "has-success" : "has-danger";
            let message = validCard
                ? "Código de Tarjeta válido."
                : "Código de Tarjeta inválido, ya existe una tarjeta con este código.";
        
            $(".form-" + cardId).addClass(status);
            $(".form-control-" + cardId + "-feedback").css("display", "block");
            $(".form-control-" + cardId + "-feedback").text(message);
        
            if (!validCard) {
                invalidInputs.push(cardValue);
                continue;  // Si no es válida, pasamos al siguiente input sin agregarla
            }
        
            // Obtenemos la fecha actual formateada
            const dateSettings = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/El_Salvador'
            };
            const date = new Intl.DateTimeFormat('es-ES', dateSettings).format(new Date());
            const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
        
            // Agregamos el nuevo valor a validcardNumberType
            validcardNumberType[cardValue] = {
                "type": "extraCard",
                "payed": true,
                "card_id": cardValue,
                "exchanged": false,
                "payedDate": formattedDate,
                "family_id": "",
                "complements": "",
                "exchangedDate": "",
            }
        }
        

        for (let i = 0; i < studentCarnetType.length; i++) {
            let input = studentCarnetType[i];
            let studentId = $(input).attr("id");
            let studentCarnet = $(input).val();

            const validCard = await this.validStudent(studentCarnet);
            let status = validCard ? "has-success" : "has-danger";
            let message = validCard
                ? "Familia Seleccionada."
                : "Carnet Inexistente, este carnet no pertenece a ningún estudiante.";

            $(".form-" + studentId).addClass(status);
            $(".form-control-" + studentId + "-feedback").css("display", "block");
            $(".form-control-" + studentId + "-feedback").text(message);

            if (!validCard) {
                invalidInputs.push(studentCarnet);
                continue;
            }

            validInputs[studentId] = validCard;
        }

        repeatedInputs.forEach(input => {
            let inputId = $(input).attr('id');
            $(`.form-control-${inputId}-feedback`).css("display", "block").text(`Este código ya ha sido ingresado, por favor, ingrese un código distinto.`);
            $(`.form-${inputId}`).addClass('has-warning');
            $(input).focus();
        });

        notMinLengthInputs.forEach(input => {
            let inputId = $(input).attr('id');
            $(`.form-control-${inputId}-feedback`).css("display", "block").text(`Por favor, escriba por lo menos ${$(input).attr("min-length")} carácteres.`);
            $(`.form-${inputId}`).addClass('has-warning');
            $(input).focus();
        });

        // Llamar a addCards solo si no hay errores
        if (!notFilledInputs.length && !repeatedInputs.length && !notMinLengthInputs.length && !invalidInputs.length) {
            this.addCards(validInputs, validcardNumberType);
        }
        else
            console.log("notFilledInputs " + notFilledInputs.length + " repeatedInputs " + repeatedInputs.length + " notMinLengthInputs " + notMinLengthInputs.length + "  invalidInputs " + invalidInputs.length);
    }
    async addCards(inputs, cards) {

        let complements = {};

        for (let index = 0; index < inputs["complements"].length; index++) {
            const element = inputs["complements"][index];
            complements[element] = {
                "id": element,
                "exchanged": false,
                "exchangedDate": "",
            };
        }

        var family_id = inputs["studentCarnet"] ? inputs["studentCarnet"] : inputs["clientName"];
        for (let index = 0; index < Object.entries(cards).length; index++) {
            Object.entries(cards)[index][1].family_id = family_id;
            Object.entries(cards)[index][1].complements = complements;
        }

        this.cards = JSON.stringify(cards);
        this.checkCard();
        // this.payCard();

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
    async checkCard(cards = JSON.parse(this.cards), eventId = this.id) {

        let formData = new FormData();
        let cardPrice = 0;
        var cardContent = "";
        var student;
        var payRows = "";
        const complementCounts = {};

        formData.set("action", "getPaymentCode");
        formData.set("id", eventId);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const event = eventInfo["content"];

        let absIndex = 1;

        for (let index = 0; index < Object.entries(cards).length; index++) {
            const card = Object.entries(cards)[index][1];
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
                student = studentName["content"]["name"];
            } else {
                student = card["family_id"];
            }

            // console.log(student);

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

        for (let index = 0; index < Object.entries(complementCounts).length; index++) {
            const key = Object.entries(complementCounts)[index][0];
            const element = Object.entries(complementCounts)[index][1];
            const complement = await this.getComplement(key, eventId)
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
                                class="me-1 fw-bold">Cliente:</span> ${student}</li>
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

        this.eventId = eventId;
        this.paymentId = event["paymentId"];
        this.client = student;
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
    async payCard(cards = this.cards, eventId = this.id) {

        let formData = new FormData();
        formData.append("action", "addExtraCardstoEvent");
        formData.append("id", eventId);
        formData.append("json", cards);
        formData.append("paymentId", this.paymentId);
        formData.append("cashier", this.cashier);
        formData.append("total", this.total);
        formData.append("description", this.description);
        formData.append("client", this.client);

        var log = await this.controlLog('Tarjetas Extra Asignadas y Pagadas');
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: 'Tarjetas Extra Asignadas y Pagadas.',
            icon: "success",
            showConfirmButton: false,
            timer: 3000
        });

        // self.savePDF();
        // self.printPDF();

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Tarjetas Pagadas Correctamente.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            });
    }
    async controlLog(actionDone, eventId = this.id) {

        let formData = new FormData();
        formData.append("action", "getGeneralInfo");
        formData.append("id", eventId);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const event = response['content'];

        var finalDate = new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        let log = {};

        log["author"] = this.user["name"];
        log["date"] = finalDate;
        log["ID"] = eventId;
        log["title"] = {
            "action": actionDone,
            "table": "Evento"
        }
        log["table"] = "events";
        log["Evento"] = event["name"];

        formData.set("action", "insertLog");
        formData.append("content", JSON.stringify(log));

        let logResponse = await this.ajaxRequest(
            `../model/classes/controlLog.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (logResponse["result"] !== "success") {
            console.error(logResponse);
        }

        return logResponse;
    }
    async loadCardSettings(id = this.id) {

        let formData = new FormData();
        formData.append("action", "getIdNameNPrice");
        formData.append("id", id);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        formData.set("action", "getEventComplements");

        let complementsInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (complementsInfo['result'] !== 'success') {
            console.error(complementsInfo);
            return;
        }

        const complements = JSON.parse(complementsInfo["content"]["complements"]);

        const card = eventInfo["content"];

        const cardsToSell = this.cards;

        var cardsConfig = "";

        var cardTabs = `
        <li class="nav-item">
            <a 
                class="flex-sm-fill nav-link text-center py-1 active status toggleAction"
                id="addCards" 
                aria-current="page" 
                style="cursor: pointer" 
                data-toggle="tooltip" 
                data-placement="top"
                title="Añadir Tarjetas Adicionales">
                Añadir Tarjetas
            </a>
        </li>`;

        var cardComplements;
        let cardPrice = 0;

        var cardsToAdd = cardsToSell["quantity"] == undefined ? 0 : cardsToSell["quantity"];
        var cardsCreated = cardsToSell["cards"] == undefined ? 0 : Object.entries(cardsToSell["cards"]).length;


        //Formulario de Tarjetas
        if (cardsToAdd <= 0) //Modelo no existe
        {
            cardsConfig +=
                `<form class ="addCards">
                    <div class="form-group row">
                    <label for="cardsNumber" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col-form-label text-center"
                    >Número de Tarjetas</label>
                        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 form-cardsNumber">
                            <input type="text" value="" id="cardsNumber" name="cardsNumber" min-length="1" maxlength="2" placeholder="Ingrese el número de tarjetas" class="form-control touchSpin cardsNumber">
                            <div
                            class="form-control-cardsNumber-feedback"
                            style="display: none"
                            >
                            Success! You've done it.
                            </div>
                        </div>
                    </div>
                    <div class="cardsContainer">
                    </div>
                    <div class="form-group row group-studentCarnet">
                    <label for="studentCarnet" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col-form-label text-center"
                    >Carnet del Estudiante</label>
                        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 form-studentCarnet">
                            <input type="number" value="" id="studentCarnet" name="studentCarnet" min-length="5" maxlength="8" placeholder="Ingrese el carnet del estudiante" class="form-control studentCarnet">
                            <div
                            class="form-control-studentCarnet-feedback"
                            style="display: none"
                            >
                            Success! You've done it.
                            </div>
                        </div>
                        </div>
                    <div class="form-group row group-clientName">
                    <label for="clientName" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col-form-label text-center"
                    >Nombre del Cliente</label>
                        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 form-clientName">
                            <input value="" id="clientName" name="clientName" min-length="5" maxlength="100" placeholder="Ingrese el nombre del Cliente" class="form-control clientName">
                            <div
                            class="form-control-clientName-feedback"
                            style="display: none"
                            >
                            Success! You've done it.
                            </div>
                        </div>
                        </div>
                    <div class="form-group row">
                        <div class="col-12 d-flex justify-content-center">
                            <div class="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            class="custom-control-input"
                            id="isAnActiveFamilie"
                            name="isAnActiveFamilie"
                        />
                        <label
                            class="custom-control-label"
                            for="isAnActiveFamilie">¿Es parte de una familia activa del CSSC?</label
                        >
                    </div>
                        </div>
                        </div>
                    <div class="form-group row group-complements">
                    <label for="complements" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col-form-label text-center"
                    >Complementos</label>
                        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 form-complements">
                            <select class="form-select form-control" name="complements" id="complements" aria-label=" the complements" data-live-search="true" title="Seleccione los complementos" placeholder="Seleccione los complementos " multiple>
                            </select>
                            <div
                            class="form-control-complements-feedback"
                            style="display: none"
                            >
                            Success! You've done it.
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-12 d-flex justify-content-center">
                            <div class="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            class="custom-control-input"
                            id="addComplements"
                            name="addComplements"
                        />
                        <label
                            class="custom-control-label"
                            for="addComplements">¿Desea Agregar Complementos a la/s tarjetas?</label
                        >
                    </div>
                        </div>
                        </div>
                    <div class="form-group row">
                        <div class="col-12 d-flex justify-content-center">
                            <button type="submit" class="btn btn-block btn-primary text-white mt-3 registerCard"  name="registerCard">
                            Registrar Tarjetas
                            </button>
                        </div>
                    </div>
                </form>`;
            cardComplements = "No ha seleccionado complementos.";
        }

        for (let index = 0; index < cardsToAdd; index++) {
            cardTabs +=
                `<li class="nav-item">
                <a class="nav-link toggleAction" id="card-${index}"
                aria-current="page" style="cursor: pointer"
                data-toggle="tooltip" data-placement="top">   
                Tarjeta #${index}
                </a>
            </li>`;
        }

        var complementsOption = "";

        for (let index = 0; index < Object.entries(complements).length; index++) {
            const element = Object.entries(complements)[index][1];
            complementsOption += `<option data-tokens="${element["title"]} (${element["price"]})" value="${element["id"]}">${element["title"]} ($${element["price"]})</option>`;
        }

        $('.form-select').selectpicker({
            locale: 'es'
        });

        $(".cardTabs").html(cardTabs);
        $(".cardsConfig").html(cardsConfig);

        $("#isAnActiveFamilie").prop("checked", true);
        $("#addComplements").prop("checked", true);
        $(".group-clientName").css("display", "none");

        $("select#complements").html(complementsOption);
        $("select#complements").selectpicker("refresh");

        $("#addCards").addClass("active");

        $('.touchSpin').TouchSpin({
            min: 0,
            max: 10,
            step: 1,
            boostat: 5,
            maxboostedstep: 10
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
        $(document).off("click", "#payCardContent");
        $(document).off("change", "input.cardsNumber");
        $(document).off("submit", "form.addCards");
        $(document).off("change", "#isAnActiveFamilie");
        $(document).off("change", "#addComplements");
        $(document).off("click", "#printContent");
        $(document).on("click", "#saveContent");
    }
}

export default content;