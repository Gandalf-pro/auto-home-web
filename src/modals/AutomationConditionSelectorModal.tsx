import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';
import { useMemo, useState } from 'react';
import { useStoreState } from '../store';
import { AutomationCondition } from '../types/Automations';
import { v4 as uuidv4 } from 'uuid';

export const operationData = [
	{ value: '<', label: '<' },
	{ value: '<=', label: '<=' },
	{ value: '>', label: '>' },
	{ value: '>=', label: '>=' },
	{ value: '==', label: '==' },
	{ value: '===', label: '===' },
	{ value: '!=', label: '!=' },
	{ value: '!==', label: '!==' },
];

const AutomationConditionSelectorModal = ({
	context,
	id,
	innerProps,
}: ContextModalProps<{
	condition?: AutomationCondition;
	onSave: (data: AutomationCondition) => void;
}>) => {
	const { condition, onSave } = innerProps;
	const creating = !condition;

	const [operation, setOperation] = useState<string | null | undefined>(
		creating ? null : condition.operation
	);
	const [dataKey, setDataKey] = useState<string | null | undefined>(
		creating ? null : condition.dataKey
	);
	const [valueExpected, setValueExpected] = useState<
		string | undefined | undefined
	>(creating ? null : condition.value);
	const [roomSelector, setRoomSelector] = useState<string | null>(
		creating ? null : condition.featureUrl?.split('/')[0]
	);
	const [deviceSelector, setDeviceSelector] = useState<string | null>(
		creating ? null : condition.featureUrl?.split('/')[1]
	);
	const [featureSelector, setFeatureSelector] = useState<string | null>(
		creating ? null : condition.featureUrl?.split('/')[2]
	);

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

	const featureAvailableData = useMemo(() => {
		if (!selectedFeature) return [];
		return Object.keys(selectedFeature.data).map((val) => ({
			value: val,
			label: val,
		}));
	}, [selectedFeature]);

	useDidUpdate(() => {
		setDeviceSelector(null);
		setFeatureSelector(null);
		// Other
		setDataKey(null);
		setOperation(null);
		setValueExpected('');
	}, [roomSelector]);
	useDidUpdate(() => {
		setFeatureSelector(null);
		// Other
		setDataKey(null);
		setOperation(null);
		setValueExpected('');
	}, [deviceSelector]);

	useDidUpdate(() => {
		// Other
		setDataKey(null);
		setOperation(null);
		setValueExpected('');
	}, [featureSelector]);

	const save = () => {
		if (!featureUrl || !dataKey || !operation || !valueExpected) return;
		onSave({
			id: condition?.id ?? uuidv4(),
			dataKey,
			featureUrl,
			value: valueExpected,
			operation: operation as any,
		});
		context.closeModal(id);
	};

	return (
		<Box p={6} px="sm">
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
				<Group grow>
					<Select
						label="Data key"
						placeholder="Select data key"
						data={featureAvailableData}
						value={dataKey}
						onChange={setDataKey}
					/>
					<Select
						label="Operation"
						placeholder="Select operation"
						data={operationData}
						value={operation}
						onChange={setOperation}
					/>
					<TextInput
						label="Value"
						placeholder="Enter value"
						onChange={(e) =>
							setValueExpected(e.currentTarget.value)
						}
						value={valueExpected}
					/>
				</Group>
			)}
			<Button mt="md" fullWidth onClick={save}>
				Save
			</Button>
		</Box>
	);
};

export default AutomationConditionSelectorModal;
