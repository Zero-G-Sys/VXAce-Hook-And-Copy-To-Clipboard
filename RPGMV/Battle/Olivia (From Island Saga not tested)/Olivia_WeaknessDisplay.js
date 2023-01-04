//=============================================================================
// Olivia Engine - Weakness Display - for RPG Maker MV version 1.6.1
// Olivia_WeaknessDisplay.js
//=============================================================================
 /*:
 * @plugindesc <WeaknessDisplay> for RPG Maker MV version 1.6.1.
 * @author Fallen Angel Olivia
 *
 * @help
 * This is a RPG Maker MV plugin that creates a display in battle to show an
 * enemy's elemental weaknesses. These weaknesses will start off hidden and
 * will be slowly revealed whenever they receive elemental damage of the
 * correct type. Choose to display the enemy's HP status, too.
 *
 *
 *
 * -----------------
 * Plugin Parameters
 * -----------------
 * 
 * There are many plugin parameters to modify. But the most import ones to
 * modify are the "Element Data" plugin parameters. These plugin parameters
 * let you choose which elements will be shown in your game.
 *
 * Element Data:
 *
 * Shown Elements: This is a list of all the element ID's that are displayed
 * on the list. Leave out the ones you don't want displayed.
 *
 * Element Icons: Icon ID's used for the "Shown Elements" plugin parameter.
 * They will match the icons shown in the list above based on order.
 *
 * Unknown Weakness Icon: Icon ID used for an unrevealed element. If a
 * weakness hasn't been revealed yet, this icon will appear.
 *
 * Visual Display:
 *
 * Always Show?: Always show the weakness display? Otherwise, it is hidden
 * until enemy is selected or attacked.
 *
 * Hide After Duration: If the Weakness Display isn't always shown, hide after
 * this many frames of it being visible.
 *
 * Show HP Gauge?: Show the HP gauge for the enemy by default?
 *
 * Minimum Width: This is the minimum width of the HP gauge if the gauge is
 * smaller than the enemy name
 *
 * Gauge Padding: This is how much padding on both sides to give the HP gauge
 * after calculating the width
 *
 * Show Name?: Show the name of the enemy?
 *
 * Font Size: Font size used for enemy name
 *
 * 50% HP Color: Text color ID of the name when the enemy is at 50% HP or less.
 *
 * 25% HP Color: Text color ID of the name when the enemy is at 25% HP or less.
 *
 * Show States? Show states in the weakness display instead of on top of the
 * enemy sprite. This makes it easier to keep track of all enemy information in
 * one place instead.
 *
 * Small Weakness Icons: Draw smaller icons?
 *
 * Weak Icon Size: Rate of how much to shrink the weakness icons.
 *
 *
 *
 * --------
 * Notetags
 * --------
 * 
 * Skill and Item Notetags:
 *
 * <Analyze Weakness: x>
 * This will reveal x weaknesses that the player has not currently
 * revealed yet from the target enemy.
 *
 *
 *
 * Enemy Notetags:
 *
 * <Show HP Gauge>
 * This will show the enemy's HP gauge by default and ignore the plugin
 * parameter's default settings.
 *
 * <Hide HP Gauge>
 * This will hide the enemy's HP gauge by default and ignore the plugin
 * parameter's default settings.
 *
 *
 *
 * ------------
 * Script Calls
 * ------------
 *
 * BattleManager.revealWeakness(x)
 * Replace x with the number of weaknesses that are to be revealed for all
 * enemies in the battle.
 *
 * BattleManager.revealWeaknessByVariable(x)
 * Replace x with the variable ID. The x value determines how many weaknesses
 * are revealed for all enemies in the battle.
 *
 *
 *
 * -------------------
 * W A R N I N G ! ! !
 * -------------------
 *
 * This plugin is made for RPG Maker MV versions 1.6.1 and below. If you update
 * RPG Maker MV past that and this plugin breaks, I am NOT responsible for it.
 *
 * -------------
 * Compatibility
 * -------------
 *
 * This plugin is compatible with the following plugins:
 *
 * - YEP Core Engine
 * - YEP Battle Engine Core
 * - YEP Action Sequence Packs 1, 2, 3
 * - YEP Animated Sideview Enemies
 * - YEP Buffs & States Core
 * - YEP Damage Core
 * - YEP Element Core
 *
 * Place this plugin under those in the Plugin Manager list.
 *
 * ------------
 * Terms of Use
 * ------------
 * 
 * 1. These plugins may be used in free or commercial games.
 * 2. 'Fallen Angel Olivia' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins without credit.
 *
 * -------
 * Credits
 * -------
 *
 * If you are using this plugin, credit the following people:
 * 
 * - Fallen Angel Olivia
 *
 * @param 
 * @param 
 * @param ATTENTION!!!
 * @default READ THE HELP FILE
 * @param 
 * @param 
 *
 * @param Weakness Element Data
 * @text Element Data
 * @parent Weakness Display
 * 
 * @param Shown Elements
 * @parent Weakness Element Data
 * @type number[]
 * @desc This is a list of all the element ID's that are displayed on the list.
 * @default ["1","2","3","4","5","6","7","8","9"]
 *
 * @param Element Icons
 * @parent Weakness Element Data
 * @type number[]
 * @desc Icon ID's used for the "Shown Elements" plugin parameter.
 * @default ["76","64","65","66","67","68","69","70","71"]
 *
 * @param Unknown Weakness Icon
 * @text Unrevealed Icon
 * @parent Weakness Element Data
 * @type number
 * @desc Icon ID used for an unrevealed element
 * @default 16
 *
 * @param
 *
 * @param Weakness Window Data
 * @text Visual Display
 * @parent Weakness Display
 *
 * @param Weakness Always Show
 * @text Always Show?
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Always show the weakness display? Otherwise, it is hidden until enemy is selected or attacked.
 * @default true
 *
 * @param Weakness Hide Duration
 * @text Hide After Duration
 * @parent Weakness Always Show
 * @type number
 * @desc If the Weakness Display isn't always shown, hide after this many frames of it being visible.
 * @default 180
 *
 * @param Weakness Show Break Shield
 * @text Show Break Shield?
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Show the Break Shield for the enemy?
 * @default true
 *
 * @param Weakness Stun Duration
 * @text Show Stun Duration?
 * @parent Weakness Show Break Shield
 * @type boolean
 * @on On
 * @off Off
 * @desc Show the number of turns left for the Break Stun?
 * @default false
 *
 * @param Weakness Show HP Gauge
 * @text Show HP Gauge?
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Show the HP gauge for the enemy by default?
 * @default true
 *
 * @param HP Gauge Minimum Width
 * @text Minimum Width
 * @parent Weakness Show HP Gauge
 * @type number
 * @desc This is the minimum width of the HP gauge if the gauge is smaller than the enemy name
 * @default 100
 *
 * @param HP Gauge Padding
 * @text Gauge Padding
 * @parent Weakness Show HP Gauge
 * @type number
 * @desc This is how much padding on both sides to give the HP gauge after calculating the width
 * @default 25
 *
 * @param Weakness Show Name
 * @text Show Name?
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Show the name of the enemy?
 * @default true
 *
 * @param Name Font Size
 * @text Font Size
 * @parent Weakness Show Name
 * @number
 * @min 1
 * @desc Font size used for enemy name
 * @default 22
 *
 * @param 50% HP Color
 * @parent Weakness Show Name
 * @type number
 * @desc Text color ID of the name when the enemy is at 50% HP or less.
 * @default 17
 *
 * @param 25% HP Color
 * @parent Weakness Show Name
 * @type number
 * @desc Text color ID of the name when the enemy is at 25% HP or less.
 * @default 2
 *
 * @param Weakness Show States
 * @text Show States?
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Show the states applied to the enemy? Will move the states sprite from the top of the enemy to here
 * @default true
 *
 * @param Small Weakness Icons
 * @parent Weakness Window Data
 * @type boolean
 * @on On
 * @off Off
 * @desc Draw smaller icons?
 * @default true
 *
 * @param Weak Icon Size
 * @parent Small Weakness Icons
 * @desc Rate of how much to shrink the weakness icons.
 * @default 0.6
 *
 * @param
 * @param
 *
 */
