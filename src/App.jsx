import React, { useEffect, useMemo, useState } from "react";
import RelatorioTecnicoGraficos from "./components/RelatorioTecnicoGraficos";

const SESSION_KEY = "agrotech_field_pro_auth_v1";

const PERFIS_MANEJO = {
  marandu: {
    nome: "Capim Marandu (Urochloa brizantha)",
    tipo: "pastagem",
    nAlvoKgHa: 120,
    p2o5AlvoKgHa: 60,
    k2oAlvoKgHa: 60,
    caldaPastagemLHa: 150,
    herbicidaDoseLHa: 2.0,
    cigarrinhaQuimicoLHa: 0.6,
    cigarrinhaBioKgHa: 1.0,
  },
  mombaca: {
    nome: "Capim Mombaça (Megathyrsus maximus)",
    tipo: "pastagem",
    nAlvoKgHa: 150,
    p2o5AlvoKgHa: 70,
    k2oAlvoKgHa: 80,
    caldaPastagemLHa: 160,
    herbicidaDoseLHa: 1.8,
    cigarrinhaQuimicoLHa: 0.65,
    cigarrinhaBioKgHa: 1.2,
  },
  decumbens: {
    nome: "Capim Braquiarão / Decumbens (Urochloa decumbens)",
    tipo: "pastagem",
    nAlvoKgHa: 100,
    p2o5AlvoKgHa: 50,
    k2oAlvoKgHa: 50,
    caldaPastagemLHa: 150,
    herbicidaDoseLHa: 2.2,
    cigarrinhaQuimicoLHa: 0.6,
    cigarrinhaBioKgHa: 1.0,
  },
  tifton: {
    nome: "Tifton 85 / Cynodon",
    tipo: "pastagem",
    nAlvoKgHa: 180,
    p2o5AlvoKgHa: 70,
    k2oAlvoKgHa: 90,
    caldaPastagemLHa: 150,
    herbicidaDoseLHa: 1.5,
    cigarrinhaQuimicoLHa: 0.5,
    cigarrinhaBioKgHa: 1.0,
  },
  milho_silagem: {
    nome: "Milho para Produção de Silagem",
    tipo: "silagem",
    nAlvoKgHa: 140,
    p2o5AlvoKgHa: 80,
    k2oAlvoKgHa: 70,
    caldaPastagemLHa: 180,
    herbicidaDoseLHa: 2.5,
    cigarrinhaQuimicoLHa: 0.5,
    cigarrinhaBioKgHa: 0.8,
  },
};

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
      setErro("Usuário ou senha inválidos.");
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
            Manejo de Pastagens, Milho Silagem e Monitoramento Climático.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Usuário
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
              Senha
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
  const [modoCalc, setModoCalc] = useState("calagem_gesso");

  // Identificação da fazenda, talhão, hectares e espécie/cultura
  const [nomeFazenda, setNomeFazenda] = useState("Fazenda Boa Vista");
  const [nomeTalhao, setNomeTalhao] = useState("Piquete / Talhão 01");
  const [areaHectares, setAreaHectares] = useState(50);
  const [perfilId, setPerfilId] = useState("marandu");
  const [teorArgila, setTeorArgila] = useState(35);

  // Clima em tempo real
  const [latitude, setLatitude] = useState(-16.728);
  const [longitude, setLongitude] = useState(-43.864);
  const [clima, setClima] = useState({
    carregando: false,
    erro: "",
    temperatura: null,
    umidade: null,
    ventoKmH: null,
    chuvaMm: null,
    atualizadoEm: null,
  });

  // NDVI georreferenciado (imagem importada + metadados)
  const [ndviImagemUrl, setNdviImagemUrl] = useState("");
  const [ndviNomeArquivo, setNdviNomeArquivo] = useState("");
  const [ndviDataCaptura, setNdviDataCaptura] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [ndviMedio, setNdviMedio] = useState(0.68);
  const [ndviObservacao, setNdviObservacao] = useState(
    "Vigor vegetativo homogêneo na maior parte do talhão; conferir manchas de menor índice para ajuste de N, umidade ou pragas."
  );

  // Análise de solo, calagem e gessagem
  const [teorP, setTeorP] = useState(14);
  const [teorK, setTeorK] = useState(85);
  const [teorCa, setTeorCa] = useState(1.8);
  const [teorMg, setTeorMg] = useState(0.7);
  const [teorAl, setTeorAl] = useState(0.4);
  const [prntCalcario, setPrntCalcario] = useState(80);
  const [metaSomaBases, setMetaSomaBases] = useState(2.5);

  // Adubação P2O5 e N
  const [fatorAdubacaoP, setFatorAdubacaoP] = useState(1.0);
  const [fatorAdubacaoN, setFatorAdubacaoN] = useState(1.0);
  const [pctFosforoFonte, setPctFosforoFonte] = useState(18);
  const [pctNitrogenioFonte, setPctNitrogenioFonte] = useState(45);

  // Herbicida seletivo e controle da cigarrinha (químico e biológico)
  const [doseHerbicidaLHa, setDoseHerbicidaLHa] = useState(2.0);
  const [tipoControleCigarrinha, setTipoControleCigarrinha] = useState("misto");
  const [doseCigarrinhaQuimicoLHa, setDoseCigarrinhaQuimicoLHa] = useState(0.6);
  const [doseCigarrinhaBioKgHa, setDoseCigarrinhaBioKgHa] = useState(1.0);

  // Regulagem pulverizador e drone
  const [vazaoBicoLMin, setVazaoBicoLMin] = useState(0.85);
  const [espacamentoBicoCm, setEspacamentoBicoCm] = useState(50);
  const [velocidadePulvKmH, setVelocidadePulvKmH] = useState(6.9);
  const [capacidadeTanquePulvL, setCapacidadeTanquePulvL] = useState(600);

  const [capacidadeTanqueDroneL, setCapacidadeTanqueDroneL] = useState(30);
  const [taxaDroneLHa, setTaxaDroneLHa] = useState(15);
  const [faixaDroneM, setFaixaDroneM] = useState(6.0);
  const [velocidadeDroneMS, setVelocidadeDroneMS] = useState(6.0);

  // Milho para produção de silagem
  const [populacaoMilhoHa, setPopulacaoMilhoHa] = useState(65000);
  const [espacamentoLinhaCm, setEspacamentoLinhaCm] = useState(50);
  const [germinacaoPct, setGerminacaoPct] = useState(92);
  const [sementesPorSaco, setSementesPorSaco] = useState(60000);
  const [produtividadeSilagemTHa, setProdutividadeSilagemTHa] = useState(45);
  const [doseHerbicidaMilhoLHa, setDoseHerbicidaMilhoLHa] = useState(2.5);
  const [dosePragaDoencaLHa, setDosePragaDoencaLHa] = useState(0.4);

  const [observacoesTecnicas, setObservacoesTecnicas] = useState(
    "Aplicar corretivo conforme necessidade calculada, considerar o teor de argila para ajuste fino, validar a regulagem do pulverizador/drone e ajustar a população de sementes conforme a germinação."
  );

  const perfilAtual = PERFIS_MANEJO[perfilId] || PERFIS_MANEJO.marandu;

  useEffect(() => {
    const p = PERFIS_MANEJO[perfilId];
    if (!p) return;
    setDoseHerbicidaLHa(p.herbicidaDoseLHa);
    setDoseCigarrinhaQuimicoLHa(p.cigarrinhaQuimicoLHa);
    setDoseCigarrinhaBioKgHa(p.cigarrinhaBioKgHa);
  }, [perfilId]);

  useEffect(() => {
    return () => {
      if (ndviImagemUrl) {
        URL.revokeObjectURL(ndviImagemUrl);
      }
    };
  }, [ndviImagemUrl]);

  function handleUploadNdvi(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (ndviImagemUrl) {
      URL.revokeObjectURL(ndviImagemUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setNdviImagemUrl(objectUrl);
    setNdviNomeArquivo(file.name);
  }

  async function buscarClimaTempoReal(lat = latitude, lon = longitude) {
    setClima((prev) => ({ ...prev, carregando: true, erro: "" }));
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(
        lon
      )}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Falha ao consultar clima.");
      const data = await resp.json();
      const curr = data?.current || {};
      setClima({
        carregando: false,
        erro: "",
        temperatura: curr.temperature_2m ?? null,
        umidade: curr.relative_humidity_2m ?? null,
        ventoKmH: curr.wind_speed_10m ?? null,
        chuvaMm: curr.precipitation ?? null,
        atualizadoEm: new Date().toLocaleTimeString("pt-BR"),
      });
    } catch {
      setClima((prev) => ({
        ...prev,
        carregando: false,
        erro: "Não foi possível atualizar o clima agora.",
      }));
    }
  }

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
    buscarClimaTempoReal(latitude, longitude);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setAutenticado(false);
  }

  const janelaAplicacaoStatus = useMemo(() => {
    if (clima.ventoKmH == null || clima.umidade == null) {
      return {
        rotulo: "Aguardando clima",
        classe: "bg-slate-100 text-slate-700 border-slate-200",
        detalhe: "Atualize a localização para avaliar vento, umidade e chuva.",
      };
    }
    const ventoOk = clima.ventoKmH >= 3 && clima.ventoKmH <= 12;
    const umidadeOk = clima.umidade >= 55;
    const semChuva = (clima.chuvaMm ?? 0) === 0;

    if (ventoOk && umidadeOk && semChuva) {
      return {
        rotulo: "Janela Favorável",
        classe: "bg-emerald-50 text-emerald-800 border-emerald-200",
        detalhe: `Vento ${clima.ventoKmH} km/h • Umid. ${clima.umidade}% • Sem chuva`,
      };
    }
    return {
      rotulo: "Atenção na Aplicação",
      classe: "bg-amber-50 text-amber-800 border-amber-200",
      detalhe: `Vento ${clima.ventoKmH} km/h • Umid. ${clima.umidade}% • Chuva ${
        clima.chuvaMm ?? 0
      } mm`,
    };
  }, [clima]);

  const diagnosticoNdvi = useMemo(() => {
    const val = Number(ndviMedio) || 0;
    if (val < 0.35) {
      return {
        status: "Baixo Vigor / Solo Exposto ou Estresse",
        classe: "bg-red-50 text-red-800 border-red-200",
      };
    }
    if (val < 0.6) {
      return {
        status: "Vigor Moderado / Atenção Pontual",
        classe: "bg-amber-50 text-amber-800 border-amber-200",
      };
    }
    return {
      status: "Alto Vigor Vegetativo",
      classe: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  }, [ndviMedio]);

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

  const detalhesCorrecao = useMemo(() => {
    const ca = Number(teorCa) || 0;
    const mg = Number(teorMg) || 0;
    const al = Number(teorAl) || 0;
    const arg = Math.max(5, Number(teorArgila) || 35);
    const meta = Number(metaSomaBases) || 2.5;
    const prnt = Math.max(10, Number(prntCalcario) || 80);
    const ha = Math.max(0, Number(areaHectares) || 0);

    const somaCaMg = Number((ca + mg).toFixed(2));
    const deficitBases = Number(Math.max(0, meta - somaCaMg).toFixed(2));
    const ncBase = deficitBases * 0.65 + al * 0.85;
    const calagemTonHa = Number(Math.max(0, ncBase * (80 / prnt)).toFixed(2));
    const calagemTotalTon = Number((calagemTonHa * ha).toFixed(2));

    const fatorGesso = somaCaMg < 1.5 || al >= 0.5 ? 1.0 : 0.6;
    const gessoTonHa = Number(
      Math.max(0, arg * 0.015 * fatorGesso).toFixed(2)
    );
    const gessoTotalTon = Number((gessoTonHa * ha).toFixed(2));

    return {
      somaCaMg,
      deficitBases,
      calagemTonHa,
      calagemTotalTon,
      gessoTonHa,
      gessoTotalTon,
      prnt,
      meta,
    };
  }, [
    teorCa,
    teorMg,
    teorAl,
    teorArgila,
    metaSomaBases,
    prntCalcario,
    areaHectares,
  ]);

  const calculoAdubacao = useMemo(() => {
    const ha = Math.max(0, Number(areaHectares) || 0);
    const ajusteP =
      classificacaoP === "Baixo" ? 1.25 : classificacaoP === "Médio" ? 1.0 : 0.7;

    const p2o5KgHa = Number(
      (perfilAtual.p2o5AlvoKgHa * ajusteP * (Number(fatorAdubacaoP) || 1)).toFixed(
        1
      )
    );
    const nKgHa = Number(
      (perfilAtual.nAlvoKgHa * (Number(fatorAdubacaoN) || 1)).toFixed(1)
    );

    const pctP = Math.max(1, Number(pctFosforoFonte) || 18);
    const pctN = Math.max(1, Number(pctNitrogenioFonte) || 45);

    const fonteFosforoKgHa = Number(((p2o5KgHa * 100) / pctP).toFixed(1));
    const fonteNitrogenioKgHa = Number(((nKgHa * 100) / pctN).toFixed(1));

    return {
      p2o5KgHa,
      nKgHa,
      fonteFosforoKgHa,
      fonteNitrogenioKgHa,
      totalFonteFosforoKg: Number((fonteFosforoKgHa * ha).toFixed(1)),
      totalFonteNitrogenioKg: Number((fonteNitrogenioKgHa * ha).toFixed(1)),
    };
  }, [
    areaHectares,
    classificacaoP,
    perfilAtual,
    fatorAdubacaoP,
    fatorAdubacaoN,
    pctFosforoFonte,
    pctNitrogenioFonte,
  ]);

  const calculoDefensivos = useMemo(() => {
    const ha = Math.max(0, Number(areaHectares) || 0);
    const herbHa = Math.max(0, Number(doseHerbicidaLHa) || 0);
    const cigQuimHa = Math.max(0, Number(doseCigarrinhaQuimicoLHa) || 0);
    const cigBioHa = Math.max(0, Number(doseCigarrinhaBioKgHa) || 0);

    return {
      herbicidaTotalL: Number((herbHa * ha).toFixed(2)),
      cigarrinhaQuimicoTotalL: Number((cigQuimHa * ha).toFixed(2)),
      cigarrinhaBioTotalKg: Number((cigBioHa * ha).toFixed(2)),
    };
  }, [
    areaHectares,
    doseHerbicidaLHa,
    doseCigarrinhaQuimicoLHa,
    doseCigarrinhaBioKgHa,
  ]);

  const calculoPulverizador = useMemo(() => {
    const vazaoBico = Math.max(0, Number(vazaoBicoLMin) || 0);
    const espBicoM = Math.max(0.1, (Number(espacamentoBicoCm) || 50) / 100);
    const velKmH = Math.max(0.1, Number(velocidadePulvKmH) || 1);
    const tanqueL = Math.max(1, Number(capacidadeTanquePulvL) || 600);
    const ha = Math.max(0, Number(areaHectares) || 0);

    const volumeLHa = Number(
      ((vazaoBico * 600) / (velKmH * espBicoM)).toFixed(1)
    );
    const autonomiaHa =
      volumeLHa > 0 ? Number((tanqueL / volumeLHa).toFixed(2)) : 0;
    const caldaTotalAreaL = Number((volumeLHa * ha).toFixed(0));

    return {
      volumeLHa,
      autonomiaHa,
      caldaTotalAreaL,
    };
  }, [
    vazaoBicoLMin,
    espacamentoBicoCm,
    velocidadePulvKmH,
    capacidadeTanquePulvL,
    areaHectares,
  ]);

  const calculoDrone = useMemo(() => {
    const tanqueDrone = Math.max(1, Number(capacidadeTanqueDroneL) || 30);
    const taxaLHa = Math.max(0.5, Number(taxaDroneLHa) || 15);
    const faixaM = Math.max(0.5, Number(faixaDroneM) || 6);
    const velMS = Math.max(0.5, Number(velocidadeDroneMS) || 6);
    const ha = Math.max(0, Number(areaHectares) || 0);

    const autonomiaHaPorTanque = Number((tanqueDrone / taxaLHa).toFixed(2));
    const rendimentoHaHora = Number(
      ((faixaM * velMS * 3600) / 10000).toFixed(2)
    );
    const vazaoTotalLMin = Number(
      ((rendimentoHaHora * taxaLHa) / 60).toFixed(2)
    );
    const tanquesNecessariosArea =
      autonomiaHaPorTanque > 0
        ? Math.ceil(ha / autonomiaHaPorTanque)
        : 0;

    return {
      autonomiaHaPorTanque,
      rendimentoHaHora,
      vazaoTotalLMin,
      tanquesNecessariosArea,
    };
  }, [
    capacidadeTanqueDroneL,
    taxaDroneLHa,
    faixaDroneM,
    velocidadeDroneMS,
    areaHectares,
  ]);

  const calculoSilagem = useMemo(() => {
    const popAlvo = Math.max(0, Number(populacaoMilhoHa) || 0);
    const germ = Math.min(100, Math.max(10, Number(germinacaoPct) || 92)) / 100;
    const espM = Math.max(0.1, (Number(espacamentoLinhaCm) || 50) / 100);
    const tamSaco = Math.max(1, Number(sementesPorSaco) || 60000);
    const ha = Math.max(0, Number(areaHectares) || 0);
    const prodTHa = Math.max(0, Number(produtividadeSilagemTHa) || 0);

    const sementesHa = Math.round(popAlvo / germ);
    const sementesMetro = Number((sementesHa / (10000 / espM)).toFixed(2));
    const sacosHa = Number((sementesHa / tamSaco).toFixed(2));
    const sacosTotal = Number((sacosHa * ha).toFixed(1));
    const massaVerdeTotalTon = Number((prodTHa * ha).toFixed(1));
    const herbicidaMilhoTotalL = Number(
      ((Number(doseHerbicidaMilhoLHa) || 0) * ha).toFixed(2)
    );
    const pragaDoencaTotalL = Number(
      ((Number(dosePragaDoencaLHa) || 0) * ha).toFixed(2)
    );

    return {
      sementesHa,
      sementesMetro,
      sacosHa,
      sacosTotal,
      massaVerdeTotalTon,
      herbicidaMilhoTotalL,
      pragaDoencaTotalL,
    };
  }, [
    populacaoMilhoHa,
    germinacaoPct,
    espacamentoLinhaCm,
    sementesPorSaco,
    areaHectares,
    produtividadeSilagemTHa,
    doseHerbicidaMilhoLHa,
    dosePragaDoencaLHa,
  ]);

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
              Field Pro • Pastagens & Silagem
            </div>
          </div>

          <nav className="space-y-1.5 text-sm">
            {[
              { id: "dashboard", label: "Dashboard & Gestão" },
              { id: "calculadora", label: "Calculadora do Agro" },
              { id: "clima", label: "Clima em Tempo Real" },
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

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Faixa de Clima em Tempo Real */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold uppercase tracking-wider text-emerald-800">
              Clima em Tempo Real:
            </span>
            {clima.carregando ? (
              <span className="text-slate-500">
                Atualizando dados meteorológicos...
              </span>
            ) : clima.temperatura != null ? (
              <span className="text-slate-800 font-medium">
                <strong>{clima.temperatura}°C</strong> • Umid:{" "}
                <strong>{clima.umidade}%</strong> • Vento:{" "}
                <strong>{clima.ventoKmH} km/h</strong> • Chuva:{" "}
                <strong>{clima.chuvaMm ?? 0} mm</strong>
                {clima.atualizadoEm ? ` (${clima.atualizadoEm})` : ""}
              </span>
            ) : (
              <span className="text-slate-500">
                {clima.erro || "Sem leitura climática ainda"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full border font-semibold ${janelaAplicacaoStatus.classe}`}
            >
              {janelaAplicacaoStatus.rotulo}
            </span>
            <button
              type="button"
              onClick={() => buscarClimaTempoReal(latitude, longitude)}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
            >
              Atualizar Clima
            </button>
          </div>
        </div>

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
                {nomeFazenda} • {nomeTalhao} ({Number(areaHectares)} ha) •{" "}
                <strong>{perfilAtual.nome}</strong> • Argila: {teorArgila}%
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Calagem & Gessagem
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 my-2">
                  {detalhesCorrecao.calagemTonHa.toFixed(2)} t/ha Cal •{" "}
                  {detalhesCorrecao.gessoTonHa.toFixed(2)} t/ha Ges
                </div>
                <div className="text-xs text-slate-600">
                  Área: {detalhesCorrecao.calagemTotalTon.toFixed(2)} t calc. /{" "}
                  {detalhesCorrecao.gessoTotalTon.toFixed(2)} t gesso
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Adubação P₂O₅ & N
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 my-2">
                  {calculoAdubacao.p2o5KgHa} kg P₂O₅ • {calculoAdubacao.nKgHa}{" "}
                  kg N/ha
                </div>
                <div className="text-xs text-slate-600">
                  Fontes: {calculoAdubacao.fonteFosforoKgHa} kg/ha P •{" "}
                  {calculoAdubacao.fonteNitrogenioKgHa} kg/ha N
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Pulverizador & Drone
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 my-2">
                  {calculoPulverizador.volumeLHa.toFixed(1)} L/ha • Drone:{" "}
                  {taxaDroneLHa} L/ha
                </div>
                <div className="text-xs text-slate-600">
                  Autonomia: {calculoPulverizador.autonomiaHa.toFixed(2)} ha
                  (pulv.) • {calculoDrone.rendimentoHaHora.toFixed(2)} ha/h
                  (drone)
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  Estado P / K • Silagem
                </div>
                <div className="text-lg font-extrabold text-slate-900 my-2">
                  P: {classificacaoP} • K: {classificacaoK}
                </div>
                <div className="text-xs text-slate-600">
                  Silagem: {calculoSilagem.sacosHa.toFixed(2)} sacos/ha •{" "}
                  {calculoSilagem.massaVerdeTotalTon.toFixed(0)} t MV total
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
                  Calculadora do Agro — Pastagens & Milho Silagem
                </h2>
                <p className="text-xs text-slate-500">
                  Escolha a espécie forrageira ou milho silagem, informe a área e
                  calcule cada etapa do manejo.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                  Talhão / Piquete
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Capim / Cultura (Pastagem ou Milho Silagem)
                </label>
                <select
                  value={perfilId}
                  onChange={(e) => setPerfilId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                  {Object.entries(PERFIS_MANEJO).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "calagem_gesso", label: "Calagem & Gessagem" },
                { id: "adubacao", label: "Adubação P₂O₅ & N" },
                { id: "defensivos", label: "Herbicida & Cigarrinha" },
                { id: "pulverizacao", label: "Pulverizador & Drone" },
                { id: "silagem", label: "Milho Silagem & Manejo" },
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

            {modoCalc === "calagem_gesso" && (
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
                    <strong>Soma Ca + Mg:</strong>{" "}
                    {detalhesCorrecao.somaCaMg.toFixed(2)} cmolc/dm³ •{" "}
                    <strong>Déficit:</strong>{" "}
                    {detalhesCorrecao.deficitBases.toFixed(2)} cmolc/dm³
                  </div>
                  <div>
                    <strong>Calagem:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {detalhesCorrecao.calagemTonHa.toFixed(2)} t/ha
                    </span>{" "}
                    ({detalhesCorrecao.calagemTotalTon.toFixed(2)} t) •{" "}
                    <strong>Gessagem:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {detalhesCorrecao.gessoTonHa.toFixed(2)} t/ha
                    </span>{" "}
                    ({detalhesCorrecao.gessoTotalTon.toFixed(2)} t)
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "adubacao" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      % P₂O₅ na Fonte Fosfatada
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={pctFosforoFonte}
                      onChange={(e) => setPctFosforoFonte(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ajuste de P₂O₅ (fator)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fatorAdubacaoP}
                      onChange={(e) => setFatorAdubacaoP(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      % N na Fonte Nitrogenada
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={pctNitrogenioFonte}
                      onChange={(e) => setPctNitrogenioFonte(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ajuste de N (fator)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fatorAdubacaoN}
                      onChange={(e) => setFatorAdubacaoN(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Fosfatada:</strong> {calculoAdubacao.p2o5KgHa} kg
                    P₂O₅/ha →{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoAdubacao.fonteFosforoKgHa} kg/ha
                    </span>{" "}
                    ({calculoAdubacao.totalFonteFosforoKg} kg na área)
                  </div>
                  <div>
                    <strong>Nitrogenada:</strong> {calculoAdubacao.nKgHa} kg
                    N/ha →{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoAdubacao.fonteNitrogenioKgHa} kg/ha
                    </span>{" "}
                    ({calculoAdubacao.totalFonteNitrogenioKg} kg na área)
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "defensivos" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Estratégia Cigarrinha
                    </label>
                    <select
                      value={tipoControleCigarrinha}
                      onChange={(e) => setTipoControleCigarrinha(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="misto">Químico + Biológico</option>
                      <option value="quimico">Apenas Químico</option>
                      <option value="biologico">Apenas Biológico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Herbicida Seletivo (L/ha)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={doseHerbicidaLHa}
                      onChange={(e) => setDoseHerbicidaLHa(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Cigarrinha Químico (L/ha)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={doseCigarrinhaQuimicoLHa}
                      onChange={(e) =>
                        setDoseCigarrinhaQuimicoLHa(e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Cigarrinha Biológico (kg/ha)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={doseCigarrinhaBioKgHa}
                      onChange={(e) => setDoseCigarrinhaBioKgHa(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>
                      Herbicida Seletivo ({Number(areaHectares)} ha):
                    </strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoDefensivos.herbicidaTotalL} L
                    </span>
                  </div>
                  <div>
                    <strong>Cigarrinha:</strong>{" "}
                    {(tipoControleCigarrinha === "misto" ||
                      tipoControleCigarrinha === "quimico") && (
                      <span>
                        Químico:{" "}
                        <strong>
                          {calculoDefensivos.cigarrinhaQuimicoTotalL} L
                        </strong>{" "}
                        •{" "}
                      </span>
                    )}
                    {(tipoControleCigarrinha === "misto" ||
                      tipoControleCigarrinha === "biologico") && (
                      <span>
                        Biológico:{" "}
                        <strong>
                          {calculoDefensivos.cigarrinhaBioTotalKg} kg
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "pulverizacao" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">
                    Pulverizador (Pastagem / Silagem)
                  </h3>
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
                        Tanque Pulverizador (L)
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={capacidadeTanquePulvL}
                        onChange={(e) =>
                          setCapacidadeTanquePulvL(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">
                    Aplicação com Drone
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Tanque Drone (L)
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
                        Taxa Drone (L/ha)
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
                        Faixa Drone (m)
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
                        Velocidade Drone (m/s)
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
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Pulverizador:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoPulverizador.volumeLHa.toFixed(1)} L/ha
                    </span>{" "}
                    • Autonomia: {calculoPulverizador.autonomiaHa.toFixed(2)} ha
                    • Total área: {calculoPulverizador.caldaTotalAreaL} L
                  </div>
                  <div>
                    <strong>Drone:</strong>{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoDrone.rendimentoHaHora.toFixed(2)} ha/h
                    </span>{" "}
                    • Autonomia: {calculoDrone.autonomiaHaPorTanque.toFixed(2)}{" "}
                    ha/tanque • {calculoDrone.tanquesNecessariosArea} tanques
                  </div>
                </div>
              </div>
            )}

            {modoCalc === "silagem" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      População Alvo (plantas/ha)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={populacaoMilhoHa}
                      onChange={(e) => setPopulacaoMilhoHa(e.target.value)}
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
                      Germinação (%) / Saco (sem.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="1"
                        value={germinacaoPct}
                        onChange={(e) => setGerminacaoPct(e.target.value)}
                        className="w-1/2 rounded-lg border border-slate-300 px-2.5 py-2"
                      />
                      <input
                        type="number"
                        step="5000"
                        value={sementesPorSaco}
                        onChange={(e) => setSementesPorSaco(e.target.value)}
                        className="w-1/2 rounded-lg border border-slate-300 px-2.5 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Massa Verde Estimada (t/ha)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={produtividadeSilagemTHa}
                      onChange={(e) =>
                        setProdutividadeSilagemTHa(e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Mato Competitivo — Herbicida (L/ha)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={doseHerbicidaMilhoLHa}
                      onChange={(e) =>
                        setDoseHerbicidaMilhoLHa(e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Pragas / Doenças — Produto (L/ha)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={dosePragaDoencaLHa}
                      onChange={(e) => setDosePragaDoencaLHa(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex flex-wrap justify-between gap-4">
                  <div>
                    <strong>Sementes:</strong> {calculoSilagem.sementesMetro}{" "}
                    sem/m •{" "}
                    <span className="font-bold text-emerald-900">
                      {calculoSilagem.sacosHa.toFixed(2)} sacos/ha
                    </span>{" "}
                    ({calculoSilagem.sacosTotal} sacos total) •{" "}
                    <strong>Silagem:</strong>{" "}
                    {calculoSilagem.massaVerdeTotalTon.toFixed(1)} t MV
                  </div>
                  <div>
                    <strong>Manejo Mato / Pragas-Doenças:</strong>{" "}
                    {calculoSilagem.herbicidaMilhoTotalL} L herbicida •{" "}
                    {calculoSilagem.pragaDoencaTotalL} L pragas/doenças
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {abaAtiva === "clima" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Clima em Tempo Real & Janela de Aplicação
                </h2>
                <p className="text-xs text-slate-500">
                  Informe as coordenadas do talhão para consultar temperatura,
                  umidade, vento e chuva.
                </p>
              </div>
              <button
                type="button"
                onClick={() => buscarClimaTempoReal(latitude, longitude)}
                className="rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2"
              >
                Atualizar Agora
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <div
                  className={`w-full rounded-xl border px-4 py-2.5 text-xs font-semibold ${janelaAplicacaoStatus.classe}`}
                >
                  <div>{janelaAplicacaoStatus.rotulo}</div>
                  <div className="font-normal mt-0.5">
                    {janelaAplicacaoStatus.detalhe}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500">Temperatura</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {clima.temperatura != null ? `${clima.temperatura}°C` : "—"}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500">Umidade Relativa</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {clima.umidade != null ? `${clima.umidade}%` : "—"}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500">Vento</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {clima.ventoKmH != null ? `${clima.ventoKmH} km/h` : "—"}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500">Precipitação</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {clima.chuvaMm != null ? `${clima.chuvaMm} mm` : "—"}
                </div>
              </div>
            </div>
          </section>
        )}

        {abaAtiva === "relatorio" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 print:break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Identificação da Área, Correção & Manejo
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {nomeFazenda} — {nomeTalhao}
                  </h3>
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  Área: {Number(areaHectares)} ha • {perfilAtual.nome}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Calagem & Gessagem
                  </div>
                  <div className="text-base font-bold text-emerald-800">
                    Cal: {detalhesCorrecao.calagemTonHa.toFixed(2)} t/ha • Ges:{" "}
                    {detalhesCorrecao.gessoTonHa.toFixed(2)} t/ha
                  </div>
                  <div className="text-xs text-slate-600">
                    Total área: {detalhesCorrecao.calagemTotalTon.toFixed(2)} t
                    calc. / {detalhesCorrecao.gessoTotalTon.toFixed(2)} t gesso
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Adubação P₂O₅ & N
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {calculoAdubacao.p2o5KgHa} kg P₂O₅ • {calculoAdubacao.nKgHa}{" "}
                    kg N/ha
                  </div>
                  <div className="text-xs text-slate-600">
                    Total: {calculoAdubacao.totalFonteFosforoKg} kg fonte P •{" "}
                    {calculoAdubacao.totalFonteNitrogenioKg} kg fonte N
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Herbicida & Cigarrinha
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    Herb: {calculoDefensivos.herbicidaTotalL} L
                  </div>
                  <div className="text-xs text-slate-600">
                    Cigarrinha: {calculoDefensivos.cigarrinhaQuimicoTotalL} L
                    quím. • {calculoDefensivos.cigarrinhaBioTotalKg} kg bio.
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-500">
                    Pulv. / Drone / Silagem
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Pulv: {calculoPulverizador.volumeLHa.toFixed(1)} L/ha •
                    Drone: {taxaDroneLHa} L/ha
                  </div>
                  <div className="text-xs text-slate-600">
                    Silagem: {calculoSilagem.sacosTotal} sacos •{" "}
                    {calculoSilagem.massaVerdeTotalTon.toFixed(0)} t MV
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco NDVI Georreferenciado */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 print:break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Georreferenciamento & Sensoriamento Remoto
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Mapa de Vigor Vegetativo (NDVI)
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-bold ${diagnosticoNdvi.classe}`}
                >
                  NDVI Médio: {Number(ndviMedio).toFixed(2)} •{" "}
                  {diagnosticoNdvi.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm print:hidden">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Imagem NDVI (PNG / JPG / Exportado)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadNdvi}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Data da Captura
                  </label>
                  <input
                    type="date"
                    value={ndviDataCaptura}
                    onChange={(e) => setNdviDataCaptura(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    NDVI Médio (0.00 a 1.00)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ndviMedio}
                    onChange={(e) => setNdviMedio(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Leitura de Campo / Vigor
                  </label>
                  <input
                    type="text"
                    value={ndviObservacao}
                    onChange={(e) => setNdviObservacao(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center min-h-[220px]">
                  {ndviImagemUrl ? (
                    <img
                      src={ndviImagemUrl}
                      alt={`Mapa NDVI de ${nomeTalhao}`}
                      className="max-h-80 w-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div className="text-center text-xs text-slate-500 py-8 px-4">
                      Nenhuma imagem de NDVI anexada ainda. Selecione um arquivo
                      de imagem acima para incluir o mapa no relatório.
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Dados Georreferenciados
                  </div>
                  <div>
                    <strong>Área:</strong> {nomeFazenda} — {nomeTalhao} (
                    {Number(areaHectares)} ha)
                  </div>
                  <div>
                    <strong>Coordenadas:</strong> Lat {latitude} • Lon{" "}
                    {longitude}
                  </div>
                  <div>
                    <strong>Data da imagem:</strong>{" "}
                    {ndviDataCaptura
                      ? new Date(
                          `${ndviDataCaptura}T12:00:00`
                        ).toLocaleDateString("pt-BR")
                      : "—"}
                  </div>
                  {ndviNomeArquivo && (
                    <div className="text-xs text-slate-600 break-all">
                      <strong>Arquivo:</strong> {ndviNomeArquivo}
                    </div>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-200">
                    {ndviObservacao}
                  </p>
                </div>
              </div>
            </div>

            <RelatorioTecnicoGraficos
              talhao={`${nomeFazenda} — ${nomeTalhao} (${Number(areaHectares)} ha)`}
              cultura={perfilAtual.nome}
              argilaPct={Number(teorArgila)}
              calagemTonHa={detalhesCorrecao.calagemTonHa}
              gessagemTonHa={detalhesCorrecao.gessoTonHa}
              observacoes={`${observacoesTecnicas} NDVI médio: ${Number(
                ndviMedio
              ).toFixed(2)} (${diagnosticoNdvi.status}). Clima: ${
                clima.temperatura != null
                  ? `${clima.temperatura}°C, umidade ${clima.umidade}%, vento ${clima.ventoKmH} km/h (${janelaAplicacaoStatus.rotulo}).`
                  : "Consulte a aba Clima em Tempo Real antes da aplicação."
              }`}
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