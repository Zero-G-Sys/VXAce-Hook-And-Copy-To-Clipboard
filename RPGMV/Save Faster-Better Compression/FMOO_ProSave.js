//=============================================================================
// FMOO_ProSave.js
//=============================================================================

/*:
 * @plugindesc (v1.0) Initial release with support for "deflate" compression
 * @author fmoo
 *
 * @param localCompression
 * @text Local Compression
 * @desc Enables alternative compression for local saves
 * @type select
 * @option default (lz-string)
 * @value 0
 * @option zlib (deflate)
 * @value 1
 * @default 0
 *
 * @help  
 * =============================================================================
 * +++ FMOO - Pro Save (v1.0) +++
 * By fmoo
 * https://fmoo.itch.io/rmmv-prosave
 * =============================================================================
 * 
 * Improves performance of the System Save/Load.
 * 
 * By default, RPGMaker uses "lz-string" compression, which is decent, but can
 * be prohibitively slow as your saves get closer to and over 1MB.
 *
 * Enabling this plugin adds support for decoding both lz-string and zlib
 * compressed save files.
 * 
 * Enable zlib (deflate) compression by setting the `localCompression`
 * parameter.  Testing on large saves reduced save time by 94% (15s -> 1s),
 * and file size by 29% (1.3MB -> 930kB).
 * 
 * NOTE: Once any data is saved locally with `localCompression`, this plugin
 * MUST remain enabled in order to decode your save data.
 *
 * =============================================================================
 * HISTORY
 * ============================================================================= 
 * (v1.0) - Initial release.
 */



//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
var Imported = Imported || {};
Imported.FMOO_ProSave = true;
var Fmoo = Fmoo || {};

Fmoo.parameters = PluginManager.parameters('FMOO_ProSave');

var _fmoo_SavePrefix = '@@__FMOO_PROSAVE__@@';
Fmoo.useZlib = Fmoo.parameters['localCompression'] || 0;

//=============================================================================
// ** LZString
//=============================================================================

//==============================
// * compressToBase64
//==============================
var _fmoo_lzs_c2b64 = LZString.compressToBase64;
LZString.compressToBase64 = function (data) {
    console.log('FMOO_ProSave.compressToBase64', StorageManager.isLocalMode(), Fmoo.useZlib);
    if (StorageManager.isLocalMode() && Fmoo.useZlib == 1) {
        var zlib = require('zlib');
        return _fmoo_SavePrefix + zlib.deflateRawSync(new Buffer(data)).toString("base64");;
    }
    return _fmoo_lzs_c2b64(data);
};

//==============================
// * decompressFromBase64
//==============================
var _fmoo_lzs_dfb64 = LZString.decompressFromBase64;
LZString.decompressFromBase64 = function (data) {
    console.log('FMOO_ProSave.decompressFromBase64', StorageManager.isLocalMode(), data.startsWith(_fmoo_SavePrefix));
    if (StorageManager.isLocalMode() && data.startsWith(_fmoo_SavePrefix)) {
        var zlib = require('zlib');
        return zlib.inflateRawSync(new Buffer(data.slice(_fmoo_SavePrefix.length), 'base64')).toString();
    }
    return _fmoo_lzs_dfb64(data);
};
