//=============================================================================
// Olivia Engine - Battle Effects 2 - for RPG Maker MV version 1.6.1
// Olivia_BattleEffects2.js
//=============================================================================
 /*:
 * @plugindesc <BattleEffects2> for RPG Maker MV version 1.6.1.
 * @author Fallen Angel Olivia
 *
 * @help
 * This is a RPG Maker MV plugin that adds more features to battle. These new
 * features include a new critical hit flash coloration because the previous one
 * is a slight red glow that is easy to miss. Damage popups have the option of
 * having rolling numbers before they land on a finalized number. This is to
 * help players in figuring out which numbers are still new when multiple popups
 * appear at the same time. These two options can be turned off.
 *
 * New notetag effects have been added. These notetag effects include giving
 * parameter bonuses depending on how high or low HP currently is, a damage cut
 * function that stacks additively on global damage or on certain elemental
 * damage, the ability to overheal past a battler's MaxHP, MaxMP, or MaxTP, a
 * new notetag trait to allow switching two parameters with each other, and
 * some notetags to ease the usage of Yanfly's Buffs & States Core counters.
 *
 *
 *
 * -----------------
 * Plugin Parameters
 * -----------------
 *
 * Critical Popup: Makes a special rainbow flash critical popup effect when a
 * critical hit lands. This is added because the original critical effect was
 * a very fast red tint that is easy for the player to miss if the player isn't
 * paying attention. You can disable this if you want the default effect.
 *
 * Rolling Damage: Make damage popups roll a little bit before settling on the
 * final damage value. By making the damage popup roll, the player can quickly
 * discern which damage popup is newer if there are multiple damage popups all
 * happening at once. You can disable this if you want the default effect.
 *
 * TP Overheal Maximum: Maximum amount TP can be overhealed if using
 * <Overheal TP> notetag for battlers.
 *
 * --------
 * Notetags
 * --------
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetags:
 *
 * <High Health ATK: +x%>
 * <High Health DEF: +x%>
 * <High Health MAT: +x%>
 * <High Health MDF: +x%>
 * <High Health AGI: +x%>
 * <High Health LUK: +x%>
 * - Increases (or decreases if you use -x%) the parameter as HP% is higher.
 * Reaches +x% threshhold at 100% health and reduces proportionally as HP% is
 * lower. This modifier is gone when the actor reaches crisis level HP (which
 * is 25% by default).
 *
 * <Low Health ATK: +x%>
 * <Low Health DEF: +x%>
 * <Low Health MAT: +x%>
 * <Low Health MDF: +x%>
 * <Low Health AGI: +x%>
 * <Low Health LUK: +x%>
 * - Increases (or decreases if you use -x%) the parameter as HP% is lower.
 * This rate scales harder the lower the HP ratio and reaches +x% at 0% HP.
 *
 * <Damage Cut: x%>
 * - Decreases incoming damage battler receives by x%. This stacks additively
 * with other damage cut-related effects. Damage Cut % cannot go below 0% or
 * above 100% rate.
 *
 * <Element id Cut: x%>
 * <Element name Cut: x%>
 * - Decreases incoming damage battler receives by x% if it is a matching
 * element. If using id, replace it with the element's ID in the system tab. If
 * using name, replace it with the element's name in the system tab. If the
 * element's name has an icon text code in it, leave out the icon text code.
 * This stacks additively with other damage cut-related effects. Damage Cut %
 * cannot go below 0% or above 100% rate.
 *
 * <Overheal HP>
 * <Overheal MP>
 * <Overheal TP>
 * - Lets the notetag-affected battler be able to overheal past the maximum HP,
 * MP, or TP amounts. The HP and MP maximum values become their respective
 * maximum parameter values (9999 and 999 by default). TP's maximum value
 * reaches the value set in the plugin parameters (200 by default). These
 * effects are only applied inside of battle.
 *
 * <Swap param1 with param2>
 * - Swaps the two parameters with each other. Replace param1 and param2 with
 * mhp, mmp, atk, def, mat, mdf, agi, or luk. Any battler affected by this
 * notetag will have those parameters swapped. If a battler is affected by
 * multiple notetags that alter the similar stats, priority will be given to
 * states, then equipment, then current class, then actor, then enemy.
 *
 *
 *
 * State Notetags:
 *
 * <Dissolve State: x>
 * <Dissolve State: x, x, x>
 * - If a battler becomes affected by any of the states listed in x, that state
 * will be prevented and the current state will be removed.
 *
 * <Set State Counter: x>
 * <Add State Counter: x>
 * - Requires Yanfly's YEP_BuffsStatesCore.js. This sets the state's counter or
 * adds to the states counter whenever the state is applied to the battler.
 * This is a notetag made to make setting the counter value easier.
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
 * - YEP Item Core
 * - YEP Equip Core
 * - YEP Job Points
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
 * @param Critical Popup
 * @type boolean
 * @on YES
 * @off NO
 * @desc Makes a special rainbow flash critical popup effect when a critical hit lands
 * @default true
 *
 * @param CriticalFlashFull
 * @text Full Color Value
 * @parent Critical Popup
 * @type number
 * @min 0
 * @max 255
 * @desc Color density value for a "full" amount
 * @default 255
 *
 * @param CriticalFlashHalf
 * @text Half Color Value
 * @parent Critical Popup
 * @type number
 * @min 0
 * @max 255
 * @desc Color density value for a "half" amount
 * @default 128
 *
 * @param CriticalFlashAlpha
 * @text Alpha Color Value
 * @parent Critical Popup
 * @type number
 * @min 0
 * @max 255
 * @desc Color density value for a "alpha" amount
 * @default 80
 *
 * @param
 *
 * @param Rolling Damage
 * @type boolean
 * @on YES
 * @off NO
 * @desc Make damage popups roll a little bit before settling on the final damage value.
 * @default true
 *
 * @param RollingDamageDuration
 * @text Roll Duration
 * @parent Rolling Damage
 * @type number
 * @min 0
 * @desc Frame duration on how long to roll numbers.
 * @default 20
 *
 * @param
 *
 * @param TP Overheal Maximum
 * @type number
 * @min 0
 * @desc Maximum amount TP can be overhealed if using <Overheal TP> notetag for battlers.
 * @default 200
 *
 *
 */
