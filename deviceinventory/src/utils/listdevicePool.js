var devicePoolName=require('../schema/devicePoolSchema');

var fs = require('fs');
var xml2js = require('xml2js');
var https = require("https");



var express=require('express');
var bodyparser=require('body-parser');
var app=express();



app.use(bodyparser.json());


app.listen(3000);

var authentication = 'administrator:C1sco12345';

var headers = {
  'SoapAction':'CUCM:DB ver=10.0',
  'Authorization': 'Basic ' + new Buffer(authentication).toString('base64'), 
  'Content-Type': 'text/xml; charset=utf-8'
}

var soapBody = new Buffer('<?xml version="1.0" encoding="UTF-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:axlapi="http://www.cisco.com/AXL/API/10.0">'+
  '<soapenv:Header />'+
  '<soapenv:Body>'+
    '<axlapi:listDevicePool>'+
         '<searchCriteria>'+
          '<name>%</name>'+
        '</searchCriteria>'+
         '<returnedTags>'+
            '<name/>'+
                 '</returnedTags>'+
      '</axlapi:listDevicePool>'+
  '</soapenv:Body>'+
'</soapenv:Envelope>'
);

var options = {
  host: '198.18.133.3',        // The IP Address of the Communications Manager Server
  port: 443,                  // Clearly port 443 for SSL -- I think it's the default so could be removed
  path: '/axl/',              // This is the URL for accessing axl on the server
  method: 'POST',             // AXL Requires POST messages
  headers: headers,           // using the headers we specified earlier
  rejectUnauthorized: false   // required to accept self-signed certificate
};

// Doesn't seem to need this line, but it might be useful anyway for pooling?
options.agent = new https.Agent(options);


var saveDevicePool=function(data){
      console.log("Data inSideFunction:--"+JSON.stringify(data));
      var dpoolname=new devicePoolName({name:data});
      dpoolname.save(function(err,success){

       res.send(success);
     });



};


var req = https.request(options, function(res) {
  console.log("status code = ", res.statusCode);
  console.log("headers = " , res.headers);
  res.setEncoding('utf8');
 
  res.on('data', function(d) {
    console.log("Got Data: " + d);

     var parser = new xml2js.Parser({trim :{default: true},ignoreAttrs :{default: true},explicitRoot:{default: true}});
               
                  parser.parseString(d,function(err,result){

                        var result1=result['soapenv:Envelope']['soapenv:Body'][0]['ns:listDevicePoolResponse'][0]['return'][0]['devicePool'];
                           console.log(result1);
                              result1.forEach(function(data){
                                      console.log(data['name'][0]);
                                      saveDevicePool(data['name'][0]);

                                      });
                    
                      
                  });

           
    
    });
});

req.write(soapBody);
req.end();
req.on('error', function(e) {
  console.error(e);
});



    
     
       
           

