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

/* -----------------------/
/* Changes done by Zero_G /
/*------------------------/
 !!! Important !!! 
  SetClipboardText and (if used) HideMessageWindowZ_NameMod must be loaded before this script

- Take out line breaks (For translator aggregator mecab, DeepL script does it anyway)
- Function to replace words (for names, etc). Use const replacements.
- If there are more than two blocks, separate them with a '.' (DeepL separates sentences with '.')
- Remove block separators when text is surrounded by (), DeepL doesn't like it
- Stop sending text when SetClipboardText script is working
- Ignore regex for SetClipboardText popup text and save/load screens
- Enable/Disable sending text to clipboard with a toggle button (Sends popup text to top right screen)
- Attempt to fix sending to clipboard same text, prevent from overwriting [choices] + [text] (may not work if
   previous line started with the same text, experimental)
- Capture messages on top left screen (experimental, capturing only text that starts with '\FS[20]')
- Add remove tranlsated names if they are defined in HideMessageWindowZ (If game uses a namebox it won't send 
   translated/replaced text to clipboard)
- Added checking choices block for ingore regex (with toggle var, default true)
*/

// Zero_G Variables
CheckChoicesForIgnoreRegEx = true; // Check choices block for ingnore regex
UseExtraMethodToCapturePopups = false;
PopupStartsWith = '\\FS[20]';
const replacements = {
  //'春': 'Haru', // Names
  '♥': '',
  '♡': '',  // Deepl doesn't like these characters
  '・・・': '...',
  '・': '',
  'お兄さん': 'Oniisan',
  //'ヨコシマ': 'Yokoshima',
  '後輩' : 'Kouhai'
}
var clipboardDisableButton = 't';
var clipboardDisabled = false; // Zero_G new var
var textToSend = '';
var drawExTimer = null;
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
  /ファイル 1.*ファイル 2/, // Load screen
  /もちもの.*ム終了/, // Save screen
  /どのファイル.*/, // Load-Save screen block1
  /ニューゲーム/, // New game
  /ファイル.*/, // Load-Save screen block2
];

// Add translated names form HideMessageWindowZ to regex ignore
if (typeof ZERO.HideMessageWindow !== 'undefined'){
  for(const index in ZERO.HideMessageWindow.replacements){
    let re = new RegExp(ZERO.HideMessageWindow.replacements[index]);
    IgnoreRegExtextbloc.push(re);
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

// Zero_G function to capture messages on top left sreen
if(UseExtraMethodToCapturePopups){
  var ZERO_Window_Base_prototype_drawTextEx = Window_Base.prototype.drawTextEx;
  Window_Base.prototype.drawTextEx = function(text, x, y) {
    if(text){
      //See every text capture in drawTextEx
      //console.log('drawTextEx: ' + splittedText);

      //if(text.search(/^\\FS\[20\]/g) !== -1){ // Search for '\FS[20]' at the start (using regex)
      if(text.startsWith(PopupStartsWith)){
        let splittedText = text.split(PopupStartsWith)[1]; // Remove '\FS[20]'
        if (splittedText != ''){
          splittedText = '[' + splittedText; // Add separator
          splittedText += ']. '; 
          textToSend += splittedText; // Add new block
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
  if (MemText != '' && ZERO.SetClipboardText.escapeText && !clipboardDisabled) {
    // Take out line breaks (For translator aggregator)
    MemText = MemText.replace(/(\r\n|\n|\r)/gm,' ');

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

    if (!LastMemTextSend.startsWith(MemText)){ // Attempt to fix choices repeating text. May break if previous memtext start the same
      //console.log(MemText); // Text sent to clipboard
      clipboard.set(MemText, 'text');
      LastMemTextSend = MemText;
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
