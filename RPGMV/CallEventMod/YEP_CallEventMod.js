//=============================================================================
// Yanfly Engine Plugins - Call Event
// YEP_CallEventMod.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_CallEventMod = true;

var Yanfly = Yanfly || {};
Yanfly.CallEvent = Yanfly.CallEvent || {};

//=============================================================================
 /*:
 * @plugindesc v1.00mod (Zero_G) A lost utility command from RPG Maker 2000 and
 * RPG Maker 2003 has been remade for RPG Maker MV!
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Zero_G Mod: add option to start event as a parallel process.
 * 
 * This is a reproduced method from RPG Maker 2000 and RPG Maker 2003. It
 * allows the game to call a page’s events as if it were a common event. These
 * events can be drawn from any event on any map within the game.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * To call upon events from the current map or a different map, use the plugin
 * commands found below:
 *
 *   Plugin Commands:
 *
 *   CallEvent x
 *   - This will call upon event x from the current map and use the event list
 *   from the first page of the event.
 *
 *   CallEvent x, Page y
 *   - This will call upon event x from the current map and use the event list
 *   from page y of the event.
 *
 *   CallEvent x, Map y
 *   - This will call upon event x from map y and use the event list from the
 *   first page of the event.
 *
 *   CallEvent x, Page y, Map z
 *   - This will call upon event x from map z and use the event list from
 *   page y of the event.
 *
 *   CallEvent x, Map y, Page z
 *   - This will call upon event x from map y and use the event list from
 *   page z of the event.
 * 
 *   Zero_G Mod: add ', parallel' to make it a parallel event
 *
 * *Note1: Because of the programming structure of RPG Maker MV's source, the
 * called event data may or may not be instantaneous depending on the size of
 * the map file that is needed to be loaded. At best, it will take a couple of
 * frames of loading time depending on the size.
 *
 * *Note2: If any of the events, pages, and/or maps do not exist, then no
 * events will be called and the plugin will skip forward as if nothing has
 * happened. Be cautious about how you call these call events.
 */
//=============================================================================

//=============================================================================
// DataManager
//=============================================================================

var $callEventMap;

DataManager.loadCallMapData = function(mapId) {
  if (mapId > 0) {
    var filename = 'Map%1.json'.format(mapId.padZero(3));
    this.loadDataFile('$callEventMap', filename);
  } else {
    $callEventMap = {};
    $callEventMap.data = [];
    $callEventMap.events = [];
    $callEventMap.width = 100;
    $callEventMap.height = 100;
    $callEventMap.scrollType = 3;
  }
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.CallEvent.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.CallEvent.Game_Interpreter_pluginCommand.call(this, command, args);
  if (command === 'CallEvent') this.callEvent(this.argsToString(args));
};

Game_Interpreter.prototype.argsToString = function(args) {
    var str = '';
    var length = args.length;
    for (var i = 0; i < length; ++i) {
      str += args[i] + ' ';
    }
    return str.trim();
};

Game_Interpreter.prototype.callEvent = function(line) {
  if (this._callEvent_Running) return this.processCallEvent();
  if (line.match(/(\d+),[ ](.*)/i)) {
    var eventId = parseInt(RegExp.$1);
    var line = String(RegExp.$2);
    if (line.match(/PAGE[ ](\d+)/i)) {
      var pageId = parseInt(RegExp.$1);
    } else {
      var pageId = 1;
    }
    if (line.match(/MAP[ ](\d+)/i)) {
      var mapId = parseInt(RegExp.$1);
    } else {
      var mapId = $gameMap.mapId();
    }
    if (line.match(/PARALLEL/i)) { // Zero_G added (parallel). Detect parallel word in plugin command
      var parallel = true;
    } else {
      var parallel = false;
    }
  } else {
    var eventId = parseInt(line);
    if (!eventId) return;
    var pageId = 1;
    var mapId = $gameMap.mapId();
    var parallel = false;
  }
  $callEventMap = undefined;
  DataManager.loadCallMapData(mapId);
  this._callEvent_EventId = eventId;
  this._callEvent_PageId = pageId;
  this._callEvent_Parallel = parallel;
  this._callEvent_Running = true;
  this.processCallEvent();
};

Game_Interpreter.prototype.processCallEvent = function() {
  if ($callEventMap) {
    this.insertCallEventData(this._callEvent_EventId, this._callEvent_PageId);
  } else {
    this.wait(1);
    this._index--;
  }
};

Game_Interpreter.prototype.insertCallEventData = function(eventId, pageId) {
  this._callEvent_Running = false;
  var ev = $callEventMap.events[eventId];
  if (!ev) return;
  var page = ev.pages[pageId - 1];
  if (!page) return;
  var list = page.list;
  if(!this._callEvent_Parallel) this.setupChild(list, this.eventId()); // Zero_G moddified
  else this.setupParallelChild(list, this.eventId()); // Zero_G added, trigger a different setup for parallel events
};

/*
* Zero_G add parallel functionality to child interpreters
*/

// New
// Same as setupChild, but stored in a different variable
Game_Interpreter.prototype.setupParallelChild = function(list, eventId) {
  this._parallelChildInterpreter = new Game_Interpreter(this._depth + 1);
  this._parallelChildInterpreter.setup(list, eventId);
};

// Alias, add updateChildParallel()
var ZERO_Game_Interpreter_update = Game_Interpreter.prototype.update;
Game_Interpreter.prototype.update = function() {
  ZERO_Game_Interpreter_update.call(this);
  this.updateChildParallel();
};

// New
// Same as Game_Event updateParallel but calling the _parallelChildInterpreter var
Game_Interpreter.prototype.updateChildParallel = function() {
 try{
    if (this._parallelChildInterpreter) {
        if (!this._parallelChildInterpreter.isRunning()) {
            this._parallelChildInterpreter.setup(this.list(), this._eventId);
        }
        this._parallelChildInterpreter.update();
    }  
  }catch(ex){ // Quick and dirty workaround to end parallel event
    this._parallelChildInterpreter = null;
  }
};

//=============================================================================
// End of File
//=============================================================================
