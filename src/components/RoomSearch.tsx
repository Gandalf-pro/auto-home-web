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
import { useStoreActions, useStoreState } from '../store';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';

const RoomSearch = (props: TextInputProps) => {
	const theme = useMantineTheme();
	const modals = useModals();
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState('');
	const roomQuery = useStoreState((state) => state.data.roomQuery);
	const setRoomQuery = useStoreActions(
		(actions) => actions.data.setRoomQuery
	);

	const [debounced] = useDebouncedValue(value, 500);
	useDidUpdate(() => {
		setRoomQuery(debounced);
	}, [debounced]);

	useEffect(() => {
		if (roomQuery && value !== roomQuery) {
			setValue(roomQuery);
		}
	}, [roomQuery]);

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
				placeholder="Search rooms"
				rightSectionWidth={42}
				{...props}
			/>
		</Group>
	);
};

export default RoomSearch;
