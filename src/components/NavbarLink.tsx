import { Group, ThemeIcon, UnstyledButton, Text } from '@mantine/core';
import { Link, NavLink } from 'react-router-dom';

interface MainLinkProps {
	icon: React.ReactNode;
	color: string;
	label: string;
	to: string;
}

const NavbarCustomLink = ({ icon, color, label, to }: MainLinkProps) => {
	// const isActive = use
	return (
		<NavLink to={to} style={{ textDecoration: 'none' }}>
			<UnstyledButton
				sx={(theme) => ({
					display: 'block',
					width: '100%',
					padding: theme.spacing.xs,
					borderRadius: theme.radius.sm,
					color:
						theme.colorScheme === 'dark'
							? theme.colors.dark[0]
							: theme.black,

					'&:hover': {
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[0],
					},
					'.active &': {
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[8]
								: theme.colors.gray[4],
						boxShadow: `inset 0px 0px 6px 1px ${
							theme.colorScheme === 'dark'
								? theme.colors.dark[9]
								: theme.colors.gray[5]
						}`,
					},
				})}
			>
				<Group>
					<ThemeIcon color={color} variant="light">
						{icon}
					</ThemeIcon>

					<Text size="sm">{label}</Text>
				</Group>
			</UnstyledButton>
		</NavLink>
	);
};

export default NavbarCustomLink;
