const supertest = require('supertest');
var expect = require("chai").expect;
var fs = require('fs');
const btoa = require('btoa');
const app = require('./../../app');

var currentDate = new Date();
                    
var endDate = new Date(currentDate.setDate(currentDate.getDate() - 1)).toISOString(); 
endDate = endDate.split('T')[0];

var startDate = new Date(currentDate.setDate(currentDate.getDate() - 6)).toISOString();
startDate = startDate.split('T')[0];

var mailBody = fs.readFileSync('./temp/html-report.html', {encoding:'base64', flag:'r'});
var mailSubject = "Weekly Analytics Summary Report ( Organization: Earthport, Environment: production ) - "+startDate+" to "+endDate;
var attachment="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"+fs.readFileSync('Weekly Summary Data.xlsx', {encoding:'base64', flag:'r'});


var request={};
request.mailSubject=btoa(mailSubject);
request.mailBody=mailBody;
request.attachment=attachment;

//#region Send Email Describe
describe('Email Sending Job', function () {
  
    it('Send Email ', (done) => {
        supertest.agent("https://"+app.SENDMAIL_HOST+"/v1/analytics/")
            .set('Content-Type', 'text/html')
			.set('Report-Type','Weekly')
            .post("/sendMail")
            .send(JSON.stringify(request))
            .end(function (err, res) {
                if (err) return done(err);
                else {
                    expect(res.statusCode).to.equal(200);
                }
                done();
            });
    }).timeout(18000);

});
//#endregion

