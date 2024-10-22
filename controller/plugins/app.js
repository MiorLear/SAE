class MainApp {
    constructor(selector) {
        this.$body = $("body");
        this.$wrapper = $("#wrapper");
        this.$btnFullScreen = $("#btn-fullscreen");
        this.$leftMenuButton = $('.button-menu-mobile');
        this.$menuItem = $('.has_sub > a');
        this.selector = selector || '#datepicker';
    }

    intSlimscrollmenu() {
        $('.slimscroll-menu').slimscroll({
            height: 'auto',
            position: 'right',
            size: "7px",
            color: '#9ea5ab',
            wheelStep: 5,
            touchScrollStep: 50
        });
    }

    initSlimscroll() {
        $('.slimscroll').slimscroll({
            height: 'auto',
            position: 'right',
            size: "7px",
            color: '#9ea5ab',
            touchScrollStep: 50
        });
    }

    initMetisMenu() {
        $("#side-menu").metisMenu();
    }

    initLeftMenuCollapse() {
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault();
            $("body").toggleClass("enlarged");
        });
    }

    initEnlarge() {
        if ($(window).width() < 1025) {
            $('body').addClass('enlarged');
        } else {
            if ($('body').data('keep-enlarged') !== true)
                $('body').removeClass('enlarged');
        }
    }

    initActiveMenu() {
        $("#sidebar-menu a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href === pageUrl) {
                $(this).addClass("mm-active");
                $(this).parent().addClass("mm-active"); // add active to li of the current link
                $(this).parent().parent().addClass("mm-show");
                $(this).parent().parent().prev().addClass("mm-active");
                $(this).parent().parent().parent().addClass("mm-active");
                $(this).parent().parent().parent().parent().addClass("mm-show");
                $(this).parent().parent().parent().parent().parent().addClass("mm-active");
            }
        });
    }

    initComponents() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    }

    initToggleSearch() {
        $('.toggle-search').on('click', function () {
            var targetId = $(this).data('target');
            var $searchBar;
            if (targetId) {
                $searchBar = $(targetId);
                $searchBar.toggleClass('open');
            }
        });
    }

    // Full screen functionality
    initFullScreen() {
        this.$btnFullScreen.on("click", function (e) {
            e.preventDefault();

            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        });
    }

    initDatePicker() {
        jQuery(this.selector).datepicker({
            todayHighlight: true,
            viewDate: true,
            language: 'es'
        });
        jQuery(this.selector).datepicker('setDate', new Date());

        // if ($(".datepicker").length > 0) {
        //     jQuery(".datepicker").datepicker({
        //         startDate: new Date(),
        //         viewDate: true,
        //         regional: "es",
        //         language: 'es',
        //         minDate: 0,
        //     });
        // }

    }

    initSelect() {
        $('.form-select').selectpicker({
            locale: 'es'
        });
    }

    initMaxLength() {
        $('.maxlength').maxlength({
            alwaysShow: true,
            threshold: 10,
            warningClass: "badge badge-primary",
            limitReachedClass: "badge badge-warning",
            separator: ' de ',
            preText: 'Tienes ',
            postText: ' carácteres disponibles.',
            validate: true
        });
    }

    initTouchSpin() {
        $('.touchSpin').TouchSpin({
            prefix: '$',
            min: 0,
            max: 100,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10
        });
    }

    initToolTip() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    fileupload() {
        $(document).on('change', 'input.custom-file-input', (e) => {
            var inputFile = e.currentTarget;
            inputFile.nextElementSibling.innerHTML = inputFile.files[0].name;
            $("#changeImage").val("Change")
        });
    }

    init() {
        this.intSlimscrollmenu();
        this.initSlimscroll();
        this.initMetisMenu();
        this.initLeftMenuCollapse();
        this.initEnlarge();
        this.initActiveMenu();
        this.initComponents();
        this.initToggleSearch();
        this.initFullScreen();
        this.initDatePicker();
        this.initSelect();
        this.initMaxLength();
        this.fileupload();
        this.initTouchSpin();
        this.initToolTip();
        Waves.init();
    }
}

// Export the class to be used dynamically
export default MainApp;
