import { Client } from '@notionhq/client';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { config } from '@services/notion';
import { NotionToMarkdown } from 'notion-to-md';
import NotionPageToHtml from 'notion-page-to-html';

// Initializing a client
const notionClient = new Client({
	auth: process.env.NOTION_TOKEN
});

const n2m = new NotionToMarkdown({ notionClient });

export enum PostType {
	post = 'post',
	tutorial = 'tutorial',
	podcast = 'podcast',
	course = 'course',
	lesson = 'lesson',
	page = 'page',
	group = 'group',
	forum = 'forum'
}

export enum AccessMode {
	open = 'open',
	free = 'free',
	closed = 'closed'
}

const formatPost = async (q: any, _type: string, preview?: boolean, list?: boolean) => {
	//Flat authors
	const authors = [];
	let post = q;

	if (q?.properties?.author_title?.rollup?.array) {
		for (const [i, a] of q?.properties?.author_title?.rollup?.array?.entries() || []) {
			const cover = q?.properties?.author_cover?.rollup?.array?.at(i)?.url;

			let photoURL = null;
			if (cover) {
				photoURL = {
					public_id: cover.split('upload/')?.at(1) ? cover.split('upload/').at(1) : cover
				};
			}
			const slug = q?.properties?.author_slug?.rollup?.array?.at(i)?.url;

			const author = {
				displayName: `${a?.title.map((t: any) => t.plain_text).join('')}`,
				photoURL,
				slug
			};
			authors.push(author);
		}
	}
	post = {
		...post,
		_id: q?.id ? q.id : null,
		title:
			_type == PostType.podcast
				? `${q.properties.Season.number}.${
						q.properties.Episode.number
				  } - ${q?.properties?.Name?.title.map((t: any) => t.plain_text).join('')}`
				: `${q?.properties?.title?.title.map((t: any) => t.plain_text).join('')}`,
		coverPhoto:
			_type == PostType.podcast
				? {
						public_id: q?.cover?.external?.url
							? q?.cover?.external?.url.split('upload/').at(1)
							: null
				  }
				: {
						public_id: q?.properties?.cover?.url
							? q?.properties?.cover.url.split('upload/')?.at(1) || q?.properties?.cover?.url
							: null
				  },
		coverVideo: q?.properties?.youtube?.url ? { url: q.properties.youtube.url } : null,
		_type,
		slug: q?.properties?.slug?.url ? q?.properties?.slug.url : null,
		excerpt: q?.properties?.excerpt?.rich_text.map((t: any) => t.plain_text).join(''),
		_createdAt: q?.properties?.start?.date?.start || q?.created_time,
		_updatedAt: q?.last_edited_time,
		authors,
		access_mode: q?.properties?.access_mode?.select?.name
			? q?.properties?.access_mode?.select?.name
			: AccessMode.closed
	};

	if (_type == 'framework' || _type == 'language') {
		post = {
			...post,
			courses_count: q?.properties?.courses_count?.rollup?.number || 0,
			tutorials_count: q?.properties?.tutorials_count?.rollup?.number || 0,
			podcasts_count: q?.properties?.podcasts_count?.rollup?.number || 0,
			posts_count: q?.properties?.posts_count?.rollup?.number || 0
		};
	}

	if (_type == PostType.podcast) {
		const sponsors: any = [];
		for (const [i, s] of q?.properties?.sponsors?.relation?.entries() || []) {
			sponsors.push({
				url: q?.properties?.sponsors_url?.rollup?.array?.at(i)?.url || null,
				coverPhoto: {
					public_id: q?.properties?.sponsors_cover?.rollup?.array?.at(i)?.url
						? q?.properties?.sponsors_cover?.rollup?.array?.at(i)?.url?.split('upload/')?.at(1) ||
						  q?.properties?.sponsors_cover?.rollup?.array?.at(i)?.url
						: null
				},
				description:
					q?.properties?.sponsors_description?.rollup?.array
						?.at(i)
						?.rich_text?.map((t: any) => t.plain_text)
						.join('') || null,
				company:
					q?.properties?.sponsors_name?.rollup?.array
						?.at(i)
						?.title?.map((t: any) => t.plain_text)
						.join('') || null
			});
		}

		post = {
			...post,
			sponsors
		};
	}

	if (_type == 'author') {
		post = {
			...post,
			_id: q?.id ? q.id : null,
			displayName: `${q?.properties?.title?.title.map((t: any) => t.plain_text).join('')}`,
			photoURL: {
				public_id: q?.properties?.cover?.url
					? q?.properties?.cover.url.split('upload/')?.at(1) || q?.properties?.cover?.url
					: null
			},
			slug: q?.properties?.slug?.url ? q?.properties?.slug.url : null
		};
	}
	return post;
};

const formatPosts = async (
	raw: QueryDatabaseResponse,
	_type: string,
	preview?: boolean,
	list?: boolean
) => {
	const results = await Promise.all(
		raw.results.map((q: any) => formatPost(q, _type, preview, list))
	);

	const post = {
		...raw,
		results
	};
	return post;
};

// Purrfect.dev

export const queryPurrfectStreamByReleased = async (
	page_size?: number,
	start_cursor?: string | null
) => {
	const raw = await notionClient.databases.query({
		database_id: config.purrfectStreamsDb,
		start_cursor: start_cursor ? start_cursor : undefined,
		page_size,
		filter: {
			and: [
				{
					property: 'slug',
					url: {
						is_not_empty: true
					}
				},
				{
					property: 'Status',
					select: {
						equals: 'Released'
					}
				},
				{
					property: 'Episode',
					number: {
						is_not_empty: true
					}
				}
			]
		},
		sorts: [
			{
				property: 'Season',
				direction: 'descending'
			},
			{
				property: 'Episode',
				direction: 'descending'
			}
		]
	});
	return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamBySlug = async (slug: string) => {
	const raw = await notionClient.databases.query({
		database_id: config.purrfectStreamsDb,
		filter: {
			and: [
				{
					property: 'slug',
					rich_text: {
						contains: slug
					}
				},
				{
					property: 'Status',
					select: {
						equals: 'Released'
					}
				},
				{
					property: 'Episode',
					number: {
						is_not_empty: true
					}
				}
			]
		},
		sorts: [
			{
				property: 'Season',
				direction: 'descending'
			},
			{
				property: 'Episode',
				direction: 'descending'
			}
		]
	});
	return await formatPosts(raw, 'podcast');
};

export const getPurrfectStreamPageMarkdown = async (slug: string) => {
	const raw = await queryPurrfectStreamBySlug(slug);
	if (!raw.results.length) {
		return null;
	}

	//Get purrfect picks
	const page = raw.results.at(0);
	if (!page) {
		return null;
	}

	let content = '';
	// Build the markdown for page

	for (const page of raw.results) {
		const blocks = await n2m.pageToMarkdown(page.id);
		content += n2m.toMarkdownString(blocks);
	}

	return {
		...raw.results[0],
		content
	};
};

export const getPurrfectStreamPageHTML = async (slug: string) => {
	const raw = await queryPurrfectStreamBySlug(slug);
	if (!raw.results.length) {
		return null;
	}

	//Get purrfect picks
	const page = raw.results.at(0);
	if (!page) {
		return null;
	}

	const { title, icon, cover, html } = await NotionPageToHtml.convert(raw.results.at(0).url);

	return {
		...raw.results[0],
		html
	};
};
