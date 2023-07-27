<!-- ImageBanner.svelte -->
<script lang="ts">
	// Props
	export let imageUrl: string;
</script>

<div class="banner">
	<img src={imageUrl} alt="Minecraft Banner" />
</div>

<style>
	.banner {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;

		width: var(--width, 100%);
		height: var(--height, 200px);
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
