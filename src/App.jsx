import React, { useEffect, useMemo, useState } from "react";
import RelatorioTecnicoGraficos from "./components/RelatorioTecnicoGraficos";

const SESSION_KEY = "agrotech_field_pro_auth_v1";

function PainelEntrada({ onAutenticado }) {
  const usuarioEsperado = import.meta.env.VITE_AGROTECH_USER || "admin";
  const senhaEsperada = import.meta.env.VITE_AGROTECH_PASS || "AgroTech@2026";

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
  const [modoCalc, setModoCalc] = useState("calagem");

  // Identificação da fazenda, talhão, hectares e cultura
  const [nomeFazenda, setNomeFazenda] = useState("Fazenda Santa Luzia");
  const [nomeTalhao, setNomeTalhao] = useState("Talhão 01");
  const [areaHectares, setAreaHectares] = useState(50);
  const [culturaSelecionada, setCulturaSelecionada] = useState("Milho");
  const [teorArgila, setTeorArgila] = useState(35);

  // Análise de solo e calagem
  const [teorP, setTeorP] = useState(14);
  const [teorK, setTeorK] = useState(85);
  const [teorCa, setTeorCa] = useState(1.8);
  const [teorMg, setTeorMg] = useState(0.7);
  const [teorAl, setTeorAl] = useState(0.4);
  const [prntCalcario, setPrntCalcario] = useState(80);
  const [metaSomaBases, setMetaSomaBases] = useState(2.5);

  // Sementes de milho por hectare
  const [populacaoAlvoHa, setPopulacaoAlvoHa] = useState(65000);
  const [espacamentoLinhaCm, setEspacamentoLinhaCm] = useState(50);
  const [germinacaoPct, setGerminacaoPct] = useState(92);
  const [sementesPorSaco, setSementesPorSaco] = useState(60000);

  // Regulagem do pulverizador
  const [vazaoBicoLMin, setVazaoBicoLMin] = useState(0.85);
  const [espacamentoBicoCm, setEspacamentoBicoCm] = useState(50);
  const [velocidadePulvKmH, setVelocidadePulvKmH] = useState(6.9);
  const [capacidadeTanquePulvL, setCapacidadeTanquePulvL] = useState(600);

  // Aplicações com drone
  const [capacidadeTanqueDroneL, setCapacidadeTanqueDroneL] = useState(30);
  const [taxaDroneLHa, setTaxaDroneLHa] = useState(15);
  const [faixaDroneM, setFaixaDroneM] = useState(6.0);
  const [velocidadeDroneMS, setVelocidadeDroneMS] = useState(6.0);

  const [observacoesTecnicas, setObservacoesTecnicas] = useState(
    "Aplicar corretivo conforme necessidade calculada, considerar o teor de argila para ajuste fino, validar a regulagem do pulverizador/drone e ajustar a população de sementes conforme a germinação."
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

  const detalhesCalagem = useMemo(() => {
    const ca = Number(teorCa) || 0;
    const mg = Number(teorMg) || 0;
    const al = Number(teorAl) || 0;
    const meta = Number(metaSomaBases) || 2.5;
    const prnt = Math.max(10, Number(prntCalcario) || 80);
    const ha = Math.max(0, Number(areaHectares) || 0);

    const somaCaMg = Number((ca + mg).toFixed(2));
    const deficitBases = Number(Math.max(0, meta - somaCaMg).toFixed(2));
    const ncBase = deficitBases * 0.65 + al * 0.85;
    const ncAjustada = Number(Math.max(0, ncBase * (80 / prnt)).toFixed(2));
    const totalTonArea = Number((ncAjustada * ha).toFixed(2));

    return {
      somaCaMg,
      deficitBases,
      ncAjustada,
      totalTonArea,
      prnt,
      meta,
    };
  }, [teorCa, teorMg, teorAl, metaSomaBases, prntCalcario, areaHectares]);

  const calculoSementes = useMemo(() => {
    const popAlvo = Math.max(0, Number(populacaoAlvoHa) || 0);
    const germ = Math.min(100, Math.max(10, Number(germinacaoPct) || 92)) / 100;
    const espM = Math.max(0.1, (Number(espacamentoLinhaCm) || 50) / 100);
    const tamSaco = Math.max(1, Number(sementesPorSaco) || 60000);
    const ha = Math.max(0, Number(areaHectares) || 0);

    const sementesNecessariasHa = Math.round(popAlvo / germ);
    const metrosLinearesHa = 10000 / espM;
    const sementesPorMetro = Number(
      (sementesNecessariasHa / metrosLinearesHa).toFixed(2)
    );
    const sacosPorHa = Number((sementesNecessariasHa / tamSaco).toFixed(2));
    const totalSacosArea = Number((sacosPorHa * ha).toFixed(2));

    return {
      sementesNecessariasHa,
      sementesPorMetro,
      sacosPorHa,
      totalSacosArea,
    };
  }, [
    populacaoAlvoHa,
    germinacaoPct,
    espacamentoLinhaCm,
    sementesPorSaco,
    areaHectares,
  ]);

  const calculoPulverizador = useMemo(() => {
    const vazaoBico = Math.max(0, Number(vazaoBicoLMin) || 0);
    const espBicoM = Math.max(0.1, (Number(espacamentoBicoCm) || 50) / 100);
    const velKmH = Math.max(0.1, Number(velocidadePulvKmH) || 1);
    const tanqueL = Math.max(1, Number(capacidadeTanquePulvL) || 600);

    const volumeLHa = Number(
      ((vazaoBico * 600) / (velKmH * espBicoM)).toFixed(1)
    );
    const autonomiaHa =
      volumeLHa > 0 ? Number((tanqueL / volumeLHa).toFixed(2)) : 0;

    return {
      volumeLHa,
      autonomiaHa,
    };
  }, [
    vazaoBicoLMin,
    espacamentoBicoCm,
    velocidadePulvKmH,
    capacidadeTanquePulvL,
  ]);

  const calculoDrone = useMemo(() => {
    const tanqueDrone = Math.max(1, Number(capacidadeTanqueDroneL) || 30);
    const taxaLHa = Math.max(0.5, Number(taxaDroneLHa) || 15);
    const faixaM = Math.max(0.5, Number(faixaDroneM) || 6);
    const velMS = Math.max(0.5, Number(velocidadeDroneMS) || 6);

    const autonomiaHaPorTanque = Number((tanqueDrone / taxaLHa).toFixed(2));
    const rendimentoHaHora = Number(
      ((faixaM * velMS * 3600) / 10000).toFixed(2)
    );
    const vazaoTotalLMin = Number(
      ((rendimentoHaHora * taxaLHa) / 60).toFixed(2)
    );

    return {
      autonomiaHaPorTanque,
      rendimentoHaHora,
      vazaoTotalLMin,
    };
  }, [capacidadeTanqueDroneL, taxaDroneLHa, faixaDroneM, velocidadeDroneMS]);

  if (!autenticado) {
    return <PainelEntrada onAutenticado={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col md:flex-row">
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
          Terminar Sessão
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {abaAtiva === "dashboard" && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                Indicadores Operacionais (KPIs)
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Dashboard & Gestão do Talhão
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {nomeFazenda} • {nomeTalhao} ({Number(areaHectares)} ha) •
                Cultura: {culturaSelecionada || "Não informada"} • Argila:{" "}
                {teorArgila}%
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Calagem (Ca+Mg / Al³⁺)
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {detalhesCalagem.ncAjustada.toFixed(2)} t/ha
                </div>
                <div className="text-xs text-slate-600">
                  Total área: {detalhesCalagem.totalTonArea.toFixed(2)} t
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Volume de Calda
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {calculoPulverizador.volumeLHa.toFixed(1)} L/ha
                </div>
                <div className="text-xs text-slate-600">
                  Autonomia: {calculoPulverizador.autonomiaHa.toFixed(2)} ha •
                  Drone: {calculoDrone.autonomiaHaPorTanque.toFixed(2)} ha/tanque
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Sementes / ha
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 my-2">
                  {calculoSementes.sacosPorHa.toFixed(2)} sacos
                </div>
                <div className="text-xs text-slate-600">
                  {calculoSementes.sementesPorMetro.toFixed(2)} sem/m •{" "}
                  {calculoSementes.totalSacosArea.toFixed(1)} sacos total
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
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Calculadora do Agro
                </h2>
                <p className="text-xs text-slate-500">
                  Preencha os dados da área e alterne entre as calculadoras.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAbaAtiva("relatorio")}
                  className="rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3.5 py-2"
                >
                  Ver Relatório Técnico
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva("dashboard")}
                  className="rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-3.5 py-2"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Fazenda
                </label>
                <input
                  type="text"
                  value={nomeFazenda}
                  onChange={(e) => setNomeFazenda(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Talhão
                </label>
                <input
                  type="text"
                  value={nomeTalhao}
                  onChange={(e) => setNomeTalhao(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Área (Hectares)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cultura
                </label>
                <input
                  type="text"
                  value={culturaSelecionada}
                  onChange={(e) => setCulturaSelecionada(e.target.value)}
                  placeholder="Ex.: Milho, Soja..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "calagem", label: "Calagem & Solo" },
                { id: "sementes", label: "Sementes de Milho / ha" },
                { id: "pulverizador", label: "Regulagem Pulverizador" },
                { id: "drone", label: "Aplicações com Drone" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModoCalc(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    modoCalc === tab.id
                      ? "bg-emerald-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {modoCalc === "calagem" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      PRNT do Calcário (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={prntCalcario}
                      onChange={(e) => setPrntCalcario(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Meta Ca+Mg (cmolc/dm³)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={metaSomaBases}
                      onChange={(e) => setMetaSomaBases(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Soma Ca + Mg:</strong> {detalhesCalagem.somaCaMg}{" "}
                    cmolc/dm³ • <strong>Déficit:</strong>{" "}
                    {detalhesCalagem.deficitBases} cmolc/dm³
                  </div>
                  <div>
                    <strong>Dose Recomendada:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {detalhesCalagem.ncAjustada.toFixed(2)} t/ha
                    </span>{" "}
                    ({detalhesCalagem.totalTonArea.toFixed(2)} t no talhão)
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "sementes" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      População Final Alvo (plantas/ha)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={populacaoAlvoHa}
                      onChange={(e) => setPopulacaoAlvoHa(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Espaçamento entre Linhas (cm)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={espacamentoLinhaCm}
                      onChange={(e) => setEspacamentoLinhaCm(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Germinação / Viabilidade (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={germinacaoPct}
                      onChange={(e) => setGerminacaoPct(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Sementes por Saco
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={sementesPorSaco}
                      onChange={(e) => setSementesPorSaco(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Sementes / metro linear:</strong>{" "}
                    {calculoSementes.sementesPorMetro} sem/m •{" "}
                    <strong>Sementes / ha:</strong>{" "}
                    {calculoSementes.sementesNecessariasHa.toLocaleString("pt-PT")}
                  </div>
                  <div>
                    <strong>Sacos / ha:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoSementes.sacosPorHa.toFixed(2)} sacos/ha
                    </span>{" "}
                    ({calculoSementes.totalSacosArea.toFixed(1)} sacos no
                    talhão)
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "pulverizador" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Vazão por Bico (L/min)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={vazaoBicoLMin}
                      onChange={(e) => setVazaoBicoLMin(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Espaçamento entre Bicos (cm)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={espacamentoBicoCm}
                      onChange={(e) => setEspacamentoBicoCm(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Velocidade (km/h)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={velocidadePulvKmH}
                      onChange={(e) => setVelocidadePulvKmH(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Capacidade do Tanque (L)
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={capacidadeTanquePulvL}
                      onChange={(e) => setCapacidadeTanquePulvL(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Volume de Calda:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoPulverizador.volumeLHa.toFixed(1)} L/ha
                    </span>
                  </div>
                  <div>
                    <strong>Autonomia por Tanque:</strong>{" "}
                    {calculoPulverizador.autonomiaHa.toFixed(2)} ha
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "drone" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Capacidade do Tanque (L)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={capacidadeTanqueDroneL}
                      onChange={(e) =>
                        setCapacidadeTanqueDroneL(e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Taxa de Aplicação (L/ha)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={taxaDroneLHa}
                      onChange={(e) => setTaxaDroneLHa(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Faixa de Aplicação (m)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={faixaDroneM}
                      onChange={(e) => setFaixaDroneM(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Velocidade de Voo (m/s)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={velocidadeDroneMS}
                      onChange={(e) => setVelocidadeDroneMS(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Autonomia por Tanque:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoDrone.autonomiaHaPorTanque.toFixed(2)} ha
                    </span>{" "}
                    • <strong>Vazão Total:</strong> {calculoDrone.vazaoTotalLMin}{" "}
                    L/min
                  </div>
                  <div>
                    <strong>Rendimento Operacional:</strong>{" "}
                    {calculoDrone.rendimentoHaHora.toFixed(2)} ha/h
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {abaAtiva === "relatorio" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 print:break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Identificação da Área & Memória de Calagem
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {nomeFazenda} — {nomeTalhao}
                  </h3>
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  Área: {Number(areaHectares)} ha • Cultura:{" "}
                  {culturaSelecionada || "Não informada"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Soma de Bases (Ca + Mg)
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {detalhesCalagem.somaCaMg.toFixed(2)} cmolc/dm³
                  </div>
                  <div className="text-xs text-slate-600">
                    Meta: {detalhesCalagem.meta.toFixed(2)} (Déficit:{" "}
                    {detalhesCalagem.deficitBases.toFixed(2)})
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Alumínio Trocável (Al³⁺)
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {Number(teorAl).toFixed(2)} cmolc/dm³
                  </div>
                  <div className="text-xs text-slate-600">
                    PRNT considerado: {detalhesCalagem.prnt}%
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Necessidade de Calagem
                  </div>
                  <div className="text-lg font-bold text-emerald-800">
                    {detalhesCalagem.ncAjustada.toFixed(2)} t/ha
                  </div>
                  <div className="text-xs text-slate-600">
                    Para {Number(areaHectares)} ha:{" "}
                    {detalhesCalagem.totalTonArea.toFixed(2)} t
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Sementes / Calda / Drone
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {calculoSementes.sacosPorHa.toFixed(2)} sacos/ha •{" "}
                    {calculoPulverizador.volumeLHa.toFixed(1)} L/ha
                  </div>
                  <div className="text-xs text-slate-600">
                    Drone: {calculoDrone.taxaDroneLHa} L/ha (
                    {calculoDrone.rendimentoHaHora.toFixed(2)} ha/h)
                  </div>
                </div>
              </div>
            </div>

            <RelatorioTecnicoGraficos
              talhao={`${nomeFazenda} — ${nomeTalhao} (${Number(areaHectares)} ha)`}
              cultura={culturaSelecionada || "Não informada"}
              argilaPct={Number(teorArgila)}
              calagemTonHa={detalhesCalagem.ncAjustada}
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
          </div>
        )}
      </main>
    </div>
  );
}