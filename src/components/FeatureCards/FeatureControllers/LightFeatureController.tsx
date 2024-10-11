import { ActionIcon, ColorInput, Group, Switch, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDidUpdate, useToggle } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { Check, MoonStars, Refresh, Sun, X } from 'tabler-icons-react';
import { useStoreActions } from '../../../store';
import { FeatureInterface } from '../../../store/data';

export interface LightFeatureControllerProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

const LightFeatureController = ({
	feature,
	onValues,
}: LightFeatureControllerProps) => {
	const notifications = useNotifications();
	const data: {} = feature.data as any;
	const execute = useStoreActions((actions) => actions.data.execute);
	const [toggleValue, toggle] = useToggle(data.state, [true, false]);
	const [debounced] = useDebouncedValue(toggleValue, onValues ? 10 : 1000);

	useEffect(() => {
		onValues?.({
			state: debounced,
		});
	}, []);

	useDidUpdate(async () => {
		if (onValues) {
			onValues({
				state: debounced,
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
				state: debounced,
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
				message: 'Switched successfully',
			});
		}
	}, [debounced]);

	return (
		<>
			<Switch
				size="md"
				label="Power"
				checked={toggleValue}
				onChange={() => {
					toggle();
				}}
			/>
		</>
	);
};

export default LightFeatureController;
