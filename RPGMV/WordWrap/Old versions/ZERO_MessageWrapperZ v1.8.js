//---------------------------------------------------------------------------
// ZERO Message Wrapper Z
//---------------------------------------------------------------------------
/*:
 * @ZERO_MessageWrapperZ
 * @plugindesc Wraps messages to a certain width for automatic indention and breaks.
 * @version 1.8
 * @author Zero_G
 * @filename ZERO_MessageWrapperZ.js
 * @help

Script based on VPS - Message Wrapper by Soulpour777

This plugin is mostly intended for bad tranlations and not to be used for game 
development.

For configuration set variables inside plugin. Explanation of features in
the description of each configuration.

Modifications by Zero_G:
 - Whitespace functionality (remove line breakes)
 - Two ways to handle names after replacing to whitespace
 - Change font size
 - Alternate better word wrapper function
 - Replace words before displaying text

Modified Changelog:
 v1.8 -Added using '[0]' to White Space Name Mode 1 to identify colored names
 v1.7 -Added White Space Name Mode 3 
      -Fix battle messages
 v1.6 -Rewrote mayor parts of the code
      -Fixed alternate word wrapper if single word was longer than width
      -Added a word wrapper selector
      -Removed plugin parameters
      -Added variable to set battle messages width

Terms of Use:

Free to use for Commercial and Non-Commercial Use. Credit is necessary for
usage.
*/

var Soulpour = Soulpour || {};
WordWrapper = {};

