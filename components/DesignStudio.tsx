import React, { useState } from 'react';
import { Palette, Loader2, Download, Sparkles, Image as ImageIcon, Printer, Share2 } from 'lucide-react';
import { generateDesign } from '../services/geminiService';

export const DesignStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const resultUrl = await generateDesign(prompt, aspectRatio);
      if (resultUrl) {
        setGeneratedImage(resultUrl);
      } else {
        alert('Não foi possível gerar o design. Tente novamente.');
      }
    } catch (error) {
      console.error("Design Error:", error);
      alert('Ocorreu um erro ao criar o seu design.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Um postal de aniversário com balões coloridos e estilo aguarela",
    "Poster minimalista de uma paisagem do Porto ao pôr do sol",
    "Desenho para colorir de um robô amigável na floresta",
    "Etiqueta vintage para frascos de compota caseira"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl mb-4">
          <Palette className="h-8 w-8 text-pink-600 dark:text-pink-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Estúdio Criativo AI</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Crie artes exclusivas, postais ou materiais gráficos prontos para imprimir na sua nova impressora.
          Basta descrever o que imagina!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                O que vamos criar hoje?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o seu design em detalhe..."
                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm min-h-[120px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
              
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => setPrompt(s)}
                      className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-pink-200 dark:hover:border-pink-800 text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">Formatos de Impressão</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1:1', label: 'Quadrado', sub: 'Social/Deco' },
                  { id: '3:4', label: 'Retrato', sub: 'A4/Poster' },
                  { id: '16:9', label: 'Paisagem', sub: 'Banner' }
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      aspectRatio === ratio.id 
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-sm font-bold">{ratio.label}</div>
                    <div className="text-[10px] opacity-70">{ratio.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                !prompt.trim() || isLoading 
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  A criar a sua arte...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Gerar Design
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 shadow-inner min-h-[500px] flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden group">
              {generatedImage ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={generatedImage} 
                    alt="Generated Design" 
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={generatedImage}
                      download="ol-print-design.jpg"
                      className="p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      title="Descarregar"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 dark:text-slate-500 p-8">
                   {isLoading ? (
                    <div className="flex flex-col items-center animate-pulse">
                       <div className="w-20 h-20 bg-pink-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <Sparkles className="h-10 w-10 text-pink-400 animate-spin-slow" />
                       </div>
                       <p className="text-lg font-medium text-slate-600 dark:text-slate-300">A Inteligência Artificial está a desenhar...</p>
                       <p className="text-sm mt-2">Isto demora apenas alguns segundos.</p>
                    </div>
                   ) : (
                    <>
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">O seu design aparecerá aqui</p>
                      <p className="text-sm opacity-70 max-w-xs mx-auto mt-2">
                        Experimente criar um postal para o Dia da Mãe ou um poster motivacional para o seu escritório.
                      </p>
                    </>
                   )}
                </div>
              )}
            </div>

            {/* Actions Bar (Only visible if image generated) */}
            {generatedImage && (
               <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                      <Printer className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pronto a imprimir?</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Recomendamos papel fotográfico 180g.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Partilhar
                    </button>
                    <button 
                      onClick={() => alert('O design foi enviado para a sua lista de impressão!')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Adicionar à Fila
                    </button>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};