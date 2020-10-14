/**
 * Server entry file
 */

const EXPRESS = require('express')
const APP = EXPRESS()
const PATH = require('path')
const SHORTID = require('shortid')
const SERVER = require('http').Server(APP)
const IO = require('socket.io')(SERVER)
const UTIL = require('./common/util')
const GUTIL = require('./common/gutil')
const CONFIG = require('./common/config')
const mapJson = require('./public/src/asset/image/map.json')
const MODULE = require('./common/module')
const Vector = MODULE.Vector
const CreatureInfo = MODULE.CreatureInfo
let VTMAP = {}

const SERVER_PORT = CONFIG.serverPort
const EVENT_NAME = CONFIG.eventName
const STATIC_PATH = PATH.join(__dirname, '/public')
const COMMON_PATH = PATH.join(__dirname, '/common')
const SERVER_HEARTBEAT = 500 // 0.5 초로변경
// const IS_DEBUG = CONFIG.isDebug

/** @type {Array.CreatureInfo} */
let ZOMBIE_INFOS = []

/** @type {Array.CreatureInfo} */
let MACHINE_INFOS = []

/** @type {Array.CreatureInfo} */
let BAT_INFOS = []

/** @type {Array.CreatureInfo} */
let PLAYER_INFOS = []

/* ================================================================ App & Init
 */

initVirtualMap()
initMonsters()

// disable bot (for now)
// initBots();

// Set static file
APP.use('/public', EXPRESS.static(STATIC_PATH))
APP.use('/common', EXPRESS.static(COMMON_PATH))

APP.get('/', function (req, res) {
  //res.sendFile(STATIC_PATH + '/index.html')
  res.sendFile(STATIC_PATH + '/login.html')
})


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////// 2020-09-19 추가 ///////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//npm install mysql
//npm install --save express-session
//npm install --save cookie-parser
//npm install --save express-error-handler
//npm install --save md5
// npm install ejs
var user_id="";
var user_nick="";
var user_avata="";
var db_config = require(__dirname + '/common/database.js');// 2020-09-13
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');  
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
// var router = EXPRESS.Router();
// let ejs = require('ejs'); // 2020-10-11
// let fs  = require('fs'); // 2020-10-11

// 화면 engine을 ejs로 설정
// APP.set('view engine', 'ejs');
// APP.engine('html', require('ejs').renderFile);

APP.use(bodyParser.urlencoded({extended:false}));
APP.use(bodyParser.json());
APP.use(cookieParser());
APP.use(expressSession({
    secret :'mysecretKey!23',
    resave : true,
    saveUninitialized :true
    }));


// post 로 넘어 오면 !!! 게임
APP.post('/', function (req, res) {
  console.log('/process/login2 라우팅 함수 연결...');
  var md5 = require('md5');
  var param_username = req.body.username;
  var param_password = req.body.password;
  console.log('요청 파라미터 >> username : '+param_username);

  var conn = db_config.init();//2020-09-13
  db_config.connect(conn);
  var sql = "SELECT * FROM users WHERE username ='"+param_username+"' and password ='"+md5(param_password)+"'";
  //var sql = "SELECT * FROM users WHERE username='"+param_username+"'";
  //console.log( 'select ok - ' + sql);
  conn.query(sql, function (err, rows, fields) 
  {
    if(err){
        console.log('query is not excuted. select fail...\n' + err);
        res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
        res.end("<h1>error. query is not excuted </h1>"); 
        res.sendFile(STATIC_PATH + '/login.html')
    }
    else {
      //res.render('list.ejs', {list : rows});
      //console.log( 'select ok - ' + sql);
      //for(var i=0; i<rows.length; i++){ console.log(i+':i / '+rows[i].username +'-'+ rows[i].CTP_address +'-'+ rows[i].id +'-'+ rows[i].nick); }
      if(rows.length>0){
        user_id     = rows[0].id;
        user_nick   = rows[0].nick;
        user_avata  = rows[0].avata;
        var user_ip = req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||req.socket.remoteAddress ||req.connection.socket.remoteAddress;
        var sql2 = " "; 
        sql2 = sql2 + " INSERT INTO `tbl_game`(`game_idx`, `user_idx`, `user_coin`, `coin_address`, `yyyymmdd`, `ip`) ";
        sql2 = sql2 + " VALUES (1,?,'CTP',?,CURDATE()+0,?) ";
        sql2 = sql2 + " ON DUPLICATE KEY UPDATE minuteCnt = minuteCnt + 1  ";
        var params = [rows[0].id, rows[0].CTP_address, user_ip];
        conn.query(sql2, params, function(err, rows2, fields2){
          if(err){
            console.log(err);
          } else {
            console.log('merge success !!!!');
            console.log(rows2);
          }
        });
        // login 성공
        // res.sendFile(STATIC_PATH + '/index.html');
        // 2020-10-12 FSO 를 사용 하면 Error [ERR_STREAM_WRITE_AFTER_END]: write after end 이슈가 있어 index.html 을 서버단으로 빼고 new-line 제거
        res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
        res.end(indexPage(user_id,user_nick,user_avata)); 

        // res.statusCode = 302;
        // res.setHeader("Location", "/index");
        // res.end();
        // 2020-10-11 추가 npm install new-line
        //  https://stackoverflow.com/questions/33027089/res-sendfile-in-node-express-with-passing-data-along
        //###############################################################
        // const Transform = require('stream').Transform;
        // const parser = new Transform();
        // const newLineStream = require('new-line');
        
        // parser._transform = function(data, encoding, done) {
        //   const str = data.toString().replace('</body>', '<input type="hidden" id="user_id" value="'+user_id+'"><input type="hidden" id="user_nick" value="'+user_nick+'"><input type="hidden" id="user_avata" value="'+user_avata+'"></body>');
        //   this.push(str);
        //   done();
        // };
        // 2020-10-11 npm install ejs
        //################################################################
      }else{
        res.end("<h1>password maybe wrong</h1>"); 
        res.sendFile(STATIC_PATH + '/login.html')
      }
    }
  });
})


