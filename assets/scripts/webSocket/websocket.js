
var websocket = {
    sock: null,
    messageList: {
        "join": function (message) {
        },
        "leave": function (message) {
            console.log(messageMaker.getLeaveMessage);
        },
        "ready": function (message) {
            console.log(messageMaker.getReadyMessage);
        }
    },
    userId: '',
    roomId: '',
    on_open: function () {
        console.log("webSocket is open");
    },


    on_message: function (event) {
        //处理各种推送消息
        console.log("服务器信息=" + event.data);
        const message = JSON.parse(event.data);
        const eventName = message.stage;
        //执行回调
        console.log(eventName);
        this.messageList[eventName](message);
    },


    on_close: function () {
        this.close();
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

    connect: function () {
        this.userId = window.gameData.openId;
        this.roomId = window.gameData.roomId;
        let url = "ws://niguang.free.idcfengye.com/webSocketServer?roomId=" + this.roomId + "&userId=" + this.userId;
        this.sock = new WebSocket(url);
        this.sock.binaryType = "arraybuffer";
        this.sock.onopen = this.on_open.bind(this);
        this.sock.onmessage = this.on_message.bind(this);
        this.sock.onclose = this.on_close.bind(this);
        this.sock.onerror = this.on_error.bind(this);
        this.sock.sendMsg = this.sendMsg.bind(this);
    },

    sendMsg: function (stage, params) {
        this.sock.send(messageMaker.getMsg(stage, params));
    },
    listen: function (stage, callback) {
        this.messageList[stage] = callback;
    }
}


class message {
    constructor(stage, user, room, scope, channel, params, message) {
        this.stage = stage; // 游戏阶段，如开始阶段，掷骰子阶段，时间阶段
        this.user = user; // 信息来源用户
        this.Room = room; // 信息来源房间
        this.scope = scope; // 信息通知范围，单人/全体
        this.channel = channel; // 频道，系统/聊天/游戏
        this.params = params; // 不同阶段所需参数
        this.message = message; // 需要发送的信息
    }
    toJson() {
        return JSON.stringify(this);
    }
}

var messageMaker = {
    user: '',
    room: '',
    getDiceMessage(params) {
        return new message("dice", this.user, this.room, "all", "system", params, "").toJson();
    },
    getOperationMessage(params) {
        return new message("operation", this.user, this.room, "all", "system", params, "").toJson();
    },
    getEventMessage(params) {
        return new message("event", this.user, this.room, "all", "system", params, "").toJson();
    },
    getReadyMessage(params) {
        return new message("ready", this.user, this.room, "all", "system", params, "").toJson();
    },
    getJoinMessage() {
        return `玩家${this.user}加入了房间${this.room}`;
    },
    getLeaveMessage() {
        return `玩家${this.user}离开了房间${this.room}`;
    },
    getMsg(stage, params) {
        let msg;
        switch (stage) {
            case "dice":
                msg = this.getDiceMessage(params);
                break;
            case "operation":
                msg = this.getOperationMessage(params);
                break;
            case "event":
                msg = this.getEventMessage(params);
                break;
            case "ready":
                msg = this.getReadyMessage(params);
                break;
            default:
                msg = this.getReadyMessage(params);
        }
        return msg;
    }
}
module.exports = websocket;