//=============================================================================
// More Window Colors
//=============================================================================
/*:
* @MoreWindowColors
* @plugindesc Add more colors to choose from
* @version 1.0
* @author Zero_G
* @filename ZERO_MoreWindowColors.js
* @help
-------------------------------------------------------------------------------
== Description ==
 This plugin lets you add another window file with more colors. In the default
 window file colors start at 0. In the new one colors start at 32.

== Usage ==
 Add another window file on img/System named as you set on the param options

== Changelog ==
1.0 - Initial Release.

== Terms of Use ==
 - Free for use in non-commercial projects
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 @param Second Window File
 @desc Set the name of the second window file
 @default Window2

------------------------------------------------------------------------------
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_MoreWindowColors = 1;
ZERO.MoreWindowColors = ZERO.MoreWindowColors || {};

(function($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);

    $.newWindowFileName = $.params['Second Window File'];

    // Add image to decrypt ignore list
    Decrypter._ignoreList.push("img/system/" + $.newWindowFileName + ".png");

    // Alias
    var ZERO_Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(x, y, width, height) {
        ZERO_Window_Base_initialize.call(this, x, y, width, height);
        this.loadWindowskin2();
    };

    // New
    Window_Base.prototype.loadWindowskin2 = function() {
        this.windowskin2 = ImageManager.loadSystem($.newWindowFileName);
    };

    // Overwrite
    var ZERO_Window_Base_textColor = Window_Base.prototype.textColor;
    Window_Base.prototype.textColor = function(n) {
        if(n >= 32){
            n = n - 32;
            var px = 96 + (n % 8) * 12 + 6;
            var py = 144 + Math.floor(n / 8) * 12 + 6;
            return this.windowskin2.getPixel(px, py);
        } else{
            return ZERO_Window_Base_textColor.call(this, n);
        }
    };

})(ZERO.MoreWindowColors);