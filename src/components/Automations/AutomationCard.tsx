import { Badge, Button, Card, Group, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNotifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Check,
	Pencil,
	SettingsAutomation,
	Trash,
	X,
} from 'tabler-icons-react';
import { deleteAutomation } from '../../services/automationsService';
import { useStoreActions } from '../../store';
import { AutomationJson } from '../../types/Automations';

export interface AutomationCardProps {
	automation: AutomationJson;
}

const AutomationCard = ({ automation }: AutomationCardProps) => {
	const [loading, setLoading] = useState(false);
	const modals = useModals();
	const getAutomationsThunk = useStoreActions(
		(actions) => actions.automations.getAutomationsThunk
	);
	const notifications = useNotifications();
	const openDeleteModal = () =>
		modals.openConfirmModal({
			title: 'Delete automation',
			centered: true,
			children: (
				<Text size="sm">
					Are you sure you want to delete this automation? This action
					is destructive and you will not be able to restore your
					data.
				</Text>
			),
			labels: { confirm: 'Delete', cancel: "No don't delete it" },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				setLoading(true);
				const tmp = await deleteAutomation(automation);
				if (tmp.type === 'error') {
					// Error toast
					notifications.showNotification({
						color: 'red',
						icon: <X />,
						title: 'Error',
						message: tmp.message || 'Error deleting automation',
					});
				} else {
					notifications.showNotification({
						icon: <Check />,
						title: 'Success',
						message: 'Deleted successfully',
					});
					getAutomationsThunk();
				}
				setLoading(false);
			},
		});
	return (
		<Card shadow="sm">
			<Group position="apart">
				<Group spacing="sm">
					<SettingsAutomation />
					<Text size="xl" weight={750} transform="capitalize">
						{automation.name}
					</Text>
				</Group>
				{automation.lastExecuted && (
					<Tooltip label="Last execution date">
						<Badge color="indigo" variant="light">
							{dayjs(automation.lastExecuted).format(
								'DD/MM HH:mm'
							)}
						</Badge>
					</Tooltip>
				)}
			</Group>
			<Group mt="sm">
				<Button
					component={Link}
					to={`/automation/${automation.id}`}
					variant="light"
					color="blue"
					style={{ flexGrow: 1 }}
					leftIcon={<Pencil size={24} />}
					disabled={loading}
				>
					Edit
				</Button>
				<Button
					disabled={loading}
					variant="light"
					color="red"
					onClick={openDeleteModal}
				>
					<Trash size={24} />
				</Button>
			</Group>
		</Card>
	);
};

export default AutomationCard;
