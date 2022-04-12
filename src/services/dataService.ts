import { get, post } from '../utils/requests';

export interface ExecuteData {
	room: string;
	device: string;
	feature: string;
	data: { [x: string]: any };
}

export async function getData() {
	return get('/data');
}

export async function executeReq({ room, device, feature, data }: ExecuteData) {
	return post(`/execute/${room}/${device}/${feature}`, data);
}
