//=============================================================================
// Blackmorning Engine Plugins - Shop Core
// BM_ShopCore.js
//=============================================================================

var Imported = Imported || {};
Imported.BM_ShopCore = true;

var BM = BM || {};
//=============================================================================
 /*:
 * @plugindesc Shop Scene (v1.20) 
 * Shop layout setup
 * @author Blackmorning
 *
 * @param ---General---
 * @default
 *
 * @param CommandWindowAlign
 * @parent ---General---
 * @type combo
 * @option left
 * @option right
 * @desc Location of the command window.
 * left     right
 * @default right
 *
 * @param CommandColumns
 * @parent ---General---
 * @type number
 * @min 1
 * @desc Number of columns in the command window.
 * default for basic 3, yanfly 1
 * @default 3
 *
 * @param CommandRows
 * @parent ---General---
 * @type number
 * @min 1
 * @desc Number of rows visible in the command window.
 * default for basic 1, yanfly 4
 * @default 1
 *
 * @param CommandWindowFull
 * @parent ---General---
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Command window goes all the way across (best with 1 row)
 * NO - false     YES - true
 * @default false
 *
 * @param ---Status Window---
 * @default
 * 
 * @param StatusWindowWidth
 * @parent ---Status Window---
 * @type number
 * @min 1
 * @desc Width of the Shop Status window. 
 * default 400
 * @default 400
 *
 * @param ParametersFontSize
 * @parent ---Status Window---
 * @type number
 * @min 1
 * @desc Font size of parameters.
 * @default 20
 *
 * @param ---Status Actor Display---
 * @default
 * 
 * @param ShopActorParameters
 * @parent ---Status Actor Display---
 * @desc Parameters shown when comparing equipment. 
 * Separate parameters by a space. * see help * 
 * @default mhp mmp atk def mat mdf agi hit cri
 *
 * @param DisplayActors
 * @parent ---Status Actor Display---
 * @type number
 * @min 0
 * @desc Display a comparison for actors (# per page) or special
 * # actors per page     0 - special display (single actor)
 * @default 4
 *
 * @param CantEquipTxt
 * @parent ---Status Actor Display---
 * @desc Text for when actor can't equip item for special display
 * @default Can't Equip
 *
 * @param EquippedTxt
 * @parent ---Status Actor Display---
 * @desc Text for number of equipment worn (
 * if blank, number of equipment worn not shown
 * @default Equipped
 *
 * @param ShowDifference
 * @parent ---Status Actor Display---
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Show the change in parameters for special display?
 * NO - false     YES - true
 * @default true
 *
 * @param ComparePlusIcon
 * @parent ---Status Actor Display---
 * @desc Choose icon to show positive stat changes. 
 * default - leave blank to show none.
 * @default
 *
 * @param CompareMinusIcon
 * @parent ---Status Actor Display---
 * @desc Choose icon to show negative stat changes. 
 * default - leave blank to show none.
 * @default
 *
 * @param ---Number Window---
 * @default
 *
 * @param ShowTouchButtons
 * @parent ---Number Window---
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Always show touch buttons?
 * NO - false     YES - true
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Title: BM Shop Scene
 * Author: Blackmorning
 * Version: 1.21
 * Website: http://bmscripts.weebly.com/mv-shop.html

 * - Decide what parameters to show/compare (using symbols in table below)
 * - parameter percentage added directly to comparison
 * - Customize layout of shop
 * - added information on items, equipment
 * - choose between special single actor or group comparison
 *
 * -- Compatiblity --
 *
 * - YEP Shop Core (Put YEP above this script)
 * ============================================================================
 * Instructions
 * ============================================================================
 * Table of built-in parameters:
 * ============================
 * | Symbol |      Name       |
 * ============================
 * | mhp    | Max HP          |
 * | mmp    | Max MP          |
 * | atk    | Attack          |
 * | def    | Defense         |
 * | mat    | M.Attack        |
 * | mdf    | M.Defense       |
 * | agi    | Agility         |
 * | luk    | Luck            |
 * =======================================
 * | hit    | Hit Rate        | percent  |
 * | eva    | Evasion         | percent  |
 * | cri    | Critical Rate   | percent  |
 * | cev    | Crit Evasion    | percent  |
 * | mev    | Magic Evasion   | percent  |
 * | mrf    | M. Reflection   | percent  |
 * | cnt    | Counterattack   | percent  |
 * | hrg    | HP Regen Rate   | percent  |
 * | mrg    | MP Regen Rate   | percent  |
 * | trg    | TP Regen Rate   | percent  |
 * =======================================
 * | tgr    | Target Rate     | percent  |
 * | grd    | Guard Effect    | percent  |
 * | rec    | Recovery Effect | percent  |
 * | pha    | Pharmacology    | percent  |
 * | mcr    | MP Cost Rate    | percent  |
 * | tcr    | TP Cost Rate    | percent  |
 * | pdr    | Phys Damage %   | percent  |
 * | mdr    | Magic Damage %  | percent  |
 * | fdr    | Floor Damage %  | percent  |
 * | exr    | Exp Gain Rate   | percent  |
 * =======================================
 *
 * ============================================================================
 * Changelog
 ============================================================================
 * Version 1.21: 2018-Apr-01
 * - fixed error with parameters
 * Version 1.20: 2018-Mar-16
 * - compatibility with EIS Shop System
 * - updated for RPG Maker MV version 1.5.0
 * Version 1.10: 2017-Feb-23
 * - added info from YEP ShopCore
 * Version 1.00: 2016-Jun-03
 * - Finished plugin!
 */
