import { Text } from '@mantine/core';
import { useMemo } from 'react';
import { FeatureInterface } from '../../../store/data';
import AcFeatureController from './AcFeatureController';
import BlindsFeatureController from './BlindsFeatureController';
import LedFeatureController from './LedFeatureController';
import LightLevelFeature from './LightLevelFeature';

export interface FeatureControllerProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

const FeatureController = ({ feature, onValues }: FeatureControllerProps) => {
	const selectedFeature = useMemo(() => {
		switch (feature.type) {
			case 'AcFeature':
				return (
					<AcFeatureController
						feature={feature}
						onValues={onValues}
					/>
				);
			case 'BlindsFeature':
				return (
					<BlindsFeatureController
						feature={feature}
						onValues={onValues}
					/>
				);
			case 'LedFeature':
				return (
					<LedFeatureController
						feature={feature}
						onValues={onValues}
					/>
				);
			case 'LightLevelFeature':
				return <LightLevelFeature feature={feature} />;
			default:
				return <Text>Feature type not supported</Text>;
		}
	}, [feature]);
	return selectedFeature;
};

export default FeatureController;
