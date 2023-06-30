//=============================================================================
// Hide Message Window Z (For SetClipboardText)
//=============================================================================
/*:
* @ZERO_HideMessageWindowZ
* @plugindesc Hide textbox or make textbox invisible while showing text.
* @title Hide Message Window Z
* @author Zero_G
* @version 2.3.12 alt
* @filename ZERO_HideMessageWindowZ.js
* @help 
-------------------------------------------------------------------------------
== Description ==

This script will allow a player to:
  -Mode 1: Hide the textbox window while pressing a key.
  -Mode 2: Hide the textbox while still displaying the text.

Mode 1
  Press 'Hide Button' key to hide textbox completely, press again to restore.
  Trying to advance text while text is hidden won't be possible until 
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

== Credits ==

-Based on HIME HMSHideMessageWindow script

== Terms of Use ==

- Free for use in non-commercial projects
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==
TODO: Implement changes from main script, original forked at v2.1, currently is at v2.2.2)

2.3.12 alt
 - Converted Window_NameBox.prototype.refresh into an alias. This was the main reson all translation logic is in this script
   later all this can be moved to setClipboardText, and stop using this modified script
 - Add names to YEP_Backlog
 - Added a handling of MPP_MessageEx, and a modded version of it.
2.3.11 alt
 - Improved forceNameboxMethod1
2.3.10.3 alt
 - Typo 'Lenght' -> 'Length'
 - forceNameboxMethod2 now checks length of name without color codes
 - Fixed a replaceNames bug that failed if the savedName had color codes
2.3.10.2 alt
 - Fixed a bug when incoming text had a color code
2.3.10.1 alt
 - Removed/Deprecated filling an object so ClipboardLlule could fill it in its regex ignore bloc (Removed all logic from here, 
      ClipboardLlule now just loads savedNames.json file)
2.3.9 alt
 - Refactored code for replace names and save names to functions, so YEP and LUNA calls those same functions
 - Changed the save name SetTimeOut to an Interval that constantly checks if the name was translated (No longer have to 
   always wait 5 seconds)
 - Replaced names in Luna can have color, just add \c[colorCode] before the name. Ex: '\c[2]Name'
 - Fixed Lunatlazur next namebox didn't change opacity if triggered from a non named window.
2.3.8 alt
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
var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_HideMessageWindow = 1;
ZERO.HideMessageWindow = ZERO.HideMessageWindow || {};

(function ($) {
  /*** MANUAL CONFIGURATION ***/

  // **Force nameboxes on games that don't have it (need to add YEP_CoreMessage)**

  // Method 1: Name has color or is between quotations or []
  // How to use: For colors use the default regex.
  // If name is between quotations or special characters regex should be 
  // for []: /^\[(.*)\]/
  // for 【】:/^【(.*)】/
  // for "": /^"(.*)"/
  const forceNameboxMethod1 = false;
  var regexTextStartsWithName = new RegExp(/^c\[\d{1,2}\](.*)\n?c\[\d{1,2}\]/, 'i');

  // Method 2: Name has no color, but it's on the first line of text
  // Define in maxNamesLength how many characters should a name have maximum, ex: if
  // the line break occurs after the 10th character it's assumed it's not a name
  // - Does text use quotation marks? If so set usingQuotation to true to only
  // assume there is a name when a quotation mark is present.
  // - Does the name end with a semicolon and it's in the first line? If so set 
  // usingSemiColon to true 
  // Use only one sub method (can be both false)
  const forceNameboxMethod2 = false;
  var maxNamesLength = 15;
  var nameInSameLine = false; // Is name and text continuous (true) or separated by a line break (false)?
  var usingQuotation = true; // text uses 「 or （ or 『 for dialogues?
  var usingSemiColon = false;  // Name ends with : or ： (JP width semicolon)

  // Replace names that will be inside the textbox
  // This variable also communicates with clipboard_Llule, to add them to
  // the regex ignore bloc so the name doesn't appear in the dialogue textbox
  // Names are also read from www/savedNames.json, so names can be added while the
  // game is running.
  $.replacements = { // Need to add translated to regex ignore in Clipboard_Llule
    //'春': '\\c[14]Haru', // Names
    '商人': 'Merchant',
    'シスター': 'Sister',
    '冒険者': 'Adventurer',
    '店員': 'Clerk',
    'お姉さん': 'Oneesan',
  }

  /*** END OF MANUAL CONFIGURATION ***/

  //var previousReplacements = {};
  $.nameBacklog = '';
  let fs = require('fs');
  if(!fileExists('savedNames')) writeFile('savedNames', {});
  
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
  // Used to add new names that were added while game is running to regex ignore in Llule
  /*function compareFileNames(file){                          // Deprecated (To delete, not used)
    let allNamesKeys = Object.keys(file).concat(Object.keys($.replacements));
    let previousReplacementsKeys = Object.keys(previousReplacements);
    let newNames = allNamesKeys.filter(val => !previousReplacementsKeys.includes(val));
    $.replacements2 = {};
    for(const name of newNames){
      if(file[name] !== '') $.replacements2[name] = file[name];
    }
  }*/

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
      //    this._textState.text = this._textState.text.replace(re, '\\N<'+key+'>'); // Use regular expression to replace all values and not the first one only
      //}
      //this._textState.text = this._textState.text.replace(/>\n/, '>');
      //this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
      

      // All names
      if(regexTextStartsWithName.test(this._textState.text)){ // See the textbox text starts with name
          this._textState.text = this._textState.text.replace(regexTextStartsWithName, '\\N<$1>');
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
      // Replace normal () to double width so they are detected in next code
      this._textState.text = this._textState.text.replace(/\)/g, '）')
      this._textState.text = this._textState.text.replace(/\(/g, '（')

      // add \n<> to name
      if(!/^(「|（|『| |\.|…)/.test(this._textState.text)                    // Check that text doesn't start with quotation or space or .
      //&& this._textState.text.indexOf('\n') < maxNamesLength               // if first line is x amount of characters
      && (this._textState.text.indexOf('\n') !== -1 || nameInSameLine)       // text is more than one line
      && this._textState.text.indexOf('\n') !== 0){                          // text doesn't start with a line break
        if(nameInSameLine){
          if(!((this._textState.text.indexOf('\n') !== -1) && (this._textState.text.indexOf('\n') < this._textState.text.indexOf('「')))){ // This if is added because game fucks up and sometimes gives name and text in separate lines, it checks that name is in single line only
            this._textState.text = this._textState.text.replace(/ ?「/, '\n「');
            this._textState.text = this._textState.text.replace(/ ?『/, '\n『');
            this._textState.text = this._textState.text.replace(/ ?（/, '\n（');
          }
        }

        let nameLength = this._textState.text.substring(0, this._textState.text.indexOf('\n')) // Get first line of text
        nameLength = nameLength.replace(/c\[\d{1,2}\]/gi, '');               // Remove color codes

        if(nameLength.length < maxNamesLength){                                // if first line is x amount of characters (name)
          if(usingQuotation){
            if(/「|（|『/.test(this._textState.text)){                          // Sentence includes at least one of these three quotations
              this._textState.text = '\\N<' + this._textState.text;            // add first part of namebox
              this._textState.text = this._textState.text.replace('\n', '>');  // replace first line break with second part of namebox
            }
          }else if(usingSemiColon){
            let match = /:|：/.exec(this._textState.text); // get index with regex

            if(match){
              if(match.index < this._textState.text.indexOf('\n')){                // semicolon in in the first line
                this._textState.text = this._textState.text.replace(/:|：/g, '');  // remove semicolon
                this._textState.text = '\\N<' + this._textState.text;              // process as name
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
      //check that text after name doesn't start with a line break, if so remove it
      if(this._textState.text.includes('>')){
        if(this._textState.text.indexOf('\n') == (this._textState.text.indexOf('>') + 1)){
          this._textState.text = this._textState.text.replace('\n', '');
        }
      }
      this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
    };
  }
  /* ---------------------------------------------------------------------------- */

  /* ---------------------------------------------------------------------------- */
  /* Helper functions for SetClipboardText /
  /* ----------------------------------- */
  // Nwjs (remove if this is merged to setClipboardText)
  var gui = require('nw.gui');
  var clipboard = gui.Clipboard.get();
  var textWasTranslated = false;

  /*
  * Replace Names (For use with SetClipboardText)
  * Receives a name (current name before it's displayed)
  * Returns the replaced name or an empty string if it wasn't replaced
  */
  function replaceNames(text){
    let name = text.replace(/(\\|)?C\\?\[\d{1,2}\]/gi, ''); // Remove color codes
    name = name.replace(//g, ''); // Sanitize name
    name = name.replace(/|/g, ''); 
    name = name.trim();

    let newName = '';
    let fileNames = readFile('savedNames');
    let replacementsCombined = Object.assign({}, fileNames, $.replacements); // merge dictionaries
    for (const [key, value] of Object.entries(replacementsCombined)) {
      let savedName = key.replace(/(\\|)?C\\?\[\d{1,2}\]/gi, ''); // Remove color codes
      let re = new RegExp('^' + savedName + '$'); // Create regex that matches whole sentence with key given      

      // If name matches, replace
      if(re.test(name) && value !== ''){
        re = new RegExp(key);
        newName = text.replace(re, value); 
      }
    }
    //compareFileNames(fileNames); // Check new names in file

    return newName;
  }

  // Add unknown name to file with translation from clipboard
  function saveNewName(newName){
    newName = newName.replace(/\\(c|C)\[\d{1,2}\]/g, '') // Remove color codes

    // Escape regex special characters
    // So that later they can be converted properly from string to regex
    newName = newName.replace(/(\(|\)|\{|\}|\[|\]])/g, '\\$1');

    var stopInterval = false
    const stopIntervalTimeout = setTimeout(() => {
      stopInterval = true;
    }, 5000);

    // Experimental changed the setTimeout of 5s to an interval that checks the state
    // of escapeText every few millis
    // This will wait until translation comes and saves it savedNames.json
    // *
    // this will not be necessary if this functionality is merged to 
    // setClipboardText plugin, as you can call this from the replace text function
    const i = setInterval((clipboard, newName) => {
      // Refresh value and invert it
      textWasTranslated = !ZERO.SetClipboardText.escapeText;

      if(textWasTranslated || stopInterval){
        clearInterval(i);
        clearTimeout(stopIntervalTimeout);
        // Get translated name
        let clipboardText = clipboard.get('text');
        let translatedText = clipboardText; // for removing name from line in stored translations

        clipboardText = clipboardText.substring(0, clipboardText.indexOf('.'));
        clipboardText = clipboardText.replace(/"/g, ''); // remove "
        clipboardText = clipboardText.replace(/\./g, ''); // remove .
        clipboardText = clipboardText.replace(/\?/g, '\\?'); // replace ? with escaped ?
        newName = newName.replace(/\?/g, '\\?'); // replace ? with escaped ?
        newName = newName.replace(/?C\\?\[\d{1,2}\]/gi, ''); // Remove color code if it has it
        clipboardText = clipboardText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // Capitalize first letter of each word

        // If name was ??? replace translated name to ??? (DeepL delivers what or broken text)
        if(/^\\\?\\\?\\\?$/.test(newName) || /^？？？$/.test(newName)) clipboardText = '\\?\\?\\?';
        
        // Convert to regex name if it ends with a capital letter or a number
        // Used when you have names like: Villager A, Villager B, Villager C, etc
        // Only using capital letters [A-Z] instead of uppercase and lowercase [A-Za-z] in case it registers false positives
        if(/([A-Z]|[Ａ-Ｚ])$/.test(newName)){
          newName = newName.replace(/[Ａ-Ｚ]$/, '([Ａ-Ｚ])?');
          newName = newName.replace(/[A-Z]$/, '([A-Z])?');
          clipboardText = clipboardText.replace(/[A-Z]$|[Ａ-Ｚ]$/, '$1');
        }
        // Same but with circled numbers
        if(/[①-⑳]$/.test(newName)){
          newName = newName.replace(/[①-⑳]$/, '([①-⑳])?');
          //console.log(JSON.stringify(clipboardText));
          clipboardText = clipboardText.replace(/\d{1,2}$|[①-⑳]$/, '$1');
        }
        // Same but with Full width numbers
        if(/[１-９]$/.test(newName)){
          newName = newName.replace(/[１-９]$/, '([１-９])?');
          //console.log(JSON.stringify(clipboardText));
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

        // Remove 'The ' from beginning of name
        if(clipboardText.startsWith('The ')) clipboardText = clipboardText.replace('The ', '');
        if(clipboardText.startsWith('A ')) clipboardText = clipboardText.replace('A ', '');

        // Write to file
        if(newName !== ''){
          let fileNames = readFile('savedNames');
          fileNames[newName] = clipboardText;
          writeFile('savedNames', fileNames);
        
          // Remove name from Translation Cache line
          let storedTranslations = readFile('translationsCache');
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
      }
    }, 300, clipboard, newName);
  }

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
    if (Input.isTriggered($.buttonHide) || TouchInput.isCancelled()) {
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
  
  // Prevent from advancing text when message is hidden - By HIME
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
      // Disable nameboxes
      //this.visible = false;

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
      // there was none in the current message
      // **Probably useless as this is after the previous returns and will only 
      // proc before a close
      if (this._parentWindow.isClosing()) {
        this._openness = this._parentWindow.openness;
      }

      // Original code
      this.close();
    };

    // Alt: Replace names with translated ones
    var MSGNameBoxText = Yanfly.Param.MSGNameBoxText; // Alt save state of "Name Box Added Text"
    Yanfly.Param.MSGNameBoxText = ''; // Prevent changes to replacedName after being replaced
    var ZERO_Window_NameBox_prototype_refresh = Window_NameBox.prototype.refresh;
    Window_NameBox.prototype.refresh = function(text, position) {
      nameboxHide = false; // Reset on new window
      
      // Add YEP added text now, before doing sending my text to replaced names
      // Own YEP will be ignored (as it was set to an empty string)
      text = MSGNameBoxText + text;

      // Replace names with entries in savedNames.json and $.replacements
      let replacedName = replaceNames(text);
      if(replacedName !== '') {
        text = replacedName;
        // Save replaced name for later use in backlog
        $.nameBacklog = text + '\\c[0]: ';
      }
      // Add unknown name to file with translation from clipboard
      else saveNewName(text);

      var text = ZERO_Window_NameBox_prototype_refresh.call(this, text, position);
      return text;
    }
  }

  /* ---------------------------------------------------------------------------- */
  /* For Lunatlazur_ActorNameWindow Namebox */ 
  /* ------------------------------------- */
  // **IMPORTANT** NEED TO UN-ANONYMISE THAT PLUGIN
  // CAN SET COLOR FOR NAMES WITH \c[colorCode] AT START OF NAME
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
      if (isHiddenOpacity) this.opacity = 0;
      else this.opacity = 255;

      if (this.active) return;

      this.close();
    };

    //Replace Names (For use with SetClipboardText)
    Window_ActorName.prototype.setText = function (text) {
      this._text = text;
      let color = params.textColor || 0; // Get text color from Lunatlazur params or set it to 0 (white)

      // Replace names with entries in savedNames.json and $.replacements
      let replacedName = replaceNames(this._text);
      if(replacedName !== '') {
        if(replacedName.startsWith('\\c') || replacedName.startsWith('\\C')){ // Manually add color to names
          color = replacedName.substring(replacedName.indexOf('[')+1,replacedName.indexOf(']'));
          replacedName = replacedName.substring(replacedName.indexOf(']')+1);
        }
        this._text = replacedName;
        $.nameBacklog = replacedName + '\\c[0]: ';
      }
      // Add unknown name to file with translation from clipboard
      else saveNewName(this._text);

      this.changeTextColor(this.textColor(color));

      // Call this.refresh()
      // But modified for color
      this.width = this.windowWidth();
      this.createContents();
      this.contents.clear();
      this.resetFontSettings();
      this.changeTextColor(this.textColor(color));
      this.drawText(this._text, this.standardPadding() * 2, 0, this.contents.width);
    };
  }

  /* ---------------------------------------------------------------------------- */
  /* For MPP_MessageEX namebox */ 
  /* ------------------------ */

  // Need to comment/delete "(function() {" and its closing bracket "})();"
	// so MPP_MessageEX isn't in an anonymous function (can't access its functions otherwise)

  // Check if MPP plugin exists
  if(typeof Window_MessageName == 'function'){
    let isHiddenNamebox = false;

    // Mod script so namewindows don't constantly close and open every time textwindow changes
    Window_MessageName.prototype.initialize = function(messageWindow) {
      this._messageWindow = messageWindow;
      Window_Base.prototype.initialize.call(this, 0, 0, 0, this.fittingHeight(1));
      this.openness = 0;
      this._name = null;
      this.deactivate();
    };

    Window_MessageName.prototype.setName = function(name, colorIndex) {
      // Replace names with entries in savedNames.json and $.replacements
      let replacedName = replaceNames(name);
      if(replacedName !== '') {
        if(replacedName.startsWith('\\c') || replacedName.startsWith('\\C')){ // Manually add color to names
          colorIndex = replacedName.substring(replacedName.indexOf('[')+1,replacedName.indexOf(']'));
          replacedName = replacedName.substring(replacedName.indexOf(']')+1);
        }
        name = replacedName;
        $.nameBacklog = replacedName + '\\c[0]: ';
      }
      // Add unknown name to file with translation from clipboard
      else saveNewName(name);

      // Mod
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

})(ZERO.HideMessageWindow);