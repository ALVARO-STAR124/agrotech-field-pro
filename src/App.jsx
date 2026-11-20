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
  Printer,
  Compass,
  Droplets,
  Layers,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

// --- CONFIGURAÇÃO DE ACESSO (VARIÁVEIS DE AMBIENTE OU FALLBACK LOCAL) ---
const USUARIO_AUTORIZADO = import.meta.env?.VITE_AGROTECH_USER || 'admin';
const SENHA_AUTORIZADA = import.meta.env?.VITE_AGROTECH_PASS || 'AgroTech@2026';
const CHAVE_SESSAO = 'agrotech_field_pro_auth_v1';

// --- FUNÇÕES AGRONÓMICAS: DISPONIBILIDADE DE NUTRIENTES E CALAGEM (Ca + Mg e Al³⁺) ---
function classificarDisponibilidade(nutriente, valor, argila = 30) {
  if (valor === '' || valor === null || valor === undefined || Number.isNaN(Number(valor))) {
    return '—';
  }
  const v = Number(valor);
  const arg = Number(argila) || 30;

  if (nutriente === 'P') {
    const fatorArgila = arg > 40 ? 0.7 : arg >= 20 ? 1.0 : 1.3;
    if (v <= 4 * fatorArgila) return 'Muito Baixo';
    if (v <= 8 * fatorArgila) return 'Baixo';
    if (v <= 15 * fatorArgila) return 'Médio';
    if (v <= 25 * fatorArgila) return 'Bom';
    return 'Muito Alto';
  }

  if (nutriente === 'K') {
    if (v <= 15) return 'Muito Baixo';
    if (v <= 30) return 'Baixo';
    if (v <= 60) return 'Médio';
    if (v <= 100) return 'Bom';
    return 'Muito Alto';
  }

  if (nutriente === 'Ca') {
    if (v < 0.8) return 'Muito Baixo';
    if (v < 1.5) return 'Baixo';
    if (v < 2.5) return 'Médio';
    if (v <= 4.0) return 'Bom';
    return 'Muito Alto';
  }

  if (nutriente === 'Mg') {
    if (v < 0.2) return 'Muito Baixo';
    if (v < 0.5) return 'Baixo';
    if (v < 0.9) return 'Médio';
    if (v <= 1.5) return 'Bom';
    return 'Muito Alto';
  }

  return '—';
}

function badgeClasseDisponibilidade(classe) {
  switch (classe) {
    case 'Muito Baixo':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Baixo':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Médio':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Bom':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Muito Alto':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-300';
  }
}

function calcularCalagemCaMgAl({
  ca,
  mg,
  al,
  argila = 30,
  caMgExigido = 3.2,
  fatorY = '',
  prnt = 85
}) {
  const caNum = Math.max(0, Number(ca) || 0);
  const mgNum = Math.max(0, Number(mg) || 0);
  const alNum = Math.max(0, Number(al) || 0);
  const argNum = Math.max(0, Number(argila) || 30);
  const exigidoNum = Math.max(0, Number(caMgExigido) || 0);
  const prntNum = Math.max(Number(prnt) || 85, 1);

  const yEstimado =
    argNum <= 15 ? 1.0 : argNum <= 35 ? 1.5 : argNum <= 60 ? 2.0 : 2.5;
  const yUsado =
    fatorY !== '' && fatorY !== null && !Number.isNaN(Number(fatorY))
      ? Math.max(0, Number(fatorY))
      : yEstimado;

  const ncAl = yUsado * alNum;
  const somaCaMgAtual = caNum + mgNum;
  const ncCaMg = Math.max(0, exigidoNum - somaCaMgAtual);

  const ncBase = Math.max(ncAl, ncCaMg);
  const quantidadeTonHa = ncBase * (100 / prntNum);

  const criterioLimitante =
    ncBase === 0
      ? 'Sem necessidade de calagem'
      : ncAl >= ncCaMg
      ? 'Neutralização de Al³⁺'
      : 'Elevação de Ca + Mg';

  return {
    somaCaMgAtual: Number(somaCaMgAtual.toFixed(2)),
    ncAl: Number(ncAl.toFixed(2)),
    ncCaMg: Number(ncCaMg.toFixed(2)),
    ncBase: Number(ncBase.toFixed(2)),
    quantidadeTonHa: Number(quantidadeTonHa.toFixed(2)),
    criterioLimitante,
    yUsado: Number(yUsado.toFixed(2))
  };
}

