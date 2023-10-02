import JSZip from 'jszip';
import {
    writeBinaryFile,
    readBinaryFile,
    removeFile,
    createDir,
    readDir
} from '@tauri-apps/api/fs';
import { info, error, trace } from 'tauri-plugin-log-api';
import { dirname } from '@tauri-apps/api/path';

export class ArchiveExtractor {
    constructor(private archivePath: string, private destinationPath: string) { }


    public async extract(delete_archive_after_extraction: boolean = false): Promise<void> {
        info(`Starting unzipping process...`);
        const zip = new JSZip();
        const zipData = await zip.loadAsync(this.getArchiveBytestream());
        const createdDirectories = new Set<string>(); // To keep track of directories we've already created

        info(`Loaded zip data. Found ${Object.keys(zipData.files).length} entries to extract.`);
        for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
            const outputPath = `${this.destinationPath}${relativePath}`;
            const parentDir = await dirname(outputPath);

            if (!zipData.files[`${parentDir}/`] && !createdDirectories.has(parentDir)) {
                info(`Directory ${parentDir} not found. Creating it.`);
                await this.createDirectory(parentDir);
                createdDirectories.add(parentDir); // Add the directory to the set
            }

            if (zipEntry.dir) {
                info(`Identified directory entry: ${relativePath}. Attempting to create directory.`);
                if (!createdDirectories.has(outputPath)) {
                    await this.createDirectory(outputPath);
                    createdDirectories.add(outputPath);
                }
            } else {
                info(`Identified file entry: ${relativePath}. Attempting to extract to ${outputPath}.`);
                await this.extractFile(zipEntry, outputPath);
            }
        }
        info(`Java archive extracted successfully to ${this.destinationPath}`);

        if (delete_archive_after_extraction) {
            info(`Delete archive flag is set to true. Deleting archive ${this.archivePath} after extraction.`);
            await removeFile(this.archivePath);
            info(`Archive ${this.archivePath} deleted successfully.`);
        }
        else {
            info(`Delete archive flag is set to false. Leaving archive ${this.archivePath} after extraction.`);
        }
    }

    private async getArchiveBytestream(): Promise<ArrayBuffer> {
        try {
            const binaryData = await readBinaryFile(this.archivePath);
            return binaryData;
        } catch (readErr) {
            const readErrorMessage =
                readErr instanceof Error
                    ? readErr.message
                    : 'An unknown error occurred while reading archive';
            const readErrorStack = readErr instanceof Error ? readErr.stack : 'No stack trace available';
            error(`Error reading archive: ${readErrorMessage}`);
            trace(`Archive Reading Error Stack Trace: ${readErrorStack}`);
            return new ArrayBuffer(0);
        }
    }

    private async createDirectory(outputPath: string) {
        info(`Attempting to create directory: ${outputPath}`);
        try {
            await createDir(outputPath, { recursive: true });
            info(`Directory ${outputPath} created successfully.`);
        } catch (dirErr) {
            const dirErrorMessage =
                dirErr instanceof Error
                    ? dirErr.message
                    : 'An unknown error occurred while creating directory';
            const dirErrorStack = dirErr instanceof Error ? dirErr.stack : 'No stack trace available';
            error(`Error creating directory: ${dirErrorMessage}`);
            trace(`Directory Creation Error Stack Trace: ${dirErrorStack}`);
        }
    }

    private async extractFile(zipEntry: any, outputPath: string) {
        try {
            const content = await zipEntry.async('uint8array');
            info(`Extracting ${zipEntry.name} to ${outputPath}`);
            await writeBinaryFile({ path: outputPath, contents: content });
            info(`File ${zipEntry.name} extracted successfully to ${outputPath}`);
        } catch (fileErr) {
            const fileErrorMessage =
                fileErr instanceof Error
                    ? fileErr.message
                    : 'An unknown error occurred while extracting file';
            const fileErrorStack = fileErr instanceof Error ? fileErr.stack : 'No stack trace available';
            error(`Error extracting file: ${fileErrorMessage}`);
            trace(`File Extraction Error Stack Trace: ${fileErrorStack}`);
        }
    }
}
