//=============================================================================
// Olivia Engine - Battle Effects - for RPG Maker MV version 1.6.1
// Olivia_BattleEffects.js
//=============================================================================
 /*:
 * @plugindesc <BattleEffects> for RPG Maker MV version 1.6.1.
 * @author Fallen Angel Olivia
 *
 * @help
 * This is a RPG Maker MV plugin that adds many new features to battle. These
 * new features include colored damage popups and two new popups: Weak and
 * Break, buff and debuff turn stacking, buff and debuff maximum turn control,
 * state maximum turn control, follow up skill actions, extra skill lists, and
 * many unique notetag effects. Please read the following to learn more about
 * this plugin's features:
 *
 *
 *
 * ------
 * Popups
 * ------
 *
 * Colored Popups: You can change the color of popups that appear if a battler
 * takes HP damage while it is affected by a state with the notetag
 * <Damage Color: r, g, b, a>. You can change the color used depending on the
 * values you insert.
 *
 * Weak Popup: A new popup is added so that when an elemental weakness is hit,
 * this popup will appear to inform the player. You will have to modify your
 * damage graphic to add the Weak popup. Instructions will be explained below.
 *
 * Break Popup: A new popup is added so that when a certain state with the 
 * <Break Popup> notetag is added to a battler, the Break Popup appears. You
 * will have to modify the damage graphic to add the Break popup. Instructions
 * will be explained below.
 *
 * How to set up your damage sheet:
 * 
 * Your damage sheet in your img/system/ folder is split up into 10 columns and
 * 5 rows evenly. If you don't change the cell settings in the plugin
 * parameters, it will look something like this:
 *
 * 0 1 2 3 4 5 6 7 8 9
 * 0 1 2 3 4 5 6 7 8 9
 * 0 1 2 3 4 5 6 7 8 9
 * 0 1 2 3 4 5 6 7 8 9
 * Miss    Weak  Break
 *
 * Place the Weak and Break popup images in the locations show above.
 *
 *
 *
 * ------------------------------------------------------
 * Buff and Debuff Turn Stacking and Maximum Turn Control
 * ------------------------------------------------------
 *
 * With vanilla RPG Maker MV, buffs and debuffs will overwrite the turn count
 * whenever a new buff or debuff is applied. The plugin parameters here let them
 * stack the turns with each other instead. You can set a maximum number of
 * turns for the buffs and debuffs so that they don't become too high.
 *
 *
 *
 * -------------------------------
 * State Turn Maximum Turn Control
 * -------------------------------
 *
 * If you use Yanfly's Buffs and States Core plugin, states can be changed to
 * stack turns with each other. If you wish to give the states a maximum number
 * of turns, you can use the <Max Turns: x> notetag inside that state.
 *
 *
 *
 * -------------------
 * Change Target Scope
 * -------------------
 *
 * You can transform some skill or item target scopes into something else, like
 * a skill that normally targets all enemies to focus on one, or one to all.
 * These can be done with the notetags that are to be placed inside of a state
 * or other main property notebox.
 *
 * You can also make some skill or item immune to scope target changing with
 * the <Bypass Target Change> or <Divine> notetag, too. 
 *
 * Look in the notetag section for a list of all the target changing notetags
 * you can put into your database objects.
 *
 *
 *
 * ----------------------
 * Battle Reward Notetags
 * ----------------------
 * 
 * There are new notetags you can use for skills and items to change the
 * multiplier for the battle rewards the player can apply to battle like
 * <JP x5>, <EXP x10>, or <Gold x200>. The effects will only last the current
 * battle and will be reset once the battle is over. Only one reward can happen
 * at a time as they will overwrite each other.
 *
 *
 *
 * -----------------------
 * Follow Up Skill Actions
 * -----------------------
 *
 * This feature requires Yanfly's Battle Engine Core. You can make states that
 * if a battler is affected by them and performs a certain action type
 * (physical, magical, certain hit, or physical/magical), a follow up skill will
 * happen after.
 *
 *
 *
 * -----------------
 * Extra Skill Lists
 * -----------------
 *
 * Make some skills used to hold other skills, if the actor knows them. When
 * they are selected in battle, a new window appears listing those skills. If
 * the actor does not have access to them, those skills cannot be used. The
 * skills picked from the new list will function as normal skills.
 *
 *
 *
 * ----------------------
 * Unique Notetag Effects
 * ----------------------
 * There are more effects that don't belong elsewhere, but some of them include
 * notetags like <Item Seal>, <Destroy Weapon>, and more. Please look at the
 * notetag list for them.
 *
 *
 *
 * --------
 * Notetags
 * --------
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetags:
 *
 * <Skill Target Change: Self to All>
 * <Item Target Change: Self to All>
 * Changes skills/items with the self scope to become an all scope in battle.
 * Does not affect skills/items with the <Bypass Target Change> notetag.
 *
 * <Skill Target Change Allies: All to One>
 * <Skill Target Change Enemies: All to One>
 * <Item Target Change Allies: All to One>
 * <Item Target Change Enemies: All to One>
 * Changes skills/items with the all allies/enemies scope to become 1 ally/enemy
 * scope in battle. Does not affect skills/items with the <Bypass Target Change>
 * notetag.
 *
 * <Skill Target Change Allies: One to All>
 * <Skill Target Change Enemies: One to All>
 * <Item Target Change Allies: One to All>
 * <Item Target Change Enemies: One to All>
 * Changes skills/items with the 1 ally/enemy scope to become all allies/enemies
 * scope in battle. Does not affect skills/items with the <Bypass Target Change>
 * notetag.
 *
 *
 *
 * Skill, and Item Notetags:
 *
 * <Bypass Target Change>
 * <Divine>
 * Makes this skill/item immune to the target scope change notetag effects.
 *
 * <JP x5>
 * <EXP x10>
 * <Gold x200>
 * Replace the numbers. Changes the multipliers for the rewards found in the
 * current battle. JP will require Yanfly's Job Points plugin to have an effect.
 * After the battle is over, the multipliers will reset. The multipliers do not
 * stack and will overwrite each other, even if they are different types.
 *
 *
 *
 * Skill Notetags:
 * 
 * <Destroy Weapon>
 * Destroys the actor's currently equipped weapon after it is finished using a
 * skill with this notetag.
 *
 * <Extra Skill List: x>
 * <Extra Skill List: x, x, x>
 * Puts the skills x in a new window as a list to select from, turning this
 * skill into a folder during battle. This does not work outside of battle.
 * The actor must have access to all of the listed skills in order to use them.
 *
 *
 *
 * State Notetags:
 *
 * <All Element Damage Rate: x%>
 * Makes the battler receive x% multiplier from all elements.
 *
 * <Break Popup>
 * If a battler receives a state with this notetag, the Break Popup will appear.
 * It will take priority over the Weak Popup.
 *
 * <Buff Immunity: x>
 * <Buff Immunity: x, x, x>
 * <Debuff Immunity: x>
 * <Debuff Immunity: x, x, x>
 * Replace x with the parameter ID to make the battler immune to receiving buffs
 * or debuffs of that parameter. This does not remove already applied buffs or
 * debuffs. It only stops the battler from receiving them.
 * 0: Max HP
 * 1: Max MP
 * 2: Attack
 * 3: Defense
 * 4: Magic Attack
 * 5: Magic Defense
 * 6: Agility
 * 7: Luck
 *
 * <Damage Color: r, g, b, a>
 * If the battler receives HP damage while affected by a state with this notetag
 * the popup color will change.
 * r = red (0-255)
 * g = green (0-255)
 * b = blue (0-255)
 * a = alpha (0-255)
 *
 * <Item Seal>
 * If an actor is affected by a state with this notetag, they cannot use items
 * from the actor command menu.
 *
 * <Max Turns: x>
 * Sets the maximum number of turns this state can be to x. This is used for
 * Yanfly's Buffs and States Core if you allow state turn stacking.
 *
 * <No Weak Popup>
 * If the battler is hit with an elemental weakness while affected by a state
 * with this notetag, the Weak popup will not appear.
 *
 * <Physical Follow Up Skill: x>
 * <Magical Follow Up Skill: x>
 * <Certain Follow Up Skill: x>
 * <Follow Up Skill: x>
 * This requires Yanfly's Battle Engine Core to work. This makes the battler
 * affected by this state to perform skill ID x after the current skill is
 * finished being used.
 * Physical - Requires battler to perform physical type skill
 * Magical  - Requires battler to perform magical type skill
 * Certain  - Requires battler to perform certain hit type skill
 * n/a      - Requires battler to perform physical or magical type skill
 *
 * <State Immunity: x>
 * <State Immunity: x, x, x>
 * Insert the IDs of the states that the battler cannot receive if they are
 * affected by a state with this notetag. They do not become resistant to it,
 * meaning if the states have already been applied, they will not suddenly
 * disappear, but they will not be able to be applied until this state is gone.
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
 * @param Battle Effects Weak Popups
 * @text Weak Popups
 * @parent Battle Effects Pack
 * @type boolean
 * @on On
 * @off Off
 * @desc Enable or disable the Weak Popups
 * @default true
 *
 * @param Battle Effects Weak Popup Require Rate
 * @text Required Rate
 * @parent Battle Effects Weak Popups
 * @desc Required rate of elemental damage for weak popup to appear
 * @default 1.1
 *
 * @param Battle Effects Weak Popup Cell X
 * @text Cell X
 * @parent Battle Effects Weak Popups
 * @type number
 * @desc Starting cell column for X
 * @default 4
 *
 * @param Battle Effects Weak Popup Cell Width
 * @text Cell Width
 * @parent Battle Effects Weak Popups
 * @type number
 * @desc Number of cells for this popup's width
 * @default 3
 *
 * @param Battle Effects Weak Popup Cell X Factor
 * @text X Factor
 * @parent Battle Effects Weak Popups
 * @desc Rate of buffer for the popup's X position
 * @default 0.25
 *
 * @param Battle Effects Weak Popup Cell Y Factor
 * @text Y Factor
 * @parent Battle Effects Weak Popups
 * @desc Rate of buffer for the popup's Y position
 * @default 0.60
 *
 * @param Battle Effects Weak Popup Move X Base
 * @text Move X Base
 * @parent Battle Effects Weak Popups
 * @desc Base horizontal movement of the popup
 * @default -0.04
 *
 * @param Battle Effects Weak Popup Move X Rate
 * @text Move X Rate
 * @parent Battle Effects Weak Popups
 * @desc Rate of change for horizontal movement
 * @default 1.1
 *
 * @param Battle Effects Weak Popup Move Y Base
 * @text Move Y Base
 * @parent Battle Effects Weak Popups
 * @desc Base vertical movement of the popup
 * @default 0
 *
 * @param Battle Effects Weak Popup Move Y Rate
 * @text Move Y Rate
 * @parent Battle Effects Weak Popups
 * @desc Rate of change for vertical movement
 * @default 0
 *
 * @param Battle Effects Break Popups
 * @text Break Popups
 * @parent Battle Effects Pack
 * @type boolean
 * @on On
 * @off Off
 * @desc Enable or disable the Break Popups
 * @default true
 *
 * @param Battle Effects Break Popup Cell X
 * @text Cell X
 * @parent Battle Effects Break Popups
 * @type number
 * @desc Starting cell column for X
 * @default 7
 *
 * @param Battle Effects Break Popup Cell Width
 * @text Cell Width
 * @parent Battle Effects Break Popups
 * @type number
 * @desc Number of cells for this popup's width
 * @default 3
 *
 * @param Battle Effects Break Popup Cell X Factor
 * @text X Factor
 * @parent Battle Effects Break Popups
 * @desc Rate of buffer for the popup's X position
 * @default 0.25
 *
 * @param Battle Effects Break Popup Cell Y Factor
 * @text Y Factor
 * @parent Battle Effects Break Popups
 * @desc Rate of buffer for the popup's Y position
 * @default 0.60
 *
 * @param Battle Effects Break Popup Move X Base
 * @text Move X Base
 * @parent Battle Effects Break Popups
 * @desc Base horizontal movement of the popup
 * @default -0.04
 *
 * @param Battle Effects Break Popup Move X Rate
 * @text Move X Rate
 * @parent Battle Effects Break Popups
 * @desc Rate of change for horizontal movement
 * @default 1.1
 *
 * @param Battle Effects Break Popup Move Y Base
 * @text Move Y Base
 * @parent Battle Effects Break Popups
 * @desc Base vertical movement of the popup
 * @default 0
 *
 * @param Battle Effects Break Popup Move Y Rate
 * @text Move Y Rate
 * @parent Battle Effects Break Popups
 * @desc Rate of change for vertical movement
 * @default 0
 *
 * @param Stacking Buff/Debuffs
 * @parent Battle Effects Pack
 *
 * @param Battle Effects Stack Buff Turns
 * @text Stack Buff Turns
 * @parent Stacking Buff/Debuffs
 * @type boolean
 * @on On
 * @off Off
 * @desc Enable or disable stacking buff turns
 * @default true
 *
 * @param Battle Effects Max Buff Turns
 * @text Max Buff Turns
 * @parent Battle Effects Stack Buff Turns
 * @desc Max number of turns for stacking buffs
 * @default 9
 *
 * @param Battle Effects Stack Debuff Turns
 * @text Stack Debuff Turns
 * @parent Stacking Buff/Debuffs
 * @type boolean
 * @on On
 * @off Off
 * @desc Enable or disable stacking debuff turns
 * @default true
 *
 * @param Battle Effects Max Debuff Turns
 * @text Max Debuff Turns
 * @parent Battle Effects Stack Debuff Turns
 * @desc Max number of turns for stacking debuffs
 * @default 9
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

var parameters = $plugins.filter(function(p) { return p.description.contains('<BattleEffects>') })[0].parameters;

Olivia.OctoBattle.BattleEffects = {
    Enabled: true,
    // Weak Popup Settings
    WeakPopupEnabled: eval(parameters['Battle Effects Weak Popups']),
    WeakPopupReqRate: Number(parameters['Battle Effects Weak Popup Require Rate'] || 1.1),
    WeakCellX:        Number(parameters['Battle Effects Weak Popup Cell X'] || 4),
    WeakCellWidth:    Number(parameters['Battle Effects Weak Popup Cell Width'] || 3),
    WeakCellXFactor:  Number(parameters['Battle Effects Weak Popup Cell X Factor'] || 0.25),
    WeakCellYFactor:  Number(parameters['Battle Effects Weak Popup Cell Y Factor'] || 0.60),
    WeakMoveXBase:    Number(parameters['Battle Effects Weak Popup Move X Base'] || -0.04), 
    WeakMoveXRate:    Number(parameters['Battle Effects Weak Popup Move X Rate'] || 1.1),
    WeakMoveYBase:    Number(parameters['Battle Effects Weak Popup Move Y Base'] || 0),
    WeakMoveYRate:    Number(parameters['Battle Effects Weak Popup Move Y Rate'] || 0),
    // Break Popup Settings
    BreakPopupEnabled: eval(parameters['Battle Effects Break Popups']),
    BreakCellX:        Number(parameters['Battle Effects Break Popup Cell X'] || 7),
    BreakCellWidth:    Number(parameters['Battle Effects Break Popup Cell Width'] || 3),
    BreakCellXFactor:  Number(parameters['Battle Effects Break Popup Cell X Factor'] || 0.25),
    BreakCellYFactor:  Number(parameters['Battle Effects Break Popup Cell Y Factor'] || 0.60),
    BreakMoveXBase:    Number(parameters['Battle Effects Break Popup Move X Base'] || -0.04), 
    BreakMoveXRate:    Number(parameters['Battle Effects Break Popup Move X Rate'] || 1.1),
    BreakMoveYBase:    Number(parameters['Battle Effects Break Popup Move Y Base'] || 0),
    BreakMoveYRate:    Number(parameters['Battle Effects Break Popup Move Y Rate'] || 0),
    // Stacking Buff Turns
    StackBuffTurns:   eval(parameters['Battle Effects Stack Buff Turns']),
    MaxBuffTurns:     Number(parameters['Battle Effects Max Buff Turns'] || 9),
    StackDebuffTurns: eval(parameters['Battle Effects Stack Debuff Turns']),
    MaxDebuffTurns:   Number(parameters['Battle Effects Max Buff Turns'] || 9)
};

Olivia.OctoBattle.Effects = Olivia.OctoBattle.Effects || {};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

Olivia.OctoBattle.Effects.___BattleManager_initMembers___ = BattleManager.initMembers;
BattleManager.initMembers = function() {
    Olivia.OctoBattle.Effects.___BattleManager_initMembers___.call(this);
    this._battleBonus = '';
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Game_Action.prototype.subjectTargetEffectTraitSources = function() {
    var sources = this.subject().states();
    if (this.subject().isActor()) {
      sources.push(this.subject().actor());
      sources.push(this.subject().currentClass());
      var equips = this.subject().equips();
      for (var i = 0; i < equips.length; i++) {
          var equip = equips[i];
          if (!!equip) {
              sources.push(equip);
          }
      }
    } else {
      sources.push(this.subject().enemy());
    }
    return sources;
};

Game_Action.prototype.isSubjectAffectedByNote = function(note) {
    if (!!this.subject()) {
        var sources = this.subjectTargetEffectTraitSources();
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (!!source && source.note.match(note)) {
                return true;
            }
        }
    }
    return false;
};

Game_Action.prototype.isItemDivine = function() {
    return this.item().note.match(/<Divine>/i) || this.item().note.match(/<Bypass Target Change>/i)
};

Olivia.OctoBattle.Effects.___Game_Action_isForUser___ = Game_Action.prototype.isForUser;
Game_Action.prototype.isForUser = function() {
    if (this.isSkill()) {
        if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Skill Target Change: Self to All>/i) && !this.isItemDivine()) {
            return false;
        }
    } else if (this.isItem()) {
        if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Item Target Change: Self to All>/i) && !this.isItemDivine()) {
            return false;
        }
    }
    return Olivia.OctoBattle.Effects.___Game_Action_isForUser___.call(this);
};

Olivia.OctoBattle.Effects.___Game_Action_isForOne___ = Game_Action.prototype.isForOne;
Game_Action.prototype.isForOne = function() {
    if (this.isSkill()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Skill Target Change: Self to All>/i) && !this.isItemDivine()) {
            return false;
        }
    } else if (this.isItem()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Item Target Change: Self to All>/i) && !this.isItemDivine()) {
            return false;
        }
    }
    return Olivia.OctoBattle.Effects.___Game_Action_isForOne___.call(this);
};

Olivia.OctoBattle.Effects.___Game_Action_isForAll___ = Game_Action.prototype.isForAll;
Game_Action.prototype.isForAll = function() {
    if (this.isSkill()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Skill Target Change: Self to All>/i) && !this.isItemDivine()) {
            return true;
        }
    } else if (this.isItem()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([11]) && this.isSubjectAffectedByNote(/<Item Target Change: Self to All>/i) && !this.isItemDivine()) {
            return false;
        }
    }
    return Olivia.OctoBattle.Effects.___Game_Action_isForAll___.call(this);
};

Olivia.OctoBattle.Effects.___Game_Action_needsSelection___ = Game_Action.prototype.needsSelection;
Game_Action.prototype.needsSelection = function() {
    if (this.isSkill()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Skill Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Skill Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return false;
        }
    } else if (this.isItem()) {
        if (this.checkItemScope([8]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([2]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: All to One>/i) && !this.isItemDivine()) {
            return true;
        } else if (this.checkItemScope([7]) && this.isSubjectAffectedByNote(/<Item Target Change Allies: One to All>/i) && !this.isItemDivine()) {
            return false;
        } else if (this.checkItemScope([1]) && this.isSubjectAffectedByNote(/<Item Target Change Enemies: One to All>/i) && !this.isItemDivine()) {
            return false;
        }
    }
    return Olivia.OctoBattle.Effects.___Game_Action_needsSelection___.call(this);
};

Olivia.OctoBattle.Effects.___Game_Action_makeDamageValue___ = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    this._isCalculatingDamage = true;
    var value = Olivia.OctoBattle.Effects.___Game_Action_makeDamageValue___.call(this, target, critical);
    this._isCalculatingDamage = false;
    return value;
};

Olivia.OctoBattle.Effects.___Game_Action_calcElementRate___ = Game_Action.prototype.calcElementRate;
Game_Action.prototype.calcElementRate = function(target) {
    if (!!this._isCalculatingDamage) {
        var states = target.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state && state.note.match(/<All Element Damage Rate: (\d+)([%％])>/i)) {
                return parseFloat(RegExp.$1) * 0.01;
            }
        }
    }
    return Olivia.OctoBattle.Effects.___Game_Action_calcElementRate___.call(this, target);
};

Olivia.OctoBattle.Effects.___Game_Action_executeDamage___ = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    this.processPopupColorNote(target, value);
    Olivia.OctoBattle.Effects.___Game_Action_executeDamage___.call(this, target, value);
    this.processWeakPopup(target, value);
};

Game_Action.prototype.processPopupColorNote = function(target, value) {
    if (!!target && value > 0 && this.isHpEffect()) {
        var states = target.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state && state.note.match(/<Damage Color:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
                target.result().colorSettings = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
            }
        }
    }
};

Game_Action.prototype.processWeakPopup = function(target, value) {
    if (!!target && value > 0 && this.isHpEffect() && this.calcElementRate(target) >= Olivia.OctoBattle.BattleEffects.WeakPopupReqRate) {
        var states = target.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state && state.note.match(/<No Weak Popup>/i)) {
                return;
            }
        }
        target.result()._weakPopup = true;
    }
};

Olivia.OctoBattle.Effects.___Game_Action_applyItemUserEffect___ = Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(target) {
    this.registerUserLastActionType();
    Olivia.OctoBattle.Effects.___Game_Action_applyItemUserEffect___.call(this, target);
    this.applyBattleBonusRewards(target);
};

Game_Action.prototype.registerUserLastActionType = function() {
    if (!!this.subject()) {
        if (this.isPhysical()) {
            this.subject()._lastActionHitType = 'physical';
        } else if (this.isMagical()) {
            this.subject()._lastActionHitType = 'magical';
        } else if (this.isCertainHit()) {
            this.subject()._lastActionHitType = 'certain';
        } else {
            this.subject()._lastActionHitType = 'none';
        }
    }
};

Game_Action.prototype.applyBattleBonusRewards = function(target) {
    if (!!this.item()) {
        if (this.item().note.match(/<JP x(\d+)>/i)) {
            BattleManager._battleBonus = 'JP x' + RegExp.$1;
        } else if (this.item().note.match(/<EXP x(\d+)>/i)) {
            BattleManager._battleBonus = 'EXP x' + RegExp.$1;
        } else if (this.item().note.match(/<Gold x(\d+)>/i)) {
            BattleManager._battleBonus = 'Gold x' + RegExp.$1;
        }
    }
};

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

Olivia.OctoBattle.Effects.___Game_ActionResult_clear___ = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
    Olivia.OctoBattle.Effects.___Game_ActionResult_clear___.call(this);
    this.colorSettings = undefined;
    this._weakPopup = undefined;
    this._breakPopup = undefined;
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

Olivia.OctoBattle.Effects.___Game_BattlerBase_paySkillCost___ = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    Olivia.OctoBattle.Effects.___Game_BattlerBase_paySkillCost___.call(this, skill);
    this.payWeaponDestroy(skill);
};

Game_BattlerBase.prototype.payWeaponDestroy = function(skill) {
    this._destroyWeapon = skill.note.match(/<Destroy Weapon>/i) && this.isActor();
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Olivia.OctoBattle.Effects.___Game_Battler_startAnimation___ = Game_Battler.prototype.startAnimation;
Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    Olivia.OctoBattle.Effects.___Game_Battler_startAnimation___.call(this, animationId, mirror, delay);
    this._lastAnimationId = animationId;
};

Olivia.OctoBattle.Effects.___Game_Battler_addState___ = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    if (!this.isStatePrevented(stateId)) {
        var affected = this.isStateAffected(stateId);
        Olivia.OctoBattle.Effects.___Game_Battler_addState___.call(this, stateId);
        this.setupBreakDamagePopup(stateId, affected)
        this.setStateMaximumTurns(stateId);
    }
};

Game_Battler.prototype.setupBreakDamagePopup = function(stateId, affected) {
    if (!affected && this.isStateAffected(stateId) && $dataStates[stateId].note.match(/<Break Popup>/i)) {
        this._result._breakPopup = true;
    }
};

Game_Battler.prototype.setStateMaximumTurns = function(stateId) {
    if (this.isStateAffected(stateId) && $dataStates[stateId].note.match(/<Max Turns: (\d+)>/i)) {
        this._stateTurns[stateId] = Math.min(this._stateTurns[stateId], parseInt(RegExp.$1));
    }
};

Game_Battler.prototype.isStatePrevented = function(stateId) {
    var prevented = [];
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (!!state && state.note.match(/<State (?:Immune|Immunity):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
            var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
            prevented = prevented.concat(array);
        }
    }
    return prevented.contains(stateId);
};

Olivia.OctoBattle.Effects.___Game_Battler_addBuff___ = Game_Battler.prototype.addBuff;
Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (!this.isBuffPrevented(paramId)) {
        var currentTurns = this._buffTurns[paramId] || 0;
        Olivia.OctoBattle.Effects.___Game_Battler_addBuff___.call(this, paramId, turns);
        this.setBuffTurnStacking(paramId, currentTurns + turns);
    }
};

Game_Battler.prototype.isBuffPrevented = function(buffId) {
    var prevented = [];
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (!!state && state.note.match(/<Buff (?:Immune|Immunity):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
            var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
            prevented = prevented.concat(array);
        }
    }
    return prevented.contains(buffId);
};

Game_Battler.prototype.setBuffTurnStacking = function(paramId, turns) {
    if (Olivia.OctoBattle.BattleEffects.StackBuffTurns) {
        this._buffTurns[paramId] = Math.min(turns, Olivia.OctoBattle.BattleEffects.MaxBuffTurns);
    }
};

Olivia.OctoBattle.Effects.___Game_Battler_addDebuff___ = Game_Battler.prototype.addDebuff;
Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (!this.isDebuffPrevented(paramId)) {
        var currentTurns = this._buffTurns[paramId] || 0;
        Olivia.OctoBattle.Effects.___Game_Battler_addDebuff___.call(this, paramId, turns);
        this.setDebuffTurnStacking(paramId, currentTurns + turns);
    }
};

Game_Battler.prototype.isDebuffPrevented = function(debuffId) {
    var prevented = [];
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (!!state && state.note.match(/<Debuff (?:Immune|Immunity):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
            var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
            prevented = prevented.concat(array);
        }
    }
    return prevented.contains(debuffId);
};

Game_Battler.prototype.setDebuffTurnStacking = function(paramId, turns) {
    if (Olivia.OctoBattle.BattleEffects.StackDebuffTurns) {
        this._buffTurns[paramId] = Math.min(turns, Olivia.OctoBattle.BattleEffects.MaxDebuffTurns);
    }
};

Olivia.OctoBattle.Effects.___Game_Battler_onAllActionsEnd___ = Game_Battler.prototype.onAllActionsEnd;
Game_Battler.prototype.onAllActionsEnd = function() {
    Olivia.OctoBattle.Effects.___Game_Battler_onAllActionsEnd___.call(this);
    this.performDestroyWeapon();
    this.performFollowUpAction();
};

Game_Battler.prototype.performDestroyWeapon = function() {
    if (!!this._destroyWeapon && this.isActor()) {
        this._destroyWeapon = false;
        var weapon = this.equips()[0];
        this.changeEquip(0, null);
        $gameParty.loseItem(weapon, 1, false);
        if (Olivia.OctoBattle.WeaponSwap && Olivia.OctoBattle.WeaponSwap.Enabled && !!this.getFirstSwapWeapon()) {
            this.switchToWeaponType(this.getFirstSwapWeapon().wtypeId, false);
        }
    }
};

Game_Battler.prototype.performFollowUpAction = function() {
    if (Imported.YEP_BattleEngineCore) {
        var states = this.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state) {
                if (this._lastActionHitType === 'physical' && state.note.match(/<Physical Follow Up Skill: (\d+)>/i)) {
                    var skillId = parseInt(RegExp.$1);
                    BattleManager.queueForceAction(this, skillId, -1);
                } else if (this._lastActionHitType === 'magical' && state.note.match(/<Magical Follow Up Skill: (\d+)>/i)) {
                    var skillId = parseInt(RegExp.$1);
                    BattleManager.queueForceAction(this, skillId, -1);
                } else if (this._lastActionHitType === 'certain' && state.note.match(/<Certain Follow Up Skill: (\d+)>/i)) {
                    var skillId = parseInt(RegExp.$1);
                    BattleManager.queueForceAction(this, skillId, -1);
                } else if (this._lastActionHitType !== 'certain' && state.note.match(/<Follow Up Skill: (\d+)>/i)) {
                    var skillId = parseInt(RegExp.$1);
                    BattleManager.queueForceAction(this, skillId, -1);
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Olivia.OctoBattle.Effects.___Game_BattlerBase_meetsItemConditions___ = Game_BattlerBase.prototype.meetsItemConditions;
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    if ($gameParty.inBattle() && this.states().length > 0) {
        var states = this.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state && state.note.match(/<Item Seal>/i)) {
                return false;
            }
        }
    }
    return Olivia.OctoBattle.Effects.___Game_BattlerBase_meetsItemConditions___.call(this, item);
};

//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

Olivia.OctoBattle.Effects.___Game_Troop_expTotal___ = Game_Troop.prototype.expTotal;
Game_Troop.prototype.expTotal = function() {
    var total = Olivia.OctoBattle.Effects.___Game_Troop_expTotal___.call(this);
    if (BattleManager._battleBonus.match(/EXP x(\d+)/i)) {
        total *= parseInt(RegExp.$1);
    }
    return Math.ceil(total);
};

Olivia.OctoBattle.Effects.___Game_Troop_goldTotal___ = Game_Troop.prototype.goldTotal;
Game_Troop.prototype.goldTotal = function() {
    var total = Olivia.OctoBattle.Effects.___Game_Troop_goldTotal___.call(this);
    if (BattleManager._battleBonus.match(/Gold x(\d+)/i)) {
        total *= parseInt(RegExp.$1);
    }
    return Math.ceil(total);
};

if (Imported.YEP_JobPoints) {

Olivia.OctoBattle.Effects.___Game_Troop_jpTotal___ = Game_Troop.prototype.jpTotal;
Game_Troop.prototype.jpTotal = function() {
    var total = Olivia.OctoBattle.Effects.___Game_Troop_jpTotal___.call(this);
    if (BattleManager._battleBonus.match(/JP x(\d+)/i)) {
        total *= parseInt(RegExp.$1);
    }
    return Math.ceil(total);
};

}

//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.

Olivia.OctoBattle.Effects.___Scene_Battle_isAnyInputWindowActive___ = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function() {
    if (!!this._extraSkillWindow && this._extraSkillWindow.active) {
        return true;
    }
    return Olivia.OctoBattle.Effects.___Scene_Battle_isAnyInputWindowActive___.call(this);
};

Olivia.OctoBattle.Effects.___Scene_Battle_updateWindowPositions___ = Scene_Battle.prototype.updateWindowPositions;
Scene_Battle.prototype.updateWindowPositions = function() {
    Olivia.OctoBattle.Effects.___Scene_Battle_updateWindowPositions___.call(this);
    if (BattleManager.isInputting()) {
        if (!!this._extraSkillWindow && this._extraSkillWindow.active) {
            this._skillWindow.updatePosition();
            this._extraSkillWindow.updatePosition();
        }
    }
};

Olivia.OctoBattle.Effects.___Scene_Battle_onSkillOk___ = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function() {
    if (this._skillWindow.item().note.match(/<Extra Skill List:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)) {
        var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
        this.createExtraSkillListWindow(array);
    } else {
        Olivia.OctoBattle.Effects.___Scene_Battle_onSkillOk___.call(this);
    }
};

Scene_Battle.prototype.createExtraSkillListWindow = function(array) {
    if (!this._extraSkillWindow) {
        var x = this._skillWindow.x;
        var y = this._skillWindow.y;
        var width = this._skillWindow.width;
        var height = this._skillWindow.height;
        this._extraSkillWindow = new Window_BattleSkillExtra(x, y, width, height);
        this._extraSkillWindow.setHelpWindow(this._helpWindow);
        this._extraSkillWindow.setHandler('ok',     this.onExSkillOk.bind(this));
        this._extraSkillWindow.setHandler('cancel', this.onExSkillCancel.bind(this));
        this.addWindow(this._extraSkillWindow);
    }
    this._extraSkillWindow.setActor(BattleManager.actor());
    this._extraSkillWindow.setSkillList(array);
};

Scene_Battle.prototype.onExSkillOk = function() {
    this._extraSkillWindowProcess = true;
    this._skillWindowLastIndex = this._skillWindow.index();
    var originalSkillWindow = this._skillWindow;
    this._skillWindow = this._extraSkillWindow;
    Olivia.OctoBattle.Effects.___Scene_Battle_onSkillOk___.call(this);
    this._skillWindow = originalSkillWindow;
};

Scene_Battle.prototype.onExSkillCancel = function() {
    this._extraSkillWindowProcess = false;
    this._extraSkillWindow.hide();
    this._skillWindow.activate();
    this._helpWindow.show();
};

Scene_Battle.prototype.exSkillProcessReturn = function() {
    if (this._extraSkillWindowProcess) {
        this._extraSkillWindowProcess = false;
        this._skillWindow.deactivate();
        this._skillWindow.select(this._skillWindowLastIndex)
        this._extraSkillWindow.show();
        this._extraSkillWindow.activate();
    }
};

Olivia.OctoBattle.Effects.___Scene_Battle_onActorOk___ = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function() {
    this._extraSkillWindowProcess = false;
    Olivia.OctoBattle.Effects.___Scene_Battle_onActorOk___.call(this);
};

Olivia.OctoBattle.Effects.___Scene_Battle_onActorCancel___ = Scene_Battle.prototype.onActorCancel;
Scene_Battle.prototype.onActorCancel = function() {
    Olivia.OctoBattle.Effects.___Scene_Battle_onActorCancel___.call(this);
    this.exSkillProcessReturn();
};

Olivia.OctoBattle.Effects.___Scene_Battle_onEnemyOk___ = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function() {
    this._extraSkillWindowProcess = false;
    Olivia.OctoBattle.Effects.___Scene_Battle_onEnemyOk___.call(this);
};

Olivia.OctoBattle.Effects.___Scene_Battle_onEnemyCancel___ = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function() {
    Olivia.OctoBattle.Effects.___Scene_Battle_onEnemyCancel___.call(this);
    this.exSkillProcessReturn();
};

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

Olivia.OctoBattle.Effects.___Sprite_Battler_setupDamagePopup___ = Sprite_Battler.prototype.setupDamagePopup;
Sprite_Battler.prototype.setupDamagePopup = function() {
    this.setupOctoSpecialEffectDamagePopup();
    Olivia.OctoBattle.Effects.___Sprite_Battler_setupDamagePopup___.call(this);
};

Sprite_Battler.prototype.setupOctoSpecialEffectDamagePopup = function() {
    if (this._battler.isDamagePopupRequested() && this._battler.isSpriteVisible()) {
        if (!!this._battler._result._breakPopup && Olivia.OctoBattle.BattleEffects.BreakPopupEnabled) {
            this.setupBreakDamagePopup();
        } else if (!!this._battler._result._weakPopup && Olivia.OctoBattle.BattleEffects.WeakPopupEnabled) {
            this.setupWeakDamagePopup();
        }
    }
};

Sprite_Battler.prototype.setupBreakDamagePopup = function() {
    var sprite = new Sprite_Damage();
    sprite.x = this.x - Math.round(this.width * Olivia.OctoBattle.BattleEffects.BreakCellXFactor);
    sprite.y = this.y - Math.round(this.height * Olivia.OctoBattle.BattleEffects.BreakCellYFactor);
    sprite.createBreak();
    BattleManager._spriteset.addChild(sprite);
    this._battler.clearResult();
};

Sprite_Battler.prototype.setupWeakDamagePopup = function() {
    var sprite = new Sprite_Damage();
    sprite.x = this.x - Math.round(this.width * Olivia.OctoBattle.BattleEffects.WeakCellXFactor);
    sprite.y = this.y - Math.round(this.height * Olivia.OctoBattle.BattleEffects.WeakCellYFactor);
    sprite.createWeak();
    BattleManager._spriteset.addChild(sprite);
    this._battler.clearResult();
};

//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

Olivia.OctoBattle.Effects.___Sprite_Damage_setup___ = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function(target) {
    Olivia.OctoBattle.Effects.___Sprite_Damage_setup___.call(this, target);
    if (!!target.result().colorSettings) {
        this.setupColorEffects(target.result().colorSettings);
    }
};

Sprite_Damage.prototype.setupColorEffects = function(settings) {
    this._flashColor = [settings[0], settings[1], settings[2], settings[3]];
    this._flashDuration = 8888;
};

Sprite_Damage.prototype.createBreak = function() {
    var x = this.digitWidth() * Olivia.OctoBattle.BattleEffects.BreakCellX;
    var y = 4 * this.digitHeight();
    var w = this.digitWidth() * Olivia.OctoBattle.BattleEffects.BreakCellWidth;
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(x, y, w, h);
    sprite._specialEffectPopup = true;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    if (Imported.YEP_BattleEngineCore) {
        this._duration = Yanfly.Param.BECPopupDur;
    }
    this._moveXBase = Olivia.OctoBattle.BattleEffects.BreakMoveXBase;
    this._moveXRate = Olivia.OctoBattle.BattleEffects.BreakMoveXRate;
    this._moveYBase = Olivia.OctoBattle.BattleEffects.BreakMoveYBase;
    this._moveYRate = Olivia.OctoBattle.BattleEffects.BreakMoveYRate;
};

Sprite_Damage.prototype.createWeak = function() {
    var x = this.digitWidth() * Olivia.OctoBattle.BattleEffects.WeakCellX;
    var y = 4 * this.digitHeight();
    var w = this.digitWidth() * Olivia.OctoBattle.BattleEffects.WeakCellWidth;
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(x, y, w, h);
    sprite._specialEffectPopup = true;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    if (Imported.YEP_BattleEngineCore) {
        this._duration = Yanfly.Param.BECPopupDur;
    }
    this._moveXBase = Olivia.OctoBattle.BattleEffects.WeakMoveXBase;
    this._moveXRate = Olivia.OctoBattle.BattleEffects.WeakMoveXRate;
    this._moveYBase = Olivia.OctoBattle.BattleEffects.WeakMoveYBase;
    this._moveYRate = Olivia.OctoBattle.BattleEffects.WeakMoveYRate;
};

Olivia.OctoBattle.Effects.___Sprite_Damage_updateChild___ = Sprite_Damage.prototype.updateChild;
Sprite_Damage.prototype.updateChild = function(sprite) {
    if (sprite._specialEffectPopup) {
        this.updateBreakPopup(sprite);
    } else {
        Olivia.OctoBattle.Effects.___Sprite_Damage_updateChild___.call(this, sprite);
    }
};

Sprite_Damage.prototype.updateBreakPopup = function(sprite) {
    this._duration--;
    this.x += this._moveXBase;
    this._moveXBase *= this._moveXRate;
    this.y += this._moveYBase;
    this._moveYBase *= this._moveYRate;
};

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

function Window_BattleSkillExtra() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkillExtra.prototype = Object.create(Window_BattleSkill.prototype);
Window_BattleSkillExtra.prototype.constructor = Window_BattleSkillExtra;

Window_BattleSkillExtra.prototype.initialize = function(x, y, width, height) {
    this._skillList = [];
    Window_BattleSkill.prototype.initialize.call(this, x, y, width, height);
};

Window_BattleSkillExtra.prototype.setSkillList = function(array) {
    this._skillList = array;
    this.refresh();
    this.activate();
    this.updatePosition();
    this.show();
};

Window_BattleSkillExtra.prototype.makeItemList = function() {
    this._data = [];
    if (this._skillList && !!this._actor) {
        var skills = this._actor.skills();
        for (var i = 0; i < this._skillList.length; i++) {
            var skill = $dataSkills[this._skillList[i]];
            if (!!skill && skills.contains(skill)) {
                this._data.push(skill);
            }
        }
    }
};

Window_BattleSkillExtra.prototype.updatePosition = function() {
    this._positionXCorrection = 32;
    this._positionYCorrection = 32;
    Window_ActorCommand.prototype.updatePosition.call(this);
};

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

Olivia.OctoBattle.Effects.___Window_ActorCommand_addItemCommand___ = Window_ActorCommand.prototype.addItemCommand;
Window_ActorCommand.prototype.addItemCommand = function() {
    Olivia.OctoBattle.Effects.___Window_ActorCommand_addItemCommand___.call(this);
    if (!!this._actor) {
        this.applyItemSeal();
    }
};

Window_ActorCommand.prototype.applyItemSeal = function() {
    var index = this.findSymbol('item');
    if (index >= 0) {
        var states = this._actor.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (!!state && state.note.match(/<Item Seal>/i)) {
                this._list[index].enabled = false;
                return;
            }
        }
    }
};

























