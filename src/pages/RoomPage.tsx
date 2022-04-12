import { Grid, LoadingOverlay } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { X } from 'tabler-icons-react';
import FeatureCard from '../components/FeatureCards/FeatureCard';
import FeatureSearch from '../components/FeatureSearch';
import { useStoreActions, useStoreState } from '../store';
import { FeatureInterface, RoomInterface } from '../store/data';

const RoomPage = () => {
	const navigate = useNavigate();
	const notifications = useNotifications();
	const { room } = useParams();
	const data = useStoreState((state) => state.data.data);
	const featureQuery = useStoreState((state) => state.data.featureQuery);
	const setFeatureQuery = useStoreActions(
		(actions) => actions.data.setFeatureQuery
	);
	const [roomData, setRoomData] = useState<RoomInterface | null>(null);
	const features = useMemo<
		(FeatureInterface & { device: string; room: string })[] | null
	>(() => {
		if (!roomData) return null;

		const tmp: any[] = [];
		const haha = Object.values(roomData);
		for (const val of haha) {
			val.features.map((deepVal) => {
				tmp.push({ ...deepVal, device: val.name, room });
			});
		}
		return tmp;
	}, [roomData]);

	useEffect(() => {
		return () => {
			setFeatureQuery(null);
		};
	}, []);

	useEffect(() => {
		if (!room) {
			// Error toast
			notifications.showNotification({
				color: 'red',
				icon: <X />,
				title: 'Error',
				message: 'You need a room',
			});
			return navigate('/');
		}
		if (!data) {
			// Error toast
			notifications.showNotification({
				color: 'red',
				icon: <X />,
				title: 'Error',
				message: 'There is no data',
			});
			return navigate('/');
		}
		const tmp = data[room];
		if (!tmp) {
			// Error toast
			notifications.showNotification({
				color: 'red',
				icon: <X />,
				title: 'Error',
				message: "This room doesn't exist",
			});
			return navigate('/');
		}
		setRoomData(tmp);
	}, [room, data]);

	const featuresDom = useMemo(() => {
		if (!features) return null;
		let tmp = features;
		if (featureQuery) {
			tmp = tmp.filter((val) =>
				val.name.toLowerCase().includes(featureQuery.toLowerCase())
			);
		}
		return tmp.map((val, i) => (
			<Grid.Col span={12} sm={6} key={i}>
				<FeatureCard feature={val} />
			</Grid.Col>
		));
	}, [features, featureQuery]);

	if (roomData === null) {
		return <LoadingOverlay visible />;
	}

	return (
		<>
			<FeatureSearch />
			<Grid grow align="stretch">
				{featuresDom}
			</Grid>
		</>
	);
};

export default RoomPage;
