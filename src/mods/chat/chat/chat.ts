import { RegisterModType, SendFinishMessageType, SendMessageType } from "../../..";
import { WebSocket } from "ws";

export class Chat {
  private sendMessage: SendMessageType;
  private sendFinishMessage: SendFinishMessageType;
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType, sendFinishMessage: SendFinishMessageType) {
    console.log("Chat: mod loaded");
    this.sendMessage = sendMessage;
    this.sendFinishMessage = sendFinishMessage;
    registerMethod("Echo_Chat", "Chat", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private handleMessage(name: string, message: string, socket: WebSocket) {
    console.log("Chat:", "Handle Message", message);
    this.sendMessage(name, message, socket);
    this.sendFinishMessage(name, socket);
  }

  private onClose() {
    console.log("Chat:", "Closing");
  }
}
