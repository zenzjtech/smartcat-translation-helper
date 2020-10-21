function getParam(url, param) {
	const temp = new URL(url);
	return temp.searchParams.get(param);
}

function log(...args) {
	if (!DEBUG)
		return;
	console.log(...args);
}