//=============================================================================
BM.Parameters = PluginManager.parameters('BM_ShopCore');
BM.Shop = BM.Shop || {};
BM.Icon = BM.Icon || {};
BM.Vocab = BM.Vocab || {};
BM.Shop.version = 1.21

BM.Shop.CommandWindowAlign = String(BM.Parameters['CommandWindowAlign']);
BM.Shop.CommandColumns = Number(BM.Parameters['CommandColumns']);
BM.Shop.CommandRows = Number(BM.Parameters['CommandRows']);
BM.Shop.CommandWindowFull = eval(String(BM.Parameters['CommandWindowFull']));
BM.Shop.StatusWidth = Number(BM.Parameters['StatusWindowWidth']);
BM.Shop.ParamFontSize = Number(BM.Parameters['ParametersFontSize']);

BM.Shop.SDisplayActors = Number(BM.Parameters['DisplayActors']);
BM.Shop.SShowDifference = eval(String(BM.Parameters['ShowDifference']));
BM.Shop.CantEquipTxt = String(BM.Parameters['CantEquipTxt'])
BM.Shop.EquippedTxt = String(BM.Parameters['EquippedTxt'] || '')
BM.Shop.ShowTouchButtons = eval(String(BM.Parameters['ShowTouchButtons']));

BM.Icon.Plus = Number(BM.Parameters['ComparePlusIcon']);
BM.Icon.Minus = Number(BM.Parameters['CompareMinusIcon']);

