import { ActionIcon, ColorInput, Group, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDidUpdate, useToggle } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { Check, MoonStars, Refresh, Sun, X } from 'tabler-icons-react';
import { useStoreActions } from '../../../store';
import { FeatureInterface } from '../../../store/data';

export interface LedFeatureControllerProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

export interface LedDataInterface {
	r: number;
	g: number;
	b: number;
}

const randomColor = () =>
	`#${Math.floor(Math.random() * 16777215).toString(16)}`;

function hexToRgb(hex: string) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

function rgbToHex(r: number, g: number, b: number) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isOn(r: number, g: number, b: number) {
	return r > 0 || g > 0 || b > 0;
}

const LedFeatureController = ({
	feature,
	onValues,
}: LedFeatureControllerProps) => {
	const notifications = useNotifications();
	const data: LedDataInterface = feature.data as any;
	const [value, setValue] = useState(rgbToHex(data.r, data.g, data.b));
	const execute = useStoreActions((actions) => actions.data.execute);
	const [toggleValue, toggle] = useToggle(isOn(data.r, data.g, data.b), [
		true,
		false,
	]);
	const [debounced] = useDebouncedValue(value, onValues ? 10 : 150);

	useEffect(() => {
		if (onValues) {
			const rgb = hexToRgb(debounced);
			if (!rgb) return;
			onValues({
				r: rgb.r,
				g: rgb.g,
				b: rgb.b,
			});
		}
	}, []);

	useDidUpdate(async () => {
		const rgb = hexToRgb(debounced);
		if (!rgb) return;
		if (onValues) {
			onValues({
				r: rgb.r,
				g: rgb.g,
				b: rgb.b,
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
				r: rgb.r,
				g: rgb.g,
				b: rgb.b,
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
				message: 'Leds set successfully',
			});
		}
		// Update is on value
		toggle(isOn(rgb.r, rgb.g, rgb.b));
	}, [debounced]);

	return (
		<>
			<ColorInput
				placeholder="Pick color"
				value={value}
				onChange={setValue}
				rightSection={
					<Tooltip label="Open/Close">
						<ActionIcon
							onClick={() => {
								if (toggleValue) {
									setValue('#000000');
								} else {
									setValue(randomColor());
									// setValue('#ffffff');
								}
								toggle();
							}}
						>
							{toggleValue ? (
								<MoonStars size={16} />
							) : (
								<Sun size={16} />
							)}
						</ActionIcon>
					</Tooltip>
				}
			/>
		</>
	);
};

export default LedFeatureController;
