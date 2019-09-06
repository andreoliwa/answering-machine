module.exports = {
  // https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/#deploying-to-a-path-on-github-pages
  pathPrefix: "/answering-machine",
  siteMetadata: {
    title: `Answering Machine`,
    description: `Create a custom email message from a list of sentences.`,
    author: `@andreoliwa`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `answering-machine`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    // https://github.com/bskimball/gatsby-plugin-antd
    `gatsby-plugin-antd`,
    // https://www.gatsbyjs.org/packages/gatsby-plugin-material-ui/
    `gatsby-plugin-material-ui`,
  ],
}
