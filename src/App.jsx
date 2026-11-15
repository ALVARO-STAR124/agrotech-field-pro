import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Bug,
  Calculator,
  BarChart3,
  FileText,
  ShieldCheck,
  Search,
  ZoomIn,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Printer,
  Send,
  Compass,
  Droplets,
  TrendingUp,
  Sun,
  Layers,
  Activity
} from 'lucide-react';

// --- DADOS TÉCNICOS E ILUSTRAÇÕES DIAGNÓSTICAS (VETORIAIS HD) ---
const TECHNICAL_GUIDES = [
  {
    id: 'spodoptera',
    category: 'Milho',
    type: 'Praga',
    title: 'Lagarta-do-cartucho (Spodoptera frugiperda)',
    severity: 'Alta',
    economicThreshold: '20% das plantas com folhas raspadas (nota ≥ 3 na escala Davis) até V8.',
    symptoms: 'Folhas raspadas ("janelas" translúcidas), fezes úmidas e serragem no interior do cartucho, podendo cortar plantas jovens rente ao solo.',
    management: [
      'Monitoramento semanal desde a emergência (VE) até o pendoamento (VT).',
      'Uso de híbridos com tecnologia Bt (Vip3Aa20, Cry1F) combinados com refúgio estruturado (10% a 20%).',
      'Controle biológico com Trichogramma pretiosum (ovos) e Baculovirus spodoptera.',
      'Rotação de grupos químicos (Espinosinas, Diamidas, Benzoilureias) para evitar resistência.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-emerald-950 rounded-lg">
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
        <path d="M20,220 Q120,40 380,30 Q260,140 160,230 Z" fill="url(#leafGrad)" />
        <path d="M20,220 Q180,110 380,30" stroke="#22c55e" strokeWidth="3" fill="none" opacity="0.6" />
        {/* Raspagem / Janela foliar */}
        <ellipse cx="180" cy="115" rx="28" ry="14" fill="#fef08a" opacity="0.85" transform="rotate(-25 180 115)" />
        <ellipse cx="235" cy="85" rx="18" ry="9" fill="#fef08a" opacity="0.85" transform="rotate(-25 235 85)" />
        {/* Lagarta com Y invertido na cápsula cefálica */}
        <path d="M135,145 Q165,120 195,130 T245,115" stroke="#78350f" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M135,145 Q165,120 195,130 T245,115" stroke="#a16207" strokeWidth="10" strokeLinecap="round" strokeDasharray="8 6" fill="none" />
        {/* Cabeça e Y invertido */}
        <circle cx="250" cy="113" r="10" fill="#451a03" />
        <path d="M246,110 L250,114 L254,110 M250,114 L250,120" stroke="#fde047" strokeWidth="2" fill="none" />
        <text x="15" y="25" fill="#ecfdf5" fontSize="12" fontWeight="bold">Identificação: "Y" invertido na cabeça + 4 pontos pretos no dorso</text>
      </svg>
    )
  },
  {
    id: 'helicoverpa',
    category: 'Milho',
    type: 'Praga',
    title: 'Lagarta-da-espiga (Helicoverpa zea)',
    severity: 'Média-Alta',
    economicThreshold: 'Presença de ovos ou lagartas recém-eclodidas nos estilo-estigmas (cabelo do milho) em R1.',
    symptoms: 'Corte dos estilo-estigmas (falha na granação), destruição dos grãos leitosos na ponta da espiga e porta de entrada para fungos produtores de micotoxinas (Fusarium).',
    management: [
      'Amostragem direcionada aos estilo-estigmas logo no início do embonecamento (R1).',
      'Liberação de parasitoides de ovos (Trichogramma) no início da emissão dos cabelos.',
      'Aplicação direcionada à espiga antes que a lagarta penetre sob a palha.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-amber-950 rounded-lg">
        {/* Espiga */}
        <ellipse cx="200" cy="130" rx="110" ry="45" fill="#facc15" />
        {/* Grãos */}
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={115 + i * 24} y1="88" x2={115 + i * 24} y2="172" stroke="#ca8a04" strokeWidth="2" />
        ))}
        {/* Palha */}
        <path d="M85,130 Q150,65 290,85 Q180,95 95,130 Z" fill="#15803d" />
        <path d="M85,130 Q150,195 290,175 Q180,165 95,130 Z" fill="#166534" />
        {/* Cabelo do milho */}
        <path d="M305,115 Q345,105 365,125 M308,130 Q350,130 370,140 M305,142 Q340,155 360,160" stroke="#92400e" strokeWidth="3" fill="none" />
        {/* Lagarta na ponta */}
        <path d="M265,125 Q285,112 305,122" stroke="#65a30d" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="308" cy="123" r="7" fill="#d97706" />
        <text x="15" y="25" fill="#fef3c7" fontSize="12" fontWeight="bold">Ataque em R1: Dano apical e porta para podridões de espiga</text>
      </svg>
    )
  },
  {
    id: 'ferrugem_cercospora',
    category: 'Milho',
    type: 'Doença',
    title: 'Ferrugem-polissora e Mancha de Cercospora',
    severity: 'Alta',
    economicThreshold: 'Primeiras pústulas/lesões no terço médio (próximo à folha da espiga) em V10–VT.',
    symptoms: 'Ferrugem-polissora (Puccinia polysora): pústulas circulares alaranjadas na face superior. Cercospora (Cercospora zeae-maydis): lesões retangulares delimitadas pelas nervuras.',
    management: [
      'Escolha de híbridos com resistência genética comprovada para a região.',
      'Rotação de culturas (evitar milho sobre milho) e manejo de restos culturais para Cercospora.',
      'Aplicação preventiva de fungicidas (Estrobilurinas + Triazóis + Carboxamidas) em V8–V10 e VT.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-stone-900 rounded-lg">
        <rect x="30" y="45" width="340" height="150" rx="12" fill="#15803d" />
        {/* Nervuras paralelas */}
        {[65, 90, 115, 140, 165].map((y, idx) => (
          <line key={idx} x1="30" y1={y} x2="370" y2={y} stroke="#22c55e" strokeWidth="2" opacity="0.5" />
        ))}
        {/* Lesões retangulares de Cercospora */}
        <rect x="85" y="67" width="65" height="21" fill="#a8a29e" stroke="#78350f" strokeWidth="2" />
        <rect x="210" y="117" width="80" height="21" fill="#a8a29e" stroke="#78350f" strokeWidth="2" />
        {/* Pústulas alaranjadas de Ferrugem-polissora */}
        {[
          [175, 78], [185, 82], [170, 86], [260, 75], [272, 80],
          [110, 152], [122, 156], [135, 150], [310, 154]
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
        ))}
        <text x="15" y="25" fill="#f5f5f4" fontSize="12" fontWeight="bold">Lesões retangulares (Cercospora) vs. Pústulas laranja (Polissora)</text>
      </svg>
    )
  },
  {
    id: 'cigarrinha_pastagem',
    category: 'Pastagem',
    type: 'Praga',
    title: 'Cigarrinha-das-pastagens (Deois flavopicta / Mahanarva)',
    severity: 'Crítica',
    economicThreshold: '15 a 20 ninfas/m² na base das touceiras no início do período chuvoso.',
    symptoms: 'Ninfas envoltas em espuma branca na base da planta sugando seiva; adultos injetam toxinas causando amarelecimento e seca ("queima" da pastagem).',
    management: [
      'Manejo de altura do pastejo: evitar acúmulo excessivo de palhada/macega no fim da seca.',
      'Diversificação com gramíneas resistentes (ex: Brachiaria brizantha cv. Marandu, Piatã ou Paiaguás).',
      'Controle biológico com fungo entomopatogênico Metarhizium anisopliae nas primeiras chuvas.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-lime-950 rounded-lg">
        {/* Solo */}
        <rect x="0" y="185" width="400" height="55" fill="#451a03" />
        {/* Touceira de capim */}
        <path d="M160,185 Q130,90 95,45 M175,185 Q165,80 155,35 M190,185 Q215,85 245,40 M205,185 Q250,110 295,75" stroke="#65a30d" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Pontas amareladas (queima) */}
        <path d="M95,45 L112,75 M245,40 L230,72 M295,75 L268,95" stroke="#eab308" strokeWidth="7" strokeLinecap="round" />
        {/* Espuma na base */}
        <circle cx="175" cy="175" r="14" fill="#ffffff" opacity="0.9" />
        <circle cx="190" cy="178" r="11" fill="#f8fafc" opacity="0.9" />
        {/* Inseto adulto */}
        <ellipse cx="235" cy="105" rx="14" ry="7" fill="#1c1917" transform="rotate(-20 235 105)" />
        <line x1="227" y1="103" x2="243" y2="99" stroke="#ef4444" strokeWidth="2.5" />
        <line x1="229" y1="109" x2="245" y2="105" stroke="#ef4444" strokeWidth="2.5" />
        <text x="15" y="25" fill="#ecfccb" fontSize="12" fontWeight="bold">Espuma basal (Ninfas) + "Queima" foliar por toxina do adulto</text>
      </svg>
    )
  },
  {
    id: 'herbicidas_pastagem',
    category: 'Pastagem',
    type: 'Manejo',
    title: 'Aplicação Estratégica de Herbicidas em Pastagem',
    severity: 'Operacional',
    economicThreshold: 'Infestação acima de 15–20% da área útil com plantas daninhas competidoras.',
    symptoms: 'Redução da capacidade de suporte (UA/ha) por competição de luz, água e nutrientes por plantas de folha larga (assa-peixe, fedegoso, jurubeba) ou estreita.',
    management: [
      'Folhas largas herbáceas/semilenhosas: aplicação foliar no pleno vigor vegetativo (chuvoso) com 2,4-D + Picloram ou Fluroxipir + Triclopir.',
      'Plantas lenhosas de difícil controle: aplicação localizada no toco logo após o corte (trato localizado).',
      'Atenção rigorosa à deriva: evitar aplicação com vento > 10 km/h, umidade relativa < 55% ou temperatura > 30°C.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-sky-950 rounded-lg">
        <rect x="0" y="170" width="400" height="70" fill="#15803d" />
        {/* Barra pulverizadora */}
        <line x1="60" y1="60" x2="340" y2="60" stroke="#94a3b8" strokeWidth="6" />
        {[100, 170, 240, 310].map((x, idx) => (
          <g key={idx}>
            <rect x={x - 5} y="60" width="10" height="10" fill="#f59e0b" />
            <polygon points={`${x},70 ${x - 35},170 ${x + 35},170`} fill="#38bdf8" opacity="0.28" />
          </g>
        ))}
        <text x="15" y="25" fill="#e0f2fe" fontSize="12" fontWeight="bold">Sobreposição de jato uniforme e controle de deriva em pastagens</text>
      </svg>
    )
  },
  {
    id: 'milho_silagem',
    category: 'Silagem',
    type: 'Manejo',
    title: 'Plantio e Ponto de Colheita de Milho para Silagem',
    severity: 'Estratégico',
    economicThreshold: 'Janela ideal: 32% a 37% de Matéria Seca (MS) na planta inteira (1/2 a 2/3 da linha do leite).',
    symptoms: 'Colheita precoce (<28% MS) gera efluentes (chorume) e perda de amido. Colheita tardia (>40% MS) dificulta a compactação e reduz digestibilidade da fibra.',
    management: [
      'Escolha de híbridos com alta digestibilidade de fibra (FDN) e elevado teor de amido nos grãos.',
      'Tamanho de partícula ideal: 8 a 15 mm com processamento adequado de grãos (cracker) para quebrar 100% dos grãos.',
      'Compactação mínima de 600–650 kg/m³ e vedação imediata com lona dupla face (preta/branca).'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-amber-900 rounded-lg">
        {/* Grão em corte transversal */}
        <path d="M150,45 L250,45 L235,195 L165,195 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
        {/* Amido vítreo/farináceo superior */}
        <path d="M150,45 L250,45 L242,125 L158,125 Z" fill="#f59e0b" />
        {/* Linha do leite em 2/3 */}
        <line x1="154" y1="125" x2="246" y2="125" stroke="#dc2626" strokeWidth="4" strokeDasharray="6 4" />
        <text x="262" y="129" fill="#ffffff" fontSize="12" fontWeight="bold">← 1/2 a 2/3 Linha do Leite</text>
        <text x="262" y="148" fill="#fde047" fontSize="11">(33% a 36% MS Ideal)</text>
        <text x="15" y="25" fill="#fef3c7" fontSize="12" fontWeight="bold">Monitoramento da Linha do Leite no Grão para Colheita</text>
      </svg>
    )
  },
  {
    id: 'engorda_gado',
    category: 'Pecuária',
    type: 'Zootecnia',
    title: 'Engorda de Gado: Pastejo Rotacionado e Suplementação',
    severity: 'Produtividade',
    economicThreshold: 'Meta: GMD > 0,85 kg/dia nas águas e > 0,55 kg/dia na seca (recria/terminação).',
    symptoms: 'Perda de peso na transição águas-seca ("efeito sanfona") e superpastejo que degrada o sistema radicular da forrageira.',
    management: [
      'Respeitar altura de entrada e saída (ex: Brachiaria Marandu: entrada 30–35 cm, saída 15 cm).',
      'Águas: suplementação mineral aditivada ou proteinado de baixo consumo (0,1% PV) para maximizar ganho.',
      'Seca: suplementação proteico-energética (0,3% a 0,5% PV) ou semiconfinamento (TIP - Terminação Intensiva a Pasto).'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-emerald-900 rounded-lg">
        {/* Régua de manejo */}
        <line x1="70" y1="40" x2="70" y2="200" stroke="#ffffff" strokeWidth="3" />
        <line x1="60" y1="70" x2="340" y2="70" stroke="#4ade80" strokeWidth="2" strokeDasharray="5 5" />
        <text x="80" y="64" fill="#4ade80" fontSize="12" fontWeight="bold">Entrada: 30-35 cm (95% Interceptação Luminosa)</text>
        <line x1="60" y1="145" x2="340" y2="145" stroke="#facc15" strokeWidth="2" strokeDasharray="5 5" />
        <text x="80" y="139" fill="#facc15" fontSize="12" fontWeight="bold">Saída: 15 cm (Preservação de gemas e rebrote)</text>
        <rect x="0" y="200" width="400" height="40" fill="#451a03" />
        <text x="15" y="25" fill="#ecfdf5" fontSize="12" fontWeight="bold">Manejo por Altura de Pastejo (Marandu / Mombaça)</text>
      </svg>
    )
  }
];

