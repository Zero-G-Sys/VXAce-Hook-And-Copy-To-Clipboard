//---------------------------------------------------------------------------
// VPS_Message_Wrapper.js
//---------------------------------------------------------------------------
/*:
@filename VPS_Message_Wrapper.js
@help
It is much of a hassle when you accidentally typed a longer word
in the message box and when you test play it, you found out that
the text overlapped and there's no way to indent it properly without doing
it manually from the editor. With the Message Wrapper plugin, it would
allow you to wrap most of the message that is done via the game message.

Whitespace functionality added by Zero_G

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
*------ignore this-------
* @param Wrapper Width
* @desc Width of the text when wrapped inside the message. (Default Value. Changed over time)
* @default 40
*------------------------
*/
var Soulpour = Soulpour || {};
Soulpour.WordWrapper = {};
Soulpour.params = PluginManager.parameters('VPS_Message_Wrapper.js');
//Ignore this
Soulpour.WordWrapper.wrapperWidth = Number(Soulpour.params['Wrapper Width'] || 40);

Window_Base.prototype.standardFontSize = function() {
    return 26;
};

(function($){

		// Params not working set maxWidth and constants here
		var maxWidth = 45;							// Max width of textbox with face
		var maxWidthWithoutFace = 59;		// Max width of textbox without face
		
		// Convert \n to ' ', all text will be a single line to be wordwrapped
		// This fixes inconsistent lines with line skips in the middle
		// Only one can be true
		const whiteSpaceName = true;  // Wordwrap handling names (names will be on fist line)
		const whiteSpaceName2 = false; // Wordwrap handling names (for names that don't have a separator, will guess if it's a name acording to the nameLenght value)
		const whiteSpace = false;       // Wordwrap without handling names

		// For whiteSpaceName
		// Define which caracter is the name encolsed in. 
		// (If it isn't enclosed use "\n", but it dosn't work well when its only text without names)
		// Is best to use : or ] as separator if the end of a name has it (ex Name: or [Name])
        const nameSeparator = ']' // or ":" or "]"
        const dontEraseSeparateor = true;
		
		// For whiteSpaceName2
		// How many characters should it guess it's a name
		// If there is a line skip before this many characters it will assume it's a name
		const nameLenght = 15;
		
		

		/*--------------------------------------------------------------------------------*/
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
            maxWidth = args[0];
        }
    };
    
    
    // Capitalize pseudo function
    const capitalize = (str, lower = false) =>
  		(lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
		;

		// Convert text to single line
		// Separate text in name and dialoge
		// Wordwrap dialoge
    Window_Message.prototype.wordWrapConvertWhiteSpace = function(text) {
    	// See if text has a face, adjust length of word wrap
    	var wordWrapWidth = maxWidth;
    	if ($gameMessage._faceName == ""){
    		wordWrapWidth = maxWidthWithoutFace;
    	}
    	
			//console.log("orig: " + JSON.stringify(text)); // Test pattern
			
			if(whiteSpaceName){
				// Split text in [Name] and [Dialoge]
				// Is best to use : or ] as separator if the end of a name has it (ex Name: or [Name])
                //var splittedText = [ text.substring(0, text.indexOf(nameSeparator)), text.substring(text.indexOf(nameSeparator)+ 1) ];
                if (dontEraseSeparateor){
                    text = text.replace(nameSeparator, nameSeparator+';');
			        var splittedText = text.split(';');
                }else{
                    var splittedText = text.split(nameSeparator);
                }
                
				//console.log("split: " + JSON.stringify(splittedText)); // Test pattern

	    	// Determine if there is a name in dialoge
            if (splittedText.length != 1){
                // Replace all instances of \n in [Dialoge]
	    	    let replacedDialoge = splittedText[1].replace(/\n/g, " ");
	    		// Wordwrap dialogue
	    		let wrappedText = Soulpour.soulpour_wordWrapper(replacedDialoge, wordWrapWidth, "\n");
	    		text = capitalize(splittedText[0]) + "\n" +  wrappedText;
	    	}else{
                // There wasn't a name in text, wordwrap everything
                text = text.replace(/\n/g, " ");
	    		text = Soulpour.soulpour_wordWrapper(splittedText[0], wordWrapWidth, "\n");
	    	}
    	}else if(whiteSpaceName2){
    		if(text.lenght>0){
    			let p = Soulpour.name_wordWrapper(text);
    			if(p!=0){
    				var splittedText = [ text.substring(0,p+2), text.substring(p+3) ];
    				splittedText[1] = splittedText[1].replace(/\n/g, " ");
    				splittedText[1] = Soulpour.soulpour_wordWrapper(splittedText[1], wordWrapWidth, "\n");
    				text = capitalize(splittedText[0]) +  wrappedText;
    			}else{
    				text = text.replace(/\n/g, " ");
    				text = Soulpour.soulpour_wordWrapper(text, wordWrapWidth, "\n");
    			}
    		}
    	}
    	else{
    		if(whiteSpace){
    			text = text.replace(/\n/g, " ");
    		}
    		text = Soulpour.soulpour_wordWrapper(text, wordWrapWidth, "\n");
    	}
    	console.log("replaced: " + JSON.stringify(text)); // Test pattern
    	return text;
    }
    
    Window_Message.prototype.startMessage = function() {
    		var text = "";
    	
		    this._textState = {};
		    this._textState.index = 0;
		    
		    text = this.convertEscapeCharacters($gameMessage.allText());
				text = this.wordWrapConvertWhiteSpace(text);
				
				this._textState.text = text;
		    this.newPage(this._textState);
		    this.updatePlacement();
		    this.updateBackground();
		    this.open();
		};
		
		// Try to find a name in text
		// Returns 0 if it was unsuccessful
		// Returns the index where the name finishes
		Soulpour.name_wordWrapper = function(str) {
			// Determine where is the line skip
		  p = str.indexOf('\n');
		  
		  // Determine if the line skip is at the very start
		  // Assume it's a name
		  if(p<nameLenght){
		    return p;
		  }
		  
		  return 0;
		}
		
		
    Soulpour.soulpour_wordWrapper = function(str, width, spaceReplacer) {
        if (str.length>width) {
            var p=width;
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
            $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.emerge.format(name), maxWidth, "\n"));
        });
        if (this._preemptive) {
            $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.preemptive.format($gameParty.name()), maxWidth, "\n" ));
        } else if (this._surprise) {
            $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.surprise.format($gameParty.name()), maxWidth, "\n" ));
        }
    };

    BattleManager.displayExp = function() {
        var exp = this._rewards.exp;
        if (exp > 0) {
            var text = Soulpour.soulpour_wordWrapper(TextManager.obtainExp.format(exp, TextManager.exp), maxWidth, "\n");
            $gameMessage.add('\\.' + text);
        }
    };

    BattleManager.displayGold = function() {
        var gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add('\\.' + Soulpour.soulpour_wordWrapper(TextManager.obtainGold.format(gold), maxWidth, "\n"));
        }
    };

    BattleManager.displayDropItems = function() {
        var items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            items.forEach(function(item) {
                $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.obtainItem.format(item.name), maxWidth, "\n"));
            });
        }
    };


    BattleManager.displayVictoryMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.victory.format($gameParty.name()), maxWidth, "\n"));
    };

    BattleManager.displayDefeatMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.defeat.format($gameParty.name()), maxWidth, "\n"));
    };

    BattleManager.displayEscapeSuccessMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.escapeStart.format($gameParty.name()), maxWidth, "\n"));
    };

    BattleManager.displayEscapeFailureMessage = function() {
        $gameMessage.add( Soulpour.soulpour_wordWrapper(TextManager.escapeStart.format($gameParty.name()), maxWidth, "\n" ));
        $gameMessage.add('\\.' + Soulpour.soulpour_wordWrapper(TextManager.escapeFailure,maxWidth, "\n") );
    };




    /*Game_Interpreter.prototype.command101 = function() {
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
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this.currentCommand().parameters[0], maxWidth, "\n"));
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
    };*/

    // Show Scrolling Text
    Game_Interpreter.prototype.command105 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setScroll(this._params[0], this._params[1]);
            while (this.nextEventCode() === 405) {
                this._index++;
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this.currentCommand().parameters[0], maxWidth, "\n"));
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    };

    Game_Actor.prototype.showRemovedStates = function() {
        this.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                $gameMessage.add(Soulpour.soulpour_wordWrapper(this._name + state.message4, maxWidth, "\n"));
            }
        }, this);
    };

    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(Soulpour.soulpour_wordWrapper(text, maxWidth, "\n"));
        newSkills.forEach(function(skill) {
            $gameMessage.add(Soulpour.soulpour_wordWrapper(TextManager.obtainSkill.format(skill.name), maxWidth, "\n"));
        });
    };

})();
