# aws-lambda-sns
## About
Explorings using AWS Lambda SNS to push stuff

## Disclaimer
I may not have any idea what I'm doing. Proceed with caution

## How it processes stuff
Processes payloads in the following format:

```javascript
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
```

## To send the above
**Note** You may have to configure your own key and stuff. 

```javascript
var sns = new AWS.SNS()
var messagepayload = JSON.stringify({
    default: 'This is a default message',
    lambda: lambdapayload
});
var params = {
    Message: messagepayload,
    MessageStructure: 'json',
    TopicArn: 'YOURARNHERE'
};
sns.publish(params, function(err,data) {
    console.log(err);
    console.log(data);
});
```
