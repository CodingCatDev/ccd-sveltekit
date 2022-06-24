<script lang="ts">
	import type { Post } from '$lib/models/post.model';
	export let posts: Post[];
</script>

<ul style="display:flex; flex-direction:column">
	{#each posts as post}
		<li>
			<a href={`podcasts/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>
