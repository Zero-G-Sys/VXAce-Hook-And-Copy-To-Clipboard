//=============================================================================
// Save_menu_on_button_press.js
//=============================================================================
/*:
 * @Save_menu_on_button_press
 * @plugindesc Open save menu on button press
 * @version 1.1
 * @author Zero_G
 * @filename Save_menu_on_button_press.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin opens the save menu on a button press, can be used to call other scripts

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.
 
 -------------------------------------------------------------------------------
 @param Save Button
 @desc Button to press to call save menu
 @default pageup
 
 @param Load Button
 @desc Button to press to call save menu
 @default e
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_ActionOnButton = 1;
ZERO.ActionOnButton = ZERO.ActionOnButton || {};

// Added mappings
if (Input.keyMapper[69] === undefined) {
  Input.keyMapper[69] = 'e'; // E
}

(function ($) {
  $.params = PluginManager.parameters('Save_menu_on_button_press');
  $.button = $.params['Save Button'].trim();
  $.button2 = $.params['Load Button'].trim();

  // Alias method: update_scene
  var ZERO_Scene_Map_prototype_updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function () {
    ZERO_Scene_Map_prototype_updateScene.call(this);

    // Check for button press for save screen
    if (Input.isTriggered($.button) || TouchInput.isCancelled()) {
      SceneManager.push(Scene_Save);
    }

    if (Input.isTriggered($.button2) || TouchInput.isCancelled()) {
      SceneManager.push(Scene_Load);
      //SceneManager.goto(sceneClass);
    }

    // More actions can be added (need to add more button params)
    /*if (Input.isTriggered($.button) || TouchInput.isCancelled()) {
		//add code
		//example:
		SceneManager.push(Scene_Load);
	}*/
  };

  // For load screen during messages
  var ZERO_WindowMessage_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function() {
    if (Input.isTriggered($.button2) || TouchInput.isCancelled()) {
		SceneManager.push(Scene_Load);
    }
    return ZERO_WindowMessage_updateInput.call(this);
  };
})(ZERO.ActionOnButton);
