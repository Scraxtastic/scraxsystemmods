import { RegisterModType, SendFinishMessageType, SendMessageType, baseDir } from "../..";
import { WebSocket } from "ws";
import { NAS } from "./nas";
import path from "path";
import * as fs from "fs";

export class NasNetworker {
  private sendMessage: SendMessageType;
  private sendFinishMessage: SendFinishMessageType;
  private users: any = {};
  private config: any = {};
  constructor(
    registerMethod: RegisterModType,
    sendMessage: SendMessageType,
    sendFinishMessage: SendFinishMessageType,
    config: any
  ) {
    console.log("NAS: mod loaded");
    this.config = config;
    this.sendMessage = sendMessage;
    this.sendFinishMessage = sendFinishMessage;
    registerMethod("NAS", "NAS", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private handleMessage(name: string, message: string, socket: WebSocket) {
    console.log("NAS:", "Handling message", message);
    const messageInfo: any = JSON.parse(message);
    const user = this.ensureUser(name, messageInfo.dir);
    if (messageInfo.type === "list") {
      this.listDirectory(user, name, socket);
      return;
    }
    if (messageInfo.type === "cd") {
      console.log("NAS:", "Changing directory", messageInfo);
      user.nas.changeDirectory(messageInfo.path);
      this.listDirectory(user, name, socket);
      return;
    }
    if (messageInfo.type === "read") {
      this.sendMessage(name, user.nas.read(messageInfo.filename), socket);
      this.sendFinishMessage(name, socket);
      return;
    }
    this.sendMessage(name, message, socket);
    this.sendFinishMessage(name, socket);
  }

  private listDirectory(user: any, name: string, socket: WebSocket) {
    const nas: NAS = user.nas;
    const response = {
      type: "list",
      data: nas.listDirectory().map((dirent: fs.Dirent) => {
        return {
          name: dirent.name,
          isDirectory: dirent.isDirectory(),
          size: fs.statSync(path.join(nas.getFullPath(), dirent.name)).size,
        };
      }),
      path: nas.getCurrentPath(),
    };

    console.log("NAS:", "Listing directory", response, nas.getFullPath());
    this.sendMessage(name, JSON.stringify(response), socket);
    this.sendFinishMessage(name, socket);
  }

  private ensureUser(name: string, dir: string): any {
    if (dir === undefined) {
      dir = "";
    }
    if (this.users[name] === undefined) {
      const nasDir = path.join(baseDir, this.config.basePath, dir);
      fs.mkdirSync(nasDir, { recursive: true });
      this.users[name] = {
        name: name,
        nas: new NAS(nasDir),
        lastUpdate: new Date(),
      };
    }
    return this.users[name];
  }

  private onClose() {
    console.log("NAS:", "Closing");
  }
}
