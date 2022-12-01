//=============================================================================
// SetClipboardText.js
//=============================================================================
/*:
 * @SetClipboardText
 * @plugindesc Insert clipboard text into game textbox
 * @version 1.11.4
 * @author Zero_G
 * @filename SetClipboardText.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 For using when translating game text via hook method.

 Sets the the text in clipboard to the current textbox, can also be triggered 
 via the press of a button.

 If text is too long for current textbox it adds a '*' a the end signifying 
 that there is more text to display, in that case press the defined 'Text Button'
 to see the rest of the text. (Pressing Z/Ok button for next in-game text will 
 discard the current text, regardless if there where more pages seen or not).

 Plugin has wordwrap functionality, but the max characters must be set the in 
 options.

 The script has a functionality to ignore and not re display japanese text that 
 was copied to the clipboard. There are two options, only one must be used.
 - Ignore text that starts with a specific character ('「' for example, 
    Clipboard_llule adds this to most sentences by default).
 - Ignore all japanese characters by a regex function.

 Needs a modification to the script Clipboard_llule if you want it to stop 
 copying the pasted text. Instructions in readme.
 Higly recommended to use modded one.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Changelog ==
 1.11.4 -Send choices to DeepL with []. and split translated ones with '].' (Fix problems in case the choices
          have '!' or '...') (Previously they were splited with '.')
        -Fix. Remove color codes from window text when sending choices.
 1.11.3 -If there was a text window with the choices, send them together for translation and replace 
         them at the same time (faster as it is only one translation request).
 1.11.2 -Choices window now properly resizes to choice lenght (no more cropped choices)
 1.11.1 -Changed detection of choices (should detect choices without textbox)
        -Changed detection of window message from updateInput to update and checking if a window is open
         +Should be less cpu intense
         +Fixed auto insert of tranlated text in textbox when a choices window appears in some games
 1.11   -Add Auto Replace Choices function
        -Removed auto insert unnecessary double variable
        -Added separate variable for stoping processing character while replace function is working.
 1.10   -Add option to use Yanfly backlog plugin
        -Alternate way to get text from current window (not used)
 1.9    -Added sending choices to clipboard with a button
        -Added changeing font size of tranlated text
 1.8    -Added setting of textbox lines, so text overflow works when textbox is 
         smaller or bigger
 1.7    -Fixed word wrap single line loop
        -Changed prepare next message to startMessage method
        -Fixed wait time setting to false when viewing text too fast
 1.6    -Added override variables to parameters
        -Added more commenting
 1.5    -Added keymapping function
        -Added text popup when switching auto insert

 == Usage ==
 Just add the plugin. Plugin must be loaded before Clipboard_Ilule
 
 -------------------------------------------------------------------------------
 @param Text Button
 @desc Button to press to replace text
 @default s

 @param Copy Text to Clipboard
 @desc Copies text of current window to clipboard (useful when Clipboard_llule, fails to copy it)
 @default f

 @param Copy Choices to Clipboard
 @desc Button to copy choices to clipboard
 @default r

 @param Max Width
 @desc Number of characters per line in a textbox with a face image
 @default 45
 @type number

 @param Max Width Without Face
 @desc Number of characters per line in a textbox without a face image
 @default 55
 @type number

 @param Textbox Lines
 @desc Number of lines in game textbox
 @default 4
 @type number

 @param Font Size Of Translated Text
 @desc Change font size of translated text. Most games use 28, leave at 0 to use game default
 @default 0
 @type number

 @param Auto Insert
 @desc Auto insert text without a button press
 @default true
 @type boolean

 @param Auto Insert Toggle
 @desc Toggles auto insert functionality (Best used when skipping text fast)
 @default g

 @param Auto Replace Choices
 @desc Auto replace choices with transalted ones
 @default true
 @type boolean

 @param Auto Replace Choices Toggle
 @desc Toggles replace choices functionality
 @default h

 @param Ignore Text Starting With
 @desc Ignore text that starts with following character Enable/Disable
 @default false
 @type boolean

 @param Ignore Text String
 @desc Ignore text that starts with following character
 @default 「

 @param Ignore Japanese Text
 @desc Ignore japanese text via regex
 @default true
 @type boolean

 @param Use Backlog
 @desc Add translated text to YEP_Backlog extension (YEP Plugin must be loaded first)
 @default false
 @type boolean
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_SetClipboardText = 1;
ZERO.SetClipboardText = ZERO.SetClipboardText || {};

(function ($) {
 /*---------------------------------------------------------------------------------------*/
 /* Manual configuration without using params                                             */
 /* If any of this variables are not empty ('') they will override the value set by the   */
 /* parameter read from plugins.js                                                         */
 /*---------------------------------------------------------------------------------------*/

 // desc Button to press to replace text.
 // default 's'
 var _textButton = ''; 

 // desc Button to copy text of current window to clipboard (useful when Clipboard_llule, fails to copy it).
 // default 'f'
 var _copyTextButton = '';

 // desc Button to copy choices to clipboard.
 // default 'r'
 var _copyChoicesButton = '';

 // desc Number of characters per line in a textbox with a face image.
 // default 45
 // Use a number not a string. Ex: 45 not '45'
 var _maxWidth = '';

 // desc Number of characters per line in a textbox without a face image.
 // default 55 
 // Use a number not a string. Ex: 55 not '55'
 var _maxWidthWithoutFace = '';

 // desc Number of lines in game textbox.
 // defualt 4
 // Use a number not a string. Ex: 4 not '4'
 var _textboxLines = '';

 // desc Change font size of translated text. Most games use 28, leave at 0 to use game default.
 // defualt 0
 // Use a number not a string. Ex: 0 not '0'
 var _fontSize = '';

 // desc Auto insert translated text without manual button press.
 // default true
 // use a boolean (true or false). Ex: true, not 'true'
 var _autoInsert = '';

 // desc Toggles auto insert functionality (Best used when skipping text fast). Will display a message at the top rigth screen.
 // default g
 var _autoInsertToggleKey = '';

 // Auto replace choices with transalted ones
 // default true
 // use a boolean (true or false). Ex: true, not 'true'
 var _autoReplaceChoices = '';

 // desc Toggles replace choices functionality. Will display a message at the top rigth screen.
 // default g
 var _autoReplaceChoicesToggleKey = '';

 // desc Ignore text that starts with a specific character/word. Enable/Disable
 // This is useful when some unwanted text is being copied to the clipboard, normally that is not the case.
 // default false
 // use a boolean (true or false). Ex: false, not 'false'
 var _ignoreTextStartingWith = '';

 // desc Ignore text that starts with following character/string. Previous parameter must be true fro this to work.
 // default '「'
 var _ignoreTextString = '';

 // desc Ignore japanese text via regex
 // Sometimes a pre tranlated text is cought in the script, enable this to ignore it.
 // default true
 // use a boolean (true or false). Ex: true, not 'true'
 var _ignoreJapaneseText = '';

 // desc Add translated text to YEP_Backlog extension (YEP Plugin must be loaded first).
 // default false
 // use a boolean (true or false). Ex: true, not 'true'
 var _useBacklog = true;
 
 /*--------------------------------------------------------------------------------------*/
 /* End of manual configuration                                                          */
 /*--------------------------------------------------------------------------------------*/

  $.params = PluginManager.parameters('SetClipboardText');
  
  $.textButton = $.params['Text Button'].trim();
  if(_textButton !== '') $.textButton = _textButton;

  $.copyTextButton = $.params['Copy Text to Clipboard'].trim();
  if(_copyTextButton !== '') $.copyTextButton = _copyTextButton;

  $.copyChoicesButton = $.params['Copy Choices to Clipboard'].trim();
  if(_copyChoicesButton !== '') $.copyChoicesButton = _copyChoicesButton;

  $.maxWidth = $.params['Max Width'].trim();
  if(_maxWidth !== '') $.maxWidth = _maxWidth;

  $.maxWidthWithoutFace = $.params['Max Width Without Face'].trim();
  if(_maxWidthWithoutFace !== '') $.maxWidthWithoutFace = _maxWidthWithoutFace;

  $.textboxLines = $.params['Textbox Lines'].trim();
  if(_textboxLines !== '') $.textboxLines = _textboxLines;

  $.fontSize = $.params['Font Size Of Translated Text'].trim();
  if(_fontSize !== '') $.fontSize = _fontSize;

  $.autoInsert = ($.params['Auto Insert'].trim() === 'true');
  if(_autoInsert !== '') $.autoInsert = _autoInsert;

  $.autoInsertToogleKey = $.params['Auto Insert Toggle'].trim();
  if(_autoInsertToggleKey !== '') $.autoInsertToogleKey = _autoInsertToggleKey;

  $.autoReplaceChoices  = ($.params['Auto Replace Choices'].trim() === 'true');
  if(_autoReplaceChoices  !== '') $.autoReplaceChoices  = _autoReplaceChoices ;

  $.autoReplaceChoicesToggleKey = $.params['Auto Replace Choices Toggle'].trim();
  if(_autoReplaceChoicesToggleKey !== '') $.autoReplaceChoicesToggleKey = _autoReplaceChoicesToggleKey;

  $.ignoreTextStartWith = ($.params['Ignore Text Starting With'].trim() === 'true');
  if(_ignoreTextStartingWith !== '') $.ignoreTextStartWith = _ignoreTextStartingWith;

  $.ignoreTextStr = $.params['Ignore Text String'].trim();
  if(_ignoreTextString !== '') $.ignoreTextStr = _ignoreTextString;

  $.ignoreJapText = ($.params['Ignore Japanese Text'].trim() === 'true');
  if(_ignoreJapaneseText !== '') $.ignoreJapText = _ignoreJapaneseText;

  $.useBacklog = ($.params['Use Backlog'].trim() === 'true');
  if(_useBacklog !== '') $.useBacklog = _useBacklog;

  // Variable used to control the when to show the translated text
  // Also used for comunicating with external plugin (Clipboard_Ilule)
  $.escapeText = true;
  $.replacingChoicesStopIlule = false; // used to stop Ilule when replacing choices
  
  // Nwjs
  var gui = require('nw.gui');
  var clipboard = gui.Clipboard.get();

  // Local variables
  var textOverflowed = false;
  var overflowedText = '';
  var previousClipboardText = clipboard.get('text'); 
  var clipboardText = '';
  var wait = true;
  var timeout;
  var stopDrawingText = false;

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

  $.textButton = addKeyMapping($.textButton);
  $.copyTextButton = addKeyMapping($.copyTextButton);
  $.copyChoicesButton = addKeyMapping($.copyChoicesButton);
  $.autoInsertToogleKey = addKeyMapping($.autoInsertToogleKey);
  $.autoReplaceChoicesToggleKey = addKeyMapping($.autoReplaceChoicesToggleKey);

  // Alias Window_Base initialize
  // Add variable for storing text of current window, used in sending current 
  // window text to clipboard (for Copy Text to Clipboard button)
  ZERO_Window_Base_prototype_initialize = Window_Base.prototype.initialize;
  Window_Base.prototype.initialize = function(x, y, width, height) {
    ZERO_Window_Base_prototype_initialize.apply(this, arguments);
    this.__text = '';
  }
  
  // Add Auto Insert Toogle Key event and show popup when pressed
  document.addEventListener('keydown', event => {
    if (Input.keyMapper[event.keyCode] == $.autoInsertToogleKey) {
        $.autoInsert = !$.autoInsert
        if($.autoInsert) SceneManager.callPopup('Auto Insert Enabled');
        else SceneManager.callPopup('Auto Insert Disabled');
      }
  })

  // Add Auto Replace Choices Toggle Key event and show popup when pressed
  document.addEventListener('keydown', event => {
    if (Input.keyMapper[event.keyCode] == $.autoReplaceChoicesToggleKey ) {
        $.autoReplaceChoices = !$.autoReplaceChoices
        if($.autoReplaceChoices) SceneManager.callPopup('Auto Replace Choices Enabled', 'topRight', 200);
        else SceneManager.callPopup('Auto Replace Choices Disabled', 'topRight', 200);
      }
  })

  // Alias Window_Message startMessage
  // Prepare for next text
  var ZERO_Window_Message_prototype_startMessage = Window_Message.prototype.startMessage
  Window_Message.prototype.startMessage = function() {
    textOverflowed = false;
    $.escapeText = true;
    $.replacingChoicesStopIlule = false;
    stopDrawingText = false;
    
    // prevent from setting wait to false if next in game message was shown before
    // translation appeared (changing text too fast causes this)
    if(typeof timeout !== 'undefined') clearTimeout(timeout); 

    wait = true;

    return ZERO_Window_Message_prototype_startMessage.call(this);
  }

  // ***** Start Choices Replace ***** //
  var startChoiceReplace = false;
  var choiceProcessing = false;
  var translatedChoices = [];
  var windowTextWithChoices = false;
  var translatedWindowText = '';

  // Access Window_ChoiceList methods from Widnows_Selectable
  Window_Selectable.prototype.updatePlacement = function() {
  }
  
  Window_Selectable.prototype.textWidthEx = function(text) {
  }

  // Overwrite
  // Change size of choice window
  // Add parameters for new width
  Window_ChoiceList.prototype.updatePlacement = function(custom = false, newWidth = 0) {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;

    if(custom) this.width = newWidth; // Custom code, set new size
    else this.width = this.windowWidth();

    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }

    if(custom){
        this.createContents(); // Refresh choices-items lenght
    }
  };

  // Detect choices window
  var ZERO_Window_ChoiceList_prototype_start = Window_ChoiceList.prototype.start;
  Window_ChoiceList.prototype.start = function() {
    if($.autoReplaceChoices) {
      if (!choiceProcessing) preProcessChoiceReplace();

      //Prevent from entering multiple times by disabling it for half a second
      choiceProcessing = true;
      setTimeout(() => {
        choiceProcessing = false;
      }, 500);
    }
    ZERO_Window_ChoiceList_prototype_start.call(this);
  };

  function preProcessChoiceReplace(){
    $.replacingChoicesStopIlule = true;
    $.escapeText = false; // prevent capture text from clipboard_illule
      
    // Send choices to clipboard
    let text = '';
    $gameMessage.choices().forEach(function(choice, index) {
      choice = Window_Base.prototype.convertEscapeCharacters(choice);
      text += '['+ choice + '].'; // DeepL understands '.' as a sentence break
    });  

    // If there is a window message send it together with choices as last item
    // so that there is no need to send two translation requests
    if($gameMessage._texts.length){
      text += Window_Base.prototype.convertEscapeCharacters($gameMessage._texts.join(' '));
      text = text.replace(/(c|C)\[\d{1,3}\]/g, ''); // Remove color codes
    }else{
      text = text.slice(0, -1); // delete last '.'
    }

    previousClipboardText = text;
    clipboard.set(text, 'text');

    startChoiceReplace = true; // trigger Window_Selectable.update script
  }

  // Alias
  // Replace choices text, and update new choice window size
  var ZERO_Window_Selectable_prototype_update = Window_Selectable.prototype.update;
  Window_Selectable.prototype.update = function() {
    if (startChoiceReplace) {
      clipboardText = clipboard.get('text'); 
      
      if (previousClipboardText.localeCompare(clipboardText)
      && clipboardText.localeCompare('') != 0){
        clipboardText = clipboardText.replace(/\](| )\.(| )(|\[)/g, '].['); // Make variations of '] . [' to '].['
        clipboardText = clipboardText.replace(/\[ /g, ''); // Make variations of '] . [' to '].['
        translatedChoices = clipboardText.split('].');
        let maxWidth = '123';

        // If there was a window message, separate transalted text from translated choices
        if($gameMessage._texts.length){
          // Sanity check, recieved translations should be greater than choices to be replaced
          if(translatedChoices.length > $gameMessage.choices().length){
            let winTextArray = translatedChoices.splice($gameMessage.choices().length);
            translatedWindowText = winTextArray.join(''); // Save text in global var to be used in windows_message.update
            translatedWindowText = translatedWindowText.replace(/(|\[)(| )(|\[)/, '') // Remove first space and '['

            translatedChoices = translatedChoices.splice(0, $gameMessage.choices().length);
          }
        }

        // Get choice with max lenght
        for (let i = 0; i < translatedChoices.length; i++) {
          translatedChoices[i] = translatedChoices[i].replace(/(|\[)(| )\[/, ''); // remove '['
          translatedChoices[i] = translatedChoices[i].replace(']', ''); // remove ']'
          translatedChoices[i] = translatedChoices[i].charAt(0).toUpperCase() + translatedChoices[i].slice(1); // Capitilize first letter
          if(translatedChoices[i].length > maxWidth.length) maxWidth = translatedChoices[i]; // get choice with max lenght
        }

        // Resize choice window with choice with max lenght or max game window size
        let width = Math.min(this.textWidthEx(maxWidth) + this.padding * 3 , Graphics.boxWidth);
        if(width < 132) width = 132;
        this.updatePlacement(true, width);

        // Clear and draw new items (Refresh)
        for (let i = 0; i < $gameMessage.choices().length; i++) {
          this.clearItem(i);
          this.drawItem(i, true); // Call custom code in drawItem with second parameter (true) to draw from translatedChoices
        }

        // If there is a text window replace that text after replacing choices
        if($gameMessage._texts.length){ 
          // If window message update is disabled or gives problems can try to push (MV function) new text window

          // This will trigger code in Window_Message update, translated text is in global var translatedWindowText
          windowTextWithChoices = true;
          textOverflowed = false;
        }
        
        startChoiceReplace = false; // end choice script
        translatedChoices = []; // empty array
      }
    }
    
    ZERO_Window_Selectable_prototype_update.call(this);
  };

  // Override, add parameter
  // Draw tranlsated choices array when override param set to true
  Window_ChoiceList.prototype.drawItem = function(index, override = false) {
    var rect = this.itemRectForText(index);
    if(override) {
      if (typeof translatedChoices[index] !== 'undefined')
      {
        this.drawTextEx(translatedChoices[index].trim(), rect.x, rect.y); // draw translated choices
      }
      this.selectDefault(); // refresh selecting rectangle
    }
    else this.drawTextEx(this.commandName(index), rect.x, rect.y); // draw original choices
  };
  // ***** End Choices Replace ***** //

  // Alias Window_Message updateInput
  var ZERO_WindowMessage_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function () {

    // Copy choices to clipboard (if there are any)
    if (Input.isTriggered($.copyChoicesButton) && $gameMessage.isChoice()) {
      let choices = $gameMessage._choices;
      if(choices.length > 0){
        let text = '';
        choices.forEach(function(choice, index) {
          //choice = text = text.replace(/(\\|\/)(c|C)\[\d{1,3}\]/g, '');  
          choice = Window_Base.prototype.convertEscapeCharacters(choice);
          text += (index+1) + '[' + choice + ']. '; // DeepL understands '.' as a sentence break
        }); 

        clipboard.set(text, 'text');
        textOverflowed = false; // Discard rest of text if it was overflowed
        $.escapeText = true; // trigger/allow replaceText
      }
    }

    // If there was a text window with the choices this code will be triggered after processing choices
    if (windowTextWithChoices){
      this.replaceText(translatedWindowText);
      windowTextWithChoices = false; // reset var
    }

    if(this.isOpen() && !startChoiceReplace){ // Check if message window is opened
      // Copy (current window) Text to Clipboard Button function
      // Most of this function can be replaced with $gameMessage._texts if necessary ()
      if ((Input.isTriggered($.copyTextButton)) && this.isOpen()) {
        let text = this.__text;
        // let text = $gameMessage._texts.join(' '); // alternate way to get text
        text = Window_Base.prototype.convertEscapeCharacters(text);          // Convert variables to text
        text = text.replace(/(\r\n|\n|\r)/gm,' ');                           // Remove line breaks
        text = text.replace(/(c|C)\[\d{1,3}\]/g, '');                        // Remove color codes alt /(\\|\/)(c|C)\[\d{1,3}\]/g
        text = text.replace(/{|}/g, '');                                     // Remove {}
        text = text.replace(String.fromCharCode(27), '');                    // Remove arrow character
        text = String.fromCharCode(12300) + text;                            // Add Block separator left
        text = text + String.fromCharCode(12301);                            // Add Block separator right
        clipboard.set(text, 'text');
        textOverflowed = false; // Discard rest of text if it was overflowed
        $.escapeText = true; // trigger/allow replaceText
        //console.log('send text: ' + text);
      }
      
      if (this.isOpen() && $.autoInsert && $.escapeText){
        // Get text from clipboard, this must be here otherwise replaceText function may pick up other text when it runs
        clipboardText = clipboard.get('text'); 

        //console.log('previous: ' + previousClipboardText);
        //console.log('clipboard: ' + clipboardText);
        //console.log('compare previous 2: ' + previousClipboardText.localeCompare(clipboardText));
        //console.log('compare to space: ' + clipboardText.localeCompare(''));
        //console.log('wait: ' + wait);
        
        if (previousClipboardText.localeCompare(clipboardText) // Compare that previous clipboard text is different
        && clipboardText.localeCompare('') != 0 // Check if text is empty
        && $.escapeText // Stop entering if replacing text function was called (once debugging is done, this should be erased and only use the upper one)
        ){
          if(wait){
            // delay replacing text to give Clipboard_llule time to copy orig text to clipboard, should enter once per textbox
            timeout = setTimeout(() => { wait = false; }, 300); 
          }else{
            if ($.ignoreTextStartWith){
              if (!clipboardText.startsWith($.ignoreTextStr)) this.replaceText(clipboardText);
            }else if($.ignoreJapText){
              if (clipboardText.search(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/u) == -1) this.replaceText(clipboardText);
            }else{
              this.replaceText(clipboardText);
            }
          }
        }   
      }

      // Call function manually with button, or use it when text is overflowed
      if ((Input.isTriggered($.textButton)) && this.isOpen()) {
        clipboardText = clipboard.get('text'); // Get text from clipboard
        this.replaceText(clipboardText);
      }
    }

    return ZERO_WindowMessage_update.call(this);
  };

  // New method
  // Get tranlated text, wordwrap it and insert it in current textbox
  Window_Message.prototype.replaceText = function (text){
    $.escapeText = false; // Prevent this function from being called until its done
    stopDrawingText = true;
    wait = true;
    
	  // Get text from clipboard or if text overflowed rest of the text
    if (textOverflowed) {
      text = overflowedText;
      //console.log('text overflowed');
    } else {
      previousClipboardText = text;

      //console.log('Before wordwrap: ' + text);
      // Wordwrap text
      let wordWrapWidth = $.maxWidth;
      if ($gameMessage._faceName == '') {
        wordWrapWidth = $.maxWidthWithoutFace;
      }

      text = wordWrapper(text, wordWrapWidth);
      //console.log('After wordwrap: ' + text);
    }

    // Check if text overflows from page
    if (isOverflowing(text)) {
      textOverflowed = true;
      
      // Split text
      let p = getPosition(text, '\n', $.textboxLines);
      overflowedText = text.substring(p+1);
      text = text.substring(0, p) + '*'; // Add marker
    }else{
		  textOverflowed = false;
    }
    
	  // Prepare text for textbox
    this._textState1 = {};
    this._textState1.index = 0;
    this._textState1.line = 1;
    //console.log('text to display: ' + text);
    this._textState1.text = text;
    this.newPage(this._textState1);
    if($.fontSize != 0) this.contents.fontSize = $.fontSize;
    this.updatePlacement();
    this.updateBackground();
    this.open();

    // Add text to backlog
    if($.useBacklog) $gameSystem.addMessageBacklog(text);
    
	  // Process text
    while (!this.isEndOfText(this._textState1)) {
      this.processCharacter(this._textState1);
    }
  }

  // Function for wordwraping text
  function wordWrapper(str, width){
    // Split all text into words
    let text = str.split(' ');
    let line = '';
    
    str = '';
    // While there are words left in the text, loop
    while(text.length > 0){
      // Loop until line is full or no more text
      while(line.length < width && text.length > 0){
        // Check if next word isn't longer than width, else split it
        if(text[0].length >= width) text = wordWarpSingleWord(text, line, width);

        // if adding the next word overflows line, break loop and start working on next line
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

    // Remove last '\n'
    str = str.slice(0, -2); 
    
    return str;
  }

  // Split single words that are longer than maxium width
  // Returns splited elements at the start of array
  function wordWarpSingleWord(arr, line ,width){
    let word = arr.shift();
    let arr2 = [];
    let lineWidthLeft = width - line.length;

    // If there is space left on the line fill it
    if(lineWidthLeft > 6){
      arr2.push(word.substring(0,lineWidthLeft-1));
      word = word.substring(lineWidthLeft);
    }
    
    while(word.length >= width){
      arr2.push(word.substring(0,width-1));
      word = word.substring(width);
    }
    if(word !== '') arr2.push(word);

    return arr2.concat(arr);
  }

  // Function to see if text is longer than x lines (textboxLines)
  function isOverflowing(text) {
    let count = (text.match(/\n/g) || []).length;
    if (count >= $.textboxLines) return true;
    else return false;
  };

  // Function to get index of a string inside a string
  // with the option to get the nth position
  // Here it is used to get the position of the xth '\n'(textboxLines)
  function getPosition(string, subString, index) {
	  return string.split(subString, index).join(subString).length;
  }


  //TODO: set this as primary and finish programming and alternative method (add a parameter
  //      to choose primary or alt)

  // Overwrite updateMessage so it stops processing a message when
  // a text from memory is pasted in box. (this may be unncesesary if always show fast is on)
  // If another plugin conficts with this override, the modification can 
  // be done to processCharacter method (problem with that, read bellow)
  Window_Message.prototype.updateMessage = function() {
    if (this._textState) {
        // console.log('text at start of processchara:' + this._textState.text);
        while (!this.isEndOfText(this._textState) && !stopDrawingText) { // Stop processing original text if replaceText was triggered
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            //this.updateShowFast();   // This line commented means always show message instantly
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.__text = this._textState.text;  // Added line (for sending last text to clipboard on button)
            this.onEndOfText();
        }
        if(!$.escapeText) this.onEndOfText(); // Added line
        return true;
    } else {
        return false;
    }
  };

  // In case the previous overwrite confilcts with another plugin
  // there is a problem that it doesn't clear text
  // coding in progress (need to call onEndOfText for windowMessage from here)

  // Idea to fix that: edit updateShowFast method and set it always true (done)
  // this.__text will need to see where to put it, maybe at start of onEndOfText method 
  //    (using $gameMessage._texts fixes this but need to handle that function differently, 
  //     for example \n<remove names from YEP etc>)

  /*
  // Alias
  var ZERO_Window_Base_processCharacter = Window_Base.prototype.processCharacter;
  Window_Base.prototype.processCharacter = function(textState) {
    if ($.escapeText) ZERO_Window_Base_processCharacter.call(this, textState);
  }
  /*
  Window_Base.prototype.processCharacter2 = function(textState) {
    ZERO_Window_Base_processCharacter.call(this, textState);
  }*/


  /* ----------------------------------------------------------------------------------
  /*  Popup Text  /
  /--------------*/

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

    if (typeof popupSprite !== 'undefined'){
      if(popupSprite.opacity > 0) {
          popupSprite.opacity -= 1;
      }
    }
  };
  /* -----------------\
  /* End of Popup Text \
  /*----------------------------------------------------------------------------------*/

})(ZERO.SetClipboardText);
