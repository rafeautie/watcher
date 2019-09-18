/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Watcher')
      .addItem('Mark all late deliverables', 'auditAllSheets')
      .addItem('Mark late deliverables on this sheet', 'auditSheet')
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Time Trigger Settings')
                  .addItem('Enable time trigger', 'createTimeDrivenTriggers')
                  .addItem('Disable time trigger', 'deleteAllTriggers'))
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}



// TIME TRIGGERS (Must be deployed as add-on for these functions to work.)
function createTimeDrivenTriggers() {
  ScriptApp.newTrigger('auditAllSheets')
      .timeBased()
      .everyDays(1)
      .atHour(0)
      .nearMinute(15)
      .create();
}

function deleteAllTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}



// SHEET AUDITS
// Audit all sheets.
function auditAllSheets() {
  var ss = SpreadsheetApp.getActive();
  var allsheets = ss.getSheets();
  for(var s in allsheets){
    var sheet = allsheets[s];
    var sheetName = sheet.getName();

    if((sheetName === "Deadlines") || (sheetName === "Student+Apps") || (sheetName === "Names + Emails")) continue;
    
    auditSheet(sheet);
}}

// Audit individual sheet.
function auditSheet(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSheet();
  var values = sheet.getDataRange().getValues()
  var sheetDeliverables = values[1].slice(4);
  var deadlines = getDeliverableDeadlines(sheetDeliverables);
  var todaysDate = new Date();
  var emails = getStudentEmails();
  
  for(var i = 3; i < values.length; i += 1) {
    auditStudent(values[i], sheetDeliverables, deadlines, todaysDate, i + 1, sheet, emails[values[i][0]])
  };
}

// Audit student (row in sheet)
function auditStudent(student, deliverableNames, deadlines, today, row, sheet, studentEmail) {
  var studentName = student[0];
  var currentStudentData = {
    name: studentName.split(' ')[0],
    email: studentEmail,
    missingDeliverables: [],
  };
  
  for(var i = 0; i < deliverableNames.length; i += 1) {
    var deliverableDate = new Date(deadlines[i]);
    
    deliverableDate.setHours(23);
    deliverableDate.setMinutes(59);
    deliverableDate.setSeconds(59);
    
    var t = today.getTime();
    var d = deliverableDate.getTime();
    var col = i + 5;
    var curDeliverable = sheet.getRange(row, col);
    
    if (t > d && student[i + 4] === '' && curDeliverable.getBackground() !== '#ff0000') {
      // Mark cell red
      sheet.getRange(row, col).setBackground('red');
      // Gather all missing deliverables.
      currentStudentData.missingDeliverables.push(deliverableNames[i]);
    }
  }
  
  // Invoke sendAllEmails.
  Logger.log(currentStudentData);
  if (currentStudentData.missingDeliverables.length > 0) {
    //Send email to student.
    Logger.log('Email sent to ' + currentStudentData.name);
    sendEmail(currentStudentData);   
  }
}




// DEADLINES
function getDeliverableDeadlines(deliverableNames) {
  var allDates = getAllDeadlineDates();
  var dates = [];
  
  for(var i = 0; i < deliverableNames.length; i += 1) { 
    dates.push(allDates[deliverableNames[i]]);
  }
  
  return dates;
}

function getAllDeadlineDates() {
  var d = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Deadlines");
  var data = d.getDataRange().getValues();
  var dates = {};

  for(var i = 1; i<data.length;i++){
    dates[data[i][1]] = data[i][4];
  }
  
  return dates;
}




// EMAIL
function sendEmail(currentStudentData) {
    var CC_EMAIL = 'hrsf.communication@galvanize.com';
    var REPLY_TO_EMAIL = 'hrsf.communication@galvanize.com';
  
    var BODY_MESSAGE = 'Hi ' + currentStudentData.name + ', \n\n' +
      'It looks like we’re missing the following deliverable(s):\n\n' + currentStudentData.missingDeliverables.reduce(function(memo, deliverable) { return memo + '• ' + deliverable + '\n'}, '') + 
      '\nCan you please update the tracker with this information (or an ETA of when it will be completed) and reply all to this email so that we know it’s ready to review?\n\nMany thanks!';
  
    MailApp.sendEmail({
      to: currentStudentData.email,
      //replyTo: REPLY_TO_EMAIL,
      //cc: CC_EMAIL,
      subject: "[RESPONSE REQUIRED TEST] Missing Deliverables",
      body: BODY_MESSAGE,
    });
}

// Get all student emails.
function getStudentEmails() {
  var se = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Names + Emails");
  var data = se.getDataRange().getValues();
  var emails = {};
  
  for(var i = 0; i < data.length; i++) {
    emails[data[i][0]] = data[i][1];
  }
  
  return emails;
}
