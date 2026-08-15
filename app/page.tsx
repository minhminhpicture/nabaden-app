"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TabId = "home" | "products" | "experience" | "news" | "contact";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type NewsStory = {
  id: string;
  title: string;
  text: string;
  category: string;
  date: string;
  image: string;
  href: string;
};

const ZALO_OA_URL = "https://zalo.me/2227000692046430780";
const PARTNER_ZALO_URL = "https://zalo.me/2227000692046430780?open_type=p&open_form=4fac32860ec3e79dbed2";

const products = [
  {
    id: "fresh",
    name: "Mãng cầu Bà Đen tươi",
    category: "Tươi",
    image: "/assets/product-gift-box.jpg",
    note: "Theo mùa vụ",
    description: "Trái tươi chính gốc Tây Ninh, tư vấn độ chín và đóng gói theo nhu cầu.",
    ocop: true,
  },
  {
    id: "wine",
    name: "Rượu từ mãng cầu",
    category: "Chế biến",
    image: "/assets/product-wine.jpg",
    note: "Liên hệ thông tin",
    description: "Sản phẩm chế biến dành cho khách hàng và đối tác quan tâm.",
  },
  {
    id: "dried",
    name: "Mãng cầu sấy",
    category: "Chế biến",
    image: "/assets/product-dried.jpg",
    note: "Tiện lợi · Dễ mang theo",
    description: "Phù hợp nhu cầu quà tặng, thưởng thức và phân phối.",
  },
  {
    id: "gift",
    name: "Set quà NABADEN",
    category: "Quà tặng",
    image: "/assets/product-gift-set.jpg",
    note: "Theo số lượng",
    description: "Cấu hình quà doanh nghiệp và dịp đặc biệt theo nhu cầu thực tế.",
  },
];

const fallbackStories: NewsStory[] = [
  {
    id: "kgs-international-school-tham-quan-vuon-mang-cau-nabaden",
    category: "Trải nghiệm",
    date: "2026-07-18",
    title: "KGS International School tham quan NABADEN",
    text: "Hành trình nông nghiệp xanh dưới chân Núi Bà Đen.",
    image: "/assets/kgs-unity-journey-group.jpg",
    href: "https://nabaden.vn/tin-tuc/kgs-international-school-tham-quan-vuon-mang-cau-nabaden/",
  },
  {
    id: "mua-mang-cau-ba-den-chinh-goc-tay-ninh",
    category: "Mùa vụ",
    date: "2026-07-04",
    title: "Tìm mãng cầu Bà Đen chính gốc ở đâu?",
    text: "Cách chọn độ chín và kiểm tra tình trạng theo mùa vụ.",
    image: "/assets/product-gift-box.jpg",
    href: "https://nabaden.vn/tin-tuc/mua-mang-cau-ba-den-chinh-goc-tay-ninh/",
  },
  {
    id: "mang-cau-ba-den-co-gi-dac-biet",
    category: "Kiến thức",
    date: "2026-07-04",
    title: "Mãng cầu Bà Đen có gì đặc biệt?",
    text: "Vùng trồng, hương vị và câu chuyện trái quê Tây Ninh.",
    image: "/assets/garden-real.jpg",
    href: "https://nabaden.vn/tin-tuc/mang-cau-ba-den-co-gi-dac-biet/",
  },
];

