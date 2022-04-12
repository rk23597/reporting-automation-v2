var xlsx = require("xlsx");
var json2xls = require("json2xls");
var output = [];
const fs = require('fs');
const { readFile, writeFile } = require('fs').promises;
const { json2csvAsync } = require('json-2-csv');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var wb = xlsx.readFile("./temp/latest.csv",{cellDates:true});

var sheet = wb.Sheets["Sheet1"];

var data = xlsx.utils.sheet_to_json(sheet);

// sort the data array
var newdata = data.sort((a, b) => a.day - b.day);

// create a default date to remove the duplicate
var defaultdate = newdata[0]["day"].toString();
// create an array to store the date without duplicate
var datearray = [];

// initialize the array
datearray.push(defaultdate);

for (let index = 0; index < newdata.length; index++) {
    day = newdata[index]["day"].toString();
    if(defaultdate != day){
        datearray.push(day);
        defaultdate = day;
    }
}
// declare var for last row for totaling
var total_sp_success = 0;
var total_sp_error = 0;
var total_vp_success = 0;
var total_vp_error = 0;
var total_cp_success = 0;
var total_cp_error = 0;
var total_total = 0;
var total_total_error = 0;
var total_total_success = 0;


// declare the global variable
var Total = 0;
var TotalError = 0;
var TotalSuccess = 0;

// final array for store the json object
var finalarray = []

for (let j = 0; j < datearray.length; j++) {
    const element = datearray[j];
    var SendPayoutSuccess = 0;
    var SendPayoutError = 0;
    var ValidatePayoutSuccess = 0;
    var ValidatePayoutError = 0;
    var CancelPayoutSuccess = 0;
    var CancelPayoutError = 0;

    for (let index = 0; index < newdata.length; index++) {
        var  count = newdata[index]["sum_message_count"].toString();
        var  proxy = newdata[index]["proxy_pathsuffix"].toString();
        var  status = newdata[index]["response_status_code"].toString();
        var  day = newdata[index]["day"];
        var date1 = day.toString();
        var count1 = parseInt(count)

        if (element == date1){
            if (status == "200" && proxy == "/validatepayout")
            {
               ValidatePayoutSuccess = ValidatePayoutSuccess + count1;
            }
            if (status != "200" && proxy == "/validatepayout")
            {
              ValidatePayoutError = ValidatePayoutError + count1;
            }
            if (status == "200" && proxy == "/sendpayout")
            {
               SendPayoutSuccess = SendPayoutSuccess + count1;
            }
            if ( status != "200" && proxy == "/sendpayout")
            {
              SendPayoutError = SendPayoutError + count1;
            }
            if (status == "200" && proxy != "/sendpayout" && proxy != "/validatepayout")
            {
               CancelPayoutSuccess = CancelPayoutSuccess + count1;
            }
            if ( status != "200" && proxy != "/sendpayout" && proxy != "/validatepayout")
            {
              CancelPayoutError = CancelPayoutError + count1;
            }
        }
    }
    TotalSuccess = ValidatePayoutSuccess + SendPayoutSuccess + CancelPayoutSuccess;
    TotalError = ValidatePayoutError + SendPayoutError + CancelPayoutError ;
    Total = TotalSuccess + TotalError;
    jsonobj = {
        "Date": convert(element),
        "SendPayout Success" : SendPayoutSuccess,
        "SendPayout Error": SendPayoutError,
        "ValidatePayout Success": ValidatePayoutSuccess,
        "ValidatePayout Error": ValidatePayoutError,
        "CancelPayout Success": CancelPayoutSuccess,
        "CancelPayout Error": CancelPayoutError,
        "Total": Total,
        "Total Error": TotalError,
        "Total Success": TotalSuccess
    }
    finalarray.push(jsonobj);
    total_sp_success = total_sp_success + SendPayoutSuccess;
    total_sp_error = total_sp_error + SendPayoutError;
    total_vp_success = total_vp_success + ValidatePayoutSuccess;
    total_vp_error = total_vp_error + ValidatePayoutError;
    total_cp_success = total_cp_success + CancelPayoutSuccess;
    total_cp_error = total_cp_error + CancelPayoutError;
    total_total = total_total + Total;
    total_total_error = total_total_error + TotalError;
    total_total_success = total_total_success + TotalSuccess;
}
var last_json_obj = {
  "Date": "",
        "SendPayout Success" : total_sp_success,
        "SendPayout Error": total_sp_error,
        "ValidatePayout Success": total_vp_success,
        "ValidatePayout Error": total_vp_error,
        "CancelPayout Success": total_cp_success,
        "CancelPayout Error": total_cp_error,
        "Total": total_total,
        "Total Error": total_total_error,
        "Total Success": total_total_success
}
finalarray.push(last_json_obj)
// console.log(finalarray)



// generate csv file

var outputFileName = "WeeklySummaryData.csv";

(async () => {
  const csv = await json2csvAsync(finalarray);
  await writeFile(outputFileName, "csv", 'utf8')
})();

