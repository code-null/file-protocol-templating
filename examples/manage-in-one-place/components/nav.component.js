const headerTemplate = /*HTML*/ `
<div class="topnav">
   <a onclick="loadPage('home');">Home</a>
	<a onclick="loadPage('1');">Page 1</a>
	<a onclick="loadPage('2');">Page 2</a>

</div>
`;
FPTE.registerTemplate(headerTemplate, 'header', 'component');
