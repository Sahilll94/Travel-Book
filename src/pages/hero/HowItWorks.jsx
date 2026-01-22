import React from 'react';

const HowItWorks = () => {
    return (
        <section className="py-10 bg-white dark:bg-gray-900 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">How does it work?</h2>
                    <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">Easily manage your travel details by following these simple steps, from creating your account to saving your planned trips.</p>
                </div>

                <div className="relative mt-12 lg:mt-20">
                    <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                        <img className="w-full opacity-70 dark:opacity-30" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" loading="lazy" alt="" />
                    </div>

                    <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
                        <div>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full shadow">
                                <span className="text-xl font-semibold text-gray-700 dark:text-gray-200"> 1 </span>
                            </div>
                            <h3 className="mt-6 text-xl font-semibold leading-tight text-black dark:text-white md:mt-10">Create a free account</h3>
                            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">Sign up for a free account and get started on planning your next amazing trip.</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full shadow">
                                <span className="text-xl font-semibold text-gray-700 dark:text-gray-200"> 2 </span>
                            </div>
                            <h3 className="mt-6 text-xl font-semibold leading-tight text-black dark:text-white md:mt-10">Add your trip details</h3>
                            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">Enter the location, date, and other details of your trip. Plan your documentation of memories in just a few simple steps.</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full shadow">
                                <span className="text-xl font-semibold text-gray-700 dark:text-gray-200"> 3 </span>
                            </div>
                            <h3 className="mt-6 text-xl font-semibold leading-tight text-black dark:text-white md:mt-10">Save & Launch</h3>
                            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">Save your trip details and share your documentaries with friends or colleagues via the link and also on instagram story. Your memories are now ready to go!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
