//=============================================================================
// Hide Message Window Z
//=============================================================================
/*:
* @ZERO_HideMessageWindowZ
* @plugindesc Hide textbox or make textbox invisible while showing text.
* @title Hide Message Window Z
* @author Zero_G
* @version 2.2.5
* @filename ZERO_HideMessageWindowZ.js
* @help 
-------------------------------------------------------------------------------
== Description ==

This script will allow a player to:
  -Mode 1: Hide the textbox window while pressing a key.
  -Mode 2: Hide the textbox while still displaying the text.

Mode 1
  Press 'Hide Button' key to hide textbox completely, press again to restore.
  Trying to advance text while text is hidden won't be possible untile 
  textbox is restored

Mode 2
  Press 'Opacity Button' to hide textbox while still displaying text, press 
  it again to restore it. Further message windows will still remain transparent 
  until the user presses the key again.

Nameboxes from YEP_MessageCore and MPP_MessageEX are supported.

IMPORTANT: If using with MPP_MessageEX you need to edit that script so it's 
not an anonymous function. (lines # valid for ver 2.3)
Delete/comment the opening of the anonymous function (line 607) 
  (function() {
and the closing of the anonymous function (line 2074)
  })();

IMPORTANT2: if using Lunatlazur_ActorNameWindow you need to edit the sript
add at the first line
var HideMessageWindowZ_Lunatlazur;

add at the penultimate line, before: })();
HideMessageWindowZ_Lunatlazur = Window_ActorName;

== Credits ==

-Based on HIME HMSHideMessageWindow script

== Terms of Use ==

- Free for use in non-commercial projects
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==
TODO in 2.2.1 notes

2.2.5
 - Fixed a bug where YEP_MessageCore Namebox would show up if hiding a textbox with no namebox
2.2.4
 - Added a modded version of MPP_MessageEX
2.2.3
 - Change YEP Window Namebox from overwrite to alias (new alias that fixes 'undefined' bug).
2.2.2
 - Changed all hide nameboxes variables to a global one instead of a local
2.2.1
 - Fixed Lunatlazur next namebox didn't change opacity if triggered from a non named window.
 - TODO: YEP one sometimes behaves like that, may need to investigate for a fix (Find a game 
      that does that and replicate the issue constantly, otherwise I can't find why it's doing it)
 - Typo: Ocupacy to Opacity
2.2
 - Added Lunatlazur_ActorNameWindow name name window handling (requires editing the script)
2.1
 - Added YEP_MessageCore name window handling
 - Added MPP_MessageEX namebox handling (requires editing the script)
2.0 Code rewritten
 - Deprecated using command 101
 - Dim background properly hidden
 - Restoring window from mode 2 will now recover proper state
 - Added keymapping
1.1 
 - Added opacity

== Usage ==

In the plugin parameters, choose which key you wish to use for hiding
the message window and turning opacity.

-------------------------------------------------------------------------------
@param Hide Button
@desc Button to press to toggle message window visibility
@default d

@param Opacity Button
@desc Button to press to toggle message window opacity
@default c

-------------------------------------------------------------------------------
 */ 
"use strict";

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_HideMessageWindow = 1;
ZERO.HideMessageWindow = ZERO.HideMessageWindow || {};

