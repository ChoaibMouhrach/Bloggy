import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

interface DropDownItemProps {
  children: React.ReactNode;
  className?: string;
}

export const DropDownItem = ({ children, className }: DropDownItemProps) => {
  return (
    <DropdownMenu.Item className={`py-2 px-4 rounded-md hover:bg-gray-100 outline-none ${className}`} >
      {children}
    </DropdownMenu.Item>
  )
}

interface DropDownItemsWrapperProps {
  children: React.ReactNode;
}

export const DropDownItemsWrapper = ({ children }: DropDownItemsWrapperProps) => {
  return (
    <DropdownMenu.Portal  >
      <DropdownMenu.Content className="bg-white drop-shadow-sm p-2 border border-stone-300 rounded-md flex flex-col gap-1" >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

interface DropDownTriggerProps {
  children: React.ReactNode;
}

export const DropDownTrigger = ({ children }: DropDownTriggerProps) => {
  return (
    <DropdownMenu.Trigger className="outline-none" >
      {
        children
      }
    </DropdownMenu.Trigger>
  )
}

interface DropDownProps {
  children: React.ReactNode;
}

export const DropDown = ({ children }: DropDownProps) => {
  return (
    <div>
      <DropdownMenu.Root  >
        {children}
      </DropdownMenu.Root>
    </div >
  )
}
