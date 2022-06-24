<script lang="ts">
	import type { Post } from '$lib/models/post.model';
	import Card from '$lib/components/Card.svelte';
	export let post: Post;
	console.log(post);
</script>

{#if post?.cover?.external?.url}
	<Card image={{ src: post?.cover?.external?.url, alt: post?.title }} />
{:else}
	<Card />
{/if}
