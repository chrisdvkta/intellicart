import Link from "next/link";
import CartItemCard, { CartLine } from "@/components/cart/cart-item-card";
import CheckoutForm from "@/components/cart/checkout-form";
import { cartService } from "@/services/cart-service";
import { catalogService } from "@/services/catalog-service";
import { getSessionToken } from "@/lib/session";

const buildCartLines = async () => {
  const token = await getSessionToken();
  if (!token) return null;

  const cartApi = cartService(token);
  const catalog = catalogService();
  const summary = await cartApi.getCart().catch(() => null);
  if (!summary) return null;

  const productLookups = await Promise.all(
    summary.items.map((item) =>
      catalog.getProduct(item.product_id).catch(() => null)
    )
  );

  const lines: CartLine[] = summary.items.map((item, index) => {
    const product = productLookups[index];
    return {
      id: item.id,
      name: product?.name ?? `Product ${item.product_id}`,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price_at_time,
      image: product?.image_url,
    };
  });

  return { summary, lines };
};

export default async function CartPage() {
  const cartData = await buildCartLines();

  if (!cartData) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Your cart awaits</h2>
        <p className="mt-2">Sign in to start collecting items across the store.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/auth/login" className="rounded-full bg-slate-900 px-4 py-2 text-white">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-slate-900">
            Explore products
          </Link>
        </div>
      </div>
    );
  }

  const { summary, lines } = cartData;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Cart</p>
        <h1 className="text-3xl font-semibold text-slate-900">Items selected</h1>
        <p className="text-slate-600">
          {summary.item_count} products · ${summary.total.toFixed(2)} subtotal
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
          Your cart is empty. Add something you love.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {lines.map((line) => (
              <CartItemCard key={line.id} line={line} />
            ))}
          </div>
          <CheckoutForm />
        </div>
      )}
    </div>
  );
}
