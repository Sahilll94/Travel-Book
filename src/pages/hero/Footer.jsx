import logo from "../../assets/images/logo.png";
import { Globe } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { LuLinkedin, LuGithub } from "react-icons/lu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f172a] text-slate-300 font-sans border-t border-slate-800">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <a href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img src={logo} alt="Travel-Book" className="h-12 w-auto" />
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The Travel-Book was developed by <span className="font-semibold text-slate-200">SAHIL</span>, a dedicated developer and accomplished leader. Connect with him through the social links provided below.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { href: "https://sahilfolio.live/", icon: Globe, label: "Portfolio" },
                { href: "https://x.com/Sa_hilll94", icon: FaXTwitter, label: "X (Twitter)" },
                { href: "https://www.linkedin.com/in/sahilll94", icon: LuLinkedin, label: "LinkedIn" },
                { href: "https://github.com/Sahilll94", icon: LuGithub, label: "GitHub" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Create Account", href: "/signup" },
                { name: "Login", href: "/login" },
                { name: "Contributors", href: "/contributors" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Legal
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy-policy" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>© {currentYear} Travel-Book</p>
            <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></span>
            <p className="flex items-center gap-1">
              Developed by <a href="https://sahilfolio.live/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-300 hover:text-cyan-400 transition-colors">Sahil</a>
            </p>
          </div>

          <p className="flex items-center gap-1.5">
            Made with <span className="text-red-500 animate-pulse text-base">♥</span> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
