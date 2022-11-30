const backupFolder = 'Screen Note Backup';
const autoBackup = 'auto';
const contentKey = 'screenNote-content';

const backupKey = 'screenNote-backup';
const isChangedKey = 'screenNote-isChanged';
const deviceNameKey = 'screenNote-deviceName';
const errorKey = 'screenNote-error';

const backupActionUrl
    = 'https://script.google.com/macros/s/AKfycbyl_CuM0rOHJL4h2KvZY0oko69EL3PKMgMA9u7-SHWEJG4sYOPD/exec';
const messages = {
    success: 'Successful',
    error: 'Error!',
    saving: 'Saving...',
    noChange: 'No changes'
};
const {error, success, saving, noChange} = messages;

let isAutoSave = false;
const mainContent = $('#main-content')
const saveButton = $('#save');
const saveButtonHtml = saveButton.html();
const date = new Date();
const period = 5 * 1000 * 60 * 60; // 5 hours

$(document).ready(() => {
    getFromStorage();
    mainContent.on('keyup', setToStorage);
    mainContent.focusin(getFromStorage);
    saveButton.on('click', submitData);

    const isError = localStorage.getItem(errorKey);
    if (isError) changeSaveButton(error, period);

    // Auto submit data if changed each 5 hours
    const {lastSaved = 0} = JSON.parse(localStorage.getItem(backupKey)) || {};
    const shouldSave = (date.getTime() - lastSaved) > period;
    if (shouldSave && !isError) {
        isAutoSave = true;
        submitData();
    }
});

/**
 * Get data from localStorage
 */
const getFromStorage = () => {
    const content = detectUrl(localStorage.getItem(contentKey));
    mainContent.html(content);
}

/**
 * Set data to localStorage
 */
const setToStorage = () => {
    localStorage.setItem(contentKey, mainContent.html());
    localStorage.setItem(isChangedKey, 'true');
}

/**
 * Change save button according to submit status
 */
const changeSaveButton = (message, delay = 3000) => {
    saveButton.html(message);
    saveButton.attr('disabled', true);
    if(delay) {
        setTimeout(() => {
            saveButton.html(saveButtonHtml);
            saveButton.removeAttr('disabled');
        }, delay);
    }
}

/**
 * Handle error on auto save data
 */
const handleError = () => {
    changeSaveButton(error, period);
    localStorage.setItem(errorKey, 'Resolve the issue and remove this');
}

/**
 * Submit data for backup purpose
 */
const submitData = () => {
    // Prepare http request
    const prepareHttpRequest = () => {
        const http = new XMLHttpRequest();
        http.open("POST", backupActionUrl, true);
        http.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        return http;
    }

    const isDataChanged = localStorage.getItem(isChangedKey);
    if (!isDataChanged) {
        changeSaveButton(noChange);
        return;
    }

    changeSaveButton(saving, 0);
    const httpRequest = prepareHttpRequest();
    const backupContent = encodeURIComponent(mainContent.html());
    const deviceName = localStorage.getItem(deviceNameKey);
    const currentTime = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    let fileName = deviceName && `${deviceName}--${currentTime}` || currentTime;
    fileName = isAutoSave && `[${autoBackup}] ${fileName}` || fileName;
    const params = `folderName=${backupFolder}&content=${backupContent}&fileName=${fileName}`;

    httpRequest.send(params);
    httpRequest.onerror = () => {
        handleError();
    }
    httpRequest.onload = () => {
        const data = {'lastSaved': date.getTime()};
        localStorage.setItem(backupKey, JSON.stringify(data));
        changeSaveButton(success);
        console.log(success);
        localStorage.removeItem(isChangedKey);
    }
}

/**
 * Detect and highlight urls
 */
const detectUrl = (data) => {
    // Convert url to <a></a> tag html
    const urlToHtml = (content, urls) => {
        const urlTemplate = '<a href="%url%">%url%</a>';
        urls.forEach(value => {
            const url = trimSpace(value);
            const urlHtml = urlTemplate.replaceAll('%url%', url);
            content = content.replaceAll(url, urlHtml);
        });
        return content;
    }

    // Remove <a></a> tag from urls
    const removeHtmlUrl = content => {
        const regExp = new RegExp(/<[\/]*a[^>]*>/ig);
        return content.replaceAll(regExp, '');
    }

    // Remove space from url
    const trimSpace = (url) => {
        const regExp = new RegExp(/&nbsp/g);
        return url.replaceAll(regExp, '');
    }

    if (!data) return '';
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/mg;
    const regex = new RegExp(expression);
    let content = removeHtmlUrl(data);
    const urls = content.match(regex);

    return urls.length && urlToHtml(content, urls) || '';
}
