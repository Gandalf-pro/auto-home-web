import { Slider } from '@mantine/core';
import { FeatureInterface } from '../../../store/data';

export interface LightLevelFeatureProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
	values?: any;
}

export interface LightLevelDataInterface {
	lightLevel: number;
}

const LightLevelFeature = ({ feature }: LightLevelFeatureProps) => {
	const data: LightLevelDataInterface = feature.data as any;
	return (
		<>
			<Slider
				label={(value) => `${value} %`}
				value={data.lightLevel}
				marks={[
					{ value: 20, label: '20%' },
					{ value: 50, label: '50%' },
					{ value: 80, label: '80%' },
				]}
				labelAlwaysOn
			/>
		</>
	);
};

export default LightLevelFeature;
