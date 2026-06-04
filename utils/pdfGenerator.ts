import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

export const generateForensicPdf = (data: AnalysisResult) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FORENSISCHER ANALYSEBERICHT", margin, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Erstellt am: ${new Date().toLocaleString()}`, margin, 30);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Zusammenfassung", margin, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitSummary = doc.splitTextToSize(data.zusammenfassung, pageWidth - 2 * margin);
    doc.text(splitSummary, margin, 55);

    // Score
    doc.setFont("helvetica", "bold");
    doc.text(`Konfliktgrad: ${data.score} / 100`, margin, 55 + splitSummary.length * 7);

    // Patterns
    let y = 70 + splitSummary.length * 7;
    doc.setFontSize(16);
    doc.text("Erkannte manipulative Muster", margin, y);
    doc.setFontSize(12);
    y += 10;
    
    data.erkannte_muster.forEach((muster, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${muster.muster_name} (${muster.schweregrad})`, margin, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        const splitMuster = doc.splitTextToSize(muster.erklaerung, pageWidth - 2 * margin);
        doc.text(splitMuster, margin, y);
        y += splitMuster.length * 7 + 5;
    });

    // Action plan
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Handlungsplan", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitPlan = doc.splitTextToSize(data.handlungsplan.fazit, pageWidth - 2 * margin);
    doc.text(splitPlan, margin, y);

    doc.save(`Forensischer_Bericht_${new Date().toISOString()}.pdf`);
};
