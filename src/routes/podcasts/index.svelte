<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Post } from 'src/models/post.model';
	let posts: Post[];
</script>

<Button primary={false} />
<ul style="display:flex; flex-direction:column">
	{#each posts as post}
		<li>
			<a href={`podcasts/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>
