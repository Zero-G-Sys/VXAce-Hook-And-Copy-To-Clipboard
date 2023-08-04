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

  // Reduce message rows if a textbox is present (so far only if they were added)
  // If you need this with already present nameboxes change logic from forceNameBoxMethod
  // to each refresh or equivalent function (will also need to get current rows from
  // $gameSystem._messageRows after the game is loaded)
  const changeMessageRows = true;

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
  /*** END OF MANUAL CONFIGURATION ***/
  
  var defaultMessageRows = Yanfly.Param.MSGDefaultRows;
  var reducedMessageRows = Yanfly.Param.MSGDefaultRows - 1;

  if(!Yanfly.Param.MSGDefaultRows && changeMessageRows){
    defaultMessageRows = 4; // Hard code them
    reducedMessageRows = 3;

    Window_Message.prototype.numVisibleRows = function() {
      return $gameSystem.messageRows();
    };
  
    Game_System.prototype.messageRows = function() {
      var rows = eval(this._messageRows) || defaultMessageRows;
      return Math.max(1, parseInt(rows));
    };
  }

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

  // Names that are enclosed by special characters and follow a regex pattern (color codes, [], etc)
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
          if(changeMessageRows) $gameSystem._messageRows = reducedMessageRows;
      } else $gameSystem._messageRows = defaultMessageRows;

      // Update rows
      if(changeMessageRows){
        height = this.windowHeight();
        this.move(this.x, this.y, this.width, height);
        this.updatePlacement();
        this.updateBackground();
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

      // Update rows
      if(changeMessageRows && /\\n</i.test(this._textState.text)) {
        $gameSystem._messageRows = reducedMessageRows;
        height = this.windowHeight();
        this.move(this.x, this.y, this.width, height);
        this.updatePlacement();
        this.updateBackground();
      } else $gameSystem._messageRows = defaultMessageRows;      
     
      this._textState.text = this.convertEscapeCharacters(this._textState.text); //Call escape characters again to create namebox
    };
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

      // Replace color of name
      if(Yanfly.Param.MSGNameBoxText){
        let code = Yanfly.Param.MSGNameBoxText.replace(/\\c\[(\d{1,2})\]/i, '$1');
        for (const [key, value] of Object.entries($.addColor)) {
          if(key == text) text = text.replace(code, value); 
        }
      } else{
        for (const [key, value] of Object.entries($.addColor)) {
          if(key == text) text = '\\c[' + value + ']' + text;
        }
      }
      
      // Add YEP added text now, before doing sending my text to replaced names
      // Own YEP will be ignored (as it was set to an empty string)
      text = MSGNameBoxText + text;

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

    Window_ActorName.prototype.updateBackground = function() {
      this._background = $gameMessage.background();
      if (isHiddenOpacity) this.setBackgroundType(2);
      else this.setBackgroundType(this._parentWindow._background);
    };

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

      if (Input.isTriggered($.buttonHideOpacity) && this.isOpen()) {
        this.updateBackground();
      }

      if (this.active) return;

      this.close();
    };

    //Replace Names (For use with SetClipboardText)
    Window_ActorName.prototype.setText = function (text) {
      this.updateBackground(); // Need to update background after forcing namebox
      let color;
      if(/C\[\d{1,2}\]/i.test(text)){
        color = text.replace(/C\[(\d{1,2})\].*/i, (...args) => { return args[1] });
        text = text.replace(/C\[(\d{1,2})\]/gi, '');
      } else {
        color = params.textColor || 0; // Get text color from Lunatlazur params or set it to 0 (white)
      }

      // Change text color
      for (const [key, value] of Object.entries($.addColor)) {
        if(key == text) color = value;
      }

      this._text = text;

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
      // Add color
      for (const [key, value] of Object.entries($.addColor)) {
        if(key == name) colorIndex = value;
      }

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