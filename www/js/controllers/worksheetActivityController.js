import WorksheetActivityModel from "../models/worksheetActivityModel.js";

const WorksheetActivityController = {
  download: async function (id) {
    // TODO: Fix this function, so that it works on browser, android and iOS.

    const worksheetActivity = await WorksheetActivityModel.get(id);

    // File URL
    const worksheetsDirectory = cordova.file.applicationDirectory + 'www/worksheets/';
    const fileName = worksheetActivity.worksheet;
    const fileUrl = worksheetsDirectory + fileName;

    // // Open the file download link in the InAppBrowser
    // const fileBrowser = cordova.InAppBrowser.open(fileUrl, '_system');

    // // Listen for the "loadstart" event, which fires when the InAppBrowser starts loading a new page
    // fileBrowser.addEventListener('loadstart', function (event) {
    //   const url = event.url;

    //   // Check if the URL starts with 'file://', which indicates the file has been downloaded
    //   if (url.indexOf('file://') === 0) {
    //     // Extract the file name from the URL
    //     const fileName = decodeURIComponent(url.split('/').pop());

    //     // Use the FileTransfer plugin to move the file to a chosen directory
    //     const fileTransfer = new FileTransfer();
    //     const targetDirectory = cordova.file.externalRootDirectory; // Use the external storage directory

    //     // Show a confirmation dialog to the user for choosing the target directory
    //     // You may use a Cordova plugin like Cordova Dialogs for this purpose
    //     const chosenDirectory = confirm('Choose a location to save the worksheet.');

    //     // If the user selected a directory, proceed with moving the file
    //     if (chosenDirectory) {
    //       const targetPath = targetDirectory + chosenDirectory + '/' + fileName;

    //       // Move the file to the chosen directory
    //       fileTransfer.move(url, targetPath, function () {
    //         alert('File has been saved to: ' + targetPath);
    //       }, function (error) {
    //         alert('Error moving the file: ' + error.code);
    //       });
    //     }
    //   }
    // });

    const fileTransfer = new FileTransfer();
    // Temporary path
    const targetPath = cordova.file.cacheDirectory + fileName;

    fileTransfer.download(
      encodeURI(fileUrl),
      targetPath,
      function (entry) {
        // File download success
        console.log('File downloaded successfully: ' + entry.toURL());

        // Open the file using the default file browser
        cordova.plugins.fileOpener2.open(entry.toURL(), 'application/pdf');
      },
      function (error) {
        // File download error
        console.error('File download error: ' + error.source + ' - ' + error.target + ' - ' + error.code);
      },
      false
    );
  }
}

export default WorksheetActivityController;