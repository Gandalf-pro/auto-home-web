import { Action, action, thunk, Thunk } from 'easy-peasy';
import { ExecuteData, executeReq, getData } from '../services/dataService';

export interface FeatureInterface {
	name: string;
	type: string;
	data: { [x: string]: any };
}

export interface RoomInterface {
	[deviceName: string]: {
		name: string;
		room: string;
		features: FeatureInterface[];
	};
}

export interface DataInterface {
	[roomName: string]: RoomInterface;
}

export interface DataModal {
	data: null | DataInterface;
	roomQuery: string | null;
	featureQuery: string | null;
	setData: Action<DataModal, DataInterface | null>;
	setRoomQuery: Action<DataModal, string | null>;
	setFeatureQuery: Action<DataModal, string | null>;
	upsertData: Action<DataModal, ExecuteData>;
	getDataThunk: Thunk<DataModal>;
	execute: Thunk<DataModal, ExecuteData>;
}

const data: DataModal = {
	data: null,
	roomQuery: null,
	featureQuery: null,
	setData: action((state, payload) => {
		state.data = payload;
	}),
	setRoomQuery: action((state, payload) => {
		state.roomQuery = payload;
	}),
	setFeatureQuery: action((state, payload) => {
		state.featureQuery = payload;
	}),
	upsertData: action((state, payload) => {
		const tmp = state.data;
		if (!tmp || !tmp[payload.room] || !tmp[payload.room][payload.device])
			return;
		const fea = tmp[payload.room][payload.device].features.find(
			(el, i) => el.name === payload.feature
		);
		if (!fea) return;
		fea.data = { ...fea.data, ...payload.data };
	}),
	getDataThunk: thunk(async (actions, payload) => {
		const tmp = await getData();
		if (tmp.type !== 'error') {
			actions.setData(tmp.data);
		}
		return tmp;
	}),
	execute: thunk(async (actions, payload) => {
		const tmp = await executeReq(payload);
		if (tmp.type !== 'error') {
			// Change the specified data
			actions.upsertData(payload);
		}
		return tmp;
	}),
};

export default data;
