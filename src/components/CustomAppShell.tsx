import {
	ActionIcon,
	AppShell,
	Burger,
	Button,
	TextInput,
	Group,
	Header,
	MediaQuery,
	Menu,
	Navbar,
	Paper,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import CustomRouter from './CustomRouter';
import NavbarCustomLink from './NavbarLink';
import {
	ArrowLeft,
	ArrowRight,
	BuildingFactory,
	Calendar,
	Download,
	Home,
	Logout,
	MoonStars,
	Search,
	Settings,
	Star,
	Sun,
	User,
	Users,
	UserSearch,
} from 'tabler-icons-react';
import NavbarUser from './NavbarUser';
import { Link } from 'react-router-dom';
import { useStoreActions } from '../store';

const CustomAppShell = () => {
	const [opened, setOpened] = useState(false);
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();

	return (
		<AppShell
			navbarOffsetBreakpoint="sm"
			padding="md"
			fixed
			navbar={
				<Navbar
					hiddenBreakpoint="sm"
					p="md"
					hidden={!opened}
					width={{ base: 280 }}
				>
					<Navbar.Section>{/* Header with logo */}</Navbar.Section>
					<Navbar.Section grow mt="md">
						<NavbarCustomLink
							icon={<Home size={16} />}
							color="blue"
							label="Home"
							to="/"
						/>
						<NavbarCustomLink
							icon={<BuildingFactory size={16} />}
							color="blue"
							label="Automations"
							to="/automations"
						/>
					</Navbar.Section>
				</Navbar>
			}
			header={
				<Header height={70} p="md">
					{/* Handle other responsive styles with MediaQuery component or createStyles function */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
						}}
					>
						<MediaQuery
							largerThan="sm"
							styles={{ display: 'none' }}
						>
							<Burger
								opened={opened}
								onClick={() => setOpened((o) => !o)}
								size="sm"
								mr="xl"
							/>
						</MediaQuery>

						<Group
							position="apart"
							noWrap
							style={{ width: '100%' }}
						>
							<MediaQuery
								smallerThan="sm"
								styles={{ display: 'none' }}
							>
								<Paper>
									<Text size="xl" weight="bold">
										Auto Home
									</Text>
								</Paper>
							</MediaQuery>
							{/* Search */}
							<ActionIcon
								variant="default"
								onClick={() => toggleColorScheme()}
								size={30}
							>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
					</div>
				</Header>
			}
			styles={(theme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}
		>
			<CustomRouter />
		</AppShell>
	);
};

export default CustomAppShell;
