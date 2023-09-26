//=============================================================================
// More Window Colors
//=============================================================================
/*:
* @MoreWindowColorsMZ
* @plugindesc Add more colors to choose from
* @version 1.0
* @author Zero_G
* @filename ZERO_MoreWindowColorsMZ.js
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

    // Ignore decryption of new window image if game has encrypted images
    var ZERO_Bitmap_prototype__startDecrypting = Bitmap.prototype._startDecrypting
    Bitmap.prototype._startDecrypting = function() {
        if(this._url === 'img/system/' + $.newWindowFileName + '.png'){
            this._image.src = this._url;
            return;
        }
        ZERO_Bitmap_prototype__startDecrypting.call(this)
    };

    var ZERO_ColorManager_loadWindowskin = ColorManager.loadWindowskin;
    ColorManager.loadWindowskin = function() {
        ZERO_ColorManager_loadWindowskin.call(this);
        this._windowskin2 = ImageManager.loadSystem($.newWindowFileName);
    };
    
    var ZERO_ColorManager_textColor = ColorManager.textColor;
    ColorManager.textColor = function(n) {
        if(n >= 32){
            n = n - 32;
            var px = 96 + (n % 8) * 12 + 6;
            var py = 144 + Math.floor(n / 8) * 12 + 6;
            return this._windowskin2.getPixel(px, py);
        } else{
            return ZERO_ColorManager_textColor.call(this, n);
        }
    };

})(ZERO.MoreWindowColors);