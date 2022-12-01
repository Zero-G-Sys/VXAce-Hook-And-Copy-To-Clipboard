//=============================================================================
// Walking Dash Speed Plus (With forced toggle)
//=============================================================================
/*:
 * @ZERO_WalkingDashSpeedPlus
 * @plugindesc Faster walking and dash speed
 * @version 1.3alt
 * @author Zero_G
 * @filename ZERO_WalkingDashSpeedPlus.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin changes the main character default walking (and dash) speed, by 
 default it increases it by one level.

 Variant: Use script speed even in events, unless toggles with a key between
 Forced/Normal speed (set to key 'v').

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

 + Forced Speed:
 Use key always use speed setted (some games trigger the duringEvent flag
 during normal play)

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 == Changelog ==
 1.3alt
 - Forced speed
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
    var forcedSpeed = true;

    // Toggle forced speed (Only on scene menu)
    // Disabled because added an event listener to listen for the key everywhere
    /*Input.keyMapper[86] = 'v';
    var ZERO_Scene_Map_prototype_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function () {
        ZERO_Scene_Map_prototype_updateScene.call(this);

        // Check for button press for save screen
        if (Input.isTriggered('v') || TouchInput.isCancelled()) {
            forcedSpeed = !forcedSpeed;
            if(forcedSpeed) SceneManager.callPopup('Speed Forced');
            else SceneManager.callPopup('Speed Normal');
        }
    };*/

    document.addEventListener('keydown', function (event){
        if(event.key == 'v'){
            forcedSpeed = !forcedSpeed;
            if(forcedSpeed) SceneManager.callPopup('Speed Forced');
            else SceneManager.callPopup('Speed Normal');
        }
    });

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
        if (duringEvent && !forcedSpeed) return this._moveSpeed + (this.isDashing() ? 1 : 0); // Use default speed during events
        else return $.speed + (this.isDashing() ? $.dash : 0);
    };

    /* -------------- Text Popup ----------------- */
    // Create sprite object
    var popupSprite;
    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);

        popupSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        popupSprite.opacity = 255;
        this.addChild(popupSprite);
    };

    // Call popup

    /* drawText info
    * @param {String} text The text that will be drawn
    * @param {Number} x The x coordinate for the left of the text
    * @param {Number} y The y coordinate for the top of the text
    * @param {Number} maxWidth The maximum allowed width of the text
    * @param {Number} lineHeight The height of the text line
    * @param {String} align The alignment of the text
    **/
    SceneManager.callPopup = function (text, position = 'topRight', maxWidth = 100) {
        popupSprite.bitmap.clear();
        popupSprite.opacity = 255;

        switch(position){
            case 'topRight':
                popupSprite.bitmap.drawText(String(text), Graphics.width - maxWidth - 10, 10, maxWidth, 30, 'right');
                break;
            case 'bottomRight':
                popupSprite.bitmap.drawText(String(text), Graphics.width - maxWidth - 10, Graphics.height - 50, maxWidth, 30, 'right');
                break;
            case 'topLeft':
                popupSprite.bitmap.drawText(String(text), 10, 10, maxWidth, 30, 'left');
                break;
            case 'bottomLeft':
                popupSprite.bitmap.drawText(String(text), 10, Graphics.height - 50, maxWidth, 30, 'left');
                break;
        }
    };

    // Fade popup
    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);

        if (typeof popupSprite !== 'undefined'){
            if(popupSprite.opacity > 0) {
                popupSprite.opacity -= 1;
            }
        }
    };
 })(ZERO.WalkingSpeed);