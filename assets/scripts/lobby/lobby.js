
var gameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        loginBtn: cc.Button,
        imgIcon: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.openId = '';
        this.sessionKey = '';
        this.userInfo = {};
        this.userData = {};
    },

    start() {
        window.gameData = gameData;
        var _this = this;
        if (!window["wx"]) {
            gameData.openId = "test";
            gameData.nickName = "测试用户";
        } else {
            this.wxLogin();
            this.wxGetSetting();
        }
        cc.director.preloadScene("helloworld");
    },

    wxLogin() {
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'http://niguang.free.idcfengye.com/wx/login',
                        data: {
                            code: res.code
                        },
                        success(result) {
                            gameData.openId = result.data.openid;
                            gameData.sessionKey = result.data.session_key;

                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    btnClick: function () {
        // this.addImg(this.userInfo.avatarUrl);
        var _this = this;
        if (window["wx"]) {
            wx.request({
                url: 'http://niguang.free.idcfengye.com/user/getUser',
                data: {
                    userId: gameData.openId,
                    nickName: gameData.userInfo.nickName
                }, success(data) {
                    // console.log(data);
                    gameData.userData = data.data;
                    // console.log(gameData);

                }
            })
        }
        cc.director.loadScene("helloworld");
    },

    wxGetSetting() {
        wx.getSetting({
            success(res) {
                if (res.authSetting["scope.userInfo"]) {
                    window.wx.getUserInfo({
                        success(res) {
                            gameData.userInfo = res.userInfo;
                        }
                    });
                } else {
                    let sysInfo = window.wx.getSystemInfoSync();
                    //获取微信界面大小
                    let width = sysInfo.screenWidth;
                    let height = sysInfo.screenHeight;
                    let button = window.wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                            backgroundColor: '#00000000', //最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: "center",
                            lineHeight: height,
                        }
                    });
                    button.onTap((res) => {
                        if (res.userInfo) {
                            gameData.userInfo = res.userInfo;
                            //此时可进行登录操作
                            button.destroy();

                        } else {
                            console.log("用户拒绝授权:", res);
                        }
                    });
                }
            }
        });
    },
    addImg(headimg) {
        var self = this;
        cc.loader.load(headimg, (err, texture) => {
            console.log(texture);
            console.log(self.imgIcon);
            self.imgIcon.spriteFrame = texture;
        });
    }
    // update (dt) {},
});
