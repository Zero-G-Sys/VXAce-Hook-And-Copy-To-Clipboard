//=============================================================================
// ZERO_webpSupport.js
//=============================================================================
/*:
 * @ZERO_webpSupport
 * @plugindesc Add support for webp images
 * @version 1.2
 * @author Zero_G
 * @filename ZERO_webpSupport.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 Add support for webp images

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 == Changelog ==
 1.2 Add parameter to check for specific folders only
 1.1 Fixed bug when checking if webp resource existed
 
 -------------------------------------------------------------------------------

 @param Folders to include
 @desc Search for webp only in the following folders. Leave it empty if you
       want to check globally. Add folders separated by a | character.
       Ex: pictures|system.
       Usefull if you only convert resoruces on one folder and don't want the 
       engine to make useless I/O checks for the rest of the folders.
 @default 

 -------------------------------------------------------------------------------
*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_webpSupport = 1;
ZERO.webpSupport = ZERO.webpSupport || {};

(function ($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);

    $.onlyIncludeFolders = $.params['Folders to include'].split('|').filter(item => item.trim());
    var fs = require('fs'); // load fs module

    // Check if webp exists and it's in selected folder, else load as png resource
    function setPath(folder,filename){
        if($.onlyIncludeFolders.length == 0 || $.onlyIncludeFolders.some(item => folder.includes(item))){
            let localFolder = folder;
		    if(!process.cwd().includes('www')) localFolder = 'www/' + localFolder;
            if(fs.existsSync(localFolder + filename + '.webp')) return folder + encodeURIComponent(filename) + '.webp';
            else return folder + encodeURIComponent(filename) + '.png';
        } else return folder + encodeURIComponent(filename) + '.png';
    }

    // Override
    ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
        if (filename) {
            var path = setPath(folder,filename);
            var bitmap = this.loadNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };

    // Override
    ImageManager.reserveBitmap = function(folder, filename, hue, smooth, reservationId) {
        if (filename) {
            var path = setPath(folder,filename);
            var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };

    // Override
    ImageManager.requestBitmap = function(folder, filename, hue, smooth) {
        if (filename) {
            var path = setPath(folder,filename);
            var bitmap = this.requestNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    };
  
})(ZERO.webpSupport);
