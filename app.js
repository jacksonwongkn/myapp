const http = require('http');

const requestListener = function (req, res) {
 
  var url = require('url');
  var name = url.parse(req.url, true).query['name'];
  var request = require('request');
  var title ;
  var message ;
  var alertStatus;
  var alertColor;

console.log('new req:');
console.log(JSON.stringify(req.headers));

  if (req.method == 'POST') {
    req.on('data', function(chunk) { 
      reqBody = JSON.parse(chunk.toString());
      title = reqBody.title;
      message = reqBody.message;
      callUrl = reqBody.ruleUrl;

      alertStatus = 'FIRING';
      alertColor = '#FF0000';
      if(title.indexOf('OK') > -1) {
	 alertStatus = 'OK';
	 alertColor = '16cd59';
      }


      console.log(title);
      console.log(message);
      console.log(alertStatus);

var newBody = {
   "head":{
      "text": 'Alert Status: ' + alertStatus,
      "style":{
         "color":alertColor,
         "bold":true,
         "italic":false
      }
   },
   "body":[
      {
      "type": "message",
      "text": title,
      "style": {
        "color": "#222222",
        "bold": true,
        "italic": false
  	    }
      },
      {
         "type":"message",
         "text":message,
         "style":{
            "color":"#666",
            "bold":false,
            "italic":false
         }
      },
      {
         "type":"message",
         "text":"Click here to open grafana",
         "link":callUrl
      }
   ]
};


    request({
      headers: {
        'Authorization': 'Z8HzLq7DkNPHj9RMOlEbMbyz',
	'Content-Type': 'application/json'
      },
        uri: 'https://inbots.zoom.us/incoming/hook/-rjUiHife0iqTegWsJuONQfF' + '?format=full',
        body: JSON.stringify(newBody),
        method: 'POST'
      }, function (err, res, body) {
       // it works!
      });

   
  });




  }

  res.writeHead(200);
  res.end('Redirect zoom message success\n' + title + '\n' + message );
}

const server = http.createServer(requestListener);
server.listen(8080);
