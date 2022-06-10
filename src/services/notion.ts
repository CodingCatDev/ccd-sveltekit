import 'dotenv/config';
export const config = {
	token: process.env.NOTION_TOKEN || '',
	purrfectStreamsDb: process.env.NOTION_PURRFECT_STREAMS || '',
	purrfectGuestDb: process.env.NOTION_PURRFECT_GUEST || '',
	purrfectCompanyDb: process.env.NOTION_PURRFECT_COMPANY || '',
	purrfectPicksDb: process.env.NOTION_PURRFECT_PICKS || '',
	postsDb: process.env.NOTION_POSTS || '',
	tutorialsDb: process.env.NOTION_TUTORIALS || '',
	pagesDb: process.env.NOTION_PAGES || '',
	coursesDb: process.env.NOTION_COURSES || '',
	sectionsDb: process.env.NOTION_SECTIONS || '',
	lessonsDb: process.env.NOTION_LESSONS || '',
	frameworksDb: process.env.NOTION_FRAMEWORKS || '',
	languagesDb: process.env.NOTION_LANGUAGES || '',
	authorsDb: process.env.NOTION_AUTHORS || ''
};
