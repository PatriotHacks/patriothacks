/**
 * Announcement bar. Sits above the nav inside the fixed header, so it stays
 * visible while scrolling. `/linkedin` is a same-origin 307 to the application
 * site (see vercel.json), which keeps the printed and spoken
 * URL on patriothacks.org.
 */
const link =
  'underline decoration-gold decoration-2 underline-offset-[3px] transition hover:text-gold focus-visible:outline-white'

export default function Banner() {
  return (
    <div className="bg-mason px-5 py-2 text-center text-[13px] font-medium leading-snug text-white sm:px-8 sm:text-sm">
      Sign up for our{' '}
      <a href="/linkedin" className={link}>
        LinkedIn Workshop
      </a>{' '}
      and our{' '}
      <a href="https://patriothackfest.com" className={link}>
        Fall Hackathon
      </a>
      !
    </div>
  )
}
