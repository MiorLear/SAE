class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
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
                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;

                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "initialize" &&
                            $(sideBarTab).attr("id") !== "manage-events-title")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Inicializar Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        $(sideBarTab).css("display", "block");
                    });
                }
            },
            "Inicializado": {
                load() {
                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;

                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "initialize" &&
                            $(sideBarTab).attr("id") !== "manage-events-title")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Inicializar Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        $(sideBarTab).css("display", "block");
                    });
                }
            },
            "Listo": {
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

        this.checkStatus();
    }
    async settupEventListeners(eventId = this.id) {
        $(document).on('click', 'a.toggleAction', async (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;

            let formData = new FormData();
            formData.append("action", "checkInitStatus");
            formData.append("id", eventId);

            let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            if (response['content'] == "4") {
                this.doneCard();
            }
            else
                switch (id) {
                    case 'asignCards':
                        if (parseFloat(response['content']) < 3)
                            return Swal.fire(
                                {
                                    title: "Espera un momento",
                                    text: 'Configuración Adicional Pendiente.',
                                    icon: "warning",
                                    showConfirmButton: true,
                                }
                            );
                        $("#extraConfig").removeClass("active");
                        $("#createModel").removeClass("active");
                        $("#asignCards").addClass("active");
                        this.loadCards();
                        break;
                    case 'extraConfig':
                        if (parseFloat(response['content']) < 2)
                            return Swal.fire(
                                {
                                    title: "Espera un momento",
                                    text: 'Complemento del modelo pendiente.',
                                    icon: "warning",
                                    showConfirmButton: true,
                                }
                            );
                        $("#createModel").removeClass("active");
                        $("#asignCards").removeClass("active");
                        $("#extraConfig").addClass("active");
                        this.extraConfig();
                        break;
                    case 'createModel':
                        $("#asignCards").removeClass("active");
                        $("#extraConfig").removeClass("active");
                        $("#createModel").addClass("active");
                        this.loadComplements();
                        break;
                }
        });
        $(document).on('click', 'a.addComplementToModel', async (e) => {
            e.preventDefault();
            var complementId = e.currentTarget.id;

            let formData = new FormData();
            formData.append("action", "addComplementToModel");
            formData.append("complementId", complementId);
            formData.append("id", this.id);

            let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            Swal.fire(
                {
                    title: "Éxito!",
                    text: 'Complemento Añadido al modelo.',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                }
            );

            this.checkStatus(false);
            this.loadComplements();
        });
        $(document).on('click', 'a.removeComplementToModel', async (e) => {
            e.preventDefault();
            var complementId = e.currentTarget.id;

            let formData = new FormData();
            formData.append("action", "removeComplementToModel");
            formData.append("complementId", complementId);
            formData.append("id", this.id);

            let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            Swal.fire(
                {
                    title: "Éxito!",
                    text: 'Complemento Removido del modelo.',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                }
            );

            this.checkStatus(false);
            this.loadComplements();
        });
        $(document).on('click', 'a.createModelWithoutComplements', async (e) => {
            e.preventDefault();
            var complementId = e.currentTarget.id;

            let formData = new FormData();
            formData.append("action", "createModelWithoutComplements");
            formData.append("id", this.id);

            let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            Swal.fire(
                {
                    title: "Éxito!",
                    text: 'Modelo Creado Sin Complementos.',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                }
            );

            this.checkStatus(false);
            this.loadComplements();

        });
        $(document).on('paste', '.cardInput', async function (e) {
            var currentInput = $(this);
            var nextId = currentInput.attr("next-id");

            setTimeout(function () {
                $("#" + nextId).focus();
            }, 0);
        });
        $(document).on('submit', 'form.extraConfig', async (e) => {
            e.preventDefault();

            let notFilledInputs = [];
            let notMinLengthInputs = [];
            let validInputs = {};

            $(e.currentTarget).find('input').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");

                if (!$(formElement).attr("id")) return;

                if ($(formElement).val() == "")
                    notFilledInputs.push(formElement);
                else if (
                    $(formElement).attr("min-length") &&
                    $(formElement).val().length < $(formElement).attr("min-length")
                )
                    notMinLengthInputs.push(formElement);
                else
                    validInputs[$(formElement).attr('id')] = $(formElement).val();

            });

            notFilledInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input)
                    .attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`Por favor, 
                        ${input["placeholder"] === undefined
                            ? $(input).attr("title")
                            : input["placeholder"]
                        }.`);
            });

            notMinLengthInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .text(`Por favor, escriba por lo menos ${$(input).attr("min-length")} carácteres.`);
                $(input).focus();
            });


            if (!notFilledInputs.length && !notMinLengthInputs.length)
                this.addExtraConfig(validInputs);
        });
        $(document).on('submit', 'form.initializeCards', async (e) => {

            e.preventDefault();
            let formData = new FormData();
            formData.append("id", this.id);
            formData.append("action", "getCardModel");

            let cardModel = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (cardModel['result'] !== 'success') {
                console.error(cardModel);
                return;
            }

            const model = JSON.parse(cardModel['content']['model']);

            let notFilledInputs = [];
            let repeatedInputs = [];
            let notMinLengthInputs = [];
            let cards = {};

            $(e.currentTarget).find('input').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");

                if (!$(formElement).attr("id")) return;

                if ($(formElement).val() == "")
                    notFilledInputs.push(formElement);
                else if (
                    $(formElement).attr("min-length") &&
                    $(formElement).val().length < $(formElement).attr("min-length")
                )
                    notMinLengthInputs.push(formElement);
                else if (cards[$(formElement).val()] !== undefined) {
                    repeatedInputs.push(formElement)
                }
                else {

                    var card = Object.assign({}, model);

                    card.student_id = $(formElement).attr("id").substring(0, $(formElement).attr("id").indexOf('-'));
                    card.card_id = $(formElement).val();
                    card.type = "assignedCard";

                    cards[card.card_id] = card;
                }
            });

            notFilledInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input)
                    .attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`Por favor, Ingrese el código de la tarjeta.`);
                $(input).focus();
            });

            repeatedInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input)
                    .attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`Este codigo ya ha sido ingresado, Por favor, ingrese uno distinto.`);
                $(input).focus();
            });

            notMinLengthInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .text(`Por favor, escriba por lo menos ${$(input).attr("min-length")} carácteres.`);
                $(input).focus();
            });


            if (!notFilledInputs.length && !notMinLengthInputs.length && !repeatedInputs.length) {
                this.addCardstoEvent(JSON.stringify(cards));
            }
        });
    }
    async addExtraConfig(validInputs, id = this.id) {
        let formData = new FormData();
        formData.append("id", this.id);
        formData.append("cardsQty", validInputs["cardsQty"]);
        formData.append("forgottenCard", validInputs["forgottenCard"]);
        formData.append("action", "addExtraSettings");

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Configuración Adicional Guardada.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            }
        );

        this.checkStatus(false);
    }
    async addCardstoEvent(json, id = this.id) {
        let formData = new FormData();
        formData.append("action", "addCardstoEvent");
        formData.append("id", this.id);
        formData.append("json", json);

        console.log(json);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }
        
        this.checkStatus();

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Tarjetas Asignadas al Evento.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            }
            
        ).then(() =>{
            window.location.href = './main.html?content=eventPanel&event=' + id;
        });

    }
    async doneCard() {
        $(".cardExample").css("display", "none");
        $(".cardFeedBack").css("display", "none");

        $(".initializeStatus").text("Evento Inicializado Correctamente");
        $(".initialize-progress").text("100%");
        $(".initialize-progress").css("width", "100%");
        $("#createModel").removeClass("active");
        $("#asignCards").removeClass("active");
        $(".initContent").html("Evento Inicializado Correctamente");
    }
    async checkStatus(changePanel = true, id = this.id) {
        let formData = new FormData();
        formData.append("action", "checkInitStatus");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        switch (response["content"]) {
            case "0":
                this.initializeAlert();
                break;
            case "1":
                $(".initializeStatus").text("Evento Inicializado, pendiente crear modelo de tarjeta, establecer configuraciones adicionales y asignar tarjetas a las familias.");
                $(".initialize-progress").text("25%");
                $(".initialize-progress").css("width", "25%");
                if (changePanel)
                    this.loadComplements();
                break;
            case "2":
                $(".initializeStatus").text("Modelo de Tarjeta creado, pendiente de establecer configuraciones adicionales y asignar tarjetas a las familias.");
                $(".initialize-progress").text("50%");
                $(".initialize-progress").css("width", "50%");
                if (changePanel)
                    this.extraConfig();
                break;
            case "3":
                $(".initializeStatus").text("Configuraciones adicionales listas, pendiente de asignar tarjetas a las familias.");
                $(".initialize-progress").text("75%");
                $(".initialize-progress").css("width", "75%");
                if (changePanel)
                    this.loadCards();
                break;
            case "4":
                if (changePanel)
                    this.doneCard();
                break;
        }
    }
    async initializeAlert(id = this.id) {
        let formData = new FormData();
        formData.append("action", "getName");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const event = response['content'];

        swal.fire(
            {
                title: `Inicializar ${event}`,
                html: `¿Estás seguro que deseas inicializar <span class="badge badge-primary" style="font-size: 1rem;">${event}</span>? <br> Al inicializar un evento, no podrás volver a modificarlo.`,
                icon: 'info',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-primary btn-lg',
                    cancelButton: 'btn btn-outline-primary btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Inicializar Evento',
                cancelButtonText: 'Cancelar'
            }
        ).then(async (result) => {

            if (!result.isConfirmed)
                return window.history.back();

            this.initializeEvent();
        });
    }
    async initializeEvent(id = this.id) {
        let formData = new FormData();
        formData.append("action", "initializeEvent");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        this.checkStatus();
    }
    async extraConfig(id = this.id) {
        let formData = new FormData();
        formData.append("id", this.id);
        formData.append("action", "getExtraSettings");

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const extraConfig = response["content"];

        $(".cardExample").css("display", "none");
        $(".cardFeedBack").css("display", "block");
        $(".cardFeedBackTitle").text("Configuración Adicional");
        $(".cardFeedBackTip").text("Indica el número de tarjetas a repartir para las familias de cada estudiante del CSSC. También indica el precio por extravío de tarjetas.");


        $("#createModel").removeClass("active");
        $("#asignCards").removeClass("active");
        $("#extraConfig").addClass("active");

        var content =
            `<form class="mx-2 px-2 extraConfig">
                <div class="form-group row d-flex justify-content-center">
                    <label for="cardsQty" class="text-left col-sm-2 col-form-label">Número de tarjetas por familia</label>
                    <div class="col-sm-10 form-cardsQty">
                        <input class="form-control maxlength touchSpinQuantity" id="cardsQty"
                        name="cardsQty" min-length="1" value="${extraConfig["cardsqtyperstudent"]}" maxlength="3"
                        placeholder="Ingrese el número de Tarjetas por familia"
                        />
                        <div class="form-control-cardsQty-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center">
                        <label for="forgottenCard" class="text-left col-sm-2 col-form-label">Precio por extravío de tarjeta</label>
                    <div class="col-sm-10 form-forgottenCard">
                        <input class="form-control maxlength touchSpin" id="forgottenCard"
                        name="forgottenCard" min-length="1" value="${extraConfig["forgottencardprice"]}" maxlength="3" placeholder="Ingrese el precio por extravió de tarjetas"
                        />
                        <div class="form-control-forgottenCard-feedback" style="display: none">
                        Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center mb-0 pb-0">   
                    <button type="submit" class="btn btn-primary" title="Guardar Configuración Adicional" data-toggle="tooltip" data-placement="top">Guardar Cambios</button>
                </div>
            </form>
        `;

        await $(".initContent").html(content);

        $(".touchSpin").TouchSpin({
            prefix: '$',
            min: 0,
            max: 100,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10
        });
        $(".touchSpinQuantity").TouchSpin({
            prefix: '',
            min: 0,
            max: 10,
            step: 1,
        });
    }
    async loadCards(id = this.id) {

        let formData = new FormData();
        formData.append("id", this.id);
        formData.append("action", "getExtraSettings");

        let extraSettings = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (extraSettings['result'] !== 'success') {
            console.error(extraSettings);
            return;
        }

        const cardsqty = extraSettings["content"]["cardsqtyperstudent"];

        $(".cardExample").css("display", "none");
        $(".cardFeedBack").css("display", "block");
        $(".cardFeedBackTitle").text("Asignar Tarjetas");
        $(".cardFeedBackTip").text("Se asignan las tarjetas a las familias, en el caso de los hermanos se entrega la tarjeta al hermano menor.");


        $("#extraConfig").removeClass("active");
        $("#createModel").removeClass("active");
        $("#asignCards").addClass("active");

        formData.set("action", "getStudentsPopulation");

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const population = response["content"];

        var initContent =
            `<form class="row justify-content-center initializeCards">`;

        for (let levelindex = 0; levelindex < Object.entries(population).length; levelindex++) {
            const levelEl = JSON.parse(Object.entries(population)[levelindex][1]["resultado"])["levels"][0];
            initContent += `<div class ="col-12 mb-2"><h4 style="text-transform: uppercase;" class="mt-0 pb-0 text-center">${levelEl["name"]}</h4>`;
            for (let gradeindex = 0; gradeindex < Object.entries(levelEl["grades"]).length; gradeindex++) {
                const gradesEl = Object.entries(levelEl["grades"])[gradeindex][1];
                for (let sectionindex = 0; sectionindex < Object.entries(gradesEl["sections"]).length; sectionindex++) {
                    const sectionsEl = Object.entries(gradesEl["sections"])[sectionindex][1];
                    initContent += `<h4 style="text-transform: uppercase;" class="mt-0 pb-0 text-center header-title">${gradesEl["name"] + " " + sectionsEl["name"]}</h4>`;
                    for (let studentindex = 0; studentindex < Object.entries(sectionsEl["students"]).length; studentindex++) {
                        const studentsEl = Object.entries(sectionsEl["students"])[studentindex][1];
                        initContent += `<p style="text-transform: uppercase;" class="text-center">Familia ${studentsEl["lastname"]}</p>`;
                        for (let index = 1; index < parseFloat(cardsqty) + 1; index++) {
                            initContent += `
                            <div class="form-group row align-content-center mx-auto">
                                <label for="${studentsEl["id"]}-${index}" class="col-sm-6 col-form-label text-right"
                                >Tarjeta #${index} de la Familia ${studentsEl["lastname"]}</label
                                >
                                <div class="col-sm-5 form-${studentsEl["id"]}-${index}">
                                <input
                                    class="form-control maxlength cardInput"
                                    type="text"
                                    id="${studentsEl["id"]}-${index}"
                                    name="${studentsEl["id"]}-${index}"
                                    min-length="4"
                                    maxlength="100"
                                    placeholder="Ingrese el codigo de la Tarjeta"
                                    next-id="${index < cardsqty
                                    ?
                                    studentsEl["id"] + "-" + (parseFloat(index) + 1)
                                    :
                                    Object.entries(sectionsEl["students"])[studentindex + 1] != undefined
                                        ?
                                        Object.entries(sectionsEl["students"])[studentindex + 1][1]["id"] + "-1"
                                        :
                                        Object.entries(gradesEl["sections"])[sectionindex + 1] != undefined
                                            ?
                                            Object.entries(Object.entries(gradesEl["sections"])[sectionindex + 1][1]["students"])[0][1]["id"] + "-1"
                                            :
                                            Object.entries(levelEl["grades"])[gradeindex + 1] != undefined
                                                ?
                                                Object.entries(
                                                    Object.entries(
                                                        Object.entries(levelEl["grades"])
                                                        [gradeindex + 1][1]["sections"]
                                                    )
                                                    [0][1]
                                                    ["students"]
                                                )[0][1]["id"] + "-1"
                                                :
                                                Object.entries(population)[levelindex + 1] != undefined
                                                    ?
                                                    Object.entries(
                                                        Object.entries(
                                                            Object.entries(
                                                                JSON.parse(Object.entries(population)[levelindex + 1][1]["resultado"])["levels"][0]["grades"]
                                                            )
                                                            [0][1]["sections"]
                                                        )
                                                        [0][1]
                                                        ["students"]
                                                    )[0][1]["id"] + "-1"
                                                    :
                                                    ''

                                }"
                                />
                                <div
                                    class="form-control-${studentsEl["id"]}-${index}-feedback"
                                    style="display: none"
                                >
                                    Success! You've done it.
                                </div>
                                </div>
                            </div>
                            `;
                        }
                    }
                }
            }
            initContent += '</div>';
        }

        initContent += ` <button type="submit" class="btn btn-primary" title="Asignar Tarjetas" data-toggle="tooltip" data-placement="top">Asignar Tarjetas</button></form>`;

        $(".initContent").html(initContent);

        $('[data-toggle="tooltip"]').tooltip();
    }
    async getComplement(complementId, id = this.id) {
        let formData = new FormData();
        formData.append("action", "getComplement");
        formData.append("complementId", complementId);
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }
        return JSON.parse(response["content"]);
    }
    async loadComplements(id = this.id) {

        $("#asignCards").removeClass("active");
        $("#extraConfig").removeClass("active");
        $("#createModel").addClass("active");

        $(".cardFeedBack").css("display", "block");
        $(".cardFeedBackTitle").text("¿Qué es el modelo de Tarjeta?");
        $(".cardFeedBackTip").text("Es el modelo de tarjeta que será asignada a las familias del CSSC para el evento.");

        let formData = new FormData();
        formData.append("action", "getEventComplements");
        formData.append("id", id);

        let responseEventsComplements = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (responseEventsComplements['result'] !== 'success') {
            console.error(responseEventsComplements);
            return;
        }

        const eventComplements = responseEventsComplements['content'];

        var eventComplementsContent = "";
        if (eventComplements?.['complements'] &&
            JSON?.parse?.(eventComplements['complements']) &&
            Object?.keys?.(JSON?.parse?.(eventComplements['complements']))?.length || false)
            for (let index = 0; index < Object.keys(JSON.parse(eventComplements['complements'])).length; index++) {

                const id = Object.keys(JSON.parse(eventComplements['complements']))[index];
                const element = JSON.parse(eventComplements['complements'])[id];

                eventComplementsContent += `
                <a class="addComplementToModel" id="${element["id"]}">
                    <div class="row">
                        <div class="col-lg-5 col-md-5 col-sm-5 col-5">
                            <span
                                class="badge badge-primary mb-2 text-left d-flex justify-content-center"
                                style="font-size: 1rem;"
                                >$${element["price"]}
                            </span>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-4 col-4 text-center">
                            ${element["title"]}
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-3 mb-2 text-center">
                            <span
                                class="badge badge-success mb-2 text-left d-flex justify-content-center"
                                style="cursor: pointer; font-size: 1rem;"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Añadir Complemento"
                                ><i class="mdi mdi-plus"> </i>
                            </span>
                        </div>
                    </div>
                </a>
                `;
            }
        else
            eventComplementsContent = `<p class="text-center">No hay complementos disponibles en el evento.</p>`;

        formData.set("action", "getCardModel");

        let responseModelComplements = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (responseModelComplements['result'] !== 'success') {
            console.error(responseModelComplements);
            return;
        }

        const modelComplements = responseModelComplements['content'];

        var cardModelContent = "";
        var cardComplements = "";
        let cardPrice = 0;

        if (
            JSON.parse(modelComplements['model']) == undefined //Modelo No existe
        ) {
            cardModelContent = `<p class="text-center">El Modelo de Tarjeta no ha sido creado.</p> <a class="btn btn-primary d-flex justify-content-center text-white text-center createModelWithoutComplements" style="cursor: pointer" data-toggle="tooltip" data-placement="top" title="Crear Modelo de Tarjeta">Crear Modelo</a>`;
        }
        else if (
            JSON?.parse?.(modelComplements?.['model'])?.["complements"] == "{}"
        ) {
            $(".cardExample").css("display", "flex");
            cardModelContent = `<p class="text-center">Modelo de Tarjeta creado sin complementos, puede añadir complementos al modelo.</p> `;
            cardComplements = "No hay complementos.";
        }
        else if (
            Object?.keys?.(JSON?.parse?.(modelComplements?.['model'])?.["complements"])?.length == 0
        ) {
            $(".cardExample").css("display", "flex");
            cardModelContent = `<p class="text-center">Modelo de Tarjeta creado sin complementos, puede añadir complementos al modelo.</p> `;
            cardComplements = "No hay complementos.";

        }
        else {
            cardModelContent = `<p class="text-center">Modelo de Tarjeta creado, complementos:</p><br>`;
            $(".cardExample").css("display", "flex");

            for (let index = 0; index < Object.keys(JSON.parse(modelComplements['model'])["complements"]).length; index++) {

                const id = Object.keys(JSON.parse(modelComplements['model'])["complements"])[index];
                const element = await this.getComplement(id);
                cardPrice += parseFloat(element["price"]);
                cardComplements += `
                <div class="row">
                        <div class="col-6 text-center">
                            ${element["title"]}
                        </div>
                        <div class="col-6">
                            <span
                                class="badge badge-success mb-2 text-left d-flex justify-content-center"
                                style="font-size: 1rem;"
                                >$${element["price"]}
                            </span>
                        </div>
                    </div>
                `;
                cardModelContent += `
                <a class="removeComplementToModel" id="${element["id"]}">
                    <div class="row">
                        <div class="col-lg-2 col-md-2 col-sm-3 col-3 text-center">
                         <span
                                class="badge badge-danger mb-2 text-left d-flex justify-content-center"
                                style="font-size: 1rem; cursor: pointer"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Remover complemento del modelo."
                                ><i class="mdi mdi-minus"> </i>
                            </span>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-4 col-4 text-center">
                            ${element["title"]}
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-5">
                            <span
                                class="badge badge-primary mb-2 text-left d-flex justify-content-center"
                                style="font-size: 1rem;"
                                >$${element["price"]}
                            </span>
                        </div>
                    </div>
                </a>
                `;
            }
        }

        var content = `
        <div class="row">
            <div class="col-md-6 col-lg-6 col-sm-12 mb-2">
                <h4 class="mt-0 header-title pb-2 text-center">Complementos disponibles</h4>
                ${eventComplementsContent}
                </div>
            <div class="col-md-6 col-lg-6 col-sm-12 mb-2">
            <h4 class="mt-0 header-title pb-0 text-center">Complementos en la tarjeta </h4>
                ${cardModelContent}
            </div>
        </div>
        `;

        $(".initContent").html(content);

        formData.set("action", "getIdNameNPrice");

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const card = response["content"];

        cardPrice += parseFloat(card["price"]);

        $(".cardTitle").text(card["name"]);
        $(".cardPrice").text("$" + card["price"]);
        $(".cardTotal").text("$" + cardPrice.toFixed(2));
        if (!cardComplements)
            $(".complementsTitle").css("display", "none");


        $(".cardContent").html(cardComplements);

        $('[data-toggle="tooltip"]').tooltip();

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
        $(document).off('click', 'a.toggleAction');
        $(document).off('click', 'a.addComplementToModel');
        $(document).off('click', 'a.removeComplementToModel');
        $(document).off('click', 'a.createModelWithoutComplements');
        $(document).off('paste', '.cardInput');
        $(document).off('submit', 'form.extraConfig');
        $(document).off('submit', 'form.initializeCards');
    }
}

export default content;