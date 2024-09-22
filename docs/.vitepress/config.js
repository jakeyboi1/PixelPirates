//import { getSidebar } from "vitepress-plugin-auto-sidebar";

export default {
  base: "/PixelPirates/",
  title: "Pixel Pirates",
  description: "A site dedicated to everything game hacking!",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Pixel Pirates",
    outline: "deep",
    nav: [
      { text: "Home", link: "/" },
      {
        text: 'Content',
        items: [
          { text: 'Writeups', link: '/writeups/intro' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/jakeyboi1" }
    ],
    sidebar: {
      '/writeups/': [
        { text: "Intro", link: "/writeups/intro" },
        {
          text: "Unity",
          collapsed: true,
          items: [
            {
              text: "Hacking Mono Games",
              collapsed: true,
              items: [
                { text: "Step 1: Introduction", link: "/writeups/unity/hackingmonogames/introduction.md" },
                { text: "Step 2: Making our DLL Injector", link: "/writeups/unity/hackingmonogames/dllinjector.md" },
                { text: "Step 3: Making our Mono Loader", link: "/writeups/unity/hackingmonogames/monoloader.md" },
                { text: "Step 4: Making our Cheat DLL", link: "/writeups/unity/hackingmonogames/cheatdll.md" },
                { text: "Step 5: Injecting Our Cheat", link: "/writeups//unity/hackingmonogames/injectingcheat.md" }
              ]
            }
          ]
        }
      ]
    },
    footer: {
      message: "Released under the GNU General Public License v3.0.",
      copyright: "Copyright © 2022-present Pixel Pirates",
    },
  },
};
