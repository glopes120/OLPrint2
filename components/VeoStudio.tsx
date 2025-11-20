import React, { useState, useRef } from 'react';
import { Upload, Film, Loader2, Play, Sparkles, Image as ImageIcon } from 'lucide-react';
import { generateVideo } from '../services/geminiService';

export const VeoStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setVideoUrl(null); // Reset previous video
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;

    setIsLoading(true);
    setVideoUrl(null);

    try {
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64Data = image.split(',')[1];
      
      const resultUrl = await generateVideo(base64Data, prompt);
      
      if (resultUrl) {
        setVideoUrl(resultUrl);
      } else {
        alert('Não foi possível gerar o vídeo. Tente novamente.');
      }
    } catch (error) {
      console.error("Veo Error:", error);
      alert('Ocorreu um erro ao comunicar com o Veo. Verifique a sua chave API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Estúdio Mágico Veo</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Transforme as suas fotos em vídeos incríveis usando a mais recente inteligência artificial da Google. 
          Carregue uma imagem e veja a magia acontecer.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 mb-2">1. Carregue a sua imagem</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${image ? 'border-purple-200 bg-purple-50' : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50'}`}
            >
              {image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Alterar
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Clique para carregar foto</p>
                  <p className="text-xs text-slate-400 mt-1">PNG ou JPG</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 mb-2">2. O que deve acontecer? (Opcional)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Movimento cinemático de câmara, luzes a piscar, zoom suave..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[100px]"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!image || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              !image || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Gerando Vídeo (Aprox. 1-2 min)...
              </>
            ) : (
              <>
                <Film className="h-5 w-5" />
                Gerar Vídeo AI
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          {videoUrl ? (
            <div className="w-full space-y-4">
               <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-slate-700">
                 <video 
                   src={videoUrl} 
                   controls 
                   autoPlay 
                   loop 
                   className="w-full h-full object-contain"
                 />
               </div>
               <div className="flex justify-center">
                  <a 
                    href={videoUrl} 
                    download="ol-print-veo.mp4"
                    target="_blank"
                    className="text-white text-sm hover:text-purple-400 underline"
                  >
                    Descarregar Vídeo
                  </a>
               </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              {isLoading ? (
                <div className="flex flex-col items-center animate-pulse">
                   <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-purple-300 font-medium">A Inteligência Artificial está a pensar...</p>
                   <p className="text-xs text-slate-500 mt-2">Isto pode demorar um pouco.</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-slate-600 ml-1" />
                  </div>
                  <p>O seu vídeo aparecerá aqui</p>
                </>
              )}
            </div>
          )}
          
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};