//=============================================================================

var Imported = Imported || {};
Imported.Olivia_OctoBattle = true;

var Olivia = Olivia || {};
Olivia.OctoBattle = Olivia.OctoBattle || {};

var parameters = $plugins.filter(function(p) { return p.description.contains('<WeaknessDisplay>') })[0].parameters;

Olivia.OctoBattle.WeaknessDisplay = {
    Enabled: true,
    // Element Data
    ShownElements: JSON.parse(parameters['Shown Elements']),
    ElementIcons:  JSON.parse(parameters['Element Icons']),
    UnknownIcon:   Number(parameters['Unknown Weakness Icon']),
    // Window
    AlwaysShow:      eval(parameters['Weakness Always Show']),
    HideDuration:    Number(parameters['Weakness Hide Duration'] || 180),
    ShowBreakShield: eval(parameters['Weakness Show Break Shield']),
    ShowStunTurns:   eval(parameters['Weakness Stun Duration']),
    ShowHpGauge:     eval(parameters['Weakness Show HP Gauge']),
    HpGaugeMinWidth: Number(parameters['HP Gauge Minimum Width'] || 100),
    HpGaugePadding:  Number(parameters['HP Gauge Padding'] || 100),
    ShowName:        eval(parameters['Weakness Show Name']),
    NameFontSize:    Number(parameters['Name Font Size'] || 22),
    HpColor50:       Number(parameters['50% HP Color'] || 17),
    HpColor25:       Number(parameters['25% HP Color'] || 18),
    ShowStates:      eval(parameters['Weakness Show States'] || 'true'),
    SmallWeakIcons:  eval(parameters['Small Weakness Icons']),
    WeakIconSize:    Number(parameters['Weak Icon Size'] || 0.6),
};

