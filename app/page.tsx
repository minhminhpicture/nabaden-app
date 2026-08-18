"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TabId = "home" | "products" | "partner" | "experience" | "news" | "contact";
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
const HOTLINE_PHONE = "0907215521";
const HOTLINE_DISPLAY = "0907 215 521";

const products = [
  {
    id: "hop-3-trai",
    name: "Hộp Đặc Biệt (3 Quả)",
    tag: "OCOP 3★ · Quà Biếu VIP",
    category: "Tươi",
    image: "/assets/hop-qua-3-trai-vip-nabaden.jpg",
    note: "Tuyển chọn thượng hạng",
    description: "Hộp quà quai xách kính trong suốt, tuyển chọn 3 trái thượng hạng, lót rơm giấy & xốp lưới sang trọng.",
    ocop: true,
    sku: "MCBD-VIP-03",
    target: "Quà biếu VIP, đối tác, sự kiện, dâng lễ",
    pack: "Hộp quai xách cao cấp, ô kính trong, lót rơm & xốp lưới",
    fruitSpec: "Trái tuyển chọn đỉnh chóp, quả tròn đều mã sáng",
    shipPolicy: "Giao hỏa tốc hoặc gửi theo yêu cầu",
  },
  {
    id: "thung-5kg",
    name: "Thùng 5KG Tuyển Chọn",
    tag: "OCOP 3★ · Biếu Tặng Gia Đình",
    category: "Tươi",
    image: "/assets/thung-5kg-nabaden.jpg",
    note: "Trái già loại 1 · Bọc lưới",
    description: "Thùng carton 5kg chuyên dụng, từng trái già loại 1 bọc lưới xốp chống va đập, vị ngọt thanh tự nhiên sau 1-2 ngày.",
    ocop: true,
    sku: "MCBD-THUNG-05KG",
    target: "Thưởng thức gia đình, biếu người thân bạn bè",
    pack: "Thùng carton 5kg chuyên dụng, bọc lưới xốp từng trái",
    fruitSpec: "Trái già loại 1, mắt nở đều, ngọt thanh dẻo dai",
    shipPolicy: "Giao nhanh trong ngày hoặc gửi liên tỉnh",
  },
  {
    id: "thung-15kg",
    name: "Thùng 15KG Tuyển Chọn",
    tag: "OCOP 3★ · Đơn Sỉ Toàn Quốc",
    category: "Tươi",
    image: "/assets/thung-15kg-nabaden.jpg",
    note: "Giá sỉ tận vườn · Thùng 3-5 lớp",
    description: "Thùng carton 3-5 lớp dày dặn chịu lực, lỗ thoáng khí chống hấp hơi, tối ưu gửi xe khách & máy bay toàn quốc.",
    ocop: true,
    sku: "MCBD-THUNG-15KG",
    target: "Khách mua sỉ, đại lý trái cây sạch, gửi xa",
    pack: "Thùng carton 3-5 lớp dày dặn, lỗ thoáng khí chống hấp hơi",
    fruitSpec: "Trái già đều ngày, phân loại chuẩn kích cỡ",
    shipPolicy: "Gửi xe khách, chành xe, máy bay toàn quốc",
  },
  {
    id: "ruou-mang-cau",
    name: "Rượu từ mãng cầu",
    tag: "Chế Biến Tự Nhiên",
    category: "Chế biến",
    image: "/assets/product-wine.jpg",
    note: "Lên men tự nhiên",
    description: "Hương vị nồng nàn đặc trưng từ mãng cầu Bà Đen Tây Ninh, lên men tự nhiên làm quà biếu độc đáo.",
    ocop: false,
    sku: "MCBD-RUOU-01",
    target: "Thưởng thức, quà biếu đặc sản địa phương",
    pack: "Chai thủy tinh cao cấp, đóng hộp quà",
    fruitSpec: "Lên men từ mãng cầu chín chuẩn độ ngọt",
    shipPolicy: "Đóng gói chống sốc gửi toàn quốc",
  },
  {
    id: "mang-cau-say",
    name: "Mãng cầu sấy dẻo",
    tag: "Đặc Sản Tiện Lợi",
    category: "Chế biến",
    image: "/assets/product-dried.jpg",
    note: "Dẻo dai · Tiện lợi",
    description: "Giữ trọn vị ngọt thanh chua dịu tự nhiên của mãng cầu Bà Đen, bao bì nhỏ gọn dễ mang theo khi đi xa.",
    ocop: false,
    sku: "MCBD-SAY-01",
    target: "Ăn vặt gia đình, làm quà du lịch tiện lợi",
    pack: "Túi zip / Hộp kín bảo quản tiện lợi",
    fruitSpec: "Thịt mãng cầu tuyển chọn tách hạt sấy dẻo",
    shipPolicy: "Giao nhanh toàn quốc",
  },
  {
    id: "set-qua",
    name: "Set quà NABADEN",
    tag: "Quà Tặng Doanh Nghiệp",
    category: "Quà tặng",
    image: "/assets/product-gift-set.jpg",
    note: "Theo yêu cầu",
    description: "Cấu hình set quà đặc sản sang trọng kết hợp quả tươi OCOP và sản phẩm chế biến cho doanh nghiệp và sự kiện.",
    ocop: false,
    sku: "MCBD-SET-QUA",
    target: "Quà tặng doanh nghiệp, đối tác, sự kiện lớn",
    pack: "Set hộp quà cao cấp in logo theo yêu cầu",
    fruitSpec: "Trái VIP và sản phẩm chế biến đồng bộ",
    shipPolicy: "Giao tận nơi theo hợp đồng",
  },
];