//=============================================================================

var Imported = Imported || {};
Imported.Olivia_BattleEffects2 = true;

var Olivia = Olivia || {};

var parameters = $plugins.filter(function(p) { return p.description.contains('<BattleEffects2>') })[0].parameters;

Olivia.BattleEffects2 = {
    // Critical
    CriticalPopupFlash: eval(parameters['Critical Popup']),
    CriticalPopupFull:  Number(parameters['CriticalFlashFull'] || 0),
    CriticalPopupHalf:  Number(parameters['CriticalFlashHalf'] || 0),
    CriticalPopupAlpha: Number(parameters['CriticalFlashAlpha'] || 0),
    // Rolling Number
    DamagePopupRolling: eval(parameters['Rolling Damage']),
    DamagePopupRollDur: Number(parameters['RollingDamageDuration'] || 0),
    // Overheal
    maxTPOverheal: Number(parameters['TP Overheal Maximum'] || 0)
};

//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

DataManager.getElementNames = function() {
    if (this._elementNames === undefined) {
        this._elementNames = [];
        for (var i = 0; i < $dataSystem.elements.length; i++) {
            var name = $dataSystem.elements[i];
            name = name.replace(/\\i\[(\d+)\]/gi, '');
            this._elementNames.push(name.toUpperCase().trim());
        }
    }
    return this._elementNames;
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

Olivia.BattleEffects2.___Game_BattlerBase_refresh___ = Game_BattlerBase.prototype.refresh;
Game_BattlerBase.prototype.refresh = function() {
    var hp = this.hp;
    var mp = this.mp;
    var tp = this.tp;
    Olivia.BattleEffects2.___Game_BattlerBase_refresh___.call(this);
    this.applyOverhealEffects(hp, mp, tp);
    this.refreshBattleEffects2Modifiers();
};

Game_BattlerBase.prototype.refreshBattleEffects2Modifiers = function() {
    this._lowHealthBonusModifiers = [0, 0,
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) ATK:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) DEF:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) MAT:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) MDF:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) AGI:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:Low Health|Enmity) LUK:[ ]([\+\-]\d+)([%％])>/i)
    ];
    this._highHealthBonusModifiers = [0, 0,
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) ATK:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) DEF:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) MAT:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) MDF:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) AGI:[ ]([\+\-]\d+)([%％])>/i),
        this.returnBattleEffects2NotetagFloat(/<(?:High Health|Stamina) LUK:[ ]([\+\-]\d+)([%％])>/i)
    ];
};

