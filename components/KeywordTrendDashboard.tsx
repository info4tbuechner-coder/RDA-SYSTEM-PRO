import React, { useMemo } from 'react';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import Card from './ui/Card';

export const KeywordTrendDashboard: React.FC = () => {
    const { history } = useAnalysisHistory();

    const keywordFrequency = useMemo(() => {
        const counts: Record<string, number> = {};
        history.forEach(analysis => {
            analysis.erkannte_muster.forEach(pattern => {
                const words = [pattern.muster_name, ...pattern.erklaerung.split(/\s+/)];
                words.forEach(word => {
                    const cleanWord = word.toLowerCase().replace(/[^a-zäöüß]/g, '');
                    if (cleanWord.length > 4) {
                        counts[cleanWord] = (counts[cleanWord] || 0) + 1;
                    }
                });
            });
        });
        
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15);
    }, [history]);

    if (history.length === 0) return null;

    return (
        <Card className="p-6 md:p-8 rounded-[2rem] bg-slate-950/40 border border-slate-800">
            <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em] mb-6 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                Top Manipulations-Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
                {keywordFrequency.map(([word, count]) => (
                    <span 
                        key={word}
                        className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-2"
                    >
                        {word}
                        <span className="text-brand-accent font-bold">{count}</span>
                    </span>
                ))}
            </div>
        </Card>
    );
};
