chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "https://daridis.com/colorpal/onboarding",
    });
  }
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.scheme === "dark" || request.scheme === "light")
    chrome.action.setIcon({
      path: {
        "16": `icons/icon16${request.scheme}.png`,
        "32": `icons/icon16${request.scheme}.png`,
        "48": `icons/icon16${request.scheme}.png`,
        "128": `icons/icon16${request.scheme}.png`,
      },
    });
});
