<script lang="ts">
	import { FileDownloader } from '$lib/FileDownloader';
	import { ArchiveExtractor } from '$lib/ArchiveExtractor';
	import { appDataDir } from '@tauri-apps/api/path';

	async function downloadJava() {
		let appdata_dir: string = await appDataDir();

		const downloader = new FileDownloader(
			'https://kanin.fr/java-installers/java-windows.zip',
			appdata_dir
		);
		let archive_dir = await downloader.download();

		const extractor = new ArchiveExtractor(archive_dir, appdata_dir);
		await extractor.extract(true);
	}
	async function launchJavaInstaller() {}
</script>

<footer>
	<button on:click={downloadJava}>Download Java Installer</button>
	<button>Launch Installer</button>
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
