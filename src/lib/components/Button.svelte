<script lang="ts">
	let primary = true;
	export { primary };
</script>

<button class={`btn btn-${primary ? 'primary' : 'secondary'}`}>Button</button>
