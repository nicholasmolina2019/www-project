import { Separator } from "@/registry/new-york/ui/separator"
import { ProfileForm } from "app/(app)/examples/forms/profile-form"


export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium"></h3>
        <p className="text-sm text-muted-foreground">

        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
