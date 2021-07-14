const page1 = /*HTML*/ `<h1>This is the first Page</h1> 
<p>Here we have mixed stuff.</p>
<div>
    <h2>Look! I'm in a div</h2>
    {{imageComponent}}
</div>
`;

const pageData = {
	title: 'Page 1',
	template: page1,
};
FPTE.register('pageOne', pageData, 'page');
