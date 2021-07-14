function page2(listTitle) {
	/*HTML*/ return `
    <h1>This is the second page!</h1>
    <div >
        {{listComponent=[["Item 1","Item 2"], "${listTitle}"]}}
    <div>`;
}
FPTE.registerTemplate(page2, 'page2', 'page');