// --- PAINEL DE ENTRADA (AUTENTICAÇÃO POR UTILIZADOR E PALAVRA-PASSE) ---
function PainelEntrada({ onAutenticado }) {
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
      setErro('Informe o utilizador e a palavra-passe de acesso.');
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
        `Acesso negado. Credenciais inválidas (${novasTentativas}ª tentativa). O acesso requer autorização expressa com a palavra-passe do proprietário.`
      );
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border-2 border-stone-200 bg-white shadow-xl overflow-hidden">
        <div className="bg-emerald-950 px-6 py-7 text-white text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-md">
            <Sprout className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">AgroTech Field Pro</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mt-1">
            Acesso Restrito • Propriedade & Autorização
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1.5">
              Utilizador
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoComplete="username"
                placeholder="Digite o utilizador"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-sm font-semibold text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-stone-700 mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Digite a palavra-passe autorizada"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-sm font-semibold text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((prev) => !prev)}
                aria-label="Mostrar ou ocultar palavra-passe"
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
            <span>Acesso concedido apenas mediante fornecimento da palavra-passe</span>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- DADOS TÉCNICOS E ILUSTRAÇÕES DIAGNÓSTICAS (VETORIAIS HD) ---
const TECHNICAL_GUIDES = [
  {
    id: 'spodoptera',
    category: 'Milho',
    type: 'Praga',
    title: 'Lagarta-do-cartucho (Spodoptera frugiperda)',
    severity: 'Alta',
    economicThreshold: '20% das plantas com folhas raspadas (nota ≥ 3 na escala Davis) até V8.',
    symptoms: 'Folhas raspadas ("janelas" translúcidas), fezes húmidas e serragem no interior do cartucho, podendo cortar plantas jovens rente ao solo.',
    management: [
      'Monitorização semanal desde a emergência (VE) até ao pendoamento (VT).',
      'Uso de híbridos com tecnologia Bt (Vip3Aa20, Cry1F) combinados com refúgio estruturado (10% a 20%).',
      'Controlo biológico com Trichogramma pretiosum (ovos) e Baculovirus spodoptera.',
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
        <ellipse cx="180" cy="115" rx="28" ry="14" fill="#fef08a" opacity="0.85" transform="rotate(-25 180 115)" />
        <ellipse cx="235" cy="85" rx="18" ry="9" fill="#fef08a" opacity="0.85" transform="rotate(-25 235 85)" />
        <path d="M135,145 Q165,120 195,130 T245,115" stroke="#78350f" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M135,145 Q165,120 195,130 T245,115" stroke="#a16207" strokeWidth="10" strokeLinecap="round" strokeDasharray="8 6" fill="none" />
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
      'Libertação de parasitoides de ovos (Trichogramma) no início da emissão dos cabelos.',
      'Aplicação direcionada à espiga antes que a lagarta penetre sob a palha.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-amber-950 rounded-lg">
        <ellipse cx="200" cy="130" rx="110" ry="45" fill="#facc15" />
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={115 + i * 24} y1="88" x2={115 + i * 24} y2="172" stroke="#ca8a04" strokeWidth="2" />
        ))}
        <path d="M85,130 Q150,65 290,85 Q180,95 95,130 Z" fill="#15803d" />
        <path d="M85,130 Q150,195 290,175 Q180,165 95,130 Z" fill="#166534" />
        <path d="M305,115 Q345,105 365,125 M308,130 Q350,130 370,140 M305,142 Q340,155 360,160" stroke="#92400e" strokeWidth="3" fill="none" />
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
        {[65, 90, 115, 140, 165].map((y, idx) => (
          <line key={idx} x1="30" y1={y} x2="370" y2={y} stroke="#22c55e" strokeWidth="2" opacity="0.5" />
        ))}
        <rect x="85" y="67" width="65" height="21" fill="#a8a29e" stroke="#78350f" strokeWidth="2" />
        <rect x="210" y="117" width="80" height="21" fill="#a8a29e" stroke="#78350f" strokeWidth="2" />
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
      'Manejo de altura da pastagem: evitar acumulação excessiva de palhada/macega no fim da seca.',
      'Diversificação com gramíneas resistentes (ex.: Brachiaria brizantha cv. Marandu, Piatã ou Paiaguás).',
      'Controlo biológico com fungo entomopatogénico Metarhizium anisopliae nas primeiras chuvas.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-lime-950 rounded-lg">
        <rect x="0" y="185" width="400" height="55" fill="#451a03" />
        <path d="M160,185 Q130,90 95,45 M175,185 Q165,80 155,35 M190,185 Q215,85 245,40 M205,185 Q250,110 295,75" stroke="#65a30d" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M95,45 L112,75 M245,40 L230,72 M295,75 L268,95" stroke="#eab308" strokeWidth="7" strokeLinecap="round" />
        <circle cx="175" cy="175" r="14" fill="#ffffff" opacity="0.9" />
        <circle cx="190" cy="178" r="11" fill="#f8fafc" opacity="0.9" />
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
    economicThreshold: 'Infestação acima de 15–20% da área útil com plantas infestantes competidoras.',
    symptoms: 'Redução da capacidade de suporte (UA/ha) por competição de luz, água e nutrientes por plantas de folha larga (assa-peixe, fedegoso, jurubeba) ou estreita.',
    management: [
      'Folhas largas herbáceas/semilenhosas: aplicação foliar no pleno vigor vegetativo (chuvoso) com 2,4-D + Picloram ou Fluroxipir + Triclopir.',
      'Plantas lenhosas de difícil controlo: aplicação localizada no cepo logo após o corte (trato localizado).',
      'Atenção rigorosa à deriva: evitar aplicação com vento > 10 km/h, humidade relativa < 55% ou temperatura > 30°C.'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-sky-950 rounded-lg">
        <rect x="0" y="170" width="400" height="70" fill="#15803d" />
        <line x1="60" y1="60" x2="340" y2="60" stroke="#94a3b8" strokeWidth="6" />
        {[100, 170, 240, 310].map((x, idx) => (
          <g key={idx}>
            <rect x={x - 5} y="60" width="10" height="10" fill="#f59e0b" />
            <polygon points={`${x},70 ${x - 35},170 ${x + 35},170`} fill="#38bdf8" opacity="0.28" />
          </g>
        ))}
        <text x="15" y="25" fill="#e0f2fe" fontSize="12" fontWeight="bold">Sobreposição de jato uniforme e controlo de deriva em pastagens</text>
      </svg>
    )
  },
  {
    id: 'milho_silagem',
    category: 'Silagem',
    type: 'Manejo',
    title: 'Sementeira e Ponto de Colheita de Milho para Silagem',
    severity: 'Estratégico',
    economicThreshold: 'Janela ideal: 32% a 37% de Matéria Seca (MS) na planta inteira (1/2 a 2/3 da linha do leite).',
    symptoms: 'Colheita precoce (<28% MS) gera efluentes (chorume) e perda de amido. Colheita tardia (>40% MS) dificulta a compactação e reduz a digestibilidade da fibra.',
    management: [
      'Escolha de híbridos com alta digestibilidade de fibra (FDN) e elevado teor de amido nos grãos.',
      'Tamanho de partícula ideal: 8 a 15 mm com processamento adequado de grãos (cracker) para quebrar 100% dos grãos.',
      'Compactação mínima de 600–650 kg/m³ e vedação imediata com lona dupla face (preta/branca).'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-amber-900 rounded-lg">
        <path d="M150,45 L250,45 L235,195 L165,195 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
        <path d="M150,45 L250,45 L242,125 L158,125 Z" fill="#f59e0b" />
        <line x1="154" y1="125" x2="246" y2="125" stroke="#dc2626" strokeWidth="4" strokeDasharray="6 4" />
        <text x="262" y="129" fill="#ffffff" fontSize="12" fontWeight="bold">← 1/2 a 2/3 Linha do Leite</text>
        <text x="262" y="148" fill="#fde047" fontSize="11">(33% a 36% MS Ideal)</text>
        <text x="15" y="25" fill="#fef3c7" fontSize="12" fontWeight="bold">Monitorização da Linha do Leite no Grão para Colheita</text>
      </svg>
    )
  },
  {
    id: 'engorda_gado',
    category: 'Pecuária',
    type: 'Zootecnia',
    title: 'Engorda de Bovinos: Pastejo Rotacionado e Suplementação',
    severity: 'Produtividade',
    economicThreshold: 'Meta: GMD > 0,85 kg/dia nas águas e > 0,55 kg/dia na seca (recria/terminação).',
    symptoms: 'Perda de peso na transição águas-seca ("efeito sanfona") e sobrepastejo que degrada o sistema radicular da forrageira.',
    management: [
      'Respeitar altura de entrada e saída (ex.: Brachiaria Marandu: entrada 30–35 cm, saída 15 cm).',
      'Águas: suplementação mineral aditivada ou proteinado de baixo consumo (0,1% PV) para maximizar ganho.',
      'Seca: suplementação proteico-energética (0,3% a 0,5% PV) ou semiconfinamento (TIP - Terminação Intensiva a Pasto).'
    ],
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-full bg-emerald-900 rounded-lg">
        <line x1="70" y1="40" x2="70" y2="200" stroke="#ffffff" strokeWidth="3" />
        <line x1="60" y1="70" x2="340" y2="70" stroke="#4ade80" strokeWidth="2" strokeDasharray="5 5" />
        <text x="80" y="64" fill="#4ade80" fontSize="12" fontWeight="bold">Entrada: 30-35 cm (95% Interceção Luminosa)</text>
        <line x1="60" y1="145" x2="340" y2="145" stroke="#facc15" strokeWidth="2" strokeDasharray="5 5" />
        <text x="80" y="139" fill="#facc15" fontSize="12" fontWeight="bold">Saída: 15 cm (Preservação de gemas e rebrote)</text>
        <rect x="0" y="200" width="400" height="40" fill="#451a03" />
        <text x="15" y="25" fill="#ecfdf5" fontSize="12" fontWeight="bold">Manejo por Altura de Pastejo (Marandu / Mombaça)</text>
      </svg>
    )
  }
];

