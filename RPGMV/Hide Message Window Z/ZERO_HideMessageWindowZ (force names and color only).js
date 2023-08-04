//=============================================================================
// Hide Message Window Z (For SetClipboardText)
//=============================================================================
/*:
* @ZERO_HideMessageWindowZ
* @plugindesc Hide textbox or make textbox invisible while showing text.
* @title Hide Message Window Z
* @author Zero_G
* @version 2.3.8 alt
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

2.3.8 alt (forked here to force names and color only)
 - Now when a name is added to savedNames.json, it will modify the line of text in translationsCache.json (remove the name)
2.3.7 alt
 - Added "Name has a semi colon at its end" to forceNameboxMethod2
2.3.6 alt
 - Update replace name and populate savedNames.json for Lunatlazur_ActorNameWindow
 - Added circled numbers to translated names regex prediction
2.3.5 alt
 - Bug fix in replace names when converting from string to regex
 - Added function to save new translated names, now it will save them as regex when they end in a capital letter or number.
2.3.4 alt
 - Bug fixes on forceNameboxMethod1 (colored names)
2.3.3 alt
 - Saved names now try to save with a translation instead of empty string
2.3.2 alt
 - Added Lunatlazur_ActorNameWindow Namebox from main script, applied changes to make it compatible with alt
 - Should now be possible to use regex capturing groups in name replacements.
2.3.1 alt
 - Fix some bugs in add nameboxes function
 - Fix writefile function
2.3 alt
 - Save new names to file with empty translation (for easier use of filling name)
2.2 alt
 - Added reading names from a json file (no need to restart game for each new name)
 - Refactored force namebox code, with options of which one to use
2.1.2 alt
 - Added nameboxes that have only a linebreak
2.1.1 alt
 - Added option to add nameboxes to non nameboxed text (need to change the regexs to work) [look for "Add nameboxes"]
 - Changed replace names to look only for the whole sentence (fix names like '大物Merchant')
2.1 alt
 - Add option to replace names, when used with SetClipboardText
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
  /*** MANUAL CONFIGURATION ***/

  // **Force nameboxes on games that don't have it (need to add YEP_CoreMessage)**

  // Method 1: Name has color
  // How to use: replace the 2 in the following to regular expresions to the color
  // of the name (search for color codes in internet). If names have more than one
  // color replace 2 with regex or (). Ex: colors 2 and 5: (2|5)
  const forceNameboxMethod1 = false;
  var regexTextStartsWithName = new RegExp(/^(c|C)\[2\].*(|\n)(c|C)\[0+\]/);
  var colorCodeToReplace = new RegExp(/(c|C)\[2\]/);

  // Method 2: Name has no color, but it's on the first line of text
  // Define in maxNamesLenght how many characters should a name have maximum, ex: if
  // the line break occurs after the 10th character it's assumed it's not a name
  // - Does text use quotation marks? If so set usingQuotation to true to only
  // assume there is a name when a quotation mark is present.
  // - Does the name end with a semicolon and it's in the first line? If so set 
  // usingSemiColon to true 
  // Use only one sub method (can be both false)
  const forceNameboxMethod2 = true;
  var maxNamesLenght = 25;
  var nameInSameLine = false; // Is name and text continous (true) or separed by a line break (false)?
  var usingQuotation = false; // text uses 「 or （ or 『 for dialogues?
  var usingSemiColon = true;  // Name ends with : or ： (JP width semicolon)

  // Replace names color
  $.addColor = {
    // By Eye colors
    'Ovelia': '27',
    'Hinagiku': '29',
    'Fau': '28',
    'Rosche': '25',
    /* By Hair colors
    'Ovelia': '27',
    'Hinagiku': '7',
    'Fau': '21',
    'Rosche': '29',
    */
    'Hecate': '31',
    'Onihime': '18',
    'Farin': '11',
    'Lyka': '31',
  }

  // Replace names that will be inside the textbox
  // This variable also comunicates with clipboard_illule, to add them to
  // the regex ignore bloc so the name doens't appear in the dialoge textbox
  // Names are also read from www/savedNames.json, so names can be added while the
  // game is running.
  /*$.replacements = { // Need to add translated to regex ignore in Clipboard_illule
    //'春': '\\c[14]Haru', // Names
    '商人': 'Merchant',
    'シスター': 'Sister',
    '冒険者': 'Adventurer',
    '店員': 'Clerk',
    'お姉さん': 'Oneesan',
  }*/

  /*** END OF MANUAL CONFIGURATION ***/

  /*$.replacements2 = {} // To use in Clipboard_Illule to check file
  var previousReplacements = {};

  let fs = require('fs');
  if(!fileExists('savedNames')) writeFile('savedNames', {});
  else {
    // First put names in file to this variable so illule can add them all at the start of the game
    $.replacements2 = readFile('savedNames'); 
    previousReplacements = Object.assign({}, $.replacements, $.replacements2); // merge dictionaries
  }

  function writeFile(file, data){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';
    absolutePath = absolutePath + '\\' + file + '.json';
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
  }

  function readFile(file){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';
    absolutePath = absolutePath + '\\' + file + '.json';
    if(fs.existsSync(absolutePath)){
      let rawData = fs.readFileSync(absolutePath);
      let jsonData = JSON.parse(rawData);
      return jsonData;
    }
  }
  
  // Make a backup of stored names when game loads
  (function() {
    let fileNames = readFile('savedNames');
    if(Object.keys(fileNames).length !== 0 // Check not empty
      && fileNames.constructor === Object){
        writeFile('savedNamesBackup', fileNames);
      }
  })()

  function fileExists(file){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';
    absolutePath = absolutePath + '\\' + file + '.json';
    return fs.existsSync(absolutePath);
  }

  // Populates replacements2 only with new names added since previous called
  // Used to add new names that were added while game is running to regex ignore in illule
  function compareFileNames(file){
    let allNamesKeys = Object.keys(file).concat(Object.keys($.replacements));
    let previousReplacementsKeys = Object.keys(previousReplacements);
    let newNames = allNamesKeys.filter(val => !previousReplacementsKeys.includes(val));
    $.replacements2 = {};
    for(const name of newNames){
      if(file[name] !== '') $.replacements2[name] = file[name];
    }
  }
*/
  // Get plugin name and parameters
  var substrBegin = document.currentScript.src.lastIndexOf('/');
  var substrEnd = document.currentScript.src.indexOf('.js');
  var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
  $.params = PluginManager.parameters(scriptName);
  
  $.buttonHide = $.params["Hide Button"].trim();
  $.buttonHideOcupacy = $.params["Ocupacy Button"].trim();

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
  $.buttonHideOcupacy = addKeyMapping($.buttonHideOcupacy);

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
  /* Add nameboxes /
  /* ----------- */

  // Names that start with \c[2] (red text)
  if(forceNameboxMethod1){
    var ZERO_Window_Message_prototype_startMessage2 = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
      ZERO_Window_Message_prototype_startMessage2.call(this);
      console.log(this._textState.text+'\n'); // log name and text
      // add \n<> to name

      // Only using names added (Disabled)
      //for (let key in $.replacements){
      //    var re = new RegExp('^(c|C)\\[2\\]'+key+'(|\\n)(c|C)\\[0\\]', 'g'); // Create regex with variable
      //    this._textState.text = this._textState.text.replace(re, '\\N<'+key+'>'); // Use regular expresion to replace all values and not the first one only
      //}
      //this._textState.text = this._textState.text.replace(/>\n/, '>');
      //this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
      

      // All names
      if(regexTextStartsWithName.test(this._textState.text)){ // See the textbox text starts with name
          this._textState.text = this._textState.text.replace(colorCodeToReplace, '\\N<'); // replace first part (\c[2]) with (\N<)
          this._textState.text = this._textState.text.replace(/(|\n)(c|C)\[0+\]/, '>'); // replace second part (\c[0]) with (>)
      }
      this._textState.text = this._textState.text.replace(/>\n/, '>');
      this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
    };
  }

  // Names with only linebreak (and maybe a quotation mark)
  if(forceNameboxMethod2){
    var ZERO_Window_Message_prototype_startMessage3 = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
      ZERO_Window_Message_prototype_startMessage3.call(this);
      //console.log(this._textState.text+'\n'); // log name and text

      // for RJ273744, remove line breaks at start of text
      /*this._textState.text
      while(this._textState.text.startsWith('\n')){
        this._textState.text = this._textState.text.replace('\n', '');
      }*/

      /* If no Name, replace with this namebox (useful in some games where first person text is used)
      if(/^(「|（)/.test(this._textState.text)){
        this._textState.text = '\\N<Kurokami>' + this._textState.text;
      }
      */

      // add \n<> to name
      if(!/^(「|（|『| |\.|…)/.test(this._textState.text)                    // Check that text doesn't start with quotation or space or .
      //&& this._textState.text.indexOf('\n') < maxNamesLenght               // if first line is x amount of characters
      && (this._textState.text.indexOf('\n') !== -1 || nameInSameLine)       // text is more than one line
      && this._textState.text.indexOf('\n') !== 0){                          // text doesn't start with a line break
        if(nameInSameLine){
          if(!((this._textState.text.indexOf('\n') !== -1) && (this._textState.text.indexOf('\n') < this._textState.text.indexOf('「')))){ // This if is added beacuse game fucks up and sometimes gives name and text in separate lines, it checks that name is in single line only
            this._textState.text = this._textState.text.replace(/(| )「/, '\n「');
            this._textState.text = this._textState.text.replace(/(| )『/, '\n『');
            this._textState.text = this._textState.text.replace(/(| )（/, '\n（');
          }
        }

        if(this._textState.text.indexOf('\n') < maxNamesLenght){              // if first line is x amount of characters (name)
          if(usingQuotation){
            if(this._textState.text.indexOf('「') != -1                       // Sentence includes at least one of these three quotations
            || this._textState.text.indexOf('（') != -1                       // Replace all with with a regex and add it to the options vars at top
            || this._textState.text.indexOf('『') != -1){
              this._textState.text = '\\N<' + this._textState.text;           // add first part of namebox
              this._textState.text = this._textState.text.replace('\n', '>'); // replace first line break with second part of namebox
            }
          }else if(usingSemiColon){
            let semiColonIndex =  this._textState.text.indexOf(':');
            let semiColonJPIndex =  this._textState.text.indexOf('：');

            if(semiColonIndex != -1){                                          // Sentence includes a semi colon
              if(semiColonIndex < this._textState.text.indexOf('\n')){         // semicolon in in the first line
                this._textState.text = this._textState.text.replace(':', '');  // remove semicolon
                this._textState.text = '\\N<' + this._textState.text;          // process as name
                this._textState.text = this._textState.text.replace('\n', '>');
              }
            }else if(semiColonJPIndex != -1){                                  // Sentence includes a semi colon (JP width)
              if(semiColonJPIndex < this._textState.text.indexOf('\n')){       // semicolon in in the first line
                this._textState.text = this._textState.text.replace('：', ''); // remove semicolon
                this._textState.text = '\\N<' + this._textState.text;          // process as name
                this._textState.text = this._textState.text.replace('\n', '>');
              }
            }
          }
          else{
            this._textState.text = '\\N<' + this._textState.text;
            this._textState.text = this._textState.text.replace('\n', '>');
          }
        }
      }
      this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
    };
  }
  /* ---------------------------------------------------------------------------- */

  var isHidden = false;
  var isHiddenOcupacy = false;

  // Keep opacity to next messages
  var ZERO_Window_Message_updateBackground = Window_Message.prototype.updateBackground;
  Window_Message.prototype.updateBackground = function() {
    ZERO_Window_Message_updateBackground.call(this);
    if (isHiddenOpacity) this.setBackgroundType(2);
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

      // Disable nameboxes
      //this.visible = false;
      
      if (Input.isTriggered($.buttonHide) && this.isOpen()) {
        isHiddenNamebox = !isHiddenNamebox;

        if (isHiddenNamebox) this.visible = false;
        else this.visible = true;
      }
      if (Input.isTriggered($.buttonHideOcupacy) && this.isOpen()) {
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
      /*if (this._parentWindow.isClosing()) {
        this._openness = this._parentWindow.openness;
      }*/

      // Original code
      this.close();
    };

    // Nwjs (remove if this is merged to setClipboardText)
    /*var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();
    */
    // Prevent new namebox from regaining opacity after scene change
    // Overwrite refresh (while an alias could be used, it generates an 'undefined' text)
    Window_NameBox.prototype.refresh = function(text, position) {
      if (isHiddenOcupacy) {
        this.opacity = 0;
      }

      // RJ295434 needed lines
      this.show();
      this._lastNameText = text;

      // Original code
      this._text = Yanfly.Param.MSGNameBoxText + text;

      
      // Replace color of name
      for (const [key, value] of Object.entries($.addColor)) {
        if(key == text) this._text = this._text.replace('6', value); 
      }
      
      /*
      //console.log(this._text);
      //Replace Names (For use with SetClipboardText)
      let fileNames = readFile('savedNames');
      $.replacements2 = Object.assign({}, fileNames, $.replacements); // merge dictionaries
      let nameReplaced = false;
      for (const [key, value] of Object.entries($.replacements2)) {
        let re = new RegExp('^' + key + '$'); // Create regex that matches whole sentence with key given
        let name = this._text.substring(this._text.indexOf(']')+1) // Separate name from color code and match that
        name = name.replace('', '');
        name = name.replace('|', ''); // Sanitize name
        name = name.trim();

        // If name matches, replace
        if(re.test(name) && value !== ''){
          re = new RegExp(key);
          this._text = this._text.replace(re, value); 
          nameReplaced = true;
        }
      }
      compareFileNames(fileNames); // Check new names in file

      // Add unknown name to file with translation from clipboard
      if(!nameReplaced){
        // Get original name
        let newName = this._text;
        newName = newName.replace(/\\(c|C)\[\d{1,2}\]/g, '') // Remove color codes

        // Escape regex special characters
        // So that later they can be converted properly from string to regex
        newName = newName.replace(/(\(|\)|\{|\}|\[|\]])/g, '\\$1');

        // Wait a few seconds for translation, this will not be neccesary if this functionality
        // is merged to setClipboardText plugin, as you can call this from the replace text function
        setTimeout((clipboard, newName, fileNames) => {
          // Get translated name
          let clipboardText = clipboard.get('text');
          let translatedText = clipboardText; // for removing name from line in stored translations

          clipboardText = clipboardText.substring(0, clipboardText.indexOf('.'));
          clipboardText = clipboardText.replace(/"/g, ''); // remeove "
          clipboardText = clipboardText.replace(/\./g, ''); // remeove .
          clipboardText = clipboardText.replace(/\?/g, '\\?'); // replace ? with escaped ?
          newName = newName.replace(/\?/g, '\\?'); // replace ? with escaped ?
          clipboardText = clipboardText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // Capitalize first letter of each word

          // If name was ??? replace translated name to ??? (DeepL delivers what or broken text)
          if(/^\\\?\\\?\\\?$/.test(newName) || /^？？？$/.test(newName)) clipboardText = '\\?\\?\\?';
          
          // Convert to regex name if it ends with a capital letter or a number
          // Used when you have names like: Villager A, Villager B, Villager C, etc
          // Only using capital letters [A-Z] instead of uppercase and lowercase [A-Za-z] in case it registers false positives
          if(/[A-Z]$/.test(newName)){
            newName = newName.replace(/[A-Z]$/, '([A-Z]){0,1}');
            clipboardText = clipboardText.replace(/[A-Z]$/, '$1');
          }
          // Same but with circled numbers
          if(/[①-⑳]$/.test(newName)){
            newName = newName.replace(/[①-⑳]$/, '([①-⑳]){0,1}');
            console.log(JSON.stringify(clipboardText));
            clipboardText = clipboardText.replace(/\d{1,2}$|[①-⑳]$/, '$1');
          }
          // Same but ending with a number
          if(/\d$/.test(newName)){
            newName = newName.replace(/\d$/, '(\\d){0,2}');
            clipboardText = clipboardText.replace(/\d{1,2}$/, '$1');
          }

          // Trim spaces from newName
          newName = newName.trim();

          // If translated name was empty put untranslated one
          if(clipboardText == '') clipboardText = newName;

          // Remove 'The ' from beggining of name
          if(clipboardText.startsWith('The ')) clipboardText = clipboardText.replace('The ', '');
          if(clipboardText.startsWith('A ')) clipboardText = clipboardText.replace('A ', '');

          // Write to file
          if(newName !== ''){
            fileNames[newName] = clipboardText;
            writeFile('savedNames', fileNames);
          

            // Remove name from Translation Cache line
            let storedTranslations = readFile('translationsCache') || storedTranslations;
            let translationCacheKey = '';

            for (const [key, value] of Object.entries(storedTranslations)) {
              if(value == translatedText){
                translationCacheKey = key;
                delete storedTranslations[translationCacheKey];
                break;
              }
            }

            translationCacheKey = translationCacheKey.substring(translationCacheKey.indexOf('.「')+1); // remove name in key (JP)
            translationCacheKey = translationCacheKey.replace('「', '') // Remove quotations (Some games seem to store single lines without 
            translationCacheKey = translationCacheKey.replace('（', '') // quotations) for now enable manually (uncomment)
            translationCacheKey = translationCacheKey.replace('『', '') 
            translationCacheKey = translationCacheKey.replace('」', '') 
            translationCacheKey = translationCacheKey.replace('）', '') 
            translationCacheKey = translationCacheKey.replace('』', '') 
            translatedText = translatedText.substring(translatedText.indexOf('.')+1); // Remove name from translation
            translatedText = translatedText.trim();
            if(!(translationCacheKey == '' || translationCacheKey == ' ' || translatedText == '' || translatedText == '')){ // Don't store if empty
              storedTranslations[translationCacheKey] = translatedText // Add modified translation
              writeFile('translationsCache', storedTranslations); // Save to file
            }
          }
          
        }, 5000, clipboard, newName, fileNames);
      }
*/

      // Original code
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
  /* For Lunatlazur_ActorNameWindow Namebox */ 
  /* ------------------------------------- */
  // **IMPORTANT** NEED TO UN-ANONYMISE THAT PLUGIN
  if(typeof Window_ActorName == 'function'){
    let isHiddenNamebox = false;

    Window_ActorName.prototype.update = function () {
      Window_Base.prototype.update.call(this);

      if (this.isClosed() || this.isClosing()) {
          return;
      }
      if (this._parentWindow.isClosing()) {
          this._openness = this._parentWindow.openness;
      }

      if (Input.isTriggered($.buttonHide) && this.isOpen()) {
        isHiddenNamebox = !isHiddenNamebox;

        if (isHiddenNamebox) this.visible = false;
        else this.visible = true;
      }
      if (Input.isTriggered($.buttonHideOcupacy) && this.isOpen()) {
        if (isHiddenOcupacy) this.opacity = 0;
        else this.opacity = 255;
      }

      if (this.active) return;

      this.close();
    };
/*
    // Nwjs (remove if this is merged to setClipboardText)
    var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();

    //Replace Names (For use with SetClipboardText) [All of this is copy pasted from YEP one, later make it a global function]
    Window_ActorName.prototype.setText = function (text) {
      this._text = text;

      let fileNames = readFile('savedNames');
      $.replacements2 = Object.assign({}, fileNames, $.replacements); // merge dictionaries
      let nameReplaced = false;
      for (const [key, value] of Object.entries($.replacements2)) {
        let re = new RegExp('^' + key + '$'); // Create regex that matches whole sentence with key given
        let name = this._text.substring(this._text.indexOf(']')+1) // Separate name from color code and match that
        name = name.replace('', '');
        name = name.replace('|', ''); // Sanitize name

        // If name matches, replace
        if(re.test(name) && value !== ''){
          re = new RegExp(key);
          this._text = this._text.replace(re, value); 
          nameReplaced = true;
        }
      }
      compareFileNames(fileNames); // Check new names in file

      /////////////////////////////////////////////////////

      // Add unknown name to file with translation from clipboard
      if(!nameReplaced){
        // Get original name
        let newName = this._text;
        newName = newName.replace(/\\(c|C)\[\d{1,2}\]/g, '') // Remove color codes

        // Escape regex special characters
        // So that later they can be converted properly from string to regex
        newName = newName.replace(/(\(|\)|\{|\}|\[|\]])/g, '\\$1');

        // Wait a few seconds for translation, this will not be neccesary if this functionality
        // is merged to setClipboardText plugin, as you can call this from the replace text function
        setTimeout((clipboard, newName, fileNames) => {
          // Get translated name
          let clipboardText = clipboard.get('text');
          let translatedText = clipboardText; // for removing name from line in stored translations

          clipboardText = clipboardText.substring(0, clipboardText.indexOf('.'));
          clipboardText = clipboardText.replace(/"/g, ''); // remeove "
          clipboardText = clipboardText.replace(/\./g, ''); // remeove .
          clipboardText = clipboardText.replace(/\?/g, '\\?'); // replace ? with escaped ?
          clipboardText = clipboardText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // Capitalize first letter of each word

          // Convert to regex name if it ends with a capital letter or a number
          // Used when you have names like: Villager A, Villager B, Villager C, etc
          // Only using capital letters [A-Z] instead of uppercase and lowercase [A-Za-z] in case it registers false positives
          if(/[A-Z]$/.test(newName)){
            newName = newName.replace(/[A-Z]$/, '([A-Z]){0,1}');
            clipboardText = clipboardText.replace(/[A-Z]$/, '$1');
          }
          // Same but with circled numbers
          if(/[①-⑳]$/.test(newName)){
            newName = newName.replace(/[①-⑳]$/, '([①-⑳]){0,1}');
            console.log(JSON.stringify(clipboardText));
            clipboardText = clipboardText.replace(/\d{1,2}$|[①-⑳]$/, '$1');
          }
          // Same but ending with a number
          if(/\d$/.test(newName)){
            newName = newName.replace(/\d$/, '(\\d){0,2}');
            clipboardText = clipboardText.replace(/\d{1,2}$/, '$1');
          }

          // Remove 'The ' from beggining of name
          if(clipboardText.startsWith('The ')) clipboardText = clipboardText.replace('The ', '');
          if(clipboardText.startsWith('A ')) clipboardText = clipboardText.replace('A ', '');

          // Write to file
          if(newName !== ''){
            fileNames[newName] = clipboardText;
            writeFile('savedNames', fileNames);
          
            // Remove name from Translation Cache line
            let storedTranslations = readFile('translationsCache') || storedTranslations;
            let translationCacheKey = '';

            for (const [key, value] of Object.entries(storedTranslations)) {
              if(value == translatedText){
                translationCacheKey = key;
                delete storedTranslations[translationCacheKey];
                break;
              }
            }

            translationCacheKey = translationCacheKey.substring(translationCacheKey.indexOf('.「')+1); // remove name in key (JP)
            translationCacheKey = translationCacheKey.replace('「', '') // Remove quotations (Some games seem to store single lines without 
            translationCacheKey = translationCacheKey.replace('（', '') // quotations) for now enable manually (uncomment)
            translationCacheKey = translationCacheKey.replace('『', '') 
            translationCacheKey = translationCacheKey.replace('」', '') 
            translationCacheKey = translationCacheKey.replace('）', '') 
            translationCacheKey = translationCacheKey.replace('』', '') 
            translatedText = translatedText.substring(translatedText.indexOf('.')+1); // Remove name from translation
            translatedText = translatedText.trim();
            if(!(translationCacheKey == '' || translationCacheKey == ' ' || translatedText == '' || translatedText == '')){ // Don't store if empty
              storedTranslations[translationCacheKey] = translatedText // Add modified translation
              writeFile('translationsCache', storedTranslations); // Save to file
            }
          }
          
        }, 5000, clipboard, newName, fileNames);
      }

      this.refresh();
    };
*/
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