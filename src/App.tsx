import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToolCard from './components/ToolCard';
import ToolWorkspace from './components/ToolWorkspace';
import { TOOLS } from './data/tools';
import { Tool } from './types';
import { Search, ShieldAlert, Sparkles, Sliders, CheckSquare, File, Upload } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'pdf' | 'image' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // General home drop suggestion popover state
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [suggestedTools, setSuggestedTools] = useState<Tool[]>([]);
  const homeFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load and apply dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // General Drag and Drop on Homepage Hero Handlers
  const handleHomeDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleHomeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleGeneralFilesInput(Array.from(e.dataTransfer.files));
    }
  };

  const handleHomeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleGeneralFilesInput(Array.from(e.target.files));
    }
  };

  // Helper to suggest appropriate tools based on uploaded file type
  const handleGeneralFilesInput = (files: File[]) => {
    if (files.length === 0) return;
    setDroppedFiles(files);
    
    const file = files[0];
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');

    let suggestions: Tool[] = [];
    if (isPdf) {
      suggestions = TOOLS.filter(t => t.id === 'merge-pdf' || t.id === 'split-pdf' || t.id === 'compress-pdf' || t.id === 'pdf-to-word' || t.id === 'rotate-pdf');
    } else if (isImage) {
      suggestions = TOOLS.filter(t => t.id === 'image-compressor' || t.id === 'jpg-png' || t.id === 'remove-bg' || t.id === 'jpg-to-pdf' || t.id === 'ocr-image');
    } else if (isTxt) {
      suggestions = TOOLS.filter(t => t.id === 'txt-pdf');
    } else {
      // General fallbacks
      suggestions = TOOLS.slice(0, 5);
    }

    setSuggestedTools(suggestions);
  };

  const launchSuggestedTool = (tool: Tool) => {
    // Navigate straight to the tool and initialize files inside the workspace
    setActiveTool(tool);
    
    // We clear home state
    setDroppedFiles([]);
    setSuggestedTools([]);
  };

  // Filter tools based on category selection and search query
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-slate-200 font-sans relative overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* HEADER */}
      <Header
        onBackToHome={() => {
          setActiveTool(null);
          setDroppedFiles([]);
          setSuggestedTools([]);
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isInWorkspace={!!activeTool}
      />

      {/* MAIN BODY CONTAINER */}
      <main className="flex-1 z-10">
        {activeTool ? (
          /* WORKSPACE VIEW */
          <ToolWorkspace
            tool={activeTool}
            onBack={() => {
              setActiveTool(null);
              setDroppedFiles([]);
              setSuggestedTools([]);
            }}
          />
        ) : (
          /* HOMEPAGE GRID VIEW */
          <div className="py-12 md:py-16">
            
            {/* HERO SECTION */}
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 mb-16">
              
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" /> Free Sandbox Suite
              </span>

              <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]">
                Convert & Manage Documents <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">
                  Without Limits.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-sm md:text-base leading-relaxed font-sans font-medium">
                Fast, secure, and free. No accounts, no installation, just drop and convert. 
                All document files are processed 100% locally inside your browser for ultimate privacy.
              </p>

              {/* DYNAMIC HERO DROP ZONE & FILE SUGGESTION PANEL */}
              <div className="mt-10 max-w-3xl mx-auto">
                {droppedFiles.length === 0 ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-35 transition pointer-events-none"></div>
                    <div
                      onDragEnter={handleHomeDrag}
                      onDragOver={handleHomeDrag}
                      onDragLeave={handleHomeDrag}
                      onDrop={handleHomeDrop}
                      onClick={() => homeFileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                        dragActive
                          ? 'border-indigo-400 bg-white/[0.08]'
                          : 'border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-indigo-500/50'
                      }`}
                      id="home-drop-zone"
                    >
                      <input
                        type="file"
                        ref={homeFileInputRef}
                        onChange={handleHomeFileSelect}
                        className="hidden"
                      />
                      <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-lg font-semibold text-white">Drag & drop files here</p>
                        <p className="text-sm text-slate-500 mt-1">Supported: PDF, JPG, PNG, WEBP, DOCX, XLSX, TXT</p>
                      </div>
                      <button className="mt-5 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full transition shadow-lg shadow-indigo-500/30">
                        Select Files
                      </button>
                    </div>
                  </div>
                ) : (
                  /* FILE SUGGESTION DROPDOWN POPPING OUT */
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xl text-left animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <File className="h-5 w-5 text-indigo-400 animate-pulse" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            {droppedFiles[0].name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(droppedFiles[0].size / 1024 / 1024).toFixed(2)} MB • Detected Format
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDroppedFiles([])}
                        className="text-xs text-slate-400 hover:text-red-400 font-bold uppercase cursor-pointer"
                        id="cancel-drop-btn"
                      >
                        Reset
                      </button>
                    </div>

                    <h4 className="text-xs.5 font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                      <Sliders className="h-4 w-4" /> Recommended Tools for your File
                    </h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Select one of our browser tools below to instantly process, convert, or adjust this document:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {suggestedTools.map((suggestedTool) => (
                        <button
                          key={suggestedTool.id}
                          onClick={() => launchSuggestedTool(suggestedTool)}
                          className="flex items-center gap-3 p-3 text-left rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.08] bg-white/5 transition-all cursor-pointer"
                          id={`suggested-tool-${suggestedTool.id}`}
                        >
                          <div className="h-8.5 w-8.5 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <svg
                              className="h-4.5 w-4.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white truncate max-w-[150px]">
                              {suggestedTool.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Instant Client-Side
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* TRUST CRITERIA STATS BANNER */}
            <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-6 mb-16">
              <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-8 text-center">
                <div>
                  <h3 className="text-2xl font-black text-indigo-400">35+</h3>
                  <p className="text-xs text-slate-455 text-slate-400 mt-1 font-semibold">Premium Online Tools</p>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-purple-400">100% Private</h3>
                  <p className="text-xs text-slate-455 text-slate-400 mt-1 font-semibold">Browser-Level Sandboxed</p>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-pink-400">No Signups</h3>
                  <p className="text-xs text-slate-455 text-slate-400 mt-1 font-semibold">Free and Accessible to All</p>
                </div>
              </div>
            </div>

            {/* TOOLS AREA: SEARCH & FILTER CARDS */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Search Box & Category Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight text-white">
                    Explore Conversion Tools
                  </h2>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/5">
                    {filteredTools.length} total
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search any tool (e.g. compress)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-xs text-white focus:border-indigo-500/50 focus:outline-hidden"
                    id="search-tools-input"
                  />
                </div>
              </div>

              {/* Mobile Category Filters Navigation */}
              <div className="flex md:hidden items-center justify-center gap-1 mb-8 overflow-x-auto py-1">
                {(['all', 'pdf', 'image', 'document'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider shrink-0 cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-white/15 text-white border border-white/10'
                        : 'bg-white/5 border border-white/5 text-slate-400'
                    }`}
                    id={`mobile-cat-${cat}`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              {/* TOOLS GRID */}
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelect={(t) => setActiveTool(t)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 py-12 px-4 text-center max-w-md mx-auto">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white">
                    No tools match your search
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Try using broader keywords or checking different category tabs.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
