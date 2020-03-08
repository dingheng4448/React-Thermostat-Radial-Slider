import React from 'react';
import './current-temp-input-view.css';

class CurrentTempInputView extends React.Component {
	render() {
		return (
			<div>
				<form>
					<label htmlFor="currentTemperatureInput">Set Current Temperature: </label>
					<input type="number" id="currentTemperatureInput" name="currentTemperatureInput"
						min={this.props.minCurrentTemp} max={this.props.maxCurrentTemp} 
						value={this.props.currentTemp} onChange={this.props.onChangeCurrentTemp} 
					/>
					<input type="range" id="currentTemperatureInputRange" name="currentTemperatureInputRange" 
						min={this.props.minCurrentTemp} max={this.props.maxCurrentTemp} 
						value={this.props.currentTemp} onChange={this.props.onChangeCurrentTemp} 
					/>
				</form>
			</div>
		);
	}
}

export default CurrentTempInputView;