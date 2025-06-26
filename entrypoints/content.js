import './app.less';
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-plugin-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(App);
        app.mount(container);
      },
      onRemove: (app) => {
        app?.unmount();
      }
    });
    ui.mount();
  }
});
