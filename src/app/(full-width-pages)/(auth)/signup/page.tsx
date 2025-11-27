import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

// ✅ Metadata cho trang SignUp
export const metadata: Metadata = {
  title: "Bike Shop | Create Your Account",
  description: "Sign up to manage your bike shop easily and stay on top of everything",
};

// ✅ Component trang SignUp
export default function SignUp() {
  return <SignUpForm />;
}
