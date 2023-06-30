# VXAce Hook And Copy To Clipboard

## Description
The main functionality of this program is to get text from a RPG Maker VX Ace game and send it to clipboard. Then that text can be processed by other dictionary or translator programs (Textractor, Translation Aggregator, JapReader, etc).

While you could use Textractor hook, some games have problems when switching between message box types, the first message for that type will not hook. The other benefit is that you can better process the captured text with this program, only textboxes and choices will be captured, and no unwanted text should appear (can optionally capture item/skill descriptions, and some other plugins text).

While RGSS is capable is sending text to the clipboard through WinApi32 (No gems or packages can be used here). It will do so with wrong encoding. So the workaround is to store all captured text to a file, then have a Node app watch for changes on that file, and then copy it's contents to clipboard after doing some processing to it.

You can:
 - Do some replacements and advanced replacements with the javascript replace callback function. 
 - Add name replacements, and it will auto add all honorifics for the name
 - Add ignore text

The main concept of this, is that you are in control of the code, and you can do whatever you want with the preprocessing of the text before sending it to the clipboard, assuming you know minimum programming. If not just use the replacements modules that come by default, and read their description.

There is a more through description in the VX Ace script and the javascript files, that you should read first.

## How to Use
#### Part 1
You will first need to load a script into the game you want to capture the text. To do this you will need two things:
- RPG Maker VX Ace Editor
- (Depending on the game) Decrypting of the file Game.rgss3a

How to get and do those points, you should get help elsewhere.

So once you got your game decrypted and opened with the editor, go to the scripts section and add [the capture text script](VXACE_SaveTextToFile.rb) after all other scripts, but before Main.

On the game folder create a directory called `_Clipboard`.

Set the desired configurations by modifying the module constants in the script, then save the project and run your game once. You should have created the file "clipboard_temp.txt" inside `_Clipboard`.

#### Part 2
Copy [Replacements](Replacements.mjs), [NameReplacements](NameReplacements.mjs) and [Ignore](Ignore.mjs) from this folder to the newly created "_Clipboard" folder in your game folder. Set their contents as you see fit.

Edit [FileMonitor](FileMonitor.js) and set the constant "gameFolder" with the path to your game. Also set other configurations that you may want there.

If you don't have Node installed in your pc yet, install it.
Open your favorite console and do a `npm install --production`

To run the NodeApp just run `npm start`
To stop the app press `control + c`

You will see the helpful log in the console.

<details>
  <summary>For advanced users</summary>
    Do a normal "npm install" and run with "npm run dev" so you can run the app with nodemon, letting you auto reload it when changes are made to "FileMonitor.js"
</details>