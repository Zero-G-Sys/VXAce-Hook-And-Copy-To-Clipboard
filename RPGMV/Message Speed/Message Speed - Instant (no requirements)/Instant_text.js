//=============================================================================
// Instant_text.js
//=============================================================================
/*:
 * @Instant_text
 * @plugindesc Makes displayed text instant
 * @version 1.0
 * @author Zero_G
 * @filename Instant_text.js
 * @help
 -------------------------------------------------------------------------------
 == Description ==
 Makes displayed text instant

 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G

 == Usage ==
 Just add the plugin.

 */
 (function() {
		Window_Message.prototype.updateMessage = function() {
		    if (this._textState) {
		        while (!this.isEndOfText(this._textState)) {
		            if (this.needsNewPage(this._textState)) {
		                this.newPage(this._textState);
		            }
		            this.processCharacter(this._textState);
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
 })();