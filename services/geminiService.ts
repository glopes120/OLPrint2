import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PRODUCTS } from '../constants';

// Initialize Gemini Client
// process.env.API_KEY is automatically injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Prepare system instruction with product context
const productContext = PRODUCTS.map(p => 
  `- ${p.name} (${p.category}): €${p.price}. ${p.description}`
).join('\n');

const SYSTEM_INSTRUCTION = `
Você é o "OL Bot", um assistente virtual especializado e amigável da loja OL Print em Portugal.
O seu objetivo é ajudar os clientes a escolher impressoras, encontrar consumíveis (tinteiros/toners) e resolver dúvidas técnicas simples.

Aqui está a lista de produtos que vendemos atualmente:
${productContext}

Regras:
1. Responda sempre em Português de Portugal (PT-PT).
2. Seja conciso e útil.
3. Se o cliente perguntar por um produto que temos, sugira-o com o preço.
4. Se perguntarem por algo que não temos, sugira uma alternativa da lista ou diga educadamente que não temos stock no momento.
5. Pode dar conselhos gerais sobre manutenção de impressoras (como limpar cabeças de impressão, desatolar papel).
6. Utilize formatação Markdown para listar produtos ou passos (bold, listas).
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  return chat.sendMessageStream({ message });
};

export const resetChat = () => {
  chatSession = null;
};