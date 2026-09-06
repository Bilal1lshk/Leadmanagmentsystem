import type { MetadataRoute } from "next";

const siteUrl = "https://leadmanagmentsystem-nu.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/Dashdetails/",
        "/Leads/",
        "/follow/",
        "/pipeline/",
        "/setupworkspace/",
        "/login/",
        "/signup/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
