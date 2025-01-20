import React, { useState } from "react";
import { motion } from "framer-motion";

const AnimatedContainer: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          border: "2px solid #007BFF",
          borderRadius: "16px",
          padding: "20px",
          margin: "20px auto",
          maxWidth: "400px",
          backgroundColor: "#f0f8ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            layout
            style={{
              margin: "5px 0",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "8px",
              width: "80%",
              textAlign: "center",
            }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
      <button
        onClick={addItem}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add Item
      </button>
    </div>
  );
};

export default AnimatedContainer;
