var AWS = require('aws-sdk');

// Hardcoding keys on production is bad for your general health
AWS.config.update({accessKeyId: 'YOURACCESSKEYHERE', secretAccessKey: 'YOURSECRET', region: 'YOURREGION'});
var sns = new AWS.SNS({apiVersion: '2010-03-31'});

var lambdapayload = JSON.stringify({
    message: 'Hello World',
    custom: {
        senderid: 'testsenderid',
        recipientid: 'testrecipient',
        recipientname: 'Test Recipientname',
        messageid: 'testmsgid',
        devicetoken: 'token',
        deviceplatform: 'ios'
    }
});
var messagepayload = JSON.stringify({
    default: 'This is a default message',
    lambda: lambdapayload
});
var params = {
    Message: messagepayload,
    MessageStructure: 'json',
    TopicArn: 'THETOPICTOPUBLISHTO'
};
sns.publish(params, function(err,data) {
    console.log(err);
    console.log(data);
});
