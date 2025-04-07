import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'JN-Axios',
  description: '一个基于 Axios 的 HTTP 请求库封装',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            { text: '什么是 JN-Axios?', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '基本用法', link: '/guide/basic-usage' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: '错误处理', link: '/guide/error-handling' },
            { text: '请求配置', link: '/guide/configuration' },
            { text: '类型系统', link: '/guide/typescript' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '全局配置', link: '/api/' },
            { text: '请求方法', link: '/api/methods' },
            { text: '类型定义', link: '/api/types' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-username/jn-axios' }],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present',
    },
  },
});
