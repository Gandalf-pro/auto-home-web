import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomAppShell from './components/CustomAppShell';
import AutomationConditionSelectorModal from './modals/AutomationConditionSelectorModal';
import SpecialConditionSelectorModal from './modals/SpecialConditionSelectorModal';

function App() {
	const preferredColorScheme = useColorScheme();
	// const preferredColorScheme = 'dark';

	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'mantine-color-scheme',
		defaultValue: preferredColorScheme,
		// getInitialValueInEffect: true,
	});

	// const [colorScheme, setColorScheme] =
	// 	useState<ColorScheme>(preferredColorScheme);
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<Router>
			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}
			>
				<MantineProvider theme={{ colorScheme }}>
					<NotificationsProvider>
						<ModalsProvider
							modals={{
								automationConditionSelector:
									AutomationConditionSelectorModal as any,
								specialConditionSelector:
									SpecialConditionSelectorModal as any,
							}}
						>
							<CustomAppShell />
						</ModalsProvider>
					</NotificationsProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</Router>
	);
}

export default App;
