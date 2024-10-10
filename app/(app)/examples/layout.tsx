

import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Announcement } from "@/components/announcement"
import { ExamplesNav } from "@/components/examples-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
 // Adjust the import path as needed


export const metadata: Metadata = {
  title: "VERO Checklist",
  description: "Simplified checklist gen.",
}

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <div className="container relative p-8">
      <section>


        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          {children}
        </div>

      </section>
    </div>
  )
}
