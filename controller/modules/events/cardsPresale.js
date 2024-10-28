class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        this.cards = {};
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
            return window.history.back();

        const permissions = this.user["permissions"];

        switch (event["status"]) {
            case "Pendiente de Iniciar":
                return window.history.back();
                break;
            case "Inicializado":
                return window.history.back();
                break;
            case "Listo":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");

                if (Object.values(permissions).filter(permission => permission.name === 'Preventa de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#cardsPresale").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Listado de Entrega de Tarjetas' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#cardsDelivery").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Iniciar Evento' || permission.name === 'Administrar Modulos de Eventos').length >0)
                    $("li#start").css("display", "block");

                $("li#redeem").css("display", "none");
                $("li#salesCase").css("display", "none");
                $("li#cardsReturn").css("display", "none");
                $("li#closure").css("display", "none");
                $("li#analysis").css("display", "none");
                $("li#eventAnalysis").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length >0)
                    $("li#checkEventCard").css("display", "block");
                break;
            case "En Curso":
                return window.history.back();
                break;
            case "Finalizado":
                return window.history.back();
                break;
        }

        this.loadComplements();
    }
    async settupEventListeners(eventId = this.id) {
        $(document).on('click', 'a.toggleAction', async (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;

            //change Card

        });

        $(document).on("click", ".addCards", async (e) => {
            this.addCardsAlert();
        });
    }

    async addCardsAlert(id = this.id) {
        
        swal.fire(
            {
                title: 'Espera un momento',
                icon: 'info',
                showCancelButton: true,
                inputLabel: 'Ingresa el número de Tarjetas que desee',
                input: "number",
                inputAttributes: {
                    autocapitalize: "off"
                },
                customClass: {
                    confirmButton: 'btn btn-primary btn-lg',
                    cancelButton: 'btn btn-outline-primary btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Ingresar',
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
                return;

            var cardsQty = result.value["cardsqty"];
            var cardIDs = [];

            for (let index = 1; index < parseFloat(cardsQty) + 1; index++) {
                swal.fire(
                    {
                        title: 'Escanee el ID de la Tarjeta Adicional Número ' + index,
                        icon: 'info',
                        showCancelButton: true,
                        input: "number",
                        inputAttributes: {
                            autocapitalize: "off"
                        },
                        customClass: {
                            confirmButton: 'btn btn-primary btn-lg',
                            cancelButton: 'btn btn-outline-primary btn-lg ml-4'
                        },
                        buttonsStyling: false,
                        confirmButtonText: 'Ingresar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: async (cardsqty) => {
                            if (!cardsqty || cardsqty <= 0) {
                                Swal.showValidationMessage('Porfavor, ingrese un número válido.');
                                return false;
                            }
        
                            return { cardsqty: cardsqty };
                        }
                    }
                )
            }


            this.loadCards();
        });

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

        $("#asignCards").removeClass("active");
        $("#createModel").addClass("active");

        const soldCards = this.cards;

        var addedCardContent = "";
        var cardComplements = "";

        let cardPrice = 0;



        if (Object.keys(soldCards).length == 0) //Modelo no existe
        {
            addedCardContent = `<p class="text-center">No ha solicitado tarjetas.</p> <a style="display:flex;justify-content:center"class="btn btn-primary text-white text-center addCards">Añadir Tarjeta</a>`;
            cardComplements = "No ha seleccionado complementos.";
        }
        else if (
            JSON?.parse?.(soldCards?.['model'])?.["complements"] == "{}"
        ) {
            $(".cardExample").css("display", "flex");
            addedCardContent = `<p class="text-center">Modelo de Tarjeta creado sin complementos, puede añadir complementos al modelo.</p> `;
            cardComplements = "No hay complementos.";
        }
        else if (
            Object?.keys?.(JSON?.parse?.(soldCards?.['model'])?.["complements"])?.length == 0
        ) {
            $(".cardExample").css("display", "flex");
            addedCardContent = `<p class="text-center">Modelo de Tarjeta creado sin complementos, puede añadir complementos al modelo.</p> `;
            cardComplements = "No hay complementos.";

        }
        else {
            addedCardContent = `<p class="text-center">Modelo de Tarjeta creado, complementos:</p><br>`;
            $(".cardExample").css("display", "flex");

            for (let index = 0; index < Object.keys(JSON.parse(soldCards['model'])["complements"]).length; index++) {

                const id = Object.keys(JSON.parse(soldCards['model'])["complements"])[index];
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
                addedCardContent += `
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
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
            <div class="card">
                <div class="card-body">
                    <h4 class="mt-0 header-title pb-2 text-center">Complementos disponibles</h4> 
                    ${eventComplementsContent}
                </div>
            </div>
        </div>

        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs grades-tabs">
                        <li class="nav-item">
                            <a
                            class="nav-link toggleAction"
                            id="createModel"
                            aria-current="page"
                            style="cursor: pointer"
                            data-toggle="tooltip"
                            data-placement="top"
                            >Crear Modelo de Tarjeta</a
                            >
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <h4 class="mt-0 header-title pb-0 text-center">Tarjeta Adicional</h4>
                    ${addedCardContent}
                </div>
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
        $(document).off('click', 'a.addCards');
    }
}

export default content;