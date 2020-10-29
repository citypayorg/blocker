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
var user_id           = ""; // user idx
var user_nick         = ""; // user 닉네임
var user_avata        = ""; // user 아바타 Default N
var user_level        = 0; // 접속한 후 _levelUpTime 분당 + 1
var user_ip           = "";
var user_CTP_address  = ""; // CTP 입금 주소
var _levelUpTime      = 60 * 15; // 60 초 * 15 분 레벨업 인터벌타임

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
  var sql = "SELECT a.* , (SELECT IFNULL(sum(minuteCnt),0) FROM tbl_game WHERE game_idx='1' and user_idx=a.id) as user_level FROM users a WHERE username ='"+param_username+"' and password ='"+md5(param_password)+"'";
  // console.log(sql);
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
        user_level  = rows[0].user_level;
        user_CTP_address= rows[0].CTP_address;
        // console.log('유저레벨:'+user_level);
        // user_ip = req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||req.socket.remoteAddress ||req.connection.socket.remoteAddress;
        intervalLvUpFunc();
        // var sql2 = " "; 
        // sql2 = sql2 + " INSERT INTO `tbl_game`(`game_idx`, `user_idx`, `user_coin`, `coin_address`, `yyyymmdd`, `ip`) ";
        // sql2 = sql2 + " VALUES (1,?,'CTP',?,CURDATE()+0,?) ";
        // //sql2 = sql2 + " ON DUPLICATE KEY UPDATE minuteCnt = minuteCnt + 1, last_time=now() "; //무조건 +1 되는 버그로 Merge 문 X 
        // var params = [rows[0].id, rows[0].CTP_address, user_ip];
        // conn.query(sql2, params, function(err, rows2, fields2){
        //   if(err){
        //     console.log(err);
        //     //conn.release();
        //   } else {
        //     console.log('merge success !!!!');
        //     // console.log(rows2);
        //     //conn.release();
        //   }
        // });
        // login 성공
        res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
        res.end(indexPage(user_id,user_nick,user_avata,user_level)); 

      }else{
        res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
        // res.end("<h1>password maybe wrong</h1>"); 
        res.end("<script>alert('password maybe wrong');document.location.href='/';</script>"); 
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
  const nZombies  = 0; //리스폰 되는 몬스터 숫자 좀비
  const nMachines = 0; //리스폰 되는 몬스터 숫자 머신
  const nBats     = 0; //리스폰 되는 몬스터 숫자 박쥐

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
  // return getNewCreatureInfo('hero', 200, 3, 8)
  return getNewCreatureInfo('hero', 200, 3, 8,user_nick,user_avata,user_level)
}

/**
 * Get new creature info
 *
 * @param {string} type
 * @param {number} life
 * @param {number} maxLife
 * @returns {CreatureInfo}
 */
