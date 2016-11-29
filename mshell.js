'use strict';
var mb=require('./milight.js');


mb.initiate("10.1.1.2","5987");
var baseCtl=mb.baseCtlFactory();

var zone1Ctl=mb.zoneCtlRGBWFactory(0x01);

var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = 'OHAI> ';
var cmd;
rl.on('line', function(line) {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    case 'zone1 on':
	cmd=zone1Ctl.on();
	break;
    case 'zone1 off':
	cmd=zone1Ctl.off();
	break;
    case 'zone1 white':
	cmd=zone1Ctl.whiteMode();
	break;
    case 'zone1 brighter':
	cmd=zone1Ctl.brightnessUp();
	break;
    case 'zone1 dimmer':
	cmd=zone1Ctl.brightnessDown();
	//var nFrame=buildFrame(bridgeID,zone1Ctl.brightnessDown(),0x01);
	//sendFrame(nFrame);
	break;
    case 'zone1 colorUp':
	cmd=zone1Ctl.colorUp();
	break;
    case 'zone1 colorDown':
	cmd=zone1Ctl.colorDown();
	break;
    case 'zone1 mode1':
	cmd=zone1Ctl.mode(1);
	break;
    case 'zone1 mode2':
	cmd=zone1Ctl.mode(2);
	break;
case 'base on':
	cmd=baseCtl.on();
	break;
    case 'base off':
	cmd=baseCtl.off();
	break;
    case 'base white':
	cmd=baseCtl.whiteMode();
	break;
    case 'base brighter':
	cmd=baseCtl.brightnessUp();
	break;
    case 'base dimmer':
	cmd=baseCtl.brightnessDown();
	//var nFrame=buildFrame(bridgeID,baseCtl.brightnessDown(),0x01);
	//sendFrame(nFrame);
	break;
    case 'base colorUp':
	cmd=baseCtl.colorUp();
	break;
    case 'base colorDown':
	cmd=baseCtl.colorDown();
	break;
    case 'base mode1':
	cmd=baseCtl.mode(1);
	break;
    case 'base mode2':
	cmd=baseCtl.mode(2);
	break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
	mb.sendCmd(cmd);
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
console.log(prefix + 'Good to see you. Try typing stuff.');
rl.setPrompt(prefix, prefix.length);
rl.prompt();


