//=============================================================================
// Fade Out/Fade In Speed
//=============================================================================
/*:
 * @ZERO_FadeOutFadeInSpeed
 * @plugindesc Change Fade out/fade in speed
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_FadeOutFadeInSpeed.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin lets you change the deafult Fade out/fade in speed

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.
 
 -------------------------------------------------------------------------------
 @param Fade out speed
 @desc Default fade out speed
 @default 10
 
 @param Fade in speed
 @desc Default fade in speed
 @default 10
 -------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_FadeOutFedeInSpeed = 1;
ZERO.FadeOutFedeInSpeed = ZERO.FadeOutFedeInSpeed || {};

(function ($) {
  // Get plugin name and parameters
  var substrBegin = document.currentScript.src.lastIndexOf('/');
  var substrEnd = document.currentScript.src.indexOf('.js');
  var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
  $.params = PluginManager.parameters(scriptName);
  
  $.fadeOutSpeed = $.params['Fade out speed'].trim();
  $.fadeInSpeed = $.params['Fade in speed'].trim();

  Scene_Base.prototype.startFadeOut = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    //this._fadeDuration = duration || $.fadeOutSpeed;
    this._fadeDuration = $.fadeOutSpeed;
    this._fadeSprite.opacity = 0;
  };

  Scene_Base.prototype.startFadeIn = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    //this._fadeDuration = duration || $.fadeInSpeed;
    this._fadeDuration = $.fadeInSpeed;
    this._fadeSprite.opacity = 255;
  };
})(ZERO.FadeOutFedeInSpeed);
