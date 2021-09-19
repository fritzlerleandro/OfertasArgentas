import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";

export default function ProductsPage() {
  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await fetch("/api/getAlvear");
    const data = await res.json();
    setData(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="container">
      <ProductList data={data} />
    </main>
  );
}
