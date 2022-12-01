//=============================================================================
// ZERO_Replace_Text.js
//=============================================================================
/*:
 * @ZERO_Replace_Text
 * @plugindesc Replace text from game
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_Replace_Text.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin will let you replace word from the game text.

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_Replace_Text = 1;
ZERO.Replace_Text = ZERO.Replace_Text || {};

(function ($) {
  // Replace words, mostly for bad translations
  // accepts regex /g (without the / in between)
  // 'from': 'to',
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

  // Overwrite
  Window_Message.prototype.startMessage = function () {
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters($gameMessage.allText());

    for (let key in replacements2){
      var re = new RegExp(key, 'g'); // Create regex with variable
      this._textState.text = this._textState.text.replace(re, replacements2[key]); // Use regular expresion to replace all values and not the first one only
    }

    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
  };
})(ZERO.Replace_Text);
