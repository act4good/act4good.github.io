export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Act4good';
export const siteDescription =
  'Tecnologia open source al servizio delle comunità. Uniamo sviluppatori, maker e volontari per costruire progetti a impatto sociale.';
export const siteType = 'Organization'; // schema
export const locale = 'it_IT';
export const lang = 'it';
export const skipContent = 'Vai al contenuto';
// for the site content author, used in <head> meta and post h-card microformat
export const author = {
  name: 'Act4good',
  avatar: '/icon-512x512.png',
  fediverse: '',
  me: []
};
// for the site developer, used for footer credits and humans.txt info
export const creator = {
  name: 'Act4good',
  email: 'act4good.org@gmail.coom',
  website: 'http://act4good.org',
  social: ''
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#dd4462'; // used in manifest, for example primary color value
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  'Act4good – Tecnologia open source al servizio delle comunità. Progetti digitali a impatto sociale realizzati da volontari.'; // alt text for default meta image
export const blog = {
  // RSS feed
  name: 'Blog Act4good',
  description: 'Aggiornamenti, storie di impatto e guide tecniche dalla community di Act4good.',
  // feed links are looped over in the head. You may add more to the array.
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tag',
  tagMore: 'Altri tag:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Pagina',
  paginationPrevious: 'Precedente',
  paginationNext: 'Successivo',
  paginationNumbers: true
};
export const details = {
  aria: 'controlli sezione',
  expand: 'espandi tutto',
  collapse: 'comprimi tutto'
};
export const dialog = {
  close: 'Chiudi',
  next: 'Successivo',
  previous: 'Precedente'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Principale',
  ariaBottom: 'Complementare',
  ariaPlatforms: 'Piattaforme',
  drawerNav: false,
  subMenu: false
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const greenweb = {
  // https://carbontxt.org/
  disclosures: [
    {
      docType: 'sustainability-page',
      url: `${url}/sustainability/`,
      domain: domain
    }
  ],
  services: [{domain: 'netlify.com', serviceType: 'cdn'}]
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/about/', '/blog/', '/styleguide/'],
    globalIgnore: []
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'View this page on GitHub'
};
export const easteregg = true;
