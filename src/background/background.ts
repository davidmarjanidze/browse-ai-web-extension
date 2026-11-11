import { captureVisibleTab, isCaptureRequest } from './capture-handler.js'
import { isOpenTabRequest, openTab } from './open-tab-handler.js'

// Answers screenshot and open-tab requests from the chat in the content script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (isOpenTabRequest(message)) {
    void openTab(
      { create: (properties) => chrome.tabs.create(properties) },
      message,
      sender.tab
    ).then(sendResponse)
    return true
  }
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
