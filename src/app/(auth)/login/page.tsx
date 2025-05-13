import SignIn from "@/components/SignIn";
import {GalleryVerticalEnd} from "lucide-react";
import {className} from "postcss-selector-parser";
import {cn} from "@/lib/utils";

export default function Login() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-xl font-bold">Welcome to MicroChat.</h1>
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Developed by Yuxuan Lei
            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                                <SignIn/>
                            </div>
                        </div>
                        <div
                            className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                            You can play around with this demo using three pre-created accounts: user, user1, and user2 as both the username and password. 
                    </div>
                </div>
            </div>
        </div>
                )
                }
