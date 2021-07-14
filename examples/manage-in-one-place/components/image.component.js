const imageComponentTemplate = /*HTML*/ (src, alt) => {
	return `<img src="${src}" alt="${alt}" width="500">{{listComponent}}`;
};
const imgSource =
	'https://cdn.pixabay.com/photo/2019/10/02/09/35/cat-4520518_1280.jpg';

FPTE.registerTemplate(
	imageComponentTemplate.bind(this, imgSource, 'cat'),
	'imageComponent',
	'component'
);
