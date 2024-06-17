import fs, { Dirent } from "fs";
import path from "path";
import { createInterface } from "readline";

export class NAS {
  private basePath: string;
  private currentPath: string = "/";
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public getBasePath(): string {
    return this.basePath;
  }

  public getCurrentPath(): string {
    return this.currentPath;
  }

  public getFullPath(): string {
    return path.join(this.basePath, this.currentPath);
  }

  public changeDirectory(dir: string): void {
    console.log("newDir", dir);
    console.log("Changing directory to", path.join(this.currentPath, dir.replace(/[\\\/]+/g, "")));
    const newPath = path.join(this.currentPath, dir, "/");
    if (!fs.existsSync(path.join(this.basePath, newPath))) {
      console.log("Directory does not exist. Canceling operation.");
      return;
    }
    this.currentPath = path.join(this.currentPath, dir, "/");
  }

  public listDirectory(): Dirent[] {
    return fs.readdirSync(this.getFullPath(), { withFileTypes: true });
  }

  public getFilesDetails(files: string[]): fs.Stats[] {
    return files.map((file) => {
      return fs.statSync(path.join(this.getFullPath(), file));
    });
  }

  public getFileDetails(file: string): fs.Stats {
    return fs.statSync(path.join(this.getFullPath(), file));
  }

  public getFiles(files: string[]): string[] {
    return files.map((file) => {
      return fs.readFileSync(path.join(this.getFullPath(), file)).toString();
    });
  }

  public getFile(file: string): string {
    return fs.readFileSync(path.join(this.getFullPath(), file)).toString();
  }

  public async getFileAsnyc(
    file: string,
    onLinesRead: (lines: string[]) => void,
    lineSplitterSize = 100000
  ): Promise<void> {
    const fileStream = fs.createReadStream(path.join(this.getFullPath(), file));
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let linesToSave: string[] = [];
    for await (const line of rl) {
      linesToSave.push(line);
      if (linesToSave.length >= lineSplitterSize) {
        onLinesRead(linesToSave);
        linesToSave = [];
      }
    }
    if (linesToSave.length > 0) {
      onLinesRead(linesToSave);
    }
  }
}
