function listComponentTemplate(args) {
	if (!args) {
		return '<div>NO Arguments were given!</div>';
	}
	const [listItems, listTitle] = args;

	let listItemsCode = '';
	if (listItems) {
		listItems.forEach(item => {
			listItemsCode += `<li>${item}</li>`;
		});
	}
	/*HTML*/
	return `
	<h3>${listTitle}</h3>
<ul>
	${listItemsCode}
</ul>

`;
}

listComponent = {
	template: listComponentTemplate,
	injectMethod: 'replace',
	functionType: 'function-template',
};

FPTE.register('listComponent', listComponent, 'component');
