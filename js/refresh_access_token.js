const supertest = require('supertest');
var expect = require("chai").expect;
var stdio = require('stdio');
var fs = require('fs');
const app = require('./../app');
var org;


var requsetBody = stdio.getopt({
    'refreshTokenPayload': {args: 1, required: true},
});



console.log(app.apigee.org.auth_api);
console.log(app.apigee.org.refresh_token);


var payload = "grant_type=refresh_token&refresh_token="+app.apigee.org.refresh_token;

// Mocha describe

describe('Refresh Access Token', function () {
    // Post Report in apigee
    it('Refresh Access Token ', (done) => {
        supertest.agent(app.apigee.org.auth_api)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            .post("/token")
            .set('Authorization', "Basic ZWRnZWNsaTplZGdlY2xpc2VjcmV0").send(payload)
            .end(function (err, res) {
                if (err) return done(err);
                else {
                    expect(res.statusCode).to.equal(200);
                    fs.writeFileSync("accessToken.txt", res.body.access_token);
                    console.log(res.body.access_token);
                }
                done();
            });
    }).timeout(18000);
});
