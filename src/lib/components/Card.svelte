<script lang="ts">
	import type { Widths, Sizes } from '$lib/models/daisyui.model';
	import type { Image as ImageModel } from '$lib/models/generic.model';
	import Image from '$lib/components/Image.svelte';
	let width: Widths | undefined = '96';
	let shadow: Sizes | undefined = 'xl';
	let image: ImageModel | undefined = undefined;
	export { width, shadow, image };
</script>

<div class={`card w-${width} bg-base-100 shadow-${shadow}`}>
	{#if image}
		<Image src={image.src} alt={image.alt} />
	{/if}
	<div class="card-body">
		<h2 class="card-title">Shoes!</h2>
		<p>If a dog chews shoes whose shoes does he choose?</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Buy Now</button>
		</div>
	</div>
</div>
