
export const instance = {
    WIDTH_TILE : 235,
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
    isPlay: false,
    speed: 300,
}