const supertest = require('supertest');
var expect = require("chai").expect;
var fs = require('fs');
const btoa = require('btoa');
const app = require('./../../app');
var stdio = require('stdio');

var mail = stdio.getopt({
    'subject': {args: 1, required: true}
});

var mailBody = fs.readFileSync('./temp/html-report.html', {encoding:'base64', flag:'r'});
var request={};
request.mailSubject=btoa(mail.subject);
request.mailBody=mailBody;

console.log(request);
console.log("https://"+app.SENDMAIL_HOST+"/v1/analytics/")

//#region Send Email Describe
describe('Email Sending Job', function () {
  
    it('Send Email ', (done) => {
        supertest.agent("https://"+app.SENDMAIL_HOST+"/v1/analytics/")
            .set('Content-Type', 'text/html')
            .set('Report-Type', 'Hourly')
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

