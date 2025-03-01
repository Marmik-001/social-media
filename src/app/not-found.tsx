import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h2 className="text-5xl font-bold my-10">Not Found</h2>
      <p className="">Could not find requested resource</p>
      <Link href="/">
        <Button className="mt-10">Return Home</Button>
      </Link>
    </div>
  );
}
