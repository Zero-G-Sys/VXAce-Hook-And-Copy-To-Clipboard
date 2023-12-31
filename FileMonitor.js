/**
 *  App: Watch txt file for changes and copy its contents to clipboard
 *  Author: Zero_G
 *  Version: 1.0
 *
 *  This will monitor a txt file generated by RPG Maker VxAce that overwrites itself
 *  for each new textbox. Each time it is modified it will trigger a watch that will
 *  process replacements and copy it to clipboard.
 *
 *  Replacements.mjs, NameReplacements.mjs and Ignore.mjs are hot reloaded each time they are
 *  modified after this program is run. (Descriptions in each file)
 *  Copy those files to %GameFolder%/_Clipboard
 *
 *  Run the program with npm start
 *  End it with ctrl + C
 *
 *  This will need a plugin in VxAce that copies text to a temporary txt file.
 *  Set the path to the game folder in the config section.
 */
import chokidar from 'chokidar';
import clipboardy from 'clipboardy';
import fs from 'fs';
import iconv from 'iconv-lite';
import { pathToFileURL } from 'node:url';

/** Config */ 
const gameFolder = 'D:/Games/Some Game'; // Update this with game folder
const makeTextASingleLine = true;
const ignoreNonJapaneseText = false; // Irrelevant if already activated on the ruby plugin
/** End of config */ 

// Don't modify this if the module files are on the game folder. If you want to use
// the modules in the same folder as this app, replace the paths with the default one
const filePath = gameFolder + '/_Clipboard/clipboard_temp.txt'; // For testing './testFile.txt'
const replacementsPath = gameFolder + '/_Clipboard/Replacements.mjs'; // Default is './Replacements.mjs'
const nameReplacementsPath = gameFolder + '/_Clipboard/NameReplacements.mjs'; // Default is './NameReplacements.mjs'
const ignoreArrayPath = gameFolder + '/_Clipboard/Ignore.mjs'; // Default is './Ignore.mjs'

const isJapaneseRegex = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/;

// Make an async import so we can use the paths set in the previous variables
var replacements = {}; // Map
var nameReplacements = {};
var ignoreArray = [];
// First import
loadModule('Replacements');
loadModule('NameReplacements');
loadModule('Ignore');

//----------------------------------------//
//      Hot Reload Start                 //
//--------------------------------------//
// Create a counter for hot reload. By changing the address of the import 
// with a parameter, we can bypass the cache, it will load the same file 
// but treat it as a new import
var importCount = 0;

// Function to dynamic import (load and reload) the external replacements files
async function loadModule(module) {
  const pathSwitch = {
    NameReplacements: () => nameReplacementsPath,
    Replacements: () => replacementsPath,
    Ignore: () => ignoreArrayPath,
    default: () => {
      console.error(`Error importing ${module}, no module with that name`);
      return;
    },
  };
  let path = pathSwitch[module]?.() || pathSwitch.default();
  
  console.log(`(Re)loading ${module}...`);
  importCount++;
  try {
    const newImport = await import(`${pathToFileURL(path).href}?count=${importCount}`);
    if (module == 'NameReplacements') nameReplacements = newImport.default;
    if (module == 'Replacements') replacements = newImport.default;
    if (module == 'Ignore') ignoreArray = newImport.default;
  } catch (error) {
    console.error(`Error loading module ${module}. ${error}`);
  }
}

// Initialize file watcher for the replacements files
const replacementsWatcher = chokidar.watch(replacementsPath, { persistent: true });
const nameReplacementsWatcher = chokidar.watch(nameReplacementsPath, { persistent: true });
const ignoreWatcher = chokidar.watch(ignoreArrayPath, { persistent: true });

// Register 'change' event listener for imports
replacementsWatcher.on('change', () => loadModule('Replacements'));
nameReplacementsWatcher.on('change', () => loadModule('NameReplacements'));
ignoreWatcher.on('change', () => loadModule('Ignore'));
//----------------------------------------//
//      Hot Reload End                   //
//--------------------------------------//

//-------------------------------------//
//      Watch Txt File (JP Text)      //
//-----------------------------------//

// Initialize file watcher for the target file
const fileWatcher = chokidar.watch(filePath, { persistent: true });

// Register 'change' event listener for the target file
fileWatcher.on('change', (path) => {
  try {
    const fileBuffer = fs.readFileSync(path);
    const fileContents = iconv.decode(fileBuffer, 'utf8'); // shift_jis

    // If empty, ignore
    if (!fileContents) return;

    // Ignore non japanese text (if flag is on)
    if (ignoreNonJapaneseText && !isJapaneseRegex.test(fileContents)){
      console.log('Ignoring non japanese text: ' + fileContents);
      return;
    } 

    console.log('-'.repeat(90));
    console.log('Received text: ' + fileContents);
    console.log('-'.repeat(90));

    try {
      // Don't copy text to clipboard if any text is present in ignoreArray
      for (const item of ignoreArray) {
        if (fileContents.includes(item)) {
          console.log('Ignoring text because of rule: ' + item);
          return;
        }
      }

      // Perform text replacements based on imported modules
      let modifiedContents = fileContents;
//console.log(replacements);
      for (const [key, value] of Object.entries(nameReplacements)) {
        modifiedContents = modifiedContents.replace(new RegExp(key, 'g'), value);
      }
      for (var [key, value] of replacements) {
        if (typeof key === 'string') key = new RegExp(key.escapeRegExp(), 'g');
        modifiedContents = modifiedContents.replace(key, value);
      }

      // Remove all white spaces for each line and transform text into a single line
      if (makeTextASingleLine) {
        let lines = modifiedContents.split('\n');
        let newLines = [];
        for (let line of lines) {
          newLines.push(line.trim());
        }
        modifiedContents = newLines.join(' ');
      } else {
        // Remove spaces and line breaks at the end of text
        modifiedContents = modifiedContents.trimEnd();
      }

      // Copy modified contents to clipboard
      clipboardy.writeSync(modifiedContents);
      console.log(`Modified contents copied to clipboard: ${modifiedContents}`);
    } catch (error) {
      if (error instanceof TypeError) {
        console.error('TypeError occurred (One of the replacement\nmodules has an error or is missing): ', error);
      } else {
        console.error('An error occurred:', error);
      }
    }
  } catch (error) {
    if (error instanceof fs.Error) {
      console.error('File system error occurred\n(does the file clipboard_temp.txt exist?): ', error);
    } else if (error instanceof iconv.Error) {
      console.error('Character encoding error occurred:', error);
    } else {
      console.error('An error occurred: ', error);
    }
  }
});

/** Utils **/
// Convert string to a string with escaped characters for regex
String.prototype.escapeRegExp = function () {
  return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Program started and status that is still running
console.log(`Monitoring file: ${filePath}`);