Olivia.OctoBattle.Weakness = Olivia.OctoBattle.Weakness || {};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

BattleManager.revealWeaknessByVariable = function(variableId) {
    var times = $gameVariables.value(variableId);
    this.revealWeakness(times);
};

BattleManager.revealWeakness = function(times) {
    var members = $gameTroop.members();
    var targets = [];
    for (var i = 0; i < members.length; i++) {
        var target = members[i];
        if (!!target && !targets.contains(target.enemyId())) {
            target.revealNewWeaknesses(times);
            targets.push(target.enemyId());
        }
    }
};

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

Olivia.OctoBattle.Weakness.___Game_System_initialize___ = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Olivia.OctoBattle.Weakness.___Game_System_initialize___.call(this);
    this.initializeRevealedEnemyWeaknesses();
};

Game_System.prototype.initializeRevealedEnemyWeaknesses = function() {
    this._revealedEnemyWeaknesses = this._revealedEnemyWeaknesses || {};
};

Game_System.prototype.addEnemyWeaknessElement = function(enemyId, elementId) {
    if (this._revealedEnemyWeaknesses === undefined) {
        this.initializeRevealedEnemyWeaknesses();
    }
    this._revealedEnemyWeaknesses[enemyId] = this._revealedEnemyWeaknesses[enemyId] || [];
    if (!this._revealedEnemyWeaknesses[enemyId].contains(elementId)) {
        this._revealedEnemyWeaknesses[enemyId].push(elementId);
    }
    this._revealedEnemyWeaknesses[enemyId].sort(function(a, b) {
        return a - b;
    });
};

Game_System.prototype.getRevealedEnemyWeaknesses = function(enemyId) {
    if (this._revealedEnemyWeaknesses === undefined) {
        this.initializeRevealedEnemyWeaknesses();
    }
    this._revealedEnemyWeaknesses[enemyId] = this._revealedEnemyWeaknesses[enemyId] || [];
    return this._revealedEnemyWeaknesses[enemyId];
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Olivia.OctoBattle.Weakness.___Game_Action_apply___ = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    Olivia.OctoBattle.Weakness.___Game_Action_apply___.call(this, target);
    target.revealWeaknessDisplay();
};

Olivia.OctoBattle.Weakness.___Game_Action_executeDamage___ = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    Olivia.OctoBattle.Weakness.___Game_Action_executeDamage___.call(this, target, value);
    if (!!target && target.isEnemy() && value !== 0) {
        this.addEnemyWeaknessElement(target);
    }
};

