import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { 
  auth, 
  db, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDocs, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  writeBatch 
} from "./lib/firebase";
import AuthScreen from "./components/AuthScreen";
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Save, 
  Plus, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  Camera, 
  Trash2, 
  FileText,
  Printer,
  ClipboardList,
  Download,
  Pencil,
  Library,
  X,
  Sparkles,
  Wand2,
  Copy,
  Search
} from "lucide-react";

// ── Função de ícone removida (usuário pediu para limpar) ──────────────────
// Mantendo apenas um ícone padrão sutil para estrutura
const ICONE_PADRAO = <ClipboardList className="w-5 h-5 text-slate-400" />;

const TURMAS = [
  { id: "mini-maternal-azul",         label: "Mini e Maternal Azul",        cor: "#14B8A6" }, // Verde água
  { id: "infantil1-azul",             label: "Infantil 1 Azul",             cor: "#14B8A6" }, // Verde água
  { id: "infantil2-azul",             label: "Infantil 2 Azul",             cor: "#14B8A6" }, // Verde água
  { id: "1ano-azul",                  label: "1º Ano Azul",                 cor: "#DC2626" }, // Vermelho
  { id: "2ano-azul-vermelho",         label: "2º Ano Azul e Vermelho",      cor: "#DC2626" }, // Vermelho
  { id: "3ano-azul-vermelho",         label: "3º Ano Azul e Vermelho",      cor: "#2563EB" }, // Azul
  { id: "4ano-azul",                  label: "4º Ano Azul",                 cor: "#2563EB" }, // Azul
  { id: "5ano-azul",                  label: "5º Ano Azul",                 cor: "#2563EB" }, // Azul
  { id: "6ano-azul",                  label: "6º Ano Azul",                 cor: "#2563EB" }, // Azul
];

