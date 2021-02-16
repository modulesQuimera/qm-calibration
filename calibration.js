module.exports = function(RED) {

	function calibrationNode(config) {
		RED.nodes.createNode(this,config);
		this.compare_select = config.compare_select;
		this.nominal_voltage = config.nominal_voltage;
        this.minimum_voltage = config.minimum_voltage;
        this.nominal_current = config.nominal_current;
        this.minimum_current = config.minimum_current;
        this.energy_accum_time = config.energy_accum_time;
        this.calibration_power_factor = config.calibration_power_factor;
		var node = this;
		
		node.on('input', function(msg) {
			var _compare = { status: { "==" : true }};
			var globalContext = node.context().global;
			var currentMode = globalContext.get("currentMode");
			var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");

            
			var command =  {
				type: "processing_modular_V1_0",
				slot: 1,
				method: "calibration",
				compare: _compare,
                nominal_voltage:  parseInt(node.nominal_voltage),
                minimum_voltage: parseInt(node.minimum_voltage),
                nominal_current: parseInt(node.nominal_current),
                minimum_current: parseInt(node.minimum_current),
                energy_accum_time: parseInt(node.energy_accum_time),
                calibration_power_factor: parseFloat(node.calibration_power_factor),
				get_output: {}
			};
			
			if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                }
            }
			globalContext.set("exportFile", file);
			console.log(command)
			node.send(msg);
		});
	}
	RED.nodes.registerType("calibration", calibrationNode);
}