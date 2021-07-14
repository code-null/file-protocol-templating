//  File Protocol Templating Engine
class FPTemplatingEngine {
	version = `1.0.0.0`;

	defaultConfig = {
		pages: {},
		components: {},
		openingTag: '{{',
		closingTag: '}}',
		replacingRegex: (open, close, value) =>
			new RegExp(`${open}${value}${close}`, 'gm'),
		autoInit: true,
		awaitSources: true,
		mainOutlet: 'main-content',
	};

	types = {
		page: 'pages',
		component: 'components',
	};

	injectMethods = {
		replace: 'replace',
		append: 'append',
	};

	functionTypes = {
		noParams: 'function',
		bound: 'function-bound',
		template: 'function-template',
	};

	attributes = {
		injectPage: 'inject-page',
		injectComponent: 'inject-component',
		replace: 'replace',
		ignore: 'ignore',
		injectOutlet: 'inject-outlet',
		ignoreTitle: 'ignore-title',
		params: 'params',
		defaultPage: 'default-page',
	};

	constructor(config) {
		const opening = config.openingTag;
		const closing = config.closingTag;
		if (!config.replacingRegex) {
			config.replacingRegex = this.defaultConfig.replacingRegex.bind(
				this,
				opening ? closing : this.defaultConfig.openingTag,
				closing ? opening : this.defaultConfig.closingTag
			);
		}

		this.config = Object.assign(this.defaultConfig, config);
		this.pages = this.generateReplacerMapFor('pages');
		this.components = this.generateReplacerMapFor('components');
		if (this.config.sources) {
			this.config.sources.forEach(source => {
				this.bindFiles(source);
			});
		}

		if (!this.config.autoInit) return;
		if (!this.config.awaitSources) {
			this.init();
			return;
		}
		window.addEventListener('load', () => {
			this.init();
		});
	}

	init() {
		document.body.innerHTML = this.replaceAllInElement(document.body.innerHTML);
		this.injectAllPages(document);
		this.injectAllComponents(document);
		this.loadOutletDefaultPages(document);
	}

	loadOutletDefaultPages(parentElement) {
		const injectionAttribute = this.attributes.injectOutlet;
		const allOutlets = parentElement.querySelectorAll(
			`[${injectionAttribute}]`
		);
		const pageFromUrl = this.getUrlParameter('page');
		const paramsFromUrl = this.getUrlParameter('params');
		allOutlets.forEach(outlet => {
			const outletId = outlet.getAttribute(`${injectionAttribute}`);

			const isMainOutlet = outletId === this.config.mainOutlet;
			if (isMainOutlet && pageFromUrl) {
				this.loadPage(pageFromUrl, outletId, paramsFromUrl);
				return;
			}
			const defaultPage = outlet.getAttribute(this.attributes.defaultPage);
			if (!defaultPage) return;
			this.loadToOutlet(defaultPage, outletId);
		});
	}

	loadPage(pageKey, outletId, params = null) {
		const outlet = document.querySelector(`[inject-outlet=${outletId}]`);
		if (!outlet) return;
		let ignoreTitle = false;
		const outletIgnoreTitle = outlet.getAttribute(this.attributes.ignoreTitle);
		if (outletIgnoreTitle) {
			ignoreTitle = outletIgnoreTitle;
		}

		// First only inject the pages template
		this.injectPageByKey(outlet, pageKey, params, ignoreTitle);
		// Then replace all placeholders
		outlet.innerHTML = this.replaceAllInElement(outlet);
		// Then check for any other injection needs for pages
		this.injectAllPages(outlet);
		// Then check for any injection needs for components
		this.injectAllComponents(outlet);
		// Lastly update URL
		const isMainOutlet = outletId === this.config.mainOutlet;
		if (isMainOutlet) this.updateUrl(pageKey, params);
		this.loadOutletDefaultPages(outlet);
	}
	loadComponent(componentKey, outletId, params = null) {
		const outlet = document.querySelector(`[inject-outlet=${outletId}]`);
		if (!outlet) return;

		let ignoreTitle = false;
		const outletIgnoreTitle = outlet.getAttribute(this.attributes.ignoreTitle);
		if (outletIgnoreTitle) {
			ignoreTitle = outletIgnoreTitle;
		}

		// First only inject the pages template
		this.injectComponentByKey(outlet, componentKey, params, ignoreTitle);
		// Then replace all placeholders
		outlet.innerHTML = this.replaceAllInElement(outlet);
		// Then check for any other injection needs for pages
		this.injectAllPages(outlet);
		// Then check for any injection needs for components
		this.injectAllComponents(outlet);
		// Lastly update URL
		const isMainOutlet = outletId === this.config.mainOutlet;
		if (isMainOutlet) this.updateUrl(componentKey, params);
		this.loadOutletDefaultPages(outlet);
	}

