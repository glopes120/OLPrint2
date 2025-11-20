import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, MessageSquare, ShoppingCart, MapPin, ExternalLink } from 'lucide-react';
import { sendMessageStream, sendToolResponseStream, resetChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onAddToCart: (productId: string) => boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose, onOpen, onAddToCart }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! 👋 Sou o assistente virtual da OL Print. Como posso ajudar com a sua impressora hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasRequestedLocation = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Request location permission once when chat opens
      if (!hasRequestedLocation.current && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            setLocation(loc);
            // If we got location, we might want to reset chat session to inject new location config
            // But to avoid jarring UX, we just ensure next message uses it.
            // Ideally, resetChat() if it was the very first interaction, but safe to just let sendMessageStream handle it.
            // For strict Maps grounding, we should ensure session is created with location.
            resetChat(); 
          },
          (err) => {
            console.warn("Location access denied or error:", err);
          }
        );
        hasRequestedLocation.current = true;
      }
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Placeholder for streaming response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      // Pass location if available
      let result = await sendMessageStream(userMessage, location);
      let fullText = '';
      let functionCallData: { name: string, args: any, id: string } | null = null;
      
      // Temporary storage for grounding chunks in this turn
      const collectedGroundingLinks: { title: string; uri: string; source: 'maps' | 'web' }[] = [];

      // --- First Pass: User text -> Model (Text, Tool Call, or Grounding) ---
      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullText;
            return newMessages;
          });
        }

        // Check for Maps Grounding
        const metadata = chunk.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingChunks) {
           metadata.groundingChunks.forEach((chunk: any) => {
             if (chunk.maps) {
               collectedGroundingLinks.push({
                 title: chunk.maps.title || 'Localização no Mapa',
                 uri: chunk.maps.uri,
                 source: 'maps'
               });
             } else if (chunk.web) {
                collectedGroundingLinks.push({
                 title: chunk.web.title || 'Fonte Web',
                 uri: chunk.web.uri,
                 source: 'web'
               });
             }
           });
           
           // Update message with links
           setMessages(prev => {
             const newMessages = [...prev];
             const currentLinks = newMessages[newMessages.length - 1].groundingLinks || [];
             // Deduplicate based on URI
             const allLinks = [...currentLinks, ...collectedGroundingLinks];
             const uniqueLinks = Array.from(new Map(allLinks.map(item => [item.uri, item])).values());
             
             newMessages[newMessages.length - 1].groundingLinks = uniqueLinks;
             return newMessages;
           });
        }

        // Check for Function Calls (Tools)
        const calls = chunk.functionCalls;
        if (calls && calls.length > 0) {
          const call = calls[0];
          functionCallData = { name: call.name, args: call.args, id: call.id || '' };
        }
      }

      // --- Handle Function Call if needed ---
      if (functionCallData && functionCallData.name === 'addToCart') {
         const { productId } = functionCallData.args;
         
         // Execute action locally
         const success = onAddToCart(productId);
         const toolResult = success ? "Produto adicionado com sucesso." : "Produto não encontrado.";

         setMessages(prev => {
             const newMessages = [...prev];
             newMessages[newMessages.length - 1].text += `\n\n*Adicionando produto ao carrinho...*`;
             return newMessages;
         });

         const functionResponse = [
             {
                 name: 'addToCart',
                 response: { result: toolResult },
                 id: functionCallData.id
             }
         ];

         result = await sendToolResponseStream(functionResponse);

         let confirmationText = '';
         
         setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullText; 
            return newMessages;
         });

         for await (const chunk of result) {
             const chunkText = chunk.text;
             if (chunkText) {
                 confirmationText += chunkText;
                 setMessages(prev => {
                     const newMessages = [...prev];
                     newMessages[newMessages.length - 1].text = fullText + (fullText ? '\n\n' : '') + confirmationText;
                     return newMessages;
                 });
             }
         }
      }

    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema técnico. Por favor tente novamente.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 group"
        aria-label="Abrir chat"
      >
        <MessageSquare className="h-6 w-6 group-hover:animate-pulse" />
        <span className="font-medium hidden group-hover:inline-block whitespace-nowrap transition-all max-w-0 group-hover:max-w-[100px] overflow-hidden">Ajuda AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[90vw] max-w-[380px] h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Assistente OL Print</h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${location ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
              {location ? 'Online (Com Localização)' : 'Online'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}
            >
              {msg.role === 'model' ? (
                  <ReactMarkdown 
                    className="prose prose-sm max-w-none prose-p:leading-snug prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900 prose-pre:text-xs dark:prose-invert"
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mt-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-slate-700 dark:text-slate-300" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>

            {/* Grounding Links Rendering */}
            {msg.groundingLinks && msg.groundingLinks.length > 0 && (
               <div className="mt-2 flex flex-wrap gap-2 max-w-[85%]">
                 {msg.groundingLinks.map((link, lIdx) => (
                   <a 
                     key={lIdx} 
                     href={link.uri} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                   >
                     {link.source === 'maps' ? <MapPin className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                     {link.title}
                   </a>
                 ))}
               </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
               <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Lojas perto de mim, adicionar impressora..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 border rounded-full text-sm outline-none transition-all dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400">AI pode cometer erros. Verifique as informações.</p>
        </div>
      </div>
    </div>
  );
};