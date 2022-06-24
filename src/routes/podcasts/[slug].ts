import { getPurrfectStreamPageHTML, getPurrfectStreamPageMarkdown } from '@services/notion.server';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }: { params: { slug: string } }) {
	// `params.slug` comes from [slug].ts
	const post = await getPurrfectStreamPageHTML(params.slug);

	if (post) {
		return {
			body: { post }
		};
	}

	return {
		status: 404
	};
}
