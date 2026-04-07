import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogOut, Package, Clock, Truck, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "পেন্ডিং", color: "bg-bubble-yellow/20 text-bubble-yellow", icon: Clock },
  confirmed: { label: "কনফার্মড", color: "bg-bubble-blue/20 text-bubble-blue", icon: Package },
  delivered: { label: "ডেলিভারড", color: "bg-primary/20 text-primary", icon: Truck },
  cancelled: { label: "ক্যানসেলড", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const navigate = useNavigate();

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
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/admin");
        return;
      }
      fetchOrders();
    });
  }, [navigate]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "মোট অর্ডার", value: stats.total, color: "text-foreground" },
            { label: "পেন্ডিং", value: stats.pending, color: "text-bubble-yellow" },
            { label: "কনফার্মড", value: stats.confirmed, color: "text-bubble-blue" },
            { label: "ডেলিভারড", value: stats.delivered, color: "text-primary" },
            { label: "ক্যানসেলড", value: stats.cancelled, color: "text-destructive" },
            { label: "মোট আয়", value: `৳${stats.revenue.toLocaleString()}`, color: "text-primary" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="bg-card rounded-xl p-4 border border-border text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "সব" : statusConfig[f].label} ({f === "all" ? orders.length : orders.filter((o) => o.status === f).length})
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">কোনো অর্ডার নেই</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-bold text-foreground">{order.customer_name}</span>
                      <span className="text-muted-foreground text-sm ml-2">{order.phone}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {sc.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">ঠিকানা: </span>
                      <span className="text-foreground">{order.address}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">এরিয়া: </span>
                      <span className="text-foreground">{order.delivery_area === "inside_dhaka" ? "ঢাকা" : "ঢাকার বাইরে"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">পরিমাণ: </span>
                      <span className="text-foreground">{order.quantity} পিস</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">মোট: </span>
                      <span className="font-bold text-foreground">৳{order.total}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("bn-BD", {
                        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <div className="flex gap-1.5">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(order.id, "confirmed")}
                            className="text-xs px-3 py-1.5 rounded-lg bg-bubble-blue/10 text-bubble-blue hover:bg-bubble-blue/20 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5 inline mr-1" />কনফার্ম
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, "cancelled")}
                            className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 inline mr-1" />ক্যানসেল
                          </button>
                        </>
                      )}
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => updateStatus(order.id, "delivered")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 inline mr-1" />ডেলিভারড
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
