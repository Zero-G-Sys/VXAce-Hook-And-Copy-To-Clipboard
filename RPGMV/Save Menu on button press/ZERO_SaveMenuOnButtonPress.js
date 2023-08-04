//=============================================================================
// Save Menu On Button Press
//=============================================================================
/*:
 * @ZERO_SaveMenuOnButtonPress
 * @plugindesc Open save menu on button press
 * @version 1.3
 * @author Zero_G
 * @filename ZERO_SaveMenuOnButtonPress.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin opens the save menu on a button press, can be used to call other scripts

 Two options for saving during choices, mode 1 and mode 2
 Mode 1 Uses BugFixLoadErrorChoiceSetup by Triacontane, and is less intrusive
        but seems to lack compatibility with other plugins
 Mode 2 Uses code from CallMenu by Krimer 
        TODO: This will conflict with SetClipboardText, so see for compatibility

 == Changelog ==
 - 1.3 - Added support for saving during text and choices

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

 @param Save During Text and Choices
 @desc Enable/Disable with 0, Select 1 for Mode 1, and 2 for Mode 2
 @default 1
 -------------------------------------------------------------------------------

*/
var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_ActionOnButton = 1;
ZERO.ActionOnButton = ZERO.ActionOnButton || {};

(function ($) {
  // Get plugin name and parameters
  var substrBegin = document.currentScript.src.lastIndexOf('/');
  var substrEnd = document.currentScript.src.indexOf('.js');
  var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
  $.params = PluginManager.parameters(scriptName);
  
  $.button = $.params['Save Button'].trim();
  $.button2 = $.params['Load Button'].trim();
  $.mode = $.params['Save During Text and Choices'].trim();

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
    if (Input.isTriggered($.button)) {
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
    if (Input.isTriggered($.button) && ($.mode == 1 || $.mode == 2)) {
      SceneManager.push(Scene_Save);
    }
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

  //----------------------------------//
  // Save During Choices Mode 1       //
  //----------------------------------//
  if($.mode == 1){
    var _Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth;
    Window_ChoiceList.prototype.maxChoiceWidth = function() {
        return this._windowContentsSprite ? _Window_ChoiceList_maxChoiceWidth.apply(this, arguments) : 96;
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents.apply(this, arguments);
        contents.message = $gameMessage;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        if (contents.message) $gameMessage = contents.message;
    };

    var _Game_Interpreter_update = Game_Interpreter.prototype.update;
    Game_Interpreter.prototype.update = function() {
        _Game_Interpreter_update.apply(this, arguments);
        if ($gameMessage.isChoice() && !$gameMessage._choiceCallback) {
            $gameMessage.setChoiceCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
        }
    };
  }

  //----------------------------------//
  // Save During Choices Mode 2       //
  //----------------------------------//
  if($.mode == 2){
    var _Game_Temp_initialize_Alias = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize_Alias.call(this)
        this._savedInterpreter = null;
        this._lastSelectedChoice = null;
    };
    /* NEW */
    Game_Temp.prototype.saveInterpreter = function(f) {
      this._savedInterpreter = f
    };
    /* NEW */
    Game_Temp.prototype.getSavedInterpreter = function() {
      return this._savedInterpreter
    };
    /* NEW */
    Game_Temp.prototype.setLastSelectedChoice = function(f) {
      this._lastSelectedChoice = f
    };
    /* NEW */
    Game_Temp.prototype.getLastSelectedChoice = function() {
      return this._lastSelectedChoice
    };
    /* Alias */
    var _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler
    Window_ChoiceList.prototype.callOkHandler = function() {
      $gameTemp.setLastSelectedChoice(null)
      _Window_ChoiceList_callOkHandler.call(this);
    };
    /* Alias */
    var _Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler
    Window_ChoiceList.prototype.callCancelHandler = function() {
      $gameTemp.setLastSelectedChoice(null)
      _Window_ChoiceList_callCancelHandler.call(this);
    };
    /* Alias */
    var _Window_ChoiceList_selectDefault = Window_ChoiceList.prototype.selectDefault
    Window_ChoiceList.prototype.selectDefault = function() {
      if ($gameTemp.getLastSelectedChoice() !== null){
          this.select($gameTemp.getLastSelectedChoice());
      } else {
          _Window_ChoiceList_selectDefault.call(this);
      }  
    };
    /* Alias*/
    var _Window_ChoiceList_update = Window_ChoiceList.prototype.update
    Window_ChoiceList.prototype.update = function() {
      _Window_ChoiceList_update.call(this);
      if ((Input.isTriggered($.button) || Input.isTriggered($.button2)) && $gameMessage.isBusy()) {
          $gameTemp.setLastSelectedChoice(this._index)
      }
    };

    /* Alias */
    var _Game_Interpreter_setupChoices_Alias = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
      _Game_Interpreter_setupChoices_Alias.call(this, params);
      $gameTemp.saveInterpreter(this)
    };
    /* Alias */
    var _DataManager_makeSaveContents_Alias = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
      var contents = _DataManager_makeSaveContents_Alias.call(this);
      contents.message = $gameMessage;
      if ($gameMessage._choices.length !== 0) {
        contents.interpreter = $gameTemp.getSavedInterpreter()
      }
      return contents;
    };
    /* Alias */
    var _DataManager_extractSaveContents_Alias = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
      _DataManager_extractSaveContents_Alias.call(this, contents);
      $gameMessage = contents.message;
      if ($gameMessage._choices.length !== 0) {
          var gameInterpreter = contents.interpreter
          $gameTemp.saveInterpreter(gameInterpreter)
          $gameMessage.setChoiceCallback(function(n) {
              gameInterpreter._branch[gameInterpreter._indent] = n;
          }.bind(this));
      }
    };

    /* OVERWRITE */ // Zero_G this may cause problems
    /*Window_Message.prototype.isTriggered = function () {
      return (Input.isRepeated('ok') || TouchInput.isRepeated());
    };*/
    /* Alias */
    var _Window_ChoiceList_WidthEx_Alias = Window_ChoiceList.prototype.textWidthEx;
    Window_ChoiceList.prototype.textWidthEx = function (text) {
      if(!SceneManager._scene.isActive()) return;
      return _Window_ChoiceList_WidthEx_Alias.call(this, text);
    };
    /* HIME_HiddenChoiceConditions Compatibility */
    var _Window_ChoiceList_makeCommandList_Alias = Window_ChoiceList.prototype.makeCommandList
    Window_ChoiceList.prototype.makeCommandList = function() {
      if(!SceneManager._scene.isActive()) return;
      _Window_ChoiceList_makeCommandList_Alias.call(this);
    }
    /* Galv_VisualNovelChoices Compatibility */
    if (Imported.Galv_VisualNovelChoices) {
      var _Window_ChoiceList_drawItem_Alias = Window_ChoiceList.prototype.drawItem 
      Window_ChoiceList.prototype.drawItem = function(index) {
      if(typeof this.choice_background === 'undefined'){
          this.choice_background = [];
      };
          _Window_ChoiceList_drawItem_Alias.call(this, index);
      };
    }
    /* SRD_TitleCommandCustomizer Compatibility */
    if (Imported["SumRndmDde Title Command Customizer"]) {
      var _Scene_Title_createMessageWindow_Alias = Scene_Title.prototype.createMessageWindow
      Scene_Title.prototype.createMessageWindow = function() {
          $gameMessage.clear();
          _Scene_Title_createMessageWindow_Alias.call(this)  
      };
    }
  }
})(ZERO.ActionOnButton);
