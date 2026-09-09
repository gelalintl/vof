"use client";

import { useMemo, useState } from "react";
import type { EventComment } from "@/types";
import { formatEventDate } from "@/utils/date/format";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";

interface CommentSectionProps {
  eventTitle: string;
  comments?: EventComment[];
}

export function CommentSection({ eventTitle, comments = [] }: CommentSectionProps) {
  const [items, setItems] = useState(comments);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const ordered = useMemo(
    () =>
      [...items].sort((a, b) => a.postedAt.localeCompare(b.postedAt)),
    [items],
  );

  return (
    <section className="border-t border-violet-100 pt-10" aria-labelledby="commentaires">
      <Typography id="commentaires" variant="h3">
        Commentaires
      </Typography>
      <Typography variant="caption" className="mt-1">
        Partagez un mot d&apos;encouragement autour de « {eventTitle} ».
      </Typography>

      <ul className="mt-6 space-y-4">
        {ordered.length === 0 ? (
          <li className="rounded-2xl bg-slate-50 p-4 font-sans text-sm text-slate-600">
            Soyez le premier à laisser un commentaire.
          </li>
        ) : (
          ordered.map((comment) => (
            <li key={comment.id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-heading text-sm font-bold text-violet-700">
                {comment.authorName}
              </p>
              <p className="font-sans text-xs capitalize text-slate-500">
                {formatEventDate(comment.postedAt)}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
                {comment.message}
              </p>
            </li>
          ))
        )}
      </ul>

      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmedName = name.trim();
          const trimmedMessage = message.trim();
          if (!trimmedName || !trimmedMessage) {
            return;
          }
          setItems((current) => [
            ...current,
            {
              id: `local-${Date.now()}`,
              authorName: trimmedName,
              postedAt: new Date().toISOString(),
              message: trimmedMessage,
            },
          ]);
          setName("");
          setMessage("");
        }}
      >
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">Votre nom</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
          />
        </label>
        <Button type="submit" variant="primary">
          Publier
        </Button>
      </form>
    </section>
  );
}