BM.Data = String(BM.Parameters['ShopActorParameters']);
BM.Data = BM.Data.split(' ');
BM.Shop.SActorParam = [];
for (BM.i = 0; BM.i < BM.Data.length; ++BM.i) {
  BM.Shop.SActorParam.push(BM.Data[BM.i]);
};
//=============================================================================
if (!Imported.BM_EquipCore){
TextManager.paramName = function(paramName) {
	var name = ''
	if(!name || name == '') {
		switch(paramName){
			case 'mhp':
			return $dataSystem.terms.params[0] || '';
			case 'mmp':
			return $dataSystem.terms.params[1] || '';
			case 'atk':
			return $dataSystem.terms.params[2] || '';
			case 'def':
			return $dataSystem.terms.params[3] || '';
			case 'mat': 
			return $dataSystem.terms.params[4] || '';
			case 'mdf':
			return $dataSystem.terms.params[5] || '';
			case 'agi':
			return $dataSystem.terms.params[6] || '';
			case 'luk':
			return $dataSystem.terms.params[7] || '';
			case 'hit':
			return $dataSystem.terms.params[8] || '';
			case 'eva':
			return $dataSystem.terms.params[9] || '';
		}
	}
	if (!name || name == "undefined"){
		name = capitalize_Words(paramName)
	}	
	return name
};
function capitalize_Words(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
//=============================================================================
Window_Base.prototype.checkParamPercent = function(paramName) {
	percent = true;
	switch(paramName){
	case 'mhp':
	case 'mmp': 
	case 'atk':
	case 'def':
	case 'mat':
	case 'mdf':
	case 'agi':
	case 'luk':
	percent = false;
	break;
	}
	if (Imported.Quasi_ParamsPlus){
		for (var i = 0; i < QuasiParams._custom.length; i++) {
			if (paramName == QuasiParams._customAbr(i)){	
				percent = false;
				break;
			}
		}
	}
	return percent
}
Window_Base.prototype.textLineHeight = function() {
	return (this.contents.fontSize + this.textPadding()*2)
};
Window_Base.prototype.drawDarkRect = function(dx, dy, dw, dh) {
    var color = this.gaugeBackColor();    
    this.changePaintOpacity(false);    
    this.contents.fillRect(dx + 1, dy + 1, dw - 2, dh - 2, color);    
    this.changePaintOpacity(true);
};
}
Window_Base.prototype.calculateHeight = function(y, list, height) {
	height = height || this.contents.height;
	this._plist = 0
	this._newPY = 0	
	var h = height - y;
	var tf = h / this.textLineHeight();
	var pf = Math.floor(Math.min(tf,list.length));
	var dh = pf * this.textLineHeight();
	var dy = Math.floor((h - dh)/2);
	this._newPY = y + dy
	this._plist = pf
}
//=============================================================================
Game_Actor.prototype.forceChangeEquipById = function(etypeId, itemId) {
    var slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.forceChangeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.forceChangeEquip(slotId, $dataArmors[itemId]);
    }
};
//=============================================================================
Window_ShopCommand.prototype.windowWidth = function() {
	if (BM.Shop.CommandWindowFull){
		return Graphics.width
	} else {
		return Graphics.width - BM.Shop.StatusWidth;
	}    
};
Window_ShopCommand.prototype.maxCols = function() {
    return BM.Shop.CommandColumns;
};
Window_ShopCommand.prototype.numVisibleRows = function() {
    return BM.Shop.CommandRows;
};
//=============================================================================
Window_ShopBuy.prototype.windowWidth = function() {
    return Graphics.width - BM.Shop.StatusWidth;
};
Window_ShopBuy.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = this.textWidth(this.price(item));
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    this.drawText(this.price(item), rect.x + rect.width - priceWidth,
                  rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
};
Window_ShopSell.prototype.maxCols = function() {
    return 1;
};
Window_ShopSell.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};
Window_ShopSell.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};
//=============================================================================
var KR = KR || {};
Window_ShopStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        var x = this.textPadding();
		var y = 0
		if (KR.ShopManager){
			this.drawShopPossession(x, 0);
			y = this.lineHeight();
		}		
        this.drawPossession(x, y);
		this.contents.fontSize = BM.Shop.ParamFontSize
		if (BM.Shop.EquippedTxt != ''){
			dy = this.lineHeight()*5 + y
		}else{
			dy = this.lineHeight()*4 + y
		}
		var param = BM.Shop.SActorParam
		this.calculateHeight(dy, param)
		this.resetFontSettings();
        if (this.isEquipItem()) {
            this.drawEquipInfo(this._item);
		 } else {
			this.drawItemInfo(this._item);
		}		
    }
};
Window_ShopStatus.prototype.drawPossession = function(x, y) {
    var width = this.contents.width - this.textPadding() - x;
    var possessionWidth = this.textWidth('0000');
    this.changeTextColor(this.systemColor());
	this.drawText(TextManager.currencyUnit, x, y, width - possessionWidth);
    this.drawText(TextManager.possession, x, y + this.lineHeight(), width - possessionWidth);
    this.resetTextColor();
    this.drawText($gameParty.gold(), x, y, width, 'right');
	this.drawText($gameParty.numItems(this._item), x, y + this.lineHeight(), width, 'right');
	if ((this.isEquipItem()) && (BM.Shop.EquippedTxt != '')){
		this._equipped = 0
		var members = $gameParty.members()
		for (var i = 0; i < members.length; i++) {
			var item1 = this.currentEquippedItem(members[i], this._item.etypeId);
			if (this._item == item1){
				this._equipped += 1
			}
		}
		this.changeTextColor(this.systemColor());
		this.drawText(BM.Shop.EquippedTxt, x, y + this.lineHeight()*2, width - this.textWidth('0000'));
		this.resetTextColor();
		this.drawText(this._equipped, x, y + this.lineHeight()*2, width, 'right');
	}
};
Window_ShopStatus.prototype.pageSize = function() {
	if (BM.Shop.SDisplayActors != 0){
		return BM.Shop.SDisplayActors;
	} else{
		return 1;
	}    
};
Window_ShopStatus.prototype.createWidths = function() {
    this._paramNameWidth = 0;
    this._paramValueWidth = 0;
	this._columnSize = 0
    this._arrowWidth = this.textWidth('\u2192' + ' ');
    var buffer = this.textWidth(' ')
    for (var i = 0; i < 8; ++i) {
      var value1 = this.textWidth(TextManager.param(i));
      var value2 = this.textWidth('9999');
      this._paramNameWidth = Math.max(value1, this._paramNameWidth);
      this._paramValueWidth = Math.max(value2, this._paramValueWidth);
    }
    this._bonusValueWidth = this._paramValueWidth;
    this._bonusValueWidth += this.textWidth('(+)') + buffer;
    this._paramNameWidth += buffer;
    if (this._paramNameWidth + this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth > this.contents.width) {
		this._bonusValueWidth = 0;
	}
	this._columnSize = (this.contents.width - this._paramNameWidth/1.5) / this.pageSize()
};
Window_ShopStatus.prototype.drawEquipInfo = function(item) {
	this.createWidths()
	var param = BM.Shop.SActorParam
	var members = this.statusMembers();
	var rect = new Rectangle();
    rect.width = this.contents.width;
	for (var i = 0; i < members.length; i++) {
		var dw = this._columnSize
		cx = this.contents.width - dw*this.pageSize() + (i * dw) - this.textPadding()
		h = 0
		if (KR.Plugins){h = this.lineHeight()}
		this.drawEquipChar(members[i], cx + 32, this.lineHeight()*4 + h)
	}
    for (var i = 0; i < this._plist; ++i) {
		this.contents.fontSize = BM.Shop.ParamFontSize
		rect = this.getRectPosition(rect, i);
		var dx = rect.x + this.textPadding();
		var dw = rect.width - this.textPadding() * 2;  
		this.drawDarkRect(rect.x, rect.y, rect.width, this.textLineHeight());
		this.changeTextColor(this.systemColor());
		this.drawParamName(rect.y, param[i])
		for (var j = 0; j < members.length; j++) {
			if (BM.Shop.SDisplayActors != 0){
				var dw = this._columnSize
				cx = this.contents.width - dw*this.pageSize() + (j * dw) - this.textPadding()
				this.drawActorEquipInfo(cx, rect.y, members[j], param[i]);
			} else{
				this.drawSoloEquipInfo(this._paramNameWidth, rect.y, members[j], param[i]);
			}
		}
    }
	this.resetFontSettings();
};
Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor, param) {
    var enabled = actor.canEquip(this._item);
    this.resetTextColor();
	this.contents.fontSize = BM.Shop.ParamFontSize
	var item1 = this.currentEquippedItem(actor, this._item.etypeId);
    if (enabled) {
		this.setTempActor(actor, item1);		
		this.drawActorParamChange(x, y, actor, item1, param);
    }
	this.resetFontSettings();
};
Window_ShopStatus.prototype.drawSoloEquipInfo = function(x, y, actor, param) {
	var enabled = actor.canEquip(this._item);
    this.resetTextColor();
	this.contents.fontSize = BM.Shop.ParamFontSize
	var item1 = this.currentEquippedItem(actor, this._item.etypeId);
	if (enabled) {	    
		this.setTempActor(actor, item1);		
		this.drawSoloParamChange(x, y, param);
    } 
	this.resetFontSettings();
};
Window_ShopStatus.prototype.drawEquipChar = function(actor, x, y) {
	var enabled = actor.canEquip(this._item);
	this.changePaintOpacity(enabled);
	var item1 = this.currentEquippedItem(actor, this._item.etypeId);
	if (BM.Shop.SDisplayActors != 0){			
		this.drawActorCharacter(actor, x + 16, y)
		this.drawIcon((item1 ? item1.iconIndex : 0), x, y)
	}else{
		this.drawActorCharacter(actor, 25, y)
		this.drawText(actor.name(), 50, y - this.lineHeight(), this.contents.height - x);
		this.drawDarkRect(Window_Base._iconWidth, y, this.contents.width-this.padding-Window_Base._iconWidth/2, Window_Base._iconHeight+this.textPadding());
		if (enabled) {
			this.drawItemName(item1, Window_Base._iconWidth, y);	    
		} else{
			this.changePaintOpacity(enabled);
			this.drawText(BM.Shop.CantEquipTxt, Window_Base._iconWidth + this.textPadding(), y, this.contents.width-this.padding-Window_Base._iconWidth/2);
		};
	};
	this.changePaintOpacity(true);
}
Window_ShopStatus.prototype.getRectPosition = function(rect, i) {	
    rect.x = 0
	rect.y = this._newPY + this.textLineHeight()*i;
    return rect;
};
Window_ShopStatus.prototype.drawActorParamChange = function(x, y, actor, item1, paramName) {
	var percent = this.checkParamPercent(paramName)
    var width = this._columnSize;
	var oldValue = eval("this._actor." + paramName, this);
	var newValue = eval("this._tempActor." + paramName, this);
	var diffvalue = newValue - oldValue;
	var change = diffvalue
	if (diffvalue > 0 && BM.Icon.Plus && BM.Icon.Plus != 0){
		this.drawIcon(BM.Icon.Plus, x, y)
	}
	if (diffvalue < 0 && BM.Icon.Minus && BM.Icon.Minus != 0){
		this.drawIcon(BM.Icon.Minus, x, y)
	}
	if (percent == true) {
		change = Math.round(diffvalue * 100) + "%";
	}
	this.changeTextColor(this.paramchangeTextColor(change));
	this.drawText((diffvalue > 0 ? '+' : '') + change, x, y, width, 'right');
};
Window_ShopStatus.prototype.drawItemInfo = function(item) {
	//for plugin
};
Window_ShopStatus.prototype.setTempActor = function(actor, item1) {
	this._actor = actor
	this._tempActor = JsonEx.makeDeepCopy(actor)
	if (item1 === null){
		this._tempActor.forceChangeEquip(this._item.etypeId-1, this._item);
	} else {
		this._tempActor.forceChangeEquipById(item1.etypeId, this._item.id);
	}
}
BM.Shop.Window_ShopStatus_drawItemName = Window_ShopStatus.prototype.drawItemName;
Window_ShopStatus.prototype.drawItemName = function(item, x, y, width) {
	width = width || this.contents.width;
	BM.Shop.Window_ShopStatus_drawItemName.call(this, item, x, y, width - x - this.textPadding());    
};
Window_ShopStatus.prototype.drawParamName = function(y, paramName) {
    var x = this.textPadding()
	this.changeTextColor(this.systemColor());
	var name = TextManager.paramName(paramName);
	this.drawText(name, x, y, this._paramNameWidth);
};
Window_ShopStatus.prototype.drawSoloParamChange = function(x, y, paramName) {
    var width = this._columnSize;
	this.drawRightArrow(y);
	this.drawCurrentParam(y, paramName)
	this.drawNewParam(y, paramName)
	if (BM.Shop.SShowDifference) this.drawParamDifference(y, paramName);
};
Window_ShopStatus.prototype.drawRightArrow = function(y) {
    var x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 2 + this._arrowWidth;
    var dw = this.textWidth('\u2192' + ' ');
    this.changeTextColor(this.systemColor());
    this.drawText('\u2192', x, y, dw, 'right');
};
Window_ShopStatus.prototype.drawCurrentParam = function(y, paramName) {
	var percent = this.checkParamPercent(paramName)
	var x = this.contents.width - this.padding;
    x -= this._paramValueWidth * 3 + this._arrowWidth;
    this.resetTextColor();
	var value = eval("this._actor." + paramName, this);
	if (percent == true) {			
		value = Math.round(value * 100) + "%";
	}
	this.drawText(value, x, y, this._paramValueWidth, 'right');
};
Window_ShopStatus.prototype.drawNewParam = function(y, paramName) {
	var percent = this.checkParamPercent(paramName)
	var x = this.contents.width - this.padding;
    x -= this._paramValueWidth;
	var oldValue = eval("this._actor." + paramName, this);
	var newValue = eval("this._tempActor." + paramName, this);
    var diffvalue = newValue - oldValue;
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
	if (diffvalue > 0 && BM.Icon.Plus && BM.Icon.Plus != 0){
		this.drawIcon(BM.Icon.Plus, x, y)
	}
	if (diffvalue < 0 && BM.Icon.Minus && BM.Icon.Minus != 0){
		this.drawIcon(BM.Icon.Minus, x, y)
	}
	if (percent == true) {			
		newValue = Math.round(newValue * 100) + "%";
	}
    this.drawText(newValue, 0, y, this.contents.width, 'right');
};
Window_ShopStatus.prototype.drawParamDifference = function(y, paramName) {
	var percent = this.checkParamPercent(paramName)
	this.contents.fontSize = BM.Shop.ParamFontSize/1.5
    var x = this.contents.width - this.textPadding();
	x -= this._paramValueWidth * 2 + this._arrowWidth/2;
	var oldValue = eval("this._actor." + paramName, this);
	var newValue = eval("this._tempActor." + paramName, this);
	var diffvalue = newValue - oldValue;
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    var text = diffvalue;
	if (percent == true) {
		text = Math.round(text * 100) + "%";
	}
    text = (diffvalue > 0 ? '+' : '') + text
	text = (diffvalue != 0 ? '(' + text + ')' : '')
    this.drawText(text, x, y - this.contents.fontSize/1.5, this._bonusValueWidth, 'left');
};
//=============================================================================
Window_ShopNumber.prototype.windowWidth = function() {
    return Graphics.width - BM.Shop.StatusWidth;
};
Window_ShopNumber.prototype.refresh = function() {
    this.contents.clear();
	this.drawDarkRect(0, 0, this.contents.width, this.textLineHeight());
    this.drawItemName(this._item, 0, 0);
	this.drawItemEntry();
	this.drawInitialPrice()
    this.drawMultiplicationSign();
    this.drawNumber();
    this.drawTotalPrice();
};

