"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/store/toastStore";

export default function WalletPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawing(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    toast.success("Withdrawal request submitted successfully!");
    setAmount("");
    setIsWithdrawing(false);
  };

  const transactions = [
    { id: 1, type: "Payout", amount: "-$450.00", date: "Oct 28, 2026", status: "Completed" },
    { id: 2, type: "Ticket Sale", amount: "+$85.00", date: "Oct 27, 2026", status: "Completed" },
    { id: 3, type: "Ticket Sale", amount: "+$120.00", date: "Oct 26, 2026", status: "Completed" },
    { id: 4, type: "Platform Fee", amount: "-$12.50", date: "Oct 26, 2026", status: "Completed" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Creator Wallet</h1>
        <p className="text-white/50 mt-2">Manage your earnings, view transactions, and request payouts.</p>
      </div>

      {/* Balance Cards Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative overflow-hidden rounded-2xl border border-white/10 p-6 flex flex-col justify-between"
           style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(168,85,247,0.1))" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-white/60 font-medium">Available Balance</span>
            <div className="p-2 bg-primary/20 rounded-xl">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold text-white">$1,240.00</h2>
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> +12.5% from last month
            </p>
          </div>
        </motion.div>

        {/* Pending Clearance Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-white/60 font-medium">Pending Clearance</span>
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">$320.50</h2>
            <p className="text-sm text-white/40 mt-2">Expected within 3-5 days</p>
          </div>
        </motion.div>

        {/* Lifetime Earnings Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-white/60 font-medium">Lifetime Earnings</span>
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">$8,450.00</h2>
            <p className="text-sm text-white/40 mt-2">Across 12 hosted events</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ledger */}
        <div className="lg:col-span-2">
           <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
           <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             {transactions.map((tx, idx) => (
               <div 
                 key={tx.id} 
                 className={`flex items-center justify-between p-4 ${idx !== transactions.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}
               >
                 <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-xl ${tx.amount.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.amount.startsWith('+') ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="font-semibold text-white">{tx.type}</p>
                     <p className="text-xs text-white/40">{tx.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>{tx.amount}</p>
                   <p className="text-xs text-white/40">{tx.status}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Payout Action */}
        <div>
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-2">Request Payout</h3>
              <p className="text-sm text-white/50 mb-6">Withdraw funds directly to your connected bank account.</p>

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                    <input 
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing || !amount}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                    color: "white"
                  }}
                >
                  {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                </button>
              </form>
              
              <p className="text-xs text-center text-white/40 mt-4">
                Standard processing time is 2-3 business days.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
