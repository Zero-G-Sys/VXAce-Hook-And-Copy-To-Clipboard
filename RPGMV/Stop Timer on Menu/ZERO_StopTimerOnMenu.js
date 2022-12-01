//=============================================================================
// Stop Timer On Menu
//=============================================================================
/*:
 * @ZERO_StopTimerOnMenu
 * @plugindesc Stops game timer when menu is opened
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_StopTimerOnMenu.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin stops game timer when menu is opened to try and get a more real
 time of played time.

 Stops time only on main menu (not items, formation, etc), and Save/Load screens.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin. No parameters needed
 
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_StopTimerOnMenu = 1;
ZERO.StopTimerOnMenu = ZERO.StopTimerOnMenu || {};


(function ($) {
    // Overwrite
    Graphics.render = function(stage) {
        // Original code
        if (this._skipCount === 0) {
            var startTime = Date.now();
            if (stage) {
                this._renderer.render(stage);
                if (this._renderer.gl && this._renderer.gl.flush) {
                    this._renderer.gl.flush();
                }
            }
            var endTime = Date.now();
            var elapsed = endTime - startTime;
            this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
            this._rendered = true;
        } else {
            this._skipCount--;
            this._rendered = false;
        }
        // New code
        if (SceneManager._scene instanceof Scene_Menu ||
            SceneManager._scene instanceof Scene_Save ||
            SceneManager._scene instanceof Scene_Load){
        }else{
            this.frameCount++;
        }  
      };

    // Adjust volume in options by increments of 10
    Window_Options.prototype.volumeOffset = function() {
        return 10;
    };
})(ZERO.StopTimerOnMenu);