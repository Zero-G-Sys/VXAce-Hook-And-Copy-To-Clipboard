//=============================================================================
// Fade_out_fade_in_speed.js
//=============================================================================
/*:
 * @Fade_out_fade_in_speed
 * @plugindesc Change Fade out/fade in speed
 * @version 1.0
 * @author Zero_G
 * @filename Fade_out_fade_in_speed.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin lets you change the default Fade out/fade in speed when 
 transferring the player.

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
  $.params = PluginManager.parameters('Fade_out_fade_in_speed');
  $.fadeOutSpeed = $.params['Fade out speed'].trim();
  $.fadeInSpeed = $.params['Fade in speed'].trim();

  Scene_Base.prototype.startFadeOut = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || $.fadeOutSpeed;
    this._fadeSprite.opacity = 0;
  };

  Scene_Base.prototype.startFadeIn = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || $.fadeInSpeed;
    this._fadeSprite.opacity = 255;
  };

  Scene_Map.prototype.fadeOutForTransfer = function () {
    var fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
      case 0:
      case 1:
        this.startFadeOut($.fadeOutSpeed, fadeType === 1);
        break;
    }
  };

  Scene_Map.prototype.fadeInForTransfer = function () {
    var fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
      case 0:
      case 1:
        this.startFadeIn($.fadeInSpeed, fadeType === 1);
        break;
    }
  };
})(ZERO.FadeOutFedeInSpeed);