//################################################################
// 2020-10-11 
//################################################################
// const Transform = require('stream').Transform;
// const parser = new Transform();
// const newLineStream = require('new-line');

// APP.use('/index', (req, res) => {
//   indexPage(_user_id,_user_nick,_user_avata)
//   // parser._transform = function(data, encoding, done) {
//   //   const str = data.toString().replace('</body>', '<input type="hidden" id="user_id" value="'+user_id+'"><input type="hidden" id="user_nick" value="'+user_nick+'"><input type="hidden" id="user_avata" value="'+user_avata+'"></body>');
//   //   this.push(str);
//   //   done();
//   // };
//   // res.write('<!-- Begin stream -->\n');
//   // fs
//   // .createReadStream('./public/index.html')
//   // .pipe(newLineStream())
//   // .pipe(parser)
//   // .on('end', () => {
//   //     res.write('\n<!-- End stream -->')
//   // }).pipe(res);
// });
//################################################################



// router.route('/').post(function(req, res)
// {
  
// });

// APP.get('/process/login2', function (req, res) {
//   res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
// 	res.end("<h1>Express 서버에서 " + req.user + " 응답한 결과입니다</h1>"); 
// })
      
var errorHandler = expressErrorHandler({
  static :{'404':'./public/404.html'}
});
//////////////////////////////////////////////////////
// const expressip = require('express-ip');  // npm install express-ip
// app.use(expressip().getIpInfoMiddleware);
// const ipInfo = req.ipInfo;
// var message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;

//var conn = db_config.init();//2020-09-13
//app.get('/list', function (req, res) {
//    var sql = 'SELECT * FROM BOARD';    
//    conn.query(sql, function (err, rows, fields) {
//        if(err) console.log('query is not excuted. select fail...\n' + err);
//        else res.render('list.ejs', {list : rows});
//    });
//});
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////// 2020-09-19 추가 end ///////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


SERVER.listen(SERVER_PORT, function (err) {
  if (err) {
    throw err
  } else {
    UTIL.serverLog('Listening on port: ' + SERVER_PORT)
  }
})

/* ================================================================ Socket util
 */

/**
 * Get number of client connection by checking io connection
 *
 * @see http://stackoverflow.com/questions/10275667/socket-io-connected-user-count
 *
 * @returns {number}
 */
function getNumberOfConnection () {
  return IO.engine.clientsCount
}

/* ================================================================ Init
 */

/**
 * Initial virtual map
 * 1: layer 1 - bush
 * 2: layer 0 - ground
 * 3: layer 1 - rock
 * 4: layer 2 - tree
 * 5: layer 0 - well
 * 6: layer 0 - fire
 */
function initVirtualMap () {
  // VTMAP
  VTMAP.mapTileWidth = mapJson.tilewidth
  VTMAP.mapTileHeight = mapJson.tileheight
  VTMAP.nTileWidth = mapJson.width
  VTMAP.nTileHeight = mapJson.height
  VTMAP.data = UTIL.creature2DArray(
    VTMAP.nTileWidth,
    VTMAP.nTileHeight,
    0
  )

  // row
  for (let i = 0; i < VTMAP.nTileHeight; i++) {
    // column
    for (let j = 0; j < VTMAP.nTileWidth; j++) {
      var idx = i * VTMAP.nTileWidth + j

      // floor
      var tmp1 = mapJson.layers[0].data[idx]
      if (tmp1 === 5 || tmp1 === 6) VTMAP.data[i][j] = tmp1

      // stone
      var tmp2 = mapJson.layers[1].data[idx]
      if (tmp2 === 1 || tmp2 === 3) VTMAP.data[i][j] = tmp2
    }
  }
}

/**
 * Initial monster
 * - zombie
 * - machine
 * - bat
 *
 * @todo n of init monster should be in config
 */
