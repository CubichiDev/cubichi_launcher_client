<!-- App.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from './Footer.svelte';
	import AuthenticationForm from './AuthenticationForm.svelte';
	import ImageBanner from './ImageBanner.svelte';

	let progressBarValue = 0;
	let showProgressBar = false;

	// Local state for AuthenticationForm
	let username = '';
	let password = '';

	// Simulating a progress bar increment for demonstration purposes
	function updateProgressBar() {
		if (progressBarValue < 100) {
			progressBarValue += 10;
		} else {
			progressBarValue = 0;
			showProgressBar = false;
		}
	}

	// Simulating login functionality for demonstration purposes
	function handleLogin(username: string, password: string) {
		// Perform authentication logic here
		// For demonstration, we'll just show the progress bar for 5 seconds
		showProgressBar = true;
		const interval = setInterval(updateProgressBar, 500);
		setTimeout(() => {
			clearInterval(interval);
			showProgressBar = false;
		}, 5000);
	}

	onMount(() => {
		// Add any necessary setup or initialization logic here
	});
</script>

<main>
	<div class="container">
		<ImageBanner imageUrl="https://picsum.photos/800/200" --height="200px" />
		<AuthenticationForm onLogin={handleLogin} --height="200px" />
		<Footer buttonText="Play" --height="50px" />
	</div>
</main>

<style>
	/* Main app layout styles here */
	main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		height: calc(100% - 2rem);
		width: calc(100% - 2rem);
	}
	/* Additional styles for the entire app */
</style>
