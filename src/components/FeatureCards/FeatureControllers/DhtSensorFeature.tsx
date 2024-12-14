import { Group, Text } from '@mantine/core';
import { FeatureInterface } from '../../../store/data';
import './DhtSensorFeature.css';

export interface DhtSensorFeatureProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
	values?: any;
}

export interface DhtSensorDataInterface {
	temp: number;
	humidity: number;
	heatIndex: number;
}

const DhtSensorFeature = ({ feature }: DhtSensorFeatureProps) => {
	const data: DhtSensorDataInterface = feature.data as any;

	const getGaugeColor = (
		value: number,
		type: 'temp' | 'humidity' | 'heatIndex'
	) => {
		let hue;
		switch (type) {
			case 'temp':
			case 'heatIndex':
				hue = 240 - (value / 30) * 240;
				break;
			case 'humidity':
				hue = 240 - (value / 70) * 240;
				break;
		}
		hue = Math.max(hue, 0);
		return `hsl(${hue}, 100%, 50%)`;
	};

	const renderGauge = (
		value: number,
		max: number,
		type: 'temp' | 'humidity' | 'heatIndex'
	) => {
		const percentage = (value / max) * 100;
		const color = getGaugeColor(value, type);
		const rotation = Math.max(Math.min(percentage * 1.8 - 90, 90), -90); // Calculate rotation for the needle

		return (
			<div className="gauge-container">
				<div
					className="gauge"
					style={
						{
							'--percentage': `${percentage}%`,
							'--color': color,
							'--rotation': `${rotation}deg`,
						} as React.CSSProperties
					}
				>
					<div className="gauge-background"></div>
					<div className="gauge-fill"></div>
					<div className="gauge-needle"></div>
					<div className="gauge-ticks">
						{[0, 25, 50, 75, 100].map((tick) => (
							<div
								key={tick}
								className="gauge-tick"
								style={
									{
										'--tick-rotation': `${
											tick * 1.8 - 90
										}deg`,
									} as React.CSSProperties
								}
							></div>
						))}
					</div>
				</div>
			</div>
		);
	};

	return (
		<Group direction="row" grow spacing="md">
			<div className="sensor-item">
				{renderGauge(data.heatIndex, 50, 'heatIndex')}
				<Text>Heat Index {data.heatIndex.toFixed(1)} °C</Text>
			</div>
			<div className="sensor-item">
				{renderGauge(data.temp, 50, 'temp')}
				<Text>Temperature {data.temp.toFixed(1)} °C</Text>
			</div>
			<div className="sensor-item">
				{renderGauge(data.humidity, 100, 'humidity')}
				<Text>Humidity {data.humidity.toFixed(1)} %</Text>
			</div>
		</Group>
	);
};

export default DhtSensorFeature;
