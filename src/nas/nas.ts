import fs from "fs";
import path from "path";

export class NAS {
  private basePath: string;
  private currentPath: string = "/";
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public getBasePath(): string {
    return this.basePath;
  }

  public getFullPath(): string {
    return path.join(this.basePath, this.currentPath);
  }

  public changeDirectory(dir: string): void {
    console.log("Changing directory to", path.join(this.currentPath, dir.replace(/[\\\/]+/g, "")));
    const newPath = path.join(this.currentPath, dir, "/");
    if (!fs.existsSync(path.join(this.basePath, newPath))) {
      console.log("Directory does not exist. Canceling operation.");
      return;
    }
    this.currentPath = path.join(this.currentPath, dir, "/");
  }

  public listDirectory(): string[] {
    return fs.readdirSync(this.getFullPath());
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

  public getFilesAsync(files: string[]): Promise<string[]> {
    return new Promise((resolve) => {
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          fs.readFile(path.join(this.getFullPath(), file), (err, data) => {
            resolve(data.toString());
          });
        });
      });
      Promise.all(promises).then((values: string[]) => {
        resolve(values);
      });
    });
  }

  public getFileAsync(file: string): Promise<string> {
    return new Promise((resolve) => {
      fs.readFile(path.join(this.getFullPath(), file), (err, data) => {
        resolve(data.toString());
      });
    });
  }
}
