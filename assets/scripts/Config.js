
window.localize = {
    data: {
        'en':{
            'title':'TRY YOUR LUCK WITH THE',
            'name':'LUCKY WHEEL',
            'guide_title':'You have 01 spinning turn',
            'popup_quit_title':'Keep patience',
            'popup_quit_body':'{0} Biggy reward \nis waiting for you!',
            'continue':'Continue',
            'exit':'Exit',
            'congrat':'Congrats!',
            'score_detail':'You are won {0} Biggy in total in this stage.',
            'score':'Score:',
            'high_score':'High score:',
            'play_again':'Play again',
            'claim_reward':'Claim reward',
            'start':'START',
            'tutorial':'Tap to jump!'
        },
        'vi':{
            'title':'HÃY THỬ VẬN MAY CỦA BẠN',
            'name':'VÒNG XOAY MAY MẮN',
            'guide_title':'Bạn có 1 lượt để quay',
            'popup_quit_title':'Hãy kiên nhẫn',
            'popup_quit_body':'Phần thưởng {0} Biggy\nđang chờ bạn đó.',
            'continue':'Chơi tiếp',
            'exit':'Dừng lại',
            'congrat':'Xin chúc mừng',
            'score_detail':'Bạn đã dành được {0} Biggy, Nhận thưởng ngay.',
            'score':'Điểm:',
            'high_score':'Điểm cao:',
            'play_again':'Chơi lại',
            'claim_reward':'Nhận thưởng',
            'start':'BẮT ĐẦU',
            'tutorial':'Chạm để nhảy!'
        },
    },

    languge : 'vi',

    text: function (key) {
        return this.data[this.languge][key];
    },

    textFormat: function(key, array){
        var _value = this.data[this.languge][key];
        for(var i = 0; i < array.length; i++){
            _value=_value.replace('{' + i + '}' ,array[i]);
        }
        return _value;
    }
}

window.config = {
    max_score: 5,
}

window.game = {
    HEIGHT_MAX : 100,
    hero: {
        default: null,
        type: require('Hero')
    },
    game: {
        default: null,
        type: require('GameControl')
    },
    ground: {
        default: null,
        type: require('Ground')
    },
    state: -1, // 1 : play, 0 : pause
    speed: 300,
    speedMax: 1100,
    speedDamping: 35,
    score: 0,
    high_score: 0,
    score_over: 5000,
    heart: 3,
    tutorial: false,
}