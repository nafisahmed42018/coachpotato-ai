import { GeneratedAvatar } from "@/components/generated-avatar"
import { CommandResponsiveDialog, CommandInput, CommandList, CommandGroup, CommandEmpty } from "@/components/ui/command"

import {  CommandItem } from "cmdk"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"




interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export  const DashboardCommand = ({open, setOpen}: Props) => { // Es como un modal de una sola linea que da elegir entre varias opciones
  
  const router = useRouter();
  const [search, setSearch] = useState("");
  
  

  return (
    <CommandResponsiveDialog
      shouldFilter={false} 
      open={open} 
      onOpenChange={setOpen}
    >
      <CommandInput 
        placeholder="Find a meeting or agent..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />

      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No metings found
            </span>
          </CommandEmpty>

          
        </CommandGroup>

        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No agents found
            </span>
          </CommandEmpty>

          
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  )
}