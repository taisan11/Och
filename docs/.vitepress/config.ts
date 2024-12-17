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
    nav: [
      { text: 'Document', link: '/docs' },
      { text: 'Develop', link: '/dev' }
    ],

    sidebar: {
      "/docs/": [
        { text: 'メインページ', link: '/docs/' },
        {
          text: 'コンセプト',
          items: [
            { text: 'Driverについて', link: '/docs/concepts/Driver' }
          ]
        },
        {
          text: "Deploy",
          items: [
            { text: "Deno", link: "/docs/deploy/deno" },
            {
              text: "Driver",
              items: [
                // {text:"Deno KV",link:"/docs/deploy/driver/deno_kv"}
                { text: "drizzle_driver", link: "/docs/deploy/drizzle_driver" }
              ]
            }
          ]
        }
      ],
      "/dev/": [
        { text: 'メインページ', link: '/dev/' },
        {
          text: 'Driver',
          items: [
            { text: 'Driverの作成', link: '/dev/driver/create' },
            { text: 'Driverのテスト', link: '/dev/driver/test' }
          ]
        },
        {
          text: 'Plugin',
          items: [
            { text: 'Pluginの仕組み', link: '/dev/plugin/what' },
            { text: 'Pluginの作り方', link: '/dev/plugin/make' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taisan11/Och' }
    ]
  }
})