function initMonsters () {
  // const nZombies = 8
  // const nMachines = 8
  // const nBats = 8
  const nZombies = 1
  const nMachines = 1
  const nBats = 1

  //########### 미니맵 ###########
  for (let i = 0; i < nZombies; i++) {
    let creatureInfo = getNewZombieInfo()
    ZOMBIE_INFOS.push(creatureInfo)
  }

  for (let i = 0; i < nMachines; i++) {
    let creatureInfo = getNewMachineInfo()
    MACHINE_INFOS.push(creatureInfo)
  }

  for (let i = 0; i < nBats; i++) {
    let creatureInfo = getNewBatInfo()
    BAT_INFOS.push(creatureInfo)
  }
}

/**
 * Initial bot player
 * - stay
 *
 * @todo move nBots to config
 */
function initBots () { // eslint-disable-line
  const nBots = 4

  for (let i = 0; i < nBots; i++) {
    var heroInfo = getNewPlayerInfo()
    PLAYER_INFOS.push(heroInfo)
  }
}

/* ================================================================ Game
 */

/**
 * Get new CreatureInfo of zombie
 *
 * @returns {CreatureInfo}
 */
function getNewZombieInfo () {
  return getNewCreatureInfo('zombie', 100, 4, 6)
}

/**
 * Get new CreatureInfo of machine
 *
 * @returns {CreatureInfo}
 */
function getNewMachineInfo () {
  return getNewCreatureInfo('machine', 0, 5, 5)
}

/**
 * Get new CreatureInfo of bat
 *
 * @returns {CreatureInfo}
 */
function getNewBatInfo () {
  return getNewCreatureInfo('bat', 120, 3, 3)
}

/**
 * Get new CreatureInfo of hero
 *
 * @returns {CreatureInfo}
 */
function getNewPlayerInfo () {
  return getNewCreatureInfo('hero', 200, 3, 8)
}

/**
 * Get new creature info
 *
 * @param {string} type
 * @param {number} life
 * @param {number} maxLife
 * @returns {CreatureInfo}
 */
function getNewCreatureInfo (type, velocitySpeed, life, maxLife) {
  const creatureId = getUniqueCreatureId()
  const startVector = getRandomStartCreatureVector()
  const creatureInfo = new CreatureInfo(creatureId, type, startVector, velocitySpeed, life, maxLife)

  return creatureInfo
}

/**
 * Get random walkable creature position
 *
 * @param {Position|Vector} currentPos
 * @param {number} minimumDistance
 * @returns {Position}
 */
function getRandomWalkableCreaturePosition (currentPos, minimumDistance) { // eslint-disable-line
  if (typeof minimumDistance === 'undefined') minimumDistance = 0

  let targetPos = {}
  let distance = 0
  let isNotOk = true

  while (isNotOk) {
    targetPos = getCreaturePositionByExclusion([1, 3, 5, 6])
    distance = UTIL.getDistanceBetween(currentPos, targetPos)

    if (distance >= minimumDistance) {
      isNotOk = false
    }
  }

  return targetPos
}

/**
 * Get random start creature position
 * not be allowed at
 * - fire
 * - bush
 * - well
 * - stone
 *
 * @returns {Position} start position
 */
function getRandomStartCreaturePosition () {
  return getCreaturePositionByExclusion([1, 3, 5, 6])
}

/**
 * Get random start creature vector
 * not be allowed at
 * - fire
 * - bush
 * - well
 * - stone
 *
 * @returns {Vector} start vector
 */
function getRandomStartCreatureVector () {
  const startPosition = getRandomStartCreaturePosition()
  const startRotation = GUTIL.getRandomRotation()
  const startVector = new Vector(startPosition.x, startPosition.y, startRotation)

  return startVector
}

/**
 * Get random creature position (real x, y in map)
 * by excluding given `arr`
 *
 * note
 * it's work, if all creature sprites is not over than
 * mapTileWidth and mapTileHeight
 *
 * @param {Array.number} arr - Array of tile index that you do not want
 * @returns {Position} return position (middle of tile)
 */
function getCreaturePositionByExclusion (arr) {
  const nTileWidth = VTMAP.nTileWidth
  const nTileHeight = VTMAP.nTileHeight
  const tileWidth = VTMAP.mapTileWidth
  const tileHeight = VTMAP.mapTileHeight
  let tileIndexX
  let tileIndexY
  let isNotOk = true

  while (isNotOk) {
    tileIndexX = UTIL.getRandomInt(0, nTileWidth - 1)
    tileIndexY = UTIL.getRandomInt(0, nTileHeight - 1)

    // if the tile value is not be contained in
    if (arr.indexOf(VTMAP.data[tileIndexY][tileIndexX]) === -1) {
      isNotOk = false
    }
  }

  const middlePos = GUTIL.convertTileIndexToPoint(
    tileIndexX,
    tileIndexY,
    tileWidth,
    tileHeight,
    true
  )

  return middlePos
}

/**
 * Reset creatureInfo
 * used for respawning only (server side only)
 *
 * @param {CreatureInfo} creatureInfo
 * @param {Vector} startVector
 * @returns {CreatureInfo} creatureInfo
 */
