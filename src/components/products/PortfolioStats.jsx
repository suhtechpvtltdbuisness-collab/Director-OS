import React from "react";
import { Package, Users, TrendingUp, Activity } from "lucide-react";
import { C } from "../../constants/theme";
import { PRODUCTS } from "../../constants/seedData";
import { inr } from "../../utils/formatCurrency";
import KpiCard from "../common/KpiCard";

export default function PortfolioStats() {
  const totalMRR = PRODUCTS.reduce((s, p) => s + p.mrr, 0);
  const totalClients = PRODUCTS.reduce((s, p) => s + p.clients, 0);
  const saasProducts = PRODUCTS.filter((p) => p.type === "SaaS Product");
  const serviceLines = PRODUCTS.filter((p) => p.type === "Service Line");
  const healthyCount = PRODUCTS.filter((p) => p.health === "Good" || p.health === "Green").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total Portfolio Revenue" value={inr(totalMRR)} delta="+8.4% MoM" icon={TrendingUp} accent={C.gold} />
      <KpiCard label="Total Active Clients" value={totalClients} icon={Users} accent={C.blue} sub={`${saasProducts.length} SaaS + ${serviceLines.length} services`} />
      <KpiCard label="Products in Portfolio" value={PRODUCTS.length} icon={Package} accent={C.purple} sub={`${saasProducts.length} SaaS · ${serviceLines.length} service lines`} />
      <KpiCard label="Healthy Products" value={`${healthyCount}/${PRODUCTS.length}`} icon={Activity} accent={C.green} sub={`${PRODUCTS.length - healthyCount} need attention`} />
    </div>
  );
}
