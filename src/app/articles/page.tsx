import { permanentRedirect } from "next/navigation";

export default function ArticlesRedirectPage() {
  permanentRedirect("/enseignements");
}
