(async () => {
    const allCookies = await chrome.cookies.getAll({});
    const cookiesByDomain = {};

    for (const cookie of allCookies) {
    const domain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
    cookiesByDomain[domain] = cookiesByDomain[domain] || [];
    cookiesByDomain[domain].push({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: cookie.expirationDate
    });
    }

    const blob = new Blob([JSON.stringify(cookiesByDomain, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
    url: url,
    filename: 'cookies.json',
    saveAs: false
    });
})();
