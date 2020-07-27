function getParam(url, param) {
	const temp = new URL(url);
	return temp.searchParams.get(param);
}
