var fs = require('fs');
var csvDataArray = (fs.readFileSync('./temp/latest.csv', 'utf8')).split("\n");
var output = [],i, totalTraffic = 0, totalSendPayoutTrafficV1 = 0, totalValidateTrafficV1 = 0, totalCancelTrafficV1 = 0,  totalReturnPayoutTrafficV1 = 0,  totalSendPayoutTrafficV2 = 0,  totalValidateTrafficV2 = 0,  totalCancelTrafficV2 = 0,  totalReturnPayoutTrafficV2 = 0,  totalLedgerTrafficV1 = 0,  dates=0;

//Getting current Date Logic
var currentDate = new Date();
var currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1)).toISOString();
currentDate = currentDate.split('T')[0];

var date = new Date();
var utcDate = (date.getUTCDate()-1).toString();
var utcHour = date.getUTCHours().toString();
var utcLastHour = (date.getUTCHours()-1).toString();
var utcMonth = (date.getUTCMonth()+1).toString();
var utcYear = date.getUTCFullYear().toString();

if(utcDate < 10){
  utcDate = "0"+utcDate;
}

if(utcHour < 10){
  utcHour = "0"+utcHour;
}

if(utcLastHour < 10){
  utcLastHour = "0"+utcLastHour;
}
if(utcMonth < 10){
  utcMonth = "0"+utcMonth;
}
if(utcHour == "00"){
  utcLastHour="23";
  utcDate = parseInt(utcDate)-1;
}


function getUniqueValue() {
  const setUniqueValue = new Set();
  for (i = 1; i < csvDataArray.length - 1; i++) {
    csvRow = csvDataArray[i].split(",");
    setUniqueValue.add(csvRow[4]);
  }
  return setUniqueValue;
}
var uniques = Array.from(getUniqueValue()); // result = [1,3,4,2,8]
var finalarray = [];
var totalTraffic = 0; sno = 0; snov2=0;

for (var j = 0; j < uniques.length; j++) {
  var tempArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0]; // status code,sendpayoutv1,validatev1,cancelv1,returnpayoutv1,sendpayoutv2,validatev2,cancelv2,returnpayoutv2,leagerv1,total
  var countRequest = 0;
  tempArray[0] = uniques[j];
  for (var i = 1; i < csvDataArray.length - 1; i++) {

    csvRow = csvDataArray[i].split(",");
    // console.log(csvRow);
    
    if (csvRow[4] == uniques[j]) {
      // sendpayout calculation logic
      
      if (csvRow[2] == "/sendpayout" && csvRow[1] == "VISADirect-ICL-API") {
        tempArray[1] = tempArray[1] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalSendPayoutTrafficV1 = totalSendPayoutTrafficV1 + parseInt(csvRow[0]);
      }
      // validatepayout calculation logic
      else if (csvRow[2] == "/validatepayout" && csvRow[1] == "VISADirect-ICL-API") {
        tempArray[2] = tempArray[2] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalValidateTrafficV1 = totalValidateTrafficV1 + parseInt(csvRow[0]);
      }
      // returnpayout calculation logic
      else if (csvRow[2].includes("/companies") && csvRow[1] == "VisaDirect-Notification-ICL-REST-API-v2" && csvRow[3] == "V1") {
        tempArray[3] = tempArray[3] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalReturnPayoutTrafficV1 = totalReturnPayoutTrafficV1 + parseInt(csvRow[0]);
      }
      // cancelpayout calculation logic
      else if (csvRow[2].includes("/payouts") && csvRow[1] == "VISADirect-ICL-API") {
        tempArray[4] = tempArray[4] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalCancelTrafficV1 = totalCancelTrafficV1 + parseInt(csvRow[0]);
      }
      if (csvRow[2] == "/sendPayout" && csvRow[1] == "VISADirect-ICL-API-v2") {
        tempArray[5] = tempArray[5] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalSendPayoutTrafficV2 = totalSendPayoutTrafficV2 + parseInt(csvRow[0]);
      }
      // validatepayout calculation logic
      else if (csvRow[2] == "/validatePayout" && csvRow[1] == "VISADirect-ICL-API-v2") {
        tempArray[6] = tempArray[6] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalValidateTrafficV2 = totalValidateTrafficV2 + parseInt(csvRow[0]);
      }
      // returnpayout calculation logic
      else if (csvRow[2].includes("/companies") && csvRow[1] == "VisaDirect-Notification-ICL-REST-API-v2" && csvRow[3] == "V2") {
        tempArray[7] = tempArray[7] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalReturnPayoutTrafficV2 = totalReturnPayoutTrafficV2 + parseInt(csvRow[0]);
      }
      // cancelpayout calculation logic
      else if (csvRow[2].includes("/payouts") && csvRow[1] == "VISADirect-ICL-API-v2") {
        tempArray[8] = tempArray[8] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalCancelTrafficV2 = totalCancelTrafficV2 + parseInt(csvRow[0]);
      }
      // leager notification calculation logic
      else if (csvRow[2].includes("/ledgerNotification") && csvRow[1] == "VisaDirect-LedgerNotification") {
        tempArray[9] = tempArray[9] + parseInt(csvRow[0]);
        countRequest = countRequest + parseInt(csvRow[0]);
        totalLedgerTrafficV1 = totalLedgerTrafficV1 + parseInt(csvRow[0]);
      }
      tempArray[10]=csvRow[5];
      dates=csvRow[5];
    }
  }
  tempArray[11] = countRequest;
  totalTraffic = totalTraffic + countRequest;
  finalarray.push(tempArray);
  // console.log(tempArray);
}

// console.log(finalarray);

output.push("<tr><th>SNo</th><th>Sum Message Count</th><th>Proxy Pathsuffix</th><th>Status Code</th><th>Date</th></tr>");

