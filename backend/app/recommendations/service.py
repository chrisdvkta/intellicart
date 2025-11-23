from datetime import datetime
from typing import List, Optional
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.models.cart import Cart, CartItem
from app.models.product import Product


class RecommendationService:
    def __init__(self):
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None  # scipy.sparse matrix
        self.product_ids: List[int] = []
        self.last_built_at: Optional[datetime] = None
        self.catalog_signature: Optional[tuple[int, Optional[datetime]]] = None

    async def _load_active_products(
        self, session: AsyncSession
    ) -> tuple[List[Product], List[str]]:
        stmt = (
            select(Product)
            .where(Product.is_active.is_(True))
            .where(Product.stock_quantity > 0)
        )
        result = await session.execute(stmt)
        products = result.scalars().all()
        texts = [f"{p.name} {p.description or ''}" for p in products]
        return products, texts

    async def _get_catalog_signature(
        self, session: AsyncSession
    ) -> tuple[int, Optional[datetime]]:
        # Tracks catalog changes (count + latest update) to decide when to rebuild.
        count_stmt = (
            select(func.count(), func.max(Product.updated_at))
            .select_from(Product)
            .where(Product.is_active.is_(True))
            .where(Product.stock_quantity > 0)
        )
        result = await session.execute(count_stmt)
        count, latest_updated_at = result.first()
        return count or 0, latest_updated_at

    async def build_index(self, session: AsyncSession) -> None:
        products, texts = await self._load_active_products(session)
        if not products:
            # Reset caches when catalog is empty
            self.vectorizer = None
            self.tfidf_matrix = None
            self.product_ids = []
            self.last_built_at = datetime.utcnow()
            self.catalog_signature = (0, None)
            return
        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(texts)
        self.vectorizer = vectorizer
        self.tfidf_matrix = tfidf_matrix
        self.product_ids = [p.id for p in products]
        self.last_built_at = datetime.utcnow()
        self.catalog_signature = await self._get_catalog_signature(session)

    async def ensure_index(self, session: AsyncSession) -> None:
        if self.tfidf_matrix is None or not self.product_ids:
            await self.build_index(session)
            return
        current_signature = await self._get_catalog_signature(session)
        if current_signature != self.catalog_signature:
            await self.build_index(session)

    async def recommend_by_product(
        self, seed_product_id: int, session: AsyncSession, limit: int = 10
    ) -> List[Product]:
        await self.ensure_index(session)

        if (
            self.tfidf_matrix is None
            or self.vectorizer is None
            or seed_product_id not in self.product_ids
        ):
            # Try a rebuild once in case the index is stale; if still missing, bail.
            await self.build_index(session)
            if (
                self.tfidf_matrix is None
                or self.vectorizer is None
                or seed_product_id not in self.product_ids
            ):
                return []

        seed_idx = self.product_ids.index(seed_product_id)
        seed_vec = self.tfidf_matrix[seed_idx]
        sims = cosine_similarity(seed_vec, self.tfidf_matrix).flatten()
        ranked_indices = np.argsort(sims)[::-1]
        recommended_ids: List[int] = []

        for idx in ranked_indices:
            if idx == seed_idx:
                continue
            pid = self.product_ids[idx]
            if pid not in recommended_ids:
                recommended_ids.append(pid)
            if len(recommended_ids) >= limit:
                break

        if not recommended_ids:
            return []

        # Fetch products preserving similarity order
        return await self._fetch_products_by_ids(recommended_ids, session)

    async def recommend_from_latest_cart(
        self, user_id: int, session: AsyncSession, limit: int = 10
    ) -> List[Product]:
        """
        Uses the most recently updated cart item for the user as the seed product.
        Returns an empty list when the user has no cart items.
        """
        stmt = (
            select(CartItem.product_id)
            .join(Cart, CartItem.cart_id == Cart.id)
            .where(Cart.user_id == user_id)
            .order_by(CartItem.updated_at.desc())
            .limit(1)
        )
        result = await session.execute(stmt)
        seed_product_id = result.scalar_one_or_none()
        if seed_product_id is None:
            return []
        return await self.recommend_by_product(
            seed_product_id=seed_product_id, session=session, limit=limit
        )

    async def _fetch_products_by_ids(
        self, ids: List[int], session: AsyncSession
    ) -> List[Product]:
        stmt = select(Product).where(Product.id.in_(ids))
        result = await session.execute(stmt)
        products = result.scalars().all()
        # Preserve similarity order
        order = {pid: idx for idx, pid in enumerate(ids)}
        products.sort(key=lambda p: order.get(p.id, len(ids)))
        return products
