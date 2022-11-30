const restoreButton = $('#restore');
const deviceName = $('#device-name');
const contentKey = 'screenNote-content';
const isChangedKey = 'screenNote-isChanged';
const deviceNameKey = 'screenNote-deviceName';

$(document).ready(() => {
	restoreButton.on('click', restoreData);
	loadDeviceName();
	deviceName.on('change keyup', setDeviceName);
});

/**
 * Restore from backup data
 */
const restoreData = () => {
	const restoreContent = $('.restore-textarea').val();
	if (restoreContent.length !== 0) {
		localStorage.setItem(contentKey, restoreContent);
		localStorage.removeItem(isChangedKey);
		window.location.href = 'index.html';
	} else {
		alert('Textarea must not be empty');
	}
}

/**
 * Load device name from localstorage
 */
const loadDeviceName = () => deviceName.val(localStorage.getItem(deviceNameKey));

/**
 * Set device name to localstorage on changed
 */
const setDeviceName = () => localStorage.setItem(deviceNameKey, deviceName.val());