	injectAllPages(parentElement) {
		const attribute = this.attributes.injectPage;
		const pageInjectionElements = parentElement.querySelectorAll(
			`[${attribute}]`
		);

		pageInjectionElements.forEach(element => {
			const pageKey = element.getAttribute(attribute);
			let ignoreTitle = false;
			const elementIgnoreTitle = element.getAttribute(
				this.attributes.ignoreTitle
			);
			if (elementIgnoreTitle) {
				ignoreTitle = elementIgnoreTitle;
			}

			let params = element.getAttribute(this.attributes.params);

			this.injectPageByKey(element, pageKey, params, ignoreTitle);

			element.innerHTML = this.replaceAllInElement(element);
			this.injectAllComponents(element);
			const subPageInjectionElements = element.querySelectorAll(
				`[${attribute}]`
			);

			subPageInjectionElements.forEach(subElement => {
				this.injectAllPages(subElement);
			});
		});
	}

	injectAllComponents(parentElement) {
		const attribute = this.attributes.injectComponent;
		const componentInjectionElements = parentElement.querySelectorAll(
			`[${attribute}]`
		);

		componentInjectionElements.forEach(element => {
			const componentKey = element.getAttribute(attribute);
			this.injectComponentByKey(element, componentKey);
			element.innerHTML = this.replaceAllInElement(element);

			const subComponentInjectionElements = element.querySelectorAll(
				`[${attribute}]`
			);
			subComponentInjectionElements.forEach(subElement => {
				this.injectAllPages(subElement);
			});
		});
	}

	injectPageByKey(element, pageKey, params, ignoreTitle) {
		const pageData = this.getPageData(pageKey);
		if (!pageData) return;

		const template = this.getTemplate(pageData, params);
		const injectionMethod = this.getInjectionMethod(pageData);
		this.injectIntoElement(injectionMethod, element, pageKey, template);
		if (pageData.title && !ignoreTitle) {
			document.title = pageData.title;
		}
	}

	injectComponentByKey(element, componentKey, params = null) {
		const componentData = this.getComponentData(componentKey);
		const template = this.getTemplate(componentData, params);
		const injectionMethod = this.getInjectionMethod(componentData);
		this.injectIntoElement(injectionMethod, element, componentKey, template);
	}

	injectIntoElement(injectionMethod, element, key, template) {
		switch (injectionMethod) {
			case this.injectMethods.replace:
				element.innerHTML = template;
				break;
			case this.injectMethods.append:
				element.innerHTML = `${element.innerHTML}${template}`;
				break;
			default:
				element.innerHTML = this.findAndReplace(
					element.innerHTML,
					key,
					template
				);
				break;
		}
	}

	loadToOutlet(
		key,
		outletId = this.config.mainOutlet,
		type = 'page',
		params = null
	) {
		let typeKey;
		switch (type) {
			case 'page':
			case 'pages':
				typeKey = this.types.page;
				break;
			case 'component':
			case 'components':
				typeKey = this.types.component;
				break;
		}

		if (typeKey === this.types.page) {
			this.loadPage(key, outletId, params);
			return;
		}
		this.loadComponent(key, outletId, params);
	}

	replaceAllInElement(parentElement, ignoreList = []) {
		let tempString = parentElement.innerHTML;
		let tempnode = parentElement;
		if (typeof parentElement === 'string') {
			tempString = parentElement;
			tempnode = this.generateTempElement(tempString);
		}

		//  Generate ignore List
		const elementsWithIgnoreValue = tempnode.querySelectorAll(
			`[${this.attributes.ignore}]`
		);

		elementsWithIgnoreValue.forEach(element => {
			const ignoreValue = element.getAttribute(this.attributes.ignore);
			const ignoreValuesSplitted = ignoreValue ? ignoreValue.split(' ') : [];
			ignoreList = ignoreList.concat(...ignoreValuesSplitted);
		});

		const allReplacers = this.findAllReplacers(tempString);
		allReplacers.forEach(replacer => {
			let [key, params] = replacer[0]
				.replaceAll(this.config.openingTag, '')
				.replaceAll(this.config.closingTag, '')
				.split('=');
			if (ignoreList.includes(key)) return;
			const data = this.getDataFromSources(key);
			if (!params) {
				params = null;
			}
			let template = this.getTemplate(data, params);

			if (!template) {
				return tempString;
			}
			template = this.replaceAllInElement(template, ignoreList);
			tempString = tempString.replaceAll(replacer, template);
		});
		return tempString;
	}

