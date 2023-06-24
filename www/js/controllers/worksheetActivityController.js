import WorksheetActivityModel from "../models/worksheetActivityModel.js";

const WorksheetActivityController = {
  download: async function (id) {
    const worksheetActivity = await WorksheetActivityModel.get(id);

    // File URL
    const worksheetsDirectory = cordova.file.applicationDirectory + 'www/worksheets/';
    const fileName = worksheetActivity.worksheet;
    const fileUrl = worksheetsDirectory + fileName;

    if (cordova.platformId === 'browser') {
      // Running in a web browser
      var link = document.createElement('a');
      link.setAttribute('href', fileUrl);
      // Set the desired filename for the downloaded file
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Running on Android or iOS
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
}

export default WorksheetActivityController;