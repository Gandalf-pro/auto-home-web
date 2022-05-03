import {
	Card,
	Image,
	Text,
	Badge,
	Button,
	Group,
	useMantineTheme,
	ActionIcon,
	Tooltip,
	Center,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
	Adjustments,
	Bulb,
	ChevronRight,
	Devices,
	Door,
	Tool,
} from 'tabler-icons-react';
import { FeatureInterface } from '../../store/data';
import FeatureController from './FeatureControllers/FeatureController';

export interface FeatureCardProps {
	feature: FeatureInterface & { device: string; room: string };
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
	const theme = useMantineTheme();
	const secondaryColor =
		theme.colorScheme === 'dark'
			? theme.colors.dark[1]
			: theme.colors.gray[7];
	return (
		<Card shadow="sm" p="md" style={{ height: '100%' }}>
			<Group position="apart" style={{ marginBottom: 5 }}>
				<Group>
					<Tooltip label="Feature name">
						<Group spacing="xs">
							<Bulb />
							<Text size="xl" weight={750} transform="capitalize">
								{feature.name}
							</Text>
						</Group>
					</Tooltip>
					<Tooltip label="Device name">
						<Group spacing="xs">
							<Devices />
							<Text size="xl" weight={750} transform="capitalize">
								{feature.device}
							</Text>
						</Group>
					</Tooltip>
				</Group>
				{/* <Group spacing="xs">
					<Text size="xl" weight={500}>
						Device:
					</Text>
					<Tooltip label="Edit device" position="left" withArrow>
						<ActionIcon>
							<Adjustments />
						</ActionIcon>
					</Tooltip>
				</Group> */}
			</Group>
			<div
				style={{
					marginTop: theme.spacing.md,
					marginBottom: theme.spacing.md,
				}}
			>
				<FeatureController feature={feature} />
			</div>
		</Card>
	);
};

export default FeatureCard;
