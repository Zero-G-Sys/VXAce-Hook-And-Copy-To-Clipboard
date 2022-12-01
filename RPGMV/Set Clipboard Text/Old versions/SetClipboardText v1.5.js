//=============================================================================
// SetClipboardText.js
//=============================================================================
/*:
 * @SetClipboardText
 * @plugindesc Insert clipboard text into game textbox
 * @version 1.5
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

 The script has a functionality to ignore and not re display japanese text that 
 was copied to the clipboard. There are two options, only one must be used.
 - Ignore text that starts with a specific character ('「' for example, 
    Clipboard_llule adds this to most sentences by default).
 - Ignore all japanese characters by a regex function.

 Needs a modification to the script Clipboard_llule if you want it to stop 
 copying the pasted text. Instructions in readme.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Changelog ==
 1.5 -Added keymapping function
     -Added text popup when switching auto insert

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

 @param Auto Insert Toggle
 @desc Toggles auto insert functionality (Best used when skipping text fast)
 @default f

 @param Ignore Text Starting With
 @desc Ignore text that starts with following character Enable/Disable
 @default false

 @param Ignore Text String
 @desc Ignore text that starts with following character
 @default 「

 @param Ignore Japanese Text
 @desc Ignore japanese text via regex
 @default true
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_SetClipboardText = 1;
ZERO.SetClipboardText = ZERO.SetClipboardText || {};

(function ($) {
  $.params = PluginManager.parameters('SetClipboardText');
  $.textButton = $.params['Text Button'].trim();
  $.maxWidth = $.params['Max Width'].trim();
  $.maxWidthWithoutFace = $.params['Max Width Without Face'].trim();
  $.autoInsert = $.params['Auto Insert'].trim();
  $.autoInsertToogleKey = $.params['Auto Insert Toggle'].trim();
  $.ignoreTextStartWith = $.params['Ignore Text Starting With'].trim();
  $.ignoreTextStr = $.params['Ignore Text String'].trim();
  $.ignoreJapText = $.params['Ignore Japanese Text'].trim();
  $.escapeText = true; // Also used for comunicating with external plugin

  // Nwjs
  var gui = require('nw.gui');
  var clipboard = gui.Clipboard.get();

  // Local variables
  var textOverflowed = false;
  var autoInsertToggle = true;
  var overflowedText = '';
  var previousClipboardText = clipboard.get('text'); 
  var clipboardText = '';
  var wait = true;

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

  $.textButton = addKeyMapping($.textButton);
  $.autoInsertToogleKey = addKeyMapping($.autoInsertToogleKey);

  
  // Alias Window_Message updateInput
  var ZERO_WindowMessage_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function () {
    if ((Input.isTriggered('ok') || TouchInput.isCancelled()) && this.isOpen()) {
      textOverflowed = false;
      $.escapeText = true;
      wait = true;
    }

    if ((Input.isTriggered($.autoInsertToogleKey) || TouchInput.isCancelled()) && this.isOpen()) {
      autoInsertToggle = !autoInsertToggle
      if(autoInsertToggle) SceneManager.callPopup('Auto Insert Enabled');
      else SceneManager.callPopup('Auto Insert Disabled');
      console.log('toggle: ' + autoInsertToggle)
    }
    
    if (this.isOpen() && $.autoInsert && $.escapeText && autoInsertToggle){
      clipboardText = clipboard.get('text'); // Get text from clipboard, this must be here otherwise replaceText function may pick up other text when it runs
      console.log('previous: ' + previousClipboardText);
      console.log('clipboard: ' + clipboardText);
      console.log('compare previous 2: ' + previousClipboardText.localeCompare(clipboardText));
      console.log('compare to space: ' + clipboardText.localeCompare(''));
      console.log('wait: ' + wait);
      
      if (previousClipboardText.localeCompare(clipboardText) // Compare with previous clipboard
      && clipboardText.localeCompare('') != 0 // Check if text is empty
      && $.escapeText // Stop entering if replacing text function was called (once debugging is done, this should be erased and only use the upper one)
      ){
        if(wait){
          setTimeout(() => { wait = false; }, 100); // delay replacing text to give Clipboard_llule time to copy orig text to clipboard, should enter once per textbox
        }else{
          if ($.ignoreTextStartWith == true){ // needs true explicit check due to MV bug
            if (!clipboardText.startsWith($.ignoreTextStr)) this.replaceText();
          }else if($.ignoreJapText){
            if (clipboardText.search(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/u) == -1) this.replaceText();
          }else{
            this.replaceText();
          }
        }
      }   
    }

    // Call function manually with button, or use it when text is overflowed
    if ((Input.isTriggered($.textButton) || TouchInput.isCancelled()) && this.isOpen()) {
      clipboardText = clipboard.get('text'); // Get text from clipboard
      this.replaceText();
    }

    return ZERO_WindowMessage_updateInput.call(this);
  };

  // New method
  Window_Message.prototype.replaceText = function (){
    let text = '';
    $.escapeText = false;
    wait = true;
    
	  // Get text from clipboard or overflowed text
    if (textOverflowed) {
    text = overflowedText;
    console.log('text overflowed');
    } else {
      text = clipboardText;
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
    console.log('text to display: ' + text);
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
    
    if(text.length != 1){ // Precaution for japanese text entering here
      str = '';
    // While there are words left in the text loop
      while(text.length > 0){
        // Loop until line is full or no more text
        while(line.length < width && text.length > 0){
          // if adding the next word overflows line, break loop
          if ((line + text[0]).length > width){
            break;
          }else{
            // add word to line
            if (typeof text[0] === 'undefined') text.shift();
            else line += text.shift() + ' ';
          }
        }
      // add wordwrapped line to text
      str += line + '\n';
      // reset line
      line = '';
      }
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

/*
// Alias
var ZERO_Window_Base_processCharacter = Window_Base.prototype.processCharacter;
Window_Base.prototype.processCharacter = function(textState) {
  if ($.escapeText) ZERO_Window_Base_processCharacter.call(this, textState);
}

Window_Base.prototype.processCharacter2 = function(textState) {
  ZERO_Window_Base_processCharacter.call(this, textState);
}*/

/* -------------------------------------------------------------------*/

/*
*  Popup Text
*/

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
SceneManager.callPopup = function (text, position = 'topRight', maxWidth = 150) {
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

  if(popupSprite.opacity > 0) {
      popupSprite.opacity -= 1;
  }
};

/*--------------------------------------------------------------------------*/

})(ZERO.SetClipboardText);
