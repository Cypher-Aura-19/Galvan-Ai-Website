"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { subscribeToNewsletter } from "@/actions/newsletter"
import Newsletter from "@/components/newsletter";

export default function HeroSection() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null)

  return (
    <Newsletter formAction={formAction} isPending={isPending} state={state} />
  )
}
