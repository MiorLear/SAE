import errorHandler from '../controller/errorHandler.js';
import sessionManager from '../controller/sessionManager.js';

class contentManager {
    constructor() {
        this.sessionManager = new sessionManager();

        this.errorHandler = new errorHandler();

        this.validateSession();

        this.currentContentInstance = null;

        this.elements = "events";

        this.redirection = {
            //Main Modules
            "events": {
                load: async () => {
                    await this.loadPage("modules/main/events.html").then(() => {
                        console.log("events is loaded");
                        $("a#events").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "grades": {
                load: async () => {
                    await this.loadPage("modules/main/grades.html").then(async () => {
                        // console.log("grades is loaded");
                        $("a#grades").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/modules/mainContent/content.js", "grades");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "levels": {
                load: async () => {
                    await this.loadPage("modules/main/levels.html").then(async () => {
                        // console.log("levels is loaded");
                        $("a#levels").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/modules/mainContent/content.js", "levels");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "mainPanel": {
                load: async () => {
                    await this.loadPage("modules/main/mainPanel.html").then(async () => {
                        console.log("main Panel is loaded");
                        $("a#mainPanel").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/plugins/dashBoard.js");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "roles": {
                load: async () => {
                    await this.loadPage("modules/main/roles.html").then(async () => {
                        // console.log("roles is loaded");
                        $("a#roles").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/modules/mainContent/content.js", "roles");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "students": {
                load: async () => {
                    await this.loadPage("modules/main/students.html").then(async () => {
                        // console.log("students is loaded");
                        $("a#students").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/modules/mainContent/content.js", "students");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "users": {
                load: async () => {
                    await this.loadPage("modules/main/users.html").then(async () => {
                        // console.log("users is loaded");
                        $("a#users").css("color", "#FFF");
                        await this.loadMain('main');
                        await this.initializeContent("../controller/modules/mainContent/content.js", "users");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            //Management Modules
            "checkCard": {
                load: async () => {
                    await this.loadPage("modules/management/checkCard.html").then(async () => {
                        console.log('checkCard is loaded');
                        $("a#checkCard").css("color", "#FFF");
                        await this.loadMain('main');
                        //Initialize Content
                        $("#overlay").css("display", "none");
                    });
                }
            },
            "checkStudent": {
                load: async () => {
                    await this.loadPage("modules/management/checkStudent.html").then(async () => {
                        console.log("checkStudent");
                        $("a#checkStudent").css("color", "#FFF");
                        $("#overlay").css("display", "none");
                    });
                }
            },
            //Analysis Modules
            "controlLog": {
                load: async () => {
                    await this.loadPage("modules/analysis/controlLog.html");
                    // console.log("users is loaded");
                    $("a#controlLog").css("color", "#FFF");
                    await this.loadMain('controlLog');
                    await this.initializeContent("../controller/modules/analysis/controlLog.js", "controlLog");
                    $("#overlay").css("display", "none");
                }
            },
            "statistics": {
                load: async () => {
                    await this.loadPage("modules/analysis/statistics.html");
                    $("a#statistics").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            //Payment Modules
            "payCard": {
                load: async () => {
                    await this.loadPage("modules/payment/payCard.html");
                    $("a#payCard").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            //Event Modules
            "eventPanel": {
                load: async () => {
                    await this.loadPage("modules/event/eventPanel.html");
                    $("a#eventPanel").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "initialize": {
                load: async () => {
                    await this.loadPage("modules/event/initialize.html");
                    $("a#initialize").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "extraCards": {
                load: async () => {
                    await this.loadPage("modules/event/extraCards.html");
                    $("a#extraCards").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "reasignCards": {
                load: async () => {
                    await this.loadPage("modules/event/reasignCards.html");
                    $("a#reasignCards").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "redeem": {
                load: async () => {
                    await this.loadPage("modules/event/redeem.html");
                    $("a#redeem").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "closure": {
                load: async () => {
                    await this.loadPage("modules/event/closure.html");
                    $("a#closure").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
            "eventLog": {
                load: async () => {
                    await this.loadPage("modules/event/eventLog.html");
                    $("a#eventLog").css("color", "#FFF");
                    $("#overlay").css("display", "none");
                }
            },
        }

        this.loadElements(true);

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

    async loadElements(initialize = false, elements = this.elements) {
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

        if (initialize)
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

        await this.loadMain('all');
        await this.fillUserInfo();
    }

    async fillUserInfo() {
        var content = await this.validateSession()

        $(".topbarphoto")[0].src = '../assets/images/users/' + content["picture"];
    }

    async loadMain(func) {
        const { default: Mainapp } = await import('./plugins/app.js');
        const app = new Mainapp();

        switch (func) {
            case 'all':
                app.init();
                break;
            case 'main':
                app.initDatePicker();
                app.initSelect();
                app.initMaxLength();
                break;
            case 'controlLog':
                app.initDatePicker();
                break;
        }
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
                            'errorDetails': `HTML content not found. \nERROR THROWN BY JS: \n${error}`,
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
            "table" : module,
            "user" : user
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
        url.searchParams.set("content", e.target.id);
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