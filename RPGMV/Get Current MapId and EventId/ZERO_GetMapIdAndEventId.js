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

// Modified to get map id and parents, last game event id, and last common event id
// last common event id isn't working, could try to get it from the object Game_CommonEvent, but seems not necessary 
(function ($) {
  const fs = require('fs');

  function getAbsolutePath(){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';
    return absolutePath;
  }
  function getAbsolutePathJson(file){
    return getAbsolutePath() + '\\' + file + '.json';
  }
  function writeFile(file, data){
    fs.writeFileSync(getAbsolutePathJson(file), JSON.stringify(data, null, 2)); // The 2 passed to stringify is to make the JSON readable
  }

  // Get last event id run
  var lastEventRun = -1;
  var ZERO_Game_Event_prototype_start = Game_Event.prototype.start;
  Game_Event.prototype.start = function() {
      if($gameMap.mapId() == this._mapId && lastEventRun != this._eventId) lastEventRun = this._eventId;
      ZERO_Game_Event_prototype_start.call(this);
  };

  document.addEventListener('keydown', event => {
    if (event.key == 'm') {
        let mapId = $gameMap.mapId();
        let lastParentId = $gameMap.mapId();
        let count = 0; // Prevent endless loop
        
        try{
          do{
            count++;
            lastParentId = $dataMapInfos[lastParentId].parentId;
            if(lastParentId == 0) break; // end loop
            mapId += '-' + lastParentId;
          } while(lastParentId != 0 || count < 30) // First condition will never be true as we are breaking the loop before
        }catch(ex){
          mapId += '-ER';
        }
        
        SceneManager.callPopup('Map: ' + mapId + ' Ev: ' + lastEventRun + ' CEv: ' + $gameTemp._commonEventId);
        writeFile('mapId', {"Map Id": mapId, "Current Event Id": lastEventRun, "Current Common Event Id": $gameTemp._commonEventId});
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
  SceneManager.callPopup = function (text, position = 'topRight', maxWidth = 500) {
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
        popupSprite.opacity -= 0.5;
    }
  }
};
})(ZERO.TextPopup);
