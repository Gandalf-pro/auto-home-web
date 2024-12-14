import { Group, Slider, Text } from '@mantine/core';
import { FeatureInterface } from '../../../store/data';

export interface LightLevelFeatureProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
	values?: any;
}

export interface LightLevelDataInterface {
	temp: number;
	humidity: number;
	heatIndex: number;
}

const DhtSensorFeature = ({ feature }: LightLevelFeatureProps) => {
	const data: LightLevelDataInterface = feature.data as any;
	return (
		<Group direction="column" grow spacing={0}>
			<Group spacing="sm" direction="column" grow>
				<Text mt="md">Temp: {data.temp} C</Text>
				<Slider
					value={data.temp}
					marks={[
						{ value: 10, label: '10 C' },
						{ value: 25, label: '25 C' },
						{ value: 30, label: '30 C' },
						{ value: 40, label: '40 C' },
					]}
					min={0}
					max={50}
				/>
			</Group>
			<Group spacing="sm" direction="column" grow>
				<Text mt="md">Heat Index: {data.heatIndex} C</Text>
				<Slider
					value={data.heatIndex}
					marks={[
						{ value: 10, label: '10 C' },
						{ value: 25, label: '25 C' },
						{ value: 30, label: '30 C' },
						{ value: 40, label: '40 C' },
					]}
					min={0}
					max={50}
				/>
			</Group>
			<Group spacing="sm" direction="column" grow>
				<Text mt="md">Humidity {data.humidity} %</Text>
				<Slider
					value={data.humidity}
					marks={[
						{ value: 20, label: '20%' },
						{ value: 50, label: '50%' },
						{ value: 80, label: '80%' },
					]}
				/>
			</Group>
		</Group>
	);
};

export default DhtSensorFeature;
