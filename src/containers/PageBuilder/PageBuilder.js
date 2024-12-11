import React from 'react';

import { IconSpinner, LayoutComposer } from '../../components/index.js';

import { validProps } from './Field';

import SectionBuilder from './SectionBuilder/SectionBuilder.js';
import StaticPage from './StaticPage.js';

import css from './PageBuilder.module.css';

import Logo from '../../styles/icons/logo/colablogo.png';

const getMetadata = (meta, schemaType, fieldOptions) => {
  const { pageTitle, pageDescription, socialSharing } = meta;

  // pageTitle is used for <title> tag in addition to page schema for SEO
  const title = validProps(pageTitle, fieldOptions)?.content;
  // pageDescription is used for different <meta> tags in addition to page schema for SEO
  const description = validProps(pageDescription, fieldOptions)?.content;
  // Data used when the page is shared in social media services
  const openGraph = validProps(socialSharing, fieldOptions);
  // We add OpenGraph image as schema image if it exists.
  const schemaImage = openGraph?.images1200?.[0]?.url;
  const schemaImageMaybe = schemaImage ? { image: [schemaImage] } : {};
  const isArticle = ['Article', 'NewsArticle', 'TechArticle'].includes(schemaType);
  const schemaHeadlineMaybe = isArticle ? { headline: title } : {};

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org (This template uses JSON-LD format)
  //
  // In addition to this schema data for search engines, src/components/Page/Page.js adds some extra schemas
  // Read more about schema:
  // - https://schema.org/
  // - https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data
  const pageSchemaForSEO = {
    '@context': 'http://schema.org',
    '@type': schemaType || 'WebPage',
    description: description,
    name: title,
    ...schemaHeadlineMaybe,
    ...schemaImageMaybe,
  };

  return {
    title,
    description,
    schema: pageSchemaForSEO,
    socialSharing: openGraph,
  };
};

const LoadingSpinner = () => {
  return (
    <div className={css.loading}>
      <IconSpinner />
    </div>
  );
};

//////////////////
// Page Builder //
//////////////////

/**
 * PageBuilder can be used to build content pages using page-asset.json.
 *
 * Note: props can include a lot of things that depend on
 * - pageAssetsData: json asset that contains instructions how to build the page content
 *   - asset should contain an array of _sections_, which might contain _fields_ and an array of _blocks_
 *     - _blocks_ can also contain _fields_
 * - fallbackPage: component. If asset loading fails, this is used instead.
 * - options: extra mapping of 3 level of sub components
 *   - sectionComponents: { ['my-section-type']: { component: MySection } }
 *   - blockComponents: { ['my-component-type']: { component: MyBlock } }
 *   - fieldComponents: { ['my-field-type']: { component: MyField, pickValidProps: data => Number.isInteger(data.content) ? { content: data.content } : {} }
 *     - fields have this pickValidProps as an extra requirement for data validation.
 * - pageProps: props that are passed to src/components/Page/Page.js component
 *
 * @param {Object} props
 * @returns page component
 */
const PageBuilder = props => {
  const {
    pageAssetsData,
    inProgress,
    error,
    fallbackPage,
    schemaType,
    options,
    ...pageProps
  } = props;

  if (!pageAssetsData && fallbackPage && !inProgress && error) {
    return fallbackPage;
  }

  // Page asset contains UI info and metadata related to it.
  // - "sections" (data that goes inside <body>)
  // - "meta" (which is data that goes inside <head>)
  const { sections = [], meta = {} } = pageAssetsData || {};
  const pageMetaProps = getMetadata(meta, schemaType, options?.fieldComponents);

  const layoutAreas = `
    topbar
    main
    footer
  `;
  return (
    <StaticPage {...pageMetaProps} {...pageProps}>
      <LayoutComposer areas={layoutAreas} className={css.layout}>
        {props => {
          return (
            <div className={css.container}>
              <div className={css.header}>
                <div className={css.wrapper}>
                  <img src={Logo} alt="logo" sizes="100" />
                  <a href="/s">Explore</a>
                  <span>Dashboard</span>
                  <span>Contact Us</span>
                </div>
                <div className={css.wrapper} style={{ height: '100%' }}>
                  <button className={css.button}>Sign Up</button>
                  <button className={css.button}>Login</button>
                </div>
              </div>
              <div className={css.contents}>
                <div className={css.banner}>
                  <h1 className={css.bannerTitle}>
                    We empower collaboration to turn ideas into reality.
                  </h1>
                  <div className={css.searchBarArea}>
                    <input type="text" placeholder="Search" className={css.searchBar} />
                    <button className={css.searchButton}>🔍</button>
                  </div>
                  <div className={css.circle1}></div>
                  <div className={css.circle2}></div>
                  <div className={css.circle3}></div>
                  <div className={css.circle4}></div>
                  <div className={css.circle5}></div>
                </div>
                <ul className={css.carousells}>
                  <li className={css.carousellContent}>Popular</li>
                  <li className={css.carousellContent}>Popular</li>
                  <li className={css.carousellContent}>Popular</li>
                  <li className={css.carousellContent}>Popular</li>
                </ul>
                <div className={css.description}>
                  <h1 className={css.heading}>
                    Unite innovators to bring groundbreaking ideas to life.
                  </h1>
                  <p style={{ width: '85%', fontSize: '20px' }}>
                    At Colab, connect with like-minded creators to explore, build, and grow
                    together. Join collaborative projects, contribute your unique skills, and shape
                    a future where innovation thrives through teamwork. Start building your journey
                    today!
                  </p>
                </div>
                <div>
                  <div className={css.bentoContainer}>
                    <div className={`${css.card} ${css.card1}`}>
                      <h3>Title</h3>
                      <p>
                        At Colab, connect with like-minded creators to explore, build, and grow
                        together. Join collaborative projects, contribute your unique skills, and
                        shape a future where innovation thrives through teamwork. Start building
                        your journey today!
                      </p>
                    </div>
                    <div className={`${css.card} ${css.card2}`}>
                      <h3>Title</h3>
                      <p>
                        At Colab, connect with like-minded creators to explore, build, and grow
                        together. Join collaborative projects, contribute your unique skills, and
                        shape a future where innovation thrives through teamwork. Start building
                        your journey today!
                      </p>
                    </div>
                    <div className={`${css.card} ${css.card3}`}>
                      <h3>Title</h3>
                      <p>
                        At Colab, connect with like-minded creators to explore, build, and grow
                        together. Join collaborative projects, contribute your unique skills, and
                        shape a future where innovation thrives through teamwork. Start building
                        your journey today!
                      </p>
                    </div>
                    <div className={`${css.card} ${css.card4}`}>
                      <h3>Title</h3>
                      <p>
                        At Colab, connect with like-minded creators to explore, build, and grow
                        together. Join collaborative projects, contribute your unique skills, and
                        shape a future where innovation thrives through teamwork. Start building
                        your journey today!
                      </p>
                    </div>
                    <div className={`${css.card} ${css.card5}`}>
                      <h3>Title</h3>
                      <p>
                        At Colab, connect with like-minded creators to explore, build, and grow
                        together. Join collaborative projects, contribute your unique skills, and
                        shape a future where innovation thrives through teamwork. Start building
                        your journey today!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </LayoutComposer>
    </StaticPage>
  );
};

export { LayoutComposer, StaticPage, SectionBuilder };

export default PageBuilder;
