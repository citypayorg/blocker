const CONFIG = require('./config')
// var db_config = require(__dirname + '/common/database.js');// 2020-10-18
// var _addimage = getPreChatLog(null, function(_result){_addimage = _result; }); //

// function getPreChatLog(_param, callback){
//   var conn = db_config.init();
//   db_config.connect(conn);
//   // var sql = "SELECT GROUP_CONCAT(id) as preload_img FROM users WHERE avata = 'Y'"; // _param
//   var sql = "SELECT id as preload_img FROM users WHERE avata = 'Y'"; 
//   conn.query(sql, function(err, rows){
//     if (err){ 
//       throw err;
//     }
//     var _imgLog = "";
//     if(rows.length>0){
//       for(var i=0; i<rows.length; i++)
//       { 
//         _imgLog = _imgLog +"GAME.load.image('hero"+i+"', '/public/dist/asset/image/upload/'"+rows[i].id+"'.png', 46, 46)";
//       }
//     }
//     return callback(_imgLog);
//   });
// }

// load all game assets
let Load = function (GAME) {}
Load.prototype = {

  setPreloadingBg: function () {
    GAME.stage.backgroundColor = CONFIG.screenColor
  },

  setPreloadingImage: function () {
    let preloadingBorder = GAME.add.sprite(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 + 30,
      'loadingBorder'
    )
    preloadingBorder.x -= preloadingBorder.width / 2
    preloadingBorder.alpha = 0.5

    let preloading = GAME.add.sprite(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 + 30,
      'loading'
    )
    preloading.x -= preloading.width / 2

    GAME.load.setPreloadSprite(preloading)
  },

  setPreloadingTitle: function () {
    const title = GAME.add.text(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2 - 40,
      'Blocker', {
        font: '50px ' + CONFIG.mainFontFamily,
        fill: '#545454'
      }
    )

    const subTitle = GAME.add.text(
      WINDOW_WIDTH / 2,
      WINDOW_HEIGHT / 2,
      'Multiplayer online game using Phaser + WebSocket (Socket.IO)', {
        font: '16px ' + CONFIG.mainFontFamily,
        fill: '#65655b'
      }
    )

    title.anchor.setTo(0.5, 1)
    subTitle.anchor.setTo(0.5, 1)
  },

  preload: function () {
    this.setPreloadingBg()
    this.setPreloadingImage()
    this.setPreloadingTitle()

    // map
    GAME.load.tilemap('mapTile', CONFIG.assetPath + '/image/map.json', null, Phaser.Tilemap.TILED_JSON)
    GAME.load.image('map', CONFIG.assetPath + '/image/map.png', 46, 46)

    // creature
    GAME.load.spritesheet('zombie', CONFIG.assetPath + '/image/monster/zombie.png', 46, 46)
    GAME.load.spritesheet('machine', CONFIG.assetPath + '/image/monster/machine.png', 46, 46)
    GAME.load.spritesheet('bat', CONFIG.assetPath + '/image/monster/bat.png', 46, 46)
    GAME.load.spritesheet('hero', CONFIG.assetPath + '/image/hero.png', 46, 46)

    // particle
    GAME.load.image('dashParticle', CONFIG.assetPath + '/image/particle/dash.png')
    GAME.load.image('damageParticle', CONFIG.assetPath + '/image/particle/damage.png')
    GAME.load.image('recoverParticle', CONFIG.assetPath + '/image/particle/recover.png')

    // misc
    GAME.load.image('shadow', CONFIG.assetPath + '/image/misc/shadow.png')

    // weapon
    GAME.load.spritesheet('handsWeapon', CONFIG.assetPath + '/image/weapon/hands.png', 80, 70)
    GAME.load.spritesheet('laserTurretWeapon', CONFIG.assetPath + '/image/weapon/laser-turret.png', 52, 46)
    GAME.load.spritesheet('wingsWeapon', CONFIG.assetPath + '/image/weapon/wings.png', 46, 84)
    GAME.load.spritesheet('bowWeapon', CONFIG.assetPath + '/image/weapon/bow.png', 160, 160)

    // bullet
    GAME.load.image('laserBullet', CONFIG.assetPath + '/image/bullet/laser.png')
    GAME.load.image('arrowBullet', CONFIG.assetPath + '/image/bullet/arrow.png')
    // _addimage
  },

  create: function () {
    GAME.state.start('Play')
  }
}

module.exports = Load
