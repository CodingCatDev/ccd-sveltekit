<script>
	export /**
	 * @type {any}
	 */
	let posts;
</script>

<div style="display:flex; flex-direction:column">
	{#each posts.results as post}
		<a href={`podcasts/${post.slug}`}>{post.title}</a>
	{/each}
</div>
