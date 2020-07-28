const getTranslationResultScript = `document.querySelector("body > div.container > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > div > span.tlid-translation.translation").innerText`;
let timeOut = 500;

function getResult(sendResponse, smartcatTabId) {
	setTimeout(function(){
		chrome.tabs.executeScript({
			code: getTranslationResultScript,
		}, function(translationResult) {
			handleCallback(sendResponse, translationResult);
			chrome.tabs.update(smartcatTabId,{
				active: true
			}, function(){})
		});
	}, timeOut)
	
}

function handleCallback(sendResponse, translationResult) {
	sendResponse({
		name: FINISH_TRANSLATE,
		translationResult
	})
}

function formGoogleTranslateUrl(translatedLanguage, data) {
	let rootUrl = GOOGLE_TRANS_ROOT_URL.replace('&tl=', `&tl=${translatedLanguage}`);
	return rootUrl + data;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	chrome.tabs.query({
		currentWindow: true
	}, function(tabs) {
		let googleTranslateTab = tabs.find(tab => tab.url.includes('translate.google.'))
		const currentTabId = tabs.find(tab => tab.active === true).id;
		const url = formGoogleTranslateUrl(message.translatedLanguage, message.data);
		if (googleTranslateTab) {
			timeOut = 500;
			chrome.tabs.update(googleTranslateTab.id, {
				active: true,
				url
			}, function () {
				getResult(sendResponse, currentTabId);
			});
		} else {
			timeOut = 1000;
			chrome.tabs.create({
				url
			}, function () {
				getResult(sendResponse, currentTabId);
			})
		}
	});
	return true;
});
