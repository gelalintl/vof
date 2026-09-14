import type { AuthorSignatureData } from "@/types";

export type AuthorSignatureProps = AuthorSignatureData;

export function AuthorSignature({ name, role, signature }: AuthorSignatureProps) {
  return (
    <footer className="border-t border-violet-100 pt-6">
      <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-sky-600">
        Signature de l&apos;auteur
      </p>
      <p className="mt-3 font-serif text-2xl italic text-violet-700">
        {signature ?? name}
      </p>
      <p className="mt-1 font-heading text-sm font-bold tracking-tight text-slate-800">
        {name} — {role}
      </p>
    </footer>
  );
}