(function ($) {
// Get plugin name and parameters
  var substrBegin = document.currentScript.src.lastIndexOf('/');
  var substrEnd = document.currentScript.src.indexOf('.js');
  var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
  $.params = PluginManager.parameters(scriptName);
  
  $.buttonHide = $.params["Hide Button"].trim();
  $.buttonHideOpacity = $.params["Opacity Button"].trim();

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

  $.buttonHide = addKeyMapping($.buttonHide);
  $.buttonHideOpacity = addKeyMapping($.buttonHideOpacity);

  // Remove 'alt' key from mappings
  delete Input.keyMapper[18];
  // Remove 'control' and replace it with left control only
  delete Input.keyMapper[17];
  var ZERO_Input__onKeyDown = Input._onKeyDown;
  Input._onKeyDown = function(event) {
    ZERO_Input__onKeyDown.call(this, event);
	if(event.code === 'ControlLeft') this._currentState['control'] = true;
  };
  var ZERO_Input__onKeyUp = Input._onKeyUp
  Input._onKeyUp = function(event) {
    ZERO_Input__onKeyUp.call(this, event);
	if(event.code === 'ControlLeft') this._currentState['control'] = false;
  };

  /* ---------------------------------------------------------------------------- */

  var isHidden = false;
  var isHiddenOpacity = false;

  // Overwrite updateBackground
  // Keep opacity to next messages
  Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    if (isHiddenOpacity) this.setBackgroundType(2);
    else this.setBackgroundType(this._background);
  };
  
  // Alias update. Read inputs
  var ZERO_WindowMessage_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function() { 
    // Hide textbox - By HIME
    if ((Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) && this.isOpen()) {
      isHidden = !isHidden;
      if (isHidden) this.visible = false;
      else this.visible = true;
    }

    // Hide message window but keep text
    if (Input.isTriggered($.buttonHideOpacity)) {
      isHiddenOpacity = !isHiddenOpacity

      if (isHiddenOpacity) this.setBackgroundType(2);
      else this.setBackgroundType(this._background);
    }
    
    ZERO_WindowMessage_update.call(this);
  };
  
  // Prevent from advancement text when message is hidden - By HIME
  var ZERO_WindowMessage_updateMessage = Window_Message.prototype.updateMessage;
  Window_Message.prototype.updateMessage = function() {
    if (isHidden) return false;
    else return ZERO_WindowMessage_updateMessage.call(this);
  }
  
  var ZERO_WindowMessage_terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    if (!isHidden) ZERO_WindowMessage_terminateMessage.call(this);
  };

  /* ---------------------------------------------------------------------------- */
  /* For YEP_MessageCore Namebox */ 
  /* -------------------------- */

  // Check if YEP plugin exists
  if(typeof Window_NameBox == 'function'){
    // Variable to check if there is a namebox in the current text so it can prevent
    // showing a namebox in case there wasn't one originally.
    var nameboxHide = false; 

    // MOD Set same background as message box -- Keep opacity to next messages
    // Need to call updateBackground on the earliest moments a new namebox is 
    // created (the object Window_NameBox is created once per conversation
    // but the contents are reset for each new textbox, each time it resets
    // this function from Window_Base is called) 
    var ZERO_Window_Base_createContents = Window_Base.prototype.createContents; 
    Window_Base.prototype.createContents = function() { 
      ZERO_Window_Base_createContents.call(this);
      if(this.constructor.name == "Window_NameBox") this.updateBackground();
    };
    Window_NameBox.prototype.updateBackground = function() {
      this._background = $gameMessage.background();
      if (isHiddenOpacity) this.setBackgroundType(2);
      else this.setBackgroundType(this._background);
    };

    // Overwrite YEP_MessageCore update
    // Add inputs 
    Window_NameBox.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      
      if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
        if (isHidden){ // Hide
          if(this.visible) { // Check if there was a namebox
            this.visible = false;
            nameboxHide = true;
          }
        } 
        else { // Restore
          if(nameboxHide) { // There was a namebox, restore it
            this.visible = true;
            nameboxHide = false;
          }
        }
      }
      if (Input.isTriggered($.buttonHideOpacity)) {
        if (isHiddenOpacity) this.setBackgroundType(2);
        else this.setBackgroundType(this._background);
      }
    
      // Original code
      if (this.active) return;
      if (this.isClosed()) return;
      if (this.isClosing()) return;
      if (this._closeCounter-- > 0) return;

      // Added line. Prevent from showing namebox when restoring message box if 
      // there was none in the current message (May be deprecated by nameboxHide variable)
      // **Probably useless as this is after the previous returns and will only 
      // proc before a close
      if (this._parentWindow.isClosing()) {
        this._openness = this._parentWindow.openness;
      }

      // Original code
      this.close();
    };
    
	  var ZERO_Window_NameBox_prototype_refresh = Window_NameBox.prototype.refresh;
    Window_NameBox.prototype.refresh = function(text, position) {
      var text = ZERO_Window_NameBox_prototype_refresh.call(this, text, position);
      nameboxHide = false; // Reset var on new namewindow (NOTE: Could this go in updateBackground, need to test)
      return text; 
    }
  }

  /* ---------------------------------------------------------------------------- */
  /* For MPP_MessageEX namebox */ 
  /* ------------------------ */

  // Need to comment/delete "(function() {" and its closing bracket "})();"
	// so MPP_MessageEX isn't in an anonymous function (can't access its functions otherwise)

  // Check if MPP plugin exists
  if(typeof Window_MessageName == 'function'){

    Window_MessageName.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      
      if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
        if (isHidden) this.visible = false;
        else this.visible = true;
      }
    
      if (isHiddenOpacity) this.opacity = 0;
      else this.opacity = 255;
      
      if (this._needOpen && this.isClosed()) {
          this.open();
          this._needOpen = false;
      }
   };
  }

  /* ---------------------------------------------------------------------------- */
  /* For Lunatlazur_ActorNameWindow namebox */ 
  /* ------------------------------------- */

  // Check if MPP plugin exists
  if (typeof HideMessageWindowZ_Lunatlazur !== 'undefined'){
    // Un-modded version
    // Alt version need to add on luna script, first line of code:
    // var HideMessageWindowZ_Lunatlazur;
    // and on prev of last line (inside anonymous function) })();
    // HideMessageWindowZ_Lunatlazur = Window_ActorName;
    // Making a global variable to access the required function without
    // de-anonymizing the plugin
    /*
    var ZERO_HideMessageWindowZ_Lunatlazur_prototype_update = HideMessageWindowZ_Lunatlazur.prototype.update;
    HideMessageWindowZ_Lunatlazur.prototype.update = function () {
      ZERO_HideMessageWindowZ_Lunatlazur_prototype_update.call(this);

      if ((Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) && this.isOpen()) {
        if (this.visible) this.visible = false;
        else this.visible = true;
      }
    
      if (isHiddenOpacity) this.opacity = 0;
      else this.opacity = 255;
    }
    */

    // Mod script so namewindows don't constantly close and open everytime textwindow changes
    Window_MessageName.prototype.initialize = function(messageWindow) {
      this._messageWindow = messageWindow;
      Window_Base.prototype.initialize.call(this, 0, 0, 0, this.fittingHeight(1));
      this.openness = 0;
      this._name = null;
      this.deactivate();
    };

    Window_MessageName.prototype.setName = function(name, colorIndex) {
      this.open();
      this.activate();
      this._name = name;
      var width = this.textWidth(name) + this.textPadding() * 2;
      this.width = width + this.standardPadding() * 2;
      this.createContents();
      this.resetFontSettings();
      this.changeTextColor(this.textColor(colorIndex));
      this.drawText(name, this.textPadding(), 0, width);
      this._needOpen = true;
      if ($gameMessage.positionType() === 0) {
          var y = this._messageWindow.y - MPPlugin.nameWindow.y;
          this._messageWindow.y = Math.max(y, 0);
      }
      this.x = this._messageWindow.x + MPPlugin.nameWindow.x;
      this.y = this._messageWindow.y + MPPlugin.nameWindow.y;
    };

    // Mod and hide namebox
    Window_MessageName.prototype.update = function() {
      Window_Base.prototype.update.call(this);

      if (this.isClosed() || this.isClosing()) {
        return;
      }

      if (Input.isTriggered($.buttonHide) && this.isOpen()) {
        isHiddenNamebox = !isHiddenNamebox;

        if (isHiddenNamebox) this.visible = false;
        else this.visible = true;
      }
      if (isHiddenOpacity) this.opacity = 0;
      else this.opacity = 255;

      if (this.active) return;

      this.close();
    };
  }

  /* ---------------------------------------------------------------------------- */
  /* For Lunatlazur_ActorNameWindow Namebox (MV-MZ Typescript converted) */ 
  /* ------------------------------------------------------------------ */
  // **IMPORTANT** NEED TO UN-ANONYMISE THAT PLUGIN
  if(typeof Window_ActorName == 'function'){

    Window_ActorName.prototype.update = function () {
      Window_Base.prototype.update.call(this);

      if (this.isClosed() || this.isClosing()) {
          return;
      }
      if (this._parentWindow.isClosing()) {
          this._openness = this._parentWindow.openness;
      }

      if (Input.isTriggered($.buttonHide) && this.isOpen()) {
        if (isHidden) this.visible = false;
        else this.visible = true;
      }
      if (isHiddenOpacity) this.opacity = 0;
      else this.opacity = 255;

      if (this.active) return;
      
      this.close();
    };

    Window_ActorName.prototype.setText = function (text) {
        this._text = text;
        this.refresh();
    };
  }

 

})(ZERO.HideMessageWindow);