import React, { useState } from 'react';
import { Sprout, Lock, User, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

// Defina aqui ou via variáveis de ambiente (.env / Vercel):
// VITE_AGROTECH_USER e VITE_AGROTECH_PASS
const USUARIO_AUTORIZADO = import.meta.env?.VITE_AGROTECH_USER || 'admin';
const SENHA_AUTORIZADA = import.meta.env?.VITE_AGROTECH_PASS || 'AgroTech@2026';
const CHAVE_SESSAO = 'agrotech_field_pro_auth_v1';

export function PainelEntrada({ onAutenticado }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarSessao, setLembrarSessao] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativas, setTentativas] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    const usuarioLimpo = usuario.trim();
    if (!usuarioLimpo || !senha) {
      setErro('Informe o usuário e a senha de acesso.');
      return;
    }

    if (usuarioLimpo === USUARIO_AUTORIZADO && senha === SENHA_AUTORIZADA) {
      const payloadSessao = {
        autenticado: true,
        usuario: usuarioLimpo,
        autorizadoEm: new Date().toISOString()
      };

      if (lembrarSessao) {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(payloadSessao));
      } else {
        sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(payloadSessao));
      }

      onAutenticado(payloadSessao);
    } else {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);
      setErro(
        `Acesso negado. Credenciais inválidas (${novasTentativas}ª tentativa). Somente usuários autorizados podem entrar.`
      );
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border-2 border-stone-200 bg-white shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-emerald-950 px-6 py-7 text-white text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-md">
            <Sprout className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">AgroTech Field Pro</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mt-1">
            Acesso Restrito • Autorização do Proprietário
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1.5">
              Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoComplete="username"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-sm font-semibold text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Digite a senha autorizada"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-sm font-semibold text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((prev) => !prev)}
                aria-label="Mostrar ou ocultar senha"
                className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-800 p-0.5"
              >
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={lembrarSessao}
              onChange={(e) => setLembrarSessao(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-emerald-700"
            />
            Manter sessão ativa neste navegador
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-sm py-3 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            Entrar no Sistema
          </button>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Acesso controlado mediante autorização do titular</span>
          </div>
        </form>
      </div>
    </div>
  );
}