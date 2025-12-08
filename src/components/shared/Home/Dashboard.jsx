"use client";
import React, { useState } from "react";
import HeroHome from "./HeroHome";
import HomeRentProperties from "./HomeRentProperties";
import HomeSellProperties from "./HeroSellProperties";
import HomeRentShops from "./HomeRentShops";
import HomeServices from "./HomeServices";


export default function Dashboard() {
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    locality: "",
  });

  return (
    <div>
      {/* Pass filter setters to HeroHome */}
      <HeroHome filters={filters} setFilters={setFilters} />

      {/* Pass filters to each section */}
      <HomeRentProperties filters={filters} />
      <HomeSellProperties filters={filters} />
      <HomeRentShops filters={filters} />
      <HomeServices filters={filters} />
    </div>
  );
}
