import { getPurrfectStreamPageHTML, getPurrfectStreamPageMarkdown } from '@services/notion.server';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }: { params: { slug: string } }) {
	// `params.slug` comes from [slug].ts
	const item = await getPurrfectStreamPageHTML(params.slug);

	if (item) {
		return {
			body: { item }
		};
	}

	return {
		status: 404
	};
}
