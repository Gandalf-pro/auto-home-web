import { Grid, SimpleGrid, Stack } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo } from 'react';
import { X } from 'tabler-icons-react';
import AutomationCard from '../components/Automations/AutomationCard';
import AutomationsSearch from '../components/Automations/AutomationsSearch';
import { useStoreActions, useStoreState } from '../store';

const Automations = () => {
	const notifications = useNotifications();
	const automations = useStoreState((state) => state.automations.automations);
	const automationsQuery = useStoreState(
		(state) => state.automations.automationsQuery
	);
	const getAutomationsThunk = useStoreActions(
		(actions) => actions.automations.getAutomationsThunk
	);
	const setAutomations = useStoreActions(
		(actions) => actions.automations.setAutomations
	);
	const setAutomationsQuery = useStoreActions(
		(actions) => actions.automations.setAutomationsQuery
	);

	useEffect(() => {
		getAutomationsThunk().then((tmp: any) => {
			if (tmp.type === 'error') {
				// Error toast
				notifications.showNotification({
					color: 'red',
					icon: <X />,
					title: 'Error',
					message: tmp.message || 'Error',
				});
			}
		});

		return () => {
			setAutomationsQuery(null);
		};
	}, []);

	const automationsDiv = useMemo(() => {
		if (!automations) return [];
		let tmp = Object.values(automations);
		if (automationsQuery) {
			tmp = tmp.filter((val) => {
				console.log('automationsQuery:', automationsQuery);

				return val.name
					.toLowerCase()
					.includes(automationsQuery.toLowerCase());
			});
		}
		return tmp.map((val, i) => (
			<Grid.Col key={i} span={12} xs={6} sm={6} md={4}>
				<AutomationCard automation={val} />
			</Grid.Col>
		));
	}, [automations, automationsQuery]);

	return (
		<>
			<AutomationsSearch />
			<Grid grow align="stretch">
				{automationsDiv}
			</Grid>
		</>
	);
};

export default Automations;
