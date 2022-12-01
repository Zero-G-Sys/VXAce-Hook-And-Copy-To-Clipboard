//Not that if using with setClipbardText, this line:
//this.updatePlacement();
//needs to be uncommented (in the futere this will be actiavted or activated with a parameter)
//found after this line:
//this.newPage(this._textState1);

var ZERO_Window_Message_prototype_updatePlacement = Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement = function() {
    ZERO_Window_Message_prototype_updatePlacement.call(this);
    //console.log('width start ' + this.width)
    if(Graphics){
        // Set window width (normally set in YEP_MessageCore), but this game uses plugin commands to change it back
        if(this.width == Graphics.width){
            this.width = (Graphics.boxWidth * 75 / 100);
        }
        //console.log('width after: ' + this.width)
        //console.log('x before: ' + this.x)

        // The fisrt check is if the txtbox is to the left side (default location)
        // The second check was used in a game to shring the textbox and move it to the left side
        // It will not be needed for a general purpose game, but if another games behaves similarly
        // log the width when its changed (this is usely done in a plugin command so console.log it)
        // and replace that for the 850
        if(this.x == 0 && this.width != 850) this.x = (Graphics.width - (Graphics.width * 75 / 100)) / 2;
        //console.log('x after: ' + this.x)
    }
};