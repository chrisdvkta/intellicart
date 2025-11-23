This project, IntelliCart: AI-Powered E-commerce Platform with Personalized Product Recommendations, focuses on designing and developing a modern full-stack e-commerce system. The system will replicate a real-world online shopping platform with essential functionalities such as user authentication, product catalog management, shopping cart, and order processing, while integrating an AI-based recommendation engine for personalized user experiences.
E-commerce platforms are ideal for demonstrating a combination of traditional web development practices (frontend, backend, database design, and API integration) and advanced AI capabilities (personalized recommendations). This project was chosen because:
• Personalized shopping experiences significantly increase customer engagement and sales, with real-world businesses reporting a 10–30% boost in revenue through recommendation systems.
• The system reflects the complexity of real-world applications while maintaining scalability and modularity for long-term usability.
• It serves as an excellent opportunity for applying software engineering principles such as modular architecture, incremental development, and agile methodology

Scope
The scope of this project encompasses the development of a full-stack e-commerce web application that integrates essential shopping functionalities with advanced personalization features. The system is designed to serve both end-users (customers) and administrators (store managers) with distinct but interconnected capabilities. 1. User Authentication and Management
◦ Secure registration and login functionality.
◦ Role-based access (customers vs. administrators).
◦ Session management with JWT authentication. 2. Product Catalog and Inventory Management
◦ Display of products with categories, search, and filtering options.
◦ Product details page with descriptions, images, and pricing.
◦ Administrative dashboard for adding, updating, and managing inventory. 3. Shopping Cart and Order Processing
◦ Add-to-cart, update, and remove product options.
◦ Checkout system with order summary.
◦ Order placement, tracking, and history management. 4. Machine Learning–Based Recommendation System
◦ Personalized product suggestions based on browsing and purchase history.
◦ Implementation of collaborative filtering and content-based filtering methods.
◦ Adaptive learning to improve recommendations over time. 5. Technical Architecture
◦ Frontend: Next.js for building a responsive, SEO-friendly user interface.
◦ Backend: FastAPI for handling API requests, business logic, and integration with ML models.
◦ Database: PostgreSQL for secure, efficient, and structured data storage. 6. Performance and Scalability
◦ Support for multiple concurrent users.
◦ Modular design to allow future enhancements (e.g., payment gateways, analytics, multi-vendor support).

Functional Requirements Specification
The functional requirements for the system are listed as follows:
• User Management: Register, Login using JWT, update profile,etc
• Product Catalogue: Products are organized by category, searchable, and filterable (e.g., price, rating, brand)
• Shopping Cart: Users can add, remove, or update items in their cart.
• AI-Based Recommendation System: Personalized product recommendations are displayed on the homepage, product pages, and after checkout.

Non-Functional Requirements Specification
• Personalized Shopping Experience: Accurate product recommendations with real-time cart updates and instant order confirmation.
• User-Friendly Design: Clean, intuitive interface with responsive layouts for seamless use across devices.
• System Reliability: High availability, error logging, and graceful handling of ML service failures.
• Performance Optimization: Fast-loading product catalog (under 2 seconds) and recommendation generation within 500ms.
• Security & Maintainability: JWT-secured API routes, admin-only product management, modular ML service design, and thorough API/ML documentation.

## Stripe setup (local)
- Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to `.env` (see Stripe Dashboard and `stripe listen` output).
- Run the FastAPI server, then forward webhooks with the helper: `./scripts/stripe-listen.sh` (uses `STRIPE_FORWARD_TO` if you need a custom URL, default is `localhost:8000/v1/payment/webhook`).
- If the Stripe CLI is missing, the script will try to install it via Homebrew/apt/choco/scoop; otherwise it will print the manual install link.
