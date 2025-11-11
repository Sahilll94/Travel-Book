import {
  BookOpen,
  FunctionSquare,
  FileSignature,
  TextSearchIcon,
  SquaresExcludeIcon,
  FileChartColumn,
} from "lucide-react";
const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Overview",
      description:
        "Travel-Book is an online platform designed to simplify the process of preserving your core travel memories and share it with your loved ones, with a user-friendly interface and a wide range of options.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: FunctionSquare,
      title: "Future",
      description:
        "The platform will evolve with added features such as user reviews, personalized recommendations, and integration with popular travel APIs for better service",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileSignature,
      title: "Features",
      description:
        'The app lets users store travel memories as a diary, including a title, start date, image, detailed description, and visited locations. Users can update and share their memories by clicking "Update this story" and copying the link to their clipboard or sharing it on their Instagram story.',
      gradient: "from-cyan-500 to-green-500",
    },
    {
      icon: TextSearchIcon,
      title: "Technology",
      description:
        "Built with React, Node.js, and MongoDB, the platform ensures a fast and reliable experience for users to browse and book trips effortlessly.",
      gradient: "from-green-500 to-yellow-500",
    },
    {
      icon: SquaresExcludeIcon,
      title: "Security",
      description:
        "User data is securely handled with encryption protocols, ensuring personal information and payment details are kept private and safe from unauthorized access.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: FileChartColumn,
      title: "Design",
      description:
        "The website uses modern, responsive design principles to ensure a seamless experience on desktops, tablets, and smartphones, with easy navigation.",
      gradient: "from-orange-500 to-red-500",
    },
  ];
  return (
    <>
      <section id="features" className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-black to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                About Travel-Book
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Travel-Book is your digital companion for preserving, sharing, and
              revisiting your travel experiences. Whether it's a weekend getaway
              or an international adventure, our platform helps you capture the
              essence of your journeys in an engaging, interactive format.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-200  dark:bg-black/50 backdrop-blur-sm border border-black/50 dark:border-white/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400 dark:hover:border-purple-500/30 transition-all duration-500 hover:scale-105"
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-700 group-hover:to-pink-500 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="dark:text-gray-400 text-gray-700 text-sm sm:text-base mb-5 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-14 sm:mt-16">
            <button className="text-sm sm:text-base bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <a href="/signup">Create Your Story</a>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
export default About;
