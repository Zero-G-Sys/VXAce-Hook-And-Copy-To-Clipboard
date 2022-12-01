//=============================================================================
// TextSpeed
//=============================================================================
/*:
* @TextSpeed
* @plugindesc Text speed control, slow/fast/instant text
* @version 1.2
* @author Zero_G
* @filename ZERO_TextSpeed.js
* @help
-------------------------------------------------------------------------------
== Description ==
Script allows to change the default text speed of message boxes.
Adds Message Speed in options menu

== Usage ==
Set the 'Default text speed' parameter to a value between 0-6.
Speed can be modified from in game menu.

Default possible values:
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

== Changelog ==
1.2 - Fix a bug where sometimes the next letter would be displayed when
      using wait escape codes ( \. or \| or \! )
1.1 - Change speed options to customizable text.
1.0 - Initial Release.

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

@param Text Speed 1
@desc Option display text for 1/3 speed
@default Slower

@param Text Speed 2
@desc Option display text for half speed
@default Slow

@param Text Speed 3
@desc Option display text for normal speed
@default Normal

@param Text Speed 4
@desc Option display text for between normal and double speed
@default Fast

@param Text Speed 5
@desc Option display text for double speed
@default Faster

@param Text Speed 6
@desc Option display text for triple speed
@default Fastest

@param Text Speed 7
@desc Option display text for instant text
@default Instant
-------------------------------------------------------------------------------

*/

var Imported = Imported || {};
var ZERO = ZERO || {};
Imported.ZERO_TextSpeed = 1;
ZERO.TextSpeed = ZERO.TextSpeed || {};

(function($) {
    // Get plugin name and parameters
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    $.params = PluginManager.parameters(scriptName);

    $.textSpeed = Number($.params["Default text speed"].trim());
    $.menuText = $.params["Option menu text"].trim();
    $.textSpeed1 = $.params["Text Speed 1"].trim();
    $.textSpeed2 = $.params["Text Speed 2"].trim();
    $.textSpeed3 = $.params["Text Speed 3"].trim();
    $.textSpeed4 = $.params["Text Speed 4"].trim();
    $.textSpeed5 = $.params["Text Speed 5"].trim();
    $.textSpeed6 = $.params["Text Speed 6"].trim();
    $.textSpeed7 = $.params["Text Speed 7"].trim();

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
            switch(value){
                case 0: return $.textSpeed1;
                case 1: return $.textSpeed2;
                case 2: return $.textSpeed3;
                case 3: return $.textSpeed4;
                case 4: return $.textSpeed5;
                case 5: return $.textSpeed6;
                case 6: return $.textSpeed7;
            }
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

    // Retrieve Message Speed from config
    Window_Message.prototype.messageSpeed = function() {
        return ConfigManager.messageSpeed.clamp(0, 6);
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
                        this.processCharacter2(this._textState);
                        this.startWait(1);
                        this.processCharacter2(this._textState);
                        break
                    case 4:
                        this.processCharacter2(this._textState);
                        break
                    case 5:    
                        this.processCharacter2(this._textState);
                        this.processCharacter2(this._textState);
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

    /* 
     * Call process character checking first if the next character is
     * a wait \. \| or \! 
     * In that case ignore it and let the default processCharacter handle it
     */
    Window_Base.prototype.processCharacter2 = function(textState) {
        let process = true;

        if(textState.text[textState.index] == '\x1b'){
            let escapeChar = this.obtainEscapeCodeWithoutIncrementingIndex(this._textState);
            
            switch(escapeChar) {
                case '.':
                case '|':
                case '!':
                    process = false;
                    break;
            }
        }

        if (process) this.processCharacter(textState);
    }


    Window_Base.prototype.obtainEscapeCodeWithoutIncrementingIndex = function(textState) {
        //textState.index++;
        var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
        var arr = regExp.exec(textState.text.slice(textState.index + 1));
        if (arr) {
            //textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return '';
        }
    };
})(ZERO.TextSpeed);