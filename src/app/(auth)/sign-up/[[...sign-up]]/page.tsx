import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="shadow-2xl rounded-2xl overflow-hidden">
        <SignUp />
      </div>
    </div>
  );
}
