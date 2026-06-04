export const maskSensitiveData = (text: string): string => {
    return text
        .replace(/\b([A-Z][a-z]+)\s([A-Z][a-z]+)\b/g, '[NAME]')
        .replace(/\b\d{2,}\.?\d*\b/g, '[NUMBER]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
};

export const maskAnalysisData = (data: any): any => {
    if (typeof data === 'string') {
        return maskSensitiveData(data);
    } else if (Array.isArray(data)) {
        return data.map(item => maskAnalysisData(item));
    } else if (typeof data === 'object' && data !== null) {
        const masked: any = {};
        for (const key in data) {
            masked[key] = maskAnalysisData(data[key]);
        }
        return masked;
    }
    return data;
};
