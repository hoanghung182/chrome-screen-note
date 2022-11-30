function doGet() {
  return HtmlService.createHtmlOutputFromFile("form.html");
}

function doPost(postData) {
  var folderName = postData.parameters.folderName;
  var fileName = postData.parameters.fileName + '.html';
  var fileContent = postData.parameters.content;
  var destinationId = "";
  var destination = "";
  const editor = "hoangvanhung182@gmail.com";
  
  //  create new folder in root google drive and share editable right
  var folder = DriveApp.getFoldersByName(folderName);
  if (folder.hasNext()) {
    destinationId = folder.next().getId();
    destination = DriveApp.getFolderById(destinationId);
  } 
  else {
    destinationId = DriveApp.createFolder(folderName).setShareableByEditors(true).getId();
    destination = DriveApp.getFolderById(destinationId).addEditor(editor);
  }
  var fileUrl = destination.createFile(fileName, fileContent).getUrl();
  
  var outputHtml = "<div style='text-align:center;'><h1>Backup successfully!</h1><a href='" 
  + fileUrl 
  + "' target='_blank' style='text-decoration: none;'>Link to the file</a></div>";
  var output = HtmlService.createHtmlOutput(outputHtml);
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  
  return output;
}
