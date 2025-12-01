import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Nourish Your Body,
              <span className="text-amber-700"> Empower Your Life</span>
            </h1>
            <p className="text-xl text-gray-600">
              Premium nutrition designed specifically for women 25+. Support your wellness, vitality, and confidence every day.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-lg">
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors shadow-lg border-2 border-amber-600">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Desktop: 16:9 aspect ratio, Mobile: 4:3 aspect ratio */}
            <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl shadow-2xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-6xl">🥗</div>
                <p className="text-gray-500 text-sm">Hero Image Placeholder</p>
                <div className="text-xs text-gray-400 mt-2">
                  <div className="md:hidden">Mobile: 4:3 ratio</div>
                  <div className="hidden md:block">Desktop: 16:9 ratio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}