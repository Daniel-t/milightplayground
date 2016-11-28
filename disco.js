'use strict';
var dgram = require('dgram');

var DEFAULT_HOST = "10.1.1.2";
var DEFAULT_PORT = "5987";

var PREAMPLE = [0x80,0x00,0x00,0x00,0x11]

var FILLER = 0x00

var CMDS={
 ON: [0x31,0,0,0x08,0x04,0x01,0,0,0],
 OFF: [0x31,0,0,0x08,0x04,0x02,0,0,0],
 NIGHT: [0x31,0,0,0x08,0x04,0x05,0,0,0],
 WHITEON: [0x31,0,0,0x08,0x05,0x64,0,0,0],
 REG: [0x33,0,0,0,0,0,0,0,0,0],
 BON: [0x31,0x00,0x00,0x00,0x03,0x03,0x00,0x00,0x00],
 BOFF:[0x31,0x00,0x00,0x00,0x03,0x04,0x00,0x00,0x00],
 BWHITE:[0x31 ,0x00 ,0x00 ,0x00 ,0x03 ,0x05 ,0x00 ,0x00 ,0x00],
};

var bridgeID;
var seqNum=0x02;

var buildFrame = function(WB,CMD,ZONE){
	var out=[];
	//console.log("#"+WB.toString('hex')+"-"+CMD.toString("hex"));
	out=out.concat(PREAMPLE,WB,0x00,0x00,seqNum,FILLER,CMD,ZONE)
	var chkSum=calcCheckSum(out);
	out =	out.concat(chkSum);
	//console.log(JSON.stringify(out));
	//console.log("#"+out.toString('hex'));
	seqNum=(seqNum+1)%256;
	return new Buffer(out);
}

var sendFrame=function(payload){
	console.log("Sending: " + payload.toString('hex'));
	socket.send(payload,0,payload.length,DEFAULT_PORT,DEFAULT_HOST,function(){});
}

var sendKeepAlive=function(){
	var out=new Buffer([0xD0,0x00,0x00,0x00,0x02,bridgeID,0x00]);
	sendFrame(out);
}

var calcCheckSum=function(aFrame){
  
  var add=function(a,b){
	return a+b;
  };
 
  var sub = aFrame.slice(Math.max(aFrame.length - 11, 0)) ;
  var val=sub.reduce(add,0)
  var val1=Math.floor(val / 0xff)
  var val2=val % 0xff
  return [val1, val2]

}

var responder=function(host,port){
	function encode_utf8(s) {
  		return unescape(encodeURIComponent(s));
	}

	var resp="192.168.0.90,36c3d2c26dd5,HF-LPB100";

	resp=new Buffer(encode_utf8(resp));
	socket.send(resp,0,resp.length,port,host);
}
var _func={};

_func['2800000011']=function(msg){
	var unknown1=msg.slice(5,7);
	var mac=msg.slice(7,13);
	var fixed=msg.slice(13,15);
	var unknown2=msg.slice(15,19);
	var counter=msg.slice(19,20);
	var padding=msg.slice(20);
	console.log("0:" +msg.toString('hex'));
	console.log("1:" +unknown1.toString('hex'));
	console.log("2:" +mac.toString('hex'));
	console.log("2a:" +fixed.toString('hex'));
	console.log("3:" +unknown2.toString('hex'));
	console.log("4:" +counter.toString('hex'));
	console.log("5:" +padding.toString('hex'));
	bridgeID=new Uint8Array(counter);
//80:00:00:00:11:c1:01:00:0b:00:33:00:00:00:00:00:00:00:00:00:00:33
	var nFrame=buildFrame(bridgeID,[0x33,0,0,0,0,0,0,0,0,0],0x00);
	sendFrame(nFrame);
	setInterval(sendKeepAlive,10000);
};

_func['8800000003']=function(msg){
	//ERROR - ???
	var code= msg.slice(0,5);
	var unknown1 = msg.slice(5,8);
	console.log("0:" +msg.toString('hex'));
	console.log("1:" +unknown1.toString('hex'));
	console.log("ID:"+bridgeID.toString('hex'));
	var nFrame=buildFrame(bridgeID,CMDS.ON,0x01);
}

_func['d800000007']=function(){
	//keepalive
}

var socket=dgram.createSocket('udp4');

socket.bind(5987);
socket.on("message", (msg, rinfo) => {
  //console.log('Received %d bytes from %s:%d\n',
  //            msg.length, rinfo.address, rinfo.port);
  var hmsg=msg.toString('hex');
  var resp=(msg.toString('hex').substring(0,10));
  if (_func[resp]) { _func[resp](msg) 
  } else {
  console.log("Unknown code");
  console.log(hmsg);
  }
});



var payload=new Buffer([0x20,0x00,0x00,0x00,0x16,0x02,0x62,0x3a,0xd5,0xed,0xa3,0x01,0xae,0x08,0x2d,0x46,0x61,0x41,0xa7,0xf6,0xdc,0xaf,0xfe,0xf7,0x00,0x00,0x1e]);

console.log(payload.toString('hex'));
var loopFn=function(){
	//socket.send(payload,0,payload.length,DEFAULT_PORT,DEFAULT_HOST,function(a,b){});
	sendFrame(payload);
};

//setInterval(loopFn,5000);
loopFn();


var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = 'OHAI> ';

rl.on('line', function(line) {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    case 'on':
	var nFrame=buildFrame(bridgeID,CMDS.ON,0x01);
	sendFrame(nFrame);
	break;
    case 'off':
	var nFrame=buildFrame(bridgeID,CMDS.OFF,0x01);
	sendFrame(nFrame);
	break;
    case 'base on':
	var nFrame=buildFrame(bridgeID,CMDS.BON,0x01);
	sendFrame(nFrame);
	break;
    case 'base off':
	var nFrame=buildFrame(bridgeID,CMDS.BOFF,0x01);
	sendFrame(nFrame);
	break;
    case 'base white':
	var nFrame=buildFrame(bridgeID,CMDS.BWHITE,0x01);
	sendFrame(nFrame);
	break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
console.log(prefix + 'Good to see you. Try typing stuff.');
rl.setPrompt(prefix, prefix.length);
rl.prompt();