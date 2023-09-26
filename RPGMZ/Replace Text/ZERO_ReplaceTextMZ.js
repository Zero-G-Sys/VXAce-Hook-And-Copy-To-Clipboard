//=============================================================================
// ZERO_ReplaceTextMZ.js
//=============================================================================
/*:
 * @ZERO_ReplaceTextMZ
 * @plugindesc Replace text from game
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_ReplaceTextMZ.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin will let you replace words from the game text. No parameters
 only to be used in completed games.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects

 == Usage ==
 Just add the plugin.

 == Changelog ==
 v1.0 Initial
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_Replace_Text = 1;
ZERO.Replace_Text = ZERO.Replace_Text || {};

(function ($) {
  // Replace words, mostly for bad translations
  // Use regex on first field, plaint text or callback on second (see javascript replace documentation for function use)
  // Use g modifier to replace all instances, i for case insensitive
  // 'from': 'to',
  // To add COLOR to text replace with \x1bC[1] (deprecated since v1.3, now use \\c[x])
  // IMPORTANT: Don't use ' ' use '( |\n)' so it recognizes line breaks
  const replacements = new Map([
    // Bad translation punctuation
    [/，/g, ','],
    [/’/g, "'"],
    [/‘/g, "'"],
    [/…/g, '...'],
    [/。/g, '.'],
    [/　/g, ' '],
    // Restore japanese honorifics
    [/miss( |\n)(\w+)/gi, '$2-san'], // capturing group 2 because a line of code will add a group to the space: "miss( |\n)(\w+)"
    [/Lady( |\n)(\w+)/gi, '$2-sama'],
    [/Ms.( |\n)(\w+)/gi, '$2-san'],
    // Custom
  ]);

  // Name replacements (optional) and color
  const NameReplacements = {
    //'Name': ['NewName', 3], // Change name and color
    //'Name': ['NewName'],    // Change name and without setting new color
    //'Bell': ['', 8],        // Change color only
  };

  const defaultNameColor = 0;

  // Replace Text
  // startMessage gets its text from $gameMessage._texts, so replace those before they are accessed
  var ZERO_Window_Message_prototype_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function () {
    let joinedText = $gameMessage._texts.join('\n');
    joinedText = this.convertEscapeCharacters(joinedText);
    for (const [key, value] of replacements) {
        joinedText = joinedText.replace(key, value);
    }
    $gameMessage._texts = joinedText.split('\n');

    ZERO_Window_Message_prototype_startMessage.call(this);
  };

  // Replace Names
  var ZERO_Window_NameBox_prototype_start = Window_NameBox.prototype.start;
  Window_NameBox.prototype.start = function () {
    if (this._name) {
      for (const [key, value] of Object.entries(NameReplacements)) {
        let newName = value[0];
        let color = value[1];

        if (key.trim().toLowerCase() === this.convertEscapeCharacters(this._name).trim().toLowerCase()) {
          // Replace name if set
          if (newName !== '') this._name = newName;
          // If there isn't a color set default
          if (!/\\c\[/i.test(this._name)) this._name = '\\c[' + defaultNameColor + ']' + this._name;
          // Add color code if set
          if (color) this._name = this._name.replace(/\\c\[\d{1,2}\]/i, '\\c[' + color + ']');
          // Update $gameMessage getSpeakerName() in case other places use it (like a backlog)
          $gameMessage._speakerName = this._name + '\\c[0]';
          break;
        }
      }
    }

    ZERO_Window_NameBox_prototype_start.call(this);
  };
})(ZERO.Replace_Text);
