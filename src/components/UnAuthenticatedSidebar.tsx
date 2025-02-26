import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

function UnAuthenticatedSidebar() {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>
            Welcome Back User
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 pt-3">
            Please login to access your account and connect with others to Express yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        
        <SignInButton mode="modal" >
          <Button variant="default" className="w-full border-gray-200 my-2 hover:scale-[101%] transition duration-300 hover:ring-white  hover:ring-2 hover:ring-offset-1">Sign In</Button>

        </SignInButton>

        <SignUpButton mode="modal">
            <Button variant="secondary" className="w-full  my-2  hover:scale-[101%] transition duration-300 hover:ring-black  hover:ring-2 hover:ring-offset-1">Sign Up</Button>
        </ SignUpButton>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
            By signing in you agree to our{" "}
            <a href="#" className="text-primary underline ">
                Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary underline">
                Privacy Policy
            </a>
        </p>
      </CardFooter>
    </Card>
  );
}
export default UnAuthenticatedSidebar;
