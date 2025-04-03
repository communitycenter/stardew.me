import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-3 mt-20 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600 dark:text-gray-400 flex gap-2">
          Created with lots of{" "}
          <Image
            className="object-contain"
            alt="Heart"
            src="/heart.png"
            height={20}
            width={20}
          />
          by Community Center.
        </p>
      </div>
    </footer>
  );
}