	replaceAllInString(stringInput, ignoreList) {
		let stringOutput = stringInput;
		this.components.forEach((componentData, key) => {
			if (ignoreList.includes(key)) return;
			stringOutput = this.findAndReplace(
				stringOutput,
				key,
				componentData.template
			);
		});
		return stringOutput;
	}

	findAllReplacers(inputString) {
		const regex = this.config.replacingRegex('.*?');
		return [...inputString.matchAll(regex)];
	}

	findAndReplace(inputString, key, template) {
		const regex = this.config.replacingRegex(key);
		return inputString.replaceAll(regex, template);
	}

	// Getters
	getPageData(key) {
		return this.pages.get(key);
	}

	getComponentData(key) {
		return this.components.get(key);
	}

	getTemplate(data, params = null) {
		if (!data) return;
		let template = data.template;
		if (!template) return '';
		const regex = new RegExp(/\[.*\]/gm);
		if (typeof params === 'string' && params.trim().length > 0) {
			if (regex.test(params)) {
				params = JSON.parse(params);
			}
		}

		//  Check if the template is a function
		if (typeof template === 'function' || data.templateType === 'function') {
			switch (data.functionType) {
				case this.functionTypes.template:
					template = template(params);
					break;
				case this.functionTypes.bound:
				default:
					template = template();
					break;
			}
		}
		return template;
	}

	getDataFromSources(key) {
		const pageData = this.getPageData(key);
		if (pageData) {
			return pageData;
		}
		const componentData = this.getComponentData(key);
		if (componentData) {
			return componentData;
		}
	}

	getInjectionMethod(templateData, defaultMethod = this.injectMethods.replace) {
		if (!templateData) return;
		const method = templateData.injectMethod;
		if (!method) return defaultMethod;
		return method;
	}

	getRegex() {
		if (this.config.replacingRegex instanceof RegExp) {
			return this.config.replacingRegex;
		}
		if (typeof this.config.replacingRegex === 'string') {
			return new RegExp(this.config.replacingRegex, 'gm');
		}
		return this.defaultConfig.replacingRegex(
			this.config.openingTag,
			this.config.closingTag
		);
	}

	// Generators
	generateReplacerMapFor(key) {
		const replacerMap = new Map();
		Object.entries(this.config[key]).forEach(([key, data]) => {
			replacerMap.set(key, data);
		});
		return replacerMap;
	}

	//  Helper Functions
	bindFiles(source) {
		const newSrc = document.createElement('script');
		newSrc.setAttribute('src', source);
		document.head.appendChild(newSrc);
	}

	registerTemplate(template, key, type) {
		let typeKey;
		switch (type) {
			case 'page':
			case 'pages':
				typeKey = this.types.page;
				break;
			case 'component':
			case 'components':
				typeKey = this.types.component;
				break;
			default:
				typeKey = this.types.component;
		}

		const pageData = this[typeKey].get(key);
		const newPageData = { ...pageData };
		newPageData.template = template;
		this[typeKey].set(key, newPageData);
	}

	register(key, data, type) {
		let typeKey;
		switch (type.toLowerCase()) {
			case 'page':
			case 'pages':
				typeKey = this.types.page;
				break;
			case 'component':
			case 'components':
				typeKey = this.types.component;

				break;
			default:
				typeKey = this.types.component;
		}

		this[typeKey].set(key, data);
	}

	updateUrl(page, params) {
		const paramsForUrl = `&params=${params}`;
		window.history.replaceState(
			null,
			null,
			`?page=${page}${params ? paramsForUrl : ''}`
		);
	}

	getUrlParameter(param) {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		return urlParams.get(param);
	}

	generateTempElement(innerHTML) {
		const templateNode = document.createElement('template');
		templateNode.innerHTML = innerHTML;
		return templateNode.content;
	}
}
