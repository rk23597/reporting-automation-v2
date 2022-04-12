var fs = require('fs');
var stdio = require('stdio');
var csvDataArray = fs.readFileSync('./temp/latest.csv', 'utf8').split("\n");
var output = [],i,totalTraffic=0,totalSendPayoutTraffic=0,totalValidateTraffic=0,totalCancelTraffic=0,totalReturnPayoutTraffic=0,totalLedgerTraffic=0;


var apps = stdio.getopt({
    'env':{args: 1, required: true}
});


//Getting current Date Logic
var date = new Date();
var utcDate = date.getUTCDate().toString();
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
  for (i = 1; i < csvDataArray.length - 1; i++){
    row=csvDataArray[i].split(",");
    setUniqueValue.add(row[2]);
  }
  return setUniqueValue;
}

var uniques = Array.from(getUniqueValue()); // result = [1,3,4,2,8]
var finalarray= [];
var totalTraffic=0;sno=0;
for(var j=0;j<uniques.length;j++){
  var tempArray=[0,0,0,0,0,0,0]; // status code,sendpayout,validate,cancel,returnpayout,ledger,total
  var countRequest=0;
  var analyticCurrentDT=row[4];
  tempArray[0]=uniques[j];
  for (var i = 1; i < csvDataArray.length - 1; i++){
    row=csvDataArray[i].split(",");
    if(row[2]==uniques[j]){
        // sendpayout calculation logic
        if(row[1]=="/sendPayout"){
            tempArray[1]=tempArray[1]+parseInt(row[0]);
            countRequest=countRequest+parseInt(row[0]);
            totalSendPayoutTraffic=totalSendPayoutTraffic+parseInt(row[0]);
        }
        // validatepayout calculation logic
        else if(row[1]=="/validatePayout"){
            tempArray[2]=tempArray[2]+parseInt(row[0]);
            countRequest=countRequest+parseInt(row[0]);
            totalValidateTraffic=totalValidateTraffic+parseInt(row[0]);
        }
        // returnpayout calculation logic
        else if(row[1].includes("/companies") && row[3].includes("V2")){
            tempArray[3]=tempArray[3]+parseInt(row[0]);
            countRequest=countRequest+parseInt(row[0]);
            totalReturnPayoutTraffic=totalReturnPayoutTraffic+parseInt(row[0]);
        }
        // cancelpayout calculation logic
        else if(row[1].includes("/payouts")){
            tempArray[4]=tempArray[4]+parseInt(row[0]);
            countRequest=countRequest+parseInt(row[0]);
            totalCancelTraffic=totalCancelTraffic+parseInt(row[0]);
        }
        // ledger notification calculation logic
        else if(row[1].includes("/ledgerNotification")){
            tempArray[5]=tempArray[5]+parseInt(row[0]);
            countRequest=countRequest+parseInt(row[0]);
            totalLedgerTraffic=totalLedgerTraffic+parseInt(row[0]);
        }
    }
 }
 tempArray[6]=countRequest;
 totalTraffic=totalTraffic+countRequest;
 finalarray.push(tempArray);
// console.log(tempArray);
}

output.push("<tr><th>SNo</th><th>Sum Message Count</th><th>Proxy Pathsuffix</th><th>Response Status Code</th><th>Date</th></tr>");
for(i=0;i<finalarray.length;i++){
//sendpayout block
  if(finalarray[i][1]>0){
    sno++;
    if((finalarray[i][0] >= 500 && finalarray[i][0] <= 599) && finalarray[i][1]>0){
      output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][1]+"</td><td>/sendPayout</td><td style='color:red;'>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
    else{
       output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][1]+"</td><td>/sendPayout</td><td>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
  }
  //validatepayout block

  if(finalarray[i][2]>0){
    sno++;
    if((finalarray[i][0] >= 500 && finalarray[i][0] <= 599) && finalarray[i][2]>0){
        output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][2]+"</td><td>/validatePayout</td><td style='color:red;'>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
    else{
    output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][2]+"</td><td>/validatePayout</td><td>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
  }
  //returnpayout block
  if(finalarray[i][3]>0){
    sno++;
    if((finalarray[i][0] >= 500 && finalarray[i][0] <= 599) && finalarray[i][3]>0){
        output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][3]+"</td><td>/returnPayout</td><td style='color:red;'>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
    else{
        output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][3]+"</td><td>/returnPayout</td><td>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
  }
   //cancelpayout block
  if(finalarray[i][4]>0){
    sno++;
    if((finalarray[i][0] >= 500 && finalarray[i][0] <= 599) && finalarray[i][4]>0){
        output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][4]+"</td><td>/cancelPayout</td><td style='color:red;'>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
    else{
        output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][4]+"</td><td>/cancelPayout</td><td>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
  }  
  //ledgerNotification block
  if(finalarray[i][5]>0){
    sno++;
    if((finalarray[i][0] >= 500 && finalarray[i][0] <= 599) && finalarray[i][5]>0){
      output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][5]+"</td><td>/ledgerNotification</td><td style='color:red;'>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
    else{
      output.push("<tr><td>"+sno+"</td><td>"+finalarray[i][5]+"</td><td>/ledgerNotification</td><td>"+finalarray[i][0]+"</td><td>"+analyticCurrentDT+"</td></tr>");
    }
  }
}

output.push("<tr><td>Total</td><td>"+totalTraffic+"</td><td></td><td></td><td></td></tr>");
output = "<table id =" + "customers>" + output.join("") + "</table>";
console.log(output);

//HTML Body Tempelate

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
  '   </style>  ' +
  '   </head>  ' +
  '   <body>  ' +
    '<p>Please find the hourly analytics report of VISA Direct V2 requests received by VPL dated :<b> '+ utcYear+'-'+utcMonth+'-'+utcDate +'</b>.</p>Table below shows total traffic received by VPL '+apps.env+' API gateway.<br><br>' +
  output +
  '  <br/><br> Thanks.</br></body>  ' +
  '  </html>  ';


//Writing HTML Code in ./temp/html-report.html  

fs.writeFile('./temp/html-report.html', htmlbody, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

