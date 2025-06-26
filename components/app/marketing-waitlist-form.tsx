"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type WaitlistForm = z.infer<typeof waitlistSchema>

export function MarketingWaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedCount] = useState(127) // Mock count for demo

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: WaitlistForm) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success(
      `Thanks for your interest, ${values.email.split("@")[0]}! We'll notify you when the Pokemon Battle App is ready.`
    )
    form.reset()
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 pt-4 sm:flex-row"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full sm:w-auto sm:flex-1">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email"
                    disabled={isSubmitting}
                    className="min-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting && <Icons.spinner className="size-4 animate-spin" />}{" "}
            Get Notified
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href={siteConfig.links.github}>
              <Icons.github />
              <span className="sm:hidden">Star us on GitHub</span>
            </Link>
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <div className="bg-success/70 animate-pulse rounded-full p-1" />
          <p className="text-success/70 text-sm">
            {submittedCount} trainers have joined the battle
          </p>
        </div>
      </Form>
    </div>
  )
}
