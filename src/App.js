import React from 'react';
import './App.css';

// React components (Views & ViewModels)
import ThermostatView from './view/ThermostatView';
import CurrentTempInputView from './view/CurrentTempInputView';

// Model classes
import ThermostatModel from './model/ThermostatModel.js';

// Data to populate Model
import settingsData from './ThermostatSettings.json'

class App extends React.Component {
	constructor(props){
        super(props);	

		this.thermostatSettings = new ThermostatModel(
			settingsData.startDeg,
			settingsData.endDeg,
			settingsData.defaultTargetTemp,
			settingsData.defaultCurrentTemp,
			settingsData.minTargetTemp,
			settingsData.maxTargetTemp,
			settingsData.minCurrentTemp,
			settingsData.maxCurrentTemp
		);
	
        this.state = {
			targetTemp: this.thermostatSettings.defaultTargetTemp,
			currentTemp: this.thermostatSettings.defaultCurrentTemp,
			mode: "off"
        }
    }
	
	updateTargetTemp = (newTargetTemp) => {
		this.updateMode(newTargetTemp , this.state.currentTemp);
		
        this.setState({
			targetTemp: newTargetTemp
		});
    }
	
	updateCurrentTemp = e => {
		this.updateMode(this.state.targetTemp , e.target.value);
		
        this.setState({
			currentTemp: e.target.value
		});
    }
	
	updateMode = (targetTemp, currentTemp) => {
		let currentMode = this.state.mode;
		
		if (currentTemp > (targetTemp + 2 + 1.5)) {
			currentMode = "cooling";
		}
		if (currentTemp < (targetTemp - 2 - 1)) {
			currentMode = "heating";
		}
		if ((targetTemp - 2 - 1.5) < currentTemp && 
			currentTemp < (targetTemp + 2 - 1.5)) {
			currentMode = "off";
		}
		
        this.setState({
			mode: currentMode
		});
	}
	
	render() {
		return (
			<div>
				<ThermostatView 
					thermostatSettings={this.thermostatSettings} 
					targetTemp={this.state.targetTemp}
					currentTemp={this.state.currentTemp} 
					mode={this.state.mode}
					onChangeTargetTemp={this.updateTargetTemp}
				/>
				<CurrentTempInputView 
					minCurrentTemp={this.thermostatSettings.minCurrentTemp} 
					maxCurrentTemp={this.thermostatSettings.maxCurrentTemp} 
					currentTemp={this.state.currentTemp} 
					onChangeCurrentTemp={this.updateCurrentTemp} 
				/>
			</div>
		);
	}
}

export default App;