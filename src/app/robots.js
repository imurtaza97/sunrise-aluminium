export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '*',
        disallow: '/admin/*',
      },
      sitemap: 'https://sunrisealuminium.in/sitemap.xml',
    }
  }