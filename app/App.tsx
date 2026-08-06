import { useState, useEffect, useRef } from "react";
import {
  Check,
  Menu,
  X,
  ChevronDown,
  Star,
  Leaf,
  Shield,
  Clock,
  Heart,
  Phone,
  Mail,
  ChevronUp,
  Send,
  AlertCircle,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ── CMS: fetch content from backend, fall back to statics if unavailable ───────
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "";

interface CMSData { [key: string]: Record<string, unknown> }
let _cms: CMSData | null = null;

async function fetchCMS(): Promise<CMSData> {
  if (_cms) return _cms;
  if (!BACKEND_URL) return {};
  try {
    const r = await fetch(`${BACKEND_URL}/api/content`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return {};
    _cms = await r.json();
    return _cms!;
  } catch { return {}; }
}

function useCMS() {
  const [cms, setCms] = useState<CMSData>({});
  useEffect(() => { fetchCMS().then(setCms); }, []);
  return cms;
}

// Product image imports
import whiteTowelDetail from "@/imports/white_towel_with_details-1.png";
import blueTowelDetail from "@/imports/blue_towel_with_detail-1.png";
import blueWhiteTowels from "@/imports/blue___white_towels-1.png";
import blueWhiteTowels2 from "@/imports/blue___white_towels-2.png";
import blueWithWhiteTrim from "@/imports/blue_with_white_trim-1.png";
import productShot1 from "@/imports/21c3tiBYVkL._AC_-1.jpg";
import productShot2 from "@/imports/61q1ufF3jZL._AC_SX679_-1.jpg";
import whiteTrimWorn from "@/imports/61q1ufF3jZL._AC_SX679_-2.jpg";
import blueTowelDetail2 from "@/imports/blue_towel_with_detail-2.png";
import madeInUK from "@/imports/madeinuk.png";
import whiteContentImg from "@/imports/white_with_blue_trim_100__cotton_towel.png";
import blueContentImg from "@/imports/blue_with_white_trim_100__cotton_towel.png";
import salmonContentImg from "@/imports/Salmon_Pink_Content_Head_Towel.png";
import greyContentImg from "@/imports/Grey_Content_Head_Towel.png";
import greyHeadImg from "@/imports/Grey_Head_Towel.png";
import salmonHeadImg from "@/imports/Salmon_Pink_Head_Towel.png";
import whiteSlideImg from "@/imports/white_head_towels.png";
import blueSlideImg from "@/imports/blue_head_towels.png";
import salmonSlideImg from "@/imports/salmon_pink_head_towels.png";
import greySlideImg from "@/imports/grey_head_towels.png";
import amazonBadge from "@/imports/images.jfif";

// ── Navigation ────────────────────────────────────────────────────────────────
const DEFAULT_NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#enquiry" },
];

function Nav() {
  const cms = useCMS();
  const navLinks = (cms.nav as { links?: { label: string; href: string }[] })?.links || DEFAULT_NAV_LINKS;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#1a2744]/97 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <a href="#" className="flex flex-col leading-tight">
          <span className="font-['Playfair_Display'] font-semibold tracking-wide text-white" style={{ fontSize: "1.05rem" }}>
            Luxury Head Towels
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-white/80 hover:text-[#B8965A] font-['Lato'] text-sm tracking-widest uppercase transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#enquiry"
            className="ml-3 px-5 py-2.5 bg-[#B8965A] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#9d7e49] transition-colors duration-200"
          >
            Enquiry Now
          </a>
        </nav>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1a2744] border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-white/80 font-['Lato'] text-sm tracking-widest uppercase" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#enquiry" className="mt-2 px-6 py-3 bg-[#B8965A] text-white text-center font-['Lato'] text-sm tracking-widest uppercase" onClick={() => setOpen(false)}>
            Enquiry Now
          </a>
        </div>
      )}
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1a2744]">
      <div className="absolute inset-0 opacity-15">
        <ImageWithFallback src={blueWhiteTowels} alt="Luxury Head Towels" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744] via-[#1a2744]/92 to-[#2a3f6f]/70" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center py-32">
        <div>
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.35em] uppercase mb-6">
            Premium Hair Care · United Kingdom
          </p>
          <h1 className="font-['Playfair_Display'] text-white leading-[1.1] mb-8" style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}>
            Experience the
            <br />
            <em className="text-[#B8965A] not-italic">Art of Luxury</em>
            <br />
            Hair Care
          </h1>
          <p className="text-white/70 font-['Lato'] font-light leading-relaxed mb-10 max-w-md text-lg">
            Premium 100% Egyptian Cotton Head Towels, thoughtfully designed and crafted in the United Kingdom for the modern beauty routine.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#enquiry" className="px-8 py-4 bg-[#B8965A] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#9d7e49] transition-colors duration-300">
              Enquiry Now
            </a>
            <a href="#about" className="px-8 py-4 border border-white/30 text-white/80 font-['Lato'] text-sm tracking-widest uppercase hover:border-[#B8965A] hover:text-[#B8965A] transition-all duration-300">
              Our Story
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-end">
          <div className="relative">
            <div className="w-[480px] h-[520px] overflow-hidden">
              <ImageWithFallback src={blueWhiteTowels2} alt="Both Luxury Head Towels — Blue with White Trim and White with Blue Trim stacked" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-8 bg-[#B8965A] text-white px-6 py-5 shadow-xl flex items-center gap-4">
              <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-12 h-12 object-contain flex-shrink-0" />
              <div>
                <p className="font-['Playfair_Display'] text-base font-medium">100% Egyptian Cotton</p>
                <p className="font-['Lato'] text-xs tracking-widest uppercase text-white/80 mt-0.5">Proudly Made in the UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 hover:text-[#B8965A] transition-colors" aria-label="Scroll down">
        <span className="font-['Lato'] text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="bg-[#F8F6F1] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative h-[520px]">
              <ImageWithFallback src={productShot1} alt="Luxury Head Towel product view" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-[#1a2744] flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="#B8965A" className="text-[#B8965A]" />
                  ))}
                </div>
                <p className="text-white font-['Playfair_Display'] text-xs leading-snug mb-3">Premium Quality Assured</p>
                <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-16 h-16 object-contain" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">About Us</p>
            <h2 className="font-['Playfair_Display'] text-[#1a2744] leading-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              Who We Are
            </h2>
            <div className="w-12 h-px bg-[#B8965A] mb-8" />
            <p className="text-[#1a2744]/70 font-['Lato'] font-light leading-loose text-lg mb-6">
              Luxury Head Towels is a UK-based brand specialising in premium-quality head towels designed to bring comfort and luxury into everyday hair care routines.
            </p>
            <p className="text-[#1a2744]/70 font-['Lato'] font-light leading-loose mb-8">
              Created with a passion for quality and practicality, our head towels are made using carefully selected 100% Egyptian Cotton, offering a soft, gentle, and highly absorbent experience for all hair types. We believe that even the simplest daily routines deserve a touch of luxury.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#1a2744]/10">
              {[
                { label: "Material", value: "100% Egyptian Cotton" },
                { label: "Origin", value: "Proudly Made in the UK" },
                { label: "Fit", value: "One Size Fits All" },
                { label: "Suitable For", value: "All Hair Types" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-1">{item.label}</p>
                  {item.label === "Origin" ? (
                    <div className="flex items-center gap-2">
                      <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-8 h-8 object-contain flex-shrink-0" />
                      <p className="text-[#1a2744] font-['Playfair_Display'] font-medium text-sm">{item.value}</p>
                    </div>
                  ) : (
                    <p className="text-[#1a2744] font-['Playfair_Display'] font-medium text-sm">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Product Carousel ──────────────────────────────────────────────────────────
const PRODUCT_GRID_IMAGES = [
  { img: whiteSlideImg,  label: "White",       alt: "White with Blue Trim — Luxury Head Towels 100% Cotton Hair Towel Wrap guide" },
  { img: blueSlideImg,   label: "Blue",        alt: "Blue with White Trim — Luxury Head Towels 100% Cotton Hair Towel Wrap guide" },
  { img: salmonSlideImg, label: "Salmon Pink", alt: "Salmon Pink — Luxury Head Towels 100% Cotton Hair Towel Wrap guide" },
  { img: greySlideImg,   label: "Grey",        alt: "Grey — Luxury Head Towels 100% Cotton Hair Towel Wrap guide" },
];

function ProductCarousel() {
  return (
    <div className="mt-px grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
      {PRODUCT_GRID_IMAGES.map((item) => (
        <div key={item.label} className="group relative overflow-hidden bg-[#0f1a35]">
          <ImageWithFallback
            src={item.img}
            alt={item.alt}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1a35]/80 to-transparent px-5 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-['Playfair_Display'] text-sm tracking-widest">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Product Showcase ───────────────────────────────────────────────────────────
function Product() {
  const products = [
    {
      img: whiteTrimWorn,
      alt: "White with Blue Trim Luxury Head Towel worn as a head wrap",
      label: "White with Blue Trim",
      desc: "Clean and classic — a timeless choice that suits any bathroom setting with effortless elegance.",
    },
    {
      img: blueWithWhiteTrim,
      alt: "Blue with White Trim Luxury Head Towel",
      label: "Blue with White Trim",
      desc: "Sophisticated navy elegance that makes your daily routine feel truly indulgent.",
    },
    {
      img: blueWhiteTowels,
      alt: "Both Luxury Head Towel colour options side by side",
      label: "Both Colours Available",
      desc: "One-size-fits-all design suitable for women, children, and all hair types and lengths.",
    },
  ];

  return (
    <section id="product" className="bg-[#1a2744] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Our Product</p>
          <h2 className="font-['Playfair_Display'] text-white leading-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            The Luxury Head Towel
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mx-auto mb-6" />
          <p className="text-white/60 font-['Lato'] font-light max-w-2xl mx-auto leading-relaxed text-lg">
            A lightweight, comfortable, and stylish alternative to traditional heavy towels. Made with premium 100% Egyptian Cotton — soft, gentle, and highly absorbent.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-px bg-white/5">
          {products.map((card) => (
            <div key={card.label} className="group relative overflow-hidden bg-[#0f1a35]">
              <div className="h-80 overflow-hidden">
                <ImageWithFallback
                  src={card.img}
                  alt={card.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="font-['Playfair_Display'] text-white text-xl mb-3">{card.label}</h3>
                <p className="text-white/50 font-['Lato'] font-light text-sm leading-relaxed">{card.desc}</p>
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 bg-[#B8965A] group-hover:h-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* 4-slide carousel */}
        <ProductCarousel />

        {/* Buy Now CTA */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <a
            href="https://shop.pharmaceutra.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-4 bg-[#B8965A] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#9d7e49] transition-colors duration-300"
          >
            Buy Now
          </a>
          <a
            href="https://www.amazon.co.uk/dp/B0HCQQLJWZ?th=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:opacity-90 transition-opacity duration-200"
            aria-label="Buy on Amazon"
          >
            <ImageWithFallback
              src={amazonBadge}
              alt="Buy on Amazon"
              className="h-14 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  "Made in the UK",
  "Premium 100% Egyptian Cotton material",
  "One-size-fits-all design",
  "Lightweight and comfortable to wear",
  "Highly absorbent to help reduce drying time",
  "Soft and gentle on hair",
  "Secure fit for hands-free use",
  "Suitable for all hair types",
  "Perfect for everyday use and travel",
];

function Features() {
  return (
    <section id="features" className="bg-[#F8F6F1] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Product Features</p>
          <h2 className="font-['Playfair_Display'] text-[#1a2744] leading-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Crafted for
            <br />
            <em className="text-[#B8965A]">Everyday Excellence</em>
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mb-10" />
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-4 group">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#1a2744] flex items-center justify-center">
                  <Check size={10} className="text-[#B8965A]" strokeWidth={3} />
                </span>
                <span className="text-[#1a2744]/75 font-['Lato'] font-light leading-snug group-hover:text-[#1a2744] transition-colors flex items-center gap-2">
                  {f === "Made in the UK" && <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-7 h-7 object-contain flex-shrink-0" />}
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <ImageWithFallback src={blueWithWhiteTrim} alt="Blue with White Trim Luxury Head Towel worn and styled" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#B8965A] flex items-center justify-center text-center p-4">
            <div>
              <p className="font-['Playfair_Display'] text-white text-3xl font-bold">9</p>
              <p className="font-['Lato'] text-white/80 text-[0.58rem] uppercase tracking-widest mt-1">Premium<br />Features</p>
            </div>
          </div>
          <div className="absolute -bottom-6 right-6 bg-white shadow-xl px-8 py-5 border-l-2 border-[#B8965A]">
            <p className="text-[#1a2744] font-['Playfair_Display'] font-medium">Luxury. Comfort.</p>
            <p className="text-[#1a2744] font-['Playfair_Display'] font-medium">Quality. Simplicity.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: Clock, title: "Faster Hair Drying", body: "Our highly absorbent fabric helps remove excess moisture efficiently, reducing the time needed to dry your hair." },
  { icon: Leaf, title: "Gentle Hair Care", body: "The soft texture helps minimise unnecessary friction compared with traditional towels, protecting your hair." },
  { icon: Shield, title: "Comfortable & Convenient", body: "Enjoy a secure, lightweight fit that allows you to continue your routine while your hair dries naturally." },
  { icon: Heart, title: "Luxury Every Day", body: "Transform your normal hair care routine into a relaxing and premium experience you will look forward to." },
];

function Benefits() {
  return (
    <section id="benefits" className="bg-[#EDE9E1] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Why Choose Us</p>
          <h2 className="font-['Playfair_Display'] text-[#1a2744] leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Product Benefits
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px border border-[#1a2744]/10">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className={`group p-10 bg-white hover:bg-[#1a2744] transition-colors duration-500 cursor-default ${i < 3 ? "border-r border-[#1a2744]/10" : ""}`}>
                <div className="w-12 h-12 border border-[#B8965A] flex items-center justify-center mb-8 group-hover:bg-[#B8965A] group-hover:border-[#B8965A] transition-all duration-500">
                  <Icon size={20} className="text-[#B8965A] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-['Playfair_Display'] text-[#1a2744] group-hover:text-white text-xl mb-4 transition-colors duration-500">{b.title}</h3>
                <p className="text-[#1a2744]/60 group-hover:text-white/60 font-['Lato'] font-light text-sm leading-relaxed transition-colors duration-500">{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Options ───────────────────────────────────────────────────────────────────
function Options() {
  const [activeColour, setActiveColour] = useState(0);
  const colours = [
    { name: "White", img: whiteTrimWorn,  alt: "White with Blue Trim Luxury Head Towel worn as a head wrap" },
    { name: "Blue",  img: blueWithWhiteTrim, alt: "Blue with White Trim Luxury Head Towel" },
    { name: "Salmon Pink", img: salmonHeadImg, alt: "Salmon Pink Luxury Head Towel" },
    { name: "Grey",  img: greyHeadImg, alt: "Grey Luxury Head Towel" },
  ];

  return (
    <section id="options" className="bg-[#1a2744] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Available Options</p>
          <h2 className="font-['Playfair_Display'] text-white leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Make It Yours
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <div>
              <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-6">Choose Your Colour</p>
              <div className="flex flex-wrap gap-3">
                {colours.map((c, i) => {
                  const swatchBg: Record<string, string> = {
                    White: "bg-white border border-[#1a2744]/30",
                    Blue: "bg-[#1a2744]",
                    "Salmon Pink": "bg-[#e8907a]",
                    Grey: "bg-[#9e9e9e]",
                  };
                  return (
                    <button key={c.name} onClick={() => setActiveColour(i)}
                      className={`flex items-center gap-2.5 px-5 py-3 border font-['Lato'] text-sm transition-all duration-200 ${activeColour === i ? "border-[#B8965A] text-[#B8965A]" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${swatchBg[c.name]}`} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Material", value: "100% Egyptian Cotton" },
                { label: "Size", value: "One Size Fits All" },
                { label: "Manufacturing", value: "Made in the UK", flag: true },
                { label: "Suitable For", value: "Women, Children, All Hair Types" },
              ].map((spec) => (
                <div key={spec.label} className="border-t border-white/10 pt-4">
                  <p className="text-[#B8965A] font-['Lato'] text-[0.65rem] tracking-widest uppercase mb-1">{spec.label}</p>
                  {spec.flag ? (
                    <div className="flex items-center gap-2">
                      <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-8 h-8 object-contain flex-shrink-0" />
                      <p className="text-white font-['Playfair_Display'] font-medium leading-snug">{spec.value}</p>
                    </div>
                  ) : (
                    <p className="text-white font-['Playfair_Display'] font-medium leading-snug">{spec.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#enquiry" className="inline-block px-10 py-4 bg-[#B8965A] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#9d7e49] transition-colors duration-300">
                Send an Enquiry
              </a>
              <a
                href="https://shop.pharmaceutra.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 border border-[#B8965A] text-[#B8965A] font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#B8965A] hover:text-white transition-all duration-300"
              >
                Buy Now
              </a>
              <a
                href="https://www.amazon.co.uk/dp/B0HCQQLJWZ?th=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:opacity-90 transition-opacity duration-200"
                aria-label="Buy on Amazon"
              >
                <ImageWithFallback
                  src={amazonBadge}
                  alt="Buy on Amazon"
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <ImageWithFallback
                src={colours[activeColour].img}
                alt={colours[activeColour].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#B8965A] flex items-center justify-center p-3 text-center">
              <p className="text-white font-['Playfair_Display'] font-bold text-xs leading-tight">One<br />Size</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What material are the head towels made from?", a: "Our Luxury Head Towels are made from premium 100% Egyptian Cotton — one of the finest, most absorbent cotton varieties in the world, renowned for its softness, durability, and comfort." },
  { q: "How do I use a head towel?", a: "Simply place the towel over your head after washing, tuck or wrap the loop/button to secure it in place, and allow your hair to dry naturally. The hands-free design means you can continue your routine while your hair dries." },
  { q: "How do I wash and care for my Luxury Head Towel?", a: "Machine wash at 40°C with similar colours. Tumble dry on a low setting or air dry naturally. Avoid bleach and fabric softeners to maintain the cotton's natural absorbency and softness." },
  { q: "Is it suitable for all hair types?", a: "Yes. Our one-size-fits-all head towel is designed to suit all hair types and lengths — fine, thick, curly, straight, short, or long. It works equally well for women and children." },
  { q: "What size is the head towel?", a: "Our head towels are designed as one size fits all, offering a comfortable and secure fit for the vast majority of head sizes. The wrap design adjusts naturally to suit you." },
  { q: "Where are the head towels manufactured?", a: "Our Luxury Head Towels are proudly made in the United Kingdom. We are committed to supporting British craftsmanship and ensuring the highest standards of quality at every stage of production." },
  { q: "What colours are available?", a: "We currently offer two elegant colour options: White with Blue Trim and Blue with White Trim. Both reflect the premium, refined aesthetic of the Luxury Head Towels brand." },
  { q: "Are these suitable as gifts?", a: "Absolutely. Our Luxury Head Towels make a thoughtful, premium gift for birthdays, Mother's Day, pamper hampers, or any occasion. Please contact us for any gift or bulk enquiries." },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#F8F6F1] py-28 lg:py-36">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Support</p>
          <h2 className="font-['Playfair_Display'] text-[#1a2744] leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mx-auto mt-6" />
        </div>

        <div className="divide-y divide-[#1a2744]/10 border-t border-[#1a2744]/10">
          {FAQS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="font-['Playfair_Display'] text-[#1a2744] font-medium text-lg group-hover:text-[#B8965A] transition-colors leading-snug">
                  {item.q}
                </span>
                <span className="flex-shrink-0 mt-1 text-[#B8965A]">
                  {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {openIndex === i && (
                <div className="pb-6 -mt-2">
                  <p className="text-[#1a2744]/65 font-['Lato'] font-light leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Enquiry Form ──────────────────────────────────────────────────────────────
interface FormState {
  fullName: string;
  email: string;
  phone: string;
  enquiryType: string;
  preferredColour: string;
  quantity: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  enquiryType?: string;
  message?: string;
}

function sanitize(val: string) {
  return val.replace(/[<>]/g, "").trim();
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^[+0-9\s\-().]{7,20}$/.test(phone);
}

function EnquiryForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", phone: "", enquiryType: "", preferredColour: "No Preference", quantity: "", message: "", honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!sanitize(form.fullName)) errs.fullName = "Full name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!validateEmail(form.email)) errs.email = "Please enter a valid email address.";
    if (!form.phone) errs.phone = "Phone number is required.";
    else if (!validatePhone(form.phone)) errs.phone = "Please enter a valid phone number.";
    if (!form.enquiryType) errs.enquiryType = "Please select an enquiry type.";
    if (!sanitize(form.message)) errs.message = "Please enter your message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return; // spam trap
    if (!validate()) return;
    setStatus("submitting");

    try {
      const endpoint = BACKEND_URL
        ? `${BACKEND_URL}/api/email/contact`
        : "https://formspree.io/f/sales@thecreativehealthcare.com";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          fullName: sanitize(form.fullName),
          email: form.email,
          phone: form.phone,
          enquiryType: form.enquiryType,
          preferredColour: form.preferredColour,
          quantity: form.quantity,
          message: sanitize(form.message),
          honeypot: form.honeypot,
        }),
      });
      if (!res.ok) throw new Error("submission failed");
      setStatus("success");
      setForm({ fullName: "", email: "", phone: "", enquiryType: "", preferredColour: "No Preference", quantity: "", message: "", honeypot: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field?: string) =>
    `w-full bg-[#F8F6F1] border ${
      field && errors[field as keyof FormErrors] ? "border-red-400" : "border-[#1a2744]/15"
    } px-4 py-3 font-['Lato'] text-[#1a2744] text-sm placeholder:text-[#1a2744]/40 focus:outline-none focus:border-[#B8965A] focus:ring-1 focus:ring-[#B8965A]/30 transition-all`;

  const selectClass = (field?: string) =>
    `w-full bg-[#F8F6F1] border ${
      field && errors[field as keyof FormErrors] ? "border-red-400" : "border-[#1a2744]/15"
    } px-4 py-3 font-['Lato'] text-[#1a2744] text-sm focus:outline-none focus:border-[#B8965A] focus:ring-1 focus:ring-[#B8965A]/30 transition-all appearance-none cursor-pointer`;

  return (
    <section id="enquiry" className="bg-[#EDE9E1] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
        {/* Info panel */}
        <div className="lg:col-span-4">
          <p className="text-[#B8965A] font-['Lato'] text-xs tracking-[0.3em] uppercase mb-4">Get In Touch</p>
          <h2 className="font-['Playfair_Display'] text-[#1a2744] leading-tight mb-6" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            Send Us an Enquiry
          </h2>
          <div className="w-12 h-px bg-[#B8965A] mb-8" />
          <p className="text-[#1a2744]/65 font-['Lato'] font-light leading-relaxed mb-10">
            We would love to hear from you. Whether you have a product question, a bulk order enquiry, or simply want to know more, fill in the form and we will get back to you promptly.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1a2744] flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-[#B8965A]" />
              </div>
              <div>
                <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-1">Email</p>
                <a href="mailto:hello@luxuryheadtowels.co.uk" className="text-[#1a2744] font-['Lato'] text-sm hover:text-[#B8965A] transition-colors">
                  hello@luxuryheadtowels.co.uk
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1a2744] flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-[#B8965A]" />
              </div>
              <div>
                <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-1">Phone</p>
                <a href="tel:02045374441" className="text-[#1a2744] font-['Lato'] text-sm hover:text-[#B8965A] transition-colors">
                  0204 537 4441
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-1">Based In</p>
                <p className="text-[#1a2744] font-['Lato'] text-sm">United Kingdom</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#1a2744]/10">
            <p className="text-[#B8965A] font-['Lato'] text-xs tracking-widest uppercase mb-4">Follow Us</p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter / X" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-10 h-10 bg-[#1a2744] flex items-center justify-center text-white/50 hover:text-[#B8965A] hover:bg-[#1a2744]/80 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8">
          {status === "success" ? (
            <div className="bg-white border border-green-200 p-12 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
              <h3 className="font-['Playfair_Display'] text-[#1a2744] text-2xl mb-4">Thank You for Contacting Luxury Head Towels!</h3>
              <p className="text-[#1a2744]/65 font-['Lato'] font-light leading-relaxed mb-8">
                We have received your enquiry and will get back to you as soon as possible.
              </p>
              <button onClick={() => setStatus("idle")} className="px-8 py-3 bg-[#1a2744] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#B8965A] transition-colors">
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="bg-white p-10 lg:p-12 space-y-6">
              {status === "error" && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 font-['Lato'] text-sm">
                    {"We're sorry, something went wrong. Please try again or email us directly at "}
                  <a href="mailto:sales@thecreativehealthcare.com" className="underline">sales@thecreativehealthcare.com</a>
                  {" or call 0204 537 4441."}
                  </p>
                </div>
              )}

              {/* Honeypot - hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <input tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={set("honeypot")} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">
                    Full Name <span className="text-[#B8965A]">*</span>
                  </label>
                  <input type="text" value={form.fullName} onChange={set("fullName")} placeholder="Enter your full name" autoComplete="name"
                    className={inputClass("fullName")} aria-describedby={errors.fullName ? "err-name" : undefined} />
                  {errors.fullName && <p id="err-name" className="mt-1.5 text-red-500 font-['Lato'] text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">
                    Email Address <span className="text-[#B8965A]">*</span>
                  </label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="Enter your email address" autoComplete="email"
                    className={inputClass("email")} aria-describedby={errors.email ? "err-email" : undefined} />
                  {errors.email && <p id="err-email" className="mt-1.5 text-red-500 font-['Lato'] text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">
                    Phone Number <span className="text-[#B8965A]">*</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Enter your phone number" autoComplete="tel"
                    className={inputClass("phone")} aria-describedby={errors.phone ? "err-phone" : undefined} />
                  {errors.phone && <p id="err-phone" className="mt-1.5 text-red-500 font-['Lato'] text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
                </div>

                {/* Enquiry Type */}
                <div className="relative">
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">
                    Enquiry Type <span className="text-[#B8965A]">*</span>
                  </label>
                  <select value={form.enquiryType} onChange={set("enquiryType")}
                    className={selectClass("enquiryType")} aria-describedby={errors.enquiryType ? "err-type" : undefined}>
                    <option value="">Please Select</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Order Information">Order Information</option>
                    <option value="General Question">General Question</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-[42px] text-[#1a2744]/40 pointer-events-none" />
                  {errors.enquiryType && <p id="err-type" className="mt-1.5 text-red-500 font-['Lato'] text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.enquiryType}</p>}
                </div>

                {/* Preferred Colour */}
                <div className="relative">
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">Preferred Colour</label>
                  <select value={form.preferredColour} onChange={set("preferredColour")} className={selectClass()}>
                    <option value="No Preference">No Preference</option>
                    <option value="White">White</option>
                    <option value="Blue">Blue</option>
                    <option value="Salmon Pink">Salmon Pink</option>
                    <option value="Grey">Grey</option>
                    <option value="Multiple Colours">Multiple Colours</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-[42px] text-[#1a2744]/40 pointer-events-none" />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">Quantity (Approx.)</label>
                  <input type="text" value={form.quantity} onChange={set("quantity")} placeholder="e.g. 1, 5, 50+" className={inputClass()} />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-['Lato'] text-[#1a2744] text-xs tracking-widest uppercase mb-2">
                  Message <span className="text-[#B8965A]">*</span>
                </label>
                <textarea value={form.message} onChange={set("message")} rows={6}
                  placeholder="Please provide your enquiry or requirements — product enquiry, quantity, delivery questions, custom requests, business enquiries..."
                  className={`${inputClass("message")} resize-none`}
                  aria-describedby={errors.message ? "err-msg" : undefined}
                />
                {errors.message && <p id="err-msg" className="mt-1.5 text-red-500 font-['Lato'] text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-[#1a2744]/40 font-['Lato'] text-xs">
                  <span className="text-[#B8965A]">*</span> Required fields. Your data is handled securely and never shared.
                </p>
                <button type="submit" disabled={status === "submitting"}
                  className="flex items-center gap-3 px-10 py-4 bg-[#1a2744] text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-[#B8965A] disabled:opacity-60 transition-colors duration-300">
                  {status === "submitting" ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : (
                    <><Send size={15} />Send Enquiry</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Tagline Banner ────────────────────────────────────────────────────────────
function Tagline() {
  return (
    <section className="bg-[#B8965A] py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-28 h-28 object-contain" />
        </div>
        <h2 className="font-['Playfair_Display'] text-white leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
          "Luxury. Comfort. Quality. Simplicity."
        </h2>
        <p className="text-white/70 font-['Lato'] font-light mt-6 text-lg">
          Elevate your everyday hair care routine with a touch of British luxury.
        </p>
        <a href="#enquiry" className="inline-block mt-10 px-10 py-4 border border-white/50 text-white font-['Lato'] text-sm tracking-widest uppercase hover:bg-white hover:text-[#B8965A] transition-all duration-300">
          Enquiry Now
        </a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cms = useCMS();
  const site = (cms.site as { phone?: string; email?: string; facebook?: string; instagram?: string; twitter?: string }) || {};
  const footer = (cms.footer as { about?: string; copyright?: string; quickLinks?: { label: string; href: string }[]; legalLinks?: { label: string; href: string }[] }) || {};
  const quickLinks = footer.quickLinks || DEFAULT_NAV_LINKS;
  const legalLinks = footer.legalLinks || [{ label: "Privacy Policy", href: "#" }, { label: "Terms & Conditions", href: "#" }, { label: "Cookie Policy", href: "#" }];
  const phone = site.phone || "0204 537 4441";
  const email = site.email || "hello@luxuryheadtowels.co.uk";
  const aboutText = footer.about || "Premium 100% Egyptian Cotton head towels crafted for modern beauty routines. Bringing luxury into everyday life.";
  const copyright = footer.copyright || "Luxury Head Towels. All rights reserved. Registered in England & Wales.";

  return (
    <footer className="bg-[#0f1a35] text-white/60 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/10">
          <div className="md:col-span-1">
            <p className="font-['Playfair_Display'] text-white font-semibold text-lg mb-3">Luxury Head Towels</p>
            <div className="mb-4">
              <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-12 h-12 object-contain" />
            </div>
            <p className="font-['Lato'] font-light text-sm leading-relaxed">{aboutText}</p>
          </div>

          <div>
            <p className="font-['Lato'] text-[#B8965A] text-xs tracking-widest uppercase mb-5">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="font-['Lato'] font-light text-sm hover:text-[#B8965A] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-['Lato'] text-[#B8965A] text-xs tracking-widest uppercase mb-5">Legal</p>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="font-['Lato'] font-light text-sm hover:text-[#B8965A] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-['Lato'] text-[#B8965A] text-xs tracking-widest uppercase mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${email}`} className="font-['Lato'] font-light text-sm hover:text-[#B8965A] transition-colors flex items-center gap-2">
                  <Mail size={13} /> {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-['Lato'] font-light text-sm hover:text-[#B8965A] transition-colors flex items-center gap-2">
                  <Phone size={13} /> {phone}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Facebook, label: "Facebook", href: site.facebook || "#" },
                { icon: Instagram, label: "Instagram", href: site.instagram || "#" },
                { icon: Twitter, label: "Twitter / X", href: site.twitter || "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-white/5 flex items-center justify-center hover:text-[#B8965A] hover:bg-white/10 transition-all duration-200">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-['Lato']">
          <p>© {new Date().getFullYear()} {copyright}</p>
          <div className="flex items-center gap-2 text-white/30">
            <ImageWithFallback src={madeInUK} alt="Made in UK" className="w-6 h-6 object-contain opacity-50" />
            <p>Proudly Made in the United Kingdom</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <About />
      <Product />
      <Features />
      <Benefits />
      <Options />
      <FAQ />
      <EnquiryForm />
      <Tagline />
      <Footer />
    </div>
  );
}
