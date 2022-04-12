import { Box, Button, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDidUpdate } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SpecialDataSelector from '../components/Automations/Special/SpecialDataSelector';
import { AutomationCondition } from '../types/Automations';

const SpecialConditionSelectorModal = ({
	context,
	id,
	innerProps,
}: ContextModalProps<{
	condition?: AutomationCondition;
	onSave: (data: AutomationCondition) => void;
}>) => {
	const { condition, onSave } = innerProps;
	const creating = !condition;

	const form = useForm<AutomationCondition>({
		initialValues: {
			featureUrl: '',
			id: condition?.id ?? uuidv4(),
			operation: creating ? (null as any) : condition.operation,
			value: creating ? '' : condition.value,
			type: creating ? (null as any) : condition.type,
			dataKey: creating ? '' : condition.dataKey,
		},
	});

	const typeSelectorData = useMemo(
		() => [
			{
				value: 'time',
				label: 'Time',
			},
		],
		[]
	);

	const save = (values: typeof form.values) => {
		onSave(values);
		context.closeModal(id);
	};

	return (
		<form onSubmit={form.onSubmit(save)}>
			<Box p={6} px="sm">
				<Group grow mb="sm">
					<Select
						label="Type"
						placeholder="Select type"
						data={typeSelectorData}
						{...form.getInputProps('type')}
					/>
				</Group>
				{form.values.type && <SpecialDataSelector form={form} />}
				<Button mt="md" fullWidth type="submit">
					Save
				</Button>
			</Box>
		</form>
	);
};

export default SpecialConditionSelectorModal;
