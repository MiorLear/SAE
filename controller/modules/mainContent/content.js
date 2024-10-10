import dataTables from '../../plugins/dataTables.js';

class content extends dataTables {
    constructor(params) {
        super("#datatable-buttons");
        this.mainDataTable = "#datatable-buttons";
        this.status = "enable";
        this.table = params["table"];
        this.user = params["user"];
        this.traductor = {
            "id": () => {
                return 'ID';
            },
            "table": () => {
                return 'Tabla';
            },
            "action": () => {
                return 'action';
            },
            "edit": () => {
                return 'ID';
            },
            "name": () => {
                return 'Nombre';
            },
            "surname": () => {
                return 'Apellido';
            },
            "carnet": () => {
                return 'Carnet';
            },
            "mail": () => {
                return 'Correo';
            },
            "roles": () => {
                return 'Rol';
            },
            "fileupload": () => {
                return 'Imagen';
            },
            "rol_id": () => {
                return 'Rol';
            },
            "picture": () => {
                return 'Imágenes';
            },
            "grades": () => {
                return 'Grados';
            },
            "grade": () => {
                return 'Grado';
            },
            "section": () => {
                return 'Sección';
            },
            "students_quantity": () => {
                return 'Cantidad de Estudiantes';
            },
            "permissions_id": () => {
                return 'Permisos';
            },
            "status": () => {
                return 'Estado';
            },
            "permissions": () => {
                return 'Permisos';
            },
            "notFilled": () => {
                switch (params["table"]) {
                    case "students":
                        return 'del Estudiante';
                    case "grades":
                        return 'para el Grado';
                    case "levels":
                        return 'para el Nivel';
                    case "roles":
                        return 'para el Rol';
                    case "users":
                        return 'para el Usuario';
                    default:
                        return '';
                }
            },
            "congratulation_add": () => {
                switch (params["table"]) {
                    case "students":
                        return 'Estudiante registrado.';
                    case "grades":
                        return 'Grado registrado.';
                    case "levels":
                        return 'Nivel registrado.';
                    case "roles":
                        return 'Rol registrado.';
                    case "users":
                        return 'Usuario registrado.';
                    default:
                        return '';
                }
            },
            "congratulation_edit": () => {
                switch (params["table"]) {
                    case "students":
                        return 'Estudiante editado.';
                    case "grades":
                        return 'Grado editado.';
                    case "levels":
                        return 'Nivel editado.';
                    case "roles":
                        return 'Rol editado.';
                    case "users":
                        return 'Usuario editado.';
                    default:
                        return '';
                }
            },
            "congratulation_disable": () => {
                switch (params["table"]) {
                    case "students":
                        return 'Estudiante inhabilitado.';
                    case "grades":
                        return 'Grado inhabilitado.';
                    case "levels":
                        return 'Nivel inhabilitado.';
                    case "roles":
                        return 'Rol inhabilitado.';
                    case "users":
                        return 'Usuario inhabilitado.';
                    default:
                        return '';
                }
            },
            "congratulation_rehabilitate": () => {
                switch (params["table"]) {
                    case "students":
                        return 'Estudiante rehabilitado.';
                    case "grades":
                        return 'Grado rehabilitado.';
                    case "levels":
                        return 'Nivel rehabilitado.';
                    case "roles":
                        return 'Rol rehabilitado.';
                    case "users":
                        return 'Usuario rehabilitado.';
                    default:
                        return '';
                }
            },
            "rusure": () => {
                switch (params["table"]) {
                    case "students":
                        return 'estudiante';
                    case "grades":
                        return 'grado';
                    case "levels":
                        return 'nivel';
                    case "roles":
                        return 'rol';
                    case "users":
                        return 'usuario';
                    default:
                        return '';
                }
            },
            "logTitle": (table, action) => {
                let response = {};
                switch (table) {
                    case "students":
                        response["table"] = 'Estudiante ';
                        break;
                    case "grades":
                        response["table"] = 'Grado ';
                        break;
                    case "levels":
                        response["table"] = 'Nivel ';
                        break;
                    case "roles":
                        response["table"] = 'Rol ';
                        break;
                    case "users":
                        response["table"] = 'Usuario ';
                        break;
                }

                switch (action) {
                    case "add":
                        response["action"] = 'Registrado.';
                        break;
                    case "edit":
                        response["action"] = 'Modificado.';
                        break;
                    case "disable":
                        response["action"] = 'Inhabilitado.';
                        break;
                    case "rehabilitate":
                        response["action"] = 'Rehabilitado.';
                        break;
                }

                return response;
            },
            "title": () => {
                return "Título";
            },
            "author": () => {
                return "Autor";
            }
        };
        this.setupListeners();
        this.callColumns();
    }

