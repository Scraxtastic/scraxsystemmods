import ollama, { ChatResponse, Message} from "ollama";

export const sendMessage = async (
  messageContent: string,
  modelName: string = "llama2-uncensored"
): Promise<Promise<AsyncGenerator<ChatResponse, any, unknown>>> => {
  const message: Message = { role: "user", content: messageContent };
  return await ollama.chat({ model: modelName, messages: [message], stream: true });
};
