<script>
	export /**
	 * @type {any}
	 */
	let posts;
</script>

<ul style="display:flex; flex-direction:column">
	{#each posts.results as post}
		<li>
			<a href={`podcasts/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>
