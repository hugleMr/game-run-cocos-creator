
cc.Class({
    extends: cc.Component,

    properties: {
        en: {
            default: null, 
            type: cc.SpriteFrame,
        },
        
    },

    onEnable(){
        if(window.localize.languge == 'en')
            this.getComponent(cc.Sprite).spriteFrame = this.en;
    },
});
