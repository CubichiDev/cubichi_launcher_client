import { readDir, writeBinaryFile, createDir } from '@tauri-apps/api/fs';
import { info, error } from 'tauri-plugin-log-api';
import { appDataDir } from '@tauri-apps/api/path';

export class FileDownloader {
    private full_path: string;

    constructor(private url: string, private destinationPath: string) {
        const fileName = url.split('/').pop() || 'downloaded_file';
        destinationPath = destinationPath.endsWith('/') ? destinationPath : `${destinationPath}/`;
        this.full_path = `${destinationPath}${fileName}`;
    }

    public async download() {
        info(`Starting download process from ${this.url} to ${this.destinationPath}`);
        try {
            readDir(this.destinationPath)
                .then(() => {
                    // Directory exists
                })
                .catch(async (err) => {
                    info(`Destination directory ${this.destinationPath} does not exist. Creating it.`);
                    await createDir(await appDataDir());
                });


            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`Failed to download from ${this.url}. Status: ${response.status}`);
            }

            const data = await response.arrayBuffer();
            await writeBinaryFile({ path: this.full_path, contents: new Uint8Array(data) });
            info(`Downloaded successfully to ${this.destinationPath}`);
            return this.full_path;
        } catch (downloadErr) {
            const downloadErrorMessage =
                downloadErr instanceof Error
                    ? `Error during download: ${downloadErr.message}. URL: ${this.url}, Destination Path: ${this.destinationPath}`
                    : `An unknown error occurred during download. URL: ${this.url}, Destination Path: ${this.destinationPath}`;
            error(`${downloadErrorMessage}. Error object: ${JSON.stringify(downloadErr)}`);
            return '';
        }
    }
}

