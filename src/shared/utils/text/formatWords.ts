export function pluralize(count: number, forms: [one: string, few: string, many: string]): string {
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) {
        return forms[2];
    }
    const mod10 = count % 10;
    if (mod10 === 1) {
        return forms[0];
    }
    if (mod10 >= 2 && mod10 <= 4) {
        return forms[1];
    }
    return forms[2];
}

export function formatWords(count: number, forms: [one: string, few: string, many: string]): string {
    return `${count} ${pluralize(count, forms)}`;
}
