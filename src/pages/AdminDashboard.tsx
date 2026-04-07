import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Package, Clock, Truck, CheckCircle, XCircle, RefreshCw,
  Eye, Pencil, Trash2, X, RotateCcw, CreditCard, Send, ArrowRight,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "পেন্ডিং", color: "bg-bubble-yellow/20 text-bubble-yellow", icon: Clock },
  confirmed: { label: "কনফার্মড", color: "bg-bubble-blue/20 text-bubble-blue", icon: CheckCircle },
  processing: { label: "প্রসেসিং", color: "bg-accent/20 text-accent", icon: Package },
  shipped: { label: "শিপড", color: "bg-secondary/20 text-secondary", icon: Send },
  delivered: { label: "ডেলিভারড", color: "bg-primary/20 text-primary", icon: Truck },
  returned: { label: "রিটার্নড", color: "bg-bubble-pink/20 text-bubble-pink", icon: RotateCcw },
  refunded: { label: "রিফান্ডেড", color: "bg-muted-foreground/20 text-muted-foreground", icon: CreditCard },
  cancelled: { label: "ক্যানসেলড", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const allStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "returned", "refunded", "cancelled"];

// Status flow: what next statuses are available from current
const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned", "refunded"],
  returned: ["refunded"],
  refunded: [],
  cancelled: [],
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate("/admin"); return; }
      fetchOrders();
    });
  }, [navigate]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (selectedOrder?.id === orderId) setSelectedOrder((p) => p ? { ...p, status } : null);
    toast({ title: `স্ট্যাটাস আপডেট: ${statusConfig[status].label}` });
  };

  const handleDelete = async (orderId: string) => {
    await supabase.from("orders").delete().eq("id", orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setDeleteConfirm(null);
    setSelectedOrder(null);
    toast({ title: "অর্ডার ডিলিট হয়েছে", variant: "destructive" });
  };

  const handleEditSave = async () => {
    if (!editingOrder) return;
    const { id, customer_name, phone, address, delivery_area, quantity, notes } = editingOrder;
    const deliveryCharge = delivery_area === "inside_dhaka" ? 60 : 120;
    const total = editingOrder.unit_price * quantity + deliveryCharge;

    await supabase.from("orders").update({
      customer_name, phone, address, delivery_area, quantity, delivery_charge: deliveryCharge, total, notes,
    }).eq("id", id);

    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, customer_name, phone, address, delivery_area, quantity, delivery_charge: deliveryCharge, total, notes } : o));
    setEditingOrder(null);
    toast({ title: "অর্ডার আপডেট হয়েছে" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing" || o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled" || o.status === "returned" || o.status === "refunded").length,
    revenue: orders.filter((o) => !["cancelled", "refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-lg font-bold text-foreground">🎈 বাবল গান — অ্যাডমিন</h1>
        <div className="flex items-center gap-2">
          <button onClick={fetchOrders} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-destructive">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          {[
            { label: "মোট", value: stats.total, color: "text-foreground" },
            { label: "পেন্ডিং", value: stats.pending, color: "text-bubble-yellow" },
            { label: "প্রসেসিং", value: stats.processing, color: "text-bubble-blue" },
            { label: "শিপড", value: stats.shipped, color: "text-secondary" },
            { label: "ডেলিভারড", value: stats.delivered, color: "text-primary" },
            { label: "ক্যানসেলড", value: stats.cancelled, color: "text-destructive" },
            { label: "আয়", value: `৳${stats.revenue.toLocaleString()}`, color: "text-primary" },
          ].map((s, i) => (
            <motion.div key={i} className="bg-card rounded-xl p-3 border border-border text-center"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(["all", ...allStatuses] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}>
              {f === "all" ? "সব" : statusConfig[f].label} ({f === "all" ? orders.length : orders.filter((o) => o.status === f).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">কোনো অর্ডার নেই</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              const next = nextStatuses[order.status];
              return (
                <motion.div key={order.id} className="bg-card rounded-xl border border-border p-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{order.customer_name}</span>
                      <span className="text-muted-foreground text-sm">{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />{sc.label}
                      </div>
                      {/* Actions */}
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="বিস্তারিত">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingOrder({ ...order })} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="এডিট">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(order.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="ডিলিট">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-sm mb-3">
                    <div><span className="text-muted-foreground">ঠিকানা: </span><span className="text-foreground">{order.address}</span></div>
                    <div><span className="text-muted-foreground">এরিয়া: </span><span className="text-foreground">{order.delivery_area === "inside_dhaka" ? "ঢাকা" : "ঢাকার বাইরে"}</span></div>
                    <div><span className="text-muted-foreground">পরিমাণ: </span><span className="text-foreground">{order.quantity} পিস</span></div>
                    <div><span className="text-muted-foreground">মোট: </span><span className="font-bold text-foreground">৳{order.total}</span></div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {next.map((ns) => {
                        const nsc = statusConfig[ns];
                        return (
                          <button key={ns} onClick={() => updateStatus(order.id, ns)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg ${nsc.color} hover:opacity-80 transition-opacity inline-flex items-center gap-1`}>
                            <ArrowRight className="w-3 h-3" />{nsc.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && !editingOrder && (
          <motion.div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}>
            <motion.div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">অর্ডার বিস্তারিত</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="কাস্টমার" value={selectedOrder.customer_name} />
                  <DetailField label="ফোন" value={selectedOrder.phone} />
                  <DetailField label="ঠিকানা" value={selectedOrder.address} />
                  <DetailField label="ডেলিভারি এরিয়া" value={selectedOrder.delivery_area === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"} />
                  <DetailField label="পরিমাণ" value={`${selectedOrder.quantity} পিস`} />
                  <DetailField label="একক মূল্য" value={`৳${selectedOrder.unit_price}`} />
                  <DetailField label="ডেলিভারি চার্জ" value={`৳${selectedOrder.delivery_charge}`} />
                  <DetailField label="মোট" value={`৳${selectedOrder.total}`} bold />
                </div>

                {selectedOrder.notes && <DetailField label="নোট" value={selectedOrder.notes} />}

                <div>
                  <span className="text-xs text-muted-foreground block mb-1">স্ট্যাটাস</span>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedOrder.status].color}`}>
                    {statusConfig[selectedOrder.status].label}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  অর্ডার তারিখ: {new Date(selectedOrder.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>

                {/* Status actions */}
                {nextStatuses[selectedOrder.status].length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
                    {nextStatuses[selectedOrder.status].map((ns) => (
                      <button key={ns} onClick={() => updateStatus(selectedOrder.id, ns)}
                        className={`text-sm px-4 py-2 rounded-xl ${statusConfig[ns].color} hover:opacity-80 transition-opacity`}>
                        {statusConfig[ns].label} করুন
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setEditingOrder({ ...selectedOrder }); }}
                    className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                    <Pencil className="w-4 h-4 inline mr-1" />এডিট
                  </button>
                  <button onClick={() => setDeleteConfirm(selectedOrder.id)}
                    className="flex-1 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-4 h-4 inline mr-1" />ডিলিট
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingOrder && (
          <motion.div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditingOrder(null)}>
            <motion.div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">অর্ডার এডিট</h2>
                <button onClick={() => setEditingOrder(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3">
                <EditField label="কাস্টমার নাম" value={editingOrder.customer_name}
                  onChange={(v) => setEditingOrder({ ...editingOrder, customer_name: v })} />
                <EditField label="ফোন" value={editingOrder.phone}
                  onChange={(v) => setEditingOrder({ ...editingOrder, phone: v })} />
                <EditField label="ঠিকানা" value={editingOrder.address}
                  onChange={(v) => setEditingOrder({ ...editingOrder, address: v })} textarea />

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">ডেলিভারি এরিয়া</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["inside_dhaka", "outside_dhaka"] as const).map((area) => (
                      <button key={area}
                        onClick={() => setEditingOrder({ ...editingOrder, delivery_area: area })}
                        className={`py-2 rounded-xl text-sm border transition-all ${
                          editingOrder.delivery_area === area
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}>
                        {area === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">পরিমাণ</label>
                  <input type="number" min={1} value={editingOrder.quantity}
                    onChange={(e) => setEditingOrder({ ...editingOrder, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <EditField label="নোট (ঐচ্ছিক)" value={editingOrder.notes || ""}
                  onChange={(v) => setEditingOrder({ ...editingOrder, notes: v || null })} textarea />

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditingOrder(null)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-colors">
                    বাতিল
                  </button>
                  <button onClick={handleEditSave}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    সেভ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}>
            <motion.div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm text-center"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">অর্ডার ডিলিট করবেন?</h3>
              <p className="text-muted-foreground text-sm mb-6">এই অর্ডারটি স্থায়ীভাবে মুছে যাবে। এটা ফেরানো যাবে না।</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-colors">
                  না
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  হ্যাঁ, ডিলিট করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailField = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div>
    <span className="text-xs text-muted-foreground block">{label}</span>
    <span className={`text-sm text-foreground ${bold ? "font-bold" : ""}`}>{value}</span>
  </div>
);

const EditField = ({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) => (
  <div>
    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
        className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    )}
  </div>
);

export default AdminDashboard;
