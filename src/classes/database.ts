import { promises as fs} from 'fs';

export class Database {
    filePath: string;
    memoryDb: any = {};

	constructor(filePath: string) {
        this.filePath = filePath;
	}

    async initialize(): Promise<void> {
        return new Promise(async(resolve, reject) => {
            const file = await this.readDatabaseFile().catch((err) => {
                if (err.code === 'ENOENT') {
                    fs.writeFile(this.filePath, '{}', 'utf8');
                } else {
                    reject(err);
                }
            });
    
            if (file) {
                try{
                    this.memoryDb = JSON.parse(file);
                } catch (err) {
                    reject(err);
                }

                resolve();
            }

            reject();
        });
    }

    async readDatabaseFile(): Promise<string> {
        return await fs.readFile(this.filePath, 'utf8');
    }

    async updateDatabaseFile(): Promise<void> {
        return await fs.writeFile(this.filePath, JSON.stringify(this.memoryDb), 'utf8');
    }

    get(key: string): any {
        return this.memoryDb[key];
    }

    async set(key: string, value: any): Promise<void> {
        this.memoryDb[key] = value;

        await this.updateDatabaseFile();
    }

    async addOneNumberToValue(key: string): Promise<number> {
        const value = await this.get(key);

        if (value) {
            await this.set(key, value + 1);
        } else {
            await this.set(key, 1);
        }

        await this.updateDatabaseFile();

        return this.get(key);
    }
}