<script lang="ts">
	// Props
	export let value: number;
</script>

<div class="progress-bar">
	<div class="progress" style={`width: ${value}%`} />
</div>

<style>
	.progress-bar {
		width: 100%;
		height: 20px;
		background-color: #f0f0f0;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background-color: #4caf50;
		transition: width 0.3s ease-in-out;
	}
</style>
