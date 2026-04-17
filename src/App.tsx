import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import {
  PlusCircle, FolderHeart, Search, Sparkles, Copy, Edit2, Code, Briefcase, PenTool, Globe, Plus, ArrowRight, X, Check, Trash2, GripVertical, AlertTriangle, Lock, Eye, EyeOff
} from 'lucide-react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://centraldedados.dev.br');
pb.autoCancellation(false); // Desativa o cancelamento automático para limpar o console

const Header = ({ onOpenModal, searchQuery, onSearchChange }: { 
  onOpenModal: () => void,
  searchQuery: string,
  onSearchChange: (query: string) => void
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const projectName = import.meta.env.VITE_PROJECT_NAME || "PORTAL DE LINKS DAPS";
  const projectSubtitle = import.meta.env.VITE_SUBTITLE || "Coordenação CAP 5.3";

  return (
    <header className="fixed top-0 right-0 left-0 h-20 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="h-full max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between relative">
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-20 bg-primary flex items-center px-6 sm:hidden"
            >
              <div className="relative flex-grow flex items-center">
                <Search className="absolute left-4 text-neon-blue w-4 h-4" />
                <input 
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-neon-blue/50" 
                  placeholder="Pesquisar..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <button 
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="absolute right-4 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo Section - Left */}
        <div className={`flex flex-col shrink-0 z-10 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white font-headline leading-none">
            {projectName.split(' ').slice(0, -1).join(' ')} <span className="text-neon-blue">{projectName.split(' ').pop()}</span>
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-4 bg-neon-blue/50"></span>
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase font-inter">
              {projectSubtitle}
            </span>
          </div>
        </div>

        {/* Search Bar - Absolutely Centered (Desktop & Tablet) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-6 hidden sm:block">
          <div className="relative group transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 to-neon-blue/0 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-neon-blue/50 focus-within:bg-white/10 transition-all">
              <Search className="absolute left-4 text-white/40 w-4 h-4 group-focus-within:text-neon-blue transition-colors" />
              <input 
                className="w-full bg-transparent pl-12 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none" 
                placeholder="Pesquisar inteligência digital..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Right */}
        <div className={`flex items-center gap-3 shrink-0 z-10 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="sm:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            onClick={onOpenModal}
            className="group relative overflow-hidden bg-neon-blue text-primary text-[10px] font-black px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 md:gap-2.5 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_35px_rgba(0,210,255,0.6)] hover:bg-white uppercase tracking-[0.1em] md:tracking-[0.15em]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <PlusCircle className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden xs:inline">NOVO LINK</span>
            <span className="relative z-10 xs:hidden">NOVO</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const LinkModal = ({ isOpen, onClose, onSave, categories, onAddCategory, onRemoveCategory, onEditCategory, editLink }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (link: any) => void,
  categories: string[],
  onAddCategory: (category: string) => void,
  onRemoveCategory: (category: string) => void,
  onEditCategory: (oldName: string, newName: string) => void,
  editLink?: any
}) => {
  const [formData, setFormData] = useState({
    title: editLink?.title || '',
    url: editLink?.url || '',
    description: editLink?.description || '',
    category: editLink?.tags?.[0] || categories[0] || 'Trabalho',
    icon: editLink?.iconName || (editLink?.isMaterialIcon ? editLink?.icon : 'Sparkles'),
    isMaterialIcon: editLink?.isMaterialIcon || false,
    color: editLink?.color || 'neon-green',
    customColor: editLink?.customColor || ''
  });

  const [iconSearch, setIconSearch] = useState(editLink?.isMaterialIcon ? editLink?.icon : '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isFeatured, setIsFeatured] = useState(editLink?.isFeatured || false);

  // Sincronizar dados ao abrir para edição
  React.useEffect(() => {
    if (editLink) {
      setFormData({
        title: editLink.title,
        url: editLink.url,
        description: editLink.description || '',
        category: editLink.tags?.[0] || categories[0],
        icon: editLink.isMaterialIcon ? editLink.icon : (editLink.iconName || 'Sparkles'),
        isMaterialIcon: editLink.isMaterialIcon,
        color: editLink.color || 'neon-green',
        customColor: editLink.customColor || ''
      });
      setIconSearch(editLink.isMaterialIcon ? editLink.icon : '');
      setIsFeatured(editLink.isFeatured || false);
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        category: categories[0] || 'Trabalho',
        icon: 'Sparkles',
        isMaterialIcon: false,
        color: 'neon-green',
        customColor: ''
      });
      setIconSearch('');
      setIsFeatured(false);
    }
  }, [editLink, categories]);

  const lucideIcons = [
    { name: 'Sparkles', component: Sparkles },
    { name: 'Code', component: Code },
    { name: 'Briefcase', component: Briefcase },
    { name: 'PenTool', component: PenTool },
    { name: 'Globe', component: Globe },
    { name: 'FolderHeart', component: FolderHeart }
  ];

  const materialIcons = [
    'rocket_launch', 'monitoring', 'database', 'shield', 'api', 'terminal',
    'cloud', 'account_tree', 'auto_awesome', 'speed', 'science', 'psychology'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-primary border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black text-white font-headline">{editLink ? 'Editar Link' : 'Configurar Novo Link'}</h2>
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-0.5">{editLink ? 'Atualize as informações do recurso' : 'Inteligência Digital Hub'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Status de Destaque */}
          <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl mb-4">
            <div>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] block">Status de Destaque</span>
              <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Destacar visualmente este recurso</p>
            </div>
            <button 
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-12 h-6 rounded-full transition-all duration-500 relative ${isFeatured ? 'bg-neon-blue shadow-[0_0_15px_rgba(0,210,255,0.4)]' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${isFeatured ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1">Título do Recurso</label>
              <input 
                type="text" 
                placeholder="Ex: Documentação de API"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-neon-blue/50 focus:ring-4 focus:ring-neon-blue/5 outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1">Endereço (URL)</label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-neon-blue/50 focus:ring-4 focus:ring-neon-blue/5 outline-none transition-all"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </div>

          {/* Seção de Identidade Visual acima */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1">Identidade Visual (Ícone)</label>
              <a 
                href="https://fonts.google.com/icons?icon.set=Material+Symbols" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-neon-blue hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-all"
              >
                fonts.google.com <ArrowRight className="w-2 h-2" />
              </a>
            </div>
            
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block">Seleção Rápida</span>
                  <div className="grid grid-cols-6 gap-2">
                    {lucideIcons.map((icon) => (
                      <button
                        key={icon.name}
                        onClick={() => setFormData({...formData, icon: icon.name, isMaterialIcon: false})}
                        className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                          formData.icon === icon.name && !formData.isMaterialIcon
                            ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
                            : 'bg-white/10 border-white/10 text-white/80 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <icon.component className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block">Material Customizado</span>
                  <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                      {formData.isMaterialIcon ? (
                        <span className="material-symbols-rounded text-lg text-white">
                          {formData.icon}
                        </span>
                      ) : (
                        <Search className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <input 
                        type="text"
                        placeholder="Nome do ícone..."
                        className="w-full bg-transparent border-none text-[11px] text-white outline-none placeholder:text-white/40"
                        value={iconSearch}
                        onChange={(e) => {
                          setIconSearch(e.target.value);
                          if (e.target.value.trim()) {
                            setFormData({...formData, icon: e.target.value.trim(), isMaterialIcon: true});
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block">Sugestões Material Icons</span>
                <div className="grid grid-cols-8 gap-2">
                  {materialIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => {
                        setFormData({...formData, icon: icon, isMaterialIcon: true});
                        setIconSearch(icon);
                      }}
                      className={`p-1.5 rounded-xl border transition-all flex items-center justify-center ${
                        formData.icon === icon && formData.isMaterialIcon
                          ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
                          : 'bg-white/10 border-white/10 text-white/60 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="material-symbols-rounded text-base">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Cor abaixo */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1">Aura de Destaque (Cor)</label>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block">Paleta de Destaque</span>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: 'Esmeralda', hex: '#10b981' },
                      { name: 'Ciano', hex: '#06b6d4' },
                      { name: 'Índigo', hex: '#6366f1' },
                      { name: 'Violeta', hex: '#8b5cf6' },
                      { name: 'Rosa', hex: '#ec4899' },
                      { name: 'Laranja', hex: '#f59e0b' },
                      { name: 'Verde Neon', hex: '#39FF14' },
                      { name: 'Azul Neon', hex: '#00D2FF' },
                      { name: 'Amarelo Neon', hex: '#FFF01F' },
                      { name: 'Branco', hex: '#ffffff' },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setFormData({...formData, customColor: color.hex, color: ''})}
                        className={`group relative w-full aspect-square rounded-lg transition-all duration-300 ${
                          formData.customColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-primary scale-90'
                            : 'hover:scale-110 shadow-lg'
                        }`}
                        style={{ backgroundColor: color.hex, boxShadow: formData.customColor.toLowerCase() === color.hex.toLowerCase() ? `0 0 15px ${color.hex}80` : 'none' }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className={`w-3 h-3 ${['#ffffff', '#FFF01F', '#39FF14'].includes(color.hex) ? 'text-black' : 'text-white'}`} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Personalização Avançada</span>
                    <div 
                      className="w-7 h-7 rounded-lg shadow-xl border border-white/20 transition-all duration-500" 
                      style={{ backgroundColor: formData.customColor || '#ffffff', boxShadow: `0 0 20px ${(formData.customColor || '#ffffff')}40` }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/60">HEX</div>
                      <input 
                        type="text" 
                        placeholder="#000000"
                        className="w-full bg-white/10 border border-white/10 rounded-lg pl-9 pr-2 py-2 text-[11px] text-white outline-none focus:border-neon-blue/50 transition-all font-mono placeholder:text-white/40"
                        value={formData.customColor}
                        onChange={(e) => setFormData({...formData, customColor: e.target.value, color: ''})}
                      />
                    </div>
                    <input 
                      type="color"
                      className="w-10 h-9 bg-white/10 border border-white/10 rounded-lg p-1 cursor-pointer hover:bg-white/20 transition-all"
                      value={formData.customColor.startsWith('#') && formData.customColor.length === 7 ? formData.customColor : '#ffffff'}
                      onChange={(e) => setFormData({...formData, customColor: e.target.value, color: ''})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/5">
            <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1 block">Gerenciar Categoria</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Nova categoria..."
                className="flex-grow bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-neon-blue/50 transition-all placeholder:text-white/40"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    onAddCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }
                }}
              />
              <button 
                onClick={() => {
                  if (newCategoryName.trim()) {
                    onAddCategory(newCategoryName.trim());
                    setNewCategoryName('');
                  }
                }}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
              {categories.map((cat) => (
                <div 
                  key={cat}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    formData.category === cat 
                      ? 'bg-neon-blue/20 border-neon-blue text-white' 
                      : 'bg-white/10 border-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setFormData({...formData, category: cat})}
                >
                  {editingCategory === cat ? (
                    <input
                      autoFocus
                      type="text"
                      className="bg-white/10 border-none text-[9px] font-black uppercase tracking-widest text-white outline-none w-20"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => {
                        if (editingValue.trim() && editingValue.trim() !== cat) {
                          onEditCategory(cat, editingValue.trim());
                        }
                        setEditingCategory(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingValue.trim() && editingValue.trim() !== cat) {
                            onEditCategory(cat, editingValue.trim());
                          }
                          setEditingCategory(null);
                        }
                        if (e.key === 'Escape') setEditingCategory(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-widest">{cat}</span>
                  )}
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setEditingValue(cat);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all"
                      title="Editar Categoria"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCategory(cat);
                      }}
                      className="p-1 rounded hover:bg-error/20 text-white/40 hover:text-error transition-all"
                      title="Excluir Categoria"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl text-xs font-black text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest border border-white/5 hover:border-white/20"
          >
            CANCELAR
          </button>
          <button 
            onClick={() => onSave({...formData, isFeatured})}
            className="flex-1 relative group overflow-hidden bg-neon-blue text-primary px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_40px_rgba(0,210,255,0.6)] hover:bg-white uppercase tracking-widest"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10">SALVAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterChips = ({ categories, activeFilter, onFilterChange }: { categories: string[], activeFilter: string, onFilterChange: (filter: string) => void }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  React.useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const offsetWidth = containerRef.current.offsetWidth;
      setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    }
  }, [categories]);

  return (
    <div className="relative mb-14 w-full px-1">
      {/* Efeito de fade nas bordas para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <div className="overflow-hidden w-full">
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.15}
          className="flex gap-4 cursor-grab active:cursor-grabbing select-none w-max px-4 py-2"
        >
          {['Todos os Links', ...categories].map((filter) => (
            <button 
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`relative group px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap overflow-hidden ${
                activeFilter === filter 
                  ? 'text-primary shadow-[0_10px_30px_-10px_rgba(0,210,255,0.6)] border border-neon-blue' 
                  : 'bg-white text-primary/50 border border-primary/5 hover:border-primary/15 hover:text-primary hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {/* Background animado para o item ativo */}
              {activeFilter === filter && (
                <div className="absolute inset-0 bg-neon-blue pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                </div>
              )}
              
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

interface LinkCardProps {
  key?: any;
  icon: any;
  iconColor?: string;
  glowColor?: string;
  title: string;
  url: string;
  tags: string[];
  isFeatured?: boolean;
  isMaterialIcon?: boolean;
  customColor?: string;
  onEdit: () => void;
  onDelete: () => void;
  item: any;
}

const LinkCard = ({ 
  icon: Icon, 
  iconColor = '', 
  glowColor = '',
  title, 
  url, 
  tags, 
  isFeatured = false,
  isMaterialIcon = false,
  customColor = '',
  onEdit,
  onDelete,
  item
}: LinkCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Só abre o link se não for clique nos botões de ação (tratado pelo stopPropagation)
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Reorder.Item
      value={item}
      id={item.id.toString()}
      layout
      onClick={handleCardClick}
      className={`group rounded-2xl p-6 flex flex-col justify-between min-h-[230px] relative overflow-hidden border transition-all duration-500 cursor-pointer select-none ${
        isFeatured 
          ? 'bg-gradient-to-br from-primary-container to-primary border-white/20 shadow-xl' 
          : 'bg-primary border-white/5 hover:border-white/10'
      } hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -8 }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 50,
        cursor: "grabbing",
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.7)",
        backgroundColor: "rgba(10, 25, 41, 1)"
      }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }}
    >
      {/* Overlay de Brilho Suave */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/0 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Botões de Ação - Topo Direito */}
      <div className="absolute top-4 right-4 flex gap-2 z-20 transition-all duration-500">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-neon-blue hover:bg-white/10 hover:border-neon-blue/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          title="Editar Recurso"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-error hover:bg-error/10 hover:border-error/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-[50ms] shadow-lg"
          title="Excluir Recurso"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grip de Arrastar - Topo Centro */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity cursor-grab active:cursor-grabbing p-1 z-10">
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2 border-2 transition-all duration-500 bg-black/40 mb-5 ${glowColor} group-hover:scale-110 group-hover:rotate-3`}
            style={customColor ? { borderColor: `${customColor}80`, boxShadow: `0 0 20px ${customColor}30` } : {}}
          >
            {isMaterialIcon ? (
              <span className="material-symbols-rounded text-3xl" style={customColor ? { color: customColor } : { color: 'inherit' }}>
                {Icon}
              </span>
            ) : (
              <Icon className={`w-7 h-7 ${iconColor}`} style={customColor ? { color: customColor } : {}} />
            )}
          </div>
          
          <h3 className="text-xl font-black font-headline text-white mb-2 truncate group-hover:text-neon-blue transition-colors duration-300 tracking-tight">
            {title}
          </h3>
          <p className="text-[11px] text-white/40 font-bold font-body mb-6 truncate uppercase tracking-[0.2em] flex items-center gap-2">
            <Globe className="w-3 h-3 opacity-30" />
            {url.replace('https://', '').replace('http://', '').split('/')[0]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] uppercase font-black tracking-widest text-white/30 group-hover:text-white/60 group-hover:border-white/10 transition-all">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Indicador de Link - Canto Inferior Direito */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
        <div className="p-2 rounded-full bg-neon-blue/10 border border-neon-blue/20 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
          <ArrowRight className="w-4 h-4 text-neon-blue" />
        </div>
      </div>
    </Reorder.Item>
  );
};

const Insights = ({ links, categories }: { links: any[], categories: any[] }) => {
  const totalLinks = links.length;
  const totalCategories = categories.length;
  const featuredLinks = links.filter(l => l.isFeatured).length;
  
  // Cálculo de porcentagens para as barras de progresso (exemplo baseado em metas)
  const indexacao = Math.min(Math.round((totalLinks / 50) * 100), 100);
  const curadoria = Math.min(Math.round((featuredLinks / (totalLinks || 1)) * 100), 100);
  const otimizacao = Math.min(Math.round((totalCategories / 15) * 100), 100);

  return (
    <div className="mt-16 mb-12">
      <div className="bg-primary border border-white/5 rounded-2xl p-10 overflow-hidden relative flex flex-col justify-between shadow-2xl">
        <div className="absolute inset-0 z-[-1]">
          <img 
            className="w-full h-full object-cover grayscale opacity-20" 
            alt="Modern workspace" 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4 opacity-50">
              <div className="h-[1px] w-8 bg-neon-blue/50"></div>
              <Sparkles className="w-3 h-3 text-neon-blue" />
              <div className="h-[1px] w-8 bg-neon-blue/50"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-headline tracking-tight leading-none mb-3">
              MÉTRICAS DA <span className="text-neon-blue">UTILIZAÇÃO</span> DOS LINKS
            </h2>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.4em] uppercase">
              Inteligência Digital • Performance em Tempo Real
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'LINKS TOTAIS', value: totalLinks.toString(), sub: 'Recursos ativos no Vault', icon: Sparkles, color: 'text-neon-blue' },
              { label: 'EM DESTAQUE', value: featuredLinks.toString(), sub: 'Links com alta prioridade', icon: Briefcase, color: 'text-neon-green' },
              { label: 'CATEGORIAS', value: totalCategories.toString(), sub: 'Filtros de organização', icon: FolderHeart, color: 'text-neon-yellow' },
              { label: 'UPTIME HUB', value: '99.9%', sub: 'Sincronizado via PB', icon: Globe, color: 'text-neon-blue' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{i + 1}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1 leading-none">{stat.value}</div>
                <div className="text-[11px] font-bold text-white mb-0.5 leading-tight">{stat.label}</div>
                <div className="text-[9px] font-medium text-white/50 uppercase tracking-tighter">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-28 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-blue transition-all duration-1000" style={{ width: `${indexacao}%`, boxShadow: '0 0 8px rgba(0,210,255,0.6)' }}></div>
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Indexação {indexacao}%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-28 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-green transition-all duration-1000" style={{ width: `${curadoria}%`, boxShadow: '0 0 8px rgba(57,255,20,0.6)' }}></div>
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Curadoria {curadoria}%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-28 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-yellow transition-all duration-1000" style={{ width: `${otimizacao}%`, boxShadow: '0 0 8px rgba(255,240,31,0.6)' }}></div>
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Otimização {otimizacao}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const projectName = import.meta.env.VITE_PROJECT_NAME || "PORTAL DE LINKS DAPS";
  const projectSubtitle = import.meta.env.VITE_SUBTITLE || "Coordenação CAP 5.3";

  return (
    <footer className="mt-24 py-12 border-t border-white/5 bg-primary/95 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Lado Esquerdo: Autoria Minimalista */}
          <div className="flex flex-col items-center md:items-start group">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-white/80 transition-colors duration-500">
              Fabio Ferreira de Oliveira
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-neon-blue/60 text-[10px] font-black uppercase tracking-[0.2em]">{projectSubtitle.replace('Coordenação ', '')}</span>
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
              <span className="text-white/30 text-[10px] font-medium uppercase tracking-widest">Desenvolvedor</span>
            </div>
          </div>

          {/* Lado Direito: Copyright e Status Discreto */}
          <div className="flex flex-col items-center md:items-end opacity-40 hover:opacity-100 transition-opacity duration-500">
            <p className="text-white text-[9px] font-bold uppercase tracking-[0.2em] mb-1">
              © 2026 {projectName}
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_8px_#39FF14]"></div>
              <span className="text-white/40 text-[8px] font-black uppercase tracking-widest leading-none">Status: Ativo</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brilho de fundo mais sutil */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
    </footer>
  );
};

const AuthModal = ({ config, onClose, onSuccess }: { config: any, onClose: () => void, onSuccess: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!config.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const systemPassword = import.meta.env.VITE_SYSTEM_PASSWORD || 'daps2022';
    if (password === systemPassword) {
      setPassword('');
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-primary border w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col ${config.isDelete ? 'border-error/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${config.isDelete ? 'bg-error/10 border-error/20' : 'bg-white/[0.02] border-white/5'}`}>
          <div className="flex items-center gap-3">
            {config.isDelete ? <AlertTriangle className="w-6 h-6 text-error" /> : <Lock className="w-6 h-6 text-neon-blue" />}
            <div>
              <h2 className={`text-lg font-black font-headline ${config.isDelete ? 'text-error' : 'text-white'}`}>{config.title}</h2>
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-0.5">Acesso Restrito DAPS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {config.isDelete && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-center">
              <p className="text-error font-bold text-xs uppercase tracking-widest mb-1">Atenção! Ação Irreversível</p>
              <p className="text-white/70 text-sm">Você está prestes a excluir definitivamente o link:</p>
              <p className="text-white font-black mt-2 text-lg">{config.itemName}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] ml-1 block">Senha de Autorização</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-error' : 'text-white/40'}`} />
              <input 
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Insira a senha..."
                className={`w-full bg-white/5 border rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all ${
                  error ? 'border-error/50 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-white/10 focus:border-neon-blue/50 focus:ring-4 focus:ring-neon-blue/5'
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-neon-blue transition-colors outline-none focus:text-neon-blue"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-error text-[10px] font-bold uppercase tracking-widest ml-1 mt-2">Senha incorreta. Tente novamente.</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-xs font-black text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest border border-white/5"
            >
              CANCELAR
            </button>
            <button 
              type="submit"
              className={`flex-1 relative group overflow-hidden px-4 py-3 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${
                config.isDelete 
                  ? 'bg-error text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]' 
                  : 'bg-neon-blue text-primary shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_40px_rgba(0,210,255,0.6)] hover:bg-white'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">{config.isDelete ? 'CONFIRMAR EXCLUSÃO' : 'AUTORIZAR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [links, setLinks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // Nome -> ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos os Links');
  const [isLoading, setIsLoading] = useState(true);

  const [authConfig, setAuthConfig] = useState<{
    isOpen: boolean;
    action: (() => void) | null;
    title: string;
    isDelete: boolean;
    itemName?: string;
  }>({
    isOpen: false,
    action: null,
    title: '',
    isDelete: false
  });

  const requireAuth = (title: string, action: () => void, isDelete = false, itemName = '') => {
    setAuthConfig({
      isOpen: true,
      action,
      title,
      isDelete,
      itemName
    });
  };

  // Carregar dados iniciais do PocketBase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Buscar Categorias
      const catRecords = await pb.collection('portaldelinks_categories').getFullList({
        sort: 'name',
      });
      setCategories(catRecords.map(c => c.name));
      
      const map: Record<string, string> = {};
      catRecords.forEach(c => map[c.name] = c.id);
      setCategoryMap(map);

      // Buscar Links
      const linkRecords = await pb.collection('portaldelinks_links').getFullList({
        sort: 'order',
      });
      
      const colorGlows: Record<string, string> = {
        'neon-green': "border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.4)]",
        'neon-blue': "border-neon-blue/50 shadow-[0_0_15px_rgba(0,210,255,0.4)]",
        'neon-yellow': "border-neon-yellow/50 shadow-[0_0_15px_rgba(255,240,31,0.4)]"
      };

      const iconColors: Record<string, string> = {
        'neon-green': "text-neon-green",
        'neon-blue': "text-neon-blue",
        'neon-yellow': "text-neon-yellow"
      };

      // Mapear dados do PB para o formato do App
      const formattedLinks = linkRecords.map(record => ({
        id: record.id,
        title: record.title,
        url: record.url,
        description: record.description,
        icon: record.icon,
        iconName: record.is_material_icon ? '' : record.icon,
        isMaterialIcon: record.is_material_icon,
        color: record.color_preset,
        customColor: record.custom_color,
        tags: [catRecords.find(c => c.id === record.category)?.name || 'Sem Categoria'],
        isFeatured: record.is_featured,
        order: record.order,
        iconColor: record.custom_color ? '' : (iconColors[record.color_preset] || 'text-white'),
        glowColor: record.custom_color ? '' : (colorGlows[record.color_preset] || '')
      }));
      
      setLinks(formattedLinks);
    } catch (error: any) {
      // Ignorar erro de autocancelamento (comum no React StrictMode)
      if (error?.isAbort) return;
      
      if (error?.status === 403) {
        console.error("Erro de Permissão: Verifique se as regras da API no PocketBase estão abertas (Públicas) para as coleções.");
      } else {
        console.error("Erro ao carregar dados:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const iconMap: any = { Sparkles, Code, Briefcase, PenTool, Globe, FolderHeart };
  
  const requestOpenModal = (link: any = null) => {
    requireAuth(
      link ? 'Autenticação Necessária (Editar)' : 'Autenticação Necessária (Adicionar)',
      () => handleOpenModal(link)
    );
  };

  const requestDeleteLink = (link: any) => {
    requireAuth(
      'Exclusão de Link',
      () => handleDeleteLink(link.id),
      true,
      link.title
    );
  };

  const handleOpenModal = (link: any = null) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleSaveLink = async (formData: any) => {
    try {
      const categoryId = categoryMap[formData.category];
      
      const pbData = {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        category: categoryId,
        icon: formData.icon,
        is_material_icon: formData.isMaterialIcon,
        color_preset: formData.color,
        custom_color: formData.customColor,
        is_featured: formData.isFeatured || false,
        order: editingLink ? editingLink.order : links.length
      };

      if (editingLink) {
        await pb.collection('portaldelinks_links').update(editingLink.id, pbData);
      } else {
        await pb.collection('portaldelinks_links').create(pbData);
      }
      
      await fetchData(); // Recarregar dados
      setIsModalOpen(false);
      setEditingLink(null);
    } catch (error: any) {
      if (error.data) {
        console.error("Erro de validação do PocketBase (verifique os campos):", error.data);
      }
      console.error("Erro ao salvar link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await pb.collection('portaldelinks_links').delete(id);
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error("Erro ao excluir link:", error);
    }
  };

  const handleAddCategory = async (newCat: string) => {
    if (!categories.includes(newCat)) {
      try {
        await pb.collection('portaldelinks_categories').create({ name: newCat });
        await fetchData();
      } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
      }
    }
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    if (categories.includes(newName)) return;
    try {
      const categoryId = categoryMap[oldName];
      await pb.collection('portaldelinks_categories').update(categoryId, { name: newName });
      await fetchData();
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
    }
  };

  const handleRemoveCategory = async (catToRemove: string) => {
    try {
      const categoryId = categoryMap[catToRemove];
      await pb.collection('portaldelinks_categories').delete(categoryId);
      await fetchData();
      if (activeFilter === catToRemove) setActiveFilter('Todos os Links');
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesFilter = activeFilter === 'Todos os Links' || link.tags.includes(activeFilter);
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 border-t-neon-blue rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white font-black tracking-[0.3em] uppercase text-xs animate-pulse">Sincronizando Vault</span>
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">DAPS / CAP 5.3</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-primary min-h-screen font-body">
      <AuthModal 
        config={authConfig} 
        onClose={() => setAuthConfig({ ...authConfig, isOpen: false })} 
        onSuccess={() => {
          if (authConfig.action) authConfig.action();
        }} 
      />
      <Header 
        onOpenModal={() => requestOpenModal()} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <LinkModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }} 
        onSave={handleSaveLink}
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
        onEditCategory={handleEditCategory}
        editLink={editingLink}
      />
      
      <main className="pt-24 md:pt-32 px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        <FilterChips 
          categories={categories} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <Reorder.Group 
          axis="x" 
          values={filteredLinks} 
          onReorder={async (newOrder) => {
            const isOrderChanged = JSON.stringify(newOrder.map(l => l.id)) !== JSON.stringify(filteredLinks.map(l => l.id));
            if (!isOrderChanged) return;

            // Atualização local imediata para fluidez
            const updatedLinks = [...links];
            newOrder.forEach((item, index) => {
              const idx = updatedLinks.findIndex(l => l.id === item.id);
              updatedLinks[idx] = { ...item, order: index };
            });
            setLinks(updatedLinks);

            // Persistir nova ordem no PocketBase
            try {
              await Promise.all(
                newOrder.map((item, index) => 
                  pb.collection('portaldelinks_links').update(item.id, { order: index })
                )
              );
            } catch (error) {
              console.error("Erro ao salvar nova ordem:", error);
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layoutScroll
        >
          <AnimatePresence mode="popLayout">
            {filteredLinks.map((link) => (
              <LinkCard 
                key={link.id}
                item={link}
                icon={link.isMaterialIcon ? link.icon : iconMap[link.icon]} 
                iconColor={link.iconColor} 
                glowColor={link.glowColor}
                title={link.title} 
                url={link.url} 
                tags={link.tags} 
                isFeatured={link.isFeatured}
                isMaterialIcon={link.isMaterialIcon}
                customColor={link.customColor}
                onEdit={() => requestOpenModal(link)}
                onDelete={() => requestDeleteLink(link)}
              />
            ))}
          </AnimatePresence>
          
          {/* Botão estático fora da reordenação */}
          <div className="h-full">
            <button 
              onClick={() => requestOpenModal()}
              className="w-full h-full group border-2 border-dashed border-white/5 rounded-2xl p-6 transition-colors duration-500 bg-primary/40 hover:border-neon-blue/40 hover:bg-primary-container/20 flex flex-col items-center justify-center min-h-[220px] gap-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-neon-blue/30 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                <Plus className="w-7 h-7 text-white/40 group-hover:text-neon-blue transition-colors duration-500" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">Adicionar Novo</span>
                <span className="text-[9px] text-white/20 font-black uppercase tracking-widest group-hover:text-neon-blue/50 transition-colors duration-500">Link no Vault</span>
              </div>
            </button>
          </div>
        </Reorder.Group>
        
        <Insights links={links} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
