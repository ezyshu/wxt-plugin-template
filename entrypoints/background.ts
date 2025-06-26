export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendData') {
    // 查询所有打开的标签页
    browserAPI.tabs.query({ url: '*' }, (tabs) => {
      tabs.forEach((tab) => {
        browserAPI.tabs.sendMessage(tab.id, {
          action: 'setData',
          data: request.data
        });
      });
    });
  }
});

// 进入 options 分享页面
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open_options_page') {
    const extensionURL = browserAPI.runtime.getURL('options.html');
    browserAPI.tabs.create({ url: extensionURL });
  }
});

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'webdav') {
    const { method, url, headers, data } = request;
    
    fetch(url, {
      method: method,
      headers: headers,
      body: data || undefined
    })
    .then(async response => {
      const text = await response.text();
      sendResponse({
        status: response.status,
        statusText: response.statusText,
        data: text
      });
    })
    .catch(error => {
      sendResponse({
        error: error.message
      });
    });
    
    return true; // 保持消息通道打开
  }
});