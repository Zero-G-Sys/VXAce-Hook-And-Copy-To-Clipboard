//=============================================================================

// Libellule Text extractor to clipboard plugin

// Clipboard_llule.js

//=============================================================================

/* 

 * Install and configure with the patcher here : 

 * https://www.dropbox.com/sh/p83yxde8e8nrz35/AADkJzbz7VuM7HqwiwhhfhHTa?dl=0

 * Help : http://www.ulmf.org/bbs/showthread.php?t=29359

 */

//=============================================================================

/* -------------------------------/
/* Changes done by Zero_G v1.13.1 /
/*--------------------------------/
 !!! Important !!! 
  SetClipboardText and (if used) HideMessageWindowZ_NameMod must be loaded before this script

- Take out line breaks (For translator aggregator mecab, DeepL script does it anyway)
- Function to replace words (for names, etc). Use const replacements.
- If there are more than two blocks, separate them with a '.' (DeepL separates sentences with '.')
- Remove block separators when text is surrounded by (), DeepL doesn't like it
- Stop sending text when SetClipboardText script is working or auto choice replace is working.
- Ignore regex for SetClipboardText popup text and save/load screens
- Enable/Disable sending text to clipboard with a toggle button (Sends popup text to top right screen)
- Fix sending to clipboard same text, prevent from overwriting [choices] + [text] (may not work if
   previous line started with the same text, experimental)
- Capture messages on top left screen (experimental, capturing only text that starts with '\FS[##]')
- Add remove tranlsated names if they are defined in HideMessageWindowZ (If game uses a namebox it won't send 
   translated/replaced text to clipboard) 
- Added checking choices block for ingore regex (with toggle var, default true)
v1.12 - Added remove tranlsated names if they are defined in HideMessageWindowZ files modification
      - Handle hearths ♥ ♡ in text better (code also changed in SetClipboardText)
      - Add option to disable clipboard during battles (can be toggle mid battle with 't')
v1.13 - Remove color codes from imported names from translated names added in HideMessageWindowZ
      - Add variables for text that starts with ... and when text is in between parentheses (to be handled by SetClipboardText)
v1.13.1 - Fix a bug with importing empty names for ignore regexbloc
*/

// Zero_G Variables (configure)
const CheckChoicesForIgnoreRegEx = true; // Check choices block for ingnore regex
const UseExtraMethodToCapturePopups = false;
const PopupStartsWith = /^\\FS\[\d{1,3}\]/; // Regex for (Starts with \FS[##]) (Get value needed by uncomenting the console log for drawTextEX in line 135~)
const clipboardDisableButton = 't';
const DisableClipboardDuringBattles = true;
const replacements = {
  //'春': 'Haru', // Names
  //'♥': '',
  //'♡': '',  // Deepl doesn't like these characters (made a special code for these ones)
  '・・・': '...',
  '・': '',
  'お兄さん': 'Oniisan',
  //'ヨコシマ': 'Yokoshima',
  '後輩' : 'Kouhai',
  '（': '.（',
  '「.（': '「（',
  //'「': '.「',
  '<.「': '<「',
  '^\\.「': '「',
}

// Don't edit this variables
var clipboardDisabled = false; // for switching sending text to clipboard
var textToSend = '';
var drawExTimer = null; // for storing a setTimeout
var translationSent = false; // Used in SetClipboardText
var hearthCharacter = false; // Used in SetClipboardText
var textInBetweenParentheses = false; // Used in SetClipboardText
var textStartsWithDots = false; // Used in SetClipboardText
/*------------------------------------------------------------------*/

TimerMil = 300; // Zero_G changed from 200 to 300 (give time for YEP namebox to enter)
WantCmdItemSeparator = true;
CmdItemSeparator = '。';
ShowCodeColor = false;
ForceNameSeparator = false;
TextSeparatorLeft = String.fromCharCode(12300);
TextSeparatorRight = String.fromCharCode(12301);
NameCodeColor = ['#ffffa0', '#40c0f0', '#ff80ff', '#80ff80', '#66cc40'];

