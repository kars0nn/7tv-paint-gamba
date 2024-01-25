import { createRoutesFromFolders } from "@remix-run/v1-route-convention";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
    serverDependenciesToBundle: [/^react-icons/],
    ignoredRouteFiles: ["**/*"],
    routes: (defineRoutes) => {
        return createRoutesFromFolders(defineRoutes, {
            ignoredFilePatterns: ["**/.*", "**/*.css", "**/_[[:alpha:]]*"],
        });
    },
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // publicPath: "/build/",
    // serverBuildPath: "build/index.js",
};
