import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'JN-Axios',
  description: '基于 Axios 的 HTTP 请求封装库',
  lang: 'zh-CN',
  themeConfig: {
    siteTitle: 'JN-Axios',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '基本用法', link: '/guide/basic-usage' },
            { text: '错误处理', link: '/guide/error-handling' },
            { text: '配置选项', link: '/guide/configuration' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础请求', link: '/examples/basic' },
            { text: '错误处理', link: '/examples/error-handling' },
            { text: '高级配置', link: '/examples/advanced' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-username/jn-axios' }],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: `Copyright © ${new Date().getFullYear()}-present`,
    },
  },
});
