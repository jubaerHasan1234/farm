import HeroSearch from "./HeroSearch";
const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh from Farm to Your Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Connect directly with local farmers and get the freshest produce
            delivered to your doorstep
          </p>

          {/* Search Bar */}
          <HeroSearch />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-green-200">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2000+</div>
              <div className="text-green-200">Fresh Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-green-200">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
