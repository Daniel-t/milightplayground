module.exports = function(RED) {
function MiLight6(config) {
	RED.nodes.createNode(this,config);
	var node = this;
  var MiLight = require('./milight.js');
  var zoneType = config.zoneType;
  var zone = config.zone;
  MiLight.initiate(config.ip,config.port);

  var lights;
  console.log("type: "+zoneType);
  switch(zoneType){
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
	 console.log("String: "+msg.payload);
		    if (msg.payload == "off") lights.command("off");
		    if (msg.payload == "on") lights.command("on");
    } else {
	console.log("Object: "+JSON.stringify(msg.payload));
      var obj=msg.payload;
      //object
        if (obj.state=="off") {
          MiLight.sendCmd(lights.off());
        } else {
          MiLight.sendCmd(lights.on()); //gratuitous on
          if(obj.white) lights.command("whiteMode"); //RGB
          if(obj.color) lights.command("colorSet",obj.color); //RGB
          if(obj.rgbColor) lights.command("colorRGB",obj.rgbColor); //RGB
          if(obj.night) lights.command("nightMode"); //RGB
          if(obj.brightness) lights.command("brightnessSet",obj.brightness); //RGB
          if(obj.brightnessUp) lights.command("brightnessUp"); //RGB
          if(obj.brightnessDown) lights.command("brightnessDown"); //RGB

        }
    }
	});
};
RED.nodes.registerType("MiLight6",MiLight6);

}
