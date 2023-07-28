import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Documentation", href: "/docs", current: false },
];

const extLinks = [
  { name: "GitHub", href: "https://github.com/communitycenter/stardew.me", variant: "secondary" },
  { name: "Discord", href: "https://discord.gg/NkgNVZwQ2M", variant: "" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const router = useRouter();

  navigation.forEach((item) => {
    item.current = item.href === router.asPath;
  });

  return (
    <Disclosure as="nav" className="bg-white dark:bg-neutral-950">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start pt-1">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    width={"36"}
                    height={"36"}
                    className="h-9 w-auto"
                    src="https://stardew.me/assets/logo.png"
                    alt="stardew.me logo"
                  />
                  <h1 className="pl-4 font-medium">stardew.me</h1>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-2">
                    {navigation.map((item) => (
                      <Link href={item.href}>
                        <div
                          key={item.name}
                          className={classNames(
                            item.current
                              ? "bg-[#f1f5f9] text-gray-900"
                              : "text-gray-900 dark:text-neutral-50 hover:bg-[#f7f9fa] dark:hover:bg-neutral-800/80 transition ease-in-out duration-150",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-2">
                  <Button variant="secondary">
                    <Link href="https://github.com/communitycenter/stardew.me">
                      GitHub
                    </Link>
                  </Button>
                  <Button>
                    <Link href="https://discord.gg/NkgNVZwQ2M">Discord</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 dark:bg-white text-white dark:text-neutral-950"
                      : "text-gray-900 dark:text-white hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="space-y-1 px-2 pb-3">
              {extLinks.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    "text-gray-900 dark:text-white hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
