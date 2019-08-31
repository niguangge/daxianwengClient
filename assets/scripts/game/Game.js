var GameData = require('../config/GameData');
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
        heroNode: cc.Node,
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
        this.initMap();
        this.heroPos = 0;
        this.width = this.heroNode.width;
        this.height = this.heroNode.height;
        this.curLing = 0;
        this.totalLing = 300;
        this.level = 0;
        this.lingCount = [300, 600, 900, 1200, 1500];
        this.levelName = ["筑基", "金丹", "元婴", "化神", "飞升"];
    },
    start() {
        this.createHero();
        this.diceShow();
        this.eventHide();
    },

    initMap: function () {
        let frameSize = cc.view.getFrameSize();
        let frameHeight = frameSize.height;
        let frameWidth = frameSize.width;
        console.log(frameSize);
        console.log(frameHeight);
        console.log(frameWidth);
        let mapWidth = 0;
        let mapHeight = 0;
        // 针对分辨率进行适配,制作7*13的地图
        if (frameWidth <= 320) {
            mapWidth = 40;
            mapHeight = 60;
        } else {
            mapWidth = 60;
            mapHeight = 85;
        }
        //首先制作起始点
        var start = cc.instantiate(this.shiMap);
        this.centerNode.addChild(start);
        start.setPosition(cc.v2(mapWidth * 2, 0));
        //制作整个地图
        console.log("enter out");
        for (var i = 0; i < 36; i++) {
            console.log("enter for");
            var newMap = null;
            switch (i % 6) {
                case 0:
                    newMap = cc.instantiate(this.jinMap);
                    break;
                case 1:
                    newMap = cc.instantiate(this.muMap);
                    break;
                case 2:
                    newMap = cc.instantiate(this.shuiMap);
                    break;
                case 3:
                    newMap = cc.instantiate(this.huoMap);
                    break;
                case 4:
                    newMap = cc.instantiate(this.tuMap);
                    break;
                case 5:
                    newMap = cc.instantiate(this.shiMap);
                    break;
                default:
            }
            let x;
            let y;
            if ((i >= 31 & i <= 36) | (i >= 0 & i <= 6)) {
                x = mapWidth * 3;
                y = mapHeight * (i < 31 ? -i : (36 - i));
            } else if (i >= 7 & i <= 12) {
                x = mapWidth * (9 - i);
                y = mapHeight * - 6;
            } else if (i >= 13 & i <= 24) {
                x = mapWidth * -3;
                y = mapHeight * (i - 18);
            } else if (i >= 25 & i <= 30) {
                x = mapWidth * (i - 27);
                y = mapHeight * 6;
            }
            newMap.setPosition(cc.v2(x, y));
            console.log("add " + i + ": x is " + x + "y is " + y);
            this.centerNode.addChild(newMap);

        }

    },

    createHero: function (playerNum) {
        var newHero = null;
        switch (playerNum) {
            case 4:

            case 3:

            case 2:

            case 1:

            default:
                newHero = cc.instantiate(this.heroPrefab);
                this.heroNode.addChild(newHero);
                newHero.setPosition(cc.v2(0, 0));
        }
    },

    diceClick: function () {
        var diceNum = this.getDiceNum();
        var result = "掷骰结果为" + diceNum;
        this.diceLabel.getComponent(cc.Label).string = result;
        this.move(diceNum);
    },

    getDiceNum: function () {
        var diceCount = Math.round(Math.random() * 60);
        var diceNum = 1;
        if (diceCount < 10) {
            diceNum = 1;
        } else if (diceCount < 20) {
            diceNum = 2;
        } else if (diceCount < 30) {
            diceNum = 3;
        } else if (diceCount < 40) {
            diceNum = 4;
        } else if (diceCount < 50) {
            diceNum = 5;
        } else if (diceCount < 60) {
            diceNum = 6;
        }
        return diceNum;
    },

    move: function (step) {
        //与掷骰子动画相对应的延时
        for (var i = 0; i < step; i++) {
            this.next();
        }
        this.executeAreaEvent();
    },
    next: function () {
        var curX = this.heroNode.x;
        var curY = this.heroNode.y;
        if ((this.heroPos >= 31 & this.heroPos <= 36) | (this.heroPos >= 1 & this.heroPos <= 6)) {
            this.heroNode.runAction(cc.moveTo(0.2, curX, curY - this.height));
        } else if (this.heroPos >= 7 & this.heroPos <= 12) {
            this.heroNode.runAction(cc.moveTo(0.2, curX - this.width, curY));
        } else if (this.heroPos >= 13 & this.heroPos <= 24) {
            this.heroNode.runAction(cc.moveTo(0.2, curX, curY + this.height));
        } else if (this.heroPos == 0 | (this.heroPos >= 25 & this.heroPos <= 30)) {
            this.heroNode.runAction(cc.moveTo(0.2, curX + this.width, curY));
        }
        this.heroPos++;
        if (this.heroPos > 36) {
            this.heroPos = 1;
        }
    },
    //判断当前所属区域类型,执行区域对应操作
    executeAreaEvent: function () {
        var event = '';
        switch (this.heroPos % 6) {
            case 1:
                //金
                event = "金";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            case 2:
                //木
                event = "木";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            case 3:
                //水
                event = "水";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            case 4:
                //火
                event = "火";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            case 5:
                //土
                event = "土";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            case 0:
                //时(随机事件)
                event = "时";
                this.eventLabel.getComponent(cc.Label).string = event;
                break;
            default:
        }
        this.eventShow();
        this.diceHide();
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
