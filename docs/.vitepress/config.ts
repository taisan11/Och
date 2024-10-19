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
        text: 'concepts',
        items: [
          { text: 'Main Concepts', link: '/docs/' },
        ]
      },
      {
        text:"Deploy",
        items:[
          {text:"Deno",link:"/docs/deploy/deno"}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taisan11/Och' }
    ]
  }
})
