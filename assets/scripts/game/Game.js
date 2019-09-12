var websocket = require("websocket");
var map = require("map");
cc.Class({
    extends: cc.Component,

    properties: {
        startNode: cc.Node,
        centerNode: cc.Node,
        heroPrefab: cc.Prefab,
        shiMap: cc.Prefab,
        jinMap: cc.Prefab,
        muMap: cc.Prefab,
        shuiMap: cc.Prefab,
        huoMap: cc.Prefab,
        tuMap: cc.Prefab,
        diceNode: cc.Sprite,
        diceBtn: cc.Button,
        diceLabel: cc.Label,
        eventNode: cc.Sprite,
        eventLabel: cc.Label,
        eventExecuteBtn: cc.Button,
        eventCancelBtn: cc.Button,
        lingBar: cc.ProgressBar,
        lingLabel: cc.Label,
        levelLabel: cc.Label
    },

    onLoad() {
        this.userId = 0;
        this.localUser = -1;
        this.curUser = 0;
        this.totalUser = 2;
        this.userList = [];
        this.heroPos = -1;
        this.width = 0;
        this.height = 0;
        this.curLing = 0;
        this.totalLing = 300;
        this.level = 0;
        this.lingCount = [300, 600, 900, 1200, 1500];
        this.levelName = ["筑基", "金丹", "元婴", "化神", "飞升"];
        this.mapTypes = [this.jinMap, this.muMap, this.shuiMap, this.huoMap, this.tuMap, this.shiMap];
        // this.initMap(this.MapTypes, this.centerNode);
        map.init(this.centerNode, this.mapTypes, this.heroPrefab);
        this.heroNode;
    },
    start() {
        this.initWebsocketListen();
        websocket.connect();
    },
    initWebsocketListen: function () {
        websocket.listen("start", (data) => {
            window.userInfos = data.params.userDetails;
            for (let i = 0; i < data.params.userDetails.length; i++) {
                if (data.params.userDetails[i].wxId == window.gameData.openId) {
                    window.userOrder = i;
                }
            }
            this.run("dice");
        })
        websocket.listen("dice", (data) => {
            map.move(this.curUser, data.params.diceSum);
            this.run("operation");
        })
        websocket.listen("operation", (data) => {
            var result = data.params.description + data.params.lingChange;
            this.eventLabel.getComponent(cc.Label).string = result;

            this.curLing += 70;
            this.updateLing();
            this.curUser++;
            this.curUser = this.curUser % this.totalUser;
            this.run("dice");
        })
    },
    /*
        游戏流程：
        1.本地就绪后向服务发送就绪
        2.等所有玩家就绪后接收到服务器开始指令
        3.从第一个玩家开始，执行回合
        4.每回合包括掷骰子，触发事件，执行操作三个阶段
        5.每个阶段都会向服务器发送当前阶段的请求，服务器返回后执行操作，开启下一阶段
        6.等到有人飞升或走完10圈地图，游戏结束
    */
    run: function (stage) {
        switch (stage) {
            case "dice":
                this.executeDice();
                break;
            case "operation":
                this.executeOperation();
                break;
        }
    },
    executeDice: function () {
        this.eventHide();
        this.diceShow();

    },
    executeOperation: function () {
        this.eventShow();
        this.diceHide();

    },
    diceClick: function () {
        let params = {
            userId: window.gameData.openId,
            heroPos: this.heroPos,
            diceNums: "3",
            diceTypes: ["normal", "plusOne", "minusOne"]
        }
        websocket.sendMsg("dice", params);

    },
    eventExecute: function () {
        let params = {
            eventName: "0",
            eventValue: "70",
            operation: "0"
        }
        websocket.sendMsg("operation", params);
    },
    eventCancel: function () {
        this.curUser++;
        this.curUser = this.curUser % this.totalUser;
    },
    eventShow: function () {
        this.eventNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 0), cc.show()));
        if (this.curUser == window.userOrder) {
            this.eventExecuteBtn.node.active = true;
            this.eventCancelBtn.node.active = true;
        } else {
            this.eventExecuteBtn.node.active = false;
            this.eventCancelBtn.node.active = false;
        }
    },
    eventHide: function () {
        //增加一秒动画效果，方便看清骰子点数,把隐藏的面板向上移动以免干扰当前按钮的点击
        this.eventNode.node.runAction(cc.sequence(cc.hide(), cc.moveTo(0, 0, 500)));
    },
    diceShow: function () {
        if (this.curUser == window.userOrder) {
            var result = "请掷骰";
            this.diceBtn.node.active = true;
        } else {
            var result = `请${window.userInfos[this.curUser].nickName}掷骰`
            this.diceBtn.node.active = false;
        }
        this.diceLabel.getComponent(cc.Label).string = result;
        this.diceNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 0), cc.show()));

    },
    diceHide: function () {
        //增加一秒动画效果，方便看清骰子点数,把隐藏的面板向上移动以免干扰当前按钮的点击
        this.diceNode.node.runAction(cc.sequence(cc.scaleTo(1, 1.1, 1.1), cc.hide(), cc.moveTo(0, 0, 500)));
    },
    updateLing: function () {
        var curLing = this.curLing;
        var totalLing = this.totalLing;
        var progress = curLing / totalLing;
        if (progress >= 1) {
            this.curLing = curLing - totalLing;
            this.level++;
            progress -= 1;
        }
        this.lingBar.progress = progress;
        this.totalLing = this.lingCount[this.level];
        var lingString = this.curLing + '/' + this.totalLing;
        this.lingLabel.getComponent(cc.Label).string = lingString;
        var levelString = this.levelName[this.level];
        this.levelLabel.getComponent(cc.Label).string = levelString;
    },

});
