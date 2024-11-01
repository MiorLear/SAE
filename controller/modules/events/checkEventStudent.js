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

                    $("#sidebar-menu").find('li').each(function () {
                        var sideBarTab = this;

                        if (!$(sideBarTab).attr("id")) return;

                        if ($(sideBarTab).attr("id") === "mainPanel") return;
                        if ($(sideBarTab).attr("id") === "eventPanel") return;

                        if ($(sideBarTab).attr("id") !== "manage-events-title" &&
                            $(sideBarTab).attr("id") !== "event-management-analysis-title" &&
                            $(sideBarTab).attr("id") !== "cardsReturn" &&
                            $(sideBarTab).attr("id") !== "eventAnalysis" &&
                            $(sideBarTab).attr("id") !== "checkEvent" &&
                            $(sideBarTab).attr("id") !== "checkEventCard" &&
                            $(sideBarTab).attr("id") !== "checkEventStudent")
                            return $(sideBarTab).css("display", "none");

                        if (!permissions.some(permission =>
                            permission.name === 'Devolución de Tarjetas' ||
                            permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                            permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                            permission.name === 'Análisis del Evento' ||
                            permission.name === 'Gestión y Análisis de Evento' ||
                            permission.name === 'Administrar Módulos de Eventos'))
                            return $(sideBarTab).css("display", "none");

                        if ($(sideBarTab).attr("id") === "manage-events-title")
                            if (permissions.some(permission =>
                                permission.name === 'Devolución de Tarjetas' ||
                                permission.name === 'Administrar Módulos de Eventos'))
                                $(sideBarTab).css("display", "block");

                        if ($(sideBarTab).attr("id") === "event-management-analysis-title")
                            if (permissions.some(permission =>
                                permission.name === 'Revisión de Tarjetas por Código en Evento' ||
                                permission.name === 'Revisión de Tarjetas por Estudiante en Evento' ||
                                permission.name === 'Análisis del Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");


                        if ($(sideBarTab).attr("id") === "cardsReturn")
                            if (permissions.some(permission =>
                                permission.name === 'Devolución de Tarjetas' ||
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

                        if ($(sideBarTab).attr("id") === "eventAnalysis")
                            if (permissions.some(permission =>
                                permission.name === 'Análisis del Evento' ||
                                permission.name === 'Gestión y Análisis de Evento'))
                                $(sideBarTab).css("display", "block");
                    });

                }
            },
        }

        sideBarStatus[event["status"]].load();


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

            let input = $("#checkCardInput");
            let inputVal = $("#checkCardInput").val();

            if (inputVal == "") {
                $(`.form-control-checkCardInput-feedback`).css("display", "block").text(`Por favor, ${$(input).attr('placeholder')}.`);
                $(`.form-checkCardInput`).addClass('has-warning');
                $(inputVal).focus();
                return;
            } else {
                $(`.form-control-checkCardInput-feedback`).css("display", "none");
                $(`.form-checkCardInput`).removeClass('has-warning');
            }

            this.checkStudent(inputVal);
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

            pdf.save("Revisión de Tarjeta por Estudiante");

        });
    }
    async checkStudent(carnet, id = this.id) {
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


        formData.set("action", "getCardFromStudent");
        formData.append("id", id);
        formData.append("studentId", student["id"]);

        let eventInfo = await this.ajaxRequest(`../model/modules/eventManager.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (eventInfo['result'] !== 'success') {
            console.error(eventInfo);
            return;
        }

        const events = eventInfo["content"];

        if (!events || Object.entries(events).length == 0)
            return console.error(
                {
                    'error': "No se han encontrado tarjetas.",
                    'errorType': 'User Error',
                    'suggestion': 'No se han encontrado tarjetas relacionadas al estudiante ' + student["name"] + '.'
                });

        var cardContent = "";

        for (let eventIndex = 0; eventIndex < Object.entries(events).length; eventIndex++) {
            const event = Object.entries(events)[eventIndex][1];

            const card = JSON.parse(event["card"]);
            let cardPrice = parseFloat(event["price"]);

            var complements = ""
            for (let complementIndex = 0; complementIndex < Object.entries(card["complements"]).length; complementIndex++) {
                const element = Object.entries(card["complements"])[complementIndex][1];
                const complement = await this.getComplement(element["id"])
                complements += `${complement["title"]} (${element["exchanged"] ? 'Canjeado el ' + element["exchangedDate"] : 'Pendiente de Canjear'}) <br>`;
                cardPrice += parseFloat(complement["price"]);
            }

            cardContent += `
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
                    <h6 class="mb-0">Precio de la Tarjeta</h6>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                    $${cardPrice}
                </div>
            </div>
            <hr class="px-4 mx-4">
            <div class="row px-4 mx-4">
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <h6 class="mb-0">Estudiante</h6>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-12 text-secondary">
                    ${student["name"]}
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
            <div class="col-lg-9 col-md-9 col-sm-12 mt-2 py-2 text-secondary">
                    ${complements}
                </div>        
            </div>

            <hr class="px-2 mx-2 pt-5 mt-5">    
            `;

        }

        $(".checkContent").html(cardContent);

        $(".bd-checkModal-lg").modal("show");
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