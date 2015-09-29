exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    var parsed = JSON.parse(event.Records[0].Sns.Message);
    if (parsed.message !== undefined) {
        var processedMessage = {
            
        };
        processedMessage.message = parsed.message;
        console.log('Message received was: ' + processedMessage.message);
        if (parsed.custom !== undefined) {
            if (parsed.custom.senderid !== undefined) processedMessage.senderid = parsed.custom.senderid;
            if (parsed.custom.recipientid !== undefined) processedMessage.recipientid = parsed.custom.recipientid;
            if (parsed.custom.recipientname !== undefined) processedMessage.recipientname = parsed.custom.recipientname;
            if (parsed.custom.deviceplatform !== undefined && parsed.custom.devicetoken !== undefined) {
                processedMessage.deviceplatform = parsed.custom.deviceplatform;
                processedMessage.devicetoken = parsed.custom.devicetoken;
            }
        }
        console.log('processedMessage in JSON speak is: ' + JSON.stringify(processedMessage));
        // TODO: Handle the custom stuff and do something useful with it.
        context.succeed('Done');
    } else {
        context.fail('Message key not found')
    }
};
