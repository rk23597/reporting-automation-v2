const supertest = require('supertest');
var expect = require("chai").expect;
var fs = require('fs');
const btoa = require('btoa');
const app = require('./../../app.js');

var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()];
var date=weekday+" "+month+" "+new Date().getDate()+" "+new Date().getFullYear();

var mailSubject = "Daily Analytics Summary Report ( VPL production ) - "+date;
var mailBody = fs.readFileSync('./temp/html-report.html', {encoding:'base64', flag:'r'});

var request={};
request.mailSubject=btoa(mailSubject);
request.mailBody=mailBody;


//#region Send Email Describe
describe('Email Sending Job', function () {
  
    it('Send Email ', (done) => {
        supertest.agent("https://"+app.SENDMAIL_HOST+"/v1/analytics/")
            .set('Content-Type', 'text/html')
            .set('Report-Type', 'Daily')
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
