import { useUser } from '@auth0/nextjs-auth0/client'
import { redirect } from 'next/navigation'
import LoginPage from '@/components/LoginPage'

export default function Home() {
  return <LoginPage />
}