Game_BattlerBase.prototype.getBattleEffects2BattlerObjects = function() {
    var objects = this.states();
    if (this.isActor()) {
        objects = objects.concat(this.equips());
        objects.push(this.currentClass());
        objects.push(this.actor());
    } else {
        objects.push(this.enemy());
    }
    return objects;
};

Game_BattlerBase.prototype.returnBattleEffects2NotetagFloat = function(note) {
    var objects = this.getBattleEffects2BattlerObjects();
    var modifier = 0;
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (!!object && object.note.match(note)) {
            modifier += parseFloat(RegExp.$1) * 0.01;
        }
    }
    return modifier;
};

Game_BattlerBase.prototype.applyOverhealEffects = function(hp, mp, tp) {
    if ($gameParty.inBattle()) {
        if (this.returnBattleEffects2NotetagPresent(/<Overheal HP>/i)) {
            this._hp = hp.clamp(0, this.paramMax(0));
        }
        if (this.returnBattleEffects2NotetagPresent(/<Overheal MP>/i)) {
            this._mp = mp.clamp(0, this.paramMax(1));
        }
        if (this.returnBattleEffects2NotetagPresent(/<Overheal TP>/i)) {
            this._tp = tp.clamp(0, Olivia.BattleEffects2.maxTPOverheal);
        }
    }
};

Game_BattlerBase.prototype.returnBattleEffects2NotetagPresent = function(note) {
    var objects = this.getBattleEffects2BattlerObjects();
    var modifier = 0;
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (!!object && object.note.match(note)) {
            return true;
        }
    }
    return false;
};

Olivia.BattleEffects2.___Game_BattlerBase_paramRate___ = Game_BattlerBase.prototype.paramRate;
Game_BattlerBase.prototype.paramRate = function(paramId) {
    var rate = Olivia.BattleEffects2.___Game_BattlerBase_paramRate___.call(this, paramId);
    if (paramId >= 2) {
        rate *= this.paramHighHealthBonusRate(paramId);
        rate *= this.paramLowHealthBonusRate(paramId);
    }
    return rate;
};

Game_BattlerBase.prototype.paramHighHealthBonusRate = function(paramId) {
    if (this.isDying()) {
        return 1;
    } else {
        if (this._highHealthBonusModifiers === undefined) {
            this.refreshBattleEffects2Modifiers();
        }
        var hpRatio = this.hpRate();
        var modifier = this._highHealthBonusModifiers[paramId];
        return 1 + (hpRatio * modifier);
    }
};

Game_BattlerBase.prototype.paramLowHealthBonusRate = function(paramId) {
    if (this._lowHealthBonusModifiers === undefined) {
        this.refreshBattleEffects2Modifiers();
    }
    var hpRatio = 1 - this.hpRate();
    var modifier = this._lowHealthBonusModifiers[paramId] / 3;
    return 1 + (modifier * ((1 + 2 * hpRatio) * hpRatio));
};

Olivia.BattleEffects2.___Game_BattlerBase_param___ = Game_BattlerBase.prototype.param;
Game_BattlerBase.prototype.param = function(paramId) {
    var paramId = this.getSwappedParamID(paramId);
    return Olivia.BattleEffects2.___Game_BattlerBase_param___.call(this, paramId);
};

Game_BattlerBase.prototype.getSwappedParamID = function(paramId) {
    var objects = this.getBattleEffects2BattlerObjects();
    var parameters = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (!!object && object.note.match(/<Swap (.*) with (.*)>/i)) {
            var param1 = String(RegExp.$1).toLowerCase().trim();
            var param2 = String(RegExp.$2).toLowerCase().trim();
            var index1 = parameters.indexOf(param1);
            var index2 = parameters.indexOf(param2);
            if (index1 >= 0 && index2 >= 0) {
                if (index1 === paramId) {
                    return index2;
                } else if (index2 === paramId) {
                    return index1;
                }
            }
        }
    }
    return paramId;
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Olivia.BattleEffects2.___Game_Battler_addState___ = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    if (!this.isStateDissolve(stateId)) {
        Olivia.BattleEffects2.___Game_Battler_addState___.call(this, stateId);
        this.manageStateCounterNotetags(stateId);
    }
};