const ATIVIDADES_PADRAO: any = {
  "mini-maternal-azul": [
    { id: "mm1",  nome: "Artes:",                 descricao: "" },
    { id: "mm2",  nome: "Balé:",                  descricao: "" },
    { id: "mm3",  nome: "Caixa de Brinquedos:",   descricao: "" },
    { id: "mm4",  nome: "Contação de História:",  descricao: "" },
    { id: "mm5",  nome: "Culinária:",             descricao: "" },
    { id: "mm6",  nome: "Devocional:",            descricao: "" },
    { id: "mm7",  nome: "Judô:",                  descricao: "" },
    { id: "mm8",  nome: "Lego:",                  descricao: "" },
    { id: "mm9",  nome: "Motoca:",                descricao: "" },
    { id: "mm10", nome: "Música:",                descricao: "" },
    { id: "mm11", nome: "Natação:",               descricao: "" },
    { id: "mm12", nome: "Projetos:",              descricao: "" },
    { id: "mm13", nome: "Psicomotricidade:",      descricao: "" }
  ],
  "infantil1-azul": [
    { id: "i1-1",  nome: "Artes:",                 descricao: "" },
    { id: "i1-2",  nome: "Balé:",                  descricao: "" },
    { id: "i1-3",  nome: "Caixa de Brinquedos:",   descricao: "" },
    { id: "i1-4",  nome: "Contação de História:",  descricao: "" },
    { id: "i1-5",  nome: "Culinária:",             descricao: "" },
    { id: "i1-6",  nome: "Devocional:",            descricao: "" },
    { id: "i1-7",  nome: "Judô:",                  descricao: "" },
    { id: "i1-8",  nome: "Lego:",                  descricao: "" },
    { id: "i1-9",  nome: "Música:",                descricao: "" },
    { id: "i1-10", nome: "Natação:",               descricao: "" },
    { id: "i1-11", nome: "Projetos:",              descricao: "" },
    { id: "i1-12", nome: "Psicomotricidade:",      descricao: "" }
  ],
  "infantil2-azul": [
    { id: "i2-1",  nome: "Artes:",                 descricao: "" },
    { id: "i2-2",  nome: "Balé:",                  descricao: "" },
    { id: "i2-3",  nome: "Caixa de Brinquedos:",   descricao: "" },
    { id: "i2-4",  nome: "Contação de História:",  descricao: "" },
    { id: "i2-5",  nome: "Culinária:",             descricao: "" },
    { id: "i2-6",  nome: "Devocional:",            descricao: "" },
    { id: "i2-7",  nome: "Judô:",                  descricao: "" },
    { id: "i2-8",  nome: "Lego:",                  descricao: "" },
    { id: "i2-9",  nome: "Música:",                descricao: "" },
    { id: "i2-10", nome: "Natação:",               descricao: "" },
    { id: "i2-11", nome: "Projetos:",              descricao: "" },
    { id: "i2-12", nome: "Psicomotricidade:",      descricao: "" }
  ],
  "1ano-azul": [
    { id: "1a1",  nome: "Artes:",                 descricao: "" },
    { id: "1a2",  nome: "Balé:",                  descricao: "" },
    { id: "1a3",  nome: "Caixa de Brinquedos:",   descricao: "" },
    { id: "1a4",  nome: "Contação de História:",  descricao: "" },
    { id: "1a5",  nome: "Coral e Canto:",         descricao: "" },
    { id: "1a6",  nome: "Culinária:",             descricao: "" },
    { id: "1a7",  nome: "Devocional:",            descricao: "" },
    { id: "1a8",  nome: "Flauta:",                descricao: "" },
    { id: "1a9",  nome: "Informática:",           descricao: "" },
    { id: "1a10", nome: "Judô:",                  descricao: "" },
    { id: "1a11", nome: "Lego:",                  descricao: "" },
    { id: "1a12", nome: "Leitura de Gibi:",       descricao: "" },
    { id: "1a13", nome: "Natação:",               descricao: "" },
    { id: "1a14", nome: "Projetos:",              descricao: "" },
    { id: "1a15", nome: "Psicomotricidade:",      descricao: "" },
    { id: "1a16", nome: "Quadra B:",              descricao: "" },
    { id: "1a17", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "1a18", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "1a19", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "1a20", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "1a21", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
  "2ano-azul-vermelho": [
    { id: "2av1",  nome: "Artes:",                 descricao: "" },
    { id: "2av2",  nome: "Caixa de Jogos:",        descricao: "" },
    { id: "2av3",  nome: "Contação de História:",  descricao: "" },
    { id: "2av4",  nome: "Coral:",                 descricao: "" },
    { id: "2av5",  nome: "Culinária:",             descricao: "" },
    { id: "2av6",  nome: "Dança:",                 descricao: "" },
    { id: "2av7",  nome: "Devocional:",            descricao: "" },
    { id: "2av8",  nome: "Flauta:",                descricao: "" },
    { id: "2av9",  nome: "Futebol:",               descricao: "" },
    { id: "2av10", nome: "Ginástica:",             descricao: "" },
    { id: "2av11", nome: "Informática:",           descricao: "" },
    { id: "2av12", nome: "Judô:",                  descricao: "" },
    { id: "2av13", nome: "Lego:",                  descricao: "" },
    { id: "2av14", nome: "Leitura de Gibi:",       descricao: "" },
    { id: "2av15", nome: "Natação:",               descricao: "" },
    { id: "2av16", nome: "Projetos:",              descricao: "" },
    { id: "2av17", nome: "Psicomotricidade:",      descricao: "" },
    { id: "2av18", nome: "Quadra B:",              descricao: "" },
    { id: "2av19", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "2av20", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "2av21", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "2av22", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "2av23", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
  "3ano-azul-vermelho": [
    { id: "3av1",  nome: "Artes:",                 descricao: "" },
    { id: "3av2",  nome: "Caixa de Jogos:",        descricao: "" },
    { id: "3av3",  nome: "Contação de História:",  descricao: "" },
    { id: "3av4",  nome: "Coral:",                 descricao: "" },
    { id: "3av5",  nome: "Culinária:",             descricao: "" },
    { id: "3av6",  nome: "Dança:",                 descricao: "" },
    { id: "3av7",  nome: "Devocional:",            descricao: "" },
    { id: "3av8",  nome: "Flauta:",                descricao: "" },
    { id: "3av9",  nome: "Futebol:",               descricao: "" },
    { id: "3av10", nome: "Ginástica:",             descricao: "" },
    { id: "3av11", nome: "Informática:",           descricao: "" },
    { id: "3av12", nome: "Judô:",                  descricao: "" },
    { id: "3av13", nome: "Lego:",                  descricao: "" },
    { id: "3av14", nome: "Leitura de Gibi:",       descricao: "" },
    { id: "3av15", nome: "Natação:",               descricao: "" },
    { id: "3av16", nome: "Projetos:",              descricao: "" },
    { id: "3av17", nome: "Psicomotricidade:",      descricao: "" },
    { id: "3av18", nome: "Quadra B:",              descricao: "" },
    { id: "3av19", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "3av20", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "3av21", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "3av22", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "3av23", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
  "4ano-azul": [
    { id: "4a1",  nome: "Artes:",                 descricao: "" },
    { id: "4a2",  nome: "Caixa de Jogos:",        descricao: "" },
    { id: "4a3",  nome: "Contação de História:",  descricao: "" },
    { id: "4a4",  nome: "Coral:",                 descricao: "" },
    { id: "4a5",  nome: "Culinária:",             descricao: "" },
    { id: "4a6",  nome: "Dança:",                 descricao: "" },
    { id: "4a7",  nome: "Devocional:",            descricao: "" },
    { id: "4a8",  nome: "Flauta:",                descricao: "" },
    { id: "4a9",  nome: "Futebol:",               descricao: "" },
    { id: "4a10", nome: "Ginástica:",             descricao: "" },
    { id: "4a11", nome: "Informática:",           descricao: "" },
    { id: "4a12", nome: "Judô:",                  descricao: "" },
    { id: "4a13", nome: "Lego:",                  descricao: "" },
    { id: "4a14", nome: "Leitura de Gibi:",       descricao: "" },
    { id: "4a15", nome: "Natação:",               descricao: "" },
    { id: "4a16", nome: "Projetos:",              descricao: "" },
    { id: "4a17", nome: "Psicomotricidade:",      descricao: "" },
    { id: "4a18", nome: "Quadra B:",              descricao: "" },
    { id: "4a19", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "4a20", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "4a21", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "4a22", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "4a23", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
  "5ano-azul": [
    { id: "5a1",  nome: "Artes:",                 descricao: "" },
    { id: "5a2",  nome: "Caixa de Jogos:",        descricao: "" },
    { id: "5a3",  nome: "Coral:",                 descricao: "" },
    { id: "5a4",  nome: "Culinária:",             descricao: "" },
    { id: "5a5",  nome: "Dança:",                 descricao: "" },
    { id: "5a6",  nome: "Devocional:",            descricao: "" },
    { id: "5a7",  nome: "Flauta:",                descricao: "" },
    { id: "5a8",  nome: "Futebol:",               descricao: "" },
    { id: "5a9",  nome: "Ginástica:",             descricao: "" },
    { id: "5a10", nome: "Informática:",           descricao: "" },
    { id: "5a11", nome: "Judô:",                  descricao: "" },
    { id: "5a12", nome: "Lego:",                  descricao: "" },
    { id: "5a13", nome: "Leitura de Gibi:",       descricao: "" },
    { id: "5a14", nome: "Natação:",               descricao: "" },
    { id: "5a15", nome: "Projetos:",              descricao: "" },
    { id: "5a16", nome: "Psicomotricidade:",      descricao: "" },
    { id: "5a17", nome: "Quadra B:",              descricao: "" },
    { id: "5a18", nome: "Robótica:",              descricao: "" },
    { id: "5a19", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "5a20", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "5a21", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "5a22", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "5a23", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
  "6ano-azul": [
    { id: "6a1",  nome: "Artes:",                 descricao: "" },
    { id: "6a2",  nome: "Caixa de Jogos:",        descricao: "" },
    { id: "6a3",  nome: "Coral:",                 descricao: "" },
    { id: "6a4",  nome: "Culinária:",             descricao: "" },
    { id: "6a5",  nome: "Dança:",                 descricao: "" },
    { id: "6a6",  nome: "Devocional:",            descricao: "" },
    { id: "6a7",  nome: "Flauta:",                descricao: "" },
    { id: "6a8",  nome: "Futebol:",               descricao: "" },
    { id: "6a9",  nome: "Ginástica:",             descricao: "" },
    { id: "6a10", nome: "Informática:",           descricao: "" },
    { id: "6a11", nome: "Judô:",                  descricao: "" },
    { id: "6a12", nome: "Lego:",                  descricao: "" },
    { id: "6a13", nome: "Natação:",               descricao: "" },
    { id: "6a14", nome: "Projetos:",              descricao: "" },
    { id: "6a15", nome: "Psicomotricidade:",      descricao: "" },
    { id: "6a16", nome: "Quadra B:",              descricao: "" },
    { id: "6a17", nome: "Robótica:",              descricao: "" },
    { id: "6a18", nome: "Lição de Casa - Português:", descricao: "" },
    { id: "6a19", nome: "Lição de Casa - Matemática:", descricao: "" },
    { id: "6a20", nome: "Lição de Casa - Ciências:",  descricao: "" },
    { id: "6a21", nome: "Lição de Casa - História:",  descricao: "" },
    { id: "6a22", nome: "Lição de Casa - Geografia:", descricao: "" }
  ],
};

const STATUS_CONFIG: any = {
  realizada:     { label: "Realizada",     emoji: "✅", cor: "#059669", bg: "#D1FAE5", border: "#6EE7B7" },
  nao_realizada: { label: "Não Realizada", emoji: "❌", cor: "#DC2626", bg: "#FEE2E2", border: "#FCA5A5" },
  substituida:   { label: "Substituída",   emoji: "🔄", cor: "#D97706", bg: "#FEF3C7", border: "#FCD34D" },
  pendente:      { label: "Pendente",      emoji: "⏳", cor: "#6B7280", bg: "#F3F4F6", border: "#D1D5DB" },
};

const SEM_INICIAL = { id: "sem-020", numero: 20, periodo: "11/05 a 15/05/2026", tema: "A Criação de Deus", atividades: ATIVIDADES_PADRAO };

function pad(n: number) { return String(n).padStart(3, "0"); }

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(800 / img.width, 800 / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function obterTituloPuro(nome: string): string {
  if (!nome) return "";
  const parts = nome.includes(":") ? nome.split(":") : [nome];
  return parts.slice(1).join(":").trim() || parts[0].trim();
}

function obterCategoriaPura(nome: string): string {
  if (!nome) return "Atividade";
  const parts = nome.includes(":") ? nome.split(":") : [nome];
  return parts[0].trim();
}

function formatarAtividadeUnica(a: any, turmaId?: string): any {
  if (!a) return a;
  let novoNome = (a.nome || "").trim();
  let novaDescricao = (a.descricao || "").trim();
  let id = a.id;
  if (!id) {
    id = `atv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  // Standardize category name maps
  const mapCategorias: Record<string, string> = {
    "artes": "Artes",
    "musica": "Música",
    "música": "Música",
    "psicomotricidade": "Psicomotricidade",
    "projetos": "Projetos",
    "devocional": "Devocional",
    "culinaria": "Culinária",
    "culinária": "Culinária",
    "lego": "Lego",
    "contação de história": "Contação de História",
    "contacao de historia": "Contação de História",
    "contar história": "Contação de História",
    "rodas": "Rodas",
    "roda": "Roda",
    "musicalização": "Musicalização",
    "musicalizacao": "Musicalização",
    "informática": "Informática",
    "informatica": "Informática",
    "robótica": "Robótica",
    "robotica": "Robótica",
    "flauta": "Flauta",
    "coral": "Coral",
    "natação": "Natação",
    "natacao": "Natação",
    "judô": "Judô",
    "judo": "Judô",
    "balé": "Balé",
    "bale": "Balé",
    "caixa de brinquedos": "Caixa de Brinquedos",
    "caixa de jogos": "Caixa de Jogos",
    "quadra b": "Quadra B",
    "leitura de gibi": "Leitura de Gibi",
    "gibi": "Leitura de Gibi",
    "motoca": "Motoca",
    "lição de casa": "Lição de Casa",
    "licao de casa": "Lição de Casa",
    "lição de casa - português": "Lição de Casa - Português",
    "licao de casa - portugues": "Lição de Casa - Português",
    "lição de casa - matemática": "Lição de Casa - Matemática",
    "licao de casa - matematica": "Lição de Casa - Matemática",
    "lição de casa - ciências": "Lição de Casa - Ciências",
    "licao de casa - ciencias": "Lição de Casa - Ciências",
    "lição de casa - história": "Lição de Casa - História",
    "licao de casa - historia": "Lição de Casa - História",
    "lição de casa - geografia": "Lição de Casa - Geografia",
    "licao de casa - geografia": "Lição de Casa - Geografia",
    "atividade": "Atividades",
    "atividades": "Atividades"
  };

  let categoria = "Como Atividade";
  let tituloOriginal = novoNome;

  if (novoNome.includes(":")) {
    const parts = novoNome.split(":");
    categoria = parts[0].trim();
    tituloOriginal = parts.slice(1).join(":").trim();
  } else {
    // Check if the entire name is one of the known category keys
    const lowerNome = novoNome.toLowerCase();
    const matchChave = Object.keys(mapCategorias).find(k => k === lowerNome || lowerNome.startsWith(k));
    if (matchChave) {
      categoria = mapCategorias[matchChave];
      tituloOriginal = novoNome;
    }
  }

  let catLower = categoria.toLowerCase();
  let catChave = catLower.replace(/^categoria\s+/, "").replace(/^atividade\s+de\s+/, "").trim();
  let catBonita = mapCategorias[catChave] || (catChave.length > 0 ? (catChave.charAt(0).toUpperCase() + catChave.slice(1)) : "Artes");
  
  let categoriaPadraoFull = `Atividade de ${catBonita}`;

  // Clean up any redundant patterns inside the title, like "Nome da categoria: ..."
  if (tituloOriginal.toLowerCase().includes("nome da categoria") || tituloOriginal.toLowerCase().includes("nome_da_categoria")) {
    tituloOriginal = tituloOriginal
      .replace(/:\s*nome\s+da\s+categoria:\s*\w+/gi, "")
      .replace(/;\s*nome\s+da\s+categoria:\s*\w+/gi, "")
      .replace(/,\s*nome\s+da\s+categoria:\s*\w+/gi, "")
      .replace(/nome\s+da\s+categoria:\s*\w+/gi, "")
      .trim();
  }

  tituloOriginal = tituloOriginal.replace(/^[:;\s,]+|[:;\s,]+$/g, "").trim();

  // Define regular expression to detect "Título Específico" or "Título Espefícico" or "Título" or "Nome da Atividade" etc.
  const regexTituloEsp = /^\s*[\*\-\•]?\s*(?:t[ií]tulo\s+espec[ií]fico|t[ií]tulo\s+espef[ií]cico|t[ií]tulo\s+especifico\s+do\s+semanario|titulo\s+espeficico|espec[ií]fico|espec[ií]fco|titulo\s+especifico|t[ií]tulo|nome\s+da\s+atividade|nome|atividade|atividade\s+proposta):\s*(.+)$/i;
  
  const lines = novaDescricao.split("\n");
  let tituloExtraido = "";
  const novasLinhas: string[] = [];

  for (const line of lines) {
    const match = line.match(regexTituloEsp);
    if (match) {
      tituloExtraido = match[1].trim();
    } else {
      const regexNomeCat = /^\s*[\*\-\•]?\s*nome\s+da\s+categoria:\s*\w+\s*$/i;
      if (!line.match(regexNomeCat)) {
        novasLinhas.push(line);
      }
    }
  }

  // Update title if we extracted a specific/clean one from the description
  if (tituloExtraido) {
    // Strips outer quotes from title if any
    tituloOriginal = tituloExtraido.replace(/^["'“”«»]+|["'“”«»]+$/g, "").trim();
    novaDescricao = novasLinhas.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  // FALLBACK: If tituloOriginal is empty or a duplicate of the generic category, and the first line of the description looks like a title candidate, extract it!
  const isGenericTitle = !tituloOriginal || 
                         tituloOriginal.toLowerCase() === catBonita.toLowerCase() || 
                         tituloOriginal.toLowerCase() === "artes" || 
                         tituloOriginal.toLowerCase() === "artes:" ||
                         tituloOriginal.toLowerCase() === "motoca" ||
                         tituloOriginal.toLowerCase() === "motoca:" ||
                         tituloOriginal.toLowerCase().includes("educação artística") ||
                         tituloOriginal.toLowerCase().includes("educaçao artistica") ||
                         tituloOriginal.toLowerCase().includes("educacao artistica") ||
                         tituloOriginal.toLowerCase().includes("atividade temática") ||
                         tituloOriginal.toLowerCase().includes("atividade tematica") ||
                         tituloOriginal.toLowerCase().includes("atividade pedagógica") ||
                         tituloOriginal.toLowerCase().includes("atividade pedagogica") ||
                         Object.values(mapCategorias).some(v => {
                           const vLower = v.toLowerCase();
                           const tLower = tituloOriginal.toLowerCase();
                           return tLower === vLower || tLower === `${vLower}:` || (tLower.startsWith(vLower) && tLower.length <= vLower.length + 5);
                         });
  
  if (isGenericTitle && lines.length > 0) {
    // Let's find the first non-empty line
    let firstLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        firstLineIndex = i;
        break;
      }
    }
    if (firstLineIndex !== -1) {
      const candidate = lines[firstLineIndex].trim().replace(/^["'“”«»#\-\•\*+\s]+|["'“”«»#\-\•\*+\s]+$/g, "");
      const candLower = candidate.toLowerCase();
      const isHeader = ["proposta", "dinâmica", "dinamica", "materiais", "importante", "reflexão", "reflexao", "atividade", "versículo", "versiculo", "gibi", "sugestão", "sugestao"].some(h => candLower.startsWith(h));
      // Also make sure it's not too long and doesn't contain common paragraph punctuation (like multiple sentences)
      if (!isHeader && candidate.length > 2 && candidate.length < 80 && !candidate.includes(".") && !candidate.includes(";")) {
        tituloOriginal = candidate;
        // Remove this line from novasLinhas/novaDescricao
        const filteredLines = [...lines];
        filteredLines.splice(firstLineIndex, 1);
        novaDescricao = filteredLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      }
    }
  }

  // Clean up title repetition inside description
  if (tituloOriginal && novaDescricao) {
    const titleLower = tituloOriginal.toLowerCase();
    const escapedTitle = titleLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Pattern 1: (Proposta/Dinâmica/etc): Título - resto
    const regexRepeat = new RegExp(`^((?:proposta|dinâmica|dinamica|reflexão|reflexao|atividade):\\s*)` + escapedTitle + `(?:\\s*[-–—:;,\\.\\n]+\\s*)`, 'i');
    if (novaDescricao.match(regexRepeat)) {
      novaDescricao = novaDescricao.replace(regexRepeat, (match, prefix) => {
        return prefix;
      });
    } else {
      // Pattern 2: Starts with the title, e.g. "Bolinhas Coloridas - Estimular..."
      const regexStartWithTitle = new RegExp(`^` + escapedTitle + `(?:\\s*[-–—:;,\\.\\n]+\\s*)`, 'i');
      if (novaDescricao.match(regexStartWithTitle)) {
        novaDescricao = novaDescricao.replace(regexStartWithTitle, '');
      }
    }
  }

  // Combine into standard format
  let finalNome = "";
  if (!tituloOriginal || tituloOriginal.toLowerCase() === catBonita.toLowerCase()) {
    finalNome = `${catBonita}:`;
  } else {
    finalNome = `${catBonita}: ${tituloOriginal}`;
  }

  return {
    ...a,
    id,
    nome: finalNome,
    descricao: novaDescricao
  };
}

export default function App() {
  // Funções de carregamento inicial
  const loadLocal = (key: string, def: any) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  };

  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"admin" | "coordenador" | "auxiliar">("auxiliar");

  const canEditAtv = (atv: any) => {
    if (!user || guestMode) return true; // full access in guest/offline mode
    if (userRole === "admin" || userRole === "coordenador") return true;
    return !atv.criadoPorEmail || atv.criadoPorEmail === user.email || atv.criadoPorEmail === "Local";
  };

  const [guestMode, setGuestMode] = useState(() => {
    try {
      return localStorage.getItem("semanario_guest_mode") === "true";
    } catch {
      return false;
    }
  });

  const isSyncingFromCloud = useRef(false);
  const activeUnsubscribers = useRef<any[]>([]);

  const [turmas, _setTurmas]           = useState(() => loadLocal("semanario_turmas", TURMAS));
  const [atividadesPadrao, _setAtividadesPadrao] = useState(() => {
    const raw = loadLocal("semanario_atividades_padrao", ATIVIDADES_PADRAO);
    const cleaned: any = {};
    Object.keys(raw).forEach((k) => {
      cleaned[k] = (raw[k] || []).map((a: any) => formatarAtividadeUnica(a, k));
    });
    return cleaned;
  });
  const [semanarios, _setSemanarios] = useState(() => {
    const raw = loadLocal("semanario_lista", [SEM_INICIAL]);
    return raw.map((s: any) => {
      const cleanedAtvs: any = {};
      if (s.atividades) {
        Object.keys(s.atividades).forEach((tId) => {
          cleanedAtvs[tId] = (s.atividades[tId] || []).map((a: any) => formatarAtividadeUnica(a, tId));
        });
      }
      return {
        ...s,
        atividades: cleanedAtvs
      };
    });
  });
  const [semAtualId, setSemAtualId]   = useState(() => loadLocal("semanario_atual_id", SEM_INICIAL.id));
  const [tela, setTela]               = useState("home");
  const [turmaSel, setTurmaSel]       = useState<any>(null);
  const [atividadeSel, setAtividadeSel] = useState<any>(null);
  const [registros, _setRegistros]     = useState(() => loadLocal("semanario_registros", {}));
  const [formData, setFormData]       = useState<any>({});
  const [midias, _setMidias]           = useState(() => loadLocal("semanario_midias", {}));

  // Intercepting Setters to automatically write modifications to Firebase when user-initiated
  const setTurmas = (val: any) => {
    _setTurmas((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (user && !isSyncingFromCloud.current) {
        setDoc(doc(db, "config", "turmas"), { data: next }).catch(e => console.error("Erro ao salvar turmas:", e));
      }
      return next;
    });
  };

  const setAtividadesPadrao = (val: any) => {
    _setAtividadesPadrao((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (user && !isSyncingFromCloud.current) {
        setDoc(doc(db, "config", "atividades_padrao"), { data: next }).catch(e => console.error("Erro ao salvar atividades padrão:", e));
      }
      return next;
    });
  };

  const setSemanarios = (val: any) => {
    _setSemanarios((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (user && !isSyncingFromCloud.current) {
        syncSemanariosDifference(prev, next);
      }
      return next;
    });
  };

  const setRegistros = (val: any) => {
    _setRegistros((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (user && !isSyncingFromCloud.current) {
        syncRegistrosDifference(prev, next);
      }
      return next;
    });
  };

  const setMidias = (val: any) => {
    _setMidias((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (user && !isSyncingFromCloud.current) {
        syncMidiasDifference(prev, next);
      }
      return next;
    });
  };

  // Helper sync logic
  const syncSemanariosDifference = (prev: any[], next: any[]) => {
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevMap = new Map(prev.map(s => [s.id, s]));
    const nextMap = new Map(next.map(s => [s.id, s]));

    next.forEach(sem => {
      const prevSem = prevMap.get(sem.id);
      if (!prevSem || JSON.stringify(prevSem) !== JSON.stringify(sem)) {
        // Save semanario document
        setDoc(doc(db, "semanarios", sem.id), sem).catch(e => console.error("Erro ao salvar semanário:", e));

        // Sync to flat activities database for advanced searching and querying
        if (sem.atividades) {
          Object.keys(sem.atividades).forEach(turmaId => {
            const arr = sem.atividades[turmaId] || [];
            arr.forEach((activity: any) => {
              const flatId = `${sem.id}||${turmaId}||${activity.id}`;
              setDoc(doc(db, "atividades_db", flatId), {
                id: activity.id,
                semanarioId: sem.id,
                semanarioNumero: sem.numero || 0,
                periodo: sem.periodo || "",
                turmaId: turmaId,
                turmaNome: turmas.find((t: any) => t.id === turmaId)?.label || turmaId,
                nome: activity.nome || "",
                titulo: obterTituloPuro(activity.nome),
                categoria: obterCategoriaPura(activity.nome),
                descricao: activity.descricao || "",
                adiResponsavel: activity.adiResponsavel || "",
                monitoras: activity.monitoras || "",
                criadoPorEmail: activity.criadoPorEmail || "Local",
                atualizadoEm: new Date().toISOString()
              }).catch(e => console.error("Erro ao indexar atividade:", e));
            });
            
            // Clean up any activities that were removed from this turma in this week
            if (prevSem && prevSem.atividades && prevSem.atividades[turmaId]) {
              const prevArr = prevSem.atividades[turmaId] || [];
              const nextIds = new Set(arr.map((a: any) => a.id));
              prevArr.forEach((prevAtv: any) => {
                if (!nextIds.has(prevAtv.id)) {
                  const flatId = `${sem.id}||${turmaId}||${prevAtv.id}`;
                  deleteDoc(doc(db, "atividades_db", flatId)).catch(e => console.error("Erro ao deletar atividade flat:", e));
                }
              });
            }
          });
        }
      }
    });

    prev.forEach(sem => {
      if (!nextMap.has(sem.id)) {
        // Delete semanario document
        deleteDoc(doc(db, "semanarios", sem.id)).catch(e => console.error("Erro ao deletar semanário:", e));

        // Delete flat activities associated with this semanario
        if (sem.atividades) {
          Object.keys(sem.atividades).forEach(turmaId => {
            const arr = sem.atividades[turmaId] || [];
            arr.forEach((activity: any) => {
              const flatId = `${sem.id}||${turmaId}||${activity.id}`;
              deleteDoc(doc(db, "atividades_db", flatId)).catch(e => console.error("Erro ao deletar atividade flat:", e));
            });
          });
        }
      }
    });
  };

  const syncRegistrosDifference = (prev: any, next: any) => {
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevKeys = Object.keys(prev || {});
    const nextKeys = Object.keys(next || {});

    nextKeys.forEach(k => {
      const prevVal = prev[k];
      const nextVal = next[k];
      if (!prevVal || JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
        setDoc(doc(db, "registros", k), nextVal).catch(e => console.error("Erro ao salvar registro:", e));
      }
    });

    prevKeys.forEach(k => {
      if (!(k in next)) {
        deleteDoc(doc(db, "registros", k)).catch(e => console.error("Erro ao deletar registro:", e));
      }
    });
  };

  const syncMidiasDifference = (prev: any, next: any) => {
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevKeys = Object.keys(prev || {});
    const nextKeys = Object.keys(next || {});

    nextKeys.forEach(k => {
      const prevVal = prev[k];
      const nextVal = next[k];
      if (!prevVal || JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
        setDoc(doc(db, "midias", k), { items: nextVal }).catch(e => console.error("Erro ao salvar mídia:", e));
      }
    });

    prevKeys.forEach(k => {
      if (!(k in next)) {
        deleteDoc(doc(db, "midias", k)).catch(e => console.error("Erro ao deletar mídia:", e));
      }
    });
  };

  // Setup Firebase Auth and Realtime sync subscriptions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setGuestMode(false);
        try { localStorage.setItem("semanario_guest_mode", "false"); } catch {}
        
        isSyncingFromCloud.current = true;
        try {
          // Subscribe to real-time User Profile updates
          const unsubUser = onSnapshot(doc(db, "usuarios", currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              setUserRole(docSnap.data().role || "auxiliar");
            } else {
              // Auto-create user profile document if missing
              let r: "admin" | "coordenador" | "auxiliar" = "auxiliar";
              if (currentUser.email === "jfernandoveiga1967@gmail.com") {
                r = "admin";
              }
              setDoc(doc(db, "usuarios", currentUser.uid), {
                uid: currentUser.uid,
                email: currentUser.email,
                role: r
              }).catch(err => console.error("Erro ao criar perfil de usuário:", err));
              setUserRole(r);
            }
          });

          // Verify if cloud contains semanarios
          const semSnap = await getDocs(collection(db, "semanarios"));
          if (semSnap.empty) {
            // Cloud is empty. Seed it with current LocalStorage values
            const localSem = loadLocal("semanario_lista", [SEM_INICIAL]);
            const localRegs = loadLocal("semanario_registros", {});
            const localMids = loadLocal("semanario_midias", {});
            const localTurmas = loadLocal("semanario_turmas", TURMAS);
            const localAtvsPadrao = loadLocal("semanario_atividades_padrao", ATIVIDADES_PADRAO);

            const batch = writeBatch(db);
            localSem.forEach((s: any) => {
              batch.set(doc(db, "semanarios", s.id), s);
            });
            Object.keys(localRegs).forEach((k: string) => {
              batch.set(doc(db, "registros", k), localRegs[k]);
            });
            Object.keys(localMids).forEach((k: string) => {
              batch.set(doc(db, "midias", k), { items: localMids[k] });
            });
            batch.set(doc(db, "config", "turmas"), { data: localTurmas });
            batch.set(doc(db, "config", "atividades_padrao"), { data: localAtvsPadrao });

            await batch.commit();
          }

          // Subscribe to real-time Cloud updates
          const unsubSem = onSnapshot(collection(db, "semanarios"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const sList: any[] = [];
            snapshot.forEach((d) => {
              sList.push(d.data());
            });
            if (sList.length > 0) {
              sList.sort((a, b) => (b.numero || 0) - (a.numero || 0));
              _setSemanarios(sList);
            }
            isSyncingFromCloud.current = false;
          });

          const unsubReg = onSnapshot(collection(db, "registros"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const regs: any = {};
            snapshot.forEach((d) => {
              regs[d.id] = d.data();
            });
            _setRegistros(regs);
            isSyncingFromCloud.current = false;
          });

          const unsubMid = onSnapshot(collection(db, "midias"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const mids: any = {};
            snapshot.forEach((d) => {
              mids[d.id] = d.data().items || [];
            });
            _setMidias(mids);
            isSyncingFromCloud.current = false;
          });

          const unsubTurmas = onSnapshot(doc(db, "config", "turmas"), (docSnap) => {
            isSyncingFromCloud.current = true;
            if (docSnap.exists()) {
              _setTurmas(docSnap.data().data || TURMAS);
            }
            isSyncingFromCloud.current = false;
          });

          const unsubAtvs = onSnapshot(doc(db, "config", "atividades_padrao"), (docSnap) => {
            isSyncingFromCloud.current = true;
            if (docSnap.exists()) {
              _setAtividadesPadrao(docSnap.data().data || ATIVIDADES_PADRAO);
            }
            isSyncingFromCloud.current = false;
          });

          activeUnsubscribers.current = [unsubUser, unsubSem, unsubReg, unsubMid, unsubTurmas, unsubAtvs];
        } catch (e) {
          console.error("Erro na sincronização Firebase:", e);
        } finally {
          isSyncingFromCloud.current = false;
        }
      } else {
        // Clean up subscriptions
        activeUnsubscribers.current.forEach(u => u());
        activeUnsubscribers.current = [];

        // Restore LocalStorage backup
        _setTurmas(loadLocal("semanario_turmas", TURMAS));
        _setAtividadesPadrao(loadLocal("semanario_atividades_padrao", ATIVIDADES_PADRAO));
        _setSemanarios(loadLocal("semanario_lista", [SEM_INICIAL]));
        _setRegistros(loadLocal("semanario_registros", {}));
        _setMidias(loadLocal("semanario_midias", {}));
      }
    });

    return () => {
      activeUnsubscribers.current.forEach(u => u());
    };
  }, []);
  const [salvando, setSalvando]       = useState(false);
  const [toast, setToast]             = useState<any>(null);
  const [novoForm, setNovoForm]       = useState<any>({ 
    startDate: "", 
    endDate: "", 
    numero: 1, 
    tema: "", 
    usarTemasPorTurma: false, 
    temaGrupo1: "", 
    temaGrupo2: "", 
    temaGrupo3: "", 
    temasPorTurma: {} 
  });
  const [modalNovo, setModalNovo]     = useState(false);
  const [modalEditSem, setModalEditSem] = useState(false);
  const [editSemForm, setEditSemForm] = useState({ numero: 0, periodo: "", startDate: "", endDate: "", tema: "" });
  const [modalExcluirSem, setModalExcluirSem] = useState(false);
  const [semParaExcluir, setSemParaExcluir] = useState<any>(null);
  const [modalTurma, setModalTurma]   = useState(false);
  const [nomeNovaTurma, setNomeNovaTurma] = useState("");
  const [corNovaTurma, setCorNovaTurma] = useState("#2563EB");
  const [editandoEstrutura, setEditandoEstrutura] = useState<any>(null);
  const [editandoAtividadeId, setEditandoAtividadeId] = useState<string | null>(null);
  const [turmaParaExcluir, setTurmaParaExcluir] = useState<any>(null);
  const [telaBiblioteca, setTelaBiblioteca] = useState(false);
  const [atividadesPesquisa, setAtividadesPesquisa] = useState<any[]>([]);
  const [carregandoPesquisa, setCarregandoPesquisa] = useState(false);
  const [bibliotecaAba, setBibliotecaAba] = useState<"semanas" | "pesquisa">("semanas");
  const [pesquisaQuery, setPesquisaQuery] = useState("");
  const [pesquisaCategoria, setPesquisaCategoria] = useState("");
  const [pesquisaTurma, setPesquisaTurma] = useState("");
  const [pesquisaCriador, setPesquisaCriador] = useState("");

  useEffect(() => {
    if (telaBiblioteca) {
      carregarAtividadesPesquisa();
    }
  }, [telaBiblioteca]);
  const [processandoAI, setProcessandoAI] = useState(false);
  const [errorAI, setErrorAI] = useState(false);
  const [errorMensagemAI, setErrorMensagemAI] = useState("");
  const [modalGerador, setModalGerador] = useState(false);
  const [genContext, setGenContext] = useState<any>(null);
  const [genResult, setGenResult] = useState("");
  const [loteProcessando, setLoteProcessando] = useState(false);
  const [loteTotal, setLoteTotal] = useState(0);
  const [loteAtualIdx, setLoteAtualIdx] = useState(0);
  const [loteItemAtual, setLoteItemAtual] = useState<any>(null);
  const [lotePausadoCota, setLotePausadoCota] = useState(false);
  const [loteSegundosEspera, setLoteSegundosEspera] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chipsScrollRef = useRef<HTMLDivElement>(null);

  // Sistema de Cópia de Atividades entre turmas
  const [modalCopiarAtv, setModalCopiarAtv] = useState(false);
  const [atvParaCopiar, setAtvParaCopiar] = useState<any>(null);
  const [turmaOrigem, setTurmaOrigem] = useState<any>(null);
  const [turmasDestinoSelecionadas, setTurmasDestinoSelecionadas] = useState<string[]>([]);
  const [copiarRegistro, setCopiarRegistro] = useState(false);

  const abrirModalCopiar = (turma: any, atividade: any) => {
    setTurmaOrigem(turma);
    setAtvParaCopiar(atividade);
    setTurmasDestinoSelecionadas([]);
    setCopiarRegistro(false);
    setModalCopiarAtv(true);
  };

  const limparTextoTecnico = (texto: string) => {
    if (!texto) return "";
    return texto
      // Remove marcações comuns de Markdown
      .replace(/\*\*/g, "") // Negrito
      .replace(/#/g, "") // Cabeçalhos
      .replace(/_{1,2}/g, "") // Itálico/Sublinhado
      .replace(/`{1,3}/g, "") // Código
      .replace(/^>\s*/gm, "") // Blockquotes
      
      // Remove códigos técnicos e BNCC (ex: EI01EF01, EF15LP01)
      .replace(/\((BNCC|bncc|bncc:|BNCC:).*?\)/gi, "") 
      .replace(/\([a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{2}\)/g, "") 
      .replace(/\b[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{2}\b/g, "")
      .replace(/\[.*?BNCC.*?\]/gi, "") 
      .replace(/\(BNCC.*?\)/gi, "")
      .replace(/BNCC:.*?\n/gi, "")      
      
      // Limpa excesso de traços e símbolos que poluem visualmente
      .replace(/^[-\s]*[-•]\s*/gm, "• ") // Padroniza marcadores de lista
      
      // Normaliza espaçamento entre seções (garante que títulos de seção tenham quebra de linha)
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  };

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const scrollAmount = 180;
      chipsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const navegarTurmaAnterior = () => {
    if (!turmaSel) return;
    const lista = ordenarTurmas(turmas);
    const idx = lista.findIndex((t: any) => t.id === turmaSel.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + lista.length) % lista.length;
      setTurmaSel(lista[prevIdx]);
    }
  };

  const navegarTurmaProxima = () => {
    if (!turmaSel) return;
    const lista = ordenarTurmas(turmas);
    const idx = lista.findIndex((t: any) => t.id === turmaSel.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % lista.length;
      setTurmaSel(lista[nextIdx]);
    }
  };

  const navegarAtividadeAnterior = () => {
    if (!turmaSel || !atividadeSel) return;
    const lista = [...(ATIVIDADES[turmaSel.id] || [])].sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    if (lista.length === 0) return;
    const idx = lista.findIndex((a: any) => a.id === atividadeSel.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + lista.length) % lista.length;
      setAtividadeSel(lista[prevIdx]);
    }
  };

  const navegarAtividadeProxima = () => {
    if (!turmaSel || !atividadeSel) return;
    const lista = [...(ATIVIDADES[turmaSel.id] || [])].sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    if (lista.length === 0) return;
    const idx = lista.findIndex((a: any) => a.id === atividadeSel.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % lista.length;
      setAtividadeSel(lista[nextIdx]);
    }
  };

  const parseGerado = (textoResult: string, categoriaPadrao: string) => {
    const linhasRaw = textoResult.split("\n").map(l => l.trim()).filter(l => l);
    if (linhasRaw.length === 0) {
      return { titulo: `${categoriaPadrao}: Atividade Temática`, descricao: textoResult };
    }

    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    
    let cat = categoriaPadrao.replace(/:$/, "").trim();
    const catMap: Record<string, string> = {
      "artes": "Artes",
      "devocional": "Devocional",
      "psicomotricidade": "Psicomotricidade",
      "projetos": "Projetos",
      "projeto": "Projetos",
      "culinaria": "Culinária",
      "musica": "Música",
      "roda": "Roda",
      "rodas": "Roda",
      "musicalizacao": "Musicalização",
      "caixadebrinquedos": "Caixa de Brinquedos",
      "caixadejogos": "Caixa de Jogos",
      "jogos": "Jogos",
      "informatica": "Informática",
      "robotica": "Robótica",
      "flauta": "Flauta",
      "coral": "Coral",
      "coralecanto": "Coral",
      "natacao": "Natação",
      "judo": "Judô",
      "bale": "Balé",
      "lego": "Lego",
      "contacaodehistoria": "Contação de História",
      "contarhistoria": "Contação de História",
      "motoca": "Motoca",
      "leituradegibi": "Leitura de Gibi",
      "quadrab": "Quadra B",
      "quadra": "Quadra B",
      "danca": "Dança",
      "futebol": "Futebol",
      "ginastica": "Ginástica",
      "licaodecasa": "Lição de Casa",
      "licaodecasaportugues": "Lição de Casa - Português",
      "licaodecasamatematica": "Lição de Casa - Matemática",
      "licaodecasaciencias": "Lição de Casa - Ciências",
      "licaodecasahistoria": "Lição de Casa - História",
      "licaodecasageografia": "Lição de Casa - Geografia",
      "atividades": "Atividades"
    };

    const normCatKey = norm(cat);
    const prettyCat = catMap[normCatKey] || (cat.charAt(0).toUpperCase() + cat.slice(1));
    
    // Find core category from categoriaPadrao: e.g. "A Arca de Noé: Devocional" -> "Devocional"
    const catLowerClean = norm(categoriaPadrao);
    const coreCategoryKey = Object.keys(catMap).find(k => catLowerClean.includes(k)) || "artes";
    const coreCategoryPretty = catMap[coreCategoryKey];

    let title = "";
    let startIdx = 0;

    // Procura o título entre as 4 primeiras linhas
    for (let i = 0; i < Math.min(linhasRaw.length, 4); i++) {
      const line = linhasRaw[i];
      const lineNorm = norm(line);

      // Se for apenas o nome da categoria ou variação, pula
      const isCategoryLabel = Object.keys(catMap).some(k => {
        const isCoreMatch = lineNorm === k || lineNorm === k + "s" || lineNorm === "atividadede" + k || lineNorm === "atividadesde" + k || lineNorm === "nomedacategoria" + k;
        if (isCoreMatch) return true;
        
        // Handle cases like "Artes (Educação Artística / Arte):"
        if (k === "artes") {
          const isArtesHeader = lineNorm.includes("educacaoartistica") || 
                               lineNorm.includes("arteeducacao") || 
                               (lineNorm.startsWith("artes") && lineNorm.length <= 30 && !["pintura", "desenho", "colagem"].some(w => lineNorm.includes(w)));
          if (isArtesHeader) return true;
        }
        
        return false;
      }) || 
      lineNorm === "nomedacategoria" || 
      lineNorm.startsWith("nomedacategoria") ||
      lineNorm.startsWith("categoria") ||
      lineNorm.startsWith("atividadede") ||
      lineNorm.startsWith("atividadesde");

      if (isCategoryLabel || lineNorm === normCatKey || lineNorm === norm(prettyCat) || lineNorm === norm(coreCategoryPretty) || lineNorm === normCatKey + "s") {
        startIdx = i + 1;
        continue;
      }

      // Se começar com algum dos cabeçalhos principais, para a busca de título
      const isHeader = ["proposta", "dinamica", "materiais", "importante", "reflexao", "atividade", "versiculo", "momento", "sugestao"].some(h => lineNorm.startsWith(h));
      if (isHeader) {
        break;
      }

      // Encontrou uma linha válida de título!
      let prospectiveTitle = line;
      
      // Limpa tags comuns como "Título:", "Title:", "Nome do Jogo:", "Atividade:", "Título Específico:"
      prospectiveTitle = prospectiveTitle.replace(/^(t[ií]tulo\s+espec[ií]fico|t[ií]tulo\s+espef[ií]cico|t[ií]tulo|titulo|nome|nome da atividade|tema|atividade|categoria):\s*/gi, "");

      // Se a linha contiver a categoria como prefixo ou instruções de título com dois pontos (ex: "TÍTULO ESPECÍFICO (Formato...): Pintura")
      const colonIndex = prospectiveTitle.indexOf(":");
      if (colonIndex !== -1) {
        const prefix = prospectiveTitle.substring(0, colonIndex).trim();
        const suffix = prospectiveTitle.substring(colonIndex + 1).trim();
        const prefixNorm = norm(prefix);
        if (
          prefixNorm === normCatKey || 
          prefixNorm === norm(prettyCat) || 
          prefixNorm === "categoria" || 
          prefixNorm === "titulo" ||
          prefixNorm.includes("tituloespecifico") ||
          prefixNorm.includes("nomedacategoria") ||
          prefixNorm.includes("categoria") ||
          prefixNorm.includes("especifico") ||
          prefixNorm.includes("espeficico") ||
          prefixNorm.includes("titulo") ||
          Object.keys(catMap).some(k => prefixNorm === k || prefixNorm.includes(k))
        ) {
          prospectiveTitle = suffix;
        }
      }

      title = prospectiveTitle.replace(/^[-•]\s*/, "").trim();
      startIdx = i + 1;
      break;
    }

    if (!title) {
      title = "Atividade Temática";
    }

    const normalizarCaixaBaixa = (str: string) => {
      if (!str) return "";
      let res = str.trim();
      res = res.charAt(0).toUpperCase() + res.slice(1).toLowerCase();
      res = res.replace(/\bdeus\b/gi, "Deus");
      res = res.replace(/\bjesus\b/gi, "Jesus");
      res = res.replace(/\bbíblia\b/gi, "Bíblia");
      res = res.replace(/\bbíblica\b/gi, "Bíblica");
      return res;
    };

    const normTitle = norm(title);
    if (normTitle === normCatKey || normTitle === norm(prettyCat) || normTitle === norm(coreCategoryPretty) || normTitle === "atividades" || normTitle === "atividade" || normTitle === "atividadesemanal") {
      title = "Atividade Pedagógica Criativa";
    }

    title = normalizarCaixaBaixa(title);
    const nomeFormatado = `${coreCategoryPretty}: ${title}`;

    let descLines = linhasRaw.slice(startIdx);

    descLines = descLines.map(line => {
      const headers = [
        { key: "PROPOSTA:", repl: "Proposta:" },
        { key: "DINÂMICA:", repl: "Dinâmica:" },
        { key: "MATERIAIS:", repl: "Materiais:" },
        { key: "IMPORTANTE:", repl: "Importante:" },
        { key: "REFLEXÃO:", repl: "Reflexão:" },
        { key: "VERSÍCULO:", repl: "Versículo:" },
        { key: "ATIVIDADE:", repl: "Atividade:" },
        { key: "MOMENTO DE ORAÇÃO:", repl: "Momento de oração:" }
      ];
      for (const h of headers) {
        if (line.toUpperCase().trim() === h.key) {
          return h.repl;
        }
      }
      
      if (line.endsWith(":") && line === line.toUpperCase() && line.length > 2 && line.length < 20) {
        return line.charAt(0).toUpperCase() + line.substring(1).toLowerCase();
      }

      if (line === line.toUpperCase() && line.length > 10 && !line.startsWith("•") && !line.startsWith("-")) {
        return line.charAt(0).toUpperCase() + line.substring(1).toLowerCase();
      }

      return line;
    });

    const descricaoFormatada = descLines.join("\n\n");

    return { titulo: nomeFormatado, descricao: descricaoFormatada };
  };

  const obterHistoricoExclusao = (turma: any, atividade: any, s: any) => {
    const exclusoes = new Set<string>();
    const catAlvo = (atividade.nome || "").split(":")[0].trim().toLowerCase();

    // 1. Coleta todas as atividades da mesma categoria já geradas para ESTA turma em qualquer semana (histórico do aluno)
    semanarios.forEach((semItem: any) => {
      const atvsTurma = semItem.atividades?.[turma.id] || [];
      atvsTurma.forEach((atv: any) => {
        const catAtv = (atv.nome || "").split(":")[0].trim().toLowerCase();
        if (catAtv === catAlvo && atv.descricao && atv.descricao.trim()) {
          const partes = (atv.nome || "").split(":");
          const tituloExclusao = partes.length > 1 ? partes[1].trim() : atv.nome;
          if (tituloExclusao) {
            exclusoes.add(tituloExclusao);
            exclusoes.add(tituloExclusao.toLowerCase());
          }
          exclusoes.add(atv.nome);
        }
      });
    });

    // 2. Coleta todas as atividades da mesma categoria já geradas para OUTRAS turmas na semana atual (para evitar duplicados no mesmo período)
    const atvsSemanaAtual = s.atividades || {};
    Object.keys(atvsSemanaAtual).forEach((tId: string) => {
      const atvsTurma = atvsSemanaAtual[tId] || [];
      atvsTurma.forEach((atv: any) => {
        const catAtv = (atv.nome || "").split(":")[0].trim().toLowerCase();
        if (catAtv === catAlvo && atv.descricao && atv.descricao.trim()) {
          const partes = (atv.nome || "").split(":");
          const tituloExclusao = partes.length > 1 ? partes[1].trim() : atv.nome;
          if (tituloExclusao) {
            exclusoes.add(tituloExclusao);
            exclusoes.add(tituloExclusao.toLowerCase());
          }
          exclusoes.add(atv.nome);
        }
      });
    });

    return Array.from(exclusoes).map(x => `- ${x}`).join("\n");
  };

  const gerarAtividadeAI = async (turma: any, atividade: any, retry = true) => {
    setModalGerador(true);
    setGenContext({ turma, atividade });
    setGenResult("");
    setProcessandoAI(true);
    setErrorAI(false);

    const s = semanarios.find(x => x.id === (semAtualId || "")) || sem;
    const startTime = Date.now();
    const turmaTema = s.temasTurmas?.[turma.id] !== undefined ? s.temasTurmas[turma.id] : (s.tema || "Geral / Não especificado");
    
    console.group(`[IA] Gerando Atividade: ${atividade.nome || "Sem Nome"}`);
    console.log("Contexto Turma:", turma);
    console.log("Tema Semanal Turma:", turmaTema);
    console.log("Tentativa:", retry ? "1ª" : "2ª (Retry)");

    try {
      if (!s) throw new Error("Semanário não encontrado no contexto");
      
      const historico = obterHistoricoExclusao(turma, atividade, s);

      let faixaEtaria = "Infantil";
      if (turma.id.includes("mini") || turma.id.includes("maternal")) {
        faixaEtaria = "Mini e Maternal (Exploração Sensorial - 1 a 3 anos)";
      } else if (turma.id.includes("infantil1") || turma.id.includes("infantil 1")) {
        faixaEtaria = "Infantil 1 (4 anos)";
      } else if (turma.id.includes("infantil2") || turma.id.includes("infantil 2")) {
        faixaEtaria = "Infantil 2 (5 anos)";
      } else if (turma.id.includes("1ano") || turma.id.includes("1º ano") || turma.id.includes("1o ano")) {
        faixaEtaria = "Ensino Fundamental I (1º Ano - 6 anos)";
      } else if (turma.id.includes("2ano") || turma.id.includes("2º ano") || turma.id.includes("2o ano")) {
        faixaEtaria = "Ensino Fundamental I (2º Ano - 7 anos)";
      } else if (turma.id.includes("3ano") || turma.id.includes("3º ano") || turma.id.includes("3o ano")) {
        faixaEtaria = "Ensino Fundamental I (3º Ano - 8 anos)";
      } else if (turma.id.includes("4ano") || turma.id.includes("4º ano") || turma.id.includes("4o ano")) {
        faixaEtaria = "Ensino Fundamental I (4º Ano - 9 anos)";
      } else if (turma.id.includes("5ano") || turma.id.includes("5º ano") || turma.id.includes("5o ano")) {
        faixaEtaria = "Ensino Fundamental I (5º Ano - 10 anos)";
      } else if (turma.id.includes("6ano") || turma.id.includes("6º ano") || turma.id.includes("6o ano")) {
        faixaEtaria = "Ensino Fundamental II (6º Ano - pré-adolescentes de 11 a 12 anos)";
      } else if (turma.id.includes("ano") || turma.label.toLowerCase().includes("ano")) {
        faixaEtaria = `Ensino Fundamental (${turma.label})`;
      } else {
        faixaEtaria = `Educação Infantil (${turma.label})`;
      }

      const payload = {
        turmaNome: turma.label,
        faixaEtaria,
        semana: s.numero || 0,
        tema: turmaTema,
        categoria: (atividade.nome || "").split(":")[0],
        historico
      };

      const res = await fetch("/api/generate-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log(`Resposta API (${res.status}) em ${Date.now() - startTime}ms`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.text || data.text.trim().length < 10) throw new Error("Conteúdo da IA insuficiente");
      
      const finalResult = limparTextoTecnico(data.text);
      console.log("Geração concluída com sucesso.");
      setGenResult(finalResult);
    } catch (error: any) {
      console.error("Erro no fluxo de geração:", error.message);
      
      if (retry) {
        console.warn("Iniciando retentativa automática...");
        console.groupEnd();
        return gerarAtividadeAI(turma, atividade, false);
      }

      console.error("Todas as tentativas falharam. Aplicando fallback pedagógico.");
      setErrorAI(true);
      setErrorMensagemAI(error.message || "Houve um problema na comunicação com a IA.");
      
      const fallbackText = `ATIVIDADE DE ${ (atividade.nome || "").split(":")[0].toUpperCase() || "PROPOSTA" }: ${s?.tema || "TEMA DA SEMANA"}

Proposta:
Atividade lúdica e pedagógica focada no tema da semana: ${s?.tema || "Aprendizado Contínuo"}. O objetivo é fortalecer a interação social e a exploração de novos conceitos.

Materiais:
• Papel, lápis e materiais de desenho
• Recursos visuais relacionados ao tema

Dinâmica:
1. Acolhimento em roda conversando sobre o tema do dia.
2. Atividade prática de exploração (arte ou movimento).
3. Momento de compartilhamento do que foi descoberto.
4. Encerramento com organização do espaço.

Importante:
Garantir o acolhimento individual de cada aluno e adaptar o ritmo conforme a necessidade da turma.`;
      
      setGenResult(fallbackText);
      toast$("Não foi possível gerar via IA agora. Criamos uma sugestão padrão para você.", "aviso");
    } finally {
      setProcessandoAI(false);
      console.groupEnd();
    }
  };

  const obterFallbackTexto = (atividade: any, s: any, turma?: any) => {
    const tTema = (turma && s.temasTurmas?.[turma.id] !== undefined) ? s.temasTurmas[turma.id] : (s?.tema || "Aprendizado Contínuo");
    return `ATIVIDADE DE ${ (atividade.nome || "").split(":")[0].toUpperCase() || "PROPOSTA" }: ${tTema}

Proposta:
Atividade lúdica e pedagógica focada no tema da semana para esta turma: ${tTema}. O objetivo é fortalecer a interação social e a exploração de novos conceitos.

Materiais:
• Papel, lápis e materiais de desenho
• Recursos visuais relacionados ao tema

Dinâmica:
1. Acolhimento em roda conversando sobre o tema do dia.
2. Atividade prática de exploração (arte ou movimento).
3. Momento de compartilhamento do que foi descoberto.
4. Encerramento com organização do espaço.

Importante:
Garantir o acolhimento individual de cada aluno e adaptar o ritmo conforme a necessidade da turma.`;
  };

  const gerarTextoAtividadeLoteAI = async (turma: any, atividade: any, s: any) => {
    const historico = obterHistoricoExclusao(turma, atividade, s);

    let faixaEtaria = "Infantil";
    if (turma.id.includes("mini") || turma.id.includes("maternal")) {
      faixaEtaria = "Mini e Maternal (Exploração Sensorial - 1 a 3 anos)";
    } else if (turma.id.includes("infantil1") || turma.id.includes("infantil 1")) {
      faixaEtaria = "Infantil 1 (4 anos)";
    } else if (turma.id.includes("infantil2") || turma.id.includes("infantil 2")) {
      faixaEtaria = "Infantil 2 (5 anos)";
    } else if (turma.id.includes("1ano") || turma.id.includes("1º ano") || turma.id.includes("1o ano")) {
      faixaEtaria = "Ensino Fundamental I (1º Ano - 6 anos)";
    } else if (turma.id.includes("2ano") || turma.id.includes("2º ano") || turma.id.includes("2o ano")) {
      faixaEtaria = "Ensino Fundamental I (2º Ano - 7 anos)";
    } else if (turma.id.includes("3ano") || turma.id.includes("3º ano") || turma.id.includes("3o ano")) {
      faixaEtaria = "Ensino Fundamental I (3º Ano - 8 anos)";
    } else if (turma.id.includes("4ano") || turma.id.includes("4º ano") || turma.id.includes("4o ano")) {
      faixaEtaria = "Ensino Fundamental I (4º Ano - 9 anos)";
    } else if (turma.id.includes("5ano") || turma.id.includes("5º ano") || turma.id.includes("5o ano")) {
      faixaEtaria = "Ensino Fundamental I (5º Ano - 10 anos)";
    } else if (turma.id.includes("6ano") || turma.id.includes("6º ano") || turma.id.includes("6o ano")) {
      faixaEtaria = "Ensino Fundamental II (6º Ano - pré-adolescentes de 11 a 12 anos)";
    } else if (turma.id.includes("ano") || turma.label.toLowerCase().includes("ano")) {
      faixaEtaria = `Ensino Fundamental (${turma.label})`;
    } else {
      faixaEtaria = `Educação Infantil (${turma.label})`;
    }

    const tTema = s.temasTurmas?.[turma.id] !== undefined ? s.temasTurmas[turma.id] : (s.tema || "Geral / Não especificado");

    const payload = {
      turmaNome: turma.label,
      faixaEtaria,
      semana: s.numero || 0,
      tema: tTema,
      categoria: (atividade.nome || "").split(":")[0],
      historico
    };

    const res = await fetch("/api/generate-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errText = (errData.originalError || errData.error || "").toLowerCase();
      if (
        errText.includes("429") || 
        errText.includes("quota") || 
        errText.includes("exhausted") || 
        errText.includes("limit") || 
        res.status === 429
      ) {
        throw new Error("QUOTA_EXCEEDED");
      }
      throw new Error(errData.error || `Status ${res.status}`);
    }

    const data = await res.json();
    if (!data.text || data.text.trim().length < 10) throw new Error("Insuficiente");

    return limparTextoTecnico(data.text);
  };

  const obterAtividadesPendentesLote = (turmaId?: string, atividadeId?: string) => {
    const pendentes: { turma: any; atividade: any }[] = [];
    const turmasAlvo = turmaId 
      ? turmas.filter((t: any) => t.id === turmaId) 
      : turmas;

    for (const t of ordenarTurmas(turmasAlvo)) {
      const items = ATIVIDADES[t.id] || [];
      for (const a of items) {
        if (atividadeId) {
          if (a.id === atividadeId) {
            pendentes.push({ turma: t, atividade: a });
          }
        } else {
          // No batch, are we only generating those with empty description?
          if (!a.descricao || !a.descricao.trim()) {
            pendentes.push({ turma: t, atividade: a });
          }
        }
      }
    }
    return pendentes;
  };

  const iniciarGeracaoLote = async (turmaIdArg?: any, atividadeIdArg?: any) => {
    const turmaId = typeof turmaIdArg === "string" ? turmaIdArg : undefined;
    const atividadeId = typeof atividadeIdArg === "string" ? atividadeIdArg : undefined;

    const pendentes = obterAtividadesPendentesLote(turmaId, atividadeId);
    if (pendentes.length === 0) {
      if (turmaId) {
        const tObj = turmas.find(x => x.id === turmaId);
        toast$(`Todas as atividades de "${tObj?.label || 'esta turma'}" já possuem propostas prontas!`, "aviso");
      } else {
        toast$("Todas as atividades já estão geradas ou possuem planejamentos prontos!", "aviso");
      }
      return;
    }

    setLoteTotal(pendentes.length);
    setLoteAtualIdx(0);
    setLoteItemAtual(pendentes[0]);
    setLoteProcessando(true);
    setLotePausadoCota(false);
    setLoteSegundosEspera(0);

    try {
      let currentSemanarios = [...semanarios];
      const sIndex = currentSemanarios.findIndex(s => s.id === semAtualId);
      if (sIndex === -1) throw new Error("Semanário não encontrado");

      const currentAtividades = JSON.parse(JSON.stringify(currentSemanarios[sIndex].atividades || {}));

      for (let i = 0; i < pendentes.length; i++) {
        const item = pendentes[i];
        setLoteAtualIdx(i);
        setLoteItemAtual(item);

        const s = currentSemanarios[sIndex];
        
        let tentativas = 0;
        let textoResult = "";
        let sucesso = false;

        while (!sucesso && tentativas < 3) {
          try {
            textoResult = await gerarTextoAtividadeLoteAI(item.turma, item.atividade, s);
            sucesso = true;
          } catch (err: any) {
            if (err.message === "QUOTA_EXCEEDED") {
              tentativas++;
              if (tentativas < 3) {
                setLotePausadoCota(true);
                // Espera de 45 segundos com contagem regressiva visível
                for (let seg = 45; seg > 0; seg--) {
                  setLoteSegundosEspera(seg);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
                setLotePausadoCota(false);
                setLoteSegundosEspera(0);
                console.log(`[Lote] Retentando geração para ${item.turma.label} devido a limite de quota. Tentativa ${tentativas}/3.`);
              } else {
                console.warn("[Lote] Limite de tentativas de quota atingido. Usando fallback padrão.");
                textoResult = obterFallbackTexto(item.atividade, s, item.turma);
                sucesso = true;
              }
            } else {
              console.warn("[Lote] Erro não-cota na geração. Usando fallback padrão:", err.message);
              textoResult = obterFallbackTexto(item.atividade, s, item.turma);
              sucesso = true;
            }
          }
        }

        const parsed = parseGerado(textoResult, item.atividade.nome);

        if (currentAtividades[item.turma.id]) {
          currentAtividades[item.turma.id] = currentAtividades[item.turma.id].map((a: any) => {
            if (a.id && item.atividade.id && a.id === item.atividade.id) {
              return formatarAtividadeUnica({
                ...a,
                nome: parsed.titulo,
                descricao: parsed.descricao
              }, item.turma.id);
            }
            return a;
          });
        }

        // Salvação incremental a cada atividade gerada com sucesso para evitar perdas
        setSemanarios((prev: any) => prev.map((s: any) => {
          if (s.id !== semAtualId) return s;
          return { ...s, atividades: JSON.parse(JSON.stringify(currentAtividades)) };
        }));

        // Cool-down spacing de 4.2s para otimizar e permanecer abaixo do limite de 15 RPM
        if (i < pendentes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 4200));
        }
      }

      if (atividadeId) {
        toast$("Proposta de atividade criada com sucesso!");
      } else if (turmaId) {
        const tObj = turmas.find(x => x.id === turmaId);
        toast$(`Geradas ${pendentes.length} propostas para ${tObj?.label || 'a turma'}!`);
      } else {
        toast$(`Geradas ${pendentes.length} propostas de atividades com sucesso!`);
      }
    } catch (err: any) {
      console.error("Erro na geração:", err);
      toast$("Ocorreu um erro durante a geração.", "erro");
    } finally {
      setLoteProcessando(false);
      setLoteItemAtual(null);
      setLotePausadoCota(false);
      setLoteSegundosEspera(0);
    }
  };

  const usarAtividadeGerada = () => {
    if (!genContext || !genResult) return;
    const { turma, atividade } = genContext;
    
    const parsed = parseGerado(genResult, atividade.nome);
    const dadosNovos = formatarAtividadeUnica({
      ...atividade,
      nome: parsed.titulo,
      descricao: parsed.descricao
    }, turma.id);
    
    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== semAtualId) return s;
      const atvs = s.atividades[turma.id].map((a: any) => {
        if (!a.id || !atividade.id || a.id !== atividade.id) return a;
        return {
          ...a,
          nome: dadosNovos.nome,
          descricao: dadosNovos.descricao
        };
      });
      return { ...s, atividades: { ...s.atividades, [turma.id]: atvs } };
    }));
    
    setModalGerador(false);
    toast$("Atividade aplicada!");
  };

  const handleImportarPDF = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast$("Por favor, selecione um arquivo PDF.", "erro");
      return;
    }

    setProcessandoAI(true);
    toast$("Lendo PDF com IA...", "info");

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      const turmasContext = turmas.map((t: any) => `- ${t.label}: ${t.id}`).join("\n");

      const res = await fetch("/api/import-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Data, turmasContext })
      });

      if (!res.ok) throw new Error("Erro no servidor");
      const data = await res.json();
      const rawAtividades = data.atividades || {};

      // Limpa textos técnicos e preserva as atividades e IDs existentes dos registros lançados!
      const semAtual = semanarios.find((x: any) => x.id === semAtualId);
      const existentesAtvs = semAtual ? semAtual.atividades : {};

      const novasAtividades: any = {};
      Object.keys(rawAtividades).forEach(tId => {
        const atvsExistentesTurma = existentesAtvs[tId] || [];
        
        novasAtividades[tId] = rawAtividades[tId].map((a: any) => {
          const catImportada = obterCategoriaPura(a.nome).toLowerCase();
          
          // Procurar atividade com a mesma categoria instalada para manter o ID
          const correspondente = atvsExistentesTurma.find((ae: any) => 
            obterCategoriaPura(ae.nome).toLowerCase() === catImportada
          );

          if (correspondente) {
            return formatarAtividadeUnica({
              ...a,
              id: correspondente.id, // PRESERVA ID ORIGINAL para não quebrar lançamentos do semanário
              nome: limparTextoTecnico(a.nome),
              descricao: limparTextoTecnico(a.descricao),
              adiResponsavel: correspondente.adiResponsavel || a.adiResponsavel || "",
              monitoras: correspondente.monitoras || a.monitoras || ""
            }, tId);
          } else {
            return formatarAtividadeUnica({
              ...a,
              nome: limparTextoTecnico(a.nome),
              descricao: limparTextoTecnico(a.descricao)
            }, tId);
          }
        });

        // Adiciona as atividades que existiam mas que o PDF não forneceu (para não deletar dados históricos)
        const categoriasImportadas = novasAtividades[tId].map((a: any) => 
          obterCategoriaPura(a.nome).toLowerCase()
        );
        
        atvsExistentesTurma.forEach((ae: any) => {
          const catExistente = obterCategoriaPura(ae.nome).toLowerCase();
          if (!categoriasImportadas.includes(catExistente)) {
            novasAtividades[tId].push(ae);
          }
        });
      });

      if (Object.keys(novasAtividades).length > 0) {
        setAtividadesPadrao((prev: any) => ({
          ...(prev || {}),
          ...novasAtividades
        }));
        
        setSemanarios((prev: any) => prev.map((s: any) => {
          if (s.id !== semAtualId) return s;
          return { 
            ...s, 
            atividades: {
              ...(s.atividades || {}),
              ...novasAtividades
            } 
          };
        }));
        toast$("Conteúdo do PDF distribuído com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast$("Erro ao processar o PDF com IA.", "erro");
    } finally {
      setProcessandoAI(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getPrioridadeTurma = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("mini") && l.includes("maternal")) return 1;
    if (l.includes("mini")) return 1;
    if (l.includes("maternal")) return 2;
    if (l.includes("infantil")) {
      const match = l.match(/\d/);
      return 10 + (match ? parseInt(match[0]) : 0);
    }
    if (l.includes("1") && l.includes("ano")) return 21;
    if (l.includes("2") && l.includes("ano")) return 22;
    if (l.includes("3") && l.includes("ano")) return 23;
    if (l.includes("4") && l.includes("ano")) return 24;
    if (l.includes("5") && l.includes("ano")) return 25;
    if (l.includes("6") && l.includes("ano")) return 26;
    if (l.includes("ano")) {
      const match = l.match(/\d/);
      return match ? 20 + parseInt(match[0]) : 30;
    }
    return 99;
  };

  const ordenarTurmas = (lista: any[]) => {
    return [...lista].sort((a, b) => {
      const pA = getPrioridadeTurma(a.label);
      const pB = getPrioridadeTurma(b.label);
      if (pA !== pB) return pA - pB;
      return a.label.localeCompare(b.label);
    });
  };

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem("semanario_registros", JSON.stringify(registros));
    } catch (e) {
      console.error("Erro ao salvar registros no localStorage:", e);
    }
  }, [registros]);

  useEffect(() => {
    try {
      localStorage.setItem("semanario_lista", JSON.stringify(semanarios));
    } catch (e) {
      console.error("Erro ao salvar lista de semanários no localStorage:", e);
    }
  }, [semanarios]);

  useEffect(() => {
    try {
      localStorage.setItem("semanario_turmas", JSON.stringify(turmas));
    } catch (e) {
      console.error("Erro ao salvar turmas no localStorage:", e);
    }
  }, [turmas]);

  useEffect(() => {
    try {
      localStorage.setItem("semanario_atividades_padrao", JSON.stringify(atividadesPadrao));
    } catch (e) {
      console.error("Erro ao salvar atividades padrão no localStorage:", e);
    }
  }, [atividadesPadrao]);

  const renderNomeAtividade = (nome: string, light = false) => {
    if (!nome) return null;
    const parts = nome.includes(":") ? nome.split(":") : [nome];
    let categoria = parts[0].trim();
    const titulo = parts.slice(1).join(":").trim();

    // Sanitização de nomes de categoria comuns
    if (categoria.toLowerCase() === "categoria artes") categoria = "Artes";
    if (categoria.toLowerCase() === "categoria") {
      // Se a categoria for apenas "CATEGORIA", tentamos extrair do título se ele começar com um nome conhecido
      const categoriasConhecidas = ["Artes", "Devocional", "Psicomotricidade", "Projetos", "Culinária", "Música", "Motoca"];
      const encontrou = categoriasConhecidas.find(c => titulo.toUpperCase().startsWith(c.toUpperCase()));
      if (encontrou) {
        categoria = encontrou;
      }
    }

    return (
      <>
        <span className={`block uppercase tracking-wider mb-0.5 ${light ? 'opacity-70 text-[9px]' : 'text-slate-500 text-[10px]'}`}>
          {categoria}:
        </span>
        {titulo && (
          <span className="block">
            {titulo}
          </span>
        )}
      </>
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem("semanario_midias", JSON.stringify(midias));
    } catch (e) {
      console.error("Erro ao salvar mídias no localStorage:", e);
    }
  }, [midias]);

  useEffect(() => {
    try {
      localStorage.setItem("semanario_atual_id", JSON.stringify(semAtualId));
    } catch (e) {
      console.error("Erro ao salvar semanário atual ID no localStorage:", e);
    }
  }, [semAtualId]);

  // Migração de nomes de atividades salvos no LocalStorage
  useEffect(() => {
    const keysToMigrate: { de: string; para: string }[] = [];

    const migrarNomes = (atvs: any[], tId?: string, semId?: string) => {
      let mudou = false;
      let listaAtvs = [...(atvs || [])];

      // IDs padrão de Contação de História mapeados por turma
      const idsContacao = ["mm4", "i1-4", "i2-4", "1a4", "2av3", "3av3", "4a3"];
      const mappingIdsContacao: Record<string, string> = {
        "mini-maternal-azul": "mm4",
        "infantil1-azul": "i1-4",
        "infantil2-azul": "i2-4",
        "1ano-azul": "1a4",
        "2ano-azul-vermelho": "2av3",
        "3ano-azul-vermelho": "3av3",
        "4ano-azul": "4a3"
      };

      // 1. DEDUPLICAÇÃO E AUTOCURA DE CONTAÇÃO DE HISTÓRIA
      if (tId && mappingIdsContacao[tId]) {
        const idEsperado = mappingIdsContacao[tId];
        
        // Identifica todas as atividades que pertencem ou alegam pertencer a Contação de História
        const deContacao = listaAtvs.filter(a => {
          const nomeLower = (a.nome || "").toLowerCase();
          const nomeNormalized = (a.nome || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ç/g, "c")
            .trim();
          return (
            a.id === idEsperado ||
            idsContacao.includes(a.id) ||
            nomeNormalized.startsWith("contacao de historia") ||
            nomeNormalized.startsWith("contacao e historia") ||
            nomeNormalized.startsWith("contacao:") ||
            nomeNormalized.startsWith("historia:") ||
            nomeLower.startsWith("contacao de historia") ||
            nomeLower.startsWith("contacao e historia") ||
            nomeLower.startsWith("contacao:") ||
            nomeLower.startsWith("historia:")
          );
        });

        if (deContacao.length > 0) {
          // Seleciona a melhor atividade desse grupo (aquela que possui maior conteúdo descritivo)
          let melhor = deContacao[0];
          for (const item of deContacao) {
            const descMelhor = melhor.descricao || "";
            const descItem = item.descricao || "";
            if (descItem.trim().length > descMelhor.trim().length) {
              melhor = item;
            } else if (descItem.trim().length === descMelhor.trim().length && item.id === idEsperado) {
              melhor = item;
            }
          }

          // Rastreia migração de chaves para não perder os registros
          if (semId) {
            deContacao.forEach(item => {
              if (item.id !== idEsperado) {
                keysToMigrate.push({
                  de: `${semId}||${tId}||${item.id}`,
                  para: `${semId}||${tId}||${idEsperado}`
                });
              }
            });
          }

          // Corrige o nome para garantir o padrão correto "Contação de História: <Título lúdico>"
          let nomeCorrigido = melhor.nome || "Contação de História:";
          const normNomeCorrigido = nomeCorrigido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c");
          if (!normNomeCorrigido.startsWith("contacao de historia:")) {
            // Remove prefixos errados ou reconstrói
            if (nomeCorrigido.startsWith("Contação:")) {
              nomeCorrigido = nomeCorrigido.replace("Contação:", "Contação de História:");
            } else if (nomeCorrigido.startsWith("História:")) {
              nomeCorrigido = nomeCorrigido.replace("História:", "Contação de História:");
            } else if (nomeCorrigido.startsWith("Contação de História")) {
              nomeCorrigido = "Contação de História: " + nomeCorrigido.substring(20).trim().replace(/^:/, "").trim();
            } else {
              nomeCorrigido = "Contação de História: " + nomeCorrigido;
            }
          }

          // Se após a correção ainda sobrou "Contação de História: " sem título extra, mantém só "Contação de História:"
          nomeCorrigido = nomeCorrigido.replace(/:\s*$/, ":").trim();

          const melhorCorrigida = {
            ...melhor,
            id: idEsperado,
            nome: nomeCorrigido
          };

          // Remove todos os registros de contação antigos e insere somente o melhor e corrigido
          listaAtvs = listaAtvs.filter(a => !deContacao.includes(a));
          listaAtvs.push(melhorCorrigida);
          
          if (deContacao.length > 1 || melhor.id !== idEsperado || melhor.nome !== nomeCorrigido) {
            mudou = true;
          }
        } else {
          // Se não havia absolutamente nenhum item de Contação, insere um novo limpo
          listaAtvs.push({ id: idEsperado, nome: "Contação de História:", descricao: "" });
          mudou = true;
        }
      }

      const novas = listaAtvs
        .filter(a => {
          // Remove Motoca do Infantil 1 e 2
          if ((tId === "infantil1-azul" || tId === "infantil2-azul") && a.nome?.startsWith("Motoca")) {
            mudou = true;
            return false;
          }
          return true;
        })
        .map(a => {
          let itemMudou = false;
          let novoNome = a.nome || "";
          let novaDescricao = a.descricao || "";

          // 2. CURA ADICIONAL DA CONTAÇÃO DE HISTÓRIA por ID (Evitamos zerar descrição!)
          if (a.id && idsContacao.includes(a.id)) {
            if (!novoNome.startsWith("Contação de História:")) {
              if (novoNome.startsWith("Contação de História")) {
                novoNome = "Contação de História: " + novoNome.substring(20).trim().replace(/^:/, "").trim();
              } else {
                novoNome = "Contação de História: " + novoNome;
              }
              novoNome = novoNome.replace(/:\s*$/, ":").trim();
              itemMudou = true;
            }
          }
          
          if (novoNome.startsWith("Contação:")) {
            novoNome = novoNome.replace("Contação:", "Contação de História:");
            itemMudou = true;
          }
          if (novoNome.startsWith("História:")) {
            novoNome = novoNome.replace("História:", "Contação de História:");
            itemMudou = true;
          }
          if (novoNome === "Caixa" || novoNome.startsWith("Caixa:")) {
            const base = (a.id?.includes("mm") || a.id?.includes("i1") || a.id?.includes("i2") || a.id?.includes("1a")) 
              ? "Caixa de Brinquedos" 
              : "Caixa de Jogos";
            
            if (novoNome.includes(":")) {
              novoNome = novoNome.replace("Caixa:", base + ":");
            } else {
              novoNome = base;
            }
            itemMudou = true;
          }

          // Renomeia Caixa de Brinquedos para Caixa de Jogos no 2º ano
          if (tId === "2ano-azul-vermelho" && novoNome.startsWith("Caixa de Brinquedos")) {
            novoNome = novoNome.replace("Caixa de Brinquedos", "Caixa de Jogos");
            itemMudou = true;
          }

          // Renomeia Motoca no Mini e Maternal
          if (tId === "mini-maternal-azul" && novoNome.startsWith("Motoca e Circuito Simples")) {
            novoNome = "Motoca";
            itemMudou = true;
          }

          if (novoNome.startsWith("Categoria Artes:")) {
            novoNome = novoNome.replace("Categoria Artes:", "Artes:");
            itemMudou = true;
          }

          // Correção do Lego do 6º Ano para garantir o padrão com dois pontos "Lego:"
          if (tId === "6ano-azul" && (a.id === "6a12" || novoNome.toLowerCase() === "lego" || novoNome.toLowerCase().startsWith("lego"))) {
            if (!novoNome.includes(":")) {
              novoNome = "Lego: " + novoNome.substring(4).trim();
              novoNome = novoNome.replace(/:\s*$/, ":").trim();
              itemMudou = true;
            }
          }

          if (itemMudou) {
            mudou = true;
            return { ...a, nome: novoNome, descricao: novaDescricao };
          }
          return a;
        });
      return { novas, mudou };
    };

    setSemanarios((prev: any) => {
      let globalMudou = false;
      const novos = prev.map((s: any) => {
        const novasAtividades: any = {};
        let sMudou = false;
        Object.keys(s.atividades || {}).forEach(tId => {
          const { novas, mudou } = migrarNomes(s.atividades[tId], tId, s.id);
          
          // INJECTION: Also ensure any missing standard activities (like Lição de Casa) are added to existing semanarios
          const nomesExistentes = novas.map(a => (a.nome || "").toLowerCase());
          const extras = ATIVIDADES_PADRAO[tId] || [];
          let finalAtvs = [...novas];
          let mExtra = false;
          
          extras.forEach((ex: any) => {
            const catName = ex.nome.split(":")[0].trim().toLowerCase();
            const exists = nomesExistentes.some(n => {
              const cn = n.split(":")[0].trim().toLowerCase();
              return cn === catName;
            });
            if (!exists) {
              finalAtvs.push(ex);
              mExtra = true;
            }
          });
          
          novasAtividades[tId] = finalAtvs;
          if (mudou || mExtra) sMudou = true;
        });
        if (sMudou) {
          globalMudou = true;
          return { ...s, atividades: novasAtividades };
        }
        return s;
      });
      return globalMudou ? novos : prev;
    });

    setAtividadesPadrao((prev: any) => {
      let globalMudou = false;
      const novasPadrao: any = {};
      Object.keys(prev || {}).forEach(tId => {
        const { novas: n1, mudou: m1 } = migrarNomes(prev[tId], tId);
        
        // Injeção de novas atividades padrão se não existirem
        const nomesExistentes = n1.map(a => (a.nome || "").toLowerCase());
        const extras = ATIVIDADES_PADRAO[tId] || [];
        let finalAtvs = [...n1];
        let m2 = false;

        // Remoção específica da atividade solicitada (Roda Quinta-feira no 6º Ano)
        if (tId === "6ano-azul") {
          const antes = finalAtvs.length;
          finalAtvs = finalAtvs.filter(a => !a.nome.toLowerCase().includes("roda quinta-feira"));
          if (finalAtvs.length !== antes) m2 = true;
        }

        extras.forEach((ex: any) => {
          if (!nomesExistentes.includes(ex.nome.toLowerCase())) {
            finalAtvs.push(ex);
            m2 = true;
          }
        });

        novasPadrao[tId] = finalAtvs;
        if (m1 || m2) globalMudou = true;
      });
      return globalMudou ? novasPadrao : prev;
    });

    // Executa a migração das chaves dos registros e mídias se houve correção de IDs
    if (keysToMigrate.length > 0) {
      setRegistros((prevRegs: any) => {
        let regMudou = false;
        const novosRegs = { ...prevRegs };
        keysToMigrate.forEach(({ de, para }) => {
          if (prevRegs[de]) {
            if (!novosRegs[para] || (prevRegs[de].salvoEm && (!novosRegs[para].salvoEm || prevRegs[de].status !== 'nao_realizada'))) {
              novosRegs[para] = { ...prevRegs[de] };
              regMudou = true;
            }
          }
        });
        return regMudou ? novosRegs : prevRegs;
      });

      setMidias((prevMids: any) => {
        let midiaMudou = false;
        const novasMids = { ...prevMids };
        keysToMigrate.forEach(({ de, para }) => {
          if (prevMids[de] && prevMids[de].length > 0) {
            novasMids[para] = [...(novasMids[para] || []), ...(prevMids[de])];
            const unique: any[] = [];
            const seen = new Set();
            for (const m of novasMids[para]) {
              const hash = `${m.tipo}||${m.nome}`;
              if (!seen.has(hash)) {
                seen.add(hash);
                unique.push(m);
              }
            }
            novasMids[para] = unique;
            midiaMudou = true;
          }
        });
        return midiaMudou ? novasMids : prevMids;
      });
    }
  }, []);

  const sem = semanarios.find(s => s.id === semAtualId) || semanarios[0];
  const ATIVIDADES = sem.atividades || {};

  const chave = (tId: string, aId: string) => `${semAtualId}||${tId}||${aId}`;
  const getReg = (tId: string, aId: string) => registros[chave(tId, aId)] || null;

  const toast$ = (msg: string, tipo = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const abrirForm = (turma: any, atv: any) => {
    const k = chave(turma.id, atv.id);
    const ex = registros[k];
    setFormData(ex ? { ...ex } : { status: null, justificativa: "", novaProposta: "" });
    setMidias((m: any) => ({ ...m, [k]: m[k] || [] }));
    setTurmaSel(turma);
    setAtividadeSel(atv);
    setTela("atividade");
  };

  const salvar = () => {
    if (!formData.status) { toast$("Selecione o status.", "erro"); return; }
    if (formData.status === "nao_realizada" && !formData.justificativa?.trim()) { toast$("Justifique a não realização.", "erro"); return; }
    if (formData.status === "substituida"   && !formData.novaProposta?.trim())  { toast$("Descreva a nova proposta.", "erro"); return; }
    setSalvando(true);
    setTimeout(() => {
      const k = chave(turmaSel.id, atividadeSel.id);
      setRegistros((r: any) => ({ ...r, [k]: { ...formData, salvoEm: new Date().toLocaleString("pt-BR") } }));
      setSalvando(false);
      toast$("Registro salvo!");
      setTela("turma");
    }, 600);
  };

  const handleMidia = async (e: any) => {
    const k = chave(turmaSel.id, atividadeSel.id);
    const novas: any[] = [];
    for (const f of Array.from(e.target.files) as File[]) {
      if (f.type.startsWith("image/")) novas.push({ tipo: "imagem", nome: f.name, src: await compressImage(f) });
      else if (f.type.startsWith("video/")) novas.push({ tipo: "video", nome: f.name, src: URL.createObjectURL(f) });
    }
    setMidias((m: any) => ({ ...m, [k]: [...(m[k] || []), ...novas] }));
  };

  const removerMidia = (idx: number) => {
    const k = chave(turmaSel.id, atividadeSel.id);
    setMidias((m: any) => { const a = [...(m[k] || [])]; a.splice(idx, 1); return { ...m, [k]: a }; });
  };

  const carregarAtividadesPesquisa = async () => {
    if (!user || guestMode) {
      // offline/local mode: build from local semanarios list
      const list: any[] = [];
      semanarios.forEach(sem => {
        if (sem.atividades) {
          Object.keys(sem.atividades).forEach(turmaId => {
            const arr = sem.atividades[turmaId] || [];
            arr.forEach((activity: any) => {
              list.push({
                id: activity.id,
                semanarioId: sem.id,
                semanarioNumero: sem.numero || 0,
                periodo: sem.periodo || "",
                turmaId: turmaId,
                turmaNome: turmas.find((t: any) => t.id === turmaId)?.label || turmaId,
                nome: activity.nome || "",
                titulo: obterTituloPuro(activity.nome),
                categoria: obterCategoriaPura(activity.nome),
                descricao: activity.descricao || "",
                adiResponsavel: activity.adiResponsavel || "",
                monitoras: activity.monitoras || "",
                criadoPorEmail: activity.criadoPorEmail || "Local",
                atualizadoEm: ""
              });
            });
          });
        }
      });
      setAtividadesPesquisa(list);
      return;
    }

    setCarregandoPesquisa(true);
    try {
      const snap = await getDocs(collection(db, "atividades_db"));
      const list: any[] = [];
      snap.forEach(d => {
        list.push(d.data());
      });
      setAtividadesPesquisa(list);
    } catch (err) {
      console.error(err);
      toast$("Erro ao carregar atividades do Firestore.", "erro");
    } finally {
      setCarregandoPesquisa(false);
    }
  };

  const getGrupoDeTurma = (tId: string) => {
    const idLower = tId.toLowerCase();
    if (idLower.includes("mini") || idLower.includes("maternal") || idLower.includes("infantil")) {
      return 1;
    }
    if (idLower.includes("1ano") || idLower.includes("2ano")) {
      return 2;
    }
    return 3;
  };

  const abrirModalNovo = () => {
    if (user && !guestMode && userRole === "auxiliar") {
      toast$("Apenas Coordenadores e Administradores podem gerenciar semanas.", "erro");
      return;
    }
    const proximo = Math.max(...semanarios.map(s => s.numero || 0), 0) + 1;
    setNovoForm({ 
      startDate: "", 
      endDate: "", 
      numero: proximo,
      tema: "",
      usarTemasPorTurma: false,
      temaGrupo1: "",
      temaGrupo2: "",
      temaGrupo3: "",
      temasPorTurma: {}
    });
    setModalNovo(true);
  };

  const criarNovo = () => {
    if (!novoForm.startDate || !novoForm.endDate) { toast$("Informe as datas de início e fim.", "erro"); return; }
    
    const d1 = new Date(novoForm.startDate + "T00:00:00");
    const d2 = new Date(novoForm.endDate + "T00:00:00");
    const p1 = `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}`;
    const p2 = `${String(d2.getDate()).padStart(2, '0')}/${String(d2.getMonth() + 1).padStart(2, '0')}/${d2.getFullYear()}`;
    const periodoFormatado = `${p1} a ${p2}`;
    
    const nextId = `sem-${pad(novoForm.numero)}`;
    if (semanarios.some(s => s.id === nextId)) {
      toast$("Já existe um semanário com este número.", "erro");
      return;
    }

    // Cria estrutura de turmas baseada na base de dados padronizada (ATIVIDADES_PADRAO) com categorias limpas e em ordem alfabética como modelo de documento
    const atividadesLimpas: any = {};
    turmas.forEach((t: any) => {
      const base = ATIVIDADES_PADRAO[t.id] || [];
      atividadesLimpas[t.id] = base.map((a: any, index: number) => {
        const catPura = a.nome.includes(":") ? a.nome.split(":")[0].trim() : a.nome.trim();
        return {
          id: a.id || `${t.id}_new_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          nome: `${catPura}:`,
          descricao: "",
          adiResponsavel: "",
          monitoras: ""
        };
      });
    });

    const temasTurmas: Record<string, string> = {};
    if (novoForm.usarTemasPorTurma) {
      turmas.forEach((t: any) => {
        const g = getGrupoDeTurma(t.id);
        let temaAssign = "";
        if (g === 1) {
          temaAssign = novoForm.temaGrupo1 || "";
        } else if (g === 2) {
          temaAssign = novoForm.temaGrupo2 || "";
        } else {
          temaAssign = novoForm.temaGrupo3 || "";
        }
        
        if (novoForm.temasPorTurma && novoForm.temasPorTurma[t.id]) {
          temaAssign = novoForm.temasPorTurma[t.id];
        }
        
        temasTurmas[t.id] = temaAssign.trim() || novoForm.tema || "Geral";
      });
    }

    const novo = { 
      id: nextId,
      numero: novoForm.numero, 
      periodo: periodoFormatado, 
      atividades: atividadesLimpas,
      tema: novoForm.tema,
      ...(novoForm.usarTemasPorTurma ? { temasTurmas } : {})
    };

    setSemanarios((prev: any) => [...prev, novo]);
    setSemAtualId(novo.id);
    setModalNovo(false);
    toast$(`Semanário S ${novoForm.numero} criado!`);
  };

  const abrirModalEditarSemana = () => {
    if (user && !guestMode && userRole === "auxiliar") {
      toast$("Apenas Coordenadores e Administradores podem editar semanas.", "erro");
      return;
    }
    const s = semanarios.find(x => x.id === semAtualId);
    if (!s) return;
    setEditSemForm({ ...s, startDate: "", endDate: "" });
    setModalEditSem(true);
  };

  const salvarEdicaoSemana = () => {
    let periodo = editSemForm.periodo;
    if (editSemForm.startDate && editSemForm.endDate) {
      const d1 = new Date(editSemForm.startDate + "T00:00:00");
      const d2 = new Date(editSemForm.endDate + "T00:00:00");
      const p1 = `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}`;
      const p2 = `${String(d2.getDate()).padStart(2, '0')}/${String(d2.getMonth() + 1).padStart(2, '0')}/${d2.getFullYear()}`;
      periodo = `${p1} a ${p2}`;
    }

    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== semAtualId) return s;
      return { ...s, numero: editSemForm.numero, periodo, tema: editSemForm.tema };
    }));

    setModalEditSem(false);
    toast$("Semanário atualizado!");
  };

  const excluirSemana = () => {
    if (user && !guestMode && userRole === "auxiliar") {
      toast$("Apenas Coordenadores e Administradores podem excluir semanas.", "erro");
      return;
    }
    if (!semParaExcluir) return;
    const id = semParaExcluir.id;
    const novasSemanas = semanarios.filter(s => s.id !== id);
    
    if (novasSemanas.length === 0) {
      toast$("Não é possível excluir o único semanário.", "erro");
      setModalExcluirSem(false);
      return;
    }

    setSemanarios(novasSemanas);
    if (semAtualId === id) {
      setSemAtualId(novasSemanas[0].id);
    }

    // Limpeza opcional de registros e mídias
    setRegistros((prev: any) => {
      const copy = { ...prev };
      Object.keys(copy).forEach(k => {
        if (k.startsWith(id + "||")) delete copy[k];
      });
      return copy;
    });

    setModalExcluirSem(false);
    setSemParaExcluir(null);
    toast$("Semanário excluído.");
  };

  // Funções de edição de estrutura de atividades
  const adicionarBase = (tId: string) => {
    const nova = { 
      id: `atv-${Date.now()}`, 
      nome: "Nova Atividade", 
      descricao: "Toque no lápis para editar...",
      adiResponsavel: "",
      monitoras: "",
      criadoPorEmail: user?.email || "Local"
    };
    const activeSemId = sem?.id || semAtualId;
    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== activeSemId) return s;
      return { 
        ...s, 
        atividades: { 
          ...s.atividades, 
          [tId]: [...(s.atividades[tId] || []), nova] 
        } 
      };
    }));
    toast$("Atividade adicionada!");
  };

  const removerDaEstrutura = (tId: string, aId: string) => {
    const activeSemId = sem?.id || semAtualId;
    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== activeSemId) return s;
      const tAtvs = s.atividades[tId] || [];
      return { 
          ...s, 
          atividades: { 
            ...s.atividades, 
            [tId]: tAtvs.filter((a: any) => a.id !== aId) 
          } 
      };
    }));
    toast$("Atividade removida.");
  };

  const executarCopiaAtividade = () => {
    if (!atvParaCopiar || !turmaOrigem) return;
    
    const categoriaFonte = obterCategoriaPura(atvParaCopiar.nome).toLowerCase();
    const targetAtvIds: Record<string, string> = {};
    const novasAtividadesPorTurma: Record<string, any[]> = {};

    turmasDestinoSelecionadas.forEach((destTurmaId) => {
      const atvsDest = [...(sem.atividades[destTurmaId] || [])];
      
      // Procurar por atividade com a mesma categoria
      const idx = atvsDest.findIndex((a: any) => obterCategoriaPura(a.nome).toLowerCase() === categoriaFonte);
      
      if (idx !== -1) {
        // Substituir nome e descrição da atividade encontrada
        const idExistente = atvsDest[idx].id;
        targetAtvIds[destTurmaId] = idExistente;

        const updatedAtv = {
          ...atvsDest[idx],
          nome: atvParaCopiar.nome,
          descricao: atvParaCopiar.descricao,
          adiResponsavel: atvParaCopiar.adiResponsavel || "",
          monitoras: atvParaCopiar.monitoras || ""
        };
        atvsDest[idx] = formatarAtividadeUnica(updatedAtv, destTurmaId);
      } else {
        // Criar uma nova atividade para essa turma se ela não tiver essa categoria
        const novoId = `copied_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        targetAtvIds[destTurmaId] = novoId;

        const novaAtv = {
          ...atvParaCopiar,
          id: novoId
        };
        atvsDest.push(formatarAtividadeUnica(novaAtv, destTurmaId));
      }
      
      novasAtividadesPorTurma[destTurmaId] = atvsDest;
    });

    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== semAtualId) return s;
      
      const novasAtividades = { ...s.atividades };
      turmasDestinoSelecionadas.forEach((destTurmaId) => {
        novasAtividades[destTurmaId] = novasAtividadesPorTurma[destTurmaId];
      });
      
      return { ...s, atividades: novasAtividades };
    }));

    if (copiarRegistro) {
      const chaveOrigem = `${semAtualId}||${turmaOrigem.id}||${atvParaCopiar.id}`;
      const regOrigem = registros[chaveOrigem];
      
      if (regOrigem) {
        setRegistros((prevRegs: any) => {
          const novosRegs = { ...prevRegs };
          
          turmasDestinoSelecionadas.forEach((destTurmaId) => {
            const targetId = targetAtvIds[destTurmaId];
            if (targetId) {
              const chaveDestNode = `${semAtualId}||${destTurmaId}||${targetId}`;
              novosRegs[chaveDestNode] = {
                ...regOrigem,
                salvoEm: new Date().toLocaleString("pt-BR")
              };
            }
          });
          
          return novosRegs;
        });
      }

      // Também copiar mídias se houver
      const midsOrigem = midias[chaveOrigem];
      if (midsOrigem && midsOrigem.length > 0) {
        setMidias((prevMids: any) => {
          const novasMids = { ...prevMids };
          turmasDestinoSelecionadas.forEach((destTurmaId) => {
            const targetId = targetAtvIds[destTurmaId];
            if (targetId) {
              const chaveDestNode = `${semAtualId}||${destTurmaId}||${targetId}`;
              novasMids[chaveDestNode] = [...midsOrigem];
            }
          });
          return novasMids;
        });
      }
    }

    setModalCopiarAtv(false);
    setTurmasDestinoSelecionadas([]);
    toast$("Atividade copiada com sucesso para as turmas selecionadas!");
  };

  const salvarEdicaoEstrutura = () => {
    if (!editandoEstrutura.nome.trim()) return;
    const activeSemId = sem?.id || semAtualId;
    setSemanarios((prev: any) => prev.map((s: any) => {
      if (s.id !== activeSemId) return s;
      const tId = turmaSel.id;
      const novas = s.atividades[tId].map((a: any) => 
        a.id === editandoAtividadeId ? formatarAtividadeUnica({ 
          ...a, 
          nome: `${editandoEstrutura.categoria || obterCategoriaPura(a.nome)}: ${editandoEstrutura.nome}`, 
          descricao: editandoEstrutura.descricao,
          adiResponsavel: editandoEstrutura.adiResponsavel || "",
          monitoras: editandoEstrutura.monitoras || ""
        }, tId) : a
      );
      return { ...s, tema: editandoEstrutura.tema, atividades: { ...s.atividades, [tId]: novas } };
    }));
    setEditandoEstrutura(null);
    toast$("Atualizado!");
  };

  const criarTurma = () => {
    if (user && !guestMode && userRole !== "admin") {
      toast$("Apenas Administradores podem criar turmas.", "erro");
      return;
    }
    if (!nomeNovaTurma.trim()) { toast$("Informe o nome da turma.", "erro"); return; }
    
    const id = nomeNovaTurma.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (turmas.some(t => t.id === id)) {
      toast$("Já existe uma turma com este nome.", "erro");
      return;
    }

    // Clone activities from the first existing class to serve as a template
    const templateTurmaId = turmas[0]?.id;
    const templateAtividades = templateTurmaId ? (ATIVIDADES[templateTurmaId] || ATIVIDADES_PADRAO[templateTurmaId] || []) : [];
    
    // Create deep copy of activities with new IDs (though keeping IDs might be fine if they are used as generic types, 
    // but better to keep them consistent with the structure)
    const novasAtividades = templateAtividades.map((a: any) => formatarAtividadeUnica({ ...a }, id));

    const nova = { id, label: nomeNovaTurma, cor: corNovaTurma };
    
    setTurmas(prev => ordenarTurmas([...prev, nova]));
    
    setAtividadesPadrao(prev => ({ ...prev, [id]: novasAtividades }));
    
    const activeSemId = sem?.id || semAtualId;
    setSemanarios(prev => prev.map(s => {
      if (s.id !== activeSemId) return s;
      return { ...s, atividades: { ...s.atividades, [id]: novasAtividades } };
    }));

    setModalTurma(false);
    setCorNovaTurma("#2563EB");
    setNomeNovaTurma("");
    toast$(`Turma ${nomeNovaTurma} criada com atividades!`);
  };

  const removerTurma = (id: string, label: string) => {
    if (user && !guestMode && userRole !== "admin") {
      toast$("Apenas Administradores podem remover turmas.", "erro");
      return;
    }
    setTurmas(prev => prev.filter(t => t.id !== id));
    
    setAtividadesPadrao((prev: any) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setSemanarios((prev: any) => prev.map((s: any) => {
      const atvs = { ...s.atividades };
      delete atvs[id];
      return { ...s, atividades: atvs };
    }));

    toast$(`Turma ${label} excluída.`);
    if (tela === "turma") setTela("home");
    if (turmaSel?.id === id) setTurmaSel(null);
  };

  const recuperarMaternal = () => {
    const classeMaternal = { id: "mini-maternal-azul", label: "Mini e Maternal Azul", cor: "#14B8A6" };
    
    setTurmas(prev => {
      if (prev.some(t => t.id === "mini-maternal-azul")) return prev;
      return ordenarTurmas([...prev, classeMaternal]);
    });

    const atvsMaternal = (ATIVIDADES_PADRAO["mini-maternal-azul"] || []).map((a: any) => formatarAtividadeUnica(a, "mini-maternal-azul"));

    setAtividadesPadrao((prev: any) => ({
      ...prev,
      "mini-maternal-azul": atvsMaternal
    }));

    setSemanarios((prev: any) => prev.map((s: any) => {
      const atvs = { ...s.atividades };
      atvs["mini-maternal-azul"] = atvsMaternal.map((a: any) => ({ ...a }));
      return { ...s, atividades: atvs };
    }));

    toast$("Mini e Maternal Azul e suas atividades originais foram recuperados com sucesso!", "sucesso");
  };

  const recuperar6ano = () => {
    const classe6 = { id: "6ano-azul", label: "6º Ano Azul", cor: "#2563EB" };
    
    setTurmas(prev => {
      if (prev.some(t => t.id === "6ano-azul")) return prev;
      return ordenarTurmas([...prev, classe6]);
    });

    const atvs6 = (ATIVIDADES_PADRAO["6ano-azul"] || []).map((a: any) => formatarAtividadeUnica(a, "6ano-azul"));

    setAtividadesPadrao((prev: any) => ({
      ...prev,
      "6ano-azul": atvs6
    }));

    setSemanarios((prev: any) => prev.map((s: any) => {
      const atvs = { ...s.atividades };
      atvs["6ano-azul"] = atvs6.map((a: any) => ({ ...a }));
      return { ...s, atividades: atvs };
    }));

    toast$("6º Ano Azul e suas atividades originais foram recuperados com sucesso!", "sucesso");
  };

  useEffect(() => {
    const tem6ano = turmas.some((t: any) => t.id === "6ano-azul");
    if (!tem6ano) {
      recuperar6ano();
    }
    const temMaternal = turmas.some((t: any) => t.id === "mini-maternal-azul");
    if (!temMaternal) {
      recuperarMaternal();
    }
  }, []);

  const baixarAtividades = async (listaTurmas: any[] | any) => {
    const turmas = Array.isArray(listaTurmas) ? listaTurmas : [listaTurmas];
    
    if (turmas.length === 0) {
      toast$("Nenhuma turma selecionada.", "erro");
      return;
    }

    toast$("Gerando PDF...", "info");

    const doc = new jsPDF();
    const margin = 14;
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("INTEGRAL", margin, y);
    
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text("Semanário de Atividades", margin + 45, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Semana: ${sem.numero} | Período: ${sem.periodo}`, margin, y);
    
    y += 5;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.line(margin, y, 196, y);
    y += 15;

    for (const t of turmas) {
      const atvs = [...(ATIVIDADES[t.id] || [])].sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      if (atvs.length === 0) continue;

      // Class Name
      if (y > 250) { doc.addPage(); y = 20; }
      
      doc.setFontSize(16);
      doc.setTextColor(t.cor);
      doc.text(t.label.toUpperCase(), margin, y);
      y += 2;
      doc.setDrawColor(t.cor);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 40, y);
      
      y += 6;
      const tTema = sem.temasTurmas?.[t.id] !== undefined ? sem.temasTurmas[t.id] : (sem.tema || "");
      if (tTema) {
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // slate-900 (highly visible)
        doc.setFont("helvetica", "normal");
        doc.text(`Tema: ${tTema}`, margin, y);
        y += 7;
      } else {
        y += 2;
      }

      for (const a of atvs) {
        const reg = getReg(t.id, a.id);
        const k = chave(t.id, a.id);
        const fotos = (midias[k] || []).filter((m: any) => m.tipo === "imagem");

        // Activity Check - lowered the threshold to 230 to prevent orphans with larger fonts
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(a.nome, margin, y);
        doc.setFont("helvetica", "normal");
        y += 6;

        if (a.adiResponsavel || a.monitoras) {
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85); // slate-700
          let extra = "";
          if (a.adiResponsavel) extra += `ADI: ${a.adiResponsavel}  `;
          if (a.monitoras) extra += `Monitora(s): ${a.monitoras}`;
          doc.text(extra, margin, y);
          y += 5;
        }
        y += 1;

        // High-contrast, highly legible description body text
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // slate-900 (dense dark text, very clear)
        const descLines = doc.splitTextToSize(a.descricao, 180);
        doc.text(descLines, margin, y);
        y += descLines.length * 5.5 + 3;

        const status = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(reg ? status.cor : "#374151"); // slate-700 for better visibility in print
        doc.text(`${status.emoji} ${status.label}`, margin, y);
        doc.setFont("helvetica", "normal");
        y += 7;

        // Add execution details if they exist with highly legible styling
        if (reg?.status === "realizada" && reg.justificativa) {
          doc.setFontSize(10.5);
          doc.setTextColor(15, 23, 42); // slate-900
          doc.setFont("helvetica", "bold");
          doc.text("Feedback da Realização:", margin + 5, y);
          doc.setFont("helvetica", "normal");
          y += 5;

          doc.setFontSize(10.5);
          doc.setTextColor(51, 65, 85); // slate-700
          const justLines = doc.splitTextToSize(reg.justificativa, 170);
          doc.text(justLines, margin + 5, y);
          y += justLines.length * 5.2 + 3;
        }

        if (reg?.status === "substituida") {
          if (reg.novaProposta) {
            doc.setFontSize(11);
            doc.setTextColor(180, 83, 9); // Amber-700
            doc.setFont("helvetica", "bold");
            doc.text("Nova Proposta Realizada:", margin + 5, y);
            doc.setFont("helvetica", "normal");
            y += 5;

            doc.setFontSize(10.5);
            doc.setTextColor(15, 23, 42); // slate-900
            const propLines = doc.splitTextToSize(reg.novaProposta, 170);
            doc.text(propLines, margin + 5, y);
            y += propLines.length * 5.2 + 3;
          }
          if (reg.justificativa) {
            doc.setFontSize(10.5);
            doc.setTextColor(153, 27, 27); // Red-800
            doc.setFont("helvetica", "bold");
            doc.text("Motivo da Substituição:", margin + 5, y);
            doc.setFont("helvetica", "normal");
            y += 5;

            doc.setFontSize(10.5);
            doc.setTextColor(51, 65, 85); // slate-700
            const motLines = doc.splitTextToSize(reg.justificativa, 170);
            doc.text(motLines, margin + 5, y);
            y += motLines.length * 5.2 + 3;
          }
        }

        // Fotos
        if (fotos.length > 0) {
          y += 2;
          let xFoto = margin;
          const fotoSize = 45;
          for (const f of fotos) {
            if (xFoto + fotoSize > 190) {
              xFoto = margin;
              y += fotoSize + 5;
              if (y > 240) { doc.addPage(); y = 20; }
            }
            try {
              doc.addImage(f.src, 'JPEG', xFoto, y, fotoSize, fotoSize);
            } catch (err) {
              console.error("Erro ao incluir foto:", err);
            }
            xFoto += fotoSize + 5;
          }
          y += fotoSize + 10;
        } else {
          y += 4;
        }

        y += 6; // Padding between activities
      }
      y += 10; // Padding between classes
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`${i}/${pageCount}`, 196, 287, { align: "right" });
    }

    doc.save(`atividades_S${sem.numero}_${turmas.length === 1 ? turmas[0].id : 'global'}.pdf`);
    toast$("PDF pronto!");
  };

  const baixarAtividadeSoh = async (t: any, a: any) => {
    toast$("Gerando PDF da atividade...", "info");

    const doc = new jsPDF();
    const margin = 14;
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("INTEGRAL", margin, y);
    
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text("Semanário de Atividades", margin + 45, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Semana: ${sem.numero} | Período: ${sem.periodo}`, margin, y);
    
    y += 5;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.line(margin, y, 196, y);
    y += 15;

    // Class Name
    doc.setFontSize(16);
    doc.setTextColor(t.cor);
    doc.text(t.label.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(t.cor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 40, y);
    
    y += 6;
    const tTema = sem.temasTurmas?.[t.id] !== undefined ? sem.temasTurmas[t.id] : (sem.tema || "");
    if (tTema) {
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900 (highly visible)
      doc.setFont("helvetica", "normal");
      doc.text(`Tema: ${tTema}`, margin, y);
      y += 7;
    } else {
      y += 2;
    }

    const reg = getReg(t.id, a.id);
    const k = chave(t.id, a.id);
    const fotos = (midias[k] || []).filter((m: any) => m.tipo === "imagem");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // slate-900 (very clear)
    doc.text(a.nome, margin, y);
    doc.setFont("helvetica", "normal");
    y += 6;

    if (a.adiResponsavel || a.monitoras) {
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85); // slate-700
      let extra = "";
      if (a.adiResponsavel) extra += `ADI: ${a.adiResponsavel}  `;
      if (a.monitoras) extra += `Monitora(s): ${a.monitoras}`;
      doc.text(extra, margin, y);
      y += 5;
    }
    y += 1;

    // High contrast, legible main description
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900 (extremely clear, dense black)
    const descLines = doc.splitTextToSize(a.descricao || "", 180);
    doc.text(descLines, margin, y);
    y += descLines.length * 5.5 + 3;

    const status = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(reg ? status.cor : "#374151"); // slate-700
    doc.text(`${status.emoji} ${status.label}`, margin, y);
    doc.setFont("helvetica", "normal");
    y += 7;

    // Add execution details if they exist with dark, readable styling
    if (reg?.status === "realizada" && reg.justificativa) {
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.text("Feedback da Realização:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      y += 5;

      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85); // slate-700
      const justLines = doc.splitTextToSize(reg.justificativa, 170);
      doc.text(justLines, margin + 5, y);
      y += justLines.length * 5.2 + 3;
    }

    if (reg?.status === "substituida") {
      if (reg.novaProposta) {
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9); // Amber-700
        doc.setFont("helvetica", "bold");
        doc.text("Nova Proposta Realizada:", margin + 5, y);
        doc.setFont("helvetica", "normal");
        y += 5;

        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42); // slate-900
        const propLines = doc.splitTextToSize(reg.novaProposta, 170);
        doc.text(propLines, margin + 5, y);
        y += propLines.length * 5.2 + 3;
      }
      if (reg.justificativa) {
        doc.setFontSize(10.5);
        doc.setTextColor(153, 27, 27); // Red-800
        doc.setFont("helvetica", "bold");
        doc.text("Motivo da Substituição:", margin + 5, y);
        doc.setFont("helvetica", "normal");
        y += 5;

        doc.setFontSize(10.5);
        doc.setTextColor(51, 65, 85); // slate-700
        const motLines = doc.splitTextToSize(reg.justificativa, 170);
        doc.text(motLines, margin + 5, y);
        y += motLines.length * 5.2 + 3;
      }
    }

    // Fotos
    if (fotos.length > 0) {
      y += 2;
      let xFoto = margin;
      const fotoSize = 45;
      for (const f of fotos) {
        if (xFoto + fotoSize > 190) {
          xFoto = margin;
          y += fotoSize + 5;
          if (y > 240) { doc.addPage(); y = 20; }
        }
        try {
          doc.addImage(f.src, 'JPEG', xFoto, y, fotoSize, fotoSize);
        } catch (err) {
          console.error("Erro ao incluir foto:", err);
        }
        xFoto += fotoSize + 5;
      }
      y += fotoSize + 10;
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`${i}/${pageCount}`, 196, 287, { align: "right" });
    }

    const cleanTitle = a.nome.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
    doc.save(`atividade_S${sem.numero}_${t.id}_${cleanTitle}.pdf`);
    toast$("PDF pronto!");
  };

  // Stats
  const totalAtvs = Object.values(ATIVIDADES).reduce((s: number, a: any) => s + (a?.length || 0), 0) as number;
  const regsDoSem = Object.keys(registros).filter(k => k.startsWith(semAtualId + "||"));
  const totalLanc = regsDoSem.length as number;
  const porStatus = regsDoSem.reduce((acc: any, k) => { const s = registros[k].status; acc[s] = (acc[s]||0)+1; return acc; }, {} as any);

  const progTurma = (tId: string) => {
    const a = ATIVIDADES[tId] || [];
    const d = a.filter((x: any) => getReg(tId, x.id)).length;
    return { done: d, total: a.length, pct: a.length ? Math.round(d/a.length*100) : 0 };
  };

  if (!user && !guestMode) {
    return (
      <AuthScreen 
        onGuestAccess={() => {
          setGuestMode(true);
          try { localStorage.setItem("semanario_guest_mode", "true"); } catch {}
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto shadow-xl ring-1 ring-slate-200">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <Toast {...toast} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalNovo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Novo Semanário
              </h3>
              <p className="text-xs text-slate-500 mb-6">Será criado com as atividades padrão do sistema.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Semana</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">S</span>
                      <input 
                        type="number"
                        className="w-full border-2 border-slate-100 rounded-xl pl-8 pr-3 py-2.5 font-black text-slate-700 outline-none focus:border-blue-500 transition-colors"
                        value={novoForm.numero}
                        onChange={e => setNovoForm(f => ({ ...f, numero: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Tema Geral (Padrão)</label>
                    <input 
                      type="text"
                      placeholder="Ex: A Criação"
                      className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                      value={novoForm.tema}
                      onChange={e => setNovoForm(f => ({ ...f, tema: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Data Início</label>
                    <input 
                      type="date"
                      className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                      value={novoForm.startDate}
                      onChange={e => setNovoForm(f => ({ ...f, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Data Fim</label>
                    <input 
                      type="date"
                      className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                      value={novoForm.endDate}
                      onChange={e => setNovoForm(f => ({ ...f, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Seção Temas por Grupos de Turmas */}
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100/80">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-700">Temas Diferentes por Turmas</p>
                      <p className="text-[10px] text-slate-400">Definir temas pedagógicos divididos por faixas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={novoForm.usarTemasPorTurma || false}
                        onChange={e => setNovoForm(f => ({ ...f, usarTemasPorTurma: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {novoForm.usarTemasPorTurma && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 mt-3 pt-3 border-t border-slate-200/60"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-blue-750 uppercase tracking-wide flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-500" /> Temas Semanais por Grupos
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setNovoForm(f => ({
                              ...f,
                              temaGrupo1: "A Parábola do Semeador",
                              temaGrupo2: "Meio Ambiente",
                              temaGrupo3: "Reciclagem"
                            }));
                            toast$("Exemplo institucional preenchido!", "sucesso");
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[9px] py-1 px-2 rounded-lg transition-all border border-blue-150 active:scale-95"
                        >
                          Usar Sugestão do Exemplo
                        </button>
                      </div>

                      {/* Grupo 1: Mini e Maternal ao Infantil 2 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">Maternal ao Infantil 2:</span>
                          <div className="flex gap-0.5">
                            <span className="text-[8px] px-1 bg-teal-50 text-teal-600 font-medium rounded border border-teal-100">Mini/Maternal</span>
                            <span className="text-[8px] px-1 bg-teal-50 text-teal-600 font-medium rounded border border-teal-100">Infantil 1 e 2</span>
                          </div>
                        </div>
                        <input 
                          type="text"
                          placeholder="Ex: A Parábola do Semeador"
                          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                          value={novoForm.temaGrupo1 || ""}
                          onChange={e => setNovoForm(f => ({ ...f, temaGrupo1: e.target.value }))}
                        />
                      </div>

                      {/* Grupo 2: 1º e 2º Ano */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">1º e 2º Ano:</span>
                          <div className="flex gap-0.5">
                            <span className="text-[8px] px-1 bg-red-50 text-red-600 font-medium rounded border border-red-100">1º Ano</span>
                            <span className="text-[8px] px-1 bg-red-50 text-red-600 font-medium rounded border border-red-100">2º Ano</span>
                          </div>
                        </div>
                        <input 
                          type="text"
                          placeholder="Ex: Meio Ambiente"
                          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                          value={novoForm.temaGrupo2 || ""}
                          onChange={e => setNovoForm(f => ({ ...f, temaGrupo2: e.target.value }))}
                        />
                      </div>

                      {/* Grupo 3: 3º ao 6º Ano */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">3º ao 6º Ano:</span>
                          <div className="flex gap-0.5">
                            <span className="text-[8px] px-1 bg-blue-50 text-blue-600 font-medium rounded border border-blue-100">3º ao 6º Ano</span>
                          </div>
                        </div>
                        <input 
                          type="text"
                          placeholder="Ex: Reciclagem"
                          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                          value={novoForm.temaGrupo3 || ""}
                          onChange={e => setNovoForm(f => ({ ...f, temaGrupo3: e.target.value }))}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="pt-2 space-y-2">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    onClick={criarNovo}
                  >
                    <Save className="w-5 h-5" />
                    Criar Semanário S {novoForm.numero}
                  </button>
                  <button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                    onClick={() => setModalNovo(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalTurma && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Nova Turma
              </h3>
              <p className="text-sm text-slate-500 mb-6">Cadastre uma nova turma no sistema.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Nome da Turma</label>
                  <input 
                    type="text"
                    placeholder="Ex: Maternal 3"
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                    value={nomeNovaTurma}
                    onChange={e => setNomeNovaTurma(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Cor do Tema</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {["#14B8A6", "#DC2626", "#2563EB", "#7C3AED", "#DB2777", "#EA580C", "#059669", "#1E293B"].map(c => (
                      <button 
                        key={c}
                        onClick={() => setCorNovaTurma(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${corNovaTurma === c ? "border-slate-800 scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={corNovaTurma} 
                      onChange={e => setCorNovaTurma(e.target.value)}
                      className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-slate-400">Personalizar cor</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    onClick={criarTurma}
                  >
                    <Save className="w-5 h-5" />
                    Criar Turma
                  </button>
                  <button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                    onClick={() => setModalTurma(false)}
                  >
                    Cancelar
                  </button>

                  <div className="pt-4 mt-2 border-t border-slate-100 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Excluiu alguma turma padrão por engano?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          recuperarMaternal();
                          setModalTurma(false);
                        }}
                        className="bg-teal-50 hover:bg-teal-100 text-teal-750 font-extrabold py-2 px-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Maternal Azul
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          recuperar6ano();
                          setModalTurma(false);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-750 font-extrabold py-2 px-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> 6º Ano Azul
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loteProcessando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md z-[5000] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-350 ${lotePausadoCota ? "bg-amber-50 border-amber-100 text-amber-500 animate-pulse" : "bg-blue-50 border-blue-100 text-blue-600"}`}>
                {lotePausadoCota ? (
                  <Clock className="w-8 h-8" />
                ) : (
                  <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-800 leading-tight">
                  {lotePausadoCota ? "Limite Temporário de Cota" : "Gerando Atividades em Lote"}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  {lotePausadoCota 
                    ? "A cota diária/minuto do Gemini Gratuito foi atingida. Aguarde o cronômetro para retomar de onde parou."
                    : "Por favor, mantenha esta tela ativa enquanto a IA elabora as propostas pedagógicas da semana."}
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  <span>Progresso Geral</span>
                  <span>{loteAtualIdx + 1} de {loteTotal}</span>
                </div>
                
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${lotePausadoCota ? "bg-amber-450" : "bg-blue-600"}`} 
                    style={{ width: `${((loteAtualIdx + 1) / loteTotal) * 100}%` }}
                  />
                </div>

                {loteItemAtual && (
                  <div className="text-left space-y-1">
                    <span 
                      className="inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: loteItemAtual.turma.cor + "15", color: loteItemAtual.turma.cor }}
                    >
                      {loteItemAtual.turma.label}
                    </span>
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {loteItemAtual.atividade.nome.split(":")[0]}
                    </p>
                  </div>
                )}
              </div>

              {lotePausadoCota ? (
                <div className="w-full bg-amber-50 rounded-2xl p-3 border border-amber-100 text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-850">
                    Retomando em <strong className="text-sm font-black text-amber-700">{loteSegundosEspera}s</strong>
                  </span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Pausando de forma segura entre requisições para evitar instabilidades na comunicação com a API Gemini...
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalEditSem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                Editar Semana
              </h3>
              <p className="text-sm text-slate-500 mb-6">Alterar informações da semana atual.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Número da Semana</label>
                  <input 
                    type="number"
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none focus:border-blue-500"
                    value={editSemForm.numero}
                    onChange={e => setEditSemForm({ ...editSemForm, numero: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Tema da Semana</label>
                  <input 
                    type="text"
                    placeholder="Ex: A Criação de Deus"
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none focus:border-blue-500"
                    value={editSemForm.tema || ""}
                    onChange={e => setEditSemForm({ ...editSemForm, tema: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1">Período Direto (Opcional)</label>
                  <input 
                    type="text"
                    placeholder="Ex: 11/05 a 15/05/2026"
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none focus:border-blue-500"
                    value={editSemForm.periodo}
                    onChange={e => setEditSemForm({ ...editSemForm, periodo: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Início (Novo)</label>
                    <input 
                      type="date"
                      className="w-full border-2 border-slate-100 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                      value={editSemForm.startDate}
                      onChange={e => setEditSemForm({ ...editSemForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Fim (Novo)</label>
                    <input 
                      type="date"
                      className="w-full border-2 border-slate-100 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                      value={editSemForm.endDate}
                      onChange={e => setEditSemForm({ ...editSemForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic font-medium">Preencha as datas acima apenas se desejar recalcular o período automaticamente.</p>
                
                <div className="pt-4 space-y-2">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    onClick={salvarEdicaoSemana}
                  >
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </button>
                  <button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                    onClick={() => setModalEditSem(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalExcluirSem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Semana?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Tem certeza que deseja excluir esta semana? 
                <br/><span className="font-bold text-rose-600">Esta ação não poderá ser desfeita</span> e removerá todas as atividades, progresso e registros vinculados.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
                  onClick={excluirSemana}
                >
                  Sim, Excluir Semana
                </button>
                <button 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                  onClick={() => { setModalExcluirSem(false); setSemParaExcluir(null); }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalCopiarAtv && atvParaCopiar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Copy className="w-5 h-5 text-indigo-600" />
                  Copiar Atividade
                </h3>
                <button 
                  onClick={() => setModalCopiarAtv(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
                {/* Atividade de Origem */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Origem</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-black"
                      style={{ backgroundColor: (turmaOrigem?.cor || "#2563EB") + "15", color: turmaOrigem?.cor || "#2563EB" }}
                    >
                      {turmaOrigem?.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">{atvParaCopiar.nome}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{atvParaCopiar.descricao}</p>
                </div>

                {/* Info regra de copiar */}
                <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-3 text-xs text-blue-700/90 leading-relaxed">
                  💡 <strong>Como funciona a cópia?</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>Se a turma de destino já tiver uma atividade dessa mesma categoria (ex: <i>Artes</i>), ela será <strong>atualizada / substituída</strong> pela nova proposta copiada.</li>
                    <li>Se a turma de destino não tiver nenhuma atividade correspondente a esta categoria, a nova atividade será <strong>adicionada</strong>.</li>
                  </ul>
                </div>

                {/* Selecionar turmas destino */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-black text-slate-500 uppercase">Copiar para quais turmas?</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          const outras = turmas.filter(t => t.id !== turmaOrigem?.id).map(t => t.id);
                          setTurmasDestinoSelecionadas(outras);
                        }}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Selecionar Todas
                      </button>
                      <span className="text-slate-300 text-[10px]">|</span>
                      <button 
                        type="button"
                        onClick={() => setTurmasDestinoSelecionadas([])}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/40">
                    {turmas.map(t => {
                      const idOrigem = turmaOrigem?.id;
                      if (t.id === idOrigem) return null;
                      const isSel = turmasDestinoSelecionadas.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setTurmasDestinoSelecionadas(prev => prev.filter(tid => tid !== t.id));
                            } else {
                              setTurmasDestinoSelecionadas(prev => [...prev, t.id]);
                            }
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all ${isSel ? "bg-white shadow-sm" : "bg-transparent hover:bg-slate-50 border-transparent opacity-80"}`}
                          style={{ borderColor: isSel ? t.cor : "transparent" }}
                        >
                          <div 
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${isSel ? "text-white" : "border-slate-300 bg-white"}`}
                            style={{ backgroundColor: isSel ? t.cor : "transparent", borderColor: isSel ? t.cor : "#CBD5E1" }}
                          >
                            {isSel && (
                              <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-[3px]" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-black text-slate-700 truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Opção de registro */}
                <button
                  type="button"
                  onClick={() => setCopiarRegistro(!copiarRegistro)}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left w-full cursor-pointer"
                >
                  <div 
                    className={`mt-0.5 w-4.5 h-4.5 min-w-[18px] rounded flex items-center justify-center border transition-all ${copiarRegistro ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"}`}
                  >
                    {copiarRegistro && (
                      <svg className="w-3 h-3 fill-none stroke-current stroke-[3px]" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Copiar também o registro de realização?</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Se houver fotos, vídeos e justificativas salvas para esta atividade na turma atual, eles também serão copiados para a turma de destino.</span>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2 shrink-0">
                <button 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition-all"
                  onClick={() => setModalCopiarAtv(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:scale-100 flex items-center justify-center gap-2"
                  disabled={turmasDestinoSelecionadas.length === 0}
                  onClick={executarCopiaAtividade}
                >
                  <Copy className="w-5 h-5" />
                  Copiar para {turmasDestinoSelecionadas.length} {turmasDestinoSelecionadas.length === 1 ? "turma" : "turmas"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalGerador && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-blue-600 p-6 text-white shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Gerador de Atividade
                    </h3>
                    <p className="text-blue-100 text-xs font-bold mt-1 uppercase tracking-wider">
                      Sugestão Pedagógica com IA
                    </p>
                  </div>
                  <button onClick={() => setModalGerador(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {processandoAI ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
                    <div className="text-center">
                      <p className="font-black text-slate-600">Criativação em andamento...</p>
                      <p className="text-xs">A IA está preparando uma atividade inédita e humanizada.</p>
                    </div>
                  </div>
                ) : errorAI ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-slate-400 text-center">
                    <XCircle className="w-12 h-12 text-rose-500" />
                    <div className="flex flex-col items-center">
                      <p className="font-black text-slate-800 text-lg leading-tight mb-2">Não foi possível gerar a atividade</p>
                      <p className="text-sm text-slate-600 mb-8 max-w-md px-4 leading-relaxed">
                        {errorMensagemAI}
                      </p>
                      <button 
                        onClick={() => gerarAtividadeAI(genContext.turma, genContext.atividade)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 w-full"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Tentar Novamente
                      </button>
                    </div>
                  </div>
                ) : genResult ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5">
                      <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">
                        {genResult}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={usarAtividadeGerada}
                        className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-5 h-5" /> ✅ Usar Atividade
                      </button>
                      
                      <button 
                        onClick={() => gerarAtividadeAI(genContext.turma, genContext.atividade)}
                        className="col-span-2 bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-100 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <RefreshCw className="w-4 h-4" /> 🔄 Gerar Outra
                      </button>

                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(genResult);
                          toast$("Copiado para a área de transferência!");
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Copy className="w-4 h-4" /> 📋 Copiar
                      </button>

                      <button 
                        onClick={() => {
                          const parsed = parseGerado(genResult, genContext.atividade.nome);
                          setEditandoEstrutura({
                            ...genContext.atividade,
                            tema: sem.tema,
                            descricao: parsed.descricao,
                            nome: obterTituloPuro(parsed.titulo),
                            categoria: obterCategoriaPura(parsed.titulo)
                          });
                          setModalGerador(false);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Pencil className="w-4 h-4" /> ✏️ Editar
                      </button>

                      <button 
                        onClick={usarAtividadeGerada}
                        className="col-span-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Save className="w-4 h-4" /> 💾 Salvar no Semanário
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Baseado no tema: <span className="text-blue-500">{semanarios.find(s => s.id === semAtualId)?.tema || "Geral"}</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {telaBiblioteca && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-50 z-[1200] overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800">Biblioteca</h2>
                  <p className="text-slate-500 font-medium italic">Histórico e Pesquisa de Atividades</p>
                </div>
                <button 
                  onClick={() => setTelaBiblioteca(false)}
                  className="p-3 bg-white shadow-sm border border-slate-100 rounded-full text-slate-400 hover:text-slate-600 active:scale-90 transition-all cursor-pointer"
                >
                  <X />
                </button>
              </div>

              {/* Dual Tab Switcher */}
              <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setBibliotecaAba("semanas")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    bibliotecaAba === "semanas" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Semanários ({semanarios.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBibliotecaAba("pesquisa");
                    carregarAtividadesPesquisa();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bibliotecaAba === "pesquisa" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Pesquisa de Atividades ({atividadesPesquisa.length})
                </button>
              </div>

              {bibliotecaAba === "semanas" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {semanarios.map((s: any) => (
                    <motion.div
                      key={s.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSemAtualId(s.id);
                        setTelaBiblioteca(false);
                        toast$(`Semana ${s.numero} selecionada.`);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                        s.id === semAtualId 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-white border-slate-100 hover:border-blue-200 text-slate-800 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                          s.id === semAtualId ? "bg-white/20" : "bg-slate-100 text-slate-400"
                        }`}>
                          {s.numero}
                        </div>
                        <div>
                          <div className="font-black text-base">Semana {s.numero}</div>
                          <div className="text-xs font-bold opacity-70">{s.periodo}</div>
                          {s.tema && (
                            <div className={`text-[10px] italic mt-0.5 max-w-[160px] truncate ${s.id === semAtualId ? 'text-white/80' : 'text-slate-400'}`}>
                              Tema: {s.tema}
                            </div>
                          )}
                        </div>
                      </div>
                      {s.id === semAtualId && (
                        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Atual
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {semanarios.length === 0 && (
                    <div className="col-span-full text-center py-20">
                      <Library className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">Nenhum semanário encontrado.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Search and Filters Panel */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={pesquisaQuery}
                          onChange={(e) => setPesquisaQuery(e.target.value)}
                          placeholder="Buscar por título, descrição ou tema..."
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <button
                        onClick={carregarAtividadesPesquisa}
                        disabled={carregandoPesquisa}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                        title="Atualizar dados"
                      >
                        <RefreshCw className={`w-4 h-4 ${carregandoPesquisa ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Turma</label>
                        <select
                          value={pesquisaTurma}
                          onChange={(e) => setPesquisaTurma(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        >
                          <option value="">Todas as Turmas</option>
                          {turmas.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Categoria</label>
                        <select
                          value={pesquisaCategoria}
                          onChange={(e) => setPesquisaCategoria(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        >
                          <option value="">Todas as Categorias</option>
                          {Array.from(new Set(atividadesPesquisa.map(a => a.categoria).filter(Boolean))).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Criador (E-mail)</label>
                        <input
                          type="text"
                          value={pesquisaCriador}
                          onChange={(e) => setPesquisaCriador(e.target.value)}
                          placeholder="E-mail do criador..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-3">
                    {carregandoPesquisa ? (
                      <div className="text-center py-20 space-y-3">
                        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                        <p className="text-slate-400 text-sm font-bold">Carregando e indexando atividades...</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-bold text-slate-400 px-1 flex justify-between items-center">
                          <span>{
                            atividadesPesquisa.filter((a: any) => {
                              if (pesquisaQuery) {
                                const q = pesquisaQuery.toLowerCase();
                                const matchTitle = (a.titulo || "").toLowerCase().includes(q);
                                const matchDesc = (a.descricao || "").toLowerCase().includes(q);
                                const matchName = (a.nome || "").toLowerCase().includes(q);
                                if (!matchTitle && !matchDesc && !matchName) return false;
                              }
                              if (pesquisaCategoria && (a.categoria || "").toLowerCase() !== pesquisaCategoria.toLowerCase()) return false;
                              if (pesquisaTurma && a.turmaId !== pesquisaTurma) return false;
                              if (pesquisaCriador && !(a.criadoPorEmail || "").toLowerCase().includes(pesquisaCriador.toLowerCase())) return false;
                              return true;
                            }).length
                          } atividades encontradas</span>
                          {user && !guestMode && (
                            <span className="text-[10px] text-blue-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sincronizado com Firestore
                            </span>
                          )}
                        </div>

                        <div className="space-y-4">
                          {atividadesPesquisa.filter((a: any) => {
                            if (pesquisaQuery) {
                              const q = pesquisaQuery.toLowerCase();
                              const matchTitle = (a.titulo || "").toLowerCase().includes(q);
                              const matchDesc = (a.descricao || "").toLowerCase().includes(q);
                              const matchName = (a.nome || "").toLowerCase().includes(q);
                              if (!matchTitle && !matchDesc && !matchName) return false;
                            }
                            if (pesquisaCategoria && (a.categoria || "").toLowerCase() !== pesquisaCategoria.toLowerCase()) return false;
                            if (pesquisaTurma && a.turmaId !== pesquisaTurma) return false;
                            if (pesquisaCriador && !(a.criadoPorEmail || "").toLowerCase().includes(pesquisaCriador.toLowerCase())) return false;
                            return true;
                          }).map((a: any) => {
                            const corTurma = turmas.find(t => t.id === a.turmaId)?.cor || "#64748B";
                            return (
                              <div key={`${a.semanarioId}||${a.turmaId}||${a.id}`} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-black">
                                      Semana {a.semanarioNumero}
                                    </span>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                      {a.periodo}
                                    </span>
                                    <span style={{ backgroundColor: `${corTurma}15`, color: corTurma, borderColor: `${corTurma}30` }} className="border px-2 py-0.5 rounded-md text-[10px] font-black">
                                      {a.turmaNome}
                                    </span>
                                    {a.categoria && (
                                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                        {a.categoria}
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="text-base font-bold text-slate-800 leading-snug">{a.titulo || a.nome}</h4>
                                    <p className="text-xs text-slate-500 mt-1 font-medium whitespace-pre-wrap leading-relaxed">{a.descricao || "Sem descrição registrada."}</p>
                                  </div>

                                  {(a.adiResponsavel || a.monitoras) && (
                                    <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-slate-400 border-t border-slate-100/50">
                                      {a.adiResponsavel && (
                                        <div>
                                          <span className="font-bold text-slate-500">ADI:</span> {a.adiResponsavel}
                                        </div>
                                      )}
                                      {a.monitoras && (
                                        <div>
                                          <span className="font-bold text-slate-500">Monit.:</span> {a.monitoras}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                  <div className="text-[10px] text-slate-400">
                                    Criado por: <span className="font-bold text-slate-500 truncate inline-block max-w-[140px] align-bottom">{a.criadoPorEmail || "Local"}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSemAtualId(a.semanarioId);
                                      setTelaBiblioteca(false);
                                      toast$(`Semana ${a.semanarioNumero} selecionada!`);
                                    }}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" /> Ir para esta Semana
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {atividadesPesquisa.filter((a: any) => {
                            if (pesquisaQuery) {
                              const q = pesquisaQuery.toLowerCase();
                              const matchTitle = (a.titulo || "").toLowerCase().includes(q);
                              const matchDesc = (a.descricao || "").toLowerCase().includes(q);
                              const matchName = (a.nome || "").toLowerCase().includes(q);
                              if (!matchTitle && !matchDesc && !matchName) return false;
                            }
                            if (pesquisaCategoria && (a.categoria || "").toLowerCase() !== pesquisaCategoria.toLowerCase()) return false;
                            if (pesquisaTurma && a.turmaId !== pesquisaTurma) return false;
                            if (pesquisaCriador && !(a.criadoPorEmail || "").toLowerCase().includes(pesquisaCriador.toLowerCase())) return false;
                            return true;
                          }).length === 0 && (
                            <div className="text-center py-16">
                              <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                              <p className="text-slate-400 font-bold text-sm">Nenhuma atividade corresponde aos filtros de pesquisa.</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {turmaParaExcluir && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[1100] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Turma?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Deseja realmente excluir a turma <span className="font-bold text-slate-800">"{turmaParaExcluir.label}"</span>? 
                <br/>Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
                  onClick={() => {
                    removerTurma(turmaParaExcluir.id, turmaParaExcluir.label);
                    setTurmaParaExcluir(null);
                  }}
                >
                  Sim, Excluir Turma
                </button>
                <button 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                  onClick={() => setTurmaParaExcluir(null)}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tela === "home" && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-6 pb-8 shadow-lg">
              {user ? (
                <div className="space-y-2 mb-4 bg-blue-800/20 p-3 rounded-xl border border-blue-400/10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-100">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate text-white/95 font-medium">{user.email}</span>
                    </div>
                    <button 
                      onClick={() => {
                        signOut(auth);
                        setGuestMode(false);
                        try { localStorage.setItem("semanario_guest_mode", "false"); } catch {}
                      }}
                      className="text-white hover:text-red-300 font-extrabold flex items-center gap-1 shrink-0 transition-colors ml-2 text-[10px]"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Sair
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1.5 border-t border-blue-400/10">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-blue-200">Perfil:</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider ${
                        userRole === "admin" 
                          ? "bg-red-500/30 text-red-200 border border-red-500/20" 
                          : userRole === "coordenador"
                            ? "bg-teal-500/30 text-teal-200 border border-teal-500/20"
                            : "bg-slate-500/30 text-slate-200 border border-slate-500/20"
                      }`}>
                        {userRole === "admin" ? "Administrador" : userRole === "coordenador" ? "Coordenador" : "Auxiliar"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-blue-200 italic mr-1">Simular:</span>
                      {(["auxiliar", "coordenador", "admin"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setDoc(doc(db, "usuarios", user.uid), {
                              uid: user.uid,
                              email: user.email,
                              role: r
                            })
                            .then(() => toast$(`Perfil atualizado para ${r === "admin" ? "Administrador" : r === "coordenador" ? "Coordenador" : "Auxiliar"}!`))
                            .catch((err) => {
                              console.error(err);
                              toast$("Erro ao atualizar perfil no Firestore.", "erro");
                            });
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                            userRole === r 
                              ? "bg-white text-blue-700 shadow-sm font-black" 
                              : "bg-blue-800/40 text-blue-200 hover:bg-blue-800/70 hover:text-white"
                          }`}
                        >
                          {r === "auxiliar" ? "Aux" : r === "coordenador" ? "Coord" : "Adm"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-200 mb-4 bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Modo Local (Offline)</span>
                  </div>
                  <button 
                    onClick={() => {
                      setGuestMode(false);
                      try { localStorage.setItem("semanario_guest_mode", "false"); } catch {}
                    }}
                    className="text-white hover:text-amber-300 font-extrabold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Entrar na Nuvem
                  </button>
                </div>
              )}
              <div className="uppercase tracking-[0.2em] text-3xl font-black text-red-600 mb-1 leading-none">INTEGRAL</div>
              <h1 className="text-2xl font-black mb-1">Semanário de Atividades</h1>
              <div className="flex flex-col gap-1.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold">
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Data: {sem.periodo} - Semana {sem.numero}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={abrirModalEditarSemana}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                      title="Editar Semana"
                    >
                      <Pencil className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button 
                      onClick={() => { setSemParaExcluir(sem); setModalExcluirSem(true); }}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                      title="Excluir Semana"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
                <StatCard label="Total" value={totalAtvs} icon={<BarChart3 className="w-4 h-4" />} />
                <StatCard label="Realiz." value={porStatus.realizada || 0} icon={<CheckCircle2 className="w-4 h-4" />} color="text-emerald-300" />
                <StatCard label="Não" value={porStatus.nao_realizada || 0} icon={<XCircle className="w-4 h-4" />} color="text-rose-300" />
                <StatCard label="Subst." value={porStatus.substituida || 0} icon={<RefreshCw className="w-4 h-4" />} color="text-amber-300" />
                <StatCard label="Pend." value={totalAtvs - totalLanc} icon={<Clock className="w-4 h-4" />} color="text-slate-300" />
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div className="px-1 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-1">
                  <button onClick={() => setTela("relatorio")} className="bg-white border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Relatório
                  </button>
                  <button onClick={() => setTelaBiblioteca(true)} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <Library className="w-4 h-4 text-indigo-600" /> Biblioteca
                  </button>
                  <button onClick={() => setModalTurma(true)} className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <span className="w-5 h-5 bg-emerald-600 text-white rounded-md flex items-center justify-center shadow-sm">
                      <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
                    </span>
                    Turma
                  </button>
                  <button onClick={abrirModalNovo} className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-md flex items-center justify-center shadow-sm">
                      <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
                    </span>
                    Semana
                  </button>
                  <button 
                    disabled={processandoAI}
                    onClick={() => fileInputRef.current?.click()} 
                    className="col-span-2 sm:col-span-1 bg-purple-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-purple-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {processandoAI ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <FileText className="w-4 h-4 text-white" />}
                    {processandoAI ? "Lendo..." : "Importar PDF"}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="application/pdf" 
                    onChange={handleImportarPDF} 
                  />
                </div>
                <div className="flex items-center justify-between mt-4 px-1">
                  <h2 className="text-xl font-black text-slate-800">Turmas</h2>
                  <button
                    id="btn-baixar-todas-turmas"
                    onClick={() => baixarAtividades(ordenarTurmas(turmas))}
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Baixar Todas as Turmas
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {!turmas.some((t: any) => t.id === "mini-maternal-azul") && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-emerald-950 font-extrabold font-bold">Excluiu o Mini e Maternal Azul por engano?</p>
                      <p className="text-xs text-teal-850 font-medium">Recupere a turma de Mini e Maternal Azul com suas atividades originais.</p>
                    </div>
                    <button
                      onClick={recuperarMaternal}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Recuperar Maternal Azul
                    </button>
                  </motion.div>
                )}

                {!turmas.some((t: any) => t.id === "6ano-azul") && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-blue-900 font-bold">Excluiu o 6º Ano por engano?</p>
                      <p className="text-xs text-blue-700 font-medium">Recupere o 6º Ano original com todas as suas atividades.</p>
                    </div>
                    <button
                      onClick={recuperar6ano}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Recuperar 6º Ano
                    </button>
                  </motion.div>
                )}

                {ordenarTurmas(turmas).map(t => {
                  const items = ATIVIDADES[t.id] || [];
                  const { done, total, pct } = progTurma(t.id);
                  return (
                    <motion.div 
                      key={t.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-xl p-4 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all relative group"
                      style={{ borderLeftColor: t.cor }}
                      onClick={() => { setTurmaSel(t); setTela("turma"); }}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-bold text-slate-800 flex-1 truncate pr-2" style={{ color: t.cor }}>{t.label}</span>
                        <div className="flex items-center gap-2 shrink-0 z-10">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: t.cor + "15", color: t.cor }}>
                            {pct}%
                          </span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTurmaParaExcluir(t);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all active:scale-90"
                            title="Excluir Turma"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2 mb-2">
                        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: t.cor }} />
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{done}/{total} Atividades Lançadas</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botão de Geração Automática em Lote de Atividades */}
              <div id="gerador-lote-card" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Sparkles className="w-5 h-5 animate-pulse text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight">Geração Automática de Semana</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Associa e gera de uma só vez as sugestões pedagógicas da IA para todas as turmas e propostas que não possuem lançamentos de atividades nesta semana, respeitando as orientações de cada idade.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
                  {(() => {
                    const pendentesCount = obterAtividadesPendentesLote().length;
                    return (
                      <>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {pendentesCount} {pendentesCount === 1 ? "Atividade Pendente" : "Atividades Pendentes"}
                        </div>
                        
                        <button
                          id="btn-gerar-lote"
                          onClick={iniciarGeracaoLote}
                          disabled={loteProcessando || pendentesCount === 0}
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-blue-100 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Wand2 className="w-4 h-4" /> Gerar Todas
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {tela === "turma" && turmaSel && (
          <motion.div 
            key="turma"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-6 text-white pb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${turmaSel.cor}, ${turmaSel.cor}dd)` }}>
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={() => setTela("home")}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Início"
                >
                  <Home className="w-5 h-5" />
                </button>
                <div className="h-6 w-[1px] bg-white/20 mx-1" />
                <button 
                  onClick={navegarTurmaAnterior}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Turma Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={navegarTurmaProxima}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Próxima Turma"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="uppercase tracking-widest text-3xl font-black text-red-600 mb-1 leading-none">INTEGRAL</div>
              
              <div className="flex justify-between items-start mt-2 mb-1">
                <h2 className="text-2xl font-black">{turmaSel.label}</h2>
                <button 
                  onClick={() => setTurmaParaExcluir(turmaSel)}
                  className="bg-white/20 hover:bg-rose-500 p-2 rounded-lg transition-colors active:scale-90"
                  title="Excluir Turma"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold mb-4">
                <Calendar className="w-4 h-4 text-white" />
                <span>Data: {sem.periodo} - Semana {sem.numero}</span>
              </div>

              <div className="flex flex-col gap-1 mb-4 bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-white/75 tracking-wider">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-200" /> Tema da Semana da Turma</span>
                  <span className="text-[9px] opacity-75">Toque para editar</span>
                </div>
                <input
                  type="text"
                  value={sem.temasTurmas?.[turmaSel.id] !== undefined ? sem.temasTurmas[turmaSel.id] : (sem.tema || "")}
                  onChange={(e) => {
                    const novoVal = e.target.value;
                    setSemanarios((prev: any) => prev.map((s: any) => {
                      if (s.id !== sem.id) return s;
                      const temasTurmas = { ...(s.temasTurmas || {}) };
                      temasTurmas[turmaSel.id] = novoVal;
                      return { ...s, temasTurmas };
                    }));
                  }}
                  className="w-full bg-transparent border-none text-white font-extrabold text-sm leading-tight p-0 mt-0.5 focus:outline-none focus:ring-x-0 placeholder-white/40"
                  placeholder="Clique para digitar o tema desta turma..."
                />
              </div>
              
                <div className="flex items-center gap-3 flex-wrap mb-6">
                  <button 
                    onClick={() => baixarAtividades(turmaSel)}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Download className="w-3 h-3" /> Baixar Atividades
                  </button>
                  <button 
                    onClick={() => iniciarGeracaoLote(turmaSel.id)}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 transition-all active:scale-95 border border-white/25"
                  >
                    <Sparkles className="w-3 h-3 text-blue-200 animate-pulse" /> Gerar Todas da Turma
                  </button>
                </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/10 rounded-xl p-3 text-center">
                  <div className="text-lg font-black">{ATIVIDADES[turmaSel.id]?.length || 0}</div>
                  <div className="text-[9px] uppercase font-bold opacity-70">Total</div>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <div className="text-lg font-black">{progTurma(turmaSel.id).done}</div>
                  <div className="text-[9px] uppercase font-bold opacity-70 text-emerald-300">Lançadas</div>
                </div>
                <div className="bg-black/10 rounded-xl p-3 text-center">
                  <div className="text-lg font-black">{(ATIVIDADES[turmaSel.id]?.length || 0) - progTurma(turmaSel.id).done}</div>
                  <div className="text-[9px] uppercase font-bold opacity-70 text-rose-300">Pendentes</div>
                </div>
              </div>
              
              <div className="mt-6 px-1">
                <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-700" style={{ width: `${progTurma(turmaSel.id).pct}%` }} />
                </div>
              </div>

              <button 
                onClick={() => adicionarBase(turmaSel.id)}
                className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl border border-white/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Adicionar Atividade
              </button>
            </div>

            <div className="p-4 space-y-3">
              <AnimatePresence>
                {editandoEstrutura && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm"
                  >
                    <div className="bg-white rounded-2xl p-6 w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                      <h4 className="text-lg font-bold text-slate-800">Editar Atividade</h4>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tema da Semana</label>
                        <input 
                          className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                          placeholder="Tema do Semanário"
                          value={editandoEstrutura.tema || ""}
                          onChange={e => setEditandoEstrutura((p: any) => ({ ...p, tema: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Atividade Proposta</label>
                        <input 
                          className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                          value={editandoEstrutura.nome}
                          onChange={e => setEditandoEstrutura((p: any) => ({ ...p, nome: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ADI Responsável</label>
                          <input 
                            className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                            value={editandoEstrutura.adiResponsavel || ""}
                            onChange={e => setEditandoEstrutura((p: any) => ({ ...p, adiResponsavel: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Monitora(s)</label>
                          <input 
                            className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                            value={editandoEstrutura.monitoras || ""}
                            onChange={e => setEditandoEstrutura((p: any) => ({ ...p, monitoras: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                        <textarea 
                          className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                          rows={3}
                          value={editandoEstrutura.descricao}
                          onChange={e => setEditandoEstrutura((p: any) => ({ ...p, descricao: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={salvarEdicaoEstrutura} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl">Salvar</button>
                        <button onClick={() => setEditandoEstrutura(null)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl">Cancelar</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {[...(ATIVIDADES[turmaSel.id] || [])].sort((a: any, b: any) => a.nome.localeCompare(b.nome)).map((a: any) => {
                const reg = getReg(turmaSel.id, a.id);
                const cfg = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
                return (
                  <motion.div 
                    key={a.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-all flex gap-3 items-start relative group"
                    style={{ borderLeftColor: cfg.border, backgroundColor: cfg.bg + "44" }}
                  >
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => abrirForm(turmaSel, a)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 shrink-0 bg-white/80 shadow-sm border border-slate-100 rounded-lg flex items-center justify-center text-lg">
                          {ICONE_PADRAO}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">
                          {renderNomeAtividade(a.nome)}
                        </h4>
                      </div>
                      <div className="ml-10 space-y-1.5">
                        <div className="flex flex-wrap gap-2 mb-1">
                          {a.adiResponsavel && (
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold">
                              ADI: {a.adiResponsavel}
                            </span>
                          )}
                          {a.monitoras && (
                            <span className="text-[9px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100 font-bold">
                              Mon: {a.monitoras}
                            </span>
                          )}
                          {a.descricao && a.descricao.trim() && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-black flex items-center gap-0.5 uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> Proposta Pronta
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-wrap">{a.descricao}</p>
                        
                        {/* Botão Gerar Atividade */}
                        <div className="pt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              gerarAtividadeAI(turmaSel, a);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black shadow-sm transition-all active:scale-95 ${
                              a.descricao && a.descricao.trim()
                                ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            <Sparkles className={`w-3 h-3 ${a.descricao && a.descricao.trim() ? "text-slate-500 animate-none" : "animate-pulse"}`} />{" "}
                            {a.descricao && a.descricao.trim() ? "Regerar Proposta" : "Criar Atividade"}
                          </button>
                        </div>

                        {reg?.status === "realizada" && reg.justificativa && (
                          <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 text-[10px] text-emerald-800 italic">
                            {reg.justificativa}
                          </div>
                        )}
                        {reg?.status === "substituida" && (
                          <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 space-y-1">
                            <div className="text-[10px] font-bold text-amber-900">Substituído por: {reg.novaProposta}</div>
                            {reg.justificativa && <div className="text-[9px] text-amber-700 italic">Motivo: {reg.justificativa}</div>}
                          </div>
                        )}
                      </div>
                      {reg?.salvoEm && <div className="text-[9px] text-emerald-600 font-bold mt-2 uppercase tracking-tight ml-10">Lançado em {reg.salvoEm}</div>}
                    </div>

                     <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalCopiar(turmaSel, a);
                          }}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-100 active:scale-90 transition-all shadow-sm"
                          title="Copiar para outra Turma"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            baixarAtividadeSoh(turmaSel, a);
                          }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-200 active:scale-90 transition-all shadow-sm"
                          title="Baixar Atividade"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditandoAtividadeId(a.id);
                            setEditandoEstrutura({ 
                              nome: obterTituloPuro(a.nome), 
                              categoria: obterCategoriaPura(a.nome),
                              tema: sem.tema,
                              descricao: a.descricao,
                              adiResponsavel: a.adiResponsavel || "",
                              monitoras: a.monitoras || ""
                            });
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 active:scale-90 transition-all shadow-sm"
                          title="Editar Atividade"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removerDaEstrutura(turmaSel.id, a.id);
                          }}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 active:scale-90 transition-all shadow-sm"
                          title="Excluir Atividade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" onClick={() => abrirForm(turmaSel, a)}>
                        <span className="text-xl">{cfg.emoji}</span>
                        <span className="text-[8px] font-black uppercase text-slate-400" style={{ color: reg ? cfg.cor : undefined }}>{cfg.label}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}


              {(!ATIVIDADES[turmaSel.id] || ATIVIDADES[turmaSel.id].length === 0) && (
                <div className="py-12 flex flex-col items-center text-slate-400 gap-2">
                  <FileText className="w-10 h-10 opacity-20" />
                  <p className="text-sm font-medium">Nenhuma atividade planejada.</p>
                  <button 
                    onClick={() => adicionarBase(turmaSel.id)}
                    className="text-blue-500 font-bold text-xs"
                  >
                    + Criar primeira atividade
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tela === "atividade" && atividadeSel && (
          <motion.div 
            key="atividade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pb-8"
          >
            <div className="p-6 text-white pb-8 shadow-lg" style={{ background: `linear-gradient(135deg, ${turmaSel.cor}, ${turmaSel.cor}dd)` }}>
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={() => setTela("home")}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Início"
                >
                  <Home className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setTela("turma")}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Voltar para Turma"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-6 w-[1px] bg-white/20 mx-1" />
                <button 
                  onClick={navegarAtividadeAnterior}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Atividade Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={navegarAtividadeProxima}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                  title="Próxima Atividade"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="uppercase tracking-widest text-3xl font-black text-red-600 mb-1 leading-none">INTEGRAL</div>
              
              <div className="mt-2 mb-1">
                <h2 className="text-2xl font-black">{turmaSel.label}</h2>
              </div>

              <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold mb-4">
                <Calendar className="w-4 h-4 text-white" />
                <span>Data: {sem.periodo} - Semana {sem.numero}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white/20 p-2 rounded-xl backdrop-blur-sm">{ICONE_PADRAO}</span>
                <h2 className="text-xl font-black leading-tight">
                  {renderNomeAtividade(atividadeSel.nome, true)}
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-xs opacity-90 leading-relaxed font-bold whitespace-pre-wrap">{atividadeSel.descricao}</p>
                {getReg(turmaSel.id, atividadeSel.id)?.status === "realizada" && getReg(turmaSel.id, atividadeSel.id).justificativa && (
                  <div className="bg-black/10 p-3 rounded-xl backdrop-blur-sm text-[11px] border border-white/20">
                    <div className="font-black text-[9px] uppercase tracking-wider mb-1 opacity-60">Relato da Execução</div>
                    <div className="whitespace-pre-wrap">{getReg(turmaSel.id, atividadeSel.id).justificativa}</div>
                  </div>
                )}
                {getReg(turmaSel.id, atividadeSel.id)?.status === "substituida" && (
                  <div className="bg-black/10 p-3 rounded-xl backdrop-blur-sm text-[11px] border border-white/20 space-y-2">
                    <div>
                      <div className="font-black text-[9px] uppercase tracking-wider mb-0.5 opacity-60">Atividade Substituta</div>
                      <div className="font-bold">{getReg(turmaSel.id, atividadeSel.id).novaProposta}</div>
                    </div>
                    {getReg(turmaSel.id, atividadeSel.id).justificativa && (
                      <div>
                        <div className="font-black text-[9px] uppercase tracking-wider mb-0.5 opacity-60">Motivo</div>
                        <div className="italic">{getReg(turmaSel.id, atividadeSel.id).justificativa}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Status da Execução
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["realizada","nao_realizada","substituida"].map(s => {
                    const cfg = STATUS_CONFIG[s]; 
                    const sel = formData.status === s;
                    return (
                      <button 
                        key={s}
                        onClick={() => setFormData((f: any) => ({ ...f, status: s }))}
                        className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                          sel 
                            ? "bg-white shadow-lg scale-105" 
                            : "bg-slate-50 border-slate-100 text-slate-400 grayscale"
                        }`}
                        style={{ 
                          borderColor: sel ? cfg.cor : undefined,
                          color: sel ? cfg.cor : undefined 
                        }}
                      >
                        <span className="text-3xl mb-1">{cfg.emoji}</span>
                        <span className="text-[10px] font-black uppercase tracking-tight">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.status && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6"
                >
                  {formData.status === "realizada" && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Relato da Atividade (opcional)</label>
                        <textarea 
                          className="w-full border-2 border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-colors bg-white shadow-inner"
                          rows={4}
                          placeholder="Como foi a interação? Alguma observação especial?"
                          value={formData.justificativa || ""}
                          onChange={e => setFormData((f: any) => ({ ...f, justificativa: e.target.value }))}
                        />
                      </div>
                      <MidiaUploadSection 
                        mids={midias[chave(turmaSel.id, atividadeSel.id)] || []} 
                        onChange={handleMidia} 
                        onRemove={removerMidia} 
                      />
                    </>
                  )}

                  {formData.status === "nao_realizada" && (
                    <div>
                      <label className="block text-sm font-bold text-rose-700 mb-2">Justificativa da Não Realização *</label>
                      <textarea 
                        className="w-full border-2 border-rose-100 bg-rose-50/30 rounded-2xl p-4 text-sm outline-none focus:border-rose-500 transition-colors shadow-inner"
                        rows={5}
                        placeholder="Informe o motivo pelo qual a atividade não pode ser executada (ex: Chuva, falta de material, mudança de cronograma...)"
                        value={formData.justificativa || ""}
                        onChange={e => setFormData((f: any) => ({ ...f, justificativa: e.target.value }))}
                      />
                    </div>
                  )}

                  {formData.status === "substituida" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-amber-700 mb-2">Motivo da Substituição</label>
                        <textarea 
                          className="w-full border-2 border-amber-100 bg-amber-50/30 rounded-2xl p-4 text-sm outline-none focus:border-amber-500 transition-colors"
                          rows={2}
                          placeholder="Por que optou por outra atividade?"
                          value={formData.justificativa || ""}
                          onChange={e => setFormData((f: any) => ({ ...f, justificativa: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-amber-900 mb-2">Nova Atividade Executada *</label>
                        <textarea 
                          className="w-full border-2 border-amber-200 bg-white rounded-2xl p-4 text-sm outline-none focus:border-amber-600 transition-colors shadow-inner font-semibold"
                          rows={5}
                          placeholder="Descreva detalhadamente a atividade que foi realizada no lugar desta..."
                          value={formData.novaProposta || ""}
                          onChange={e => setFormData((f: any) => ({ ...f, novaProposta: e.target.value }))}
                        />
                      </div>
                      <MidiaUploadSection 
                        mids={midias[chave(turmaSel.id, atividadeSel.id)] || []} 
                        onChange={handleMidia} 
                        onRemove={removerMidia} 
                      />
                    </div>
                  )}

                  <button 
                    disabled={salvando}
                    onClick={salvar}
                    className={`w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                      salvando ? "bg-slate-400" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-200"
                    }`}
                  >
                    {salvando ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    {salvando ? "Salvando..." : "Salvar Registro"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {tela === "relatorio" && (
          <motion.div 
            key="relatorio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-10"
          >
            <div className="bg-slate-800 text-white p-6 pb-10 shadow-lg">
              <button 
                onClick={() => setTela("home")}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full mb-4"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="uppercase tracking-[0.2em] text-3xl font-black text-red-600 mb-1 leading-none">INTEGRAL</div>
              <h2 className="text-2xl font-black mb-2">Relatório do Semanário</h2>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold">
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Data: {sem.periodo} - Semana {sem.numero}</span>
                </div>
                <button 
                  onClick={() => baixarAtividades(turmas)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/20"
                >
                  <Download className="w-4 h-4" /> PDF Global
                </button>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                    <span>Progresso Geral</span>
                    <span>{totalAtvs ? Math.round((Number(totalLanc)/Number(totalAtvs))*100) : 0}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${(Number(totalLanc)/Number(totalAtvs))*100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 -mt-6">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-2xl font-black text-emerald-500 leading-none">{porStatus.realizada || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Realizadas</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-2xl font-black text-rose-500 leading-none">{porStatus.nao_realizada || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Não Realizadas</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-2xl font-black text-amber-500 leading-none">{porStatus.substituida || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Substituídas</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-2xl font-black text-slate-400 leading-none">{totalAtvs - totalLanc}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Pendentes</div>
                </div>
              </div>

              <div className="space-y-8">
                {ordenarTurmas(turmas).map(t => {
                  const items = ATIVIDADES[t.id] || [];
                  const { done, total, pct } = progTurma(t.id);
                  return (
                    <div key={t.id} className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.cor }} />
                          {t.label}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{done}/{total} Concluídas</span>
                      </div>
                      
                      <div className="space-y-2">
                        {[...items].sort((a: any, b: any) => a.nome.localeCompare(b.nome)).map((a: any) => {
                          const reg = getReg(t.id, a.id);
                          const cfg = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
                          return (
                            <div key={a.id} className="bg-white rounded-xl p-3 border border-slate-100 flex gap-3 items-start">
                              <span className="text-lg grayscale-[0.5]">{ICONE_PADRAO}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold text-slate-800">
                                  {renderNomeAtividade(a.nome)}
                                </div>
                                <div className="space-y-2 mt-1">
                                  <div className="text-[10px] text-slate-500 italic flex items-start gap-1">
                                    <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span className="whitespace-pre-wrap">{a.descricao}</span>
                                  </div>
                                  
                                  {reg?.status === "realizada" && reg.justificativa && (
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[10px] text-slate-700">
                                      <div className="font-bold text-[8px] uppercase tracking-wider text-slate-400 mb-1">Comentário:</div>
                                      <div className="whitespace-pre-wrap">{reg.justificativa}</div>
                                    </div>
                                  )}

                                  {reg?.status === "substituida" && (
                                    <div className="bg-amber-50 p-2 rounded border border-amber-100 text-[10px] text-amber-900">
                                      <div className="font-bold text-[8px] uppercase tracking-wider text-amber-600 mb-1">Substituição:</div>
                                      <div className="font-bold whitespace-pre-wrap">{reg.novaProposta}</div>
                                      {reg.justificativa && <div className="mt-1 text-[9px] italic border-t border-amber-200/50 pt-1">Motivo: {reg.justificativa}</div>}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm shrink-0">{cfg.emoji}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-white" }: { label: string, value: number, icon: any, color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="flex items-center gap-1 opacity-60 mt-1">
        <span className="scale-75">{icon}</span>
        <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
      </div>
    </div>
  );
}

function MidiaUploadSection({ mids, onChange, onRemove }: { mids: any[], onChange: any, onRemove: any }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
        <Camera className="w-4 h-4 text-purple-500" /> Registro de Mídia
      </label>
      
      <label className="block bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-blue-500">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-500">Adicionar fotos ou vídeos</span>
        </div>
        <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onChange} />
      </label>

      {mids.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {mids.map((m, idx) => (
            <motion.div 
              key={idx} 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-square group"
            >
              {m.tipo === "imagem" 
                ? <img src={m.src} alt={m.nome} className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-100" />
                : <video src={m.src} className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-100" />}
              <button 
                onClick={() => onRemove(idx)}
                className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg border-2 border-white hover:bg-rose-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, tipo }: { msg: string, tipo: string }) {
  const isError = tipo === "erro";
  return (
    <div className={`
      px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-3 backdrop-blur-md
      ${isError ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}
    `}>
      {isError ? <XCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
      {msg}
    </div>
  );
}
