import { RegisterModType, SendFinishMessageType, SendMessageType } from "../..";
import { WebSocket } from "ws";
import { NAS } from "./nas";
import path from "path";

export class NasNetworker {
  private sendMessage: SendMessageType;
  private sendFinishMessage: SendFinishMessageType;
  private users: any = {};
  private config: any = {};
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType, sendFinishMessage: SendFinishMessageType, config: any) {
    console.log("NAS: mod loaded");
    this.config = config;
    this.sendMessage = sendMessage;
    this.sendFinishMessage = sendFinishMessage;
    registerMethod("NAS", "NAS", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private handleMessage(name: string, message: string, socket: WebSocket) {
    const messageInfo: any = JSON.parse(message);
    const user = this.ensureUser(name, messageInfo.dir);
    if (messageInfo.type === "list") {
      this.sendMessage(name, JSON.stringify(user.nas.list()), socket);
      this.sendFinishMessage(name, socket);
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

  private ensureUser(name: string, dir: string): any {
    if (this.users[name] === undefined) {
      this.users[name] = { name: name, nas: new NAS(path.join(__dirname, this.config.basePath, dir)), lastUpdate: new Date()};
    }
    return this.users[name];
  }

  private onClose() {
    console.log("NAS:", "Closing");
  }
}
