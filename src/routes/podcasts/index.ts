import { queryPurrfectStreamByReleased } from '@services/notion.server';

export async function get({ params }: { params: any }) {
	const posts = await queryPurrfectStreamByReleased(10000);

	if (posts) {
		return {
			body: { posts }
		};
	}

	return {
		status: 404
	};
}
