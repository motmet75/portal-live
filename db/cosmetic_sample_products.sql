-- UTF-8 PostgreSQL sample products for tenant: cosmetic.anhmedia.vn
-- The configured legacy template/static folder is intentionally spelled:
-- comestic.anhmedia.vn
--
-- This seed is non-destructive and rerunnable. Product names, descriptions and
-- prices are demo content for the ÉLANCIER storefront and require confirmation
-- before production use.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cosmetic_demo_productcode
    ON public.producttb (productcode)
    WHERE productcode LIKE 'ELANCIER-%';

INSERT INTO public.producttb (
    productname, productcode, productcatalog, productbrand,
    productshortdes, productlongdes, productimageurl1, productimageurl2,
    productimagedesurl, productsubcatalog, productgroupstring, pagekeyword,
    productpriceamount, productdiscont, productpricecurrency, language, path,
    createdtime, publishedtime, modifiedtime,
    isvisible, isapproved, islocked, isnew
) VALUES
(
    'Lumière Softening Essence', 'ELANCIER-LUMIERE-ESSENCE',
    'Essence lotion', 'ÉLANCIER',
    'Tinh chất làm mềm giàu ẩm, hỗ trợ làn da căng mịn và rạng rỡ · 250 ml.',
    '<h2>Nghi thức làm mềm và cân bằng</h2><p>Kết cấu essence lotion mỏng nhẹ giúp bổ sung độ ẩm, chuẩn bị làn da cho các bước dưỡng tiếp theo và mang lại cảm giác mềm mại ngay sau khi sử dụng.</p><p><strong>Cách dùng:</strong> thoa lên da sạch vào buổi sáng và tối, sau đó vỗ nhẹ để sản phẩm thẩm thấu.</p><p><em>Sản phẩm và giá dùng cho bản demo.</em></p>',
    '/comestic.anhmedia.vn/images/essence-lotion.png',
    '/comestic.anhmedia.vn/images/essence-lotion.png',
    '/comestic.anhmedia.vn/images/essence-lotion.png',
    'Dưỡng ẩm', 'elancier-skincare',
    'Lumière Softening Essence, essence dưỡng ẩm, ÉLANCIER',
    2450000, 0, 'VND', 'vi', 'lumiere-softening-essence',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
),
(
    'Contour Supreme Eye Cream', 'ELANCIER-CONTOUR-EYE-CREAM',
    'Eye care', 'ÉLANCIER',
    'Kem dưỡng chuyên sâu cho vùng da quanh mắt · 15 ml.',
    '<h2>Chăm sóc vùng da biểu cảm</h2><p>Công thức dưỡng ẩm chuyên biệt dành cho vùng mắt, hỗ trợ cải thiện vẻ mệt mỏi và duy trì bề mặt da mềm mượt.</p><p><strong>Cách dùng:</strong> lấy một lượng nhỏ và vỗ nhẹ quanh vùng xương hốc mắt vào buổi sáng và tối.</p><p><em>Sản phẩm và giá dùng cho bản demo.</em></p>',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    'Mắt và môi', 'elancier-skincare',
    'Contour Supreme Eye Cream, kem dưỡng mắt, ÉLANCIER',
    3250000, 0, 'VND', 'vi', 'contour-supreme-eye-cream',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
),
(
    'Radiance Renewal Serum', 'ELANCIER-RADIANCE-SERUM',
    'Serum', 'ÉLANCIER',
    'Tinh chất phục hồi độ sáng và vẻ đều màu của làn da · 50 ml.',
    '<h2>Đánh thức vẻ rạng rỡ</h2><p>Tinh chất cô đặc với kết cấu thanh nhẹ, hỗ trợ cấp ẩm và làm làn da trông tươi sáng, mịn màng hơn qua từng nghi thức.</p><p><strong>Cách dùng:</strong> thoa 2–3 giọt sau bước essence, dùng vào buổi sáng và tối.</p><p><em>Sản phẩm và giá dùng cho bản demo.</em></p>',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    'Rạng rỡ', 'elancier-skincare',
    'Radiance Renewal Serum, serum sáng da, ÉLANCIER',
    3890000, 0, 'VND', 'vi', 'radiance-renewal-serum',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
),
(
    'Protective Lip Veil', 'ELANCIER-PROTECTIVE-LIP-VEIL',
    'Lip care', 'ÉLANCIER',
    'Dưỡng môi phục hồi với lớp màng ẩm mềm mượt · 8 ml.',
    '<h2>Lớp màn bảo vệ dịu nhẹ</h2><p>Chất dưỡng mềm ôm lấy đôi môi, giúp hạn chế cảm giác khô ráp và duy trì độ ẩm dễ chịu trong ngày.</p><p><strong>Cách dùng:</strong> thoa trực tiếp lên môi bất cứ khi nào cần, có thể dùng lớp dày như mặt nạ môi ban đêm.</p><p><em>Sản phẩm và giá dùng cho bản demo.</em></p>',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    '/comestic.anhmedia.vn/images/collection-ritual.png',
    'Mắt và môi', 'elancier-skincare',
    'Protective Lip Veil, dưỡng môi, ÉLANCIER',
    1250000, 0, 'VND', 'vi', 'protective-lip-veil',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, FALSE
),
(
    'Cellular Night Cream', 'ELANCIER-CELLULAR-NIGHT-CREAM',
    'Moisturizer', 'ÉLANCIER',
    'Kem dưỡng đêm giàu ẩm, hỗ trợ chu trình phục hồi tự nhiên · 50 ml.',
    '<h2>Khóa ẩm trong nhịp nghỉ ngơi</h2><p>Kem dưỡng giàu cảm giác bao bọc làn da bằng độ ẩm bền vững, giúp da trông đầy đặn và tươi mới hơn vào buổi sáng.</p><p><strong>Cách dùng:</strong> thoa ở bước cuối của nghi thức buổi tối, massage nhẹ theo hướng nâng cơ.</p><p><em>Sản phẩm và giá dùng cho bản demo.</em></p>',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    '/comestic.anhmedia.vn/images/hero-radiance.png',
    'Dưỡng đêm', 'elancier-skincare',
    'Cellular Night Cream, kem dưỡng đêm, ÉLANCIER',
    4150000, 0, 'VND', 'vi', 'cellular-night-cream',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
)
ON CONFLICT (productcode) WHERE productcode LIKE 'ELANCIER-%' DO UPDATE SET
    productname = EXCLUDED.productname,
    productcatalog = EXCLUDED.productcatalog,
    productbrand = EXCLUDED.productbrand,
    productshortdes = EXCLUDED.productshortdes,
    productlongdes = EXCLUDED.productlongdes,
    productimageurl1 = EXCLUDED.productimageurl1,
    productimageurl2 = EXCLUDED.productimageurl2,
    productimagedesurl = EXCLUDED.productimagedesurl,
    productsubcatalog = EXCLUDED.productsubcatalog,
    productgroupstring = EXCLUDED.productgroupstring,
    pagekeyword = EXCLUDED.pagekeyword,
    productpriceamount = EXCLUDED.productpriceamount,
    productdiscont = EXCLUDED.productdiscont,
    productpricecurrency = EXCLUDED.productpricecurrency,
    language = EXCLUDED.language,
    path = EXCLUDED.path,
    modifiedtime = NOW(),
    isvisible = TRUE,
    isapproved = TRUE,
    islocked = FALSE,
    isnew = EXCLUDED.isnew;

COMMIT;

-- Verification:
-- SELECT productcode, productname, productpriceamount, path
-- FROM public.producttb
-- WHERE productcode LIKE 'ELANCIER-%'
-- ORDER BY id;
