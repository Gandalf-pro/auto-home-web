import { ColorInput, Group, Select, Slider, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { Check, Dice, X } from 'tabler-icons-react';
import { useStoreActions } from '../../../store';
import { FeatureInterface } from '../../../store/data';
import shallowCompare from '../../../utils/shallowCompare';

export interface ALedFeatureProps {
	feature: FeatureInterface & { device: string; room: string };
	onValues?: (values: any) => void;
}

export enum AcModes {
	kAnimationModeNone,
	kAnimationModeStatic,
	kAnimationModeRainbow,
	kAnimationModeFire,
	kAnimationModeFade,
	kAnimationModeBreathe,
	kAnimationModeBreathFade,
	kAnimationModeColorWipe,
	kAnimationModeTheaterChase,
	kAnimationModeTheaterChaseRainbow,
	kAnimationModeRunningLights,
	kAnimationModeTwinkle,
	kAnimationModeTwinkleRainbow,
}

const acModesArr = Object.values(AcModes);

const generateRandomColor = () =>
	`#${Math.floor(Math.random() * 16777215).toString(16)}`;

export interface ALedFeatureDataInterface {
	animationMode: number | string;
	speed: number;
	brightness: number;
	startColor: string;
	endColor: string;
}

const animationModeSelectorData = [
	{ value: String(AcModes.kAnimationModeNone), label: 'Close' },
	{ value: String(AcModes.kAnimationModeStatic), label: 'Static' },
	{ value: String(AcModes.kAnimationModeFade), label: 'Fade' },
	{ value: String(AcModes.kAnimationModeRainbow), label: 'Rainbow' },
	{ value: String(AcModes.kAnimationModeFire), label: 'Fire' },
	{ value: String(AcModes.kAnimationModeBreathe), label: 'Breathe' },
	{ value: String(AcModes.kAnimationModeBreathFade), label: 'Breath Fade' },
	{ value: String(AcModes.kAnimationModeColorWipe), label: 'Color Wipe' },
	{
		value: String(AcModes.kAnimationModeTheaterChase),
		label: 'Theater Chase',
	},
	{
		value: String(AcModes.kAnimationModeTheaterChaseRainbow),
		label: 'Theater Chase Rainbow',
	},
	{
		value: String(AcModes.kAnimationModeRunningLights),
		label: 'Running Lights',
	},
	{ value: String(AcModes.kAnimationModeTwinkle), label: 'Twinkle' },
	{
		value: String(AcModes.kAnimationModeTwinkleRainbow),
		label: 'Twinkle Rainbow',
	},
];

const ALedFeature = ({ feature, onValues }: ALedFeatureProps) => {
	const notifications = useNotifications();
	const data: ALedFeatureDataInterface = feature.data as any;
	const execute = useStoreActions((actions) => actions.data.execute);
	const form = useForm<ALedFeatureDataInterface>({
		initialValues: {
			animationMode: String(data.animationMode),
			speed: data.speed,
			brightness: data.brightness,
			startColor: data.startColor,
			endColor: data.endColor,
		},
	});
	useEffect(() => {
		if (onValues) {
			onValues(form.values);
		}
	}, []);

	const [debounced] = useDebouncedValue(form.values, onValues ? 10 : 150);
	useDidUpdate(async () => {
		console.log('debounced', debounced);

		if (onValues) {
			onValues(debounced);
			return;
		}
		// Not do anything if its the same
		if (shallowCompare(data, debounced)) {
			return;
		}
		const copy = {
			...debounced,
			animationMode: Number(debounced.animationMode),
		};
		if (!acModesArr.includes(copy.animationMode)) {
			copy.animationMode = 0;
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
			data: copy,
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

	const isLightOn =
		form.values.animationMode !== String(AcModes.kAnimationModeNone);

	return (
		<form>
			<Group>
				<Switch
					checked={isLightOn}
					onChange={(event) => {
						const checked = event.currentTarget.checked;
						if (checked) {
							form.setFieldValue(
								'animationMode',
								String(AcModes.kAnimationModeStatic)
							);
							if (form.values.startColor === '#000000') {
								form.setFieldValue(
									'startColor',
									generateRandomColor()
								);
							}
						} else {
							form.setFieldValue(
								'animationMode',
								String(AcModes.kAnimationModeNone)
							);
						}
					}}
				/>
				<Select
					placeholder="Mode"
					data={animationModeSelectorData as any}
					{...form.getInputProps('animationMode')}
				/>
			</Group>
			<Group grow my="sm">
				<ColorInput
					placeholder="Start color"
					rightSection={
						<Dice
							size={16}
							style={{
								cursor: 'pointer',
								transition: 'transform 0.2s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
							onClick={() =>
								form.setFieldValue(
									'startColor',
									generateRandomColor()
								)
							}
						/>
					}
					{...form.getInputProps('startColor')}
				/>
				<ColorInput
					placeholder="End color"
					rightSection={
						<Dice
							size={16}
							style={{
								cursor: 'pointer',
								transition: 'transform 0.2s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
							onClick={() =>
								form.setFieldValue(
									'endColor',
									generateRandomColor()
								)
							}
						/>
					}
					{...form.getInputProps('endColor')}
				/>
			</Group>
			<Text mt="md">Speed</Text>
			<Slider
				label={(value) => `${value} %`}
				min={0}
				max={100}
				{...form.getInputProps('speed')}
				marks={[
					{ value: 20, label: '20%' },
					{ value: 50, label: '50%' },
					{ value: 80, label: '80%' },
				]}
			/>
			<Text mt="md">Brightness</Text>
			<Slider
				label={(value) => `${Math.round((value / 255) * 100)} %`}
				min={0}
				max={255}
				{...form.getInputProps('brightness')}
				marks={[
					{ value: 255 * 0.2, label: '20%' },
					{ value: 255 * 0.5, label: '50%' },
					{ value: 255 * 0.8, label: '80%' },
				]}
			/>
			{/* <NumberInput
					min={1}
					max={255}
					placeholder="Speed"
					label="Speed"
					{...form.getInputProps('speed')}
				/>
				<NumberInput
					min={1}
					max={255}
					placeholder="Brightness"
					label="Brightness"
					{...form.getInputProps('brightness')}
				/> */}
		</form>
	);
};

export default ALedFeature;
