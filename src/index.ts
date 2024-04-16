// import WebSocket, { RawData } from "ws";
// // import ollama, { ChatResponse } from "ollama";
// import { ModFirstMessage } from "./models/ModFirstMessage";
// import { ModAliveMessage } from "./models/ModAliveMessage";
// import { ModChatMessage } from "./models/ModChatMessage";
import { captureImages } from "./camera/camera";

// export const sendMessage = async (
//   messageContent: string,
//   modelName: string = "llama2-uncensored"
// ): Promise<Promise<AsyncGenerator<ChatResponse, any, unknown>>> => {
//   const message = { role: "user", content: messageContent };
//   return await ollama.chat({ model: modelName, messages: [message], stream: true });
// };

const main = async () => {
  console.log("Start");

  const c = await captureImages("image/jpeg");
  // const counts: number[] = [];
  // const counts2: number[] = [];
  // const counts3: number[] = [];
  // const counts4: number[] = [];
  // let it = 1;
  // for (let i = 0; i < 10; i++) {
  //   console.log("Run", it, i);
  //   const c = await captureImages("image/png");
  //   counts.push(c);
  // }
  // it++;
  // for (let i = 0; i < 10; i++) {
  //   console.log("Run", it, i);
  //   const c = await captureImages("image/jpeg");
  //   counts2.push(c);
  // }
  // it++;
  // for (let i = 0; i < 10; i++) {
  //   console.log("Run", it, i);
  //   const c = await captureImages("image/webp");
  //   counts3.push(c);
  // }
  // it++;
  // for (let i = 0; i < 10; i++) {
  //   console.log("Run", it, i);
  //   const c = await captureImages("rgba");
  //   counts4.push(c);
  // }
  // const reducer = (a: number, b: number) => {
  //   return a + b;
  // };
  // const avg = (arr: number[]) => {
  //   return arr.reduce(reducer, 0) / arr.length;
  // };
  // console.log("End?", avg(counts), avg(counts2), avg(counts3), avg(counts4));

  // const serverIP = "ws://localhost:8989";
  // const socket = new WebSocket(serverIP);
  // let interval: NodeJS.Timeout = null;
  // registerMods();
  // socket.on("open", () => {
  //   handleOnOpen(socket);
  // });
  // socket.on("close", () => {
  //   handleOnClose(interval);
  // });
  // socket.on("message", async (data) => {
  //   handleMessage(data, socket);
  // });
};

// const registerMods = () => {};

// const handleOnOpen = (socket: WebSocket) => {
//   console.log("Connected to server");
//   const firstMessage: ModFirstMessage = {
//     name: "Ollama",
//     type: "ModFirstMessage",
//   };
//   socket.send(JSON.stringify(firstMessage));
//   setInterval(() => {
//     const aliveMessage: ModAliveMessage = {
//       name: "Ollama",
//       type: "ModAliveMessage",
//     };
//     socket.send(JSON.stringify(aliveMessage));
//   }, 1000);
// };

// const handleOnClose = (interval: NodeJS.Timeout) => {
//   console.log("Disconnected from server");
//   clearInterval(interval);
//   process.exit(0);
// };

// const handleMessage = async (data: RawData, socket: WebSocket) => {
//   const message: ModAliveMessage | ModChatMessage = JSON.parse(data.toString());
//   if (message.type === "ModChatMessage") {
//     const chatMessage = message as ModChatMessage;
//     const messages = await sendMessage(chatMessage.message);
//     let currentOutput = "";
//     let lastSentTime = 0;
//     for await (const message of messages) {
//       currentOutput += message.message.content;
//       // console.log("CurrentOutput", currentOutput);
//       // console.log("LastSentTime", lastSentTime, Date.now());
//       if (lastSentTime + 100 < Date.now()) {
//         socket.send(JSON.stringify({ name: "Ollama", type: "ModChatMessage", message: currentOutput }));
//         lastSentTime = Date.now();
//         currentOutput = "";
//       }
//     }
//     if (currentOutput !== "") {
//       socket.send(JSON.stringify({ name: "Ollama", type: "ModChatMessage", message: currentOutput }));
//     }
//     socket.send(JSON.stringify({ name: "Ollama", type: "ModChatFinishedMessage" }));
//   } else if (message.type === "ModAliveMessage") {
//     // console.log("Alive message received");
//   }
// };
main();
