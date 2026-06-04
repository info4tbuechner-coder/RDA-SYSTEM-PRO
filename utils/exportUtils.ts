export const exportJson = (data: any, fileName: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportCsv = (data: any, fileName: string) => {
    // Simple flatten for CSV export
    const headers = ["ID", "Timestamp", "Score", "SafetyAlert", "Zusammenfassung", "EmotionaleValidierung"];
    const row = [
        data.id,
        new Date(data.timestamp).toISOString(),
        data.score,
        data.safety_alert,
        `"${data.zusammenfassung.replace(/"/g, '""')}"`,
        data.linguistischer_fingerabdruck?.emotionale_validierung
    ];
    
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