Game_Battler.prototype.isStateDissolve = function(stateId) {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (!!state && state.note.match(/<(?:Veil|Dissolve) (?:State|States):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
            array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
            if (array.contains(stateId)) {
                this.dissolveState(state.id);
                return true;
            }
        }
    }
    return false;
};

Game_Battler.prototype.dissolveState = function(stateId) {
    if (Imported.YEP_BuffsStatesCore && this.getStateCounter(stateId) > 0) {
        this.addStateCounter(stateId, -1);
        if (this.getStateCounter(stateId) === 0) {
            this.removeState(stateId);
        }
    } else {
        this.removeState(stateId);
    }
};

Game_Battler.prototype.manageStateCounterNotetags = function(stateId) {
    if (Imported.YEP_BuffsStatesCore && this.isStateAffected(stateId)) {
        var state = $dataStates[stateId];
        if (!!state) {
            if (state.note.match(/<Set State Counter: (\d+)>/i)) {
                this.setStateCounter(stateId, parseInt(RegExp.$1));
            } else if (state.note.match(/<Set State Counter: (.*)>/i)) {
                this.setStateCounter(stateId, String(RegExp.$1));
            } else if (state.note.match(/<Add State Counter: (\d+)>/i)) {
                this.addStateCounter(stateId, parseInt(RegExp.$1));
            }
        }
    }
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Olivia.BattleEffects2.___Game_Action_executeHpDamage___ = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value) {
    value = this.applyDamageCut(target, value);
    Olivia.BattleEffects2.___Game_Action_executeHpDamage___.call(this, target, value);
};

Game_Action.prototype.applyDamageCut = function(target, value) {
    var objects = target.getBattleEffects2BattlerObjects();
    var damageCut = 0;
    var elements = this.getBattleEffects2ItemElements();
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (!!object) {
            if (object.note.match(/<Damage Cut: (\d+)([%％])>/i)) {
                damageCut += parseFloat(RegExp.$1) * 0.01;
            } else if (object.note.match(/<Element (\d+) Cut: (\d+)([%％])>/i)) {
                var elementId = parseInt(RegExp.$1);
                if (elements.contains(elementId)) {
                    damageCut += parseFloat(RegExp.$2) * 0.01;
                }
            } else if (object.note.match(/<Element (.*) Cut: (\d+)([%％])>/i)) {
                var name = String(RegExp.$1).toUpperCase().trim();
                var elementId = DataManager.getElementNames().indexOf(name);
                if (elements.contains(elementId)) {
                    damageCut += parseFloat(RegExp.$2) * 0.01;
                }
            }
        }
    }
    damageCut = damageCut.clamp(0, 1);
    value *= 1 - damageCut;
    return Math.ceil(value);
};

Game_Action.prototype.getBattleEffects2ItemElements = function() {
    if (Imported.YEP_ElementCore) {
        return this.getItemElements();
    } else if (this.item().damage.elementId < 0) {
        return this.subject().attackElements();
    } else {
        return [this.item().damage.elementId];
    }
};

//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

Olivia.BattleEffects2.___Sprite_Damage_setupCriticalEffect___ = Sprite_Damage.prototype.setupCriticalEffect;
Sprite_Damage.prototype.setupCriticalEffect = function() {
    if (Olivia.BattleEffects2.CriticalPopupFlash) {
        this._criticalEffect = true;
    } else {
        Olivia.BattleEffects2.___Sprite_Damage_setupCriticalEffect___.call(this);
    }
};

