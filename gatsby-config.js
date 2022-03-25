module.exports = {
  pathPrefix: "/ppla/",
  siteMetadata: {
    title: `Pla Saengduen's tools`,
    siteUrl: `https://e23thr.github.io/ppla/`,
  },
  plugins: ["gatsby-plugin-sass", "gatsby-plugin-react-helmet", "gatsby-plugin-sitemap", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  }]
};