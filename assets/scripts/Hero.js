
cc.Class({
    extends: cc.Component,

    properties: {
        jumpSpeed: 900,
        jumpSpeedBonus: 500,
        canvas: {
            default: null,
            type: cc.Node
        },
        log: {
            default: null,
            type: cc.Label
        },

    },

    start () {

    },

    update (dt) {
        this.log.string = this.rigidbody.linearVelocity.y.toFixed(3);
    },

    init(game){
        this.game = game;
    },

    onLoad () {
        // open Accelerometer
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.jumpClick, this);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.speed = 0;
        this.bonusJump = 0;
        this.cacheJump = false;
        this.isJumping = false;

    },

    jumpClick(event){
        // this.rigidbody.linearVelocity.y.toFixed(3) == 0
        if(this.isJumping == false && this.rigidbody.linearVelocity.y.toFixed(3) == 0){
            this.onJump();
        }else if (this.bonusJump == 0 && this.rigidbody.linearVelocity.y < 0){
            this.bonusJump++;
            this.rigidbody.linearVelocity = new cc.Vec2(this.speed,this.jumpSpeedBonus);
        }else{
            this.cacheJump = true;
        }
    },

    onJump(){
        this.isJumping = true;
        this.cacheJump = false;
        this.bonusJump=0;
        this.rigidbody.linearVelocity = new cc.Vec2(this.speed,this.jumpSpeed);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        switch(otherCollider.node.group){
            case 'enemy':{
                console.log('game over');
                break;
            }
            case 'ground': {
                this.isJumping = false;
                if(this.cacheJump){
                    this.onJump();
                }
                break;
            }
            default:
                break;

        }
    },
});
