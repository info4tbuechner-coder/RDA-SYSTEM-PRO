import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const getSystemInstruction = (courtMode: boolean = true) => {
    if (courtMode) {
        return `SYSTEM-PROTOKOLL: FAM-COMM-EVAL v5.2 – Forensisch-Psychologisches Kommunikationsgutachten für das Familiengericht.
AUFTRAG: Wissenschaftlich-sachliche Untersuchung elterlicher und interpersoneller Interaktionsmuster und Kommunikationsvektoren mit Fokus auf Bindungsfürsorge, Kooperationseignung, Kindeswohlfaktoren und psychologische Abgrenzungsmuster.

ANALYSESCHWERPUNKTE (BELEGBASIERT & SACHLICH):
1. INTERAKTIONSEIGENTÜMLICHKEITEN: Objektive Dekonstruktion der Diskrepanz zwischen vordergründiger Botschaft und tatsächlichem, funktionalem Kommunikationsziel (z.B. Erzeugung von Loyalitätskonflikten, Grenzüberschreitungen, partnerschaftliche/elterliche Abwertungen).
2. LINGUISTISCHE BELEGFÜHRUNG: Sachlicher Nachweis destruktiver Techniken wie Gaslighting (systematisches Infragestellen von Erziehungskompetenz oder Realitätswahrnehmung), Schuldumkehr (DARVO), Projektion, unbegründetem Druckaufbau und manipulativer Schuldzuweisung.
3. KINDESWOHL- & KOOPERATIONSRELEVANZ: Analyse, inwiefern die Kommunikation auf funktionales Co-Parenting (gemeinsame Sorge) ausgelegt ist oder dieses aktiv blockiert/sabotiert.
4. STRATEGISCHE DEESKALATION (BIFF-METHODE): Formulierung klinisch-sachlicher, kurzer, rein informativer, freundlich-bestimmter (Brief, Informative, Friendly, Firm) und nicht-reaktiver Antwortmuster, um weiteren Konflikteskalationen entgegenzuwirken.

METHODENERKLÄRUNG (MANDATORISCH FÜR METHODISCHE_HERLEITUNG):
Erkläre im Feld "methodische_herleitung" transparent:
- "analyse_verfahren": Präzise Spezifizierung des wissenschaftlichen Auswertungsverfahrens (z. B. qualitativ-forensische Inhaltsanalyse nach Mayring, linguistisches Indikatoren-Screening).
- "kriterien_anwendung": Welche genauen familiengerichtlichen und psychologischen Kriterien untersucht wurden (z.B. Kooperationskompetenz, Bindungsfürsorge, Wohl des Kindes, Grenzsicherung, Macht- und Kontrollansprüche).
- "sachlichkeits_garantie": Erklärung, wie Neutralität gewahrt bleibt (Vermeidung unzulässiger Diagnosen, strikte Primärbeleg-Zitierpflicht, Trennung von linguistischem Befund und persönlicher Interpretation).
- "objektive_logik": Logischer Dreischritt der Bewertung (wie die Dichte und Intensität der extrahierten Muster zur quantifizierten Konfliktstufe führt).
- "entlastende_faktoren": Detaillierte Prüfung, ob deeskalierende, kooperative, lösungsorientierte oder verständnisvoll-reife Textpassagen im Input vorhanden sind. Falls keine existieren, formuliere dies neutral und sachlich (z.B. "Ein systematischer Scan lieferte keine Anzeichen deeskalierender oder kooperativer Einlassungen; die Interaktion verbleibt rein reaktiv-konfrontativ.").
- "verfahrensschritte": Die genauen 4-5 Teilschritte, die die KI-Forensik durchlaufen hat (z.B. ["1. Lexiko-syntaktischer Primärscan", "2. Kriteriengeleitete Musterüberprüfung", "3. Entlastungsprüfung (Modus-Gegenprobe)", "4. Konfliktgrad-Quantifizierung", "5. Formulierung der BIFF-Intervention"]).

STIL- UND FORMULIERUNGSVORGABE (MANDATORISCH):
- Absolut neutraler, nüchterner, sachlicher und gutachterlicher Tonfall (wertungsfrei, aber analytisch präzise).
- Verwendung etablierter familienpsychologischer und interaktionstheoretischer Fachbegriffe (z.B. Kooperationskompetenz, Bindungsfürsorge, Grenzverletzung, emotionale Instrumentalisierung, zirkuläre Konfliktmuster).
- Vermeidung von populär- oder küchenpsychologischen Diagnosen (z.B. "Narzissmus" oder "Psychopath" als direkte Etiketten vermeiden; stattdessen exakt beschreiben als "hochgradig egozentrierte Interaktionsdynamiken", "destruktive Beziehungs- und Machtansprüche", oder "Mangel an empathischer Perspektivenübernahme").
- Jedes gefundene Muster MUSS extrem präzise an einem wörtlichen Textzitat belegt werden. Keine haltlosen Interpretationen.`;
    }

    return `SYSTEM-PROTOKOLL: 'RDA-OMEGA' v4.8 Forensic Suite.
AUFTRAG: Dekonstruktion hochmanipulativer Cluster-B Kommunikationsvektoren mit maximaler analytischer Präzision.

ANALYSE-MODI (FORCIERT):
1. SEMANTIC DECONSTRUCTION: Identifiziere die Diskrepanz zwischen expliziter Wortwahl und implizitem Erpressungs- oder Manipulationspotenzial.
2. LINGUISTIC FINGERPRINTING: Suche nach Indikatoren für Gaslighting, Schuldzuweisung (Blame Shifting), Wortsalat und zirkuläre Logik.
3. SUBTEXT-DECODER: Was ist das funktionale Ziel der Nachricht? (Status-Erhalt, emotionale Destabilisierung, Kontrolle).
4. GREY ROCK INTERVENTION: Generiere klinisch-neutrale, deeskalierende Antworten, die keine emotionale Angriffsfläche bieten.

METHODENERKLÄRUNG (MANDATORISCH FÜR METHODISCHE_HERLEITUNG):
Erkläre im Feld "methodische_herleitung":
- "analyse_verfahren": Computergestützte forensische Kognitions- und Sentimentanalyse.
- "kriterien_anwendung": Erfassung verdeckter Dominanzmuster, passiver Aggression, Schuldprojektion, Zirkularität.
- "sachlichkeits_garantie": Datenbasierte Verifikationsprüfung der Belegdichte zur Eliminierung subjektiver Interpretationsverzerrungen.
- "objektive_logik": Algorithmentabelle des Belastungskoeffizienten.
- "entlastende_faktoren": Suche nach kollaborativen Tokens oder neutralen Deeskalationsversuchen des Senders.
- "verfahrensschritte": Analyseprozess-Pipeline (z.B. ["Lexikalische Token-Filterung", "Pattern-Vektoren-Matching", "Subtext-Dekodierung", "Toxizitätsberechnung", "Deeskalations-Modellierung"]).

STIL-VORGABE: Absolut unbestechlich, klinisch-kalt, analytisch dominant. Keine Floskeln, sondern forensische Evidenz. Nutze Fachterminologie präzise.`;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        zusammenfassung: { type: Type.STRING },
        score: { type: Type.NUMBER },
        safety_alert: { type: Type.BOOLEAN },
        subtext_analyse: { type: Type.STRING },
        methodische_herleitung: {
            type: Type.OBJECT,
            properties: {
                analyse_verfahren: { type: Type.STRING },
                kriterien_anwendung: { type: Type.ARRAY, items: { type: Type.STRING } },
                sachlichkeits_garantie: { type: Type.STRING },
                objektive_logik: { type: Type.STRING },
                entlastende_faktoren: { type: Type.STRING },
                verfahrensschritte: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["analyse_verfahren", "kriterien_anwendung", "sachlichkeits_garantie", "objektive_logik", "entlastende_faktoren", "verfahrensschritte"]
        },
        linguistischer_fingerabdruck: {
            type: Type.OBJECT,
            properties: {
                tonfall: { type: Type.ARRAY, items: { type: Type.STRING } },
                dominanz_verhaeltnis: { type: Type.STRING },
                emotionale_validierung: { type: Type.NUMBER }
            },
            required: ["tonfall", "dominanz_verhaeltnis", "emotionale_validierung"]
        },
        erkannte_muster: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    muster_name: { type: Type.STRING },
                    zitat: { type: Type.STRING },
                    erklaerung: { type: Type.STRING },
                    gegenmassnahme: { type: Type.STRING },
                    schweregrad: { type: Type.STRING, enum: ["niedrig", "mittel", "hoch", "kritisch"] }
                },
                required: ["muster_name", "zitat", "erklaerung", "gegenmassnahme", "schweregrad"]
            }
        },
        handlungsplan: {
            type: Type.OBJECT,
            properties: {
                fazit: { type: Type.STRING },
                interventionen: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            titel: { type: Type.STRING },
                            text: { type: Type.STRING },
                            prioritaet: { type: Type.STRING, enum: ["niedrig", "mittel", "hoch"] }
                        },
                        required: ["titel", "text", "prioritaet"]
                    }
                },
                vorschlag_antwort: {
                    type: Type.OBJECT,
                    properties: {
                        deeskalierend: { type: Type.STRING },
                        bestimmt: { type: Type.STRING },
                        begruendung: { type: Type.STRING }
                    },
                    required: ["deeskalierend", "bestimmt", "begruendung"]
                }
            },
            required: ["fazit", "interventionen", "vorschlag_antwort"]
        }
    },
    required: ["zusammenfassung", "score", "safety_alert", "subtext_analyse", "methodische_herleitung", "linguistischer_fingerabdruck", "erkannte_muster", "handlungsplan"]
};

