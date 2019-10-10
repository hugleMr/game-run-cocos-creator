

cc.Class({
    extends: cc.Component,

    properties: {
        key: '',
    },

    onEnable(){
        this.getComponent(cc.Label).string = window.localize.text(this.key);
    },

});