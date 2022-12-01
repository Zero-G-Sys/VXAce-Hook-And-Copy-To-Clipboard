//=============================================================================
// Hide Message Window Z
//=============================================================================
/*:
-------------------------------------------------------------------------------
@title Hide Message Window Z
@author Zero_G
@version 2.1
@filename HideMessageWindowZ.js

-------------------------------------------------------------------------------
@plugindesc Hide textbox or make textbox invisible while showing text.
@help 
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
  Press 'Ocupacy Button' to hide textbox while still displaying text, press 
  it again to restore it. Further message windows will still remain transparent 
  until the user presses the key again.

Nameboxes from YEP_MessageCore and MPP_MessageEX are supported.

IMPORTANT: If using with MPP_MessageEX you need to edit that script so it's 
not an anonymous function. (lines # valid for ver 2.3)
Delete/comment the opening of the anonymous function (line 607) 
  (function() {
and the closing of the anonymous function (line 2074)
  })();

== Credits ==

-Based on HIME HMSHideMessageWindow script

== Terms of Use ==

- Free for use in non-commercial projects
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

2.1
 - Added YEP_MessageCore name window handling
 - Added MPP_MessageEX namebox handling (required editing that script)
2.0 Code rewriten
 - Deprecated using command 101
 - Dim background properly hidden
 - Restoring window from mode 2 will now recover proper state
 - Added keymapping
1.1 
 - Added ocupacy

== Usage ==

In the plugin parameters, choose which key you wish to use for hiding
the message window and turning ocupacy.

-------------------------------------------------------------------------------
@param Hide Button
@desc Button to press to toggle message window visibility
@default d

@param Ocupacy Button
@desc Button to press to toggle message window ocupacy
@default c

-------------------------------------------------------------------------------
 */ 
"use strict";

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_HideMessageWindow = 1;
ZERO.HideMessageWindow = ZERO.HideMessageWindow || {};

(function ($) {

  $.params = PluginManager.parameters("HideMessageWindowZ");
  $.buttonHide = $.params["Hide Button"].trim();
  $.buttonHideOcupacy = $.params["Ocupacy Button"].trim();

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

  $.buttonHide = addKeyMapping($.buttonHide);
  $.buttonHideOcupacy = addKeyMapping($.buttonHideOcupacy);

  // Remove 'alt' key from mappings
  delete Input.keyMapper[18];

  /* ---------------------------------------------------------------------------- */

  var isHidden = false;
  var isHiddenOcupacy = false;

  // Overwrite updateBackground
  // Keep ocupacy to next messages
  Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    if (isHiddenOcupacy) this.setBackgroundType(2);
    else this.setBackgroundType(this._background);
  };
  
  // Alias update. Read inputs
  var ZERO_WindowMessage_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    
    // Hide textbox - By HIME
    if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
      isHidden = !isHidden;
      if (isHidden) this.visible = false;
      else this.visible = true;
    }

    // Hide message window but keep text
    if (Input.isTriggered($.buttonHideOcupacy) || TouchInput.isCancelled()) {
      isHiddenOcupacy = !isHiddenOcupacy

      if (isHiddenOcupacy) this.setBackgroundType(2);
      else this.setBackgroundType(this._background);
    }
    
    ZERO_WindowMessage_update.call(this);
  };
  
  // Prevent from advancint text when message is hidden - By HIME
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

    let isHiddenNamebox = false;

    // Overwrite YEP_MessageCore update
    // Add inputs 
    Window_NameBox.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      
      if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
        isHiddenNamebox = !isHiddenNamebox;

        if (isHiddenNamebox) this.visible = false;
        else this.visible = true;
      }
      if (Input.isTriggered($.buttonHideOcupacy) || TouchInput.isCancelled()) {
        if (isHiddenOcupacy) this.opacity = 0;
        else this.opacity = 255;
      }
    
      // Original code
      if (this.active) return;
      if (this.isClosed()) return;
      if (this.isClosing()) return;
      if (this._closeCounter-- > 0) return;

      // Added line. Prevent from showing namebox when restoring message box if 
      // there was none in the current message
      if (this._parentWindow.isClosing()) {
        this._openness = this._parentWindow.openness;
      }

      // Original code
      this.close();
    };
    
    // Prevent new namebox from regaining opacity after scene change
    // Overwrite refresh (while an alias could be used, it generates an 'undefined' text)
    Window_NameBox.prototype.refresh = function(text, position) {
      if (isHiddenOcupacy) this.opacity = 0;

      // Original code
      this._text = Yanfly.Param.MSGNameBoxText + text;
      this._position = position;
      this.width = this.windowWidth();
      this.createContents();
      this.contents.clear();
      this.resetFontSettings();
      this.changeTextColor(this.textColor(Yanfly.Param.MSGNameBoxColor));
      var padding = eval(Yanfly.Param.MSGNameBoxPadding) / 2;
      this.drawTextEx(this._text, padding, 0, this.contents.width);
      this._parentWindow.adjustWindowSettings();
      this._parentWindow.updatePlacement();
      this.adjustPositionX();
      this.adjustPositionY();
      this.open();
      this.activate();
      this._closeCounter = 4;
      return '';
    }
  }

  /* ---------------------------------------------------------------------------- */
  /* For MPP_MessageEX namebox */ 
  /* ------------------------ */

  // Need to comment/delete "(function() {" and its closing bracket "})();"
	// so MPP_MessageEX isn't in an anonymous function (can't access its functions otherwise)

  // Check if MPP plugin exists
  if(typeof Window_MessageName == 'function'){
    let isHiddenNamebox = false;

    Window_MessageName.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      
      if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
        isHiddenNamebox = !isHiddenNamebox;

        if (isHiddenNamebox) this.visible = false;
        else this.visible = true;
      }
    
      if (Input.isTriggered($.buttonHideOcupacy) || TouchInput.isCancelled()) {
        if (isHiddenOcupacy) this.opacity = 0;
        else this.opacity = 255;
      }
      
      if (this._needOpen && this.isClosed()) {
          this.open();
          this._needOpen = false;
      }
   };
  }

})(ZERO.HideMessageWindow);