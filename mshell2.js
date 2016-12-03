'use strict';
var mb=require('./milight.js');

mb.initiate("10.1.1.3","5987");
var baseCtl=mb.baseCtlFactory();

var z1=mb.zoneCtlRGBWFactory(0x01);
var z2=mb.zoneCtlRGBWWFactory(0x02);

