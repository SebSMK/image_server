
var path = require('path'),
    logger = require("./logging"),
    express = require('express'),    
    config = require('./config'),
    SegfaultHandler = require('segfault-handler'), 
    Solr = require('./solr'),
    iipproxy = require('./iip'),       
    sprintf = require('sprintf-js').sprintf,  
    Q = require('q'),   
    app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var route_imgsrv_zoom_test = require('./routes/test_zoom')(app, io);

var version = config.version;

logger.debug("Overriding 'Express' logger");

//app.use(express.logger({format: 'dev', stream: logger.stream }));
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

SegfaultHandler.registerHandler();

//app.use('/', route_imgsrv_zoom_test);

logger.info("Serving images from " + config.storage.dev + " on port " + config.port);

http.listen(config.port, function(){
  console.log('listening on *:' + config.port);
});


