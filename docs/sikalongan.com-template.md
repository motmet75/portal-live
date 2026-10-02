# Sika Long An prospect template

Prepared for the prospect tenant `sikalongan.anhmedia.vn`.

## Provisioning values

- Tenant/domain: `sikalongan.anhmedia.vn`
- Existing live template: `sikalongan.com`
- Seed: `db/sikalongan_anhmedia_vn_seed.sql`
- Login: `sikalongan`
- Password: `sikalongan`
- MFA: disabled
- First-login/activation gate: disabled

The provisioning service should create this mapping in `xml/config.xml`:

```xml
<config name="templateFolder" tenantId="sikalongan.anhmedia.vn">
    <language code="en">sikalongan.com</language>
</config>
```

## Apply the content seed

Run the SQL only against the newly cloned database for this tenant:

```bash
psql -v ON_ERROR_STOP=1 -d TENANT_DATABASE \
  -f /opt/portal-live/db/sikalongan_anhmedia_vn_seed.sql
```

The seed is rerunnable and imports:

- 5 public page records with complete captured source HTML
- 53 products and their complete descriptions
- 12 product catalogs and 3 brands
- 69 product images and 55 page/gallery images stored locally
- an enabled administrator account with `ROLE_ADMIN` and `ROLE_USER`

No `gototp` authority is retained for the account. In this application that
authority is what enables the second-factor flow. All account-expiry, lock, and
credential-expiry flags are set to allow immediate login.

All source prices were `0 VND`; the template therefore presents every item as
“Liên hệ báo giá” rather than inventing prices.