function resetCreatureInfo (creatureInfo, startVector) {
  creatureInfo.life = creatureInfo.initialLife
  creatureInfo.startVector = startVector
  creatureInfo.lastVector = startVector
  creatureInfo.autoMove = {}

  return creatureInfo
}

/**
 * Check the `creatureId` is already existing in the `creatureInfos`
 *
 * @param {string} creatureId
 * @param {Array.CreatureInfo} creatureInfos
 * @returns {boolean}
 */
function isDuplicateCreatureId (creatureId, creatureInfos) {
  let isDuplicated = false
  const n = creatureInfos.length

  for (let i = 0; i < n; i++) {
    var creatureInfo = creatureInfos[i]

    if (creatureInfo.id === creatureId) {
      isDuplicated = true
      break
    }
  }

  return isDuplicated
}

/**
 * Get unique creature id
 *
 * @returns {string}
 */
function getUniqueCreatureId () {
  let creatureId
  let isDuplicated = true

  while (isDuplicated) {
    creatureId = SHORTID.generate()

    if (!isDuplicateCreatureId(creatureId, ZOMBIE_INFOS) &&
      !isDuplicateCreatureId(creatureId, MACHINE_INFOS) &&
      !isDuplicateCreatureId(creatureId, BAT_INFOS) &&
      !isDuplicateCreatureId(creatureId, PLAYER_INFOS)) {
      isDuplicated = false
    }
  }

  return creatureId
}

/**
 * Get playerInfo index by id
 *
 * @param {string} playerId
 * @returns {number} return integer number when it's found (return -1, if not found)
 */
function getPlayerInfoIndexById (playerId) {
  const nPlayers = PLAYER_INFOS.length

  for (let i = 0; i < nPlayers; i++) {
    if (PLAYER_INFOS[i].id === playerId) {
      return i
    }
  }

  UTIL.serverBugLog('getPlayerInfoIndexById', 'Not found playerId', playerId)

  return -1
}

/**
 * Get monsterInfo index
 *
 * @param {string} monsterId
 * @param {Array} monsterInfos
 * @returns {number} return integer number when it's found (return -1, if not found)
 */
function getMonsterInfoIndex (monsterId, monsterInfos) {
  const nMonsters = monsterInfos.length

  for (let i = 0; i < nMonsters; i++) {
    if (monsterInfos[i].id === monsterId) {
      return i
    }
  }

  UTIL.serverBugLog('getMonsterInfoIndex', 'Not found monsterId', monsterId)

  return -1
}

/**
 * Check this player is already
 * exists in the server
 *
 * @param {string} playerId
 * @returns {boolean}
 */
function isExistingPlayer (playerId) { // eslint-disable-line
  return (getPlayerInfoIndexById(playerId) > -1)
}

/**
 * Remove player out of PLAYER_INFOS
 *
 * @param {string} playerId
 * @returns
 */
function removePlayer (playerId) {
  const playerIdx = getPlayerInfoIndexById(playerId)

  if (playerIdx > -1) {
    PLAYER_INFOS.splice(playerIdx, 1)

    return true
  }

  return false
}

/* ================================================================ Socket
 */