(async () => {
  const csv1 = await json2csvAsync(finalarray);
  var data = csv1;
  var lines = data.split("\n");
  var totalSendPayoutTraffic=0,totalValidatePayoutTraffic=0,totalCancelPayoutTraffic=0,TotalTraffic=0;
  for (i = 0; i < 1; i++)
  output.push("<tr><th>S No</th><th>Date</th><th>SendPayout Success</th><th>SendPayout Error</th><th>ValidatePayout Success</th><th>ValidatePayout Error</th><th>CancelPayout Success</th><th>CancelPayout Error</th><th>Total</th><th>Total Error</th><th>Total Success</th></tr>");
   
  for (i = 1; i < lines.length - 1; i++){
    row=lines[i].split(",");
    output.push("<tr><td>"+i+"</td><td>"+ row[0]+"</td><td>"+row[1]+"</td><td>"+row[2]+"</td><td>"+row[3]+"</td><td>"+row[4]+"</td><td>"+row[5]+"</td><td>"+row[6]+"</td><td>"+row[7]+"</td><td>"+row[8]+"</td><td>"+row[9]+"</td></tr>");
  }
  for (i = lines.length - 1; i < lines.length; i++){
    row=lines[i].split(",");
    output.push("<tr><td>"+i+"</td><td><b>Total</b></td><td><b>"+row[1]+"</b></td><td><b>"+row[2]+"</b></td><td><b>"+row[3]+"</b></td><td><b>"+row[4]+"</b></td><td><b>"+row[5]+"</b></td><td><b>"+row[6]+"</b></td><td><b>"+row[7]+"</b></td><td><b>"+row[8]+"</b></td><td><b>"+row[9]+"</b></td></tr>");
    totalSendPayoutTraffic=row[1]+row[2];
  totalValidatePayoutTraffic=row[3]+row[4];
  totalCancelPayoutTraffic=row[5]+row[6];
  TotalTraffic=row[7];
  console.log(totalCancelPayoutTraffic);
  }
  
  console.log(output);
  output = "<table id ='customers'>" + output.join("") + "</table>";
  var htmlbody = '   <!DOCTYPE html>  ' +
    '   <html>  ' +
    '   <head>  ' +
    '<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>'+
    '<script src="http://www.jqueryscript.net/demo/jQuery-Plugin-To-Convert-HTML-Table-To-CSV-tabletoCSV/jquery.tabletoCSV.js"></script>'+
    '   <style>  ' +
    '   #customers {  ' +
    '     font-family: Arial, Helvetica, sans-serif;  ' +
    '     border-collapse: collapse;  ' +
    '     width: 100%;  ' +
    '   }  ' +
    '     ' +
    '   #customers td, #customers th {  ' +
    '     border: 1px solid #ddd;  ' +
    '     padding: 3px;  ' +
    '   }  ' +
    '     ' +
    '   #customers tr:nth-child(even){background-color: #f2f2f2;}  ' +
    '     ' +
    '   #customers tr:hover {background-color: #ddd;}  ' +
    '     ' +
    '   #customers th {  ' +
    '     padding-top: 5px;  ' +
    '     padding-bottom: 5px;  ' +
    '     text-align: left;  ' +
    '     background-color:#39A8FF;  ' +
    '     color: white;  ' +
    '   }  ' +
    '   </style>  ' +
    '   </head>  ' +
    '   <body>  ' +
    'Hi<br><p>Please find the weekly analytics report of VISA APIs.</p> In apigee production environment total traffic is <b>'+TotalTraffic+' </b> in which sendpayout traffic is <b> '+totalSendPayoutTraffic+'</b> , validatepayout is <b>'+totalValidatePayoutTraffic+' </b> and cancelpayout is <b>'+totalCancelPayoutTraffic+'</b>. For more details please find the table below<br><br>' +
    output +
    '  <br/><br> Thanks<br/>NeosAlpha Team</body>  ' +
    '  </html>  ';
  fs.writeFile('./temp/html-report.html', htmlbody, function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
  
 
})();

// create xlsx file

  // method to convert date string into javascript date
  function convert(str) {
    var date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, month, date.getFullYear()].join("-");
  }

  // here we append data into a xlsx file

    // console.log(finalarray)
    const XlsxPopulate = require('xlsx-populate');
    XlsxPopulate.fromFileAsync("./Weekly Summary Data.xlsx")
    .then(workbook => {
        var i=0;
            for(i=0;i<finalarray.length;i++)
            {
                // console.log(jsonObj[i]['Date']);
                workbook.sheet("Data").row(i+2).cell(1).value(finalarray[i]['Date']);
                workbook.sheet("Data").row(i+2).cell(2).value(parseInt(finalarray[i]['SendPayout Success']));
                workbook.sheet("Data").row(i+2).cell(3).value(parseInt(finalarray[i]['SendPayout Error']));
                workbook.sheet("Data").row(i+2).cell(4).value(parseInt(finalarray[i]['ValidatePayout Success']));
                workbook.sheet("Data").row(i+2).cell(5).value(parseInt(finalarray[i]['ValidatePayout Error']));
                workbook.sheet("Data").row(i+2).cell(6).value(parseInt(finalarray[i]['CancelPayout Success']));
                workbook.sheet("Data").row(i+2).cell(7).value(parseInt(finalarray[i]['CancelPayout Error']));
                workbook.sheet("Data").row(i+2).cell(8).value(parseInt(finalarray[i]['Total']));
                workbook.sheet("Data").row(i+2).cell(9).value(parseInt(finalarray[i]['Total Error']));
                workbook.sheet("Data").row(i+2).cell(10).value(parseInt(finalarray[i]['Total Success'])); 
            }
                return workbook.toFileAsync("./Weekly Summary Data.xlsx");


    });
//});
