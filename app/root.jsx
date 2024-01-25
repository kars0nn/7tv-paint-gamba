import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import styles from './tailwind.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="bg-[#0e0e10] text-white m-3">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <small className="bottom-0 left-0 fixed">by xqcow1 (karson)</small>
            </body>
        </html>
    );
}