Game_Action.prototype.addEnemyWeaknessElement = function(target) {
    if (Imported.YEP_ElementCore) {
        var elements = this.getItemElements();
    } else {
        var elementId = this.item().damage.elementId;
        if (elementId < 0) {
            var elements = this.subject().attackElements();
        } else {
            var elements = [elementId];
        }
    }
    for (var i = 0; i < elements.length; i++) {
        var elementId = elements[i];
        if (elementId > 0) {
            $gameSystem.addEnemyWeaknessElement(target.enemyId(), elementId);
        }
    }
};

Olivia.OctoBattle.Weakness.___Game_Action_applyItemUserEffect___ = Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(target) {
    Olivia.OctoBattle.Weakness.___Game_Action_applyItemUserEffect___.call(this, target);
    if (target.isEnemy()) {
        this.applyWeaknessAnalyze(target);
    }
};

Game_Action.prototype.applyWeaknessAnalyze = function(target) {
    if (this.item().note.match(/<Analyze (?:Weakness|Weaknesses): (\d+)>/i)) {
        var times = parseInt(RegExp.$1);
        if (Olivia.OctoBattle.BoostPoint && this.item().note.match(/<(?:BP|Boost) Analyze>/i)) {
            var rate = this.subject().multiplierForBP('Analyze');
            times = Math.round(rate * times);
            times += this.subject().additionForBP('Analyze');
        }
        target.revealNewWeaknesses(times);
    }
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

Olivia.OctoBattle.Weakness.___Game_BattlerBase_refresh___ = Game_BattlerBase.prototype.refresh;
Game_BattlerBase.prototype.refresh = function() {
    Olivia.OctoBattle.Weakness.___Game_BattlerBase_refresh___.call(this);
    $gameTemp._needRefreshAllEnemyWeaknessWindows = true;
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Olivia.OctoBattle.Weakness.___Game_Battler_startAnimation___ = Game_Battler.prototype.startAnimation;
Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    Olivia.OctoBattle.Weakness.___Game_Battler_startAnimation___.call(this, animationId, mirror, delay);
    this.revealWeaknessDisplay();
};

Game_Battler.prototype.revealWeaknessDisplay = function() {
    if (this.isEnemy()) {
        this._showWeaknessDisplay = Olivia.OctoBattle.WeaknessDisplay.HideDuration;
    }
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

Game_Enemy.prototype.getWeaknessElements = function() {
    var elements = [];
    for (var i = 0; i < Olivia.OctoBattle.WeaknessDisplay.ShownElements.length; i++) {
        var elementId = Number(Olivia.OctoBattle.WeaknessDisplay.ShownElements[i]);
        if (Olivia.OctoBattle.BreakShield && Olivia.OctoBattle.BreakShield.Enabled) {
            if (this.originalElementRate(elementId) >= Olivia.OctoBattle.BreakShield.WeakRate) {
                elements.push(elementId);
            }
        } else {
            if (this.elementRate(elementId) >= 1.1) {
                elements.push(elementId);
            }
        }
    }
    return elements;
};

Game_Enemy.prototype.isShowWeaknessHpGauge = function() {
    if (this.enemy().note.match(/<No HP Gauge>/i)) {
        return false;
    } else if (this.enemy().note.match(/<Show HP Gauge>/i)) {
        return true;
    } else if (this.enemy().note.match(/<Hide HP Gauge>/i)) {
        return false;
    }
    return Olivia.OctoBattle.WeaknessDisplay.ShowHpGauge;
};

Game_Enemy.prototype.revealNewWeaknesses = function(times) {
    var weaknesses = this.getWeaknessElements();
    var revealed = $gameSystem.getRevealedEnemyWeaknesses(this.enemyId());
    var elements = [];
    for (var i = 0; i < weaknesses.length; i++) {
        var elementId = weaknesses[i];
        if (!revealed.contains(elementId)) {
            elements.push(elementId);
        }
    }
    while (times > 0) {
        if (elements.length <= 0) {
            break;
        }
        times -= 1;
        var index = Math.floor(Math.random() * elements.length);
        var random = elements[index];
        $gameSystem.addEnemyWeaknessElement(this.enemyId(), random);
        elements.splice(index, 1);
        this.revealWeaknessDisplay();
    }
    $gameTemp._needRefreshAllEnemyWeaknessWindows = true;
};

//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

Olivia.OctoBattle.Weakness.___Spriteset_Battle_update___ = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function() {
    Olivia.OctoBattle.Weakness.___Spriteset_Battle_update___.call(this);
    this.updateEnemyWeaknessWindows();
};

Spriteset_Battle.prototype.updateEnemyWeaknessWindows = function() {
    if ($gameTemp._needRefreshAllEnemyWeaknessWindows === true) {
        for (var i = 0; i < this._enemySprites.length; i++) {
            var sprite = this._enemySprites[i];
            if (!!sprite && !!sprite._weaknessWindow) {
                sprite._weaknessWindow.refresh();
                if (sprite._weaknessWindow._added === false) {
                    this._baseSprite.addChild(sprite._weaknessWindow);
                }
            }
        }
        $gameTemp._needRefreshAllEnemyWeaknessWindows = false;
    }
};

//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

Olivia.OctoBattle.Weakness.___Sprite_Enemy_initMembers___ = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
    Olivia.OctoBattle.Weakness.___Sprite_Enemy_initMembers___.call(this);
    this.createWeaknessDisplayWindow();
};

Sprite_Enemy.prototype.createWeaknessDisplayWindow = function() {
    this._weaknessWindow = new Window_WeaknessDisplay(this._enemy, this);
    this._weaknessWindow.refresh();
    this._weaknessWindow._added = false;
    if (Olivia.OctoBattle.WeaknessDisplay.ShowStates) {
        this._stateIconSprite.opacity = 0;
    }
};

Olivia.OctoBattle.Weakness.___Sprite_Enemy_setBattler___ = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    Olivia.OctoBattle.Weakness.___Sprite_Enemy_setBattler___.call(this, battler);
    if (!!this._weaknessWindow) {
        this._weaknessWindow.setSubject(battler);
    }
};

