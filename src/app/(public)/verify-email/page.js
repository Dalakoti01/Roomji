import VerifyEmail from "@/components/shared/VerifyEmail";
import React from "react";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
};

export default page;