const fallbackStories: NewsStory[] = [
  {
    id: "van-chuyen-mang-cau-ba-den",
    category: "Vận chuyển",
    date: "2026-08-17",
    title: "Vận chuyển Mãng cầu Bà Đen như thế nào?",
    text: "Khám phá quy trình NABADEN: lựa độ già, bọc lưới xốp chống va đập và gửi đường bay.",
    image: "/assets/thuc-te-dong-goi-nhieu-thung.jpg",
    href: "https://nabaden.vn/tin-tuc/van-chuyen-mang-cau-ba-den/",
  },
  {
    id: "cach-bao-quan-mang-cau-ba-den",
    category: "Kinh nghiệm",
    date: "2026-08-16",
    title: "Cách bảo quản Mãng Cầu Bà Đen đúng cách tại nhà",
    text: "Hướng dẫn bảo quản từ lúc nhận hàng đến khi chín, cách ủ chín tự nhiên và bảo quản mát.",
    image: "/assets/thung-mang-cau-ba-den-dong-hop-tay-ninh.jpg",
    href: "https://nabaden.vn/tin-tuc/cach-bao-quan-mang-cau-ba-den/",
  },
  {
    id: "mua-mang-cau-ba-den-thang-may",
    category: "Mùa vụ",
    date: "2026-08-16",
    title: "Mùa Mãng Cầu Bà Đen tháng mấy?",
    text: "Tìm hiểu mùa thu hoạch mãng cầu Tây Ninh, chính vụ, nghịch vụ và kinh nghiệm chọn mua.",
    image: "/assets/vuon-mang-cau-ba-den-tay-ninh-nang-dep.jpg",
    href: "https://nabaden.vn/tin-tuc/mua-mang-cau-ba-den-thang-may/",
  },
  {
    id: "di-tay-ninh-mua-mang-cau-ba-den-o-dau",
    category: "Kinh nghiệm",
    date: "2026-08-16",
    title: "Đi Tây Ninh mua Mãng Cầu Bà Đen ở đâu?",
    text: "Kinh nghiệm chọn mãng cầu ngon chuẩn, mua làm quà và tìm hiểu NABADEN.",
    image: "/assets/trai-mang-cau-chin-gia-loai-1.jpg",
    href: "https://nabaden.vn/tin-tuc/di-tay-ninh-mua-mang-cau-ba-den-o-dau/",
  },
  {
    id: "kgs-international-school-tham-quan-vuon-mang-cau-nabaden",
    category: "Trải nghiệm",
    date: "2026-07-18",
    title: "KGS International School tham quan NABADEN",
    text: "Hành trình nông nghiệp xanh dưới chân Núi Bà Đen trong chương trình KGS Unity Journey 2026.",
    image: "/assets/kgs-unity-journey-group.jpg",
    href: "https://nabaden.vn/tin-tuc/kgs-international-school-tham-quan-vuon-mang-cau-nabaden/",
  },
  {
    id: "mang-cau-ba-den-co-gi-dac-biet",
    category: "Kiến thức",
    date: "2026-07-04",
    title: "Mãng cầu Bà Đen có gì đặc biệt?",
    text: "Vùng trồng quanh chân Núi Bà Đen, vị ngọt thanh dai thơm và chỉ dẫn địa lý Tây Ninh.",
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
    id: "partner-boxes",
    image: "/assets/thuc-te-dong-goi-nhieu-thung.jpg",
    eyebrow: "Năng lực cung ứng",
    title: "Đóng thùng carton bọc lưới xốp chuyên dụng",
    text: "Từng quả bọc xốp êm ái, thùng thoáng khí chống hấp hơi, vận chuyển xe khách & máy bay an tâm.",
  },
  {
    id: "fresh-harvest",
    image: "/assets/thu-hoach-mang-cau-tuoi-cuong-la.jpg",
    eyebrow: "Vùng nguyên liệu Thạnh Tân",
    title: "Mãng cầu tươi vừa thu hoạch giữ nguyên cành lá",
    text: "Trái tuyển chọn già đều mắt na, canh tác VietGAP an toàn dưới chân Núi Bà Đen.",
  },
  {
    id: "fruit-scale",
    image: "/assets/can-mang-cau-ba-den-thanh-tan.jpg",
    eyebrow: "Phân loại chuẩn kích cỡ",
    title: "Cân đo và dán tem xuất xưởng HTX Thạnh Tân",
    text: "Mỗi thùng hàng đều được cân đủ ký và dán tem nhận diện thương hiệu NABADEN.",
  },
  {
    id: "ocop",
    image: "/assets/chung-nhan-ocop-3-sao.jpg",
    eyebrow: "Chứng nhận chính thức",
    title: "Quả Mãng cầu (Na) ta đạt OCOP 3 sao",
    text: "Chứng nhận mã số 72-703-01-2023 của HTX Nông nghiệp Mãng cầu Thạnh Tân do UBND TP. Tây Ninh cấp.",
    certificate: true,
  },
  {
    id: "cooperation-meeting",
    image: "/assets/cooperation-meeting.jpg",
    eyebrow: "Làm việc cùng đối tác",
    title: "Gặp gỡ, khảo sát vườn & xưởng thực tế",
    text: "NABADEN luôn sẵn sàng đón tiếp đối tác, đại lý và CTV đến khảo sát thực địa.",
  },
];

const productFaqs = [
  {
    q: "Mãng cầu sau khi nhận hàng bao lâu thì chín ăn được?",
    a: "Mãng cầu được hái khi mắt na đã nở to, đạt đủ độ già sinh lý. Sau khi đóng thùng vận chuyển 1-2 ngày đến nơi, quả sẽ mềm tay dần và chín dẻo thơm ngon sau khoảng 24-48 giờ ở nhiệt độ phòng thoáng mát.",
  },
  {
    q: "Vườn có hỗ trợ giao hàng đi TP.HCM, Hà Nội và các tỉnh không?",
    a: "Có. NABADEN hỗ trợ đóng thùng carton 3-5 lớp bọc lưới xốp chuyên dụng và gửi xe khách trong ngày (về TP.HCM, Đông Nam Bộ, Miền Tây) hoặc chuyển phát hỏa tốc đường hàng không 1-2 ngày ra Hà Nội và các tỉnh phía Bắc, đảm bảo trái nguyên vẹn không lo dập nát.",
  },
  {
    q: "Cách bảo quản mãng cầu sau khi chín để ăn ngon dẻo nhất?",
    a: "Khi trái vừa mềm tay (đạt độ chín dẻo thơm nhất), bạn nên thưởng thức ngay hoặc bọc màng thực phẩm để ngăn mát tủ lạnh (8-12°C) dùng dần trong 2-3 ngày. Vị ngọt mát lạnh của thịt quả mãng cầu chín dẻo sẽ ngon gấp bội.",
  },
  {
    q: "Mãng cầu NABADEN có đạt chuẩn an toàn VietGAP sạch không?",
    a: "Vùng trồng Thạnh Tân dưới chân Núi Bà Đen áp dụng chuẩn VietGAP, bọc trái 100% bằng túi bảo vệ chuyên dụng trực tiếp trên cây từ khi trái còn nhỏ, cách ly hoàn toàn sâu bọ và cam kết sạch an toàn tuyệt đối cho sức khỏe.",
  },
  {
    q: "Chính sách bảo hành đền bù hoặc đổi trả sản phẩm hư hỏng ra sao?",
    a: "NABADEN cam kết bảo hành 1-đổi-1 hoặc hoàn tiền tương ứng nếu quả bị dập nát, hư hỏng trong quá trình vận chuyển. Quý khách chỉ cần quay clip/chụp ảnh mở thùng hàng và gửi qua Zalo OA NABADEN.",
  },
  {
    q: "Làm sao để nhận báo giá sỉ hoặc đăng ký làm CTV / Đại lý?",
    a: "Quý khách vui lòng bấm sang tab '🤝 Hợp tác' trên ứng dụng để gửi thông tin đăng ký, hoặc gọi trực tiếp Hotline 0907 215 521 / nhắn tin Zalo OA để nhận bảng giá sỉ & ưu đãi chiết khấu mới nhất hôm nay.",
  },
];

const navItems: Array<{ id: TabId; label: string; icon: string; highlight?: boolean }> = [
  { id: "home", label: "Trang chủ", icon: "⌂" },
  { id: "products", label: "Sản phẩm", icon: "◫" },
  { id: "partner", label: "Hợp tác", icon: "🤝", highlight: true },
  { id: "experience", label: "Trải nghiệm", icon: "♧" },
  { id: "news", label: "Tin tức", icon: "▤" },
  { id: "contact", label: "Kết nối", icon: "◎" },
];

