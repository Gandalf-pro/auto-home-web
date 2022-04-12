import { Alert, Group, Select, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { useDidUpdate } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { useStoreActions, useStoreState } from '../../../store';
import { AutomationJson } from '../../../types/Automations';
import FeatureController from '../../FeatureCards/FeatureControllers/FeatureController';

export interface ActionTabProps {
	form: UseFormReturnType<AutomationJson>;
	hidden?: boolean;
}

const ActionTab = ({ form, hidden }: ActionTabProps) => {
	const [featureData, setFeatureData] = useState<any>();
	const [roomSelector, setRoomSelector] = useState<string | null>();
	const [deviceSelector, setDeviceSelector] = useState<string | null>();
	const [featureSelector, setFeatureSelector] = useState<string | null>();

	const data = useStoreState((state) => state.data.data);

	const roomSelectorData = useMemo(() => {
		if (!data) return [];
		return Object.keys(data).map((val) => ({
			value: val,
			label: val,
		}));
	}, [data]);
	const deviceSelectorData = useMemo(() => {
		if (!data || !roomSelector) return [];
		const room = data[roomSelector];
		return Object.keys(room).map((val) => ({
			value: val,
			label: val,
		}));
	}, [data, roomSelector]);
	const featureSelectorData = useMemo(() => {
		if (!data || !roomSelector || !deviceSelector) return [];
		const room = data[roomSelector];
		const dev = room[deviceSelector];

		return dev.features.map((val) => ({
			value: val.name,
			label: val.name,
		}));
	}, [data, roomSelector, deviceSelector]);

	const featureUrl = useMemo(() => {
		if (!roomSelector || !deviceSelector || !featureSelector) return '';
		return `${roomSelector}/${deviceSelector}/${featureSelector}`;
	}, [roomSelector, deviceSelector, featureSelector]);

	const selectedFeature = useMemo(() => {
		if (!data || !roomSelector || !deviceSelector || !featureSelector)
			return null;
		return data[roomSelector][deviceSelector].features.find(
			(val) => val.name === featureSelector
		);
	}, [data, roomSelector, deviceSelector, featureSelector]);

	useDidUpdate(() => {
		setDeviceSelector(null);
		setFeatureSelector(null);
	}, [roomSelector]);
	useDidUpdate(() => {
		setFeatureSelector(null);
	}, [deviceSelector]);

	useEffect(() => {
		if (!form.values.action) return;
		if (!form.values.action.featureUrl) return;
		if (!form.values.action.data) return;
		if (!Object.keys(form.values.action.data).length) return;
		// If we have values in the form
		const [room, device, feature] =
			form.values.action.featureUrl.split('/');
		if (!room || !device || !feature) return;
		setRoomSelector(room);
		setDeviceSelector(device);
		setFeatureSelector(feature);

		setFeatureData(form.values.action.data);
	}, [form]);

	const controllerFeatureObject: any = {
		...selectedFeature!,
		device: deviceSelector!,
		room: roomSelector!,
	};
	if (featureData) {
		controllerFeatureObject.data = featureData;
	}

	return (
		<div style={{ display: hidden ? 'none' : '' }}>
			<Group grow mb="sm">
				<Select
					label="Room"
					placeholder="Select room"
					data={roomSelectorData}
					value={roomSelector}
					onChange={setRoomSelector}
				/>
				<Select
					label="Device"
					placeholder="Select device"
					data={deviceSelectorData}
					value={deviceSelector}
					onChange={setDeviceSelector}
				/>
				<Select
					label="Feature"
					placeholder="Select feature"
					data={featureSelectorData}
					value={featureSelector}
					onChange={setFeatureSelector}
				/>
			</Group>
			{featureUrl && (
				<>
					<Text
						sx={(theme) => ({
							color:
								theme.colorScheme === 'dark'
									? theme.white
									: theme.black,
						})}
					>
						Select data
					</Text>
					<FeatureController
						feature={controllerFeatureObject}
						onValues={(val) => {
							setFeatureData(val);
							form.setFieldValue('action', {
								featureUrl,
								data: val,
							});
						}}
					/>
				</>
			)}
		</div>
	);
};

export default ActionTab;
