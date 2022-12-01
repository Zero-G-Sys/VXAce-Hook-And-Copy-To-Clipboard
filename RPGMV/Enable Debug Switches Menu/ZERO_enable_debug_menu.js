//=============================================================================
// ZERO_enable_debug_menu.js
//=============================================================================
/*:
 * @ZERO_enable_debug_menu
 * @plugindesc Enable debug switches and variables menu outside of testplay
 * @version 1.0
 * @author Zero_G
 * @filename ZERO_enable_debug_menu.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 Enable debug switches and variables menu outside of testplay (F9 key)

*/

Scene_Map.prototype.isDebugCalled = function() {
  return Input.isTriggered('debug');
};