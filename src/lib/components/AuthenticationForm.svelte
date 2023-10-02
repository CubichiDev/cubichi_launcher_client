<!-- AuthenticationForm.svelte -->
<script lang="ts">
	export let onLogin: (username: string, password: string) => void;

	let username = '';
	let password = '';

	function handleSubmit(event: Event) {
		event.preventDefault();
		onLogin(username, password);
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="container">
		<input type="text" bind:value={username} placeholder="Username" />
		<input type="password" bind:value={password} placeholder="Password" />
		<button type="submit">Login</button>
	</div>
</form>

<style>
	/* AuthenticationForm styles here */
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: var(--width, 100%);
		height: var(--height, 200px);
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 250px;
		font-size: 16px;
	}

	button {
		padding: 10px 20px;
		background-color: #1976d2;
		border: none;
		color: #fff;
		font-size: 16px;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	button:hover {
		background-color: #1565c0;
	}
</style>
