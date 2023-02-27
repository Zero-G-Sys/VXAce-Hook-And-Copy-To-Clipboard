/**
 *  Control BGM volume midgame by pressing numpad 9 and 6
 */

(function ($) {
    // Delete previous numpad key bindings
    delete Input.keyMapper[98];
	delete Input.keyMapper[100];
	delete Input.keyMapper[102];
	delete Input.keyMapper[104];
    // How much to change the volume for each button press
    var offset = 5;

    // Key Event Listeners
    document.addEventListener('keydown', event => {
        /**
         * Change bgm volume midgame
         */ 
        // Up volume
        if (event.code == 'Numpad9'){
            let value = ConfigManager['bgmVolume'];
            value += offset;
            value = value.clamp(0,100);
            ConfigManager['bgmVolume'] = value;
        }
        // down volume
        if (event.code == 'Numpad6'){
            let value = ConfigManager['bgmVolume'];
            value -= offset;
            value = value.clamp(0,100);
            ConfigManager['bgmVolume'] = value;
        }
    });
})()