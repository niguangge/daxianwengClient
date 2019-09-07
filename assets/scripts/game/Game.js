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
        this.curUser = 0;
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
        // this.createHero(0);
        this.diceShow();
        this.eventHide();
        this.userList = [0, 1, 2, 3];
        websocket.connect();
        console.log(window.gameData);
    },

    diceClick: function () {
        var diceNum = this.getDiceNum();
        var result = "掷骰结果为" + diceNum;
        this.diceLabel.getComponent(cc.Label).string = result;
        // let event = map.move(diceNum);
        // this.eventLabel.getComponent(cc.Label).string = event;
        this.eventShow();
        this.diceHide();
    },

    getDiceNum: function () {
        var diceNum = 1;
        // let result = websocket.send_data("test");
        let params = {
            diceNums: "3",
            diceTypes: ["normal", "plusOne", "minusOne"]
        }
        websocket.sendMsg("dice", params, (data) => {
            console.log("after msg" + data)
        })
        return diceNum;
    },

    eventExecute: function () {
        this.curLing += 70;
        this.updateLing();
        this.diceShow();
        this.eventHide();
    },
    eventCancel: function () {
        this.diceShow();
        this.eventHide();
    },
    eventShow: function () {
        // this.eventNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 500), cc.show()));
        this.eventNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 0), cc.show()));
        this.eventExecuteBtn.interactable = true;
        this.eventCancelBtn.interactable = true;
    },
    eventHide: function () {
        //把隐藏的面板向上移动以免干扰当前按钮的点击
        this.eventNode.node.runAction(cc.sequence(cc.hide(), cc.moveTo(0, 0, 500)));
        this.eventExecuteBtn.interactable = false;
        this.eventCancelBtn.interactable = false;
    },
    diceShow: function () {
        var result = "请掷骰";
        this.diceLabel.getComponent(cc.Label).string = result;
        // this.diceNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 500), cc.show()));
        this.diceNode.node.runAction(cc.sequence(cc.moveTo(0, 0, 0), cc.show()));
        this.diceBtn.interactable = true;
    },
    diceHide: function () {
        //增加一秒动画效果，方便看清骰子点数
        this.diceNode.node.runAction(cc.sequence(cc.scaleTo(1, 1.1, 1.1), cc.hide(), cc.moveTo(0, 0, 500)));
        this.diceBtn.interactable = false;
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
