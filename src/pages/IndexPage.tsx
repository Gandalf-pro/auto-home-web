import { Grid, LoadingOverlay } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo } from 'react';
import { X } from 'tabler-icons-react';
import RoomCard from '../components/RoomCard';
import RoomSearch from '../components/RoomSearch';
import { useStoreActions, useStoreState } from '../store';

const IndexPage = () => {
	const data = useStoreState((state) => state.data.data);
	const roomQuery = useStoreState((state) => state.data.roomQuery);
	const getData = useStoreActions((actions) => actions.data.getDataThunk);
	const setData = useStoreActions((actions) => actions.data.setData);
	const setRoomQuery = useStoreActions(
		(actions) => actions.data.setRoomQuery
	);
	const notifications = useNotifications();

	useEffect(() => {
		getData().then((tmp: any) => {
			if (tmp.type === 'error') {
				// Error toast
				notifications.showNotification({
					color: 'red',
					icon: <X />,
					title: 'Error',
					message: tmp.message || 'Error during speciality upload',
				});
			}
		});

		return () => {
			// setData(null);
			setRoomQuery(null);
		};
	}, []);

	const rooms = useMemo(() => {
		if (!data) return null;
		let tmp = Object.entries(data);
		if (roomQuery) {
			tmp = tmp.filter(([key, room]) => {
				return key.toLowerCase().includes(roomQuery.toLowerCase());
			});
		}
		return tmp.map(([key, obj], i) => {
			const deviceCount = Object.keys(obj).length;
			return (
				<Grid.Col span={6} key={i}>
					<RoomCard room={key} deviceCount={deviceCount} />
				</Grid.Col>
			);
		});
	}, [data, roomQuery]);

	if (!data) {
		return <LoadingOverlay visible />;
	}

	return (
		<>
			<RoomSearch />
			<Grid grow>{rooms}</Grid>
		</>
	);
};

export default IndexPage;
