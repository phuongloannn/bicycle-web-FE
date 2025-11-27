import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

// ✅ Metadata cho trang
export const metadata: Metadata = {
  title: "Bike Shop | Your Bicycle Dashboard",
  description: "Manage your bike shop easily and keep everything in check",
};

// ✅ Component trang SignIn
export default function SignIn() {
  return <SignInForm />;
}
