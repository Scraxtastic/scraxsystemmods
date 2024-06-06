import { Ollama } from "ollama-node";
import { RegisterModType, SendFinishMessageType, SendMessageType } from "../../..";
import { WebSocket } from "ws";

export class OllamaChat {
  private sendMessage: SendMessageType;
  private sendFinishMessage: SendFinishMessageType;
  private ollama: Ollama;
  constructor(registerMethod: RegisterModType, sendMessage: SendMessageType, sendFinishMessage: SendFinishMessageType) {
    console.log("Ollama: mod loaded");
    this.sendMessage = sendMessage;
    this.sendFinishMessage = sendFinishMessage;
    this.ollama = new Ollama();
    this.init(registerMethod);
  }

  private async init(registerMethod: RegisterModType) {
    await this.ollama.setModel("llama2-uncensored");
    registerMethod("Ollama_Chat", "Chat", this.handleMessage.bind(this), this.onClose.bind(this));
  }

  private async handleMessage(name: string, message: string, socket: WebSocket) {
    console.log("Chat:", "Handle Message", message);

    const finishTime = 1000 * 5; // 10 seconds
    let timeout: NodeJS.Timeout;
    // callback to print each word
    const sendWord = (word: string) => {
      this.sendMessage(name, word, socket);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.sendFinishMessage(name, socket);
      }, finishTime);
    };
    await this.ollama.streamingGenerate(message, sendWord);
    console.log("Mod: Finishing mod message");
  }

  private onClose() {
    console.log("Chat:", "Closing");
  }
}
