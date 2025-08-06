import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex bg-white/70  mx-auto flex-col items-center rounded-md text-center p-6 max-w-xs">
      <img src={icon} className="mb-4 text-3xl "/>
      <h3 className="text-xl font-semibold mb-2 text-c1">{title}</h3>
      <p className="text-gray-800">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: "https://shopmulmul.com/cdn/shop/files/4_120x-removebg-preview_706f170a-510d-4e31-8e17-7780ad198f0b.png?v=1718692667&width=210",
      title: 'OUR FABRICS',
      description: 'Made with love using only 100% vegan fabrics'
    },
    {
      icon: "https://shopmulmul.com/cdn/shop/files/2_180x-removebg-preview_c85f1246-5982-4676-8595-7fcded9af8c7.png?v=1718692725&width=340",
      title: 'EXPRESS DELIVERY',
      description: 'We love getting your order to you as soon as you choose your favourites'
    },
    {
      icon: "https://shopmulmul.com/cdn/shop/files/1_120x-removebg-preview_14f569ea-a676-486e-bfa8-bc1f124a0353.png?v=1718692777&width=250",
      title: 'HAPPINESS GUARANTEED',
      description: '100% money back guaranteed & easy exchanges. No questions asked'
    },
    {
      icon: "https://shopmulmul.com/cdn/shop/files/3_140x-removebg-preview_0962bf48-96c8-47ee-b633-2b5cc03a1779.png?v=1718692829&width=260",
      title: 'MADE IN INDIA',
      description: 'A brand of Indian values, we are made completely in India from thought to creation'
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid w-full grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;