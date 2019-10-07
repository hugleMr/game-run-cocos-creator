
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
        },
        popupQuit:{
            default:null,
            type:cc.Node
        },
        popupWin:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        console.log(window.location.href);
        var search = this.getUrlVars();
        console.log(search);
        this.lang = search['lang'] == null? 'vi' : search['lang'];
        this.max_score = search['max_score'] == null? 5 : Number(search['max_score']);
        console.log('lang: ' + this.lang);
        console.log('max_score: ' + this.max_score);

        window.game.game = this;
    },

    start () {
       
    },

    getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    },

    onStartGame(){
        if(this.startGround != null)
        {
            this.startGround.destroy();
            this.startGround = null;
        }
        this.uiStart.active = false;
        window.game.speed = this.initSpeed;
        window.game.hero.init();
        window.game.isPlay = true;
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
        this.spawnGround(0, window.game.WIDTH_TILE * 5, 0);
    },

    spawnNextGround(){
        var height = Math.random() * window.game.HEIGHT_MAX;
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
        minWidth = Math.max(minWidth, window.game.WIDTH_TILE);
        var maxWidth = jumpDistance - offset + 600;
        var width = Math.random() * (maxWidth - minWidth) + minWidth;
        width = Math.round (width / window.game.WIDTH_TILE) * window.game.WIDTH_TILE;
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
        return window.game.speed * window.game.hero.jumpTime;
    },

    despawnGround (ground) {
        this.groundActive.shift();
        ground.destroy();
        this.spawnNextGround();
    },

    update (dt) {
        if(window.game.isPlay == true){
            if((this.groundActive[0].x + this.groundActive[0].getComponent('Ground').width + 700) < window.game.hero.node.x ){
                this.despawnGround(this.groundActive[0])
            }
            if(window.game.speed < this.speedMax){
                window.game.speed += this.speedDamping * dt;
            }
            this.speedlabel.string =window.localize.text('score') + ' ' + window.game.hero.node.x.toFixed(0);
            window.game.score = window.game.hero.node.x.toFixed(0);
        }
    },
    
    gameOver(){
        window.game.isPlay = false;
        this.popupWin.active = true;
    },

    onBack(){
        this.popupQuit.active = true;
    },
});
