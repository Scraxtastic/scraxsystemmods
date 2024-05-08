import { RegisterModType, SendMessageType } from "../../..";
import { WebSocket } from "ws";

export class Chat {
  private sendMessage: SendMessageType;
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType) {
    console.log("Chat: mod loaded");
    this.sendMessage = sendMessage;
    registerMethod("ChatCatAtT", "Chat", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private handleMessage(name: string, message: string, socket: WebSocket) {
    console.log("Chat:", "Handle Message", message);
    this.sendMessage(name, message, socket);
  }

  private onClose() {
    console.log("Chat:", "Closing");
  }
}
