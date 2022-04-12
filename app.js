var stdio = require('stdio');

var org = stdio.getopt({
    'env': {args: 1, required: true},
    'auth_api': {args: 1, required: true},
    'mail_connectionURL' : {args: 1, required: true},
    'refresh_token' : {args: 1, required: true}

});

const config = {
    "apigee": {
        "management_api": {
            "host":"api.enterprise.apigee.com"
         },
         "org":{
             "env":{
                 "dev":"earthport-test",
                 "qa" :"earthport-test",
                 "qa2":"earthport-test",
                 "uat":"earthport-test",
                 "waf":"earthport-test",
                 "sandbox":"earthport",
                 "customerintegration":"earthport",
                 "production":"earthport",
             },
             "refresh_token":"refresh_token",
             "auth_api":"auth_api"
         },
         "mail_connectionURL":"",
         set payload(config_data){
            this.org.auth_api = config_data.auth_api;
            this.mail_connectionURL = config_data.mail_connectionURL;
            this.org.refresh_token = config_data.refresh_token;
         }
    }
};

config.apigee.payload = org;
console.log(JSON.stringify(config.apigee));
module.exports = config;