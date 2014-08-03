var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Server = function(port) {

    var self = this;

    this.start = function () {

	self.server = net.createServer(function(sock) {
	    self.sock = sock;
	    self.isStarted = true;

	    var remoteAddress = sock.remoteAddress;
	    var remotePort = sock.remotePort;
	    sock.socketIsOpen = true;
	
	    console.log('CONNECTED: ' + remoteAddress +':'+ remotePort);
	
	    sock.on('error', function(err) {
	        if(err != undefined)
	                console.log("ERROR: ", err);
	    });
	
	    sock.on('data', function(data) {
	        sock.lastCommand = data;
	        console.log('DATA ' + sock.remoteAddress + ': ' + data);
	        self.emit('data', data);
	    });
	
	    sock.on('close', function(data) {
	        console.log('CLOSED: ' + remoteAddress +':'+ remotePort);
	        sock.socketIsOpen = false;
	    });
	
	});

	self.server.listen(port, function() {
	    console.log("STARTED server on port:", port);
	});
    };

    this.stop = function() {
	if(self.isStarted) {
 	    self.server.close(function() {
		console.log("STOPPED server on port:", port);
	    });
	    self.isStarted = false;
	}
    };

    this.write = function(buffer) {
        if(self.sock && self.sock.socketIsOpen)
	    self.sock.write(buffer);
    };

};

util.inherits(Server, EventEmitter);

module.exports = Server;
