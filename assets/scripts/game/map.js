//制作地图

var map = {
  width: 0,
  height: 0,
  maps: [],
  heroPos: -1,
  centerNode: null,
  heroNode: [],
  mapTypes: [],
  mapEvents: ["金", "木", "水", "火", "土", "时"],
  init(centerNode, mapTypes, heroPrefab) {
    let frameSize = cc.view.getFrameSize();
    let frameWidth = frameSize.width;
    this.centerNode = centerNode;
    this.mapTypes = mapTypes;
    // 针对分辨率进行适配,制作7*13的地图
    if (frameWidth <= 320) {
      this.width = 40;
      this.height = 60;
    } else {
      this.width = 60;
      this.height = 85;
    }
    this.createMap();
    this.createHero(2, heroPrefab);
  },
  createHero: function (playerNum, heroPrefab) {
    for (let i = 0; i < playerNum; i++) {
      var heroBaseNode = new cc.Node('hero ' + i);
      this.centerNode.addChild(heroBaseNode);
      heroBaseNode.setPosition(cc.v2(i % 2 == 0 ? -30 : 30, i < 2 ? 50 : -50));
      this.heroNode[i] = cc.instantiate(heroPrefab);
      heroBaseNode.addChild(this.heroNode[i]);
      this.heroNode[i].setPosition(cc.v2(2 * this.width, 0));
    }
  },
  createMap: function () {
    //首先制作起始点
    let start = cc.instantiate(this.mapTypes[5]);
    this.centerNode.addChild(start);
    let width = this.width;
    let height = this.height;
    start.setPosition(cc.v2(width * 2, 0));
    //顺时针制作整个地图
    for (let i = 0; i < 36; i++) {
      let newMap = null;
      newMap = cc.instantiate(this.mapTypes[i % 6]);
      let x;
      let y;
      if ((i >= 31 & i <= 36) | (i >= 0 & i <= 6)) {
        //右
        x = width * 3;
        y = height * (i < 31 ? -i : (36 - i));
      } else if (i >= 7 & i <= 12) {
        //下
        x = width * (9 - i);
        y = height * - 6;
      } else if (i >= 13 & i <= 24) {
        //左
        x = width * -3;
        y = height * (i - 18);
      } else if (i >= 25 & i <= 30) {
        //上
        x = width * (i - 27);
        y = height * 6;
      }
      newMap.setPosition(cc.v2(x, y));
      this.maps[i] = newMap;
      this.centerNode.addChild(newMap);
    }
    return this.maps;
  },
  move(user, diceNum) {
    let target = (this.heroPos + diceNum) % 36;
    let mapCur = this.maps[target];
    console.log(user);
    this.heroNode[user].runAction(cc.moveTo(0.2, mapCur.x, mapCur.y));
    this.heroPos = target;
  },
  //判断当前所属区域类型,执行区域对应操作
  executeAreaEvent: function () {
    let event = this.mapEvents[this.heroPos % 6];
    // return event;
    eventLabel.getComponent(cc.Label).string = event;
  },
}
module.exports = map;