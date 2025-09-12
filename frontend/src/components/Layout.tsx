import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ChevronDown,
    Menu as MenuIcon,
    Settings,
    FileText,
    Bell,
    Search,
    ChevronRight,
    LogOut,
    BriefcaseBusiness,
    X,
    Scroll,
} from "lucide-react";
import { clsx } from "clsx";

interface MenuItem {
    title: string;
    path?: string;
    icon: React.ReactNode;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Portfolio",
        path: "/portfolio",
        icon: <BriefcaseBusiness className="h-5 w-5" />,
    },
    {
        title: "Certification",
        path: "/certification",
        icon: <Scroll className="h-5 w-5" />,
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    useEffect(() => {
        if (sidebarOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [sidebarOpen]);

    const toggleMenu = (title: string) => {
        setExpandedMenus((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title]
        );
    };

    const isMenuActive = (item: MenuItem): boolean => {
        if (item.path === location.pathname) return true;
        if (item.children) {
            return item.children.some(child => child.path === location.pathname);
        }
        return false;
    };

    const handleSearchClick = () => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }
    };

    const MenuItem = ({
        item,
        level = 0,
    }: {
        item: MenuItem;
        level?: number;
    }) => {
        const isActive = item.path === location.pathname;
        const isMenuItemActive = isMenuActive(item);
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.title);

        useEffect(() => {
            if (hasChildren && item.children?.some(child => child.path === location.pathname) && !isExpanded) {
                toggleMenu(item.title);
            }
        }, [location.pathname]);

        const handleMenuItemClick = () => {
            if (hasChildren) {
                if (!sidebarOpen) {
                    setSidebarOpen(true);
                    setTimeout(() => toggleMenu(item.title), 50);
                } else {
                    toggleMenu(item.title);
                }
            } else if (item.path && !sidebarOpen && !isMobile) {
            }
        };

        return (
            <>
                <div
                    className={clsx(
                        "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors",
                        isActive || isMenuItemActive
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                        level > 0 && "ml-4"
                    )}
                    onClick={handleMenuItemClick}
                >
                    {item.icon}

                    {sidebarOpen && (
                        <>
                            <span className="ml-3 flex-1">{item.title}</span>
                            {hasChildren && (
                                <ChevronRight
                                    className={clsx(
                                        "h-4 w-4 transition-transform",
                                        isExpanded && "transform rotate-90"
                                    )}
                                />
                            )}
                        </>
                    )}
                </div>
                {hasChildren && isExpanded && sidebarOpen && (
                    <div className="mt-1">
                        {item.children?.map((child) => (
                            <Link key={child.title} to={child.path || "#"}>
                                <MenuItem item={child} level={level + 1} />
                            </Link>
                        ))}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={clsx("min-h-screen", isDark ? "dark" : "")}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">

                {sidebarOpen && isMobile && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div
                    className={clsx(
                        "fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-30",
                        isMobile
                            ? sidebarOpen
                                ? "w-64"
                                : "-translate-x-full"
                            : sidebarOpen
                            ? "w-64"
                            : "w-16"
                    )}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between h-16 px-4">
                            {sidebarOpen && (
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                    Admin
                                </span>
                            )}
                            
                            {!isMobile && (
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            )}
                            {isMobile && sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="ml-auto p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            )}
                        </div>

                        <div className="px-4 mb-4">
                            {sidebarOpen ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 sm:text-sm"
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={handleSearchClick}
                                    className="flex justify-center items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            )}
                        </div>

                        <nav className="px-2 space-y-1 overflow-y-auto flex-grow">
                            {menuItems.map((item) => (
                                <div key={item.title}>
                                    {item.path && !item.children ? (
                                        <Link to={item.path} onClick={()=>{setSidebarOpen(false)}}>
                                            <MenuItem item={item} />
                                        </Link>
                                    ) : (
                                        <MenuItem item={item} />
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                <div
                    className={clsx(
                        "transition-all duration-300",
                        !isMobile && (sidebarOpen ? "md:ml-64" : "md:ml-16")
                    )}
                >
                    <div className="sticky top-0 left-0 bg-white dark:bg-gray-800 shadow-sm z-10">
                        <div className={clsx("flex items-center h-16 px-4", isMobile ? "justify-between" : "justify-end")}>

                            {isMobile && (
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            )}

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsDark(!isDark)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {isDark ? "🌞" : "🌙"}
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setShowProfileMenu(!showProfileMenu)
                                        }
                                        className="flex items-center space-x-3 focus:outline-none"
                                    >
                                        <img
                                            src="/api/placeholder/32/32"
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <div className="hidden md:flex md:items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user?.username}
                                            </span>
                                            <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                                        </div>
                                    </button>
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    logout();
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}