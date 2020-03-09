class ThermostatModel {
	
	// Constructor function to initialize object
	constructor(startDeg, endDeg, defaultTargetTemp, defaultCurrentTemp,
		minTargetTemp, maxTargetTemp, minCurrentTemp, maxCurrentTemp,
		bufferComfort, bufferCool, bufferHeat) {
			
		this.startDeg = startDeg;
		this.endDeg = endDeg;
		this.defaultTargetTemp = defaultTargetTemp;
		this.defaultCurrentTemp = defaultCurrentTemp;
		this.minTargetTemp = minTargetTemp;
		this.maxTargetTemp = maxTargetTemp;
		this.minCurrentTemp = minCurrentTemp;
		this.maxCurrentTemp = maxCurrentTemp;
		this.bufferComfort = bufferComfort;
		this.bufferCool = bufferCool;
		this.bufferHeat = bufferHeat;
		
		// Calculate degree range
		this.degRange = (360 - this.startDeg) + this.endDeg;	
		
		// Calculate target temp range
		// maxTargetTemp is added by 1 so that it will be easier for the user to move the tracker to the max target temp
		this.targetTempRange = this.maxTargetTemp+1 - this.minTargetTemp;
		
		// Calculate default degree of rotation for the radial tracker
		this.defaultTrackerDeg = ((this.defaultTargetTemp - this.minTargetTemp) * 
									(this.degRange / this.targetTempRange)) + 
									this.startDeg;
	}
}

export default ThermostatModel;