    setupListeners(table = this.table) {

        if (table === "users") {
            $(document).on('click', 'a.showUserProfile', (e) => {
                e.preventDefault();
                var id = e.currentTarget.id;

                if (!id)
                    console.error({
                        'error': `Error al el formulario.`,
                        'errorType': 'Client Error',
                        'errorDetails': 'Not given id in the function.',
                        'suggestion': 'Refrezque la página.',
                        'logout': false
                    });
                this.showUserModal(id);
            });

            $(document).on('change', 'input#addGenerateImageCheck', (e) => {
                if (e.currentTarget.checked)
                    $(".form-fileupload-add").css("display", "none");
                if (!e.currentTarget.checked)
                    $(".form-fileupload-add").css("display", "flex");
            });
            $(document).on('change', 'input#editGenerateImageCheck', (e) => {
                if (e.currentTarget.checked)
                    $(".form-fileupload-edit").css("display", "none");
                if (!e.currentTarget.checked)
                    $(".form-fileupload-edit").css("display", "flex");
            });
            $(document).on('change', 'input#passCheck', (e) => {
                if (e.currentTarget.checked)
                    $(".edit-passwords").css("display", "block");
                if (!e.currentTarget.checked)
                    $(".edit-passwords").css("display", "none");
            });
        }

        $(document).on('click', 'a.showEditModal', (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;

            if (!id)
                console.error({
                    'error': `Error al mostrar el formulario.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Not given id in the function.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                });
            this.showEditModal(id);
        });

        $(document).on('click', 'a.showDisableAlert', (e) => {
            e.preventDefault();

            var id = e.currentTarget.id;
            if (!id)
                console.error({
                    'error': `Error al mostrar la alerta.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Not given id in the function.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                });

            this.showDisableAlert(id);
        });

        $(document).on('click', 'a.showRehabilitateAlert', (e) => {
            e.preventDefault();

            var id = e.currentTarget.id;
            if (!id)
                console.error({
                    'error': `Error al mostrar la alerta.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Not given id in the function.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                });

            this.showRehabilitateAlert(id);
        });

        $(document).on('click', 'a.status', (e) => {
            e.preventDefault();
            var id = e.currentTarget.id;
            this.status = id;

            $("a.status").removeClass("active");
            $(e.currentTarget).addClass("active");

            this.callContent();
        });

        $(document).on('submit', 'form.add', (e) => {
            e.preventDefault();

            let notFilledInputs = [];
            let notMinLengthInputs = [];
            let minorThanZeroInputs = [];
            let notSameRetype = [];
            let notNumberInput = [];
            let invalidMail = [];
            let invalidPass = [];
            let validInputs = {};

            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2,})(?=.*[\W_]).{8,20}$/;
            const mailRegex = /^[a-zA-Z0-9._%+-]+@santacecilia\.edu\.sv$/;
            const textRegex = /^[^0-9]*$/;

            $(e.currentTarget).find('input, select').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");

                if (!$(formElement).attr("id")) return;

                if ($(formElement).val() == "" && $(formElement).attr("id") !== "fileupload" && $(formElement).attr("id") !== "pass" && $(formElement).attr("id") !== "retype")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "fileupload" && !e.currentTarget["addGenerateImageCheck"].checked && $(formElement).val() === "")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "fileupload" && e.currentTarget["addGenerateImageCheck"].checked)
                    return;
                else if ($(formElement).attr("id") === "pass" && !e?.currentTarget?.["passCheck"]?.checked && $(formElement).val() === "")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "pass" && e.currentTarget["pass"].checked)
                    return;
                else if ($(formElement).attr("id") === "retype" && !e?.currentTarget?.["passCheck"]?.checked && $(formElement).val() === "")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "retype" && e.currentTarget["pass"].checked)
                    return;
                else if ($(formElement).attr("id") === "fileupload")
                    validInputs[$(formElement).attr('id')] = formElement.files[0];
                else if ($(formElement).attr("id") === "addGenerateImageCheck" || $(formElement).attr("id") === "passCheck")
                    validInputs[$(formElement).attr('id')] = formElement.checked;
                else if (
                    $(formElement).attr("id") === "pass" &&
                    $(e.currentTarget).find('#retype').val() !== $(formElement).val()
                )
                    notSameRetype.push(formElement);
                else if (
                    $(formElement).attr("id") === "retype" &&
                    $(e.currentTarget).find('#pass').val() !== $(formElement).val()
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
                        } ${this.traductor["notFilled"]()}.`);
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
            });

            minorThanZeroInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .text(`Por favor, ingrese una cantidad mayor a cero.`);
            });

