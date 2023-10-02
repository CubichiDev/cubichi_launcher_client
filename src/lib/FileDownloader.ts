import { writeBinaryFile } from '@tauri-apps/api/fs';
import { info, error } from 'tauri-plugin-log-api';

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
                    ? downloadErr.message
                    : 'An unknown error occurred during download';
            error(`Error during download: ${downloadErrorMessage}`);
            return '';
        }
    }
}
