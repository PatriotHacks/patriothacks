import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="relative z-10 px-5 py-4 sm:px-8">
      <Link href="/" aria-label="PatriotHacks home" className="inline-block">
        <Image src="/logo.png" alt="" width={1803} height={1274} priority className="h-9 w-auto" />
      </Link>
    </header>
  );
}
