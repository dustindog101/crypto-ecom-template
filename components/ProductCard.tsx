import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  slug: string;
  name: string;
  categoryLabel: string;
  description?: string | null;
  startingPrice: number;
  featured?: boolean;
  isDigital?: boolean;
}

export function ProductCard({
  slug,
  name,
  categoryLabel,
  description,
  startingPrice,
  featured,
  isDigital,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="glass glass-hover p-6 flex flex-col justify-between group border border-white/8 hover:border-indigo-500/40 relative overflow-hidden"
    >
      {featured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-semibold text-indigo-300">
          <Sparkles className="w-3 h-3" /> Featured
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            {categoryLabel}
          </span>
          {isDigital && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Instant Digital
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/6 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">From</span>
          <span className="text-price text-base">${startingPrice.toFixed(2)}</span>
        </div>

        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition">
          View Options <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
