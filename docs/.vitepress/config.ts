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
      { text: 'メインページ', link: '/docs/' },
      {
        text: 'コンセプト',
        items: [
          { text: 'Driverについて', link: '/docs/concepts/Driver' }
        ]
      },
      {
        text:"Deploy",
        items:[
          {text:"Deno",link:"/docs/deploy/deno"},
          {text:"Driver",
            items:[
              // {text:"Deno KV",link:"/docs/deploy/driver/deno_kv"}
              {text:"drizzle_driver",link:"/docs/deploy/drizzle_driver"}
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taisan11/Och' }
    ]
  }
})
