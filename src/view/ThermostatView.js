import React from 'react';
import './thermostat-view.css';
import radialLines from '../images/radialLines.png';



// Renders the view of the thermostat which encompasses all the subcomponents found below. 
class ThermostatView extends React.Component {
	render() {
		return (
			<div>
				<MainPanel 
					thermostatSettings={this.props.thermostatSettings} 
					targetTemp={this.props.targetTemp}
					currentTemp={this.props.currentTemp}
					mode={this.props.mode}
					onChangeTargetTemp={this.props.onChangeTargetTemp}
				/> 
			</div>
		);
	}
}

// Renders the MainPanel which encompasses the ProtrudingPanel.
class MainPanel extends React.Component {
	render() {
		return (
			<div className="main-panel">
				<svg id="main-svg" width="500" height="500">
					<circle id="main-circle" cx="250" cy="250" r="200" />
				</svg>
				
				<ProtrudingPanel 
					thermostatSettings={this.props.thermostatSettings}
					targetTemp={this.props.targetTemp}					
					currentTemp={this.props.currentTemp} 
					mode={this.props.mode}
					onChangeTargetTemp={this.props.onChangeTargetTemp} 
				/>
			</div>
		);
	}
}

// Renders the ProtrudingPanel which encompasses the RadialPanel.
// dropshadow filter is used to apply a shadow to the panel.
class ProtrudingPanel extends React.Component {
	render() {
		return (
			<div className="protruding-panel">
				<svg id="protruding-svg" width="500" height="500">
					<defs>
						<filter id="dropshadow" height="130%">
							<feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
							<feOffset dx="2" dy="2" result="offsetblur"/> 
							<feComponentTransfer>
								<feFuncA type="linear" slope="0.5"/> 
							</feComponentTransfer>
							<feMerge> 
								<feMergeNode/> 
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>
					
					<circle id="protruding-circle" cx="250" cy="250" r="180" />
				</svg>
				
				<RadialPanel 
					thermostatSettings={this.props.thermostatSettings} 
					targetTemp={this.props.targetTemp}	
					currentTemp={this.props.currentTemp} 
					mode={this.props.mode}
					onChangeTargetTemp={this.props.onChangeTargetTemp} 
				/>
			</div>
			
			
		);
	}
}

// Renders the RadialPanel which encompasses the RadialBackground, RadialBorder, 
// RadialTrackerPath, TargetTemperatureIndicator and CurrentTemperatureIndicator.
class RadialPanel extends React.Component {
	render() {
		return (
			<div className="radial-panel">
				<RadialBackground mode={this.props.mode} />
				<RadialBorder />
				<RadialTrackerPath 
					targetTemp={this.props.targetTemp}
					thermostatSettings={this.props.thermostatSettings} 
					onChangeTargetTemp={this.props.onChangeTargetTemp} 
				/>
				<TargetTemperatureIndicator targetTemp={this.props.targetTemp} />
				<CurrentTemperatureIndicator currentTemp={this.props.currentTemp} />
			</div>
			
		);
	}
}

// Renders the RadialBackground depending on the thermostat's mode from XState.
// An angled linear gradient is applied to the background to reproduce the required UI.
class RadialBackground extends React.Component {	
	render() {
		let topColor = "LightGrey";
		let botColor = "rgb(81,83,90)";
		let currentMode = this.props.mode;
		
		switch(currentMode) {
			case "off":
				topColor = "LightGrey";
				botColor = "rgb(81,83,90)";
				break;
			case "cooling":
				topColor = "PowderBlue";
				botColor = "rgb(41,155,232)";
				break;
			case "heating":
				topColor = "LightSalmon";
				botColor = "rgb(255,99,99)";
				break;
			default:
				break;
		}
		
		return (
			<div className="radial-background">
				<svg width="500" height="500">
					<defs>
						<linearGradient id="backgroundGradient" x1="0.5" y1="0.5" x2="1" y2="0">
							<stop offset="0%" stopColor={botColor}></stop>
							<stop offset="100%" stopColor={topColor}></stop>
						</linearGradient>
					</defs>
					
					<circle id="radial-circle" cx="250" cy="250" r="160" fill="url(#backgroundGradient)" />
				</svg>
			</div>
			
		);
	}
}

// Renders the RadialBorder which is made up of 2 different arc paths.
// The top arc path has a linear gradient applied to it to reproduce the required UI.
class RadialBorder extends React.Component {
	render() {
		return (
			<div className="radial-border">
				<svg width="500" height="500">
					<defs>
						<linearGradient id="borderGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="rgb(82,140,208)"></stop>
							<stop offset="100%" stopColor="rgb(219,107,118)"></stop>
						</linearGradient>
					</defs>
					
					<path id="top-radial-border" d="M190 400 A160 160 0 1 1 310 400" fill="none" stroke="url(#borderGradient)" strokeWidth="6" />
					<path id="bot-radial-border" d="M190 400 A160 160 0 0 0 310 400" fill="none" stroke="rgb(81,83,90)" strokeWidth="6" />
				</svg>
			</div>
			
		);
	}
}