            notSameRetype.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`Las contraseñas no coinciden, porfavor ingreselas nuevamente.`);
            });

            notNumberInput.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`El campo no permite números, porfavor ingreselo nuevamente.`);
            });

            invalidMail.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`El correo ingresado no es válido, porfavor ingreselo nuevamente.`);
            });

            invalidPass.forEach(input => {
                const value = $(input).val();
                const charLength = /^.{8,20}$/;
                const minNumber = /.*\d.*\d/;
                const specialChar = /.*[!@#$%^&*'(),.?":{}|<>]/;
                const minusChar = /[a-z]/;
                const mayusChar = /[A-Z]/;

                var previous = false;

                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                let errorMessage = '';

                if (!charLength.test(value)) {
                    errorMessage += ' 8 caracteres como mínimo';

                    if (minNumber.test(value) && specialChar.test(value) && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += '.';
                    else
                        errorMessage += '. Entre ellos:';
                }
                if (!minNumber.test(value)) {
                    if (specialChar.test(value) && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += ' dos números.';
                    else
                        errorMessage += ' dos números';
                    previous = true;
                }
                if (!specialChar.test(value)) {
                    if (previous && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += ' y un carácter especial.';
                    else if (previous && !minNumber.test(value))
                        errorMessage += ', un carácter especial';
                    else if (!previous)
                        errorMessage += ' un carácter especial';
                    previous = true;
                }
                if (!minusChar.test(value)) {
                    if (!specialChar.test(value) && mayusChar.test(value) || !minNumber.test(value) && mayusChar.test(value))
                        errorMessage += ' y una letra minúscula.';
                    else if (!minNumber.test(value) || !specialChar.test(value) || !minNumber.test(value) && !specialChar.test(value))
                        errorMessage += ', una letra minúscula';
                    else if (!previous)
                        errorMessage += ' una letra minúscula';
                    previous = true;
                }
                if (!mayusChar.test(value)) {
                    if (minusChar.test(value) && minNumber.test(value))
                        errorMessage += ' una letra mayúscula.';
                    else
                        errorMessage += ' y una letra mayúscula.';
                }

                if (errorMessage !== '') {
                    $(`.form-control-${$(input).attr('id')}-feedback`)
                        .text('La contraseña debe poseer' + errorMessage);
                }
            });

            if (!notFilledInputs.length && !notMinLengthInputs.length && !minorThanZeroInputs.length && !notSameRetype.length && !invalidPass.length && !invalidMail.length && !invalidMail.length) {
                if (e?.currentTarget?.["addGenerateImageCheck"]) e.currentTarget["addGenerateImageCheck"].checked = false;
                this.add(validInputs);
            }
        });

        $(document).on('submit', 'form.edit', (e) => {
            e.preventDefault();

            let notFilledInputs = [];
            let notMinLengthInputs = [];
            let minorThanZeroInputs = [];
            let notSameRetype = [];
            let notNumberInput = [];
            let invalidMail = [];
            let invalidPass = [];
            let validInputs = {};

            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2,})(?=.*[\W_]).{8,20}$/;
            const mailRegex = /^[a-zA-Z0-9._%+-]+@santacecilia\.edu\.sv$/;
            const textRegex = /^[^0-9]*$/;

            $(e.currentTarget).find('input, select, button').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");

                if (!$(formElement).attr("id")) return;

                if ($(formElement).val() == "" && $(formElement).attr("id") !== "fileupload" && $(formElement).attr("id") !== "pass" && $(formElement).attr("id") !== "retype")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "fileupload" && !e.currentTarget["editGenerateImageCheck"].checked && $(formElement).val() === "" && $("#changeImage").val() == "Change")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "fileupload" && e.currentTarget["editGenerateImageCheck"].checked)
                    return;
                else if ($(formElement).attr("id") === "pass" && e?.currentTarget?.["passCheck"]?.checked && $(formElement).val() === "")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "pass" && !e.currentTarget["passCheck"].checked)
                    return;
                else if ($(formElement).attr("id") === "retype" && e?.currentTarget?.["passCheck"]?.checked && $(formElement).val() === "")
                    notFilledInputs.push(formElement);
                else if ($(formElement).attr("id") === "retype" && !e.currentTarget["passCheck"].checked)
                    return;
                else if ($(formElement).attr("id") === "fileupload" && $("#changeImage").val() == "Change")
                    validInputs[$(formElement).attr('id')] = formElement.files[0];
                else if ($(formElement).attr("id") === "fileupload")
                    validInputs[$(formElement).attr('id')] = $("#changeImage").val();
                else if ($(formElement).attr("id") === "editGenerateImageCheck" || $(formElement).attr("id") === "passCheck")
                    validInputs[$(formElement).attr('id')] = formElement.checked;
                else if (
                    $(formElement).attr("id") === "pass" &&
                    $(e.currentTarget).find('#retype').val() !== $(formElement).val()
                )
                    notSameRetype.push(formElement);
                else if (
                    $(formElement).attr("id") === "retype" &&
                    $(e.currentTarget).find('#pass').val() !== $(formElement).val()
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
                        } ${this.traductor["notFilled"]()}.`);
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
            });

            minorThanZeroInputs.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .text(`Por favor, ingrese una cantidad mayor a cero.`);
            });

            notSameRetype.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`Las contraseñas no coinciden, porfavor ingreselas nuevamente.`);
            });

            notNumberInput.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`El campo no permite números, porfavor ingreselo nuevamente.`);
            });

            invalidMail.forEach(input => {
                $(`.form-control-${$(input)
                    .attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .text(`El correo ingresado no es válido, porfavor ingreselo nuevamente.`);
            });

            invalidPass.forEach(input => {
                const value = $(input).val();
                const charLength = /^.{8,20}$/;
                const minNumber = /.*\d.*\d/;
                const specialChar = /.*[!@#$%^&*'(),.?":{}|<>]/;
                const minusChar = /[a-z]/;
                const mayusChar = /[A-Z]/;

                var previous = false;

                $(`.form-control-${$(input).attr('id')}-feedback`)
                    .css("display", "block");
                $(`.form-${$(input).attr('id')}`)
                    .addClass('has-warning');
                $(`.form-control-${$(input).attr('id')}-feedback`)
                let errorMessage = '';

                if (!charLength.test(value)) {
                    errorMessage += ' 8 caracteres como mínimo';

                    if (minNumber.test(value) && specialChar.test(value) && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += '.';
                    else
                        errorMessage += '. Entre ellos:';
                }
                if (!minNumber.test(value)) {
                    if (specialChar.test(value) && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += ' dos números.';
                    else
                        errorMessage += ' dos números';
                    previous = true;
                }
                if (!specialChar.test(value)) {
                    if (previous && minusChar.test(value) && mayusChar.test(value))
                        errorMessage += ' y un carácter especial.';
                    else if (previous && !minNumber.test(value))
                        errorMessage += ', un carácter especial';
                    else if (!previous)
                        errorMessage += ' un carácter especial';
                    previous = true;
                }
                if (!minusChar.test(value)) {
                    if (!specialChar.test(value) && mayusChar.test(value) || !minNumber.test(value) && mayusChar.test(value))
                        errorMessage += ' y una letra minúscula.';
                    else if (!minNumber.test(value) || !specialChar.test(value) || !minNumber.test(value) && !specialChar.test(value))
                        errorMessage += ', una letra minúscula';
                    else if (!previous)
                        errorMessage += ' una letra minúscula';
                    previous = true;
                }
                if (!mayusChar.test(value)) {
                    if (minusChar.test(value) && minNumber.test(value))
                        errorMessage += ' una letra mayúscula.';
                    else
                        errorMessage += ' y una letra mayúscula.';
                }

                if (errorMessage !== '') {
                    $(`.form-control-${$(input).attr('id')}-feedback`)
                        .text('La contraseña debe poseer' + errorMessage);
                }

            });

            if (!notFilledInputs.length && !notMinLengthInputs.length && !minorThanZeroInputs.length && !notSameRetype.length && !invalidPass.length && !invalidMail.length && !invalidMail.length) {
                if (e?.currentTarget?.["passCheck"]) e.currentTarget["passCheck"].checked = false;
                if (e?.currentTarget?.["editGenerateImageCheck"]) e.currentTarget["editGenerateImageCheck"].checked = false;
                this.edit(validInputs);
            }
        });

        $('.bd-addModal-lg').on('hidden.bs.modal', function (e) {

            $("form.add").find('input, select').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");
            });
        });

        $('.bd-editModal-lg').on('hidden.bs.modal', function (e) {
            $("form.edit").find('input, select').each(function () {
                var formElement = this;

                $(`.form-${$(formElement).attr('id')}`).removeClass('has-warning');
                $(`.form-control-${$(formElement).attr('id')}-feedback`).css("display", "none");
            });
        });

    }

    async callColumns(mainTable = this.mainDataTable, table = this.table) {
        let formData = new FormData();
        formData.append("action", 'callColumns');

        let columns = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (columns['result'] !== 'success') {
            console.error(columns);
            return;
        }
        columns['content'].forEach(content => {
            $(`${mainTable} thead tr`).append(`<th>${this.traductor[content["column_name"]]()}</th>`);
        });

        if (table == "grades" || table == "levels")
            $(`${mainTable} thead tr`).append(`<th>Cantidad de Estudiantes</th>`);

        if (table == "roles")
            $(`${mainTable} thead tr`).append(`<th>Número de Usuarios con el Rol</th>`);

        $(`${mainTable} thead tr`).append(`<th>Opciones</th>`);

        await this.initWithButtons();
        this.callContent();
    }

    async callContent(status = this.status, mainTable = this.mainDataTable, table = this.table) {
        try {
            if (!status) {
                console.error({
                    'error': `Error al mostrar la alerta.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Not given status in the function.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                });
                return;
            }

            let formData = new FormData();
            formData.append("action", 'callColumns');
            formData.append("status", status);

            let columns = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (columns['result'] !== 'success') {
                console.error(columns);
                return;
            }

            formData.set("action", 'callContent');

            let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
                .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

            if (response['result'] !== 'success') {
                console.error(response);
                return;
            }

            if (!$.fn.DataTable.isDataTable(mainTable)) {
                console.error({
                    'error': `Error al cargar el contenido.`,
                    'errorType': 'Client Error',
                    'errorDetails': 'Datatable is not loaded.',
                    'suggestion': 'Refrezque la página.',
                    'logout': false
                }); return;
            }

            let dataTable = $(mainTable).DataTable();
            dataTable.clear().draw();

            response['content'].forEach(content => {
                let dataTableRow = [];

                columns['content'].forEach(column => {
                    dataTableRow.push
                        (
                            table == "users" && column['column_name'] == "name"
                                ?
                                `<a class="showUserProfile" id="${content['id']}">&nbsp;&nbsp;
                                    <img src="../assets/images/users/${content['picture']}" class="rounded" alt="Foto del Usuario ${content['name']}" height="20">
                                &nbsp;&nbsp;
                                    ${content['name']}
                                </a>`
                                :
                                content[column['column_name']]
                        );
                });

                if (table == "grades" || table == "levels")
                    dataTableRow.push(content['students_quantity']);

                if (table == "roles")
                    dataTableRow.push(content['students_quantity']);

                dataTableRow.push
                    (
                        content['status'] == 'Habilitado' ?
                            `<center>
                            <a class="lead text-warning showEditModal" title="Editar ${this.traductor["rusure"]()}" id="${content['id']}">
                                <i class="fas fa-edit"></i>
                            </a>
                            &nbsp;&nbsp;
                            <a class="lead text-secondary showDisableAlert" title="Deshabilitar ${this.traductor["rusure"]()}" id="${content['id']}">
                                <i class="fas fa-lock"></i>
                            </a>
                        </center>`
                            :
                            `<center>
                            <a class="lead text-info showRehabilitateAlert" title="Rehabilitar ${this.traductor["rusure"]()}" id="${content['id']}">
                                <i class="fas fa-lock-open"></i>
                            </a>
                        </center>`
                    );
                dataTable.row.add(dataTableRow);
            });

            dataTable.draw();

            switch (table) {
                case "students":
                    formData.set("action", 'callSelect');
                    await this.callSections(formData);
                    await this.callGrades(formData);
                    break;
                case "levels":
                    formData.set("action", 'callSelect');
                    this.callGrades(formData);
                    break;
                case "users":
                    formData.set("action", 'callSelect');
                    this.callRoles(formData);
                    break;
                case "roles":
                    formData.set("action", 'callSelect');
                    this.callPermissions(formData);
                    break;
            }
        } catch (error) {
            console.error({ 'error': error, 'errorType': 'notAlert' });
        }
    }

    async callRoles(formData) {
        let roles = await this.ajaxRequest('../model/classes/roles.php', formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (roles['result'] !== 'success') {
            console.error(roles);
            return;
        }

        var bsRoles;
        roles["content"].forEach(content => {
            bsRoles += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });
        $("select#roles").html(bsRoles);
        $("select#roles").selectpicker('refresh');
    }

    async callGrades(formData) {
        let grades = await this.ajaxRequest('../model/classes/grades.php', formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (grades['result'] !== 'success') {
            console.error(grades);
            return;
        }

        var bsGrades;
        grades["content"].forEach(content => {
            bsGrades += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });
        $("select#grade").html(bsGrades);
        $("select#grade").selectpicker('refresh');
    }

    async callSections(formData) {
        let sections = await this.ajaxRequest('../model/classes/sections.php', formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (sections['result'] !== 'success') {
            console.error(sections);
            return;
        }

        var bsSections;
        sections["content"].forEach(content => {
            bsSections += `<option data-tokens="${content["name"]}" value="${content["id"]}">${content["name"]}</option>`;
        });

        $("select#section").html(bsSections);
        $("select#section").selectpicker('refresh');
    }

    async callPermissions(formData) {
        let permissions = await this.ajaxRequest('../model/classes/permissions.php', formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (permissions['result'] !== 'success') {
            console.error(permissions);
            return;
        }

        var bsPermissions;
        permissions["content"].forEach(content => {
            bsPermissions += `<option data-tokens="${content["name"] + content["event_id"] != "" ? "del evento " + content["event_id"] + "." : ""}" value="${content["id"]}">${content["name"]}</option>`;
        });

        $("select#permissions").html(bsPermissions);
        $("select#permissions").selectpicker('refresh');
    }

    async callName(id, table = this.table) {
        let formData = new FormData();
        formData.append("action", 'callName');
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }
        return response['content']['name'];
    }

    async showUserModal(id) {
        let formData = new FormData();
        formData.append("action", 'callUserInfo');
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/classes/users.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        $(".userName").text(response["content"]["name"]);
        $(".userRol").text(response["content"]["rol"]);
        $(".userMail").text(response["content"]["mail"]);
        $(".showUserPicture")[0].src = '../assets/images/users/' + response["content"]["picture"];

        $(".bd-showModal-lg").modal('show');
    }

    async showEditModal(id, table = this.table) {

        let formData = new FormData();
        formData.append("action", 'callInfo');
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        $("form.edit").find('input, select, button').each(element => {
            var formElement = $("form.edit")[0][element];
            if (!$(formElement).attr("id"))
                return;

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
                case "carnet":
                    $(formElement).val(response["content"]["carnet"]);
                    break;
                case "mail":
                    $(formElement).val(response["content"]["mail"]);
                    break;
                case "grade":
                    if (Array.isArray(response["content"]["grade"])) {
                        $(formElement).selectpicker("val", response["content"]["grade"]);
                    } else
                        $(formElement).val(response["content"]["grade"]);
                    $(formElement).selectpicker("refresh");
                    break;
                case "permissions":
                    $(formElement).selectpicker("val", response["content"]["permissions_id"]);
                    $(formElement).selectpicker("refresh");
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
                    formElement.nextElementSibling.innerHTML = response["content"]["picture"];
                    $(".userPicture")[0].src = '../assets/images/users/' + response["content"]["picture"];
                    break;
            }
        });

        $(".bd-editModal-lg").modal('show');
    }

    async showDisableAlert(id) {
        var name = await this.callName(id);
        if (!name)
            return;

        swal.fire(
            {
                title: `Deshabilitar ${this.traductor["rusure"]()}`,
                html: `¿Estás seguro que deseas deshabilitar este ${this.traductor["rusure"]()} <span class="badge badge-secondary" style="font-size: 1rem;">${name}</span>?`,
                icon: 'warning',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-secondary btn-lg',
                    cancelButton: 'btn btn-outline-secondary btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Deshabilitar',
                cancelButtonText: 'Cancelar'
            }
        ).then(async (result) => {
            if (!result.isConfirmed)
                return;

            this.disable(id, name);
        });
    }

    async showRehabilitateAlert(id) {
        var name = await this.callName(id);
        if (!name)
            return;

        swal.fire(
            {
                title: `Rehabilitar ${this.traductor["rusure"]()}`,
                html: `¿Estás seguro que deseas rehabilitar este ${this.traductor["rusure"]()} <span class="badge badge-info" style="font-size: 1rem;">${name}</span>?`,
                icon: 'info',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-info btn-lg',
                    cancelButton: 'btn btn-outline-info btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Rehabilitar',
                cancelButtonText: 'Cancelar'
            }
        ).then(async (result) => {
            if (!result.isConfirmed)
                return;

            this.rehabilitate(id, name);

        });
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

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
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
                var gradesArray = grade.split(',').map(id => id.trim());
                var finalgrades = "";

                for (let index = 0; index < gradesArray.length; index++) {
                    const element = gradesArray[index];
                    finalgrades +=( index !== 0 ? ', ' : '') + await this.callName(element, "grades");
                }
                
                formData.set("grade", finalgrades);
                break;
            case "users":
                var roles = await this.callName(formData.get("roles"), "roles");
                formData.set("roles", roles);
                break;
            case "roles": //csv

                var permissions = formData.get("permissions");
                var permissionsArray = permissions.split(',').map(id => id.trim());
                var finalpermissions = "";

                for (let index = 0; index < permissionsArray.length; index++) {
                    const element = permissionsArray[index];
                    finalpermissions +=( index !== 0 ? ', ' : '') + await this.callName(element, "permissions");
                }

                formData.set("permissions", finalpermissions);
                break;
            default: ;
        }

        formData.append("id", response["id"]);

        var log = await this.controlLog(formData);
        if (log['result'] !== 'success') {
            console.error(log);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: this.traductor["congratulation_add"](),
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            }
        );

        this.callContent();
        $(".bd-addModal-lg").modal("hide");
    }

    async edit(content, table = this.table) {
        let formData = new FormData();
        formData.append("action", 'edit');

        for (const key in content) {
            if (Object.prototype.hasOwnProperty.call(content, key)) {
                const element = content[key];
                formData.append(key, element);
                // console.log(key + " => " + content[key]);
            }
        }

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
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
                var gradesArray = grade.split(',').map(id => id.trim());
                var finalgrades = "";

                for (let index = 0; index < gradesArray.length; index++) {
                    const element = gradesArray[index];
                    finalgrades +=( index !== 0 ? ', ' : '') + await this.callName(element, "grades");
                }
                
                formData.set("grade", finalgrades);
                break;
            case "users":
                var roles = await this.callName(formData.get("roles"), "roles");
                formData.set("roles", roles);
                break;
            case "roles": //csv

                var permissions = formData.get("permissions");
                var permissionsArray = permissions.split(',').map(id => id.trim());
                var finalpermissions = "";

                for (let index = 0; index < permissionsArray.length; index++) {
                    const element = permissionsArray[index];
                    finalpermissions +=( index !== 0 ? ', ' : '') + await this.callName(element, "permissions");
                }

                formData.set("permissions", finalpermissions);
                break;
            default: ;
        }

        var log = await this.controlLog(formData);
        if (log['result'] !== 'success') {
            console.error(log);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: this.traductor["congratulation_edit"](),
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            }
        );

        this.callContent();
        $(".bd-editModal-lg").modal("hide");
    }

    async disable(id, name, table = this.table) {
        let formData = new FormData();
        formData.append("action", 'disable');
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        formData.append("name", name);

        var log = await this.controlLog(formData);
        if (log['result'] !== 'success') {
            console.error(log);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: this.traductor["congratulation_disable"](),
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            }
        );

        this.callContent();
    }

    async rehabilitate(id, name, table = this.table) {
        let formData = new FormData();
        formData.append("action", 'rehabilitate');
        formData.append("id", id);

        let response = await this.ajaxRequest(`../model/classes/${table}.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
            return;
        }

        formData.append("name", name);

        var log = await this.controlLog(formData);
        if (log['result'] !== 'success') {
            console.error(log);
            return;
        }

        Swal.fire(
            {
                title: "Éxito!",
                text: this.traductor["congratulation_rehabilitate"](),
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            }
        );

        this.callContent();
    }

    async controlLog(content, table = this.table) {
        var finalDate = (() => `${String(new Date().getDate()).padStart(2, '0')}/${["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][new Date().getMonth()]}/${String(new Date().getFullYear()).slice(-2)}`)();

        var action = content.get("action");
        let log = {};

        log["title"] = this.traductor["logTitle"](table, action);
        log["author"] = this.user["name"];
        log["date"] = finalDate;
        log["table"] = table;

        var entries = content.entries();
        for (let [key, value] of entries) {
            if (this.traductor?.[key])
                log[this.traductor[key]()] = value;
        }

        let formData = new FormData();
        formData.append("action", "insertLog");
        formData.append("content", JSON.stringify(log));


        let response = await this.ajaxRequest(`../model/classes/controlLog.php`, formData)
            .catch(e => ({ 'error': e['error'] !== 'Request failed' ? e : { 'error': 'Request failed' } }));

        if (response['result'] !== 'success') {
            console.error(response);
        }

        return response;
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

    async cleanup(table = this.table) {
        $(document).off('click', 'a.showEditModal');
        $(document).off('click', 'a.showDisableAlert');
        $(document).off('click', 'a.showRehabilitateAlert');
        $(document).off('click', 'a.status');
        $(document).off('submit', 'form.add');
        $(document).off('submit', 'form.edit');

        if (table === "users") {
            $(document).off('click', 'a.showUserProfile');
            $(document).off('change', 'input#addGenerateImageCheck');
            $(document).off('change', 'input#editGenerateImageCheck');
            $(document).off('change', 'input#passCheck');
        }

        $('.bd-addModal-lg').off('hidden.bs.modal');
        $('.bd-editModal-lg').off('hidden.bs.modal');
    }
}

export default content;