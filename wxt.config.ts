import { defineConfig } from 'wxt';
import pkg from './package.json';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'arcoblue-6': '#2C3E50',
          },
        },
      },
    },
  }),
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Wxt Plugin Template',
    version: pkg.version,
    description: '基于 Wxt 构建的自定义模板，引入了一些特性。',
    permissions: ['storage'],
    host_permissions: ['http://*/*', 'https://*/*'],
  },
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      if (wxt.config.command === 'serve') {
        manifest.content_scripts ??= [];
        manifest.content_scripts.push({
          matches: ["*://*/*"],
          js: ['content-scripts/content.js'],
          css: ['content-scripts/content.css']
        });
      }
    }
  }
});
