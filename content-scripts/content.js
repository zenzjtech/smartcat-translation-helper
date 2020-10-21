// interval to enable confirmation of result
let it;
let currentTranslatedText;

function selectText(node) {
	if (document.body.createTextRange) {
		const range = document.body.createTextRange();
		range.moveToElementText(node);
		range.select();
	} else if (window.getSelection) {
		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(node);
		selection.removeAllRanges();
		selection.addRange(range);
	} else {
		console.warn("Could not select text in node: Unsupported browser.");
	}
}

function getSelectedNode(node)
{
	if (!node)
		return null;
	if (node.className === 'l-content-view l-content-editor')
		return node;
	return getSelectedNode(node.parentElement);
}

let preNode, currentNode, parentOfCurrentNode;

function getParentElement(node) {
	if (!node)
		return null;
	if (node.getAttribute('data-test'))
		return node;
	return getParentElement(node.parentElement);
}

function isSourceOrTarget(node) {
	if (!node)
		return null;
	return node.getAttribute('data-test');
}

function setResult(result) {
	const targetNode = $(parentOfCurrentNode).next();
	const tmp = targetNode.find('.l-content-editor');
	tmp.html('');
	tmp.append(`<span class="l-content-editor__text">${result}</span>`);
	it = setInterval(function() {
		const confirmNode = targetNode.next();
		let confirmTick = confirmNode.find('.l-segments__confirm-btn');
		if (confirmTick.attr('disabled') === 'disabled') {
			confirmTick.removeAttr('disabled');
		}
	}, 100)
}
function handleNodeClick() {
	log("prepare to query");
	chrome.storage.local.get(null, function(data) {
		const appState = data[APP_STATE_KEY];
		if (appState === APP_STATE_OFF)
			return;
		const translatedLanguage = data[translateLanguageKey];
		const sourceLanguage = data[sourceLanguageKey];
		if (!translatedLanguage) {
			setResult(`<p style="color: red">${NOT_YET_PICK_TRANSLATE_LANGUAGE_ERROR_TEXT}</p>`);
			chrome.runtime.sendMessage({
				name: OPEN_POPUP_MSG
			});
			return;
		}
		selectText(currentNode);
		document.execCommand('copy');
		chrome.runtime.sendMessage({
			name: START_TRANSLATE,
			data: currentNode.innerText,
			translatedLanguage,
			sourceLanguage
		}, function (response) {
			let result = response.translationResult[0];
			if (!result)
				result = `<p style="color: red">${DEFAULT_ERROR_TEXT}</p>`;
			currentTranslatedText = result;
			chrome.storage.local.set({[CURRENT_TRANSLATED_TEXT_KEY]: currentTranslatedText});
			setResult(result);
		})
	})
	
}

setInterval(function(){
	currentNode = getSelectedNode(window.getSelection().focusNode);
	if (!currentNode)
		return;
	currentNode.onclick = function() {
		preNode = null;
	};
	parentOfCurrentNode = getParentElement(currentNode);
	// only translate source
	if (isSourceOrTarget(parentOfCurrentNode) !== 'source')
		return;
	// currentNode.onclick = handleNodeClick();
	if (currentNode !== preNode) {
		preNode = currentNode;
		clearInterval(it);
		handleNodeClick();
	}
}, 100);

