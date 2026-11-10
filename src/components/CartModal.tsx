import React, { useState } from 'react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Phone, CheckCircle2, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSolar } from '../context/SolarContext';
import { CustomerDetails, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const {
    cart, updateCartQuantity, removeFromCart, cartSubtotal, cartTotalCount, settings, createWhatsAppOrder
  } = useSolar();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '', phone: '', email: '', address: '', city: 'Lagos', state: 'Lagos State', notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

    const grandTotal = cartSubtotal;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Required';
    if (!customer.phone.trim() || customer.phone.length < 10) errors.phone = 'Required';
    if (!customer.address.trim()) errors.address = 'Required';
    if (!customer.city.trim()) errors.city = 'Required';
    if (!customer.state.trim()) errors.state = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { order, whatsappUrl } = await createWhatsAppOrder(customer);
      setCreatedOrder(order);
      setStep('success');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A86A3D', '#C8653B', '#E8A33A', '#1F2D24']
      });

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setStep('cart'); onClose(); }}
            className="absolute inset-0 bg-[var(--ink)]/70 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[var(--paper)] h-full flex flex-col shadow-2xl overflow-hidden border-l border-[var(--line)]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--line)] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--copper)]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--ink)]">
                  {step === 'cart' ? `Cart (${cartTotalCount})` : step === 'checkout' ? 'Checkout' : 'Order Initiated'}
                </h2>
              </div>
              <button onClick={() => { setStep('cart'); onClose(); }} className="p-2 text-[var(--sage)] hover:text-[var(--ink)] rounded-full hover:bg-[var(--paper)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* STEP 1: CART */}
              {step === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--line)]/50 flex items-center justify-center text-[var(--sage)]">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-[var(--ink)]">Your cart is empty</h3>
                      <p className="text-xs text-[var(--sage)] max-w-xs">Explore our solar solutions and start building your energy independence.</p>
                      <button onClick={() => { onClose(); onNavigate('shop'); }} className="mt-2 px-6 py-3 bg-[var(--ink)] text-[var(--paper)] font-bold text-[10px] uppercase tracking-wider rounded-md hover:bg-[var(--forest)] transition-colors">
                        Browse Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[var(--line)]">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-contain bg-[var(--paper)] rounded-md p-1 border border-[var(--line)] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[var(--ink)] truncate">{item.product.name}</h4>
                            <div className="text-xs font-bold text-[var(--copper)] tabular-nums mt-1">₦{item.product.price.toLocaleString()}</div>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center border border-[var(--line)] rounded-md bg-white">
                                <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:text-[var(--terracotta)] text-[var(--sage)]"><Minus className="w-3 h-3" /></button>
                                <span className="px-2 text-xs font-bold text-[var(--ink)] tabular-nums">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:text-[var(--terracotta)] text-[var(--sage)]"><Plus className="w-3 h-3" /></button>
                              </div>
                              <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-[var(--sage)] hover:text-rose-500 ml-auto transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CHECKOUT FORM */}
              {step === 'checkout' && (
                <form id="checkout-form" onSubmit={handleProceedToWhatsApp} className="space-y-5">
                  <div className="p-4 bg-[var(--forest)] rounded-lg text-xs text-[var(--paper)]">
                    <p className="font-bold uppercase tracking-wider mb-1 flex items-center gap-2 text-[var(--sun)]">
                      <ShieldCheck className="w-4 h-4" /> Secure WhatsApp Checkout
                    </p>
                    <p className="opacity-80 leading-relaxed text-[11px]">
                      Payment is verified directly via bank transfer on WhatsApp. No card details required.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">Full Name *</label>
                    <input type="text" required value={customer.fullName} onChange={e => setCustomer({ ...customer, fullName: e.target.value })} placeholder="e.g. Babatunde Adeleke" className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                    {formErrors.fullName && <p className="text-[10px] text-rose-500 mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">Phone *</label>
                      <input type="tel" required value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="0803 123 4567" className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                      {formErrors.phone && <p className="text-[10px] text-rose-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">Email (Opt)</label>
                      <input type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} placeholder="you@example.com" className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">Delivery Address *</label>
                    <textarea rows={2} required value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} placeholder="Street Address, Landmark" className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                    {formErrors.address && <p className="text-[10px] text-rose-500 mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">City *</label>
                      <input type="text" required value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })} className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-1">State *</label>
                      <input type="text" required value={customer.state} onChange={e => setCustomer({ ...customer, state: e.target.value })} className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--line)] rounded-md focus:ring-1 focus:ring-[var(--copper)] focus:border-[var(--copper)] focus:outline-none" />
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 'success' && createdOrder && (
                <div className="text-center py-4 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--forest)]/10 text-[var(--forest)] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--terracotta)] uppercase tracking-widest block mb-1">REF: {createdOrder.reference}</span>
                    <h3 className="text-lg font-bold text-[var(--ink)]">Order Initiated</h3>
                    <p className="text-xs text-[var(--sage)] mt-2 leading-relaxed">Your order is pending confirmation. Please send the message on WhatsApp to complete your payment and delivery.</p>
                  </div>

                  <div className="bg-white border border-[var(--line)] rounded-lg p-5 text-left text-xs space-y-3 shadow-sm">
                    <div className="flex justify-between border-b border-[var(--line)] pb-2">
                      <span className="text-[var(--sage)]">Total Items</span>
                      <span className="font-bold text-[var(--ink)]">{createdOrder.items.reduce((s, i) => s + i.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[var(--ink)]">
                      <span>Total Amount</span>
                      <span className="tabular-nums text-[var(--copper)]">₦{createdOrder.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-bold text-[var(--sage)] uppercase tracking-wider mb-2">Select Sales Line:</p>
                    {settings.whatsappNumbers.map((line, i) => (
                      <a key={line.number} href={`https://wa.me/${line.number}?text=${encodeURIComponent(`Hello Dojech Solar Tech! I would like to confirm my order REF: ${createdOrder.reference} (Total: ₦${createdOrder.total.toLocaleString()}).`)}`} target="_blank" rel="noopener noreferrer" className={`w-full py-3 px-4 font-bold text-[10px] uppercase tracking-wider rounded-md flex items-center justify-between transition-all ${i === 0 ? 'bg-[var(--forest)] hover:bg-[#16211b] text-white' : 'bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-[var(--ink)]'}`}>
                        <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {line.label} — {line.display}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                  
                  <button onClick={() => { setStep('cart'); onClose(); onNavigate('account'); }} className="w-full py-3 bg-[var(--ink)] text-[var(--paper)] text-[10px] uppercase tracking-wider font-bold rounded-md hover:bg-[var(--forest)] transition-colors">
                    View Order in Account
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary (Cart & Checkout) */}
            {cart.length > 0 && step !== 'success' && (
              <div className="p-6 border-t border-[var(--line)] bg-white space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--sage)]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">₦{cartSubtotal.toLocaleString()}</span>
                  </div>
                                    <div className="flex justify-between text-[var(--sage)]">
                    <span>Delivery</span>
                    <span className="font-bold text-[var(--sage)] text-[10px] uppercase tracking-wider">Arranged via WhatsApp</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[var(--ink)] pt-3 border-t border-[var(--line)]">
                    <span>Total (Excl. Delivery)</span>
                    <span className="tabular-nums text-[var(--terracotta)]">₦{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <button onClick={() => setStep('checkout')} className="w-full py-4 bg-[var(--ink)] text-[var(--paper)] font-bold text-[10px] uppercase tracking-wider rounded-md flex items-center justify-center gap-2 hover:bg-[var(--copper)] transition-all">
                    Checkout on WhatsApp <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setStep('cart')} className="px-5 py-4 border border-[var(--line)] text-[var(--sage)] hover:bg-[var(--paper)] rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors">Back</button>
                    <button form="checkout-form" type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[var(--forest)] hover:bg-[#16211b] text-white font-bold text-[10px] uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all">
                      <Phone className="w-4 h-4" /> {isSubmitting ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};