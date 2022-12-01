//---------------------------------------------------------------------------
// VPS - Message Wrapper.js
//---------------------------------------------------------------------------
/*:
@help
It is much of a hassle when you accidentally typed a longer word
in the message box and when you test play it, you found out that
the text overlapped and there's no way to indent it properly without doing
it manually from the editor. With the Message Wrapper plugin, it would
allow you to wrap most of the message that is done via the game message.

Plugin Scope:
  - Displaying of Messages
  - Display Experience
  - Display Gold
  - Display Drop Items
  - Display Victory Message
  - Display Defeat Message
  - Display Escape Success
  - Display Escape Failure
  - Display Removed States
  - Display Level Up

PLUGIN COMMANDS:

wrapper x

where x is the width of the wrapper before new indention. If you are using
the default size of the screen, the message wrapper should be okay at 40.
If you are using the Yanfly Core and you have a custom resolution, you
can change the word wrapper around 60 to 80.

The wrapper width, as seen on the parameters of this plugin is only the default
value just in case you don't want to touch the wrapper. You can always change
this over time by using the plugin command.

Terms of Use:

Free to use for Commercial and Non-Commercial Use. Credit is necessary for
usage.

*@plugindesc v1.0 Wraps messages to a certain width for automatic indention and breaks.
*@author Soulpour777
*
* @param Wrapper Width
* @desc Width of the text when wrapped inside the message. (Default Value. Changed over time)
* @default 40
*
*/
var Soulpour = Soulpour || {};
Soulpour.WordWrapper = {};
Soulpour.params = PluginManager.parameters('VPS - Message Wrapper.js');
Soulpour.WordWrapper.wrapperWidth = Number(Soulpour.params['Wrapper Width'] || 40);

(function($){

    // aliased functions
    Soulpour.WordWrapper.initialize = Game_System.prototype.initialize;
    Soulpour.WordWrapper.pluginCommand = Game_Interpreter.prototype.pluginCommand;

    // aliased
    Game_System.prototype.initialize = function() {
        Soulpour.WordWrapper.initialize.call(this);
        this._wrapperWidth = Soulpour.WordWrapper.wrapperWidth;
    }

    // plugincommand - aliased
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Soulpour.WordWrapper.pluginCommand.call(this, command, args);
        if (command === "wrapper") {
            $gameSystem._wrapperWidth = args[0];
        }
    };

    Soulpour.soulpour_wordWrapper = function(str, width, spaceReplacer) {
        if (str.length>width) {
            var p=width
            for (;p>0 && str[p]!=' ';p--) {
            }
            if (p>0) {
                var left = str.substring(0, p);
                var right = str.substring(p+1);
                return left + spaceReplacer + Soulpour.soulpour_wordWrapper(right, width, spaceReplacer);
            }
        }
        return str;
    }

    BattleManager.displayStartMessages = function() {
        $gameTroop.enemyNames().forEach(function(name) {
            $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.emerge.format(name), $gameSystem._wrapperWidth, "\n"));
        });
        if (this._preemptive) {
            $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.preemptive.format($gameParty.name()), $gameSystem._wrapperWidth, "\n" ));
        } else if (this._surprise) {
            $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.surprise.format($gameParty.name()), $gameSystem._wrapperWidth, "\n" ));
        }
    };

    BattleManager.displayExp = function() {
        var exp = this._rewards.exp;
        if (exp > 0) {
            var text = Soulpour.soulpour_wordWrapper(TextManager.obtainExp.format(exp, TextManager.exp), $gameSystem._wrapperWidth, "\n");
            $gameMessage.add('\\.' + text);
        }
    };

    BattleManager.displayGold = function() {
        var gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add('\\.' + Soulpour.soulpour_wordWrapper(TextManager.obtainGold.format(gold), $gameSystem._wrapperWidth, "\n"));
        }
    };

    BattleManager.displayDropItems = function() {
        var items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            items.forEach(function(item) {
                $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.obtainItem.format(item.name), $gameSystem._wrapperWidth, "\n"));
            });
        }
    };


    BattleManager.displayVictoryMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.victory.format($gameParty.name()), $gameSystem._wrapperWidth, "\n"));
    };

    BattleManager.displayDefeatMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.defeat.format($gameParty.name()), $gameSystem._wrapperWidth, "\n"));
    };

    BattleManager.displayEscapeSuccessMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.escapeStart.format($gameParty.name()), $gameSystem._wrapperWidth, "\n"));
    };

    BattleManager.displayEscapeFailureMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.escapeStart.format($gameParty.name()), $gameSystem._wrapperWidth, "\n" ));
        $gameMessage.add('\\.' + Soulpour.soulpour_wordWrapper(TextManager.escapeFailure,$gameSystem._wrapperWidth, "\n") );
    };




    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setFaceImage(this._params[0], this._params[1]);
            $gameMessage.setBackground(this._params[2]);
            $gameMessage.setPositionType(this._params[3]);
            
            // Prevent next messages to restore textbox ocupacy
       			console.log("inter" + TH.HideMessageWindow.isHiddenTextboxOnly);
       			if(TH.HideMessageWindow.isHiddenTextboxOnly){
          		$gameMessage.setBackground(2);
        		}
        		
            while (this.nextEventCode() === 401) {  // Text data
                this._index++;
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this.currentCommand().parameters[0], $gameSystem._wrapperWidth, "\n"));
            }
            switch (this.nextEventCode()) {
            case 102:  // Show Choices
                this._index++;
                this.setupChoices(this.currentCommand().parameters);
                break;
            case 103:  // Input Number
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104:  // Select Item
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    };

    // Show Scrolling Text
    Game_Interpreter.prototype.command105 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setScroll(this._params[0], this._params[1]);
            while (this.nextEventCode() === 405) {
                this._index++;
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this.currentCommand().parameters[0], $gameSystem._wrapperWidth, "\n"));
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    };

    Game_Actor.prototype.showRemovedStates = function() {
        this.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this._name + state.message4, $gameSystem._wrapperWidth, "\n"));
            }
        }, this);
    };

    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(Soulpour.soulpour_wordWrapper(text, $gameSystem._wrapperWidth, "\n"));
        newSkills.forEach(function(skill) {
            $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.obtainSkill.format(skill.name), $gameSystem._wrapperWidth, "\n"));
        });
    };

})();
