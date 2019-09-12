var imgUtils = {
  addImg(headimg, desSprite) {
    // var self = this;
    cc.loader.load(headimg + "?aaa=aa.jpg", (err, texture) => {
      let avatar = new cc.SpriteFrame(texture);
      desSprite.getComponent(cc.Sprite).spriteFrame = avatar;
    });
  }

}
module.exports = imgUtils;