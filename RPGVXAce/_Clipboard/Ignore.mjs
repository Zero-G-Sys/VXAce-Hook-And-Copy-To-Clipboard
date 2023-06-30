/**
 *  If a word in the ignore array is within the text to be copied to the clipboard
 *  the text will be ignored and NOT be copied to clipboard
 */
try {
  var ignore = [
    //"Example",
  ];
} catch (error) {
  console.error('Ignore Module Error. Did you format it correctly?');
  console.error(error);
}

export default ignore;
