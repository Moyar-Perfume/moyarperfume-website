"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ComingSoon from "@/components/shared/ComingSoon";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full p-2 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Đăng nhập
        </button>
      </form>

      <hr className="my-6" />

      <button
        onClick={() => signIn("google", { callbackUrl: "/profile" })}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Đăng nhập bằng Google
      </button>
    </div>

    // <ComingSoon />
  );
}
