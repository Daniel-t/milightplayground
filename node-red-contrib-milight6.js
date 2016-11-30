module.exports = function(RED) {
function MiLight6(config) {
	RED.nodes.createNode(this,config);
	var node = this;
  var MiLight = require('milight');
  var type = config.type;
  var zone = config.zone;
  MiLight.initiate(config.ip,config.port);

  var lights;
  switch(type){
  case 'RGBW':
    lights=MiLight.zoneCtlRGBWFactory(zone);
    break;
  case 'RGBWW':
    lights=MiLight.zoneCtlRGBWWFactory(zone);
    break;
  case 'BASE':
    lights=MiLight.baseCtlFactory();
    break;
  }

	this.on('input', function(msg) {
    if (typeof msg.payload == "string") {
		    if (msg.payload == "off") MiLight.sendCmd(lights.off());
		    if (msg.payload == "on") MiLight.sendCmd(lights.on());
    } else {
      var obj=msg.payload;
      //object
        if (obj.state=="off") {
          MiLight.sendCmd(lights.off());
        } else {
          MiLight.sendCmd(lights.on()); //gratuitous on
          if(obj.white) MiLight.sendCmd(lights.whiteMode());
          if(obj.night) MiLight.sendCmd(lights.nightMode());
          if(obj.color) MiLight.sendCmd(lights.color(obj.color)); //Hue
          if(obj.rgbColor) MiLight.sendCmd(lights.color(obj.color)) //RGB
          if(obj.brightness) MiLight.sendCmd(lights.brightnessSet(obj.brightness));
          if(obj.brightnessUp) MiLight.sendCmd(lights.brightnessUp(obj.brightnessUp));
          if(obj.brightnessDown) MiLight.sendCmd(lights.brightnessDown(obj.brightnessDown));

          if(obj.saturation) MiLight.sendCmd(lights.saturationSet(obj.saturation));
          if(obj.saturationUp) MiLight.sendCmd(lights.saturationUp(obj.saturationUp));
          if(obj.saturationDown) MiLight.sendCmd(lights.saturationDown(obj.saturationDown));

          if(obj.colorTemp) MiLight.sendCmd(lights.colorTempSet(obj.colorTemp));
          if(obj.colorTempUp) MiLight.sendCmd(lights.colorTempUp(obj.colorTempUp));
          if(obj.colorTempDown) MiLight.sendCmd(lights.colorTempDown(obj.colorTempDown));
        }
    }
	});
};
RED.nodes.registerType("MiLight6",MiLight6);

}
