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
	targetNode.find('.l-content-editor').html('');
	targetNode.find('.l-content-editor')
		.append(`<span class="l-content-editor__text">${result}</span>`)
}
function handleNodeClick() {
	chrome.storage.local.get(null, function(language) {
		const translatedLanguage = language[translateLanguageKey];
		if (!translatedLanguage) {
			setResult(`<p style="color: red">${NOT_YET_PICK_TRANSLATE_LANGUAGE_ERROR_TEXT}</p>`);
			return;
		}
		selectText(currentNode);
		document.execCommand('copy');
		chrome.runtime.sendMessage({
			name: START_TRANSLATE,
			data: currentNode.innerText,
			translatedLanguage
		}, function (response) {
			let result = response.translationResult[0];
			if (!result)
				result = `<p style="color: red">${DEFAULT_ERROR_TEXT}</p>`;
			setResult(result);
		})
	})
	
}

setInterval(function(){
	currentNode = getSelectedNode(window.getSelection().focusNode);
	if (!currentNode)
		return;
	parentOfCurrentNode = getParentElement(currentNode);
	// only translate source
	if (isSourceOrTarget(parentOfCurrentNode) !== 'source')
		return;
	// currentNode.onclick = handleNodeClick();
	if (currentNode !== preNode) {
		handleNodeClick();
	}
	preNode = currentNode;
}, 100);

