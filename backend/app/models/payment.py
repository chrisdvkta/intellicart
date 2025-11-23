from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    CASH_ON_DELIVERY = "cash_on_delivery"


class Payment(SQLModel, table=True):
    __tablename__ = "payments"
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", unique=True)

    stripe_payment_intent_id: Optional[str] = Field(default=None, unique=True)
    stripe_client_secret: Optional[str] = Field(
        default=None, alias="client_secret", description="Stripe client secret"
    )

    amount: float = Field(gt=0)
    currency: str = Field(default="usd")
    payment_method: PaymentMethod = Field(default=PaymentMethod.CASH_ON_DELIVERY)
    status: PaymentStatus = Field(default=PaymentStatus.PENDING)
    failure_reason: Optional[str] = None
    payment_metadata: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class PaymentCreate(SQLModel):
    order_id: int
    payment_method: PaymentMethod = Field(default=PaymentMethod.CASH_ON_DELIVERY)


class PaymentResponse(SQLModel):
    id: int
    order_id: int
    amount: float
    currency: str
    status: PaymentStatus
    client_secret: Optional[str] = None
    payment_method: PaymentMethod
