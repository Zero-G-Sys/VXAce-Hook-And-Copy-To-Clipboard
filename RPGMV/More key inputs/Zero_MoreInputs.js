//=============================================================================
// Zero_MoreImputs.js
//=============================================================================
/*:
 * @title Zero_MoreImputs
 * @plugindesc Add more inputs to MV Core
 * @version 1.0
 * @author Zero_G
 * @filename Zero_MoreImputs.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 This plugin lets you add more inputs to the core of MV

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.
 
 To add new inputs modify the plugin code. Add lines for each input, values for 
 the keys are corresponding Virtual Key Code.

 List https://web.archive.org/web/20150309032722/https://help.adobe.com/en_US/AS2LCR/Flash_10.0/help.html?content=00000520.html

 ex: Input.keyMapper[key] = 'value';
 key = Virtual Key Code number
 value = Function call

 */
 
 (function() {
    // Added mappings
    Input.keyMapper[65] = 'a'; // A
    Input.keyMapper[83] = 's'; // S
    Input.keyMapper[68] = 'd'; // D
    Input.keyMapper[67] = 'c'; // C
    Input.keyMapper[69] = 'e'; // E
    
    // Default mappings
    /*
    Input.keyMapper = {
        
        9: 'tab',       // tab
        13: 'ok',       // enter
        16: 'shift',    // shift
        17: 'control',  // control
        18: 'control',  // alt
        27: 'escape',   // escape
        32: 'ok',       // space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        37: 'left',     // left arrow
        38: 'up',       // up arrow
        39: 'right',    // right arrow
        40: 'down',     // down arrow
        45: 'escape',   // insert
        81: 'pageup',   // Q
        87: 'pagedown', // W
        88: 'escape',   // X
        90: 'ok',       // Z
        96: 'escape',   // numpad 0
        98: 'down',     // numpad 2
        100: 'left',    // numpad 4
        102: 'right',   // numpad 6
        104: 'up',      // numpad 8
        120: 'debug'    // F9
    };
    */
 })();

