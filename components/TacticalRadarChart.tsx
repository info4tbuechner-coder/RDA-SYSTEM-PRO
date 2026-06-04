import React, { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import type { NarcissisticPattern } from '../types';
import Card from './ui/Card';
import { InfoIcon } from './ui/Icons';

interface TacticalRadarChartProps {
    patterns: NarcissisticPattern[];
    onLocatePattern?: (id: string) => void;
}

const CATEGORIES = [
    {
        key: 'gaslighting',
        label: 'Gaslighting',
        short: 'Gaslighting',
        desc: 'Systematisches Infragestellen der Realität, Wahrnehmung oder Erziehungskompetenz des Gegenübers.',
        keywords: ['gaslight', 'realität', 'wahrnehmung', 'erinnerung', 'psychisch', 'verrückt', 'einbildung', 'falschbehauptung']
    },
    {
        key: 'darvo',
        label: 'Schuldumkehr (DARVO)',
        short: 'DARVO / Schuldumkehr',
        desc: 'Täter-Opfer-Umkehr zur Abwehr elterlicher Verantwortung (Deny, Attack, Reverse Victim & Offender).',
        keywords: ['schuldumkehr', 'darvo', 'opferrolle', 'verantwortung', 'täter-opfer', 'täter umkehr', 'umkehr']
    },
    {
        key: 'projection',
        label: 'Projektion',
        short: 'Projektion',
        desc: 'Übertragung eigener unbewusster Impulse, Fehler oder Vorwürfe auf das unschuldige Gegenüber.',
        keywords: ['projekt', 'projek', 'projection', 'spiegel', 'spiegelung', 'übertragung']
    },
    {
        key: 'guilt_tripping',
        label: 'Schuldzuweisung (Guilt-tripping)',
        short: 'Guilt-tripping',
        desc: 'Ausnutzen von elterlichen Sorgen, Schuldgefühlen oder ethischen Pflichten zur kooperativen Erpressung.',
        keywords: ['schuldzuweisung', 'guilt', 'erpressung', 'schuldgefühl', 'verpflichtung', 'loyalität']
    },
    {
        key: 'devaluation',
        label: 'Abwertung (Devaluation)',
        short: 'Abwertung',
        desc: 'Verdeckte oder direkte Schmähungen, Kränkungen und Herabsetzungen der elterlichen Kompetenzen.',
        keywords: ['abwert', 'degrad', 'schmäh', 'beleid', 'kritik', 'unfähig', 'nichtsnutz', 'herabsetz']
    },
    {
        key: 'control',
        label: 'Macht & Kontrolle',
        short: 'Macht & Kontrolle',
        desc: 'Machtdemonstrationen, kooperationsfeindliche Blockadeansprüche und aggressive Grenzverletzungen.',
        keywords: ['kontroll', 'macht', 'droh', 'forder', 'erzwing', 'vorschreib', 'grenz', 'grenzüberschreit']
    }
];

const SEVERITY_SCORES: Record<string, number> = {
    niedrig: 25,
    mittel: 50,
    hoch: 75,
    kritisch: 100
};

// Colors based on maximum severity in a class
const SEVERITY_COLORS = {
    none: '#475569', // slate-600
    niedrig: '#10b981', // emerald-500
    mittel: '#f59e0b', // amber-500
    hoch: '#f97316', // orange-500
    kritisch: '#f43f5e' // rose-500
};

export const TacticalRadarChart: React.FC<TacticalRadarChartProps> = ({ patterns, onLocatePattern }) => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>('gaslighting');

    // Categorize actual detected patterns
    const matchedPatternsMap = useMemo(() => {
        const mapping: Record<string, NarcissisticPattern[]> = {
            gaslighting: [],
            darvo: [],
            projection: [],
            guilt_tripping: [],
            devaluation: [],
            control: []
        };

        const list = patterns || [];
        list.forEach(p => {
            const name = p.muster_name.toLowerCase();
            const desc = p.erklaerung.toLowerCase();
            
            let matched = false;
            for (const cat of CATEGORIES) {
                const hasKeyword = cat.keywords.some(kw => name.includes(kw) || desc.includes(kw));
                if (hasKeyword) {
                    mapping[cat.key].push(p);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                if (name.includes('limit') || name.includes('grenz') || name.includes('droh')) {
                    mapping['control'].push(p);
                } else {
                    mapping['devaluation'].push(p);
                }
            }
        });

        return mapping;
    }, [patterns]);

    // Build chart data
    const chartData = useMemo(() => {
        return CATEGORIES.map(cat => {
            const matches = matchedPatternsMap[cat.key] || [];
            let maxScore = 0;
            let highestSeverity = 'none';
            
            if (matches.length > 0) {
                matches.forEach(m => {
                    const sc = SEVERITY_SCORES[m.schweregrad] || 25;
                    if (sc > maxScore) {
                        maxScore = sc;
                        highestSeverity = m.schweregrad;
                    }
                });
            }
            
            return {
                subject: cat.short,
                fullLabel: cat.label,
                value: maxScore,
                count: matches.length,
                severity: highestSeverity,
                key: cat.key
            };
        });
    }, [matchedPatternsMap]);

    // Format active details for displaying on the right panel
    const activeCategory = useMemo(() => {
        const currentKey = selectedKey || hoveredKey || 'gaslighting';
        const catInfo = CATEGORIES.find(c => c.key === currentKey)!;
        const matches = matchedPatternsMap[currentKey] || [];
        
        let highestSeverity = 'none';
        let maxScore = 0;
        matches.forEach(m => {
            const sc = SEVERITY_SCORES[m.schweregrad] || 25;
            if (sc > maxScore) {
                maxScore = sc;
                highestSeverity = m.schweregrad;
            }
        });

        return {
            ...catInfo,
            matches,
            highestSeverity,
            score: maxScore
        };
    }, [selectedKey, hoveredKey, matchedPatternsMap]);

    const activeRadarData = useMemo(() => {
        // Highlighting logic: boost hovered item's visual color or emphasize
        return chartData;
    }, [chartData]);

    return (
        <Card className="p-6 md:p-12 rounded-[2.5rem] bg-[#070e1a]/90 border-slate-800 shadow-4xl relative overflow-hidden">
            <div className="absolute inset-0 terminal-grid opacity-[0.03] pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-900/60 mb-8">
                <div className="space-y-2">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.4em] font-mono flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-glow-pulse shadow-[0_0_12px_rgba(14,165,233,0.5)]"></span>
                        Forensisches Taktik-Radar
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                        Visualisierung und Zuordnung elterlicher Konfliktvektoren
                    </p>
                </div>
                <div className="shrink-0 flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-mono text-slate-400">
                    <span className="text-slate-600">AKTIVE_TAKTIKEN:</span>
                    <span className="text-brand-accent font-black">
                        {patterns.length}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 items-stretch">
                
                {/* Radar Chart Column */}
                <div className="xl:col-span-5 flex flex-col items-center justify-center bg-slate-950/40 border border-slate-900/60 rounded-[2rem] p-6 relative">
                    <div className="absolute top-4 left-4 text-[8px] font-mono text-slate-700">GRID_VIEW: OMEGA_DESTRUCT_V1</div>
                    
                    <div className="w-full h-72 sm:h-80 md:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeRadarData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={(props) => {
                                        const { x, y, payload } = props;
                                        const item = chartData.find(d => d.subject === payload.value);
                                        const isHovered = hoveredKey === item?.key;
                                        const isSelected = selectedKey === item?.key;
                                        const color = isSelected 
                                            ? '#0ea5e9' 
                                            : isHovered 
                                                ? '#38bdf8' 
                                                : item && item.count > 0 
                                                    ? '#94a3b8' 
                                                    : '#475569';
                                        
                                        return (
                                            <g transform={`translate(${x},${y})`}>
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={4}
                                                    textAnchor="middle"
                                                    fill={color}
                                                    fontSize={9}
                                                    fontWeight={(isSelected || isHovered) ? 800 : 500}
                                                    fontFamily="JetBrains Mono"
                                                    className="cursor-pointer transition-all duration-300 select-none uppercase tracking-wide hover:scale-105"
                                                    onClick={() => item && setSelectedKey(item.key)}
                                                >
                                                    {payload.value}
                                                </text>
                                            </g>
                                        );
                                    }}
                                />
                                <PolarRadiusAxis 
                                    angle={30} 
                                    domain={[0, 100]} 
                                    tick={{ fill: '#334155', fontSize: 7, fontFamily: 'JetBrains Mono' }} 
                                    axisLine={false}
                                />
                                
                                <Tooltip
                                    cursor={{ stroke: '#0ea5e9', strokeDasharray: '2 2' }}
                                    contentStyle={{
                                        backgroundColor: '#050b16',
                                        border: '1px solid #1e293b',
                                        borderRadius: '16px',
                                        color: '#f8fafc',
                                        fontSize: '11px',
                                        fontFamily: 'JetBrains Mono',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                    }}
                                    formatter={(value: any, name: any, props: any) => {
                                        const count = props.payload.count;
                                        return [`${value}% Belastungskennwert (${count} Belege)`, 'Intensität'];
                                    }}
                                />
                                
                                <Radar 
                                    name="OMEGA" 
                                    dataKey="value" 
                                    stroke="#0ea5e9" 
                                    fill="#0ea5e9" 
                                    fillOpacity={0.15} 
                                    strokeWidth={2}
                                />
                                
                                {/* Overlay radar for hovered key to highlight */}
                                {hoveredKey && (
                                    <Radar 
                                        name="HOVERED" 
                                        dataKey={(d) => d.key === hoveredKey ? d.value : 0} 
                                        stroke="#f43f5e" 
                                        fill="#f43f5e" 
                                        fillOpacity={0.25} 
                                        strokeWidth={1}
                                    />
                                )}
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="absolute bottom-4 text-[8px] font-mono text-slate-500 tracking-wider">
                        KLICKEN SIE AUF EIN MUSTER FÜR DEN COGNITIVE DECODER
                    </div>
                </div>

                {/* Categories & Selected Breakdown Column */}
                <div className="xl:col-span-7 flex flex-col gap-6">
                    
                    {/* Horizontal Selection Filter Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {chartData.map(d => {
                            const isSelected = selectedKey === d.key;
                            const isMatched = d.count > 0;
                            const sevColor = isMatched ? SEVERITY_COLORS[d.severity as keyof typeof SEVERITY_COLORS] : '#334155';
                            
                            return (
                                <button
                                    key={d.key}
                                    onClick={() => setSelectedKey(d.key)}
                                    onMouseEnter={() => setHoveredKey(d.key)}
                                    onMouseLeave={() => setHoveredKey(null)}
                                    className={`
                                        p-4 rounded-2xl border text-[10px] font-mono tracking-wide text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[100px]
                                        ${isSelected 
                                            ? 'bg-brand-primary/10 border-brand-primary text-slate-100 shadow-[0_0_20px_rgba(14,165,233,0.15)] scale-[1.02]' 
                                            : 'bg-slate-950/20 border-slate-900/60 text-slate-500 hover:text-slate-300 hover:bg-slate-950/40 hover:border-slate-800'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="w-1.5 h-1.5 rounded-full animate-pulse" 
                                                style={{ backgroundColor: sevColor }}
                                            />
                                            <span className="font-bold uppercase tracking-widest">{d.subject}</span>
                                        </div>
                                        <span 
                                            className="text-[8px] font-black px-2 py-0.5 rounded-md uppercase"
                                            style={{ 
                                                backgroundColor: isMatched ? `${sevColor}20` : '#181e28', 
                                                color: sevColor,
                                                border: `1px solid ${isMatched ? `${sevColor}30` : '#1e293b'}`
                                            }}
                                        >
                                            {isMatched ? `${d.severity}` : 'none'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-end w-full pt-2">
                                        <div className="text-[14px] font-bold text-slate-300 font-sans">
                                            {d.count} <span className="text-[9px] font-mono text-slate-600 font-normal">Muster</span>
                                        </div>
                                        <div className="text-[12px] font-sans font-bold" style={{ color: isMatched ? '#ffffff' : '#334155' }}>
                                            {isMatched ? `${d.value}%` : '0%'}
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-0 left-0 h-[2px] bg-brand-primary transition-all duration-300 ${isSelected ? 'w-full' : 'w-0'}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Expandable Active Tactic Insight Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-950/50 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between flex-1 min-h-[220px]"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <InfoIcon className="w-5 h-5 text-brand-primary" />
                                    <h4 className="text-xs font-mono text-brand-primary uppercase tracking-[0.25em] font-black">
                                        COGNITIVE_DECONSTRUCT_INSIGHT / {activeCategory.label}
                                    </h4>
                                </div>
                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                    {activeCategory.desc}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-900/60">
                                {activeCategory.matches.length > 0 ? (
                                    <div className="space-y-4">
                                        <span className="text-[8px] font-mono text-brand-accent uppercase tracking-widest block font-bold">Linguistisches Beweismaterial in dieser Kategorie:</span>
                                        <div className="max-h-[140px] overflow-y-auto space-y-3 pr-2 select-none">
                                            {activeCategory.matches.map((m, idx) => (
                                                <div 
                                                    key={m.id} 
                                                    className="p-3 bg-[#0a1120] border-l-2 border-brand-accent rounded-r-xl cursor-all-scroll hover:bg-[#0f1d35] transition-colors"
                                                    onClick={() => onLocatePattern?.(m.id)}
                                                >
                                                    <p className="font-serif italic text-xs text-slate-200 line-clamp-2">
                                                        "{m.zitat}"
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2 text-[8px] font-mono text-slate-500">
                                                        <span className="uppercase">Muster: {m.muster_name}</span>
                                                        <span className="text-brand-primary uppercase font-bold hover:underline cursor-pointer">Zu Beleg scrollen ➔</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-600 bg-slate-950/40 rounded-xl border border-dashed border-slate-900">
                                        <p className="text-xs font-mono uppercase tracking-widest italic">
                                            Keine Belastungsmuster nachgewiesen
                                        </p>
                                        <p className="text-[8px] font-mono uppercase mt-1">
                                            In dieser Kommunikations-Sektion ist dieser Indikator unbelastet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};

export default TacticalRadarChart;
