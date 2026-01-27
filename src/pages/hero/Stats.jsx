import { motion } from "framer-motion";

const Stats = () => {
  const stats = [
    { value: "50+", label: "Trips recorded", sub: "Capturing global memories" },
    { value: "20+", label: "Images uploaded", sub: "Stunning global photos" },
    { value: "1", label: "Countries explored", sub: "By our growing community" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Numbers tell our story</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">A snapshot of the amazing places our users have explored.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} className="text-center p-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/50 hover:shadow-xl transition-all group">
            <h3 className="text-6xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">{stat.value}</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{stat.label}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">{stat.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Stats;