
cc.Class({
    extends: cc.Component,

    properties: {

        groundPrefab: {
            default: [],
            type: [cc.Prefab]
        },
        groundWidth: [cc.Integer],
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
        speedMax: 1300,
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

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        console.log(window.location.href);
        var search = this.getUrlVars();
        console.log(search);
        window.localize.languge = search['lang'] == null? 'vi' : search['lang'];
        window.config.max_score = search['max_score'] == null? 5 : Number(search['max_score']);
        window.game.game = this;
        this.uiStart.active = true;
    },

    getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    },

    onClickStart(){
        this.startGround.destroy();
        this.startGround = null;

        this.uiStart.destroy();
        this.uiStart = null;
        this.onStartGame();
    },
    onStartGame(){
        window.game.speed = this.initSpeed;
        window.game.hero.init();
        window.game.state = 1;
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
        this.spawnGround(0, 0, 0);
    },

    spawnNextGround(){
        var height = Math.random() * window.game.HEIGHT_MAX - 50;
        var index = Math.round (Math.random() * (this.groundPrefab.length - 2)) + 1;
        // if(index == this.oldIndex && index != 1){
        //     index--;
        // }
        /// caculator meta
        var maxDistance = this.getMaxDistance();
        var minDistance = maxDistance - this.groundWidth[index] - this.groundWidth[this.oldIndex] + 150;;
        if(height > this.oldHeight && maxDistance > 400){
            maxDistance -= 300;
        }
        var offset = 200;
        if(maxDistance > 200){
            minDistance = Math.max(minDistance, 200);
            offset = Math.random() * (maxDistance - minDistance)+ minDistance; 
        }
        /// spawn
        this.spawnGround(offset, index, height);
    },

    spawnGround(offset, index, height){
        let ground = cc.instantiate(this.groundPrefab[index]);
        ground.parent = this.groundRoot;
        var width = this.groundWidth[index];
        this.pos = this.pos + offset;
        ground.getComponent('Ground').init(this.pos, height);
        this.groundActive.push(ground);
        this.pos = this.pos + width;
        this.oldHeight = height;
        this.oldIndex = index;
        // console.log('spawn ground: ' + index + ', ' + this.pos);
        // console.log(ground);
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
        if(window.game.state == 1){
            if((this.groundActive[0].x + this.groundActive[0].width + 700) < window.game.hero.node.x ){
                this.despawnGround(this.groundActive[0])
            }
            if(window.game.speed < this.speedMax){
                window.game.speed += this.speedDamping * dt;
            }
            window.game.score = window.game.hero.node.x.toFixed(0);
            this.speedlabel.string =window.localize.text('score') + ' ' + window.game.score;
            // this.speedlabel.string =this.speedlabel.string + ' ,speed ' + window.game.speed.toFixed(0);
        }
    },
    
    gameOver(){
        window.game.state = -1;
        this.popupWin.active = true;
    },

    onBack(){
        this.popupQuit.active = true;
    },
});
