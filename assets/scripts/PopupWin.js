
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
        guide:{
            default: null,
            type: cc.Node
        }
    },

    // onLoad () {},

    // update (dt) {},


    onEnable () {
        this.biggy = Math.min(window.config.max_score, this.caculationBiggy());
        this.txtBiggy.string = window.localize.textFormat('score_detail', [this.biggy]);
        this.txtScore.string = window.game.score;
        this.guide.scaleX = 0.0;
        this.guide.scaleY = 0.0;
        this.guide.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()));
    },

    caculationBiggy(){
        if(window.game.score < 2000){
            return 1;
        } else if(window.game.score < 4000){
            return 2;
        }else if(window.game.score < 8000){
            return 3;
        }else if(window.game.score < 16000){
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
