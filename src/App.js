import React from 'react';
import './App.css';
import { interpret } from 'xstate';

// React components (Views & ViewModels)
import ThermostatView from './view/ThermostatView';
import CurrentTempInputView from './view/CurrentTempInputView';

// Model 
import ThermostatModel from './model/ThermostatModel.js';
import { ThermostatMachine } from './model/ThermostatMachine';

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
			settingsData.maxCurrentTemp,
			settingsData.bufferComfort,
			settingsData.bufferCool,
			settingsData.bufferHeat
		);
	
		this.state = {
			targetTemp: this.thermostatSettings.defaultTargetTemp,
			currentTemp: this.thermostatSettings.defaultCurrentTemp,
			thermostatState: ThermostatMachine.initialState
		}; 
	}
	
	// For every transition set the state of the machine as current state
	service = interpret(ThermostatMachine).onTransition(current =>
		this.setState({ thermostatState: current })
	);

	// Start the service when the component is mounted
	componentDidMount() {
		this.service.start();
	}

	// Stop the service when the component is unmounted
	componentWillUnmount() {
		this.service.stop();
	}
	
	updateTargetTemp = (newTargetTemp) => {
		this.service.send({type: 'TEMP_CHANGE', targetTemp: newTargetTemp, currentTemp: this.state.currentTemp });
		this.setState({
			targetTemp: newTargetTemp
		});
	}
	
	updateCurrentTemp = e => {
		this.service.send({type: 'TEMP_CHANGE', targetTemp: this.state.targetTemp, currentTemp: e.target.value });
		this.setState({
			currentTemp: e.target.value
		});
	}
	
	render() { 
		// Retrieve thermostat mode from XState
		let mode = this.state.thermostatState.value;
		
		return ( 
			<div>
				<ThermostatView 
					thermostatSettings={this.thermostatSettings} 
					targetTemp={this.state.targetTemp}
					currentTemp={this.state.currentTemp} 
					mode={mode}
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