IgnoreRepeatableItem = true;
BloctextSeparator = true;
IgnoreRepeatablebloc = true;
var IgnoreRegExtextbloc = [
  /^\d\d:\d\d($|.$|。$)/,
  /(^([,.\d]+)([,.]\d+)?)(\uFF27($|。$)|G($|。$)|$|。$)/,
  /^(\uFF27($|。$)|G($|。$))/,
  /Auto Insert (Enabled|Disabled).*/, // Textpopup from setClipboardText
  /Clipboard (Enabled|Disabled).*/, // Textpopup to enable/disable this script
  /Auto Replace Choices (Enabled|Disabled).*/, // Textpopup from setClipboardText
  /Cache Overwrite (Enabled|Disabled).*/, // Textpopup from Cache Overwrite
  /Auto Advance (Enabled|Disabled).*/, // Textpopup from Auto Advance
  /Skip (Enabled|Disabled).*/, // Textpopup from Skip Cached Text
  /Speed (Normal|Forced).*/, // Textpopup from forced movement speed
  /ファイル 1.*ファイル 2/, // Load screen
  /もちもの.*ム終了/, // Save screen
  /どのファイル.*/, // Load-Save screen block1
  /ニューゲーム/, // New game
  /ファイル.*/, // Load-Save screen block2
  /Which file.*/, // Load-Save translated
  /Item。.*/, // Menu translated
  /Autosave.*/,
  /Load which.*/,
  /New Game.*/,
  /Heal.*/ // Replace with first spell or skill (when entering menues)
];

// Add translated names form HideMessageWindowZ to regex ignore
if (typeof ZERO.HideMessageWindow !== 'undefined'){
  for(const index in ZERO.HideMessageWindow.replacements){
    let name = ZERO.HideMessageWindow.replacements[index];
    name = name.replace(/(c|C)\[\d{1,2}\]/g, '') // Remove color codes
    let re = new RegExp(name);
    IgnoreRegExtextbloc.push(re);
  }

  if(typeof ZERO.HideMessageWindow.replacements2 !== 'undefined'){ // Added for Files in HideMessageWindow
    for(const index in ZERO.HideMessageWindow.replacements2){ 
      let name = ZERO.HideMessageWindow.replacements2[index];
      name = name.replace(/(c|C)\[\d{1,2}\]/g, '') // Remove color codes
      let re = new RegExp(name);
      IgnoreRegExtextbloc.push(re);
    }
  }
}

ClipLogerOnStart = true;
WantChoiceSeparator = true;
ChoiceSeparator = '.\r\n'; // Change this to a '.' for DeepL
TextWaitingTimeOFF = true;
var ClipLoger = '';
LastItem = '';
ColorEnCour = '';
ActualThis = '';
StarTextNamefound = false;
EndTextNamefound = false;
BlocSeparatorLeft = String.fromCharCode(12300);
BlocSeparatorRight = String.fromCharCode(12301);
LastColor = '';
MemText = '';
LastMemTextSend = ' ';
ClipTimerOn = false;
SaveOrgDrawText = Bitmap.prototype.drawText;
var gui = require('nw.gui');
var clipboard = gui.Clipboard.get();
var win = gui.Window.get();
var SaveoldInput_onKeyDown = Input._onKeyDown;
var Savewindowonload = window.onload;
var choices_encour = [];

