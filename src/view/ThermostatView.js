import React from 'react';
import './thermostat-view.css';
import radialLines from '../images/radialLines.png';

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

class RadialPanel extends React.Component {
	render() {
		return (
			<div className="radial-panel">
				<RadialBackground mode={this.props.mode} />
				<RadialBorder />
				<RadialMarkings 
					thermostatSettings={this.props.thermostatSettings} 
					onChangeTargetTemp={this.props.onChangeTargetTemp} 
				/>
				<TargetTemperatureIndicator targetTemp={this.props.targetTemp} />
				<CurrentTemperatureIndicator currentTemp={this.props.currentTemp} />
			</div>
			
		);
	}
}

class RadialBackground extends React.Component {	
	render() {
		let topColor = "LightGrey";
		let botColor = "rgb(81,83,90)";
		let currentMode = this.props.mode;
		
		switch(currentMode) {
			case "off":
				topColor = "LightGrey";
				botColor = "rgb(81,83,90)";
				console.log("Mode: " + currentMode + 
							", Top Color: " + topColor + 
							", Bottom Color: " + botColor);
				break;
			case "cooling":
				topColor = "PowderBlue";
				botColor = "rgb(41,155,232)";
				console.log("Mode: " + currentMode + 
							", Top Color: " + topColor + 
							", Bottom Color: " + botColor);
				break;
			case "heating":
				topColor = "LightSalmon";
				botColor = "rgb(255,99,99)";
				console.log("Mode: " + currentMode + 
							", Top Color: " + topColor + 
							", Bottom Color: " + botColor);
				break;
			default:
				console.log("Mode: " + currentMode + 
							", Top Color: " + topColor + 
							", Bottom Color: " + botColor);
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

class RadialMarkings extends React.Component {
	constructor(props) {
		super(props);
		
		// Retrieve thermostat settings
		this.startDeg = this.props.thermostatSettings.startDeg;
		this.endDeg = this.props.thermostatSettings.endDeg;
		this.defaultTargetTemp = this.props.thermostatSettings.defaultTargetTemp;
		this.minTargetTemp = this.props.thermostatSettings.minTargetTemp;
		this.maxTargetTemp = this.props.thermostatSettings.maxTargetTemp;
		// Calculate degree range
		this.degRange = (360 - this.startDeg) + this.endDeg;	
		// Calculate target temp range
		this.targetTempRange = this.maxTargetTemp+1 - this.minTargetTemp;	// Consider if necessary to have maxTargetTemp+1
		// Calculate default degree of rotation for the radial tracker
		const defaultTrackerDeg = ((this.defaultTargetTemp - this.minTargetTemp) * 
									(this.degRange / this.targetTempRange)) + 
									this.startDeg;
		
		this.state = { 
			transformTrackerDeg: defaultTrackerDeg,
			isDragging: false
		};
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
			let newAngle = angle;
			if (0 <= newAngle && newAngle <= this.endDeg) {
				newAngle += 360;
			}
			let newTargetTemp = Math.floor(((newAngle - this.startDeg) * 
											(this.targetTempRange / this.degRange)) + 
											this.minTargetTemp);
			
			// Update variables in state
			this.setState({transformTrackerDeg:angle});
			this.props.onChangeTargetTemp(newTargetTemp);
		}
	}
	
	mouseReleased = e => {
		e.preventDefault();
		this.setState({isDragging:false});
	}
  
	render() {
		return (
			<div className="radial-markings" onMouseDown={this.mousePressed} onMouseMove={this.processDrag} onMouseUp={this.mouseReleased}>
				<img id="radial-lines" src={radialLines} alt="radialLines" />
				<RadialTracker transformTrackerDeg={this.state.transformTrackerDeg}/>
			</div>
		);
	}
}

class RadialTracker extends React.Component {
	render() {
		const styles = { 
			transform: "rotate(" + this.props.transformTrackerDeg + "deg)" 
		};
		
		return (
			<div className="radial-tracker" style={styles}></div>
		);
	}
}

class TargetTemperatureIndicator extends React.Component {
	render() {
		return (
			<div className="target-temperature-indicator">
				<h1>{this.props.targetTemp}</h1>
			</div>
		);
	}
}

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
