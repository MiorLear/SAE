import dataTables from "../../plugins/dataTables.js";

class content extends dataTables {
    constructor(params) {
        super("#datatable-buttons");
        this.mainDataTable = "#datatable-buttons";
        this.status = "enable";
        this.table = params["table"];
        this.user = params["user"];
        this.traductor = {
            id: () => {
                return "ID";
            },
            table: () => {
                return "Tabla";
            },
            action: () => {
                return "action";
            },
            edit: () => {
                return "ID";
            },
            name: () => {
                return "Nombre";
            },
            surname: () => {
                return "Apellido";
            },
            reason: () => {
                return "Razón";
            },
            carnet: () => {
                return "Carnet";
            },
            mail: () => {
                return "Correo";
            },
            eventDate: () => {
                return "Fecha del Evento";
            },
            price: () => {
                return "Precio";
            },
            levels: () => {
                return "Niveles";
            },
            complements: () => {
                return "Complementos";
            },
            roles: () => {
                return "Rol";
            },
            fileupload: () => {
                return "Imagen";
            },
            rol_id: () => {
                return "Rol";
            },
            picture: () => {
                return "Imágenes";
            },
            grades: () => {
                return "Grados";
            },
            grade: () => {
                return "Grado";
            },
            section: () => {
                return "Sección";
            },
            students_quantity: () => {
                return "Cantidad de Estudiantes";
            },
            permissions_id: () => {
                return "Permisos";
            },
            status: () => {
                return "Estado";
            },
            permissions: () => {
                return "Permisos";
            },
            notFilled: () => {
                switch (params["table"]) {
                    case "students":
                        return "del Estudiante";
                    case "grades":
                        return "para el Grado";
                    case "levels":
                        return "para el Nivel";
                    case "roles":
                        return "para el Rol";
                    case "users":
                        return "para el Usuario";
                    case "events":
                        return "para el Evento";
                    default:
                        return "";
                }
            },
            congratulation_add: () => {
                switch (params["table"]) {
                    case "students":
                        return "Estudiante registrado.";
                    case "grades":
                        return "Grado registrado.";
                    case "levels":
                        return "Nivel registrado.";
                    case "roles":
                        return "Rol registrado.";
                    case "users":
                        return "Usuario registrado.";
                    case "events":
                        return "Evento registrado.";
                    default:
                        return "";
                }
            },
            congratulation_edit: () => {
                switch (params["table"]) {
                    case "students":
                        return "Estudiante editado.";
                    case "grades":
                        return "Grado editado.";
                    case "levels":
                        return "Nivel editado.";
                    case "roles":
                        return "Rol editado.";
                    case "users":
                        return "Usuario editado.";
                    case "events":
                        return "Configuración del Evento editada.";
                    default:
                        return "";
                }
            },
            congratulation_disable: () => {
                switch (params["table"]) {
                    case "students":
                        return "Estudiante inhabilitado.";
                    case "grades":
                        return "Grado inhabilitado.";
                    case "levels":
                        return "Nivel inhabilitado.";
                    case "roles":
                        return "Rol inhabilitado.";
                    case "users":
                        return "Usuario inhabilitado.";
                    case "events":
                        return "Evento inhabilitado.";
                    default:
                        return "";
                }
            },
            congratulation_rehabilitate: () => {
                switch (params["table"]) {
                    case "students":
                        return "Estudiante rehabilitado.";
                    case "grades":
                        return "Grado rehabilitado.";
                    case "levels":
                        return "Nivel rehabilitado.";
                    case "roles":
                        return "Rol rehabilitado.";
                    case "users":
                        return "Usuario rehabilitado.";
                    case "events":
                        return "Evento rehabilitado.";
                    default:
                        return "";
                }
            },
            rusure: () => {
                switch (params["table"]) {
                    case "students":
                        return "estudiante";
                    case "grades":
                        return "grado";
                    case "levels":
                        return "nivel";
                    case "roles":
                        return "rol";
                    case "users":
                        return "usuario";
                    case "events":
                        return "Evento";
                    default:
                        return "";
                }
            },
            logTitle: (table, action) => {
                let response = {};
                switch (table) {
                    case "students":
                        response["table"] = "Estudiante ";
                        break;
                    case "grades":
                        response["table"] = "Grado ";
                        break;
                    case "levels":
                        response["table"] = "Nivel ";
                        break;
                    case "roles":
                        response["table"] = "Rol ";
                        break;
                    case "users":
                        response["table"] = "Usuario ";
                        break;
                    case "events":
                        response["table"] = "Evento ";
                        break;
                }

                switch (action) {
                    case "add":
                        response["action"] = "Registrado.";
                        break;
                    case "edit":
                        response["action"] = "Modificado.";
                        break;
                    case "editSettings":
                        response["action"] = "Reconfigurado.";
                        break;
                    case "editComplements":
                        response["action"] = "Complementos Editados.";
                        break;
                    case "disable":
                        response["action"] = "Inhabilitado.";
                        break;
                    case "rehabilitate":
                        response["action"] = "Rehabilitado.";
                        break;
                }

                return response;
            },
            title: () => {
                return "Título";
            },
            author: () => {
                return "Autor";
            },
        };
        this.setupListeners();
        this.callColumns();
    }