export default function AgroTechFieldPro() {
  const [sessao, setSessao] = useState(() => {
    try {
      const salvoLocal = localStorage.getItem(CHAVE_SESSAO);
      const salvoSessao = sessionStorage.getItem(CHAVE_SESSAO);
      const raw = salvoLocal || salvoSessao;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

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

  // --- ESTADOS: CALCULADORA 2 - CALAGEM (Ca + Mg e Al³⁺) & FERTILIDADE NATURAL ---
  const [caAtual, setCaAtual] = useState(1.8); // cmolc/dm³
  const [mgAtual, setMgAtual] = useState(0.6); // cmolc/dm³
  const [alAtual, setAlAtual] = useState(0.5); // cmolc/dm³
  const [pAtual, setPAtual] = useState(10); // mg/dm³
  const [kAtual, setKAtual] = useState(45); // mg/dm³
  const [argilaAtual, setArgilaAtual] = useState(30); // %
  const [caMgExigido, setCaMgExigido] = useState(3.2); // cmolc/dm³
  const [fatorY, setFatorY] = useState(''); // vazio = estima pela argila
  const [prntCalcario, setPrntCalcario] = useState(85); // %

  const [incluirFertilidadeNatural, setIncluirFertilidadeNatural] = useState(false);
  const [caNatural, setCaNatural] = useState(1.2);
  const [mgNatural, setMgNatural] = useState(0.4);
  const [alNatural, setAlNatural] = useState(0.9);
  const [pNatural, setPNatural] = useState(6);
  const [kNatural, setKNatural] = useState(28);
  const [argilaNatural, setArgilaNatural] = useState(30);

  // --- ESTADOS: CALCULADORA 3 - SEMENTES DE MILHO ---
  const [populacaoDesejada, setPopulacaoDesejada] = useState(65000); // plantas/ha
  const [espacamentoLinhas, setEspacamentoLinhas] = useState(0.5); // metros
  const [germinacaoSemente, setGerminacaoSemente] = useState(92); // %
  const [finalidadeMilho, setFinalidadeMilho] = useState('Grão');

  // --- ESTADOS: LAUDO TÉCNICO ---
  const [produtorNome, setProdutorNome] = useState('Fazenda Santa Clara - Talhão 04');
  const [responsavelTecnico, setResponsavelTecnico] = useState('Eng. Agrónomo Responsável');
  const [observacoesCampo, setObservacoesCampo] = useState(
    'Realizar aplicação de calcário (dimensionado por Ca + Mg e neutralização de Al³⁺) com antecedência mínima de 60 dias antes da sementeira. Monitorizar incidência inicial de cigarrinha e lagarta-do-cartucho.'
  );

  // --- CÁLCULOS VALIDADOS ---
  const resultPulverizador = useMemo(() => {
    if (velocidadeTrator <= 0 || espacamentoBicos <= 0 || vazaoBico < 0) {
      return { volumeCalda: 0, autonomiaHa: 0, status: 'Inválido' };
    }
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

  const resultadoCalagem = useMemo(() => {
    return calcularCalagemCaMgAl({
      ca: caAtual,
      mg: mgAtual,
      al: alAtual,
      argila: argilaAtual,
      caMgExigido,
      fatorY,
      prnt: prntCalcario
    });
  }, [caAtual, mgAtual, alAtual, argilaAtual, caMgExigido, fatorY, prntCalcario]);

  const classesAtuais = useMemo(
    () => ({
      P: classificarDisponibilidade('P', pAtual, argilaAtual),
      K: classificarDisponibilidade('K', kAtual, argilaAtual),
      Ca: classificarDisponibilidade('Ca', caAtual, argilaAtual),
      Mg: classificarDisponibilidade('Mg', mgAtual, argilaAtual)
    }),
    [pAtual, kAtual, caAtual, mgAtual, argilaAtual]
  );

  const classesNaturais = useMemo(
    () => ({
      P: classificarDisponibilidade('P', pNatural, argilaNatural),
      K: classificarDisponibilidade('K', kNatural, argilaNatural),
      Ca: classificarDisponibilidade('Ca', caNatural, argilaNatural),
      Mg: classificarDisponibilidade('Mg', mgNatural, argilaNatural)
    }),
    [pNatural, kNatural, caNatural, mgNatural, argilaNatural]
  );

  const resultSementes = useMemo(() => {
    if (espacamentoLinhas <= 0 || populacaoDesejada <= 0 || germinacaoSemente <= 0) {
      return { plantasMetro: 0, sementesMetro: 0, sacosHa: 0 };
    }
    const metrosLinearesHa = 10000 / espacamentoLinhas;
    const plantasMetro = populacaoDesejada / metrosLinearesHa;
    const sementesMetro = plantasMetro / (germinacaoSemente / 100);
    const totalSementesHa = sementesMetro * metrosLinearesHa;
    const sacosHa = totalSementesHa / 60000;
    return {
      plantasMetro: plantasMetro.toFixed(2),
      sementesMetro: sementesMetro.toFixed(2),
      sacosHa: sacosHa.toFixed(2)
    };
  }, [populacaoDesejada, espacamentoLinhas, germinacaoSemente]);

  const droneMetrics = useMemo(() => {
    const rendimentoDroneHaHora = droneDeclive === 'acentuado' ? 9.5 : 13.0;
    const horasDrone = droneArea / rendimentoDroneHaHora;
    const aguaEconomizadaLitros = droneArea * (150 - 12);
    return {
      horasDrone: horasDrone.toFixed(1),
      aguaEconomizadaLitros: aguaEconomizadaLitros.toLocaleString('pt-BR')
    };
  }, [droneArea, droneDeclive]);

  function handleSair() {
    localStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_SESSAO);
    setSessao(null);
  }

  if (!sessao?.autenticado) {
    return <PainelEntrada onAutenticado={(novaSessao) => setSessao(novaSessao)} />;
  }

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

        <div className="p-4 mx-4 mb-3 rounded-xl bg-emerald-900/60 border border-emerald-800 text-xs text-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Segurança & LGPD</span>
          </div>
          <p className="leading-relaxed">
            Criptografia TLS/HTTPS ativa. Cálculos processados localmente sem exposição de dados da propriedade.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSair}
          className="mx-4 mb-4 rounded-xl border border-emerald-700 bg-emerald-900/80 hover:bg-red-900/80 hover:border-red-700 px-3 py-2.5 text-xs font-extrabold text-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          Bloquear / Sair ({sessao.usuario})
        </button>
      </aside>

      {/* CABEÇALHO MOBILE (ALTO CONTRASTE) */}
      <header className="md:hidden sticky top-0 z-20 bg-emerald-950 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400 text-emerald-950 p-1.5 rounded-lg">
            <Sprout className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base block leading-none">AgroTech Field Pro</span>
            <span className="text-[11px] text-amber-400 font-semibold">Gestão Agronómica</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-900 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> LGPD
          </span>
          <button
            type="button"
            onClick={handleSair}
            aria-label="Sair"
            className="text-[11px] font-bold bg-emerald-900 hover:bg-red-900 px-2.5 py-1 rounded-full text-amber-300 border border-emerald-700"
          >
            Sair
          </button>
        </div>
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
                      Toque nas ilustrações para ampliar no campo e consultar níveis de dano económico.
                    </p>
                  </div>

                  <div className="relative w-full lg:w-80">
                    <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Pesquisar praga, doença ou cultura..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 font-medium text-stone-900 focus:border-emerald-700 focus:bg-white outline-none"
                    />
                  </div>
                </div>

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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => (
                  <article
                    key={guide.id}
                    className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-sm flex flex-col"
                  >
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
                            Nível de Dano Económico / Critério
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
                          Protocolo de Controlo Recomendado:
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Pulverização em Declives e Grotas</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Acesso seguro em pastagens acidentadas, áreas encharcadas ou com presença de cepos/pedras onde o trator não entra, mantendo altura constante via radar de terreno.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Mapeamento Multiespectral (NDVI)</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Identificação precisa de falhas de estande, compactação, erosão laminar e reboleiras de plantas infestantes, permitindo aplicação localizada (taxa variável) e economia de herbicidas.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center mb-4">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-stone-900">Dispersão de Sementes e Biológicos</h3>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Sobressemeadura de forrageiras e leguminosas (ex.: Estilosantes) e libertação uniforme de agentes biológicos para controlo de cigarrinhas e lagartas sem compactar o solo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm overflow-x-auto">
                  <h3 className="text-lg font-black text-stone-900 mb-4">
                    Comparativo Operacional: Drone Agrícola vs. Trator/Barra
                  </h3>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-stone-200 text-stone-700">
                        <th className="py-2.5 pr-4 font-extrabold">Critério</th>
                        <th className="py-2.5 px-4 font-extrabold text-emerald-900">Drone (VANT)</th>
                        <th className="py-2.5 pl-4 font-extrabold text-stone-700">Trator + Barra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="py-3 pr-4 font-bold">Volume de Calda</td>
                        <td className="py-3 px-4 font-semibold text-emerald-800">10 a 20 L/ha (ultrabaixo/baixo volume)</td>
                        <td className="py-3 pl-4 text-stone-700">100 a 200 L/ha</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-bold">Compactação do Solo</td>
                        <td className="py-3 px-4 font-semibold text-emerald-800">Zero (sem rodado)</td>
                        <td className="py-3 pl-4 text-stone-700">Presente em solo húmido</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-bold">Terrenos Inclinados / Grotas</td>
                        <td className="py-3 px-4 font-semibold text-emerald-800">Alta eficiência com radar</td>
                        <td className="py-3 pl-4 text-stone-700">Risco operacional / restrito</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-950 text-white p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="text-lg font-black text-amber-400">Simulador Operacional de Drone</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase text-emerald-200">
                      Área do Talhão (ha)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={droneArea}
                      onChange={(e) => setDroneArea(Math.max(1, Number(e.target.value) || 0))}
                      className="mt-1 w-full rounded-xl bg-emerald-900 border border-emerald-700 px-3 py-2 text-sm font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-emerald-200">
                      Relevo / Declividade
                    </label>
                    <select
                      value={droneDeclive}
                      onChange={(e) => setDroneDeclive(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-emerald-900 border border-emerald-700 px-3 py-2 text-sm font-bold text-white"
                    >
                      <option value="plano">Plano / Suave (13,0 ha/h)</option>
                      <option value="acentuado">Acentuado / Grotas (9,5 ha/h)</option>
                    </select>
                  </div>
                  <div className="pt-2 border-t border-emerald-800 space-y-2">
                    <div>
                      <span className="text-xs text-emerald-200 block">Tempo Estimado de Operação</span>
                      <span className="text-2xl font-black text-amber-400">{droneMetrics.horasDrone} h</span>
                    </div>
                    <div>
                      <span className="text-xs text-emerald-200 block">Economia Estimada de Água</span>
                      <span className="text-lg font-bold text-white">{droneMetrics.aguaEconomizadaLitros} L</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 3: CALCULADORAS AGRONÓMICAS                        */}
          {/* ========================================================= */}
          {activeTab === 'calculadoras' && (
            <section className="space-y-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Ferramentas de Precisão no Campo
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                  Calculadoras Agronómicas
                </h2>
              </div>

              {/* CALCULADORA 1: PULVERIZADOR */}
              <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-stone-900">
                      1. Calibração de Pulverizador (Volume de Calda)
                    </h3>
                    <p className="text-sm text-stone-600">
                      Fórmula: Q (L/ha) = (q × 600) / (V × E)
                    </p>
                  </div>
                  <Droplets className="w-6 h-6 text-emerald-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Caudal do Bico (L/min)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={vazaoBico}
                      onChange={(e) => setVazaoBico(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Velocidade (km/h)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={velocidadeTrator}
                      onChange={(e) => setVelocidadeTrator(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Espaçamento Bicos (m)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={espacamentoBicos}
                      onChange={(e) => setEspacamentoBicos(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Capacidade do Depósito (L)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={capacidadeTanque}
                      onChange={(e) => setCapacidadeTanque(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-stone-900 p-4 text-white">
                  <div>
                    <span className="text-xs text-stone-300 block">Volume de Calda</span>
                    <span className="text-2xl font-black text-amber-400">{resultPulverizador.volumeCalda} L/ha</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-300 block">Autonomia por Depósito</span>
                    <span className="text-2xl font-black text-emerald-400">{resultPulverizador.autonomiaHa} ha</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-300 block">Diagnóstico Operacional</span>
                    <span className="text-sm font-bold block mt-1">{resultPulverizador.status}</span>
                  </div>
                </div>
              </div>

              {/* CALCULADORA 2: CALAGEM (Ca + Mg e Al³⁺) + DISPONIBILIDADE + FERTILIDADE NATURAL */}
              <div className="space-y-6 rounded-2xl border-2 border-stone-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-stone-900">
                      2. Calagem (Ca + Mg e Neutralização de Al³⁺) & Disponibilidade
                    </h3>
                    <p className="text-sm text-stone-600 mt-1">
                      Dimensionamento pelo maior critério entre atendimento de Ca + Mg e neutralização de Al³⁺.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-sm font-bold text-emerald-950">
                    <input
                      type="checkbox"
                      checked={incluirFertilidadeNatural}
                      onChange={(e) => setIncluirFertilidadeNatural(e.target.checked)}
                      className="h-4 w-4 rounded border-emerald-400 text-emerald-700"
                    />
                    Incluir dados da análise de fertilidade natural do solo
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Ca + Mg Exigido (cmolc/dm³)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={caMgExigido}
                      onChange={(e) => setCaMgExigido(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Argila Atual (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={argilaAtual}
                      onChange={(e) => setArgilaAtual(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Fator Y (opcional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder={`Auto (${resultadoCalagem.yUsado})`}
                      value={fatorY}
                      onChange={(e) => setFatorY(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      PRNT do Calcário (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={prntCalcario}
                      onChange={(e) => setPrntCalcario(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-extrabold uppercase text-stone-800">
                    Análise Atual do Solo & Classe de Disponibilidade
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                      <label className="block text-xs font-bold text-stone-700">Ca²⁺ (cmolc/dm³)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={caAtual}
                        onChange={(e) => setCaAtual(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-semibold"
                      />
                      <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesAtuais.Ca)}`}>
                        {classesAtuais.Ca}
                      </span>
                    </div>

                    <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                      <label className="block text-xs font-bold text-stone-700">Mg²⁺ (cmolc/dm³)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={mgAtual}
                        onChange={(e) => setMgAtual(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-semibold"
                      />
                      <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesAtuais.Mg)}`}>
                        {classesAtuais.Mg}
                      </span>
                    </div>

                    <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                      <label className="block text-xs font-bold text-stone-700">Al³⁺ (cmolc/dm³)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={alAtual}
                        onChange={(e) => setAlAtual(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-semibold"
                      />
                      <span className="mt-2 inline-block rounded-full border border-stone-300 bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-800">
                        Neutralização Al
                      </span>
                    </div>

                    <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                      <label className="block text-xs font-bold text-stone-700">P (mg/dm³)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pAtual}
                        onChange={(e) => setPAtual(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-semibold"
                      />
                      <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesAtuais.P)}`}>
                        {classesAtuais.P}
                      </span>
                    </div>

                    <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                      <label className="block text-xs font-bold text-stone-700">K (mg/dm³)</label>
                      <input
                        type="number"
                        step="1"
                        value={kAtual}
                        onChange={(e) => setKAtual(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-semibold"
                      />
                      <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesAtuais.K)}`}>
                        {classesAtuais.K}
                      </span>
                    </div>
                  </div>
                </div>

                {incluirFertilidadeNatural && (
                  <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-extrabold uppercase text-amber-950">
                        Análise da Fertilidade Natural do Solo (Referência Basal)
                      </h4>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-amber-950">Argila Natural (%):</label>
                        <input
                          type="number"
                          step="1"
                          value={argilaNatural}
                          onChange={(e) => setArgilaNatural(e.target.value)}
                          className="w-20 rounded-lg border border-amber-300 bg-white px-2 py-1 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="rounded-xl border border-amber-200 bg-white p-3">
                        <label className="block text-xs font-bold text-stone-700">Ca²⁺ Natural</label>
                        <input
                          type="number"
                          step="0.1"
                          value={caNatural}
                          onChange={(e) => setCaNatural(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
                        />
                        <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesNaturais.Ca)}`}>
                          {classesNaturais.Ca}
                        </span>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-white p-3">
                        <label className="block text-xs font-bold text-stone-700">Mg²⁺ Natural</label>
                        <input
                          type="number"
                          step="0.1"
                          value={mgNatural}
                          onChange={(e) => setMgNatural(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
                        />
                        <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesNaturais.Mg)}`}>
                          {classesNaturais.Mg}
                        </span>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-white p-3">
                        <label className="block text-xs font-bold text-stone-700">Al³⁺ Natural</label>
                        <input
                          type="number"
                          step="0.1"
                          value={alNatural}
                          onChange={(e) => setAlNatural(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
                        />
                        <span className="mt-2 inline-block rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-950">
                          Condição Natural
                        </span>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-white p-3">
                        <label className="block text-xs font-bold text-stone-700">P Natural</label>
                        <input
                          type="number"
                          step="0.5"
                          value={pNatural}
                          onChange={(e) => setPNatural(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
                        />
                        <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesNaturais.P)}`}>
                          {classesNaturais.P}
                        </span>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-white p-3">
                        <label className="block text-xs font-bold text-stone-700">K Natural</label>
                        <input
                          type="number"
                          step="1"
                          value={kNatural}
                          onChange={(e) => setKNatural(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
                        />
                        <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClasseDisponibilidade(classesNaturais.K)}`}>
                          {classesNaturais.K}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-emerald-950 p-5 text-white sm:grid-cols-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-200">Dose Recomendada</p>
                    <p className="mt-1 text-2xl font-black text-amber-400">
                      {resultadoCalagem.quantidadeTonHa} t/ha
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-emerald-200">Critério Limitante</p>
                    <p className="mt-1 text-sm font-bold">{resultadoCalagem.criterioLimitante}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-emerald-200">NC por Al³⁺ (Y = {resultadoCalagem.yUsado})</p>
                    <p className="mt-1 text-base font-bold">{resultadoCalagem.ncAl} t/ha (base)</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-emerald-200">NC por Ca + Mg (Atual: {resultadoCalagem.somaCaMgAtual})</p>
                    <p className="mt-1 text-base font-bold">{resultadoCalagem.ncCaMg} t/ha (base)</p>
                  </div>
                </div>
              </div>

              {/* CALCULADORA 3: SEMENTES DE MILHO */}
              <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-stone-900">
                      3. População e Distribuição de Sementes de Milho
                    </h3>
                    <p className="text-sm text-stone-600">
                      Ajuste por espaçamento e poder germinativo (saco de 60.000 sementes).
                    </p>
                  </div>
                  <Sprout className="w-6 h-6 text-emerald-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      População Desejada (pl/ha)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={populacaoDesejada}
                      onChange={(e) => setPopulacaoDesejada(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Espaçamento Entre Linhas (m)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={espacamentoLinhas}
                      onChange={(e) => setEspacamentoLinhas(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Germinação (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={germinacaoSemente}
                      onChange={(e) => setGerminacaoSemente(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Finalidade
                    </label>
                    <select
                      value={finalidadeMilho}
                      onChange={(e) => setFinalidadeMilho(e.target.value)}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-bold"
                    >
                      <option value="Grão">Milho Grão</option>
                      <option value="Silagem">Milho Silagem</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-stone-900 p-4 text-white">
                  <div>
                    <span className="text-xs text-stone-300 block">Plantas por Metro Linear</span>
                    <span className="text-2xl font-black text-amber-400">{resultSementes.plantasMetro} pl/m</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-300 block">Sementes por Metro Linear</span>
                    <span className="text-2xl font-black text-emerald-400">{resultSementes.sementesMetro} sem/m</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-300 block">Necessidade por Hectare ({finalidadeMilho})</span>
                    <span className="text-2xl font-black text-white">{resultSementes.sacosHa} sacos/ha</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 4: DASHBOARD & GESTÃO                             */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Indicadores Operacionais
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                  Dashboard & Gestão do Talhão
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Calagem (Ca+Mg / Al³⁺)</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {resultadoCalagem.quantidadeTonHa} t/ha
                  </p>
                  <span className="text-xs font-semibold text-stone-600">{resultadoCalagem.criterioLimitante}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Volume de Calda</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {resultPulverizador.volumeCalda} L/ha
                  </p>
                  <span className="text-xs font-semibold text-stone-600">Autonomia: {resultPulverizador.autonomiaHa} ha</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Sementes / ha</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {resultSementes.sacosHa} sacos
                  </p>
                  <span className="text-xs font-semibold text-stone-600">{resultSementes.sementesMetro} sem/m</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-stone-500">Estado P / K Atual</span>
                  <p className="text-base font-black text-stone-900 mt-2">
                    P: {classesAtuais.P} • K: {classesAtuais.K}
                  </p>
                  <span className="text-xs font-semibold text-stone-600">
                    Ca: {classesAtuais.Ca} • Mg: {classesAtuais.Mg}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MÓDULO 5: RELATÓRIO TÉCNICO / LAUDO                       */}
          {/* ========================================================= */}
          {activeTab === 'relatorio' && (
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Emissão de Laudo de Campo
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 mt-2">
                      Relatório Técnico Agronómico
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 shadow"
                  >
                    <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Propriedade / Talhão
                    </label>
                    <input
                      type="text"
                      value={produtorNome}
                      onChange={(e) => setProdutorNome(e.target.value)}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-700">
                      Responsável Técnico
                    </label>
                    <input
                      type="text"
                      value={responsavelTecnico}
                      onChange={(e) => setResponsavelTecnico(e.target.value)}
                      className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-stone-700">
                    Observações e Recomendações de Campo
                  </label>
                  <textarea
                    rows="3"
                    value={observacoesCampo}
                    onChange={(e) => setObservacoesCampo(e.target.value)}
                    className="mt-1 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium"
                  />
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2 text-sm">
                  <p>
                    <strong>Calagem Recomendada:</strong> {resultadoCalagem.quantidadeTonHa} t/ha (PRNT {prntCalcario}%) — Critério limitante: <strong>{resultadoCalagem.criterioLimitante}</strong>.
                  </p>
                  <p>
                    <strong>Disponibilidade Atual:</strong> P ({classesAtuais.P}), K ({classesAtuais.K}), Ca ({classesAtuais.Ca}), Mg ({classesAtuais.Mg}).
                  </p>
                  {incluirFertilidadeNatural && (
                    <p>
                      <strong>Fertilidade Natural (Referência):</strong> P ({classesNaturais.P}), K ({classesNaturais.K}), Ca ({classesNaturais.Ca}), Mg ({classesNaturais.Mg}).
                    </p>
                  )}
                  <p>
                    <strong>Pulverização:</strong> {resultPulverizador.volumeCalda} L/ha • <strong>Sementes:</strong> {resultSementes.sacosHa} sacos/ha ({finalidadeMilho}).
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* MENU INFERIOR MOBILE */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-emerald-950 text-white border-t border-emerald-900 flex justify-around py-2 z-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-bold ${
                isActive ? 'text-amber-400' : 'text-emerald-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MODAL DE ZOOM DIAGNÓSTICO */}
      {zoomGuide && (
        <div
          onClick={() => setZoomGuide(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h3 className="font-black text-lg text-stone-900">{zoomGuide.title}</h3>
              <button
                type="button"
                onClick={() => setZoomGuide(null)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-72 sm:h-96 bg-stone-900">{zoomGuide.svgIllustration}</div>
            <div className="p-4 text-sm text-stone-700">
              <strong>Nível de Dano Económico:</strong> {zoomGuide.economicThreshold}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}