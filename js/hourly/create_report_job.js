const supertest = require('supertest');
var expect = require("chai").expect;
var fs = require('fs');
var stdio = require('stdio');

var getReportStatusURL;
var response;
var access_token;
var state = "";

//Getting current Date Logic 
var date = new Date();
var utcDate = date.getUTCDate().toString();
var utcHour = date.getUTCHours().toString();
var utcLastHour = (date.getUTCHours()-1).toString();
var utcMonth = (date.getUTCMonth()+1).toString();
var utcYear = date.getUTCFullYear().toString();

if(utcDate < 10)    { utcDate = "0"+utcDate;}
if(utcHour < 10)    { utcHour = "0"+utcHour;}
if(utcLastHour < 10){ utcLastHour = "0"+utcLastHour;}
if(utcMonth < 10)   { utcMonth = "0"+utcMonth;}
if(utcHour == "00") {
    utcLastHour="23";
    utcDate = parseInt(utcDate)-1;
}

//Payload for creating report in apigee
console.log(utcYear+"-"+utcMonth+"-"+utcDate+" "+ utcLastHour   +":00:00");
console.log(utcYear+"-"+utcMonth+"-"+utcDate+" "+ utcLastHour   +":59:59");

var start_dt = utcYear+"-"+utcMonth+"-"+utcDate+" "+ utcLastHour+":00:00" ;
var end_dt = utcYear+"-"+utcMonth+"-"+utcDate+" "+ utcLastHour+":59:59";


var reportPayload = {
    "metrics": [{
        "function": "sum",
        "name": "message_count"
    }],
    "dimensions": [
        "proxy_pathsuffix",
        "response_status_code",
        "notificationversion"        
    ],
    "filter": "(apiproxy eq 'VISADirect-ICL-API-v2')or (apiproxy eq 'VisaDirect-Notification-ICL-REST-API-v2') or (apiproxy eq 'VisaDirect-LedgerNotification')",
    "timeRange": {
        "start": start_dt ,
        "end": end_dt
    },
    "name": "61da25de-484f-4de4-a1a8-dbccfd66b24c",
    "outputFormat": "csv",
    "reportDefinitionId": "61da25de-484f-4de4-a1a8-dbccfd66b24c",
    "groupByTimeUnit": "hour"
};


var access = stdio.getopt({
    'token': {args: 1, required: true},
    'org':{args: 1, required: true},
    'env':{args: 1, required: true}
});

access_token = "Bearer "+access.token;

var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()];
var date= weekday+" "+ month +" "+ utcDate +" "+new Date().getFullYear();
var mailSubject = "Hourly Analytics Summary Report V2 ( VPL "+access.env+" ) - "+date +" "+utcLastHour+":00:00 To "+(parseInt(utcLastHour)+1)+":00:00";
fs.writeFileSync("mailSubject.txt", mailSubject.toString());

// Mocha describe

describe('101', function () {

    function delay(interval) {
        return it('should delay', done => {
            setTimeout(() => done(), interval)

        }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
    }

    // Post Report in apigee
console.log((access.org).toLowerCase());
    it('Create Report ', (done) => {
        supertest.agent("https://api.enterprise.apigee.com/v1/organizations/"+access.org+"/environments/"+(access.env).toLowerCase())
            .set('Content-Type', 'application/json')
            .post("/queries")
            .set('Authorization', access_token).send(reportPayload)
            .end(function (err, res) {
                if (err) return done(err);
                else {
                    expect(res.statusCode).to.equal(201);
                    response = res.text;
                    console.log(JSON.stringify("Response is : " + response));
                    data1 = JSON.parse(response);
                    getReportStatusURL = data1['self'];
                }
                done();
            });
    }).timeout(18000);

    // delay to get report job completed
    delay(30000);

    it('GET Report Status ', (done) => {
        supertest.agent("https://api.enterprise.apigee.com/v1/")
            .get(getReportStatusURL)
            .set('Authorization', access_token)
            .end(function (err, res) {
                if (err) return done(err);
                else {
                    response = res.text;
                    data4 = JSON.parse(response);
                    state = data4['state'];
                    expect(res.statusCode).to.equal(200);
                    console.log("Report Status is :- " + response);
                    console.log(state);
                    fs.writeFileSync("report_status_URL.txt", getReportStatusURL);
                    // console.log(downloadReportURL);
                }
                done();
            });
    }).timeout(18000);

});

