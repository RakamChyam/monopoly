export default class CookieManager {
    public static parse(cookies: string | undefined | null): Record<string, string> {
        if (!cookies) return {};

        return cookies
            .split(';')
            .reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                if (name && value) {
                    acc[name] = decodeURIComponent(value);
                }
                return acc;
            }, {} as Record<string, string>);
    }
}