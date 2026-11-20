import React, { useEffect, useMemo, useState } from "react";
import RelatorioTecnicoGraficos from "./components/RelatorioTecnicoGraficos";

const SESSION_KEY = "agrotech_field_pro_auth_v1";

function PainelEntrada({ onAutenticado }) {
  const usuarioEsperado =
    import.meta.env.VITE_AGROTECH_USER || "admin";
  const senhaEsperada =
    import.meta.env.VITE_AGROTECH_PASS || "AgroTech@2026";

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [manterSessao, setManterSessao] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    if (usuario.trim() === usuarioEsperado && senha === senhaEsperada) {
      setErro("");
      const payload = JSON.stringify({
        autenticado: true,
        usuario: usuario.trim(),
        timestamp: Date.now(),
      });

      if (manterSessao) {
        localStorage.setItem(SESSION_KEY, payload);
      } else {
        sessionStorage.setItem(SESSION_KEY, payload);
      }
      onAutenticado();
    } else {
      setErro("Utilizador ou palavra-passe inválidos.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            AgroTech Field Pro • Gestão
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Acesso Restrito ao Sistema
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Introduza as suas credenciais para aceder ao painel técnico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Utilizador
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Palavra-passe
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={manterSessao}
              onChange={(e) => setManterSessao(e.target.checked)}
              className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
            Manter sessão iniciada neste navegador
          </label>

          {erro && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-700">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 text-sm transition"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}

function classificarNutriente(valor, faixas = [10, 20]) {
  const num = Number(valor) || 0;
  if (num < faixas[0]) return "Baixo";
  if (num < faixas[1]) return "Médio";
  return "Alto";
}

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("dashboard");

  // Dados gerais do talhão e análise de solo
  const [nomeTalhao, setNomeTalhao] = useState("Talhão 01");
  const [culturaSelecionada, setCulturaSelecionada] = useState("Soja");
  const [teorArgila, setTeorArgila] = useState(35);

  const [teorP, setTeorP] = useState(14);
  const [teorK, setTeorK] = useState(85);
  const [teorCa, setTeorCa] = useState(1.8);
  const [teorMg, setTeorMg] = useState(0.7);
  const [teorAl, setTeorAl] = useState(0.4);

  // Parâmetros operacionais (calda e sementes)
  const [volumeCalda, setVolumeCalda] = useState(147.7);
  const [autonomiaHa, setAutonomiaHa] = useState(4.06);
  const [sementesHaSacos, setSementesHaSacos] = useState(1.18);
  const [sementesMetro, setSementesMetro] = useState(3.53);
  const [observacoesTecnicas, setObservacoesTecnicas] = useState(
    "Aplicar corretivo conforme necessidade calculada, considerar o teor de argila para ajuste fino e monitorar a disponibilidade de P, K, Ca e Mg no perfil do solo."
  );

  useEffect(() => {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.autenticado) {
          setAutenticado(true);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setAutenticado(false);
  }

  // Ajuste simples de faixas de referência por teor de argila
  const classificacaoP = useMemo(() => {
    const arg = Number(teorArgila) || 0;
    if (arg > 40) return classificarNutriente(teorP, [8, 16]);
    if (arg >= 20) return classificarNutriente(teorP, [12, 24]);
    return classificarNutriente(teorP, [18, 30]);
  }, [teorP, teorArgila]);

  const classificacaoK = useMemo(
    () => classificarNutriente(teorK, [60, 120]),
    [teorK]
  );
  const classificacaoCa = useMemo(
    () => classificarNutriente(teorCa, [1.5, 3.0]),
    [teorCa]
  );
  const classificacaoMg = useMemo(
    () => classificarNutriente(teorMg, [0.5, 1.0]),
    [teorMg]
  );

  // Estimativa de necessidade de calagem (t/ha) baseada em Ca+Mg e Al3+
  const resultadoCalagem = useMemo(() => {
    const ca = Number(teorCa) || 0;
    const mg = Number(teorMg) || 0;
    const al = Number(teorAl) || 0;
    const somaBases = ca + mg;
    const deficitBase = Math.max(0, 2.5 - somaBases);
    const nc = deficitBase * 0.65 + al * 0.85;
    return Number(Math.max(0, nc).toFixed(2));
  }, [teorCa, teorMg, teorAl]);

  if (!autenticado) {
    return <PainelEntrada onAutenticado={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col md:flex-row">
      {/* Barra lateral */}
      <aside className="w-full md:w-64 bg-emerald-950 text-white p-4 flex flex-col justify-between print:hidden">
        <div className="space-y-6">
          <div className="border-b border-emerald-800 pb-4">
            <div className="text-lg font-extrabold tracking-tight text-amber-400">
              AgroTech
            </div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-200">
              Field Pro • Gestão
            </div>
          </div>

          <nav className="space-y-1.5 text-sm">
            {[
              { id: "dashboard", label: "Dashboard & Gestão" },
              { id: "calculadora", label: "Calculadora do Agro" },
              { id: "relatorio", label: "Relatório Técnico" },
            ].map((item) => {
              const ativa = abaAtiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAbaAtiva(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg font-semibold transition ${
                    ativa
                      ? "bg-amber-400 text-slate-950"
                      : "text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-emerald-700 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-900 transition"
        >
          Sair da Sessão
        </button>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {abaAtiva === "dashboard" && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                Indicadores Operacionais
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Dashboard & Gestão do Talhão
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {nomeTalhao} • Cultura: {culturaSelecionada} • Argila: {teorArgila}%
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Calagem (Ca+Mg / Al³⁺)
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {resultadoCalagem.toFixed(2)} t/ha
                </div>
                <div className="text-xs text-slate-600">
                  Elevação de Ca + Mg
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Volume de Calda
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {Number(volumeCalda).toFixed(1)} L/ha
                </div>
                <div className="text-xs text-slate-600">
                  Autonomia: {Number(autonomiaHa).toFixed(2)} ha
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Sementes / ha
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {Number(sementesHaSacos).toFixed(2)} sacos
                </div>
                <div className="text-xs text-slate-600">
                  {Number(sementesMetro).toFixed(2)} sem/m
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Estado P / K Atual
                </div>
                <div className="text-xl font-extrabold text-slate-900 my-2">
                  P: {classificacaoP} • K: {classificacaoK}
                </div>
                <div className="text-xs text-slate-600">
                  Ca: {classificacaoCa} • Mg: {classificacaoMg}
                </div>
              </div>
            </div>
          </section>
        )}

        {abaAtiva === "calculadora" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Calculadora do Agro — Análise de Solo e Parâmetros
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Talhão
                </label>
                <input
                  type="text"
                  value={nomeTalhao}
                  onChange={(e) => setNomeTalhao(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cultura
                </label>
                <input
                  type="text"
                  value={culturaSelecionada}
                  onChange={(e) => setCulturaSelecionada(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Argila (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={teorArgila}
                  onChange={(e) => setTeorArgila(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Fósforo P (mg/dm³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teorP}
                  onChange={(e) => setTeorP(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Potássio K (mg/dm³)
                </label>
                <input
                  type="number"
                  step="1"
                  value={teorK}
                  onChange={(e) => setTeorK(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cálcio Ca (cmolc/dm³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teorCa}
                  onChange={(e) => setTeorCa(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Magnésio Mg (cmolc/dm³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teorMg}
                  onChange={(e) => setTeorMg(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Alumínio Al³⁺ (cmolc/dm³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teorAl}
                  onChange={(e) => setTeorAl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAbaAtiva("relatorio")}
                className="rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold px-4 py-2"
              >
                Ver no Relatório Técnico
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva("dashboard")}
                className="rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold px-4 py-2"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </section>
        )}

        {abaAtiva === "relatorio" && (
          <RelatorioTecnicoGraficos
            talhao={nomeTalhao}
            cultura={culturaSelecionada}
            argilaPct={Number(teorArgila)}
            calagemTonHa={resultadoCalagem}
            observacoes={observacoesTecnicas}
            analise={{
              p: { valor: `${teorP} mg/dm³`, nivel: classificacaoP },
              k: { valor: `${teorK} mg/dm³`, nivel: classificacaoK },
              ca: {
                valor: `${teorCa} cmolc/dm³`,
                num: Number(teorCa),
                nivel: classificacaoCa,
              },
              mg: {
                valor: `${teorMg} cmolc/dm³`,
                num: Number(teorMg),
                nivel: classificacaoMg,
              },
              al: { valor: `${teorAl} cmolc/dm³`, num: Number(teorAl) },
            }}
          />
        )}
      </main>
    </div>
  );
}