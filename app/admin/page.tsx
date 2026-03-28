"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminDashboardPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    
    // Using onSnapshot to fulfill the real-time contact system requirement
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Manage your incoming messages in real-time.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recent Messages</h2>
        {loading ? (
          <p className="text-gray-500 italic animate-pulse">Loading real-time messages...</p>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border border-dashed rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
            <p>You&apos;re all caught up on your inbox.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-5 bg-white border rounded-xl shadow-sm transition-shadow hover:shadow-md flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{msg.email}</h4>
                    <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      {msg.type || "in-app"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleString() : "Just now"}
                  </span>
                </div>
                <p className="text-gray-700 mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm border">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
