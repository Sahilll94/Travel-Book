import React from "react";

const About = () => {
  const cards = [
    {
      title: "Overview",
      description:
        "Travel-Book is an online platform designed to simplify the process of preserving your core travel memories and share it with your loved ones, with a user-friendly interface and a wide range of options.",
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-indigo-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 46 46"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45 29V23C45 10.85 35.15 1 23 1C10.85 1 1 10.85 1 23V29"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 29H1V41C1 43.209 2.791 45 5 45H13V29Z"
            fill="currentColor"
          />
          <path
            d="M45 29H33V45H41C43.209 45 45 43.209 45 41V29Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Future",
      description:
        "The platform will evolve with added features such as user reviews, personalized recommendations, and integration with popular travel APIs for better service.",
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 46 46"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M27 27H19V45H27V27Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 37H1V45H9V37Z" fill="currentColor" />
          <path d="M45 17H37V45H45V17Z" fill="currentColor" />
          <path d="M5 17L15 7L23 15L37 1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 1H37V10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Features",
      description:
        'The app lets users store travel memories as a diary, including a title, start date, image, detailed description, and visited locations. Users can update and share their memories by clicking "Update this story" and copying the link to their clipboard or sharing it on their Instagram story.',
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-yellow-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 42 42"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M41 1H1V41H41V1Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 7H7V20H18V7Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 26H7V35H18V26Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 7H24V35H35V7Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Technology",
      description:
        "Built with React, Node.js, and MongoDB, the platform ensures a fast and reliable experience for users to browse and book trips effortlessly.",
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-purple-500"
          fill="currentColor"
          viewBox="0 0 42 42"
        >
          <path d="M9.66667 25H6C3.23858 25 1 27.2386 1 30V37C1 39.7614 3.23858 42 6 42H36C38.7614 42 41 39.7614 41 37V30C41 27.2386 38.7614 25 36 25H31.8333C30.2685 25 29 26.2685 29 27.8333C29 29.3981 27.7315 30.6667 26.1667 30.6667H15.3333C13.7685 30.6667 12.5 29.3981 12.5 27.8333C12.5 26.2685 11.2315 25 9.66667 25Z" />
        </svg>
      ),
    },
    {
      title: "Security",
      description:
        "User data is securely handled with encryption protocols, ensuring personal information and payment details are kept private and safe from unauthorized access.",
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 46 42"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M30.562 18.4609C30.0511 17.9392 29.4292 17.5392 28.7426 17.2907C28.0559 17.0422 27.3221 16.9516 26.5956 17.0256C25.8692 17.0996 25.1687 17.3362 24.5462 17.718C23.9237 18.0998 23.3952 18.6169 23 19.2309C22.6049 18.6167 22.0764 18.0995 21.4539 17.7176C20.8315 17.3357 20.1309 17.099 19.4044 17.025C18.6779 16.951 17.944 17.0417 17.2573 17.2903C16.5706 17.5389 15.9488 17.939 15.438 18.4609C14.5163 19.4035 14.0002 20.6695 14.0002 21.9879C14.0002 23.3063 14.5163 24.5722 15.438 25.5149L23 33.1999L30.564 25.5159C31.485 24.5726 32.0004 23.3064 32 21.988C31.9997 20.6696 31.4835 19.4037 30.562 18.4609Z" />
        </svg>
      ),
    },
    {
      title: "Design",
      description:
        "The website uses modern, responsive design principles to ensure a seamless experience on desktops, tablets, and smartphones, with easy navigation.",
      icon: (
        <svg
          className="mx-auto w-12 h-12 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 44 44"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M25 7C34.941 7 43 15.059 43 25C43 34.941 34.941 43 25 43C15.059 43 7 34.941 7 25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 1C9.059 1 1 9.059 1 19H19V1Z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-4xl xl:text-5xl font-pj">
            About Travel-Book
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-8 font-pj">
            The web application lets you document and relive your memories effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:mt-20">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {card.icon}
              <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-gray-100 font-pj">
                {card.title}
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-pj">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
