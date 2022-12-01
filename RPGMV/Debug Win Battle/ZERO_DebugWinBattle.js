//=============================================================================
// Debug Win Battle
//=============================================================================
/*:
 * @DebugWinBattle
 * @plugindesc Win battle on button press
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_DebugWinBattle.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin lets you:
  -Win a battle when a button is pressed
  -Walk through walls when a button is pressed

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.
 
 -------------------------------------------------------------------------------
 @param Win Battle Button
 @desc Button to win battle
 @default p

 @param Walk Through Walls Button
 @desc Button to win battle
 @default o
 
 @param Debug Only
 @desc Work only on debug?
 @type boolean
 @default false
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_DebugWinBattle = 1;
ZERO.DebugWinBattle = ZERO.DebugWinBattle || {};

(function ($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);
    
    $.winButton = $.params['Win Battle Button'].trim();
    $.walkButton = $.params['Walk Through Walls Button'].trim();
    $.testPlayOnly = ($.params['Debug Only'].trim() === 'true');

    // Add key mappings
    function addKeyMapping(key){
        let buttonCode = key.toUpperCase().charCodeAt(0);

        // Prevent from mapping predefined strings (ej: 'pageup', 'left')
        for (let k in Input.keyMapper){
            if (key == Input.keyMapper[k]) return key;
        }

        if (Input.keyMapper[buttonCode] === undefined) {
            Input.keyMapper[buttonCode] = key;
            return key;
        }else{
            // If it was already defined, return the char/string it was defined with
            return Input.keyMapper[buttonCode];
        }
    }

    $.winButton = addKeyMapping($.winButton);
    $.walkButton = addKeyMapping($.walkButton);

    
    var ZERO_Scene_Battle_prototype_update = Scene_Battle.prototype.update
    Scene_Battle.prototype.update = function() {
        if($gameTemp.isPlaytest() || !$.testPlayOnly){
            if (Input.isTriggered($.winButton) || TouchInput.isCancelled()) {
                this._partyCommandWindow.close(); // Close input window
                
                $gameTroop.members().forEach(function(enemy) { // Kill all enemies
                    enemy.addNewState(enemy.deathStateId());
                });

                BattleManager.processVictory(); // End battle and process victory (rewards)
            }
        }
        ZERO_Scene_Battle_prototype_update.call(this);
    }

    var ZERO_Game_Player_prototype_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, d) {
        if($gameTemp.isPlaytest() || !$.testPlayOnly){
            if (Input.isPressed($.walkButton) || TouchInput.isCancelled()) {
                return true;
            }
        }
        return ZERO_Game_Player_prototype_isMapPassable.apply(this, arguments);
    };

})(ZERO.DebugWinBattle);