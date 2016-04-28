var express = require('express'),
//router = express(),
path = require('path'),
logger = require("../logging"),
config = require('../config'), 
Solr = require('../solr'),
iipproxy = require('../iip'),       
sprintf = require('sprintf-js').sprintf,  
Q = require('q'),
fs = require('fs'),    
upath = require('upath'),
request = require('request'),
bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false });  

var url = require('url');
var proxy = require('proxy-middleware'); 

module.exports = function(router, io) {
  router.set('views', path.join(__dirname, '../views'));
  router.set('view engine', 'jade');
  //router.set(express.static(path.join(__dirname, 'public')));

  //* proxying calls to IIP server
  router.use(config.IIPPath, proxy(url.parse(sprintf('http://%s%s', config.IIPHost,config.IIPPath))));
  
  //* proxying calls to IIP images
  router.use('/imgsrv/test/zoom/images/', proxy(url.parse(sprintf('http://localhost:%s/images/', config.port))));
  
  
  router.get('/imgsrv/test/iipmoov/:id',                       
      function(req, res, next) {        
        sendInterfaceMessage('//////// start zooming *******');                                
        
        getImageData(req.params.id)
        .then(function(params){
          res.render('zoom', {title: params.invnumber, invnumber: params.invnumber, path: params.path, IIPServerPath: config.IIPPath});
        })
        .catch(function (err){
          res.send(500);
        })
         
  });  
  
  router.get('/imgsrv/test/osd/:id',                       
      function(req, res, next) {        
        sendInterfaceMessage('//////// start zooming *******');                                
        
        getImageData(req.params.id)
        .then(function(params){
          res.render('osd', {title: params.invnumber, invnumber: params.invnumber, path: params.path, IIPServerPath: config.IIPPath});
        })
        .catch(function (err){
          res.send(500);
        })
         
  });  
        

  /***
 *  PRIVATE FUNCTIONS
 **/
 function getImageData(id){                         
        var solrPath = sprintf('%sselect?q=id%%3A%s+OR+invnumber%%3A%s&wt=json&sort=created+desc&fl=value,id,invnumber', config.solrDAMCore, '"' + id + '"', '"' + id + '"');    
        var solr = new Solr(config.solrDAMHost, config.solrDAMPort);   
        var deferred = Q.defer();                                        
        
	     sendInterfaceMessage("zoom:getImageData - solr req:" +  solrPath);
  
        return solr.get(solrPath)                    
            .then( function(solrResponse){
                 
                // find artwork(s) in solrdam 
                 if(solrResponse.response.numFound > 0){                            
                   logger.info("zoom:getImageData - solr numfound:", solrResponse);
                   sendInterfaceMessage("zoom:getImageData - numfound:" + solrResponse.response.numFound);
                   
                                          
                    var params = {}, doc = solrResponse.response.docs[0];
                    params.id = doc.id;
                    params.path = doc.value;
                    params.invnumber = doc.invnumber;                                                                                                                                                                              
                    
                    deferred.resolve(params);                                                                                                                              
                                
                                                              
                 }else{              
                   logger.info("zoom:getImageData - image not found :" + id);
                   deferred.reject({error: "zoom:getImageData - image not found: " + id});  
                   sendInterfaceMessage("zoom:getImageData - image not found: " +  id);                   
                 }          
                
                return deferred.promise;
		})
		.catch(function (err){              
      logger.error('zoom:getImageData', err);
  		sendInterfaceMessage("zoom:getImageData - error: " +  err); 
  		deferred.reject(err);
  		return deferred.promise;         
    }); 
	}

  function pathConv2Unix(windowsPath){
    var unixPath = upath.toUnix(windowsPath);
    return unixPath.replace('F:/FotoII/', '');  
  };
  
  function sendInterfaceMessage(message){
      if (io !== undefined && io != null)
        io.sockets.emit('message', { message: sprintf('%s -- %s', getFormatedNowDate() , message )});  
  };
  
  function getFormatedNowDate(){
       var date = new Date();
       var y = date.getFullYear();
       var M = date.getMonth();
       var d = date.getDate();
       var h = date.getHours();
       var m = date.getMinutes();
       var s = date.getSeconds();
       var ms = date.getMilliseconds();
              
       return sprintf('%s-%s-%sT%s:%s:%s.%s', y, M, d, h, m, s, ms);
        
  };

}
