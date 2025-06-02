"use client"
import "../globals.css"

import * as React from "react"
import {SessionProvider} from "next-auth/react";
import {Toaster} from "@/components/ui/sonner";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <html>
        <body className="antialiased">
        <SessionProvider>
            {children}
            <Toaster position="top-center"></Toaster>
        </SessionProvider>
        </body>
        </html>
    )
}