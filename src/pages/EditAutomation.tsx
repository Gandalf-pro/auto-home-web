import {
	Alert,
	Button,
	Group,
	NumberInput,
	Tabs,
	TextInput,
} from '@mantine/core';
import { formList, useForm } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	AlertCircle,
	Check,
	CornerUpLeftDouble,
	CornerUpRightDouble,
	DeviceFloppy,
	X,
} from 'tabler-icons-react';
import ActionTab from '../components/Automations/Modal/ActionTab';
import ConditionsTab from '../components/Automations/Modal/ConditionsTab';
import {
	createAutomation,
	updateAutomation,
} from '../services/automationsService';
import { useStoreActions, useStoreState } from '../store';
import {
	AutomationAction,
	AutomationJson,
	conditionExpressionType,
} from '../types/Automations';

function validateConditionExpression(val: conditionExpressionType) {
	// Check parenthesis count
	let openCount = 0;
	let closeCount = 0;
	if (!val.length) return 'No data';
	for (let i = val.length - 1; i >= 0; i--) {
		const element = val[i];
		if (element === '(') {
			openCount++;
			break;
		}
		if (element === ')') {
			closeCount++;
			break;
		}
	}
	if (closeCount !== openCount) return 'Wrong amount of parathesis';
	return null;
}
function validateAction(val: AutomationAction) {
	if (!val.featureUrl) return 'Action not set';
	if (!Object.keys(val.data).length) return 'Action data not selected';
	return null;
}

const EditAutomation = () => {
	const navigate = useNavigate();
	const notifications = useNotifications();
	const { id } = useParams();
	const creating = id === 'new';

	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState<number>(0);
	const data = useStoreState((state) => state.data.data);
	const automations = useStoreState((state) => state.automations.automations);
	const getDataThunk = useStoreActions(
		(actions) => actions.data.getDataThunk
	);
	const getAutomationsThunk = useStoreActions(
		(actions) => actions.automations.getAutomationsThunk
	);

	const roomData = automations?.[id!];

	const form = useForm<AutomationJson>({
		initialValues:
			creating || !roomData
				? {
						name: '',
						condition: {},
						action: {
							featureUrl: '',
							data: {},
						},
						conditionExpression: formList([]),
				  }
				: {
						...roomData,
						conditionExpression: formList(
							roomData.conditionExpression ?? []
						),
				  },
		validate: {
			name: (val) =>
				val.length < 3 ? 'Name must be at least 3 charecter' : null,
			conditionExpression: (val) =>
				val.length ? null : 'Need some condition',
		},
	});

	useEffect(() => {
		if (!data) {
			getDataThunk();
		}
		if (!automations && !creating) {
			getAutomationsThunk();
		}
	}, []);

	const handleSubmit = async (values: typeof form.values) => {
		const conditionExpressionError = validateConditionExpression(
			values.conditionExpression
		);
		if (conditionExpressionError) {
			form.setFieldError('conditionExpression', conditionExpressionError);
			return;
		}
		const actionError = validateAction(values.action);
		if (actionError) {
			form.setFieldError('action', actionError);
			return;
		}
		setLoading(true);
		let res;
		if (creating) {
			res = await createAutomation(values);
		} else {
			res = await updateAutomation(values);
		}
		if (res.type === 'error') {
			// Error toast
			notifications.showNotification({
				color: 'red',
				icon: <X />,
				title: 'Error',
				message: res.message || 'Error during automation upload',
			});
		} else {
			notifications.showNotification({
				icon: <Check />,
				title: 'Success',
				message: 'Succesfully saved automation',
			});
			navigate('/automations');
			return;
		}

		setLoading(false);
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Group
				position="apart"
				sx={(styles) => ({ alignItems: 'flex-end' })}
			>
				<TextInput
					styles={{ root: { flexGrow: '1 !important' } }}
					label="Name"
					placeholder="Automation name"
					required
					{...form.getInputProps('name')}
				/>
				<NumberInput
					label="Timeout in minutes"
					placeholder="10 minutes"
					min={0}
					{...form.getInputProps('timeout')}
				/>
				<Button
					disabled={loading}
					leftIcon={<DeviceFloppy />}
					type="submit"
					color="green"
				>
					Save
				</Button>
			</Group>
			<Tabs mb="sm" grow onTabChange={(val) => setTab(val)}>
				<Tabs.Tab
					label="Condition"
					icon={<CornerUpLeftDouble size={14} />}
				></Tabs.Tab>
				<Tabs.Tab
					label="Action"
					icon={<CornerUpRightDouble size={14} />}
				></Tabs.Tab>
			</Tabs>
			<ConditionsTab form={form} hidden={tab !== 0} />
			<ActionTab form={form} hidden={tab !== 1} />
			{form.errors.action && (
				<Alert
					onClose={() => {
						form.clearFieldError('action');
					}}
					withCloseButton
					mt="sm"
					icon={<AlertCircle />}
					title="Action error!"
					color="red"
				>
					{form.errors.action}
				</Alert>
			)}
			{form.errors.conditionExpression && (
				<Alert
					onClose={() => {
						form.clearFieldError('conditionExpression');
					}}
					withCloseButton
					mt="sm"
					icon={<AlertCircle />}
					title="Condition error!"
					color="red"
				>
					{form.errors.conditionExpression}
				</Alert>
			)}
		</form>
	);
};

export default EditAutomation;
