-- AMARA Academy demo seed for tenant: phuonganhamara.anhmedia.vn
-- PostgreSQL only. Run this file ONLY against the newly cloned tenant database.
--
-- DESTRUCTIVE: the following TRUNCATE permanently removes all existing article
-- and product rows (plus rows in tables that reference them through CASCADE).
-- Course names/descriptions and covers follow phuonganhamara.com. Prices are
-- clearly marked demo values and should be confirmed before production use.

BEGIN;

TRUNCATE TABLE public.articletb, public.producttb RESTART IDENTITY CASCADE;

-- Minimal page routing required by the AMARA live template.
INSERT INTO public.articletb (
    articleid, username, articlelink, articlecategory, articlelangcode,
    articlesubcategory, articletitle, articlekeyword, articlethumnailurl,
    articledescription, articlecontent, createdtime, modifiedtime,
    isvisible, isapproved, islocked, rejectedbyuser, rejectedreason,
    articletime, originauthor, menustringid, viewcount, rating, postid,
    articletemplate, "index"
) VALUES
(
    'AMARA-PAGE-HOME', 'none', 'home', 'page', 'vi', 'none',
    'Thái Phương Anh — Người Giữ Bình Yên',
    'Thái Phương Anh, AMARA Academy, Tiền Tâm Thân, bán hàng tử tế',
    '/phuonganhamara.anhmedia.vn/images/pa-hero.png',
    'Học để sống tử tế hơn, vững vàng hơn — Tiền, Tâm, Thân.',
    '<p>Trang chủ AMARA Academy.</p>', NOW(), NOW(),
    TRUE, TRUE, FALSE, 'none', 'none', NOW(), 'AMARA Academy', 'none',
    0, 0, 'n', 'index.html', '0'
),
(
    'AMARA-PAGE-PRODUCTS', 'none', 'products.html', 'page', 'vi', 'none',
    'Khóa học — AMARA Academy',
    'khóa học AMARA, thương hiệu cá nhân, bán hàng tử tế, biết ơn',
    '/phuonganhamara.anhmedia.vn/images/viral-tu-te-v2.jpg',
    'Các khóa học về thương hiệu cá nhân, bán hàng tử tế và an trú nội tâm.',
    '<p>Danh sách khóa học AMARA Academy.</p>', NOW(), NOW(),
    TRUE, TRUE, FALSE, 'none', 'none', NOW(), 'AMARA Academy', 'none',
    0, 0, 'n', 'products.html', '1'
);

-- Public course information is sourced from phuonganhamara.com.
-- productpriceamount values below are DEMO PRICES.
INSERT INTO public.producttb (
    productname, productcode, productcatalog, productbrand,
    productshortdes, productlongdes, productimageurl1, productimageurl2,
    productimagedesurl, productsubcatalog, productgroupstring, pagekeyword,
    productpriceamount, productdiscont, productpricecurrency, language, path,
    createdtime, publishedtime, modifiedtime,
    isvisible, isapproved, islocked, isnew
) VALUES
(
    'Viral Tử Tế', 'AMARA-VIRAL-TU-TE', 'Thương hiệu cá nhân', 'AMARA Academy',
    'Xây thương hiệu cá nhân bằng sự tử tế — và để nó lan đi xa.',
    '<h2>Xây thương hiệu bằng giá trị thật</h2><p>Khóa học giúp bạn tìm tiếng nói riêng, xây nội dung có chiều sâu và tạo sự tin tưởng mà không cần chiêu trò hay gồng ép.</p><p><strong>Phù hợp với:</strong> người kinh doanh, chuyên gia và người sáng tạo đang muốn được nhớ tới bằng giá trị thật.</p><p><em>Giá hiển thị là giá demo, cần xác nhận trước khi bán chính thức.</em></p>',
    '/phuonganhamara.anhmedia.vn/images/viral-tu-te-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/viral-tu-te-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/viral-tu-te-v2.jpg',
    'Tiền', 'amara-courses',
    'Viral Tử Tế, thương hiệu cá nhân, content tử tế, Thái Phương Anh',
    990000, 0, 'VND', 'vi', 'viral-tu-te',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
),
(
    'Voice to Sales', 'AMARA-VOICE-TO-SALES', 'Bán hàng', 'AMARA Academy',
    'Giọng nói và tư duy bán hàng — bán là phục vụ.',
    '<h2>Bán hàng bằng giọng nói chân thật</h2><p>Rèn giọng nói, cách truyền đạt và tư duy phục vụ để cuộc trò chuyện bán hàng trở nên tự nhiên, rõ ràng và thuyết phục.</p><p><strong>Phù hợp với:</strong> tư vấn viên, chủ doanh nghiệp nhỏ, người bán hàng và người thường xuyên nói trước khách hàng.</p><p><em>Giá hiển thị là giá demo, cần xác nhận trước khi bán chính thức.</em></p>',
    '/phuonganhamara.anhmedia.vn/images/voice-to-sales-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/voice-to-sales-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/voice-to-sales-v2.jpg',
    'Tiền', 'amara-courses',
    'Voice to Sales, giọng nói bán hàng, bán là phục vụ, Thái Phương Anh',
    1490000, 0, 'VND', 'vi', 'voice-to-sales',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
),
(
    '28 Ngày Biết Ơn', 'AMARA-28-NGAY-BIET-ON', 'An trú nội tâm', 'AMARA Academy',
    'Thay đổi cách bạn nhìn cuộc sống trong 4 tuần.',
    '<h2>Nuôi dưỡng sự bình yên mỗi ngày</h2><p>Một hành trình thực hành biết ơn trong 28 ngày, giúp bạn chậm lại, quan sát điều đang có và xây dựng nhịp sống tích cực từ những bước nhỏ.</p><p><strong>Phù hợp với:</strong> người muốn chăm sóc nội tâm, ngủ ngon hơn và kết nối sâu hơn với bản thân cùng gia đình.</p><p><em>Giá hiển thị là giá demo, cần xác nhận trước khi bán chính thức.</em></p>',
    '/phuonganhamara.anhmedia.vn/images/28-ngay-biet-on-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/28-ngay-biet-on-v2.jpg',
    '/phuonganhamara.anhmedia.vn/images/28-ngay-biet-on-v2.jpg',
    'Tâm', 'amara-courses',
    '28 Ngày Biết Ơn, thực hành biết ơn, bình yên, Thái Phương Anh',
    690000, 0, 'VND', 'vi', '28-ngay-biet-on',
    NOW(), NOW(), NOW(), TRUE, TRUE, FALSE, TRUE
);

COMMIT;

-- Expected result after a successful run:
-- SELECT articlelink, articletemplate FROM public.articletb ORDER BY id;
-- SELECT productcode, productname, productpriceamount FROM public.producttb ORDER BY id;
