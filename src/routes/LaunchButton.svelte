<script>
	// When using the Tauri API npm package:
	import { invoke } from '@tauri-apps/api/tauri';

	function launch() {
		invoke('run_jar');
		console.log('Launching...');
	}
</script>

<button on:click={launch}>Launch</button>

<style>
	button {
		width: var(--width, 20em);
		height: var(--height, 5em);
		margin: 0;
		padding: 0;
	}
</style>
