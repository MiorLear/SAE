class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        // this.loadEventInfo();
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

            if (response['content'] == "3") {
                this.doneCard();
            }
            else
                switch (id) {
                    case 'asignCards':
                        this.showCardsAlert();
                        break;
                    case 'createModel':
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

                    var card  = Object.assign({}, model);

                    card.student_id = $(formElement).attr("id").substring(0, $(formElement).attr("id").indexOf('-'));
                    card.card_id = $(formElement).val();

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

    async addCardstoEvent(json, id = this.id){
        let formData = new FormData();
        formData.append("action", "addCardstoEvent");
        formData.append("id", this.id);
        formData.append("json", json);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: 'Tarjetas Asignadas al Evento.',
                icon: "success",
                showConfirmButton: false,
                timer: 3000
            }
        );

        this.checkStatus();
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
                $(".initializeStatus").text("Evento Inicializado, pendiente crear modelo de tarjeta y asignar tarjetas a los estudiantes");
                $(".initialize-progress").text("33%");
                $(".initialize-progress").css("width", "33%");
                $("#asignCards").removeClass("active");
                $("#createModel").addClass("active");
                if (changePanel)
                    this.loadComplements();
                break;
            case "2":
                $(".initializeStatus").text("Modelo de Tarjeta creado, pendiente de asignar tarjetas a los estudiantes");
                $(".initialize-progress").text("66%");
                $(".initialize-progress").css("width", "66%");
                if (changePanel)
                    this.showCardsAlert();
                break;
            case "3":
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
    async showCardsAlert(id = this.id) {

        $(".cardExample").css("display", "none");
        $(".cardFeedBack").css("display", "none");
        $("#createModel").removeClass("active");
        $("#asignCards").addClass("active");


        swal.fire(
            {
                title: 'Espera un momento',
                icon: 'info',
                showCancelButton: true,
                inputLabel: 'Ingresa el número de Tarjetas por estudiante',
                input: "number",
                inputAttributes: {
                    autocapitalize: "off"
                },
                customClass: {
                    confirmButton: 'btn btn-primary btn-lg',
                    cancelButton: 'btn btn-outline-primary btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Inicializar Evento',
                cancelButtonText: 'Cancelar',
                preConfirm: async (cardsqty) => {
                    if (!cardsqty || cardsqty <= 0) {
                        Swal.showValidationMessage('Porfavor, ingrese un número válido.');
                        return false;
                    }

                    return { cardsqty: cardsqty };
                }
            }
        ).then(async (result) => {

            if (!result.isConfirmed)
                return this.loadComplements;

            this.loadCards(result.value["cardsqty"],);
        });
    }
    async loadCards(cardsqty, id = this.id) {
        let formData = new FormData();
        formData.append("action", "getStudentsPopulation");
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        const population = response["content"];

        var initContent =
            `<form class="row justify-content-center initializeCards">`;

        for (let levelindex = 0; levelindex < Object.entries(population["levels"]).length; levelindex++) {
            const levelEl = Object.entries(population["levels"])[levelindex][1];
            initContent += `<div class ="col-12 mb-2"><h4 style="text-transform: uppercase;" class="mt-0 pb-0 text-center">${levelEl["name"]}</h4>`;
            for (let gradeindex = 0; gradeindex < Object.entries(levelEl["grades"]).length; gradeindex++) {
                const gradesEl = Object.entries(levelEl["grades"])[gradeindex][1];
                for (let sectionindex = 0; sectionindex < Object.entries(gradesEl["sections"]).length; sectionindex++) {
                    const sectionsEl = Object.entries(gradesEl["sections"])[sectionindex][1];
                    initContent += `<h4 style="text-transform: uppercase;" class="mt-0 pb-0 text-center header-title">${gradesEl["name"] + " " + sectionsEl["name"]}</h4>`;
                    for (let studentindex = 0; studentindex < Object.entries(sectionsEl["students"]).length; studentindex++) {
                        const studentsEl = Object.entries(sectionsEl["students"])[studentindex][1];
                        initContent += `<p style="text-transform: uppercase;" class="text-center">${studentsEl["name"]}</p>`;
                        for (let index = 1; index < parseFloat(cardsqty) + 1; index++) {
                            initContent += `
                            <div class="form-group row">
                                <label for="${studentsEl["id"]}-${index}" class="col-sm-6 col-form-label text-right"
                                >Tarjeta #${index} de ${studentsEl["name"]}</label
                                >
                                <div class="col-sm-6 form-${studentsEl["id"]}-${index}">
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
                                                Object.entries(population["levels"])[levelindex + 1] != undefined
                                                    ?
                                                    Object.entries(
                                                        Object.entries(
                                                            Object.entries(
                                                                Object.entries(population["levels"])
                                                                [levelindex + 1][1]["grades"]
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

        initContent += ` <button type="submit" class="btn btn-primary">Guardar Cambios</button></form>`;

        $(".initContent").html(initContent);
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

        $(".cardFeedBack").css("display", "block");

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
                    <div class="col-5">
                            <span
                                class="badge badge-primary mb-2 text-left"
                                style="
                                display: flex;
                                text-align: center;
                                justify-content: center;
                                font-size: 1rem;"
                                >$${element["price"]}
                            </span>
                        </div>
                        <div class="col-5 text-center">
                            ${element["title"]}
                        </div>
                        <div class="col-2 text-center">
                        <span
                                class="badge badge-success mb-2 text-left"
                                style="
                                display: flex;
                                text-align: center;
                                justify-content: center;
                                font-size: 1rem;"
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

        $("#asignCards").removeClass("active");
        $("#createModel").addClass("active");

        const modelComplements = responseModelComplements['content'];

        var cardModelContent = "";
        var cardComplements = "";
        let cardPrice = 0;

        if (
            JSON.parse(modelComplements['model']) == undefined //Modelo No existe
        ) {
            cardModelContent = `<p class="text-center">El Modelo de Tarjeta no ha sido creado.</p> <a style="display:flex;justify-content:center"class="btn btn-primary text-white text-center createModelWithoutComplements">Crear Modelo</a>`;
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
                                class="badge badge-success mb-2 text-left"
                                style="
                                display: flex;
                                text-align: center;
                                justify-content: center;
                                font-size: 1rem;"
                                >$${element["price"]}
                            </span>
                        </div>
                    </div>
                `;
                cardModelContent += `
                <a class="removeComplementToModel" id="${element["id"]}">
                    <div class="row">
                        <div class="col-2 text-center">
                         <span
                                class="badge badge-danger mb-2 text-left"
                                style="
                                display: flex;
                                text-align: center;
                                justify-content: center;
                                font-size: 1rem;"
                                ><i class="mdi mdi-minus"> </i>
                            </span>
                        </div>
                        <div class="col-5 text-center">
                            ${element["title"]}
                        </div>
                        <div class="col-5">
                            <span
                                class="badge badge-primary mb-2 text-left"
                                style="
                                display: flex;
                                text-align: center;
                                justify-content: center;
                                font-size: 1rem;"
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
            <div class="col-6">
                <h4 class="mt-0 header-title pb-2 text-center">Complementos disponibles</h4>
                ${eventComplementsContent}
                </div>
            <div class="col-6">
            <h4 class="mt-0 header-title pb-0 text-center">Complementos en la tarjeta del estudiante</h4>
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


        $(".cardContent").html(cardComplements);

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
        $(document).off('submit', 'form.initializeCards');
        $(document).off('paste', '.cardInput')
    }
}

export default content;