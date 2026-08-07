# Portal live contract

## Resolution and tenant identity

- Backend controller source of truth: `/opt/tuonghoa/portal/src/main/java/com/vaadin/example/example/controller/GreetingController.java`.
- Tenant configuration source: `/opt/tuonghoa/portal/xml/config.xml`.
- Use the complete domain as `tenantId`, including subdomains.
- `templateFolder` selects the live template name; database assignment is separate.
- Missing static files often return an HTML fallback, producing browser MIME-type errors. Confirm both the URL prefix and physical file.

## Standard product model

Common properties include `productCode`, `productName`, `path`, `productImageDesUrl`, `productPriceAmount`, `formatedPriceAfterDiscount`, `productShortDes`, `productLongDes`, and `productCatalog`. Copy property usage from an existing working tenant when uncertain.

## Session cart API

The JAR owns cart state by HTTP session:

- `POST /cart/add` with JSON `{ "items": [...] }`.
- `POST /cart/update/?id=<itemId>&quantity=<quantity>`.
- `POST /cart/remove/<itemId>`.
- `GET /gio-hang`.
- `GET /dat-hang`.

Each added item must include `productCode`, `name`, `imageUrl`, numeric `price`, `quantity`, and non-null `colorCode`, `sizeCode`, and `priceCode`; use `"none"` for products without variants.

Pages can read `${cart.items}`, `${cart.totalItems}`, `${cart.formatedPrice}`, and `${cart.currency}`. Keep the `JSESSIONID` flow; do not replace this with localStorage.

## Checkout page contract

Database article links select the tenant templates:

- `gio-hang` -> `cart.html`
- `dat-hang` -> `checkout.html`
- `don-hang-cua-toi` -> `mycheckout.html`
- `dat-hang-thanh-cong` -> `thankyou.html`

The NLS checkout implementation uses a shared `fcheckout.html`, `cart.js`, `checkout.js`, and shipping-option CSS. When cloning it, make the fragment tenant-local (for example `~{dailocoffee/fcheckout :: body}`) and copy its JS dependencies under the same tenant static folder.

## Login page contract

`GET /dang-nhap` resolves `templates/<template>/login-page.html`. Preserve these hooks when restyling the NLS flow:

- `#loginForm`, `#sinupForm`
- `.title-text .login`, `form.login`
- `label.login`, `label.signup`, `.signup-link a`
- `.btn-layer-login`, `.btn-layer-signup`
- `.error-message1`, `.error-message`
- fields named `email`, `password`, and `repassword`
- `mfa-setup :: mfaSetup` and `mfa-verify :: mfaVerify`

The cloned login JavaScript calls `/api/login-act` and `/api/simple-register`. Google OAuth uses `/oauth2/authorization/google` unless the current backend explicitly changes it.

## Live Git hygiene

The repository may contain user-owned staged files such as `.idea/.gitignore`. Never unstage, delete, or commit these incidentally. Use path-limited `git add` and `git commit -- <paths>`.
