/**
 * This is a simple Lambda function that triggers the IFTTT maker channel on click of a
 * button.
 *
 * Follow these steps to complete the configuration of your function:
 *
 * 1. Update with IFTTT maker key
 * 2. Update with IFTTT maker event
 * 3. Update with sonos server host
 */

var http      = require('http'),
    https     = require('https'),
    url       = require('url'),
    host      = 'my.host', // update
    ifttt_key = '$3cReT_k3y'; // update

/* play_welcome_message sets the volume and then plays a message
 */
play_welcome_message = (event, context) => {
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
  var message = 'hello money managers of the li li and li fund'
  var get = http.get({
    host: host,
    path: '/sayall/' + encodeURIComponent(message)
  }, function(response) {
    console.log("done giving status:" + response.message);      
  });
}

/* live_in_love plays LiveInLove playlist
 */
live_in_love = () => {
  var get = http.get({
    host: host,
    path: '/living%20room/playlist/LiveInLove'
  }, function(response) {
    console.log("done living in love:" + response.message);      
  });
}

/* play_love_amy plays a special message for Amy
 */
play_love_amy = () => {
  var get = http.get({
    host: host,
    path: '/living%20room/favorite/love_amy.m4a'
  }, function(response) {
    console.log("done love amy:" + response.message);      
  });
}

/* play_love_daddy plays a special message for Daddy
 */
play_love_daddy = () => {
  var get = http.get({
    host: host,
    path: '/living%20room/favorite/daddy-oh.m4a'
  }, function(response) {
    console.log("done love daddy:" + response.message);      
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
    play_welcome_message(event, context);
  } else if(event.clickType === "DOUBLE") {
    play_love_daddy();
  } else if(event.clickType === "LONG") {
    play_love_amy();
  } else {
    console.log('unrecognized click type');
  }
};
