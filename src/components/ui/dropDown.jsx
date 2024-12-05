    import React from "react";
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { House, LogOutIcon, Menu, Store, StoreIcon, UserPen } from "lucide-react";


    export const DropDown = ({className}) => {
    return (
        <>

        <DropdownMenu className="ml-8"> 
            <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover:bg-white/10 active:bg-white/20">
                        <Menu size={28} color="#ffffff" strokeWidth={1.25} />menu</Button>
</DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><House strokeWidth={0.75} />Home</DropdownMenuItem>
            <DropdownMenuItem><UserPen strokeWidth={0.75} />Profile</DropdownMenuItem>
            <DropdownMenuItem><StoreIcon strokeWidth={0.75} />About</DropdownMenuItem>
            <DropdownMenuItem><LogOutIcon strokeWidth={0.75} />Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
    };
