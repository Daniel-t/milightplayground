# THIS IS NOT THE REPO YOU ARE LOOKING FOR

See:
* https://github.com/daniel-t/MiLight_v6

This is a playground, things will work or not work depending on what I'm up to.

## Usage 
'use strict';
var mb=require('./milight.js');

mb.initiate("10.1.1.2","5987");
var baseCtl=mb.baseCtlFactory(); //bridge light

var z1=mb.zoneCtlRGBWFactory(0x01); //zone 1 RGBW globes
var z2=mb.zoneCtlRGBWWFactory(0x02); //zone 2 RGBWW globes

//method 1
mb.sendCmd(z1.on());
mb.sendCmd(z1.mode(0x01));
mb.sendCmd(baseCtl.on());
mb.sendCmd(baseCtl.whiteMode());

//method 2
z1.command("on")
z1.command("mode",0x01)
baseCtl.command("on")
baseCtl.command("whiteMode")
