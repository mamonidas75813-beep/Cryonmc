import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Send,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface SupportPageProps {
  onShowToast: (msg: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onShowToast }) => {
  const { serverConfig } = useProducts();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketIgn, setTicketIgn] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How long does in-game package delivery take?',
      a: 'All purchases are processed instantly through our high-speed RCON plugin. Under ordinary circumstances, your perks, coins, keys, or tags will appear in-game in 30 to 60 seconds after your transaction confirms. Make sure you are logged onto the server or relog if an item is not yet visible.',
    },
    {
      q: 'What if I entered the wrong Minecraft username at checkout?',
      a: 'If you made a typo or submitted the wrong username, please do not initiate a chargeback (this leads to automatic network blacklisting). Open a ticket below or ping a Senior Administrator in our Discord server with your Order ID and receipt proof. We will transfer your package to your correct UUID.',
    },
    {
      q: 'Can ranks and perks be transferred between accounts?',
      a: 'Rank transfers are permitted on a case-by-case basis (such as moving from an unmigrated account to an official Microsoft account) with valid ownership verification through our Discord Support desk.',
    },
    {
      q: 'What payment methods and currencies are supported?',
      a: 'We accept Credit/Debit cards (Visa, MasterCard, American Express), PayPal, UPI & NetBanking (for INR ₹), and major Cryptocurrencies (Bitcoin, Ethereum, Litecoin, USDT). You can switch between USD, INR, EUR, and GBP in our website header anytime.',
    },
    {
      q: 'What is the server refund and chargeback policy?',
      a: 'All digital package purchases are final. Initiating a bank chargeback without contacting staff will trigger an automatic, permanent network-wide ban across our server lobbies, forums, and partner networks.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketIgn || !ticketEmail || !ticketMessage) return;
    setTicketSubmitted(true);
    onShowToast('Support ticket dispatched to staff queue!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
          ASSISTANCE &amp; KNOWLEDGE BASE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-['Rajdhani'] uppercase text-white tracking-wide">
          {serverConfig.serverName} Support Center
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Need help with in-game store delivery, account inquiries, or bug reports? Review our frequently asked questions or submit an expedited ticket.
        </p>
      </div>

      {/* Support Channels Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e1628] to-[#090e1a] border border-cyan-500/30 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Rajdhani'] uppercase text-white">
              Instant In-Game Delivery
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Automated RCON queue processes delivery within 60 seconds. Type <code className="text-cyan-300 font-mono">/shop</code> or <code className="text-cyan-300 font-mono">/keys</code> to check your virtual pouch.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-[#090e1a] border border-indigo-500/30 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Rajdhani'] uppercase text-white">
              24/7 Discord Live Desk
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Prefer instant chat? Senior moderators and payment admins are available around the clock on Discord.
            </p>
            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Open Discord Ticket</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black font-['Rajdhani'] uppercase text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0e1424] border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wide hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-850">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Ticket Form */}
      <div className="rounded-3xl bg-[#0e1424] border border-cyan-500/30 p-8 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            DIRECT INQUIRY
          </span>
          <h3 className="text-2xl font-black font-['Rajdhani'] uppercase text-white mt-1">
            Submit a Store Support Ticket
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Response times average under 4 hours. You will receive an email confirmation.
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-8 text-center rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
            <h4 className="text-lg font-bold text-white uppercase font-['Rajdhani']">
              Ticket Dispatched Successfully
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our administrative team has logged your inquiry. Check your email for updates or link your ticket reference in our Discord server.
            </p>
            <button
              onClick={() => {
                setTicketSubmitted(false);
                setTicketMessage('');
              }}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs uppercase"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minecraft Username (IGN) *
                </label>
                <input
                  type="text"
                  required
                  value={ticketIgn}
                  onChange={(e) => setTicketIgn(e.target.value)}
                  placeholder="e.g. Steve"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject / Reason *
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Typo in IGN for Order ORD-89241"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Message &amp; Order ID *
              </label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Include your Order ID, purchase timestamp, and any relevant transaction reference..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
