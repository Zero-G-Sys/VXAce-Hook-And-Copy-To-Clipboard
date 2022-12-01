var yanflyParamNormalEndSwitch = 0;
var yanflyParamAbnormalEndSwitch = 0;

//=============================================================================
// Yanfly Engine Plugins - External Links
// YEP_ExternalLinks.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_ExternalLinks = true;

var Yanfly = Yanfly || {};
Yanfly.LINK = Yanfly.LINK || {};
Yanfly.LINK.version = 1.00

//=============================================================================
 /*:
 * @plugindesc v1.01 Link back to your home page through the title screen
 * and also be able to link your players from within the game.
 * @author Yanfly Engine Plugins
 *
 * @param Home Page URL
 * @desc Places a link to your website homepage at the title screen.
 * Leave this blank if you don't wish to enable this feature.
 * @default https://www.google.com/
 *
 * @param Home Page Text
 * @desc This is how 'Home Page' will appear on the title screen.
 * @default Home Page
 *
 * @param Popup Blocker Notice
 * @desc This is a window to notify the player the link was blocked
 * by a pop-up blocker.
 * @default The link was blocked by a pop-up blocker.
 *
 * @help
 * ============================================================================
 * Introduction                                                     .
 * ============================================================================
 * This plugin allows you to place a "link" to your home page at the title
 * screen's command window towards the bottom. To adjust where the link goes,
 * change the Home Page URL in the plugin's parameters.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * If you wish to send players to other links, you can use the following
 * plugin commands.
 *
 * Plugin Command
 *   OpenNewTab http://www.google.com/     Opens link in a new tab.
 *   OpenNewWindow http://www.google.com/  Opens link in a new window.
 *
 * Some web browsers may not differentiate these commands too much.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.00:
 * - Finished Plugin!
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_ExternalLinks');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.HomePageUrl = String(Yanfly.Parameters['Home Page URL']);
Yanfly.Param.HomePageText = String(Yanfly.Parameters['Home Page Text']);
Yanfly.Param.PopupMessage = String(Yanfly.Parameters['Popup Blocker Notice']);

//=============================================================================
// SceneManager
//=============================================================================

SceneManager.openPopupBlockerMessage = function() {
	this._scene.openPopupBlockerMessage();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.LINK.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Yanfly.LINK.Game_Interpreter_pluginCommand.call(this, command, args)
    if (command === 'OpenNewTab') this.openNewTab(args);
		if (command === 'OpenNewWindow') this.openNewWindow(args);
};

Game_Interpreter.prototype.openNewTab = function(args) {
	TouchInput.clear();
	Input.clear();
	var url = String(args[0]);
	var win = window.open(url, '_blank');
	if (win) {
		win.focus();
	} else {
		SceneManager.openPopupBlockerMessage();
	}
};

Game_Interpreter.prototype.openNewWindow = function(args) {
	TouchInput.clear();
	Input.clear();
	var url = String(args[0]);
	var win = window.open(url);
	if (win) {
		win.focus();
	} else {
		SceneManager.openPopupBlockerMessage();
	}
};

//=============================================================================
// Window_TitleCommand
//=============================================================================

Yanfly.LINK.Window_TitleCommand_makeCommandList =
		Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
    Yanfly.LINK.Window_TitleCommand_makeCommandList.call(this);
		//this.addHomePageCommand();
};

Window_TitleCommand.prototype.addHomePageCommand = function() {
	this.addCommand(Yanfly.Param.HomePageText, 'homePage');
};

//=============================================================================
// Window_PopupBlocker
//=============================================================================

function Window_PopupBlocker() {
    this.initialize.apply(this, arguments);
}

Window_PopupBlocker.prototype = Object.create(Window_Base.prototype);
Window_PopupBlocker.prototype.constructor = Window_PopupBlocker;

Window_PopupBlocker.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
		this.resizeWindow();
		this.refresh();
		this.openness = 0;
};

Window_PopupBlocker.prototype.resizeWindow = function() {
		this.width = this.windowWidth();
		this.createContents();
		this.x = (Graphics.boxWidth - this.width) / 2;
		this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_PopupBlocker.prototype.windowWidth = function() {
		return this.textWidth(Yanfly.Param.PopupMessage);
};

Window_PopupBlocker.prototype.refresh = function() {
		this.contents.clear();
		this.drawText(Yanfly.Param.PopupMessage, 0, 0, this.contents.width);
};

//=============================================================================
// Scene_Base
//=============================================================================

Yanfly.LINK.Scene_Base_createWindowLayer =
		Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
		Yanfly.LINK.Scene_Base_createWindowLayer.call(this);
		this.createPopupBlockerMessage();
};

Scene_Base.prototype.createPopupBlockerMessage = function() {
    if (this._popupBlockerWindow) return;
		this._popupBlockerWindow = new Window_PopupBlocker();
		this.addWindow(this._popupBlockerWindow);
		this._popupCounter = 0;
};

Yanfly.LINK.Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    Yanfly.LINK.Scene_Base_update.call(this);
		this.updatePopupBlockerMessage();
};

Scene_Base.prototype.updatePopupBlockerMessage = function() {
		if (!this._popupBlockerWindow) return;
		if (this._popupBlockerWindow.isClosed()) return;
		if (--this._popupCounter > 0) return;
		this.closePopupBlockerMessage();
};

Scene_Base.prototype.openPopupBlockerMessage = function() {
		this._popupBlockerWindow.open();
		this._popupBlockerWindow.activate();
		this._popupCounter = 180;
};

Scene_Base.prototype.closePopupBlockerMessage = function() {
		if (!this._popupBlockerWindow) return;
		if (this._popupBlockerWindow.isClosed()) return;
		this._popupBlockerWindow.close();
		this._popupBlockerWindow.deactivate();
};

//=============================================================================
// Scene_Base
//=============================================================================

Yanfly.LINK.Scene_Title_createCommandWindow =
		Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    Yanfly.LINK.Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler('homePage', this.commandHomePage.bind(this));
};

Scene_Title.prototype.commandHomePage = function() {
	TouchInput.clear();
	Input.clear();
	this._commandWindow.activate();
	
	const commander = GameStartUpWebSite.getInstance();
    commander.execute(Yanfly.Param.HomePageUrl);
	return;
	
	var win = window.open(Yanfly.Param.HomePageUrl, '_blank');
	if (win) {
		win.focus();
	} else {
		SceneManager.openPopupBlockerMessage();
	}
};


//=============================================================================
// End of File
//=============================================================================


//=============================================================================
    // GameChildProcess
    //  node.jsのchild_processを用いてコマンド実行を実現する基底クラスです。
    //=============================================================================
    class GameChildProcess {
        constructor() {
            this._normalSwitchId   = yanflyParamNormalEndSwitch;
            this._abnormalSwitchId = yanflyParamAbnormalEndSwitch;
        }

        setResultSwitchId(normalSwitchId, abnormalSwitchId) {
            this.setNormalSwitchId(normalSwitchId || yanflyParamNormalEndSwitch);
            this.setAbnormalSwitchId(abnormalSwitchId || yanflyParamAbnormalEndSwitch);
        }

        setNormalSwitchId(switchId) {
            this._normalSwitchId = switchId;
        }

        setAbnormalSwitchId(switchId) {
            this._abnormalSwitchId = switchId;
        }

        execute() {
            this.executeChildProcess(this.getCommand.apply(this, arguments));
        }

        executeChildProcess(command) {
            this.outputDebugLog('*** Execute Command : ' + command);
            this.setResultSwitch(this._normalSwitchId, false);
            this.setResultSwitch(this._abnormalSwitchId, false);
            const childProcess = require('child_process');
            const promise = new Promise(function(resolve, reject) {
                childProcess.exec(command, function(error, stdout, stderr) {
                    if (stdout) this.outputDebugLog(stdout);
                    if (stderr) this.outputDebugLog(stderr);
                    return error ? reject(error) : resolve();
                }.bind(this));
            }.bind(this));
            promise.then(this.onNormalEnd.bind(this), this.onAbnormalEnd.bind(this));
        }

        onNormalEnd() {
            this.setResultSwitch(this._normalSwitchId, true);
            this.outputDebugLog('*** Command Normal End ***');
        }

        onAbnormalEnd(error) {
            this.setResultSwitch(this._abnormalSwitchId, true);
            this.outputErrorLog(error);
            this.outputDebugLog('*** Command Abnormal End ***');
        };

        setResultSwitch(switchId, value) {
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, value);
            }
        }

        outputDebugLog() {
            this.outputLog(false, arguments);
        };

        outputErrorLog() {
            this.outputLog(true, arguments);
        };

        outputLog(errorFlg, args) {
            if (!$gameTemp.isPlaytest() && !errorFlg) return;
            //this.showDevTool();
            //console[errorFlg ? 'error' : 'log'].apply(console, args);
        }

        showDevTool() {
            const gameWindow = require('nw.gui').Window.get();
            if (gameWindow.isDevToolsOpen()) return;
            const devTool = gameWindow.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(gameWindow.screenX + gameWindow.outerWidth, gameWindow.screenY + gameWindow.outerHeight);
            gameWindow.focus();
        };

        getCommand() {
            return '';
        }

        static getInstance() {
            return this.isNwjs() ? (this.isWindows() ? this.getWindowsInstance() : this.getMacInstance()) :
                this.getNoNwjsInstance();
        }

        static getDefaultInstance() {
            return new GameEmptyProcess();
        }

        static getWindowsInstance() {
            return this.getDefaultInstance();
        }

        static getMacInstance() {
            return this.getDefaultInstance();
        }

        static getNoNwjsInstance() {
            return this.getDefaultInstance();
        }

        static isWindows() {
            return process.platform === 'win32';
        }

        static isNwjs() {
            return Utils.isNwjs();
        }
    }

    //=============================================================================
    // GameEmptyProcess
    //  実行不可能な環境では何も実行しません。
    //=============================================================================
    class GameEmptyProcess extends GameChildProcess {
        execute() {
            console.log('指定した動作はこの環境では実行できません。');
        }
    }
	
	//=============================================================================
    // GameFileDownload
    //  ファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownload extends GameChildProcess {
        execute(url, localDir) {
            const path        = require('path');
            const projectBase = path.dirname(process.mainModule.filename);
            const localPath   = path.join(projectBase, localDir) + path.basename(url, true);
            super.execute(url, localPath);
        }

        static getWindowsInstance() {
            return new GameFileDownloadWindows();
        }

        static getMacInstance() {
            return new GameFileDownloadMac();
        }
    }

    //=============================================================================
    // GameFileDownloadWindows
    //  Windowsでファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownloadWindows extends GameFileDownload {
        getCommand(url, localPath) {
            return `bitsadmin.exe /TRANSFER FILE_DOWNLOAD ${url} ${localPath}`;
        }
    }

    //=============================================================================
    // GameFileDownloadMac
    //  Macでファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownloadMac extends GameFileDownload {
        getCommand(url, localPath) {
            return `curl ${url} -o ${localPath}`;
        }
    }

    //=============================================================================
    // GameStartUpWebSite
    //  ウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSite extends GameChildProcess {
        static getWindowsInstance() {
            return new GameStartUpWebSiteWindows();
        }

        static getMacInstance() {
            return new GameStartUpWebSiteMac();
        }

        static getNoNwjsInstance() {
            return new GameStartUpWebSiteNoNwjs();
        }
    }

    //=============================================================================
    // GameStartUpWebSiteWindows
    //  Windowsでウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSiteWindows extends GameStartUpWebSite {
        getCommand(url) {
            return `rundll32.exe url.dll,FileProtocolHandler "${url}"`;
        }
    }

    //=============================================================================
    // GameStartUpWebSiteMac
    //  Macでファイルダウンロードを実現します。
    //=============================================================================
    class GameStartUpWebSiteMac extends GameStartUpWebSite {
        getCommand(url) {
            return `open "${url}"`
        }
    }

    //=============================================================================
    // GameStartUpWebSiteNoNwjs
    //  ブラウザでウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSiteNoNwjs extends GameStartUpWebSite {
        execute(url) {
            window.open(url);
        }
    }
