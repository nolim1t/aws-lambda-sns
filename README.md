# aws-lambda-sns Examples
## About
Explorings using AWS Lambda SNS to push stuff

## Disclaimer
It's my first time with lambda. Proceed with caution

## Apple's push notification docs
https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html

## AWS IAM Policy

Make sure you grant write permissions to the lambda role

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1443521471000",
            "Effect": "Allow",
            "Action": [
                "sns:CreatePlatformEndpoint",
                "sns:Publish"
            ],
            "Resource": [
                "arn:aws:sns:*:*:*"
            ]
        }
    ]
}
```

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