//-----------------------------------------------------------------------------
// Window_WeaknessDisplay
//
// The window attached to enemy sprites to show their weaknesses.

function Window_WeaknessDisplay() {
    this.initialize.apply(this, arguments);
}

Window_WeaknessDisplay.prototype = Object.create(Window_Base.prototype);
Window_WeaknessDisplay.prototype.constructor = Window_WeaknessDisplay;

Window_WeaknessDisplay.prototype.initialize = function(subject, sprite) {
    this._subject = subject;
    this._sprite = sprite;
    var width = Math.ceil(Graphics.boxWidth / 2);
    var height = this.fittingHeight(2);
    this.setCalculationConstants();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.createStateIconSprite();
    this.opacity = 0;
    this.refresh();
};

Window_WeaknessDisplay.prototype.standardPadding = function() {
    return 0;
};

Window_WeaknessDisplay.prototype.setCalculationConstants = function() {
    this._factorX = -1 * Math.ceil(Graphics.boxWidth * 0.25);
    this._factorY = -1 * Math.round(this.lineHeight() * 0.75);
};

Window_WeaknessDisplay.prototype.createStateIconSprite = function() {
    if (Olivia.OctoBattle.WeaknessDisplay) {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
        this._stateIconSprite.x = this.width / 2;
        this._stateIconSprite.y = 0;
    }
};

Window_WeaknessDisplay.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (!!this._subject) {
        this.updatePosition();
        this.updateOpacity();
    }
};

Window_WeaknessDisplay.prototype.updatePosition = function() {
    this.x = this._sprite.x + this._factorX;
    this.y = this._sprite.y + this._factorY;
};

Window_WeaknessDisplay.prototype.updateOpacity = function() {
    if (this._subject.isHidden() || this._subject.isDead()) {
        this.contentsOpacity -= 16;
    } else if (Imported.YEP_BattleEngineCore && this._subject.battler() && this._subject.battler().opacity <= 0) {
        this.contentsOpacity -= 16;
    } else if (Olivia.OctoBattle.WeaknessDisplay.AlwaysShow) {
        this.contentsOpacity = 255;
    } else if (this._subject.isSelected()) {
        this.contentsOpacity = 255;
    } else if (this._subject._showWeaknessDisplay > 0) {
        this.contentsOpacity = 255;
        this._subject._showWeaknessDisplay -= 1;
    } else {
        this.contentsOpacity -= 16;
    }
    if (!!this._stateIconSprite) {
        this._stateIconSprite.opacity = this.contentsOpacity;
    }
};

