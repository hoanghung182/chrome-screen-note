const toOption = $('.to-option');
const toIndex = $('.to-index');
const optionUrl = 'option.html';
const indexUrl = 'index.html';

const author = 'hoangvanhung182';
const subject = 'Do you have any suggestion?';
const mailToHref = 
	`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${author}@gmail.com&su=${subject}`;

$(document).ready(() => {
	toOption.attr('href', optionUrl);
	toIndex.attr('href', indexUrl);
	const mailToAuthor = $('.author');

	mailToAuthor.attr('href', 'mailto:author');
	mailToAuthor.on('click', function () {
		$(this).attr('href', mailToHref);
	});
});