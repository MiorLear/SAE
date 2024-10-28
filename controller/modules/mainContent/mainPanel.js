import dashBoard from '../../plugins/dashBoard.js';

class content extends dashBoard {
    constructor(params) {
        super();
        this.table = params["table"];
        this.user = params["user"];
        this.settupEventListeners();
        console.log("pending to load dynamic data");
    }

    async settupEventListeners(){
    }

    async cleanup(table = this.table) {
    }
}

export default content;