import {
	Box,
	Center,
	Group,
	NumberInput,
	SegmentedControl,
	Select,
	Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo } from 'react';
import { Bolt, BoltOff, Check, X } from 'tabler-icons-react';
import { useStoreActions } from '../../../store';
import { FeatureInterface } from '../../../store/data';
import shallowCompare from '../../../utils/shallowCompare';

export interface AcFeatureControllerProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

export const FanModes = {
	auto: '0',
	low: '1',
	med: '2',
	high: '3',
};
export const ReverseFanModes = {
	'1': 'auto',
	'5': 'low',
	'9': 'med',
	'11': 'high',
};
export const AcModes = {
	auto: '0',
	cool: '1',
	dry: '2',
	fan: '3',
	heat: '4',
};
export const ReverseAcModes = {
	'0': 'auto',
	'1': 'cool',
	'2': 'dry',
	'3': 'fan',
	'4': 'heat',
};

export interface AcDataInterface {
	power: 0 | 1;
	temp: number;
	fan: string;
	mode: string;
	swing: 0 | 1;
}

const AcFeatureController = ({
	feature,
	onValues,
}: AcFeatureControllerProps) => {
	const notifications = useNotifications();
	const data: AcDataInterface = feature.data as any;
	const execute = useStoreActions((actions) => actions.data.execute);
	const form = useForm<AcDataInterface>({
		initialValues: {
			power: Number(data.power) as 0 | 1,
			temp: Number(data.temp),
			fan: data.fan,
			mode: data.mode,
			swing: Number(data.swing) as 0 | 1,
		},
	});
	useEffect(() => {
		if (onValues) {
			onValues(form.values);
		}
	}, []);

	const [debounced] = useDebouncedValue(form.values, onValues ? 10 : 1500);
	useDidUpdate(async () => {
		if (onValues) {
			onValues(debounced);
			return;
		}
		// Not do anything if its the same
		if (shallowCompare(data, debounced)) {
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
			data: debounced,
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
				message: 'Ac set successfully',
			});
		}
	}, [debounced]);

	const acModesSelectData = useMemo(() => {
		return [
			{ value: AcModes.auto, label: 'Auto' },
			{ value: AcModes.cool, label: 'Cool' },
			{ value: AcModes.heat, label: 'Heat' },
			{ value: AcModes.fan, label: 'Fan' },
			{ value: AcModes.dry, label: 'Dry' },
		];
	}, []);
	const fanModesSelectData = useMemo(() => {
		return [
			{ value: FanModes.auto, label: 'Auto' },
			{ value: FanModes.low, label: 'Low' },
			{ value: FanModes.med, label: 'Med' },
			{ value: FanModes.high, label: 'High' },
		];
	}, []);

	return (
		<form>
			<Group>
				<Switch
					size="md"
					label="Power"
					{...form.getInputProps('power')}
				/>
				<Switch
					size="md"
					label="Swing"
					{...form.getInputProps('swing')}
				/>
			</Group>
			<Group grow>
				<NumberInput
					max={30}
					min={18}
					placeholder="Temp"
					label="Temp"
					{...form.getInputProps('temp')}
				/>
				<Select
					label="Mode"
					data={acModesSelectData as any}
					{...form.getInputProps('mode')}
				/>
				<Select
					label="Fan"
					data={fanModesSelectData as any}
					{...form.getInputProps('fan')}
				/>
			</Group>
		</form>
	);
};

export default AcFeatureController;
