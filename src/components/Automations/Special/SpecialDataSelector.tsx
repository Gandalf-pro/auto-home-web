import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { useMemo } from 'react';
import { AutomationCondition } from '../../../types/Automations';
import TimeDataSelector from './TimeDataSelector';

export interface SpecialDataSelector {
	form: UseFormReturnType<AutomationCondition>;
}

const SpecialDataSelector = ({ form }: SpecialDataSelector) => {
	const spe = useMemo(() => {
		switch (form.values.type) {
			case 'time':
				return <TimeDataSelector form={form} />;
			default:
				return <div>Type not supported</div>;
		}
	}, [form, form.values]);
	return spe;
};
export default SpecialDataSelector;
