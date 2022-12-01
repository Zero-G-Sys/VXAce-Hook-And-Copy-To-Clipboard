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
        if(this.x == 0 && this.width != 850) this.x = (Graphics.width - (Graphics.width * 75 / 100)) / 2;
        //console.log('x after: ' + this.x)
    }
};

// Nothing to do with centering message window, this game calls that function, and it gives error if backlog plugin is not loaded
// disable plugin and create a dummy function
Game_Temp.prototype.isMessageBacklogOpened = function() {}