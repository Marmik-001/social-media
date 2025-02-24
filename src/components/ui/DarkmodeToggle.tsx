'use client'

import * as React from "react"
import {MoonIcon , SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./button"


function DarkmodeToggle() {
    const {theme  , setTheme} = useTheme()

  return (
    <Button variant={"outline"}
    size={"icon"}
    
    onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark")
    }}
    >
        <SunIcon className="h-[1.2rem] w-[1.2rem] self-center  rotate-0 scale-100 transition-all dark:-rotate-90 dark:hidden " />
        <MoonIcon className="h-[1.2rem] w-[1.2rem] -rotate-90 self-center hidden   transition-all dark:rotate-0 dark:scale-100 dark:block" />


    </Button>

  )
}
export default DarkmodeToggle