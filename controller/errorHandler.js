class errorHandler {
  constructor() {
    this.overrideConsole();

    this.errorTypes = {
      "User Error": {
        "icon": "warning",
      },
      "Server Error": {
        "icon": "error",
      },
      "Client Error": {
        "icon": "error",
      }
    }

  }

  overrideConsole() {
    const originalConsoleError = console.error;

    console.error = (message, ...optionalParams) => {
      $("#overlay").css("display", "none");

      let alertContent = {};
      if (Array.isArray(message))
        message.forEach((key, element) => {
          alertContent[key] = element;
        });
      else if (typeof message === 'object')
        Object.keys(message).forEach(key => {
          alertContent[key] = message[key];
        });
      originalConsoleError.apply(console, [message, ...optionalParams]);
      this.showAlert(alertContent);
    };
  }

  showAlert(alertContent) {
    if (alertContent["errorType"] == "notAlert")
      return;

    var message = `<p class="text-center">${alertContent["suggestion"]}</p>`;
    message += alertContent["errorType"] != "User Error"
      ?
      '<a class="text-info" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Ver más información.</a><div class="collapse" id="collapseExample"><div class="card card-body">' + alertContent["errorDetails"] + ' </div> </div>'
      :
      ''
      ;

    swal.fire(
      {
        title: alertContent["error"],
        html:
          message,
        icon: this.errorTypes[alertContent["errorType"]]["icon"],
        customClass: {
          confirmButton: 'btn btn-outline-primary btn-lg',
        },
        buttonsStyling: false,
        confirmButtonText: 'Entendido'
      }
    ).then(async () => {
      if (alertContent?.["logout"]) {
        const { default: sessionManager } = await import('../controller/sessionManager.js');
        var src = '../model/modules/sessionManager.php';
        var response = await new sessionManager().deleteSession(src);

        if (response['result'] == 'success')
          window.location.href = './modules/auth/login.html';
        else
          console.error(response);
      };
    });
  }
}

export default errorHandler;
