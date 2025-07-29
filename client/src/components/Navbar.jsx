import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";
import { IoSearch } from "react-icons/io5";
// import Logo from "@/registry/default/components/navbar-components/logo"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CartDrawer from "./CartDrawer";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchDrawer from "./SearchDrawer";
import { useSelector } from "react-redux";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  // { href: "#", label: "Home" },
  { href: "#", label: "Featured Products" },
  {
    label: "For Men",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "Components",
        description: "Browse all components in the library.",
      },
      {
        href: "#",
        label: "Documentation",
        description: "Learn how to use the library.",
      },
      {
        href: "#",
        label: "Templates",
        description: "Pre-built layouts for common use cases.",
      },
    ],
  },
  {
    label: "For Women",
    submenu: true,
    type: "simple",
    items: [
      { href: "#", label: "Product A" },
      { href: "#", label: "Product B" },
      { href: "#", label: "Product C" },
      { href: "#", label: "Product D" },
    ],
  },
];
const Navbar = () => {
  const [cartDrawer, setCartDrawer] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenCart = () => {
    setCartDrawer((prev) => !prev);
  };

  const handleOpenSearch = () => {
    setSearchDrawer((prev) => !prev);
  };

  const userState = useSelector((state) => state?.user) || {};
  const navigate = useNavigate()
  const { user, isLoggedIn } = userState;
  console.log("user data", user, isLoggedIn);

  return (
    <div>
      <div className="  flex bg-c2  text-white justify-center items-center py-2 w-full">
        <p> छाप - Live Now</p>
      </div>
      <header
        className={`${
          isSticky ? "fixed top-0 left-0 w-full bg-[#edb141]  z-20" : ""
        }  px-4 md:px-6 `}
      >
        <div className="flex  h-16 items-center justify-between gap-4">
          <div className="flex items-center   w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group size-8 md:hidden"
                  variant="ghost"
                  size="icon"
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        {link.submenu ? (
                          <>
                            <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                              {link.label}
                            </div>
                            <ul>
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink
                                    href={item.href}
                                    className="py-1.5"
                                  >
                                    {item.label}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <NavigationMenuLink
                            href={link.href}
                            className="py-1.5"
                          >
                            {link.label}
                          </NavigationMenuLink>
                        )}
                        {/* Add separator between different types of items */}
                        {index < navigationLinks.length - 1 &&
                          // Show separator if:
                          // 1. One is submenu and one is simple link OR
                          // 2. Both are submenus but with different types
                          ((!link.submenu &&
                            navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              !navigationLinks[index + 1].submenu) ||
                            (link.submenu &&
                              navigationLinks[index + 1].submenu &&
                              link.type !==
                                navigationLinks[index + 1].type)) && (
                            <div
                              role="separator"
                              aria-orientation="horizontal"
                              className="bg-border -mx-1 my-1 h-px w-full"
                            />
                          )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            <Link to={"/"} className="text-primary text-white text-4xl">
              छाप
            </Link>
          </div>
          <div className="flex items-center w-full justify-center  gap-6">
            {/* Navigation menu */}
            <NavigationMenu viewport={false} className="max-md:hidden ">
              <NavigationMenuList className="gap-2   text-gray-100 ">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="text-muted-foreground bg-transparent text-gray-100  px-4 py-1.5  *:[svg]:-me-0.5 *:[svg]:size-3.5">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className=" data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-64"
                                : "min-w-48"
                            )}
                          >
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink
                                  href={item.href}
                                  className="py-1.5"
                                >
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2">
                                      {item.icon === "BookOpenIcon" && (
                                        <BookOpenIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "LifeBuoyIcon" && (
                                        <LifeBuoyIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "InfoIcon" && (
                                        <InfoIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      <span>{item.label}</span>
                                    </div>
                                  )}

                                  {/* Display label with description if present */}
                                  {link.type === "description" &&
                                  "description" in item ? (
                                    <div className="space-y-1">
                                      <div className="">{item.label}</div>
                                      <p className="text-muted-foreground line-clamp-2 text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  ) : (
                                    // Display simple label if not icon or description type
                                    !link.type ||
                                    (link.type !== "icon" &&
                                      link.type !== "description" && (
                                        <span>{item.label}</span>
                                      ))
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={link.href}
                        className=" py-1.5 px-4 font-medium"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex cursor-pointer  justify-end space-x-6 text-[1.4rem]  font-bold  w-full text-white  gap-2">
            <IoSearch onClick={handleOpenSearch} />
          
              <FaRegUser  onClick={()=>{
                if(!isLoggedIn){
                  navigate('/login')
                }
                else{
                  navigate('/my-account')
                }
              }}/>
           
            <Link to={"/my-account"}>
              {" "}
              <FaRegHeart />
            </Link>
            <AiOutlineShoppingCart onClick={()=>{
              if(!isLoggedIn){
                  navigate('/login')
              }else{
                 {handleOpenCart}
              }
            }}

            />
          </div>
        </div>
      </header>
      <CartDrawer isOpen={cartDrawer} onClose={handleOpenCart} />
      <SearchDrawer isOpen={searchDrawer} onClose={handleOpenSearch} />
    </div>
  );
};

export default Navbar;
