import errorHandler from '../controller/errorHandler.js';
import sessionManager from '../controller/sessionManager.js';

class contentManager {
    constructor() {
        this.sessionManager = new sessionManager();
        this.errorHandler = new errorHandler();

        this.currentContentInstance;
        this.user;
        this.elements;
        this.content;
        this.page;

        this.validateSession();

        $(document).on('click', 'a.content', (event) => this.redirectionHandler(event));
        $(document).on('click', 'a.logout', async (e) => this.logout(e));
        $(window).on('popstate', async () => this.validateSession());
    }

    getPage() {
        // console.log("getPage");

        var filename = document.URL.split('/').pop();
        return filename.split('.').slice(0, -1).join('.');
    }

    getContent() {
        // console.log("getContent");

        var url = window.location.search;
        const param = new URLSearchParams(url);
        return param.get('content');
    }

    async loadContent(content = this.content, elements = this.elements) {
        // console.log("loadContent");
        $("#overlay").css("display", "block");

        if (!this.unAuth(content)) {
            console.error(
                {
                    'error': "Contenido Restringido.",
                    'errorType': 'User Error',
                    'suggestion': 'No estás autorizado para entrar a este contenido. Comuniquese con el administrador del sitio para más información',
                });
            window.history.back();
            throw new Error('Execution stopped!');
        }

        var reloadElements;
        var elementToCall;
        var pageToLoad;
        var contentToInitialize;

        const pages = {
            //Main
            events: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            grades: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== "elementToCall";
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            levels: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            roles: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            students: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            users: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/mainContent/content.js";
                    return true;
                }
            },
            mainPanel: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = `../controller/modules/mainContent/${content}.js`;
                    return true;
                }
            },
            //Analysis Modules
            checkCard: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/management/${content}.html`;
                    contentToInitialize = `../controller/modules/analysis/${content}.js`;
                    return true;
                }
            },
            checkStudent: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/management/${content}.html`;
                    contentToInitialize = `../controller/modules/analysis/${content}.js`;
                    return true;
                }
            },
            controlLog: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/analysis/${content}.html`;
                    contentToInitialize = `../controller/modules/analysis/${content}.js`;
                    return true;
                }
            },
            analysis: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/analysis/${content}.html`;
                    contentToInitialize = `../controller/modules/analysis/${content}.js`;
                    return true;
                }
            },
            //Payment Modules
            payCard: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/payment/${content}.html`;
                    contentToInitialize = `../controller/modules/payment/${content}.js`;
                    return true;
                }
            },
            payStudent: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/payment/${content}.html`;
                    contentToInitialize = `../controller/modules/payment/${content}.js`;
                    return true;
                }
            },
            //Event Modules
            eventPanel: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            checkEventCard: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            initialize: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            cardsPresale: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            salesCase: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            cardsDelivery: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            cardsReturn: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            redeem: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            start: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            closure: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            eventAnalysis: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            }
        };

        if (!pages?.[content]?.preLoad()) console.error(
            {
                'error': "Error al cargar el sitio.",
                'errorType': 'Client Error',
                'errorCode': '404',
                'errorDetails': `Selected content (${content}) doesn't exist.`,
                'suggestion': 'Vuelve a ingresar a la plataforma.',
                'logout': true
            }
        );

        if (reloadElements)
            await this.loadElements(elementToCall);

        await this.loadPage(pageToLoad);
        await this.initializeContent(contentToInitialize, content);
        await this.loadPlugins(content);

        $(`a#${content}`).css("color", "#FFF");
        $("#overlay").css("display", "none");

        await this.validatePermissions();
    }

    async logout(e) {
        e.preventDefault();
        // console.log("logout");

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
        // console.log("validateSession");

        var response = await this.sessionManager.checkSession('../model/modules/sessionManager.php')
        if (response?.["result"] != 'success')
            console.error(response);

        if (response["status"] != 'validSession')
            window.location.href = './modules/auth/login.html';

        var user = response["content"];

        this.user = user;
        this.content = this.getContent();
        this.page = this.getPage();

        await this.loadContent();
    }

    unAuth(content = this.content) {
        // console.log("unAuth " + content);

        const permissions = this.user["permissions"];
        var resultado;

        switch (content) {
            case "events":
                resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Eventos' || permission.name === 'Listar Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "grades":
                resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Grados' || permission.name === 'Listar Grados');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "levels":
                resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Niveles' || permission.name === 'Listar Niveles');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "roles":
                resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Roles' || permission.name === 'Listar Roles');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "students":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Estudiantes' || permission.name === 'Listar Estudiantes');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "users":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Administrar Plataforma' || permission.name === 'Administrar Usuarios' || permission.name === 'Listar Usuarios');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "checkCard":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "checkStudent":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "controlLog":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "analysis":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "payCard":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "payStudent":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "payStudent":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "checkEventCard":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "initialize":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Inicializar Evento' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "cardsPresale":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Preventa de Tarjetas' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "salesCase":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Caja de Ventas' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "cardsDelivery":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Listado de Entrega de Tarjetas' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "cardsReturn":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Listado de Devolución de Tarjetas' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "redeem":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Canjeo' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;

                else
                    return false;

            case "start":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Iniciar Evento' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "closure":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Cerrar Evento' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            case "eventAnalysis":
                var resultado = Object.values(permissions).filter(permission => permission.name === 'Gestión y Análisis de Evento' || permission.name === 'Administrar Modulos de Eventos');

                if (resultado.length > 0)
                    return true;
                else
                    return false;
            default:
                // console.log("Excepción " + content);
                return true;
        }
    }

    async validatePermissions(user = this.user) {
        // console.log("validatePermissions " + user["name"]);

        const permissions = user["permissions"];

        $("#sidebar-menu").find('li').each(function () {
            var sideBarTab = this;

            if (!$(sideBarTab).attr("id")) return;

            if (permissions.some(permission =>
                permission.name === 'Administrar Plataforma'))
                if ($(sideBarTab).hasClass("manage-platform")) $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Gestión y Análisis'))
                if ($(sideBarTab).hasClass("management-analysis")) $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Estudiantes' ||
                permission.name === 'Administrar Estudiantes'))
                if ($(sideBarTab).attr("id") === "student") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Roles' ||
                permission.name === 'Administrar Roles'))
                if ($(sideBarTab).attr("id") === "roles") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Niveles' ||
                permission.name === 'Administrar Niveles'))
                if ($(sideBarTab).attr("id") === "levels") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Eventos' ||
                permission.name === 'Administrar Eventos'))
                if ($(sideBarTab).attr("id") === "events") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Usuarios' ||
                permission.name === 'Administrar Usuarios'))
                if ($(sideBarTab).attr("id") === "users") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Grados' ||
                permission.name === 'Administrar Grados'))
                if ($(sideBarTab).attr("id") === "grades") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Listar Grados' ||
                permission.name === 'Administrar Grados'))
                if ($(sideBarTab).attr("id") === "grades") $(sideBarTab).css("display", "block");

        });
    }

    async loadElements(elements = this.elements) {
        // console.log("loadElements " + elements);

        this.elements = elements;

        $(".side-menu").empty();
        $(".topbar").empty();

        if (elements === 'main')
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
                            'errorDetails': `Selected element (sidebarMain) not found. \nERROR THROWN BY JS: \n${error}`,
                            'suggestion': 'Vuelva a ingresar a la plataforma.',
                            'logout': true
                        }
                    );
                });
        else if (elements === 'events')
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
                            'errorDetails': `Selected element (sidebarEvent) not found. \nERROR THROWN BY JS: \n${error}`,
                            'suggestion': 'Vuelva a ingresar a la plataforma.',
                            'logout': true
                        }
                    );
                });

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

        await this.loadPlugins('elements');
    }

    async fillUserInfo() {
        // console.log("fillUserInfo");

        var content = this.user;

        if ($(".topbarphoto").length > 0)
            $(".topbarphoto")[0].src = '../assets/images/users/' + content["picture"];
    }

    async loadPlugins(plugin) {
        // console.log("loadPlugins " + plugin);

        const { default: Mainapp } = await import('./plugins/app.js');
        const app = new Mainapp();

        const plugins = {
            all: {
                load: async () => {
                    app.init();
                    await this.fillUserInfo();
                }
            },
            elements: {
                load: async () => {
                    app.initSlimscrollmenu();
                    app.initSlimscroll();
                    app.initMetisMenu();
                    app.initLeftMenuCollapse();
                    app.initEnlarge();
                    app.initActiveMenu();
                    app.initComponents();
                    app.initToggleSearch();
                    await this.fillUserInfo();
                }
            },
            initialize: {
                load: async () => {
                    app.initDatePicker();
                    app.initTouchSpin();
                    app.initMaxLength();
                }
            },
            checkStudent: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            checkCard: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            checkEventCard: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            cardsPresale: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            salesCase: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            start: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            payCard: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            payStudent: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            closure: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            cardsDelivery: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            redeem: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            cardsReturn: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            analysis: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            eventAnalysis: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            eventPanel: {
                load: async () => {
                    app.initDatePicker();
                    app.initTouchSpin();
                }
            },
            students: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                    app.initSelect();
                }
            },
            levels: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                    app.initSelect();
                }
            },
            roles: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                    app.initSelect();
                }
            },
            events: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                    app.initSelect();
                    app.initTouchSpin();
                }
            },
            users: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                    app.initSelect();
                }
            },
            grades: {
                load: async () => {
                    app.initDatePicker();
                    app.initMaxLength();
                }
            },
            mainPanel: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            controlLog: {
                load: async () => {
                    app.initDatePicker();
                }
            },
        };

        if (!plugins?.[plugin]?.load()) console.error(
            {
                'error': "Error al cargar el paquete de extensiones.",
                'errorType': 'Client Error',
                'errorCode': '404',
                'errorDetails': `Selected package (${plugin}) doesn't exist.`,
                'suggestion': 'Vuelve a ingresar a la plataforma.',
                'logout': true
            }
        );
    }

    async loadPage(content) {
        // console.log("loadPage " + content);

        return fetch(content).then(response => {
            if (response['ok'])
                return response.text();
            else
                console.error({
                    'error': `No se encuentra el contenido.`,
                    'errorType': 'Client Error',
                    'errorCode': response['status'],
                    'errorDetails': `HTML content not found.`,
                    'suggestion': 'Vuelva a ingresar a la plataforma.',
                    'logout': true
                });
        }).then(data => {
            $(".content-page").empty().append(data);
        })
    }

    async initializeContent(source, module = this.content) {
        // console.log("initializeContent " + module);

        var user = this.user;
        let params = {
            "table": module,
            "user": user
        }

        if (this.currentContentInstance && typeof this.currentContentInstance.cleanup === 'function')
            this.currentContentInstance.cleanup();

        const { default: content } = await import(source);
        this.currentContentInstance = await new content(params);
    }

    async redirectionHandler(e, prevContent = this.content) {
        // console.log("redirectionHandler " + newContent);
        $(`a#${prevContent}`).css("color", "#9CA8B3");

        let url = new URL(window.location.href);
        var newContent = e.target.id;
        var actualEvent = e.target.name;

        if (newContent === "mainPanel")
            url.searchParams.delete("event");

        if (actualEvent)
            url.searchParams.set("event", actualEvent);

        url.searchParams.set("content", newContent);
        window.history.pushState({}, '', url);

        this.content = newContent;
        this.validateSession();
    }
}

new contentManager();