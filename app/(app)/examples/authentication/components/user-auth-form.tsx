// apps/www/app/components/user-nav.tsx

"use client"

import Link from "next/link"
import { useAuth } from '@/context/AuthContext'
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { cn } from "@/lib/utils"

export default function UserNav() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <nav className="flex items-center space-x-4">
      {user ? (
        <>
          <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
          <button
            onClick={() => signOut(auth)}
            className="text-sm font-medium text-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/authentication/login" className="text-sm font-medium">Login</Link>
          <Link href="/authentication/signup" className="text-sm font-medium">Sign Up</Link>
        </>
      )}
    </nav>
  )
}
