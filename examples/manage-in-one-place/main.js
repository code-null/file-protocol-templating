const defaultPageListTitle = 'This is the default title';
const FPTE = new FPTemplatingEngine(appConfig);
function loadPage(pageName, outletId = 'main-content') {
	switch (pageName) {
		case 'home':
			FPTE.loadPage('home', outletId);
			break;
		case '1':
			FPTE.loadPage('page1', outletId);
			break;
		case '2':
			FPTE.loadPage('page2', outletId, defaultPageListTitle);
			break;
	}
}
