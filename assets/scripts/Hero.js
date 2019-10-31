
var State = cc.Enum({
    Idel   : -1,
    Dead   : -1,
    Drop   : -1,
    Jump   : -1,
    Run    : -1,
    None   : -1,
});
cc.Class({
    extends: cc.Component,

    properties: {
        initSpeed: 300,
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
        },
        camera: {
            default: null,
            type: cc.Node
        },
        offsetCamera: 300,
        bonusJumpMax: 0,
        fakerPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    _updateAnimation () {
        var animName = State[this._state];
        // this.anim.stop();
        this.anim.play(animName);
    },

    update (dt) {

        if(window.game.state == 1){
            console.log(window.game.speed);
            // this.node.x += window.game.speed * dt;
            this.camera.x = this.node.x + this.offsetCamera;

            if(this.node.y < -400){
                window.game.game.gameOver();
                cc.audioEngine.playEffect(this.diedAudio);
            }
            if(this.state == State.Jump && this.rigidbody.linearVelocity.y < 0){
                this.state = State.Drop;
            }
        }
    },

    init(){
        window.game.speed = this.initSpeed;
        this.node.position = new cc.Vec2(0,0);
        this.rigidbody.linearVelocity = new cc.Vec2(window.game.speed,0);
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
        window.game.hero = this;
        this.jumpTime = 1.1;

    },

    jumpClick(event){
        if(window.game.state == 1 && window.game.tutorial == true){
            // this.rigidbody.linearVelocity.y.toFixed(3) == 0
            if((this.state != State.Jump || this.state != State.Drop) && this.rigidbody.linearVelocity.y.toFixed(3) == 0){
                this.onJump();
            }else if (this.bonusJump < this.bonusJumpMax && this.rigidbody.linearVelocity.y < 0){
                this.bonusJump++;
                this.rigidbody.linearVelocity = new cc.Vec2(window.game.speed,this.jumpSpeedBonus);
                this.state = State.Jump;
                cc.audioEngine.playEffect(this.jumpAudio);
            }else if(this.rigidbody.linearVelocity.y < 0){
                this.cacheJump = true;
            }
        }
    },

    onJump(){
        this.cacheJump = false;
        this.bonusJump=0;
        if(window.game.speed < window.game.speedMax){
            window.game.speed += window.game.speedDamping;
        }
        this.rigidbody.linearVelocity = new cc.Vec2(window.game.speed,this.jumpSpeed);
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
                window.game.game.gameOver();
                cc.audioEngine.playEffect(this.diedAudio);
                break;
            }
            case 'ground': {
                if(this.cacheJump){
                    this.onJump();
                }else{
                    this.rigidbody.linearVelocity = new cc.Vec2(window.game.speed,0);
                    this.state = State.Run;
                }
                break;
            }
            case 'tutorial':{
                this.cacheJump = true;
                window.game.game.showTurorial();
            }
            default:
                break;

        }
    },
    pause(){
        this.faker = cc.instantiate(this.fakerPrefab);
        this.faker.parent = this.node.parent;
        this.faker.position = this.node.position;

        this.node.active = false;
        this.state = State.Idel;
    },

    unpause(){
        this.node.active = true;
        this.state = State.Run; 
        this.faker.destroy();
    },
});
