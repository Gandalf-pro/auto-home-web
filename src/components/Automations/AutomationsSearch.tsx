import {
	Button,
	Group,
	useMantineTheme,
	ActionIcon,
	TextInput,
	TextInputProps,
} from '@mantine/core';
import { ArrowRight, ArrowLeft, Search, Plus } from 'tabler-icons-react';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from '../../store';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';

const AutomationsSearch = (props: TextInputProps) => {
	const theme = useMantineTheme();
	const modals = useModals();
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState('');
	const automationsQuery = useStoreState(
		(state) => state.automations.automationsQuery
	);
	const setAutomationsQuery = useStoreActions(
		(actions) => actions.automations.setAutomationsQuery
	);

	const [debounced] = useDebouncedValue(value, 500);
	useDidUpdate(() => {
		setAutomationsQuery(debounced);
	}, [debounced]);

	useEffect(() => {
		if (automationsQuery && value !== automationsQuery) {
			setValue(automationsQuery);
		}
	}, [automationsQuery]);

	return (
		<Group position="apart" style={{ marginBottom: theme.spacing.sm }}>
			<TextInput
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				style={{ flexGrow: 1 }}
				icon={<Search size={18} />}
				radius="xl"
				size="md"
				rightSection={
					<ActionIcon
						size={32}
						radius="xl"
						color={theme.primaryColor}
						variant="filled"
						type="submit"
						loading={loading}
					>
						{theme.dir === 'ltr' ? (
							<ArrowRight size={18} />
						) : (
							<ArrowLeft size={18} />
						)}
					</ActionIcon>
				}
				placeholder="Search automations"
				rightSectionWidth={42}
				{...props}
			/>
			<Button
				component={Link}
				to="/automation/new"
				onClick={() => {
					// modals.openContextModal('automation', {
					// 	size: '90%',
					// 	centered: true,
					// 	title: 'New automation',
					// 	innerProps: {},
					// });
				}}
			>
				<Plus size={16} />
				New
			</Button>
		</Group>
	);
};

export default AutomationsSearch;
