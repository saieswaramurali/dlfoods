import { Heart, Leaf, Award, Users } from 'lucide-react';
import faceOfBrandImage from '../assets/face_of_brand.jpeg';

export default function About() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "100% Natural",
      description: "Pure, natural ingredients formulated for women's health"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Quality",
      description: "FDA approved and quality tested for your safety"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Women-Focused",
      description: "Specifically designed for women 25+ wellness needs"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Support",
      description: "Backed by nutrition experts and health professionals"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to empowering women 25+ with premium nutrition products designed for your unique wellness journey.
          </p>
        </div>

        <div className="relative grid md:grid-cols-2 gap-16 items-center mb-16 px-8 py-12">
          {/* Background gradient for entire section - larger area */}
          <div className="absolute inset-0 bg-gradient-to-bl from-amber-300/40 via-orange-200/20 to-transparent rounded-3xl -mx-8 -my-8"></div>
          
          <div className="relative z-10 flex justify-center">
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src={faceOfBrandImage} 
                alt="Face of DL Foods Brand" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              At DL Foods, we understand the unique nutritional needs of women. We've created a line of products that support your vitality, energy, and overall wellness as you navigate life's journey.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every product is formulated with premium ingredients, rigorously tested, and designed to help you feel your best every single day.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4 p-6 rounded-xl hover:bg-amber-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
