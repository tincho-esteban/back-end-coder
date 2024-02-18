import { promises as fs } from "fs";

class FileManager {
    constructor(filePath) {
        this.file = filePath;
    }

    async get() {
        try {
            const data = await fs.readFile(this.file, "utf-8");
            return JSON.parse(data);
        } catch (err) {
            throw new Error(`Error reading file ${this.file}: ${err.message}`);
        }
    }

    async write(data) {
        try {
            await fs.writeFile(this.file, JSON.stringify(data, null, 4));
        } catch (err) {
            throw new Error(`Error writing file ${this.file}: ${err.message}`);
        }
    }
}

export default FileManager;