/*
* Zero_G function to capture messages on top left sreen
* These messages usually start with \FS[##], and are used to show a status update
*   for example 'Got x item' or 'Sensitivity +10'
* This method with capure those messages for 2 seconds and send them to clipboard
*   along with any other text that was already queued (ex: main message window)
*   you will get: [text in popup] text in message window
*/   
if(UseExtraMethodToCapturePopups){
  var ZERO_Window_Base_prototype_drawTextEx = Window_Base.prototype.drawTextEx;
  Window_Base.prototype.drawTextEx = function(text, x, y) {
    if(text){
      //See every text capture in drawTextEx
      //console.log('drawTextEx: ' + text);

      if(PopupStartsWith.test(text)){
        text = text.replace(PopupStartsWith).trim(); // Remove '\FS[##]'
        if (text != ''){
          text = '[' + text; // Add separator
          text += ']. '; 
          textToSend += text; // Add new block
          textToSend = textToSend.replace(/(\\|\/)(c|C)\[\d{1,3}\]/g, ''); // Remove color codes
          textToSend = this.convertEscapeCharacters(textToSend); // Convert variables (\V[n])
    
          // Check ignore array
          IgnoreRegExtextbloc.forEach(function(re){
            if (textToSend.search(re)) return;
          });
          
          if (drawExTimer === null){
            drawExTimer = setTimeout(() => { // Wait for more messages
              if($gameMessage._texts.length > 0){
                clipboard.set(textToSend+' '+LastMemTextSend, 'text');
              }else{
                clipboard.set(textToSend, 'text');
              }
              
              textToSend = '' // Reset variable
              drawExTimer = null;
            }, 2000); 
          }
        }
      }
    }
    return ZERO_Window_Base_prototype_drawTextEx.apply(this, arguments);
  }
}
/** End */

