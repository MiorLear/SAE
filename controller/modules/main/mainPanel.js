class content {
    constructor(params) {
        this.table = params["table"];
        this.user = params["user"];
        this.settupEventListeners();
        this.loadUserData();
    }

    async loadUserData(user = this.user){

        var permissions = "";
        $(".userName").text("Bienvenido/a "+ user["name"]);
        for (let index = 0; index < user["permissions"].length; index++) {
            const element = user["permissions"][index];

            permissions += `<li>${element["name"]}</li>`;
        }
        $(".userRole").html("<p> Eres un "+ user["rol"] + " en el sistema. Tienes acceso a los siguientes módulos: </p> <ul> "+permissions+"</ul>"  );
    }


    async settupEventListeners(){
    }

    async cleanup(table = this.table) {
    }
}

export default content;