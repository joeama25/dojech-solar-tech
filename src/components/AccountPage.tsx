import React from 'react';
import { User, ShoppingBag, Clock, CheckCircle2, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { motion } from 'motion/react';

export const AccountPage: React.FC = () => {
  const { currentUser, signInWithGoogle, signOut, orders, settings } = useSolar();
  const userOrders = currentUser ? orders.filter(o => o.userId === currentUser.uid || o.customer.email === currentUser.email) : orders.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--paper)] min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3">Customer Portal</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-[var(--ink)] leading-[0.9]">Dashboard.</h1>
          </div>
          <div>
            {currentUser ? (
              <button onClick={signOut} className="px-8 py-3.5 bg-[var(--terracotta)] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#a84e2c] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Sign Out
              </button>
            ) : (
              <button onClick={signInWithGoogle} className="px-8 py-3.5 bg-[var(--forest)] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#16211b] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card (Forest Green) */}
          <div className="md:col-span-1 bg-[var(--forest)] rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white overflow-hidden mb-6 border-2 border-white/20">
                {currentUser?.photoURL ? <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-bold leading-tight">{currentUser?.displayName || 'Guest Customer'}</h2>
              <p className="text-xs text-white/60 mt-1">{currentUser?.email || 'Not signed in'}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sun)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </span>
            </div>
          </div>

          {/* Support Card (Sun Yellow) */}
          <div className="md:col-span-2 bg-[var(--sun)] rounded-3xl p-8 text-[var(--ink)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-black/5 rounded-full pointer-events-none" />
             <div className="relative z-10 max-w-sm">
               <h3 className="text-2xl font-bold mb-2">Need help with your order?</h3>
               <p className="text-xs text-[var(--ink)]/70 leading-relaxed">Our certified engineers are available on WhatsApp for sizing advice, order tracking, and technical audits.</p>
             </div>
             <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="relative z-10 shrink-0 px-6 py-3 bg-[var(--ink)] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-white hover:text-[var(--ink)] transition-colors flex items-center gap-2">
               <Phone className="w-3.5 h-3.5" /> Chat Support
             </a>
          </div>

          {/* Orders List (White Card spanning full width) */}
          <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-[var(--line)]">
            <h3 className="text-xl font-bold text-[var(--ink)] mb-8 flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[var(--copper)]" /> Order History ({userOrders.length})
            </h3>

            {userOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-[var(--sage)]">No orders found yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map(order => (
                  <div key={order.id} className="border border-[var(--line)] rounded-2xl p-6 hover:border-[var(--copper)] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--terracotta)]">REF: {order.reference}</span>
                        <p className="text-[10px] text-[var(--sage)] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.status === 'Payment Confirmed' || order.status === 'Delivered' ? 'bg-[var(--forest)]/10 text-[var(--forest)]' : 'bg-[var(--sun)]/20 text-[#a17022]'}`}>{order.status}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-[var(--paper)] p-4 rounded-xl">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--ink)] font-medium">{item.quantity}x {item.productName}</span>
                          <span className="font-bold text-[var(--sage)] tabular-nums">₦{item.subtotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm"><span className="text-[var(--sage)]">Total: </span><strong className="text-[var(--ink)] text-lg tabular-nums">₦{order.total.toLocaleString()}</strong></div>
                      <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Dojech Solar Tech! I am following up on Order Ref: ${order.reference}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--forest)] text-white hover:bg-[var(--copper)] text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors">
                        Follow Up <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};