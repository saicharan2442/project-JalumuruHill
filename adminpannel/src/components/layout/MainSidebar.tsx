import { Link, useLocation } from "react-router-dom";
import { Calendar, Home, Image, Users, Contact } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Temples",
    icon: Image,
    href: "/temples",
  },
  {
    title: "Donors",
    icon: Users,
    href: "/donors",
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/events",
  },
  {
    title: "Ebooks",
    icon: BookOpen,
    href: "/ebooks",
  },
  {
    title: "Contacts",
    icon: Contact,
    href: "/contacts",
  },
  
  
];

export function MainSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-temple-600 text-white">
            {/* You can replace the Image component with an <img> tag for an actual image */}
            <img
              src="https://ice.lol/mzlwcq"  // Add the actual path of your temple image
              alt="Temple Image"
              className="h-8 w-8 rounded-full"
            />
          </div>
          <div className="font-semibold text-temple-950 dark:text-temple-50">
            varasiddhi vinayaka kshatram
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "transparent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
