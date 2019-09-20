
import {instance} from 'Config';
var State = cc.Enum({
    Idel   : -1,
    Dead   : -1,
    Drop   : -1,
    Jump   : -1,
    Run    : -1,
});
cc.Class({
    extends: cc.Component,

    properties: {
        jumpSpeed: 900,
        jumpSpeedBonus: 500,
        canvas: {
            default: null,
            type: cc.Node
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function(value){
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        this._updateAnimation();
                    }
                }
            },
            type: State
        },
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        diedAudio: {
            default: null,
            type: cc.AudioClip
        }

    },

    _updateAnimation () {
        var animName = State[this._state];
        this.anim.stop();
        this.anim.play(animName);
    },

    start () {
    },

    update (dt) {
        if(instance.isPlay){
            this.node.x += instance.speed * dt;
            if(this.node.y < -400){
                instance.game.gameOver();
                cc.audioEngine.playEffect(this.diedAudio);
            }
            if(this.state == State.Jump && this.rigidbody.linearVelocity.y < 0){
                this.state = State.Drop;
            }
        }
    },

    init(){
        this.node.position = new cc.Vec2(0,0);
        this.rigidbody.linearVelocity = new cc.Vec2(0,0);
        this.state = State.Run;
    },

    onLoad () {
        // open Accelerometer
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.jumpClick, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.anim = this.node.getComponent(cc.Animation);
        this.speed = 0;
        this.bonusJump = 0;
        this.cacheJump = false;
        this.state = State.Idel
        instance.hero = this;
        this.jumpTime = 1.7;

    },

    jumpClick(event){
        // this.rigidbody.linearVelocity.y.toFixed(3) == 0
        if((this.state != State.Jump || this.state != State.Drop) && this.rigidbody.linearVelocity.y.toFixed(3) == 0){
            this.onJump();
        }else if (this.bonusJump == 0 && this.rigidbody.linearVelocity.y < 0){
            this.bonusJump++;
            this.rigidbody.linearVelocity = new cc.Vec2(0,this.jumpSpeedBonus);
            this.state = State.Jump;
            cc.audioEngine.playEffect(this.jumpAudio);
        }else if(this.rigidbody.linearVelocity.y < 0){
            this.cacheJump = true;
        }
    },

    onJump(){
        this.cacheJump = false;
        this.bonusJump=0;
        this.rigidbody.linearVelocity = new cc.Vec2(0,this.jumpSpeed);
        this.state = State.Jump;
        cc.audioEngine.playEffect(this.jumpAudio);

    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.space:
                this.jumpClick(event);
                break;
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        switch(otherCollider.node.group){
            case 'enemy':{
                instance.isPlay = false;
                this.state = State.Dead;
                break;
            }
            case 'ground': {
                if(this.cacheJump){
                    this.onJump();
                }else{
                    this.state = State.Run;
                }
                break;
            }
            default:
                break;

        }
    },
});
