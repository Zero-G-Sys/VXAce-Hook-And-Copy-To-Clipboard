//=============================================================================
// ZERO_ReplaceText.js
//=============================================================================
/*:
 * @ZERO_ReplaceText
 * @plugindesc Replace text from game
 * @version 1.4
 * @author Zero_G
 * @filename ZERO_ReplaceText.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin will let you replace words from the game text. No parameters
 only to be used in completed games.

 IMPORTANT: Prep needed for MPP and Luna plugins, read comments in their section

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 == Changelog ==
 v1.4 - Added DarkPlasma Namebox
 v1.3 - Process text before processing escape characters
      - Changed main replacements from dictionary to map (so regex can be used directly)
      - Add name replace and change name color for 3 main name plugins
 v1.2 Added option to change color of names in MPP_MessageEX
 v1.1 Aliased start message function
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
    [/(M|m)iss( |\n)(?=[A-Z])(\w+)/g, '$3-san'], // Only trigger on words that start with a capital letter
    [/(L|l)ady( |\n)(?=[A-Z])(\w+)/g, '$3-sama'],
    [/Ms\.( |\n)(\w+)/gi, '$2-san'],
    // Custom
  ]);

  //TODO: Test in all enviroments, the combine all nameRemplacement variables into one (no need to have separate for each script)
  //TODO2: Set default color for all scripts (Right now I think you can override only Luna's). And set a variable name like defaultNameColor

  // YEP (Not tested)
  // 'Name_to_replace': ['Replaced_name_or_empty_if_same', color_code_or_empty_if_ignored]
  // Done after main replace, so if you replaced a name there, put the replaced name here
  // This make the name replacement in this part kind of useless, use only if you want to
  // replace the name in the namebox only
  const YEPNameReplacements = {
    //'Name': ['NewName', 3], // Change name and color
    //'Name': ['NewName'],    // Change name and without setting new color
    //'Bell': ['', 8],        // Change color only
  }

  // MPP (Not tested) (Would like to add Luna global expose method to MPP, and also update hidetextbox with that method)
  // Need to comment/delete "(function() {" and its closing bracket "})();"
	// so MPP_MessageEX isn't in an anonymous function (can't access its functions otherwise)
  // 'Name_to_replace': ['Replaced_name_or_empty_if_same', color_code_or_empty_if_ignored]
  const MPPNameReplacements = {
    //'Bell': ['', 8],
    //'Name': ['NewName'], // Change name and without setting new color
  }

  // Luna
  // 'Name_to_replace': ['Replaced_name_or_empty_if_same', color_code_or_empty_if_ignored]
  const LunaDefaultNameColor = 0; // Set default color for Luna Nameboxes
  const LunaNameReplacements = {
    //'Noelle': ['', 2],
  }

  // DarkPlasma
  const DarkPlasmaReplacements = {
    //'Noelle': ['', 2],
  }

  /** MPP **/
  // Check if MPP plugin exists
  if(typeof Window_MessageName == 'function'){
    var ZERO_Window_MessageName_prototype_setName = Window_MessageName.prototype.setName;
    Window_MessageName.prototype.setName = function(name, colorIndex) {
      for(const key in MPPNameReplacements){
        if(key.toLowerCase() === name.toLowerCase()){
          if(MPPNameReplacements[key][0] !== '') name = MPPNameReplacements[key][0];
          if(MPPNameReplacements[key][1]) colorIndex = MPPNameReplacements[key][1];
          break;
        }
      }
      ZERO_Window_MessageName_prototype_setName.call(this, name, colorIndex);
    }
  }

  /*-------------------------------------------------------------------------*/

  /** Lunatlazur_ActorNameWindow **/
  // Need to de-anonymize plugin OR (alternate way go to next comment)
  if(typeof Window_ActorName == 'function'){
    Window_ActorName.prototype.refresh = function () {
      lunaReplaceRefresh.call(this);
    };
  }

  // Add global variable to expose Window actor name in Luna
  // first line of code on lune: var HideMessageWindowZ_Lunatlazur;
  // pre last line: HideMessageWindowZ_Lunatlazur = Window_ActorName;
  if(typeof HideMessageWindowZ_Lunatlazur !== 'undefined'){
    HideMessageWindowZ_Lunatlazur.prototype.refresh = function () {
      lunaReplaceRefresh.call(this);
    };
  }

  function lunaReplaceRefresh(){
    let color;
    for(const key in LunaNameReplacements){
      if(key.toLowerCase() === this._text.toLowerCase()){
        if(LunaNameReplacements[key][0] !== '') this._text = LunaNameReplacements[key][0];
        if(LunaNameReplacements[key][1]) color = LunaNameReplacements[key][1];
        break;
      }
    }

    // Original code
    this.width = this.windowWidth();
    this.createContents();
    this.contents.clear();
    this.resetFontSettings();
    // Mod color
    if(color){
      this.changeTextColor(this.textColor(color));
    } else{
      this.changeTextColor(this.textColor(LunaDefaultNameColor));
    }
    this.drawText(this._text, this.standardPadding() * 2, 0, this.contents.width);
  }

  /*------------------------------------------------------------------------------------- */
  /* DarkPlasma_NameWindow */
  if(typeof DarkPlasma_NameWindow != 'undefined' && DarkPlasma_NameWindow){ // Check if modded ver is present
    var ZERO_Window_SpeakerName_show = DarkPlasma_NameWindow.nameWindow.prototype.show;
    DarkPlasma_NameWindow.nameWindow.prototype.show = function(text, position) {
      for(const key in DarkPlasmaReplacements){
        if(new RegExp('^(\\\\c\\[\\d{1,2}\\])?' + key, 'i').test(text)){
          if(DarkPlasmaReplacements[key][0] !== '') text = text.replace(key, DarkPlasmaReplacements[key][0]);
          if(DarkPlasmaReplacements[key][1]) 
            text = text.replace(/\\c\[\d{1,2}\]/i, '\\c[' + DarkPlasmaReplacements[key][1] + ']'); // Assuming there is always a color code
          break;
        }
      }

      ZERO_Window_SpeakerName_show.call(this, text, position);
    };
  }

  /*------------------------------------------------------------------------------------- */

  // Alias
  var ZERO_Window_Message_prototype_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function () {
    ZERO_Window_Message_prototype_startMessage.call(this);

    let text = $gameMessage.allText();

    if(/n\[.*\]/i.test(text)){
      for(const key in YEPNameReplacements){
        let re = new RegExp('n\\[' + key, i);
        if(re.text(text)){
          if(YEPNameReplacements[key][0] !== '') text = text.replace(re, 'n\\[' + YEPNameReplacements[key][0]); // Replace name if set
          if(YEPNameReplacements[key][1]) text = text.replace('n\\[', 'n\\[\\c[' + YEPNameReplacements[key][1] + ']'); // Add color code if set
          break;
        }
      }
    }
    
    for(const [key, value] of replacements){
      text = text.replace(key, value);
    }

    this._textState.text = this.convertEscapeCharacters(text);
  };
})(ZERO.Replace_Text);