export default function AgroTechFieldPro() {
  const [activeTab, setActiveTab] = useState('diagnostico');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomGuide, setZoomGuide] = useState(null);

  // --- ESTADOS: SIMULADOR DE DRONES ---
  const [droneArea, setDroneArea] = useState(80);
  const [droneDeclive, setDroneDeclive] = useState('acentuado');

  // --- ESTADOS: CALCULADORA 1 - PULVERIZADOR ---
  const [vazaoBico, setVazaoBico] = useState(0.8); // L/min
  const [velocidadeTrator, setVelocidadeTrator] = useState(6.5); // km/h
  const [espacamentoBicos, setEspacamentoBicos] = useState(0.5); // metros
  const [capacidadeTanque, setCapacidadeTanque] = useState(600); // litros

  // --- ESTADOS: CALCULADORA 2 - CALAGEM ---
  const [vAtual, setVAtual] = useState(38); // %
  const [vDesejado, setVDesejado] = useState(60); // %
  const [ctcSolo, setCtcSolo] = useState(7.5); // cmolc/dm³
  const [prntCalcario, setPrntCalcario] = useState(85); // %

  // --- ESTADOS: CALCULADORA 3 - SEMENTES DE MILHO ---
  const [populacaoDesejada, setPopulacaoDesejada] = useState(65000); // plantas/ha
  const [espacamentoLinhas, setEspacamentoLinhas] = useState(0.5); // metros
  const [germinacaoSemente, setGerminacaoSemente] = useState(92); // %
  const [finalidadeMilho, setFinalidadeMilho] = useState('Grão');

  // --- ESTADOS: LAUDO TÉCNICO ---
  const [produtorNome, setProdutorNome] = useState('Fazenda Santa Clara - Talhão 04');
  const [responsavelTecnico, setResponsavelTecnico] = useState('Eng. Agrônomo Responsável');
  const [observacoesCampo, setObservacoesCampo] = useState(
    'Realizar aplicação de calcário com antecedência mínima de 60 dias antes do plantio. Monitorar incidência inicial de cigarrinha e lagarta-do-cartucho.'
  );

  // --- CÁLCULOS VALIDADOS ---
  const resultPulverizador = useMemo(() => {
    if (velocidadeTrator <= 0 || espacamentoBicos <= 0 || vazaoBico < 0) {
      return { volumeCalda: 0, autonomiaHa: 0, status: 'Inválido' };
    }
    // Q (L/ha) = (q (L/min) * 600) / (V (km/h) * E (m))
    const volumeCalda = (vazaoBico * 600) / (velocidadeTrator * espacamentoBicos);
    const autonomiaHa = volumeCalda > 0 ? capacidadeTanque / volumeCalda : 0;
    let status = 'Ideal para Herbicida Pós-emergente';
    if (volumeCalda < 80) status = 'Baixo Volume (Atenção à deriva e pontas)';
    if (volumeCalda > 220) status = 'Alto Volume (Risco de escorrimento foliar)';
    return {
      volumeCalda: volumeCalda.toFixed(1),
      autonomiaHa: autonomiaHa.toFixed(2),
      status
    };
  }, [vazaoBico, velocidadeTrator, espacamentoBicos, capacidadeTanque]);

  const resultCalagem = useMemo(() => {
    if (prntCalcario <= 0 || ctcSolo < 0) return { doseTha: 0, necessario: false };
    if (vDesejado <= vAtual) return { doseTha: 0, necessario: false };
    // NC (t/ha) = ((V2 - V1) * CTC) / PRNT
    const doseTha = ((vDesejado - vAtual) * ctcSolo) / prntCalcario;
    return {
      doseTha: doseTha.toFixed(2),
      necessario: true
    };
  }, [vAtual, vDesejado, ctcSolo, prntCalcario]);

  const resultSementes = useMemo(() => {
    if (espacamentoLinhas <= 0 || populacaoDesejada <= 0 || germinacaoSemente <= 0) {
      return { plantasMetro: 0, sementesMetro: 0, sacosHa: 0 };
    }
    const metrosLinearesHa = 10000 / espacamentoLinhas;
    const plantasMetro = populacaoDesejada / metrosLinearesHa;
    const sementesMetro = plantasMetro / (germinacaoSemente / 100);
    const totalSementesHa = sementesMetro * metrosLinearesHa;
    const sacosHa = totalSementesHa / 60000; // Saco padrão de 60 mil sementes
    return {
      plantasMetro: plantasMetro.toFixed(2),
      sementesMetro: sementesMetro.toFixed(2),
      sacosHa: sacosHa.toFixed(2)
    };
  }, [populacaoDesejada, espacamentoLinhas, germinacaoSemente]);

  const droneMetrics = useMemo(() => {
    const rendimentoDroneHaHora = droneDeclive === 'acentuado' ? 9.5 : 13.0;
    const horasDrone = droneArea / rendimentoDroneHaHora;
    const aguaEconomizadaLitros = droneArea * (150 - 12); // 150 L/ha trator vs 12 L/ha drone
    return {
      horasDrone: horasDrone.toFixed(1),
      aguaEconomizadaLitros: aguaEconomizadaLitros.toLocaleString('pt-BR')
    };
  }, [droneArea, droneDeclive]);

  const filteredGuides = TECHNICAL_GUIDES.filter((item) => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const navItems = [
    { id: 'diagnostico', label: 'Diagnóstico', fullLabel: 'Diagnóstico & Guias', icon: Bug },
    { id: 'drones', label: 'Drones', fullLabel: 'Drones no Agro', icon: Compass },
    { id: 'calculadoras', label: 'Calculadoras', fullLabel: 'Calculadora do Agro', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', fullLabel: 'Dashboard & Gestão', icon: BarChart3 },
    { id: 'relatorio', label: 'Laudo PDF', fullLabel: 'Relatório Técnico', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-20 md:pb-0 md:flex">
      {/* BARRA LATERAL DESKTOP (ALTO CONTRASTE PARA CAMPO) */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-emerald-950 text-white border-r border-emerald-900 shadow-xl z-20">
        <div className="p-6 border-b border-emerald-800/80 flex items-center gap-3">
          <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-xl shadow">
            <Sprout className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white">AgroTech</h1>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Field Pro • Gestão
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-900/70'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.fullLabel}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-emerald-900/60 border border-emerald-800 text-xs text-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Segurança & LGPD</span>
          </div>
          <p className="leading-relaxed">
            Criptografia TLS/HTTPS ativa. Cálculos processados localmente sem exposição de dados da propriedade.
          </p>
        </div>
      </aside>

      {/* CABEÇALHO MOBILE (ALTO CONTRASTE) */}
      <header className="md:hidden sticky top-0 z-20 bg-emerald-950 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400 text-emerald-950 p-1.5 rounded-lg">
            <Sprout className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base block leading-none">AgroTech Field Pro</span>
            <span className="text-[11px] text-amber-400 font-semibold">Gestão Agronômica</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> LGPD
        </span>
      </header>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="flex-1 md:pl-72">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* ========================================================= */}
          {/* MÓDULO 1: CONTEÚDOS TÉCNICOS E DIAGNÓSTICO VISUAL         */}
          {/* ========================================================= */}
          {activeTab === 'diagnostico' && (
            <section className="space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Guia de Campo & Fitossanidade
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                      Diagnóstico Visual e Manejo Técnico
                    </h2>
                    <p className="text-stone-600 text-sm sm:text-base mt-1">
                      Toque nas ilustrações para ampliar no campo e consultar níveis de dano econômico.
                    </p>
                  </div>

                  {/* Busca */}
                  <div className="relative w-full lg:w-80">
                    <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar praga, doença ou cultura..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 font-medium text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Filtros de Cultura */}
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-stone-200">
                  {['Todos', 'Milho', 'Pastagem', 'Silagem', 'Pecuária'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-900 text-white shadow'
                          : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Técnicos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => (
                  <article
                    key={guide.id}
                    className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-sm flex flex-col"
                  >
                    {/* Área Visual com Botão de Zoom */}
                    <div
                      onClick={() => setZoomGuide(guide)}
                      className="relative h-52 cursor-pointer group overflow-hidden bg-stone-900"
                    >
                      {guide.svgIllustration}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-amber-400 text-emerald-950 font-extrabold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                          <ZoomIn className="w-4 h-4" /> Ampliar Diagnóstico
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Zoom"
                        className="md:hidden absolute bottom-3 right-3 bg-amber-400 text-emerald-950 p-2 rounded-full shadow-lg"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900">
                            {guide.category} • {guide.type}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                            Impacto: {guide.severity}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-stone-900">{guide.title}</h3>

                        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300">
                          <p className="text-xs font-extrabold uppercase text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-700" />
                            Nível de Dano Econômico / Critério
                          </p>
                          <p className="text-sm font-semibold text-stone-800 mt-1">
                            {guide.economicThreshold}
                          </p>
                        </div>

                        <p className="text-sm text-stone-700 mt-3 leading-relaxed">
                          <strong className="text-stone-900">Sintomas e Identificação:</strong> {guide.symptoms}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-200">
                        <p className="text-xs font-extrabold uppercase text-emerald-900 mb-2">
                          Protocolo de Controle Recomendado:
                        </p>
                        <ul className="space-y-1.5">
                          {guide.management.map((step, i) => (
                            <li key={i} className="text-sm text-stone-800 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 2: TECNOLOGIA E INOVAÇÃO - DRONES NO AGRO          */}
          {/* ========================================================= */}
          {activeTab === 'drones' && (
            <section className="space-y-6">
              <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-md">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-emerald-950 px-3 py-1 rounded-full">
                  Agricultura de Precisão 4.0
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-3">
                  Drones Agrícolas (VANTs) em Áreas de Pastagem
                </h2>
                <p className="text-emerald-100 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">
                  A pulverização e o mapeamento aéreo eliminam o amassamento da forrageira, superam barreiras topográficas e reduzem em até 90% o volume de água transportado na fazenda.
                </p>
              </div>

              {/* 3 Pilares de Aplicação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Pulverização em Declives e Grotas</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Acesso seguro em pastagens acidentadas, áreas encharcadas ou com presença de tocos/pedras onde o trator não entra, mantendo altura constante via radar de terreno.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Mapeamento Multiespectral (NDVI)</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Identificação precisa de falhas de estande, compactação, erosão laminar e reboleiras de plantas daninhas, permitindo aplicação localizada (taxa variável) e economia de herbicidas.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center mb-4">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Dispersão de Sementes e Biológicos</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Sobressemeadura de forrageiras e leguminosas (ex: Estilosantes) e liberação uniforme de agentes biológicos para controle de cigarrinhas e lagartas sem compactar o solo.
                  </p>
                </div>
              </div>

              {/* Comparativo Operacional + Simulador */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm overflow-x-auto">
                  <h3 className="font-black text-lg text-stone-900 mb-4">
                    Comparativo Operacional: Drone Pulverizador vs. Tratorizado
                  </h3>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-stone-100 border-b-2 border-stone-300 text-stone-900">
                        <th className="p-3 font-extrabold">Parâmetro Técnico</th>
                        <th className="p-3 font-extrabold text-emerald-900">Drone Agrícola (VANT)</th>
                        <th className="p-3 font-extrabold text-stone-600">Pulverizador Tratorizado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="p-3 font-bold">Volume de Calda</td>
                        <td className="p-3 font-semibold text-emerald-800">8 a 15 L/ha (Ultra Baixo Volume)</td>
                        <td className="p-3 text-stone-700">100 a 200 L/ha</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Amassamento de Pasto</td>
                        <td className="p-3 font-semibold text-emerald-800">Zero (0% de perda mecânica)</td>
                        <td className="p-3 text-stone-700">3% a 7% da área útil</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Operação em Declive &gt; 20%</td>
                        <td className="p-3 font-semibold text-emerald-800">Total segurança operacional</td>
                        <td className="p-3 text-stone-700">Alto risco de tombamento</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Aplicação Localizada (Catação)</td>
                        <td className="p-3 font-semibold text-emerald-800">Automática via mapa de prescrição</td>
                        <td className="p-3 text-stone-700">Manual ou barra total</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Simulador de Rendimento com Drone */}
                <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4">
                  <h3 className="font-black text-lg text-amber-950">Simulador Logístico de VANT</h3>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-800 mb-1">
                      Área de Pastagem (hectares)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={droneArea}
                      onChange={(e) => setDroneArea(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 rounded-xl border-2 border-amber-400 bg-white font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-800 mb-1">
                      Topografia do Terreno
                    </label>
                    <select
                      value={droneDeclive}
                      onChange={(e) => setDroneDeclive(e.target.value)}
                      className="w-full p-2.5 rounded-xl border-2 border-amber-400 bg-white font-bold text-stone-900"
                    >
                      <option value="plano">Plano / Suave Ondulado</option>
                      <option value="acentuado">Declive Acentuado / Grotas</option>
                    </select>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-amber-300 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600 font-semibold">Tempo estimado de voo:</span>
                      <span className="font-black text-emerald-900">{droneMetrics.horasDrone} horas</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600 font-semibold">Água economizada:</span>
                      <span className="font-black text-emerald-900">{droneMetrics.aguaEconomizadaLitros} L</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 3: CALCULADORA DO AGRO (FERRAMENTAS DE CAMPO)      */}
          {/* ========================================================= */}
          {activeTab === 'calculadoras' && (
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                    Calculadora Agronômica de Campo
                  </h2>
                  <p className="text-stone-600 text-sm sm:text-base mt-1">
                    Algoritmos validados com proteção contra entradas inválidas. Os resultados integram automaticamente o Laudo Técnico.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('relatorio')}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all shrink-0"
                >
                  <FileText className="w-5 h-5 text-amber-400" />
                  Exportar no Laudo PDF
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. REGULAGEM DE PULVERIZADOR */}
                <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-emerald-900">
                      <Droplets className="w-6 h-6" />
                      <h3 className="font-black text-lg">1. Pulverizador em Pastagem</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        Vazão por ponta / bico (L/min)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        value={vazaoBico}
                        onChange={(e) => setVazaoBico(Math.max(0.05, Number(e.target.value)))}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          Velocidade (km/h)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={velocidadeTrator}
                          onChange={(e) => setVelocidadeTrator(Math.max(0.5, Number(e.target.value)))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          Espaç. Bicos (m)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          min="0.1"
                          value={espacamentoBicos}
                          onChange={(e) => setEspacamentoBicos(Math.max(0.1, Number(e.target.value)))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        Capacidade do Tanque (Litros)
                      </label>
                      <input
                        type="number"
                        step="50"
                        min="10"
                        value={capacidadeTanque}
                        onChange={(e) => setCapacidadeTanque(Math.max(10, Number(e.target.value)))}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2">
                    <span className="text-xs uppercase font-bold text-amber-400">Volume de Calda</span>
                    <div className="text-3xl font-black">{resultPulverizador.volumeCalda} L/ha</div>
                    <p className="text-xs text-emerald-200">
                      Autonomia do tanque: <strong>{resultPulverizador.autonomiaHa} ha/tanque</strong>
                    </p>
                    <p className="text-xs font-semibold text-amber-300 pt-1 border-t border-emerald-800">
                      {resultPulverizador.status}
                    </p>
                  </div>
                </div>

                {/* 2. CÁLCULO BÁSICO DE CALAGEM */}
                <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-emerald-900">
                      <Layers className="w-6 h-6" />
                      <h3 className="font-black text-lg">2. Necessidade de Calagem</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          V% Atual (Solo)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={vAtual}
                          onChange={(e) => setVAtual(Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          V% Desejado
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={vDesejado}
                          onChange={(e) => setVDesejado(Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        CTC a pH 7,0 (cmolc/dm³)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={ctcSolo}
                        onChange={(e) => setCtcSolo(Math.max(0.1, Number(e.target.value)))}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        PRNT do Calcário (%)
                      </label>
                      <input
                        type="number"
                        min="40"
                        max="120"
                        value={prntCalcario}
                        onChange={(e) => setPrntCalcario(Math.max(1, Number(e.target.value)))}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2">
                    <span className="text-xs uppercase font-bold text-amber-400">Dose Recomendada (NC)</span>
                    <div className="text-3xl font-black">{resultCalagem.doseTha} t/ha</div>
                    <p className="text-xs text-emerald-200">
                      Fórmula: NC = [(V₂ - V₁) × CTC] / PRNT
                    </p>
                    <p className="text-xs font-semibold text-amber-300 pt-1 border-t border-emerald-800">
                      {resultCalagem.necessario
                        ? `Equivalente a ${(Number(resultCalagem.doseTha) * 1000).toFixed(0)} kg/ha de calcário.`
                        : 'Solo já atinge ou supera o V% desejado.'}
                    </p>
                  </div>
                </div>

                {/* 3. DENSIDADE DE SEMENTES DE MILHO */}
                <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-emerald-900">
                      <Sprout className="w-6 h-6" />
                      <h3 className="font-black text-lg">3. Sementes de Milho</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        Finalidade da Lavoura
                      </label>
                      <select
                        value={finalidadeMilho}
                        onChange={(e) => {
                          setFinalidadeMilho(e.target.value);
                          setPopulacaoDesejada(e.target.value === 'Silagem' ? 72000 : 65000);
                        }}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      >
                        <option value="Grão">Produção de Grãos</option>
                        <option value="Silagem">Silagem de Planta Inteira</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                        População Final Desejada (plantas/ha)
                      </label>
                      <input
                        type="number"
                        step="1000"
                        min="20000"
                        value={populacaoDesejada}
                        onChange={(e) => setPopulacaoDesejada(Math.max(1000, Number(e.target.value)))}
                        className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          Espaç. Linhas (m)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          min="0.3"
                          value={espacamentoLinhas}
                          onChange={(e) => setEspacamentoLinhas(Math.max(0.1, Number(e.target.value)))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                          Germinação (%)
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={germinacaoSemente}
                          onChange={(e) => setGerminacaoSemente(Math.min(100, Math.max(10, Number(e.target.value))))}
                          className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-stone-900 focus:border-emerald-700 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2">
                    <span className="text-xs uppercase font-bold text-amber-400">Regulagem da Semeadora</span>
                    <div className="text-3xl font-black">{resultSementes.sementesMetro} sem/m</div>
                    <p className="text-xs text-emerald-200">
                      Estande final esperado: <strong>{resultSementes.plantasMetro} plantas/m</strong>
                    </p>
                    <p className="text-xs font-semibold text-amber-300 pt-1 border-t border-emerald-800">
                      Consumo: {resultSementes.sacosHa} sacos/ha (60 mil sem.)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 4: DASHBOARD EXECUTIVO E GESTÃO                    */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Dashboard Executivo & Indicadores Zootécnicos/Agrícolas
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-1">
                  Monitoramento consolidado de produtividade, eficiência operacional e custos por hectare.
                </p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Produtividade Silagem</span>
                  <div className="text-3xl font-black text-emerald-900 mt-1">48,5 t/ha</div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-2">
                    <TrendingUp className="w-4 h-4" /> +12% acima da média regional
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Lotação Pastagem</span>
                  <div className="text-3xl font-black text-emerald-900 mt-1">3,4 UA/ha</div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-2">
                    <Activity className="w-4 h-4" /> Sistema Rotacionado Adubado
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">GMD Médio Rebanho</span>
                  <div className="text-3xl font-black text-amber-600 mt-1">0,92 kg/dia</div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 mt-2">
                    Recria/Engorda (Período Águas)
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Economia com Drones</span>
                  <div className="text-3xl font-black text-emerald-900 mt-1">-24,8%</div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-2">
                    Redução em herbicidas (Taxa Variável)
                  </span>
                </div>
              </div>

              {/* Gráficos Visuais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico 1: GMD Águas vs Seca */}
                <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <h3 className="font-black text-lg text-stone-900 mb-1">
                    Ganho Médio Diário (GMD) por Estratégia Nutricional
                  </h3>
                  <p className="text-xs text-stone-500 mb-6">Comparativo em kg/animal/dia</p>

                  <div className="space-y-4">
                    {[
                      { label: 'Pasto Extensivo (Sem adubação / Sal mineral)', val: 0.42, pct: 35, color: 'bg-stone-400' },
                      { label: 'Rotacionado + Proteinado Seca (0,3% PV)', val: 0.68, pct: 58, color: 'bg-amber-500' },
                      { label: 'Rotacionado Adubado + Aditivado (Águas)', val: 0.94, pct: 80, color: 'bg-emerald-600' },
                      { label: 'Terminação Intensiva a Pasto (TIP - 1,5% PV)', val: 1.18, pct: 100, color: 'bg-emerald-900' }
                    ].map((row, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                          <span>{row.label}</span>
                          <span>{row.val.toFixed(2)} kg/dia</span>
                        </div>
                        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico 2: Distribuição de Custos Milho Silagem */}
                <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <h3 className="font-black text-lg text-stone-900 mb-1">
                    Composição de Custo Operacional (Milho Silagem)
                  </h3>
                  <p className="text-xs text-stone-500 mb-6">Participação percentual por centro de custo</p>

                  <div className="space-y-4">
                    {[
                      { label: 'Fertilizantes e Corretivos (Calagem/NPK)', pct: 38, color: 'bg-emerald-800' },
                      { label: 'Operações Mecanizadas (Plantio/Colheita/Ensilagem)', pct: 27, color: 'bg-amber-500' },
                      { label: 'Sementes Híbridas de Alta Tecnologia', pct: 21, color: 'bg-emerald-500' },
                      { label: 'Defensivos e Controle Fitossanitário', pct: 14, color: 'bg-sky-600' }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                          <span>{item.label}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 5: RELATÓRIO TÉCNICO / LAUDO PDF                   */}
          {/* ========================================================= */}
          {activeTab === 'relatorio' && (
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">Emissão de Laudo Técnico Agronômico</h2>
                  <p className="text-sm text-stone-600">
                    Revise os dados da propriedade e clique em Imprimir / Salvar PDF para gerar o documento oficial.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir / Salvar PDF
                </button>
              </div>

              {/* Campos editáveis (ocultos na impressão) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border-2 border-stone-200 print:hidden">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                    Propriedade / Cliente / Talhão
                  </label>
                  <input
                    type="text"
                    value={produtorNome}
                    onChange={(e) => setProdutorNome(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                    Responsável Técnico (CREA)
                  </label>
                  <input
                    type="text"
                    value={responsavelTecnico}
                    onChange={(e) => setResponsavelTecnico(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-stone-300 font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1">
                    Recomendações e Observações de Campo
                  </label>
                  <textarea
                    rows={2}
                    value={observacoesCampo}
                    onChange={(e) => setObservacoesCampo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-stone-300 font-medium"
                  />
                </div>
              </div>

              {/* FOLHA A4 FORMATADA DO LAUDO */}
              <div className="bg-white p-8 sm:p-10 rounded-2xl border-2 border-stone-300 shadow-md max-w-4xl mx-auto space-y-6">
                <div className="border-b-2 border-emerald-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950">LAUDO TÉCNICO AGRONÔMICO</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      AgroTech Field Pro • Recomendação Operacional de Campo
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs text-stone-600">
                    <p className="font-bold">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                    <p>Conformidade LGPD • Uso Exclusivo Técnico</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm">
                  <div>
                    <span className="text-xs font-extrabold uppercase text-stone-500 block">Propriedade / Área</span>
                    <span className="font-black text-stone-900">{produtorNome}</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase text-stone-500 block">Responsável Técnico</span>
                    <span className="font-black text-stone-900">{responsavelTecnico}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-base uppercase text-emerald-900 border-b border-stone-200 pb-1">
                    1. Parâmetros Calculados e Prescrições
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-stone-300">
                      <span className="text-xs font-extrabold uppercase text-stone-500">Calagem (Saturação Bases)</span>
                      <p className="text-2xl font-black text-emerald-950 mt-1">{resultCalagem.doseTha} t/ha</p>
                      <p className="text-xs text-stone-600 mt-1">
                        V₁: {vAtual}% → V₂: {vDesejado}% | CTC: {ctcSolo} | PRNT: {prntCalcario}%
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-stone-300">
                      <span className="text-xs font-extrabold uppercase text-stone-500">Pulverização Pastagem</span>
                      <p className="text-2xl font-black text-emerald-950 mt-1">{resultPulverizador.volumeCalda} L/ha</p>
                      <p className="text-xs text-stone-600 mt-1">
                        Vazão: {vazaoBico} L/min | Vel.: {velocidadeTrator} km/h | Autonomia: {resultPulverizador.autonomiaHa} ha
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-stone-300">
                      <span className="text-xs font-extrabold uppercase text-stone-500">Plantio Milho ({finalidadeMilho})</span>
                      <p className="text-2xl font-black text-emerald-950 mt-1">{resultSementes.sementesMetro} sem/m</p>
                      <p className="text-xs text-stone-600 mt-1">
                        População: {populacaoDesejada.toLocaleString('pt-BR')} pl/ha | Espaç.: {espacamentoLinhas} m
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-base uppercase text-emerald-900 border-b border-stone-200 pb-1">
                    2. Orientações Técnicas de Manejo
                  </h4>
                  <p className="text-sm text-stone-800 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
                    {observacoesCampo}
                  </p>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-8 text-xs text-stone-600">
                  <div className="w-64 border-t border-stone-400 pt-2 text-center">
                    <p className="font-bold text-stone-900">{responsavelTecnico}</p>
                    <p>Assinatura do Engenheiro Agrônomo</p>
                  </div>
                  <div className="w-64 border-t border-stone-400 pt-2 text-center">
                    <p className="font-bold text-stone-900">{produtorNome}</p>
                    <p>Ciente do Produtor / Administrador</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* NAVEGAÇÃO INFERIOR FIXA MOBILE (OTIMIZADA PARA USO COM UMA MÃO NO CAMPO) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-emerald-950 border-t border-emerald-800 flex justify-around py-2 px-1 z-30 shadow-2xl print:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-amber-400 bg-emerald-900/90' : 'text-emerald-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MODAL DE ZOOM PARA DIAGNÓSTICO VISUAL NO CAMPO */}
      {zoomGuide && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomGuide(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-amber-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-emerald-950 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-amber-400">
                  {zoomGuide.category} • Zoom Diagnóstico
                </span>
                <h3 className="font-black text-base sm:text-lg">{zoomGuide.title}</h3>
              </div>
              <button
                onClick={() => setZoomGuide(null)}
                className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-950 h-72 sm:h-80">{zoomGuide.svgIllustration}</div>
            <div className="p-5 space-y-2 bg-white">
              <p className="text-sm text-stone-800">
                <strong>Sintoma-chave:</strong> {zoomGuide.symptoms}
              </p>
              <p className="text-sm font-bold text-emerald-900">
                Critério de ação: {zoomGuide.economicThreshold}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}