Window_WeaknessDisplay.prototype.setSubject = function(subject) {
    this._subject = subject;
    this._subject._showWeaknessDisplay = this._subject._showWeaknessDisplay || Olivia.OctoBattle.WeaknessDisplay.HideDuration;
    if (!!this._stateIconSprite) {
        this._stateIconSprite.setup(this._subject);
    }
    if (this._subject.isHidden()) {
        this.contentsOpacity = 0;
    }
    this.refresh();
};

Window_WeaknessDisplay.prototype.refresh = function() {
    this.contents.clear();
    if (!!this._subject) {
        this.drawHpGauge();
        this.drawSubjectName();
        this.drawBreakShield();
        this.drawWeaknessIcons();
        if (!!this._stateIconSprite) {
            this.moveStateSprite();
        }
    }
};

Window_WeaknessDisplay.prototype.drawHpGauge = function() {
    if (Olivia.OctoBattle.WeaknessDisplay.ShowHpGauge) {
        if (Olivia.OctoBattle.WeaknessDisplay.ShowName) {
            this.resetFontSettings();
            this.contents.fontSize = Olivia.OctoBattle.WeaknessDisplay.NameFontSize;
            var size = this.textWidth(this._subject.name());
            this.resetFontSettings();
            size = Math.max(Olivia.OctoBattle.WeaknessDisplay.HpGaugeMinWidth, size);
        } else {
            var size = Olivia.OctoBattle.WeaknessDisplay.HpGaugeMinWidth;
        }
        size += 2 * Olivia.OctoBattle.WeaknessDisplay.HpGaugePadding;
        this._hpGaugeWidth = size;
        var x = Math.round((this.contentsWidth() - size) / 2);
        var rate = this._subject.hpRate();
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(x, 0, size, rate, color1, color2);
    } else {
        this._hpGaugeWidth = 0;
    }
};

Window_WeaknessDisplay.prototype.drawSubjectName = function() {
    if (Olivia.OctoBattle.WeaknessDisplay.ShowName) {
        this.resetFontSettings();
        this.contents.fontSize = Olivia.OctoBattle.WeaknessDisplay.NameFontSize;
        if (this._subject.hpRate() > 0.50) {
            this.changeTextColor(this.normalColor());
        } else if (this._subject.hpRate() > 0.25) {
            this.changeTextColor(this.textColor(Olivia.OctoBattle.WeaknessDisplay.HpColor50));
        } else {
            this.changeTextColor(this.textColor(Olivia.OctoBattle.WeaknessDisplay.HpColor25));
        }
        this.drawText(this._subject.name(), 0, 0, this.contentsWidth(), 'center');
        this.resetFontSettings();
    }
};

Window_WeaknessDisplay.prototype.drawBreakShield = function() {
    if (Olivia.OctoBattle.WeaknessDisplay.ShowBreakShield && Olivia.OctoBattle.BreakShield && Olivia.OctoBattle.BreakShield.Enabled && Olivia.OctoBattle.BreakShield.Enemies) {
        if (Olivia.OctoBattle.WeaknessDisplay.ShowName) {
            this.resetFontSettings();
            this.contents.fontSize = Olivia.OctoBattle.WeaknessDisplay.NameFontSize;
            var size = this.textWidth(this._subject.name());
            this.resetFontSettings();
            size = Math.max(this._hpGaugeWidth, size);
            var x = Math.round((this.contentsWidth() - size) / 2) - Window_Base._iconWidth - 2;
        } else if (Olivia.OctoBattle.WeaknessDisplay.ShowStates && this._subject.allIcons().length > 0) {
            var x = Math.round(this.contentsWidth() / 2) - Window_Base._iconWidth;
        } else {
            var x = Math.round((this.contentsWidth() - Window_Base._iconWidth) / 2);
        }
        this.drawBreakShieldIcon(this._subject, x, 0);
    }
};

