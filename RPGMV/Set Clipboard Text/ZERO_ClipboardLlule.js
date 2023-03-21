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

/* --------------------------------/
/* Changes done by Zero_G v1.13.12 /
/*---------------------------------/
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
      - Handle hearts ♥ ♡ ❤ in text better (code also changed in SetClipboardText)
      - Add option to disable clipboard during battles (can be toggle mid battle with 't')
v1.13 - Remove color codes from imported names from translated names added in HideMessageWindowZ
      - Add variables for text that starts with ... and when text is in between parentheses (to be handled by SetClipboardText)
v1.13.1 - Fix a bug with importing empty names for ignore regexbloc
v1.13.2 - Renamed variable heartCharacter to hasHeartCharacter
v1.13.3 - Fix a parenthesys replace bug (upgraded regex to hande wester and eastern parenthesis)
v1.13.4 - Add removing 「 and 」 when they are alone as DeepL doesn't like that 
          (old translations caches must be updated, use /^[^「]+」[^」]+$/ regex to find which lines should have「 and 」removed )
        - Remove repetition of ！ character (DeepL doens't like it)
v1.13.5 - Add a fix for regex savedNames
v1.13.6 - Add variable to let SetClipbardText to hook text during battles.
v1.13.7 - Added names honorifics (created a new object for name replacements)
v1.13.8 - Replaced how it checks for nameboxes to ignore them, now it loads the savedNames.json each time (deprecated code commented)
        - Added, disable map name window (when entering maps)
v1.13.9 - Added ❤ and ♪ symbols to replace
v1.13.10 - Change variable name from 'translationSent' to 'jpTextSentToMem'
v1.13.11 - Add another check to not send text when there are choices (first one is in SetClipboardText and most times will trigger
	       don't really know if it ever failed, but for sanity it's here)
v1.13.12 - Check for cache here, so it can add a · for it to be ignored by deepL plugin

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
  // Punctuations
  '・・・': '...',
  '・': '',
  '（': '.（',
  '「.（': '「（',
  //'「': '.「',
  '<.「': '<「',
  '^\\. *「': '「',
  '^\\. *': '', // Text starts with dot (remove)
  // General replacements
  'お兄さん': 'Oniisan',
  '兄さん': 'Niisan',
  '後輩': 'Kouhai',
  'パイズリフェラ': 'Paizuri Blowjob',
  'パイズリ': 'Paizuri',
  '爺さん': 'Jiisan',
  'じいさん': 'Jiisan',
  'お婆さん': 'Obaasan', // Grandma
  'おばさん': 'Obasan', // Aunty
  'おじさん': 'Ojisan',
  'おじいさん': 'Ojisan',
  'オジサン': 'Ojisan',
  'おじさん': 'Ojisan',
  'おっさん': 'Ossan',
  '親父': 'Oyaji',
  'お嬢ちゃん': 'Ojouchan',
  'お嬢さん': 'Ojousan',
  'お嬢様': 'Ojousama',
  'お姉さま': 'Onesama',
  'おねえさま': 'Onesama',
  'お姉さん': 'Onesan',
  'おねえちゃん': 'Onechan',
  'お姉ちゃん': 'Onechan',
  '姉ちゃん': 'Neechan',
  'ねーちゃん': 'Nee-chan',
  'おじさま': 'Ojisama',
  'おじ様':  'Ojisama',
  'ジジイ': 'Jijii',
  '老人': 'Rojin', // Oldman - Elder person
  'ヒヒ': 'Hihi',
  'ﾋﾋ': 'Hihi',
  '坊主': 'Bozu',
  'オナホ': 'Onahole',
  '肉便器': 'Meat Urinal',
  '先生': 'Sensei',
  '妖怪': 'Youkai',
  'ご主人様': 'Goshujinsama',
  '旦那様': 'Danna-sama',
  '旦那': 'Danna',
  '姉様': 'Anesama',
  'お兄様': 'Onisama',
  'シコ': 'Shiko',
  '兄ちゃん': 'Niichan',
  '奥さん': 'Okusan',
  'アクメ': 'Orgasm',
  'むにゅ': 'Munyu',
  '巫女': 'Miko',
  '嬢ちゃん': 'Jou-chan',
  '退魔師': 'Exorcist',
  'お札': 'Talisman',
  'ふふふ': 'Fufufu',
  'ふふ': 'Fufu',
  'ｹｹｹ': 'Kekeke',
  'ｹｹ': 'Keke',
  '^(「|（|\\()?あらあら': 'Ara ara',
  'あらあら': 'Ara ara',
  'お母様': 'Okaasama',
  'お母さま': 'Okaasama',
  '淫魔': 'Succubus',
  'エロガキ': 'Erokid',
  '全く': 'Mattaku',
  'オヤジ': 'Oyaji',
  'ショタコン': 'Shotacon',
  'もう！(！+)?': 'Mou!$1 ',
  //'^(（|「)?まったく': '$1Mataku',  // Deactivated until tested that works
  '(『|』)': '\"', // Set " for important words (Needs filter rules in firefox plugin deactivated and custom code on SetClipboardText), so not compatible with older caches
  'うひひ': 'Uhihi',
  'マ〇コ': 'マンコ', // katakana for manko (pussy) will also work for オマ〇コ -> オマンコ (omanko)
  'チ〇ポ': 'チンポ', // Katakana for chinpo (penis)
}

// Put names to be replaced here, this will add to each name the suffixes/honorifics [san, sama, chan, kun]
const nameReplacements = {
  'チャラ男': 'Playboy',
}

// Don't edit this variables
var clipboardDisabled = false; // for switching sending text to clipboard
var clipboardDisabledBattle = clipboardDisabledBattle || false; // for disabling in battle and letting SetClipboardText hangle the hooking
var textToSend = '';
var drawExTimer = null; // for storing a setTimeout
var jpTextSentToMem = false; // Used in SetClipboardText
var hasHeartCharacter = false; // Used in SetClipboardText
var hasMusicNoteCharacter = false; // Used in SetClipboardText
var textInBetweenParentheses = false; // Used in SetClipboardText
var textStartsWithDots = false; // Used in SetClipboardText
var cacheFound = false; // Used in SetClipboardText
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
  /(^([,.\d]+)([,.]\d+)?)(\uFF27($|。$)|(G|Ｇ)($|。$)|$|。$)/,
  /^(\uFF27($|。$)|(G|Ｇ)($|。$))/,
  /Auto Insert (Enabled|Disabled).*/, // Textpopup from setClipboardText
  /Clipboard (Enabled|Disabled).*/, // Textpopup to enable/disable this script
  /Auto Replace Choices (Enabled|Disabled).*/, // Textpopup from setClipboardText
  /Cache Overwrite (Enabled|Disabled).*/, // Textpopup from Cache Overwrite
  /Auto Advance (Enabled|Disabled).*/, // Textpopup from Auto Advance
  /Skip (Enabled|Disabled).*/, // Textpopup from Skip Cached Text
  /Speed (Normal|Forced).*/, // Textpopup from forced movement speed
  /Cached Translations Reloaded.*/, // Textpopup 
  /ファイル 1.*ファイル 2/, // Load screen
  /もちもの.*ム終了/, // Save screen
  /どのファイル.*/, // Load-Save screen block1
  /ニューゲーム/, // New game
  /ファイル.*/, // Load-Save screen block2
  /Save.*/,
  /Load.*/,
  /File.*/,
  /Which file.*/, // Load-Save translated
  /Item。.*/, // Menu translated
  /Autosave.*/,
  /Load which.*/,
  /(Save|Load) to which.*/,
  /New Game.*/,
  /Heal.*/, // Replace with first spell or skill (when entering menues)
];

