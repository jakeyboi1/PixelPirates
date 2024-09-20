import { getSidebar } from "vitepress-plugin-auto-sidebar";

export default {
  base: "/PixelPirates/",
  title: "Pixel Pirates",
  description: "A site dedicated to everything game hacking!",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    //logo: "/logo.svg",
    editLink: {
      pattern: "https://github.com/AndrewR3K/vitepress-boilerplate/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
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
            { text: "Hacking Mono Games", link: "/writeups/unity/hackingmonogames.md" }
          ],
        }
      ]
    },
    footer: {
      message: "Released under the GNU General Public License v2.0.",
      copyright: "Copyright © 2022-present Vitepress Boilerplate",
    },
  },
};
