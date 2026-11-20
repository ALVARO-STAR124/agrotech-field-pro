import React from "react";

function nivelParaScore(nivel) {
  const mapa = {
    baixo: 30,
    médio: 62,
    medio: 62,
    adequado: 85,
    alto: 95,
  };
  return mapa[String(nivel || "").toLowerCase()] ?? 50;
}

function corPorScore(score) {
  if (score < 45) return "#dc2626";
  if (score < 75) return "#d97706";
  return "#15803d";
}

export function GraficoNutrientesSVG({ dadosNutrientes }) {
  const largura = 560;
  const altura = 220;
  const margemEsquerda = 46;
  const margemBase = 42;
  const alturaGrafico = altura - margemBase - 24;
  const larguraBarra = 64;
  const espaco = (largura - margemEsquerda - 24) / dadosNutrientes.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 print:break-inside-avoid">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-slate-900">
          Disponibilidade de Nutrientes (Ajustada pela Argila)
        </h4>
        <span className="text-xs text-slate-500">Escala visual: 0–100</span>
      </div>

      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Gráfico de disponibilidade de fósforo, potássio, cálcio e magnésio"
      >
        {[25, 50, 75, 100].map((tick) => {
          const y = 24 + alturaGrafico - (tick / 100) * alturaGrafico;
          return (
            <g key={tick}>
              <line
                x1={margemEsquerda}
                y1={y}
                x2={largura - 12}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={margemEsquerda - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {dadosNutrientes.map((item, idx) => {
          const score = nivelParaScore(item.nivel);
          const hBarra = (score / 100) * alturaGrafico;
          const x = margemEsquerda + idx * espaco + (espaco - larguraBarra) / 2;
          const y = 24 + alturaGrafico - hBarra;
          const fill = corPorScore(score);

          return (
            <g key={item.sigla}>
              <rect
                x={x}
                y={y}
                width={larguraBarra}
                height={hBarra}
                rx="6"
                fill={fill}
              />
              <text
                x={x + larguraBarra / 2}
                y={Math.max(y - 6, 16)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#0f172a"
              >
                {item.nivel}
              </text>
              <text
                x={x + larguraBarra / 2}
                y={altura - 18}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#1e293b"
              >
                {item.sigla}
              </text>
              {item.valor && (
                <text
                  x={x + larguraBarra / 2}
                  y={altura - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {item.valor}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function GraficoCalagemSVG({
  caAtual = 1.8,
  mgAtual = 0.7,
  alAtual = 0.4,
  ncTonHa = 0.94,
}) {
  const somaCaMg = Number((caAtual + mgAtual).toFixed(2));
  const maxRef = Math.max(somaCaMg, alAtual, ncTonHa, 3.0);

  const itens = [
    {
      rotulo: "Ca + Mg Atual",
      unidade: "cmolc/dm³",
      valor: somaCaMg,
      cor: "#0f766e",
    },
    {
      rotulo: "Al³⁺ Troca",
      unidade: "cmolc/dm³",
      valor: alAtual,
      cor: "#b91c1c",
    },
    {
      rotulo: "Calagem Calc.",
      unidade: "t/ha",
      valor: ncTonHa,
      cor: "#1d4ed8",
    },
  ];

  const largura = 560;
  const altura = 220;
  const margemEsquerda = 46;
  const margemBase = 42;
  const alturaGrafico = altura - margemBase - 24;
  const larguraBarra = 78;
  const espaco = (largura - margemEsquerda - 24) / itens.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 print:break-inside-avoid">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-slate-900">
          Balanço de Bases, Alumínio e Necessidade de Calagem
        </h4>
        <span className="text-xs text-slate-500">Referência técnica</span>
      </div>

      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Gráfico comparativo de cálcio mais magnésio, alumínio e calagem"
      >
        {[0, 0.5, 1].map((frac) => {
          const val = (maxRef * frac).toFixed(1);
          const y = 24 + alturaGrafico - frac * alturaGrafico;
          return (
            <g key={frac}>
              <line
                x1={margemEsquerda}
                y1={y}
                x2={largura - 12}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={margemEsquerda - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {val}
              </text>
            </g>
          );
        })}

        {itens.map((item, idx) => {
          const ratio = Math.min(Math.max(item.valor / maxRef, 0), 1);
          const hBarra = ratio * alturaGrafico;
          const x = margemEsquerda + idx * espaco + (espaco - larguraBarra) / 2;
          const y = 24 + alturaGrafico - hBarra;

          return (
            <g key={item.rotulo}>
              <rect
                x={x}
                y={y}
                width={larguraBarra}
                height={hBarra}
                rx="6"
                fill={item.cor}
              />
              <text
                x={x + larguraBarra / 2}
                y={Math.max(y - 6, 16)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#0f172a"
              >
                {item.valor} {item.unidade.includes("t/ha") ? "t/ha" : ""}
              </text>
              <text
                x={x + larguraBarra / 2}
                y={altura - 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1e293b"
              >
                {item.rotulo}
              </text>
              <text
                x={x + larguraBarra / 2}
                y={altura - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {item.unidade}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function RelatorioTecnicoGraficos({
  talhao = "Talhão 01",
  cultura = "Milho",
  argilaPct = 35,
  analise = {
    p: { valor: "14 mg/dm³", nivel: "Médio" },
    k: { valor: "85 mg/dm³", nivel: "Médio" },
    ca: { valor: "1.8 cmolc/dm³", num: 1.8, nivel: "Médio" },
    mg: { valor: "0.7 cmolc/dm³", num: 0.7, nivel: "Médio" },
    al: { valor: "0.4 cmolc/dm³", num: 0.4 },
  },
  calagemTonHa = 0.94,
  observacoes = "Realizar aplicação conforme recomendação técnica, considerando o teor de argila e as condições do talhão.",
}) {
  const dataEmissao = new Date().toLocaleDateString("pt-PT");

  const dadosNutrientes = [
    { sigla: "P", nivel: analise.p.nivel, valor: analise.p.valor },
    { sigla: "K", nivel: analise.k.nivel, valor: analise.k.valor },
    { sigla: "Ca", nivel: analise.ca.nivel, valor: analise.ca.valor },
    { sigla: "Mg", nivel: analise.mg.nivel, valor: analise.mg.valor },
  ];

  return (
    <section className="space-y-5 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-xl p-5 print:break-inside-avoid">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              AgroTech Field Pro • Relatório Técnico
            </p>
            <h3 className="text-lg font-bold text-slate-900">
              Análise de Solo, Correção e Diagnóstico Visual
            </h3>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>
              <strong>Data de emissão:</strong> {dataEmissao}
            </div>
            <div>
              <strong>Área/Talhão:</strong> {talhao} • <strong>Cultura:</strong> {cultura}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Argila</div>
            <div className="font-bold text-slate-900">{argilaPct}%</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Fósforo (P)</div>
            <div className="font-bold text-slate-900">{analise.p.valor}</div>
            <div className="text-xs text-slate-600">{analise.p.nivel}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Potássio (K)</div>
            <div className="font-bold text-slate-900">{analise.k.valor}</div>
            <div className="text-xs text-slate-600">{analise.k.nivel}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Cálcio (Ca)</div>
            <div className="font-bold text-slate-900">{analise.ca.valor}</div>
            <div className="text-xs text-slate-600">{analise.ca.nivel}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Magnésio (Mg)</div>
            <div className="font-bold text-slate-900">{analise.mg.valor}</div>
            <div className="text-xs text-slate-600">{analise.mg.nivel}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs text-slate-500">Alumínio (Al³⁺)</div>
            <div className="font-bold text-slate-900">{analise.al.valor}</div>
            <div className="text-xs text-slate-600">Calagem: {calagemTonHa} t/ha</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoNutrientesSVG dadosNutrientes={dadosNutrientes} />
        <GraficoCalagemSVG
          caAtual={analise.ca.num}
          mgAtual={analise.mg.num}
          alAtual={analise.al.num}
          ncTonHa={calagemTonHa}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:break-inside-avoid">
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Parecer Técnico e Recomendações
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">{observacoes}</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="shrink-0 px-4 py-2 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 print:hidden"
        >
          Imprimir / Guardar PDF
        </button>
      </div>
    </section>
  );
}