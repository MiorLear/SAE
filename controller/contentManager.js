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

        $("#sidebar-menu").find('a').each(function () {
            var sideBarTab = this;

            if (!$(sideBarTab).attr("id")) return;
            if (!$(sideBarTab).hasClass("content")) return;
            $(sideBarTab).css("color", "#9CA8B3");

        });

        $('[data-toggle="tooltip"]').tooltip('dispose');

        if (!this.unAuth(content)) {
            return console.error(
                {
                    'error': "Contenido Restringido.",
                    'errorType': 'User Error',
                    'suggestion': 'No estás autorizado para entrar a este contenido. Comuniquese con el administrador del sitio para más información',
                    "back": true
                });
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
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            grades: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== "elementToCall";
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            levels: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            roles: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            students: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            users: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = "../controller/modules/main/content.js";
                    return true;
                }
            },
            mainPanel: {
                preLoad: () => {
                    elementToCall = "main";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/main/${content}.html`;
                    contentToInitialize = `../controller/modules/main/${content}.js`;
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
            checkEventStudent: {
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
            redeemCards: {
                preLoad: () => {
                    elementToCall = "events";
                    reloadElements = elements !== elementToCall;
                    pageToLoad = `modules/event/${content}.html`;
                    contentToInitialize = `../controller/modules/events/${content}.js`;
                    return true;
                }
            },
            redeemComplements: {
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
        await this.validatePermissions();
    }

    unAuth(content = this.content) {
        // console.log("unAuth " + content);

        const permissions = this.user["permissions"];

        const authContent = {
            mainPanel: {
                check() {
                    return true;
                }
            },
            eventPanel: {
                check() {
                    return true;
                }
            },
            events: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Eventos' ||
                        permission.name === 'Listar Eventos'));
                }
            },
            grades: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Grados' ||
                        permission.name === 'Listar Grados'));
                }
            },
            levels: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Niveles' ||
                        permission.name === 'Listar Niveles'));
                }
            },
            roles: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Roles' ||
                        permission.name === 'Listar Roles'));
                }
            },
            students: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Estudiantes' ||
                        permission.name === 'Listar Estudiantes'));
                }
            },
            users: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Administrar Plataforma' ||
                        permission.name === 'Administrar Usuarios' ||
                        permission.name === 'Listar Usuarios'));
                }
            },
            checkCard: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Revisión de Tarjetas por Código' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            checkStudent: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Revisión de Tarjetas por Estudiante' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            controlLog: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Bitácora de Control' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            analysis: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Análisis' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            payCard: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Pago de Tarjetas por Código' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            payStudent: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Pago de Tarjetas por Estudiante' ||
                        permission.name === 'Gestión y Análisis'));
                }
            },
            checkEventCard: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Gestión y Análisis de Evento' ||
                        permission.name === 'Revisión de Tarjetas por Código en Evento'
                    ));
                }
            },
            checkEventStudent: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Gestión y Análisis de Evento' ||
                        permission.name === 'Revisión de Tarjetas por Estudiante en Evento'
                    ));
                }
            },
            initialize: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Inicializar Evento' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            cardsPresale: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Preventa de Tarjetas' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            salesCase: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Caja de Ventas' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            cardsDelivery: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Entrega de Tarjetas' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            cardsReturn: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Devolución de Tarjetas' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            redeemCards: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Canjeo de Tarjetas' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            redeemComplements: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Canjeo de Complementos' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            start: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Iniciar Evento' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            closure: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Cerrar Evento' ||
                        permission.name === 'Administrar Módulos de Eventos')
                    );
                }
            },
            eventAnalysis: {
                check() {
                    return (permissions.some(permission =>
                        permission.name === 'Gestión y Análisis de Evento' ||
                        permission.name === 'Análisis del Evento')
                    );
                }
            },
        }

        return authContent?.[content]?.check();
    }

    async validatePermissions(user = this.user) {

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
                if ($(sideBarTab).attr("id") === "students") $(sideBarTab).css("display", "block");

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
                permission.name === 'Revisión de Tarjetas por Código' ||
                permission.name === 'Revisión de Tarjetas por Estudiante'))
                if ($(sideBarTab).attr("id") === "check") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Revisión de Tarjetas por Código'))
                if ($(sideBarTab).attr("id") === "checkCard") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Revisión de Tarjetas por Estudiante'))
                if ($(sideBarTab).attr("id") === "checkStudent") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Pago de Tarjetas por Código' ||
                permission.name === 'Pago de Tarjetas por Estudiante'))
                if ($(sideBarTab).attr("id") === "pay") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Pago de Tarjetas por Código'))
                if ($(sideBarTab).attr("id") === "payCard") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Pago de Tarjetas por Estudiante'))
                if ($(sideBarTab).attr("id") === "payStudent") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Análisis'))
                if ($(sideBarTab).attr("id") === "analysis") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Bitácora de Control'))
                if ($(sideBarTab).attr("id") === "controlLog") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Administrar Plataforma' ||
                permission.name === 'Listar Estudiantes' ||
                permission.name === 'Administrar Estudiantes' ||
                permission.name === 'Listar Roles' ||
                permission.name === 'Administrar Roles' ||
                permission.name === 'Listar Niveles' ||
                permission.name === 'Administrar Niveles' ||
                permission.name === 'Listar Eventos' ||
                permission.name === 'Administrar Eventos' ||
                permission.name === 'Listar Usuarios' ||
                permission.name === 'Administrar Usuarios' ||
                permission.name === 'Listar Grados' ||
                permission.name === 'Administrar Grados'))
                if ($(sideBarTab).attr("id") === "admin-title") $(sideBarTab).css("display", "block");

            if (permissions.some(permission =>
                permission.name === 'Revisión de Tarjetas por Código' ||
                permission.name === 'Revisión de Tarjetas por Estudiante' ||
                permission.name === 'Pago de Tarjetas por Código' ||
                permission.name === 'Pago de Tarjetas por Estudiante' ||
                permission.name === 'Bitácora de Control' ||
                permission.name === 'Análisis'))
                if ($(sideBarTab).attr("id") === "management-analysis-title") $(sideBarTab).css("display", "block");
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

        await this.validatePermissions();
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
                    app.initToolTip();
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
            checkEventStudent: {
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
            redeemCards: {
                load: async () => {
                    app.initDatePicker();
                }
            },
            redeemComplements: {
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
                    app.initSelect();
                }
            },
            mainPanel: {
                load: async () => {
                    app.initDatePicker();
                    app.initToolTip();
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

    async redirectionHandler(e) {
        // console.log("redirectionHandler " + newContent);
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
        this.loadContent();
    }
}

new contentManager();