(function ($) {
  const maxWidth = 43; // Max width of textbox with face
  const maxWidthWithoutFace = 55; // Max width of textbox without face
  const battleMessagesWidth = 55; // Should be close or same as maxWidthWithoutFace

  // Change game fontsize. Default 28, sutiable 26. 0 to disable change of font size
  const fontSize = 0 

  // Select WordWrapper (original = 1 or ZERO_G = 2)
  // Zero_G WordWrapper respects maxWidth better (original fails sometimes)
  // Original WordWrapper has a bug that sometimes the last line is not displayed
  const wordWrapperSelect = 2;

  // Convert \n (line breaks) to ' ', all text will be a single line to be wordwrapped
  // This fixes inconsistent lines with line skips in the middle
  // Only one can be true

  // Select if using whitespace mode, and is using it's special name handling modes
  // 1 = No White Space Mode. Simple wordwrap (Not recommended)
  // 2 = Normal White Space Mode. Remove line breakes before word wrapping
  // 3 = White Space Name Mode 1. Wordwrap handling names. Put names in first line. Use special 
  //     character as separator. Configure with  nameSeparator and dontEraseSeparateor variables.
  // 4 = White Space Name Mode 2. Wordwrap handling names. If name doesn't have a separator, 
  //     try to guess if first words are a name. Configure with nameLenght variable
  // 5 = White Space Name Mode 3. Wordwrap handling names. If text is between special characters
  //     ex: "" or [] or「」or 『』. Uses nameLenght var to prevent a quote in middle of text to 
  //     trigger this.
  const whiteSpaceMode = 5;

  // Required for White Space Name Mode 1
  // Define which caracter is the name encolsed in.
  // (If it isn't enclosed use '\n', but it dosn't work well when its only text without names)
  // Is best to use : or ] as separator if the end of a name has it (ex Name: or [Name])
  const nameSeparator = ':'; // or ":" or "]"
  const dontEraseSeparateor = true;
  // Combine it with White Space Name Mode 2 (ignore nameSeparator if the separator comes after name lenght)
  // Useful when name are colored and using '[0]' for name separator (without a namelenght all colored text 
  // would be treated as a name instead)
  // (a ingame name would be like this: '\C[1]name\C[0])
  const useNameLenght = false; 

  // Required for White Space Name Mode 2
  // How many characters should it guess it's a name
  // If there is a line skip ('\n') before this many characters it will assume it's a name
  const nameLenght = 15;

  // Required for White Space Name Mode 3
  // Set start quote 
  const textQuote = '"'; //「
  const textQuote2 = '('; //『

  // Replace words, mostly for bad translations
  // first field is a regex /g (without the / in between) special character must 
  // be escaped with '\\'. For example '.' should be '\\.'
  // 'from': 'to',
  var replacements = {
    '，': ',',
    '’': "'",
    '‘': "'",
    '…': '...',
    '。': '.',
    ' \\.\\.\\.': '...',
    ' \'': '\'',
  };

  /*--------------------------------------------------------------------------------*/

  // Prepare replacements (Not using Object.entries due to compatibility)
  // Replace each ' ' with regex in case the string to replace has a line break
  let replacements2 = {};
  for (let key in replacements){
    let value = replacements[key];
    delete replacements[key];
    key = key.replace(/ /g, '( |\\n)');
    replacements2[key] = value;
  }
  replacements = replacements2;
  
  if(fontSize != 0){
    Window_Base.prototype.standardFontSize = function() {
      return fontSize;
    };
  }

  // Select which word wrapper to use
  function wordWrapperSelector (text, width) {
    if (wordWrapperSelect == 1) {
      return soulpour_wordWrapper(text, width);
    } else {
      return ZERO_wordWrapper(text, width);
    }
  };

  // String capitalize function
  const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase()
    );

  // Prepeare text before wrapping, select wrapping mode
  Window_Message.prototype.wordWrapPrepare = function (text) {
    // See if text has a face, adjust length of word wrap
    var wordWrapWidth = maxWidth;
    if ($gameMessage._faceName == '') {
      wordWrapWidth = maxWidthWithoutFace;
    }

    //console.log("orig: " + JSON.stringify(text)); // Test pattern

    // Replace words (for names, etc)
    for (let key in replacements){
      var re = new RegExp(key, 'g'); // Create regex with variable
      text = text.replace(re, replacements[key]); // Use regular expresion to replace all values and not the first one only
    }

    switch(whiteSpaceMode){
      //No White Space Mode
      case 1:
        text = wordWrapperSelector(text, wordWrapWidth);
        break;

      // Normal White Space Mode
      case 2:
        text = text.replace(/\n|\\n/g, ' ');
        text = wordWrapperSelector(text, wordWrapWidth);
        break;

      // White Space Name Mode 1
      case 3:
        // Split text in [Name] and [Dialoge]
        // Is best to use : or ] as separator if the end of a name has it (ex Name: or [Name])
        let splittedText = [];
        var test =text.indexOf(nameSeparator);
        if((test > 0 && test <= nameLenght) || !useNameLenght){
          if (dontEraseSeparateor && text.includes(nameSeparator)) {
            splittedText = [ text.substring(0, text.indexOf(nameSeparator) + nameSeparator.length), text.substring(text.indexOf(nameSeparator)+ (nameSeparator.length+1)) ];
          } else {
            splittedText = text.split(nameSeparator);
          }
        }

        //console.log("split: " + JSON.stringify(splittedText)); // Test pattern

        // Determine if there is a name in dialoge
        if (splittedText.length > 1) {
          // Replace all instances of \n in [Dialoge]
          let replacedDialoge = splittedText[1].replace(/\n|\\n/g, ' ');
          // Wordwrap dialogue
          let wrappedText = wordWrapperSelector(replacedDialoge, wordWrapWidth);
          text = capitalize(splittedText[0]) + '\n' + wrappedText;
        } else {
          // There wasn't a name in text, wordwrap everything
          text = text.replace(/\n|\\n/g, ' ');
          text = wordWrapperSelector(text, wordWrapWidth);
        }
        break;

      // White Space Name Mode 2
      case 4:
        if (text.length > 0) {
          let p = name_wordWrapper(text);
          if (p > 0) {
            let splittedText = [text.substring(0, p), text.substring(p + 1)];
            splittedText[1] = splittedText[1].replace(/\n|\\n/g, ' ');
            let wrappedText = wordWrapperSelector(splittedText[1], wordWrapWidth);
            text = capitalize(splittedText[0]) + '\n' + wrappedText;
          } else {
            text = text.replace(/\n|\\n/g, ' ');
            text = wordWrapperSelector(text, wordWrapWidth);
          }
        }
        break;

      // Normal White Space Mode
      case 5:
        text = text.replace(/\n|\\n/g, ' ');
        if(text.indexOf(textQuote) < nameLenght) text = text.replace(textQuote, '\n ' + textQuote);
        if(text.indexOf(textQuote2) < nameLenght) text = text.replace(textQuote2, '\n ' + textQuote2);
        text = wordWrapperSelector(text, wordWrapWidth);
        break;
        
      default:
        console.log('error: whiteSpaceMode variable is set incorrectly. Doing simple wordwrap');
        text = wordWrapperSelector(text, wordWrapWidth);
        break;
    }

    //console.log("replaced: " + JSON.stringify(text)); // Test pattern
    return text;
  };

  // Overwrite Window_Message startMessage
  // For starting word wrap in normal messages
  Window_Message.prototype.startMessage = function () {
    var text = '';

    this._textState = {};
    this._textState.index = 0;

    text = this.convertEscapeCharacters($gameMessage.allText());
    text = this.wordWrapPrepare(text);

    this._textState.text = text;
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
  };

  // Try to find a name in text using nameLenght variable for wrapping mode 2
  // Returns 0 if it was unsuccessful
  // Returns the index where the name finishes
  name_wordWrapper = function (str) {
    // Determine where is the line skip
    p = str.indexOf('\n');

    // Determine if the line skip is within nameLenght lenght
    if (p < nameLenght) {
      // Assume it's a name
      return p;
    }

    return 0;
  };

  // Original word wrap function
  function soulpour_wordWrapper (str, width, spaceReplacer = '\n') {
    if (str.length > width) {
      var p = width;
      for (; p > 0 && str[p] != ' '; p--) {}
      if (p > 0) {
        var left = str.substring(0, p);
        var right = str.substring(p + 1);
        return (
          left +
          spaceReplacer +
          soulpour_wordWrapper(right, width, spaceReplacer)
        );
      }
    }
    return str;
  };

  // Alternate function for word wrapping text
  function ZERO_wordWrapper(str, width){
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

        if(text[0] == '\n'){
          text.shift();
          break;
        }

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
  
  // ZERO_wordWrapper helper function
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

  /* --------------------------------------------------------------------- */
  /* Battle message handling
  /* --------------------------------------------------------------------- */

  BattleManager.displayStartMessages = function () {
    $gameTroop.enemyNames().forEach(function (name) {
      $gameMessage.add(wordWrapperSelector(TextManager.emerge.format(name), battleMessagesWidth));
    });
    if (this._preemptive) {
      $gameMessage.add(wordWrapperSelector(TextManager.preemptive.format($gameParty.name()), battleMessagesWidth));
    } else if (this._surprise) {
      $gameMessage.add(wordWrapperSelector(TextManager.surprise.format($gameParty.name()), battleMessagesWidth));
    }
  };

  BattleManager.displayExp = function () {
    var exp = this._rewards.exp;
    if (exp > 0) {
      var text = wordWrapperSelector(TextManager.obtainExp.format(exp, TextManager.exp), battleMessagesWidth);
      $gameMessage.add('\\.' + text);
    }
  };

  BattleManager.displayGold = function () {
    var gold = this._rewards.gold;
    if (gold > 0) {
      $gameMessage.add('\\.' + wordWrapperSelector(TextManager.obtainGold.format(gold), battleMessagesWidth));
    }
  };

  BattleManager.displayDropItems = function () {
    var items = this._rewards.items;
    if (items.length > 0) {
      $gameMessage.newPage();
      items.forEach(function (item) {
        $gameMessage.add(wordWrapperSelector(TextManager.obtainItem.format(item.name), battleMessagesWidth));
      });
    }
  };

  BattleManager.displayVictoryMessage = function () {
    $gameMessage.add(wordWrapperSelector(TextManager.victory.format($gameParty.name()), battleMessagesWidth));
  };

  BattleManager.displayDefeatMessage = function () {
    $gameMessage.add(wordWrapperSelector(TextManager.defeat.format($gameParty.name()), battleMessagesWidth));
  };

  BattleManager.displayEscapeSuccessMessage = function () {
    $gameMessage.add(wordWrapperSelector(TextManager.escapeStart.format($gameParty.name()), battleMessagesWidth));
  };

  BattleManager.displayEscapeFailureMessage = function () {
    $gameMessage.add(wordWrapperSelector(TextManager.escapeStart.format($gameParty.name()), battleMessagesWidth));
    $gameMessage.add('\\.' + wordWrapperSelector(TextManager.escapeFailure, battleMessagesWidth));
  };

  // Show Scrolling Text
  Game_Interpreter.prototype.command105 = function () {
    if (!$gameMessage.isBusy()) {
      $gameMessage.setScroll(this._params[0], this._params[1]);
      while (this.nextEventCode() === 405) {
        this._index++;
        $gameMessage.add(wordWrapperSelector(this.currentCommand().parameters[0], battleMessagesWidth));
      }
      this._index++;
      this.setWaitMode('message');
    }
    return false;
  };

  Game_Actor.prototype.showRemovedStates = function () {
    this.result()
      .removedStateObjects()
      .forEach(function (state) {
        if (state.message4) {
          $gameMessage.add(wordWrapperSelector(this._name + state.message4, battleMessagesWidth));
        }
      }, this);
  };

  Game_Actor.prototype.displayLevelUp = function (newSkills) {
    var text = TextManager.levelUp.format(
      this._name,
      TextManager.level,
      this._level
    );
    $gameMessage.newPage();
    $gameMessage.add(wordWrapperSelector(text, battleMessagesWidth));
    newSkills.forEach(function (skill) {
      $gameMessage.add(wordWrapperSelector(TextManager.obtainSkill.format(skill.name), battleMessagesWidth));
    });
  };
})();
