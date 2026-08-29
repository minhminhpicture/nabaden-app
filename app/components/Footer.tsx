import Link from "next/link";

type FooterProps = {
  backLink: {
    href: string;
    label: string;
  };
};

export default function Footer({ backLink }: FooterProps) {
  return (
    <footer
      style={{
        marginTop: "40px",
        paddingTop: "20px",
        borderTop: "1px solid #e3dcd0",
        textAlign: "center",
      }}
    >
      <Link
        href={backLink.href}
        style={{ color: "#075f39", fontWeight: 700, fontSize: "14px" }}
      >
        ← {backLink.label}
      </Link>
    </footer>
  );
}
