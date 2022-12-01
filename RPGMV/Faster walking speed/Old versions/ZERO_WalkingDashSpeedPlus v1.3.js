//=============================================================================
// Walking Dash Speed Plus
//=============================================================================
/*:
* @ZERO_WalkingDashSpeedPlus
* @plugindesc Faster walking and dash speed
* @version 1.3
* @author Zero_G
* @filename ZERO_WalkingDashSpeedPlus.js
* @help
-------------------------------------------------------------------------------
== Description ==
This plugin changes the main character default walking (and dash) speed, by
default it increases it by one level.

-Walking speed during events is respected.
-Followers will also change speed.

+ Speed Settings:
Slow: 3
Normal: 4
Fast: 5

Can use decimals, for example 4.5

+ Dash Settings:
Dash normally adds one level of speed to current walking speed, for example:
if walking speed is 4, a dash of 1, will make dashing speed 5.
Dash default is 1.

== Terms of Use ==
- Free for use in non-commercial projects with credits
- Free for use in commercial projects
- Please provide credits to Zero_G

== Usage ==
Just add the plugin.

== Changelog ==
1.3
- Change Game_Player.prototype.isNormal from overwrite to alias
1.2
- Add option to change dash speed
1.1
- Fix movement speed always set to 5
- Fix movement speed variable read wrongly
-------------------------------------------------------------------------------
@param Walking Speed
@desc Set walking speed
@default 5

@param Dash Speed
@desc Set how much dash adds to regular speed
@default 1
-------------------------------------------------------------------------------

*/

var Imported = Imported || {} ;
var ZERO = ZERO || {};
Imported.ZERO_WalkingSpeed = 1;
ZERO.WalkingSpeed = ZERO.WalkingSpeed || {};

(function($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);
    
    $.speed = Number($.params["Walking Speed"].trim());
    $.dash = Number($.params["Dash Speed"].trim());
    var duringEvent = false;

    // Determine if walking during event
    var ZERO_processMoveCommand = Game_Character.prototype.processMoveCommand;
    Game_Character.prototype.processMoveCommand = function(command) {
        duringEvent = true;
        ZERO_processMoveCommand.call(this, command);
    };

    // Determine if walking via inputs
    var ZERO_Game_Player_prototype_isNormal = Game_Player.prototype.isNormal;
    Game_Player.prototype.isNormal = function() {
        if (this._vehicleType === 'walk' && !this.isMoveRouteForcing()){
            duringEvent = false;
        }
        return ZERO_Game_Player_prototype_isNormal.call(this);
    };

    // Change character speed (3 slow, 4 normal, 5 fast)
    Game_Player.prototype.realMoveSpeed = function() {
        if (duringEvent) return this._moveSpeed + (this.isDashing() ? 1 : 0); // Use default speed during events
        else return $.speed + (this.isDashing() ? $.dash : 0);
    };
})(ZERO.WalkingSpeed);