// Stop clipboard during battles
if(DisableClipboardDuringBattles){
  var ZERO_Scene_Battle_prototype_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function() {
    clipboardDisabled = true;
    ZERO_Scene_Battle_prototype_start.call(this);
  };

  var ZERO_Scene_Battle_prototype_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    ZERO_Scene_Battle_prototype_terminate.call(this);
    clipboardDisabled = false;
  };
}
/** End */

Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
  OptionalText = '';
  pass = true;
  if (text && !Input.isPressed('control')) { // Zero_G added check to not capture text while skipping text with control
    if (text.length == 1 && y >= this.height) {
      pass = false;
    }

    if (IgnoreRepeatableItem && text.length > 1) {
      if (text == LastItem) {
        pass = false;
      }
      LastItem = text;
    }
    if (pass) {
      if (ShowCodeColor) {
        if (this.textColor != LastColor) {
          OptionalText = '<' + this.textColor + '>';
          LastColor = this.textColor;
        }
      }
      if (ForceNameSeparator && text.length == 1) {
        if (!ClipTimerOn && NameCodeColor.indexOf(this.textColor) > -1) {
          LastColor = this.textColor;
          StarTextNamefound = true;
          ColorNameEnCour = this.textColor;
        }
        if (
          ClipTimerOn &&
          StarTextNamefound &&
          this.textColor != ColorNameEnCour
        ) {
          OptionalText = OptionalText + TextSeparatorLeft;
          StarTextNamefound = false;
          EndTextNamefound = true;
        }
      }
      if (BloctextSeparator) {
        if (ActualThis == '') {
          ActualThis = this;
          OptionalText = OptionalText + BlocSeparatorLeft;
        } else {
          if (ActualThis != this) {
            OptionalText =
              OptionalText + BlocSeparatorRight + '\r\n' + BlocSeparatorLeft;
            ActualThis = this;
          }
        }
        if ($gameMessage != null) {
          if ($gameMessage.isChoice() && !choices_encour.length) {
            choices_encour = $gameMessage._choices;
          }
        }
      }
      if (ClipTimerOn) {
        if (text.length > 1 && WantCmdItemSeparator) {
          MemText = MemText + OptionalText + text + CmdItemSeparator;
        } else {
          MemText = MemText + OptionalText + text;
        }
      } else {
        if (text.length > 1 && WantCmdItemSeparator) {
          MemText = OptionalText + text + CmdItemSeparator;
        } else {
          MemText = OptionalText + text;
        }

        ClipTimerOn = true;
        ClipTimer = setTimeout(ClipTimerSend, TimerMil);
      }
    }
  }
  SaveOrgDrawText.call(this, text, x, y, maxWidth, lineHeight, align);
};
function ClipTimerSend() {
  if (BloctextSeparator) {
    MemText = MemText + BlocSeparatorRight;
    KickOutDuplicateBloc();
  }
  if (EndTextNamefound) {
    MemText = MemText + TextSeparatorRight;
    StarTextNamefound = false;
    EndTextNamefound = false;
    if (BloctextSeparator) {
      KickOutDuplicateBloc();
    }
  }
  // Zero_G various
  if (MemText != '' && ZERO.SetClipboardText.escapeText && !ZERO.SetClipboardText.replacingChoicesStopIlule && !clipboardDisabled) {
    // Take out line breaks (For translator aggregator)
    MemText = MemText.replace(/(\r\n|\n|\r)/gm,' ');

    // If text has hearts replace them and switch variable to notify it
    if(MemText.includes('♡') || MemText.includes('♥')){
      MemText = MemText.replace(/♡/g,'%23'); // %23 is urlURI code for #
      MemText = MemText.replace(/♥/g,'%23');
      hearthCharacter = true; 
    }else hearthCharacter = false;

    // Replace words (for names, etc)
    for (const [key, value] of Object.entries(replacements)) {
      let re = new RegExp(key,"g"); // Create regex with variable
      MemText = MemText.replace(re, value); // Use regular expresion to replace all values and not the first one only
    }

    // If there are more than two blocks, separate them with a '.' (DeepL separates sentences with '.')
    let re = new RegExp(BlocSeparatorRight+' '+BlocSeparatorLeft,"g");
    MemText = MemText.replace(re, BlocSeparatorRight+'.'+BlocSeparatorLeft)

    // Remove block separators when text is surrounded by (), DeepL doesn't like it
    let left = BlocSeparatorLeft + String.fromCharCode(65288);
    let right = String.fromCharCode(65289) + BlocSeparatorRight;
    if(MemText.startsWith(left)){
      MemText = MemText.replace(left, String.fromCharCode(65288));
      MemText = MemText.replace(right, String.fromCharCode(65289));
    }

    // If whole text is in between parentheses, DeepL puts parentheses everywhere
    // So delete them and flip a switch so SetClipboardText can handle it
    if(/^（/.test(MemText) && /）$/.test(MemText)){
      textInBetweenParentheses = true;
      MemText = MemText.replace(/^（/, '');
      MemText = MemText.replace(/）$/, '');
    } 
    else textInBetweenParentheses = false;

    // Text starts with ... DeepL usually worngly adds a word at the start of translation
    // So flip a switch so SetClipboardText can handle it
    if(/^「…/.test(MemText)) textStartsWithDots = true;
    else textStartsWithDots = false;

    if (!LastMemTextSend.startsWith(MemText)){ // IF clause to fix repeating text when a choice window is displayed. May break if previous memtext start the same
      //console.log(MemText); // Text sent to clipboard
      clipboard.set(MemText, 'text');
      LastMemTextSend = MemText;
      translationSent = true;
    }
  }
  ClipTimerOn = false;
  ActualThis = '';
  LastColor = '';
  ColorNameEnCour = '';
}
var LibWindow_Message_prototype_clearFlags =
  Window_Message.prototype.clearFlags;