for (i = 0; i < finalarray.length; i++) {
  //sendpayout block V1
  if (finalarray[i][1] > 0) {
    sno++;
    if (finalarray[i][0] >= 500 && finalarray[i][1] > 0) {
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][1] + "</td><td>/sendpayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    } else {
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][1] + "</td><td>/sendpayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
  }
  //validatepayout block V1

  if (finalarray[i][2] > 0) {
    sno++;
    if (finalarray[i][0] >= 500 && finalarray[i][2] > 0) {
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][2] + "</td><td>/validatepayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    else{
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][2] + "</td><td>/validatepayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    
  }
  //returnpayout block V1

  if (finalarray[i][3] > 0) {
    sno++;
    if (finalarray[i][0] >= 500 && finalarray[i][3] > 0) {
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][3] + "</td><td>/returnpayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    else{
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][3] + "</td><td>/returnpayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    
  }
  //cancelpayout block V1
  if (finalarray[i][4] > 0) {
    sno++;
    if (finalarray[i][0] >= 500 && finalarray[i][4] > 0) {
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][4] + "</td><td>/cancelpayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }else{
      output.push("<tr><td>" + sno + "</td><td>" + finalarray[i][4] + "</td><td>/cancelpayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    
  }
}
var totalV1traffic=totalSendPayoutTrafficV1 + totalValidateTrafficV1 + totalReturnPayoutTrafficV1 + totalCancelTrafficV1;
output.push("<tr><td><b>Total</b></td><td><b>" + totalV1traffic + "</b></td><td></td><td></td><td></td></tr>");
output.push("</table><h3>V2 APIs</h3>");
output.push("<table id='customers'>");
output.push("<tr><th>SNo</th><th>Sum Message Count</th><th>Proxy Pathsuffix</th><th>Status Code</th><th>Date</th></tr>");
// output.push("<tr><td colspan='5'><b>V2 APIs</b></td></tr>");
for (i = 0; i < finalarray.length; i++) {
  //sendpayout block V2
  if (finalarray[i][5] > 0) {
    snov2++;
    if (finalarray[i][0] >= 500 && finalarray[i][5] > 0) {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][5] + "</td><td>/sendPayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    } else {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][5] + "</td><td>/sendPayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
  }
  //validatepayout block V2

  if (finalarray[i][6] > 0) {
    snov2++;
    if (finalarray[i][0] >= 500 && finalarray[i][6] > 0) {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][6] + "</td><td>/validatePayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
    else{
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][6] + "</td><td>/validatePayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }
  }

  //returnpayout block V2

  if (finalarray[i][7] > 0) {
    snov2++;
    if (finalarray[i][0] >= 500 && finalarray[i][7] > 0) {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][7] + "</td><td>/returnpayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }else{
    output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][7] + "</td><td>/returnpayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
  }
}
  //cancelpayout block V2
  if (finalarray[i][8] > 0) {
    snov2++;
    if (finalarray[i][0] >= 500 && finalarray[i][8] > 0) {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][8] + "</td><td>/cancelpayout</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }else{
    output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][8] + "</td><td>/cancelpayout</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
  }
}
  //ledger notification block V1
  if (finalarray[i][9] > 0) {
    snov2++;
    if (finalarray[i][0] >= 500 && finalarray[i][9] > 0) {
      output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][9] + "</td><td>/ledgerNotification</td><td style='color:red;'>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
    }else{
    output.push("<tr><td>" + snov2 + "</td><td>" + finalarray[i][9] + "</td><td>/ledgerNotification</td><td>" + finalarray[i][0] + "</td><td>" + finalarray[i][10] + "</td></tr>");
  }
  }
}
var totalv2traffic=+ totalSendPayoutTrafficV2 + totalValidateTrafficV2 + totalReturnPayoutTrafficV2 + totalCancelTrafficV2 + totalLedgerTrafficV1;
output.push("<tr><td><b>Total</b></td><td><b>" + totalv2traffic + "</b></td><td></td><td></td><td></td></tr>");
output = "<table class='table table-striped' id =" + "customers>" + output.join("") + "</table>";
// console.log(output);


//HTML Body tempArrayelate

var htmlbody = '   <!DOCTYPE html>  ' +
  '   <html>  ' +
  '   <head>  ' +
  '   <style>  ' +
  '   #customers {  ' +
  '     font-family: Arial, Helvetica, sans-serif;  ' +
  '     border-collapse: collapse;  ' +
  '     width: 100%;  ' +
  '   }  ' +
  '     ' +
  '   #customers td, #customers th {  ' +
  '     border: 1px solid #ddd;  ' +
  '     padding: 8px;  ' +
  '   }  ' +
  '     ' +
  '   #customers tr:nth-child(even){background-color: #f2f2f2;}  ' +
  '     ' +
  '   #customers tr:hover {background-color: #ddd;}  ' +
  '     ' +
  '   #customers th {  ' +
  '     padding-top: 12px;  ' +
  '     padding-bottom: 12px;  ' +
  '     text-align: left;  ' +
  '     background-color:#39A8FF;  ' +
  '     color: white;  ' +
  '   }  ' +
  '    h3{color:#2183F1} '+
  '   </style>  ' +
  '   </head>  ' +
  '   <body>  ' +
  '<p>Please find the daily analytics report of VISA Direct requests received by VPL dated <b> '+utcYear+"-"+utcMonth+"-"+utcDate+'</b>.</p>Table below shows total traffic received by VPL production API gateway.<h3>V1 APIs</h3>' +
    output +
  '  <br/><br> Thanks.</br></body>  ' +
  '  </html>  ';


//Writing HTML Code in mynewfile1.html  

fs.writeFile('./temp/html-report.html', htmlbody, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