IO.on('connection', function (socket) {
  const socketId = socket.id
  let playerInfo = getNewPlayerInfo()
  
  //#############################################
  if(user_nick!=null){ playerInfo.id = user_nick; }
  //#############################################
  
  UTIL.serverLog(playerInfo.id + ' is connect')

  // disconnect
  socket.on('disconnect', function () {
    UTIL.serverLog(playerInfo.id + ' is disconnect')

    // remove player
    removePlayer(playerInfo.id)

    // send disconnected player
    const data = {
      playerInfo: playerInfo
    }
    socket.broadcast.emit(EVENT_NAME.server.disconnectedPlayer, data)
  })

  // ready
  socket.on(EVENT_NAME.player.ready, function () {
    // data for new player
    const data1 = {
      VTMap: VTMAP,
      playerInfo: playerInfo,
      existingPlayerInfos: PLAYER_INFOS,
      zombieInfos: ZOMBIE_INFOS,
      machineInfos: MACHINE_INFOS,
      batInfos: BAT_INFOS
    }
    IO.sockets.connected[socketId].emit(EVENT_NAME.player.ready, data1)

    // add new player
    PLAYER_INFOS.push(playerInfo)

    // broadcast new player data
    // to existing players
    const data2 = {
      playerInfo: playerInfo
    }
    socket.broadcast.emit(EVENT_NAME.server.newPlayer, data2)
  })

  // ping
  socket.on(EVENT_NAME.player.ping, function () {
    IO.sockets.connected[socketId].emit(EVENT_NAME.player.ping)
  })

  // message
  // @todo refactor cause it has the same behavior
  // @todo define object structure somewhere
  socket.on(EVENT_NAME.player.message, function (data) {
    const { id, lastMessage, lastMessageTimestamp } = data
    const playerIdx = getPlayerInfoIndexById(id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx].lastMessage = lastMessage
      PLAYER_INFOS[playerIdx].lastMessageTimestamp = lastMessageTimestamp
      socket.broadcast.emit(EVENT_NAME.player.message, data)
    }
  })

  // move
  // @todo refactor cause it has the same behavior
  // @todo define object structure somewhere
  socket.on(EVENT_NAME.player.move, function (data) {
    const { id, lastVector } = data
    const playerIdx = getPlayerInfoIndexById(id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx].lastVector = lastVector
      socket.broadcast.emit(EVENT_NAME.player.move, data)
    }
  })

  // rotate
  // @todo refactor cause it has the same behavior
  // @todo define object structure somewhere
  socket.on(EVENT_NAME.player.rotate, function (data) {
    const { id, lastVector } = data
    const playerIdx = getPlayerInfoIndexById(id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx].lastVector = lastVector
      socket.broadcast.emit(EVENT_NAME.player.rotate, data)
    }
  })

  // fire
  // @todo refactor cause it has the same behavior
  // @todo define object structure somewhere
  socket.on(EVENT_NAME.player.fire, function (data) {
    const { id } = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(id)

    if (playerIdx > -1) {
      socket.broadcast.emit(EVENT_NAME.player.fire, data)
    }
  })

  // is damaged
  // @todo refactor cause it has the same behavior
  socket.on(EVENT_NAME.player.isDamaged, function (data) {
    const playerInfo = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(playerInfo.id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx] = playerInfo

      IO.sockets.connected[socketId].emit(EVENT_NAME.player.isDamagedItSelf, data)
      socket.broadcast.emit(EVENT_NAME.player.isDamaged, data)
    }
  })

  // is recovered
  // @todo refactor cause it has the same behavior
  socket.on(EVENT_NAME.player.isRecovered, function (data) {
    const { id, life } = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx].life = life

      IO.sockets.connected[socketId].emit(EVENT_NAME.player.isRecoveredItSelf, data)
      socket.broadcast.emit(EVENT_NAME.player.isRecovered, data)
    }
  })

  // is died
  // @todo refactor cause it has the same behavior
  socket.on(EVENT_NAME.player.isDied, function (data) {
    let playerInfo = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(playerInfo.id)

    if (playerIdx > -1) {
      // die event
      IO.sockets.connected[socketId].emit(EVENT_NAME.player.isDiedItSelf, data)
      socket.broadcast.emit(EVENT_NAME.player.isDied, data)

      // reset player info
      const newStartVector = getRandomStartCreatureVector()
      playerInfo = resetCreatureInfo(playerInfo, newStartVector)

      // update server data
      PLAYER_INFOS[playerIdx] = playerInfo

      // send data
      const newData = {
        playerInfo: playerInfo
      }
      IO.sockets.connected[socketId].emit(EVENT_NAME.player.isRespawnItSelf, newData)
      socket.broadcast.emit(EVENT_NAME.player.isRespawn, newData)
    }
  })

  // attack - zombie
  // @todo refactor
  socket.on(EVENT_NAME.player.attackZombie, function (data) {
    const { id, life } = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(id, ZOMBIE_INFOS)

    if (monsterIdx > -1) {
      ZOMBIE_INFOS[monsterIdx].life = life

      IO.emit(EVENT_NAME.player.attackZombie, data)
    }
  })

  // attack - machine
  // @todo refactor
  socket.on(EVENT_NAME.player.attackMachine, function (data) {
    const { id, life } = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(id, MACHINE_INFOS)

    if (monsterIdx > -1) {
      MACHINE_INFOS[monsterIdx].life = life

      IO.emit(EVENT_NAME.player.attackMachine, data)
    }
  })

  // attack - bat
  // @todo refactor
  socket.on(EVENT_NAME.player.attackBat, function (data) {
    const { id, life } = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(id, BAT_INFOS)

    if (monsterIdx > -1) {
      BAT_INFOS[monsterIdx].life = life

      IO.emit(EVENT_NAME.player.attackBat, data)
    }
  })

  // kill - zombie
  // @todo refactor
  socket.on(EVENT_NAME.player.killZombie, function (data) {
    let monsterInfo = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(monsterInfo.id, ZOMBIE_INFOS)

    if (monsterIdx > -1) {
      // die event
      IO.emit(EVENT_NAME.player.killZombie, data)

      // reset monster info
      var newStartVector = getRandomStartCreatureVector()
      monsterInfo = resetCreatureInfo(monsterInfo, newStartVector)

      // update server data
      ZOMBIE_INFOS[monsterIdx] = monsterInfo

      // send data
      // @todo check, we need this object ?
      const newData = { // eslint-disable-line
        monsterInfo: monsterInfo
      }
      IO.emit(EVENT_NAME.player.respawnZombie, data)
    }
  })

  // kill - machine
  // @todo refactor
  socket.on(EVENT_NAME.player.killMachine, function (data) {
    let monsterInfo = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(monsterInfo.id, MACHINE_INFOS)

    if (monsterIdx > -1) {
      // die event
      IO.emit(EVENT_NAME.player.killMachine, data)

      // reset monster info
      const newStartVector = getRandomStartCreatureVector()
      monsterInfo = resetCreatureInfo(monsterInfo, newStartVector)

      // update server data
      MACHINE_INFOS[monsterIdx] = monsterInfo

      // send data
      // @todo check, we need this object ?
      const newData = { // eslint-disable-line
        monsterInfo: monsterInfo
      }
      IO.emit(EVENT_NAME.player.respawnMachine, data)
    }
  })

  // kill - bat
  // @todo refactor
  socket.on(EVENT_NAME.player.killBat, function (data) {
    let monsterInfo = data.monsterInfo
    const monsterIdx = getMonsterInfoIndex(monsterInfo.id, BAT_INFOS)

    if (monsterIdx > -1) {
      // die event
      IO.emit(EVENT_NAME.player.killBat, data)

      // reset monster info
      const newStartVector = getRandomStartCreatureVector()
      monsterInfo = resetCreatureInfo(monsterInfo, newStartVector)

      // update server data
      BAT_INFOS[monsterIdx] = monsterInfo

      // send data
      // @todo check, we need this object ?
      const newData = { // eslint-disable-line
        monsterInfo: monsterInfo
      }
      IO.emit(EVENT_NAME.player.respawnBat, data)
    }
  })

  // attack - enemy
  socket.on(EVENT_NAME.player.attackEnemy, function (data) {
    const playerInfo = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(playerInfo.id)

    if (playerIdx > -1) {
      PLAYER_INFOS[playerIdx] = playerInfo

      IO.emit(EVENT_NAME.player.attackEnemy, data)
    }
  })

  // kill - enemy
  // is died
  socket.on(EVENT_NAME.player.killEnemy, function (data) {
    let playerInfo = data.playerInfo
    const playerIdx = getPlayerInfoIndexById(playerInfo.id)

    if (playerIdx > -1) {
      // die event
      IO.emit(EVENT_NAME.player.killEnemy, data)

      // reset player info
      var newStartVector = getRandomStartCreatureVector()
      playerInfo = resetCreatureInfo(playerInfo, newStartVector)

      // update server data
      PLAYER_INFOS[playerIdx] = playerInfo

      // send data
      // @todo check, we need this object ?
      const newData = { // eslint-disable-line
        playerInfo: playerInfo
      }
      IO.emit(EVENT_NAME.player.respawnEnemy, data)
    }
  })
})

