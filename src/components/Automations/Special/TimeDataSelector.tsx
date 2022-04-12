import { Group, NumberInput, Select, TextInput } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { operationData } from '../../../modals/AutomationConditionSelectorModal';
import { AutomationCondition } from '../../../types/Automations';

const dataKeyDatas = [
	{
		value: 'now',
		label: 'Now date',
	},
	{
		value: 'now-hour',
		label: 'Now hour',
	},
];

export interface TimeDataSelectorProps {
	form: UseFormReturnType<AutomationCondition>;
}

const TimeDataSelector = ({ form }: TimeDataSelectorProps) => {
	useEffect(() => {
		if (
			typeof form.values.value === 'string' &&
			dayjs(form.values.value).isValid()
		) {
			form.setFieldValue('value', dayjs(form.values.value).toDate());
		}
	}, []);

	const valueSelector = useMemo(() => {
		if (
			typeof form.values.value === 'string' &&
			form.values.value.length > 0
		)
			return null;
		const props = {
			label: 'Value',
			placeholder: 'Enter value',
			...form.getInputProps('value'),
		};

		switch (form.values.dataKey) {
			case 'now':
				return <DatePicker {...props} />;
			case 'now-hour':
				return <TimeInput {...props} />;
			default:
				return <TextInput {...props} />;
		}
	}, [form, form.values.dataKey, form.values.value]);

	return (
		<Group grow>
			<Select
				label="Data key"
				placeholder="Select data key"
				data={dataKeyDatas}
				{...form.getInputProps('dataKey')}
			/>
			<Select
				label="Operation"
				placeholder="Select operation"
				data={operationData}
				{...form.getInputProps('operation')}
			/>
			{valueSelector}
		</Group>
	);
};
export default TimeDataSelector;
