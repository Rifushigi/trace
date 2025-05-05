export function getAvatarPublicId(url: string): string {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop()?.slice(0);

    return filename!;
}

export function getAvatarHostname(url: string): boolean {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    return hostname.includes('cloudinary');

}