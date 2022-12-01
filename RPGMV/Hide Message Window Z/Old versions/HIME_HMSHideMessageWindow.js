/*:
-------------------------------------------------------------------------------
@title HMS: Hide Message Window
@author Hime & Zero_G
@version 1.1
@date Mar 2, 2016
@filename HIME_HMSHideMessageWindow.js
@url 

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc Hide textbox or make textbox invisible while showing text.
@help 
-------------------------------------------------------------------------------
== Description ==

Sometimes, you want to be able to hide the message window while a message is
being shown.

For example, if you have some background art behind the message, you might let
the player admire the art by hiding the message at anytime.

This plugin allows you to choose which button to press to hide the message
window or turn it invisible and see only the text.

When the window is closed, the message will not advance.

Zero_G: Mode 2

Added the ability of hiding textbox while still displaying text. Once hidden
it will remain hidden even if you advance the text until the hide key is
pressed again.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.0 - Mar 2, 2016
 - initial release
1.1 - #
 - Zero_G: added ocupacy
2.0 - Zero_G: Rewrite mode 2
 - Deprecated using command 101
 - Dim background properly hidden
 - Restoring window from mode 2 will now recover proper state
2.1 - Zero_G: 

== Usage ==

In the plugin parameters, choose which button you wish to use for hiding
the message window and turning ocupacy.

The default values ('d' and 'c') need the 'Zero_MoreInputs' plugin.

If you're using the default input system, you can see this page for a list of
input formats

http://himeworks.com/wiki/index.php?title=MV_Formula_Library/Conditional_Formulas#Input-Based_Formulas

Depending on what input plugins you're using, the button you have to add might
be different. Consult the respective plugin instructions for more details.

-------------------------------------------------------------------------------
@param Hide Button
@desc Button to press to toggle message window visibility
@default d

@param Ocupacy Button
@desc Button to press to toggle message window ocupacy
@default c

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_HideMessageWindow = 1;
TH.HideMessageWindow = TH.HideMessageWindow || {};

(function ($) {

  $.params = PluginManager.parameters("HIME_HMSHideMessageWindow");
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

  // Add new variables to Window_Message
  var TH_WindowMessage_initMembers = Window_Message.prototype.initMembers;
  Window_Message.prototype.initMembers = function() {
    TH_WindowMessage_initMembers.call(this);
    this._isHidden = false;
    this._isHiddenOcupacy = false;
  };

  // Overwrite updateBackground
  // Keep ocupacy to next messages
  Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    if (this._isHiddenOcupacy) this.setBackgroundType(2);
    else this.setBackgroundType(this._background);
  };
  
  // Alias update. Read inputs
  var TH_WindowMessage_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
      this.updateHidden();
    }
    if (Input.isTriggered($.buttonHideOcupacy) || TouchInput.isCancelled()) {
      this.updateHiddenTextBoxOnly();
    }
    return TH_WindowMessage_update.call(this);
  };
  
  // New method. Hide message window
  Window_Message.prototype.updateHidden = function() {
    this._hidden = !this._hidden
    if (this._hidden) {
      this.visible = false;
    }
    else {
      this.visible = true;
    }
  };

  // New method. Hide message window but keep text
  Window_Message.prototype.updateHiddenTextBoxOnly = function() {
    this._isHiddenOcupacy = !this._isHiddenOcupacy
    if (this._isHiddenOcupacy) this.setBackgroundType(2);
    else this.setBackgroundType(this._background);
  };
  
  // Prevent from advancint text when message is hidden
  var TH_WindowMessage_updateMessage = Window_Message.prototype.updateMessage;
  Window_Message.prototype.updateMessage = function() {
    if (this._isHidden) return false;
    else return TH_WindowMessage_updateMessage.call(this);
  }
  
  var TH_WindowMessage_terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    if (!this._hidden) TH_WindowMessage_terminateMessage.call(this);
  };

})(TH.HideMessageWindow);