var map = require("map");
var websocket = {
    sock: null,
    map: null,

    on_open: function () {
        console.log("webSocket is open");
        // this.send_data(JSON.stringify({
        //     "stage": "dice",
        //     "channel": "system",
        //     "params": "{\"diceNum\":\"3\",\"diceType\":[\"normal\",\"minusOne\",\"plusOne\"]}"
        // }));
    },

    on_message: function (event) {
        console.log("服务器信息=" + event.data);
        console.log(event);
        let result = JSON.parse(event.data);
        console.log(result.channel);
        if (result.diceNums != null && result.diceNums != undefined) {
            this.map.move(result.diceNums[0]);
        }
    },

    on_close: function () {
        this.close();
        console.log("webSocket is close");
    },

    on_error: function () {
        this.close();
    },

    close: function () {
        if (this.sock) {
            this.sock.close();
            this.sock = null;
        }
    },

    connect: function (url, map) {
        this.sock = new WebSocket(url);
        this.sock.binaryType = "arraybuffer";
        this.sock.onopen = this.on_open.bind(this);
        this.sock.onmessage = this.on_message.bind(this);
        this.sock.onclose = this.on_close.bind(this);
        this.sock.onerror = this.on_error.bind(this);
        this.map = map;
    },

    send_data: function (data) {
        this.sock.send(data);
    }

}

module.exports = websocket;