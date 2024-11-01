class content {
    constructor(params) {
        this.user = params["user"];
        this.id = this.getID();
        this.checkEventExist();
        this.settupEventListeners();
        this.toggleAction();
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
                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;

                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "manage-events-title" &&
                            $(sideBarTab).attr("id") !== "event-management-analysis-title" &&
                            $(sideBarTab).attr("id") !== "redeem" &&
                            $(sideBarTab).attr("id") !== "redeemCards" &&
                            $(sideBarTab).attr("id") !== "redeemComplements" &&
                            $(sideBarTab).attr("id") !== "salesCase" &&
                            $(sideBarTab).attr("id") !== "closure" &&
                            $(sideBarTab).attr("id") !== "checkEvent" &&
                            $(sideBarTab).attr("id") !== "checkEventCard" &&
                            $(sideBarTab).attr("id") !== "checkEventStudent")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Canjeo de Tarjetas' ||
                            permission.name === 'Canjeo de Complementos' ||
                            permission.name === 'Caja de Ventas' ||
                            permission.name === 'Cerrar Evento' ||
                            permission.name === 'Administrar Módulos de Eventos' ||
                            permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                            permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                            permission.name === 'Gestión y Análisis de Evento'))
                            return $(sideBarTab).css("display", "none");

                        if ($(sideBarTab).attr("id") === "manage-events-title")
                            if (permissions.some(permission =>
                                permission.name === 'Canjeo de Tarjetas' ||
                                permission.name === 'Canjeo de Complementos' ||
                                permission.name === 'Caja de Ventas' ||
                                permission.name === 'Cerrar Evento' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "event-management-analysis-title")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "redeem")
                            if (permissions.some(permission =>
                                permission.name === 'Canjeo de Tarjetas' ||
                                permission.name === 'Canjeo de Complementos' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "redeemCards")
                            if (permissions.some(permission =>
                                permission.name === 'Canjeo de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "redeemComplements")
                            if (permissions.some(permission =>
                                permission.name === 'Canjeo de Complementos' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "salesCase")
                            if (permissions.some(permission =>
                                permission.name === 'Caja de Ventas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "closure")
                            if (permissions.some(permission =>
                                permission.name === 'Cerrar Evento' ||
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

    }
    async settupEventListeners(eventId = this.id) {
        $(document).on('click', 'a.toggleAction', async (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;
            this.toggleAction(id);
        });

        $(document).on('click', 'form.redeemEntryCard', async (e) => {
            e.preventDefault();
            var cardId = $("#cardCode").val();

            if (cardId == '')
                return Swal.fire(
                    {
                        title: "Espera un momento",
                        text: 'Ingrese un codigo de Tarjeta',
                        icon: "warning",
                        showConfirmButton: true,
                    }
                );

            let formData = new FormData();
            formData.append("action", "redeemCard");
            formData.append("id", this.id);
            formData.append("cardId", cardId);

            let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            console.log(response);

        });
        $(document).on('click', 'form.redeemComplementCard', async (e) => {
            e.preventDefault();
            $(".cardCode")
        });
        $(document).on('click', 'form.redeemComplement', async (e) => {
            e.preventDefault();
            $(".cardCode")
        });
    }
    async toggleAction(id) {
        switch (id) {
            case 'redeemCardEntry':
                $("#redeemCardComplement").removeClass("active");
                $("#redeemComplement").removeClass("active");
                $("#redeemCardEntry").addClass("active");
                this.redeemCardEntry();
                break;
            case 'redeemCardComplement':
                $("#redeemCardEntry").removeClass("active");
                $("#redeemComplement").removeClass("active");
                $("#redeemCardComplement").addClass("active");
                this.redeemCardComplement();
                break;
            case 'redeemComplement':
                $("#redeemCardEntry").removeClass("active");
                $("#redeemCardComplement").removeClass("active");
                $("#redeemComplement").addClass("active");
                this.redeemComplement();
                break;
            default:
                $("#redeemCardComplement").removeClass("active");
                $("#redeemComplement").removeClass("active");
                $("#redeemCardEntry").addClass("active");
                this.redeemCardEntry();
                break;
        }
    }

    async redeemCardEntry() {

        var content =
            `<form class="mx-2 px-2 redeemEntryCard">
                <div class="form-group row d-flex justify-content-center">
                    <label for="cardCode" class="text-left col-sm-2 col-form-label">Código de Tarjeta</label>
                    <div class="col-sm-10 form-cardCode">
                        <input class="form-control maxlength" id="cardCode"
                        name="cardCode" min-length="1" maxlength="100"
                        placeholder="Ingrese el codigo de tarjeta"
                        />
                        <div class="form-control-cardCode-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center mb-0 pb-0">   
                    <button type="submit" class="btn btn-primary" title="Canjear Entrada" data-toggle="tooltip" data-placement="top">Canjear Entrada</button>
                </div>
            </form>
        `;

        $(".redeemContent").html(content);
    }
    async redeemCardComplement() {

        let formData = new FormData();
        formData.append("action", "getComplements");
        formData.append("id", this.id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }


        const complements = JSON.parse(response['content']);
        var selectComplements;

        for (let index = 0; index < Object.entries(complements).length; index++) {
            const element = Object.entries(complements)[index][1];
            selectComplements +=
                `<option data-tokens="${element["title"]}" value="${element["id"]}">${element["title"]}</option>`;
        }

        var content =
            `<form class="mx-2 px-2 redeemComplementCard">
                <div class="form-group row d-flex justify-content-center">
                    <label for="cardCode" class="text-left col-sm-2 col-form-label">Código de Tarjeta</label>
                    <div class="col-sm-10 form-cardCode">
                        <input class="form-control maxlength" id="cardCode"
                        name="cardCode" min-length="1" maxlength="100"
                        placeholder="Ingrese el codigo de tarjeta"
                        />
                        <div class="form-control-cardCode-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center">
                    <label for="complement" class="text-left col-sm-2 col-form-label">Complemento a Canjear</label>
                    <div class="col-sm-10 form-complement">
                        <select
                        class="form-select form-control"
                        name="complement"
                        id="complement"
                        aria-label="Select the complement to redeem"
                        data-live-search="true"
                        placeholder="Seleccione el complemento a canjear"
                        title="Seleccione el complemento a canjear"
                        ></select>

                        <div class="form-control-complement-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center mb-0 pb-0">   
                    <button type="submit" class="btn btn-primary" title="Canjear Entrada" data-toggle="tooltip" data-placement="top">Canjear Entrada</button>
                </div>
            </form>
        `;

        await $(".redeemContent").html(content);

        $("select#complement").html(selectComplements);
        $("select#complement").selectpicker('refresh');
    }
    async redeemComplement() {

        let formData = new FormData();
        formData.append("action", "getComplements");
        formData.append("id", this.id);

        let response = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }


        const complements = JSON.parse(response['content']);
        var selectComplements;

        for (let index = 0; index < Object.entries(complements).length; index++) {
            const element = Object.entries(complements)[index][1];
            selectComplements +=
                `<option data-tokens="${element["title"]}" value="${element["id"]}">${element["title"]}</option>`;
        }

        var content =
            `<form class="mx-2 px-2 redeemComplement">
                <div class="form-group row d-flex justify-content-center">
                    <label for="ticketCode" class="text-left col-sm-2 col-form-label">Código de Ticket</label>
                    <div class="col-sm-10 form-ticketCode">
                        <input class="form-control maxlength" id="ticketCode"
                        name="ticketCode" min-length="1" maxlength="100"
                        placeholder="Ingrese el codigo de tarjeta"
                        />
                        <div class="form-control-ticketCode-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center">
                    <label for="complement" class="text-left col-sm-2 col-form-label">Complemento a Canjear</label>
                    <div class="col-sm-10 form-complement">
                        <select
                        class="form-select form-control"
                        name="complement"
                        id="complement"
                        aria-label="Select the complement to redeem"
                        data-live-search="true"
                        placeholder="Seleccione el complemento a canjear"
                        title="Seleccione el complemento a canjear"
                        ></select>

                        <div class="form-control-complement-feedback" style="display: none">
                            Success! You've done it.
                        </div>
                    </div>
                </div>
                <div class="form-group row d-flex justify-content-center mb-0 pb-0">   
                    <button type="submit" class="btn btn-primary" title="Canjear Entrada" data-toggle="tooltip" data-placement="top">Canjear Entrada</button>
                </div>
            </form>
        `;

        await $(".redeemContent").html(content);

        $("select#complement").html(selectComplements);
        $("select#complement").selectpicker('refresh');
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