/*--------------------------------------------------------------------------*/

// Add honorifics
let nameReplacementsWitHonorifics = {};

for (let [key, value] of Object.entries(nameReplacements)) {
  nameReplacementsWitHonorifics[(key + '姉さん')] = (value + '-neesan');
  nameReplacementsWitHonorifics[(key + 'さん')] = (value + '-san');
  nameReplacementsWitHonorifics[(key + 'さま')] = (value + '-sama');
  nameReplacementsWitHonorifics[(key + '様')] = (value + '-sama');
  nameReplacementsWitHonorifics[(key + 'くん')] = (value + '-kun');
  nameReplacementsWitHonorifics[(key + '君')] = (value + '-kun');
  nameReplacementsWitHonorifics[(key + 'ちゃん')] = (value + '-chan');
  nameReplacementsWitHonorifics[(key + 'たん')] = (value + '-tan');
  nameReplacementsWitHonorifics[(key + '先輩')] = (value + '-senpai');
  nameReplacementsWitHonorifics[(key + 'せんぱい')] = (value + '-senpai');
  nameReplacementsWitHonorifics[(key + '先生')] = (value + '-sensei');
  nameReplacementsWitHonorifics[(key + 'せんせい')] = (value + '-sensei');
  nameReplacementsWitHonorifics[(key + 'おねえちゃん')] = (value + '-onechan');
  nameReplacementsWitHonorifics[(key + 'お姉ちゃん')] = (value + '-onechan');
  nameReplacementsWitHonorifics[(key + 'リン')] = (value + 'rin');  
  nameReplacementsWitHonorifics[(key + '姉様')] = (value + '-anesama');
  nameReplacementsWitHonorifics[(key + 'お兄様')] = (value + '-onisama');
  nameReplacementsWitHonorifics[(key + '姉ちゃん')] = (value + '-neechan');
  nameReplacementsWitHonorifics[(key + '兄ちゃん')] = (value + '-niichan');
}

let fs = require('fs');

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

// Merge dictionaries
Object.assign(replacements, nameReplacements);

