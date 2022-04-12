import {
	Avatar,
	Box,
	Group,
	UnstyledButton,
	Text,
	useMantineTheme,
} from '@mantine/core';
import { forwardRef } from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

const NavbarUser = forwardRef<HTMLButtonElement, { dummy?: string }>(
	({ dummy, ...others }, ref) => {
		const theme = useMantineTheme();

		return (
			<Box
				sx={{
					paddingTop: theme.spacing.sm,
					width: '100%',
					borderTop: `1px solid ${
						theme.colorScheme === 'dark'
							? theme.colors.dark[4]
							: theme.colors.gray[2]
					}`,
				}}
			>
				<UnstyledButton
					ref={ref}
					sx={{
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
					}}
					{...others}
				>
					<Group>
						<Avatar src={''} radius="xl" />
						<Box sx={{ flex: 1 }}>
							<Text size="sm" weight={500}>
								Hello
							</Text>
							<Text color="dimmed" size="xs">
								World
							</Text>
						</Box>

						{theme.dir === 'ltr' ? (
							<ChevronRight size={18} />
						) : (
							<ChevronLeft size={18} />
						)}
					</Group>
				</UnstyledButton>
			</Box>
		);
	}
);

export default NavbarUser;
