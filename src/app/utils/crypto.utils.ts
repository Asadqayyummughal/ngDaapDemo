export function formatURL(url: string, maxLength: number = 25): string {
    try {
        const cleanURL = url.replace(/(^\w+:|^)\/\//, '');
        return cleanURL.length > maxLength ? cleanURL.substring(0, maxLength) + '...' : cleanURL;
    } catch {
        return url;
    }
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Clipboard copy failed', err);
        return false;
    }
}
