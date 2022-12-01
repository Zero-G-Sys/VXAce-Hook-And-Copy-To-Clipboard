//=============================================================================
// Speedup
//=============================================================================
/*:
 * @ZERO_Speedup
 * @plugindesc Speed up game while button pressed
 * @version 1.2
 * @author Zero_G
 * @filename ZERO_Speedup.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin will speed up the game while a button is pressed

 Based on SumRndmDde Speedup script (http://sumrndm.site/debug-speed-up/)

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 == Changelog ==
 1.1 -Fixed not working out of test play
 1.2 -Updated method of getting plugin parameters, now you can freely change
     the name of the .js file
     -Added a null check for $gameTemp, so it doens't break when trying
     to speedup when game is loading
 
 -------------------------------------------------------------------------------
 @param Speedup Button
 @desc Button to speedup the game
 @default a
 
 @param Test Play Only
 @desc Speed up only during test play
 @type boolean
 @default false

 @param Speed Amount
 @desc Amount to speed up
 @type number
 @default 5
 
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_Speedup = 1;
ZERO.Speedup = ZERO.Speedup || {};

(function ($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);
    
    $.button = $.params['Speedup Button'].trim();
    $.testPlayOnly = ($.params['Test Play Only'].trim() === 'true');
    $.speed = Number($.params['Speed Amount'].trim());
    let speed = 1

    // Add key mappings
    function addKeyMapping(key){
        let buttonCode = key.toUpperCase().charCodeAt(0);

        // Prevent from mapping predefined strings (ej: 'pageup', 'left')
        for (const [key_, value] of Object.entries(Input.keyMapper)) {
            if(key.localeCompare(value) == 0) return key;
        }

        if (Input.keyMapper[buttonCode] === undefined) {
            Input.keyMapper[buttonCode] = key;
            return key;
        }else{
            // If it was already defined, return the char/string it was defined with
            return Input.keyMapper[buttonCode];
        }
    }

    $.button = addKeyMapping($.button);

    //------------------------------//
    // Check when button is pressed //
    //------------------------------//

    // SpeedUp Start Event Listener
    document.addEventListener('keydown', event => {
        if($gameTemp){
            if (Input.keyMapper[event.keyCode] == $.button && ($gameTemp.isPlaytest() || !$.testPlayOnly)) {
                speed = $.speed;
            }
        }
    })

    // SpeedUp Stop Event Listener
    document.addEventListener('keyup', event => {
        if($gameTemp){
            if (Input.keyMapper[event.keyCode] == $.button && ($gameTemp.isPlaytest() || !$.testPlayOnly)) {
                speed = 1;
            }
        }
    })

    //------------------------------//
    // Speedup function             //
    //------------------------------//

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        for(var i = 0; i < Math.floor(speed); i++) {
            _Scene_Map_update.call(this)
        }
    };

    var _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        for(var i = 0; i < Math.floor(speed); i++) {
            _Spriteset_Base_update.call(this);
        }
    };

    var _Scene_Battle_prototype_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        for(var i = 0; i < Math.floor(speed); i++) {
            _Scene_Battle_prototype_update.call(this);
        }
    };
  
})(ZERO.Speedup);
