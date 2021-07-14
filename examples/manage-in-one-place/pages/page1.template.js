const page1 = /*HTML*/ `<h1>This is the first Page</h1> 
<p>Here we have mixed stuff.</p>
<div>
    <h2>Look! I'm in a div</h2>
    {{imageComponent}}
</div>
`;
FPTE.registerTemplate(page1, 'page1', 'page');
