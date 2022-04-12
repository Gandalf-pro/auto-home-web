import {
	Card,
	Image,
	Text,
	Badge,
	Button,
	Group,
	useMantineTheme,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { ChevronRight, Door } from 'tabler-icons-react';

export interface RoomCardProps {
	deviceCount: number;
	room: string;
}

const RoomCard = ({ room, deviceCount }: RoomCardProps) => {
	const theme = useMantineTheme();
	const secondaryColor =
		theme.colorScheme === 'dark'
			? theme.colors.dark[1]
			: theme.colors.gray[7];
	return (
		<div style={{ margin: 'auto' }}>
			<Card shadow="sm" p="lg">
				<Group position="apart" style={{ marginBottom: 5 }}>
					<Group spacing="sm">
						<Door />
						<Text size="xl" weight={750} transform="capitalize">
							{room}
						</Text>
					</Group>
					<Badge color="teal" variant="outline">
						Device: {deviceCount}
					</Badge>
				</Group>

				<Button
					variant="light"
					color="blue"
					fullWidth
					rightIcon={<ChevronRight />}
					style={{ marginTop: 14 }}
					component={Link}
					to={`/room/${room}`}
				>
					Goto Room
				</Button>
			</Card>
		</div>
	);
};

export default RoomCard;
