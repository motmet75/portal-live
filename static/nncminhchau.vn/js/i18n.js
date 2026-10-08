(function () {
  'use strict';

  var dictionaries = {
    vi: {
      'menu.home': 'TRANG CHỦ',
      'menu.products': 'SẢN PHẨM',
      'menu.videos': 'VIDEOS CLIP',
      'menu.marine': 'MÁY THỦY',
      'menu.about': 'GIỚI THIỆU',
      'menu.contact': 'LIÊN HỆ',
      'menu.login': 'ĐĂNG NHẬP',
      'search.allCategories': 'Tất cả danh mục',
      'search.productPlaceholder': 'Tìm kiếm sản phẩm...',
      'search.search': 'Tìm',
      'search.loading': 'Đang tìm kiếm...',
      'search.viewAllResults': 'Xem tất cả kết quả »',
      'products.title': 'Sản Phẩm',
      'products.allProducts': 'Tất cả sản phẩm',
      'products.filterResults': 'Lọc kết quả',
      'products.countSuffix': 'sản phẩm',
      'products.brand': 'Thương hiệu',
      'products.priceRange': 'Khoảng giá',
      'products.from': 'Từ',
      'products.to': 'Đến',
      'products.availablePrefix': 'Có sẵn:',
      'products.apply': 'Áp dụng',
      'products.clear': 'Xóa lọc',
      'products.attributePower': 'Công Suất',
      'products.unitHorsepower': 'Ngựa (HP/PS)',
      'about.title': 'Giới thiệu',
      'about.findUsOn': 'Tìm chúng tôi tại:',
      'contact.title': 'Liên hệ',
      'contact.companyName': 'CÔNG TY TNHH TM DV NÔNG NGƯ CƠ MINH CHÂU',
      'contact.contactAddress': 'Địa chỉ liên hệ: 690C Kinh Dương Vương, An Lạc, Bình Tân, Thành phố Hồ Chí Minh, Việt Nam',
      'contact.warehouseAddress': 'Địa chỉ kho: 688/2 Kinh Dương Vương, An Lạc, Bình Tân, Thành phố Hồ Chí Minh, Việt Nam',
      'contact.email': 'Email:',
      'contact.phone': 'Sdt:'
    },
    en: {
      'menu.home': 'HOME',
      'menu.products': 'PRODUCTS',
      'menu.videos': 'VIDEO CLIPS',
      'menu.marine': 'MARINE ENGINES',
      'menu.about': 'ABOUT',
      'menu.contact': 'CONTACT',
      'menu.login': 'LOGIN',
      'search.allCategories': 'All categories',
      'search.productPlaceholder': 'Search products...',
      'search.search': 'Search',
      'search.loading': 'Searching...',
      'search.viewAllResults': 'View all results »',
      'products.title': 'Products',
      'products.allProducts': 'All products',
      'products.filterResults': 'Filter results',
      'products.countSuffix': 'products',
      'products.brand': 'Brand',
      'products.priceRange': 'Price range',
      'products.from': 'From',
      'products.to': 'To',
      'products.availablePrefix': 'Available:',
      'products.apply': 'Apply',
      'products.clear': 'Clear filters',
      'products.attributePower': 'Power',
      'products.unitHorsepower': 'Horsepower (HP/PS)',
      'about.title': 'About Us',
      'about.findUsOn': 'Find us on:',
      'contact.title': 'Contact Us',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'Contact address: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': 'Warehouse address: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': 'Email:',
      'contact.phone': 'Phone:'
    },
    cn: {
      'menu.home': '首页',
      'menu.products': '产品',
      'menu.videos': '视频',
      'menu.marine': '船用发动机',
      'menu.about': '关于我们',
      'menu.contact': '联系我们',
      'menu.login': '登录',
      'search.allCategories': '所有分类',
      'search.productPlaceholder': '搜索产品...',
      'search.search': '搜索',
      'search.loading': '正在搜索...',
      'search.viewAllResults': '查看所有结果 »',
      'products.title': '产品',
      'products.allProducts': '所有产品',
      'products.filterResults': '筛选结果',
      'products.countSuffix': '个产品',
      'products.brand': '品牌',
      'products.priceRange': '价格范围',
      'products.from': '从',
      'products.to': '到',
      'products.availablePrefix': '可用:',
      'products.apply': '应用',
      'products.clear': '清除筛选',
      'products.attributePower': '功率',
      'products.unitHorsepower': '马力 (HP/PS)',
      'about.title': '关于我们',
      'about.findUsOn': '关注我们:',
      'contact.title': '联系我们',
      'contact.companyName': '明珠农渔机械贸易服务有限公司',
      'contact.contactAddress': '联系地址: 越南胡志明市平新郡安乐坊 Kinh Duong Vuong 路 690C',
      'contact.warehouseAddress': '仓库地址: 越南胡志明市平新郡安乐坊 Kinh Duong Vuong 路 688/2',
      'contact.email': '邮箱:',
      'contact.phone': '电话:'
    },
    ja: {
      'menu.home': 'ホーム',
      'menu.products': '製品',
      'menu.videos': '動画',
      'menu.marine': '船舶用エンジン',
      'menu.about': '会社紹介',
      'menu.contact': 'お問い合わせ',
      'menu.login': 'ログイン',
      'search.allCategories': 'すべてのカテゴリ',
      'search.productPlaceholder': '製品を検索...',
      'search.search': '検索',
      'search.loading': '検索中...',
      'search.viewAllResults': 'すべての結果を見る »',
      'products.title': '製品',
      'products.allProducts': 'すべての製品',
      'products.filterResults': '結果を絞り込む',
      'products.countSuffix': '製品',
      'products.brand': 'ブランド',
      'products.priceRange': '価格帯',
      'products.from': '最小',
      'products.to': '最大',
      'products.availablePrefix': '利用可能:',
      'products.apply': '適用',
      'products.clear': 'フィルターをクリア',
      'products.attributePower': '出力',
      'products.unitHorsepower': '馬力 (HP/PS)',
      'about.title': '会社紹介',
      'about.findUsOn': 'こちらでフォロー:',
      'contact.title': 'お問い合わせ',
      'contact.companyName': 'ミンチャウ農漁業機械貿易サービス有限会社',
      'contact.contactAddress': '連絡先住所: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': '倉庫住所: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': 'メール:',
      'contact.phone': '電話:'
    },
    ko: {
      'menu.home': '홈',
      'menu.products': '제품',
      'menu.videos': '동영상',
      'menu.marine': '선박 엔진',
      'menu.about': '회사 소개',
      'menu.contact': '문의',
      'menu.login': '로그인',
      'search.allCategories': '전체 카테고리',
      'search.productPlaceholder': '제품 검색...',
      'search.search': '검색',
      'search.loading': '검색 중...',
      'search.viewAllResults': '전체 결과 보기 »',
      'products.title': '제품',
      'products.allProducts': '전체 제품',
      'products.filterResults': '결과 필터',
      'products.countSuffix': '개 제품',
      'products.brand': '브랜드',
      'products.priceRange': '가격 범위',
      'products.from': '부터',
      'products.to': '까지',
      'products.availablePrefix': '사용 가능:',
      'products.apply': '적용',
      'products.clear': '필터 지우기',
      'products.attributePower': '출력',
      'products.unitHorsepower': '마력 (HP/PS)',
      'about.title': '회사 소개',
      'about.findUsOn': 'SNS에서 보기:',
      'contact.title': '문의',
      'contact.companyName': '민차우 농수산 기계 무역 서비스 유한회사',
      'contact.contactAddress': '연락처 주소: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': '창고 주소: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': '이메일:',
      'contact.phone': '전화:'
    },
    es: {
      'menu.home': 'INICIO',
      'menu.products': 'PRODUCTOS',
      'menu.videos': 'VIDEOS',
      'menu.marine': 'MOTORES MARINOS',
      'menu.about': 'NOSOTROS',
      'menu.contact': 'CONTACTO',
      'menu.login': 'INICIAR SESIÓN',
      'search.allCategories': 'Todas las categorías',
      'search.productPlaceholder': 'Buscar productos...',
      'search.search': 'Buscar',
      'search.loading': 'Buscando...',
      'search.viewAllResults': 'Ver todos los resultados »',
      'products.title': 'Productos',
      'products.allProducts': 'Todos los productos',
      'products.filterResults': 'Filtrar resultados',
      'products.countSuffix': 'productos',
      'products.brand': 'Marca',
      'products.priceRange': 'Rango de precio',
      'products.from': 'Desde',
      'products.to': 'Hasta',
      'products.availablePrefix': 'Disponible:',
      'products.apply': 'Aplicar',
      'products.clear': 'Borrar filtros',
      'products.attributePower': 'Potencia',
      'products.unitHorsepower': 'Caballos de fuerza (HP/PS)',
      'about.title': 'Sobre nosotros',
      'about.findUsOn': 'Encuéntrenos en:',
      'contact.title': 'Contacto',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'Dirección de contacto: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ciudad Ho Chi Minh, Vietnam',
      'contact.warehouseAddress': 'Dirección del almacén: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ciudad Ho Chi Minh, Vietnam',
      'contact.email': 'Email:',
      'contact.phone': 'Teléfono:'
    },
    dv: {
      'menu.home': 'މައި ޞަފްޙާ',
      'menu.products': 'މަސްނޫޢުތައް',
      'menu.videos': 'ވީޑިއޯ',
      'menu.marine': 'މެރިން އެންޖިން',
      'menu.about': 'އަހަރެންމެންގެ ބާރޭ',
      'menu.contact': 'ގުޅުއްވުން',
      'menu.login': 'ލޮގިން',
      'search.allCategories': 'ހުރިހާ ކެޓަގަރީ',
      'search.productPlaceholder': 'މަސްނޫޢު ހޯދާ...',
      'search.search': 'ހޯދާ',
      'search.loading': 'ހޯދަނީ...',
      'search.viewAllResults': 'ހުރިހާ ނަތީޖާ ބަލާ »',
      'products.title': 'މަސްނޫޢުތައް',
      'products.allProducts': 'ހުރިހާ މަސްނޫޢު',
      'products.filterResults': 'ނަތީޖާ ފިލްޓަރ',
      'products.countSuffix': 'މަސްނޫޢު',
      'products.brand': 'ބްރޭންޑް',
      'products.priceRange': 'އަގުގެ ރޭންޖް',
      'products.from': 'ފެށިގެން',
      'products.to': 'އަށް',
      'products.availablePrefix': 'ލިބެން ހުރި:',
      'products.apply': 'ތަންފީޒު',
      'products.clear': 'ފިލްޓަރ ފުހެލާ',
      'products.attributePower': 'ޕަވަރ',
      'products.unitHorsepower': 'ހޯސްޕަވަރ (HP/PS)',
      'about.title': 'އަހަރެންމެންގެ ބާރޭ',
      'about.findUsOn': 'އަހަރެންމެން ހޯދާ:',
      'contact.title': 'ގުޅުއްވުން',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'ގުޅޭ އެޑްރެސް: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': 'ގުދަން އެޑްރެސް: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': 'އީމެއިލް:',
      'contact.phone': 'ފޯން:'
    },
    ms: {
      'menu.home': 'LAMAN UTAMA',
      'menu.products': 'PRODUK',
      'menu.videos': 'VIDEO',
      'menu.marine': 'ENJIN MARIN',
      'menu.about': 'TENTANG KAMI',
      'menu.contact': 'HUBUNGI',
      'menu.login': 'LOG MASUK',
      'search.allCategories': 'Semua kategori',
      'search.productPlaceholder': 'Cari produk...',
      'search.search': 'Cari',
      'search.loading': 'Mencari...',
      'search.viewAllResults': 'Lihat semua hasil »',
      'products.title': 'Produk',
      'products.allProducts': 'Semua produk',
      'products.filterResults': 'Tapis hasil',
      'products.countSuffix': 'produk',
      'products.brand': 'Jenama',
      'products.priceRange': 'Julat harga',
      'products.from': 'Dari',
      'products.to': 'Hingga',
      'products.availablePrefix': 'Tersedia:',
      'products.apply': 'Guna',
      'products.clear': 'Kosongkan penapis',
      'products.attributePower': 'Kuasa',
      'products.unitHorsepower': 'Kuasa kuda (HP/PS)',
      'about.title': 'Tentang Kami',
      'about.findUsOn': 'Ikuti kami di:',
      'contact.title': 'Hubungi Kami',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'Alamat hubungan: 690C Kinh Duong Vuong, An Lac, Binh Tan, Bandar Ho Chi Minh, Vietnam',
      'contact.warehouseAddress': 'Alamat gudang: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Bandar Ho Chi Minh, Vietnam',
      'contact.email': 'E-mel:',
      'contact.phone': 'Telefon:'
    },
    id: {
      'menu.home': 'BERANDA',
      'menu.products': 'PRODUK',
      'menu.videos': 'VIDEO',
      'menu.marine': 'MESIN KAPAL',
      'menu.about': 'TENTANG KAMI',
      'menu.contact': 'KONTAK',
      'menu.login': 'MASUK',
      'search.allCategories': 'Semua kategori',
      'search.productPlaceholder': 'Cari produk...',
      'search.search': 'Cari',
      'search.loading': 'Mencari...',
      'search.viewAllResults': 'Lihat semua hasil »',
      'products.title': 'Produk',
      'products.allProducts': 'Semua produk',
      'products.filterResults': 'Filter hasil',
      'products.countSuffix': 'produk',
      'products.brand': 'Merek',
      'products.priceRange': 'Rentang harga',
      'products.from': 'Dari',
      'products.to': 'Sampai',
      'products.availablePrefix': 'Tersedia:',
      'products.apply': 'Terapkan',
      'products.clear': 'Hapus filter',
      'products.attributePower': 'Daya',
      'products.unitHorsepower': 'Tenaga kuda (HP/PS)',
      'about.title': 'Tentang Kami',
      'about.findUsOn': 'Temukan kami di:',
      'contact.title': 'Kontak',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'Alamat kontak: 690C Kinh Duong Vuong, An Lac, Binh Tan, Kota Ho Chi Minh, Vietnam',
      'contact.warehouseAddress': 'Alamat gudang: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Kota Ho Chi Minh, Vietnam',
      'contact.email': 'Email:',
      'contact.phone': 'Telepon:'
    },
    ar: {
      'menu.home': 'الرئيسية',
      'menu.products': 'المنتجات',
      'menu.videos': 'الفيديوهات',
      'menu.marine': 'محركات بحرية',
      'menu.about': 'من نحن',
      'menu.contact': 'اتصل بنا',
      'menu.login': 'تسجيل الدخول',
      'search.allCategories': 'كل الفئات',
      'search.productPlaceholder': 'ابحث عن المنتجات...',
      'search.search': 'بحث',
      'search.loading': 'جار البحث...',
      'search.viewAllResults': 'عرض كل النتائج »',
      'products.title': 'المنتجات',
      'products.allProducts': 'كل المنتجات',
      'products.filterResults': 'تصفية النتائج',
      'products.countSuffix': 'منتجات',
      'products.brand': 'العلامة التجارية',
      'products.priceRange': 'نطاق السعر',
      'products.from': 'من',
      'products.to': 'إلى',
      'products.availablePrefix': 'المتاح:',
      'products.apply': 'تطبيق',
      'products.clear': 'مسح الفلاتر',
      'products.attributePower': 'القدرة',
      'products.unitHorsepower': 'حصان (HP/PS)',
      'about.title': 'من نحن',
      'about.findUsOn': 'تابعنا على:',
      'contact.title': 'اتصل بنا',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'عنوان الاتصال: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': 'عنوان المستودع: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': 'البريد الإلكتروني:',
      'contact.phone': 'الهاتف:'
    },
    fr: {
      'menu.home': 'ACCUEIL',
      'menu.products': 'PRODUITS',
      'menu.videos': 'VIDÉOS',
      'menu.marine': 'MOTEURS MARINS',
      'menu.about': 'À PROPOS',
      'menu.contact': 'CONTACT',
      'menu.login': 'CONNEXION',
      'search.allCategories': 'Toutes les catégories',
      'search.productPlaceholder': 'Rechercher des produits...',
      'search.search': 'Rechercher',
      'search.loading': 'Recherche...',
      'search.viewAllResults': 'Voir tous les résultats »',
      'products.title': 'Produits',
      'products.allProducts': 'Tous les produits',
      'products.filterResults': 'Filtrer les résultats',
      'products.countSuffix': 'produits',
      'products.brand': 'Marque',
      'products.priceRange': 'Fourchette de prix',
      'products.from': 'De',
      'products.to': 'À',
      'products.availablePrefix': 'Disponible:',
      'products.apply': 'Appliquer',
      'products.clear': 'Effacer les filtres',
      'products.attributePower': 'Puissance',
      'products.unitHorsepower': 'Chevaux (HP/PS)',
      'about.title': 'À propos',
      'about.findUsOn': 'Retrouvez-nous sur:',
      'contact.title': 'Contact',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': 'Adresse de contact: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh-Ville, Vietnam',
      'contact.warehouseAddress': 'Adresse de l’entrepôt: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh-Ville, Vietnam',
      'contact.email': 'Email:',
      'contact.phone': 'Téléphone:'
    },
    ur: {
      'menu.home': '\u0635\u0641\u062d\u06c1 \u0627\u0648\u0644',
      'menu.products': '\u0645\u0635\u0646\u0648\u0639\u0627\u062a',
      'menu.videos': '\u0648\u06cc\u0688\u06cc\u0648\u0632',
      'menu.marine': '\u0645\u06cc\u0631\u06cc\u0646 \u0627\u0646\u062c\u0646',
      'menu.about': '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba',
      'menu.contact': '\u0631\u0627\u0628\u0637\u06c1',
      'menu.login': '\u0644\u0627\u06af \u0627\u0646',
      'search.allCategories': '\u062a\u0645\u0627\u0645 \u0632\u0645\u0631\u06d2',
      'search.productPlaceholder': '\u0645\u0635\u0646\u0648\u0639\u0627\u062a \u062a\u0644\u0627\u0634 \u06a9\u0631\u06cc\u06ba...',
      'search.search': '\u062a\u0644\u0627\u0634',
      'search.loading': '\u062a\u0644\u0627\u0634 \u062c\u0627\u0631\u06cc \u06c1\u06d2...',
      'search.viewAllResults': '\u062a\u0645\u0627\u0645 \u0646\u062a\u0627\u0626\u062c \u062f\u06cc\u06a9\u06be\u06cc\u06ba \u00bb',
      'products.title': '\u0645\u0635\u0646\u0648\u0639\u0627\u062a',
      'products.allProducts': '\u062a\u0645\u0627\u0645 \u0645\u0635\u0646\u0648\u0639\u0627\u062a',
      'products.filterResults': '\u0646\u062a\u0627\u0626\u062c \u0641\u0644\u0679\u0631 \u06a9\u0631\u06cc\u06ba',
      'products.countSuffix': '\u0645\u0635\u0646\u0648\u0639\u0627\u062a',
      'products.brand': '\u0628\u0631\u0627\u0646\u0688',
      'products.priceRange': '\u0642\u06cc\u0645\u062a \u06a9\u06cc \u062d\u062f',
      'products.from': '\u0633\u06d2',
      'products.to': '\u062a\u06a9',
      'products.availablePrefix': '\u062f\u0633\u062a\u06cc\u0627\u0628:',
      'products.apply': '\u0644\u0627\u06af\u0648 \u06a9\u0631\u06cc\u06ba',
      'products.clear': '\u0641\u0644\u0679\u0631 \u0635\u0627\u0641 \u06a9\u0631\u06cc\u06ba',
      'products.attributePower': '\u0637\u0627\u0642\u062a',
      'products.unitHorsepower': '\u06c1\u0627\u0631\u0633 \u067e\u0627\u0648\u0631 (HP/PS)',
      'about.title': '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba',
      'about.findUsOn': '\u06c1\u0645\u06cc\u06ba \u06cc\u06c1\u0627\u06ba \u062a\u0644\u0627\u0634 \u06a9\u0631\u06cc\u06ba:',
      'contact.title': '\u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba',
      'contact.companyName': 'MINH CHAU AGRICULTURAL AND FISHERY MACHINERY TRADING SERVICE CO., LTD',
      'contact.contactAddress': '\u0631\u0627\u0628\u0637\u06c1 \u06a9\u0627 \u067e\u062a\u06c1: 690C Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.warehouseAddress': '\u06af\u0648\u062f\u0627\u0645 \u06a9\u0627 \u067e\u062a\u06c1: 688/2 Kinh Duong Vuong, An Lac, Binh Tan, Ho Chi Minh City, Vietnam',
      'contact.email': '\u0627\u06cc \u0645\u06cc\u0644:',
      'contact.phone': '\u0641\u0648\u0646:'
    }
  };

  function normalizeLang(lang) {
    var value = (lang || '').toString().trim().toLowerCase().replace('_', '-');
    var primary = value.split('-')[0];
    if (primary === 'zh') return 'cn';
    if (primary === 'kr') return 'ko';
    if (primary === 'in') return 'id';
    if (primary === 'pk') return 'ur';
    return dictionaries[primary] ? primary : 'en';
  }

  var currentLang = normalizeLang(
    window.NNC_SELECTED_LANGUAGE ||
    document.documentElement.getAttribute('lang') ||
    document.body && document.body.getAttribute('data-lang')
  );
  var currentDictionary = dictionaries[currentLang] || dictionaries.en;

  function translate(key) {
    return currentDictionary[key] || dictionaries.en[key] || dictionaries.vi[key] || key;
  }

  function normalizeText(text) {
    return (text || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function applyDynamicProductCount(element) {
    var text = element.textContent || '';
    var pair = text.match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
    if (pair) {
      element.textContent = pair[1] + ' / ' + pair[2] + ' ' + translate('products.countSuffix');
      return;
    }
    var single = text.match(/([\d.,]+)/);
    if (single) {
      element.textContent = single[1] + ' ' + translate('products.countSuffix');
    }
  }

  function applyAvailableRange(element) {
    var text = element.textContent || '';
    var range = text.match(/([\d.,-]+)\s*-\s*([\d.,-]+)/);
    if (range) {
      element.textContent = translate('products.availablePrefix') + ' ' + range[1] + ' - ' + range[2];
      return;
    }
    element.textContent = translate('products.availablePrefix');
  }

  function applyKnownRangeName(element) {
    var normalized = normalizeText(element.textContent);
    if (normalized.indexOf('cong suat') !== -1 || normalized.indexOf('power') !== -1) {
      element.textContent = translate('products.attributePower');
    }
  }

  function applyKnownRangeUnit(element) {
    var normalized = normalizeText(element.textContent);
    if (normalized.indexOf('hp/ps') !== -1 || normalized.indexOf('ngua') !== -1 || normalized.indexOf('horse') !== -1) {
      element.textContent = ' (' + translate('products.unitHorsepower') + ')';
    }
  }

  function apply(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = translate(element.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
      element.setAttribute('placeholder', translate(element.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(function (element) {
      element.setAttribute('title', translate(element.getAttribute('data-i18n-title')));
    });
    scope.querySelectorAll('[data-i18n-product-count]').forEach(applyDynamicProductCount);
    scope.querySelectorAll('[data-i18n-available-range]').forEach(applyAvailableRange);
    scope.querySelectorAll('[data-i18n-range-name]').forEach(applyKnownRangeName);
    scope.querySelectorAll('[data-i18n-range-unit]').forEach(applyKnownRangeUnit);
  }

  window.NNC_I18N = {
    lang: currentLang,
    t: translate,
    apply: apply
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply(document);
    });
  } else {
    apply(document);
  }
}());