Window_ShopNumber.prototype.drawItemEntry = function() {
	if (!this._item) return;
    var item = this._item;
    if (DataManager.isItem(item)) this.drawItemInfo(item);
    if (DataManager.isWeapon(item)) this.drawEquipInfo(item);
    if (DataManager.isArmor(item)) this.drawEquipInfo(item);
};
Window_ShopNumber.prototype.drawItemInfo = function(item) {
	//for plugin
};
Window_ShopNumber.prototype.drawEquipInfo = function(item) {
	//for plugin
};
Window_ShopNumber.prototype.drawInitialPrice = function() {
    var total = this._price;
    var width = this.contentsWidth() - this.textPadding();
	this.changeTextColor(this.systemColor());
	this.drawText("Price", 0, this.itemY() - this.lineHeight(), width);
	this.resetTextColor();
    this.drawCurrencyValue(total, this._currencyUnit, 0, this.itemY() - this.lineHeight(), width);
};
Window_ShopNumber.prototype.drawNumber = function() {
    var x = this.cursorX();
    var y = this.itemY();
    var width = this.cursorWidth() - this.textPadding();
    this.changeTextColor(this.systemColor());
	this.drawText("Number", 0, y, this.contentsWidth() - this.textPadding());
	this.resetTextColor();
    this.drawText(this._number, x, y, width, 'right');
};
Window_ShopNumber.prototype.drawTotalPrice = function() {
    var total = this._price * this._number;
    var width = this.contentsWidth() - this.textPadding();
	this.changeTextColor(this.systemColor());
	this.drawText("Total", 0, this.priceY(), width);
	this.resetTextColor();
    this.drawCurrencyValue(total, this._currencyUnit, 0, this.priceY(), width);
};
Window_ShopNumber.prototype.priceY = function() {
    return Math.round(this.contentsHeight() - this.lineHeight());
};
Window_ShopNumber.prototype.itemY = function() {
	this.visibleButtons()
	if (this._buttonsVisible) {
		return Math.round(this.contentsHeight() - this.lineHeight()*4.5);
	}else{
		return Math.round(this.contentsHeight() - this.lineHeight()*2);
	}
};
Window_ShopNumber.prototype.buttonY = function() {
    return Math.round(this.contentsHeight() - this.lineHeight() * 2.5);
};
Window_ShopNumber.prototype.visibleButtons = function(){
	if (BM.Shop.ShowTouchButtons || (TouchInput.date > Input.date)){
		this._buttonsVisible = true
	}else{
		this._buttonsVisible = false
	}
}
Window_ShopNumber.prototype.updateButtonsVisiblity = function() {
	this.visibleButtons()
    if (this._buttonsVisible) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};