const cleanJsonResponse = (text: string): string => {
    return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
};

export const analyzeConversation = async (conversation: string, context: string, detailLevel: string = 'standard', courtMode: boolean = true): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '',
        httpOptions: {
            headers: {
                'User-Agent': 'aistudio-build'
            }
        }
    });
    
    const prompt = courtMode 
        ? `GUTACHTERLICHE KOMMUNIKATIONSEVALUATION
ANALYSESTANDARD: FAMILIENGERICHTLICHES BEWERTUNGSVERFAHREN
KONTEXT DER ELTERNLICHEN INTERAKTION: ${context}
TRANSKRIPT / PROXIMALER KOMMUNIKATIONS-STREAM:
"""
${conversation}
"""
AUFTRAG: Führe ein wissenschaftlich-psychologisches Kommunikationsgutachten auf Basis des übermittelten Gesprächsmaterials durch. Halte dich an den neutralen, sachlichen Stil ohne polemische Begriffe.`
        : `FORENSIC_MISSION: DECONSTRUCT_PAYLOAD
PRIORITY: MAX
CONTEXT_DYNAMICS: ${context}
RAW_STREAM:
"""
${conversation}
"""
REQUIRED: OMEGA_PROTOCOL execution. Fully map all narcissistic and manipulative vectors.`;
    
    const modelName = detailLevel === 'kompakt' ? 'gemini-3.5-flash' : 'gemini-3.1-pro-preview';
    const thinkingBudget = detailLevel === 'tiefgreifend' ? 32768 : 24576;

    const baseConfig: any = {
        systemInstruction: getSystemInstruction(courtMode),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
    };

    if (modelName === 'gemini-3.1-pro-preview') {
        baseConfig.thinkingConfig = { thinkingBudget };
    }

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: baseConfig
    });

    if (!response.text) throw new Error("Keine Daten von der OMEGA-Unit erhalten.");

    const result = JSON.parse(cleanJsonResponse(response.text));

    result.erkannte_muster = (result.erkannte_muster || []).map((m: any) => {
        const id = crypto.randomUUID();
        const start = conversation.toLowerCase().indexOf(m.zitat.toLowerCase());
        return start !== -1 
            ? { ...m, id, startIndex: start, endIndex: start + m.zitat.length } 
            : { ...m, id };
    });

    return { 
        ...result, 
        id: crypto.randomUUID(), 
        timestamp: Date.now(), 
        original_text: conversation 
    };
};

export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
    const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioBase64, mimeType }),
    });

    if (!response.ok) {
        throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.text;
};