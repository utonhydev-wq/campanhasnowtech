import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
} from 'lucide-react';
import { EditorialPost, CarouselSlide } from '../../types';
import { useCampaigns } from '../../context/CampaignContext';

interface CarouselBuilderModalProps {
  post: EditorialPost;
  onClose: () => void;
}

export const CarouselBuilderModal: React.FC<CarouselBuilderModalProps> = ({ post, onClose }) => {
  const { updateEditorialPost } = useCampaigns();

  const [carouselTitle, setCarouselTitle] = useState(post.carouselTitle || post.theme);
  const [carouselCoverText, setCarouselCoverText] = useState(post.carouselCoverText || '');
  const [carouselClosingText, setCarouselClosingText] = useState(post.carouselClosingText || '');
  const [caption, setCaption] = useState(post.caption || '');
  const [callToAction, setCallToAction] = useState(post.callToAction || '');
  const [hashtags, setHashtags] = useState(post.hashtags || '');

  // Slides array
  const [slides, setSlides] = useState<CarouselSlide[]>(
    post.slides && post.slides.length > 0
      ? post.slides
      : [
          {
            id: 'slide-1',
            slideNumber: 1,
            title: 'Capa: ' + post.theme,
            content: post.carouselCoverText || 'Arraste para o lado e confira 👉',
          },
          {
            id: 'slide-2',
            slideNumber: 2,
            title: 'Desenvolvimento 1',
            content: 'Destaque o ponto principal ou kit participante...',
          },
          {
            id: 'slide-3',
            slideNumber: 3,
            title: 'Desenvolvimento 2',
            content: 'Apresente as vantagens e detalhes comprovados...',
          },
          {
            id: 'slide-4',
            slideNumber: 4,
            title: 'Encerramento & Chamada',
            content: post.callToAction || 'Fale com nossos especialistas no link da bio!',
          },
        ]
  );

  // Active preview slide
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Reorder slide up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    // update slide numbers
    newSlides.forEach((s, idx) => (s.slideNumber = idx + 1));
    setSlides(newSlides);
    setActiveSlideIndex(index - 1);
  };

  // Reorder slide down
  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;
    newSlides.forEach((s, idx) => (s.slideNumber = idx + 1));
    setSlides(newSlides);
    setActiveSlideIndex(index + 1);
  };

  // Add new slide
  const handleAddSlide = () => {
    const newNum = slides.length + 1;
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      slideNumber: newNum,
      title: `Slide ${newNum}`,
      content: 'Conteúdo do slide...',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const [slideError, setSlideError] = useState<string | null>(null);

  // Remove slide
  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 2) {
      setSlideError('Um carrossel deve conter no mínimo 2 slides.');
      setTimeout(() => setSlideError(null), 4000);
      return;
    }
    const filtered = slides.filter((_, i) => i !== index);
    filtered.forEach((s, idx) => (s.slideNumber = idx + 1));
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Update slide content
  const handleUpdateSlide = (index: number, field: keyof CarouselSlide, value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const handleCopyCaption = () => {
    const fullText = `${caption}\n\n${callToAction}\n\n${hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEditorialPost({
      ...post,
      carouselTitle,
      carouselCoverText,
      carouselClosingText,
      caption,
      callToAction,
      hashtags,
      slides,
    });
    onClose();
  };

  const currentPreviewSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Quinta-feira · Carrossel
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-mono">{post.scheduledDate}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Editor de Carrossel de Fotos: {post.theme}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {slideError && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 text-xs text-rose-300 flex items-center justify-between">
            <span>{slideError}</span>
            <button onClick={() => setSlideError(null)} className="text-slate-400 hover:text-white text-xs">
              Fechar
            </button>
          </div>
        )}

        {/* Modal Body: Split view (Left: Slide editor / Right: Smartphone preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Slides management & copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título Central do Carrossel
                </label>
                <input
                  type="text"
                  value={carouselTitle}
                  onChange={(e) => setCarouselTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-medium"
                />
              </div>

              {/* Slide management header */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Sequência de Slides ({slides.length} slides)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Slide</span>
                </button>
              </div>

              {/* Slide list */}
              <div className="space-y-3">
                {slides.map((slide, idx) => {
                  const isCurrent = activeSlideIndex === idx;
                  return (
                    <div
                      key={slide.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-950 border-amber-500/80 ring-1 ring-amber-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                            {slide.slideNumber}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {idx === 0
                              ? 'Slide 1 · Capa'
                              : idx === slides.length - 1
                              ? `Slide ${slide.slideNumber} · Encerramento & CTA`
                              : `Slide ${slide.slideNumber} · Conteúdo`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === slides.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(idx)}
                            disabled={slides.length <= 2}
                            className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20"
                            title="Remover slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                          placeholder="Título do slide..."
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={slide.content}
                          onChange={(e) => handleUpdateSlide(idx, 'content', e.target.value)}
                          placeholder="Texto explicativo ou tópicos do slide..."
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Caption & Hashtags Block */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Legenda Completa da Publicação</span>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCaption ? 'Copiado!' : 'Copiar Legenda'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                  placeholder="Texto persuasivo para o post..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Chamada para Ação (CTA)</label>
                    <input
                      type="text"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Hashtags Estratégicas</label>
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mobile feed simulation preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] space-y-3 sticky top-0">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  Pré-visualização Mobile (Feed 1:1)
                </span>
                <span className="font-mono text-[11px] text-amber-300">
                  Slide {activeSlideIndex + 1} de {slides.length}
                </span>
              </div>

              {/* Mobile Phone Mockup Card */}
              <div className="rounded-2xl bg-slate-950 border-2 border-slate-800 p-3 shadow-xl space-y-3">
                {/* Header in simulated post */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                      NT
                    </div>
                    <div>
                      <span className="font-bold text-white block text-[11px]">nowtechsolar</span>
                      <span className="text-[9px] text-slate-400 block">Patrocinado / Orgânico</span>
                    </div>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">•••</span>
                </div>

                {/* Simulated Carousel Slide Deck */}
                <div className="relative aspect-square rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Decorative Solar accent pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top brand mark in slide */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase">
                      NOWTECH SOLAR · CARROSSEL
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                      {activeSlideIndex + 1}/{slides.length}
                    </span>
                  </div>

                  {/* Slide text content */}
                  <div className="space-y-3 relative z-10 text-center my-auto px-2">
                    <h3 className="text-sm font-extrabold text-white tracking-tight leading-snug">
                      {currentPreviewSlide?.title || 'Título do Slide'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {currentPreviewSlide?.content || 'Conteúdo do slide...'}
                    </p>
                  </div>

                  {/* Bottom footer in slide */}
                  <div className="flex items-center justify-between relative z-10 text-[9px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
                    <span>@nowtechsolar</span>
                    <span className="text-amber-400">Arraste 👉</span>
                  </div>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={activeSlideIndex === 0}
                      onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={activeSlideIndex === slides.length - 1}
                      onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1">
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        onClick={() => setActiveSlideIndex(i)}
                        className={`cursor-pointer rounded-full transition-all ${
                          activeSlideIndex === i
                            ? 'w-4 h-1.5 bg-amber-400'
                            : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Simulated Caption Preview */}
                <div className="text-[11px] text-slate-300 pt-1 space-y-1">
                  <p className="line-clamp-3">
                    <strong className="text-white">nowtechsolar</strong> {caption}
                  </p>
                  <p className="text-amber-400 text-[10px] font-semibold">{callToAction}</p>
                  <p className="text-slate-500 text-[9px] font-mono truncate">{hashtags}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20"
          >
            Salvar Carrossel
          </button>
        </div>
      </div>
    </div>
  );
};
