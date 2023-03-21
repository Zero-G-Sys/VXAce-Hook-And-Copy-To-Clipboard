//=============================================================================
// Set Clipboard Text
//=============================================================================
/*:
 * @ZERO_SetClipboardText
 * @plugindesc Insert clipboard text into game textbox
 * @version 1.16.1
 * @author Zero_G
 * @filename ZERO_SetClipboardText.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 For using when translating game text via hook method. (DeepL extension method)

 Sets the the text in clipboard to the current textbox, can also be triggered 
 via the press of a button.
 Option to replace choices with translated ones.

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

 Must use a modified clipboard_llule plugin. (ZERO_ClipboardLlule)

 Script has an option to store translations in a file, and read upon that file
 the next time it sees an already translated text. More options with their
 explanation in the configuration variables.

 == Terms of Use ==
 - Free for use

 == Changelog ==
 1.16.1  -Bug fixes for TranslationWindo
         -Cache for normal text is now checked on ClipboardLulle so it can add · and be ignored by DeepL plugin
         -Recovering from pause now restores translated text
 1.16.0  -Added TranslationWindow, a new window that opens on key press and lets you modify the current saved cache
          for the current line (shows translation, romaji, current and original)
 1.15.7  -Added option to change font size if textwindow has a face
         -Added making font smaller or bigger if original text started with a size modifier (\{ or \})
 1.15.6  -Implemented YEP_WordWrap and setted as default word wrapper
 1.15.5  -Fix some bugs when choice replace wasn't triggering properly (sometiems )when there was an empty text window.
         -Fix a bug where choices weren't replaced when there was text (bug introduced when in 1.15.3 when the wait
          was removed for auto insert)
         -Fix bug introduced in 1.15.3 when var 'jpTextSentToMem' was introduced that broke translation for combat text
            fixed by reseting vars in start message before processing battle text.
 1.15.4  -Added bgm volume control midgame/scenes (set to numpad 6-9)
         -Fix icons in losing the \\ after translation
         -Strip " from beggingin and end on romaji
 1.15.3  -Added keyevent (numeric pad) to send text from vaiables to memory
		      Used for sending text found in erostate. Must be manually configured
 		     -Change variable name from 'translationSent' to 'jpTextSentToMem'
         -Trying to fix bug where cached text is not displayed until translation deepl is stopped
		     -Added a check to not try to use deepL text if processing cache
		     -Auto insert (deepL) translation now waits properly for clipboardLulle (wait removed)
 1.15.2  -Added ❤ and ♪ symbols to replace
 1.15.1  -Added some more replacement fixes to romaji conversion
         -Fixed wordwraper out of bounds when there was a heart double space character (may need to add more characters)
         -Fix a bug where the script would get stuck when selecting a choice fast
         -Typo Hearth -> Heart
 1.15.0  -Added romaji convertion with kuromoshi library, to setup you need to copy two files to the lib folder, and modify 
          index.html. For now it overwrites the text in a window (and the stored cache) with romaji when pressing a key.
 1.14.12 -Added replace current textbox to romaji and update stored cache, when pressing a button ('g')
         -Replaced all instaces of raw regex that checked for japanese text with var isJapaneseRegex
 1.14.11 -Fixed choice replace cleanup regexes, should work better now
         -Choice replace now can display colors and icons
         -Fixed remove name from textbox during a choice replace if forceNamebox is enabled
 1.14.10 -Add removing names from textbox in choices replace, when using forceNamebox
 1.14.9 -Fix a possible bug when another plugin modified Window_Message.prototype.isEndOfText
 1.14.8 -Changed way text is looked in cached text to a better performance one. Next this cachedTranslation should be changed
         to a map.
        -No longer reading the Json file each time it checks for cache by default
        -Add a button to reload cachedTranslations
        -Check cache function in normal text, no longer uses the clipboard, now it uses lastMemTextSend (Important that Load 
          scene text is not captured or map name [made a function to disable that in clipboardLulle])
 1.14.7 -Removed from text the \! that waits for user input in the middle of text (otherwise text isn't sent completely)
        -Removed from text the \^ that would skip textboxes
 1.14.6 -Added translate mesaggeboxes during battle
        -Added partial removal of names in battle when using forceNamebox (forceNameboxMethod2 for now). Must set
          removeNameFromBattleText to true.
        -Fix a bug with translation cache, don't let it save an empty line.
        -Fix creatining multiple timouts in line 826
        -Fix trying to read cache multiple times per textbox
 1.14.5 -Add ignore DeePL plugin when text is in cache (partial - not working)
 1.14.4 -If game uses MessageWindowPopup plugin, resize the popup window properly
        -Prevent a NaN width in choice replace
        -Updated wordWrap to handle existing linebreaks
 1.14.3 -Some choices replace bug fixes.
 1.14.2 -Try to fix translation of previous textbox showing on next one. Sometimes happens when you advance text
         without wating for translation to be replaced. Only affects autoinsert mode.
 1.14.1 -Add %23 to heart replace as it DeepL not always converts it to #
        -Add option to choose to which heart to restore to
 1.14   -Fix translated choiceboxes with number of choices larger than box, that required scrolling and drawing
         new choices. Now translated choices are replaced to MV own choice arraw.
        -Fix write/read file functions.
 1.13   -Modify/handle text when it's surronded by parentheses or it starts with '...' (corrections for DeepL)
 1.12   -Ditched plugin parameters, replaced for manual configuration variables
        -Added option to store/cache translations on a file
        -Handle hearts ♥ ♡ ❤ in text better (code in clipboard_llule also changed)
        -Add button to auto advance text (for storing scenes to cache to watch them later)
        -Added post translation replacements
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

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_SetClipboardText = 1;
ZERO.SetClipboardText = ZERO.SetClipboardText || {};

var clipboardDisabledBattle = clipboardDisabledBattle || false;

(function ($) {
 /*---------------------------------------------------------------------------------------*/
 /* Manual configuration                                                                  */
 /*---------------------------------------------------------------------------------------*/

 //* Description: Button to press to replace text.
 //* Default: 's'
 $.textButton = 's'; 

 //* Description: Button to copy text of current window to clipboard (useful when Clipboard_llule, 
 // fails to copy it).
 //* Default: 'f'
 $.copyTextButton = 'f';

 //* Description: Button to copy choices to clipboard. Format choices and text and send them for 
 // translation. Not really neccesary with the Auto Replace Choices function. But useful when that 
 // one fails.
 //* Default: 'r'
 $.copyChoicesButton = 'r';

 //* Description: Select type of WordWrap. 
 // YEP: Yanfly MessageCore word wrap. Automatic, preferred.
 // ZERO: Legacy word wrap. Must input max characters manually.
 // If text is longer than textbox lines selected it will overflow and mark it with a '*' at the end
 // press the text replace button (Default 's') to see overflowed text
 //* Default; 'YEP'
 $.wordWrapType = 'YEP';

 //* Description: Number of characters per line in a textbox with a face image. For use in legacy 
 // wordwrap. Ignore if using YEP one
 //* Default: 45
 $.maxWidth = 45;

 //* Description: Number of characters per line in a textbox without a face image. For use in legacy 
 // wordwrap. Ignore if using YEP one
 //* Default: 55 
 $.maxWidthWithoutFace = 55;

 //* Description: Number of lines in game textbox. Important to set, as some games use 3 line windows
 // Recommended to edit game plugin to always display 4 lines if possible
 //* Defualt 4
 $.textboxLines = 4;

 // * Description: Change font size of translated text. Most games use 28, leave at 0 to use game default.
 // * Defualt 0
 $.fontSize = 0;

 // * Description: Decrease the font size when it's a textbox with a face (Only if font size wans't overriden)
 $.decreaseFontFaceWindow = true;
 $.decreaseFontAmountFaceWindow = 3;

 //* Description: Auto insert translated text without manual button press. Recommended to on
 //* Default: true
 $.autoInsert = true;

 //* Description: Toggles auto insert functionality (Best used when skipping text fast. But not 
 // neccesary if skipping text with ctrl button, and clipboard_llule is disables while skipping, 
 // only in modded version). 
 // Will display a message at the top rigth screen.
 //* Default: 9
 $.autoInsertToogleKey = '9';

 //* Description: Auto replace choices with transalted ones. Works 99% of the time. But if it fails, 
 // use the copyChoicesButton, and it will send all choices and text for translation, it will
 // not replace the choices in game, but you will know what they mean.
 //* Default: true
 $.autoReplaceChoices = true;

 //* Description: Toggles replace choices functionality. Will display a message at the top 
 // rigth screen.
 //* Default: h
 $.autoReplaceChoicesToggleKey = 'h';

 //* Description: Ignore text that starts with a specific character/word. Enable/Disable
 // This is useful when some unwanted text is being copied to the clipboard, normally that
 // is not the case.
 //* Default: false
 $.ignoreTextStartWith = false;

 //* Description: Ignore text that starts with following character/string. Previous parameter
 // must be true for this to work.
 //* Default: '「'
 $.ignoreTextStr = '「';

 //* Description: Ignore japanese text via regex
 // Sometimes a pre tranlated text is cought in the script, enable this to ignore it. Most games 
 // work better with this on.
 //* Default: true
 $.ignoreJapText = true;

 //* Description: Add translated text to YEP_Backlog extension (a modified YEP_Backlog must be loaded first).
 //* Default: true
 $.useBacklog = true;

 //* Description: Create a json file and store translations, if a translation is stored it will read 
 // it from the file instead of external soruces. Needs auto instert enabled to store.
 // Manual request for translation will ignore the file (**need to check if this is true**)
 // File is in '%GamePath%/www/translationsCache.json'
 //* Default: true
 $.useTranslationCache = true;

 //* Description: Skip cached text. Upon press of a key, it will keep skipping text until a texbox
 // contains text that was not in the cache, then it will turn of the skip function.
 //* Default: 1
 $.skipCachedTextKey = '1';

 //* Description: Key to start ignoring cache and overwrite the text in it. Ex: If a conversation
 // has bad lines cached. Redo the conversation with cacheOverwrite on, it will
 // stop reading from the cache file and write the new conversation based on new translations.
 //* Default: b
 $.cacheOverwriteKey = 'b';

 //* Description: If the text was already cached, it will copy it to clipboard with special character 
 // at the start, the DeepL plugin has to be modified to ignore text that starts with that special
 // character. WARNING: Not working until script with clipbardIllule is merged or a custom hook
 // is developed, more in line 708.
 //* Default: true
 $.ignoreDeeplIfCachedText = true;
 //* Default: '·'
 $.ignoreDeeplIfCachedTextCharacter = '·';

 //* Description: Auto advance text toggle key. In case you want to cache/store in file the text
 // of a scene before watching it (save-watch-reload).
 // This will advance text once the translation for that window is cached in the file.
 // If a translation doesn't occur and it gets stuck, it will wait 10 seconds and go to
 // the next message
 //* Default: n
 $.autoAdvanceTextKey = 'n';
 // If there is a choice box while auto advancing, select the first choice.
 //* Default: true
 $.autoSelectFirstChoice = true; 
 // Alternatively this function can be used to auto read text so it will wait 
 // x ms (milliseconds) after showing the translation for the next message.
 // If using, it's recommended to set autoSelectFirstChoice to false.
 // If not using it set it to 500.
 //* Default: 500
 $.autoAdvanceTextWait = 500;

 // DeepL doesn't like heart characters, so sent text replaces them with a # (%23 uri character)
 // Then restores them in the text to insert
 // Currently always does it despite variable (TODO)
 $.replaceHeartCaratcters = true
 // Heart character to restore (This works)
 heartCharacter = '\\c[27]❤\\c[0]' // options ♡ ♥ ❤ or with pink color \\c[27]♥\\c[0]

 // This will disable the ! RPG Maker text function, that waits for an input before displaying 
 // the full text of a textbox. Should be disabled otherwise text isn't sent correctly to clipboard
 // disable in case a specific game is giving problems.
 $.disableWaitForButtonInputDuringText = true;

 // his will disable the ^ RPG Maker text function, that outright disables an input before changing
 // to the next textbox. As all native wait functions are disables, without this the textbox will be
 // skipped. Disable it if a specific event is giving problems (or try not to have the textbox
 // in screen for too much time)
 $.disableDontWaitForInputAfterText = true;

 // If using forceNamebox, this needs to be activated to remove names from the battle text
 $.removeNameFromBattleText = true;

 // Load cachedTranslations each time it shows text? Useful if you are making many changes
 // to the json externally. Default false
 $.alwaysLoadCacheTranslations = false;

 // Button to muanually reload cachedTranslations json. Useful if the previous one is false
 // and you make changes to the json sporadically.
 $.reloadCachedTranslationsButton = '2';

 // Replace current text in textbox with JP text converted to romaji, and update stored
 // cache for that text. Useful for sex scenes where there is a lot of gliberish text
 // Must load Kuroshiro and Kuromoshi librearies:
 // Copy: 'kuroshiro.min.js', 'kuroshiro-analyzer-kuromoji.min' and 'dict' folder to js/libs
 // and load them before plugins.js in index.html
 $.replaceToRomaji = true;
 $.replaceToRomajiButton = 'g'; // Default 'g'
 $.replaceToRomajiButton2 = 'm'; // Default 'm'
 // Set path to kuromoshi dictionaries. 
 // If you want them to be in the lib folder alongside the scripts: './js/libs/dict'
 // Or you can use a fixed folder in your system so every game looks for them there
 const kuromoshiDictPath = 'I:/_/dict';

 // Translation Window. Open a new window that displays various translations options and lets you
 // make corrections to the saved cached version
 // Can run the same event as the save button by pressing Control+S
 $.translationWindowKey = '3';
 // Show a textbox with the original text?
 $.showOriginalText = false;
 // Query a translation to DeepL each time you open the translation window
 // Not recommended as the current text should already have a translation
 $.translationWindowSetDeepLOnOpen = false;

 //* Description: Replacements to be made to text after translation. Left if text to be replaced
 // right is replacement. Left accepts regex, be careful, as it is a string and it will
 // need (two) \\ instead of (one) \ . Also don't replace special characteres ex: []
 // Pre translation replacements in clipboard_llule.
 // Useful when a replacement before translation isn't working.
 // Note: script with replace # with a heart symbol.
 const postTranslationReplacements = {
    // DeepL Translation Errors
    'I\'m not sure what to say, but I\'m sure you\'ll understand.': 'Translation Error',
    'I\'m not sure what to say, but I\'ll try.': 'Translation Error',
    'I\'m not sure what to do, but I\'m going to do it.': 'Translation Error',
    'I\'m sure you\'ll be happy to hear that.​': 'Translation Error',
    'I\'m not sure what to make of it.': 'Translation Error',
    'I\'m not sure if this is a good idea or not, but I think it\'s a good idea.': 'Translation Error',
    'In the event that you\'ve got any questions, please do not hesitate to contact us.​': 'Translation Error',
    'I\'m not sure what to do, but I\'m sure you can do it.': 'Translation Error',
    'I\'m sure you\'ve heard of it, but I\'m not sure if you\'ve seen it.': 'Translation Error',
    'I\'m sure you\'ll be able to figure out what\'s going on.': 'Translation Error',
    'I\'m sure you\'ll have a lot of fun with this one.': 'Translation Error',
    'I\'m not sure what to say, but I\'m going to say it.': 'Translation Error',
    // Normal replacements
    '(B|b)lack (F|f)airy': 'Dark Elf',
    '(B|b)lack (E|e)elf': 'Dark Elf',
    '(B|b)lack (F|f)airies': 'Dark Elves',
    'Zzz#': 'Zun#',
    '(B|b)ing#': 'Bikun#',
    '(Q|q)uinn#': 'Kiyun#',
    '(C|c)hup#': 'Chiyupa#',
    'Senior': 'Senpai',
    'senior': 'senpai',
    'nasty': 'lewd',
    'Nasty': 'Lewd',
    'Sunken nipples': 'Inverted nipples',
    'sunken nipples': 'inverted nipples',
    'Pang': 'Pan',
    'pang': 'pan',
    '~': '～',
    'â': '♪',
    'Â': '♪',
    'Virgin membrane': 'Hymen',
    'virgin membrane': 'hymen',
    'Baboon': 'Hihi',
	'Hexenbiest': 'Monster',
	'hexenbiest': 'monster',
	'　': ' ',
 }

 /*--------------------------------------------------------------------------------------*/
 /* End of manual configuration                                                          */
 /*--------------------------------------------------------------------------------------*/

  // Variable used to control the when to show the translated text
  // Also used for comunicating with external plugin (Clipboard_Ilule)
  $.escapeText = true;
  $.replacingChoicesStopIlule = false; // used to stop Llule when replacing choices
  
  // Nwjs
  var gui = require('nw.gui');
  var clipboard = gui.Clipboard.get();

  // Local variables
  // Word Wrapping
  var textOverflowed = false;
  var overflowedText = '';
  var wordWarpLinesCount;
  var overflowedTextState; // Save TextState of overflowed text (with updated index)
  var wordWrap = false;

  var previousClipboardText = clipboard.get('text'); 
  var clipboardText = '';
  var wait = true;
  var timeout;
  var stopDrawingText = false;
  var storedTranslations = readFile('translationsCache') || {};
  var cacheOverwrite = false;
  var autoAdvanceText = false;
  var autoAdvanceTextTimeout;
  var skipCachedText = false;
  var processCache = false;
  var autoSelectChoice = false;
  var skipChoice = false;
  var exitingPause = false;

  // used to know if replace is replacing the correct textbox
  // will increase on each message, and if replace recives a different value
  // of the current counter, it stops
  var messageCounter = 0; 
  var isJapaneseRegex = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/;
  var colorRegex = /(\\|)?c\[(\d{1,2})\]/gi;

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
  $.cacheOverwriteKey = addKeyMapping($.cacheOverwriteKey);
  $.autoAdvanceTextKey = addKeyMapping($.autoAdvanceTextKey);
  $.skipCachedTextKey = addKeyMapping($.skipCachedTextKey);
  $.reloadCachedTranslationsButton = addKeyMapping($.reloadCachedTranslationsButton);
  $.replaceToRomajiButton = addKeyMapping($.replaceToRomajiButton);
  $.replaceToRomajiButton2 = addKeyMapping($.replaceToRomajiButton2);
  $.translationWindowKey = addKeyMapping($.translationWindowKey);

  // Load kuroshiro romaji converter
  if($.replaceToRomaji){
    try{
      var kuroshiroInstance = new Kuroshiro();
      kuroshiroInstance.init(new KuromojiAnalyzer({ dictPath: kuromoshiDictPath }))
      .then(function () { console.log('Kuroshiro initialized') })
    } catch (ex){
      console.log('Kuromoshi initialization failed - ' + ex);
      $.replaceToRomaji = false;
    }
  }

  // Make a backup of stored translations when game loads
  if($.useTranslationCache){
    if(storedTranslations // Check null and undefined
    && Object.keys(storedTranslations).length !== 0 // Check not empty
    && storedTranslations.constructor === Object){
      writeFile('translationsCacheBackup', storedTranslations);
    }
  }

  // Check if a plugin is loaded
  PluginManager.isLoadedPlugin = function (name) {
    return $plugins.some(plugin => plugin.name === name && plugin.status);
  };

  // Alias Window_Base initialize
  // Add variable for storing text of current window, used in sending current 
  // window text to clipboard (for Copy Text to Clipboard button)
  var ZERO_Window_Base_prototype_initialize = Window_Base.prototype.initialize;
  Window_Base.prototype.initialize = function(x, y, width, height) {
    ZERO_Window_Base_prototype_initialize.apply(this, arguments);
    this.__text = '';
  }

  // Delete previous numpad key bindings
	delete Input.keyMapper[98];
	delete Input.keyMapper[100];
	delete Input.keyMapper[102];
	delete Input.keyMapper[104];
  
  // Key Event Listeners
  document.addEventListener('keydown', event => {
    // Add Auto Insert Toogle Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.autoInsertToogleKey) {
      $.autoInsert = !$.autoInsert
      if($.autoInsert) SceneManager.callPopup('Auto Insert Enabled');
      else SceneManager.callPopup('Auto Insert Disabled');
    }

    // Add Auto Replace Choices Toggle Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.autoReplaceChoicesToggleKey ) {
      $.autoReplaceChoices = !$.autoReplaceChoices
      if($.autoReplaceChoices) SceneManager.callPopup('Auto Replace Choices Enabled', 'topRight', 200);
      else SceneManager.callPopup('Auto Replace Choices Disabled', 'topRight', 200);
    }

    // Add Cache Overwrite Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.cacheOverwriteKey ) {
      cacheOverwrite = !cacheOverwrite
      if(cacheOverwrite) SceneManager.callPopup('Cache Overwrite Enabled', 'topRight', 200);
      else SceneManager.callPopup('Cache Overwrite Disabled', 'topRight', 200);
    }

    // Add Auto Advance Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.autoAdvanceTextKey ) {
      autoAdvanceText = !autoAdvanceText
      if(autoAdvanceText) SceneManager.callPopup('Auto Advance Enabled', 'topRight', 200);
      else SceneManager.callPopup('Auto Advance Disabled', 'topRight', 200);
    }

    // Add Auto Advance Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.skipCachedTextKey ) {
      skipCachedText = !skipCachedText
      if(skipCachedText) SceneManager.callPopup('Skip Enabled', 'bottomLeft', 200);
      else SceneManager.callPopup('Skip Disabled', 'bottomLeft', 200);
    }

    // Add Reload CachedTranslations Key event and show popup when pressed
    if (Input.keyMapper[event.keyCode] == $.reloadCachedTranslationsButton ) {
      storedTranslations = readFile('translationsCache');
      SceneManager.callPopup('Cached Translations Reloaded', 'bottomLeft', 200);
    }

    // Restore translation to window after pause (Sets a flag that is called from Window_Message.Update)
    if (event.code == 'KeyP' && $gameMessage.hasText()){
      exitingPause = true;
    }

	/** 
	 * Show text from Ero Status. Simply copy to memory the text of determined variables 
	 * To configure just check what variables are relevant and you want to copy to memory
	 * Variables can be found in erostate config, or search for jp text and see what var 
	 * is being written, should be the first 2 number. Ex: [23,23,0,0 'jp text'] is var 23
	 * 
	 * This was a lazy approach, could be better done in when showing the erostate screen
	 * instead of manually calling it with numpad numbers
	 */
	// Panel 1
	if (event.code == 'NumpadDivide'){
		//let text = $gameVariables.value(19);
		//clipboard.set(text, 'text');
	}
	// Panel 2
	if (event.code == 'Numpad7'){
		//let text = $gameVariables.value(15);
		//text += ' ' + $gameVariables.value(16);
		//clipboard.set(text, 'text');
	}
	// Panel 3
	if (event.code == 'Numpad4'){
		// let text = 'Bound Partner: ' + $gameVariables.value(4) + '.';
		// text += $gameVariables.value(17);
		// text += ' ' + $gameVariables.value(18);
		// clipboard.set(text, 'text');
	}
	// Panel 4
	if (event.code == 'NumpadMultiply'){
		// let text = $gameVariables.value(39);
		// clipboard.set(text, 'text');
	}
	// Panel 5
	if (event.code == 'Numpad8'){
		// let text = $gameVariables.value(35);
		// text += ' ' + $gameVariables.value(36);
		// clipboard.set(text, 'text');
	}
	// Panel 6
	if (event.code == 'Numpad5'){
		// let text = 'Bound Partner: ' + $gameVariables.value(24) + '.';
		// text += $gameVariables.value(37);
		// text += ' ' + $gameVariables.value(38);
		// clipboard.set(text, 'text');
	}

	/**
	 * Change bgm volume midgame
     */ 
	// Up volume
	if (event.code == 'Numpad9'){
		let offset = 5;
		let value = ConfigManager['bgmVolume'];
		value += offset;
		value = value.clamp(0,100);
		ConfigManager['bgmVolume'] = value;
	}
	// down volume
	if (event.code == 'Numpad6'){
		let offset = 5;
		let value = ConfigManager['bgmVolume'];
		value -= offset;
		value = value.clamp(0,100);
		ConfigManager['bgmVolume'] = value;
	}
  })

  // Pause clipboard 

  // Replace DTextPicture script hearts with normal hearts (first used in RJ348097)
  var ZERO_Window_Base_prototype_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\I\[90\]/g, '♥');
    return ZERO_Window_Base_prototype_convertEscapeCharacters.call(this, text);
  };
  
  // Alias Window_Message startMessage
  // Prepare for next text
  var ZERO_Window_Message_prototype_startMessage = Window_Message.prototype.startMessage
  Window_Message.prototype.startMessage = function() {
	  // Reset variables for translation flow
    if($.useTranslationCache) processCache = true;
    textOverflowed = false;
    $.escapeText = true;
    $.replacingChoicesStopIlule = false;
    stopDrawingText = false;
	  jpTextSentToMem = false;

    if(clipboardDisabledBattle){ // ClipboardIllule disabled during battle, send text manually
      let text = this.convertEscapeCharacters($gameMessage.allText());
      if(text !== '' && isJapaneseRegex.test(text)){  // Check that text is in JP
        text = Window_Base.prototype.convertEscapeCharacters(text);          // Convert variables to text
        text = text.replace(/(\r\n|\n|\r)/gm,' ');                           // Remove line breaks
        text = text.replace(/(c|C)\[\d{1,3}\]/g, '');                        // Remove color codes alt /(\\|\/)(c|C)\[\d{1,3}\]/g
        text = text.replace(/{|}/g, '');                                     // Remove {}
        text = text.replace(String.fromCharCode(27), '');                    // Remove arrow character
        text = replaceHeartCharacter(text);                                  // Replace heart characters

        // For removing names (when using forceNames in hide message window) (for now this is only doing "forceNameboxMethod2"
        // need to program for the other modes)
        // Once the plugins are merged, this can be determined by the variable of forceMethod used (I mean, I could still go and find it
        // with $, but I'm lazy now)
        if($.removeNameFromBattleText){
          if(text.includes('「') || text.includes(':') || text.includes('：')){
            let savedNames = readFile('savedNames') || {};
            for (const [key, value] of Object.entries(savedNames)) {
              if(text.startsWith(key)){
                let index = text.indexOf('「');
                if (index == -1) index = text.indexOf(':');
                if (index == -1) index = text.indexOf('：');
                text = text.substring(index+1);
                break;
              }
            }
          }
        }

        // Replace names with honorifics first (Uses dictionary from ClipboardLulle)
        for (const [key, value] of Object.entries(nameReplacementsWitHonorifics)) {
          let re = new RegExp(key,"g"); // Create regex with variable
          text = text.replace(re, value); // Use regular expresion to replace all values and not the first one only
        }

        // Replace words (for names, etc) (Uses dictionary from ClipboardLulle)
        for (const [key, value] of Object.entries(replacements)) {
          let re = new RegExp(key,"g"); // Create regex with variable
          text = text.replace(re, value); // Use regular expresion to replace all values and not the first one only
        }

        text = text.replace(//g,'');
        clipboard.set(text, 'text');
        LastMemTextSend = text; // This var is normally filled by ClipboardLulle, but it's used when storing translation cache, as we are overriding/not-using clipboardLulle, we need to set it with jp text
        jpTextSentToMem = true;
      }
    }

    messageCounter++;
    
    // prevent from setting wait to false if next in game message was shown before
    // translation appeared (changing text too fast causes this)
    if(timeout != null) {
      clearTimeout(timeout); 
      timeout = null;
    }

    // In case the translation is stuck when auto advancing text for cache, force the next 
    // message in 10 seconds
    if(autoAdvanceText){
      autoAdvanceTextTimeout = setTimeout(() => {
        this.pause = false;
        this.terminateMessage();
      }, 10000);
    }

    wait = true;

    ZERO_Window_Message_prototype_startMessage.call(this);
    
    // Remove 'Wait for user input' in the middle of text (Otherwise text is not completly sent to clipboard)
    this._textState.text = this._textState.text.replace(/!/g, '');
    this._textState.text = this._textState.text.replace(/\^/g, '');
  }

  /* ----------------------------------------------------------------------------------
  /*  Start Choices Replace  /
  /------------------------*/

  var startChoiceReplaceNormal = false;
  // Variable created so the startChoiceReplaceNormal doesn't run multiple times as it is in an update
  // method, and can't use the var 'startChoiceReplaceNormal' as it is used later on other parts (bad design)
  var startChoiceReplaceNormalLocal = false;
  var startChoiceReplaceStored = false;
  var choiceProcessing = false;
  var translatedChoices = [];
  var windowTextWithChoices = false;
  var translatedWindowText = '';
  var globalChoicesText= '';

  // Access Window_ChoiceList methods from Widnows_Selectable
  Window_Selectable.prototype.updatePlacement = function() {
  }

  // If no YEP_Core
  if(typeof Window_Base.prototype.textWidthEx !== 'function'){
    Window_Base.prototype.textWidthEx = function(text) {
      return this.drawTextEx(text, 0, this.contents.height);
    };
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
    $.escapeText = false; // prevent capture text from clipboard_llule
      
    // Send choices to clipboard
    let text = '';
    $gameMessage.choices().forEach(function(choice, index) {
      choice = Window_Base.prototype.convertEscapeCharacters(choice);
      text += '['+ choice + '].'; // DeepL understands '.' as a sentence break
    });  

    // Remove japanese brackets (may break non japanese brackes to later split)
    text = text.replace(/【/g, '<');
    text = text.replace(/】/g, '>');

    // Use choices in other functions (when calling for manual translation with a key)
    globalChoicesText = text;

    // If there is a window message send it together with choices as last item
    // so that there is no need to send two translation requests
    if($gameMessage._texts.length){
      text += Window_Base.prototype.convertEscapeCharacters($gameMessage._texts.join(' '));
      text = text.replace(/(c|C)\[\d{1,3}\]/g, ''); // Remove color codes
      // If there is a namebox remove it
      if(/(N|n)</.test(text)){
        let left = text.substring(0, text.search(/(N|n)</));
        let right = text.substring(text.indexOf('>')+1);
        text = left + right;
      }
    }else{
      text = text.slice(0, -1); // delete last '.'
    }

    text = replaceHeartCharacter(text);

    previousClipboardText = text;

    // Check cache file for stored translations
    if($.useTranslationCache && !cacheOverwrite){
      if($.alwaysLoadCacheTranslations) storedTranslations = readFile('translationsCache');
      
      if(storedTranslations[text] !== undefined){ // Translation exists
        // Add special character so DeepL plugin ignores text
        if($.ignoreDeeplIfCachedText) text = $.ignoreDeeplIfCachedTextCharacter + text;

        // Copy text to clipboard
        clipboard.set(text, 'text');

        startChoiceReplaceStored = true
      } else {
        // Copy text to clipboard
        clipboard.set(text, 'text');

        startChoiceReplaceNormal = true; 
		    startChoiceReplaceNormalLocal = true; 
      }
    }
  }

  // Alias
  // Replace choices text, and update new choice window size
  var ZERO_Window_Selectable_prototype_update = Window_Selectable.prototype.update;
  Window_Selectable.prototype.update = function() {
    if (startChoiceReplaceStored) this.replaceChoices(storedTranslations[previousClipboardText]);

    if (startChoiceReplaceNormal && startChoiceReplaceNormalLocal) {
      clipboardText = clipboard.get('text'); 
      
      // Enter only when clipboard changes and it's a translated text 
      if (!isJapaneseRegex.test(clipboardText)
      && clipboardText.includes('[') // Translated text should have a separator
      && previousClipboardText.localeCompare(clipboardText)
      && clipboardText.localeCompare('') != 0){
		startChoiceReplaceNormalLocal = false; // Stop entering previous block (as it is an update function)
        // Post-translation replacements
        for (const [key, value] of Object.entries(postTranslationReplacements)) {
          let re = new RegExp(key,'g'); // Create regex with variable
          clipboardText = clipboardText.replace(re, value); // Use regular expresion to replace all values and not the first one only
        }
        // Remove "" if there wasn't 『|』on text
        if(!/『|』/.test($gameMessage.allText())) clipboardText = clipboardText.replace(/"|''/g, '');

        // Restore heart characters (must escape code manually)
        clipboardText = clipboardText.replace(/#/g, 'c{27}♥c{0}'); 
        clipboardText = clipboardText.replace(/%23/g, 'c{27}♥c{0}');

        // Store translation in cache
        if ($.useTranslationCache){
          if(!(previousClipboardText == '' || previousClipboardText == ' ' || clipboardText == '' || clipboardText == '')){ // Don't store if empty
            storedTranslations[previousClipboardText] = clipboardText;
            writeFile('translationsCache', storedTranslations);
            setTimeout(() => { // Needs a wait when storing to cache, reason unknown
              this.replaceChoices(clipboardText);
            }, 100);
          }
        }else this.replaceChoices(clipboardText);
      }
    }
    
    ZERO_Window_Selectable_prototype_update.call(this);
  };

  Window_Selectable.prototype.replaceChoices = function(text){
    text = text.replace(/\] *\. *\.* *\[?/g, '].['); // Make variations of '] . [' to '].['
    text = text.replace(/\[ /g, ''); // Make variations of '] . [' to '].['
    text = text.replace(/(\[|\])\1+/g, '$1') // Remove repetitions of [ or ]
    text = text.replace(/\] *\[/g, '].['); // If separation came without dot add it
	text = text.replace(/(?<!\.{2,3})\.\] \.?/g, '].'); // There's a . inside a choice at the end, put it ouside (Ignore is choice has ...)

    // Replace [] in icons and color codes to {} (otherwise they get in the way of the split of choices)
    text = text.replace(/(\\|)?(i|I|c|C)\[(\d{1,2})\]/g, '$2{$3}');

    translatedChoices = text.split('].');
    let maxWidth = '123';

    // If there was a window message, separate transalted text from translated choices
    if($gameMessage._texts.length){
      // Sanity check, recieved translations should be greater than choices to be replaced
      if(translatedChoices.length > $gameMessage.choices().length){
        let winTextArray = translatedChoices.splice($gameMessage.choices().length);
        translatedWindowText = winTextArray.join(''); // Save text in global var to be used in windows_message.update
        translatedWindowText = translatedWindowText.replace(/\[? ?\[?/, '') // Remove first space and '['

        //Remove name from text. If using force namebox removing the block that has the name is handled
        //by clipboardlulle block ignore. That won't trigger here, so we need to remove it here.
        //this code is mostly the same as in ClipboardLulle
        let savedNames = readFile('savedNames'); // If there is no file or it's empty, the next for will be skipped

        for(const key in savedNames){
          let name = savedNames[key];
          name = name.replace(/\\(c|C)\[\d{1,2}\]/g, '') // Remove color codes
          if(name.includes('$1')) name = name.replace(' $1', '.{0,3}'); // Remove regex for multi names
          else name = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Esacpe special characters for regex (if there is a [ for example use it as text not as regex special character)

          let re = new RegExp('^' + name + '$', 'i');
          if(re.test(name)){
            re = new RegExp(name + '\\.?(-| |:|：)*', 'i');
            translatedWindowText = translatedWindowText.replace(re, '');
          }
        }
        // -End- remove name from text

        // Would like to do this before storing into cache, but too much trouble
        translatedWindowText = processTextStartsWithDots(translatedWindowText);
        translatedWindowText = processTextBetweenParentheses(translatedWindowText); 

        translatedChoices = translatedChoices.splice(0, $gameMessage.choices().length);
      }
    }


    // Get choice with max lenght and remove []
    for (let i = 0; i < translatedChoices.length; i++) {
      translatedChoices[i] = translatedChoices[i].replace(/\[? ?\[/, ''); // remove '['
      translatedChoices[i] = translatedChoices[i].replace(']', ''); // remove ']'
      translatedChoices[i] = translatedChoices[i].charAt(0).toUpperCase() + translatedChoices[i].slice(1); // Capitilize first letter

      // remove special characters that make choice length more than it is
      let choice = translatedChoices[i].replace(/(i|I)\{(\d{1,2})\}/g, 'aa'); // Two characters for icons
      choice = choice.replace(/(c|C)\{(\d{1,2})\}/g, ''); // Remove color codes
      if(choice.length > maxWidth.length) maxWidth = choice; // get choice with max lenght
    }

    // Resize choice window with choice with max lenght or max game window size
	if($.wordWrapType == 'YEP'){
		var wordWrapState = wordWrap;
		wordWrap = false;
	}
    let width = Math.min(this.textWidthEx(maxWidth) + this.padding * 3 , Graphics.boxWidth);
	if($.wordWrapType == 'YEP') wordWrap = wordWrapState;
    if(isNaN(width)){
      let bitmap = new Bitmap();
      width = bitmap.measureTextWidth(maxWidth);
    }
    if(width < 132) width = 132;
    this.updatePlacement(true, width);

    // Replace choices with translated ones (no direct assignment in case traslation wrongly gives fewer choices)
    for (let i = 0; i < $gameMessage.choices().length; i++) {
      // Restore escaped
      translatedChoices[i] = translatedChoices[i].replace(/(i|I|c|C){(\d{1,2})}/g, '$1[$2]');
      // Remove endping .
      translatedChoices[i] = translatedChoices[i].replace(/\.$/g, '');

      if(translatedChoices[i]) $gameMessage.choices()[i] = translatedChoices[i];
    }

    // Clear and draw new (translated) items
    this.refresh();
    // Redraw cursor in case choicebox is bigger
    this.ensureCursorVisible();
    this.updateCursor(); 

    // If there is a text window replace that text after replacing choices
    //if($gameMessage._texts.length){ // This was generating an error when sometimes it detected text in $gameMessage._texts when there was none, probably from another plugin or another window, like names or gold
	if(translatedWindowText !== ''){
      // If window_message.prototype.update is disabled or gives problems 
      // an alternate method of showing the message can be trying to push (MV function) new text window

      // This will trigger code in Window_Message update, translated text is in global var translatedWindowText
	  // Don't know why but it textReplace triggers first, choices won't be replaced, so we add a wait
	  setTimeout(() => {
        windowTextWithChoices = true;
      	if($.wordWrapType == 'ZERO') textOverflowed = false;
      }, 300);
    }
    
    startChoiceReplaceNormal = false; // end choice script
    startChoiceReplaceStored = false; // end choice script
    translatedChoices = []; // empty array

    // If auto advancing text, and skip choices is selected, auto select first choice
    // Modifing whice choice is selected is possible in the next lines, but not implemented
    if(autoAdvanceText && $.autoSelectFirstChoice){
      setTimeout(() => {
        this.callOkHandler();
      }, 500);
    }
  }

  // Reset variables once a choice is selected, normally done automaticlly, but if choice
  // is selected before translation or proceced it will break
  var ZERO_Window_Selectable_processOk = Window_Selectable.prototype.processOk;
  Window_Selectable.prototype.processOk = function() {
    ZERO_Window_Selectable_processOk.call(this);
    startChoiceReplaceNormal = false;
    startChoiceReplaceStored = false;
  };

  var ZERO_Window_Selectable_processCancel = Window_Selectable.prototype.processCancel;
  Window_Selectable.prototype.processCancel = function() {
    ZERO_Window_Selectable_processCancel.call(this);
    startChoiceReplaceNormal = false;
    startChoiceReplaceStored = false;
  };
  // ***** End Choices Replace ***** //

  /* ----------------------------------------------------------------------------------
  /*  Start Translation Window  /
  /---------------------------*/

  var translationWindow;
  var gameWindow = nw.Window.get();
  var JPTextInTranslationWindow = '';
  var intervalTranslationWindow;
  var replaceTextTranslationWindow = false;
  var textToReplaceTranslationWindow = '';
  var stopCustomInterval = false;

  var ZERO_WindowMessage_updateTranslationWindow = Window_Message.prototype.update;
  Window_Message.prototype.update = function () {
    if (Input.isTriggered($.translationWindowKey) && this.isOpen()){
        if(!translationWindow){
            createTranslationWindow();
        } else {
            translationWindow.show();
            translationWindow.focus();
            populateTranslationWindow();
        }
    }
    if(replaceTextTranslationWindow){
      replaceTextTranslationWindow = false;
      this.replaceText(textToReplaceTranslationWindow);
    }
    return ZERO_WindowMessage_updateTranslationWindow.call(this);
  }

  function createTranslationWindow(){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';
    nw.Window.open(absolutePath + '\\js\\plugins\\translation.html', {}, function(newWindow) {
        //console.log('Translation window created');
        translationWindow = newWindow; // Make it accesible ouside callback
        translationWindow.title = 'Translation Window';

        // Prevent user from closing the translation window, closing it will instead hide it
        translationWindow.on('close', function () {
            translationWindow.hide();
            gameWindow.focus();
        });        

        // Force close the translation (bypass close event) when main game window is closed
        gameWindow.on('close', function () {
            translationWindow.close(true);
            this.close(true);
        });

        // Add events to buttons and populate for the frist time
        translationWindow.window.onload = () => {
            //console.log('loaded');
            translationWindow.window.document.querySelector('#buttonSave').addEventListener('click', translationWindowSave);
            translationWindow.window.document.querySelector('#buttonDiscard').addEventListener('click', translationWindowDiscard);
            translationWindow.window.document.querySelector('#buttonGetDeepL').addEventListener('click', getTranslationWindowDeepLTranslation);
            translationWindow.window.document.querySelector('#buttonSetDeepL').addEventListener('click', setDeepLInCurrent);
            translationWindow.window.document.querySelector('#buttonRomaji').addEventListener('click', setRomajiInCurrent);
            translationWindow.window.document.querySelector('#buttonHerShe').addEventListener('click', convertToSheHer);

            populateTranslationWindow();

            // Set window dimensions
            translationWindow.width = 800;
            translationWindow.height = 450; // For some reason on full screen this is set to 384

            // Hide Fields
            if(!$.showOriginalText){
              translationWindow.window.document.querySelector('#origTextLabel').style.display = 'none';
              translationWindow.window.document.querySelector('#origText').style.display = 'none';
              translationWindow.height -= 45; // On fullscreen sizes are smaller don't know why, windowed it should be 140
            }

            // Add event to save with control+s
            translationWindow.window.document.addEventListener('keydown', event => {
              if(event.ctrlKey && event.code == 'KeyS' || event.ctrlKey && event.code == 'Enter') translationWindowSave();
            });
        };
    });
  }

  function populateTranslationWindow(){
    //console.log('Populate translation window');
    JPTextInTranslationWindow = LastMemTextSend;
    if($.showOriginalText) translationWindow.window.document.querySelector('#origText').value = $gameMessage._texts.join(' ');
    kuroshiroInstance.convert(JPTextInTranslationWindow, {to: "romaji", mode: "spaced"})
        .then(text => {
          text = postProcessRomaji(text);
          translationWindow.window.document.querySelector('#romaji').value = text;
        });
    translationWindow.window.document.querySelector('#current').value = storedTranslations[JPTextInTranslationWindow];
    // Clear current text if there is no translation
    if(translationWindow.window.document.querySelector('#current').value == 'undefined')
      translationWindow.window.document.querySelector('#current').value = '';
    // Clear deepL beacuse fill it's on demand with the get button (unless option to set it by default is enabled)
    if($.translationWindowSetDeepLOnOpen) getTranslationWindowDeepLTranslation();
    else translationWindow.window.document.querySelector('#deepL').value = '';
  }

  function translationWindowSave(){
    //console.log('Saved');
    let text = translationWindow.window.document.querySelector('#current').value;
    // Modify savedCache
    storedTranslations[JPTextInTranslationWindow] = text;
    writeFile('translationsCache', storedTranslations);

    // Send to textbox (trigger flag in Window_Message update)
    textOverflowed = false; // Reset overflow (YEP)
    textToReplaceTranslationWindow = text;
    replaceTextTranslationWindow = true;

    //clearInterval(intervalTranslationWindow);
    stopCustomInterval = true;
    translationWindow.hide();
    gameWindow.focus();
  }

  function translationWindowDiscard(){
    //console.log('Discarded');
    //clearInterval(intervalTranslationWindow);
    stopCustomInterval = true;
    translationWindow.hide();
    gameWindow.focus();
  }

  function getTranslationWindowDeepLTranslation(){
    clipboard.set(JPTextInTranslationWindow+'.' , 'text');
    stopCustomInterval = false;
    customInterval(500);
    
    // SetTimeOut and SetInterval are broken when called from another window in this version of nwjs
    // intervalTranslationWindow = setInterval(function() {
    //   console.log('running interval');
    //   if(clipboard.get('text') !== JPTextInTranslationWindow+'.'){
    //     clearInterval(intervalTranslationWindow);
    //     translationWindow.window.document.querySelector('#deepL').value = clipboard.get('text');
    //   }
    // }, 500);
  }

  function customInterval(time){
    myTimer(()=>{
      if(clipboard.get('text') !== JPTextInTranslationWindow+'.'){
        translationWindow.window.document.querySelector('#deepL').value = clipboard.get('text');
      } else if (stopCustomInterval){
        return
      } else {
        customInterval(time);
      }
    }, time);
  }

  // Custom timeout using Web Audio API and the AudioScheduledSourceNode, 
  // which makes great use of the high precision Audio Context's own clock
  // taken from https://stackoverflow.com/questions/50501356/how-to-create-your-own-settimeout-function
  function myTimer(cb, ms) {
    if(!myTimer.ctx) myTimer.ctx = new (window.AudioContext || window.webkitAudioContext)();
    var ctx = myTimer.ctx;
    var silence = ctx.createGain();
    silence.gain.value = 0;
    var note = ctx.createOscillator();
    note.connect(silence);
    silence.connect(ctx.destination);
    note.onended = function() { cb() };
    note.start(0);
    note.stop(ctx.currentTime + (ms / 1000));
  }

  function setDeepLInCurrent(){
    translationWindow.window.document.querySelector('#current').value = translationWindow.window.document.querySelector('#deepL').value;
  }

  function setRomajiInCurrent(){
    translationWindow.window.document.querySelector('#current').value = translationWindow.window.document.querySelector('#romaji').value;
  }

  function convertToSheHer(){
    let text = translationWindow.window.document.querySelector('#current').value;
    text = text.replace(/\bhe\b/g, 'she');
    text = text.replace(/\bHe\b/g, 'She');
    text = text.replace(/\bhis\b/g, 'her');
    text = text.replace(/\bHis\b/g, 'Her');
    translationWindow.window.document.querySelector('#current').value = text;
  }

  /* End Translation Window */
  /* ----------------------------------------------------------------------------------*/


  // Promise for romaji converting
  //var kuroshiro = new Kuroshiro(); // Giving problmens if they both are not redefined each time (now loading dics each time, time consuming)
  //var kuromojiAnalyser = new KuromojiAnalyzer({ dictPath: "./js/libs/dict" });
  // function ToRomaji(str) {
  //   var kuroshiro = new Kuroshiro();
  //   //return kuroshiro.init(new KuromojiAnalyzer({ dictPath: "./js/libs/dict" }))
  //   return kuroshiro.init(new KuromojiAnalyzer({ dictPath: "I:/_/dict" })) // Make it a fixed path
  //       .then(() => {
  //           return kuroshiro.convert(str, { to: "romaji", mode: "spaced" });
  //       })
  // }

  function postProcessRomaji(text){
    text = processTextBetweenParentheses(text);
    // Replacements
    text = text.replace(/　/g,' ');                       // Replace JP spaces with normal ones (mainly for wordwrap)
    text = text.replace(/tsu((?![a-z])|(?=tsu))/gi, '~'); // っ , will fuck up some works, but this functions is to be used on sex lines monstly so it's fine (Tried to fix it with negative lookahead)
    text = text.replace(/ ~/gi, '~');
    text = text.replace(/゛/gi, '~');					            // Could cause conflicts, check
    text = text.replace(/ ?… ?/g, '...');                 // Fix spaces
    text = text.replace(/ ?\./g, '.');
    text = text.replace(/ , /g, ', ');
    text = text.replace(/ !/g, '!');
    text = text.replace(/ \?/g, '?');
    text = text.replace(/ - /g, '-');
    text = text.replace(/\% ?23/g, '#');                  // Heart character
    text = text.replace(/ā/g, 'aa');                      // Long vowels
    text = text.replace(/ī/g, 'ii');
    text = text.replace(/ū/g, 'uu');
    text = text.replace(/ē/g, 'ei');
    text = text.replace(/ō/g, 'ou');
    text = text.replace(/ ?" ?/g, '"');                   // Remove spaces around "
                
    // Fix lone characters 'mate e' -> 'matee'; 'e etto' -> 'eetto'
    text = text.replace(/([a-z]) (?<![a-z])([a-z])(?![a-z])/g, '$1$2');
    text = text.replace(/(?<![a-z])([a-z])(?![a-z]) ([a-z]~?)/g, '$1$2');

    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    text = text.replace(/ +/g,' ');                       // Remove duplicate spaces
    text = text.trim();

    // Remove " from start and end if there are any
    text = text.replace(/^"(.*)"$/g, '$1');

    return text;
  }

  // Alias Window_Message updateInput
  var ZERO_WindowMessage_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function () {

    // Manual copy choices to clipboard (if there are any)
    if (Input.isTriggered($.copyChoicesButton) && $gameMessage.isChoice()) {
      let choices = $gameMessage._choices;
      if(choices.length > 0){
        let text = '';
        
        // If using auto replace choices, they were already processed and replaced, 
        // so get the untranslated ones from a global var
        if($.autoReplaceChoices){
          text = globalChoicesText;
        } else {
          choices.forEach(function(choice, index) {
            //choice = text = text.replace(/(\\|\/)(c|C)\[\d{1,3}\]/g, '');  
            choice = Window_Base.prototype.convertEscapeCharacters(choice);
            text += (index+1) + '[' + choice + ']. '; // DeepL understands '.' as a sentence break
          });
        }

        clipboard.set(text, 'text');
        if($.wordWrapType == 'ZERO') textOverflowed = false; // Discard rest of text if it was overflowed
        $.escapeText = true; // trigger/allow replaceText
      }
    }

    // If there was a text window with the choices this code will be triggered after processing choices
    if (windowTextWithChoices){
      this.replaceText(translatedWindowText);
	  translatedWindowText = ''; // Reset var
      windowTextWithChoices = false; // reset var
    }

    if(this.isOpen() && !startChoiceReplaceNormal && !startChoiceReplaceStored){ // Check if message window is opened
      // Copy (current window) Text to Clipboard Button function
      // Most of this function can be replaced with $gameMessage._texts if necessary ()
      if ((Input.isTriggered($.copyTextButton)) && this.isOpen()) {
        let text = this.__text;
        // let text = this.convertEscapeCharacters($gameMessage.allText());  // alternate way to get text
        text = Window_Base.prototype.convertEscapeCharacters(text);          // Convert variables to text
        text = text.replace(/(\r\n|\n|\r)/gm,' ');                           // Remove line breaks
        text = text.replace(/(c|C)\[\d{1,3}\]/g, '');                        // Remove color codes alt /(\\|\/)(c|C)\[\d{1,3}\]/g
        text = text.replace(/{|}/g, '');                                     // Remove {}
        text = text.replace(String.fromCharCode(27), '');                    // Remove arrow character
        text = String.fromCharCode(12300) + text;                            // Add Block separator left
        text = text + String.fromCharCode(12301);                            // Add Block separator right
        text = replaceHeartCharacter(text);                                  // Replace heart characters
        clipboard.set(text, 'text');
        if($.wordWrapType == 'ZERO') textOverflowed = false; // Discard rest of text if it was overflowed
        $.escapeText = true; // trigger/allow replaceText
		    jpTextSentToMem = true; // Allow replaceText
        //console.log('send text: ' + text);
      }
      
      // Show romaji on current window and replace stored cache
      if ((Input.isTriggered($.replaceToRomajiButton) || Input.isTriggered($.replaceToRomajiButton2)) && this.isOpen() && $.replaceToRomaji) {
        let currentText = LastMemTextSend;
        if(isJapaneseRegex.test(currentText)){ // put this regex in a constant (put constant in all other places where it was called)
          //ToRomaji(currentText)
          kuroshiroInstance.convert(currentText, {to: "romaji", mode: "spaced"})
          .then(text => {
            //console.log(LastMemTextSend);
            //console.log(text);
            // Replacements
            text = postProcessRomaji(text);

            // Modify savedCache
            storedTranslations[currentText] = text;
            writeFile('translationsCache', storedTranslations);

            // Send to textbox
			      textOverflowed = false; // Reset overflow (YEP)
            this.replaceText(text);
          });
        }
      }

      // Check the translation cache
      // If the text is cached, display it, without waiting for deepl
      if(this.isOpen() && jpTextSentToMem && !cacheOverwrite && processCache){ // Check if message window is opened
        // Once clipboardIllule script is merged and or a custom text hook is made add here
        // a check to add the special character to ignore text in the DeepL plugin
        // need to check if the text is cached before copying it to clipboard
        // can't be done now, as this is getting the text already from the clipboard

        processCache = false; // This is here so this block is processed once per textbox
		    $.escapeText = false; // Stop trying to translate text (while it's searching for cache)
        clipboardText = clipboard.get('text'); // Gets clipbard_llule jp text, not the translated one
        //textCached = clipboardText; // store it for romaji
        if($.alwaysLoadCacheTranslations) storedTranslations = readFile('translationsCache');

        //if(storedTranslations[clipboardText] !== undefined){ // check now done in ClipboardLlule, if you want to sill make it here, change clipboardText to clipboardText.replace(/·/g,'')
        if(cacheFound){ // If translation found
          // If skipping text
          if(skipCachedText){ 
            if(typeof autoAdvanceTextTimeout !== 'undefined') clearTimeout(autoAdvanceTextTimeout); 
            setTimeout(() => { // timeout, give time for llule to copy next text window
              this.pause = false; 
              this.terminateMessage();
            }, 400);
          } else {
            // Text in cache found, display it
            this.replaceText(storedTranslations[clipboardText.replace(/·/g,'')], messageCounter);
          }
        } else if (skipCachedText) { // text in cache not found and skipping cached text enabled. Stop skipping
          SceneManager.callPopup('Skip Disabled', 'bottomLeft', 200);
          skipCachedText = false;
		      $.escapeText = true; // Enable trying to display translated text
        } else $.escapeText = true; // Enable trying to display translated text 
        }

      if (this.isOpen() && $.autoInsert && $.escapeText && jpTextSentToMem){
        // Get text from clipboard, this must be here otherwise replaceText function may pick up other text when it runs
        clipboardText = clipboard.get('text'); 

        //console.log('previous: ' + previousClipboardText);
        //console.log('clipboard: ' + clipboardText);
        //console.log('compare previous 2: ' + previousClipboardText.localeCompare(clipboardText));
        //console.log('compare to space: ' + clipboardText.localeCompare(''));
        //console.log('wait: ' + wait);
        
        if (!isJapaneseRegex.test(clipboardText) // Enter only on translated text
        && previousClipboardText.localeCompare(clipboardText) // Compare that previous clipboard text is different
        && clipboardText.localeCompare('') != 0){ // Check if text is empty
            // Post translation replacements
            for (const [key, value] of Object.entries(postTranslationReplacements)) {
              let re = new RegExp(key,"g"); // Create regex with variable
              clipboardText = clipboardText.replace(re, value); // Use regular expresion to replace all values and not the first one only
            }
            // Remove "" if there wasn't 『|』on text
            if(!/『|』/.test($gameMessage.allText())) clipboardText = clipboardText.replace(/"|''/g, '');

            clipboardText = processTextStartsWithDots(clipboardText);
            clipboardText = processTextBetweenParentheses(clipboardText);

            //check that the clipboard is a translated text
            if($.useTranslationCache 
            && typeof(LastMemTextSend) != "undefined"  
            /*&& !isJapaneseRegex.test(clipboardText)*/){
              if(storedTranslations[LastMemTextSend] === undefined){ // string not found on cache, save it
                if(!(LastMemTextSend == '' || LastMemTextSend == ' ' || clipboardText == '' || clipboardText == '')){ // Don't store if empty
                  storedTranslations[LastMemTextSend] = clipboardText;
                  writeFile('translationsCache', storedTranslations);
                }
              }
            }

            if ($.ignoreTextStartWith){
              if (!clipboardText.startsWith($.ignoreTextStr)) this.replaceText(clipboardText, messageCounter);
            }else if($.ignoreJapText){
              if (clipboardText.search(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/u) == -1) this.replaceText(clipboardText, messageCounter); // don't know why I'm doing /u (unicode) and checkin on -1, may be that this was done before I knew how to handle this regex, for now leaving as is without using var isJapaneseRegex
            }else{
              this.replaceText(clipboardText, messageCounter);
            }
          }
        }

      // Call function manually with button, or use it when text is overflowed
      if ((Input.isTriggered($.textButton)) && this.isOpen()) {
        clipboardText = LastMemTextSend || clipboard.get('text'); // Get text from clipboard
        
        if(!textOverflowed){
          clipboardText = processTextStartsWithDots(clipboardText);
          clipboardText = processTextBetweenParentheses(clipboardText);
        }

        this.replaceText(clipboardText);
      }

      if(exitingPause){
        exitingPause = false;
        this.replaceText(storedTranslations[LastMemTextSend]);
      }
    }

    return ZERO_WindowMessage_update.call(this);
  };

  // New method
  // Get tranlated text, wordwrap it and insert it in current textbox
  Window_Message.prototype.replaceText = function (text, localMessageCounter = false){
    wait = true;
    $.escapeText = false; // Prevent this function from being called until its done

    // Stop function if trying to replace next textbox (not the textbox from where this 
    // function was called), only autoinsert function sets the localMessageCounter var
    if(localMessageCounter){ // Only enter when localMessageCounter variable is set
      if(localMessageCounter !== messageCounter){
        // Wait a little before entering again
        setTimeout(() => {
          $.escapeText = true
        }, 300);
        return;
      }
    }
        
  stopDrawingText = true;

	// Restore icons (would like to do this before it is being sent here
	//  so it's stored in cache but can't put it choice replace, look into it) 
	if(text.includes('i[') && text[text.indexOf('i[')-1] !== '\\')
		text = text.replace(/i\[/g, '\\i[')

	// Restore heart to text
	if(hasHeartCharacter && (!text.includes('#') && !text.includes('%23') && !text.includes('♡') && !text.includes('♥') && !text.includes('❤'))){
		text = text + heartCharacter; 
	} else {
		text = text.replace(/#/g, heartCharacter);
		text = text.replace(/%23/g, heartCharacter);
	}
	
	// Restore music note to text
	if(hasMusicNoteCharacter && (!text.includes('@') && !text.includes('♪'))){
		text = text + '♪'; 
	} else {
		text = text.replace(/@/g, '♪');
	}	
    
	// Word Wrap Selection
	if($.wordWrapType == 'YEP'){
		wordWrap = true;
		wordWarpLinesCount = 0;
		text = this.processLongWords(text);
	} 
	// ZERO Legacy Wrapper
	else { 
		// Get text from clipboard or if text overflowed rest of the text
		if (textOverflowed) text = overflowedText;
		else previousClipboardText = text;

		//console.log('Before wordwrap: ' + text);
		let wordWrapWidth = $.maxWidth;
		if ($gameMessage._faceName == '') wordWrapWidth = $.maxWidthWithoutFace;

		text = wordWrapper(text, wordWrapWidth);
		//console.log('After wordwrap: ' + text);

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
	}
    
  // Process colors and other special characters in new text (must be manually added)
  text = this.convertEscapeCharacters(text);
	
	// Prepare text for textbox
	if(textOverflowed && $.wordWrapType == 'YEP' ){
		this._textState1 = overflowedTextState;
	} else{
		this._textState1 = {};
		this._textState1.index = 0;
		this._textState1.line = 1;
		//console.log('text to display: ' + text);
		this._textState1.text = text;
	}
    
    this.newPage(this._textState1);
    if($.fontSize != 0) this.contents.fontSize = $.fontSize;
    else if ($.decreaseFontFaceWindow && $gameMessage._faceName !== '') // Decrese font for textboxes with face
      this.contents.fontSize -= $.decreaseFontAmountFaceWindow; 

    // Increase or decrease fontsize by one step if text started with { or } (original escape characters to change font size)
    if(/^\\n/i.test($gameMessage._texts[0])){ // Text has namebox
      // Make font smaller
      if(/>.?}/.test($gameMessage._texts[0])) this.contents.fontSize -= 12; // command for font size is at start (after namebox command)
      else if(/^\\}/.test($gameMessage._texts[1])) this.contents.fontSize -= 12; // rare but command for font size is on second line
      // Make font bigger
      if(/>.?{/.test($gameMessage._texts[0])) this.contents.fontSize += 12; 
      else if(/^\\{/.test($gameMessage._texts[1])) this.contents.fontSize += 12;
    } else{
      // Normal text (without namebox)
      if($gameMessage._texts[0].startsWith('\\}')) this.contents.fontSize -= 12;
      if($gameMessage._texts[0].startsWith('\\{')) this.contents.fontSize += 12;
    }
    
    // If MessageWindowPopup plugin is used, resize popup window for new translated text
    if (PluginManager.isLoadedPlugin('MessageWindowPopup')) {
      this.resetLayout2(text);
    }
    this.updatePlacement();
    //this.updateBackground();
    //this.open();

    // Add text to backlog
    if($.useBacklog) $gameSystem.addMessageBacklog(text);
    
	  // Process text
    while (!this.isEndOfText2(this._textState1)) {
      this.processCharacter(this._textState1);
    }

    // Auto advance text for caching a scene
    if(autoAdvanceText){
      // stop the timeout that forces next text in case translation is struck
      if(typeof autoAdvanceTextTimeout !== 'undefined') clearTimeout(autoAdvanceTextTimeout); 
      
      // Set a timeout to give time to process new text
      if(!$gameMessage.isChoice()){
        setTimeout(() => {
          this.pause = false;
          this.terminateMessage();
        }, $.autoAdvanceTextWait);
      }
    }

    // Finished text replacing, reset clipboarLulle flag
    if($.wordWrapType == 'YEP') wordWrap = false;
    jpTextSentToMem = false;
  }

  // **** MessageWindowPopup handle START
  if (PluginManager.isLoadedPlugin('MessageWindowPopup')) {
    Window_Message.prototype.resetLayout2 = function(text) {
      this.padding = this.standardPadding();
      if (this.getPopupTargetCharacter()) {
          this.processVirtual2(text);
      } else {
          this.width  = this.windowWidth();
          this.height = this.windowHeight();
          this.setPauseSignToNormal();
      }
      this.updatePlacement();
      this.updateBackground();
    };

    Window_Message.prototype.processVirtual2 = function(text) {
        var virtual      = {};
        virtual.index    = 0;
        virtual.text     = text;
        virtual.maxWidth = 0;
        this.newPage(virtual);
        while (!this.isEndOfText2(virtual)) {
            this.processVirtualCharacter(virtual);
        }
        virtual.y += virtual.height;
        this._subWindowY = virtual.y;
        var choices      = $gameMessage.choices();
        if (choices && $gameSystem.getPopupSubWindowPosition() === 2) {
            virtual.y += choices.length * this._choiceWindow.lineHeight();
            virtual.maxWidth = Math.max(virtual.maxWidth, this.newLineX() + this._choiceWindow.maxChoiceWidth());
        }
        var digit = $gameMessage.numInputMaxDigits();
        if (digit && $gameSystem.getPopupSubWindowPosition() === 2) {
            virtual.y += this._numberWindow.lineHeight();
        }
        var width  = virtual.maxWidth + this.padding * 2;
        var height = Math.max(this.getFaceHeight(), virtual.y) + this.padding * 2;
        var adjust = $gameSystem.getPopupAdjustSize();
        if (adjust) {
            width += adjust[0];
            height += adjust[1];
        }
        this.width  = width;
        this.height = height;
        this.resetFontSettings();
    };
  }
  // **** MessageWindowPopup handle END

	/**
	 *  YEP Wordwrap
	 */
	// Edit YEP_WordWrap so it knows and saves the state of overflowing text
	ZERO_Window_Base_prototype_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
	Window_Base.prototype.processNormalCharacter = function(textState) {
		if (this.checkWordWrap2(textState)) {
			wordWarpLinesCount++;
			// Text overflowed?
			if(wordWarpLinesCount == $.textboxLines){
				textOverflowed = true;
				overflowedTextState = { ...textState }; // clone object (will maintain index to resume overflowed text only)
				textState.index = 9999; // Trigger end of text

				// Draw * at end
				var w = this.textWidth('*');
				let xPossition = textState.x;
				if (textState.x+w > this.contents.width) xPossition = xPossition - w; // Prevent * to go past window if last word was at the very border
				this.contents.drawText('*', xPossition, textState.y, w * 2, textState.height);

				return;
			}
			return this.processNewLine(textState);
		}
		ZERO_Window_Base_prototype_processNormalCharacter.call(this, textState);
	};

	Window_Base.prototype.checkWordWrap2 = function(textState) {
		if (!textState) return false;
		if (!wordWrap) return false;
		if (textState.text[textState.index] === ' ') {
			var nextSpace = textState.text.indexOf(' ', textState.index + 1);
			var nextBreak = textState.text.indexOf('\n', textState.index + 1);
			if (nextSpace < 0) nextSpace = textState.text.length + 1;
			if (nextBreak > 0) nextSpace = Math.min(nextSpace, nextBreak);
			var word = textState.text.substring(textState.index, nextSpace);
			var size = this.textWidthExCheck2(word);
		}
		return (size + textState.x > this.wordwrapWidth2());
	};

	Window_Base.prototype.wordwrapWidth2 = function(){
		return this.contents.width;
	};

	Window_Base.prototype.textWidthExCheck2 = function(text) {
    	wordWrap = false;
		this.saveCurrentWindowSettings2();
		var value = this.drawTextEx(text, 0, this.contents.height);
		this.restoreCurrentWindowSettings2();
		this.clearCurrentWindowSettings2();
		wordWrap = true;
		return value;
	};

	Window_Base.prototype.saveCurrentWindowSettings2 = function(){
		this._saveFontFace = this.contents.fontFace;
		this._saveFontSize = this.contents.fontSize;
		this._savetextColor = this.contents.textColor;
		this._saveFontBold = this.contents.fontBold;
		this._saveFontItalic = this.contents.fontItalic;
		this._saveOutlineColor = this.contents.outlineColor;
		this._saveOutlineWidth = this.contents.outlineWidth;
	};

	Window_Base.prototype.restoreCurrentWindowSettings2 = function(){
		this.contents.fontFace = this._saveFontFace;
		this.contents.fontSize = this._saveFontSize;
		this.contents.textColor = this._savetextColor;
		this.contents.fontBold = this._saveFontBold;
		this.contents.fontItalic = this._saveFontItalic;
		this.contents.outlineColor = this._saveOutlineColor;
		this.contents.outlineWidth = this._saveOutlineWidth;
	};

	Window_Base.prototype.clearCurrentWindowSettings2 = function(){
		this._saveFontFace = undefined;
		this._saveFontSize = undefined;
		this._savetextColor = undefined;
		this._saveFontBold = undefined;
		this._saveFontItalic = undefined;
		this._saveOutlineColor = undefined;
		this._saveOutlineWidth = undefined;
	};

	/**
	 * Split words longer than the current textbox
	 */
	 Window_Base.prototype.processLongWords = function(text){
		// Split all word into array (ignoring \n shouldn't be a problem)
		let wordArr = text.split(' ');
		let textboxSize = this.wordwrapWidth2();

		for(let i = 0; i < wordArr.length; i++){
			let wordLength = this.textWidthExCheck2(wordArr[i]);
			// If word is longer that textbox
			if(wordLength > textboxSize){
				// Calculate how long the word can be
				let letterWidth = this.textWidthExCheck2(wordArr[i][1]);
				let maxLength = Math.trunc(textboxSize / letterWidth);
				// Separate words
				let splitWord1 = wordArr[i].substring(0, maxLength-2);
				let splitWord2 = wordArr[i].substring(maxLength-2);
				splitWord1 = splitWord1 + '-';
				// Modify current array
				wordArr[i] = splitWord1;
				wordArr.splice(i+1, 0, splitWord2);
			}
		}

		return wordArr.join(' ');
	}
	// END OF YEP WORD WRAPPING

  // Function for wordwraping text (Legacy)
  function wordWrapper(str, width){
    // Split all text into words
    let text = str.split(' ');
    let line = '';
    let localWidth;
    
    str = '';
    // Loop while there are words left in the text. Each loop reperents a line
    while(text.length > 0){
      localWidth = width;
      // Each loop adds a word to the line, until line is full or no more text
      while(line.replace(colorRegex, '').length < localWidth && text.length > 0){
        // Reduce line lenght if there is a special double width character
        localWidth -= (text[0].match(/❤|♥|♡|★/g)|| []).length;

        // Check if next word isn't longer than width, else split it
        if(text[0].replace(colorRegex,'').length >= localWidth) text = wordWarpSingleWord(text, line, localWidth);

        // if adding the next word overflows line, break loop and start working on next line
        if ((line + text[0]).replace(colorRegex,'').length > localWidth){
          break;
        }else{
          // check if word had a line break
          let linebreak = false
          if(/(\n|\r)/.test(text[0])) {
            linebreak = true;
            let split = text[0].split('\n');
            // if the linebrake had two words (split at start of function didn't split words)
            if(split.length > 1) {
              line += split[0];
              text[0] = split[1];
              break;
            }
          }
          
          // add word to line
          if (typeof text[0] === 'undefined' || text[0] == '') text.shift();
          else line += text.shift() + ' ';        

          // if there was a linebreak break the loop and start a newline
          if(linebreak) break;
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

  // Add normal parenthesis when flag from clipboard_llule was set
  // Original text had parentheses, and was removed because it conflics with DeepL
  function processTextBetweenParentheses(text){
    if (textInBetweenParentheses) text = '(' + text + ')';
    return text;
  }

  // DeepL mistranslates text when it starts with '...', adding words at the start
  // Remove those words.
  function processTextStartsWithDots(text){
    if (textStartsWithDots){
      if(text.indexOf('...') < 15){ // Check that the '...' are not at the end or far in the middle of the sentence
        text = text.substring(text.indexOf('...')); // Delete text to the left of '...'
        text = text.replace('... ', '...');
      }else text = '...' + text; // DeepL didn't add '...' at the beggining, so add them
    }
    return text;
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
        while (!this.isEndOfText2(this._textState) && !stopDrawingText) { // Stop processing original text if replaceText was triggered
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
        if (this.isEndOfText2(this._textState)) {
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

  function writeFile(file, data){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';

    let fs = require('fs');

    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2)/*, 'utf16le'*/); // The 2 passed to stringify is to make the JSNO readable
  }

  function readFile(file){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';

    let fs = require('fs');

    if(fs.existsSync(absolutePath)){
      let rawData = fs.readFileSync(absolutePath/*, 'utf16le'*/);
      let jsonData = JSON.parse(rawData);
      return jsonData;
    }
  }

  function replaceHeartCharacter(text){
    // If text has hearts replace them and switch variable to notify it
    if(text.includes('♡') || text.includes('♥') || text.includes('❤')){
      text = text.replace(/♡/g,'%23'); // %23 is urlURI code for #
      text = text.replace(/♥/g,'%23');
	  text = text.replace(/❤/g,'%23');
      if(typeof hasHeartCharacter !== 'undefined') hasHeartCharacter = true;
    }else{
      if(typeof hasHeartCharacter !== 'undefined') hasHeartCharacter = false;
    }

	// Restore music note (lazy, don't want to implement another function)
	if(text.includes('♪')){
	  text = text.replace(/♪/g,'@');
	  if(typeof hasMusicNoteCharacter !== 'undefined') hasMusicNoteCharacter = true;
	}else{
	  if(typeof hasMusicNoteCharacter !== 'undefined') hasMusicNoteCharacter = false;
	}

    return text
  }

  // Prevent other scripts from modifying this function by making a copy (this is used by
  // my custom code to replace the text of the current window)
  // MPP_Patch.js is known to modify isEndOfText and cause an infinite loop
  Window_Message.prototype.isEndOfText2 = function(textState) {
    return textState.index >= textState.text.length;
  };

  /* ----------------------------------------------------------------------------------
  /*  Popup Text  /
  /--------------*/
  // Check if popup text wasn't created by another plugin
  if(typeof SceneManager.callPopup != 'function'){
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
  }
  /* -----------------\
  /* End of Popup Text \
  /*----------------------------------------------------------------------------------*/

})(ZERO.SetClipboardText);

