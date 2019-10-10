
cc.Class({
    extends: cc.Component,

    properties: {
        
    },



    init(posX, height){
        // this.width = width;
        // this.spriteNode.width = width;
        // this.collider.size.width = width;
        this.node.setPosition(new cc.v2(posX, height));
        this.node.active = true;
    },
});