//=============================================================================
function Window_Item2Category() {
    this.initialize.apply(this, arguments);
}

Window_Item2Category.prototype = Object.create(Window_HorzCommand.prototype);
Window_Item2Category.prototype.constructor = Window_Item2Category;

Window_Item2Category.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

Window_Item2Category.prototype.windowWidth = function() {
    return Graphics.width - BM.Shop.StatusWidth;
};

Window_Item2Category.prototype.maxCols = function() {
    return 4;
};

Window_Item2Category.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

Window_Item2Category.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    this.addCommand(TextManager.weapon,  'weapon');
    this.addCommand(TextManager.armor,   'armor');
    this.addCommand(TextManager.keyItem, 'keyItem');
};

Window_Item2Category.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};
//=============================================================================
BM.Shop.Scene_Shop_create = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
	BM.Shop.Scene_Shop_create.call(this);
	this.relocateWindows();
}
Scene_Shop.prototype.relocateWindows = function() {
	if (BM.Shop.CommandWindowAlign == 'right') {
		this._commandWindow.x  = this._statusWindow.width;
		this._dummyWindow.x    = this._statusWindow.width;
		this._buyWindow.x      = this._statusWindow.width;
		this._sellWindow.x     = this._statusWindow.width;
		this._categoryWindow.x = this._statusWindow.width;
		this._numberWindow.x   = this._statusWindow.width;
		this._statusWindow.x = 0;		
	};
}
Scene_Shop.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, this._helpWindow.height);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this.addWindow(this._goldWindow);
	this._goldWindow.hide();
};
Scene_Shop.prototype.createStatusWindow = function() {
    var wx = this._numberWindow.width;
    if (BM.Shop.CommandWindowFull){
		var wy = this._commandWindow.y + this._commandWindow.height;
	}else{
		var wy = this._commandWindow.y;
	}
    var ww = Graphics.boxWidth - wx;
    var wh = Graphics.boxHeight - wy;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this.addWindow(this._statusWindow);
};
BM.Shop.Scene_Shop_createDummyWindow = Scene_Shop.prototype.createDummyWindow;
Scene_Shop.prototype.createDummyWindow = function() {
    BM.Shop.Scene_Shop_createDummyWindow.call(this);
    this._dummyWindow.width = Graphics.boxWidth - BM.Shop.StatusWidth;
};
Scene_Shop.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_Item2Category();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._dummyWindow.y;
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};
Scene_Shop.prototype.createSellWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var ww = this._dummyWindow.width;
	var wh = Graphics.boxHeight - wy;
    this._sellWindow = new Window_ShopSell(0, wy, ww, wh);
    this._sellWindow.setHelpWindow(this._helpWindow);
	this._sellWindow.setStatusWindow(this._statusWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
    this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};