const trustSlides = [
  {
    id: "harvest-overview",
    image: "/assets/harvest-gallery-collage.jpg",
    eyebrow: "Hình ảnh thực tế",
    title: "Một mùa mãng cầu từ thu hoạch đến đóng gói",
    text: "Hình ảnh thực tế tại điểm tập kết, phân loại và chuẩn bị giao hàng của NABADEN.",
  },
  {
    id: "fresh-harvest",
    image: "/assets/gallery-harvest-crates.jpg",
    eyebrow: "Vùng nguyên liệu Thạnh Tân",
    title: "Mãng cầu vừa thu hoạch tại điểm tập kết",
    text: "Trái được giữ cành lá, phân loại và bọc lưới bảo vệ trước khi giao.",
  },
  {
    id: "packing",
    image: "/assets/gallery-packing-process.jpg",
    eyebrow: "Quy trình thực tế",
    title: "Chăm chút từng trái trước khi đóng gói",
    text: "Người lao động kiểm tra, bọc lưới và sắp xếp mãng cầu theo quy cách.",
  },
  {
    id: "fruit-closeup",
    image: "/assets/gallery-fruit-closeup.jpg",
    eyebrow: "Chất lượng nhìn thấy",
    title: "Cận cảnh trái mãng cầu được bọc lưới bảo vệ",
    text: "Hình ảnh thật giúp khách dễ nhận biết quy cách sản phẩm trước khi trao đổi mùa vụ.",
  },
  {
    id: "ocop",
    image: "/assets/chung-nhan-ocop-3-sao.jpg",
    eyebrow: "Chứng nhận chính thức",
    title: "Quả Mãng cầu (Na) ta đạt OCOP 3 sao",
    text: "Chứng nhận mã số 72-703-01-2023 của HTX Nông nghiệp Mãng cầu Thạnh Tân.",
    certificate: true,
  },
  {
    id: "factory",
    image: "/assets/factory-visit-1.jpg",
    eyebrow: "Năng lực hợp tác",
    title: "Vùng trồng, chế biến và đón đoàn thực tế",
    text: "NABADEN sẵn sàng đồng hành cùng đối tác, doanh nghiệp và chương trình trải nghiệm.",
  },
];

const navItems: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "home", label: "Trang chủ", icon: "⌂" },
  { id: "products", label: "Sản phẩm", icon: "◫" },
  { id: "experience", label: "Trải nghiệm", icon: "♧" },
  { id: "news", label: "Tin tức", icon: "▤" },
  { id: "contact", label: "Kết nối", icon: "◎" },
];

