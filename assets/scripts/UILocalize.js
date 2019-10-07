

cc.Class({
    extends: cc.Component,

    properties: {
        key: '',
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setKey: function (value) {
        this.key = value;
        this.getComponent(cc.Label).string = window.localize.text(this.key);
    },
    onEnable(){
        this.getComponent(cc.Label).string = window.localize.text(this.key);
    },

    // start () {},

    // update (dt) {},
});