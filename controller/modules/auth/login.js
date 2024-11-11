import errorHandler from '../../errorHandler.js';

class Login {
    constructor() {
        this.errorHandler = new errorHandler();

        $(document).on('submit', '#loginForm', (form) => {
            form.preventDefault();
            this.validateLogin();
        });
    }

    async validateLogin() {
        try {
            var user = $("input#mail").val().trim()
            var password = $("input#password").val().trim()

            if (!user || !password) {
                console.error(
                    {
                        'error': 'Espera un momento.',
                        'errorType': 'User Error',
                        'suggestion': 'No deje espacios en blanco! Porfavor, ingrese sus credenciales.',
                        'logout': false
                    }
                )
                return;
            }

            const { default: sessionManager } = await import('../../sessionManager.js');
            var src = '../../../model/modules/sessionManager.php'
            var response = await new sessionManager().startSession(user, password, src);

            if (response['result'] != 'success')
                return console.error(response);

            window.location.href = '../../main.html?content=mainPanel';

        } catch (error) {
            console.error({ 'error': error, 'errorType': 'notAlert' });
        }

    }
}

new Login();
