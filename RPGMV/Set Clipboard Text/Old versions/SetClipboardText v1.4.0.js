//=============================================================================
// SetClipboardText.js
//=============================================================================
/*:
 * @SetClipboardText
 * @plugindesc Insert clipboard text into game textbox
 * @version 1.4
 * @author Zero_G
 * @filename SetClipboardText.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 For using when translating game text via hook method.

 Sets the the text in clipboard to the current textbox, can also be triggered 
 via the press of a button.

 If text is too long for current textbox it adds a '*' a the end signifying 
 that there is more text to display, in that case press the defined button to see
 the rest of the text. (Pressing Z/Ok button for next in-game text will discard
 the current text, regardless if there where more pages seen or not).

 Plugin has wordwrap functionality, but the max characters must be set the in 
 options.

 Needs a modification to the script Clipboard_llule if you want it to stop 
 copying the pasted text. Instructions in readme.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 If using a button other than the preconfigured ones in MV, you must set the
 code by virtual key codes in this plugin. Or use another plugin that adds
 mappings. Keymapping for S is added by default.
 
 -------------------------------------------------------------------------------
 @param Text Button
 @desc Button to press to replace text
 @default s

 @param Max Width
 @desc Number of characters per line in a textbox with a face image
 @default 45

 @param Max Width Without Face
 @desc Number of characters per line in a textbox without a face image
 @default 55

 @param Auto Insert
 @desc Auto insert text without a button press
 @default true

 @param Ignore Text
 @desc Ignore text that starts with following character Enable/Disable
 @default true

 @param Ignore Text String
 @desc Ignore text that starts with following character
 @default 「
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_SetClipboardText = 1;
ZERO.SetClipboardText = ZERO.SetClipboardText || {};

(function ($) {
  $.params = PluginManager.parameters('SetClipboardText');
  $.button = $.params['Text Button'].trim();
  $.maxWidth = $.params['Max Width'].trim();
  $.maxWidthWithoutFace = $.params['Max Width Without Face'].trim();
  $.autoInsert = $.params['Auto Insert'].trim();
  $.ignoreText = $.params['Ignore Text'].trim();
  $.ignoreTextStr = $.params['Ignore Text String'].trim();
  $.escapeText = true; // For comunicating with external plugin

  // Alias
  var ZERO_Window_Base_processCharacter = Window_Base.prototype.processCharacter;
  
  // Nwjs
  var gui = require('nw.gui');
  var clipboard = gui.Clipboard.get();

  // Add virtual key code mapping for S
  if (Input.keyMapper[83] == undefined) Input.keyMapper[83] = 's'; 

  var textOverflowed = false;
  var overflowedText = '';
  var previousClipboardText = clipboard.get('text'); 

  var ZERO_WindowMessage_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function () {
    if ((Input.isTriggered('ok') || TouchInput.isCancelled()) && this.isOpen()) {
      textOverflowed = false;
      $.escapeText = true;
    }
    
    // Call function when text in memory changes
    if (this.isOpen() && $.autoInsert){
      if (previousClipboardText.localeCompare(clipboard.get('text')) && clipboard.get('text').localeCompare('') != 0){
        if ($.ignoreTextStr){
          if (!clipboard.get('text').startsWith($.ignoreTextStr)) this.replaceText();
        }else{
          this.replaceText();
        }
      }
    }

    // Call function manually with button, or use it when text is overflowed
    if ((Input.isTriggered($.button) || TouchInput.isCancelled()) && this.isOpen()) {
      this.replaceText();
    }

    return ZERO_WindowMessage_updateInput.call(this);
  };

  // New method
  Window_Message.prototype.replaceText = function (){
    let text = '';
    $.escapeText = false;
	
	  // Get text from clipboard or overflowed text
    if (textOverflowed) {
    text = overflowedText;
    } else {
      text = clipboard.get('text'); // Get text from clipboard
      previousClipboardText = text;

      console.log('Before wordwrap: ' + text);
      // Wordwrap text
      let wordWrapWidth = $.maxWidth;
      if ($gameMessage._faceName == '') {
        wordWrapWidth = $.maxWidthWithoutFace;
      }
      text = wordWrapper(text, wordWrapWidth);
      console.log('After wordwrap: ' + text);
    }

    // Check if text overflows from page
    if (isOverflowing(text)) {
      textOverflowed = true;
      
      // Split text
      let p = getPosition(text, '\n', 4);
      overflowedText = text.substring(p+1);
      text = text.substring(0, p) + '*'; // Add marker
    }else{
		  textOverflowed = false;
	  }

	  // Prepare text for textbox
    this._textState1 = {};
    this._textState1.index = 0;
	  this._textState1.line = 1;
	  this._textState1.text = text;
    this.newPage(this._textState1);
    this.updatePlacement();
    this.updateBackground();
	  this.open();
	  
	  // Process text
    while (!this.isEndOfText(this._textState1)) {
      this.processCharacter(this._textState1);
      //this.processCharacter2(this._textState1);
    }
  }

  // Function for wordwraping text
  function wordWrapper(str, width){
    // Split all text into words
    let text = str.split(' ');
    let line = '';
    str = '';
  
    // While there are words left in the text loop
    while(text.length > 0){
      // Loop until line is full or no more text
      while(line.length < width && text.length > 0){
        // if adding next word overflows line break loop
        if ((line + text[0]).length > width){
          break;
        }else{
          // add word to line
          if (typeof text[0] === 'undefined') text.shift();
          else line += text.shift() + ' ';
          //line += text.shift() + ' ';
        }
      }
    // add wordwrapped line to text
    str += line + '\n';
    // reset line
    line = '';
    }
  
    return str;
  }

  // Function to see if text is longer than 4 lines
  function isOverflowing(text) {
    let count = (text.match(/\n/g) || []).length;
    if (count >= 5) return true;
    else return false;
  };

  // Function to get index of a string inside a string
  // with the option to get the nth position
  // Here it is used to get the 4th '\n'
  function getPosition(string, subString, index) {
	  return string.split(subString, index).join(subString).length;
  }

  // Overwrite updateMessage so it stops processing a message when
  // a text from memory is pasted in box.
  // If another plugin conficts with this, the modification can 
  // be done to processCharacter method
  Window_Message.prototype.updateMessage = function() {
    if (this._textState) {
        while (!this.isEndOfText(this._textState) && $.escapeText) { // Modified line
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        if(!$.escapeText) this.onEndOfText(); // Line added
        return true;
    } else {
        return false;
    }
};

// In case the previous override confilcts with another plugin
// there is a problem that it doesn't clear text
// coding in progress (need to call onEndOfText for windowMessage from here)
/*Window_Base.prototype.processCharacter = function(textState) {
  if ($.escapeText) ZERO_Window_Base_processCharacter.call(this, textState);
}

Window_Base.prototype.processCharacter2 = function(textState) {
  ZERO_Window_Base_processCharacter.call(this, textState);
}*/

})(ZERO.SetClipboardText);
