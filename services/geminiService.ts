import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;
let currentSystemInstruction = '';

// Define the Tool for the Model
const addToCartTool: FunctionDeclaration = {
  name: 'addToCart',
  parameters: {
    type: Type.OBJECT,
    description: 'Adiciona um produto ao carrinho de compras do utilizador usando o ID do produto.',
    properties: {
      productId: {
        type: Type.STRING,
        description: 'O ID único do produto a adicionar (ex: p1, p2).',
      },
    },
    required: ['productId'],
  },
};

const generateContext = (products: Product[]) => {
  const productContext = products.map(p => {
    const priceInfo = p.originalPrice 
      ? `€${p.price} (Promoção! Antes: €${p.originalPrice})` 
      : `€${p.price}`;
    // Explicitly mentioning ID for the tool to use
    return `- [ID: ${p.id}] ${p.name} (${p.category}): ${priceInfo}. ${p.description}`;
  }).join('\n');

  return `
Você é o "OL Bot", um assistente virtual especializado e amigável da loja OL Print em Portugal.
O seu objetivo é ajudar os clientes a escolher impressoras, encontrar consumíveis (tinteiros/toners) e resolver dúvidas técnicas simples.

FERRAMENTA DE CARRINHO:
Você tem a capacidade de adicionar produtos diretamente ao carrinho do cliente se ele solicitar explicitamente (ex: "quero comprar", "adiciona ao carrinho", "vou levar a mais barata").
Para isso, use a ferramenta 'addToCart' com o ID correto do produto listado abaixo.

Aqui está a lista de produtos que vendemos atualmente (atualizada em tempo real):
${productContext}

Regras:
1. Responda sempre em Português de Portugal (PT-PT).
2. Seja conciso e útil.
3. Se o cliente perguntar por um produto que temos, sugira-o com o preço.
4. Se um produto estiver em promoção (tiver um preço anterior), destaque o desconto!
5. Se perguntarem por algo que não temos, sugira uma alternativa da lista ou diga educadamente que não temos stock no momento.
6. Utilize formatação Markdown para listar produtos.
`;
};

// Initialize with default products
currentSystemInstruction = generateContext(INITIAL_PRODUCTS);

export const updateAIContext = (products: Product[]) => {
  currentSystemInstruction = generateContext(products);
  chatSession = null; // Force session reset to pick up new context
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: currentSystemInstruction,
        temperature: 0.7,
        tools: [{ functionDeclarations: [addToCartTool] }], // Register the tool
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  return chat.sendMessageStream({ message });
};

// Helper to send tool response back to model
export const sendToolResponseStream = async (functionResponses: any[]) => {
    const chat = getChatSession();
    // Use 'message' instead of 'parts' to satisfy ContentUnion requirements for Chat.sendMessageStream
    return chat.sendMessageStream({
        message: [{
            functionResponse: {
                name: functionResponses[0].name,
                response: functionResponses[0].response,
                id: functionResponses[0].id
            }
        }]
    });
}

export const resetChat = () => {
  chatSession = null;
};

// --- Imagen Design Generation ---

export const generateDesign = async (prompt: string, aspectRatio: string = '1:1'): Promise<string | null> => {
  try {
    // Using Imagen 3 (High Quality) via the new SDK naming convention
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio as any, // '1:1', '3:4', '4:3', '16:9', '9:16'
        outputMimeType: 'image/jpeg'
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    return null;
  } catch (error) {
    console.error("Imagen Error:", error);
    throw error;
  }
};

// --- Veo Video Generation ---

export const generateVideo = async (imageBase64: string, prompt: string): Promise<string | null> => {
  // Handle Veo API Key selection
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const aistudio = (window as any).aistudio;
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await aistudio.openSelectKey();
    }
  }

  // Create a new instance to ensure the latest API key from aistudio is used
  const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this image',
      image: {
        imageBytes: imageBase64,
        mimeType: 'image/jpeg', 
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await veoAi.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API key to the URL for download
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    
    return null;
  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};