// apps/www/app/page.tsx

import Link from "next/link"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york/ui/button"

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>VERO1 Gables or Goldoller</PageHeaderHeading>
        <PageHeaderDescription>
          Create a checklist
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/examples/forms">Get Started</Link>
          </Button>
        </PageActions>
      </PageHeader>

     
    </div>
  )
}
