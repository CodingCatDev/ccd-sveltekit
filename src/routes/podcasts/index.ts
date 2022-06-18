import { queryPurrfectStreamByReleased } from '@services/notion.server';

export async function get({ params }: { params: any }) {
	const raw = await queryPurrfectStreamByReleased(10000);

	if (raw && raw.results) {
		return {
			body: { posts: raw.results }
		};
	}

	return {
		status: 404
	};
}
