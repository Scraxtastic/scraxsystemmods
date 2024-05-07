import { RegisterModType, SendMessageType } from "../../..";

export class Chat {
  private sendMessage: SendMessageType;
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType) {
    console.log("Chat: mod loaded");
    this.sendMessage = sendMessage;
    registerMethod("ChatCatAtT", "Chat", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private handleMessage(message: string) {
    console.log("Chat:", "Handle Message", message);
    this.sendMessage("ChatCatAtT: " + message);
  }

  private onClose() {}
}