BM.Shop.Scene_Shop_commandBuy = Scene_Shop.prototype.commandBuy;
Scene_Shop.prototype.commandBuy = function() {
	BM.Shop.Scene_Shop_commandBuy.call(this);
	this._statusWindow.show();
};
BM.Shop.Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
Scene_Shop.prototype.onBuyCancel = function() {
    BM.Shop.Scene_Shop_onBuyCancel.call(this);
	this._statusWindow.show();
};
BM.Shop.Scene_Shop_activateSellWindow = Scene_Shop.prototype.activateSellWindow;
Scene_Shop.prototype.activateSellWindow = function() {
    BM.Shop.Scene_Shop_activateSellWindow.call(this);
    this._statusWindow.show();
};
//=============================================================================
if (Imported.YEP_ShopMenuCore){
//=============================================================================
Window_ShopStatus.prototype.initialize = function(x, y, width, height) {
    Yanfly.Shop.Window_ShopStatus_initialize.call(this, x, y, width, height);
};
Window_ShopStatus.prototype.update = function() {
    Yanfly.Shop.Window_ShopStatus_update.call(this);
};
Window_ShopStatus.prototype.paramId = function() {
    return Yanfly.Shop.Window_ShopStatus_paramId.call(this);
};
//=============================================================================
BM.Shop.Scene_Shop_createStatusWindow = Scene_Shop.prototype.createStatusWindow;
Scene_Shop.prototype.createStatusWindow = function() {
    BM.Shop.Scene_Shop_createStatusWindow.call(this);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._sellWindow.setStatusWindow(this._statusWindow);
};

Window_ShopStatus.prototype.drawItemInfo = function(item) {
	this.contents.fontSize = BM.Shop.ParamFontSize
	var rect = new Rectangle();
    rect.width = this.contents.width;
    for (var i = 0; i < 8; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;  
	  this.drawDarkRect(rect.x, rect.y, rect.width, this.textLineHeight());
      this.changeTextColor(this.systemColor());
      var text = this.getItemInfoCategory(i);
      this.drawText(text, dx, rect.y, dw);
      this.drawItemData(i, dx, rect.y, dw);
    }
	this.resetFontSettings();
};
Window_ShopStatus.prototype.getRectPosition = function(rect, i) {	
    rect.x = 0
	rect.y = this._newPY + this.textLineHeight()*i;
    return rect;
};
Window_Base.prototype.getItemInfoCategory = function(i) {
    var fmt = Yanfly.Param.ItemRecoverFmt;
    if (i === 0) return fmt.format(TextManager.param(0));
    if (i === 1) return fmt.format(TextManager.hp);
    if (i === 2) return fmt.format(TextManager.param(1));
    if (i === 3) return fmt.format(TextManager.mp);
    if (i === 4) return Yanfly.Param.ItemAddState;
    if (i === 5) return Yanfly.Param.ItemRemoveState;
    if (i === 6) return Yanfly.Param.ItemAddBuff;
    if (i === 7) return Yanfly.Param.ItemRemoveBuff;
    return '';
};
Window_Base.prototype.drawItemData = function(i, dx, dy, dw) {
    if (!this._item) return;
    var effect;
    var value = '---';
    var pre = '';
    var text = '';
    var icons = [];
    if (i === 0) {
      effect = this.getEffect(Game_Action.EFFECT_RECOVER_HP);
      value = (effect) ? effect.value1 : '---';
      if (value === 0) value = '---';
      if (value !== '---' && value !== 0) value *= 100;
    }
    if (i === 1) {
      effect = this.getEffect(Game_Action.EFFECT_RECOVER_HP);
      value = (effect) ? effect.value2 : '---';
      if (value === 0) value = '---';
    }
    if (i === 2) {
      effect = this.getEffect(Game_Action.EFFECT_RECOVER_MP);
      value = (effect) ? effect.value1 : '---';
      if (value === 0) value = '---';
      if (value !== '---' && value !== 0) value *= 100;
    }
    if (i === 3) {
      effect = this.getEffect(Game_Action.EFFECT_RECOVER_MP);
      value = (effect) ? effect.value2 : '---';
      if (value === 0) value = '---';
    }
    if (i >= 4) {
      icons = this.getItemIcons(i, icons);
    }
    this.changeTextColor(this.normalColor());
    if (value === '---') {
      this.changePaintOpacity(false);
    } else if (i < 4) {
      if (value > 0) pre = '+';
      value = Yanfly.Util.toGroup(parseInt(value));
      if ([0, 2].contains(i)) text = '%';
    }
    if (icons.length > 0) {
      this.changePaintOpacity(true);
      dx = dx + dw - icons.length * Window_Base._iconWidth;
      dx += this.textPadding() - 2;
      for (var j = 0; j < icons.length; ++j) {
        var icon = icons[j];
        this.drawIcon(icon, dx, dy + 2);
        dx += Window_Base._iconWidth;
      }
    } else {
      text = pre + value + text;
      this.drawText(text, dx, dy, dw, 'right');
      this.changePaintOpacity(true);
    }
};
Window_Base.prototype.getEffect = function(code) {
    var targetEffect;
    this._item.effects.forEach(function(effect) {
      if (effect.code === code) targetEffect = effect;
    }, this);
    return targetEffect;
};
Window_Base.prototype.getItemIcons = function(i, array) {
    this._item.effects.forEach(function(effect) {
      if (i === 4 && effect.code === Game_Action.EFFECT_ADD_STATE) {
        var state = $dataStates[effect.dataId];
        if (state && state.iconIndex !== 0) array.push(state.iconIndex);
      }
      if (i === 5 && effect.code === Game_Action.EFFECT_REMOVE_STATE) {
        var state = $dataStates[effect.dataId];
        if (state && state.iconIndex !== 0) array.push(state.iconIndex);
      }
      if (i === 6 && effect.code === Game_Action.EFFECT_ADD_BUFF) {
        var icon = Game_BattlerBase.ICON_BUFF_START + effect.dataId;
        array.push(icon);
      }
      if (i === 6 && effect.code === Game_Action.EFFECT_ADD_DEBUFF) {
        var icon = Game_BattlerBase.ICON_DEBUFF_START + effect.dataId;
        array.push(icon);
      }
      if (i === 7 && effect.code === Game_Action.EFFECT_REMOVE_BUFF) {
        var icon = Game_BattlerBase.ICON_BUFF_START + effect.dataId;
        array.push(icon);
      }
      if (i === 7 && effect.code === Game_Action.EFFECT_REMOVE_DEBUFF) {
        var icon = Game_BattlerBase.ICON_DEBUFF_START + effect.dataId;
        array.push(icon);
      }
    }, this);
    array = array.slice(0, Yanfly.Param.ItemMaxIcons);
    return array;
}
}
