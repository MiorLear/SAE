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
            return window.history.back();

        const permissions = this.user["permissions"];

        switch (event["status"]) {
            case "Pendiente de Iniciar":
                return window.history.back();
            case "Inicializado":
                return window.history.back();
            case "Listo":
                return window.history.back();
            case "En Curso":
                $("li#eventPanel").css("display", "block");
                $("li#initialize").css("display", "none");
                $("li#cardsPresale").css("display", "none");
                $("li#cardsDelivery").css("display", "none");
                $("li#start").css("display", "none");

                if (Object.values(permissions).filter(permission => permission.name === 'Canjeo' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#redeem").css("display", "block");
                else
                    $("li#redeem").css("display", "none");
                if (Object.values(permissions).filter(permission => permission.name === 'Caja de Ventas' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#salesCase").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Cerrar Evento' || permission.name === 'Administrar Modulos de Eventos').length > 0)
                    $("li#closure").css("display", "block");

                if (Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento').length > 0)
                    $("li#checkEventCard").css("display", "block");

                $("li#cardsReturn").css("display", "block");
                $("li#analysis").css("display", "none");
                $("li#eventAnalysis").css("display", "none");
                break;
            case "Finalizado":
                return window.history.back();
        }

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