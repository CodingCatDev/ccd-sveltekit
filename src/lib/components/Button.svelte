<script lang="ts">
	import type { Types, Sizes } from '$lib/models/daisyui.model';
	let type: Types = 'primary';
	let size: Sizes = 'md';
	export { type, size };
</script>

<button class={`btn btn-${type} btn-${size}`}>Button</button>
