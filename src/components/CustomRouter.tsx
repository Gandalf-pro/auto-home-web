import { Routes, Route, Navigate } from 'react-router-dom';
import Automations from '../pages/Automations';
import EditAutomation from '../pages/EditAutomation';
import IndexPage from '../pages/IndexPage';
import RoomPage from '../pages/RoomPage';

const CustomRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<IndexPage />} />
			<Route path="/automations" element={<Automations />} />
			<Route path="/automation/:id" element={<EditAutomation />} />
			<Route path="/room/:room" element={<RoomPage />} />

			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
};

export default CustomRouter;
