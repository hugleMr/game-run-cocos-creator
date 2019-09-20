import {instance} from 'Config';


cc.Class({
    extends: cc.Component,

    properties: {

        groundPrefab: {
            default: null,
            type: cc.Prefab
        },
        groundRoot:{
            default: null,
            type: cc.Node
        },

        startGround:{
            default:null,
            type: cc.Node
        },

        uiStart:{
            default:null,
            type:cc.Node
        },

        initSpeed: 300,
        speedDamping: 50,
        speedMax: 1500,
        speedlabel:{
            default: null,
            type: cc.Label
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        instance.game = this;
    },

    start () {
    },

    onStartGame(){
        if(this.startGround != null)
        {
            this.startGround.destroy();
            this.startGround = null;
        }
        this.uiStart.active = false;
        instance.speed = this.initSpeed;
        instance.hero.init();
        instance.isPlay = true;
        for(var i in this.groundActive)
        {
            this.groundActive[i].destroy();
        }
        this.groundActive = new Array();
        this.spawnFistGround();
        this.spawnNextGround();
        this.spawnNextGround();
        this.spawnNextGround();
    },

    spawnFistGround(){
        this.groundRoot.setPosition(new cc.v2(0, 0));
        this.pos = -700;
        this.spawnGround(0, instance.WIDTH_TILE * 5, 0);
    },

    spawnNextGround(){
        var height = Math.random() * instance.HEIGHT_MAX;
        /// caculator meta
        var jumpDistance = this.getMaxDistance();
        var offset = Math.random() * (jumpDistance - 200)+ 200;
        var minWidth = 0;
        if(height > this.oldHeight){
            offset -= height - this.oldHeight;
            minWidth = jumpDistance - offset;
        }else{
            minWidth = jumpDistance - offset + this.oldHeight - height;
        }
        minWidth = Math.max(minWidth, instance.WIDTH_TILE);
        var maxWidth = jumpDistance - offset + 600;
        var width = Math.random() * (maxWidth - minWidth) + minWidth;
        width = Math.round (width / instance.WIDTH_TILE) * instance.WIDTH_TILE;
        /// spawn
        this.spawnGround(offset, width, height);
    },
    spawnGround(offset, width, height){
        this.pos += offset + width / 2;
        let ground = cc.instantiate(this.groundPrefab);
        ground.parent = this.groundRoot;
        ground.getComponent('Ground').init(width, this.pos, height);
        this.groundActive.push(ground);
        this.pos += width / 2;
        this.oldHeight = height;
        console.log('spawn ground: ')
        console.log(ground);
    },

    getMaxDistance(){
        return instance.speed * instance.hero.jumpTime;
    },

    despawnGround (ground) {
        this.groundActive.shift();
        ground.destroy();
        this.spawnNextGround();
    },

    update (dt) {
        if(instance.isPlay == true){
            if((this.groundActive[0].x + this.groundActive[0].getComponent('Ground').width + 700) < instance.hero.node.x ){
                this.despawnGround(this.groundActive[0])
            }
            if(instance.speed < this.speedMax){
                instance.speed += this.speedDamping * dt;
                this.speedlabel.string = 'Speed: ' + instance.speed.toFixed(0);
            }
        }
    },
    
    gameOver(){
        instance.isPlay = false;
        this.uiStart.active = true;
    }
});
