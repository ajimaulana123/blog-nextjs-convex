import Link from "next/link";
import { Banana } from 'lucide-react';

export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge/Status */}
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full outline outline-primary text-md text-primary font-bold">
            <span className="w-2 h-2 mr-2 bg-primary rounded-full animate-pulse "></span>
            Next.js 16 - Live Production
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Selamat Datang di
            <span className="block text-primary mt-2">Blog Artikel <Banana className="inline" size={50} /> </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Tempat di mana ide-ide brilian bertemu dengan teknologi mutakhir.
            Eksplorasi artikel mendalam tentang development, design, dan inovasi digital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/blog"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Jelajahi Artikel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}