Window_Message.prototype.clearFlags = function () {
  LibWindow_Message_prototype_clearFlags.call(this);
  this._showFast = true;
  this._lineShowFast = true;
  this._pauseSkip = false;
};
function LaunchCliploger() {
  Path = process.cwd() + '\\www\\js\\plugins';
  var execFile = require('child_process').execFile;
  ClipLoger = execFile(Path + '\\ClipLoger.exe', function (
    error,
    stdout,
    stderr
  ) {
    ClipLoger = '';
  });
  if (!ClipLoger.pid) {
    //alert(Msg1);
    return;
  }
  setTimeout(Focus, 500);
}
function Focus() {
  if (ClipLoger.pid) {
    win.focus();
  } else {
    setTimeout(Focus, 500);
  }
}
Input._onKeyDown = function (event) {
  if (event.keyCode == 118) {
    clipboard.set(LastMemTextSend, 'text');
  }
  if (event.keyCode == 117) {
    if (ClipLoger.pid) {
      ClipLoger.kill();
    } else {
      LaunchCliploger();
    }
  }
  if (event.keyCode == 116) {
    if (ClipLoger.pid) {
      ClipLoger.kill();
    }
  }
  if (event.key == clipboardDisableButton){ // Zero_G add event to disable sending text to clipboard
    clipboardDisabled = !clipboardDisabled
    if(!clipboardDisabled) SceneManager.callPopup('Clipboard Enabled');
    else SceneManager.callPopup('Clipboard Disabled');
  }
  SaveoldInput_onKeyDown.call(this, event);
};
window.onload = function () {
  if (ClipLogerOnStart) {
    LaunchCliploger();
  }
  Savewindowonload.call(this);
};
function KickOutDuplicateBloc() {
  var Bloc = MemText.split('\r\n');
  var output = [];
  var Deleteone = '';
  if (choices_encour.length && WantChoiceSeparator) {
    var temps = choices_encour[0].replace(/\\C\[\d+\]/gi, '');
    var With = BlocSeparatorLeft + temps;
    var Deleteone = With;
    for (i = 1; i < choices_encour.length; i++) {
      temps = choices_encour[i].replace(/\\C\[\d+\]/gi, '');
      With = With + ChoiceSeparator + temps;
      Deleteone = Deleteone + temps;
    }
    With += BlocSeparatorRight;
    Deleteone += BlocSeparatorRight;
    
    //Zero_G check choices block in ignore regex
    if(CheckChoicesForIgnoreRegEx){
      if(RegEXspeIgnore(Deleteone)){
        output.push(With);
      } else {
        Deleteone = '';
      }  
    }else{
      output.push(With);
    }

    choices_encour = [];
  }
  for (var i = 0; i < Bloc.length; i++) {
    if (output.indexOf(Bloc[i]) < 0) {
      if (RegEXspeIgnore(Bloc[i]) && Deleteone != Bloc[i]) {
        output.push(EraseDoubleSeparator(Bloc[i]));
      }
    }
  }
  MemText = output.join('\r\n');
}

// Returns false if match found
function RegEXspeIgnore(Bloc) {
  BlocS = Bloc.slice(1, Bloc.length - 1); 

  if (typeof ZERO.HideMessageWindow !== 'undefined'
  && typeof ZERO.HideMessageWindow.replacements2 !== 'undefined'){ //Added for files in HideMessageWindow
    for(const index in ZERO.HideMessageWindow.replacements2){
      let exist = false;
      let name = ZERO.HideMessageWindow.replacements2[index];
        name = name.replace(/(c|C)\[\d{1,2}\]/g, '') // Remove color codes
      for (const regex of IgnoreRegExtextbloc){
        if(regex.test(name)){
          exist = true;
          break;
        }
      }
      if(!exist && name !== ''){
        let re = new RegExp(name);
        IgnoreRegExtextbloc.push(re);
      }
    }
  }

  if (IgnoreRegExtextbloc.length != 0) {
    for (var i = 0; i < IgnoreRegExtextbloc.length; i++) {
      if (BlocS.search(IgnoreRegExtextbloc[i]) != -1) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
}
function EraseDoubleSeparator(Bloc) {
  if (Bloc.split(BlocSeparatorLeft).length == 3) {
    if (Bloc.split(BlocSeparatorRight).length == 3) {
      return Bloc.slice(1, Bloc.length - 1);
    }
  }
  return Bloc;
}
Msg1 = 'ClipLoger.exe not found\r\nReinstal the plugin from the patcher\r\n';
var Save_Window_Message_prototype_updateWait =
  Window_Message.prototype.updateWait;
Window_Message.prototype.updateWait = function () {
  if (ClipTimerOn && TextWaitingTimeOFF) {
    this._waitCount = 0;
  }
  return Save_Window_Message_prototype_updateWait.call(this);
};

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