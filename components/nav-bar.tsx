import { Book, Home, ListChecks, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const NavBar = () => {
  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      color: "text-sky-500",
      bgColor: "bg-sky-100",
    },
    {
      name: "Journal",
      href: "/journal",
      icon: Book,
      color: "text-violet-500",
      bgColor: "bg-violet-100",
    },
    {
      name: "Gratitude",
      href: "/gratitude",
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-100",
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ListChecks,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate through the app.</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => (
            <Button key={item.name} variant="ghost" className="justify-start">
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NavBar

import { MenuIcon } from "lucide-react"
