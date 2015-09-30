var AWS = require('aws-sdk');
// Configure
var ios_application_arn = 'YOUR DEFAULT IOS ARN'; // Default ARN

exports.handler = function(event, context) {
    var parsed = JSON.parse(event.Records[0].Sns.Message);
    if (parsed.message !== undefined) {
        var processedMessage = {
            
        };
        processedMessage.message = parsed.message;
        console.log('Message received was: ' + processedMessage.message);
        // Maybe receive the ARN as part of the payload?
        if (parsed.platformARN !== undefined) processedMessage.platformARN = parsed.platformARN;
        
        if (parsed.custom !== undefined) {
            // This is an iOS custom field for presenting a string with localization
            if (parsed.custom.localizationkey !== undefined) processedMessage.localizationkey = parsed.custom.localizationkey;
            
            // These are custom fields mostly for iOS (and for my app itself)
            if (parsed.custom.fromid !== undefined) processedMessage.fromid = parsed.custom.fromid;
            if (parsed.custom.recipientid !== undefined) processedMessage.recipientid = parsed.custom.recipientid;
            if (parsed.custom.fromname !== undefined) processedMessage.fromname = parsed.custom.fromname;
            
            // iOS Custom field
            if (parsed.custom.sound !== undefined) processedMessage.sound = parsed.custom.sound;

            if (parsed.custom.deviceplatform !== undefined && parsed.custom.devicetoken !== undefined) {
                processedMessage.deviceplatform = parsed.custom.deviceplatform;
                processedMessage.devicetoken = parsed.custom.devicetoken;
            }
        }
        console.log('processedMessage in JSON speak is: ' + JSON.stringify(processedMessage));

        if (processedMessage.deviceplatform !== undefined && processedMessage.devicetoken !== undefined) {
            var sns = new AWS.SNS({apiVersion: '2010-03-31'});
            if (processedMessage.deviceplatform === "ios") {
                // Process if iOS
                var ARN = processedMessage.platformARN || ios_application_arn;
                sns.createPlatformEndpoint({Token: processedMessage.devicetoken, PlatformApplicationArn: ARN}, function(err, data) {
                    if (!err) {
                        // No error so lets continue
                        console.log('Using EndpointARN: ' + data.EndpointArn);
                        // Time to publish to the endpoint
                        // Build up APS Payload
                        var apspayload = {
                            aps: {}
                        };
                        // See if there is a localization string
                        if (processedMessage.localizationkey !== undefined) {
                            apspayload.aps.alert = {
                                'loc-key': processedMessage.localizationkey
                            };
                        } else {
                            apspayload.aps.alert = processedMessage.message;
                        }
                        // See if sound is available otherwise make it default
                        if (processedMessage.sound !== undefined) {
                            apspayload.aps.sound = processedMessage.sound;
                        } else {
                            apspayload.aps.sound = "default";
                        }
                        // This is quite custom to my app, so you can leave this out of the payload
                        if (processedMessage.fromid !== undefined && processedMessage.fromname !== undefined && processedMessage.recipientid !== undefined) {
                            apspayload.fromid = processedMessage.fromid;
                            apspayload.fromname = processedMessage.fromname;
                            apspayload.recipientid = processedMessage.recipientid;
                        }
                        apspayload = JSON.stringify(apspayload);
                        console.log('APNS payload: ' + apspayload);
                        // Lets build the payload for SNS
                        var snspayload = JSON.stringify({
                            'APNS': apspayload,
                            'APNS_SANDBOX': apspayload
                        });
                        var publishparams = {
                            MessageStructure: 'json',
                            Message: snspayload,
                            TargetArn: data.EndpointArn
                        };
                        // Finally lets publish this
                        sns.publish(publishparams, function(puberr, pubdata) {
                           if (!puberr) {
                                console.log('Published: ' + pubdata.MessageId);
                                context.succeed('Done');
                           } else {
                               // TODO: Should handle endpoint disabled?
                                context.fail('Error publishing to push identifier: ' + puberr);
                           }
                        });
                    } else {
                        context.fail('Error creating platform endpoint (' + err + ')');
                    }
                });
            } else {
                context.fail('Unsupported deviceplatform');
            }
        } else {
            context.done('Completed without sending any messages');
        }
    } else {
        context.fail('Message key not found')
    }
};
