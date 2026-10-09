"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Image from "next/image";

type MenuProduct = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceCents: number;
};

type MenuCategory = {
  id: string;
  name: string;
  products: MenuProduct[];
};

type MenuResponse = {
  restaurant: {
    name: string;
  };

  categories: MenuCategory[];
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatMoney(cents: number) {
  return moneyFormatter.format(cents / 100);
}

export function MenuScreen() {
  const [menu, setMenu] = useState<MenuResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/menu", {
        cache: "no-store",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        throw new Error(
          payload?.error ?? "Não foi possível carregar o cardápio.",
        );
      }

      setMenu(payload as MenuResponse);
    } catch (caughtError) {
      console.error("Erro ao carregar cardápio:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível carregar o cardápio.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  const visibleCategories = useMemo(() => {
    if (!menu) {
      return [];
    }

    if (selectedCategory === "ALL") {
      return menu.categories;
    }

    return menu.categories.filter(
      (category) => category.id === selectedCategory,
    );
  }, [menu, selectedCategory]);

  if (loading) {
    return <MenuLoading />;
  }

  if (error || !menu) {
    return (
      <MenuError
        message={error ?? "Não foi possível carregar o cardápio."}
        onRetry={() => void loadMenu()}
      />
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F1E9] text-[#17120F]">
      {/* Header */}
      <header className="relative overflow-hidden bg-[#090909] px-5 pb-7 pt-5 text-white">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-red-700/20 blur-[80px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-20 shrink-0">
              <Image
                src="/LOOGORICARDO.png"
                alt="Ricardo Espetaria"
                fill
                priority
                sizes="80px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Ricardo Espetaria
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Nosso cardápio
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
            Confira nossas opções e escolha seus favoritos.
          </p>
        </div>
      </header>

      {/* Categorias */}
      <div className="sticky top-0 z-30 border-b border-black/5 bg-[#F5F1E9]/95 backdrop-blur">
        <div className="scrollbar-hide mx-auto max-w-3xl overflow-x-auto px-4 py-3">
          <div className="flex min-w-max gap-2">
            <CategoryButton
              active={selectedCategory === "ALL"}
              onClick={() => setSelectedCategory("ALL")}
            >
              Todos
            </CategoryButton>

            {menu.categories.map((category) => (
              <CategoryButton
                key={category.id}
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <main className="mx-auto max-w-3xl px-4 pb-12 pt-6">
        {visibleCategories.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold">Nenhum produto disponível.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {visibleCategories.map((category) => (
              <section key={category.id}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C63720]">
                      Cardápio
                    </p>

                    <h2 className="mt-1 text-xl font-bold">{category.name}</h2>
                  </div>

                  <p className="text-[11px] text-black/45">
                    {category.products.length}{" "}
                    {category.products.length === 1 ? "item" : "itens"}
                  </p>
                </div>

                {category.products.length === 0 ? (
                  <div className="rounded-2xl border border-black/5 bg-white px-5 py-6 text-sm text-black/45">
                    Nenhum produto disponível nesta categoria.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        <footer className="mt-12 border-t border-black/10 pt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
            Ricardo Espetaria
          </p>

          <p className="mt-2 text-xs text-black/45">
            Produtos e valores podem sofrer alterações.
          </p>
        </footer>
      </main>
    </section>
  );
}

function ProductCard({ product }: { product: MenuProduct }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.imageUrl]);

  return (
    <article className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_3px_18px_rgba(0,0,0,0.045)]">
      <div className="flex min-h-[120px]">
        <div className="min-w-0 flex-1 p-4">
          <h3 className="text-[15px] font-bold leading-5 text-[#17120F]">
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-2 line-clamp-3 text-[11px] leading-[18px] text-black/50">
              {product.description}
            </p>
          )}

          <p className="mt-4 text-[17px] font-extrabold text-[#C63720]">
            {formatMoney(product.priceCents)}
          </p>
        </div>
        <div className="relative w-[145px] shrink-0 self-stretch overflow-hidden bg-[#ECE7DE]">
          {product.imageUrl && !imageFailed ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </>
          ) : (
            <div className="flex h-full min-h-[120px] items-center justify-center px-3 text-center">
              <span className="text-[10px] font-medium text-black/30">
                Ricardo
                <br />
                Espetaria
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CategoryButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-[11px] font-semibold transition",
        active
          ? "bg-[#C63720] text-white shadow-sm"
          : "border border-black/10 bg-white text-black/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MenuLoading() {
  return (
    <section className="min-h-screen bg-[#F5F1E9]">
      <div className="h-44 animate-pulse bg-[#111111]" />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="h-10 animate-pulse rounded-xl bg-black/5" />

        <div className="mt-8 h-7 w-36 animate-pulse rounded-lg bg-black/5" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[130px] animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F1E9] px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-lg font-bold text-[#17120F]">
          Cardápio indisponível
        </p>

        <p className="mt-2 text-sm leading-6 text-black/50">{message}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 min-h-[44px] rounded-xl bg-[#C63720] px-5 text-sm font-semibold text-white"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}
