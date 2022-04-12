import { Slider } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import { useStoreActions } from '../../../store';
import { FeatureInterface } from '../../../store/data';

export interface BlindsFeatureControllerProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

export interface BlindsDataInterface {
	blindsLevel: number;
}

const BlindsFeatureController = ({
	feature,
	onValues,
}: BlindsFeatureControllerProps) => {
	const notifications = useNotifications();
	const data: BlindsDataInterface = feature.data as any;
	const execute = useStoreActions((actions) => actions.data.execute);
	const [value, setValue] = useState(data.blindsLevel);

	useEffect(() => {
		if (onValues && value !== undefined) {
			onValues({
				blindsLevel: value,
			});
		}
	}, []);

	const onExecute = async (val: number) => {
		if (onValues) {
			onValues({
				blindsLevel: val,
			});
			return;
		}
		const notId = notifications.showNotification({
			loading: true,
			disallowClose: true,
			message: 'Executing',
		});
		// Execute it
		const res = await execute({
			room: feature.room,
			device: feature.device,
			feature: feature.name,
			data: {
				blindsLevel: val,
			},
		});
		if (res.type === 'error') {
			notifications.updateNotification(notId, {
				loading: false,
				disallowClose: false,
				color: 'red',
				icon: <X />,
				title: 'Error',
				message: res.message || 'Error during execution',
			});
		} else {
			notifications.updateNotification(notId, {
				loading: false,
				disallowClose: false,
				icon: <Check />,
				title: 'Success',
				message: 'Blinds set successfully',
			});
		}
	};
	return (
		<>
			<Slider
				label={(value) => `${value} %`}
				value={value}
				onChange={setValue}
				marks={[
					{ value: 20, label: '20%' },
					{ value: 50, label: '50%' },
					{ value: 80, label: '80%' },
				]}
				onChangeEnd={onExecute}
			/>
		</>
	);
};

export default BlindsFeatureController;
