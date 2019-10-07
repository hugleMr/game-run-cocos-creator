
cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode : {
            default: null,
            type: cc.Node
        },
        collider : {
            default: null,
            type: cc.PhysicsBoxCollider
        },
    },



    init(width, posX, height){
        this.width = width;
        this.spriteNode.width = width;
        this.collider.size.width = width;
        console.log(this.collider);
        this.node.setPosition(new cc.v2(posX, height));
        this.node.active = true;
    },
    hide(){

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },
});
