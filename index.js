/**
 * This is a simple Lambda function that triggers the IFTTT maker channel on click of a
 * button.
 *
 * Follow these steps to complete the configuration of your function:
 *
 * 1. Update with IFTTT maker key
 * 2. Update with IFTTT maker event
 * 2. Update with sonos server host
 * 2. Update with sonos server path
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

  var http     = require('http'),
      https    = require('https'),
      url      = require('url'),
      endpoint = url.parse(
        'https://maker.ifttt.com/trigger/my_event/with/key/my_key'
      ); // update my_event and my_key

  console.log('Received event:', event.clickType);
  var data = {
    'value1': event.clickType,
    'value2': event.serialNumber,
    'value3': event.batteryVoltage,
  };

  var options = {
    host: endpoint.host,
    port: endpoint.port,
    path: endpoint.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(data)),
    }
  };

  console.log('start request to ' + endpoint.href);
  console.log('with payload:' + JSON.stringify(data));

  var get = http.get({
    host: 'my_host', // sonos server host
    path: 'my_path'  // sonos server path
  }, function(response) {
    console.log("done presetting: " + response.message);      
  });

  var post = http.request(options, function(res) {
    console.log("Got response: " + res.statusCode);
    context.succeed();
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    context.done(null, 'FAILURE');
  });

  post.write(JSON.stringify(data));
  post.end();

  console.log('end request to ' + endpoint.href);
};

