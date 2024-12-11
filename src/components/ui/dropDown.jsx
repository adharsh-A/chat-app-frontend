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
import {
  House,
  KeyRound,
  LogOutIcon,
  Menu,
  Store,
  StoreIcon,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";

export const DropDown = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <DropdownMenu className="ml-8">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-white/10 active:bg-white/20 font-inherit"
          >
            <Menu size={28} color="#ffffff" strokeWidth={1.25} />
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <House strokeWidth={0.75} />
            Home
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
          >
            <UserPen strokeWidth={0.75} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/about")}
            className="cursor-pointer"
          >
            <StoreIcon strokeWidth={0.75} />
            About
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/forgot-password")}
            className="cursor-pointer"
          >
            <KeyRound strokeWidth={0.75} />
            Forget Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {dispatch(logout()); navigate("/login");}}
            className="cursor-pointer"
          >
            <LogOutIcon strokeWidth={0.75} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
