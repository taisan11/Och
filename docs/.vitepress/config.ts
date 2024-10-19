import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Och docs",
  description: "Document of Och",
  markdown: {config:(md) => {
    md.set({breaks:true})
  }},
  base:"/Och/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Document', link: '/docs' },
      { text: 'Develop', link: '/dev' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taisan11/Och' }
    ]
  }
})
