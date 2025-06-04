import {auth} from "@/auth";
import { NextRequest } from "next/server"

// Review if we need this, and why
function stripContentEncoding(result: Response) {
    const responseHeaders = new Headers(result.headers)
    responseHeaders.delete("content-encoding")

    return new Response(result.body, {
        status: result.status,
        statusText: result.statusText,
        headers: responseHeaders,
    })
}

async function handler(request: NextRequest) {
    const session = await auth()

    const headers = new Headers(request.headers)
    headers.set("Authorization", `Bearer ${session?.accessToken}`)

    const backendUrl = process.env.REACT_APP_BACKEND_URL
    const url = request.nextUrl.href.replace(`${request.nextUrl.origin}/api`, backendUrl ?? request.nextUrl.origin)
    
    try {
        const result = await fetch(url, { 
            method: request.method,
            headers, 
            body: request.body,
            duplex: 'half'
        } as never)

        // Only strip content encoding in production
        if (process.env.NODE_ENV === 'production') {
            return stripContentEncoding(result)
        }

        return result
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE }