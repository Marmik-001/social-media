import Link from "next/link";
import DesktopNavbar from "./ui/DesktopNavbar";
import MobileNavbar from "./ui/MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

async function Navbar() {
  try {
    const user = await currentUser();
    if (user) {
      const dbUser = await syncUser();
      if (!dbUser) {
        console.log("Failed to sync user");
      }
    } else {
      console.log("No user");
    }
  } catch (error) {
    console.error("Error in Navbar:", error);
  }

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              Express
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
