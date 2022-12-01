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

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.0 - Mar 2, 2016
 - initial release
1.1 - #
 - Zero_G: added ocupacy

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
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
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

  var global_isHiddenTextboxOnly = false;
  $.params = PluginManager.parameters("HIME_HMSHideMessageWindow");
  $.button = $.params["Hide Button"].trim();
  $.button2 = $.params["Ocupacy Button"].trim();

  var TH_WindowMessage_initMembers = Window_Message.prototype.initMembers;
  Window_Message.prototype.initMembers = function() {
    TH_WindowMessage_initMembers.call(this);
    this._isHidden = false;
  };

  /*var ZERO_Window_Message_prototype_initialize = Window_Message.prototype.initialize
  Window_Message.prototype.initialize = function(){
    ZERO_Window_Message_prototype_initialize.call(this);
    if (global_isHiddenTextboxOnly) {
      this.opacity = 0;
    }
  };*/

  Window_Message.prototype.updateBackground = function() {
    if (global_isHiddenTextboxOnly) {
      this._background = 3;
    }
    else {
      this._background = $gameMessage.background();
    }
    this.setBackgroundType(this._background);
  };

  var ZERO_Window_Message_prototype_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    /*if (global_isHiddenTextboxOnly) {
      this.opacity = 0;
    }
    else {
      this.opacity = 255;
    }*/

    if (Input.isTriggered($.button) || TouchInput.isCancelled()) {
      this.updateHidden();
    }
    if (Input.isTriggered($.button2) || TouchInput.isCancelled()) {
      this.updateHiddenTextBoxOnly();
    }
    ZERO_Window_Message_prototype_update.call(this);
  }
  
  Window_Message.prototype.updateHidden = function() {
    this._hidden = !this._hidden
    if (this._hidden) {
      this.visible = false;
    }
    else {
      this.visible = true;
    }
  };

  Window_Message.prototype.updateHiddenTextBoxOnly = function() {
    global_isHiddenTextboxOnly = !global_isHiddenTextboxOnly
    if (global_isHiddenTextboxOnly) {
      this.opacity = 0;
    }
    else {
      this.opacity = 255;
    }
  };
  
  var TH_WindowMessage_updateMessage = Window_Message.prototype.updateMessage;
  Window_Message.prototype.updateMessage = function() {
    if (this._isHidden) {
      return false;
    }
    else {
      return TH_WindowMessage_updateMessage.call(this);
    }
  }
  
  var TH_WindowMessage_terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    if (!this._hidden) {
      TH_WindowMessage_terminateMessage.call(this);
    }
  };

  /* Game Interpreter */
  /* Needed to prevent next messages to restore textbox ocupacy */ 

  Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);

        // Prevent next messages to restore textbox ocupacy
        if(global_isHiddenTextboxOnly){
          $gameMessage.setBackground(2);
        }

        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

})(TH.HideMessageWindow);