Window_WeaknessDisplay.prototype.moveStateSprite = function() {
      var x = Math.round(this.contentsWidth() / 2);
      var y = Math.round(this.lineHeight() / 2) - 2;
      if (Olivia.OctoBattle.WeaknessDisplay.ShowHpGauge) {
          if (Olivia.OctoBattle.WeaknessDisplay.ShowName) {
              this.resetFontSettings();
              this.contents.fontSize = Olivia.OctoBattle.WeaknessDisplay.NameFontSize;
              var size = this.textWidth(this._subject.name());
              this.resetFontSettings();
              size = Math.max(Olivia.OctoBattle.WeaknessDisplay.HpGaugeMinWidth, size);
          } else {
              var size = Olivia.OctoBattle.WeaknessDisplay.HpGaugeMinWidth;
          }
          size += 2 * Olivia.OctoBattle.WeaknessDisplay.HpGaugePadding + 2;
          x += Math.round(size / 2) + Math.round(Window_Base._iconWidth / 2);
      } else if (Olivia.OctoBattle.WeaknessDisplay.ShowName) {
          this.resetFontSettings();
          this.contents.fontSize = Olivia.OctoBattle.WeaknessDisplay.NameFontSize;
          var size = this.textWidth(this._subject.name()) + Window_Base._iconWidth + 4;
          this.resetFontSettings();
          x += Math.round(size / 2);
      } else if (Olivia.OctoBattle.WeaknessDisplay.ShowBreakShield) {
          x += Math.round(Window_Base._iconWidth / 2);
      } else {
          y -= this.lineHeight();
      }
      this._stateIconSprite.x = x;
      this._stateIconSprite.y = y;
};

Window_WeaknessDisplay.prototype.showBreakStunDuration = function() {
    return Olivia.OctoBattle.WeaknessDisplay.ShowStunTurns;
};

Window_WeaknessDisplay.prototype.drawWeaknessIcons = function() {
    var elements = this._subject.getWeaknessElements();
    var iconWidth = Window_Base._iconWidth;
    if (Olivia.OctoBattle.WeaknessDisplay.SmallWeakIcons) {
        iconWidth = Math.round(iconWidth * Olivia.OctoBattle.WeaknessDisplay.WeakIconSize);
    }
    var size = elements.length * iconWidth;
    var x = Math.round((this.contentsWidth() - size) / 2);
    if (!Olivia.OctoBattle.WeaknessDisplay.ShowName && !Olivia.OctoBattle.WeaknessDisplay.ShowBreakShield && !Olivia.OctoBattle.WeaknessDisplay.ShowHpGauge) {
        var y = 0;
    } else {
        var y = this.lineHeight();
    }
    var revealed = $gameSystem.getRevealedEnemyWeaknesses(this._subject.enemyId());
    if (Olivia.OctoBattle.BreakShield && Olivia.OctoBattle.BreakShield.Enabled) {
        var protectedElements = this._subject.getProtectedWeaknessElements();
    }
    for (var i = 0; i < elements.length; i++) {
        var elementId = elements[i];
        if (revealed.contains(elementId)) {
            var index = Olivia.OctoBattle.WeaknessDisplay.ShownElements.indexOf(String(elementId));
            var icon = Number(Olivia.OctoBattle.WeaknessDisplay.ElementIcons[index]);
        } else {
            var icon = Olivia.OctoBattle.WeaknessDisplay.UnknownIcon;
        }
        if (Olivia.OctoBattle.WeaknessDisplay.SmallWeakIcons) {
            this.drawSmallIcon(icon, x, y);
        } else {
            this.drawIcon(icon, x, y);
        }
        if (Olivia.OctoBattle.BreakShield && Olivia.OctoBattle.BreakShield.Enabled && protectedElements.contains(elementId)) {
            var icon = Olivia.OctoBattle.BreakShield.ProtectIcon;
            if (Olivia.OctoBattle.WeaknessDisplay.SmallWeakIcons) {
                this.drawSmallIcon(icon, x, y);
            } else {
                this.drawIcon(icon, x, y);
            }
        }
        x += iconWidth;
    }
};

Window_WeaknessDisplay.prototype.drawSmallIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    var rate = Olivia.OctoBattle.WeaknessDisplay.WeakIconSize;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, Math.round(pw * rate), Math.round(ph * rate));
};

//-----------------------------------------------------------------------------
// Window_EnemyVisualSelect
//
// From Yanfly's Battle Engine Core

if (Imported.YEP_BattleEngineCore) {

Window_EnemyVisualSelect.prototype.refresh = function() {
};

}
































