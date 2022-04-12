(window as any).apiUrl = '/api/v0.1';
function urlParams(query = {}) {
	const params = new URLSearchParams(query);
	return '?' + params.toString().replaceAll('null', '');
}

export async function get(url: string, params = {}) {
	try {
		const apiUrl = (window as any).apiUrl || 'http://localhost:25852';
		url += urlParams(params);
		const headers = {
			Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
		};
		const res = await fetch(`${apiUrl}${url}`, { headers });
		const resJson = await res.json();
		return resJson;
	} catch (error: any) {
		return {
			type: 'error',
			message: error.message || 'Error during get request',
		};
	}
}

export async function post(url: string, body: any = {}) {
	try {
		if (typeof body === 'object') {
			body = JSON.stringify(body);
		}
		const apiUrl = (window as any).apiUrl || 'http://localhost:25852';

		const headers = {
			Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
			'Content-Type': 'application/json',
		};
		const res = await fetch(`${apiUrl}${url}`, {
			method: 'POST',
			body,
			headers,
		});
		const resJson = await res.json();
		return resJson;
	} catch (error: any) {
		return {
			type: 'error',
			message: error.message || 'Error during post request',
		};
	}
}
