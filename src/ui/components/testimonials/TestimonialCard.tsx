import { Quote } from "lucide-react";
import type { PublicTestimonial } from "@/types";
import { cn } from "@/utils/cn";
import { formatPublicationDate } from "@/utils/date/format";

interface TestimonialCardProps {
  testimonial: PublicTestimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm">
      <Quote className="size-7 text-amber-500" aria-hidden />
      <blockquote className="mt-4 flex-1 whitespace-pre-line font-serif text-base italic leading-relaxed text-slate-800">
        {testimonial.content}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
        {testimonial.imagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.imagePath}
            alt={testimonial.authorName}
            className="size-11 shrink-0 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-heading text-sm font-bold text-violet-700"
          >
            {testimonial.authorName.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-slate-900">
            {testimonial.authorName}
          </p>
          <p className="font-sans text-xs text-slate-500">
            {formatPublicationDate(testimonial.createdAt)}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: PublicTestimonial[] }) {
  if (testimonials.length === 1) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <TestimonialCard testimonial={testimonials[0]} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        testimonials.length === 2 ? "mx-auto w-full max-w-4xl" : "lg:grid-cols-3",
      )}
    >
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}
