import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
const inter = Inter({ subsets: ["latin"] });
import { UserProvider } from "@/context/UserContext";

const GA_TRACKING_ID = 'G-WMS0YMKF8R';
export const metadata = {
  title: "Sunrise Aluminium - Viramgam",
  description: "Sunrise Aluminium offers premium aluminum sections and glass work around viramgam and ahmedabad.",
  keywords:"Sunrise Aluminium, Aluminium Section, Glass work, Aluminium Section supplier, Aluminium Section Near Ahmedabad, Aluminium Section Near Viramgam, Aluminium Section in Viramgam, Ahmedabad, Sanand, Mandal, Detroj, Dasada, Surendranagar, Gujarat,",
  
  icons: {
    icon: "/images/bg_sun.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
