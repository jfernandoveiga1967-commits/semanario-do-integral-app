import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc
} from "../lib/firebase";
import { Sparkles, Mail, Lock, AlertCircle, RefreshCw, LogIn, UserPlus, Eye, EyeOff, Shield } from "lucide-react";

interface AuthScreenProps {
  onGuestAccess: () => void;
}

export default function AuthScreen({ onGuestAccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "coordenador" | "auxiliar">("auxiliar");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        if (password.length < 6) {
          throw new Error("A senha precisa ter pelo menos 6 caracteres.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const registeredUser = userCredential.user;
        let finalRole = selectedRole;
        if (email.trim().toLowerCase() === "jfernandoveiga1967@gmail.com") {
          finalRole = "admin";
        }
        await setDoc(doc(db, "usuarios", registeredUser.uid), {
          uid: registeredUser.uid,
          email: registeredUser.email,
          role: finalRole
        });
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = "Ocorreu um erro ao processar. Tente novamente.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errMsg = "E-mail ou senha incorretos. Se este é o seu primeiro acesso ao aplicativo, clique na aba 'Cadastrar-se' acima para criar a sua conta.";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = "Este e-mail já está em uso na nuvem. Use a aba 'Entrar' ou escolha outro e-mail.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Formato de e-mail inválido. Verifique se digitou corretamente.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "A senha deve ter pelo menos 6 caracteres.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Semanário Integral
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin 
              ? "Acesse para sincronizar suas atividades com a nuvem" 
              : "Crie uma conta para compartilhar o mesmo banco de dados"
            }
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-xl mb-6 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Cadastrar-se
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Endereço de E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="exemplo@escola.com"
              />
            </div>
            {email.trim().length > 25 && email.includes("@") && (email.includes("8u7") || /[a-zA-Z0-9]{15,}/.test(email)) && (
              <p className="mt-1.5 text-xs text-amber-400 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                ⚠️ <strong>Atenção:</strong> O e-mail digitado parece conter caracteres extras ou a sua senha misturada (ex: colada no meio do @gmail.com). Verifique antes de tentar entrar.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Sua Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {!isLogin && (
              <p className="mt-1.5 text-xs text-slate-400">
                Escolha uma senha de sua preferência com no mínimo de 6 caracteres.
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50 space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Perfil de Acesso (Cargo)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "auxiliar", label: "Auxiliar", desc: "Suas atividades" },
                  { value: "coordenador", label: "Coordenador", desc: "Todas atividades" },
                  { value: "admin", label: "Admin", desc: "Acesso total" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedRole(item.value as any)}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                      selectedRole === item.value
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-sm"
                        : "bg-slate-900/40 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[8px] opacity-65 font-medium mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 italic mt-1 text-center leading-normal">
                Você poderá alternar ou testar outros perfis nas Configurações da conta.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-600/50 rounded-xl text-white font-medium shadow-lg hover:shadow-blue-600/10 active:shadow-none transition-all duration-150 flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/50 text-center space-y-3">
          <p className="text-xs text-slate-400">
            {isLogin ? (
              <span>Se é o seu primeiro acesso, mude para a aba <strong>Cadastrar-se</strong> acima.</span>
            ) : (
              <span>Se você já criou sua conta antes, mude para a aba <strong>Entrar</strong> acima.</span>
            )}
          </p>

          <button
            onClick={onGuestAccess}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors focus:outline-none"
          >
            Acessar sem sincronizar (Modo Local/Offline)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
