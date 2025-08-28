import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const Stats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animate only once
    threshold: 0.3, // Trigger when 30% of the section is visible
  });

  const stats = [
    {
      value: 50,
      suffix: "+",
      title: "Trips recorded",
      description: "Capturing memories from all over the world",
    },
    {
      value: 20,
      suffix: "+",
      title: "Images uploaded",
      description: "Stunning photos from places around the globe",
    },
    {
      value: 1,
      suffix: "",
      title: "Countries explored",
      description: "By our community of avid travelers",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-10 bg-gray-100 dark:bg-gray-900 sm:py-16 lg:py-24"
    >
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
            Numbers tell our story
          </h2>
          <p className="mt-3 text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:mt-8">
            A snapshot of the amazing places our users have explored and the
            memories they've created with us.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-10 text-center lg:mt-24 sm:gap-x-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className="font-bold text-7xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                  {inView ? (
                    <CountUp start={0} end={stat.value} duration={2} />
                  ) : (
                    0
                  )}
                  {stat.suffix}
                </span>
              </h3>
              <p className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">
                {stat.title}
              </p>
              <p className="text-base mt-0.5 text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
