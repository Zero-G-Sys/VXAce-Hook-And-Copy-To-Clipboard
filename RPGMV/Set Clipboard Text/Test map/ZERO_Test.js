// Replacer and Reviver are required functions to convert maps to and from json
function JSONreplacer(key, value) {
    if(value instanceof Map) {
        return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}
  
function JSONreviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
        return new Map(value.value);
        }
    }
    return value;
}

var fs = require('fs');

function readFileTest(file){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';

    if(fs.existsSync(absolutePath)){
        let rawData = fs.readFileSync(absolutePath/*, 'utf16le'*/);
        let jsonData = JSON.parse(rawData);
        return jsonData;
    }
}

function readFileTestMAP(file){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';

    if(fs.existsSync(absolutePath)){
        let rawData = fs.readFileSync(absolutePath/*, 'utf16le'*/);
        let jsonData = JSON.parse(rawData, JSONreviver);
        return jsonData;
    }
}

function writeFileTest(file, data){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2)/*, 'utf16le'*/);
}

function writeFileTestMAP(file, data){
    let absolutePath = process.cwd();
    if(!absolutePath.includes('www')) absolutePath = absolutePath + '\\www';

    absolutePath = absolutePath + '\\' + file + '.json';
    fs.writeFileSync(absolutePath, JSON.stringify(data, JSONreplacer, 2)/*, 'utf16le'*/);
}

console.time('Read OBJ');
var storedTranslationsOBJ = readFileTest('translationsCacheOBJ')
console.timeEnd('Read OBJ');

console.time('Read MAP');
var storedTranslationsMAP = readFileTestMAP('translationsCacheMAP')
console.timeEnd('Read MAP');

// Convert Object to Map
// This is here only for the first time this test is done, as we don't have a MAP stored as JSON
// And we need a full map to test (using an already filled translationCache file that was
// stored as simple Json)
storedTranslationsMAP = new Map(Object.entries(storedTranslationsOBJ)); 

let textTest = 'ズドーン！';
console.time('Test getting from obj succ');
if(storedTranslationsOBJ[textTest] !== undefined){
    console.log(storedTranslationsOBJ[textTest]);
}
console.timeEnd('Test getting from obj succ');
let textTest2 = 'ズドーン！safd';

console.time('Test getting from obj fail');
if(storedTranslationsOBJ[textTest2] !== undefined){
    console.log(storedTranslationsOBJ[textTest]);
}
console.timeEnd('Test getting from obj fail');

console.time('Test getting from MAP succ');
if(storedTranslationsMAP.has(textTest)){
    console.log(storedTranslationsMAP.get(textTest));
}
console.timeEnd('Test getting from MAP succ');

console.time('Test getting from MAP fail');
if(storedTranslationsMAP.has(textTest2)){
    console.log(storedTranslationsMAP.get(textTest));
}
console.timeEnd('Test getting from MAP fail');

console.time('Add to OBJ');
storedTranslationsOBJ['new entry'] = 'new entry text';
console.timeEnd('Add to OBJ');

console.time('Write OBJ');
writeFileTest('translationsCacheOBJ', storedTranslationsOBJ);
console.timeEnd('Write OBJ');

console.time('Add to MAP');
storedTranslationsMAP.set('new entry', 'new entry text');
console.timeEnd('Add to MAP');

console.time('Write MAP');
writeFileTestMAP('translationsCacheMAP', storedTranslationsMAP);
console.timeEnd('Write MAP');