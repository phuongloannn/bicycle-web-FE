"use client";

import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";

export default function Profile() {
  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ backgroundColor: "#F2D8EE" }}>
      <div
        className="rounded-2xl border p-5 lg:p-6 shadow-lg"
        style={{
          borderColor: "#B673BF",
          background: "linear-gradient(to right, #F2D8EE, #D2A0D9)"
        }}
      >
        <h3 className="mb-5 text-lg font-semibold" style={{ color: "#8B278C" }}>
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
