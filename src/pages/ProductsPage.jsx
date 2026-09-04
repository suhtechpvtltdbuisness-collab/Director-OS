import React, { useState } from "react";
import { PRODUCT_TYPES } from "../constants/labels";
import { useData } from "../context/DataContext";
import SectionHeader from "../components/common/SectionHeader";
import Input from "../components/common/Input";
import IconBtn from "../components/common/IconBtn";
import ProductCard from "../components/products/ProductCard";
import PortfolioStats from "../components/products/PortfolioStats";
import PortfolioChart from "../components/products/PortfolioChart";

export default function ProductsPage() {
  const { products } = useData();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) => (filter === "All" || p.type === filter) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <PortfolioStats />
      <PortfolioChart />
      <SectionHeader
        title="Product Portfolio"
        subtitle="SaaS products and service lines under SUH TECH"
        right={
          <>
            <Input
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: 200 }}
            />
            {PRODUCT_TYPES.map((t) => (
              <IconBtn key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />
            ))}
          </>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
