class ThermostatModel {
    constructor(startDeg, endDeg, defaultTargetTemp, defaultCurrentTemp,
		minTargetTemp, maxTargetTemp, minCurrentTemp, maxCurrentTemp) {
        // constructor function to initialize object
        this.startDeg = startDeg;
        this.endDeg = endDeg;
        this.defaultTargetTemp = defaultTargetTemp;
		this.defaultCurrentTemp = defaultCurrentTemp;
		this.minTargetTemp = minTargetTemp;
		this.maxTargetTemp = maxTargetTemp;
		this.minCurrentTemp = minCurrentTemp;
		this.maxCurrentTemp = maxCurrentTemp;
    }
}

export default ThermostatModel;