
cc.Class({
    extends: cc.Component,

    properties: {
        txtQuitMessage:{
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
        if(window.game.state == 1){
            window.game.state = 0;
            window.game.hero.pause();
        }
        this.txtQuitMessage.string = window.localize.textFormat('popup_quit_body', [window.config.max_score]);
        this.guide.scaleX = 0.0;
        this.guide.scaleY = 0.0;
        this.guide.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()));
    },

    onQuit(){
        this.node.active = false;
        callGameQuit();
    },
    onContinue(){
        this.guide.runAction(cc.scaleTo(0.25, 0, 0).easing(cc.easeQuadraticActionOut()));
        setTimeout(() => {
            this.closePopup();
        }, 250);
    },
    closePopup(){
        this.node.active = false;
        if(window.game.state == 0){
            window.game.state = 1;
            window.game.hero.unpause();
        }
    }
});
