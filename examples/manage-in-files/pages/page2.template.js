function page2(listTitle) {
	/*HTML*/ return `
    <h1>This is the second page!</h1>
    <div >
        {{listComponent=[["Item 1","Item 2"], "${listTitle}"]}}
    <div>`;
}

const pageData2 = {
	template: page2,
	title: 'Page 2',
	functionType: 'function-template',
};
FPTE.register('page2', pageData2, 'page');