export default function Home() {
  const [tab, setTab] = useState<TabId>(() => {
    if (typeof window !== "undefined") {
      const requestedTab = new URLSearchParams(window.location.search).get("tab");
      if (navItems.some((item) => item.id === requestedTab)) return requestedTab as TabId;
    }
    return "home";
  });
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("nabaden-favorites") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });
  const [basket, setBasket] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("nabaden-basket") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });
  const [basketOpen, setBasketOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [trustSlide, setTrustSlide] = useState(0);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
      return window.matchMedia("(display-mode: standalone)").matches || standaloneNavigator.standalone === true;
    }
    return false;
  });
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [toast, setToast] = useState("");
  const [online, setOnline] = useState(() => {
    if (typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });
  const [stories, setStories] = useState<NewsStory[]>(fallbackStories);

  // Partner Tab State
  const [partnerRole, setPartnerRole] = useState<"ctv" | "npp">("ctv");
  const [formRole, setFormRole] = useState("Cộng tác viên (CTV)");
  const [partnerSuccessData, setPartnerSuccessData] = useState<{
    fullName: string;
    phone: string;
    province: string;
    partnerType: string;
  } | null>(null);
  const [submittingPartner, setSubmittingPartner] = useState(false);

  useEffect(() => {
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
      const matchesQuery = !term || `${product.name} ${product.description} ${product.tag}`.toLocaleLowerCase("vi").includes(term);
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
      ...selectedProducts.map((product) => `• ${product.name} (${product.note})`),
      "",
      "Nhờ NABADEN tư vấn giúp tôi về báo giá hôm nay, quy cách đóng gói và thời gian giao hàng. Xin cảm ơn!",
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
    shareUrl.searchParams.set("share", "partner-20260817");
    if (navigator.share) {
      await navigator.share({
        title: "NABADEN - Mãng cầu Bà Đen Tây Ninh",
        text: "Sản phẩm OCOP 3 sao và cơ hội hợp tác phân phối Mãng Cầu Bà Đen",
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

  const submitPartnerForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("name") || "").trim();
    const rawPhone = String(data.get("phone") || "").trim();
    const phoneVal = rawPhone.replace(/[\s\-\.]/g, "").replace(/^\+84/, "0").replace(/^84/, "0");
    const province = String(data.get("region") || "").trim();
    const salesChannel = String(data.get("channel") || "").trim();
    const userNotes = String(data.get("note") || "").trim();

    const vnPhoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
    if (!vnPhoneRegex.test(phoneVal)) {
      notify("Số điện thoại Zalo không hợp lệ. Vui lòng nhập 10 chữ số (ví dụ: 0907215521)");
      return;
    }

    if (!province) {
      notify("Vui lòng chọn Tỉnh / Thành phố bạn đang sinh sống.");
      return;
    }

    setSubmittingPartner(true);
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    const noteWithSource = userNotes ? `${userNotes} (Nguồn: app.nabaden.vn)` : "(Nguồn: app.nabaden.vn)";

    const payload = {
      timestamp: formattedTimestamp,
      partnerType: formRole,
      fullName,
      phone: phoneVal,
      province,
      salesChannel,
      notes: noteWithSource,
      row: [
        formattedTimestamp,
        formRole,
        fullName,
        "'" + phoneVal,
        province,
        salesChannel,
        noteWithSource
      ]
    };

    const webhookUrl = "https://script.google.com/macros/s/AKfycbz5zVdK4zDesJDwH-ijWZM5rEeEsUZMo0A3ugnuIa96GKlGZYiavQq40Ng97uR5RtHbsw/exec";

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        mode: "no-cors"
      });
      setPartnerSuccessData({
        fullName,
        phone: phoneVal,
        province,
        partnerType: formRole
      });
      notify("🎉 Đã lưu thông tin về Trang Tính NABADEN!");
    } catch {
      setPartnerSuccessData({
        fullName,
        phone: phoneVal,
        province,
        partnerType: formRole
      });
      notify("Đã đăng ký thành công!");
    } finally {
      setSubmittingPartner(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => changeTab("home")} aria-label="Về trang chủ">
          <img src="/assets/nabaden-logo.webp" alt="NABADEN" />
        </button>
        <div className="top-actions">
          <button className="icon-button" onClick={shareApp} aria-label="Chia sẻ ứng dụng">↗</button>
        </div>
      </header>

      {!online && <div className="offline-banner">Bạn đang ngoại tuyến · Nội dung đã lưu vẫn dùng được</div>}

      <div className="screen" key={tab}>
        {/* =========================================
            TAB 1: TRANG CHỦ (HOME)
           ========================================= */}
        {tab === "home" && (
          <>
            <section className="hero-card">
              <img src="/assets/vuon-mang-cau-ba-den-tay-ninh-nang-dep.jpg" alt="Vườn mãng cầu Bà Đen NABADEN" />
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="eyebrow light">Từ vùng nguyên liệu Tây Ninh</span>
                <h1><a href="https://mangcaubaden.vn">Mãng cầu Bà Đen</a><br />chính gốc Tây Ninh.</h1>
                <p>Quả tươi OCOP 3 sao · Đóng thùng bọc xốp · Tuyển NPP & CTV toàn quốc</p>
                <div className="hero-btn-row">
                  <button className="hero-btn-primary" onClick={() => changeTab("products")}>Xem sản phẩm <b>→</b></button>
                  <button className="hero-btn-secondary" onClick={() => changeTab("partner")}>🤝 Hợp tác phân phối</button>
                </div>
              </div>
              <div className="hero-badge"><strong>3★</strong><span>OCOP<br />chính thức</span></div>
            </section>

            <section className="quick-grid" aria-label="Tác vụ nhanh">
              <button onClick={() => changeTab("products")}><span>🍈</span><b>Sản phẩm</b><small>3 quy cách</small></button>
              <button className="highlight-quick" onClick={() => changeTab("partner")}><span>🤝</span><b>Hợp tác</b><small>CTV / NPP</small></button>
              <button onClick={openBooking}><span>🌿</span><b>Đặt lịch vườn</b><small>Hái quả</small></button>
              <a href={ZALO_OA_URL} target="_blank" rel="noreferrer"><span>💬</span><b>Nhắn Zalo</b><small>Tư vấn nhanh</small></a>
            </section>

            {/* Banner nổi bật Hợp Tác */}
            <section className="home-partner-card">
              <span className="home-partner-badge">🤝 Cơ hội hợp tác kinh doanh</span>
              <h2>Cùng NABADEN phân phối Mãng Cầu Bà Đen</h2>
              <p>Mô hình linh hoạt, không áp lực ôm hàng, NABADEN hỗ trợ cắt hái tại vườn, đóng thùng bọc xốp, ship COD toàn quốc và đối soát minh bạch.</p>
              <div className="home-partner-perks">
                <div><span>✓</span> Vốn 0đ cho CTV</div>
                <div><span>✓</span> Giá sỉ tận vườn cho NPP</div>
                <div><span>✓</span> Nguồn hàng ổn định</div>
                <div><span>✓</span> Bao dập vỡ vận chuyển</div>
              </div>
              <button className="home-partner-btn" onClick={() => changeTab("partner")}>
                Khám phá chính sách hợp tác chi tiết →
              </button>
            </section>

            {/* Slider Thực Tế & Chứng Nhận */}
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
                  {trustSlides[trustSlide].certificate && <a href="/assets/chung-nhan-ocop-3-sao.jpg" target="_blank" rel="noreferrer">Xem chứng nhận đầy đủ ↗</a>}
                </div>
                <button className="trust-prev" onClick={() => setTrustSlide((trustSlide - 1 + trustSlides.length) % trustSlides.length)} aria-label="Ảnh trước">‹</button>
                <button className="trust-next" onClick={() => setTrustSlide((trustSlide + 1) % trustSlides.length)} aria-label="Ảnh tiếp theo">›</button>
              </div>
              <div className="trust-dots" aria-label="Chọn ảnh">
                {trustSlides.map((slide, index) => <button key={slide.id} className={trustSlide === index ? "active" : ""} onClick={() => setTrustSlide(index)} aria-label={`Xem slide ${index + 1}`} />)}
              </div>
              <div className="trust-proof">
                <span><b>3★</b> OCOP chính thức</span>
                <span><b>✓</b> Thùng xốp chuyên dụng</span>
                <span><b>🤝</b> Tiếp nhận CTV/NPP</span>
              </div>
            </section>

            {/* Sản phẩm chủ lực */}
            <SectionHead eyebrow="Quy cách đóng gói" title="Dòng sản phẩm chính gốc" action="Xem tất cả" onAction={() => changeTab("products")} />
            <div className="product-grid home-product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} inBasket={basket.includes(product.id)} onFavorite={toggleFavorite} onBasket={toggleBasket} />
              ))}
            </div>

            <section className="story-card">
              <div>
                <span className="eyebrow">Câu chuyện thương hiệu</span>
                <h2>Hợp tác không chỉ bán hàng, mà cùng nâng giá trị trái quê.</h2>
                <p>NABADEN là cầu nối giữa HTX Thạnh Tân, nông dân Tây Ninh và đối tác phân phối trên toàn quốc.</p>
                <button onClick={() => changeTab("partner")}>Xem đề xuất hợp tác →</button>
              </div>
              <img src="/assets/cooperation-meeting.jpg" alt="Buổi làm việc hợp tác NABADEN" />
            </section>

            <SectionHead eyebrow="Cẩm nang & tin tức" title="Kiến thức từ vùng trồng" action="Xem thêm" onAction={() => changeTab("news")} />
            <a className="featured-news" href={stories[0].href} target="_blank" rel="noreferrer">
              <img src={stories[0].image} alt="" />
              <div><small>{newsTag(stories[0])}</small><h3>{stories[0].title}</h3><span>Đọc bài trên nabaden.vn ↗</span></div>
            </a>
          </>
        )}

        {/* =========================================
            TAB 2: SẢN PHẨM (PRODUCTS)
           ========================================= */}
        {tab === "products" && (
          <>
            <PageIntro eyebrow="Chuẩn VietGAP & OCOP 3 Sao" title="Danh mục Sản Phẩm NABADEN" text="Tuyển chọn trái già loại 1 dưới chân Núi Bà Đen Tây Ninh với 3 quy cách đóng gói chuyên dụng và các dòng chế biến cao cấp." />
            
            <label className="search-box">
              <span>⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm hộp VIP, thùng 5kg, thùng 15kg..." />
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

            {!filteredProducts.length && (
              <div className="empty-state">
                <span>🍃</span>
                <h3>Chưa tìm thấy sản phẩm</h3>
                <p>Thử một từ khóa hoặc chuyển nhóm sản phẩm khác.</p>
              </div>
            )}

            {/* Bảng so sánh quy cách dạng thẻ mobile rõ đẹp */}
            <section className="specs-section">
              <span className="eyebrow">So sánh quy cách</span>
              <h3>Chi tiết quy cách đóng gói Mãng Cầu NABADEN</h3>
              <p>Giúp quý khách dễ dàng lựa chọn quy cách phù hợp cho mục đích biếu tặng, gia đình thưởng thức hoặc nhập sỉ phân phối.</p>
              <div className="spec-cards-stack">
                {products.slice(0, 3).map((item) => (
                  <article key={item.id} className="spec-card-item">
                    <div className="spec-card-head">
                      <h4 className="spec-card-title">{item.name}</h4>
                      <span className="spec-card-tag">{item.tag}</span>
                    </div>
                    <div className="spec-card-rows">
                      <div className="spec-card-row">
                        <span className="spec-card-label">🎯 Mục đích sử dụng:</span>
                        <span className="spec-card-value">{item.target}</span>
                      </div>
                      <div className="spec-card-row">
                        <span className="spec-card-label">📦 Quy cách đóng gói:</span>
                        <span className="spec-card-value">{item.pack}</span>
                      </div>
                      <div className="spec-card-row">
                        <span className="spec-card-label">🍈 Đặc điểm trái:</span>
                        <span className="spec-card-value">{item.fruitSpec}</span>
                      </div>
                      <div className="spec-card-row">
                        <span className="spec-card-label">🚚 Chính sách giao hàng:</span>
                        <span className="spec-card-value">{item.shipPolicy}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FAQ Sản Phẩm */}
            <section className="faq-box">
              <span className="eyebrow">Hỏi đáp mua hàng</span>
              <h3>Câu hỏi thường gặp về Mãng Cầu NABADEN</h3>
              {productFaqs.map((faq, i) => (
                <details className="faq-item" key={i} open={i === 0}>
                  <summary className="faq-summary">
                    <span>{faq.q}</span>
                    <b>+</b>
                  </summary>
                  <div className="faq-content">{faq.a}</div>
                </details>
              ))}
            </section>

            <div className="notice-card">
              <span>✓</span>
              <div>
                <b>Thông tin minh bạch</b>
                <p>Huy hiệu OCOP 3 sao áp dụng cho “Quả Mãng cầu (Na) ta” theo Quyết định của UBND TP. Tây Ninh (Mã số: 72-703-01-2023).</p>
              </div>
            </div>
          </>
        )}

        {/* =========================================
            TAB 3: HỢP TÁC (PARTNER / COOPERATION)
           ========================================= */}
        {tab === "partner" && (
          <>
            <section className="partner-hero-box">
              <span className="partner-hero-kicker">🤝 Tuyển Đối Tác Phân Phối & CTV</span>
              <h1 className="partner-hero-title">Đồng hành phân phối <em>Mãng Cầu Bà Đen</em></h1>
              <p className="partner-hero-desc">Không áp lực ôm hàng, NABADEN hỗ trợ toàn bộ các khâu từ cắt hái tại vườn, bọc lưới xốp đóng thùng, giao hàng thu COD và đối soát chiết khấu minh bạch.</p>
              
              <div className="partner-hero-pills">
                <span className="partner-pill"><b>✓</b> Vốn 0đ cho CTV</span>
                <span className="partner-pill"><b>✓</b> Giá sỉ tận vườn cho NPP</span>
                <span className="partner-pill"><b>✓</b> Bao dập vỡ khi ship</span>
                <span className="partner-pill"><b>✓</b> OCOP 3★ & VietGAP</span>
              </div>

              <div className="partner-hero-actions">
                <a className="btn-partner-primary" href={PARTNER_ZALO_URL} target="_blank" rel="noreferrer">
                  Nhắn Zalo Đối Tác ↗
                </a>
                <a className="btn-partner-secondary" href={`tel:${HOTLINE_PHONE}`}>
                  📞 Gọi {HOTLINE_DISPLAY}
                </a>
              </div>
            </section>

            {/* Switcher: CTV vs Nhà Phân Phối */}
            <div className="partner-role-switch">
              <button 
                className={`partner-role-tab ${partnerRole === "ctv" ? "active" : ""}`}
                onClick={() => { setPartnerRole("ctv"); setFormRole("Cộng tác viên (CTV)"); }}
              >
                <span>🌸</span>
                <b>Cộng Tác Viên (CTV)</b>
                <small>Bán online · Vốn 0đ</small>
              </button>
              <button 
                className={`partner-role-tab ${partnerRole === "npp" ? "active" : ""}`}
                onClick={() => { setPartnerRole("npp"); setFormRole("Nhà Phân Phối / Đại Lý"); }}
              >
                <span>🏢</span>
                <b>Nhà Phân Phối / Đại Lý</b>
                <small>Bán sỉ · Cửa hàng sạch</small>
              </button>
            </div>

            {/* Chi tiết chính sách theo vai trò */}
            {partnerRole === "ctv" ? (
              <div className="partner-tier-box ctv">
                <div className="tier-header">
                  <div className="tier-header-info">
                    <h3>Cộng Tác Viên Bán Online</h3>
                    <span>Không cần vốn · Không ôm hàng · Không lo rủi ro</span>
                  </div>
                  <span className="tier-badge-pill ctv">Dành cho cá nhân</span>
                </div>
                <div className="tier-benefits-list">
                  <div className="tier-benefit-row ctv">
                    <span>1</span>
                    <div><b>Vốn 0 đồng, không ôm hàng:</b><small>Bạn chỉ cần đăng bài giới thiệu và chốt đơn. Không cần nhập hàng trước, không lo tồn đọng hay thối hỏng quả.</small></div>
                  </div>
                  <div className="tier-benefit-row ctv">
                    <span>2</span>
                    <div><b>NABADEN lo đóng gói & ship COD:</b><small>Vườn tự tay hái trái già chuẩn, bọc lưới xốp, đóng thùng carton và giao tận tay khách của bạn, thu tiền COD hộ.</small></div>
                  </div>
                  <div className="tier-benefit-row ctv">
                    <span>3</span>
                    <div><b>Chiết khấu hấp dẫn & đối soát tuần:</b><small>Nhận hoa hồng trực tiếp trên từng đơn hàng. Bảng kê đối soát minh bạch gửi về mỗi tuần.</small></div>
                  </div>
                  <div className="tier-benefit-row ctv">
                    <span>4</span>
                    <div><b>Kho media ảnh & video thật từ vườn:</b><small>Được cung cấp trọn bộ hình ảnh lứa trái thực tế trong ngày, video hái quả và bài mẫu đăng mạng xã hội.</small></div>
                  </div>
                </div>
                <a className="btn-partner-primary" href={PARTNER_ZALO_URL} target="_blank" rel="noreferrer" style={{ width: "100%" }}>
                  Đăng ký làm CTV qua Zalo OA →
                </a>
              </div>
            ) : (
              <div className="partner-tier-box npp">
                <div className="tier-header">
                  <div className="tier-header-info">
                    <h3>Nhà Phân Phối & Đại Lý</h3>
                    <span>Giá sỉ tận gốc HTX · Nguồn hàng ổn định cả vụ nghịch</span>
                  </div>
                  <span className="tier-badge-pill npp">Đại lý & Cửa hàng</span>
                </div>
                <div className="tier-benefits-list">
                  <div className="tier-benefit-row npp">
                    <span>1</span>
                    <div><b>Giá sỉ ưu đãi nhất tận vườn:</b><small>Báo giá trực tiếp từ HTX Nông nghiệp Mãng cầu Thạnh Tân, chiết khấu cao theo khối lượng thùng 5kg - 15kg.</small></div>
                  </div>
                  <div className="tier-benefit-row npp">
                    <span>2</span>
                    <div><b>Nguồn cung ổn định quanh năm:</b><small>Ưu tiên giữ hàng và ổn định giá cả trong mùa nghịch vụ lẫn dịp cao điểm lễ, Tết.</small></div>
                  </div>
                  <div className="tier-benefit-row npp">
                    <span>3</span>
                    <div><b>Thùng carton 3-5 lớp chuyên dụng:</b><small>Chống va đập, thoáng khí chống hấp hơi, vận chuyển xe khách liên tỉnh & đường bay toàn quốc an tâm.</small></div>
                  </div>
                  <div className="tier-benefit-row npp">
                    <span>4</span>
                    <div><b>Hồ sơ OCOP 3 sao & hỗ trợ POSM:</b><small>Cung cấp giấy chứng nhận OCOP 3 sao, VietGAP, tem truy xuất nguồn gốc, hình ảnh standee cho điểm bán.</small></div>
                  </div>
                </div>
                <a className="btn-partner-primary" href="#partner-form" style={{ width: "100%", background: "#b45309", color: "#ffffff" }}>
                  Nhận báo giá sỉ & Đàm phán hợp tác →
                </a>
              </div>
            )}

            {/* Quy trình làm việc 4 bước */}
            <section className="partner-process-box">
              <span className="eyebrow">Quy trình làm việc</span>
              <h3>Quy trình hợp tác 4 bước nhanh gọn</h3>
              <div className="process-grid-4">
                <div className="process-step-item">
                  <div className="process-step-num">01</div>
                  <div className="process-step-title">Tiếp nhận</div>
                  <div className="process-step-desc">Nắm bắt khu vực, mô hình kinh doanh & nhu cầu dự kiến.</div>
                </div>
                <div className="process-step-item">
                  <div className="process-step-num">02</div>
                  <div className="process-step-title">Tư vấn</div>
                  <div className="process-step-desc">Gửi bảng giá chiết khấu, quy cách và chính sách phù hợp.</div>
                </div>
                <div className="process-step-item">
                  <div className="process-step-num">03</div>
                  <div className="process-step-title">Khảo sát / Mẫu</div>
                  <div className="process-step-desc">Gửi mẫu thử thực tế hoặc đón tiếp khảo sát tại vườn & xưởng.</div>
                </div>
                <div className="process-step-item">
                  <div className="process-step-num">04</div>
                  <div className="process-step-title">Triển khai</div>
                  <div className="process-step-desc">Thống nhất lịch giao, bắt đầu đẩy hàng và đối soát định kỳ.</div>
                </div>
              </div>
            </section>

            {/* Năng lực thực tế */}
            <section className="specs-section">
              <span className="eyebrow">Có thật để cùng làm thật</span>
              <h3>Năng lực sản xuất & cung ứng thực tế</h3>
              <p>Nền tảng hợp tác bền vững được xây dựng trên vùng trồng Thạnh Tân, nhà xưởng đóng gói đạt chuẩn và sự đồng hành tận tâm.</p>
              <div className="experience-gallery">
                <figure className="wide">
                  <img src="/assets/thuc-te-dong-goi-nhieu-thung.jpg" alt="Xưởng đóng gói mãng cầu NABADEN" />
                  <figcaption>Xưởng phân loại và đóng thùng carton bọc xốp chuyên dụng</figcaption>
                </figure>
                <figure>
                  <img src="/assets/can-mang-cau-ba-den-thanh-tan.jpg" alt="Cân trọng lượng mãng cầu" />
                  <figcaption>Cân đo và dán tem xuất xưởng</figcaption>
                </figure>
                <figure>
                  <img src="/assets/cooperation-meeting.jpg" alt="Làm việc cùng đối tác" />
                  <figcaption>Trao đổi và hợp tác trực tiếp</figcaption>
                </figure>
              </div>
            </section>

            {/* Form đăng ký hợp tác trực tiếp chuẩn 100% nabaden.vn/hop-tac */}
            <section className="partner-form-wrapper" id="partner-form">
              {partnerSuccessData ? (
                <div className="partner-success-state" style={{ textAlign: "center", padding: "10px 0" }}>
                  <div className="success-icon-badge" style={{ fontSize: "40px", marginBottom: "8px" }}>🎉</div>
                  <h3 className="success-title" style={{ fontFamily: "Lora, serif", fontSize: "24px", color: "var(--green)", margin: "0 0 8px" }}>
                    Đăng Ký Thành Công!
                  </h3>
                  <p className="success-subtitle" style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.5", margin: "0 0 20px" }}>
                    Cảm ơn bạn đã đăng ký. Thông tin đề xuất hợp tác đã được tự động lưu về hệ thống Trang Tính NABADEN. Đội ngũ NABADEN sẽ chủ động liên hệ qua Zalo/SĐT trong ít phút.
                  </p>

                  <div className="consultation-copy" style={{ textAlign: "left", marginBottom: "20px", background: "var(--sand)", border: "1.5px solid var(--line-strong)", borderRadius: "16px", padding: "14px" }}>
                    <div style={{ display: "grid", gap: "8px", fontSize: "13.5px" }}>
                      <div><b>Họ và tên:</b> <span style={{ color: "var(--green-dark)", fontWeight: "700" }}>{partnerSuccessData.fullName}</span></div>
                      <div><b>Số điện thoại (Zalo):</b> <span style={{ color: "var(--green-dark)", fontWeight: "700" }}>{partnerSuccessData.phone}</span></div>
                      <div><b>Tỉnh / Thành phố:</b> <span>{partnerSuccessData.province}</span></div>
                      <div><b>Hình thức đăng ký:</b> <span style={{ color: "var(--gold-dark)", fontWeight: "700" }}>{partnerSuccessData.partnerType}</span></div>
                    </div>
                  </div>

                  <div className="partner-form-btns" style={{ gap: "10px" }}>
                    <button className="btn-submit-partner" onClick={() => changeTab("home")}>
                      Quay Về Trang Chủ ➔
                    </button>
                    <button
                      type="button"
                      className="btn-call-partner"
                      onClick={() => setPartnerSuccessData(null)}
                    >
                      ↺ Đăng Ký Đề Xuất Khác
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="partner-form-head">
                    <span className="form-tag">ĐĂNG KÝ HỢP TÁC</span>
                    <h3>Gia Nhập Mạng Lưới Đối Tác &amp; CTV NABADEN</h3>
                    <p>Vui lòng điền thông tin để đội ngũ NABADEN liên hệ gửi chính sách chiết khấu và trao đổi trực tiếp qua Zalo.</p>
                  </div>

                  <form className="partner-form" onSubmit={submitPartnerForm}>
                    <label>
                      Bạn muốn đăng ký theo hình thức: *
                      <div className="form-role-select-grid">
                        {[
                          { id: "Cộng Tác Viên (CTV)", label: "🌱 Cộng Tác Viên (CTV)", sub: "Bán theo đơn, không ôm hàng, nhận chiết khấu" },
                          { id: "Nhà Phân Phối / Đại Lý Sỉ", label: "👑 Nhà Phân Phối / Đại Lý", sub: "Nhập số lượng lớn, giá sỉ tại vườn" },
                        ].map((role) => (
                          <button
                            type="button"
                            key={role.id}
                            className={`form-role-card ${formRole === role.id ? "active" : ""}`}
                            onClick={() => setFormRole(role.id)}
                            style={{ flexDirection: "column", alignItems: "flex-start", gap: "2px", padding: "12px 10px" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", fontWeight: "800" }}>
                              <span>{formRole === role.id ? "●" : "○"}</span> {role.label}
                            </div>
                            <small style={{ color: "var(--muted)", fontSize: "11px", marginLeft: "18px", lineHeight: "1.3" }}>{role.sub}</small>
                          </button>
                        ))}
                      </div>
                    </label>

                    {formRole.includes("CTV") || formRole.includes("Cộng Tác Viên") ? (
                      <div className="benefit-callout ctv" style={{ margin: "4px 0 10px" }}>
                        <span style={{ fontSize: "20px" }}>💡</span>
                        <span><b>Chính sách CTV:</b> Không bắt buộc ôm hàng. NABADEN hỗ trợ các khâu hái trái tại vườn, bọc xốp, đóng thùng, gửi hàng và thu hộ COD, đối soát chiết khấu định kỳ cùng bạn.</span>
                      </div>
                    ) : (
                      <div className="benefit-callout npp" style={{ margin: "4px 0 10px" }}>
                        <span style={{ fontSize: "20px" }}>⭐</span>
                        <span><b>Chính sách NPP / Đại Lý:</b> Báo giá sỉ ưu đãi nhất tận vườn từ HTX Thạnh Tân, ưu tiên nguồn hàng vụ nghịch, hỗ trợ tem OCOP 3★, VietGAP & hình ảnh truyền thông.</span>
                      </div>
                    )}

                    <label>
                      Họ và tên của bạn *
                      <input name="name" required placeholder="Ví dụ: Nguyễn Văn An" />
                    </label>

                    <label>
                      Số điện thoại (có Zalo) *
                      <input name="phone" required inputMode="tel" placeholder="Ví dụ: 0907 215 521" />
                    </label>

                    <label>
                      Tỉnh / Thành phố sinh sống *
                      <select name="region" required className="form-select">
                        <option value="">-- Chọn Tỉnh / Thành phố --</option>
                        <optgroup label="⭐ Tỉnh / Thành phố trọng điểm">
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Tây Ninh">Tây Ninh</option>
                          <option value="Bình Dương">Bình Dương</option>
                          <option value="Đồng Nai">Đồng Nai</option>
                          <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Cần Thơ">Cần Thơ</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                        </optgroup>
                        <optgroup label="📋 Danh sách các Tỉnh / Thành">
                          <option value="An Giang">An Giang</option>
                          <option value="Bến Tre">Bến Tre</option>
                          <option value="Bình Định">Bình Định</option>
                          <option value="Bình Thuận">Bình Thuận</option>
                          <option value="Cà Mau">Cà Mau</option>
                          <option value="Đắc Lắk">Đắc Lắk</option>
                          <option value="Đồng Tháp">Đồng Tháp</option>
                          <option value="Gia Lai">Gia Lai</option>
                          <option value="Khánh Hòa">Khánh Hòa</option>
                          <option value="Kiên Giang">Kiên Giang</option>
                          <option value="Lâm Đồng">Lâm Đồng</option>
                          <option value="Long An">Long An</option>
                          <option value="Nghệ An">Nghệ An</option>
                          <option value="Ninh Bình">Ninh Bình</option>
                          <option value="Quảng Nam">Quảng Nam</option>
                          <option value="Quảng Ngãi">Quảng Ngãi</option>
                          <option value="Quảng Ninh">Quảng Ninh</option>
                          <option value="Thanh Hóa">Thanh Hóa</option>
                          <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                          <option value="Tiền Giang">Tiền Giang</option>
                          <option value="Vĩnh Long">Vĩnh Long</option>
                          <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                        </optgroup>
                      </select>
                    </label>

                    <label>
                      Kênh bán / Kinh nghiệm hiện tại
                      <select name="channel" className="form-select">
                        <option value="Bán online qua Facebook / Zalo / TikTok">Bán online qua Facebook / Zalo / TikTok</option>
                        <option value="Cửa hàng trái cây / Thực phẩm sạch">Cửa hàng trái cây / Thực phẩm sạch</option>
                        <option value="Vựa hoa quả / Đại lý sỉ nông sản">Vựa hoa quả / Đại lý sỉ nông sản</option>
                        <option value="Bán cho người thân, bạn bè, đồng nghiệp">Bán cho người thân, bạn bè, đồng nghiệp</option>
                        <option value="Chưa có kinh nghiệm (muốn được hỗ trợ)">Chưa có kinh nghiệm (muốn được hỗ trợ)</option>
                      </select>
                    </label>

                    <label>
                      Ghi chú / Nhu cầu cụ thể
                      <textarea name="note" placeholder="Ví dụ: Em muốn tìm hiểu chính sách CTV bán khu vực Quận 7..." />
                    </label>

                    <div className="partner-form-btns">
                      <button className="btn-submit-partner" type="submit" disabled={submittingPartner}>
                        {submittingPartner ? "Đang gửi thông tin..." : "⚡ Đăng Ký Hợp Tác Ngay →"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </>
        )}

        {/* =========================================
            TAB 4: TRẢI NGHIỆM (EXPERIENCE)
           ========================================= */}
        {tab === "experience" && (
          <>
            <PageIntro eyebrow="Dưới chân Núi Bà Đen" title="Một ngày chạm vào vườn xanh" text="Chương trình tham quan và trải nghiệm hái quả được thiết kế theo mùa vụ, thời tiết và quy mô từng đoàn." />
            <div className="experience-hero">
              <img src="/assets/kgs-unity-journey-group.jpg" alt="Đoàn khách trải nghiệm tại NABADEN" />
              <div>
                <strong>Trải nghiệm tại vườn NABADEN</strong>
                <span>Không gian xanh dưới chân Núi Bà Đen Tây Ninh</span>
              </div>
            </div>
            <div className="program-list">
              <Program number="01" title="Tham quan vùng trồng" text="Tìm hiểu cây mãng cầu, mùa vụ và câu chuyện sản xuất nông nghiệp sạch địa phương." />
              <Program number="02" title="Trải nghiệm hái quả" text="Tự tay tìm hiểu, lựa chọn và hái những trái mãng cầu già ngon theo mùa vụ thực tế." />
              <Program number="03" title="Đoàn doanh nghiệp & đối tác" text="Khảo sát vùng nguyên liệu, trao đổi cơ hội hợp tác và tham quan quy trình đóng gói." />
            </div>
            <section className="experience-moments">
              <div className="experience-moments-head">
                <div><span>Khoảnh khắc thực tế</span><h2>Hình ảnh các đoàn tham quan</h2></div>
              </div>
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
              <p>Đặt lịch trước để NABADEN kiểm tra mùa vụ, thời tiết và chuẩn bị chu đáo cho gia đình hoặc đoàn của bạn.</p>
              <button onClick={openBooking}>Đặt lịch trải nghiệm ngay →</button>
            </section>
            <div className="principles">
              <div><span>📅</span><b>Lịch rõ ràng</b><small>Theo mùa & thời tiết</small></div>
              <div><span>👥</span><b>Quy mô phù hợp</b><small>Đảm bảo an toàn</small></div>
              <div><span>🤝</span><b>Phối hợp kỹ</b><small>Thống nhất trước</small></div>
            </div>
          </>
        )}

        {/* =========================================
            TAB 5: TIN TỨC & CẨM NANG (NEWS)
           ========================================= */}
        {tab === "news" && (
          <>
            <PageIntro eyebrow="Kiến thức & tin tức" title="Cẩm nang Mãng Cầu Bà Đen" text="Hiểu đúng về cách chọn quả, bảo quản, vận chuyển và những hoạt động mới nhất tại NABADEN." />
            <div className="news-list">
              {stories.map((story, index) => (
                <a href={story.href} target="_blank" rel="noreferrer" className={index === 0 ? "news-card large" : "news-card"} key={story.id}>
                  <img src={story.image} alt="" />
                  <div>
                    <small>{newsTag(story)}</small>
                    <h2>{story.title}</h2>
                    <p>{story.text}</p>
                    <span>Đọc trên nabaden.vn ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* =========================================
            TAB 6: KẾT NỐI & LIÊN HỆ (CONTACT)
           ========================================= */}
        {tab === "contact" && (
          <>
            <PageIntro eyebrow="Kết nối trực tiếp" title="NABADEN luôn sẵn sàng đồng hành" text="Chọn kênh thuận tiện nhất để hỏi giá hôm nay, đặt hàng, đăng ký đối tác hoặc hẹn lịch trải nghiệm vườn." />
            <section className="contact-primary">
              <div className="contact-logo"><img src="/assets/nabaden-logo.webp" alt="NABADEN" /></div>
              <span>Hợp tác xã Nông nghiệp Mãng cầu Thạnh Tân</span>
              <h2>{HOTLINE_DISPLAY}</h2>
              <div>
                <a href={`tel:${HOTLINE_PHONE}`}>Gọi ngay</a>
                <a href={ZALO_OA_URL} target="_blank" rel="noreferrer">Nhắn Zalo OA</a>
              </div>
            </section>
            <div className="contact-list">
              <button onClick={() => changeTab("partner")}>
                <span>🤝</span>
                <div><b>Hợp tác phân phối & CTV</b><small>Tuyển đối tác toàn quốc, vốn 0đ, chiết khấu hấp dẫn</small></div>
                <i>›</i>
              </button>
              <a href="https://maps.app.goo.gl/r8JkWUTPksY2CjsB7" target="_blank" rel="noreferrer">
                <span>⌖</span>
                <div><b>Địa chỉ vườn</b><small>Lộ 10, ấp Thạnh Trung, Phường Bình Minh, Tây Ninh</small></div>
                <i>›</i>
              </a>
              <a href="https://www.facebook.com/nabaden.vn/" target="_blank" rel="noreferrer">
                <span>f</span>
                <div><b>Facebook NABADEN</b><small>Cập nhật hoạt động thường nhật</small></div>
                <i>›</i>
              </a>
              <a href="https://www.tiktok.com/@mangcaubaden" target="_blank" rel="noreferrer">
                <span>♪</span>
                <div><b>TikTok @mangcaubaden</b><small>Video từ vườn và quy trình đóng gói</small></div>
                <i>›</i>
              </a>
              <button onClick={shareApp}>
                <span>↗</span>
                <div><b>Chia sẻ ứng dụng</b><small>Gửi NABADEN cho bạn bè & đối tác</small></div>
                <i>›</i>
              </button>
              <button onClick={requestInstall}>
                <span>＋</span>
                <div><b>Cài lên màn hình chính</b><small>Mở nhanh như một ứng dụng điện thoại</small></div>
                <i>›</i>
              </button>
            </div>
            <a className="certificate-card" href="/assets/chung-nhan-ocop-3-sao.jpg" target="_blank" rel="noreferrer">
              <img src="/assets/chung-nhan-ocop-3-sao.jpg" alt="Chứng nhận OCOP 3 sao" />
              <div>
                <span>Chứng nhận chính thức</span>
                <h3>Quả Mãng cầu (Na) ta · OCOP 3 sao</h3>
                <p>Mã số 72-703-01-2023 · HTX Mãng Cầu Thạnh Tân</p>
              </div>
            </a>
            <div className="saved-card">
              <span>♡ {favorites.length} sản phẩm yêu thích</span>
              <span>◫ {basket.length} yêu cầu đang lưu</span>
            </div>
          </>
        )}
      </div>

      {/* Nút Giỏ Quan Tâm */}
      {basket.length > 0 && (
        <button className="basket-fab" onClick={() => setBasketOpen(true)} aria-label={`Mở giỏ quan tâm có ${basket.length} sản phẩm`}>
          <span>🛒</span><b>{basket.length}</b><em>Giỏ quan tâm</em>
        </button>
      )}

      {/* Bottom Nav 6 Tabs */}
      <nav className="bottom-nav" aria-label="Điều hướng ứng dụng">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${tab === item.id ? "active" : ""} ${item.highlight ? "partner-tab" : ""}`}
            onClick={() => changeTab(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>

      {/* Modal Giỏ Quan Tâm */}
      {basketOpen && (
        <Modal title={`Giỏ quan tâm · ${basket.length}`} onClose={() => setBasketOpen(false)}>
          <div className="basket-list">
            {selectedProducts.map((product) => (
              <div key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <b>{product.name}</b>
                  <small>{product.note}</small>
                </div>
                <button onClick={() => removeFromBasket(product.id)} aria-label={`Bỏ ${product.name} khỏi giỏ`}>×</button>
              </div>
            ))}
          </div>
          <div className="consultation-copy">
            <div>
              <span>Tin nhắn tư vấn đã soạn sẵn</span>
              <button onClick={copyConsultationMessage}>Sao chép</button>
            </div>
            <textarea value={consultationMessage} readOnly aria-label="Nội dung tin nhắn tư vấn" />
          </div>
          <div className="zalo-guide">
            <b>1</b><span>Sao chép</span><i>→</i>
            <b>2</b><span>Mở Zalo OA</span><i>→</i>
            <b>3</b><span>Dán và gửi</span>
          </div>
          <a className="zalo-consult-button" href={ZALO_OA_URL} target="_blank" rel="noreferrer" onClick={() => void copyConsultationMessage()}>
            <span>Zalo</span>
            <div><b>Tư vấn qua Zalo OA NABADEN</b><small>Tự động sao chép nội dung</small></div>
            <i>→</i>
          </a>
        </Modal>
      )}

      {/* Modal Trợ Lý Hỗ Trợ */}
      {supportOpen && (
        <Modal title="Bạn cần hỗ trợ gì?" onClose={() => setSupportOpen(false)}>
          <div className="support-intro">
            <img src="/assets/nabaden-assistant.png" alt="Trợ lý NABADEN" />
            <div>
              <b>Trợ lý NABADEN</b>
              <span>Chọn nhu cầu để được hỗ trợ nhanh nhất.</span>
            </div>
          </div>
          <div className="support-options">
            <button onClick={() => { setSupportOpen(false); changeTab("partner"); }}>
              <span className="support-option-icon partner">🤝</span>
              <div>
                <b>Trở thành đối tác / CTV</b>
                <small>Tuyển CTV vốn 0đ, nhà phân phối toàn quốc</small>
              </div>
              <i>→</i>
            </button>
            <button onClick={() => { setSupportOpen(false); openBooking(); }}>
              <span className="support-option-icon booking">🌿</span>
              <div>
                <b>Đặt lịch hái quả tại vườn</b>
                <small>Chọn ngày, khung giờ và số khách tham quan</small>
              </div>
              <i>→</i>
            </button>
            <a href={ZALO_OA_URL} target="_blank" rel="noreferrer">
              <span className="support-option-icon zalo">Zalo</span>
              <div>
                <b>Đặt mua sản phẩm & Báo giá hôm nay</b>
                <small>Trao đổi trực tiếp với Zalo OA NABADEN</small>
              </div>
              <i>→</i>
            </a>
            {!isInstalled ? (
              <button onClick={() => { setSupportOpen(false); void requestInstall(); }}>
                <span className="support-option-icon">＋</span>
                <div>
                  <b>Cài ứng dụng NABADEN</b>
                  <small>Thêm vào màn hình chính để mở nhanh</small>
                </div>
                <i>→</i>
              </button>
            ) : (
              <div className="support-installed">
                <span>✓</span>
                <div>
                  <b>Ứng dụng đã được cài đặt</b>
                  <small>Bạn đang sử dụng NABADEN như một ứng dụng</small>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Đặt Lịch Vườn */}
      {bookingOpen && (
        <Modal title="Đặt lịch hái quả tại vườn" onClose={closeBooking}>
          {bookingMessage ? (
            <div className="booking-ready">
              <div className="booking-ready-title">
                <span>✓</span>
                <div>
                  <b>Tin nhắn đã được sao chép</b>
                  <small>Hãy dán nội dung này vào cuộc trò chuyện Zalo OA.</small>
                </div>
              </div>
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
              <label>Họ và tên *<input name="name" required placeholder="Tên người liên hệ" /></label>
              <label>Số điện thoại *<input name="phone" required inputMode="tel" placeholder="09xx xxx xxx" /></label>
              <div>
                <label>Ngày dự kiến<input name="date" type="date" required /></label>
                <label>Khung giờ<select name="time" defaultValue="Buổi sáng"><option>Buổi sáng</option><option>Buổi chiều</option><option>Chưa xác định</option></select></label>
              </div>
              <div>
                <label>Số người lớn<input name="adults" type="number" min="1" defaultValue="2" required /></label>
                <label>Số trẻ em<input name="children" type="number" min="0" defaultValue="0" required /></label>
              </div>
              <label>
                Nhu cầu
                <select name="program" defaultValue="Trải nghiệm hái quả tại vườn">
                  <option>Trải nghiệm hái quả tại vườn</option>
                  <option>Tham quan và tìm hiểu vùng trồng</option>
                  <option>Chương trình dành cho trường học</option>
                  <option>Đoàn doanh nghiệp / đối tác</option>
                </select>
              </label>
              <label>Ghi chú<textarea name="note" placeholder="Độ tuổi trẻ em, nhu cầu riêng hoặc thời gian thuận tiện..." /></label>
              <p className="modal-note">Hoạt động phụ thuộc mùa vụ và thời tiết. NABADEN sẽ liên hệ xác nhận trước khi lịch có hiệu lực.</p>
              <button className="primary-wide" type="submit">Sao chép và mở Zalo OA →</button>
            </form>
          )}
        </Modal>
      )}

      {/* Modal Hướng Dẫn Cài iOS */}
      {showIosHelp && (
        <Modal title="Thêm vào màn hình chính" onClose={() => setShowIosHelp(false)}>
          <div className="install-steps">
            <div><b>1</b><span>Mở menu <strong>Chia sẻ</strong> của trình duyệt Safari</span></div>
            <div><b>2</b><span>Chọn <strong>Thêm vào Màn hình chính</strong> (Add to Home Screen)</span></div>
            <div><b>3</b><span>Nhấn <strong>Thêm</strong> để hoàn tất</span></div>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function SectionHead({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action: string; onAction: () => void }) {
  return (
    <div className="section-head">
      <div><span>{eyebrow}</span><h2>{title}</h2></div>
      <button onClick={onAction}>{action} →</button>
    </div>
  );
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function ProductCard({
  product,
  favorite,
  inBasket,
  onFavorite,
  onBasket,
  compact = false,
}: {
  product: typeof products[number];
  favorite: boolean;
  inBasket: boolean;
  onFavorite: (id: string) => void;
  onBasket: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.ocop && <span className="product-badge-ocop">OCOP 3★</span>}
        <button onClick={() => onFavorite(product.id)} aria-label={favorite ? "Bỏ yêu thích" : "Thêm yêu thích"}>
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-info">
        <span className="product-tag">{product.tag || product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-actions-box">
          <div className="product-note-line">
            <span>{product.note}</span>
          </div>
          <button
            className={`product-btn-add ${inBasket ? "selected" : ""}`}
            onClick={() => onBasket(product.id)}
          >
            {inBasket ? "✓ Trong giỏ quan tâm" : "+ Quan tâm tư vấn"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Program({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article>
      <span>{number}</span>
      <div><h3>{title}</h3><p>{text}</p></div>
      <i>→</i>
    </article>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-handle" />
        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Đóng">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}
