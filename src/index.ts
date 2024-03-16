import WebSocket from "ws";
import ollama, { ChatResponse } from "ollama";
import { ModFirstMessage } from "./models/ModFirstMessage";
import { ModAliveMessage } from "./models/ModAliveMessage";
import { ModChatMessage } from "./models/ModChatMessage";

export const sendMessage = async (
  messageContent: string,
  modelName: string = "llama2-uncensored"
): Promise<Promise<AsyncGenerator<ChatResponse, any, unknown>>> => {
  const message = { role: "user", content: messageContent };
  return await ollama.chat({ model: modelName, messages: [message], stream: true });
};

const main = async () => {
  const serverIP = "ws://localhost:8989";
  const socket = new WebSocket(serverIP);
  let interval: NodeJS.Timeout = null;
  socket.on("open", () => {
    console.log("Connected to server");
    const firstMessage: ModFirstMessage = {
      name: "Ollama",
      type: "ModFirstMessage",
    };
    socket.send(JSON.stringify(firstMessage));
    setInterval(() => {
      const aliveMessage: ModAliveMessage = {
        name: "Ollama",
        type: "ModAliveMessage",
      };
      socket.send(JSON.stringify(aliveMessage));
    }, 1000);
  });
  socket.on("close", () => {
    console.log("Disconnected from server");
    clearInterval(interval);
    process.exit(0);
  });

  socket.on("message", async (data) => {
    const message: ModAliveMessage | ModChatMessage = JSON.parse(data.toString());
    if (message.type === "ModChatMessage") {
      const chatMessage = message as ModChatMessage;
      const messages = await sendMessage(chatMessage.message);
      let currentOutput = "";
      let lastSentTime = 0;
      for await (const message of messages) {
        currentOutput += message.message.content;
        // console.log("CurrentOutput", currentOutput);
        // console.log("LastSentTime", lastSentTime, Date.now());
        if (lastSentTime + 100 < Date.now()) {
          socket.send(JSON.stringify({ name: "Ollama", type: "ModChatMessage", message: currentOutput }));
          lastSentTime = Date.now();
          currentOutput = "";
        }
      }
      if (currentOutput !== "") {
        socket.send(JSON.stringify({ name: "Ollama", type: "ModChatMessage", message: currentOutput }));
      }
      socket.send(JSON.stringify({ name: "Ollama", type: "ModChatFinishedMessage" }));
    } else if (message.type === "ModAliveMessage") {
      // console.log("Alive message received");
    }
  });
};
main();