    setupListeners(table = this.table) {
        if (table === "users") {
            $(document).on("click", "a.showUserProfile", (e) => {
                e.preventDefault();
                var id = e.currentTarget.id;

                if (!id)
                    console.error({
                        error: `Error al mostrar el formulario.`,
                        errorType: "Client Error",
                        errorDetails: "Not given id in the function.",
                        suggestion: "Refrezque la página.",
                        logout: false,
                    });
                this.showUserModal(id);
            });

            $(document).on("change", "input#addGenerateImageCheck", (e) => {
                if (e.currentTarget.checked)
                    $(".form-fileupload-add").css("display", "none");
                if (!e.currentTarget.checked)
                    $(".form-fileupload-add").css("display", "flex");
            });
            $(document).on("change", "input#editGenerateImageCheck", (e) => {
                if (e.currentTarget.checked)
                    $(".form-fileupload-edit").css("display", "none");
                if (!e.currentTarget.checked)
                    $(".form-fileupload-edit").css("display", "flex");
            });
            $(document).on("change", "input#passCheck", (e) => {
                if (e.currentTarget.checked)
                    $(".edit-passwords").css("display", "block");
                if (!e.currentTarget.checked)
                    $(".edit-passwords").css("display", "none");
            });
        }

        if (table === "events") {
            $(document).on("click", "a.showComplementsModal", (e) => {
                e.preventDefault();
                var id = e.currentTarget.id;

                if (!id)
                    console.error({
                        error: `Error al mostrar el formulario.`,
                        errorType: "Client Error",
                        errorDetails: "Not given id in the function.",
                        suggestion: "Refrezque la página.",
                        logout: false,
                    });
                this.showComplementsModal(id);
            });

            $(document).on("click", "button.addComplement", (e) => {
                e.preventDefault();
                this.addComplementValues();
            });

            $(document).on("click", "button.editComplement", (e) => {
                e.preventDefault();
                this.editComplementValues();
            });

            $(document).on("submit", "form.complements", (e) => {
                e.preventDefault();
                this.editEventComplements();
            });
        }

        $(document).on("click", "a.showEditModal", (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;

            if (!id)
                console.error({
                    error: `Error al mostrar el formulario.`,
                    errorType: "Client Error",
                    errorDetails: "Not given id in the function.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });
            this.showEditModal(id);
        });

        $(document).on("click", "a.showDisableAlert", (e) => {
            e.preventDefault();

            var id = e.currentTarget.id;
            if (!id)
                console.error({
                    error: `Error al mostrar la alerta.`,
                    errorType: "Client Error",
                    errorDetails: "Not given id in the function.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });

            this.showDisableAlert(id);
        });

        $(document).on("click", "a.showRehabilitateAlert", (e) => {
            e.preventDefault();

            var id = e.currentTarget.id;
            if (!id)
                console.error({
                    error: `Error al mostrar la alerta.`,
                    errorType: "Client Error",
                    errorDetails: "Not given id in the function.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });

            this.showRehabilitateAlert(id);
        });

        $(document).on("click", "a.status", (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;
            this.status = id;

            $("a.status").removeClass("active");
            $(e.currentTarget).addClass("active");

            if (table !== "events") this.callContent();
            else this.callEvents();
        });

        $(document).on("submit", "form.add", (e) => {
            e.preventDefault();

            let notFilledInputs = [];
            let notMinLengthInputs = [];
            let minorThanZeroInputs = [];
            let notSameRetype = [];
            let notNumberInput = [];
            let invalidMail = [];
            let invalidPass = [];
            let validInputs = {};

            const passRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2,})(?=.*[\W_]).{8,20}$/;
            const mailRegex = /^[a-zA-Z0-9._%+-]+@santacecilia\.edu\.sv$/;
            const textRegex = /^[^0-9]*$/;

            $(e.currentTarget)
                .find("input, select")
                .each(function () {
                    var formElement = this;

                    $(`.form-${$(formElement).attr("id")}`).removeClass("has-warning");
                    $(`.form-control-${$(formElement).attr("id")}-feedback`).css(
                        "display",
                        "none"
                    );

                    if (!$(formElement).attr("id")) return;

                    if (
                        $(formElement).val() == "" &&
                        $(formElement).attr("id") !== "fileupload" &&
                        $(formElement).attr("id") !== "pass" &&
                        $(formElement).attr("id") !== "retype"
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "fileupload" &&
                        !e.currentTarget["addGenerateImageCheck"].checked &&
                        $(formElement).val() === ""
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "fileupload" &&
                        e.currentTarget["addGenerateImageCheck"].checked
                    )
                        return;
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        !e?.currentTarget?.["passCheck"]?.checked &&
                        $(formElement).val() === ""
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        e.currentTarget["pass"].checked
                    )
                        return;
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        !e?.currentTarget?.["passCheck"]?.checked &&
                        $(formElement).val() === ""
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        e.currentTarget["pass"].checked
                    )
                        return;
                    else if ($(formElement).attr("id") === "fileupload")
                        validInputs[$(formElement).attr("id")] = formElement.files[0];
                    else if (
                        $(formElement).attr("id") === "addGenerateImageCheck" ||
                        $(formElement).attr("id") === "passCheck"
                    )
                        validInputs[$(formElement).attr("id")] = formElement.checked;
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        $(e.currentTarget).find("#retype").val() !== $(formElement).val()
                    )
                        notSameRetype.push(formElement);
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        $(e.currentTarget).find("#pass").val() !== $(formElement).val()
                    )
                        notSameRetype.push(formElement);
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        !passRegex.test($(formElement).val())
                    )
                        invalidPass.push(formElement);
                    else if (
                        $(formElement).attr("min-length") &&
                        $(formElement).val().length < $(formElement).attr("min-length")
                    )
                        notMinLengthInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "name" &&
                        !textRegex.test($(formElement).val())
                    )
                        notNumberInput.push(formElement);
                    else if (
                        $(formElement).attr("id") === "mail" &&
                        !mailRegex.test($(formElement).val())
                    )
                        invalidMail.push(formElement);
                    else if (
                        $(formElement).attr("type") === "number" &&
                        $(formElement).val() < 1
                    )
                        minorThanZeroInputs.push(formElement);
                    else validInputs[$(formElement).attr("id")] = $(formElement).val();
                });

            notFilledInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(`Por favor, 
                        ${input["placeholder"] === undefined
                        ? $(input).attr("title")
                        : input["placeholder"]
                    } ${this.traductor["notFilled"]()}.`);
            });

            notMinLengthInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Por favor, escriba por lo menos ${$(input).attr(
                        "min-length"
                    )} carácteres.`
                );
            });

            minorThanZeroInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Por favor, ingrese una cantidad mayor a cero.`
                );
            });

            notSameRetype.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Las contraseñas no coinciden, porfavor ingreselas nuevamente.`
                );
            });

            notNumberInput.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `El campo no permite números, porfavor ingreselo nuevamente.`
                );
            });

            invalidMail.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `El correo ingresado no es válido, porfavor ingreselo nuevamente.`
                );
            });

            invalidPass.forEach((input) => {
                const value = $(input).val();
                const charLength = /^.{8,20}$/;
                const minNumber = /.*\d.*\d/;
                const specialChar = /.*[!@#$%^&*'(),.?":{}|<>]/;
                const minusChar = /[a-z]/;
                const mayusChar = /[A-Z]/;

                var previous = false;

                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`);
                let errorMessage = "";

                if (!charLength.test(value)) {
                    errorMessage += " 8 caracteres como mínimo";

                    if (
                        minNumber.test(value) &&
                        specialChar.test(value) &&
                        minusChar.test(value) &&
                        mayusChar.test(value)
                    )
                        errorMessage += ".";
                    else errorMessage += ". Entre ellos:";
                }
                if (!minNumber.test(value)) {
                    if (
                        specialChar.test(value) &&
                        minusChar.test(value) &&
                        mayusChar.test(value)
                    )
                        errorMessage += " dos números.";
                    else errorMessage += " dos números";
                    previous = true;
                }
                if (!specialChar.test(value)) {
                    if (previous && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += " y un carácter especial.";
                    else if (previous && !minNumber.test(value))
                        errorMessage += ", un carácter especial";
                    else if (!previous) errorMessage += " un carácter especial";
                    previous = true;
                }
                if (!minusChar.test(value)) {
                    if (
                        (!specialChar.test(value) && mayusChar.test(value)) ||
                        (!minNumber.test(value) && mayusChar.test(value))
                    )
                        errorMessage += " y una letra minúscula.";
                    else if (
                        !minNumber.test(value) ||
                        !specialChar.test(value) ||
                        (!minNumber.test(value) && !specialChar.test(value))
                    )
                        errorMessage += ", una letra minúscula";
                    else if (!previous) errorMessage += " una letra minúscula";
                    previous = true;
                }
                if (!mayusChar.test(value)) {
                    if (minusChar.test(value) && minNumber.test(value))
                        errorMessage += " una letra mayúscula.";
                    else errorMessage += " y una letra mayúscula.";
                }

                if (errorMessage !== "") {
                    $(`.form-control-${$(input).attr("id")}-feedback`).text(
                        "La contraseña debe poseer" + errorMessage
                    );
                }
            });

            if (
                !notFilledInputs.length &&
                !notMinLengthInputs.length &&
                !minorThanZeroInputs.length &&
                !notSameRetype.length &&
                !invalidPass.length &&
                !invalidMail.length &&
                !invalidMail.length
            ) {
                if (e?.currentTarget?.["addGenerateImageCheck"])
                    e.currentTarget["addGenerateImageCheck"].checked = false;
                if (this.table == "events") this.addEvent(validInputs);
                else this.add(validInputs);
            }
        });

        $(document).on("submit", "form.edit", (e) => {
            e.preventDefault();

            let notFilledInputs = [];
            let notMinLengthInputs = [];
            let minorThanZeroInputs = [];
            let notSameRetype = [];
            let notNumberInput = [];
            let invalidMail = [];
            let invalidPass = [];
            let validInputs = {};

            const passRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2,})(?=.*[\W_]).{8,20}$/;
            const mailRegex = /^[a-zA-Z0-9._%+-]+@santacecilia\.edu\.sv$/;
            const textRegex = /^[^0-9]*$/;

            $(e.currentTarget)
                .find("input, select, button")
                .each(function () {
                    var formElement = this;

                    $(`.form-${$(formElement).attr("id")}`).removeClass("has-warning");
                    $(`.form-control-${$(formElement).attr("id")}-feedback`).css(
                        "display",
                        "none"
                    );

                    if (!$(formElement).attr("id")) return;

                    if (
                        $(formElement).val() == "" &&
                        $(formElement).attr("id") !== "fileupload" &&
                        $(formElement).attr("id") !== "pass" &&
                        $(formElement).attr("id") !== "retype"
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "fileupload" &&
                        !e.currentTarget["editGenerateImageCheck"].checked &&
                        $(formElement).val() === "" &&
                        $("#changeImage").val() == "Change"
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "fileupload" &&
                        e.currentTarget["editGenerateImageCheck"].checked
                    )
                        return;
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        e?.currentTarget?.["passCheck"]?.checked &&
                        $(formElement).val() === ""
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        !e.currentTarget["passCheck"].checked
                    )
                        return;
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        e?.currentTarget?.["passCheck"]?.checked &&
                        $(formElement).val() === ""
                    )
                        notFilledInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        !e.currentTarget["passCheck"].checked
                    )
                        return;
                    else if (
                        $(formElement).attr("id") === "fileupload" &&
                        $("#changeImage").val() == "Change"
                    )
                        validInputs[$(formElement).attr("id")] = formElement.files[0];
                    else if ($(formElement).attr("id") === "fileupload")
                        validInputs[$(formElement).attr("id")] = $("#changeImage").val();
                    else if (
                        $(formElement).attr("id") === "editGenerateImageCheck" ||
                        $(formElement).attr("id") === "passCheck"
                    )
                        validInputs[$(formElement).attr("id")] = formElement.checked;
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        $(e.currentTarget).find("#retype").val() !== $(formElement).val()
                    )
                        notSameRetype.push(formElement);
                    else if (
                        $(formElement).attr("id") === "retype" &&
                        $(e.currentTarget).find("#pass").val() !== $(formElement).val()
                    )
                        notSameRetype.push(formElement);
                    else if (
                        $(formElement).attr("id") === "pass" &&
                        !passRegex.test($(formElement).val())
                    )
                        invalidPass.push(formElement);
                    else if (
                        $(formElement).attr("min-length") &&
                        $(formElement).val().length < $(formElement).attr("min-length")
                    )
                        notMinLengthInputs.push(formElement);
                    else if (
                        $(formElement).attr("id") === "name" &&
                        !textRegex.test($(formElement).val())
                    )
                        notNumberInput.push(formElement);
                    else if (
                        $(formElement).attr("id") === "mail" &&
                        !mailRegex.test($(formElement).val())
                    )
                        invalidMail.push(formElement);
                    else if (
                        $(formElement).attr("type") === "number" &&
                        $(formElement).val() < 1
                    )
                        minorThanZeroInputs.push(formElement);
                    else validInputs[$(formElement).attr("id")] = $(formElement).val();
                });

            notFilledInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(`Por favor, 
                        ${input["placeholder"] === undefined
                        ? $(input).attr("title")
                        : input["placeholder"]
                    } ${this.traductor["notFilled"]()}.`);
            });

            notMinLengthInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Por favor, escriba por lo menos ${$(input).attr(
                        "min-length"
                    )} carácteres.`
                );
            });

            minorThanZeroInputs.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Por favor, ingrese una cantidad mayor a cero.`
                );
            });

            notSameRetype.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `Las contraseñas no coinciden, porfavor ingreselas nuevamente.`
                );
            });

            notNumberInput.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `El campo no permite números, porfavor ingreselo nuevamente.`
                );
            });

            invalidMail.forEach((input) => {
                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`).text(
                    `El correo ingresado no es válido, porfavor ingreselo nuevamente.`
                );
            });

            invalidPass.forEach((input) => {
                const value = $(input).val();
                const charLength = /^.{8,20}$/;
                const minNumber = /.*\d.*\d/;
                const specialChar = /.*[!@#$%^&*'(),.?":{}|<>]/;
                const minusChar = /[a-z]/;
                const mayusChar = /[A-Z]/;

                var previous = false;

                $(`.form-control-${$(input).attr("id")}-feedback`).css(
                    "display",
                    "block"
                );
                $(`.form-${$(input).attr("id")}`).addClass("has-warning");
                $(`.form-control-${$(input).attr("id")}-feedback`);
                let errorMessage = "";

                if (!charLength.test(value)) {
                    errorMessage += " 8 caracteres como mínimo";

                    if (
                        minNumber.test(value) &&
                        specialChar.test(value) &&
                        minusChar.test(value) &&
                        mayusChar.test(value)
                    )
                        errorMessage += ".";
                    else errorMessage += ". Entre ellos:";
                }
                if (!minNumber.test(value)) {
                    if (
                        specialChar.test(value) &&
                        minusChar.test(value) &&
                        mayusChar.test(value)
                    )
                        errorMessage += " dos números.";
                    else errorMessage += " dos números";
                    previous = true;
                }
                if (!specialChar.test(value)) {
                    if (previous && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += " y un carácter especial.";
                    else if (previous && !minNumber.test(value))
                        errorMessage += ", un carácter especial";
                    else if (!previous) errorMessage += " un carácter especial";
                    previous = true;
                }
                if (!minusChar.test(value)) {
                    if (
                        (!specialChar.test(value) && mayusChar.test(value)) ||
                        (!minNumber.test(value) && mayusChar.test(value))
                    )
                        errorMessage += " y una letra minúscula.";
                    else if (
                        !minNumber.test(value) ||
                        !specialChar.test(value) ||
                        (!minNumber.test(value) && !specialChar.test(value))
                    )
                        errorMessage += ", una letra minúscula";
                    else if (!previous) errorMessage += " una letra minúscula";
                    previous = true;
                }
                if (!mayusChar.test(value)) {
                    if (minusChar.test(value) && minNumber.test(value))
                        errorMessage += " una letra mayúscula.";
                    else errorMessage += " y una letra mayúscula.";
                }

                if (errorMessage !== "") {
                    $(`.form-control-${$(input).attr("id")}-feedback`).text(
                        "La contraseña debe poseer" + errorMessage
                    );
                }
            });

            if (
                !notFilledInputs.length &&
                !notMinLengthInputs.length &&
                !minorThanZeroInputs.length &&
                !notSameRetype.length &&
                !invalidPass.length &&
                !invalidMail.length &&
                !invalidMail.length
            ) {
                if (e?.currentTarget?.["passCheck"])
                    e.currentTarget["passCheck"].checked = false;
                if (e?.currentTarget?.["editGenerateImageCheck"])
                    e.currentTarget["editGenerateImageCheck"].checked = false;
                if (this.table == "events") this.editEventSettings(validInputs);
                else this.edit(validInputs);
            }
        });

        $(".bd-addModal-lg").on("hidden.bs.modal", function (e) {
            $("form.add")
                .find("input, select")
                .each(function () {
                    var formElement = this;

                    $(`.form-${$(formElement).attr("id")}`).removeClass("has-warning");
                    $(`.form-control-${$(formElement).attr("id")}-feedback`).css(
                        "display",
                        "none"
                    );
                });
        });

        $(".bd-editModal-lg").on("hidden.bs.modal", function (e) {
            $("form.edit")
                .find("input, select")
                .each(function () {
                    var formElement = this;

                    $(`.form-${$(formElement).attr("id")}`).removeClass("has-warning");
                    $(`.form-control-${$(formElement).attr("id")}-feedback`).css(
                        "display",
                        "none"
                    );
                });
        });
    }
    async callColumns(mainTable = this.mainDataTable, table = this.table) {
        if (table == "events") return this.callEvents();

        let formData = new FormData();
        formData.append("action", "callColumns");

        let columns = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (columns["result"] !== "success") {
            console.error(columns);
            return;
        }
        columns["content"].forEach((content) => {
            $(`${mainTable} thead tr`).append(
                `<th>${this.traductor[content["column_name"]]()}</th>`
            );
        });

        if (table == "grades" || table == "levels")
            $(`${mainTable} thead tr`).append(`<th>Cantidad de Estudiantes</th>`);

        if (table == "roles")
            $(`${mainTable} thead tr`).append(
                `<th>Número de Usuarios con el Rol</th>`
            );

        if (table === "events" &&
            this.user["permissions"].some(
                (permission) =>
                    permission.name === "Administrar Plataforma" ||
                    permission.name === "Administrar Eventos"
            ) ||
            (table === "roles" &&
                this.user["permissions"].some(
                    (permission) =>
                        permission.name === "Administrar Plataforma" ||
                        permission.name === "Administrar Roles"
                )) ||
            (table === "grades" &&
                this.user["permissions"].some(
                    (permission) =>
                        permission.name === "Administrar Plataforma" ||
                        permission.name === "Administrar Grados"
                )) ||
            (table === "levels" &&
                this.user["permissions"].some(
                    (permission) =>
                        permission.name === "Administrar Plataforma" ||
                        permission.name === "Administrar Niveles"
                )) ||
            (table === "users" &&
                this.user["permissions"].some(
                    (permission) =>
                        permission.name === "Administrar Plataforma" ||
                        permission.name === "Administrar Usuarios"
                )) ||
            (table === "students" &&
                this.user["permissions"].some(
                    (permission) =>
                        permission.name === "Administrar Plataforma" ||
                        permission.name === "Administrar Estudiante"
                )))
            $(`${mainTable} thead tr`).append(`<th>Opciones</th>`);

        await this.initWithButtons();
        this.callContent();
    }
    async callEvents(status = this.status, table = "events") {
        try {
            if (!status) {
                console.error({
                    error: `Error al mostrar la alerta.`,
                    errorType: "Client Error",
                    errorDetails: "Not given status in the function.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });
                return;
            }

            let formData = new FormData();
            formData.append("action", "callContent");
            formData.append("status", status);

            let response = await this.ajaxRequest(
                `../model/classes/${table}.php`,
                formData
            ).catch((e) => ({
                error:
                    e["error"] !== "Request failed" ? e : { error: "Request failed" },
            }));

            if (response["result"] !== "success") {
                console.error(response);
                return;
            }

            var content = "";

            for (const event of response["content"]) {
                var levelsArray = JSON.parse(event["levels"]);
                var finalLevels = await Promise.all(
                    levelsArray.map(
                        async (element) => await this.callName(element, "levels")
                    )
                );
                const largeDate = (fechaString) => {
                    const meses = [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre",
                    ];
                    const [dia, mes, año] = fechaString.split("/").map(Number);
                    return `${meses[mes - 1]} ${dia}, ${año}`;
                };
                content += `
                <div class="col-sm-12 col-md-4 col-lg-4 mx-2 shadow-lg card">
                <div class="card-header card-primary" style="margin-top: 1rem;">`;
                if (
                    this.user["permissions"].some(
                        (permission) =>
                            permission.name === "Administrar Plataforma" ||
                            permission.name === "Administrar Eventos"
                    )
                ) {
                    content += `<a style="position: absolute; top: 0; right: 0; background-color: orange; padding: 1rem; background-color:transparent;" id="event-${event["id"]}-settings" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i style="display:flex; text-align:center; justify-content:center; font-size:1.2rem;" class="ti-settings"></i>
                            </a>`;
                    if (event["status"] !== "Deshabilitado") {
                        content += `<div class="dropdown-menu" aria-labelledby="event-${event["id"]}-settings">
                            <a class="dropdown-item showEditModal" id="${event["id"]}">Editar Configuración del Evento</a>
                            <a class="dropdown-item showComplementsModal" id="${event["id"]}">Editar Complementos del Evento</a>
                            <a class="dropdown-item showDisableAlert" id="${event["id"]}">Deshabilitar Evento</a>
                        </div>`;
                    } else {
                        content += `<div class="dropdown-menu" aria-labelledby="event-${event["id"]}-settings">
                            <a class="dropdown-item showRehabilitateAlert" id="${event["id"]}">Rehabilitar Evento</a>
                        </div>`;
                    }
                }
                content += `
                    <h5 class="card-title text-center">${event["name"]}</h5>
                    <span class="badge badge-primary d-flex justify-content-center" style="font-size:1rem;">${event["year"]
                    }</span>
                    </div>
                    <div class="card-body row">
                        <div class="col-lg-6 col-md-6 col-sm-12 py-1"> 
                            <a class="badge badge-success text-white d-flex justify-content-center" style="font-size:1rem;" data-toggle="collapse" data-target="#collapseStatus-${event["id"]
                    }" role="button" aria-expanded="false" aria-controls="collapseStatus-${event["id"]
                    }" title="Mostrar Estado del Evento">Estado &nbsp;&nbsp;<i class="ion ion-md-arrow-down"></i></a>
                            <div class="collapse" id="collapseStatus-${event["id"]
                    }">
                                <p class="text-center">${event["status"]}</p>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 py-1"> 
                            <a class="badge badge-info text-white d-flex justify-content-center" style="font-size:1rem;" data-toggle="collapse" data-target="#collapseLevels-${event["id"]
                    }" role="button" aria-expanded="false" aria-controls="collapseLevels-${event["id"]
                    }" title="Mostrar Niveles del Evento"><i class="ion ion-md-arrow-down"></i>&nbsp;&nbsp;Niveles</a>
                            <div class="collapse" id="collapseLevels-${event["id"]
                    }">
                                <p class="text-center">${finalLevels.join(
                        ", "
                    )}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h6 class="d-flex justify-content-center">Fecha del Evento:</h6>
                        <p class="d-flex justify-content-center">
                            ${largeDate(event["date"])}
                        </p>
                    </div>`;
                if (event["status"] !== "Deshabilitado") {
                    content += `<a class="btn btn-primary mt-0 mb-3 p-0 content d-flex justify-content-center text-white" id="eventPanel" name="${event["id"]}" role="button" style="font-size:1rem;" data-toggle="tooltip" data-placement="top" title="Entrar al evento">Entrar al evento</a>`;
                }
                content += `</div>`;
            }

            if (response["content"].length === 0) {
                await $(".eventsContent").html(
                    `<br><br><br><p>No hay eventos disponibles.</p>`
                );
            } else {
                await $(".eventsContent").html(content);
            }

            $(".datepicker").datepicker({
                language: "es",
                startDate: new Date(),
            });

            if (!$.fn.DataTable.isDataTable("#add-dataTable")) {
                await this.init($("#add-dataTable"));
            }

            if (!$.fn.DataTable.isDataTable("#edit-dataTable")) {
                await this.init($("#edit-dataTable"));
            }

            formData.set("action", "callSelect");
            await this.callLevels(formData);
            $('[data-toggle="tooltip"]').tooltip();

        } catch (error) {
            console.error({ error: error, errorType: "notAlert" });
        }
    }
    async callContent(
        status = this.status,
        mainTable = this.mainDataTable,
        table = this.table
    ) {
        try {
            if (!status) {
                console.error({
                    error: `Error al mostrar la alerta.`,
                    errorType: "Client Error",
                    errorDetails: "Not given status in the function.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });
                return;
            }

            let formData = new FormData();
            formData.append("action", "callColumns");
            formData.append("status", status);

            let columns = await this.ajaxRequest(
                `../model/classes/${table}.php`,
                formData
            ).catch((e) => ({
                error:
                    e["error"] !== "Request failed" ? e : { error: "Request failed" },
            }));

            if (columns["result"] !== "success") {
                console.error(columns);
                return;
            }

            formData.set("action", "callContent");

            let response = await this.ajaxRequest(
                `../model/classes/${table}.php`,
                formData
            ).catch((e) => ({
                error:
                    e["error"] !== "Request failed" ? e : { error: "Request failed" },
            }));

            if (response["result"] !== "success") {
                console.error(response);
                return;
            }

            if (!$.fn.DataTable.isDataTable(mainTable)) {
                console.error({
                    error: `Error al cargar el contenido.`,
                    errorType: "Client Error",
                    errorDetails: "Datatable is not loaded.",
                    suggestion: "Refrezque la página.",
                    logout: false,
                });
                return;
            }

            let dataTable = $(mainTable).DataTable();
            dataTable.clear().draw();

            response["content"].forEach((content) => {
                let dataTableRow = [];

                columns["content"].forEach((column) => {
                    dataTableRow.push(
                        table == "users" && column["column_name"] == "name"
                            ? `<a class="showUserProfile" id="${content["id"]}" data-toggle="tooltip" data-placement="top" title="Ver información del Usuario">&nbsp;&nbsp;
                                    <img src="../assets/images/users/${content["picture"]}" class="rounded" alt="Foto del Usuario ${content["name"]}" height="20">
                                &nbsp;&nbsp;
                                    ${content["name"]}
                                </a>`
                            : content[column["column_name"]]
                    );
                });

                if (table == "grades" || table == "levels")
                    dataTableRow.push(content["students_quantity"]);

                if (table == "roles") dataTableRow.push(content["students_quantity"]);

                if (table === "events" &&
                    this.user["permissions"].some(
                        (permission) =>
                            permission.name === "Administrar Plataforma" ||
                            permission.name === "Administrar Eventos"
                    ) ||
                    (table === "roles" &&
                        this.user["permissions"].some(
                            (permission) =>
                                permission.name === "Administrar Plataforma" ||
                                permission.name === "Administrar Roles"
                        )) ||
                    (table === "grades" &&
                        this.user["permissions"].some(
                            (permission) =>
                                permission.name === "Administrar Plataforma" ||
                                permission.name === "Administrar Grados"
                        )) ||
                    (table === "levels" &&
                        this.user["permissions"].some(
                            (permission) =>
                                permission.name === "Administrar Plataforma" ||
                                permission.name === "Administrar Niveles"
                        )) ||
                    (table === "users" &&
                        this.user["permissions"].some(
                            (permission) =>
                                permission.name === "Administrar Plataforma" ||
                                permission.name === "Administrar Usuarios"
                        )) ||
                    (table === "students" &&
                        this.user["permissions"].some(
                            (permission) =>
                                permission.name === "Administrar Plataforma" ||
                                permission.name === "Administrar Estudiante"
                        )))
                    dataTableRow.push(
                        content["status"] == "Habilitado"
                            ? (table == "roles" && content["name"] == "root") ||
                                (table == "users" && content["rol_id"] == "root") ||
                                (table == "users" && content["id"] == this.user["id"])
                                ? ``
                                :
                                `<center>
                                            <a class="lead text-warning showEditModal" data-toggle="tooltip" data-placement="top" title="Editar ${this.traductor[
                                    "rusure"
                                ]()}" id="${content["id"]}">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            &nbsp;&nbsp;
                                            <a class="lead text-secondary showDisableAlert" data-toggle="tooltip" data-placement="top" title="Deshabilitar ${this.traductor[
                                    "rusure"
                                ]()}" id="${content["id"]}">
                                                <i class="fas fa-lock"></i>
                                            </a>
                                        </center>`
                            :
                            `<center>
                                        <a class="lead text-info showRehabilitateAlert" data-toggle="tooltip" data-placement="top" title="Rehabilitar ${this.traductor[
                                "rusure"
                            ]()}" id="${content["id"]}">
                                            <i class="fas fa-lock-open"></i>
                                        </a>
                                    </center>`
                    );


                dataTable.row.add(dataTableRow);
            });

            dataTable.draw();

            switch (table) {
                case "students":
                    formData.set("action", "callSelect");
                    await this.callSections(formData);
                    await this.callGrades(formData);
                    break;
                case "levels":
                    formData.set("action", "callSelect");
                    this.callGrades(formData);
                    break;
                case "users":
                    formData.set("action", "callSelect");
                    this.callRoles(formData);
                    break;
                case "roles":
                    formData.set("action", "callSelect");
                    this.callPermissions(formData);
                    break;
            }

            $('[data-toggle="tooltip"]').tooltip();
        } catch (error) {
            console.error({ error: error, errorType: "notAlert" });
        }
    }
    async callLevels(formData) {
        let levels = await this.ajaxRequest(
            "../model/classes/levels.php",
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (levels["result"] !== "success") {
            console.error(levels);
            return;
        }

        var bsLevels;
        levels["content"].forEach((content) => {
            bsLevels += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });
        $("select#levels").html(bsLevels);
        $("select#levels").selectpicker("refresh");
    }
    async callRoles(formData) {
        let roles = await this.ajaxRequest(
            "../model/classes/roles.php",
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (roles["result"] !== "success") {
            console.error(roles);
            return;
        }

        var bsRoles;
        roles["content"].forEach((content) => {
            bsRoles += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });
        $("select#roles").html(bsRoles);
        $("select#roles").selectpicker("refresh");
    }
    async callGrades(formData) {
        let grades = await this.ajaxRequest(
            "../model/classes/grades.php",
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (grades["result"] !== "success") {
            console.error(grades);
            return;
        }

        var bsGrades;
        grades["content"].forEach((content) => {
            bsGrades += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });
        $("select#grade").html(bsGrades);
        $("select#grade").selectpicker("refresh");
    }
    async callSections(formData) {
        let sections = await this.ajaxRequest(
            "../model/classes/sections.php",
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (sections["result"] !== "success") {
            console.error(sections);
            return;
        }

        var bsSections;
        sections["content"].forEach((content) => {
            bsSections += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });

        $("select#section").html(bsSections);
        $("select#section").selectpicker("refresh");
    }
    async callPermissions(formData) {
        let permissions = await this.ajaxRequest(
            "../model/classes/permissions.php",
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (permissions["result"] !== "success") {
            console.error(permissions);
            return;
        }

        var bsPermissions;
        permissions["content"].forEach((content) => {
            bsPermissions += `<option data-tokens="${content["name"] + content["event_id"] != ""
                ? "del evento " + content["event_id"] + "."
                : ""
                }" value="${content["id"]}">${content["name"]}</option>`;
        });

        $("select#permissions").html(bsPermissions);
        $("select#permissions").selectpicker("refresh");
    }
    async callName(id, table = this.table) {
        let formData = new FormData();
        formData.append("action", "callName");
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }
        return response["content"]["name"];
    }
    async showUserModal(id) {
        let formData = new FormData();
        formData.append("action", "callUserInfo");
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/users.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        $(".userName").text(response["content"]["name"]);
        $(".userRol").text(response["content"]["rol"]);
        $(".userMail").text(response["content"]["mail"]);
        $(".showUserPicture")[0].src =
            "../assets/images/users/" + response["content"]["picture"];

        $(".bd-showModal-lg").modal("show");
    }
    async showEditModal(id, table = this.table) {
        let formData = new FormData();
        formData.append("action", "callInfo");
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        $("form.edit")
            .find("input, select, button")
            .each((element) => {
                var formElement = $("form.edit")[0][element];
                if (!$(formElement).attr("id")) return;

                switch ($(formElement).attr("id")) {
                    case "edit":
                        $(formElement).val(response["content"]["id"]);
                        break;
                    case "name":
                        $(formElement).val(response["content"]["name"]);
                        break;
                    case "students_quantity":
                        $(formElement).val(response["content"]["students_quantity"]);
                        break;
                    case "surname":
                        $(formElement).val(response["content"]["surname"]);
                        break;
                    case "price":
                        $(formElement).val(response["content"]["price"]);
                        break;
                    case "carnet":
                        $(formElement).val(response["content"]["carnet"]);
                        break;
                    case "mail":
                        $(formElement).val(response["content"]["mail"]);
                        break;
                    case "grade":
                        if (Array.isArray(response["content"]["grade"])) {
                            $(formElement).selectpicker("val", response["content"]["grade"]);
                        } else $(formElement).val(response["content"]["grade"]);
                        $(formElement).selectpicker("refresh");
                        break;
                    case "permissions":
                        if (Array.isArray(response["content"]["grade"]))
                            if (response["content"]["grade"].length == 1)
                                $(formElement).val(response["content"]["permissions_id"]);
                            else
                                $(formElement).selectpicker(
                                    "val",
                                    response["content"]["permissions_id"]
                                );
                        else $(formElement).val(response["content"]["permissions_id"]);
                        $(formElement).selectpicker("refresh");
                        break;
                    case "levels":
                        $(formElement).selectpicker(
                            "val",
                            JSON.parse(response["content"]["levels"])
                        );
                        $(formElement).selectpicker("refresh");
                        break;
                    case "date":
                        const largeDate = (fechaString) => {
                            const meses = [
                                "Enero",
                                "Febrero",
                                "Marzo",
                                "Abril",
                                "Mayo",
                                "Junio",
                                "Julio",
                                "Agosto",
                                "Septiembre",
                                "Octubre",
                                "Noviembre",
                                "Diciembre",
                            ];
                            const [dia, mes, año] = fechaString.split("/").map(Number);
                            return `${meses[mes - 1]} ${dia}, ${año}`;
                        };
                        var date = largeDate(response["content"]["date"]);
                        console.log(date);

                        $(formElement)
                            .datepicker({
                                language: "es",
                                startDate: date,
                            })
                            .datepicker("setDate", date);
                        break;
                    case "section":
                        $(formElement).val(response["content"]["section"]);
                        $(formElement).selectpicker("refresh");
                        break;
                    case "roles":
                        $(formElement).val(response["content"]["rol_id"]);
                        $(formElement).selectpicker("refresh");
                        break;
                    case "fileupload":
                        $("#changeImage").val(response["content"]["picture"]);
                        formElement.nextElementSibling.innerHTML =
                            response["content"]["picture"];
                        $(".userPicture")[0].src =
                            "../assets/images/users/" + response["content"]["picture"];
                        break;
                }
            });

        $(".bd-editModal-lg").modal("show");
    }
    async showComplementsModal(id) {
        var table = $("#edit-dataTable").DataTable();

        table.clear().draw();

        let formData = new FormData();
        formData.append("action", "callComplements");
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/events.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        var complements = JSON.parse(response["content"]["complements"]);

        var options = `<center>
            <a class="lead text-warning editEdittedComplements" data-toggle="tooltip" data-placement="top" title="Editar Complemento" data-id="${id}">
                <i class="fas fa-edit"></i>
            </a>
            &nbsp;&nbsp;
            <a class="lead text-danger deleteEdittedComplements" data-toggle="tooltip" data-placement="top" title="Eliminar Complemento" data-id="${id}">
                <i class="fas fa-trash"></i>
            </a>
            </center>`;

        table.clear();

        for (const key in complements) {
            if (Object.prototype.hasOwnProperty.call(complements, key)) {
                const element = complements[key];
                table.row
                    .add([
                        complements[key]["id"],
                        complements[key]["title"],
                        complements[key]["price"],
                        options,
                    ])
                    .draw();
            }
        }

        $("#edit-dataTable tbody").off("click", ".deleteEdittedComplements");
        $("#edit-dataTable tbody").on(
            "click",
            ".deleteEdittedComplements",
            function () {
                var row = table.row($(this).parents("tr"));
                var rowData = row.data();

                Swal.fire({
                    title: `¿Eliminar Complemento`,
                    html: `¿Estás seguro que desea eliminar este complemento? <span class="badge badge-danger" style="font-size: 1rem;">${rowData[1]}</span>?`,
                    icon: "warning",
                    showCancelButton: true,
                    customClass: {
                        confirmButton: "btn btn-danger btn-lg",
                        cancelButton: "btn btn-outline-danger btn-lg ml-4",
                    },
                    buttonsStyling: false,
                    confirmButtonText: "Eliminar",
                    cancelButtonText: "Cancelar",
                }).then(async (result) => {
                    if (!result.isConfirmed) return;

                    var row = table.row($(this).parents("tr"));
                    row.remove().draw();
                });
            }
        );

        $("#edit-dataTable tbody").off("click", ".editEdittedComplements");
        $("#edit-dataTable tbody").on(
            "click",
            ".editEdittedComplements",
            function () {
                var row = table.row($(this).parents("tr"));
                var rowData = row.data();

                $(".bd-showComplementsModal-lg").modal("toggle");
                Swal.fire({
                    title: "Editar Complemento",
                    icon: "info",
                    html: `
                    <div class="container" style="padding:0.1rem; z-index: 9999;">
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editName">
                                Nombre:
                            </label>  
                            <div class="col-md-8 col-sm-6">
                                <input id="editedittedName" class="form-control" placeholder="Nombre del complemento" value="${rowData[1]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editPrice">
                                Precio:
                            </label>
                            <div class="col-md-8 col-sm-6">
                                <input id="editedittedPrice" type="number" class="form-control" placeholder="Precio del complemento" value="${rowData[2]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                    </div> 
                `,

                    focusConfirm: false,
                    showCancelButton: true,
                    customClass: {
                        confirmButton: "btn btn-primary btn-lg",
                        cancelButton: "btn btn-outline-primary btn-lg ml-4",
                    },
                    buttonsStyling: false,
                    confirmButtonText: "Guardar Cambios",
                    cancelButtonText: "Cancelar",
                    preConfirm: () => {
                        var newName = $("#editedittedName").val();
                        var newPrice = $("#editedittedPrice").val();

                        // Validaciones de los campos
                        if (!newName || newName.length < 4) {
                            Swal.showValidationMessage(
                                "El nombre debe tener al menos 4 caracteres"
                            );
                            return false;
                        }
                        if (newPrice < 0) {
                            Swal.showValidationMessage(
                                "El precio debe ser un valor positivo"
                            );
                            return false;
                        }

                        return { name: newName, price: newPrice };
                    },
                }).then((result) => {
                    $(".bd-showComplementsModal-lg").modal("toggle");
                    if (result.isConfirmed) {
                        var newName = result.value.name;
                        var newPrice = result.value.price;

                        rowData[1] = newName;
                        rowData[2] = newPrice;
                        row.data(rowData).draw();
                    }
                });
            }
        );

        $("#complements").val(response["content"]["id"]);
        $(".bd-showComplementsModal-lg").modal("show");
    }
    async showDisableAlert(id, element = this.traductor["rusure"]()) {
        var name = await this.callName(id);
        if (!name) return;

        swal
            .fire({
                title: `Deshabilitar ${element}`,
                html: `¿Estás seguro que deseas deshabilitar este ${element} <span class="badge badge-secondary" style="font-size: 1rem;">${name}</span>?`,
                icon: "warning",
                inputLabel: "Ingrese el mótivo",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off",
                },
                showCancelButton: true,
                customClass: {
                    confirmButton: "btn btn-secondary btn-lg",
                    cancelButton: "btn btn-outline-secondary btn-lg ml-4",
                },
                buttonsStyling: false,
                confirmButtonText: "Deshabilitar",
                cancelButtonText: "Cancelar",
                preConfirm: async (reason) => {
                    if (!reason || reason.length < 4) {
                        Swal.showValidationMessage("Porfavor, ingrese un mótivo válido.");
                        return false;
                    }

                    return { reason: reason };
                },
            })
            .then(async (result) => {
                if (!result.isConfirmed) return;

                this.disable(id, result.value["reason"], name);
            });
    }
    async showRehabilitateAlert(id, element = this.traductor["rusure"]()) {
        var name = await this.callName(id);
        if (!name) return;

        swal
            .fire({
                title: `Rehabilitar ${element}`,
                html: `¿Estás seguro que deseas rehabilitar este ${element} <span class="badge badge-info" style="font-size: 1rem;">${name}</span>?`,
                icon: "info",
                inputLabel: "Ingrese el mótivo",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off",
                },
                showCancelButton: true,
                customClass: {
                    confirmButton: "btn btn-info btn-lg",
                    cancelButton: "btn btn-outline-info btn-lg ml-4",
                },
                buttonsStyling: false,
                confirmButtonText: "Rehabilitar",
                cancelButtonText: "Cancelar",
                preConfirm: async (reason) => {
                    if (!reason || reason.length < 4) {
                        Swal.showValidationMessage("Porfavor, ingrese un mótivo válido.");
                        return false;
                    }

                    return { reason: reason };
                },
            })
            .then(async (result) => {
                if (!result.isConfirmed) return;

                this.rehabilitate(id, result.value["reason"], name);
            });
    }
    async addEvent(content, dataTable = $("#add-dataTable")) {
        let formData = new FormData();
        formData.append("action", "add");
        formData.append("name", content["name"]);
        formData.append("eventDate", content["date"]);
        formData.append("price", content["price"]);

        var table = dataTable.DataTable();
        var allData = table
            .rows()
            .data()
            .toArray()
            .map((rowData) => {
                return rowData.slice(0, -1);
            });

        delete content["name"];

        let complements = {};

        var logComplements = "";

        allData.forEach(function (rowData) {
            var id = rowData[0];
            var title = rowData[1];
            var price = rowData[2];

            complements[id] = {
                id: id,
                title: title,
                price: price,
            };

            logComplements += `nombre: ${title}, precio: ${price} <br   >`;
        });

        const convertirFecha = (fechaString) =>
            fechaString
                .replace(
                    /(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)/,
                    (mes) =>
                        (
                            "0" +
                            ("EneFebMarAbrMayJunJulAgoSepOctNovDic".indexOf(mes.slice(0, 3)) /
                                3 +
                                1)
                        ).slice(-2)
                )
                .replace(",", "")
                .replace(/(\d{2}) (\d{2}) (\d{4})/, "$2/$1/$3");

        content.date = convertirFecha(content["date"]);

        let settings = JSON.stringify({
            settings: {
                ...content,
            },
            complements: {
                ...complements,
            },
        });

        formData.append("settings", settings);

        let response = await this.ajaxRequest(
            `../model/classes/events.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        formData.append("id", response["id"]);

        var levelsArray = content["levels"];
        var finalLevels = "";

        for (let index = 0; index < levelsArray.length; index++) {
            const element = levelsArray[index];
            finalLevels +=
                (index !== 0 ? ", " : "") + (await this.callName(element, "levels"));
        }

        formData.append("levels", finalLevels);
        if (logComplements !== "") formData.append("complements", logComplements);

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_add"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        this.callEvents();

        table.clear().draw();

        $(".bd-addModal-lg").modal("hide");
    }
    async addComplementValues(dataTable = $("#add-dataTable")) {
        var table = dataTable.DataTable();
        var id = 0;

        if (table.rows().any()) {
            var lastRow = table.row(":last").data();
            if (lastRow && lastRow[0] !== undefined) {
                id = parseInt(lastRow[0]) + 1;
            }
        }

        var name = $(".add-complements-name").val();
        var price = $(".add-complements-price").val();

        if (name === "") {
            $(".form-control-add-complements-name-feedback").css("display", "block");
            $(".form-add-complements-name").addClass("has-warning");
            $(".form-control-add-complements-name-feedback").text(
                "Por favor, Ingrese el nombre del Complemento."
            );
        } else if (name.length < $(".add-complements-name").attr("min-length")) {
            $(".form-control-add-complements-name-feedback").css("display", "block");
            $(".form-add-complements-name").addClass("has-warning");
            $(".form-control-add-complements-name-feedback").text(
                "Por favor, Ingrese mínimo 4 dígitos."
            );
        } else {
            $(".form-control-add-complements-name-feedback").css("display", "none");
            $(".form-add-complements-name").removeClass("has-warning");
            $(".form-control-add-complements-name-feedback").text("");
        }

        if (price === "") {
            $(".form-control-add-complements-price-feedback").css("display", "block");
            $(".form-add-complements-price").addClass("has-warning");
            $(".form-control-add-complements-price-feedback").text(
                "Por favor, Ingrese el precio del Complemento."
            );
        } else if (price < 0) {
            $(".form-control-add-complements-price-feedback").css("display", "block");
            $(".form-add-complements-price").addClass("has-warning");
            $(".form-control-add-complements-price-feedback").text(
                "Por favor, Ingrese un precio válido."
            );
        } else {
            $(".form-control-add-complements-price-feedback").css("display", "none");
            $(".form-add-complements-price").removeClass("has-warning");
            $(".form-control-add-complements-price-feedback").text("");
        }

        if (
            name === "" ||
            name.length < $(".add-complements-name").attr("min-length") ||
            price === "" ||
            price < 0
        )
            return;

        var options = `<center>
            <a class="lead text-warning editAddedComplements" data-toggle="tooltip" data-placement="top" title="Editar Complemento" data-id="${id}">
                <i class="fas fa-edit"></i>
            </a>
            &nbsp;&nbsp;
            <a class="lead text-danger deleteAddedComplements" data-toggle="tooltip" data-placement="top" title="Eliminar Complemento" data-id="${id}">
                <i class="fas fa-trash"></i>
            </a>
            </center>`;

        table.row.add([id, name, price, options]).draw();
        table.columns.adjust().draw();

        $(".add-complements-name").val("");
        $(".add-complements-price").val("");

        $("#add-dataTable tbody").off("click", ".deleteAddedComplements");
        $("#add-dataTable tbody").on(
            "click",
            ".deleteAddedComplements",
            function () {
                var row = table.row($(this).parents("tr"));
                var rowData = row.data();

                Swal.fire({
                    title: `¿Eliminar Complemento`,
                    html: `¿Estás seguro que desea eliminar este complemento? <span class="badge badge-danger" style="font-size: 1rem;">${rowData[1]}</span>?`,
                    icon: "warning",
                    showCancelButton: true,
                    customClass: {
                        confirmButton: "btn btn-danger btn-lg",
                        cancelButton: "btn btn-outline-danger btn-lg ml-4",
                    },
                    buttonsStyling: false,
                    confirmButtonText: "Eliminar",
                    cancelButtonText: "Cancelar",
                }).then(async (result) => {
                    if (!result.isConfirmed) return;

                    var row = table.row($(this).parents("tr"));
                    row.remove().draw();
                });
            }
        );

        $("#add-dataTable tbody").off("click", ".editAddedComplements");
        $("#add-dataTable tbody").on("click", ".editAddedComplements", function () {
            var row = table.row($(this).parents("tr"));
            var rowData = row.data();

            $(".bd-addModal-lg").modal("toggle");
            Swal.fire({
                title: "Editar Complemento",
                icon: "info",
                html: `
                    <div class="container" style="padding:0.1rem; z-index: 9999;">
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editName">
                                Nombre:
                            </label>  
                            <div class="col-md-8 col-sm-6">
                                <input id="editaddedName" class="form-control" placeholder="Nombre del complemento" value="${rowData[1]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editPrice">
                                Precio:
                            </label>
                            <div class="col-md-8 col-sm-6">
                                <input id="editaddedPrice" type="number" class="form-control" placeholder="Precio del complemento" value="${rowData[2]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                    </div> 
                `,

                focusConfirm: false,
                showCancelButton: true,
                customClass: {
                    confirmButton: "btn btn-primary btn-lg",
                    cancelButton: "btn btn-outline-primary btn-lg ml-4",
                },
                buttonsStyling: false,
                confirmButtonText: "Guardar Cambios",
                cancelButtonText: "Cancelar",
                preConfirm: () => {
                    var newName = $("#editaddedName").val();
                    var newPrice = $("#editaddedPrice").val();

                    // Validaciones de los campos
                    if (!newName || newName.length < 4) {
                        Swal.showValidationMessage(
                            "El nombre debe tener al menos 4 caracteres"
                        );
                        return false;
                    }
                    if (newPrice < 0) {
                        Swal.showValidationMessage("El precio debe ser un valor positivo");
                        return false;
                    }

                    return { name: newName, price: newPrice };
                },
            }).then((result) => {
                $(".bd-addModal-lg").modal("toggle");
                if (result.isConfirmed) {
                    var newName = result.value.name;
                    var newPrice = result.value.price;

                    rowData[1] = newName;
                    rowData[2] = newPrice;
                    row.data(rowData).draw();
                }
            });
        });
    }
    async editComplementValues(dataTable = $("#edit-dataTable")) {
        var table = dataTable.DataTable();
        var id = 0;

        if (table.rows().any()) {
            var lastRow = table.row(":last").data();
            if (lastRow && lastRow[0] !== undefined) {
                id = parseInt(lastRow[0]) + 1;
            }
        }

        var name = $(".edit-complements-name").val();
        var price = $(".edit-complements-price").val();

        if (name === "") {
            $(".form-control-edit-complements-name-feedback").css("display", "block");
            $(".form-edit-complements-name").addClass("has-warning");
            $(".form-control-edit-complements-name-feedback").text(
                "Por favor, Ingrese el nombre del Complemento."
            );
        } else if (name.length < $(".edit-complements-name").attr("min-length")) {
            $(".form-control-edit-complements-name-feedback").css("display", "block");
            $(".form-edit-complements-name").addClass("has-warning");
            $(".form-control-edit-complements-name-feedback").text(
                "Por favor, Ingrese mínimo 4 dígitos."
            );
        } else {
            $(".form-control-edit-complements-name-feedback").css("display", "none");
            $(".form-edit-complements-name").removeClass("has-warning");
            $(".form-control-edit-complements-name-feedback").text("");
        }

        if (price === "") {
            $(".form-control-edit-complements-price-feedback").css(
                "display",
                "block"
            );
            $(".form-edit-complements-price").addClass("has-warning");
            $(".form-control-edit-complements-price-feedback").text(
                "Por favor, Ingrese el precio del Complemento."
            );
        } else if (price < 0) {
            $(".form-control-edit-complements-price-feedback").css(
                "display",
                "block"
            );
            $(".form-edit-complements-price").addClass("has-warning");
            $(".form-control-edit-complements-price-feedback").text(
                "Por favor, Ingrese un precio válido."
            );
        } else {
            $(".form-control-edit-complements-price-feedback").css("display", "none");
            $(".form-edit-complements-price").removeClass("has-warning");
            $(".form-control-edit-complements-price-feedback").text("");
        }

        if (
            name === "" ||
            name.length < $(".edit-complements-name").attr("min-length") ||
            price === "" ||
            price < 0
        )
            return;

        var options = `<center>
            <a class="lead text-warning editEdittedComplements" data-toggle="tooltip" data-placement="top" title="Editar Complemento" data-id="${id}">
                <i class="fas fa-edit"></i>
            </a>
            &nbsp;&nbsp;
            <a class="lead text-danger deleteEdittedComplements" data-toggle="tooltip" data-placement="top" title="Eliminar Complemento" data-id="${id}">
                <i class="fas fa-trash"></i>
            </a>
            </center>`;

        table.row.add([id, name, price, options]).draw();
        table.columns.adjust().draw();

        $(".edit-complements-name").val("");
        $(".edit-complements-price").val("");

        $("#edit-dataTable tbody").off("click", ".deleteEdittedComplements");
        $("#edit-dataTable tbody").on(
            "click",
            ".deleteEdittedComplements",
            function () {
                var row = table.row($(this).parents("tr"));
                var rowData = row.data();

                Swal.fire({
                    title: `¿Eliminar Complemento`,
                    html: `¿Estás seguro que desea eliminar este complemento? <span class="badge badge-danger" style="font-size: 1rem;">${rowData[1]}</span>?`,
                    icon: "warning",
                    showCancelButton: true,
                    customClass: {
                        confirmButton: "btn btn-danger btn-lg",
                        cancelButton: "btn btn-outline-danger btn-lg ml-4",
                    },
                    buttonsStyling: false,
                    confirmButtonText: "Eliminar",
                    cancelButtonText: "Cancelar",
                }).then(async (result) => {
                    if (!result.isConfirmed) return;

                    var row = table.row($(this).parents("tr"));
                    row.remove().draw();
                });
            }
        );

        $("#edit-dataTable tbody").off("click", ".editEdittedComplements");
        $("#edit-dataTable tbody").on(
            "click",
            ".editEdittedComplements",
            function () {
                var row = table.row($(this).parents("tr"));
                var rowData = row.data();

                $(".bd-showComplementsModal-lg").modal("toggle");
                Swal.fire({
                    title: "Editar Complemento",
                    icon: "info",
                    html: `
                    <div class="container" style="padding:0.1rem; z-index: 9999;">
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editName">
                                Nombre:
                            </label>  
                            <div class="col-md-8 col-sm-6">
                                <input id="editedittedName" class="form-control" placeholder="Nombre del complemento" value="${rowData[1]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                        <div class="form-group row"> 
                            <label class="form-label col-md-4 col-sm-6" for="editPrice">
                                Precio:
                            </label>
                            <div class="col-md-8 col-sm-6">
                                <input id="editedittedPrice" type="number" class="form-control" placeholder="Precio del complemento" value="${rowData[2]}" style="z-index: 9999; position: relative;">
                            </div>
                        </div> 
                    </div> 
                `,

                    focusConfirm: false,
                    showCancelButton: true,
                    customClass: {
                        confirmButton: "btn btn-primary btn-lg",
                        cancelButton: "btn btn-outline-primary btn-lg ml-4",
                    },
                    buttonsStyling: false,
                    confirmButtonText: "Guardar Cambios",
                    cancelButtonText: "Cancelar",
                    preConfirm: () => {
                        var newName = $("#editedittedName").val();
                        var newPrice = $("#editedittedPrice").val();

                        // Validaciones de los campos
                        if (!newName || newName.length < 4) {
                            Swal.showValidationMessage(
                                "El nombre debe tener al menos 4 caracteres"
                            );
                            return false;
                        }
                        if (newPrice < 0) {
                            Swal.showValidationMessage(
                                "El precio debe ser un valor positivo"
                            );
                            return false;
                        }

                        return { name: newName, price: newPrice };
                    },
                }).then((result) => {
                    $(".bd-showComplementsModal-lg").modal("toggle");
                    if (result.isConfirmed) {
                        var newName = result.value.name;
                        var newPrice = result.value.price;

                        rowData[1] = newName;
                        rowData[2] = newPrice;
                        row.data(rowData).draw();
                    }
                });
            }
        );
    }
    async editEventSettings(content) {
        let formData = new FormData();
        formData.append("action", "editSettings");

        for (const key in content) {
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const element = content[key];
                if (key != "levels") formData.append(key, element);
            }
        }

        var levelsArray = content["levels"];
        var finalLevels = "";

        for (let index = 0; index < levelsArray.length; index++) {
            const element = levelsArray[index];
            finalLevels +=
                (index !== 0 ? ", " : "") + (await this.callName(element, "levels"));
        }

        formData.append("levels", finalLevels);

        delete content["name"];

        const formatDate = (fechaString) =>
            fechaString
                .replace(
                    /(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)/,
                    (mes) =>
                        (
                            "0" +
                            ("EneFebMarAbrMayJunJulAgoSepOctNovDic".indexOf(mes.slice(0, 3)) /
                                3 +
                                1)
                        ).slice(-2)
                )
                .replace(",", "")
                .replace(/(\d{2}) (\d{2}) (\d{4})/, "$2/$1/$3");

        formData.append("eventDate", content["date"]);

        content.date = formatDate(content["date"]);

        formData.append("settings", JSON.stringify(content));

        let response = await this.ajaxRequest(
            `../model/classes/events.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_edit"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        this.callEvents();
        $(".bd-editModal-lg").modal("hide");
    }
    async editEventComplements(dataTable = $("#edit-dataTable")) {
        let formData = new FormData();
        formData.append("action", "editComplements");
        formData.append("id", $("#complements").val());

        var table = dataTable.DataTable();
        var allData = table
            .rows()
            .data()
            .toArray()
            .map((rowData) => {
                return rowData.slice(0, -1);
            });

        let complements = {};

        var logComplements = "";

        allData.forEach(function (rowData) {
            var id = rowData[0];
            var title = rowData[1];
            var price = rowData[2];

            complements[id] = {
                id: id,
                title: title,
                price: price,
            };

            logComplements += `nombre: ${title}, precio: ${price} <br   >`;
        });

        formData.append("settings", JSON.stringify(complements));

        let response = await this.ajaxRequest(
            `../model/classes/events.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        formData.append("complements", logComplements);

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_edit"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        this.callEvents();
        $(".bd-showComplementsModal-lg").modal("hide");
    }
    async add(content, table = this.table) {
        let formData = new FormData();
        formData.append("action", "add");

        for (const key in content)
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const element = content[key];
                formData.append(key, element);
                // console.log(key + " => " + content[key]);
            }

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        switch (table) {
            case "students":
                var grade = await this.callName(formData.get("grade"), "grades");
                var section = await this.callName(formData.get("section"), "sections");
                formData.set("grade", grade);
                formData.set("section", section);
                break;
            case "levels": //csv
                var grade = formData.get("grade");
                var gradesArray = grade.split(",").map((id) => id.trim());
                var finalgrades = "";

                for (let index = 0; index < gradesArray.length; index++) {
                    const element = gradesArray[index];
                    finalgrades +=
                        (index !== 0 ? ", " : "") +
                        (await this.callName(element, "grades"));
                }

                formData.set("grade", finalgrades);
                break;
            case "users":
                var roles = await this.callName(formData.get("roles"), "roles");
                formData.set("roles", roles);
                break;
            case "roles": //csv
                var permissions = formData.get("permissions");
                var permissionsArray = permissions.split(",").map((id) => id.trim());
                var finalpermissions = "";

                for (let index = 0; index < permissionsArray.length; index++) {
                    const element = permissionsArray[index];
                    finalpermissions +=
                        (index !== 0 ? ", " : "") +
                        (await this.callName(element, "permissions"));
                }

                formData.set("permissions", finalpermissions);
                break;
            default:
        }

        formData.append("id", response["id"]);

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_add"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        if (table !== "events") this.callContent();
        else this.callEvents();
        $(".bd-addModal-lg").modal("hide");
    }
    async edit(content, table = this.table) {
        let formData = new FormData();
        formData.append("action", "edit");

        for (const key in content) {
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const element = content[key];
                formData.append(key, element);
                // console.log(key + " => " + content[key]);
            }
        }

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        switch (table) {
            case "students":
                var grade = await this.callName(formData.get("grade"), "grades");
                var section = await this.callName(formData.get("section"), "sections");
                formData.set("grade", grade);
                formData.set("section", section);
                break;
            case "levels": //csv
                var grade = formData.get("grade");
                var gradesArray = grade.split(",").map((id) => id.trim());
                var finalgrades = "";

                for (let index = 0; index < gradesArray.length; index++) {
                    const element = gradesArray[index];
                    finalgrades +=
                        (index !== 0 ? ", " : "") +
                        (await this.callName(element, "grades"));
                }

                formData.set("grade", finalgrades);
                break;
            case "users":
                var roles = await this.callName(formData.get("roles"), "roles");
                formData.set("roles", roles);
                break;
            case "roles": //csv
                var permissions = formData.get("permissions");
                var permissionsArray = permissions.split(",").map((id) => id.trim());
                var finalpermissions = "";

                for (let index = 0; index < permissionsArray.length; index++) {
                    const element = permissionsArray[index];
                    finalpermissions +=
                        (index !== 0 ? ", " : "") +
                        (await this.callName(element, "permissions"));
                }

                formData.set("permissions", finalpermissions);
                break;
            default:
        }

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_edit"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        this.callContent();
        $(".bd-editModal-lg").modal("hide");
    }
    async disable(id, reason, name, table = this.table) {
        let formData = new FormData();
        formData.append("action", "disable");
        formData.append("reason", reason);
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        formData.append("name", name);

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_disable"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        if (table !== "events") this.callContent();
        else this.callEvents();
    }
    async rehabilitate(id, reason, name, table = this.table) {
        let formData = new FormData();
        formData.append("action", "rehabilitate");
        formData.append("reason", reason);
        formData.append("id", id);

        let response = await this.ajaxRequest(
            `../model/classes/${table}.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
            return;
        }

        formData.append("name", name);

        var log = await this.controlLog(formData);
        if (log["result"] !== "success") {
            console.error(log);
            return;
        }

        Swal.fire({
            title: "Éxito!",
            text: this.traductor["congratulation_rehabilitate"](),
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
        });

        if (table !== "events") this.callContent();
        else this.callEvents();
    }
    async controlLog(content, table = this.table) {
        var finalDate = new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        var action = content.get("action");
        let log = {};

        log["title"] = this.traductor["logTitle"](table, action);
        log["author"] = this.user["name"];
        log["date"] = finalDate;
        log["table"] = table;

        var entries = content.entries();
        for (let [key, value] of entries) {
            if (this.traductor?.[key]) log[this.traductor[key]()] = value;
        }

        let formData = new FormData();
        formData.append("action", "insertLog");
        formData.append("content", JSON.stringify(log));

        let response = await this.ajaxRequest(
            `../model/classes/controlLog.php`,
            formData
        ).catch((e) => ({
            error: e["error"] !== "Request failed" ? e : { error: "Request failed" },
        }));

        if (response["result"] !== "success") {
            console.error(response);
        }

        return response;
    }
    async ajaxRequest(url, formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: (response) => {
                    resolve(response);
                },
                error: async (jqXHR, textStatus, errorThrown) => {
                    await reject({
                        error: "Petición Fallida",
                        errorType: "Client Error",
                        errorCode: "404",
                        errorDetails: `Text Status: ${textStatus} \n errorThrown: ${errorThrown} \n jqXHR ${jqXHR}`,
                        suggestion: "Verifica tu conexión a internet.",
                        logout: true,
                    });
                },
            });
        });
    }
    async cleanup(table = this.table) {
        $(document).off("click", "a.showEditModal");
        $(document).off("click", "a.showDisableAlert");
        $(document).off("click", "a.showRehabilitateAlert");
        $(document).off("click", "a.status");
        $(document).off("submit", "form.add");
        $(document).off("submit", "form.edit");

        if (table === "users") {
            $(document).off("click", "a.showUserProfile");
            $(document).off("change", "input#addGenerateImageCheck");
            $(document).off("change", "input#editGenerateImageCheck");
            $(document).off("change", "input#passCheck");
        }

        if (table === "events") {
            $("#add-dataTable tbody").off("click", ".deleteAddedComplements");
            $("#add-dataTable tbody").off("click", ".editAddedComplements");
            $("#add-dataTable tbody").off("click", ".deleteEdittedComplements");
            $("#add-dataTable tbody").off("click", ".editEdittedComplements");
            $(document).off("click", "a.showComplementsModal");
            $(document).off("click", "button.addComplement");
            $(document).off("click", "button.editComplement");
        }

        $(".bd-addModal-lg").off("hidden.bs.modal");
        $(".bd-editModal-lg").off("hidden.bs.modal");
    }
}

export default content;
