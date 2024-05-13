import { Ollama } from "ollama-node";
import { RegisterModType, SendFinishMessageType, SendMessageType } from "../../..";
import { WebSocket } from "ws";

export class OllamaChat {
  private sendMessage: SendMessageType;
  private sendFinishMessage: SendFinishMessageType;
  private ollama: Ollama;
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType, sendFinishMessage: SendFinishMessageType) {
    console.log("Chat: mod loaded");
    this.sendMessage = sendMessage;
    this.sendFinishMessage = sendFinishMessage;
    this.ollama = new Ollama();
    this.init(registerMethod);
  }

  private async init(registerMethod: RegisterModType) {
    await this.ollama.setModel("llama2");
    registerMethod("Ollama_Chat", "Chat", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private async handleMessage(name: string, message: string, socket: WebSocket) {
    console.log("Chat:", "Handle Message", message);

    // callback to print each word
    const print = (word: string) => {
      process.stdout.write(word);
      this.sendMessage(name, word, socket);
    };
    await this.ollama.streamingGenerate("why is the sky blue", print);
    this.sendFinishMessage(name, socket);
  }

  private onClose() {
    console.log("Chat:", "Closing");
  }
}
