export default function Footer() {
  return (
    <footer className="py-10 px-6 md:px-12 text-center text-[14px] text-muted border-t border-white/[0.03]">
      <p>
        &copy; 2026{" "}
        <a
          href="https://www.legalcrew.co.kr"
          className="text-gold-dark hover:text-gold transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          LegalCrew
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
