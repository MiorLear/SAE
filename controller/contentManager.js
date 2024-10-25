import errorHandler from '../controller/errorHandler.js';
import sessionManager from '../controller/sessionManager.js';

class contentManager {
    constructor() {
        this.sessionManager = new sessionManager();

        this.errorHandler = new errorHandler();

        this.validateSession();

        this.currentContentInstance = null;

        this.elements = "main";

        this.redirection = {
            //Main Modules
            "events": {
                load: async () => {
                    await this.loadPage("modules/main/events.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "events");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('events');

                        $("a#events").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "grades": {
                load: async () => {
                    await this.loadPage("modules/main/grades.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "grades");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('grades');

                        $("a#grades").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "levels": {
                load: async () => {

                    await this.loadPage("modules/main/levels.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "levels");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('levels');

                        $("a#levels").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "mainPanel": {
                load: async () => {
                    console.log("Pending to load dinamic data");
                    await this.loadPage("modules/main/mainPanel.html").then(async () => {
                        await this.initializeContent("../controller/plugins/dashBoard.js", "mainPanel");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('mainPanel');

                        $("a#mainPanel").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "roles": {
                load: async () => {
                    await this.loadPage("modules/main/roles.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "roles");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('roles');

                        $("a#roles").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "students": {
                load: async () => {
                    await this.loadPage("modules/main/students.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "students");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('students');

                        $("a#students").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "users": {
                load: async () => {
                    await this.loadPage("modules/main/users.html").then(async () => {
                        await this.initializeContent("../controller/modules/mainContent/content.js", "users");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('users');

                        $("a#users").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            //Analysis Modules
            "checkCard": {
                load: async () => {
                    await this.loadPage("modules/management/checkCard.html").then(async () => {
                        await this.initializeContent("../controller/modules/analysis/checkCard.js", "checkCard");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('checkCard');

                        $("a#checkCard").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "checkStudent": {
                load: async () => {
                    await this.loadPage("modules/management/checkStudent.html").then(async () => {
                        await this.initializeContent("../controller/modules/analysis/checkStudent.js", "checkStudent");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('checkStudent');

                        $("a#checkStudent").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "controlLog": {
                load: async () => {
                    await this.loadPage("modules/analysis/controlLog.html").then(async () => {
                        await this.initializeContent("../controller/modules/analysis/controlLog.js", "controlLog");
                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('controlLog');
                        
                        $("a#controlLog").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "analysis": {
                load: async () => {
                    await this.loadPage("modules/analysis/analysis.html").then(async () => {
                        await this.initializeContent("../controller/modules/analysis/analysis.js", "analysis");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('analysis');

                        $("a#analysis").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            //Payment Modules
            "payCard": {
                load: async () => {
                    await this.loadPage("modules/payment/payCard.html").then(async () => {
                        await this.initializeContent("../controller/modules/payment/payCard.js", "payCard");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('payCard');

                        $("a#payCard").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "payStudent": {
                load: async () => {
                    await this.loadPage("modules/payment/payStudent.html").then(async () => {
                        await this.initializeContent("../controller/modules/payment/payStudent.js", "payStudent");

                        if (this.elements !== "main")
                            await this.loadElements('main');
                        else
                            await this.loadPlugins('payStudent');

                        $("a#payStudent").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            //Event Modules
            "eventPanel": {
                load: async (e) => {
                    await this.loadPage("modules/event/eventPanel.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/eventPanel.js", "eventPanel");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('eventPanel');

                        $("a#eventPanel").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "checkEventCard": {
                load: async () => {
                    await this.loadPage("modules/event/checkEventCard.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/checkEventCard.js", "checkEventCard");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('checkEventCard');


                        $("a#checkEventCard").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "initialize": {
                load: async () => {
                    await this.loadPage("modules/event/initialize.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/initialize.js", "initialize");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('initialize');

                        $("a#initialize").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "cardsPresale": {
                load: async () => {
                    await this.loadPage("modules/event/cardsPresale.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/presale.js", "cardsPresale");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins("presale");

                        $("a#cardsPresale").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "salesCase": {
                load: async () => {
                    await this.loadPage("modules/event/salesCase.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/salesCase.js", "salesCase");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins("salesCase");

                        $("a#salesCase").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "cardsDelivery": {
                load: async () => {
                    await this.loadPage("modules/event/cardsDelivery.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/cardsDelivery.js", "cardsDelivery");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins("cardsDelivery");

                        $("a#cardsDelivery").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "cardsReturn": {
                load: async () => {
                    await this.loadPage("modules/event/cardsReturn.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/cardsReturn.js", "cardsReturn");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins("cardsReturn");

                        $("a#cardsReturn").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "redeem": {
                load: async () => {
                    await this.loadPage("modules/event/redeem.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/redeem.js", "redeem");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins("redeem");

                        $("a#redeem").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "start": {
                load: async () => {
                    await this.loadPage("modules/event/start.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/start.js", "start");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('start');

                        $("a#start").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "closure": {
                load: async () => {
                    await this.loadPage("modules/event/closure.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/closure.js", "closure");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('closure');

                        $("a#closure").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "eventAnalysis": {
                load: async () => {
                    await this.loadPage("modules/event/eventAnalysis.html").then(async () => {
                        await this.initializeContent("../controller/modules/events/eventAnalysis.js", "eventAnalysis");

                        if (this.elements !== "events")
                            await this.loadElements('events');
                        else
                            await this.loadPlugins('eventAnalysis');

                        $("a#eventAnalysis").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
        }

        this.loadElements(this.elements, true);

        $(document).on('click', 'a.content', (event) => this.redirectionHandler(event));
        $(document).on('click', 'a.logout', async (e) => this.logout(e));

        $(window).on('popstate', async () => {
            if (!this.redirection?.[this.content()]?.load()) console.error(
                {
                    'error': "Error al cargar el sitio.",
                    'errorType': 'Client Error',
                    'errorCode': '404',
                    'errorDetails': `Selected content (${this.content()}) doesn't exist.`,
                    'suggestion': 'Vuelve a ingresar a la plataforma.',
                    'logout': true
                }
            );
            await this.loadElements();
            $(`a#${this.content()}`).css("color", "#FFF");
        });

        $("#overlay").css("display", "block");
    }

    page() {
        var filename = document.URL.split('/').pop();
        return filename.split('.').slice(0, -1).join('.');
    }

    content() {
        var url = window.location.search;
        const param = new URLSearchParams(url);
        return param.get('content');
    }
    async logout(e) {
        e.preventDefault();

        swal.fire(
            {
                title: `Cerrar Sesión.`,
                html: `¿Estás seguro que deseas cerrar sesión?`,
                icon: 'info',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-info btn-lg',
                    cancelButton: 'btn btn-outline-info btn-lg ml-4'
                },
                buttonsStyling: false,
                confirmButtonText: 'Cerrar Sesión',
                cancelButtonText: 'Cancelar'
            }
        ).then(async (result) => {
            if (!result.isConfirmed)
                return;

            var response = await this.sessionManager.deleteSession('../model/modules/sessionManager.php');
            if (response?.["result"] != 'success')
                console.error(response);

            window.location.href = './modules/auth/login.html';

        });

    }

    async validateSession() {
        var response = await this.sessionManager.checkSession('../model/modules/sessionManager.php')
        if (response?.["result"] != 'success')
            console.error(response);

        if (response["status"] != 'validSession')
            window.location.href = './modules/auth/login.html';

        return response["content"];
    }

    async loadElements(elements = this.elements, redirect = false) {
        this.elements = elements;

        $(".side-menu").empty();
        $(".topbar").empty();
        switch (elements) {
            case 'main':
                await fetch('other/sidebarMain.html')
                    .then(response => response.text())
                    .then(async data => {
                        await $(".side-menu").append(data);
                    })
                    .catch(error => {
                        console.error(
                            {
                                'error': `No se encuentra el elemento seleccionado.`,
                                'errorType': 'Client Error',
                                'errorCode': '404',
                                'errorDetails': `Selected element (sidebarMain.html) not found. \nERROR THROWN BY JS: \n${error}`,
                                'suggestion': 'Vuelva a ingresar a la plataforma.',
                                'logout': true
                            }
                        );
                    });
                break;
            case 'events':
                await fetch('other/sidebarEvent.html')
                    .then(response => response.text())
                    .then(async data => {
                        await $(".side-menu").append(data);
                    })
                    .catch(error => {
                        console.error(
                            {
                                'error': `No se encuentra el elemento seleccionado.`,
                                'errorType': 'Client Error',
                                'errorCode': '404',
                                'errorDetails': `Selected element (sidebarEvent.html) not found. \nERROR THROWN BY JS: \n${error}`,
                                'suggestion': 'Vuelva a ingresar a la plataforma.',
                                'logout': true
                            }
                        );
                    });
                break;
        }
        await fetch('other/topbar.html')
            .then(response => response.text())
            .then(async data => {
                await $(".topbar").append(data);
            })
            .catch(error => {
                console.error(
                    {
                        'error': `No se encuentra el elemento seleccionado.`,
                        'errorType': 'Client Error',
                        'errorCode': '404',
                        'errorDetails': `Selected element (topbar.html) not found. \nERROR THROWN BY JS: \n${error}`,
                        'suggestion': 'Vuelva a ingresar a la plataforma.',
                        'logout': true
                    }
                );
            });

        if (redirect)
            if (!this.redirection?.[this.content()]?.load()) console.error(
                {
                    'error': "Error al cargar el sitio.",
                    'errorType': 'Client Error',
                    'errorCode': '404',
                    'errorDetails': `Selected content (${this.content()}) doesn't exist.`,
                    'suggestion': 'Vuelve a ingresar a la plataforma.',
                    'logout': true
                }
            );

        await this.loadPlugins('all');
    }

    async fillUserInfo() {
        var content = await this.validateSession()

        if ($(".topbarphoto").length > 0)
            $(".topbarphoto")[0].src = '../assets/images/users/' + content["picture"];
    }

    async loadPlugins(func) {
        const { default: Mainapp } = await import('./plugins/app.js');
        const app = new Mainapp();

        switch (func) {
            case 'all':
                app.init();
                break;
            case 'initialize':
                app.initTouchSpin();
                app.initDatePicker();
                app.initMaxLength();
                break;
            case 'checkStudent':
                app.initDatePicker();
                break;
            case 'checkCard':
                app.initDatePicker();
                break;
            case 'checkEventCard':
                app.initDatePicker();
                break;
            case 'presale':
                app.initDatePicker();
                break;
            case "salesCase":
                app.initDatePicker();
                break;
            case 'start':
                app.initDatePicker();
                break;
            case 'payCard':
                app.initDatePicker();
                break;
            case 'payStudent':
                app.initDatePicker();
                break;
            case 'closure':
                app.initDatePicker();
                break;
            case "cardsDelivery":
                app.initDatePicker();
                break;
            case "redeem":
                app.initDatePicker();
                break;
            case "cardsReturn":
                app.initDatePicker();
                break;
            case "analysis":
                app.initDatePicker();
                break;
            case "eventAnalysis":
                app.initDatePicker();
                break;
            case 'events':
                app.initTouchSpin();
                app.initDatePicker();
                break;
            case 'eventPanel':
                app.initTouchSpin();
                app.initDatePicker();
                break;
            case 'students':
                app.initDatePicker();
                app.initMaxLength();
                app.initSelect();
                break;
            case 'levels':
                app.initDatePicker();
                app.initMaxLength();
                app.initSelect();
                break;
            case 'roles':
                app.initDatePicker();
                app.initMaxLength();
                app.initSelect();
                break;
            case 'events':
                app.initDatePicker();
                app.initMaxLength();
                app.initSelect();
                app.initTouchSpin()
                break;
            case 'users':
                app.initDatePicker();
                app.initMaxLength();
                app.initSelect();
                break;
            case 'mainPanel':
                app.initDatePicker();
                break;
            case 'grades':
                app.initDatePicker();
                app.initMaxLength();
                break;
            case 'controlLog':
                app.initDatePicker();
                break;
        }

        this.fillUserInfo();
    }

    async loadPage(content) {
        return fetch(content)
            .then(response => {
                var content = response.text();
                if (response['ok'])
                    return content;
                else
                    console.error(
                        {
                            'error': `No se encuentra el contenido.`,
                            'errorType': 'Client Error',
                            'errorCode': response['status'],
                            'errorDetails': `HTML content not found.`,
                            'suggestion': 'Vuelva a ingresar a la plataforma.',
                            'logout': true
                        }
                    );
            }
            )
            .then(data => {
                $(".content-page").empty().append(data);
            })
    }

    async initializeContent(source, module = this.content()) {
        var user = await this.validateSession();
        
        let params = {
            "table": module,
            "user": user
        }

        if (this.currentContentInstance && typeof this.currentContentInstance.cleanup === 'function') {
            this.currentContentInstance.cleanup();
        }

        const { default: content } = await import(source);
        this.currentContentInstance = new content(params);
    }

    async redirectionHandler(e) {
        // console.log(e.target.id);

        $(`a#${this.content()}`).css("color", "#9CA8B3");

        let url = new URL(window.location.href);

        if (e.target.id === "mainPanel")
            url.searchParams.delete("event");

        url.searchParams.set("content", e.target.id);
        if (e.target.name)
            url.searchParams.set("event", e.target.name);

        window.history.pushState({}, '', url);

        // $(`a#${e.target.id}`).css("color", "#FFF");
        $("#overlay").css("display", "block");

        if (!this.redirection?.[e.target.id]?.load()) console.error(
            {
                'error': "Error al cargar el sitio.",
                'errorType': 'Client Error',
                'errorCode': '404',
                'errorDetails': `Selected content (${this.content()}) doesn't exist.`,
                'suggestion': 'Vuelve a ingresar a la plataforma.',
                'logout': true
            }
        );
    }
}

new contentManager();