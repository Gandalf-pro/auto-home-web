import { AutomationJson } from '../types/Automations';
import { get, post } from '../utils/requests';

export async function getAutomations() {
	return get('/automations/');
}

export async function createAutomation(data: AutomationJson) {
	return post('/automations/create', data);
}
export async function updateAutomation(data: AutomationJson) {
	return post('/automations/update', data);
}
export async function deleteAutomation(data: AutomationJson) {
	return post('/automations/delete', data);
}
