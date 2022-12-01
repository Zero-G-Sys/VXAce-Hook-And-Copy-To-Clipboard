//=============================================================================
// TextSpeed
//=============================================================================
/*:
* @TextSpeed
* @plugindesc Text speed control, slow/fast/instant text
* @version 1.0
* @author Zero_G
* @filename TextSpeed.js
* @help
-------------------------------------------------------------------------------
== Description ==
Script allows to change the default text speed of message boxes.
Adds Message Speed in options menu

== Usage ==
Set the 'Default text speed' parameter to a value between 0-6.
Speed can be modified from in game menu.

0 = 1/3 speed
1 = Half speed
2 = Normal speed
3 = Between normal and double speed
4 = Double speed
5 = Triple speed
6 = Instant speed

== Credits ==
-Krimer for base script
-Most of option menu based on Yanfly - MessageSpeedOpt

== Terms of Use ==
 - Free for use in non-commercial projects
 - Free for use in commercial projects
 - Please provide credits to Zero_G


-------------------------------------------------------------------------------
@param Default text speed
@desc Default text speed for menu.
@default 4

@param Option menu text
@desc The name of the option to be used.
@default Message Speed
-------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_TextSpeed = 1;
ZERO.TextSpeed = ZERO.TextSpeed || {};

(function($) {
    $.params = PluginManager.parameters("TextSpeed");
    $.textSpeed = Number($.params["Default text speed"].trim());
    $.menuText = $.params["Option menu text"].trim();

    /*
     * Add option in menu
     */
    // ---Config Manager---
    var ZERO_ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = ZERO_ConfigManager_makeData.apply(this, arguments);
        config.messageSpeed = this.messageSpeed;
        return config;
    };

    var ZERO_ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        ZERO_ConfigManager_applyData.apply(this, arguments);
        this.messageSpeed = this.readConfigMessageSpeed(config, 'messageSpeed');
    };

    // This replaces readFlag function as it will not read a value if there is no configuration file
    ConfigManager.readConfigMessageSpeed = function(config, name) {
		var value = config[name];
        if (value !== undefined) {
            return value;
        } else {
            return $.textSpeed;
        }
    };

    // ---Window Options---
    var ZERO_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        ZERO_Window_Options_addGeneralOptions.apply(this, arguments);
        this.addCommand($.menuText, 'messageSpeed');
    };

    var ZERO_Window_Options_prototype_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (symbol === 'messageSpeed') {
            return toGroup(value);
        } else {
            return ZERO_Window_Options_prototype_statusText.call(this, index);
        }
    };

    var ZERO_Window_Options_prototype_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'messageSpeed') {
        var value = this.getConfigValue(symbol);
        value += 1;
        if (value > 6) value = 0;
        value = value.clamp(0, 6);
        this.changeValue(symbol, value);
    } else {
        ZERO_Window_Options_prototype_processOk.call(this);
    }
    };

    var ZERO_Window_Options_prototype_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'messageSpeed') {
        var value = this.getConfigValue(symbol);
        value += 1;
        value = value.clamp(0, 6);
        this.changeValue(symbol, value);
    } else {
        ZERO_Window_Options_prototype_cursorRight.call(this, wrap);
    }
    };

    var ZERO_Window_Options_prototype_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'messageSpeed') {
        var value = this.getConfigValue(symbol);
        value -= 1;
        value = value.clamp(0, 6);
        this.changeValue(symbol, value);
    } else {
        ZERO_Window_Options_prototype_cursorLeft.call(this, wrap);
    }
    };

    /*
     * Modify updateMessage function
     * Message speed functionality is here
     * Double speed will call processCharacter two times
     */
    Window_Message.prototype.updateMessage = function() {
        if (this._textState) {
            while (!this.isEndOfText(this._textState)) {
                if (this.needsNewPage(this._textState)) {
                    this.newPage(this._textState);
                }
                this.updateShowFast();
                switch (this.messageSpeed()) {
                    case 0:
                        this.startWait(2);
                        break
                    case 1:
                        this.startWait(1);
                        break
                    case 2:
                        break
                    case 3:    
                        this.processCharacter(this._textState);
                        this.startWait(1);
                        this.processCharacter(this._textState);
                        break
                    case 4:
                        this.processCharacter(this._textState);
                        break
                    case 5:    
                        this.processCharacter(this._textState);
                        this.processCharacter(this._textState);
                        break
                    case 6:
                        this._showFast = true;
                        break
                    default:
                        break
                }
                this.processCharacter(this._textState);
                if (!this._showFast && !this._lineShowFast) {
                    break;
                }
                if (this.pause || this._waitCount > 0) {
                    break;
                }
            }
            if (this.isEndOfText(this._textState)) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    };

    // Retrieve Message Speed from config
    Window_Message.prototype.messageSpeed = function() {
        return ConfigManager.messageSpeed.clamp(0, 6);
    };


    // Yanfly Util toGroup (needed for config menu)
    if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= '1.5.0') {
        function toGroup(inVal) {
            if (typeof inVal === 'string') return inVal;
            return inVal.toLocaleString('en');
            return inVal.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
                return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
            });
        };
    } else {
        function toGroup(inVal) {
            if (typeof inVal !== 'string') { inVal = String(inVal); }
            return inVal.toLocaleString('en');
            return inVal.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
                return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
            });
        };
    }
})(ZERO.TextSpeed);