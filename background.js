const getTranslationResultScript = `document.querySelector("body > div.container > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > div > span.tlid-translation.translation").innerText`;

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
	}, 500)
	
}

function handleCallback(sendResponse, translationResult) {
	sendResponse({
		name: FINISH_TRANSLATE,
		translationResult
	})
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	chrome.tabs.query({
		currentWindow: true
	}, function(tabs) {
		let googleTranslateTab = tabs.find(tab => tab.url.includes('translate.google.'))
		const currentTabId = tabs.find(tab => tab.active === true).id;
		if (googleTranslateTab) {
			chrome.tabs.update(googleTranslateTab.id, {
				active: true,
				url: GOOGLE_TRANS_ROOT_URL + message.data
			}, function () {
				getResult(sendResponse, currentTabId);
			});
		} else {
			chrome.tabs.create({
				url: GOOGLE_TRANS_ROOT_URL + message.data
			}, function () {
				getResult(sendResponse, currentTabId);
			})
		}
	});
	return true;
});