// Renders the RadialTrackerPath which encompasses the RadialLines and RadialTracker.
// RadialLines is an image of the grooves on the radial. It is overlaid by the RadialTracker.
// The mouse drag event is accomplished by linking onMouseDown, onMouseMove, onMouseUp.
// The mouse scroll event is accomplished by onWheel.
class RadialTrackerPath extends React.Component {
	constructor(props) {
		super(props);
		
		// Retrieve thermostat settings
		this.startDeg = this.props.thermostatSettings.startDeg;
		this.endDeg = this.props.thermostatSettings.endDeg;
		this.defaultTargetTemp = this.props.thermostatSettings.defaultTargetTemp;
		this.minTargetTemp = this.props.thermostatSettings.minTargetTemp;
		this.maxTargetTemp = this.props.thermostatSettings.maxTargetTemp;
		this.degRange = this.props.thermostatSettings.degRange;
		this.targetTempRange = this.props.thermostatSettings.targetTempRange;
		this.defaultTrackerDeg = this.props.thermostatSettings.defaultTrackerDeg;
		
		this.state = { 
			transformTrackerDeg: this.defaultTrackerDeg,
			isDragging: false
		};
	}
	
	componentDidMount() {
		// Add event listener for the custom event angleChange
		document.addEventListener('angleChange', function(e) {
			console.log("(CUSTOM EVENT) New angle: " + e.detail.newAngle);
		})
	}

	componentWillUnmount() {
		document.removeEventListener('angleChange', function(e) {
			console.log("(CUSTOM EVENT) New angle: " + e.detail.newAngle);
		})
	}
	
	mousePressed = e => {
		e.preventDefault();
		this.setState({isDragging:true});
	}
	
	processDrag = e => {
		e.preventDefault();
		if (this.state.isDragging) {
			const radial = e.target.getBoundingClientRect();
			let center_x = radial.left + radial.width / 2;
			let center_y = radial.top + radial.height / 2;
			let pos_x = e.clientX; 
			let pos_y = e.clientY;
			let delta_x = center_x - pos_x;
			let delta_y = center_y - pos_y;
			
			// Calculate angle between radial center and mouse pos
			let angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI); 
			console.log("Calculated angle: " + angle);
			
			// Adjust angle to start at 0 from the top
			angle -= 90;
			console.log("Adjusted angle: " + angle);
			
			// Calculate positive angle
			if (angle < 0) {
				angle = 360 + angle; 
			}
			angle = Math.round(angle);
			console.log("Positive angle: " + angle);
			
			// If angle exceeds target temp range, reset angle to start point
			if (this.endDeg+1 <= angle && angle <= this.startDeg-1) {
				angle = this.startDeg;
			}
			
			// Calculate new target temperature
			// A temporary value (tmpAngle) is needed to handle the case when angle is between 0 and endDeg
			let tmpAngle = angle;
			if (0 <= tmpAngle && tmpAngle <= this.endDeg) {
				tmpAngle += 360;
			}
			let newTargetTemp = Math.floor(((tmpAngle - this.startDeg) * 
											(this.targetTempRange / this.degRange)) + 
											this.minTargetTemp);
			
			// Update variables in state
			this.setState({transformTrackerDeg:angle});
			this.props.onChangeTargetTemp(newTargetTemp);
			
			// Fire a custom event each time the selected angle changes
			let angleChangeEvent = new CustomEvent('angleChange', {
				detail: {
					newAngle: angle
				}
			});
			document.dispatchEvent(angleChangeEvent);
		}
	}
	
	mouseReleased = e => {
		e.preventDefault();
		this.setState({isDragging:false});
	}
	
	processScroll = e => {
		let y = e.deltaY;
		let newTargetTemp;
		
		// If y > 0, user is scrolling down hence the increase in target temp
		// else, user is scrolling up hence the decrease in target temp
		if (y > 0) {
			newTargetTemp = this.props.targetTemp + 1;
			if (newTargetTemp > this.maxTargetTemp) {
				newTargetTemp = this.maxTargetTemp;
			}
		} else {
			newTargetTemp = this.props.targetTemp - 1;
			if (newTargetTemp < this.minTargetTemp) {
				newTargetTemp = this.minTargetTemp;
			}
		}
		
		// Calculate new angle for the new target temp
		let angle = ((newTargetTemp - this.minTargetTemp) * 
					(this.degRange / this.targetTempRange)) + 
					this.startDeg;
		if (angle > 360) {
			angle -= 360;
		}
		
		// Update variables in state
		this.setState({transformTrackerDeg:angle});
		this.props.onChangeTargetTemp(newTargetTemp);
		
		// Fire a custom event each time the selected angle changes
		let angleChangeEvent = new CustomEvent('angleChange', {
			detail: {
				newAngle: angle
			}
		});
		document.dispatchEvent(angleChangeEvent);
	}
 
	render() {
		return (
			<div className="radial-tracker-path" 
				onMouseDown={this.mousePressed} 
				onMouseMove={this.processDrag} 
				onMouseUp={this.mouseReleased}
				onWheel={this.processScroll}>
				<img id="radial-lines" src={radialLines} alt="radialLines" />
				<RadialTracker transformTrackerDeg={this.state.transformTrackerDeg}/>
			</div>
		);
	}
}

// Renders the RadialTracker.
class RadialTracker extends React.Component {
	render() {
		// Apply transformation to rotate the radial tracker
		const styles = { 
			transform: "rotate(" + this.props.transformTrackerDeg + "deg)" 
		};
		
		return (
			<div className="radial-tracker" style={styles}></div>
		);
	}
}

// Renders the TargetTemperatureIndicator.
class TargetTemperatureIndicator extends React.Component {
	render() {
		return (
			<div className="target-temperature-indicator">
				<h1>{this.props.targetTemp}</h1>
			</div>
		);
	}
}

// Renders the CurrentTemperatureIndicator.
class CurrentTemperatureIndicator extends React.Component {
	render() {
		return (
			<div className="current-temperature-indicator">
				Current: {this.props.currentTemp}
			</div>
		);
	}
}

export default ThermostatView;
