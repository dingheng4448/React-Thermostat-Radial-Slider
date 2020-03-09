import { Machine } from 'xstate';

// Model
import ThermostatModel from './ThermostatModel.js';

// Data to populate Model
import settingsData from '../ThermostatSettings.json'

const thermostatSettings = new ThermostatModel(
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

export const ThermostatMachine = Machine(
	{
		id: 'thermostatMachine',
		initial: 'off',
		
		states: {
			
			off: {
				on: {
					TEMP_CHANGE: [
						{
							target: 'off',
							cond: 'tempAcceptable'
						},
						{
							target: 'cooling',
							cond: 'tempTooHot'
						},
						{	
							target: 'heating',
							cond: 'tempTooCold'
						}
					]
				}
			},
			
			cooling: {
				on: {
					TEMP_CHANGE: [
						{
							target: 'off',
							cond: 'tempAcceptable'
						},
						{
							target: 'cooling',
							cond: 'tempTooHot'
						},
						{	
							target: 'heating',
							cond: 'tempTooCold'
						}
					]
				}
			},
			
			heating: {
				on: {
					TEMP_CHANGE: [
						{
							target: 'off',
							cond: 'tempAcceptable'
						},
						{
							target: 'cooling',
							cond: 'tempTooHot'
						},
						{	
							target: 'heating',
							cond: 'tempTooCold'
						}
					]
				}
			}
		}
	},
	{
		// Functions to help check if the current temperature is acceptable/too hot/too cold against the target temperature
		guards: {
			tempAcceptable: (context, event) => {
				return ((event.targetTemp - (thermostatSettings.bufferComfort - thermostatSettings.bufferHeat)) < event.currentTemp && 
						event.currentTemp < (event.targetTemp + (thermostatSettings.bufferComfort - thermostatSettings.bufferCool)))
			},
			tempTooHot: (context, event) => {
				return (event.currentTemp > (event.targetTemp + thermostatSettings.bufferComfort + thermostatSettings.bufferCool))
			},
			tempTooCold: (context, event) => {
				return (event.currentTemp < (event.targetTemp - thermostatSettings.bufferComfort - thermostatSettings.bufferHeat))
			}
		}
	}
);