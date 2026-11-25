// The site's public address, used for link previews, the sitemap and canonical URLs.
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the project's main production domain,
// so this follows the switch from jdtripp-portfolio.vercel.app to jdtripp.com by itself.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = productionHost ? `https://${productionHost}` : "http://localhost:3000";
