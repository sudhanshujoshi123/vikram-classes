import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Vikram Classes - System Maintenance",
  description: "Vikram Classes is temporarily unavailable due to database storage limit.",
  metadataBase: new URL("https://vikramclasses.com"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Maintenance Mode - Sabhi pages ko block karo
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Maintenance Page - Sabhi routes pe yahi dikhega */}
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
          <div className="max-w-3xl w-full bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
            
            {/* Top Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>

            <div className="p-8 md:p-12">
              {/* Header Section */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex-shrink-0 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    System Notice: Storage Limit Reached
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Database capacity threshold exceeded
                  </p>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-6">
                <p className="text-slate-300 text-lg leading-relaxed">
                  Our primary database has reached its maximum storage capacity. 
                  To maintain data integrity and system stability, certain operations 
                  have been temporarily suspended.
                </p>

                {/* Impact List */}
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 space-y-4">
                  <h2 className="text-white font-semibold text-lg mb-4">Current System Status</h2>
                  
                  <div className="flex items-start space-x-3">
                    <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-red-500"></span>
                    <div>
                      <p className="text-white font-medium">Data Storage Suspended</p>
                      <p className="text-slate-400 text-sm mt-0.5">
                        The system is currently unable to store new records, files, or user data.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-red-500"></span>
                    <div>
                      <p className="text-white font-medium">Transactions Halted</p>
                      <p className="text-slate-400 text-sm mt-0.5">
                        All financial and system transactions have been paused to prevent data loss or corruption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-amber-500"></span>
                    <div>
                      <p className="text-white font-medium">Read-Only Mode Active</p>
                      <p className="text-slate-400 text-sm mt-0.5">
                        Existing data remains accessible, but no modifications can be made at this time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resolution / Action */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
                  <h3 className="text-blue-400 font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Next Steps
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Our engineering team has been notified and is actively working on expanding 
                    the database capacity and optimizing storage. Services will be fully restored 
                    once the upgrade is complete.
                  </p>
                </div>

                {/* Contact Section */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm mb-3">
                    For urgent inquiries or support regarding pending transactions, please contact our technical team:
                  </p>
                  <a 
                    href="mailto:dmp@gmail.com" 
                    className="inline-flex items-center justify-center w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support.dmp@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-950/50 px-8 py-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
              <p>© {new Date().getFullYear()} Vikram Classes. All rights reserved.</p>
              <p className="mt-2 md:mt-0">System Status: Critical</p>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}