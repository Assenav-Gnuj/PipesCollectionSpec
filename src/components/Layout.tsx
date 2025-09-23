import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function Layout({
  children,
  title = 'Cachimbos & Tabacos - Coleção Premium',
  description = 'Uma coleção cuidadosamente curada de cachimbos, tabacos e acessórios premium. Compartilhando a paixão pela arte do fumo de cachimbo.',
  keywords = 'cachimbos, tabacos, coleção, premium, fumo, pipe, tobacco',
  image = '/images/og-image.jpg',
  url = 'https://www.cachimbosetabacos.com.br'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="Cachimbos & Tabacos" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Portuguese" />
        <meta name="author" content="Cachimbos & Tabacos" />
        <meta name="copyright" content="Cachimbos & Tabacos" />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#d97706" />
        <meta name="msapplication-TileColor" content="#d97706" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}