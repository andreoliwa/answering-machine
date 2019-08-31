import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Sentences from "../components/sentences"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Sentences />
  </Layout>
)

export default IndexPage
