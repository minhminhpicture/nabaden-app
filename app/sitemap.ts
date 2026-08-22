import type { MetadataRoute } from "next";

const siteUrl = "https://mangcaubaden.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/san-pham/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/san-pham/hop-mang-cau-ba-den-3-trai-vip/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/san-pham/thung-mang-cau-ba-den-5kg/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/san-pham/thung-mang-cau-ba-den-15kg/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tin-tuc/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cach-bao-quan-mang-cau-ba-den/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mua-mang-cau-ba-den-thang-may/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/di-tay-ninh-mua-mang-cau-ba-den-o-dau/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mang-cau-ba-den-dac-san-tay-ninh/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mua-mang-cau-ba-den-chinh-goc-tay-ninh/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/hop-tac/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/tuyen-dai-ly-ctv/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/doi-tac/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/van-chuyen-mang-cau-ba-den/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tin-tuc/van-chuyen-mang-cau-ba-den/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mang-cau-ba-den-nabaden-dac-san-tay-ninh/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cac-dip-le-lon-cung-trong-nam-y-nghia-mang-cau-ba-den/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/tin-tuc/cac-dip-le-lon-cung-trong-nam-y-nghia-mang-cau-ba-den/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];
}
