export const getGtmContainer = async (id: string) => {
    try {
        const res = await fetch(`https://www.googletagmanager.com/gtm.js?id=${id}`);

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
