export interface NarcissisticPattern {
    id: string; // Added for sync
    muster_name: string;
    zitat: string;
    erklaerung: string;
    gegenmassnahme: string;
    schweregrad: 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
    startIndex?: number;
    endIndex?: number;
}

export interface Advice {
    titel: string;
    text: string;
    prioritaet: 'niedrig' | 'mittel' | 'hoch';
}

export interface OptimizedResponse {
    deeskalierend: string;
    bestimmt: string;
    begruendung: string;
}

export interface AppSettings {
    maxProtocolLength: number;
    toxicityThreshold: number;
    detailLevel: 'kompakt' | 'standard' | 'tiefgreifend';
    enableCrtEffect: boolean;
    courtMode: boolean;
}

export interface MethodischeHerleitung {
    analyse_verfahren: string;
    kriterien_anwendung: string[];
    sachlichkeits_garantie: string;
    objektive_logik: string;
    entlastende_faktoren?: string;
    verfahrensschritte?: string[];
}

export interface AnalysisResult {
    id: string;
    timestamp: number;
    zusammenfassung: string;
    score: number;
    safety_alert: boolean;
    // Forensic subtext analysis missing from initial interface definition
    subtext_analyse: string;
    methodische_herleitung?: MethodischeHerleitung;
    linguistischer_fingerabdruck: {
        tonfall: string[];
        dominanz_verhaeltnis: string;
        emotionale_validierung: number;
    };
    erkannte_muster: NarcissisticPattern[];
    handlungsplan: {
        fazit: string;
        interventionen: Advice[];
        vorschlag_antwort: OptimizedResponse;
    };
    original_text: string;
    sentiment_evolution?: { time: number; score: number }[]; // Added sentiment evolution
}
