const supertest = require('supertest');
var expect = require("chai").expect;
var fs = require('fs');
var stdio = require('stdio');
var getReportStatusURL;
var response;
var access_token;
var state = "";


//Getting current Date Logic
var currentDate = new Date();
//var currentDate1 = new Date();
var endDate = new Date(currentDate.setDate(currentDate.getDate() - 1)).toISOString(); 
endDate = endDate.split('T');
var startDate = new Date(currentDate.setDate(currentDate.getDate() - 6)).toISOString();
startDate = startDate.split('T');


//Payload for creating report in apigee

var reportPayload = {
    "metrics": [{
        "function": "sum",
        "name": "message_count"
    }],
    "dimensions": [
        "proxy_pathsuffix",
        "response_status_code"
    ],
    "filter": "(apiproxy eq 'VISADirect-ICL-API')",
    "timeRange": {
        "start": startDate[0] + " 00:00:00",
        "end": endDate[0] + " 24:00:00"
    },
    "name": "3a7b1a0a-7c39-4534-9d49-ad8716c671ef",
    "outputFormat": "csv",
    "reportDefinitionId": "03b06dbf-029d-481f-bda4-8ca75176b9e0",
	"groupByTimeUnit": "day"
};


// retreiving access token from Accesstoken.txt file

var access = stdio.getopt({
    'token': {args: 1, required: true}
});

access_token = "Bearer "+access.token;

// Mocha describe

describe('101', function () {

    function delay(interval) {
        return it('should delay', done => {
            setTimeout(() => done(), interval)

        }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
    }

    // Post Report in apigee

    it('Create Report ', (done) => {
        supertest.agent("https://api.enterprise.apigee.com/v1/organizations/earthport/environments/production")
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