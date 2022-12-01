//=============================================================================
// Text_Popup.js
//=============================================================================
/*:
 * @Text_Popup
 * @plugindesc Display a popup text
 * @version 1.0
 * @author Zero_G
 * @filename Text_Popup.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin is an example of how to pop up text

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Press de C key during gameplay to show popup

 function SceneManager.callPopup(text, position, maxWidht)
 text = text of popup
 position = position of popup ['topRight', 'bottomRight', 'topLeft',
            'bottomLeft'], default is 'topRight'
 maxWidht = max widht of popup in pixels, text will compress to this widht.
            if text is too long, increase it. Deafult 100
 
 -------------------------------------------------------------------------------
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_TextPopup = 1;
ZERO.TextPopup = ZERO.TextPopup || {};

(function ($) {
  document.addEventListener('keydown', event => {
    if (event.keyCode == 67) {  // C
        SceneManager.callPopup('testing popup');
      }
  });

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
  SceneManager.callPopup = function (text, position = 'topRight', maxWidth = 100) {
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
})(ZERO.TextPopup);
