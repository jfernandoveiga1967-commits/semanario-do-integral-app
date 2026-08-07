import { useState, useEffect, useRef, useMemo, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { 
  auth, 
  db, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  writeBatch,
  query,
  where,
  limit
} from "./lib/firebase";
import AuthScreen from "./components/AuthScreen";
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  Search,
  Layers,
  Users,
  ShieldCheck,
  UserPlus,
  ShieldAlert,
  UserCog,
  Mail,
  Shield,
  BookOpen,
  Check,
  Filter
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
    { id: "mm14", nome: "Estímulo Motor:",        descricao: "" },
    { id: "mm7",  nome: "Judô:",                  descricao: "" },
    { id: "mm8",  nome: "Lego:",                  descricao: "" },
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
    { id: "1a4",  nome: "Contação de História:",  descricao: "" },
    { id: "1a5",  nome: "Coral:",                 descricao: "" },
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
  const cat = parts[0].trim();
  if (cat.toLowerCase() === "coral e canto") return "Coral";
  return cat;
}

function resolverTurmaId(rawKey: string, turmasLista: any[]): any {
  if (!rawKey || typeof rawKey !== "string" || !Array.isArray(turmasLista)) return null;
  const keyClean = rawKey.trim();
  if (!keyClean) return null;

  // 1. Exact match by ID
  const matchId = turmasLista.find((t: any) => t.id === keyClean || t.id.toLowerCase() === keyClean.toLowerCase());
  if (matchId) return matchId;

  // 2. Exact match by label
  const matchLabel = turmasLista.find((t: any) => t.label.toLowerCase() === keyClean.toLowerCase());
  if (matchLabel) return matchLabel;

  // Helper for text normalization
  const normalizar = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents & ordinal indicators (º, ª)
      .replace(/\bturma\b/g, "")
      .replace(/[^a-z0-9]/g, ""); // keep only alphanumeric
  };

  const normKey = normalizar(keyClean);
  if (!normKey) return null;

  // 3. Match normalized ID or normalized Label
  const matchNorm = turmasLista.find((t: any) => {
    const normId = normalizar(t.id);
    const normLbl = normalizar(t.label);
    return normId === normKey || normLbl === normKey;
  });
  if (matchNorm) return matchNorm;

  // 4. Match ignoring color suffixes ("azul", "vermelho") and conjunction ("e")
  const normKeyClean = normKey.replace(/azul|vermelho/g, "").replace(/e/g, "");
  
  const matchFlexible = turmasLista.find((t: any) => {
    const normIdClean = normalizar(t.id).replace(/azul|vermelho/g, "").replace(/e/g, "");
    const normLblClean = normalizar(t.label).replace(/azul|vermelho/g, "").replace(/e/g, "");
    return normIdClean === normKeyClean || normLblClean === normKeyClean;
  });
  if (matchFlexible) return matchFlexible;

  // 5. Fallback inclusion matching
  const matchPartial = turmasLista.find((t: any) => {
    const normId = normalizar(t.id);
    const normLbl = normalizar(t.label);
    const normIdClean = normId.replace(/azul|vermelho/g, "");
    const normLblClean = normLbl.replace(/azul|vermelho/g, "");

    return (
      normId.includes(normKey) ||
      normLbl.includes(normKey) ||
      normKey.includes(normIdClean) ||
      normKey.includes(normLblClean) ||
      (normKeyClean.length >= 4 && (normIdClean.includes(normKeyClean) || normLblClean.includes(normKeyClean)))
    );
  });

  return matchPartial || null;
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
    "coral e canto": "Coral",
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

export const isDocenteRole = (role?: string): boolean => {
  if (!role) return true;
  const r = role.toLowerCase().trim();
  return r === "auxiliar" || r === "teacher" || r === "professor" || r === "docente";
};

export interface AtribuicaoUsuario {
  id: string;
  tipo: "auxiliar" | "especialista";
  turmas: string[];
  categorias: string[];
}

