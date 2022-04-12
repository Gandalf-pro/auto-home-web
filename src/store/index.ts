import { createStore, createTypedHooks } from 'easy-peasy';
import data, { DataModal } from './data';
import automations, { AutomationsModal } from './automations';

export interface StoreModel {
	data: DataModal;
	automations: AutomationsModal;
}

const store = createStore<StoreModel>({
	data,
	automations,
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export default store;
