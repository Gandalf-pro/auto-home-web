import {
	ActionIcon,
	Group,
	TextInput,
	TextInputProps,
	useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'tabler-icons-react';
import { useStoreActions, useStoreState } from '../store';

const FeatureSearch = (props: TextInputProps) => {
	const theme = useMantineTheme();
	const modals = useModals();
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState('');
	const featureQuery = useStoreState((state) => state.data.featureQuery);
	const setFeatureQuery = useStoreActions(
		(actions) => actions.data.setFeatureQuery
	);

	const [debounced] = useDebouncedValue(value, 500);
	useDidUpdate(() => {
		setFeatureQuery(debounced);
	}, [debounced]);

	useEffect(() => {
		if (featureQuery && value !== featureQuery) {
			setValue(featureQuery);
		}
	}, [featureQuery]);

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
				placeholder="Search feature"
				rightSectionWidth={42}
				{...props}
			/>
		</Group>
	);
};

export default FeatureSearch;