// Add translated names form HideMessageWindowZ to regex ignore (Deprecated)
// TODO: Change this to only load once from array in script, and reload the json to everytime, discarding this convoluted mess of merging the arrays
/*if (typeof ZERO.HideMessageWindow !== 'undefined'){
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

      // If it's a name with numbers, add a wild card for 3 next characters
      // This way it can be used when it's a name without numbers and variable numbers
      // Ex: name, name 1, name 2
      if(name.includes('$1')) name = name.replace(' $1', '.{0,3}');

      // If using Lunatlazur names, remove color code from name
      //if(typeof Window_ActorName == 'function'){ 

      let re = new RegExp(name);
      IgnoreRegExtextbloc.push(re);
    }
  }
}*/

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

// Disable map names (Usually bothers first message when you enter a new map)
Window_MapName.prototype.update = function() {};
Window_MapName.prototype.refresh = function() {};

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

          // Check if translation exist in cache
          storedTranslations = readFile('translationsCache');
          if(storedTranslations[textToSend] !== undefined){
            textToSend = '·' + textToSend; // add · so that DeepL browser plugin ignores text
          }
          
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
    clipboardDisabledBattle = true;
    ZERO_Scene_Battle_prototype_start.call(this);
  };

  var ZERO_Scene_Battle_prototype_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    ZERO_Scene_Battle_prototype_terminate.call(this);
    clipboardDisabled = false;
    clipboardDisabledBattle = false;
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
    if(MemText.includes('♡') || MemText.includes('♥') || MemText.includes('❤')){
      MemText = MemText.replace(/♡/g,'%23'); // %23 is urlURI code for #
      MemText = MemText.replace(/♥/g,'%23');
	  MemText = MemText.replace(/❤/g,'%23');
      hasHeartCharacter = true; 
    }else hasHeartCharacter = false;

	// If text has music notes replace them and switch variable to notify it
    if(MemText.includes('♪')){
		MemText = MemText.replace(/♪/g,'@');
		hasMusicNoteCharacter = true; 
	}else hasMusicNoteCharacter = false;

    // Replace names with honorifics first
    for (const [key, value] of Object.entries(nameReplacementsWitHonorifics)) {
      let re = new RegExp(key,"g"); // Create regex with variable
      MemText = MemText.replace(re, value); // Use regular expresion to replace all values and not the first one only
    }

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
    if(/^(|「)(（|\()/.test(MemText) && /(）|\))(|」)$/.test(MemText)){ 
      textInBetweenParentheses = true;
      MemText = MemText.replace(/^(|「)(（|\()/, '');
      MemText = MemText.replace(/(）|\))(|」)$/, '');
    } 
    else textInBetweenParentheses = false;

    // Text starts with ... DeepL usually worngly adds a word at the start of translation
    // So flip a switch so SetClipboardText can handle it
    if(/^「…/.test(MemText)) textStartsWithDots = true;
    else textStartsWithDots = false;

    // DeepL gives bad translations when 「 and 」 are used
    // Delete them only when there are one of each
    // And when text starts and finishes with it
    if((MemText.match(/「/g) || []).length == 1 &&
       (MemText.match(/」/g) || []).length == 1 &&
       /^「.*」$/.test(MemText)){
        MemText = MemText.replace('「', '');
        MemText = MemText.replace('」', '');
    }

    // DeepL doens't like multiple use of ！
    MemText = MemText.replace(/！{2,}/g, '！');

    if (!LastMemTextSend.startsWith(MemText)){ // IF clause to fix repeating text when a choice window is displayed. May break if previous memtext start the same
      if(!$gameMessage.isChoice()){ //Don't send on choice text (handled by SetClipboardText)
        //console.log(MemText); // Text sent to clipboard

        // Check if translation exist in cache
        storedTranslations = readFile('translationsCache');
        if(storedTranslations[MemText] !== undefined){
          clipboard.set('·'+MemText, 'text');; // add · so that DeepL browser plugin ignores text
          cacheFound = true;
        } else{
          clipboard.set(MemText, 'text');
          cacheFound = false;
        }
        LastMemTextSend = MemText;
        jpTextSentToMem = true;
      }
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

  // Previous way to import names from HideMessageWindowZ to ignore that block (Deprecated)
  /*if (typeof ZERO.HideMessageWindow !== 'undefined'
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
        if(name.includes('$1')) name = name.replace(' $1', '.{0,3}');
        IgnoreRegExtextbloc.push(re);
      }
    }
  }*/

  let savedNames = readFile('savedNames');

  for(const key in savedNames){
    let name = savedNames[key];
    name = name.replace(/\\(c|C)\[\d{1,2}\]/g, '') // Remove color codes
    if(name.includes('$1')) name = name.replace(' $1', '.{0,3}'); // Remove regex for multi names
    else {
      name = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Esacpe special characters for regex (if there is a [ for example use it as text not as regex special character)
      name = name.replace(/\\\\\\/g, '\\'); // Fix triple \
    }
    let re = new RegExp('^' + name + '。?$'); // Make sure it only looks for namebox blocks (sometimes it has a dot 。)
    if(re.test(BlocS.trim())) return false;
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