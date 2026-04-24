import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: string;
  orderNumber: number;
  status: "ONGOING" | "READY" | "COMPLETED";
  items: { productName: string; quantity: number }[];
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const fetchOrders = async () => {
    try {
      const statusFilter = tab === "active" ? "ready,ongoing" : "completed";
      const response = await axios.get(`/api/order?status=${statusFilter}`, {
        withCredentials: true,
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(
        `/api/order/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Kitchen <span className="text-yellow-400">Display</span>
        </h1>
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setTab("active")}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              tab === "active"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              tab === "completed"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-6xl mb-4">🍳</span>
            <p className="text-xl">Tidak ada pesanan di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-t-8 ${
                  order.status === "READY"
                    ? "border-green-400"
                    : order.status === "COMPLETED"
                    ? "border-gray-400"
                    : "border-yellow-400"
                }`}
              >
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    #{order.orderNumber}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "READY"
                        ? "bg-green-100 text-green-700"
                        : order.status === "COMPLETED"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="p-6 min-h-[160px]">
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0"
                      >
                        <span className="text-gray-700 font-medium">
                          {item.productName}
                        </span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg">
                          x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tab === "active" && (
                  <div className="p-4 bg-gray-50 border-t flex gap-3">
                    <button
                      onClick={() => updateStatus(order.id, "READY")}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition-transform active:scale-95"
                    >
                      Mark Ready
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "COMPLETED")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-transform active:scale-95"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}