/* ================================================================ Log / Report
 */

/**
 * Report number of current connection
 */
function reportNumberOfConnections () { // eslint-disable-line
  var n = getNumberOfConnection()
  UTIL.serverLog('Players (n)', n)
}

/* ================================================================ Update
 */

/**
 * Get nearest player
 *
 * @todo update function name
 * @param {CreatureInfo} monsterInfo
 * @param {number} visibleRange
 * @returns {Object}
 */
function getNearestPlayer (monsterInfo, visibleRange) {
  const nPlayers = PLAYER_INFOS.length
  let nearestPlayerDistance = 9000 // hack (must to bigger more than map size)
  let nearestPlayerVector = {}
  let data = {}
  let playerInfo

  for (let i = 0; i < nPlayers; i++) {
    playerInfo = PLAYER_INFOS[i]
    const distance = UTIL.getDistanceBetween(monsterInfo.lastVector, playerInfo.lastVector)

    if (distance <= visibleRange && distance < nearestPlayerDistance) {
      nearestPlayerDistance = distance
      nearestPlayerVector = playerInfo.lastVector
    }
  }

  if (!UTIL.isEmptyObject(nearestPlayerVector)) {
    data = {
      monsterInfo: { id: monsterInfo.id },
      targetCreatureId: playerInfo.id, // unused
      targetVector: nearestPlayerVector
    }
  }

  return data
}

/**
 * Update zombie position
 * @todo complete it
 */
function updateZombie () {

}

/**
 * Update machine monster event
 * due to machine cannot move
 * so, it will fire `fire` event only
 */
function updateMachine () {
  const visibleRange = 336
  const nMachines = MACHINE_INFOS.length
  const nPlayers = PLAYER_INFOS.length
  let dataArr = []

  if (nPlayers > 0) {
    // @todo refactor
    for (let i = 0; i < nMachines; i++) {
      const monsterInfo = MACHINE_INFOS[i]
      const data = getNearestPlayer(monsterInfo, visibleRange)

      if (!UTIL.isEmptyObject(data)) {
        dataArr.push(data)
      }
    }
  }

  if (!UTIL.isEmpty(dataArr)) {
    IO.emit(EVENT_NAME.server.machineFire, dataArr)
  }
}

/**
 * Update bat
 * based on `updateZombie`
 * @todo complete it
 */
function updateBat () {

}

/* ================================================================ Interval
 */

