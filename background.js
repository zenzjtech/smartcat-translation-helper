const getTranslationResultScript = `document.querySelector("#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.P6w8m.BDJ8fb > div.dePhmb > div > div.J0lOec").innerText`
let timeOut = 300;
const maxRetries = 20

const script = () => `$.ajax({
  type: "POST",
  url: url,
  data: data,
  success: success,
  dataType: dataType
});`

/*chrome.webRequest.onBeforeRequest.addListener(function (details) {
	console.log(details);
	const buf = details.requestBody.raw[0].bytes;
	const jsonData = JSON.parse(dec.decode(buf));
	if (!jsonData.text) {
		return {redirectUrl: "javascript:"}
	}
		/!*chrome.storage.local.get(CURRENT_TRANSLATED_TEXT_KEY, function(result) {
			if (result[CURRENT_TRANSLATED_TEXT_KEY])
				jsonData.text = result[CURRENT_TRANSLATED_TEXT_KEY];
			details.requestBody = {
				raw: [{bytes: enc.encode(JSON.stringify(jsonData))}]
			};
		});*!/

}, {
	urls: ['*://!*.smartcat.ai/api/Segments/!*!/SegmentTargets/!*!/Confirm*']
}, ["requestBody", "blocking"]);*/

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	console.log(details);
	/*const buf = details.requestBody.raw[0].bytes;
	const jsonData = JSON.parse(dec.decode(buf));
	console.log(jsonData);*/
}, {
	urls: ['*://*.smartcat.ai/api/Segments/*/SegmentTargets/*/Confirm*']
});

function getResult(sendResponse, googleTranslateTabId) {
	let counter = 0;
	const t = setInterval(function(){
		chrome.tabs.executeScript(googleTranslateTabId, {
			code: getTranslationResultScript,
		}, function(translationResult) {
			counter += 1
			if (counter === maxRetries) {
				clearInterval(t)
				handleCallback(sendResponse, ["Max retries reached (20 times), but can't get the result. Please try again!"]);
				return
			}
			if (translationResult.length && translationResult[0]) {
				clearInterval(t)
				handleCallback(sendResponse, translationResult);
			}
		});
	}, timeOut)

}

function handleCallback(sendResponse, translationResult) {
	sendResponse({
		name: FINISH_TRANSLATE,
		translationResult
	})
}

function formGoogleTranslateUrl(sourceLanguage, translatedLanguage, query) {
	let rootUrl = GOOGLE_TRANS_ROOT_URL
		.replace('&tl=', `&tl=${translatedLanguage}`)
		.replace('$sl=', `&sl=${sourceLanguage}`);
	return rootUrl + query;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if (message.name === OPEN_POPUP_MSG) {
		chrome.tabs.create({ url: "popup/popup.html" });
		return;
	}
	chrome.tabs.query({
		currentWindow: true
	}, function(tabs) {
		let googleTranslateTab = tabs.find(tab => tab.url.includes('translate.google.com'))
		const currentTabId = tabs.find(tab => tab.active === true).id;
		const url = formGoogleTranslateUrl(
			message.sourceLanguage, message.translatedLanguage, message.data
		);
		if (googleTranslateTab) {
			chrome.tabs.update(
				googleTranslateTab.id
				, {
					url
				})
			getResult(sendResponse, googleTranslateTab.id);
		} else {
			chrome.tabs.create({
				url
			}, function (newTab) {
				chrome.tabs.update(currentTabId, {
					active: true
				})
				getResult(sendResponse, newTab.id);
			})
		}
	});
	return true;
});
