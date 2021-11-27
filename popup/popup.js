
function loadData() {
	// Load saved option of languages from storage
	chrome.storage.local.get(null, function(result) {
		const appState = result[APP_STATE_KEY];
		const value =  appState === APP_STATE_OFF ? false : true;
		$('#switch')[0].checked = value;

		const sourceLanguage = result[sourceLanguageKey];
		if (sourceLanguage)
			$('#source-language').val(codeToLanguageMaps[sourceLanguage]);

		const translatedLanguage = result[translateLanguageKey];
		if (translatedLanguage)
			$('#translated-language').val(codeToLanguageMaps[translatedLanguage]);
	});
}

function bindChange() {
	$('#switch')[0].onchange = function(e) {
		chrome.storage.local.set({
			[APP_STATE_KEY]: e.target.checked ? APP_STATE_ON : APP_STATE_OFF
		})
	};

	$('#source-language').change(function(event){
		chrome.storage.local.set({
			[sourceLanguageKey]: languageToCodeMaps[event.target.value]
		});
	});

	$('#translated-language').change(function(event){
		const code = languageToCodeMaps[event.target.value];
		if (code)
			chrome.storage.local.set({
				[translateLanguageKey]: code
			});
		else
			chrome.storage.local.remove(translateLanguageKey);
	})
}

function bootstrap() {
	$('#support-btn').click(function() {
		chrome.tabs.create({
			url: 'https://www.facebook.com/groups/4576502349069441'
		})
	})
}
$(function(){
	languageCodes.forEach(v => {
		$('#source-language').append(`<option>${v[0]}</option>`);
		$('#translated-language').append(`<option>${v[0]}</option>`);
	});
	bootstrap()
	loadData();
	bindChange();
});


const languageCodes = `Afrikaans af
Albanian sq
Amharic am
Arabic ar
Armenian hy
Azerbaijani az
Basque eu
Belarusian be
Bengali bn
Bosnian bs
Bulgarian bg
Catalan ca
Cebuano ceb
Chinese(Simplified) zh-CN
Chinese(Traditional) zh-TW
Corsican co
Croatian hr
Czech cs
Danish da
Dutch nl
English en
Esperanto eo
Estonian et
Finnish fi
French fr
Frisian fy
Galician gl
Georgian ka
German de
Greek el
Gujarati gu
Haitian Creole ht
Hausa ha
Hawaiian haw
Hebrew he
Hindi hi
Hmong hmn
Hungarian hu
Icelandic is
Igbo ig
Indonesian id
Irish ga
Italian it
Japanese ja
Javanese jv
Kannada kn
Kazakh kk
Khmer km
Kinyarwanda rw
Korean ko
Kurdish ku
Kyrgyz ky
Lao lo
Latin la
Latvian lv
Lithuanian lt
Luxembourgish lb
Macedonian mk
Malagasy mg
Malay ms
Malayalam ml
Maltese mt
Maori mi
Marathi mr
Mongolian mn
Myanmar(Burmese) my
Nepali ne
Norwegian no
Nyanja(Chichewa) ny
Odia (Oriya) or
Pashto ps
Persian fa
Polish pl
Portuguese(Portugal,Brazil) pt
Punjabi pa
Romanian ro
Russian ru
Samoan sm
Scots Gaelic gd
Serbian sr
Sesotho st
Shona sn
Sindhi sd
Sinhala(Sinhalese) si
Slovak sk
Slovenian sl
Somali so
Spanish es
Sundanese su
Swahili sw
Swedish sv
Tagalog(Filipino) tl
Tajik tg
Tamil ta
Tatar tt
Telugu te
Thai th
Turkish tr
Turkmen tk
Ukrainian uk
Urdu ur
Uyghur ug
Uzbek uz
Vietnamese vi
Welsh cy
Xhosa xh
Yiddish yi
Yoruba yo
Zulu zu`.split('\n').map(v => v.split(' '));

let languageToCodeMaps = {
	'Detect language': 'auto'
};
let codeToLanguageMaps = {
	'auto': 'Detect language'
};
languageCodes.forEach(v => {
	languageToCodeMaps[v[0]] = v[1];
	codeToLanguageMaps[v[1]] = v[0];
});

