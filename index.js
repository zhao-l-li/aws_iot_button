/**
 * This is a simple Lambda function that triggers the IFTTT maker channel on click of a
 * button.
 *
 * Follow these steps to complete the configuration of your function:
 *
 * 1. Update with IFTTT maker key
 * 2. Update with IFTTT maker event
 */
 
/**
 * The following JSON template shows what is sent as the payload:
{
    "serialNumber": "GXXXXXXXXXXXXXXXXX",
    "batteryVoltage": "xxmV",
    "clickType": "SINGLE" | "DOUBLE" | "LONG"
}
 *
 * A "LONG" clickType is sent if the first press lasts longer than 1.5 seconds.
 * "SINGLE" and "DOUBLE" clickType payloads are sent for short clicks.
 *
 * For more documentation, follow the link below.
 * http://docs.aws.amazon.com/iot/latest/developerguide/iot-lambda-rule.html
 */
exports.handler = (event, context, callback) => {
  var https    = require('https'),
      url      = require('url'),
      endpoint = url.parse(
        'https://maker.ifttt.com/trigger/my_event/with/key/my_key'
      ); // update my_event and my_key

  console.log('Received event:', event.clickType);
  console.log('start request to ' + endpoint.href);

  var jsonObject = JSON.stringify(event);
  var options = {
    host: endpoint.host,
    port: 443,
    path: endpoint.path,
    method: 'POST',
  };

  var post = https.request(options, function(res) {
    console.log("Got response: " + res.statusCode);
    context.succeed();
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    context.done(null, 'FAILURE');
  });

  post.write(jsonObject);
  post.end();

  console.log('end request to ' + endpoint.href);
};

