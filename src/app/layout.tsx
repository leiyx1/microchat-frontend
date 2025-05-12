"use client"
import "../globals.css"

import * as React from "react"
import {SessionProvider} from "next-auth/react";

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
        </SessionProvider>
        </body>
        </html>
    )
}