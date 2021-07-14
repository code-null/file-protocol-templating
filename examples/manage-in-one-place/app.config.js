const appConfig = {
	sources: [
		'components/nav.component.js',
		'components/list.component.js',
		'components/image.component.js',
		'pages/home.template.js',
		'pages/page1.template.js',
		'pages/page2.template.js',
		'pages/footer.template.js',
	],
	pages: {
		home: {
			title: 'Home',
		},
		page1: {
			title: 'Page 1',
		},
		page2: {
			title: 'Page 2',
			functionType: 'function-template',
		},
		footer: {
			title: 'Footer',
		},
	},
	components: {
		header: {},
		listComponent: {
			injectMethod: 'replace',
			functionType: 'function-template',
		},
		imageComponent: {
			injectMethod: 'append',
		},
	},
};
