import { Action, action, thunk, Thunk, computed } from 'easy-peasy';
import { getAutomations } from '../services/automationsService';
import { AutomationJson, AutomationsData } from '../types/Automations';

export interface AutomationsModal {
	automations: AutomationsData | null;
	automationsQuery: string | null;
	setAutomations: Action<AutomationsModal, AutomationsData | null>;
	setAutomationsQuery: Action<AutomationsModal, string | null>;
	getAutomationsThunk: Thunk<AutomationsModal>;
}

const automations: AutomationsModal = {
	automations: null,
	automationsQuery: null,
	setAutomations: action((state, payload) => {
		state.automations = payload;
	}),
	setAutomationsQuery: action((state, payload) => {
		state.automationsQuery = payload;
	}),
	getAutomationsThunk: thunk(async (actions, payload) => {
		const tmp = await getAutomations();
		if (tmp.type !== 'error') {
			actions.setAutomations(tmp.data);
		}
		return tmp;
	}),
};

export default automations;
