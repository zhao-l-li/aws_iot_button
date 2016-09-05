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

var http  = require('http'),
    https = require('https'),
    url   = require('url');

/* play_welcome_message sets the volume and then plays a message
 */
play_welcome_message = (event) => {
  var data = {
    'value1': event.clickType,
    'value2': event.serialNumber,
    'value3': event.batteryVoltage,
  };

  var endpoint = url.parse(
    'https://maker.ifttt.com/trigger/aws_iot_button_pressed/with/key/' + ifttt_key
  );

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
    host: host,
    path: '/preset/all'
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
}

/* give_status gives the current status
 */
give_status = () => {
  var message = 'hi cheeks have a great day today'
  var get = http.get({
    host: host,
    path: '/sayall/' + encodeURIComponent(message)
  }, function(response) {
    console.log("done giving status:" + response.message);      
  });
}

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
  console.log('Received event:', event.clickType);

  if(event.clickType === "SINGLE") {
    play_welcome_message(event);
  } else if(event.clickType === "DOUBLE") {
    give_status();
  } else if(event.clickType === "LONG") {
    console.log('long click action has not yet been defined');
  } else {
    console.log('unrecognized click type');
  }
};

