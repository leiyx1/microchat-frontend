import type { ComponentProps } from 'react';

 import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from '@/components/ui/tooltip';

 import { SidebarLeftIcon } from './icons';
 import { Button } from './ui/button';

 export function SidebarToggle({
 }: ComponentProps<typeof SidebarTrigger>) {
   const { toggleSidebar } = useSidebar();

   return (
     <Tooltip>
       <TooltipTrigger asChild>
         <Button
           data-testid="sidebar-toggle-button"
           onClick={toggleSidebar}
           variant="ghost"
           size="icon"
           className="h-8 w-8"
         >
           <SidebarLeftIcon size={16} />
         </Button>
       </TooltipTrigger>
       <TooltipContent align="start">Toggle Sidebar</TooltipContent>
     </Tooltip>
   );
 }