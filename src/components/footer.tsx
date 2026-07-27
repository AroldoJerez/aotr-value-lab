import Link from "next/link";
import { Swords, GitBranchPlus } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-(--accentMain)/25 bg-black/25 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Marca / descripción */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-(--textHighlight)">
              <span className="grid size-8 place-items-center rounded-md border border-(--accentBright) bg-(--accentMain)/40">
                <Swords size={16} />
              </span>
              <span className="text-xs font-black tracking-[.18em]">
                AOTR <span className="text-(--accentBright)">VALUE</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-(--textSecondary)">
              Tu espacio de referencia para comparar el valor en AOTR. Armá
              ofertas, medí la diferencia y negociá sabiendo exactamente dónde
              estás parado.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-(--textHighlight) uppercase">
              Navegación
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-(--textSecondary)">
              <li>
                <Link href="/" className="hover:text-(--accentBright)">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/comparator"
                  className="hover:text-(--accentBright)"
                >
                  Comparator
                </Link>
              </li>
              <li>
                <Link href="/price" className="hover:text-(--accentBright)">
                  Price
                </Link>
              </li>
            </ul>
          </div>

          {/* Proyecto */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-(--textHighlight) uppercase">
              Proyecto
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-(--textSecondary)">
              <li className="flex items-center gap-2">
                <GitBranchPlus size={14} />
                <a
                  href="https://github.com/AroldoJerez/aotr-value-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-(--accentBright)"
                >
                  Código en GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-(--accentMain)/15 pt-6 text-[10px] text-(--textSecondary) sm:flex-row">
          <p>
            © {new Date().getFullYear()} AOTR Value Lab. No afiliado
            oficialmente al juego.
          </p>
        </div>
      </div>
    </footer>
  );
}
