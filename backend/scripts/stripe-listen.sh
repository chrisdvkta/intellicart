#!/usr/bin/env bash
set -euo pipefail

# Simple helper to start Stripe CLI webhook forwarding for local dev.
# If Stripe CLI is missing, this will try to install it using a detected package manager.

FORWARD_TO="${STRIPE_FORWARD_TO:-localhost:8000/v1/payment/webhook}"

install_stripe() {
  echo "Attempting to install Stripe CLI..."
  if command -v brew >/dev/null 2>&1; then
    brew install stripe/stripe-cli/stripe || return 1
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y stripe || return 1
    return 0
  fi

  if command -v choco >/dev/null 2>&1; then
    choco install stripe || return 1
    return 0
  fi

  if command -v scoop >/dev/null 2>&1; then
    scoop install stripe || return 1
    return 0
  fi

  return 1
}

if ! command -v stripe >/dev/null 2>&1; then
  if install_stripe; then
    echo "Stripe CLI installed successfully."
  else
    echo "Stripe CLI is not installed and could not be installed automatically."
    echo "Manual install guide: https://stripe.com/docs/stripe-cli"
    exit 1
  fi
fi

echo "Starting Stripe listen and forwarding to ${FORWARD_TO} ..."
stripe listen --forward-to "${FORWARD_TO}"
