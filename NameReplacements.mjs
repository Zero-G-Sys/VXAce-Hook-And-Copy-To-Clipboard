/**
 *  These replacements will be done before copying the text into clipboard.
 *  Name replacements, add each name to the const nameReplacements.
 *  The output will be a list with all names with honorifics added.
 */
try {
  const nameReplacements = {
    チャラ男: 'Playboy',
  };
  var nameReplacementsWitHonorifics = {};

  for (let [key, value] of Object.entries(nameReplacements)) {
    nameReplacementsWitHonorifics[key + '姉さん'] = value + '-neesan';
    nameReplacementsWitHonorifics[key + 'さん'] = value + '-san';
    nameReplacementsWitHonorifics[key + 'さま'] = value + '-sama';
    nameReplacementsWitHonorifics[key + '様'] = value + '-sama';
    nameReplacementsWitHonorifics[key + 'くん'] = value + '-kun';
    nameReplacementsWitHonorifics[key + '君'] = value + '-kun';
    nameReplacementsWitHonorifics[key + 'ちゃん'] = value + '-chan';
    nameReplacementsWitHonorifics[key + 'たん'] = value + '-tan';
    nameReplacementsWitHonorifics[key + '先輩'] = value + '-senpai';
    nameReplacementsWitHonorifics[key + 'せんぱい'] = value + '-senpai';
    nameReplacementsWitHonorifics[key + '先生'] = value + '-sensei';
    nameReplacementsWitHonorifics[key + 'せんせい'] = value + '-sensei';
    nameReplacementsWitHonorifics[key + 'おねえちゃん'] = value + '-onechan';
    nameReplacementsWitHonorifics[key + 'お姉ちゃん'] = value + '-onechan';
    nameReplacementsWitHonorifics[key + 'リン'] = value + 'rin';
    nameReplacementsWitHonorifics[key + '姉様'] = value + '-anesama';
    nameReplacementsWitHonorifics[key + 'お兄様'] = value + '-onisama';
    nameReplacementsWitHonorifics[key + '姉ちゃん'] = value + '-neechan';
    nameReplacementsWitHonorifics[key + '兄ちゃん'] = value + '-niichan';
    nameReplacementsWitHonorifics[key] = value;
  }
} catch (error) {
  console.error('NameReplacements Module Error. Did you format it correctly?');
  console.error(error);
}

export default nameReplacementsWitHonorifics;
