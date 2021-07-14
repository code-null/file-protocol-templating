const listArgs = `[['Footer 1', 'Footer 2'], 'This is a Footer List']`;
const footer = /*HTML*/ `
<div class="footer">
    <h1>This is the footer</h1>
    <div>
        <p>Press one of the buttons to add or replace pages and components</p>
    </div>
    <div style="margin-bottom: 1em;">
        <button onClick="FPTE.loadToOutlet('listComponent', 'footer-inner-outlet','component', ${listArgs});">List (Replaces)</button>
        <button onClick="FPTE.loadToOutlet('imageComponent', 'footer-inner-outlet','component');">Image (Appends)</button>
    </div>
    <div inject-outlet="footer-inner-outlet" ignore-title="true"></div>
</div>
    `;

FPTE.registerTemplate(footer, 'footer', 'page');
