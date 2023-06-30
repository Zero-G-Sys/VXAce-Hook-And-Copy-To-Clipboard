/**
 *  Proof of concept of a queue (FIFO) of Promises to resolve multiple translations attempts
 *  Base code from here https://www.ccdatalab.org/blog/queueing-javascript-promises
 *  Not tested
 *  May want to change it to LIFO to give priority to the last message on display
 */

// Create queue object (Utility function, don't replace anything here)
const Queue = (onResolve, onReject) => {
  const items = [];

  const dequeue = () => {
    // no work to do
    if (!items[0]) return;

    items[0]()
      .then(onResolve)
      .catch(onReject)
      .then(() => items.shift())
      .then(dequeue);
  };

  const enqueue = (func) => {
    items.push(func);
    if (items.length === 1) dequeue();
  };

  return enqueue;
};

// Create Promise template that will handle the translation
function deepLTranslate(jpText){
    new Promise((resolve, reject) => {
        // Do translation logic here 
        // (access second window and wait for translation)
        let intervalTime = 250;
        let timeToWaitUntilError = 10000; // These two vars can be taken outside as configuration
        let count = 0;
        let stopAt = Math.ceil(timeToWaitUntilError/intervalTime)

        // Loop until translation is done
        setInterval(() => {
            count++;
            if(count === stopAt) reject(jpText) 
            // Check if translation is done
            // TODO: add logic to check that here, create vars translationDone:Boolean and translation:String with translated text
            // probably cleaner to do that on a function and return null on translation not done and text on done
            // and bellow instead of checking for translationDone:Boolean check for not null
            if(translationDone) resolve({jpText: jpText, translation: translation}); // return an object with jpText and translation. Would be better if you defined that object and didn't use an anonymous one
        }, intervalTime);
    });
}

// Create a queue and handle promises callbacks
// Define here how it will handle translation results
const deepLTranslationQueue = Queue(
    // Translation successful
    (responseObject) => { // change variable name to proper one once you create one for it in line 48
        // Access results like this: responseObject.jpText and responseObject.translation
        // Add translation to cache
        // Call replace text 
        /* (When calling replace text it would be nice to check if the current textbox is displaying the jpText received here, 
        otherwise ignore it, so you can skip textboxes without problem, remember to disable sending translation on skipping text 
        with control and to still save to cache anyway) (may need bind or call(this) the replaceText function as it will need the 
        window object, that if it's too much trouble you can store it in a global variable, as in javascript it is treated like a 
        pointer) (another way is if calling the last function [line 84] from within Window you can attach 'this')
        */        
    },
    // Translation failed, shift to next item in queue
    (jpText) => {
        // Don't add to cache
        // Manege error
    }
);

// Important that Queue and deepLTranslationQueue (enqueue) cont functions be declared before being used, so either put the at top of the file or have them in another
// and import them. Both are using closures, so they can't be converted to normal functions

// Finally call the created queue and add promises to it
// ex:
deepLTranslationQueue(() => deepLTranslate('some japanese text'));

// Optionally and recommended, make a function of the previous line
function translate(jpText){
    deepLTranslationQueue(() => deepLTranslate(jpText));
}
// And call it like this
translate('some japanese text'); 
// May need to send 'this' too if calling it from Window_Message
Window_Message.prototype.update = function () {
    //balbalbla
    translate('some japanese text', this);
}
// If you do send 'this' modify all the other functions to accept that 'this', as it will be needed to call this.replaceText()
// Though... if possible setting the initialized Window_Message to a global variable may be more practical, if you do that
// remember that there is a place where $game_temp is set, try to set it there