Olivia.BattleEffects2.___Sprite_Damage_createDigits___ = Sprite_Damage.prototype.createDigits;
Sprite_Damage.prototype.createDigits = function(baseRow, value) {
    value = Math.floor(value);
    var start = this.children.length;
    Olivia.BattleEffects2.___Sprite_Damage_createDigits___.call(this, baseRow, value);
    baseRow = baseRow + (value < 0 ? 1 : 0);
    var string = Math.abs(value).toString();
    for (var i = 0; i < string.length; i++) {
        var sprite = this.children[i + start];
        sprite._isNumber = true;
        sprite._baseRow = baseRow;
        sprite._rollDuration = Olivia.BattleEffects2.DamagePopupRollDur;
        sprite._digitWidth = this.digitWidth();
        sprite._digitHeight = this.digitHeight();
        sprite._finalNumber = Number(string[i]);
    }
};

Olivia.BattleEffects2.___Sprite_Damage_update___ = Sprite_Damage.prototype.update;
Sprite_Damage.prototype.update = function() {
    Olivia.BattleEffects2.___Sprite_Damage_update___.call(this);
    if (this._criticalEffect) {
        this.updateCriticalEffect();
    }
};

Olivia.BattleEffects2.___Sprite_Damage_updateChild___ = Sprite_Damage.prototype.updateChild;
Sprite_Damage.prototype.updateChild = function(sprite) {
    Olivia.BattleEffects2.___Sprite_Damage_updateChild___.call(this, sprite);
    if (Olivia.BattleEffects2.DamagePopupRolling) {
        this.updateChildRollingNumber(sprite);
    }
};

Sprite_Damage.prototype.updateChildRollingNumber = function(sprite) {
    if (sprite._isNumber) {
        if (sprite._rollDuration-- > 0) {
            var n = Math.randomInt(10);
        } else {
            var n = sprite._finalNumber;
        }
        var row = sprite._baseRow;
        var w = sprite._digitWidth;
        var h = sprite._digitHeight;
        sprite.setFrame(n * w, row * h, w, h);
    }
};

Sprite_Damage.prototype.updateCriticalEffect = function() {
    var modifier = Math.round(Graphics.frameCount % 30 / 3);
    var full = Olivia.BattleEffects2.CriticalPopupFull;
    var half = Olivia.BattleEffects2.CriticalPopupHalf;
    var alpha = Olivia.BattleEffects2.CriticalPopupAlpha;
    if (modifier === 0) {
        this._flashColor = [full, 0, 0, alpha];
    } else if (modifier === 1) {
        this._flashColor = [full, half, 0, alpha];
    } else if (modifier === 2) {
        this._flashColor = [full, full, 0, alpha];
    } else if (modifier === 3) {
        this._flashColor = [half, full, 0, alpha];
    } else if (modifier === 3) {
        this._flashColor = [0, full, 0, alpha];
    } else if (modifier === 4) {
        this._flashColor = [0, full, half, alpha];
    } else if (modifier === 5) {
        this._flashColor = [0, full, full, alpha];
    } else if (modifier === 6) {
        this._flashColor = [0, half, full, alpha];
    } else if (modifier === 7) {
        this._flashColor = [0, 0, full, alpha];
    } else if (modifier === 7) {
        this._flashColor = [half, 0, full, alpha];
    } else if (modifier === 8) {
        this._flashColor = [full, 0, full, alpha];
    } else if (modifier === 9) {
        this._flashColor = [full, 0, half, alpha];
    }
};

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

Olivia.BattleEffects2.___Window_Base_drawGauge___ = Window_Base.prototype.drawGauge;
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    rate = rate.clamp(0, 1);
    Olivia.BattleEffects2.___Window_Base_drawGauge___.call(this, x, y, width, rate, color1, color2);
};

Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y, width, color1, color2) {
    if (current > max) {
        color1 = this.powerUpColor();
    }
    var labelWidth = this.textWidth('HP');
    var valueWidth1 = this.textWidth(Yanfly.Util.toGroup(current));
    var valueWidth2 = this.textWidth(Yanfly.Util.toGroup(max));
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth2;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth1;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(Yanfly.Util.toGroup(current), x3, y, valueWidth1, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(Yanfly.Util.toGroup(max), x1, y, valueWidth2, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(Yanfly.Util.toGroup(current), x1, y, valueWidth1, 'right');
    }
};

//-----------------------------------------------------------------------------
// Yanfly Compatibility
//
// Yanfly compatibility functions here

Yanfly.Util = Yanfly.Util || {};

if (!Yanfly.Util.toGroup) {
    Yanfly.Util.toGroup = function(inVal) {
        return inVal;
    }
};











