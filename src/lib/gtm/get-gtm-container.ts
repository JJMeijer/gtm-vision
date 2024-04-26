export const getGtmContainer = async (svelteFetch: typeof fetch, id: string) => {
    try {
        const res = await svelteFetch(`https://www.googletagmanager.com/gtm.js?id=${id}`);

        if (!res.ok) {
            return null;
        }
        const script = await res.text();

        const match = script.match(/({\n"resource":\s{[\s\S]*?\n{3}});/);

        if (!match) {
            return null;
        }

        return match[1];
    } catch (err) {
        return null;
    }
};
