/**
 *  These replacements will be done before copying the text into clipboard.
 *  First field is the original text, can be a regex.
 *  Second field is to what it should be replaced with, it can also be a
 *  callback (check replace documentation for more info).
 */
try {
  var replacements = new Map([
    // Deepl doesn't like these characters
    ['♥', '#'],
    ['♡', '#'],
    // Punctuations
    ['・・・', '...'],
    // '・', ''],
    // '（', '.（'],
    // '「.（', '「（'],
    // //'「', '.「'],
    // '<.「', '<「'],
    // /\\. *「', '「'],
    [/\. */g, ''], // Text starts with dot (remove)
    // DeepL corrections
    [/！{2,}/g, '！'], // DeepL doesn't like multiple use of ！
    // General replacements
    ['お兄さん', 'Oniisan'],
    ['おにいさん', 'Oniisan'],
    ['兄さん', 'Niisan'],
    ['後輩', 'Kouhai'],
    ['パイズリフェラ', 'Paizuri Blowjob'],
    ['パイズリ', 'Paizuri'],
    ['お婆さん', 'Obaasan'], // Grandma
    ['おばさん', 'Obasan'], // Aunty
    ['おじさん', 'Ojisan'],
    ['おじいさん', 'Ojisan'],
    ['オジサン', 'Ojisan'],
    ['おじさん', 'Ojisan'],
    ['爺さん', 'Jiisan'],
    ['じいさん', 'Jiisan'],
    ['おっさん', 'Ossan'],
    ['親父', 'Oyaji'],
    ['お嬢ちゃん', 'Ojouchan'],
    ['お嬢さん', 'Ojousan'],
    ['お嬢様', 'Ojousama'],
    ['お姉さま', 'Onesama'],
    ['おねえさま', 'Onesama'],
    ['お姉さん', 'Onesan'],
    ['おねえちゃん', 'Onechan'],
    ['お姉ちゃん', 'Onechan'],
    ['姉ちゃん', 'Neechan'],
    ['ねーちゃん', 'Nee-chan'],
    ['おじさま', 'Ojisama'],
    ['おじ様', 'Ojisama'],
    ['叔父様', 'Ojisama'],
    ['ジジイ', 'Jijii'],
    ['老人', 'Rojin'], // Oldman - Elder person
    ['ヒヒ', 'Hihi'],
    ['ﾋﾋ', 'Hihi'],
    ['坊主', 'Bozu'],
    ['オナホ', 'Onahole'],
    ['肉便器', 'Meat Urinal'],
    ['先生', 'Sensei'],
    ['妖怪', 'Youkai'],
    ['ご主人様', 'Goshujinsama'],
    ['旦那様', 'Danna-sama'],
    ['旦那', 'Danna'],
    ['姉様', 'Anesama'],
    ['お兄様', 'Onisama'],
    ['シコ', 'Shiko'],
    ['兄ちゃん', 'Niichan'],
    ['奥さん', 'Okusan'],
    ['アクメ', 'Orgasm'],
    ['むにゅ', 'Munyu'],
    ['巫女', 'Miko'],
    ['嬢ちゃん', 'Jou-chan'],
    ['退魔師', 'Exorcist'],
    ['お札', 'Talisman'],
    ['ぐふふっ', 'Gufufu～'],
    ['ぐふふ', 'Gufufu'],
    ['くふふっ', 'Kufufu～'],
    ['くふふ', 'Kufufu'],
    ['ふふふ', 'Fufufu'],
    ['ふふ', 'Fufu'],
    ['ウフフ', 'Ufufu'],
    ['フフ', 'Fufu'],
    ['ｹｹｹ', 'Kekeke'],
    ['ｹｹ', 'Keke'],
    ['おいおい', 'Oioi'],
    ['ほら', 'Horahora'],
    ['あらあら', 'Ara ara'],
    ['えっとね', 'E~to ne'],
    ['えっと', 'E~to'],
    [/^(「|（|\()?えとね/g, 'Etone'],
    [/^(「|（|\()?えと/g, 'Eto'],
    ['う～ん', 'U~n'],
    [/^(「|（|\()?うん/g, 'Un'],
    [/^(「|（|\()?いやぁ～/g, 'Iyaa～'],
    [/もう！(！+)?/g, 'Mou!$1 '],
    [/^(「|（|\()?もう( |、|・|。|．|！|\\.|…)/g, 'Mou$2'], // Interferes with normal words if alone
    [/^(「|（|\()?あら( |、|・|。|．|！|\\.|…)/g, 'Ara$2'],
    [/^(「|（|\()?あらら( |、|・|。|．|！|\\.|…)/g, 'Arara$2'],
    [/^(「|（|\()?ん～/g, 'Nn～'],
    [/^(「|（|\()?くぅ～/g, 'Kwu～'],
    [/^(「|（|\()?おっと/g, 'O～to'],
    [/^(「|（|\()?アッレ(～)?/g, 'A～re$2'],
    [/^(「|（|\()?まったく/g, '$1Mataku'], // May be generate problems depending con context, 
    ['お母様', 'Okaasama'],
    ['お母さま', 'Okaasama'],
    ['淫魔', 'Succubus'],
    ['エロガキ', 'Erokid'],
    [/全く$/g, 'Mattaku'],
    ['オヤジ', 'Oyaji'],
    ['ショタコン', 'Shotacon'],
    [/(『|』)/g, '"'], // Set " for important words (Needs filter rules in firefox plugin deactivated and custom code on SetClipboardText), so not compatible with older caches
    ['うひひ', 'Uhihi'],
    ['マ〇コ', 'マンコ'], // katakana for manko (pussy) will also work for オマ〇コ -> オマンコ (omanko)
    ['チ〇ポ', 'チンポ'], // Katakana for chinpo (penis)
    ['やれやれ', 'Yareyare'],
    // Custom (Game Specific)
  ]);
} catch (error) {
  console.error('Replacements Module Error. Did you format it correctly?');
  console.error(error);
}

export default replacements;
