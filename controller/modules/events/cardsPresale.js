class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        this.cards = {};
        this.actualTab = "#addCards";
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
        return response == 0 ? false : true;

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

        // Restablecer clases y feedback al inicio
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

            if (elementValue === "" || elementId !== "complements" && elementValue == 0) {
                notFilledInputs.push(formElement);
            } else if (minLength && elementValue.length < minLength) {
                notMinLengthInputs.push(formElement);
            } else if (minLength && elementValue.length < minLength) {
                notMinLengthInputs.push(formElement);
            } else if ($(formElement).hasClass("cardNumberType")) {
                cardNumberType.push(formElement);
            } else if ($(formElement).hasClass("studentCarnet")) {
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

            // Comprobar si ya existe el valor en validInputs
            if (Object.values(validInputs).some(val => val === cardValue)) {
                repeatedInputs.push(input);
                continue;
            }

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
                continue;
            }

            validInputs[cardId] = cardValue;
        }

        for (let i = 0; i < studentCarnetType.length; i++) {
            let input = studentCarnetType[i];
            let studentId = $(input).attr("id");
            let studentCarnet = $(input).val();

            const validCard = await this.validStudent(studentCarnet);
            let status = validCard ? "has-success" : "has-danger";
            let message = validCard
                ? "Estudiante Seleccionado."
                : "Carnet Inexistente, este carnet no pertenece a ningún estudiante.";

            $(".form-" + studentId).addClass(status);
            $(".form-control-" + studentId + "-feedback").css("display", "block");
            $(".form-control-" + studentId + "-feedback").text(message);

            if (!validCard) {
                invalidInputs.push(studentCarnet);
                continue;
            }

            validInputs[studentId] = studentCarnet;
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
            this.addCards(validInputs);
        }
        else
            console.log("notFilledInputs " + notFilledInputs.length + " repeatedInputs " + repeatedInputs.length + " notMinLengthInputs " + notMinLengthInputs.length + "  invalidInputs " + invalidInputs.length);
    }
    async addCards(add) {
        console.log("A");
        $("#pdfModal").modal("show");
    }
    async loadCardSettings(id = this.id, actualTab = this.actualTab) {

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
            <a class="nav-link toggleAction" id="addCards" aria-current="page" style="cursor: pointer" data-toggle="tooltip" data-placement="top">
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
                    <div class="form-group row">
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
                    <div class="form-group row">
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

        $("select#complements").html(complementsOption);
        $("select#complements").selectpicker("refresh");

        $(this.actualTab).addClass("active");

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
        $(document).off("change", "input.cardsNumber");
        $(document).off("submit", "form.addCards");
    }
}

export default content;