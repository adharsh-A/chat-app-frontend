import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@components/ui/hero-highlight";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleGetAccess = () => {
    // Modify this to your actual sign-up or subscription flow
    navigate("/signup");
  };

  const handleViewChats = () => {
    if (isAuthenticated) {
      navigate("/chats");
    } else {
      // Redirect to login if not authenticated
      toast.error("Please login to view chats");
      navigate("/login");
    }
  };



  return (
    <div className=" flex flex-col items-center justify-center h-screen bg-transparent">
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 5],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-300 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Seamless, Secure, and Real-Time Conversations Designed for the{" "}
          <Highlight className="text-black dark:text-white">
            Modern Era of Communication
          </Highlight>
        </motion.h1>
        <div className=" flex flex-col md:flex-row mt-4 md:mt-8 gap-4 md:gap-8 md:mt-8 gap-4 md:mt-8 items-center justify-center p-2">
          <RainbowButton 
            className="bg-white" 
            onClick={handleGetAccess}
          >
            Get Unlimited Access
          </RainbowButton>
          
            <button
              onClick={handleViewChats}
              className="cursor-pointer shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg"
            >
              View Chats
            </button>
     
          
           
        </div>
      </HeroHighlight>
    </div>
  );
};

export default Home;