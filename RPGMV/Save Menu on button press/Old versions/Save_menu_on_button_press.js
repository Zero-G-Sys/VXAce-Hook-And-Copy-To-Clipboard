//=============================================================================
// Save_menu_on_button_press.js
//=============================================================================
/*:
 * @Save_menu_on_button_press
 * @plugindesc Open save menu on button press
 * @version 1.2
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
"use strict";

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_ActionOnButton = 1;
ZERO.ActionOnButton = ZERO.ActionOnButton || {};


(function ($) {
  $.params = PluginManager.parameters('Save_menu_on_button_press');
  $.button = $.params['Save Button'].trim();
  $.button2 = $.params['Load Button'].trim();

  // Add key mappings
  function addKeyMapping(key){
    let buttonCode = key.toUpperCase().charCodeAt(0);

    // Prevent from mapping predefined strings (ej: 'pageup', 'left')
    for (let k in Input.keyMapper){
      if(key == Input.keyMapper[k]) return key;
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
  $.button2 = addKeyMapping($.button2);

  //----------------------------------//
  // Actions only during normal scene //
  //----------------------------------//
  
  // Alias method: update_scene
  var ZERO_Scene_Map_prototype_updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function () {
    ZERO_Scene_Map_prototype_updateScene.call(this);

    // Check for button press for save screen
    if (Input.isTriggered($.button) || TouchInput.isCancelled()) {
      SceneManager.push(Scene_Save);
    }

    // More actions can be added (need to add more button params)
    /*if (Input.isTriggered($.button) || TouchInput.isCancelled()) {
		//add code
		//example:
		SceneManager.push(Scene_Load);
	}*/
  };

  //----------------------------------//
  // Actions only during text         //
  //----------------------------------//

  var ZERO_WindowMessage_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function() {
    /*if (Input.isTriggered($.button2) || TouchInput.isCancelled()) {
		  
    }*/
    return ZERO_WindowMessage_updateInput.call(this);
  };

  //----------------------------------//
  // Actions triggered anywhere       //
  //----------------------------------//

  function keyEventListener(event){
      // Can set action without registering key in inputs    
      /*if(event.key == 'c'){ // C
      }*/
      // code can also used to distiguish between left right control
      // ControlLeft, ControlRight
      /*if(event.code == 'KeyC'){ // C
      }*/

      // Load screen
      if (Input.keyMapper[event.keyCode] == $.button2) {
        SceneManager.push(Scene_Load);
        //SceneManager.goto(sceneClass);
      }
  }

  document.addEventListener('keydown', keyEventListener.bind(this))

})(ZERO.ActionOnButton);
