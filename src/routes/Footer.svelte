<script>
	import LaunchButton from './LaunchButton.svelte';
</script>

<div id="body">
	<LaunchButton --width="10em" --height="2em" />
</div>

<style>
	#body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		height: var(--height, 5em);
		width: 100%;

		background-color: brown;
	}
</style>