setInterval(function () {
  // reportNumberOfConnections();

  updateZombie()
  updateMachine()
  updateBat()
}, SERVER_HEARTBEAT)

//2020-10-12 index.html 페이지 서버 단으로 이동
function indexPage(_user_id,_user_nick,_user_avata){
  var _html = '';
  _html = _html +'<!doctype html>';
  _html = _html +'<html>';
  _html = _html +'<head>';
  _html = _html +'<title>Blocker - The Hunter: Multiplayer online game</title>';
  _html = _html +'<meta name="viewport" content="initial-scale=1">';
  _html = _html +'<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">';
  _html = _html +'<style>';
  _html = _html +'font-face { font-family: "Roboto", sans-serif; }';
  _html = _html +'.roboto { font-family: "Roboto", sans-serif; }';
  _html = _html +'</style>';
  _html = _html +'<link rel="stylesheet" href="/public/bower_components/bootstrap-sass-grid/css/bootstrap-sass-grid.css">';
  _html = _html +'<link rel="stylesheet" href="/public/dist/css/main.css">';
  _html = _html +'<script src="http://code.jquery.com/jquery-latest.min.js"></script>';
  _html = _html +'</head>';
  _html = _html +'<body>';
  _html = _html +'<div class="logo roboto">';
  _html = _html +'  Blocker - The Hunter: Multiplayer online game';
  _html = _html +'</div>';
  _html = _html +'<div class="container-fluid">';
  _html = _html +'  <div class="row">';
  _html = _html +'    <div class="wrapper">';
  _html = _html +'      <div id="game-wrap">';
  _html = _html +'      </div>';
  // _html = _html +'      <!-- #game-wrap -->';
  _html = _html +'    </div>';
  _html = _html +'  </div>';
  _html = _html +'</div>';
  _html = _html +'<div id="sidebar" class="sidebar noselect transition">';
  _html = _html +'  <div id="creature-widget" class="widget creature-widget">';
  _html = _html +'    <ul class="creatures" id="creatures">';
  _html = _html +'    </ul>';
  // _html = _html +'    <!-- #creatures -->';
  _html = _html +'  </div>';
  _html = _html +'</div>';
  _html = _html +'<div class="footer transition">';
  _html = _html +'  <div id="ly_curAccessCnt"></div>';
  _html = _html +'  <div id="log-wrap">';
  _html = _html +'    <ul id="logs">';
  _html = _html +'    </ul>';
  // _html = _html +'    <!-- #logs -->';
  _html = _html +'  </div>';
  _html = _html +'</div>';
  _html = _html +'<input id="txt_chat" type="text" class="message-input" placeholder="Message" maxlength="20" style="width:90%;margin-bottom:135px;" >';
  // _html = _html +'<!-- .message-input -->';
  _html = _html +'<br/>';
  _html = _html +'<p id="dp_Xy" class="message-input" style="margin-bottom:135px;margin-left:-100px;width:120px;">X:0,Y:0</p>';
  _html = _html +'<div id="dp_Chat" class="message-input" style="width:90%;height:130px;margin: 0 0 0 -100px;overflow-y:scroll;text-align: left;"></div>';
  _html = _html +'<div id="lyLeftmove" style="position:fixed;text-align:center;left:5px;top:270px;width:30px;height:150px;background-color:rgba(0,0,0,0.5);border:1px solid rgba(0,0,0,0.5);border-radius:5px;">';
  // _html = _html +'  <!-- space 32 -->';
  _html = _html +'  <img id="img_up" src="/public/dist/asset/image/move/up.png"       border="0" style="width:24px;height:24px;">';
  _html = _html +'  <img id="img_left" src="/public/dist/asset/image/move/left.png"   border="0" style="width:24px;height:24px;">';
  _html = _html +'  <img id="img_right" src="/public/dist/asset/image/move/right.png" border="0" style="width:24px;height:24px;">';
  _html = _html +'  <br><br><br>';
  _html = _html +'  <img id="img_chat" src="/public/dist/asset/image/move/chat.png"   border="0" onclick="jsfn_MoveChat();" style="width:24px;height:24px;" alt="모바일 상에서는 클릭시 대화시작 다시 클릭시 대화전송 입니다.">';
  _html = _html +'</div>';
  _html = _html +'<script>';
  _html = _html +'  $(document).ready(function () {';
  _html = _html +'      var isTouchDevice = "ontouchstart" in document.documentElement;';
  _html = _html +'      $("#lyLeftmove").oncontextmenu = function() {return false;};';
  _html = _html +'      $("#game-wrap").oncontextmenu = function() {return false;};';
  // _html = _html +'      // up pc and mobile both';
  // _html = _html +'      // 38 up';
  _html = _html +'      $("#img_up").oncontextmenu = function() {return false;};';
  _html = _html +'      $("#img_up").mousedown(function(event) { if (isTouchDevice == false) { jsfn_Move("38"); } });';
  _html = _html +'      $("#img_up").mouseup(function(event) { if (isTouchDevice == false) { jsfn_MoveStop("38"); }});';
  _html = _html +'      $("#img_up").on("touchstart", function(){ if (isTouchDevice)  { jsfn_Move("38"); } });';
  _html = _html +'      $("#img_up").on("touchend", function(){ if (isTouchDevice)  {jsfn_MoveStop("38");}});';
  // _html = _html +'      ';
  // _html = _html +'      // 37 left ';
  _html = _html +'      $("#img_left").oncontextmenu = function() {return false;};';
  _html = _html +'      $("#img_left").mousedown(function(event) { if (isTouchDevice == false) { jsfn_Move("37"); } });';
  _html = _html +'      $("#img_left").mouseup(function(event) { if (isTouchDevice == false) { jsfn_MoveStop("37"); }});';
  _html = _html +'      $("#img_left").on("touchstart", function(){ if (isTouchDevice)  { jsfn_Move("37"); } });';
  _html = _html +'      $("#img_left").on("touchend", function(){ if (isTouchDevice)  {jsfn_MoveStop("37");}});';
  // _html = _html +'      ';
  // _html = _html +'      // 39 right';
  _html = _html +'      $("#img_right").oncontextmenu = function() {return false;};';
  _html = _html +'      $("#img_right").mousedown(function(event) { if (isTouchDevice == false) { jsfn_Move("39"); } });';
  _html = _html +'      $("#img_right").mouseup(function(event) { if (isTouchDevice == false) { jsfn_MoveStop("39"); }});';
  _html = _html +'      $("#img_right").on("touchstart", function(){ if (isTouchDevice)  { jsfn_Move("39"); } });';
  _html = _html +'      $("#img_right").on("touchend", function(){ if (isTouchDevice)  {jsfn_MoveStop("39");}});';
  _html = _html +'  });';
  _html = _html +'  $(document).on("contextmenu", function(e){';
  // _html = _html +'      //hide image ,show alert , etc..';
  _html = _html +'      return false;';
  _html = _html +'  });';
  _html = _html +'  function jsfn_MoveChat(){';
  _html = _html +'    var event = document.createEvent("Events");';
  _html = _html +'    event.initEvent("keydown", true, true);';
  _html = _html +'    event.keyCode = 13;';
  _html = _html +'    document.getElementById("game-wrap").dispatchEvent(event);';
  _html = _html +'    setTimeout("jsfn_MoveChatEnd()",100);';
  _html = _html +'  }';
  _html = _html +'  function jsfn_MoveChatEnd(){';
  _html = _html +'    var event = document.createEvent("Events");';
  _html = _html +'    event.initEvent("keyup", true, true);';
  _html = _html +'    event.keyCode = 13;';
  _html = _html +'    document.getElementById("game-wrap").dispatchEvent(event);';
  _html = _html +'  }';
//_html = _html +'';
  _html = _html +'  function jsfn_Move(strKey){';
  _html = _html +'    var event = document.createEvent("Events");';
  _html = _html +'    event.initEvent("keydown", true, true);';
  _html = _html +'    event.keyCode = strKey;';
  _html = _html +'    document.getElementById("game-wrap").dispatchEvent(event);';
  // _html = _html +'    //setTimeout("jsfn_MoveStop("+strKey+")",200);';
  _html = _html +'  }';
  _html = _html +'  function jsfn_MoveStop(strKey){';
  _html = _html +'    var event = document.createEvent("Events");';
  _html = _html +'    event.initEvent("keyup", true, true);';
  _html = _html +'    event.keyCode = strKey;';
  _html = _html +'    document.getElementById("game-wrap").dispatchEvent(event);';
  _html = _html +'  }';
  _html = _html +'  function jsfn_Resize(){';
//_html = _html +'';
  _html = _html +'  }';
  // _html = _html +'  // $(window).bind("resize", function(e)';
  // _html = _html +'  // {';
  // _html = _html +'  //   if (window.RT) clearTimeout(window.RT);';
  // _html = _html +'  //   window.RT = setTimeout(function()';
  // _html = _html +'  //   {';
  // _html = _html +'  //     this.location.reload(false); /* false to get page from cache */';
  // _html = _html +'  //   }, 100);';
  // _html = _html +'  // });';
  _html = _html +'</script>';
  _html = _html +'<script src="/socket.io/socket.io.js"></script>';
  _html = _html +'<script src="/public/bower_components/phaser/build/phaser.min.js"></script>';
  _html = _html +'<script src="/public/bower_components/phaser-state-transition-plugin/dist/phaser-state-transition-plugin.min.js"></script>';
  _html = _html +'<script src="/public/dist/js/bundle.js"></script>';
  //########################################
  _html = _html +'<input type="hidden" id="user_id" value="'+_user_id+'">';
  _html = _html +'<input type="hidden" id="user_nick" value="'+_user_nick+'">';
  _html = _html +'<input type="hidden" id="user_avata" value="'+_user_avata+'">';
  //########################################
  _html = _html +'</body>';
  _html = _html +'</html>';
  return _html;
}