import WebSocket, { RawData } from "ws";
// import ollama, { ChatResponse } from "ollama";
import { ModFirstMessage } from "./models/ModFirstMessage";
import { ModAliveMessage } from "./models/ModAliveMessage";
import { ModChatMessage } from "./models/ModChatMessage";
import { ModType } from "./models/ModType";
import { Chat } from "./mods/chat/chat/chat";
import { NAS } from "./mods/nas/nas";

// export const sendMessage = async (
//   messageContent: string,
//   modelName: string = "llama2-uncensored"
// ): Promise<Promise<AsyncGenerator<ChatResponse, any, unknown>>> => {
//   const message = { role: "user", content: messageContent };
//   return await ollama.chat({ model: modelName, messages: [message], stream: true });
// };
export type RegisterModType = (
  name: string,
  modType: ModType,
  onUpdate: (name: string, message: string, socket: WebSocket) => void,
  onClose: () => void
) => void;
export type SendMessageType = (name: string, message: string, socket: WebSocket) => void;
export type ModProps = {
  name: string;
  modType: ModType;
  socket: WebSocket;
  onUpdate: (name: string, message: string, socket: WebSocket) => void;
  onClose: () => void;
  interval?: NodeJS.Timeout;
};
const registeredMods: any[] = [];

const main = async () => {
  registerMods();
};

const sendMessage: SendMessageType = (name: string, message: string, socket: WebSocket) => {
  console.log("Mod: ", "Sending message", message);
  const modChatMessage: ModChatMessage = {
    name: name,
    message: message,
    type: "ModChatMessage",
  };
  socket.send(JSON.stringify(modChatMessage));
};

const registerMods = () => {
  const chat = new Chat(registerMod, sendMessage);
};

const registerMod: RegisterModType = (
  name: string,
  modType: ModType,
  onUpdate: (name: string, message: string, socket: WebSocket) => void,
  onClose: () => void
) => {
  console.log("Start");
  const serverIP = "ws://localhost:8989";
  const socket = new WebSocket(serverIP);
  let mod: ModProps = { name: name, modType: modType, socket: socket, onUpdate: onUpdate, onClose: onClose };
  socket.on("open", () => {
    handleOnOpen(socket, mod);
  });
  socket.on("close", () => {
    handleOnClose();
  });
  socket.on("message", async (data) => {
    handleMessage(data, mod);
  });
  registeredMods.push(mod);
};

const handleOnOpen = (socket: WebSocket, mod: any) => {
  console.log("Connected to server", mod.name);
  const firstMessage: ModFirstMessage = {
    name: mod.name,
    modType: mod.modType,
    type: "ModFirstMessage",
  };
  socket.send(JSON.stringify(firstMessage));
  mod.interval = setInterval(() => {
    const aliveMessage: ModAliveMessage = {
      name: mod.name,
      type: "ModAliveMessage",
    };
    socket.send(JSON.stringify(aliveMessage));
  }, 1000);
};

const handleOnClose = () => {
  console.log("Disconnected from server");
  registeredMods.forEach((mod) => {
    clearInterval(mod.interval);
  });
  process.exit(0);
};

const handleMessage = async (data: RawData, mod: ModProps) => {
  const message: ModAliveMessage | ModChatMessage = JSON.parse(data.toString());
  if (message.type === "ModChatMessage") {
    const chatMessage = message as ModChatMessage;
    console.log("Chat message received", chatMessage);
    mod.onUpdate(mod.name, chatMessage.message, mod.socket);
  } else if (message.type === "ModAliveMessage") {
    // console.log("Alive message received");
  }
};
main();
