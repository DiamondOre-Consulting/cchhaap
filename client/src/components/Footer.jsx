import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo2 from "../assets/logo2.jpg";

const data = {
  facebookLink: "https://facebook.com/mvpblocks",
  instaLink: "https://instagram.com/mvpblocks",
  twitterLink: "https://twitter.com/mvpblocks",
  githubLink: "https://github.com/mvpblocks",
  dribbbleLink: "https://dribbble.com/mvpblocks",
  services: {
    webdev: "/web-development",
    webdesign: "/web-design",
    marketing: "/marketing",
    googleads: "/google-ads",
  },
  about: {
    history: "/company-history",
    team: "/meet-the-team",
    handbook: "/employee-handbook",
    careers: "/careers",
  },
  help: {
    faqs: "/faqs",
    support: "/support",
    livechat: "/live-chat",
  },
  contact: {
    email: "anantasinghal28@gmail.Com",
    phone: "+91 9891444077",
    address: "f-59, 2nd floor, kalkaji new delhi Pin code - 110019",
  },
  company: {
    name: "Chhaapp",
    logo: logo2,
  },
};

const socialLinks = [
  // { icon: Facebook, label: "Facebook", href: data.facebookLink },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/chhaapp_in?igsh=MXA0ZGRmZzJvM3VoMg==",
  },
  // { icon: Twitter, label: "Twitter", href: data.twitterLink },
  // { icon: Github, label: "GitHub", href: data.githubLink },
  // { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
];

const aboutLinks = [
  { text: "Company History", href: data.about.history },
  { text: "Meet the Team", href: data.about.team },
  { text: "Employee Handbook", href: data.about.handbook },
  { text: "Careers", href: data.about.careers },
];

const serviceLinks = [
  { text: "All Products", href: "/all-products" },
  { text: "Featured Products", href: "#featured" },
  // { text: "Marketing", href: data.services.marketing },
  // { text: "Google Ads", href: data.services.googleads },
];

const helpfulLinks = [
  { text: "Privacy Policy", href: "/privacy-policy" },
  { text: "Shipping Policy", href: "/shipping-policy" },
  { text: "Return & Refund Policy", href: "/return-refund-policy" },
  { text: "Terms & Condition", href: "/terms-and-condition" },

  // { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-16 w-full place-self-end rounded-t-xl bg-white dark:bg-secondary/20">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 text-primary sm:justify-start">
              <img
                src={data.company.logo || "/placeholder.svg"}
                alt="logo"
                className="w-40 "
              />
              {/* <span className="text-2xl font-semibold">{data.company.name}</span> */}
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-foreground/50 sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            {/* <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="text-center sm:text-left">
              <p className="text-lg text-c1 font-medium">Quick Links </p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-secondary-foreground/70 transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg text-c1 font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-secondary-foreground/70 transition"
                      }`}
                    >
                      <span className="text-secondary-foreground/70 transition">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg  text-c1 font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <Link className="flex items-center justify-center gap-1.5 sm:justify-start">
                      <Icon className="size-5 shrink-0 text-primary shadow-sm" />
                      {isAddress ? (
                        <address className="-mt-0.5 flex-1 not-italic text-secondary-foreground/70 transition">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1 text-secondary-foreground/70 transition">
                          {text}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm flex items-center gap-x-2">
              <span className=" md:text-left text-center mx-auto  text-gray-800">
                All rights reserved.
              </span>
              <ul className=" flex justify-center gap-6">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      target="_blank"
                      className="text-primary transition hover:text-primary/80"
                    >
                      <span className="sr-only">{label}</span>
                      <Icon className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; {currentYear} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