export default function Home() {
  const [tab, setTab] = useState<TabId>("home");
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [basket, setBasket] = useState<string[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [trustSlide, setTrustSlide] = useState(0);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [toast, setToast] = useState("");
  const [online, setOnline] = useState(true);
  const [stories, setStories] = useState<NewsStory[]>(fallbackStories);

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (navItems.some((item) => item.id === requestedTab)) setTab(requestedTab as TabId);
    try {
      setFavorites(JSON.parse(localStorage.getItem("nabaden-favorites") || "[]"));
      setBasket(JSON.parse(localStorage.getItem("nabaden-basket") || "[]"));
    } catch {
      // Keep a clean local state if older data is malformed.
    }
    setOnline(navigator.onLine);
    const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
      standaloneNavigator.standalone === true,
    );
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("beforeinstallprompt", handleInstall);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("nabaden-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("nabaden-basket", JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTrustSlide((current) => (current + 1) % trustSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/news", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể đồng bộ tin tức");
        return response.json() as Promise<{ articles: NewsStory[] }>;
      })
      .then(({ articles }) => {
        if (articles.length) setStories(articles);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const newsTag = (story: NewsStory) => {
    if (!story.date) return story.category;
    const [year, month, day] = story.date.split("-");
    return `${story.category} · ${day}/${month}/${year}`;
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const changeTab = (next: TabId) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleBasket = (id: string) => {
    setBasket((current) => {
      const exists = current.includes(id);
      notify(exists ? "Đã bỏ khỏi danh sách" : "Đã thêm vào yêu cầu tư vấn");
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("vi");
    return products.filter((product) => {
      const matchesFilter = filter === "Tất cả" || product.category === filter;
      const matchesQuery = !term || `${product.name} ${product.description}`.toLocaleLowerCase("vi").includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selectedProducts = useMemo(
    () => products.filter((product) => basket.includes(product.id)),
    [basket],
  );

  const consultationMessage = useMemo(
    () => [
      "Xin chào NABADEN, tôi đang quan tâm các sản phẩm:",
      ...selectedProducts.map((product) => `• ${product.name}`),
      "",
      "Nhờ NABADEN tư vấn giúp tôi về giá, quy cách đóng gói và tình trạng hiện tại. Xin cảm ơn!",
    ].join("\n"),
    [selectedProducts],
  );

  const requestInstall = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") notify("NABADEN đang được thêm vào màn hình chính");
      setInstallEvent(null);
      return;
    }
    setShowIosHelp(true);
  };

  const shareApp = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("share", "partner-20260723");
    if (navigator.share) {
      await navigator.share({
        title: "NABADEN",
        text: "Mãng cầu Bà Đen chính gốc Tây Ninh",
        url: shareUrl.toString(),
      });
    } else {
      await navigator.clipboard.writeText(shareUrl.toString());
      notify("Đã sao chép liên kết ứng dụng");
    }
  };

  const removeFromBasket = (id: string) => {
    setBasket((current) => {
      if (current.length === 1) setBasketOpen(false);
      return current.filter((item) => item !== id);
    });
    notify("Đã bỏ sản phẩm khỏi giỏ quan tâm");
  };

  const copyConsultationMessage = async () => {
    try {
      await navigator.clipboard.writeText(consultationMessage);
      notify("Đã sao chép tin nhắn tư vấn");
    } catch {
      notify("Hãy nhấn giữ nội dung để sao chép");
    }
  };

  const openBooking = () => {
    setBookingMessage("");
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingMessage("");
    setBookingOpen(false);
  };

  const copyBookingMessage = async () => {
    try {
      await navigator.clipboard.writeText(bookingMessage);
      notify("Đã sao chép tin nhắn đặt lịch");
    } catch {
      notify("Hãy nhấn giữ nội dung để sao chép");
    }
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      "Xin chào NABADEN, tôi muốn đặt lịch trải nghiệm hái quả tại vườn:",
      `Họ tên: ${data.get("name")}`,
      `Điện thoại: ${data.get("phone")}`,
      `Ngày dự kiến: ${data.get("date") || "Chưa chốt"}`,
      `Khung giờ: ${data.get("time")}`,
      `Số người lớn: ${data.get("adults")}`,
      `Số trẻ em: ${data.get("children")}`,
      `Nhu cầu: ${data.get("program")}`,
      `Ghi chú: ${data.get("note") || "Không có"}`,
    ].join("\n");
    setBookingMessage(body);
    try {
      if (navigator.clipboard) {
        void navigator.clipboard.writeText(body)
          .then(() => notify("Đã sao chép tin nhắn · Hãy dán vào Zalo OA"))
          .catch(() => notify("Hãy nhấn giữ nội dung để sao chép"));
      } else {
        notify("Hãy nhấn giữ nội dung để sao chép");
      }
    } catch {
      notify("Hãy nhấn giữ nội dung để sao chép");
    }
    window.open(ZALO_OA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => changeTab("home")} aria-label="Về trang chủ">
          <img src="/assets/nabaden-logo.webp" alt="NABADEN" />
          <span>OCOP 3★</span>
        </button>
        <div className="top-actions">
          <button className="icon-button" onClick={shareApp} aria-label="Chia sẻ ứng dụng">↗</button>
        </div>
      </header>

      {!online && <div className="offline-banner">Bạn đang ngoại tuyến · Nội dung đã lưu vẫn dùng được</div>}

      <div className="screen" key={tab}>
        {tab === "home" && (
          <>
            <section className="hero-card">
              <img src="/assets/garden-real.jpg" alt="Vườn mãng cầu Bà Đen" />
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="eyebrow light">Từ vùng nguyên liệu Tây Ninh</span>
                <h1><a href="https://mangcaubaden.vn">Mãng cầu Bà Đen</a><br />chính gốc.</h1>
                <p>Vùng trồng thật · Chế biến thật · OCOP 3 sao</p>
                <button onClick={() => changeTab("products")}>Khám phá sản phẩm <b>→</b></button>
              </div>
              <div className="hero-badge"><strong>3★</strong><span>OCOP<br />chính thức</span></div>
            </section>

            <section className="quick-grid" aria-label="Tác vụ nhanh">
              <button onClick={() => changeTab("products")}><span>🍈</span><b>Sản phẩm</b><small>Xem mùa vụ</small></button>
              <button onClick={openBooking}><span>🌿</span><b>Đặt lịch vườn</b><small>Trải nghiệm hái quả</small></button>
              <a href={ZALO_OA_URL}><span>💬</span><b>Nhắn Zalo</b><small>Tư vấn nhanh</small></a>
              <a href="https://maps.app.goo.gl/r8JkWUTPksY2CjsB7"><span>⌖</span><b>Chỉ đường</b><small>Thạnh Tân</small></a>
            </section>

            <section className="trust-section" aria-label="Hình ảnh thực tế và chứng nhận NABADEN">
              <div className="trust-heading">
                <div><span>Uy tín từ điều có thật</span><h2>Thực tế & chứng nhận</h2></div>
                <span className="trust-counter">{String(trustSlide + 1).padStart(2, "0")} / {String(trustSlides.length).padStart(2, "0")}</span>
              </div>
              <div className={`trust-slide ${trustSlides[trustSlide].certificate ? "certificate" : ""}`} key={trustSlides[trustSlide].id}>
                <img src={trustSlides[trustSlide].image} alt={trustSlides[trustSlide].title} />
                <div className="trust-slide-shade" />
                <div className="trust-slide-copy">
                  <span>{trustSlides[trustSlide].eyebrow}</span>
                  <h3>{trustSlides[trustSlide].title}</h3>
                  <p>{trustSlides[trustSlide].text}</p>
                  {trustSlides[trustSlide].certificate && <a href="/assets/chung-nhan-ocop-3-sao.jpg" target="_blank">Xem chứng nhận đầy đủ ↗</a>}
                </div>
                <button className="trust-prev" onClick={() => setTrustSlide((trustSlide - 1 + trustSlides.length) % trustSlides.length)} aria-label="Ảnh trước">‹</button>
                <button className="trust-next" onClick={() => setTrustSlide((trustSlide + 1) % trustSlides.length)} aria-label="Ảnh tiếp theo">›</button>
              </div>
              <div className="trust-dots" aria-label="Chọn ảnh">
                {trustSlides.map((slide, index) => <button key={slide.id} className={trustSlide === index ? "active" : ""} onClick={() => setTrustSlide(index)} aria-label={`Xem slide ${index + 1}`} />)}
              </div>
              <div className="trust-proof"><span><b>3★</b> OCOP chính thức</span><span><b>✓</b> Vùng trồng thật</span><span><b>✓</b> Đóng gói thực tế</span></div>
            </section>

            <SectionHead eyebrow="Gợi ý hôm nay" title="Sản phẩm từ trái quê" action="Xem tất cả" onAction={() => changeTab("products")} />
            <div className="product-grid home-product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} inBasket={basket.includes(product.id)} onFavorite={toggleFavorite} onBasket={toggleBasket} />
              ))}
            </div>

            <section className="story-card">
              <div>
                <span className="eyebrow">Câu chuyện thương hiệu</span>
                <h2>Nâng giá trị trái quê bằng một con đường tử tế.</h2>
                <p>Điểm nối giữa nhà vườn, sản phẩm OCOP, trải nghiệm và thị trường hiện đại.</p>
                <button onClick={() => changeTab("experience")}>Khám phá NABADEN →</button>
              </div>
              <img src="/assets/factory-visit-1.jpg" alt="Đoàn tham quan NABADEN" />
            </section>

            <SectionHead eyebrow="Mới từ vườn" title="Tin & kiến thức" action="Xem thêm" onAction={() => changeTab("news")} />
            <a className="featured-news" href={stories[0].href} target="_blank" rel="noreferrer">
              <img src={stories[0].image} alt="" />
              <div><small>{newsTag(stories[0])}</small><h3>{stories[0].title}</h3><span>Đọc bài ↗</span></div>
            </a>
          </>
        )}

        {tab === "products" && (
          <>
            <PageIntro eyebrow="Từ vùng nguyên liệu Tây Ninh" title="Chọn sản phẩm bạn quan tâm" text="Giá, quy cách và tình trạng được tư vấn theo mùa vụ thực tế." />
            <label className="search-box">
              <span>⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm sản phẩm..." />
            </label>
            <div className="filter-row">
              {["Tất cả", "Tươi", "Chế biến", "Quà tặng"].map((item) => (
                <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} inBasket={basket.includes(product.id)} onFavorite={toggleFavorite} onBasket={toggleBasket} />
              ))}
            </div>
            {!filteredProducts.length && <div className="empty-state"><span>🍃</span><h3>Chưa tìm thấy sản phẩm</h3><p>Thử một từ khóa hoặc nhóm sản phẩm khác.</p></div>}
            <div className="notice-card"><span>✓</span><div><b>Thông tin minh bạch</b><p>Huy hiệu OCOP 3 sao hiện áp dụng cho “Quả Mãng cầu (Na) ta”.</p></div></div>
          </>
        )}

        {tab === "experience" && (
          <>
            <PageIntro eyebrow="Dưới chân Núi Bà Đen" title="Một ngày chạm vào vườn xanh" text="Chương trình được thiết kế theo mùa, độ tuổi và mục tiêu của từng đoàn." />
            <div className="experience-hero"><img src="/assets/kgs-unity-journey-group.jpg" alt="Đoàn khách trải nghiệm tại NABADEN" /><div><strong>Trải nghiệm tại vườn NABADEN</strong><span>Không gian xanh dưới chân Núi Bà Đen</span></div></div>
            <div className="program-list">
              <Program number="01" title="Tham quan vùng trồng" text="Tìm hiểu cây mãng cầu, mùa vụ và câu chuyện sản xuất địa phương." />
              <Program number="02" title="Trải nghiệm hái quả" text="Tự tay tìm hiểu, lựa chọn và hái mãng cầu theo mùa vụ thực tế." />
              <Program number="03" title="Đoàn doanh nghiệp" text="Khảo sát nguyên liệu, trao đổi hợp tác và tìm hiểu sản phẩm." />
            </div>
            <section className="experience-moments">
              <div className="experience-moments-head"><div><span>Khoảnh khắc thực tế</span><h2>Hình ảnh các đoàn tham quan</h2></div></div>
              <div className="experience-gallery">
                <figure className="wide"><img src="/assets/kgs-orchard-nui-ba-den.jpg" alt="Vườn mãng cầu NABADEN dưới chân Núi Bà Đen" /><figcaption>Vùng trồng dưới chân Núi Bà Đen</figcaption></figure>
                <figure><img src="/assets/kgs-school-buses.jpg" alt="Đoàn khách đến tham quan NABADEN" /><figcaption>Đón đoàn tại khu trải nghiệm</figcaption></figure>
                <figure><img src="/assets/kgs-arrival-buses.jpg" alt="Đoàn khách đến vùng trồng mãng cầu" /><figcaption>Hành trình đến vùng trồng</figcaption></figure>
                <figure><img src="/assets/kgs-arrival-at-farm.jpg" alt="Khách tham quan khu vực NABADEN" /><figcaption>Di chuyển vào khu trải nghiệm</figcaption></figure>
                <figure><img src="/assets/kgs-welcome-at-nabaden.jpg" alt="Khách tìm hiểu mãng cầu tại NABADEN" /><figcaption>Tìm hiểu và phân loại mãng cầu</figcaption></figure>
              </div>
            </section>
            <section className="booking-card">
              <span className="eyebrow light">Trải nghiệm theo mùa</span>
              <h2>Tự tay hái mãng cầu tại vườn.</h2>
              <p>Đặt lịch trước để NABADEN kiểm tra mùa vụ, thời tiết và chuẩn bị chương trình phù hợp cho gia đình hoặc khách đoàn.</p>
              <button onClick={openBooking}>Đặt lịch hái quả →</button>
            </section>
            <div className="principles">
              <div><span>📅</span><b>Lịch rõ ràng</b><small>Theo mùa vụ & thời tiết</small></div>
              <div><span>👥</span><b>Quy mô phù hợp</b><small>Theo điều kiện vận hành</small></div>
              <div><span>🤝</span><b>Phối hợp kỹ</b><small>Thống nhất trước chương trình</small></div>
            </div>
          </>
        )}

        {tab === "news" && (
          <>
            <PageIntro eyebrow="Kiến thức & tin tức" title="Chuyện từ vùng mãng cầu" text="Hiểu sản phẩm, mùa vụ và những hoạt động đang diễn ra tại NABADEN." />
            <div className="news-list">
              {stories.map((story, index) => (
                <a href={story.href} target="_blank" rel="noreferrer" className={index === 0 ? "news-card large" : "news-card"} key={story.id}>
                  <img src={story.image} alt="" />
                  <div><small>{newsTag(story)}</small><h2>{story.title}</h2><p>{story.text}</p><span>Đọc trên nabaden.vn ↗</span></div>
                </a>
              ))}
            </div>
          </>
        )}

        {tab === "contact" && (
          <>
            <PageIntro eyebrow="Kết nối trực tiếp" title="NABADEN luôn sẵn sàng lắng nghe" text="Chọn kênh thuận tiện nhất để hỏi mùa vụ, sản phẩm, quà tặng hoặc lịch trải nghiệm." />
            <section className="contact-primary">
              <div className="contact-logo"><img src="/assets/nabaden-logo.webp" alt="NABADEN" /></div>
              <span>Hợp tác xã Nông nghiệp Mãng cầu Thạnh Tân</span>
              <h2>0907 215 521</h2>
              <div><a href="tel:0907215521">Gọi ngay</a><a href={ZALO_OA_URL}>Nhắn Zalo</a></div>
            </section>
            <div className="contact-list">
              <a href="https://maps.app.goo.gl/r8JkWUTPksY2CjsB7"><span>⌖</span><div><b>Địa chỉ vườn</b><small>Lộ 10, ấp Thạnh Trung, Phường Bình Minh, Tây Ninh</small></div><i>›</i></a>
              <a href="https://www.facebook.com/nabaden.vn/"><span>f</span><div><b>Facebook NABADEN</b></div><i>›</i></a>
              <a href="https://www.tiktok.com/@mangcaubaden"><span>♪</span><div><b>TikTok @mangcaubaden</b><small>Video từ vườn và sản phẩm</small></div><i>›</i></a>
              <button onClick={shareApp}><span>↗</span><div><b>Chia sẻ ứng dụng</b><small>Gửi NABADEN cho bạn bè</small></div><i>›</i></button>
              <button onClick={requestInstall}><span>＋</span><div><b>Cài lên màn hình chính</b><small>Mở nhanh như một ứng dụng</small></div><i>›</i></button>
            </div>
            <a className="certificate-card" href="/assets/chung-nhan-ocop-3-sao.jpg" target="_blank">
              <img src="/assets/chung-nhan-ocop-3-sao.jpg" alt="Chứng nhận OCOP 3 sao" />
              <div><span>Chứng nhận chính thức</span><h3>Quả Mãng cầu (Na) ta · OCOP 3 sao</h3><p>Mã số 72-703-01-2023</p></div>
            </a>
            <div className="saved-card"><span>♡ {favorites.length} sản phẩm yêu thích</span><span>◫ {basket.length} yêu cầu đang lưu</span></div>
          </>
        )}
      </div>

      {basket.length > 0 && (
        <button className="basket-fab with-assistant" onClick={() => setBasketOpen(true)} aria-label={`Mở giỏ quan tâm có ${basket.length} sản phẩm`}>
          <span>🛒</span><b>{basket.length}</b><em>Giỏ quan tâm</em>
        </button>
      )}

      <button className="assistant-fab" onClick={() => setSupportOpen(true)} aria-label="Mở trợ lý hỗ trợ NABADEN">
        <span className="assistant-bubble"><small>Trợ lý NABADEN</small><b>Bạn cần hỗ trợ gì?</b></span>
        <span className="assistant-avatar"><img src="/assets/nabaden-assistant.png" alt="" /><i /></span>
      </button>

      <nav className="bottom-nav" aria-label="Điều hướng ứng dụng">
        {navItems.map((item) => (
          <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}>
            <span>{item.icon}</span><small>{item.label}</small>
          </button>
        ))}
      </nav>

      {basketOpen && (
        <Modal title={`Giỏ quan tâm · ${basket.length}`} onClose={() => setBasketOpen(false)}>
          <div className="basket-list">
            {selectedProducts.map((product) => (
              <div key={product.id}><img src={product.image} alt="" /><div><b>{product.name}</b><small>{product.note}</small></div><button onClick={() => removeFromBasket(product.id)} aria-label={`Bỏ ${product.name} khỏi giỏ`}>×</button></div>
            ))}
          </div>
          <div className="consultation-copy">
            <div><span>Tin nhắn tư vấn đã soạn sẵn</span><button onClick={copyConsultationMessage}>Sao chép</button></div>
            <textarea value={consultationMessage} readOnly aria-label="Nội dung tin nhắn tư vấn" />
          </div>
          <div className="zalo-guide"><b>1</b><span>Sao chép nội dung</span><i>→</i><b>2</b><span>Mở Zalo OA</span><i>→</i><b>3</b><span>Dán và gửi</span></div>
          <a className="zalo-consult-button" href={ZALO_OA_URL} target="_blank" rel="noreferrer" onClick={() => void copyConsultationMessage()}>
            <span>Zalo</span><div><b>Tư vấn qua Zalo OA</b></div><i>→</i>
          </a>
        </Modal>
      )}

      {supportOpen && (
        <Modal title="Bạn cần hỗ trợ gì?" onClose={() => setSupportOpen(false)}>
          <div className="support-intro">
            <img src="/assets/nabaden-assistant.png" alt="Trợ lý NABADEN" />
            <div><b>Trợ lý NABADEN</b><span>Chọn nhu cầu để được hỗ trợ nhanh.</span></div>
          </div>
          <div className="support-options">
            {!isInstalled ? (
              <button onClick={() => { setSupportOpen(false); void requestInstall(); }}>
                <span className="support-option-icon">＋</span>
                <div><b>Cài ứng dụng NABADEN</b><small>Thêm vào màn hình chính để mở nhanh</small></div><i>→</i>
              </button>
            ) : (
              <div className="support-installed">
                <span>✓</span><div><b>Ứng dụng đã được cài</b><small>Bạn đang sử dụng NABADEN như một ứng dụng</small></div>
              </div>
            )}
            <button onClick={() => { setSupportOpen(false); openBooking(); }}>
              <span className="support-option-icon booking">🌿</span>
              <div><b>Đặt lịch hái quả tại vườn</b><small>Chọn ngày, khung giờ và số khách tham quan</small></div><i>→</i>
            </button>
            <a href={PARTNER_ZALO_URL} target="_blank" rel="noreferrer">
              <span className="support-option-icon partner">🤝</span>
              <div><b>Trở thành đối tác</b><small>Đăng ký hợp tác phân phối cùng NABADEN</small></div><i>→</i>
            </a>
            <a href={ZALO_OA_URL} target="_blank" rel="noreferrer">
              <span className="support-option-icon zalo">Zalo</span>
              <div><b>Đặt mua sản phẩm</b><small>Trao đổi trực tiếp với Zalo OA NABADEN</small></div><i>→</i>
            </a>
          </div>
        </Modal>
      )}

      {bookingOpen && (
        <Modal title="Đặt lịch hái quả tại vườn" onClose={closeBooking}>
          {bookingMessage ? (
            <div className="booking-ready">
              <div className="booking-ready-title"><span>✓</span><div><b>Tin nhắn đã được sao chép</b><small>Hãy dán nội dung này vào cuộc trò chuyện Zalo OA.</small></div></div>
              <div className="consultation-copy">
                <div><span>NỘI DUNG ĐẶT LỊCH</span><button onClick={() => void copyBookingMessage()}>Sao chép lại</button></div>
                <textarea value={bookingMessage} readOnly aria-label="Nội dung tin nhắn đặt lịch" />
              </div>
              <div className="zalo-guide"><b>1</b><span>Mở Zalo OA</span><i>→</i><b>2</b><span>Dán tin nhắn</span><i>→</i><b>3</b><span>Nhấn gửi</span></div>
              <a className="zalo-consult-button" href={ZALO_OA_URL} target="_blank" rel="noreferrer" onClick={() => void copyBookingMessage()}>
                <span>Zalo</span><div><b>Mở Zalo OA để gửi</b><small>Nội dung sẽ được sao chép lại</small></div><i>→</i>
              </a>
            </div>
          ) : (
            <form className="booking-form" onSubmit={submitBooking}>
              <label>Họ và tên<input name="name" required placeholder="Tên người liên hệ" /></label>
              <label>Số điện thoại<input name="phone" required inputMode="tel" placeholder="09xx xxx xxx" /></label>
              <div><label>Ngày dự kiến<input name="date" type="date" required /></label><label>Khung giờ<select name="time" defaultValue="Buổi sáng"><option>Buổi sáng</option><option>Buổi chiều</option><option>Chưa xác định</option></select></label></div>
              <div><label>Số người lớn<input name="adults" type="number" min="1" defaultValue="2" required /></label><label>Số trẻ em<input name="children" type="number" min="0" defaultValue="0" required /></label></div>
              <label>Nhu cầu<select name="program" defaultValue="Trải nghiệm hái quả tại vườn"><option>Trải nghiệm hái quả tại vườn</option><option>Tham quan và tìm hiểu vùng trồng</option><option>Chương trình dành cho trường học</option><option>Đoàn doanh nghiệp / đối tác</option></select></label>
              <label>Ghi chú<textarea name="note" placeholder="Độ tuổi trẻ em, nhu cầu riêng hoặc thời gian thuận tiện..." /></label>
              <p className="modal-note">Hoạt động phụ thuộc mùa vụ và thời tiết. NABADEN sẽ liên hệ xác nhận trước khi lịch có hiệu lực.</p>
              <button className="primary-wide" type="submit">Sao chép và mở Zalo OA →</button>
            </form>
          )}
        </Modal>
      )}

      {showIosHelp && (
        <Modal title="Thêm vào màn hình chính" onClose={() => setShowIosHelp(false)}>
          <div className="install-steps"><div><b>1</b><span>Mở menu <strong>Chia sẻ</strong> của trình duyệt</span></div><div><b>2</b><span>Chọn <strong>Thêm vào MH chính</strong></span></div><div><b>3</b><span>Nhấn <strong>Thêm</strong> để hoàn tất</span></div></div>
        </Modal>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function SectionHead({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action: string; onAction: () => void }) {
  return <div className="section-head"><div><span>{eyebrow}</span><h2>{title}</h2></div><button onClick={onAction}>{action} →</button></div>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></section>;
}

function ProductCard({ product, favorite, inBasket, onFavorite, onBasket, compact = false }: { product: typeof products[number]; favorite: boolean; inBasket: boolean; onFavorite: (id: string) => void; onBasket: (id: string) => void; compact?: boolean }) {
  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <div className="product-image"><img src={product.image} alt={product.name} />{product.ocop && <span>OCOP 3★</span>}<button onClick={() => onFavorite(product.id)} aria-label={favorite ? "Bỏ yêu thích" : "Thêm yêu thích"}>{favorite ? "♥" : "♡"}</button></div>
      <div className="product-info"><small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p><div><span>{product.note}</span><button className={inBasket ? "selected" : ""} onClick={() => onBasket(product.id)}>{inBasket ? "✓ Trong giỏ" : "+ Quan tâm"}</button></div></div>
    </article>
  );
}

function Program({ number, title, text }: { number: string; title: string; text: string }) {
  return <article><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><i>→</i></article>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal-sheet" role="dialog" aria-modal="true" aria-label={title}><div className="modal-handle" /><header><h2>{title}</h2><button onClick={onClose} aria-label="Đóng">×</button></header>{children}</section></div>;
}
