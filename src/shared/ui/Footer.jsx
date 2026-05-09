import React from "react";
import { Link } from "react-router-dom";
import kazuyaAvatar from '../../assets/kazuyaAvatar.png'

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
        
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-indigo-600 text-lg tracking-tight">
              QRIS Tool Generator
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Alat bantu untuk memodifikasi merchant dan membuat QRIS dinamis secara instan dan aman.
            </p>
          </div>

        
          <div className="flex flex-col md:items-center">
            <div>
              <h5 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">
                Resources
              </h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link 
                    to="https://github.com/Kazuya-Labs/ubah-data-qris" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors flex items-center gap-2"
                  >
                    <span>GitHub Repository</span>
                  </Link>
                </li>
                <li>
                  <Link to="https://github.com/Kazuya-Labs/ubah-data-qris/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                    Panduan Penggunaan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          
          <div className="flex flex-col md:items-end">
            <h5 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">
              Developed By
            </h5>
            <Link 
              to="https://github.com/Kazuya-Labs/ubah-data-qris" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-2 pr-4 rounded-full transition-all"
            >
              <img 
                src={kazuyaAvatar}
                alt="Kazuya Labs" 
                loading="lazy"
                className="w-8 h-8 rounded-full border border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                @Kazuya-Labs
              </span>
            </Link>
          </div>
        </div>

       
        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 uppercase tracking-widest">
          <p>© {currentYear} Kazuya-Labs. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
