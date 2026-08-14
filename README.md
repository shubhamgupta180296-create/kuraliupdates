# KuraliUpdates V3 — Full-stack starter

KuraliUpdates is a Cloudflare Pages + Pages Functions + D1 local marketplace and civic-connect application.

## Included
- Customer signup/login/logout
- Seller registration/login
- Seller dashboard: add/list products and view own orders
- Product marketplace with search/category filter
- Cart + order creation
- Complaint submission + tracking
- Admin login/dashboard APIs
- Seller approval
- Product approval
- Complaint status updates
- Ward/MC records
- Secure password hashing with Web Crypto
- HttpOnly session cookie
- Basic role checks
- SEO/meta tags
- Responsive frontend
- Cloudflare Pages + D1 configuration

## Important
This is a strong deployable MVP foundation, but before accepting real money or public civic data you should add:
- Production security review / penetration test
- CAPTCHA/rate limiting/WAF rules
- Email/SMS/WhatsApp notifications
- R2 image uploads instead of arbitrary image URLs
- Razorpay or another payment gateway + server-side payment verification
- Refund/cancellation workflows
- Full admin UI for every moderation operation
- Privacy policy, terms, seller agreement and grievance policy
- Verified official Kurali ward/MC information
- Backups/monitoring/analytics

## Deploy
1. Create a GitHub repository and upload this project.
2. Create a Cloudflare D1 database named `kuraliupdates-db`.
3. Run `database/schema.sql` against it.
4. Put the D1 database ID in `wrangler.toml`.
5. Connect the GitHub repository to Cloudflare Pages.
6. In Pages Settings > Bindings, add a D1 binding named `DB` pointing to the database, then redeploy.
7. Add `kuraliupdates.com` under Pages > Custom domains.
8. For the apex domain, Cloudflare requires the domain to be a Cloudflare zone and its nameservers pointed to Cloudflare.

## Create the first admin
The schema contains no admin password. Register a normal account, then run:
UPDATE users SET role='admin' WHERE email='YOUR_EMAIL';
Never expose the database or run this from client-side code.

## Local
Use Wrangler:
npx wrangler pages dev .
For D1 local binding, use the current Wrangler D1/Pages workflow documented by Cloudflare.