export const podeAcessarAtividade = (
  turmaId: string,
  categoriaNome: string,
  userAtribuicoes: AtribuicaoUsuario[] = [],
  userRole: string = "auxiliar",
  userTurmas: string[] = [],
  userCategorias: string[] = []
): boolean => {
  if (!isDocenteRole(userRole)) return true; // Admins and Coordenadores have full access
  const catPura = obterCategoriaPura(categoriaNome);

  if (Array.isArray(userAtribuicoes) && userAtribuicoes.length > 0) {
    for (const atb of userAtribuicoes) {
      if (Array.isArray(atb.turmas) && atb.turmas.includes(turmaId)) {
        if (atb.tipo === "auxiliar") {
          // Auxiliar (Acesso Geral da Turma): if no categories specified, grants access to ALL categories in that turma
          if (!atb.categorias || atb.categorias.length === 0) return true;
          if (atb.categorias.includes(catPura)) return true;
        } else if (atb.tipo === "especialista") {
          // Especialista (Acesso Específico por Categoria): grants access ONLY to specified categories in that turma
          if (Array.isArray(atb.categorias) && atb.categorias.includes(catPura)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Fallback for legacy user profile structure
  if (Array.isArray(userTurmas) && userTurmas.includes(turmaId)) {
    if (!Array.isArray(userCategorias) || userCategorias.length === 0) return true;
    return userCategorias.includes(catPura);
  }

  return false;
};

export const podeAcessarTurma = (
  turmaId: string,
  userAtribuicoes: AtribuicaoUsuario[] = [],
  userRole: string = "auxiliar",
  userTurmas: string[] = []
): boolean => {
  if (!isDocenteRole(userRole)) return true;
  if (Array.isArray(userAtribuicoes) && userAtribuicoes.length > 0) {
    return userAtribuicoes.some(atb => Array.isArray(atb.turmas) && atb.turmas.includes(turmaId));
  }
  return Array.isArray(userTurmas) && userTurmas.includes(turmaId);
};

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
  const [userRole, setUserRole] = useState<"admin" | "coordenador" | "auxiliar" | "teacher" | "professor">("auxiliar");
  const [userTurmas, setUserTurmas] = useState<string[]>([]);
  const [userCategorias, setUserCategorias] = useState<string[]>([]);
  const [userAtribuicoes, setUserAtribuicoes] = useState<AtribuicaoUsuario[]>([]);

  const [guestMode, setGuestMode] = useState(() => {
    try {
      return localStorage.getItem("semanario_guest_mode") === "true";
    } catch {
      return false;
    }
  });

  // Estados para Gerenciamento de Usuários (Apenas Admin)
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [novoEmailUsuario, setNovoEmailUsuario] = useState("");
  const [novoCargoUsuario, setNovoCargoUsuario] = useState<"admin" | "coordenador" | "auxiliar" | "teacher" | "professor">("auxiliar");
  const [novasTurmasUsuario, setNovasTurmasUsuario] = useState<string[]>([]);
  const [novasCategoriasUsuario, setNovasCategoriasUsuario] = useState<string[]>([]);
  const [salvandoUsuario, setSalvandoUsuario] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<any | null>(null);
  const [excluindoUsuario, setExcluindoUsuario] = useState(false);
  const [usuarioExpandidoId, setUsuarioExpandidoId] = useState<string | null>(null);

  // Estados para adicionar Novo Grupo de Atuação / Atribuição (Perfil Duplo)
  const [addGrupoTipo, setAddGrupoTipo] = useState<"auxiliar" | "especialista">("auxiliar");
  const [addGrupoTurmas, setAddGrupoTurmas] = useState<string[]>([]);
  const [addGrupoCategorias, setAddGrupoCategorias] = useState<string[]>([]);
  const [addGrupoAcessoGeral, setAddGrupoAcessoGeral] = useState<boolean>(true);

  // Inscrição em tempo real na coleção "usuarios" para administradores com consolidação por e-mail
  useEffect(() => {
    if (!user || guestMode || userRole !== "admin") return;
    const unsub = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const mapByEmail = new Map<string, {
        id: string;
        email: string;
        uid: string;
        role: "admin" | "coordenador" | "auxiliar";
        turmas: string[];
        categorias: string[];
        atribuicoes: AtribuicaoUsuario[];
        legacyDocIds: string[];
        updatedAt?: string;
        createdAt?: string;
      }>();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docId = docSnap.id;
        const rawEmail = (data.email || (docId.includes("@") ? docId : "")).trim().toLowerCase();
        const emailKey = rawEmail || docId;

        const docRole = (data.role as string) || "auxiliar";
        const docTurmas = Array.isArray(data.turmas) ? data.turmas : [];
        const docCategoriasRaw = Array.isArray(data.categorias) ? data.categorias : [];
        const docCategorias = docCategoriasRaw.map((c: string) => c.trim().toLowerCase() === "coral e canto" ? "Coral" : c);
        const docAtribuicoesRaw = Array.isArray(data.atribuicoes) ? data.atribuicoes : [];
        const docUid = data.uid || (docId !== emailKey ? docId : "");

        if (!mapByEmail.has(emailKey)) {
          mapByEmail.set(emailKey, {
            id: emailKey,
            email: rawEmail || emailKey,
            uid: docUid,
            role: docRole as any,
            turmas: docTurmas,
            categorias: docCategorias,
            atribuicoes: docAtribuicoesRaw,
            legacyDocIds: docId !== emailKey ? [docId] : [],
            updatedAt: data.updatedAt || data.createdAt || "",
            createdAt: data.createdAt || ""
          });
        } else {
          const existing = mapByEmail.get(emailKey)!;
          
          if (docId !== emailKey && !existing.legacyDocIds.includes(docId)) {
            existing.legacyDocIds.push(docId);
          }

          if (!existing.uid && docUid) {
            existing.uid = docUid;
          }

          // Prioridade de cargo: admin > coordenador > auxiliar / teacher / professor
          const rolePriority: Record<string, number> = { admin: 3, coordenador: 2, auxiliar: 1, teacher: 1, professor: 1, docente: 1 };
          if ((rolePriority[docRole] || 1) > (rolePriority[existing.role] || 1)) {
            existing.role = docRole as any;
          }

          // União de turmas, categorias e atribuições
          const turmasSet = new Set([...existing.turmas, ...docTurmas]);
          existing.turmas = Array.from(turmasSet);

          const categoriasSet = new Set([...(existing.categorias || []), ...docCategorias]);
          existing.categorias = Array.from(categoriasSet);

          if (docAtribuicoesRaw.length > 0) {
            if (!existing.atribuicoes || existing.atribuicoes.length === 0) {
              existing.atribuicoes = docAtribuicoesRaw;
            } else {
              // Combine unique atribuicoes by id
              const atbMap = new Map<string, AtribuicaoUsuario>();
              existing.atribuicoes.forEach(a => atbMap.set(a.id, a));
              docAtribuicoesRaw.forEach((a: AtribuicaoUsuario) => atbMap.set(a.id, a));
              existing.atribuicoes = Array.from(atbMap.values());
            }
          }

          if (data.updatedAt && (!existing.updatedAt || data.updatedAt > existing.updatedAt)) {
            existing.updatedAt = data.updatedAt;
          }
        }
      });

      const list = Array.from(mapByEmail.values());
      list.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
      setListaUsuarios(list);
    }, (err) => {
      handleFirestoreError(err, "carregar lista de usuários");
    });
    return () => unsub();
  }, [user, guestMode, userRole]);

  const usuariosFiltrados = useMemo(() => {
    if (!filtroUsuario.trim()) return listaUsuarios;
    const term = filtroUsuario.trim().toLowerCase();
    return listaUsuarios.filter(u => 
      (u.email || "").toLowerCase().includes(term) || 
      (u.role || "").toLowerCase().includes(term) ||
      (u.id || "").toLowerCase().includes(term)
    );
  }, [listaUsuarios, filtroUsuario]);

  // Função para deletar registros legados duplicados no Firestore
  const limparDuplicatasLegadas = async (legacyDocIds?: string[]) => {
    if (Array.isArray(legacyDocIds) && legacyDocIds.length > 0) {
      for (const legacyId of legacyDocIds) {
        try {
          await deleteDoc(doc(db, "usuarios", legacyId));
          console.log(`Documento duplicado legado removido do Firestore: ${legacyId}`);
        } catch (err) {
          console.warn(`Erro ao excluir documento legado ${legacyId}:`, err);
        }
      }
    }
  };

  const consolidarELimparDuplicatasGlobais = async () => {
    try {
      let count = 0;
      for (const u of listaUsuarios) {
        if (u.legacyDocIds && u.legacyDocIds.length > 0) {
          await setDoc(doc(db, "usuarios", u.id), {
            email: u.email || u.id,
            role: u.role,
            turmas: u.turmas || [],
            categorias: u.categorias || [],
            uid: u.uid || "",
            updatedAt: new Date().toISOString()
          }, { merge: true });

          for (const legacyId of u.legacyDocIds) {
            await deleteDoc(doc(db, "usuarios", legacyId));
            count++;
          }
        }
      }
      if (count > 0) {
        toast$(`${count} registro(s) duplicado(s) unificado(s) e removido(s) do Firestore!`);
      } else {
        toast$("Todos os registros já estão padronizados sem duplicatas.");
      }
    } catch (err) {
      console.error("Erro ao consolidar duplicatas:", err);
      toast$("Erro ao limpar duplicatas no Firestore.", "erro");
    }
  };

  const confirmarExclusaoUsuario = async () => {
    if (!usuarioParaExcluir) return;
    const targetUser = usuarioParaExcluir;
    setExcluindoUsuario(true);

    try {
      const rawEmail = (targetUser.email || "").trim().toLowerCase();
      const emailKey = rawEmail || targetUser.id;

      // Deleta documento principal por chave de e-mail
      await deleteDoc(doc(db, "usuarios", emailKey)).catch((e) => console.warn("Erro ao excluir por e-mail:", e));

      // Deleta documento por UID se for diferente da chave de e-mail
      if (targetUser.uid && targetUser.uid !== emailKey) {
        await deleteDoc(doc(db, "usuarios", targetUser.uid)).catch((e) => console.warn("Erro ao excluir por UID:", e));
      }

      if (targetUser.id && targetUser.id !== emailKey && targetUser.id !== targetUser.uid) {
        await deleteDoc(doc(db, "usuarios", targetUser.id)).catch((e) => console.warn("Erro ao excluir por doc.id:", e));
      }

      // Deleta quaisquer documentos legados agrupados
      if (Array.isArray(targetUser.legacyDocIds) && targetUser.legacyDocIds.length > 0) {
        await limparDuplicatasLegadas(targetUser.legacyDocIds);
      }

      toast$(`Usuário ${rawEmail || targetUser.id} foi excluído com sucesso!`);
      setUsuarioParaExcluir(null);
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      toast$("Erro ao excluir usuário no Firestore.", "erro");
    } finally {
      setExcluindoUsuario(false);
    }
  };

  const alterarCargoUsuario = async (
    userIdOrDocId: string, 
    userEmail: string, 
    novoCargo: "admin" | "coordenador" | "auxiliar",
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        role: novoCargo,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      const nomeCargo = novoCargo === "admin" ? "Administrador" : novoCargo === "coordenador" ? "Coordenador" : "Auxiliar / Professor";
      toast$(`Cargo de ${userEmail || emailKey} alterado para ${nomeCargo}!`);
    } catch (err: any) {
      console.error("Erro ao alterar cargo do usuário:", err);
      toast$("Erro ao atualizar cargo no Firestore.", "erro");
    }
  };

  const alternarTurmaUsuario = async (
    userIdOrDocId: string, 
    userEmail: string, 
    turmaId: string, 
    turmasAtuais: string[],
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      const temTurma = turmasAtuais.includes(turmaId);
      const novaLista = temTurma 
        ? turmasAtuais.filter(id => id !== turmaId) 
        : [...turmasAtuais, turmaId];

      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        turmas: novaLista,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Turmas atribuídas atualizadas!");
    } catch (err: any) {
      console.error("Erro ao atualizar turmas do usuário:", err);
      toast$("Erro ao atualizar turmas no Firestore.", "erro");
    }
  };

  const selecionarTodasTurmasUsuario = async (
    userIdOrDocId: string, 
    userEmail: string, 
    todasTurmasIds: string[],
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        turmas: todasTurmasIds,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Todas as turmas foram vinculadas ao usuário!");
    } catch (err: any) {
      console.error("Erro ao vincular todas as turmas:", err);
      toast$("Erro ao atualizar no Firestore.", "erro");
    }
  };

  const desmarcarTodasTurmasUsuario = async (
    userIdOrDocId: string, 
    userEmail: string,
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        turmas: [],
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Todas as turmas foram desvinculadas.");
    } catch (err: any) {
      console.error("Erro ao desmarcar turmas:", err);
      toast$("Erro ao atualizar no Firestore.", "erro");
    }
  };

  const alternarCategoriaUsuario = async (
    userIdOrDocId: string, 
    userEmail: string, 
    catName: string, 
    categoriasAtuais: string[],
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      const temCat = categoriasAtuais.includes(catName);
      const novaLista = temCat 
        ? categoriasAtuais.filter(c => c !== catName) 
        : [...categoriasAtuais, catName];

      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        categorias: novaLista,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Categorias / Componentes Curriculares atualizados!");
    } catch (err: any) {
      console.error("Erro ao atualizar categorias do usuário:", err);
      toast$("Erro ao atualizar categorias no Firestore.", "erro");
    }
  };

  const selecionarTodasCategoriasUsuario = async (
    userIdOrDocId: string, 
    userEmail: string, 
    todasCategorias: string[],
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        categorias: todasCategorias,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Todas as categorias foram vinculadas ao usuário!");
    } catch (err: any) {
      console.error("Erro ao vincular todas as categorias:", err);
      toast$("Erro ao atualizar no Firestore.", "erro");
    }
  };

  const desmarcarTodasCategoriasUsuario = async (
    userIdOrDocId: string, 
    userEmail: string,
    legacyDocIds?: string[]
  ) => {
    try {
      const emailKey = userEmail && userEmail.trim() ? userEmail.trim().toLowerCase() : userIdOrDocId;
      await setDoc(doc(db, "usuarios", emailKey), {
        uid: userIdOrDocId !== emailKey ? userIdOrDocId : "",
        email: userEmail ? userEmail.trim().toLowerCase() : emailKey,
        categorias: [],
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const idsToDelete = new Set<string>(legacyDocIds || []);
      if (userIdOrDocId && userIdOrDocId !== emailKey) {
        idsToDelete.add(userIdOrDocId);
      }
      await limparDuplicatasLegadas(Array.from(idsToDelete));

      toast$("Todas as categorias foram desvinculadas.");
    } catch (err: any) {
      console.error("Erro ao desmarcar categorias:", err);
      toast$("Erro ao atualizar no Firestore.", "erro");
    }
  };

  const adicionarGrupoAoUsuario = async (userObj: any) => {
    if (addGrupoTurmas.length === 0) {
      toast$("Selecione pelo menos uma turma para o grupo de atuação.", "erro");
      return;
    }
    if (addGrupoTipo === "especialista" && addGrupoCategorias.length === 0) {
      toast$("Selecione pelo menos uma categoria específica para a atuação como Especialista.", "erro");
      return;
    }

    const emailKey = userObj.email ? userObj.email.trim().toLowerCase() : userObj.id;
    const currentAtbs: AtribuicaoUsuario[] = Array.isArray(userObj.atribuicoes) && userObj.atribuicoes.length > 0
      ? userObj.atribuicoes
      : (Array.isArray(userObj.turmas) && userObj.turmas.length > 0)
        ? [{ id: "leg_" + Date.now(), tipo: "auxiliar", turmas: userObj.turmas, categorias: userObj.categorias || [] }]
        : [];

    const novaAtb: AtribuicaoUsuario = {
      id: "atb_" + Date.now(),
      tipo: addGrupoTipo,
      turmas: [...addGrupoTurmas],
      categorias: addGrupoTipo === "auxiliar" && addGrupoAcessoGeral ? [] : [...addGrupoCategorias]
    };

    const updatedAtbs = [...currentAtbs, novaAtb];
    const unionTurmas = Array.from(new Set(updatedAtbs.flatMap(a => a.turmas || [])));
    const unionCategorias = Array.from(new Set(updatedAtbs.flatMap(a => a.categorias || [])));

    try {
      await setDoc(doc(db, "usuarios", emailKey), {
        email: emailKey,
        atribuicoes: updatedAtbs,
        turmas: unionTurmas,
        categorias: unionCategorias,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (userObj.legacyDocIds && userObj.legacyDocIds.length > 0) {
        await limparDuplicatasLegadas(userObj.legacyDocIds);
      }

      toast$("Novo grupo de atuação vinculado com sucesso!");
      setAddGrupoTurmas([]);
      setAddGrupoCategorias([]);
    } catch (err: any) {
      console.error("Erro ao adicionar grupo de atuação:", err);
      toast$("Erro ao salvar no Firestore.", "erro");
    }
  };

  const removerGrupoDoUsuario = async (userObj: any, atbIdToRemove: string) => {
    const emailKey = userObj.email ? userObj.email.trim().toLowerCase() : userObj.id;
    const currentAtbs: AtribuicaoUsuario[] = Array.isArray(userObj.atribuicoes) ? userObj.atribuicoes : [];
    const updatedAtbs = currentAtbs.filter(a => a.id !== atbIdToRemove);

    const unionTurmas = Array.from(new Set(updatedAtbs.flatMap(a => a.turmas || [])));
    const unionCategorias = Array.from(new Set(updatedAtbs.flatMap(a => a.categorias || [])));

    try {
      await setDoc(doc(db, "usuarios", emailKey), {
        email: emailKey,
        atribuicoes: updatedAtbs,
        turmas: unionTurmas,
        categorias: unionCategorias,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast$("Grupo de atuação removido do usuário.");
    } catch (err: any) {
      console.error("Erro ao remover grupo de atuação:", err);
      toast$("Erro ao salvar no Firestore.", "erro");
    }
  };

  const adicionarOuAtualizarUsuarioPorEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoEmailUsuario.trim()) return;
    const emailLimpo = novoEmailUsuario.trim().toLowerCase();

    setSalvandoUsuario(true);
    try {
      const nomeCargo = novoCargoUsuario === "admin" ? "Administrador" : novoCargoUsuario === "coordenador" ? "Coordenador" : "Auxiliar / Professor";
      
      const existing = listaUsuarios.find(u => (u.email || "").toLowerCase() === emailLimpo || u.id === emailLimpo);
      const legacyDocIdsToClean = existing?.legacyDocIds || [];

      await setDoc(doc(db, "usuarios", emailLimpo), {
        email: emailLimpo,
        role: novoCargoUsuario,
        turmas: novasTurmasUsuario,
        categorias: novasCategoriasUsuario,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (legacyDocIdsToClean.length > 0) {
        await limparDuplicatasLegadas(legacyDocIdsToClean);
      }

      toast$(`E-mail ${emailLimpo} vinculado como ${nomeCargo}!`);
      setNovoEmailUsuario("");
      setNovasTurmasUsuario([]);
      setNovasCategoriasUsuario([]);
    } catch (err: any) {
      console.error("Erro ao vincular e-mail de usuário:", err);
      toast$("Erro ao salvar e-mail de usuário.", "erro");
    } finally {
      setSalvandoUsuario(false);
    }
  };

  const canEditAtv = (atv: any, turmaId?: string) => {
    if (!user || guestMode) return true; // full access in guest/offline mode
    if (userRole === "admin" || userRole === "coordenador") return true;
    if (turmaId) {
      if (!podeAcessarAtividade(turmaId, atv?.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias)) {
        return false;
      }
    }
    return !atv.criadoPorEmail || atv.criadoPorEmail === user.email || atv.criadoPorEmail === "Local";
  };

  const isSyncingFromCloud = useRef(false);
  const activeUnsubscribers = useRef<any[]>([]);
  const hasInitialWeekBeenSet = useRef(false);

  const isLocalMode = () => {
    if (user && !guestMode) return false;
    try {
      return localStorage.getItem("semanario_guest_mode") === "true";
    } catch {
      return false;
    }
  };

  const ordenarSemanarios = (lista: any[]) => {
    return [...(lista || [])].sort((a: any, b: any) => {
      const numA = typeof a?.numero === 'number' ? a.numero : parseInt(String(a?.numero || '0'), 10);
      const numB = typeof b?.numero === 'number' ? b.numero : parseInt(String(b?.numero || '0'), 10);
      if (numA !== numB) return numB - numA;
      const dateA = a?.startDate || a?.periodo || a?.id || "";
      const dateB = b?.startDate || b?.periodo || b?.id || "";
      return dateB.localeCompare(dateA);
    });
  };

  const [turmas, _setTurmas]           = useState(() => loadLocal("semanario_turmas", TURMAS));

  // Lista de turmas visíveis/permitidas baseada no perfil e atribuição do usuário
  const turmasVisiveis = useMemo(() => {
    if (!user || guestMode || (!isDocenteRole(userRole) && (userRole === "admin" || userRole === "coordenador"))) {
      return turmas;
    }
    return turmas.filter((t: any) => podeAcessarTurma(t.id, userAtribuicoes, userRole, userTurmas));
  }, [turmas, user, guestMode, userRole, userAtribuicoes, userTurmas]);

  useEffect(() => {
    if (user && !guestMode && isDocenteRole(userRole)) {
      if (turmasVisiveis.length > 0) {
        if (!turmaSel || !turmasVisiveis.some((t: any) => t.id === turmaSel.id)) {
          setTurmaSel(turmasVisiveis[0]);
        }
      } else {
        setTurmaSel(null);
      }
    }
  }, [user, guestMode, userRole, turmasVisiveis]);
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
    const cleanedList = raw.map((s: any) => {
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
    return ordenarSemanarios(cleanedList);
  });
  const [semAtualId, setSemAtualId]   = useState(() => {
    const raw = loadLocal("semanario_lista", [SEM_INICIAL]);
    if (Array.isArray(raw) && raw.length > 0) {
      const sorted = ordenarSemanarios(raw);
      return sorted[0].id;
    }
    return loadLocal("semanario_atual_id", "");
  });
  const [tela, setTela]               = useState("home");
  const [turmaSel, setTurmaSel]       = useState<any>(null);
  const [atividadeSel, setAtividadeSel] = useState<any>(null);
  const [registros, _setRegistros]     = useState(() => loadLocal("semanario_registros", {}));
  const [formData, setFormData]       = useState<any>({});
  const [midias, _setMidias]           = useState(() => loadLocal("semanario_midias", {}));

  // Helper para tratar erros do Firestore (como cota esgotada) sem travar a aplicação
  const handleFirestoreError = (e: any, contexto: string) => {
    if (e?.code === "resource-exhausted" || e?.message?.includes("Quota") || e?.message?.includes("quota") || e?.message?.includes("resource-exhausted")) {
      console.warn(`Firestore cota limite (${contexto}):`, e?.message || e);
      toast$(`Aviso: Limite de cota do servidor atingido. Seus dados foram salvos localmente neste navegador!`, "erro");
    } else {
      console.warn(`Erro Firestore (${contexto}):`, e);
    }
  };

  // Intercepting Setters to automatically write modifications to Firebase when user-initiated
  const setTurmas = (val: any) => {
    _setTurmas((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      const currentUser = auth.currentUser;
      if ((currentUser || user) && !guestMode && !isSyncingFromCloud.current) {
        const cleaned = JSON.parse(JSON.stringify(next));
        setDoc(doc(db, "config", "turmas"), { data: cleaned }).catch(e => handleFirestoreError(e, "turmas"));
      }
      return next;
    });
  };

  const setAtividadesPadrao = (val: any) => {
    _setAtividadesPadrao((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      const currentUser = auth.currentUser;
      if ((currentUser || user) && !guestMode && !isSyncingFromCloud.current) {
        const cleaned = JSON.parse(JSON.stringify(next));
        setDoc(doc(db, "config", "atividades_padrao"), { data: cleaned }).catch(e => handleFirestoreError(e, "atividades"));
      }
      return next;
    });
  };

  const setSemanarios = (val: any) => {
    _setSemanarios((prev: any) => {
      let next = typeof val === "function" ? val(prev) : val;
      const currentUser = auth.currentUser;
      if (Array.isArray(next)) {
        next = ordenarSemanarios(next);
      }
      if ((currentUser || user) && !guestMode && !isSyncingFromCloud.current) {
        syncSemanariosDifference(prev, next);
      }
      return next;
    });
  };

  const setRegistros = (val: any) => {
    _setRegistros((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      const currentUser = auth.currentUser;
      if ((currentUser || user) && !guestMode && !isSyncingFromCloud.current) {
        syncRegistrosDifference(prev, next);
      }
      return next;
    });
  };

  const setMidias = (val: any) => {
    _setMidias((prev: any) => {
      const next = typeof val === "function" ? val(prev) : val;
      const currentUser = auth.currentUser;
      if ((currentUser || user) && !guestMode && !isSyncingFromCloud.current) {
        syncMidiasDifference(prev, next);
      }
      return next;
    });
  };

  // Helper sync logic - optimized to write only modified week documents
  const syncSemanariosDifference = (prev: any[], next: any[]) => {
    if (isSyncingFromCloud.current) return;
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevMap = new Map((prev || []).map(s => [s.id, s]));
    const nextMap = new Map((next || []).map(s => [s.id, s]));

    next.forEach(sem => {
      const prevSem = prevMap.get(sem.id);
      if (!prevSem || JSON.stringify(prevSem) !== JSON.stringify(sem)) {
        // Save semanario document safely stripping undefined values
        const cleanedSem = JSON.parse(JSON.stringify(sem));
        setDoc(doc(db, "semanarios", sem.id), cleanedSem).catch(e => handleFirestoreError(e, "semanários"));
      }
    });

    (prev || []).forEach(sem => {
      if (!nextMap.has(sem.id)) {
        // Delete semanario document
        deleteDoc(doc(db, "semanarios", sem.id)).catch(e => handleFirestoreError(e, "exclusão de semanário"));
      }
    });
  };

  const syncRegistrosDifference = (prev: any, next: any) => {
    if (isSyncingFromCloud.current) return;
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevKeys = Object.keys(prev || {});
    const nextKeys = Object.keys(next || {});

    nextKeys.forEach(k => {
      const prevVal = prev[k];
      const nextVal = next[k];
      if (!prevVal || JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
        const cleanedVal = JSON.parse(JSON.stringify(nextVal));
        setDoc(doc(db, "registros", k), cleanedVal).catch(e => handleFirestoreError(e, "registro"));
      }
    });

    prevKeys.forEach(k => {
      if (!(k in next)) {
        deleteDoc(doc(db, "registros", k)).catch(e => handleFirestoreError(e, "exclusão de registro"));
      }
    });
  };

  const syncMidiasDifference = (prev: any, next: any) => {
    if (isSyncingFromCloud.current) return;
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    const prevKeys = Object.keys(prev || {});
    const nextKeys = Object.keys(next || {});

    nextKeys.forEach(k => {
      const prevVal = prev[k];
      const nextVal = next[k];
      if (!prevVal || JSON.stringify(prevVal) !== JSON.stringify(nextVal)) {
        const cleanedVal = JSON.parse(JSON.stringify(nextVal));
        setDoc(doc(db, "midias", k), { items: cleanedVal }).catch(e => handleFirestoreError(e, "mídia"));
      }
    });

    prevKeys.forEach(k => {
      if (!(k in next)) {
        deleteDoc(doc(db, "midias", k)).catch(e => handleFirestoreError(e, "exclusão de mídia"));
      }
    });
  };

  // Setup Firebase Auth and Realtime sync subscriptions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clean up any existing subscriptions first to avoid duplicate listeners and memory leaks
      activeUnsubscribers.current.forEach(u => u());
      activeUnsubscribers.current = [];
      hasInitialWeekBeenSet.current = false;

      setUser(currentUser);
      if (currentUser) {
        setGuestMode(false);
        try { localStorage.setItem("semanario_guest_mode", "false"); } catch {}
        
        // Clear guest/localStorage data from memory to guarantee Firestore is the single source of truth
        _setTurmas(TURMAS);
        const cleanAtvs: any = {};
        Object.keys(ATIVIDADES_PADRAO).forEach((k) => {
          cleanAtvs[k] = (ATIVIDADES_PADRAO[k] || []).map((a: any) => formatarAtividadeUnica(a, k));
        });
        _setAtividadesPadrao(cleanAtvs);
        _setSemanarios([]);
        setSemAtualId("");
        _setRegistros({});
        _setMidias({});
        
        isSyncingFromCloud.current = true;
        try {
          // Subscribe to real-time User Profile updates using email as document key
          const userDocKey = currentUser.email ? currentUser.email.trim().toLowerCase() : currentUser.uid;
          const isSuperAdmin = currentUser.email ? currentUser.email.trim().toLowerCase() === "jfernandoveiga1967@gmail.com" : false;

          const unsubUser = onSnapshot(doc(db, "usuarios", userDocKey), async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              let effectiveRole = data.role || "auxiliar";

              // Redefinir estado padrão do admin principal para 'admin' se necessário
              if (isSuperAdmin && (!data.role || data.role === "auxiliar")) {
                effectiveRole = "admin";
                setDoc(doc(db, "usuarios", userDocKey), {
                  uid: currentUser.uid,
                  email: currentUser.email || "",
                  role: "admin",
                  updatedAt: new Date().toISOString()
                }, { merge: true }).catch(err => handleFirestoreError(err, "restaurar admin"));
              }

              setUserRole(effectiveRole);
              const docAtb = Array.isArray(data.atribuicoes) ? data.atribuicoes : [];
              setUserAtribuicoes(docAtb);
              setUserTurmas(Array.isArray(data.turmas) ? data.turmas : []);
              const catList = Array.isArray(data.categorias) ? data.categorias.map((c: string) => c.trim().toLowerCase() === "coral e canto" ? "Coral" : c) : [];
              setUserCategorias(catList);
            } else {
              // Auto-create user profile document using email as ID if missing
              let r: "admin" | "coordenador" | "auxiliar" = "auxiliar";
              let tArr: string[] = [];
              let cArr: string[] = [];
              if (currentUser.email === "jfernandoveiga1967@gmail.com") {
                r = "admin";
              }
              try {
                // Check if an old doc with UID key exists
                const uidSnap = await getDoc(doc(db, "usuarios", currentUser.uid));
                if (uidSnap.exists()) {
                  if (uidSnap.data().role) r = uidSnap.data().role;
                  if (Array.isArray(uidSnap.data().turmas)) tArr = uidSnap.data().turmas;
                  if (Array.isArray(uidSnap.data().categorias)) cArr = uidSnap.data().categorias.map((c: string) => c.trim().toLowerCase() === "coral e canto" ? "Coral" : c);
                } else if (currentUser.email) {
                  const q = query(collection(db, "usuarios"), where("email", "==", currentUser.email.trim().toLowerCase()));
                  const preSnap = await getDocs(q);
                  if (!preSnap.empty) {
                    const preData = preSnap.docs[0].data();
                    if (preData.role) r = preData.role;
                    if (Array.isArray(preData.turmas)) tArr = preData.turmas;
                    if (Array.isArray(preData.categorias)) cArr = preData.categorias.map((c: string) => c.trim().toLowerCase() === "coral e canto" ? "Coral" : c);
                  }
                }
              } catch (e) {
                console.warn("Erro ao buscar pré-registro de e-mail:", e);
              }

              setDoc(doc(db, "usuarios", userDocKey), {
                uid: currentUser.uid,
                email: currentUser.email || "",
                role: r,
                turmas: tArr,
                categorias: cArr,
                updatedAt: new Date().toISOString()
              }, { merge: true }).catch(err => handleFirestoreError(err, "perfil de usuário"));

              setUserRole(r);
              setUserTurmas(tArr);
              setUserCategorias(cArr);
            }
          });

          // Verify if cloud contains semanarios (using query and limit to avoid fetching all documents)
          try {
            const semSnap = await getDocs(query(collection(db, "semanarios"), limit(1)));
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
          } catch (e) {
            handleFirestoreError(e, "verificação inicial do banco");
          }

          // Subscribe to real-time Cloud updates
          const unsubSem = onSnapshot(collection(db, "semanarios"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const sList: any[] = [];
            snapshot.forEach((d) => {
              const s = d.data();
              const cleanedAtvs: any = {};
              if (s.atividades) {
                Object.keys(s.atividades).forEach((tId) => {
                  cleanedAtvs[tId] = (s.atividades[tId] || []).map((a: any) => formatarAtividadeUnica(a, tId));
                });
              }
              sList.push({
                ...s,
                atividades: cleanedAtvs
              });
            });
            if (sList.length > 0) {
              const sorted = ordenarSemanarios(sList);
              _setSemanarios(sorted);
              if (!hasInitialWeekBeenSet.current || !semAtualId) {
                hasInitialWeekBeenSet.current = true;
                setSemAtualId(sorted[0].id);
              }
            }
            isSyncingFromCloud.current = false;
          }, (error) => {
            handleFirestoreError(error, "semanários cloud");
          });

          const unsubReg = onSnapshot(collection(db, "registros"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const regs: any = {};
            snapshot.forEach((d) => {
              regs[d.id] = d.data();
            });
            _setRegistros((prev: any) => ({ ...prev, ...regs }));
            isSyncingFromCloud.current = false;
          }, (error) => {
            handleFirestoreError(error, "registros cloud");
          });

          const unsubMid = onSnapshot(collection(db, "midias"), (snapshot) => {
            isSyncingFromCloud.current = true;
            const mids: any = {};
            snapshot.forEach((d) => {
              mids[d.id] = d.data().items || [];
            });
            _setMidias((prev: any) => ({ ...prev, ...mids }));
            isSyncingFromCloud.current = false;
          }, (error) => {
            handleFirestoreError(error, "mídias cloud");
          });

          const unsubTurmas = onSnapshot(doc(db, "config", "turmas"), (docSnap) => {
            isSyncingFromCloud.current = true;
            if (docSnap.exists() && docSnap.data().data) {
              _setTurmas(docSnap.data().data);
            }
            isSyncingFromCloud.current = false;
          }, (error) => {
            handleFirestoreError(error, "turmas cloud");
          });

          const unsubAtvs = onSnapshot(doc(db, "config", "atividades_padrao"), (docSnap) => {
            isSyncingFromCloud.current = true;
            if (docSnap.exists() && docSnap.data().data) {
              _setAtividadesPadrao(docSnap.data().data);
            }
            isSyncingFromCloud.current = false;
          }, (error) => {
            handleFirestoreError(error, "atividades cloud");
          });

          activeUnsubscribers.current = [unsubUser, unsubSem, unsubReg, unsubMid, unsubTurmas, unsubAtvs];
        } catch (e) {
          handleFirestoreError(e, "sincronização Firebase");
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
        const localSem = ordenarSemanarios(loadLocal("semanario_lista", [SEM_INICIAL]));
        _setSemanarios(localSem);
        if (localSem.length > 0 && (!hasInitialWeekBeenSet.current || !semAtualId)) {
          hasInitialWeekBeenSet.current = true;
          setSemAtualId(localSem[0].id);
        }
        _setRegistros(loadLocal("semanario_registros", {}));
        _setMidias(loadLocal("semanario_midias", {}));
      }
    });

    return () => {
      unsubscribe();
      activeUnsubscribers.current.forEach(u => u());
    };
  }, []);

  useEffect(() => {
    if (semanarios.length > 0) {
      if (!hasInitialWeekBeenSet.current || !semAtualId || !semanarios.some(s => s.id === semAtualId)) {
        hasInitialWeekBeenSet.current = true;
        setSemAtualId(semanarios[0].id);
      }
    }
  }, [semanarios, semAtualId]);
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
  const [bibliotecaAba, setBibliotecaAba] = useState<"semanas" | "pesquisa" | "exportacao">("semanas");
  const [pesquisaQuery, setPesquisaQuery] = useState("");
  const [pesquisaCategoria, setPesquisaCategoria] = useState("");
  const [pesquisaTurma, setPesquisaTurma] = useState("");
  const [pesquisaCriador, setPesquisaCriador] = useState("");

  const filteredAtividades = useMemo(() => {
    const q = pesquisaQuery.toLowerCase().trim();
    const cat = pesquisaCategoria.toLowerCase().trim();
    const tId = pesquisaTurma;
    const criador = pesquisaCriador.toLowerCase().trim();

    return atividadesPesquisa.filter((a: any) => {
      if (user && !guestMode && isDocenteRole(userRole)) {
        if (a.turmaId) {
          const atvCat = (a.categoria || obterCategoriaPura(a.nome || "")).trim();
          if (!podeAcessarAtividade(a.turmaId, atvCat, userAtribuicoes, userRole, userTurmas, userCategorias)) {
            return false;
          }
        }
      }
      if (q) {
        const matchTitle = (a.titulo || "").toLowerCase().includes(q);
        const matchDesc = (a.descricao || "").toLowerCase().includes(q);
        const matchName = (a.nome || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchName) return false;
      }
      if (pesquisaCategoria && (a.categoria || "").toLowerCase().trim() !== cat) return false;
      if (pesquisaTurma && a.turmaId !== tId) return false;
      if (pesquisaCriador && !(a.criadoPorEmail || "").toLowerCase().includes(criador)) return false;
      return true;
    });
  }, [atividadesPesquisa, pesquisaQuery, pesquisaCategoria, pesquisaTurma, pesquisaCriador, user, guestMode, userRole, userAtribuicoes, userTurmas, userCategorias]);

  useEffect(() => {
    if (telaBiblioteca) {
      carregarAtividadesPesquisa();
    }
  }, [telaBiblioteca, user, guestMode]);
  const [processandoAI, setProcessandoAI] = useState(false);
  const [revisandoIA, setRevisandoIA] = useState(false);
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
    const lista = ordenarTurmas(turmasVisiveis);
    if (lista.length === 0) return;
    if (!turmaSel) {
      setTurmaSel(lista[lista.length - 1]);
      setTela("turma");
      return;
    }
    const idx = lista.findIndex((t: any) => t.id === turmaSel.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + lista.length) % lista.length;
      setTurmaSel(lista[prevIdx]);
      if (tela !== "turma") setTela("turma");
    } else {
      setTurmaSel(lista[0]);
      if (tela !== "turma") setTela("turma");
    }
  };

  const navegarTurmaProxima = () => {
    const lista = ordenarTurmas(turmasVisiveis);
    if (lista.length === 0) return;
    if (!turmaSel) {
      setTurmaSel(lista[0]);
      setTela("turma");
      return;
    }
    const idx = lista.findIndex((t: any) => t.id === turmaSel.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % lista.length;
      setTurmaSel(lista[nextIdx]);
      if (tela !== "turma") setTela("turma");
    } else {
      setTurmaSel(lista[0]);
      if (tela !== "turma") setTela("turma");
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

    const descricaoFormatada = formatarParagrafosDescricao(descLines.join("\n\n"));

    return { titulo: nomeFormatado, descricao: descricaoFormatada };
  };

  const formatarParagrafosDescricao = (texto: string): string => {
    if (!texto || typeof texto !== "string") return "";
    let t = texto.trim();
    if (!t) return "";

    const topicos = [
      "Proposta", "Dinâmica", "Dinamica", "Materiais", "Importante",
      "Versículo", "Versiculo", "Atividade", "Atividades", "Reflexão",
      "Reflexao", "Momento de Oração", "Momento de oracao", "Objetivo", "Orientações", "Orientacoes"
    ];

    topicos.forEach(topico => {
      const regex = new RegExp(`(?<!^|\\n\\s*)\\s*(${topico}\\s*:)\\s*`, "gi");
      t = t.replace(regex, "\n\n$1 ");
    });

    return t.replace(/\n{3,}/g, "\n\n").trim();
  };

  const renderDescricaoNoPdf = (doc: any, desc: string, margin: number, startY: number): number => {
    let y = startY;
    const formattedDesc = formatarParagrafosDescricao(desc || "");
    const paragrafos = formattedDesc.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    if (paragrafos.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(100, 116, 139);
      doc.text("(Sem descrição cadastrada)", margin, y);
      return y + 6;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);

    for (let i = 0; i < paragrafos.length; i++) {
      const p = paragrafos[i].trim();
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      const lines = doc.splitTextToSize(p, 180);
      doc.text(lines, margin, y);
      y += lines.length * 5.2 + (i < paragrafos.length - 1 ? 4 : 2);
    }

    return y;
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
    const s = semanarios.find(x => x.id === (semAtualId || "")) || sem;
    const semAtividades = s?.atividades?.[turma.id] || [];
    const atvAtual = semAtividades.find((x: any) => x.id === atividade.id) || atividade;

    const isAdminOrCoordenador = userRole === "admin" || userRole === "coordenador" || (userRole as string) === "coordinator";
    const jaGeradoPorIA = Boolean(atvAtual.aiGenerated || (atvAtual.aiGenerationCount && atvAtual.aiGenerationCount > 0));

    if (!isAdminOrCoordenador && jaGeradoPorIA) {
      toast$("Sugestão de IA já gerada para esta categoria nesta semana.", "aviso");
      return;
    }

    setModalGerador(true);
    setGenContext({ turma, atividade });
    setGenResult("");
    setProcessandoAI(true);
    setErrorAI(false);

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

  const aprimorarTextoComIA = async () => {
    if (!editandoEstrutura) return;
    setRevisandoIA(true);
    try {
      const payload = {
        tema: editandoEstrutura.tema || "",
        nome: editandoEstrutura.nome || "",
        descricao: editandoEstrutura.descricao || "",
        turmaNome: turmaSel?.label || ""
      };

      const res = await fetch("/api/improve-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${res.status}`);
      }

      const data = await res.json();
      setEditandoEstrutura((p: any) => ({
        ...p,
        tema: data.tema || p.tema,
        nome: data.nome || p.nome,
        descricao: data.descricao || p.descricao
      }));

      toast$("Texto da atividade revisado e aprimorado com sucesso pela IA!");
    } catch (error: any) {
      console.error("Erro no aprimoramento por IA:", error);
      toast$(error.message || "Não foi possível revisar o texto com a IA no momento.", "erro");
    } finally {
      setRevisandoIA(false);
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

    const isAdminOrCoordenador = userRole === "admin" || userRole === "coordenador" || (userRole as string) === "coordinator";

    for (const t of ordenarTurmas(turmasAlvo)) {
      const items = ATIVIDADES[t.id] || [];
      for (const a of items) {
        const jaGerado = Boolean(a.aiGenerated || (a.aiGenerationCount && a.aiGenerationCount > 0));

        if (atividadeId) {
          if (a.id === atividadeId) {
            if (isAdminOrCoordenador || !jaGerado) {
              pendentes.push({ turma: t, atividade: a });
            }
          }
        } else {
          if (!a.descricao || !a.descricao.trim()) {
            if (isAdminOrCoordenador || !jaGerado) {
              pendentes.push({ turma: t, atividade: a });
            }
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
                descricao: parsed.descricao,
                aiGenerated: true,
                aiGenerationCount: (a.aiGenerationCount || 0) + 1
              }, item.turma.id);
            }
            return a;
          });
        }

        // Salvação incremental a cada atividade gerada com sucesso para evitar perdas
        setSemanarios((prev: any) => {
          const activeSemId = semAtualId || (prev && prev[0]?.id);
          return prev.map((s: any) => {
            if (s.id !== activeSemId) return s;
            return { ...s, atividades: JSON.parse(JSON.stringify(currentAtividades)) };
          });
        });

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
    
    setSemanarios((prev: any) => {
      const activeSemId = semAtualId || (prev && prev[0]?.id);
      return prev.map((s: any) => {
        if (s.id !== activeSemId) return s;
        
        const semAtividades = s.atividades || {};
        const turmaAtividades = semAtividades[turma.id] || [];
        const targetCat = obterCategoriaPura(atividade.nome).toLowerCase();
        
        const atvs = turmaAtividades.map((a: any) => {
          const aCat = obterCategoriaPura(a.nome).toLowerCase();
          
          // Match by ID if both have it, otherwise fallback to matching category name or exact name
          const matchById = a.id && atividade.id && a.id === atividade.id;
          const matchByCat = aCat === targetCat;
          const matchByName = a.nome.trim().toLowerCase() === atividade.nome.trim().toLowerCase();
          
          if (!matchById && !matchByCat && !matchByName) return a;
          
          return {
            ...a,
            nome: dadosNovos.nome,
            descricao: dadosNovos.descricao,
            aiGenerated: true,
            aiGenerationCount: (a.aiGenerationCount || 0) + 1,
            criadoPorEmail: (!guestMode && user?.email) ? user.email : "Local"
          };
        });
        
        return { 
          ...s, 
          atividades: { 
            ...semAtividades, 
            [turma.id]: atvs 
          } 
        };
      });
    });
    
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
    toast$("Lendo, revisando e distribuindo o PDF com IA...", "info");

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
      const turmasContext = turmas.map((t: any) => `- ${t.label} (ID EXATO: ${t.id})`).join("\n");

      const res = await fetch("/api/import-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Data, turmasContext })
      });

      if (!res.ok) throw new Error("Erro no servidor");
      const data = await res.json();
      console.log("[PDF IMPORT DATA]", data);
      const pdfNumeroSemana = data.numeroSemana;
      const pdfTemaGeral = data.temaGeral;

      // Suporte ultra-flexível para qualquer estrutura JSON retornada pela IA
      let turmasDoPdf: Array<{ rawKey: string; atividades: any[] }> = [];

      if (Array.isArray(data.turmas)) {
        turmasDoPdf = data.turmas.map((t: any) => ({
          rawKey: t.turmaId || t.turmaNome || t.id || t.turma || t.nome || t.name || "",
          atividades: t.atividades || t.activities || []
        }));
      } else if (Array.isArray(data)) {
        turmasDoPdf = data.map((t: any) => ({
          rawKey: t.turmaId || t.turmaNome || t.id || t.turma || t.nome || t.name || "",
          atividades: t.atividades || t.activities || []
        }));
      } else if (data.atividades && typeof data.atividades === "object") {
        if (Array.isArray(data.atividades)) {
          turmasDoPdf = data.atividades.map((t: any) => ({
            rawKey: t.turmaId || t.turmaNome || t.id || t.turma || t.nome || t.name || "",
            atividades: t.atividades || t.activities || []
          }));
        } else {
          turmasDoPdf = Object.keys(data.atividades).map(k => ({
            rawKey: k,
            atividades: data.atividades[k] || []
          }));
        }
      }

      const semAtual = semanarios.find((x: any) => x.id === semAtualId) || semanarios[0];
      const activeSemId = semAtual ? semAtual.id : semAtualId;
      const existentesAtvs = semAtual ? (semAtual.atividades || {}) : {};

      const novasAtividades: any = {};
      let totalImportadasCount = 0;
      let turmasAfetadasCount = 0;

      turmasDoPdf.forEach(({ rawKey, atividades: atvsImportadas }) => {
        if (!rawKey || !Array.isArray(atvsImportadas) || atvsImportadas.length === 0) return;

        const targetTurma = resolverTurmaId(rawKey, turmas);
        if (!targetTurma) {
          console.warn("Turma não identificada para a chave do PDF:", rawKey);
          return;
        }

        const tId = targetTurma.id;
        turmasAfetadasCount++;
        const atvsExistentesTurma = existentesAtvs[tId] || [];

        const atvsMapeadas = atvsImportadas.map((a: any) => {
          totalImportadasCount++;
          const catImportada = obterCategoriaPura(a.nome).toLowerCase();

          // Procurar atividade existente com a mesma categoria para manter o mesmo ID
          const correspondente = atvsExistentesTurma.find((ae: any) => 
            obterCategoriaPura(ae.nome).toLowerCase() === catImportada
          );

          if (correspondente) {
            return formatarAtividadeUnica({
              ...a,
              id: correspondente.id, // PRESERVA ID ORIGINAL para não quebrar lançamentos de rotina do semanário
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

        // Manter atividades pré-existentes da mesma turma que não vieram no PDF (para não perder registros históricos)
        const categoriasImportadas = atvsMapeadas.map((a: any) => 
          obterCategoriaPura(a.nome).toLowerCase()
        );
        
        atvsExistentesTurma.forEach((ae: any) => {
          const catExistente = obterCategoriaPura(ae.nome).toLowerCase();
          if (!categoriasImportadas.includes(catExistente)) {
            atvsMapeadas.push(ae);
          }
        });

        novasAtividades[tId] = atvsMapeadas;
      });

      if (Object.keys(novasAtividades).length > 0) {
        setAtividadesPadrao((prev: any) => ({
          ...(prev || {}),
          ...novasAtividades
        }));

        setSemanarios((prev: any) => {
          return prev.map((s: any) => {
            if (s.id !== activeSemId) return s;
            return { 
              ...s, 
              numero: pdfNumeroSemana ? pdfNumeroSemana : s.numero,
              tema: pdfTemaGeral ? pdfTemaGeral : s.tema,
              atividades: {
                ...(s.atividades || {}),
                ...novasAtividades
              } 
            };
          });
        });

        toast$(`PDF lido com sucesso! ${totalImportadasCount} atividades distribuídas entre ${turmasAfetadasCount} turmas.`);
      } else {
        toast$("Não foi possível mapear nenhuma turma no PDF fornecido.", "erro");
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

  // Save to localStorage when state changes (always keep local backup)
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
    if (!isLocalMode()) return;
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

      let novas = listaAtvs
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

      // Exclusões específicas solicitadas por turma
      if (tId === "mini-maternal-azul") {
        const lenBefore = novas.length;
        novas = novas.filter((a: any) => !a.nome.toLowerCase().startsWith("motoca"));
        if (novas.length !== lenBefore) mudou = true;
      }
      if (tId === "1ano-azul") {
        const lenBefore = novas.length;
        novas = novas.filter((a: any) => !a.nome.toLowerCase().startsWith("caixa de brinquedos"));
        if (novas.length !== lenBefore) mudou = true;
      }
      if (tId === "5ano-azul" || tId === "6ano-azul") {
        const lenBefore = novas.length;
        novas = novas.filter((a: any) => {
          const nl = a.nome.toLowerCase();
          return !nl.startsWith("contação de história") &&
                 !nl.startsWith("contacao de historia") &&
                 !nl.startsWith("leitura de gibi") &&
                 !nl.includes("roda quinta-feira");
        });
        if (novas.length !== lenBefore) mudou = true;
      }

      return { novas, mudou };
    };

    setSemanarios((prev: any) => {
      let globalMudou = false;
      const novos = prev.map((s: any) => {
        const novasAtividades: any = {};
        let sMudou = false;
        Object.keys(s.atividades || {}).forEach(tId => {
          const { novas, mudou } = migrarNomes(s.atividades[tId], tId, s.id);
          
          // INJECTION: Also ensure any missing standard activities (like Lição de Casa / Estímulo Motor) are added to existing semanarios
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

          if (tId === "mini-maternal-azul") {
            finalAtvs = finalAtvs.filter(a => !a.nome.toLowerCase().startsWith("motoca"));
          }
          if (tId === "1ano-azul") {
            finalAtvs = finalAtvs.filter(a => !a.nome.toLowerCase().startsWith("caixa de brinquedos"));
          }
          if (tId === "5ano-azul" || tId === "6ano-azul") {
            finalAtvs = finalAtvs.filter(a => {
              const nl = a.nome.toLowerCase();
              return !nl.startsWith("contação de história") &&
                     !nl.startsWith("contacao de historia") &&
                     !nl.startsWith("leitura de gibi") &&
                     !nl.includes("roda quinta-feira");
            });
          }
          
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

        if (tId === "mini-maternal-azul") {
          const antes = finalAtvs.length;
          finalAtvs = finalAtvs.filter(a => !a.nome.toLowerCase().startsWith("motoca"));
          if (finalAtvs.length !== antes) m2 = true;
        }
        if (tId === "1ano-azul") {
          const antes = finalAtvs.length;
          finalAtvs = finalAtvs.filter(a => !a.nome.toLowerCase().startsWith("caixa de brinquedos"));
          if (finalAtvs.length !== antes) m2 = true;
        }
        if (tId === "5ano-azul" || tId === "6ano-azul") {
          const antes = finalAtvs.length;
          finalAtvs = finalAtvs.filter(a => {
            const nl = a.nome.toLowerCase();
            return !nl.startsWith("contação de história") &&
                   !nl.startsWith("contacao de historia") &&
                   !nl.startsWith("leitura de gibi") &&
                   !nl.includes("roda quinta-feira");
          });
          if (finalAtvs.length !== antes) m2 = true;
        }

        extras.forEach((ex: any) => {
          const catName = ex.nome.split(":")[0].trim().toLowerCase();
          const exists = finalAtvs.some(a => {
            const cn = (a.nome || "").split(":")[0].trim().toLowerCase();
            return cn === catName;
          });
          if (!exists) {
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
  const activeSemId = sem?.id || semAtualId || "";
  const ATIVIDADES = sem?.atividades || {};

  const todasCategoriasDisponiveis = useMemo(() => {
    const base = new Set<string>([
      "Contação de História",
      "Balé",
      "Devocional",
      "Artes",
      "Música",
      "Psicomotricidade",
      "Projetos",
      "Culinária",
      "Lego",
      "Robótica",
      "Informática",
      "Flauta",
      "Coral",
      "Natação",
      "Judô",
      "Caixa de Brinquedos",
      "Caixa de Jogos",
      "Quadra B",
      "Leitura de Gibi",
      "Motoca",
      "Lição de Casa"
    ]);

    if (ATIVIDADES) {
      Object.values(ATIVIDADES).forEach((list: any) => {
        if (Array.isArray(list)) {
          list.forEach((a: any) => {
            if (a?.nome) {
              const cat = obterCategoriaPura(a.nome);
              if (cat && cat.trim()) base.add(cat.trim());
            }
          });
        }
      });
    }

    if (atividadesPadrao) {
      Object.values(atividadesPadrao).forEach((list: any) => {
        if (Array.isArray(list)) {
          list.forEach((a: any) => {
            if (a?.nome) {
              const cat = obterCategoriaPura(a.nome);
              if (cat && cat.trim()) base.add(cat.trim());
            }
          });
        }
      });
    }

    // Excluir categorias obsoletas ou consolidadas
    const obsoletas = [
      "Coral e Canto", "CORAL E CANTO", "Coral e canto",
      "Como atividade", "COMO ATIVIDADE", "Como Atividade", "como atividade",
      "Educação Física", "EDUCAÇÃO FÍSICA", "Educacao Fisica", "EDUCAÇÃO FISICA", "educação física",
      "Projeto Extra", "PROJETO EXTRA", "Projeto extra", "projeto extra",
      "Atividades", "ATIVIDADES", "Atividade", "atividade", "atividades",
      "Musicalização", "MUSICALIZAÇÃO", "Musicalizacao", "MUSICALIZACAO", "musicalização"
    ];
    obsoletas.forEach(obs => base.delete(obs));

    return Array.from(base).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [ATIVIDADES, atividadesPadrao]);

  const chave = (tId: string, aId: string) => `${activeSemId}||${tId}||${aId}`;
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
    if (user && !guestMode && isDocenteRole(userRole) && turmaSel && atividadeSel) {
      if (!podeAcessarAtividade(turmaSel.id, atividadeSel.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias)) {
        toast$("Você não tem permissão para preencher semanários desta atividade.", "erro");
        return;
      }
    }
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
    if (user && !guestMode && isDocenteRole(userRole) && turmaSel && atividadeSel) {
      if (!podeAcessarAtividade(turmaSel.id, atividadeSel.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias)) {
        toast$("Você não tem permissão para adicionar mídias nesta atividade.", "erro");
        return;
      }
    }
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
    if (semanarios && semanarios.length > 0) {
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

    if (!user || guestMode) {
      setAtividadesPesquisa([]);
      return;
    }

    setCarregandoPesquisa(true);
    try {
      const snap = await getDocs(collection(db, "semanarios"));
      const list: any[] = [];
      snap.forEach(d => {
        const sem = d.data();
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
    } catch (err) {
      handleFirestoreError(err, "carregar biblioteca de atividades");
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
      const base = (atividadesPadrao && atividadesPadrao[t.id] && atividadesPadrao[t.id].length > 0)
        ? atividadesPadrao[t.id]
        : (ATIVIDADES_PADRAO[t.id] || []);
      atividadesLimpas[t.id] = base.map((a: any, index: number) => {
        const catPura = a.nome.includes(":") ? a.nome.split(":")[0].trim() : a.nome.trim();
        return {
          id: a.id || `${t.id}_new_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          nome: `${catPura}:`,
          descricao: "",
          adiResponsavel: "",
          monitoras: "",
          criadoPorEmail: (!guestMode && user?.email) ? user.email : "Local"
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
      criadoPorEmail: (!guestMode && user?.email) ? user.email : "Local"
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
          monitoras: atvParaCopiar.monitoras || "",
          criadoPorEmail: (!guestMode && user?.email) ? user.email : (atvsDest[idx].criadoPorEmail || "Local")
        };
        atvsDest[idx] = formatarAtividadeUnica(updatedAtv, destTurmaId);
      } else {
        // Criar uma nova atividade para essa turma se ela não tiver essa categoria
        const novoId = `copied_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        targetAtvIds[destTurmaId] = novoId;

        const novaAtv = {
          ...atvParaCopiar,
          id: novoId,
          criadoPorEmail: (!guestMode && user?.email) ? user.email : "Local"
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
    if (!isLocalMode()) return;
    const tem6ano = turmas.some((t: any) => t.id === "6ano-azul");
    if (!tem6ano) {
      recuperar6ano();
    }
    const temMaternal = turmas.some((t: any) => t.id === "mini-maternal-azul");
    if (!temMaternal) {
      recuperarMaternal();
    }
  }, []);

  const renderHeaderPDF = (doc: any, sem: any, margin: number): number => {
    let y = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("INTEGRAL", margin, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text("Semanário de Atividades", margin + 45, y);
    
    y += 9;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Semana: ${sem.numero} | Período: ${sem.periodo}`, margin, y);
    
    y += 5;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.3);
    doc.line(margin, y, 196, y);
    return y + 12;
  };

  const renderMarcaDaguaEPaginacao = (doc: any, sem: any) => {
    const pageCount = doc.getNumberOfPages();
    const centerX = 105;
    const centerY = 148;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // 1. Marca d'Água Sutil e Elegante no Fundo (Opacidade ~0.08 e Tom Cinza Sutil)
      try {
        if ((doc as any).GState) {
          doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
        }
      } catch (e) {}

      doc.setDrawColor(218, 225, 235);
      doc.setTextColor(218, 225, 235);

      // Selo Circular
      doc.setLineWidth(0.7);
      doc.circle(centerX, centerY, 52, 'S');
      doc.setLineWidth(0.3);
      doc.circle(centerX, centerY, 48, 'S');
      doc.circle(centerX, centerY, 55, 'S');

      // Vetores de Ícones/Símbolos das Categorias Pedagógicas ao redor do Selo
      // 1. Livro (Leitura / História 📖)
      doc.rect(centerX - 6, centerY - 43, 5, 7);
      doc.rect(centerX + 1, centerY - 43, 5, 7);
      
      // 2. Lápis / Escrita (✏️)
      doc.line(centerX + 32, centerY - 25, centerX + 38, centerY - 19);
      doc.line(centerX + 31, centerY - 24, centerX + 37, centerY - 18);

      // 3. Música / Som (🎵)
      doc.circle(centerX + 35, centerY + 25, 3, 'S');
      doc.line(centerX + 38, centerY + 25, centerX + 38, centerY + 16);

      // 4. Lego / Raciocínio Lógico (⚙️ / 🧩)
      doc.rect(centerX - 4, centerY + 38, 8, 8);
      doc.circle(centerX, centerY + 42, 2, 'S');

      // 5. Artes / Expressão Plástica (🎨)
      doc.circle(centerX - 35, centerY + 24, 4, 'S');

      // 6. Estrela / Estímulo Motor / Brincadeiras (⭐️)
      doc.line(centerX - 35, centerY - 25, centerX - 31, centerY - 21);
      doc.line(centerX - 31, centerY - 25, centerX - 35, centerY - 21);

      // Texto da Marca d'Água Central
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.text("SEMANÁRIO INTEGRAL", centerX, centerY - 7, { align: "center" });

      doc.setFontSize(8.5);
      doc.text("• APRENDIZADO  •  ESTÍMULO  •  DESENVOLVIMENTO •", centerX, centerY + 3, { align: "center" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("DOCUMENTO PEDAGÓGICO OFICIAL", centerX, centerY + 11, { align: "center" });

      // Restaurar Opacidade Normal (1.0) para os textos e rodapé
      try {
        if ((doc as any).GState) {
          doc.setGState(new (doc as any).GState({ opacity: 1.0 }));
        }
      } catch (e) {}

      // 2. Rodapé com Numeração e Identificação
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Semanário Integral - Semana ${sem.numero} (${sem.periodo})`, 14, 287);
      doc.text(`Página ${i} de ${pageCount}`, 196, 287, { align: "right" });
    }
  };

  const baixarAtividades = async (listaTurmas: any[] | any) => {
    const turmas = Array.isArray(listaTurmas) ? listaTurmas : [listaTurmas];
    
    if (turmas.length === 0) {
      toast$("Nenhuma turma selecionada.", "erro");
      return;
    }

    toast$("Gerando PDF...", "info");

    const doc = new jsPDF();
    const margin = 14;
    let y = renderHeaderPDF(doc, sem, margin);

    let isFirstTurma = true;

    for (const t of turmas) {
      const atvs = [...(ATIVIDADES[t.id] || [])].sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      if (atvs.length === 0) continue;

      // Force Page Break per Class (Requirement 1)
      if (!isFirstTurma) {
        doc.addPage();
        y = renderHeaderPDF(doc, sem, margin);
      } else {
        isFirstTurma = false;
      }

      // Class Name
      doc.setFontSize(16);
      doc.setTextColor(t.cor);
      doc.setFont("helvetica", "bold");
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

        // Activity Page Check
        if (y > 230) {
          doc.addPage();
          y = renderHeaderPDF(doc, sem, margin);
        }

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

        y = renderDescricaoNoPdf(doc, a.descricao, margin, y) + 2;

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
              if (y > 240) {
                doc.addPage();
                y = renderHeaderPDF(doc, sem, margin);
              }
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

    renderMarcaDaguaEPaginacao(doc, sem);

    doc.save(`atividades_S${sem.numero}_${turmas.length === 1 ? turmas[0].id : 'global'}.pdf`);
    toast$("PDF pronto!");
  };

  const baixarAtividadeSoh = async (t: any, a: any) => {
    toast$("Gerando PDF da atividade...", "info");

    const doc = new jsPDF();
    const margin = 14;
    let y = renderHeaderPDF(doc, sem, margin);

    // Class Name
    doc.setFontSize(16);
    doc.setTextColor(t.cor);
    doc.setFont("helvetica", "bold");
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

    y = renderDescricaoNoPdf(doc, a.descricao || "", margin, y) + 2;

    const status = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(reg ? status.cor : "#374151"); // slate-700
    doc.text(`${status.emoji} ${status.label}`, margin, y);
    doc.setFont("helvetica", "normal");
    y += 7;

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
          if (y > 240) {
            doc.addPage();
            y = renderHeaderPDF(doc, sem, margin);
          }
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

    renderMarcaDaguaEPaginacao(doc, sem);

    const cleanTitle = a.nome.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
    doc.save(`atividade_S${sem.numero}_${t.id}_${cleanTitle}.pdf`);
    toast$("PDF pronto!");
  };

  const obterAtividadesAgrupadasSemana = () => {
    const grupos: Record<string, { nome: string, atividades: Array<{ turma: any, atividade: any }> }> = {};
    
    turmas.forEach((t: any) => {
      const atvs = ATIVIDADES[t.id] || [];
      atvs.forEach((a: any) => {
        const cat = obterCategoriaPura(a.nome);
        const chaveGrupo = cat.trim();
        if (!chaveGrupo) return;
        
        if (!grupos[chaveGrupo]) {
          grupos[chaveGrupo] = {
            nome: chaveGrupo,
            atividades: []
          };
        }
        
        grupos[chaveGrupo].atividades.push({
          turma: t,
          atividade: a
        });
      });
    });
    
    return Object.values(grupos).sort((a, b) => a.nome.localeCompare(b.nome));
  };

  const baixarAtividadeUnificada = async (grupo: any) => {
    toast$(`Gerando PDF unificado para ${grupo.nome}...`, "info");
    
    const doc = new jsPDF();
    const margin = 14;
    let y = 20;

    // Header unificado
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("INTEGRAL - EXPORTAÇÃO UNIFICADA", margin, y);
    
    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105); // Slate-600
    y += 8;
    doc.text(`Atividade Agrupada: ${grupo.nome.toUpperCase()}`, margin, y);
    
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Semana: ${sem.numero} | Período: ${sem.periodo}`, margin, y);
    
    y += 5;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.line(margin, y, 196, y);
    y += 15;

    // Iterate over all items in the group
    for (let idx = 0; idx < grupo.atividades.length; idx++) {
      const item = grupo.atividades[idx];
      const t = item.turma;
      const a = item.atividade;

      const reg = getReg(t.id, a.id);
      const k = chave(t.id, a.id);
      const fotos = (midias[k] || []).filter((m: any) => m.tipo === "imagem");

      // Check vertical space
      if (y > 220) {
        doc.addPage();
        y = 20;
      }

      // Class Name Header
      doc.setFontSize(14);
      doc.setTextColor(t.cor);
      doc.setFont("helvetica", "bold");
      doc.text(t.label.toUpperCase(), margin, y);
      y += 2;
      doc.setDrawColor(t.cor);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 40, y);
      y += 8;

      // Theme
      const tTema = sem.temasTurmas?.[t.id] !== undefined ? sem.temasTurmas[t.id] : (sem.tema || "");
      if (tTema) {
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "italic");
        doc.text(`Tema: ${tTema}`, margin, y);
        y += 6;
      }

      // Activity Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      const titPuro = obterTituloPuro(a.nome);
      const displayTitle = titPuro && titPuro !== grupo.nome ? `${grupo.nome}: ${titPuro}` : a.nome;
      doc.text(displayTitle, margin, y);
      doc.setFont("helvetica", "normal");
      y += 5;

      // ADI / Monitoras
      if (a.adiResponsavel || a.monitoras) {
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        let extra = "";
        if (a.adiResponsavel) extra += `ADI: ${a.adiResponsavel}  `;
        if (a.monitoras) extra += `Monitora(s): ${a.monitoras}`;
        doc.text(extra, margin, y);
        y += 5;
      }

      // Description with uniform font size and paragraph breaks
      y = renderDescricaoNoPdf(doc, a.descricao || "", margin, y) + 2;

      // Status
      const status = reg ? STATUS_CONFIG[reg.status] : STATUS_CONFIG.pendente;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(reg ? status.cor : "#374151");
      doc.text(`${status.emoji} ${status.label}`, margin, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      // Feedback
      if (reg?.status === "realizada" && reg.justificativa) {
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text("Feedback da Realização:", margin + 5, y);
        doc.setFont("helvetica", "normal");
        y += 4.5;

        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const justLines = doc.splitTextToSize(reg.justificativa, 170);
        doc.text(justLines, margin + 5, y);
        y += justLines.length * 5 + 3;
      }

      // Substitution
      if (reg?.status === "substituida") {
        if (reg.novaProposta) {
          doc.setFontSize(10);
          doc.setTextColor(180, 83, 9);
          doc.setFont("helvetica", "bold");
          doc.text("Nova Proposta Realizada:", margin + 5, y);
          doc.setFont("helvetica", "normal");
          y += 4.5;

          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          const propLines = doc.splitTextToSize(reg.novaProposta, 170);
          doc.text(propLines, margin + 5, y);
          y += propLines.length * 5 + 3;
        }
        if (reg.justificativa) {
          doc.setFontSize(10);
          doc.setTextColor(153, 27, 27);
          doc.setFont("helvetica", "bold");
          doc.text("Motivo da Substituição:", margin + 5, y);
          doc.setFont("helvetica", "normal");
          y += 4.5;

          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          const motLines = doc.splitTextToSize(reg.justificativa, 170);
          doc.text(motLines, margin + 5, y);
          y += motLines.length * 5 + 3;
        }
      }

      // Photos
      if (fotos.length > 0) {
        y += 2;
        let xFoto = margin;
        const fotoSize = 40;
        for (const f of fotos) {
          if (xFoto + fotoSize > 190) {
            xFoto = margin;
            y += fotoSize + 4;
            if (y > 240) {
              doc.addPage();
              y = 20;
            }
          }
          try {
            doc.addImage(f.src, 'JPEG', xFoto, y, fotoSize, fotoSize);
          } catch (err) {
            console.error("Erro ao incluir foto unificada:", err);
          }
          xFoto += fotoSize + 4;
        }
        y += fotoSize + 6;
      } else {
        y += 2;
      }

      // Divider line
      if (idx < grupo.atividades.length - 1) {
        y += 4;
        if (y > 250) {
          doc.addPage();
          y = 20;
        } else {
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.setLineWidth(0.2);
          doc.line(margin, y, 196, y);
          y += 10;
        }
      }
    }

    renderMarcaDaguaEPaginacao(doc, sem);

    const cleanName = grupo.nome.toLowerCase().replace(/[^a-z0-9]/g, "_");
    doc.save(`atividades_unificadas_${cleanName}_S${sem.numero}.pdf`);
    toast$("PDF Unificado baixado com sucesso!");
  };

  // Stats
  const totalAtvs = Object.values(ATIVIDADES).reduce((s: number, a: any) => s + (a?.length || 0), 0) as number;
  const regsDoSem = Object.keys(registros).filter(k => k.startsWith(activeSemId + "||"));
  const totalLanc = regsDoSem.length as number;
  const porStatus = regsDoSem.reduce((acc: any, k) => { const s = registros[k]?.status; if (s) acc[s] = (acc[s]||0)+1; return acc; }, {} as any);

  const progTurma = (tId: string) => {
    let a = ATIVIDADES[tId] || [];
    if (user && !guestMode && isDocenteRole(userRole)) {
      a = a.filter((x: any) => podeAcessarAtividade(tId, x.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias));
    }
    const d = a.filter((x: any) => {
      const temDescricao = Boolean(x.descricao && typeof x.descricao === "string" && x.descricao.trim().length > 0);
      const partesNome = (x.nome || "").split(":");
      const temTituloEspecifico = Boolean(x.nome && (x.nome.includes("\n") || (partesNome.length > 1 && partesNome[1].trim().length > 0)));
      const temRegistro = Boolean(getReg(tId, x.id));
      return temDescricao || temTituloEspecifico || temRegistro;
    }).length;
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

  if (user && !guestMode && semanarios.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px]" />
        
        <div className="text-center space-y-4 z-10 max-w-sm">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-2">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Sincronizando com a nuvem...</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Por favor, aguarde um instante enquanto carregamos suas turmas, temas e atividades de forma segura.
          </p>
        </div>
      </div>
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
                  Baseado no tema: <span className="text-blue-500">{sem?.tema || "Geral"}</span>
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

              {/* Triple Tab Switcher */}
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
                  <Search className="w-3.5 h-3.5" /> Pesquisa ({atividadesPesquisa.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBibliotecaAba("exportacao")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bibliotecaAba === "exportacao" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Exportação Unificada
                </button>
              </div>

              {bibliotecaAba === "semanas" && (
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
                        s.id === activeSemId 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-white border-slate-100 hover:border-blue-200 text-slate-800 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                          s.id === activeSemId ? "bg-white/20" : "bg-slate-100 text-slate-400"
                        }`}>
                          {s.numero}
                        </div>
                        <div>
                          <div className="font-black text-base">Semana {s.numero}</div>
                          <div className="text-xs font-bold opacity-70">{s.periodo}</div>
                          {s.tema && (
                            <div className={`text-[10px] italic mt-0.5 max-w-[160px] truncate ${s.id === activeSemId ? 'text-white/80' : 'text-slate-400'}`}>
                              Tema: {s.tema}
                            </div>
                          )}
                        </div>
                      </div>
                      {s.id === activeSemId && (
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
              )}

              {bibliotecaAba === "pesquisa" && (
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
                          <span>{filteredAtividades.length} atividades encontradas</span>
                          {user && !guestMode && (
                            <span className="text-[10px] text-blue-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sincronizado com Firestore
                            </span>
                          )}
                        </div>

                        <div className="space-y-4">
                          {filteredAtividades.map((a: any) => {
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

                          {filteredAtividades.length === 0 && (
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

              {bibliotecaAba === "exportacao" && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
                    <h3 className="text-sm font-black text-blue-900 flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                      Baixar por Atividade (Multi-Turmas)
                    </h3>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                      Esta funcionalidade agrupa as atividades de mesmo nome/categoria de <strong>todas as turmas</strong> na semana selecionada (Semana {sem?.numero}). Clique na atividade desejada para baixar um PDF único contendo os planejamentos, status de realização, feedbacks e fotos de cada turma.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 px-1 uppercase tracking-wider">
                      Atividades Disponíveis na Semana {sem?.numero}
                    </h4>

                    {obterAtividadesAgrupadasSemana().map((grupo) => {
                      return (
                        <div 
                          key={grupo.nome} 
                          className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                        >
                          <div className="space-y-2">
                            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              {grupo.nome}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full mr-1">
                                {grupo.atividades.length} {grupo.atividades.length === 1 ? "turma" : "turmas"}
                              </span>
                              {grupo.atividades.map((item: any) => (
                                <span 
                                  key={item.turma.id}
                                  className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                                  style={{ 
                                    color: item.turma.cor, 
                                    borderColor: `${item.turma.cor}40`, 
                                    backgroundColor: `${item.turma.cor}10` 
                                  }}
                                >
                                  {item.turma.label}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => baixarAtividadeUnificada(grupo)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                          >
                            <Download className="w-4 h-4" /> Baixar PDF Unificado
                          </button>
                        </div>
                      );
                    })}

                    {obterAtividadesAgrupadasSemana().length === 0 && (
                      <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl">
                        <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold text-sm">Nenhuma atividade cadastrada na semana atual.</p>
                      </div>
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
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white pt-10 sm:pt-6 px-4 sm:px-6 pb-8 shadow-lg">
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
                  
                  <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-1 pt-1.5 border-t border-blue-400/10">
                    <div className="flex items-center gap-1 shrink-0">
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

                    {(() => {
                      const isAdminPrincipal = (user?.email || "").trim().toLowerCase() === "jfernandoveiga1967@gmail.com";
                      const canShowRoleSwitcher = userRole === "admin" || isAdminPrincipal;

                      if (canShowRoleSwitcher) {
                        return (
                          <div translate="no" className="notranslate flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-blue-200 mr-1">Cargo:</span>
                            {(["auxiliar", "coordenador", "admin"] as const).map((r) => (
                              <button
                                key={r}
                                onClick={() => {
                                  const docKey = user.email ? user.email.trim().toLowerCase() : user.uid;
                                  setDoc(doc(db, "usuarios", docKey), {
                                    uid: user.uid,
                                    email: user.email,
                                    role: r,
                                    updatedAt: new Date().toISOString()
                                  }, { merge: true })
                                  .then(() => toast$(`Perfil atualizado para ${r === "admin" ? "Administrador" : r === "coordenador" ? "Coordenador" : "Auxiliar"}!`))
                                  .catch((err) => {
                                    handleFirestoreError(err, "atualizar perfil");
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
                        );
                      }

                      return (
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-blue-200">Cargo:</span>
                          <span className="text-[10px] font-bold text-white bg-blue-800/40 px-2 py-0.5 rounded border border-blue-400/20">
                            Auxiliar/Professor
                          </span>
                        </div>
                      );
                    })()}
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
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div translate="no" className="notranslate uppercase tracking-[0.2em] text-3xl font-black text-red-600 leading-none">INTEGRAL</div>
                  <h1 className="text-2xl font-black">Semanário de Atividades</h1>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold">
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Data: {sem.periodo} - Semana {sem.numero}</span>
                  </div>
                  {!isDocenteRole(userRole) && (
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
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/25 shadow-xs w-full justify-between">
                    <button 
                      onClick={navegarTurmaAnterior}
                      className="h-9 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                      title="Turma Anterior"
                      aria-label="Turma Anterior"
                    >
                      <ChevronLeft className="w-5 h-5 shrink-0" />
                      <span className="text-[11px] font-extrabold">Anterior</span>
                    </button>
                    
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 text-white/95 truncate">
                      Navegar Turmas
                    </span>

                    <button 
                      onClick={navegarTurmaProxima}
                      className="h-9 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                      title="Próxima Turma"
                      aria-label="Próxima Turma"
                    >
                      <span className="text-[11px] font-extrabold">Próxima</span>
                      <ChevronRight className="w-5 h-5 shrink-0" />
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
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-1">
                  <button onClick={() => setTela("relatorio")} className="bg-white border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Relatório
                  </button>
                  <button onClick={() => setTelaBiblioteca(true)} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                    <Library className="w-4 h-4 text-indigo-600" /> Biblioteca
                  </button>
                  {userRole === "admin" && (
                    <button 
                      onClick={() => setTela("usuarios")} 
                      className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <UserCog className="w-4 h-4 text-amber-600" /> Usuários
                    </button>
                  )}
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
                    onClick={() => baixarAtividades(ordenarTurmas(turmasVisiveis))}
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Baixar Minhas Turmas
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {isDocenteRole(userRole) && turmasVisiveis.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">Nenhuma Turma Atribuída</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                        Sua conta de Auxiliar / Professor ainda não possui turmas vinculadas. Solicite a um Administrador ou Coordenador que vincule suas turmas no painel de gerenciamento de usuários.
                      </p>
                    </div>
                  </div>
                )}

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

                {ordenarTurmas(turmasVisiveis).map(t => {
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
            <div className="pt-10 sm:pt-6 px-4 sm:px-6 pb-6 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${turmaSel.cor}, ${turmaSel.cor}dd)` }}>
              {/* Barra de Navegação Superior - Botão Início (Casinha) */}
              <div className="flex items-center justify-between gap-2.5 mb-4 pt-1">
                <button 
                  onClick={() => setTela("home")}
                  className="bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 border border-white/30 shadow-xs backdrop-blur-md cursor-pointer transition-all min-h-[44px]"
                  title="Voltar ao Início"
                  aria-label="Voltar ao Início"
                >
                  <Home className="w-5 h-5 shrink-0 text-white" />
                  <span className="font-extrabold text-xs">Início</span>
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

              <div className="flex items-center gap-2 text-white/90 text-[13px] font-bold mb-3">
                <Calendar className="w-4 h-4 text-white" />
                <span>Data: {sem.periodo} - Semana {sem.numero}</span>
              </div>

              {/* Botão Navegar Turmas posicionado abaixo da linha da Data - Semana */}
              <div className="mb-4 pt-2 border-t border-white/20">
                <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/25 shadow-xs w-full justify-between">
                  <button 
                    onClick={navegarTurmaAnterior}
                    className="h-9 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                    title="Turma Anterior"
                    aria-label="Turma Anterior"
                  >
                    <ChevronLeft className="w-5 h-5 shrink-0" />
                    <span className="text-[11px] font-extrabold">Anterior</span>
                  </button>
                  
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 text-white/95 truncate">
                    Navegar Turmas
                  </span>

                  <button 
                    onClick={navegarTurmaProxima}
                    className="h-9 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                    title="Próxima Turma"
                    aria-label="Próxima Turma"
                  >
                    <span className="text-[11px] font-extrabold">Próxima</span>
                    <ChevronRight className="w-5 h-5 shrink-0" />
                  </button>
                </div>
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
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-800">Editar Atividade</h4>
                        {(userRole === "admin" || user?.email === "jfernandoveiga1967@gmail.com") && (
                          <button
                            type="button"
                            onClick={aprimorarTextoComIA}
                            disabled={revisandoIA}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                            title="Revisar ortografia, gramática, clareza e enriquecer a proposta com inteligência artificial"
                          >
                            {revisandoIA ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Revisando com IA...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>Revisar e Melhorar com IA</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
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

              {(() => {
                const listBruta = ATIVIDADES[turmaSel.id] || [];
                const listFiltrada = (user && !guestMode && isDocenteRole(userRole))
                  ? listBruta.filter((a: any) => podeAcessarAtividade(turmaSel.id, a.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias))
                  : listBruta;
                return [...listFiltrada].sort((a: any, b: any) => a.nome.localeCompare(b.nome));
              })().map((a: any) => {
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
                          {(() => {
                            const isAdminOrCoordenador = userRole === "admin" || userRole === "coordenador" || (userRole as string) === "coordinator";
                            const jaGeradoPorIA = Boolean(a.aiGenerated || (a.aiGenerationCount && a.aiGenerationCount > 0));
                            const bloqueadoParaAuxiliar = !isAdminOrCoordenador && jaGeradoPorIA;

                            return (
                              <div>
                                <button 
                                  disabled={bloqueadoParaAuxiliar}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (bloqueadoParaAuxiliar) return;
                                    gerarAtividadeAI(turmaSel, a);
                                  }}
                                  title={
                                    bloqueadoParaAuxiliar 
                                      ? "Sugestão de IA já gerada para esta categoria nesta semana." 
                                      : (a.descricao && a.descricao.trim() ? "Regerar Proposta com IA" : "Criar Atividade com IA")
                                  }
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black shadow-sm transition-all ${
                                    bloqueadoParaAuxiliar
                                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75"
                                      : a.descricao && a.descricao.trim()
                                        ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 active:scale-95 cursor-pointer"
                                        : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
                                  }`}
                                >
                                  <Sparkles className={`w-3 h-3 ${bloqueadoParaAuxiliar ? "text-slate-400" : (a.descricao && a.descricao.trim() ? "text-slate-500 animate-none" : "animate-pulse")}`} />{" "}
                                  {bloqueadoParaAuxiliar 
                                    ? "IA Já Utilizada" 
                                    : (a.descricao && a.descricao.trim() ? "Regerar Proposta" : "Criar Atividade")
                                  }
                                </button>

                                {bloqueadoParaAuxiliar && (
                                  <p className="text-[10px] text-slate-500 font-medium mt-1.5 flex items-center gap-1 leading-snug">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    Sugestão de IA já gerada para esta categoria nesta semana.
                                  </p>
                                )}
                              </div>
                            );
                          })()}
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


              {(() => {
                const listBruta = ATIVIDADES[turmaSel.id] || [];
                const listFiltrada = (user && !guestMode && isDocenteRole(userRole))
                  ? listBruta.filter((a: any) => podeAcessarAtividade(turmaSel.id, a.nome || "", userAtribuicoes, userRole, userTurmas, userCategorias))
                  : listBruta;
                if (listFiltrada.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3 my-4 shadow-sm">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto border border-purple-100 shadow-inner">
                        <Filter className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800">Nenhuma atividade disponível</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        {user && !guestMode && isDocenteRole(userRole)
                          ? "Sua conta não possui permissão para visualizar atividades nesta turma. Verifique suas atribuições de perfil de acesso (Auxiliar / Especialista) no Gerenciamento de Usuários."
                          : "Nenhuma atividade planejada para esta turma."}
                      </p>
                      {(!user || guestMode || !isDocenteRole(userRole)) && (
                        <button 
                          onClick={() => adicionarBase(turmaSel.id)}
                          className="text-blue-600 hover:text-blue-700 font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Criar primeira atividade
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
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
            <div className="pt-10 sm:pt-6 px-4 sm:px-6 pb-8 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${turmaSel.cor}, ${turmaSel.cor}dd)` }}>
              {/* Barra de Navegação Superior - Início, Voltar Turma e Navegação entre Atividades */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 pt-1">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTela("home")}
                    className="bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 border border-white/30 shadow-xs backdrop-blur-md cursor-pointer transition-all min-h-[44px]"
                    title="Voltar ao Início"
                    aria-label="Voltar ao Início"
                  >
                    <Home className="w-5 h-5 shrink-0 text-white" />
                    <span className="font-extrabold text-xs hidden xs:inline">Início</span>
                  </button>
                  <button 
                    onClick={() => setTela("turma")}
                    className="bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 border border-white/30 shadow-xs backdrop-blur-md cursor-pointer transition-all min-h-[44px]"
                    title="Voltar para Turma"
                    aria-label="Voltar para Turma"
                  >
                    <ChevronLeft className="w-5 h-5 shrink-0 text-white" />
                    <span className="font-extrabold text-xs">Turma</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/25 shadow-xs min-h-[44px]">
                  <button 
                    onClick={navegarAtividadeAnterior}
                    className="h-9 px-3 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                    title="Atividade Anterior"
                    aria-label="Atividade Anterior"
                  >
                    <ChevronLeft className="w-5 h-5 shrink-0" />
                    <span className="text-[11px] font-extrabold hidden xs:inline">Anterior</span>
                  </button>
                  
                  <div className="h-4 w-[1px] bg-white/25 mx-0.5" />

                  <button 
                    onClick={navegarAtividadeProxima}
                    className="h-9 px-3 rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer"
                    title="Próxima Atividade"
                    aria-label="Próxima Atividade"
                  >
                    <span className="text-[11px] font-extrabold hidden xs:inline">Próxima</span>
                    <ChevronRight className="w-5 h-5 shrink-0" />
                  </button>
                </div>
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
            <div className="bg-slate-800 text-white pt-10 sm:pt-6 px-4 sm:px-6 pb-10 shadow-lg">
              <div className="mb-5 pt-1">
                <button 
                  onClick={() => setTela("home")}
                  className="bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 border border-white/30 shadow-xs backdrop-blur-md cursor-pointer transition-all min-h-[44px]"
                  title="Voltar ao Início"
                  aria-label="Voltar ao Início"
                >
                  <Home className="w-5 h-5 shrink-0 text-white" />
                  <span className="font-extrabold text-xs">Início</span>
                </button>
              </div>
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

        {tela === "usuarios" && userRole === "admin" && (
          <motion.div 
            key="usuarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-12"
          >
            {/* Header / Banner Topo */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white pt-10 sm:pt-6 px-4 sm:px-6 pb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck className="w-36 h-36 text-amber-400" />
              </div>

              <div className="flex items-center justify-between mb-5 pt-1">
                <button 
                  onClick={() => setTela("home")}
                  className="bg-white/25 hover:bg-white/35 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 border border-white/30 shadow-xs backdrop-blur-md cursor-pointer transition-all min-h-[44px]"
                  title="Voltar ao Início"
                  aria-label="Voltar ao Início"
                >
                  <Home className="w-5 h-5 shrink-0 text-white" />
                  <span className="font-extrabold text-xs">Início</span>
                </button>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Área Restrita Adm
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                  <UserCog className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">Gerenciamento de Usuários</h1>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Altere os cargos dos e-mails cadastrados e gerencie permissões no aplicativo em tempo real.
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="p-4 space-y-6">
              {/* Card de Adicionar/Vincular E-mail */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Vincular / Definir Cargo por E-mail</span>
                </div>
                <p className="text-xs text-slate-500">
                  Defina o cargo de qualquer usuário informando o seu e-mail de acesso. O cargo será aplicado imediatamente se o usuário já estiver cadastrado ou assim que ele se conectar.
                </p>

                <form onSubmit={adicionarOuAtualizarUsuarioPorEmail} className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="email"
                        required
                        value={novoEmailUsuario}
                        onChange={(e) => setNovoEmailUsuario(e.target.value)}
                        placeholder="exemplo@escola.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <select
                      value={isDocenteRole(novoCargoUsuario) ? "auxiliar" : novoCargoUsuario}
                      onChange={(e: any) => setNovoCargoUsuario(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="auxiliar">Auxiliar / Professor</option>
                      <option value="coordenador">Coordenador</option>
                      <option value="admin">Administrador</option>
                    </select>

                    <button
                      type="submit"
                      disabled={salvandoUsuario || !novoEmailUsuario.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {salvandoUsuario ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Salvar Usuário</span>
                    </button>
                  </div>

                  {/* Seleção de Turmas na criação */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        Turmas autorizadas para este usuário:
                      </label>
                      <div className="flex items-center gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setNovasTurmasUsuario(turmas.map(t => t.id))}
                          className="text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          Selecionar Todas
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => setNovasTurmasUsuario([])}
                          className="text-slate-500 font-bold hover:underline cursor-pointer"
                        >
                          Desmarcar Todas
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                      {ordenarTurmas(turmas).map((t) => {
                        const checked = novasTurmasUsuario.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setNovasTurmasUsuario(prev =>
                                prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]
                              );
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all text-left cursor-pointer ${
                              checked
                                ? "bg-blue-50 border-blue-300 text-blue-800 font-bold shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              checked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="truncate">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seção de Categorias / Componentes Curriculares no Formulário de Novo Usuário */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-1 mb-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Categorias / Componentes Curriculares Vinculados ({novasCategoriasUsuario.length} de {todasCategoriasDisponiveis.length}):
                      </label>
                      <div className="flex items-center gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setNovasCategoriasUsuario([...todasCategoriasDisponiveis])}
                          className="text-purple-600 font-bold hover:underline cursor-pointer"
                        >
                          Selecionar Todas
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => setNovasCategoriasUsuario([])}
                          className="text-slate-500 font-bold hover:underline cursor-pointer"
                        >
                          Desmarcar Todas
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Filtro de visualização para Auxiliar / Professor. O usuário só visualizará e editará atividades destas categorias.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1.5 pt-1 max-h-60 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
                      {todasCategoriasDisponiveis.map((cat) => {
                        const checked = novasCategoriasUsuario.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setNovasCategoriasUsuario(prev =>
                                prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                              );
                            }}
                            className={`w-full min-w-0 px-2 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border transition-all text-left cursor-pointer min-h-[38px] box-border ${
                              checked
                                ? "bg-purple-50 border-purple-300 text-purple-900 font-semibold shadow-2xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 self-center ${
                              checked ? "bg-purple-600 border-purple-600 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="min-w-0 text-[11px] font-medium leading-tight whitespace-normal text-wrap break-words [word-break:break-word] [overflow-wrap:anywhere] flex-1">{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              {/* Lista e Busca de Usuários */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-600" />
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Usuários Mapeados ({usuariosFiltrados.length})
                    </h2>
                  </div>
                  {listaUsuarios.some(u => u.legacyDocIds && u.legacyDocIds.length > 0) && (
                    <button
                      type="button"
                      onClick={consolidarELimparDuplicatasGlobais}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 shrink-0"
                      title="Remover permanentemente registros legados do Firestore mantendo apenas a chave de e-mail"
                    >
                      <span>Unificar e Limpar ({listaUsuarios.reduce((acc, u) => acc + (u.legacyDocIds?.length || 0), 0)} duplicatas)</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="text"
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                    placeholder="Buscar por e-mail, ID ou cargo..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                  {filtroUsuario && (
                    <button 
                      onClick={() => setFiltroUsuario("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Lista de Cards de Usuários */}
                <div className="space-y-2.5 pt-1">
                  {usuariosFiltrados.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-500">Nenhum usuário encontrado</p>
                      <p className="text-[11px] text-slate-400">Verifique os termos da busca ou adicione um novo e-mail acima.</p>
                    </div>
                  ) : (
                    usuariosFiltrados.map((u: any) => {
                      const isEu = user?.uid === u.id || user?.email?.toLowerCase() === (u.email || "").toLowerCase();
                      const currentRole = u.role || "auxiliar";
                      const temDuplicatas = u.legacyDocIds && u.legacyDocIds.length > 0;
                      const isExpanded = usuarioExpandidoId === u.id;

                      const userAtribuicoesList = Array.isArray(u.atribuicoes) && u.atribuicoes.length > 0 
                        ? u.atribuicoes 
                        : (Array.isArray(u.turmas) && u.turmas.length > 0)
                          ? [{ id: "legacy", tipo: "auxiliar" as const, turmas: u.turmas, categorias: u.categorias || [] }]
                          : [];

                      const uniqueTurmas = Array.from(new Set([
                        ...(u.turmas || []),
                        ...userAtribuicoesList.flatMap((a: any) => a.turmas || [])
                      ]));

                      const uniqueCategorias = Array.from(new Set([
                        ...(u.categorias || []),
                        ...userAtribuicoesList.flatMap((a: any) => a.categorias || [])
                      ]));

                      const numTurmas = uniqueTurmas.length;
                      const numCategorias = uniqueCategorias.length;

                      const roleLabel = isDocenteRole(currentRole) 
                        ? "Auxiliar / Professor" 
                        : currentRole === "coordenador" 
                          ? "Coordenador" 
                          : "Administrador";

                      const roleBadgeStyle = currentRole === "admin"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : currentRole === "coordenador"
                          ? "bg-teal-100 text-teal-800 border-teal-300"
                          : "bg-slate-100 text-slate-700 border-slate-300";

                      return (
                        <div 
                          key={u.id}
                          className={`w-full overflow-hidden box-border rounded-2xl border transition-all bg-white shadow-xs flex flex-col ${
                            isEu 
                              ? "border-blue-300 ring-2 ring-blue-500/10 bg-blue-50/10" 
                              : isExpanded 
                                ? "border-blue-400 ring-2 ring-blue-500/10 shadow-md" 
                                : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {/* Cabeçalho do Card (Sanfona / Clicável) */}
                          <div
                            onClick={() => setUsuarioExpandidoId(prev => prev === u.id ? null : u.id)}
                            className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                          >
                            {/* Resumo em linha limpa: E-mail, Cargo, Turmas, Categorias */}
                            <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                              <span className="font-bold text-xs sm:text-sm text-slate-800 break-all">{u.email || "E-mail não cadastrado"}</span>

                              {/* Cargo Atual */}
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${roleBadgeStyle}`}>
                                {roleLabel}
                              </span>

                              {/* Nº de Turmas */}
                              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 flex items-center gap-1 shrink-0">
                                <Users className="w-3 h-3 text-slate-400" />
                                {numTurmas} {numTurmas === 1 ? "turma" : "turmas"}
                              </span>

                              {/* Nº de Categorias */}
                              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 flex items-center gap-1 shrink-0">
                                <BookOpen className="w-3 h-3 text-slate-400" />
                                {numCategorias} {numCategorias === 1 ? "categoria" : "categorias"}
                              </span>

                              {temDuplicatas && (
                                <span 
                                  className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-300 shrink-0"
                                  title={`Informações unificadas de duplicatas: ${u.legacyDocIds.join(", ")}.`}
                                >
                                  Unificado ({u.legacyDocIds.length})
                                </span>
                              )}
                            </div>

                            {/* Ações e Ícone Indicador de Expansão */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isEu ? (
                                <button
                                  type="button"
                                  disabled
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 opacity-60 cursor-not-allowed shrink-0"
                                  title="Sua conta de Administrador logada está protegida e não pode ser excluída"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Sua Conta</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUsuarioParaExcluir(u);
                                  }}
                                  className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
                                  title={`Excluir usuário ${u.email || u.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Excluir</span>
                                </button>
                              )}

                              {/* Ícone Indicador de Expansão */}
                              <div className={`p-1.5 rounded-lg border transition-all ${
                                isExpanded 
                                  ? "bg-blue-100 text-blue-700 border-blue-200" 
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                              }`}>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>

                          {/* Conteúdo Expandido (Configurações Completas) */}
                          {isExpanded && (
                            <div className="p-4 pt-3 border-t border-slate-200/80 bg-slate-50/50 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap w-full">
                                <span className="truncate max-w-full">ID Chave: <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600 break-all">{u.id}</code></span>
                                {u.uid && u.uid !== u.id && (
                                  <span className="truncate max-w-full">• UID: <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600 break-all">{u.uid}</code></span>
                                )}
                                {u.updatedAt && (
                                  <span className="shrink-0">• Atualizado: {new Date(u.updatedAt).toLocaleDateString("pt-BR")}</span>
                                )}
                              </div>

                              {/* Seletor de Cargo em Grid 3 colunas 100% contido */}
                              <div className="w-full pt-2.5 border-t border-slate-200/60 box-border">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                  Cargo no Aplicativo:
                                </label>
                                <div className="grid grid-cols-3 gap-2 w-full box-border">
                                  {[
                                    { key: "auxiliar", label: "Auxiliar / Professor" },
                                    { key: "coordenador", label: "Coordenador" },
                                    { key: "admin", label: "Admin" }
                                  ].map((roleOpt) => {
                                    const isSelected = roleOpt.key === "auxiliar" ? isDocenteRole(currentRole) : currentRole === roleOpt.key;
                                    return (
                                      <button
                                        key={roleOpt.key}
                                        type="button"
                                        onClick={() => alterarCargoUsuario(u.id, u.email || "", roleOpt.key as any, u.legacyDocIds)}
                                        className={`w-full px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer min-w-0 box-border ${
                                          isSelected
                                            ? roleOpt.key === "admin"
                                              ? "bg-red-600 text-white ring-2 ring-red-600/30 font-black"
                                              : roleOpt.key === "coordenador"
                                                ? "bg-teal-600 text-white ring-2 ring-teal-600/30 font-black"
                                                : "bg-slate-700 text-white ring-2 ring-slate-700/30 font-black"
                                            : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                                        }`}
                                      >
                                        {roleOpt.key === "admin" && <Shield className="w-3.5 h-3.5 shrink-0" />}
                                        <span className="truncate">{roleOpt.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Seção de Grupos de Atuação / Perfil Duplo */}
                              <div className="w-full pt-3 border-t border-slate-200/80 box-border space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <Layers className="w-4 h-4 text-purple-600" />
                                    Grupos de Atuação (Perfil Duplo / Vínculo Turma x Categoria)
                                  </label>
                                </div>

                                {/* Lista de Grupos Existentes */}
                                {(() => {
                                  const atbsDoUsuario: AtribuicaoUsuario[] = Array.isArray(u.atribuicoes) && u.atribuicoes.length > 0
                                    ? u.atribuicoes
                                    : (Array.isArray(u.turmas) && u.turmas.length > 0)
                                      ? [{ id: "leg_def", tipo: "auxiliar", turmas: u.turmas, categorias: u.categorias || [] }]
                                      : [];

                                  if (atbsDoUsuario.length === 0) {
                                    return (
                                      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-800">
                                        Nenhum grupo de atuação vinculado. Adicione uma atuação como Auxiliar (Acesso Geral) ou Especialista (Acesso Específico) abaixo.
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="space-y-2">
                                      {atbsDoUsuario.map((atb, idx) => {
                                        const isAux = atb.tipo === "auxiliar";
                                        const turmasList = turmas.filter(t => (atb.turmas || []).includes(t.id));
                                        const catsList = atb.categorias || [];

                                        return (
                                          <div key={atb.id || idx} className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                                  isAux 
                                                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                                }`}>
                                                  {isAux ? "Atuação como Auxiliar (Acesso Geral da Turma)" : "Atuação como Especialista (Acesso Específico por Categoria)"}
                                                </span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => removerGrupoDoUsuario(u, atb.id)}
                                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
                                                title="Remover este grupo de atuação"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>

                                            {/* Turmas do Grupo */}
                                            <div className="text-[11px]">
                                              <span className="font-bold text-slate-500">Turmas Vinculadas: </span>
                                              {turmasList.length > 0 ? (
                                                <span className="inline-flex flex-wrap gap-1 align-middle ml-1">
                                                  {turmasList.map(t => (
                                                    <span key={t.id} className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded font-medium text-[10px]">
                                                      {t.label}
                                                    </span>
                                                  ))}
                                                </span>
                                              ) : (
                                                <span className="text-slate-400 italic">Nenhuma turma</span>
                                              )}
                                            </div>

                                            {/* Categorias do Grupo */}
                                            <div className="text-[11px]">
                                              <span className="font-bold text-slate-500">Categorias Ministradas: </span>
                                              {isAux && (!catsList || catsList.length === 0) ? (
                                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold text-[10px]">
                                                  ✓ Acesso Geral a todas as categorias da turma
                                                </span>
                                              ) : catsList.length > 0 ? (
                                                <span className="inline-flex flex-wrap gap-1 align-middle ml-1">
                                                  {catsList.map(c => (
                                                    <span key={c} className="bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                                                      {c}
                                                    </span>
                                                  ))}
                                                </span>
                                              ) : (
                                                <span className="text-slate-400 italic">Nenhuma categoria específica</span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}

                                {/* Formulário Inline para Adicionar Novo Grupo ao Usuário */}
                                <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-3.5 space-y-3">
                                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                                    Adicionar Grupo de Atuação (Perfil Duplo)
                                  </h5>

                                  {/* Seleção de Tipo de Atuação */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => { setAddGrupoTipo("auxiliar"); setAddGrupoAcessoGeral(true); }}
                                      className={`p-2 rounded-xl text-left border transition-all text-xs font-bold cursor-pointer ${
                                        addGrupoTipo === "auxiliar"
                                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                      }`}
                                    >
                                      <div>Atuação como Auxiliar</div>
                                      <div className={`text-[9px] font-normal mt-0.5 ${addGrupoTipo === "auxiliar" ? "text-blue-100" : "text-slate-400"}`}>
                                        Acesso Geral / Rotina da Turma
                                      </div>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => { setAddGrupoTipo("especialista"); setAddGrupoAcessoGeral(false); }}
                                      className={`p-2 rounded-xl text-left border transition-all text-xs font-bold cursor-pointer ${
                                        addGrupoTipo === "especialista"
                                          ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                      }`}
                                    >
                                      <div>Atuação como Especialista</div>
                                      <div className={`text-[9px] font-normal mt-0.5 ${addGrupoTipo === "especialista" ? "text-purple-100" : "text-slate-400"}`}>
                                        Acesso Específico por Categoria (ex: Coral)
                                      </div>
                                    </button>
                                  </div>

                                  {/* Seleção de Turmas do Novo Grupo */}
                                  <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                      1. Selecione as Turmas deste grupo:
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-36 overflow-y-auto p-1 bg-white border border-slate-200 rounded-xl">
                                      {ordenarTurmas(turmas).map(t => {
                                        const isSel = addGrupoTurmas.includes(t.id);
                                        return (
                                          <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                              setAddGrupoTurmas(prev => isSel ? prev.filter(x => x !== t.id) : [...prev, t.id]);
                                            }}
                                            className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left border transition-all flex items-center gap-1.5 cursor-pointer ${
                                              isSel
                                                ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                            }`}
                                          >
                                            <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${
                                              isSel ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300"
                                            }`}>
                                              {isSel && <Check className="w-2 h-2 stroke-[3]" />}
                                            </div>
                                            <span className="truncate">{t.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Seleção de Categorias do Novo Grupo */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                        2. Selecione as Categorias / Componentes Curriculares:
                                      </label>
                                      {addGrupoTipo === "auxiliar" && (
                                        <label className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={addGrupoAcessoGeral}
                                            onChange={(e) => setAddGrupoAcessoGeral(e.target.checked)}
                                            className="rounded text-emerald-600 focus:ring-emerald-500"
                                          />
                                          Acesso Geral (Todas)
                                        </label>
                                      )}
                                    </div>

                                    {!(addGrupoTipo === "auxiliar" && addGrupoAcessoGeral) && (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-36 overflow-y-auto p-1 bg-white border border-slate-200 rounded-xl">
                                        {todasCategoriasDisponiveis.map(cat => {
                                          const isSel = addGrupoCategorias.includes(cat);
                                          return (
                                            <button
                                              key={cat}
                                              type="button"
                                              onClick={() => {
                                                setAddGrupoCategorias(prev => isSel ? prev.filter(x => x !== cat) : [...prev, cat]);
                                              }}
                                              className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left border transition-all flex items-center gap-1.5 cursor-pointer ${
                                                isSel
                                                  ? "bg-purple-50 border-purple-300 text-purple-900 font-bold"
                                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                              }`}
                                            >
                                              <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${
                                                isSel ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-slate-300"
                                              }`}>
                                                {isSel && <Check className="w-2 h-2 stroke-[3]" />}
                                              </div>
                                              <span className="truncate">{cat}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {/* Botão de Ação */}
                                  <button
                                    type="button"
                                    onClick={() => adicionarGrupoAoUsuario(u)}
                                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Vincular Este Grupo de Atuação ao Usuário</span>
                                  </button>
                                </div>
                              </div>

                              {/* Seção de Turmas Atribuídas no Card do Usuário */}
                              <div className="w-full pt-2.5 border-t border-slate-200/60 box-border space-y-2">
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Turmas Atribuídas ({(u.turmas || []).length} de {turmas.length}):
                                  </label>
                                  <div className="flex items-center gap-2 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => selecionarTodasTurmasUsuario(u.id, u.email || "", turmas.map(t => t.id), u.legacyDocIds)}
                                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                                    >
                                      Todas
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      type="button"
                                      onClick={() => desmarcarTodasTurmasUsuario(u.id, u.email || "", u.legacyDocIds)}
                                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                                    >
                                      Nenhuma
                                    </button>
                                  </div>
                                </div>

                                {isDocenteRole(currentRole) && (!u.turmas || u.turmas.length === 0) && (
                                  <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                                    ⚠️ Nenhuma turma vinculada. Como Auxiliar / Professor, este usuário não verá nenhuma turma no aplicativo.
                                  </p>
                                )}

                                {!isDocenteRole(currentRole) && (
                                  <p className="text-[10px] text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-200 font-medium">
                                    ℹ️ Como {currentRole === "admin" ? "Administrador" : "Coordenador"}, este usuário possui permissão total em todas as turmas. As turmas marcadas abaixo serão aplicadas caso o cargo seja alterado para Auxiliar / Professor.
                                  </p>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full box-border pt-1">
                                  {ordenarTurmas(turmas).map((t) => {
                                    const turmasDoUser = Array.isArray(u.turmas) ? u.turmas : [];
                                    const isChecked = turmasDoUser.includes(t.id);
                                    return (
                                      <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => alternarTurmaUsuario(u.id, u.email || "", t.id, turmasDoUser, u.legacyDocIds)}
                                        className={`w-full px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer min-w-0 box-border text-left ${
                                          isChecked
                                            ? "bg-blue-50/90 border border-blue-300 text-blue-900 font-bold"
                                            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                        }`}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                          isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                                        }`}>
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                        <span className="truncate">{t.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Seção de Categorias / Componentes Curriculares no Card do Usuário */}
                              <div className="w-full pt-2.5 border-t border-slate-200/60 box-border space-y-2">
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Componentes Curriculares / Categorias ({(u.categorias || []).length} de {todasCategoriasDisponiveis.length}):
                                  </label>
                                  <div className="flex items-center gap-2 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => selecionarTodasCategoriasUsuario(u.id, u.email || "", todasCategoriasDisponiveis, u.legacyDocIds)}
                                      className="text-purple-600 font-bold hover:underline cursor-pointer"
                                    >
                                      Todas
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      type="button"
                                      onClick={() => desmarcarTodasCategoriasUsuario(u.id, u.email || "", u.legacyDocIds)}
                                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                                    >
                                      Nenhuma
                                    </button>
                                  </div>
                                </div>

                                {isDocenteRole(currentRole) && (!u.categorias || u.categorias.length === 0) && (
                                  <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                                    ⚠️ Nenhuma categoria vinculada. Como Auxiliar / Professor, este usuário não verá atividades nos semanários.
                                  </p>
                                )}

                                {!isDocenteRole(currentRole) && (
                                  <p className="text-[10px] text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-200 font-medium">
                                    ℹ️ Como {currentRole === "admin" ? "Administrador" : "Coordenador"}, este usuário possui permissão total em todas as categorias.
                                  </p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1.5 w-full box-border pt-1 max-h-60 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-white">
                                  {todasCategoriasDisponiveis.map((cat) => {
                                    const catsDoUser = Array.isArray(u.categorias) ? u.categorias : [];
                                    const isChecked = catsDoUser.includes(cat);
                                    return (
                                      <button
                                        key={cat}
                                        type="button"
                                        onClick={() => alternarCategoriaUsuario(u.id, u.email || "", cat, catsDoUser, u.legacyDocIds)}
                                        className={`w-full min-w-0 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer box-border text-left min-h-[38px] ${
                                          isChecked
                                            ? "bg-purple-50/90 border border-purple-300 text-purple-950 font-semibold"
                                            : "bg-slate-50/50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 self-center ${
                                          isChecked ? "bg-purple-600 border-purple-600 text-white" : "border-slate-300 bg-white"
                                        }`}>
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                        <span className="min-w-0 text-[11px] font-medium leading-tight whitespace-normal text-wrap break-words [word-break:break-word] [overflow-wrap:anywhere] flex-1">{cat}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal de Confirmação de Exclusão de Usuário */}
            <AnimatePresence>
              {usuarioParaExcluir && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <Trash2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-base">Excluir Usuário</h3>
                        <p className="text-xs text-slate-500 font-medium">Confirmação de segurança de acesso</p>
                      </div>
                    </div>

                    <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 space-y-2">
                      <p className="text-xs text-rose-900 leading-relaxed font-medium">
                        Tem certeza que deseja excluir o usuário <strong className="font-black break-all">{usuarioParaExcluir.email || usuarioParaExcluir.id}</strong>?
                      </p>
                      <p className="text-[11px] text-rose-700/90 leading-snug">
                        Esta ação removerá os acessos do usuário e excluirá o registro correspondente no Firestore. Esta ação não poderá ser desfeita.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        disabled={excluindoUsuario}
                        onClick={() => setUsuarioParaExcluir(null)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={excluindoUsuario}
                        onClick={confirmarExclusaoUsuario}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {excluindoUsuario ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Excluindo...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir Usuário</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
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
