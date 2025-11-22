from fastapi import APIRouter
from app.db.main import sessionInstance
from app.recommendations.service import RecommendationService

recommendation_router = APIRouter()
recommendation_service = RecommendationService()


@recommendation_router.get("/recommendations")
async def get_recommendation(
    seed_product_id: int, session: sessionInstance, limit: int = 10
):
    return await recommendation_service.recommend_by_product(
        seed_product_id=seed_product_id, session=session, limit=limit
    )
