import {
	ActionIcon,
	Alert,
	Box,
	Button,
	Center,
	Divider,
	Group,
	Menu,
	Paper,
	Stack,
	Text,
	Tooltip,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { useModals } from '@mantine/modals';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { Adjustments, AlertCircle, Minus, Plus } from 'tabler-icons-react';
import {
	AutomationCondition,
	AutomationJson,
} from '../../../types/Automations';

export interface ConditionsTabProps {
	form: UseFormReturnType<AutomationJson>;
	hidden?: boolean;
}

const ConditionsTab = ({ form, hidden }: ConditionsTabProps) => {
	const modals = useModals();

	const openNewModal = useCallback(() => {
		// onSave: (data: AutomationCondition) => void;
		modals.openContextModal('automationConditionSelector', {
			size: '90%',
			centered: true,
			title: 'New condition',
			innerProps: {
				onSave: (data: AutomationCondition) => {
					const tmp = {
						...form.values.condition,
						...{ [data.id]: data },
					};
					form.setFieldValue('condition', tmp);
					(form as any).addListItem('conditionExpression', data.id);
				},
			},
		});
	}, [modals, form]);
	const openSpecialModal = useCallback(() => {
		// onSave: (data: AutomationCondition) => void;
		modals.openContextModal('specialConditionSelector', {
			size: '90%',
			centered: true,
			title: 'New condition',
			innerProps: {
				onSave: (data: AutomationCondition) => {
					const tmp = {
						...form.values.condition,
						...{ [data.id]: data },
					};
					form.setFieldValue('condition', tmp);
					(form as any).addListItem('conditionExpression', data.id);
				},
			},
		});
	}, [modals, form]);
	const openEditModal = (condition: AutomationCondition) => {
		modals.openContextModal('automationConditionSelector', {
			size: '90%',
			centered: true,
			title: 'Edit condition',
			innerProps: {
				condition,
				onSave: (data: AutomationCondition) => {
					const tmp = {
						...form.values.condition,
						...{ [data.id]: data },
					};
					form.setFieldValue('condition', tmp);
				},
			},
		});
	};
	const openSpecialEditModal = useCallback(
		(condition: AutomationCondition) => {
			// onSave: (data: AutomationCondition) => void;
			modals.openContextModal('specialConditionSelector', {
				size: '90%',
				centered: true,
				title: 'Edit condition',
				innerProps: {
					condition,
					onSave: (data: AutomationCondition) => {
						const tmp = {
							...form.values.condition,
							...{ [data.id]: data },
						};
						form.setFieldValue('condition', tmp);
					},
				},
			});
		},
		[modals]
	);

	const addSymbolToExpression = (symbol: string) => {
		if (symbol.length > 2) {
			const tmp = form.values.conditionExpression;
			if (tmp.length && tmp.at(tmp.length - 1)!.length <= 2) {
				return;
			}
		}
		if (symbol === '||' || symbol === '&&') {
			const tmp = form.values.conditionExpression;
			if (!tmp.length) return;
			if (tmp.at(tmp.length - 1)!.length <= 2) {
				return;
			}
		}
		// if (symbol === ')') {
		// 	// Count the parathesis
		// 	let openCount = 0;
		// 	let closeCount = 0;
		// 	const tmp = form.values.conditionExpression;
		// 	if (!tmp.length) return;
		// 	for (let i = tmp.length-1; i >= 0; i--) {
		// 		const element = tmp[i];
		// 		if (element === '(') {
		// 			openCount++;
		// 			break;
		// 		}
		// 		if (element === ')') {
		// 			closeCount++;
		// 			break;
		// 		}
		// 	}
		// }
		(form as any).addListItem('conditionExpression', symbol);
	};

	const conditionsDiv = form.values.conditionExpression.map((val, i) => {
		const condition = val.length > 2 ? form.values.condition[val] : null;
		if (condition) {
			if (condition.type === 'feature' || !condition.type) {
				return (
					<Paper p="sm" key={i}>
						<Text weight="bold">{condition.featureUrl}</Text>
						<Group position="apart" px="sm">
							<Text color="dimmed">
								{condition.dataKey} {condition.operation}{' '}
								{condition.value}
							</Text>
							<Tooltip label="Edit">
								<ActionIcon
									onClick={() => {
										openEditModal(condition);
									}}
								>
									<Adjustments />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Paper>
				);
			} else if (condition.type === 'time') {
				return (
					<Paper p="sm" key={i}>
						<Text weight="bold" transform="capitalize">
							{condition.type}
						</Text>
						<Group position="apart" px="sm">
							<Text color="dimmed">
								{condition.dataKey} {condition.operation}{' '}
								{condition.dataKey === 'now'
									? dayjs(condition.value).format(
											'DD,MMM YYYY'
									  )
									: dayjs(condition.value).format('HH:mm')}
							</Text>
							<Tooltip label="Edit">
								<ActionIcon
									onClick={() => {
										openSpecialEditModal(condition);
									}}
								>
									<Adjustments />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Paper>
				);
			}
		}

		return (
			<Paper p="sm" key={i}>
				<Center style={{ height: '100%' }}>
					<Text weight="bold" size="xl">
						{val}
					</Text>
				</Center>
			</Paper>
		);
	});

	return (
		<div style={{ display: hidden ? 'none' : '' }}>
			<Group align="stretch">
				<Stack>
					<Menu
						control={
							<Button>
								<Plus />
							</Button>
						}
					>
						<Menu.Label>Type</Menu.Label>
						<Menu.Item onClick={openNewModal}>Condition</Menu.Item>
						<Menu.Item onClick={openSpecialModal}>
							Special Condition
						</Menu.Item>
						<Divider />
						<Menu.Item
							onClick={() => {
								addSymbolToExpression('||');
							}}
						>
							|| - Or
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								addSymbolToExpression('&&');
							}}
						>
							{'&&'} - And
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								addSymbolToExpression('(');
							}}
						>
							( - Parentheses open
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								addSymbolToExpression(')');
							}}
						>
							) - Parentheses close
						</Menu.Item>
					</Menu>
					<Button>
						<Minus
							onClick={() => {
								const delItem =
									form.values.conditionExpression.at(-1);
								if (delItem) {
									const tmp = { ...form.values.condition };
									delete tmp[delItem];
									form.setFieldValue('condition', tmp);
								}
								form.removeListItem(
									'conditionExpression',
									form.values.conditionExpression.length - 1
								);
							}}
						/>
					</Button>
				</Stack>
				{conditionsDiv}
			</Group>
		</div>
	);
};

export default ConditionsTab;