// function getNewCreatureInfo (type, velocitySpeed, life, maxLife) {
function getNewCreatureInfo (type, velocitySpeed, life, maxLife, nick ,avata ,level) {
  const creatureId = getUniqueCreatureId()
  const startVector = getRandomStartCreatureVector()
  // const creatureInfo = new CreatureInfo(creatureId, type, startVector, velocitySpeed, life, maxLife)
  const creatureInfo = new CreatureInfo(creatureId, type, startVector, velocitySpeed, life, maxLife, nick ,avata, level)
  //, nick ,avata 의 data 필요 ....
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
  // if(user_nick!=null){ 
  //   playerInfo.id = user_nick;
  // }
  // else{
  //   playerInfo.id = user_id;
  // }
  playerInfo.id     = user_id;
  playerInfo.nick   = user_nick; // 2020-10-18
  playerInfo.avata  = user_avata; // 2020-10-18
  playerInfo.level  = user_level; // 2020-10-20

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
      saveChat(user_id,user_nick,lastMessage);  // 2020-10-16 서버에 채팅 저장
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

//2020-10-16 - 채팅저장
function saveChat(user_id,user_nick,msg){
  var conn = db_config.init();
  db_config.connect(conn);
  var sql2 = " "; 
  sql2 = sql2 + " INSERT INTO `tbl_game_chat`(`game_idx`, `user_idx`, `nick`, `msg`) ";
  sql2 = sql2 + " VALUES (1,?,?,?) ";
  var params = [user_id, user_nick, msg];
  conn.query(sql2, params, function(err, rows2, fields2){
    if(err){
      //console.log(err);
      //conn.release();
    } else {
      //console.log('merge success !!!!');
      //console.log(rows2);
      //conn.release();
    }
  });
}



function getPreChatLog(_param, callback){
  var conn = db_config.init();
  db_config.connect(conn);
  var sql = "SELECT nick, msg FROM tbl_game_chat ORDER BY chat_idx DESC  LIMIT 50"; // _param

  conn.query(sql, function(err, rows){
    if (err){ 
      throw err;
    }
    var _chatLog = "";
    if(rows.length>0){
      for(var i=0; i<rows.length; i++)
      { 
        _chatLog = _chatLog +""+ rows[i].nick +":" + rows[i].msg.replace("\'","`") +"<br/>";
      }
    }
    return callback(_chatLog);
  });
}

// 15분마다 레벨을 올려주자~~~~
// SELECT last_time ,TIMESTAMPDIFF(SECOND, last_time, NOW() ) AS TDiff FROM `tbl_game` WHERE game_idx='1' and user_idx='2' and yyyymmdd=CURDATE()+0;
function intervalLvUpFunc() {

  var conn = db_config.init();//2020-09-13
  db_config.connect(conn);
  var sql = "SELECT last_time ,TIMESTAMPDIFF(SECOND, last_time, NOW() ) AS TDiff FROM tbl_game WHERE game_idx='1' and user_idx='"+user_id+"' and yyyymmdd=CURDATE()+0";
  // console.log(sql);
  var _TDiff =0;
  conn.query(sql, function (err, rows, fields) 
  {
    if(!err){
      if(rows.length>0){
        for(var i=0; i<rows.length; i++)
        { 
          _TDiff = rows[i].TDiff;
        }
        console.log(_TDiff +' : _TDiff');
        if (_TDiff>= _levelUpTime) // 15분이 지났으면 minuteCnt + 1
        {
          var sql2 = " "; 
          sql2 = sql2 + " UPDATE `tbl_game` set minuteCnt = minuteCnt + 1, last_time=now() WHERE game_idx='1' and user_idx='"+user_id+"' and yyyymmdd=CURDATE()+0";
          var params2 = [user_id, user_CTP_address, user_ip];
          conn.query(sql2, params2, function(err2, rows2, fields2){
            if(err2){ console.log(err2);
            } else {
              console.log('UPDATE success !!!!');
            }
          });
          // try { document.getElementById("dp_Chat").innerHTML = "<pre>" + r.id + " : " + t + "</pre>" + document.getElementById("dp_Chat").innerHTML; } catch (e) { }
        }
      }else{
        //rows.length == 0 이면 날자가 바뀌어 insert 해줘야 함
        var sql2 = " "; 
        sql2 = sql2 + " INSERT INTO `tbl_game`(`game_idx`, `user_idx`, `user_coin`, `coin_address`, `yyyymmdd`, `ip`) ";
        sql2 = sql2 + " VALUES (1,?,'CTP',?,CURDATE()+0,?) ";
        sql2 = sql2 + " ON DUPLICATE KEY UPDATE minuteCnt = minuteCnt + 1, last_time=now() "; 
        var params2 = [user_id, user_CTP_address, user_ip];
        conn.query(sql2, params2, function(err2, rows2, fields2){
          if(err2){ console.log(err2);
          } else {
            console.log('INSERT success !!!!');
          }
        });
      }
    }
  });
}

setInterval(intervalLvUpFunc, 1000*_levelUpTime); // 15분 마다 로그 쌓기

// 로그인 시 이전 대화 로그 50개 가저 오기
var _preMsg = getPreChatLog(null, function(_result){_preMsg = _result; }); //이전 대화(Chat)로그 50개

//2020-10-18 Pre_load image
var _addimage = getPreLimg(null, function(_imgLog){_addimage = _imgLog; }); //

function getPreLimg(_param, callback){
  var conn = db_config.init();
  db_config.connect(conn);
  // var sql = "SELECT GROUP_CONCAT(id) as preload_img FROM users WHERE avata = 'Y'"; // _param
  var sql = "SELECT id FROM users WHERE avata = 'Y'"; 
  conn.query(sql, function(err, rows){
    if (err){ 
      throw err;
    }
    var _imgLog = "";
    if(rows.length>0){
      for(var i=0; i<rows.length; i++)
      { 
        _imgLog = _imgLog +"GAME.load.image('hero_"+rows[i].id+"', '/public/dist/asset/image/upload/"+rows[i].id+".png', 46, 46),";
      }
    }
    return callback(_imgLog);
  });
}

//2020-10-12 index.html 페이지 서버 단으로 이동
function indexPage(_user_id,_user_nick,_user_avata,_user_level){
  var _html = '';
  _html = _html +'<!doctype html>';
  _html = _html +'<html>';
  _html = _html +'<head>';
  _html = _html +'<title>Blocker - The Hunter: Multiplayer online game</title>';
  //시작 스케일을 1.0 최대 스케일을 1.0으로 설정해 놓은 뒤, 사용자가 스케일을 조절할 수 없게 하겠다는 코드
  _html = _html +'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
  _html = _html +'<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">';
  _html = _html +'<style>';
  _html = _html +'font-face { font-family: "Roboto", sans-serif; }';
  _html = _html +'.roboto { font-family: "Roboto", sans-serif; }';
  _html = _html +'</style>';
  _html = _html +'<link rel="stylesheet" href="/public/bower_components/bootstrap-sass-grid/css/bootstrap-sass-grid.css">';
  _html = _html +'<link rel="stylesheet" href="/public/dist/css/main.css">';
  _html = _html +'<script src="http://code.jquery.com/jquery-latest.min.js"></script>';
  _html = _html +'</head>';
  _html = _html +'<body class="noselect">';
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

  //상단 15분 프로그레스바
  _html = _html +'<div style="width:260px"><progress value="0" max="100" id="ly_Progress" style="position:fixed;left:5px;top:0px;width:250px;height:8px;"></progress></div>';
  _html = _html +'<div id="ly_Level" style="position:fixed;left:260px;top:2px;width:100px;height:20px;color:#FFFFFF;font-size:10.5px;">적립토큰수 : ' +  user_level +'</div>';
  _html = _html +'<div id="ly_LeftTime" style="position:fixed;left:260px;top:17px;width:100px;height:20px;color:#FFFFFF;font-size:10.5px;z-index:99;">15분</div>';
  _html = _html +'<input id="txt_chat" type="text" class="message-input" placeholder="Message" maxlength="20" style="width:90%;margin-bottom:135px;" >';
  // _html = _html +'<!-- .message-input -->';
  _html = _html +'<br/>';
  _html = _html +'<p id="dp_Xy" class="message-input noselect" style="margin-bottom:135px;margin-left:-100px;width:120px;" onclick="this.blur();">X:0,Y:0</p>';
  _html = _html +'<div id="dp_Chat" class="message-input noselect" style="width:90%;height:130px;margin: 0 0 0 -100px;overflow-y:scroll;text-align: left;" onclick="this.blur();">';
  //2020-10-16 채팅로그추가
  _html = _html +'현재 게임 서버는 테스트입니다, 추후 초기화 될 수 있습니다. 관심 가져주셔서 감사드립니다.<br/>';
  _html = _html +'15분 마다 캐릭터의 경험치와 토큰(BCK)이 적립됩니다.<br/>';
  _html = _html +'적립토큰수 : ' +  user_level +'<br/>';

  _html = _html +'---------- pre log ----------<br/>';
  _html = _html +'' + _preMsg+'<br/>';
  _html = _html +'</div>';

  _html = _html +'<div id="lyLeftmove" class="noselect" style="position:fixed;text-align:center;right:5px;top:180px;width:85px;height:170px;background-color:rgba(0,0,0,0.5);border:1px solid rgba(0,0,0,0.5);border-radius:5px;z-index:99;" onclick="this.blur();">';
  _html = _html +'  <table border="0"><tr><td colspan="2" align="center"><img id="img_up" src="/public/dist/asset/image/move/up.png" border="0" style="width:40px;height:40px;"></td></tr>';
  _html = _html +'  <tr><td><img id="img_left" src="/public/dist/asset/image/move/left.png"   border="0" style="width:40px;height:40px;"></td>';
  _html = _html +'  <td><img id="img_right" src="/public/dist/asset/image/move/right.png" border="0" style="width:40px;height:40px;"></td></tr>';
  _html = _html +'  <tr><td colspan="2" align="center"><img id="img_fire" src="/public/dist/asset/image/move/fire.png"   border="0" style="width:40px;height:40px;"></td></tr>';
  // _html = _html +'  <!-- space 32 -->';
  _html = _html +'  <tr><td colspan="2" align="center"><img id="img_chat" src="/public/dist/asset/image/move/chat.png"   border="0" onclick="jsfn_MoveChat();" style="width:40px;height:40px;" alt="모바일 상에서는 클릭시 대화시작 다시 클릭시 대화전송 입니다."></td></tr></table>';
  _html = _html +'</div>';
  // 밤하늘배경
  _html = _html +'<div class="stars"></div>';
  _html = _html +'<div class="twinkling"></div>';
  _html = _html +'<div class="shooting-stars"></div>';

  _html = _html +'<script>';
  //만약 두 손가락으로 화면을 클릭 시 이 이벤트를 무시
  _html = _html +'  document.documentElement.addEventListener("touchstart", function (event) { if (event.touches.length > 1) { event.preventDefault(); } }, false); ';
  // 만약 두번 연속 탭이 0.3초보다 짧다면 이를 무시
  _html = _html +'  var lastTouchEnd = 0; ';
  _html = _html +'  document.documentElement.addEventListener("touchend", function (event) { ';
  _html = _html +'  var now = (new Date()).getTime();if (now - lastTouchEnd <= 300) { event.preventDefault();  } lastTouchEnd = now; }, false); ';

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
  // _html = _html +'      // 17 Ctrl';
  _html = _html +'      $("#img_fire").oncontextmenu = function() {return false;};';
  _html = _html +'      $("#img_fire").mousedown(function(event) { if (isTouchDevice == false) { jsfn_Move("17"); } });';
  _html = _html +'      $("#img_fire").mouseup(function(event) { if (isTouchDevice == false) { jsfn_MoveStop("17"); }});';
  _html = _html +'      $("#img_fire").on("touchstart", function(){ if (isTouchDevice)  { jsfn_Move("17"); } });';
  _html = _html +'      $("#img_fire").on("touchend", function(){ if (isTouchDevice)  {jsfn_MoveStop("17");}});';
  
  _html = _html +'  });';
  _html = _html +'  $(document).on("contextmenu", function(e){';
  _html = _html +'      return false;';
  _html = _html +'  });';
  _html = _html +'  $(document).on("dblclick", function(e){';
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
//프로그래스바 추가
_html = _html +'  function jsfn_showProgress(){';
_html = _html +'      var fm15 = 900, m15 = 900;';
_html = _html +'      var x = setInterval(function() { ';
_html = _html +'        min = parseInt(m15/60);';
_html = _html +'        sec = m15%60;';
_html = _html +'        _barper = Math.round(100 - ((m15/fm15)*100),1);';
_html = _html +'        document.getElementById("ly_LeftTime").innerHTML = min + ":" + sec + " "+ _barper +"% 진행" ;'; //
_html = _html +'        document.getElementById("ly_Progress").value = _barper; ';
_html = _html +'        m15--; ';
_html = _html +'        if (m15 < 0){ ';
_html = _html +'          clearInterval(x);';
_html = _html +'          this.location.reload();';
_html = _html +'        }';
_html = _html +'      }, 1000);'; // 1초
_html = _html +'    }';
//_html = _html +'    setTimeout(jsfn_showProgress(),1500);'; // 1.5초
_html = _html +'    jsfn_showProgress();';

  // 모바일 화면 회전시 캐시에서 reload 처리 
  _html = _html +' var _rotate_phone_cnt =0;';
  _html = _html +' $("document").ready(function() {';
  _html = _html +'     $(window).trigger("orientationchange");';
  _html = _html +' });';
  _html = _html +' $(window).bind("orientationchange", function(e) {';
  _html = _html +'  var orientation = window.orientation;';
  _html = _html +'if (orientation == 90 || orientation == -90) { '; //jsfn_Reload(); 
  _html = _html +'  _rotate_phone_cnt=_rotate_phone_cnt+1;jsfn_Reload();'; //alert("landscape");
  _html = _html +'} else {   '; //
  _html = _html +'  _rotate_phone_cnt=_rotate_phone_cnt+1;jsfn_Reload();'; //alert("portrait");
  _html = _html +'}';
  _html = _html +'});';
  _html = _html +'function jsfn_Reload(){ if(_rotate_phone_cnt>1){this.location.reload(false); }}'; ///* false to get page from cache */}
  _html = _html +'</script>';
  _html = _html +'<script src="/socket.io/socket.io.js"></script>';
  _html = _html +'<script src="/public/bower_components/phaser/build/phaser.min.js"></script>';
  _html = _html +'<script src="/public/bower_components/phaser-state-transition-plugin/dist/phaser-state-transition-plugin.min.js"></script>';
  _html = _html +'<script src="/public/dist/js/bundle.js"></script>';
  _html = _html +'<script src="/public/dist/js/shootingstars.js"></script>';
  _html = _html +'<script>';
  _html = _html +'(function($){';
  _html = _html +'$( document ).ready( function(){';
  _html = _html +'var shootingStarObj = new ShootingStar( ".shooting-stars" );';
  _html = _html +'        shootingStarObj.launch();';
  _html = _html +'$("input").keypress(function(event) {';
  _html = _html +'if (event.which == 13) {';
  _html = _html +'event.preventDefault();';
  _html = _html +'$("form").submit();';
  _html = _html +'}';
  _html = _html +'});';
  _html = _html +'});';
  _html = _html +'})(jQuery);';
  _html = _html +'</script>';
  //########################################
  _html = _html +'<input type="hidden" id="user_id" value="'+_user_id+'">';
  _html = _html +'<input type="hidden" id="user_nick" value="'+_user_nick+'">';
  _html = _html +'<input type="hidden" id="user_avata" value="'+_user_avata+'">';
  _html = _html +'<input type="hidden" id="user_level" value="'+_user_level+'">';
  _html = _html +'<input type="hidden" id="user_preloadImg" value="'+_addimage+'">';
  //########################################
  _html = _html +'</body>';
  _html = _html +'</html>';
  return _html;
}