
cc.Class({
    extends: cc.Component,

    properties: {
        txtBiggy:{
            default: null,
            type: cc.Label
        },
        txtScore:{
            default: null,
            type: cc.Label
        },
        txtHighScore:{
            default: null,
            type: cc.Label
        },
        guide:{
            default: null,
            type: cc.Node
        },
        btnReward:{
            default: null,
            type: cc.Node
        },
        btnRetryAndReward:{
            default: null,
            type: cc.Node
        },
        heart:{
            default: [],
            type: [cc.Node]
        },
    },

    // onLoad () {},

    // update (dt) {},


    onEnable () {
        if(window.game.high_score < window.game.score){
            window.game.high_score = window.game.score;
        }
        this.biggy = Math.min(window.config.max_score, this.caculationBiggy(window.game.high_score));
        this.txtBiggy.string = window.localize.textFormat('score_detail', [this.biggy]);
        this.txtScore.string = window.game.score;
        this.txtHighScore.string = window.game.high_score;
        this.guide.scaleX = 0.0;
        this.guide.scaleY = 0.0;
        this.guide.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut(),),);

        for(var i = 0; i < this.heart.length; i++){
            if(i< window.game.heart){
                this.heart[i].color = new cc.Color(255, 0, 0,255);
            }else{
                this.heart[i].color = new cc.Color(230, 230, 230,255);
            }
        }
        if(this.biggy == window.config.max_score || window.game.heart <= 0){
            this.btnRetryAndReward.active = false;
            this.btnReward.active = true;
        }else{
            this.btnRetryAndReward.active = true;
            this.btnReward.active = false;
        }
    },

    caculationBiggy(score){
        if(score < 2000){
            return 1;
        } else if(score < 3000){
            return 2;
        }else if(score < 4000){
            return 3;
        }else if(score < 5000){
            return 4;
        } else {
            return window.config.max_score;
        }
    },

    onReward(){
        this.node.active = false;
        callGameComplete(this.biggy);
    },
    onRetry(){
        this.guide.runAction(cc.scaleTo(0.25, 0, 0).easing(cc.easeQuadraticActionOut()));
        setTimeout(() => {
            this.node.active = false;
            window.game.game.onStartGame();
        }, 250);
    }
});
