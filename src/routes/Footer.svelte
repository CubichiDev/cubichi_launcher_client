<!-- Footer.svelte -->
<script lang="ts">
	// Props
	export let buttonText: string;
	export let showProgressBar: boolean = true;
	export let progressBarValue: number = 20;

	import ProgressBar from './ProgressBar.svelte';
</script>

<footer>
	{#if showProgressBar}
		<ProgressBar value={progressBarValue} />
	{:else}
		<button>{buttonText}</button>
	{/if}
</footer>

<style>
	footer {
		background-color: #333;
		color: #fff;
		padding: 20px;
		display: flex;
		border-top: 1px solid #555;

		justify-content: center;
		align-items: center;
		width: var(--width, 100%);
		height: var(--height, 200px);
	}

	button {
		padding: 10px 20px;
		background-color: #66bb6a;
		border: none;
		color: #fff;
		font-size: 16px;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #5aaf61;
	}
</style>
