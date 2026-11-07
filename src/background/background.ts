import { captureVisibleTab, isCaptureRequest } from './capture-handler.js'

// Answers screenshot requests from the chat in the content script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isCaptureRequest(message)) return false

  void captureVisibleTab(
    {
      captureVisibleTab: (windowId, options) =>
        windowId === undefined
          ? chrome.tabs.captureVisibleTab(options)
          : chrome.tabs.captureVisibleTab(windowId, options)
    },
    sender.tab?.windowId
  ).then(sendResponse)
  return true
})
