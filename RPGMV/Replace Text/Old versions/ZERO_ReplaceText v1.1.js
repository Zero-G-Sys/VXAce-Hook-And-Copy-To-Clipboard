//=============================================================================
// ZERO_Replace_Text.js
//=============================================================================
/*:
 * @ZERO_Replace_Text
 * @plugindesc Replace text from game
 * @version 1.1
 * @author Zero_G
 * @filename ZERO_Replace_Text.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin will let you replace words from the game text. No parameters
 only to be used in completed games.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 == Changelog ==
 v1.1 Alised start message function
 v1.0 Intial
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_Replace_Text = 1;
ZERO.Replace_Text = ZERO.Replace_Text || {};

(function ($) {
  // Replace words, mostly for bad translations
  // accepts regex /g (without the / in between)
  // 'from': 'to',
  // To add COLOR to text replace with \x1bC[1]
  const replacements = {
    '，': ',',
    '’': "'",
    '‘': "'",
    '…': '...',
    '。': '.',
  };

  // Prepare replacements
  // Replace each ' ' with regex in case the string to replace has a line break
  let replacements2 = {};
  for (let key in replacements){
    let value = replacements[key];
    delete replacements[key];
    key = key.replace(/ /g, '( |\\n)');
    replacements2[key] = value;
  }

  // Alias
  var ZERO_Window_Message_prototype_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function () {
    ZERO_Window_Message_prototype_startMessage.call(this);

    for (let key in replacements2){
      var re = new RegExp(key, 'g'); // Create regex with variable
      this._textState.text = this._textState.text.replace(re, replacements2[key]); // Use regular expresion to replace all values and not the first one only
    }
  };
})(ZERO.Replace_Text);
