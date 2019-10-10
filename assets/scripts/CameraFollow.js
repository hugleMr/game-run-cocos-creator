
cc.Class({
    extends: cc.Component,
    properties: {
        target:{
            default: null,
            type: cc.Node
        },
        offset: 0,
    },

    start () {},

    update (dt) {
        this.node.x = this.target.x + this.offset;
    },
});
