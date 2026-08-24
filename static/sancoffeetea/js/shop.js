(function () {
  'use strict';

  var status = document.getElementById('san-menu-status');
  var grid = document.getElementById('san-menu-grid');
  var searchInput = document.getElementById('san-menu-search');
  var categoryList = document.getElementById('san-category-list');
  var menuCount = document.getElementById('san-menu-count');
  var supportedLanguages = ['vi', 'en', 'cn', 'tw', 'ja', 'ko', 'th', 'es', 'ms', 'id', 'dv'];
  var orderLabels = {
    vi: 'Đặt món',
    en: 'Order',
    cn: '下单',
    tw: '點餐',
    ja: '注文',
    ko: '주문',
    th: 'สั่ง',
    es: 'Pedir',
    ms: 'Pesan',
    id: 'Pesan',
    dv: 'Order'
  };
  var menuLabels = {
    vi: 'Thực đơn',
    en: 'Menu',
    cn: '菜单',
    tw: '菜單',
    ja: 'メニュー',
    ko: '메뉴',
    th: 'เมนู',
    es: 'Menú',
    ms: 'Menu',
    id: 'Menu',
    dv: 'Menu'
  };
  var menuSearchText = {
    vi: { label: 'Tìm món', placeholder: 'Nhập tên món hoặc danh mục', all: 'Tất cả', itemUnit: 'món', noMatch: 'Không tìm thấy món phù hợp.', empty: 'Cửa hàng chưa có món đang bán.' },
    en: { label: 'Search items', placeholder: 'Enter item name or category', all: 'All', itemUnit: 'items', noMatch: 'No matching items found.', empty: 'The shop has no active items.' },
    cn: { label: '搜索菜品', placeholder: '输入菜品名称或分类', all: '全部', itemUnit: '项', noMatch: '未找到匹配菜品。', empty: '店铺暂无在售菜品。' },
    tw: { label: '搜尋餐點', placeholder: '輸入餐點名稱或分類', all: '全部', itemUnit: '項', noMatch: '找不到符合的餐點。', empty: '店鋪目前沒有販售餐點。' },
    ja: { label: 'メニュー検索', placeholder: '商品名またはカテゴリを入力', all: 'すべて', itemUnit: '品', noMatch: '一致する商品がありません。', empty: '販売中の商品がありません。' },
    ko: { label: '메뉴 검색', placeholder: '메뉴 이름 또는 카테고리 입력', all: '전체', itemUnit: '개', noMatch: '일치하는 메뉴가 없습니다.', empty: '판매 중인 메뉴가 없습니다.' },
    th: { label: 'ค้นหาเมนู', placeholder: 'ใส่ชื่อเมนูหรือหมวดหมู่', all: 'ทั้งหมด', itemUnit: 'รายการ', noMatch: 'ไม่พบเมนูที่ตรงกัน', empty: 'ร้านยังไม่มีเมนูที่ขายอยู่' },
    es: { label: 'Buscar productos', placeholder: 'Ingresa nombre o categoría', all: 'Todo', itemUnit: 'productos', noMatch: 'No se encontraron productos.', empty: 'La tienda no tiene productos activos.' },
    ms: { label: 'Cari item', placeholder: 'Masukkan nama item atau kategori', all: 'Semua', itemUnit: 'item', noMatch: 'Tiada item yang sepadan.', empty: 'Kedai belum mempunyai item aktif.' },
    id: { label: 'Cari item', placeholder: 'Masukkan nama item atau kategori', all: 'Semua', itemUnit: 'item', noMatch: 'Tidak ada item yang cocok.', empty: 'Toko belum memiliki item aktif.' },
    dv: { label: 'އައިޓަމް ހޯދާ', placeholder: 'އައިޓަމް ނަން ނުވަތަ ކެޓަގަރީ ލިޔޭ', all: 'ހުރިހާ', itemUnit: 'އައިޓަމް', noMatch: 'ގުޅޭ އައިޓަމް ނުފެނުނު.', empty: 'ފިހާރައަށް އެކްޓިވް އައިޓަމް ނެތް.' }
  };
  var groupOrderLabels = {
    vi: 'Đặt nhóm',
    en: 'Group order',
    cn: '团体点餐',
    tw: '團體點餐',
    ja: 'グループ注文',
    ko: '단체 주문',
    th: 'สั่งแบบกลุ่ม',
    es: 'Pedido grupal',
    ms: 'Pesanan kumpulan',
    id: 'Pesanan grup',
    dv: 'ގްރޫޕް އޯޑަރ'
  };
  var groupOrderText = {
    vi: {
      title: 'Đặt nhóm',
      subtitle: 'Xác nhận thông tin để kích hoạt phiếu.',
      orderLimit: 'Số đơn trên phiếu',
      orderLimitHelp: 'Tối đa 99 đơn.',
      name: 'Tên người tạo',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      cancel: 'Hủy',
      generate: 'Tạo phiếu QR',
      close: 'Đóng',
      download: 'Tải phiếu',
      share: 'Chia sẻ',
      openSlip: 'Mở link đặt món',
      slipNumber: 'Số phiếu',
      orderLimitResult: 'Giới hạn đơn',
      expiresAt: 'Hiệu lực đến',
      required: 'Vui lòng nhập tên, điện thoại, địa chỉ và số đơn.',
      invalidLimit: 'Số đơn phải từ 1 đến 99.',
      loadingConfig: 'Đang tải cấu hình cửa hàng, thử lại sau vài giây.',
      generating: 'Đang tạo phiếu QR...',
      ready: 'Phiếu QR đã sẵn sàng.',
      copied: 'Đã sao chép link.',
      copyFailed: 'Không thể chia sẻ tự động. Vui lòng tải phiếu.',
      endpointError: 'Không tạo được phiếu QR.',
      shareTitle: 'Phiếu đặt nhóm SAN',
      shareText: 'Quét QR để đặt chung phiếu {slip}.'
    },
    en: {
      title: 'Group order',
      subtitle: 'Confirm details before activating the slip.',
      orderLimit: 'Orders on slip',
      orderLimitHelp: 'Maximum 99 orders.',
      name: 'Organizer name',
      phone: 'Phone number',
      address: 'Address',
      cancel: 'Cancel',
      generate: 'Generate QR slip',
      close: 'Close',
      download: 'Download slip',
      share: 'Share',
      openSlip: 'Open order link',
      slipNumber: 'Slip number',
      orderLimitResult: 'Order limit',
      expiresAt: 'Valid until',
      required: 'Enter name, phone, address, and number of orders.',
      invalidLimit: 'Orders must be from 1 to 99.',
      loadingConfig: 'Shop configuration is loading. Try again in a few seconds.',
      generating: 'Generating QR slip...',
      ready: 'QR slip is ready.',
      copied: 'Link copied.',
      copyFailed: 'Automatic sharing failed. Please download the slip.',
      endpointError: 'Could not create QR slip.',
      shareTitle: 'SAN group order slip',
      shareText: 'Scan the QR to join slip {slip}.'
    },
    cn: {
      title: '团体点餐',
      subtitle: '确认信息后激活单据。',
      orderLimit: '单据订单数',
      orderLimitHelp: '最多 99 单。',
      name: '发起人姓名',
      phone: '电话号码',
      address: '地址',
      cancel: '取消',
      generate: '生成二维码单',
      close: '关闭',
      download: '下载单据',
      share: '分享',
      openSlip: '打开点餐链接',
      slipNumber: '单号',
      orderLimitResult: '订单上限',
      expiresAt: '有效至',
      required: '请输入姓名、电话、地址和订单数。',
      invalidLimit: '订单数必须为 1 到 99。',
      loadingConfig: '店铺配置正在加载，请稍后再试。',
      generating: '正在生成二维码单...',
      ready: '二维码单已准备好。',
      copied: '链接已复制。',
      copyFailed: '无法自动分享。请下载单据。',
      endpointError: '无法创建二维码单。',
      shareTitle: 'SAN 团体点餐单',
      shareText: '扫描二维码加入单据 {slip}。'
    },
    tw: {
      title: '團體點餐',
      subtitle: '確認資訊後啟用單據。',
      orderLimit: '單據訂單數',
      orderLimitHelp: '最多 99 單。',
      name: '發起人姓名',
      phone: '電話號碼',
      address: '地址',
      cancel: '取消',
      generate: '產生 QR 單',
      close: '關閉',
      download: '下載單據',
      share: '分享',
      openSlip: '開啟點餐連結',
      slipNumber: '單號',
      orderLimitResult: '訂單上限',
      expiresAt: '有效至',
      required: '請輸入姓名、電話、地址和訂單數。',
      invalidLimit: '訂單數必須為 1 到 99。',
      loadingConfig: '店鋪設定載入中，請稍後再試。',
      generating: '正在產生 QR 單...',
      ready: 'QR 單已準備好。',
      copied: '連結已複製。',
      copyFailed: '無法自動分享。請下載單據。',
      endpointError: '無法建立 QR 單。',
      shareTitle: 'SAN 團體點餐單',
      shareText: '掃描 QR 加入單據 {slip}。'
    },
    ja: {
      title: 'グループ注文',
      subtitle: '内容を確認して伝票を有効化します。',
      orderLimit: '伝票の注文数',
      orderLimitHelp: '最大 99 件。',
      name: '作成者名',
      phone: '電話番号',
      address: '住所',
      cancel: 'キャンセル',
      generate: 'QR伝票を作成',
      close: '閉じる',
      download: '伝票を保存',
      share: '共有',
      openSlip: '注文リンクを開く',
      slipNumber: '伝票番号',
      orderLimitResult: '注文上限',
      expiresAt: '有効期限',
      required: '名前、電話、住所、注文数を入力してください。',
      invalidLimit: '注文数は 1 から 99 です。',
      loadingConfig: '店舗設定を読み込み中です。数秒後に再試行してください。',
      generating: 'QR伝票を作成中...',
      ready: 'QR伝票の準備ができました。',
      copied: 'リンクをコピーしました。',
      copyFailed: '自動共有できません。伝票を保存してください。',
      endpointError: 'QR伝票を作成できません。',
      shareTitle: 'SAN グループ注文伝票',
      shareText: 'QRを読み取り、伝票 {slip} に参加してください。'
    },
    ko: {
      title: '단체 주문',
      subtitle: '정보를 확인한 뒤 전표를 활성화합니다.',
      orderLimit: '전표 주문 수',
      orderLimitHelp: '최대 99건.',
      name: '생성자 이름',
      phone: '전화번호',
      address: '주소',
      cancel: '취소',
      generate: 'QR 전표 생성',
      close: '닫기',
      download: '전표 다운로드',
      share: '공유',
      openSlip: '주문 링크 열기',
      slipNumber: '전표 번호',
      orderLimitResult: '주문 한도',
      expiresAt: '유효 기간',
      required: '이름, 전화번호, 주소, 주문 수를 입력하세요.',
      invalidLimit: '주문 수는 1에서 99 사이여야 합니다.',
      loadingConfig: '매장 설정을 불러오는 중입니다. 잠시 후 다시 시도하세요.',
      generating: 'QR 전표 생성 중...',
      ready: 'QR 전표가 준비되었습니다.',
      copied: '링크가 복사되었습니다.',
      copyFailed: '자동 공유에 실패했습니다. 전표를 다운로드하세요.',
      endpointError: 'QR 전표를 만들 수 없습니다.',
      shareTitle: 'SAN 단체 주문 전표',
      shareText: 'QR을 스캔해 전표 {slip} 에 참여하세요.'
    },
    th: {
      title: 'สั่งแบบกลุ่ม',
      subtitle: 'ยืนยันข้อมูลก่อนเปิดใช้สลิป',
      orderLimit: 'จำนวนออร์เดอร์บนสลิป',
      orderLimitHelp: 'สูงสุด 99 ออร์เดอร์',
      name: 'ชื่อผู้สร้าง',
      phone: 'เบอร์โทร',
      address: 'ที่อยู่',
      cancel: 'ยกเลิก',
      generate: 'สร้างสลิป QR',
      close: 'ปิด',
      download: 'ดาวน์โหลดสลิป',
      share: 'แชร์',
      openSlip: 'เปิดลิงก์สั่ง',
      slipNumber: 'เลขสลิป',
      orderLimitResult: 'จำกัดออร์เดอร์',
      expiresAt: 'ใช้ได้ถึง',
      required: 'กรอกชื่อ เบอร์โทร ที่อยู่ และจำนวนออร์เดอร์',
      invalidLimit: 'จำนวนออร์เดอร์ต้องอยู่ระหว่าง 1 ถึง 99',
      loadingConfig: 'กำลังโหลดการตั้งค่าร้าน โปรดลองอีกครั้งในไม่กี่วินาที',
      generating: 'กำลังสร้างสลิป QR...',
      ready: 'สลิป QR พร้อมแล้ว',
      copied: 'คัดลอกลิงก์แล้ว',
      copyFailed: 'แชร์อัตโนมัติไม่ได้ กรุณาดาวน์โหลดสลิป',
      endpointError: 'ไม่สามารถสร้างสลิป QR ได้',
      shareTitle: 'สลิปสั่งแบบกลุ่ม SAN',
      shareText: 'สแกน QR เพื่อเข้าร่วมสลิป {slip}'
    },
    es: {
      title: 'Pedido grupal',
      subtitle: 'Confirma los datos antes de activar el comprobante.',
      orderLimit: 'Pedidos en el comprobante',
      orderLimitHelp: 'Máximo 99 pedidos.',
      name: 'Nombre del organizador',
      phone: 'Teléfono',
      address: 'Dirección',
      cancel: 'Cancelar',
      generate: 'Generar QR',
      close: 'Cerrar',
      download: 'Descargar comprobante',
      share: 'Compartir',
      openSlip: 'Abrir enlace de pedido',
      slipNumber: 'Número de comprobante',
      orderLimitResult: 'Límite de pedidos',
      expiresAt: 'Válido hasta',
      required: 'Ingresa nombre, teléfono, dirección y cantidad de pedidos.',
      invalidLimit: 'Los pedidos deben estar entre 1 y 99.',
      loadingConfig: 'La configuración de la tienda está cargando. Inténtalo en unos segundos.',
      generating: 'Generando comprobante QR...',
      ready: 'El comprobante QR está listo.',
      copied: 'Enlace copiado.',
      copyFailed: 'No se pudo compartir automáticamente. Descarga el comprobante.',
      endpointError: 'No se pudo crear el comprobante QR.',
      shareTitle: 'Comprobante de pedido grupal SAN',
      shareText: 'Escanea el QR para unirte al comprobante {slip}.'
    },
    ms: {
      title: 'Pesanan kumpulan',
      subtitle: 'Sahkan butiran sebelum mengaktifkan slip.',
      orderLimit: 'Pesanan pada slip',
      orderLimitHelp: 'Maksimum 99 pesanan.',
      name: 'Nama penganjur',
      phone: 'Nombor telefon',
      address: 'Alamat',
      cancel: 'Batal',
      generate: 'Jana slip QR',
      close: 'Tutup',
      download: 'Muat turun slip',
      share: 'Kongsi',
      openSlip: 'Buka pautan pesanan',
      slipNumber: 'Nombor slip',
      orderLimitResult: 'Had pesanan',
      expiresAt: 'Sah hingga',
      required: 'Masukkan nama, telefon, alamat dan jumlah pesanan.',
      invalidLimit: 'Pesanan mesti antara 1 hingga 99.',
      loadingConfig: 'Konfigurasi kedai sedang dimuatkan. Cuba lagi sebentar lagi.',
      generating: 'Menjana slip QR...',
      ready: 'Slip QR sudah sedia.',
      copied: 'Pautan disalin.',
      copyFailed: 'Perkongsian automatik gagal. Sila muat turun slip.',
      endpointError: 'Tidak dapat mencipta slip QR.',
      shareTitle: 'Slip pesanan kumpulan SAN',
      shareText: 'Imbas QR untuk sertai slip {slip}.'
    },
    id: {
      title: 'Pesanan grup',
      subtitle: 'Konfirmasi detail sebelum slip aktif.',
      orderLimit: 'Pesanan pada slip',
      orderLimitHelp: 'Maksimal 99 pesanan.',
      name: 'Nama pembuat',
      phone: 'Nomor telepon',
      address: 'Alamat',
      cancel: 'Batal',
      generate: 'Buat slip QR',
      close: 'Tutup',
      download: 'Unduh slip',
      share: 'Bagikan',
      openSlip: 'Buka tautan pesanan',
      slipNumber: 'Nomor slip',
      orderLimitResult: 'Batas pesanan',
      expiresAt: 'Berlaku sampai',
      required: 'Masukkan nama, telepon, alamat, dan jumlah pesanan.',
      invalidLimit: 'Jumlah pesanan harus 1 sampai 99.',
      loadingConfig: 'Konfigurasi toko sedang dimuat. Coba lagi beberapa detik lagi.',
      generating: 'Membuat slip QR...',
      ready: 'Slip QR siap.',
      copied: 'Tautan disalin.',
      copyFailed: 'Berbagi otomatis gagal. Silakan unduh slip.',
      endpointError: 'Tidak dapat membuat slip QR.',
      shareTitle: 'Slip pesanan grup SAN',
      shareText: 'Pindai QR untuk bergabung ke slip {slip}.'
    },
    dv: {
      title: 'ގްރޫޕް އޯޑަރ',
      subtitle: 'ސްލިޕް އެކްޓިވް ކުރަން ކުރިން މަޢުލޫމާތު ޔަގީން ކުރޭ.',
      orderLimit: 'ސްލިޕްގައި އޯޑަރު',
      orderLimitHelp: 'މެކްސިމަމް 99 އޯޑަރު.',
      name: 'ހެދި މީހާގެ ނަން',
      phone: 'ފޯން ނަންބަރު',
      address: 'އެޑްރެސް',
      cancel: 'ކެންސަލް',
      generate: 'QR ސްލިޕް ހަދާ',
      close: 'ބަންދު',
      download: 'ސްލިޕް ޑައުންލޯޑް',
      share: 'ޝެއަރ',
      openSlip: 'އޯޑަރ ލިންކް ހުޅުވާ',
      slipNumber: 'ސްލިޕް ނަންބަރު',
      orderLimitResult: 'އޯޑަރ ހައްދު',
      expiresAt: 'މުއްދަތު',
      required: 'ނަން، ފޯން، އެޑްރެސް، އަދި އޯޑަރު އަދަދު ލިޔޭ.',
      invalidLimit: 'އޯޑަރު 1 އިން 99 އަށް.',
      loadingConfig: 'ފިހާރަ ކޮންފިގް ލޯޑް ވަނީ. ކުޑަކޮށް ފަހުން ކުރޭ.',
      generating: 'QR ސްލިޕް ހަދަނީ...',
      ready: 'QR ސްލިޕް ތައްޔާރު.',
      copied: 'ލިންކް ކޮޕީ ކުރެވިއްޖެ.',
      copyFailed: 'އޮޓޯ ޝެއަރ ނުކުރެވުނު. ސްލިޕް ޑައުންލޯޑް ކުރޭ.',
      endpointError: 'QR ސްލިޕް ނުހެދުނު.',
      shareTitle: 'SAN ގްރޫޕް އޯޑަރ ސްލިޕް',
      shareText: 'QR ސްކޭން ކޮށް ސްލިޕް {slip} އަށް ވަދޭ.'
    }
  };
  var state = {
    lang: initialLanguage(),
    config: null,
    rows: [],
    search: '',
    category: ''
  };
  var groupModal = null;
  var groupFields = {};
  var groupSlipState = null;
  var shopServiceOrigin = 'https://anhmedia.vn';
  var shopServiceBase = shopServiceOrigin + '/bom-inventory';

  function normalizeLanguage(value) {
    var code = String(value || '').trim().toLowerCase().replace(/_/g, '-');
    if (code === 'zh' || code === 'zh-cn' || code.indexOf('zh-hans') === 0) return 'cn';
    if (code === 'zh-tw' || code === 'zh-hant' || code.indexOf('zh-hant') === 0) return 'tw';
    if (code === 'thai' || code === 'thailand') return 'th';
    code = code.split('-')[0];
    return supportedLanguages.indexOf(code) >= 0 ? code : '';
  }

  function initialLanguage() {
    var fromUrl = '';
    try { fromUrl = normalizeLanguage(new URLSearchParams(window.location.search).get('lang')); } catch (ignored) {}
    if (fromUrl) return fromUrl;
    var stored = '';
    try { stored = normalizeLanguage(localStorage.getItem('san_shop_language')); } catch (ignored) {}
    return stored || 'vi';
  }

  function join(base, path) {
    return String(base || '').replace(/\/+$/, '') + path;
  }

  function cleanBase(value) {
    var base = String(value || '').trim() || shopServiceBase;
    try {
      var url = new URL(base, shopServiceOrigin);
      url.hash = '';
      url.search = '';
      if (/^(?:.+\.)?anhmedia\.vn$/i.test(url.hostname)) {
        url.protocol = 'https:';
        url.hostname = 'anhmedia.vn';
        url.port = '';
      }
      if (!/^\/bom-inventory(?:\/|$)/i.test(url.pathname)) {
        url.pathname = '/bom-inventory' + (url.pathname === '/' ? '' : url.pathname.replace(/^\/+/, '/'));
      }
      return url.href.replace(/\/+$/, '');
    } catch (ignored) {
      return shopServiceBase;
    }
  }

  function menuBaseUrl() {
    var base = cleanBase(state.config && state.config.demoBaseUrl);
    if (/\/shop\/menu\/?$/i.test(base)) return base.replace(/\/+$/, '');
    if (/\/bom-inventory\/?$/i.test(base)) return join(base, '/shop/menu');
    return join(base, '/shop/menu');
  }

  function demoOrigin() {
    try { return new URL(cleanBase(state.config && state.config.demoBaseUrl), window.location.origin).origin; } catch (ignored) {}
    return 'https://anhmedia.vn';
  }

  function orderUrl(searchName) {
    var cfg = state.config || {};
    var params = new URLSearchParams();
    if (cfg.tenantId) params.set('tenantId', cfg.tenantId);
    if (cfg.companyId) params.set('companyId', cfg.companyId);
    params.set('lang', state.lang);
    if (searchName) {
      params.set('search', searchName);
      params.set('q', searchName);
      params.set('item', searchName);
    }
    var query = params.toString();
    return menuBaseUrl() + (query ? '?' + query : '');
  }

  function hasShopConfig() {
    var cfg = state.config || {};
    return Boolean(cfg.tenantId && cfg.companyId);
  }

  function openOrder(searchName, event) {
    if (event) event.preventDefault();
    if (!hasShopConfig()) {
      if (status) {
        status.hidden = false;
        status.textContent = 'Đang tải cấu hình cửa hàng, vui lòng thử lại sau vài giây.';
      }
      return false;
    }
    var url = orderUrl(searchName || '');
    window.location.href = url;
    return false;
  }

  function groupText(key) {
    var map = groupOrderText[state.lang] || groupOrderText.en;
    return map[key] || (groupOrderText.en && groupOrderText.en[key]) || key;
  }

  function groupLabel() {
    return groupOrderLabels[state.lang] || groupOrderLabels.en;
  }

  function menuText(key) {
    var map = menuSearchText[state.lang] || menuSearchText.en;
    return map[key] || (menuSearchText.en && menuSearchText.en[key]) || key;
  }

  function groupSlipEndpoint() {
    var cfg = state.config || {};
    var params = new URLSearchParams();
    params.set('tenantId', cfg.tenantId || '');
    params.set('companyId', cfg.companyId || '');
    return demoOrigin() + '/sapi/shop/public/group-order-slip?' + params.toString();
  }

  function injectGroupOrderStyles() {
    if (document.getElementById('san-group-order-style')) return;
    var style = document.createElement('style');
    style.id = 'san-group-order-style';
    style.textContent =
      '.san-group-modal-open{overflow:hidden}' +
      '.san-group-modal-backdrop{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(9,23,16,.72);overflow:auto}' +
      '.san-group-modal-backdrop[hidden]{display:none!important}' +
      '.san-group-modal{width:min(100%,600px);max-height:calc(100vh - 36px);overflow:auto;background:#fff;color:#172015;border-radius:8px;box-shadow:0 28px 90px rgba(0,0,0,.28)}' +
      '.san-group-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 24px 12px;border-bottom:1px solid #e1e8df}' +
      '.san-group-head h2{margin:0;color:#172015;font-size:26px;font-weight:800;letter-spacing:0}.san-group-head p{margin:6px 0 0;color:#5f6d63;line-height:1.45}' +
      '.san-group-close{appearance:none;width:36px;height:36px;border:1px solid #d8e5dc;background:#fff;color:#172015;border-radius:8px;font-size:24px;line-height:1;display:inline-flex;align-items:center;justify-content:center}' +
      '.san-group-body{padding:20px 24px 24px}.san-group-form{display:grid;gap:14px}' +
      '.san-group-field{display:grid;gap:7px;color:#335c3b;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}' +
      '.san-group-field input,.san-group-field textarea{width:100%;border:1px solid #d8e5dc;border-radius:8px;background:#fff;color:#172015;font-size:16px;font-weight:700;letter-spacing:0;text-transform:none;padding:12px 14px;box-shadow:0 8px 24px rgba(24,53,29,.08)}' +
      '.san-group-field textarea{resize:vertical;min-height:92px}.san-group-help{margin-top:-6px;color:#5f6d63;font-size:13px;font-weight:700}' +
      '.san-group-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:4px}.san-group-button{appearance:none;border:1px solid #335c3b;border-radius:8px;min-height:44px;padding:0 16px;background:#335c3b;color:#fff;font-weight:900}.san-group-button.secondary{background:#fff;color:#335c3b}.san-group-button:disabled{opacity:.6;cursor:wait}' +
      '.san-group-status{min-height:20px;color:#335c3b;font-weight:800}.san-group-status[data-tone="error"]{color:#a5342c}' +
      '.san-group-result{margin-top:18px;padding:16px;border:1px solid #e1e8df;border-radius:8px;background:#fff9ed}.san-group-result[hidden]{display:none!important}' +
      '.san-group-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.san-group-slip{display:grid;gap:2px}.san-group-slip span{color:#5f6d63;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.san-group-slip strong{color:#172015;font-size:30px;font-weight:900;letter-spacing:0}' +
      '.san-group-qr{display:block;width:220px;height:220px;margin:16px auto 12px;background:#fff;border:1px solid #d8e5dc;border-radius:8px;padding:8px;object-fit:contain}' +
      '.san-group-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.san-group-meta div{background:#fff;border:1px solid #edf2ee;border-radius:8px;padding:9px 10px;color:#172015;font-weight:800;min-width:0}.san-group-meta span{display:block;color:#5f6d63;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}.san-group-meta strong{display:block;overflow-wrap:anywhere}' +
      '.san-group-result-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}.san-group-result-actions a{text-decoration:none;display:inline-flex;align-items:center;justify-content:center}' +
      '@media(max-width:600px){.san-group-modal-backdrop{align-items:flex-start;padding:10px}.san-group-head,.san-group-body{padding-left:16px;padding-right:16px}.san-group-head h2{font-size:22px}.san-group-actions,.san-group-result-actions{justify-content:stretch}.san-group-button,.san-group-result-actions a{width:100%}.san-group-meta{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function groupField(labelKey, control) {
    var label = document.createElement('label');
    label.className = 'san-group-field';
    var span = document.createElement('span');
    span.setAttribute('data-san-group-text', labelKey);
    label.appendChild(span);
    label.appendChild(control);
    return label;
  }

  function updateGroupOrderUi() {
    document.querySelectorAll('[data-san-group-order]').forEach(function (link) {
      link.href = '#';
      link.textContent = groupLabel();
      link.removeAttribute('target');
      link.removeAttribute('rel');
    });
    if (!groupModal) return;
    groupModal.querySelectorAll('[data-san-group-text]').forEach(function (el) {
      el.textContent = groupText(el.getAttribute('data-san-group-text'));
    });
    if (groupFields.closeButton) groupFields.closeButton.setAttribute('aria-label', groupText('close'));
    if (groupFields.form && groupFields.form.getAttribute('data-busy') === 'true') {
      groupFields.submitButton.textContent = groupText('generating');
    }
  }

  function ensureGroupOrderModal() {
    if (groupModal) return groupModal;
    injectGroupOrderStyles();

    var backdrop = document.createElement('div');
    backdrop.className = 'san-group-modal-backdrop';
    backdrop.hidden = true;

    var modal = document.createElement('section');
    modal.className = 'san-group-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'san-group-order-title');

    var head = document.createElement('div');
    head.className = 'san-group-head';
    var headingWrap = document.createElement('div');
    var title = document.createElement('h2');
    title.id = 'san-group-order-title';
    title.setAttribute('data-san-group-text', 'title');
    var subtitle = document.createElement('p');
    subtitle.setAttribute('data-san-group-text', 'subtitle');
    headingWrap.appendChild(title);
    headingWrap.appendChild(subtitle);
    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'san-group-close';
    closeButton.textContent = 'x';
    closeButton.addEventListener('click', closeGroupOrder);
    head.appendChild(headingWrap);
    head.appendChild(closeButton);

    var body = document.createElement('div');
    body.className = 'san-group-body';
    var form = document.createElement('form');
    form.className = 'san-group-form';

    var maxOrders = document.createElement('input');
    maxOrders.type = 'number';
    maxOrders.min = '1';
    maxOrders.max = '99';
    maxOrders.step = '1';
    maxOrders.value = '12';
    maxOrders.required = true;
    maxOrders.inputMode = 'numeric';
    form.appendChild(groupField('orderLimit', maxOrders));
    var help = document.createElement('div');
    help.className = 'san-group-help';
    help.setAttribute('data-san-group-text', 'orderLimitHelp');
    form.appendChild(help);

    var name = document.createElement('input');
    name.type = 'text';
    name.maxLength = 120;
    name.autocomplete = 'name';
    name.required = true;
    form.appendChild(groupField('name', name));

    var phone = document.createElement('input');
    phone.type = 'tel';
    phone.maxLength = 60;
    phone.autocomplete = 'tel';
    phone.required = true;
    form.appendChild(groupField('phone', phone));

    var address = document.createElement('textarea');
    address.rows = 3;
    address.maxLength = 300;
    address.autocomplete = 'street-address';
    address.required = true;
    form.appendChild(groupField('address', address));

    var statusLine = document.createElement('div');
    statusLine.className = 'san-group-status';
    statusLine.setAttribute('aria-live', 'polite');
    form.appendChild(statusLine);

    var actions = document.createElement('div');
    actions.className = 'san-group-actions';
    var cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'san-group-button secondary';
    cancelButton.setAttribute('data-san-group-text', 'cancel');
    cancelButton.addEventListener('click', closeGroupOrder);
    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'san-group-button';
    submitButton.setAttribute('data-san-group-text', 'generate');
    actions.appendChild(cancelButton);
    actions.appendChild(submitButton);
    form.appendChild(actions);
    form.addEventListener('submit', submitGroupOrder);

    var result = document.createElement('div');
    result.className = 'san-group-result';
    result.hidden = true;
    var resultHead = document.createElement('div');
    resultHead.className = 'san-group-result-head';
    var slipWrap = document.createElement('div');
    slipWrap.className = 'san-group-slip';
    var slipLabel = document.createElement('span');
    slipLabel.setAttribute('data-san-group-text', 'slipNumber');
    var slipNumber = document.createElement('strong');
    slipWrap.appendChild(slipLabel);
    slipWrap.appendChild(slipNumber);
    resultHead.appendChild(slipWrap);
    result.appendChild(resultHead);
    var qrImage = document.createElement('img');
    qrImage.className = 'san-group-qr';
    qrImage.alt = 'QR';
    result.appendChild(qrImage);
    var meta = document.createElement('div');
    meta.className = 'san-group-meta';
    result.appendChild(meta);
    var resultActions = document.createElement('div');
    resultActions.className = 'san-group-result-actions';
    var downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.className = 'san-group-button';
    downloadButton.setAttribute('data-san-group-text', 'download');
    downloadButton.addEventListener('click', downloadGroupSlip);
    var shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'san-group-button secondary';
    shareButton.setAttribute('data-san-group-text', 'share');
    shareButton.addEventListener('click', shareGroupSlip);
    var openLink = document.createElement('a');
    openLink.className = 'san-group-button secondary';
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.setAttribute('data-san-group-text', 'openSlip');
    resultActions.appendChild(downloadButton);
    resultActions.appendChild(shareButton);
    resultActions.appendChild(openLink);
    result.appendChild(resultActions);

    body.appendChild(form);
    body.appendChild(result);
    modal.appendChild(head);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) closeGroupOrder();
    });
    document.body.appendChild(backdrop);

    groupModal = backdrop;
    groupFields = {
      form: form,
      maxOrders: maxOrders,
      name: name,
      phone: phone,
      address: address,
      status: statusLine,
      submitButton: submitButton,
      closeButton: closeButton,
      result: result,
      slipNumber: slipNumber,
      qrImage: qrImage,
      meta: meta,
      openLink: openLink
    };
    updateGroupOrderUi();
    return groupModal;
  }

  function setGroupStatus(message, tone) {
    if (!groupFields.status) return;
    groupFields.status.textContent = message || '';
    if (tone) {
      groupFields.status.setAttribute('data-tone', tone);
    } else {
      groupFields.status.removeAttribute('data-tone');
    }
  }

  function resetGroupOrderModal() {
    if (!groupFields.form) return;
    groupFields.form.reset();
    groupFields.maxOrders.value = '12';
    groupFields.result.hidden = true;
    setGroupStatus('', '');
    groupSlipState = null;
  }

  function groupOrder(event) {
    if (event) event.preventDefault();
    if (!hasShopConfig()) {
      if (status) {
        status.hidden = false;
        status.textContent = groupText('loadingConfig');
      }
      return false;
    }
    ensureGroupOrderModal();
    resetGroupOrderModal();
    updateGroupOrderUi();
    groupModal.hidden = false;
    document.body.classList.add('san-group-modal-open');
    window.setTimeout(function () { groupFields.name && groupFields.name.focus(); }, 0);
    return false;
  }

  function closeGroupOrder() {
    if (!groupModal) return;
    groupModal.hidden = true;
    document.body.classList.remove('san-group-modal-open');
  }

  function readGroupOrderPayload() {
    var maxOrders = parseInt(groupFields.maxOrders.value, 10);
    var name = (groupFields.name.value || '').trim();
    var phone = (groupFields.phone.value || '').trim();
    var address = (groupFields.address.value || '').trim();
    if (!name || !phone || !address || !groupFields.maxOrders.value) {
      setGroupStatus(groupText('required'), 'error');
      return null;
    }
    if (!isFinite(maxOrders) || maxOrders < 1 || maxOrders >= 100) {
      setGroupStatus(groupText('invalidLimit'), 'error');
      return null;
    }
    return {
      name: name,
      phone: phone,
      address: address,
      maxOrders: maxOrders,
      language: state.lang
    };
  }

  function submitGroupOrder(event) {
    event.preventDefault();
    if (!hasShopConfig()) {
      setGroupStatus(groupText('loadingConfig'), 'error');
      return;
    }
    var payload = readGroupOrderPayload();
    if (!payload) return;
    groupFields.form.setAttribute('data-busy', 'true');
    groupFields.submitButton.disabled = true;
    groupFields.submitButton.textContent = groupText('generating');
    setGroupStatus(groupText('generating'), '');
    fetch(groupSlipEndpoint(), {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.text().then(function (text) {
        var data = {};
        if (text) {
          try { data = JSON.parse(text); } catch (ignored) {}
        }
        if (!response.ok) {
          throw new Error(data.message || data.error || groupText('endpointError'));
        }
        return data;
      });
    }).then(function (data) {
      renderGroupSlip(data, payload);
    }).catch(function (error) {
      setGroupStatus(error.message || groupText('endpointError'), 'error');
    }).then(function () {
      groupFields.form.setAttribute('data-busy', 'false');
      groupFields.submitButton.disabled = false;
      groupFields.submitButton.textContent = groupText('generate');
    });
  }

  function dataUrlFromQr(base64) {
    if (!base64) return '';
    return /^data:image\//i.test(base64) ? base64 : 'data:image/png;base64,' + base64;
  }

  function formatDateTime(value) {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(value));
    } catch (ignored) {
      return String(value);
    }
  }

  function addGroupMeta(labelKey, value) {
    if (!value) return;
    var item = document.createElement('div');
    var label = document.createElement('span');
    label.textContent = groupText(labelKey);
    var strong = document.createElement('strong');
    strong.textContent = value;
    item.appendChild(label);
    item.appendChild(strong);
    groupFields.meta.appendChild(item);
  }

  function renderGroupSlip(data, payload) {
    var slipNumber = String(data.slipNumber || '').trim() || String(data.token || '').slice(0, 8).toUpperCase();
    var qrDataUrl = dataUrlFromQr(data.qrBase64);
    var qrUrl = data.qrUrl || '';
    groupSlipState = {
      slipNumber: slipNumber,
      qrDataUrl: qrDataUrl,
      qrUrl: qrUrl,
      maxOrders: data.maxOrders || payload.maxOrders,
      name: data.name || payload.name,
      phone: data.phone || payload.phone,
      address: data.address || payload.address,
      expiresAt: data.expiresAt || ''
    };
    groupFields.slipNumber.textContent = slipNumber;
    groupFields.qrImage.src = qrDataUrl;
    groupFields.qrImage.alt = groupText('shareTitle') + ' ' + slipNumber;
    groupFields.openLink.href = qrUrl;
    groupFields.meta.innerHTML = '';
    addGroupMeta('orderLimitResult', String(groupSlipState.maxOrders));
    addGroupMeta('name', groupSlipState.name);
    addGroupMeta('phone', groupSlipState.phone);
    addGroupMeta('address', groupSlipState.address);
    addGroupMeta('expiresAt', formatDateTime(groupSlipState.expiresAt));
    groupFields.result.hidden = false;
    setGroupStatus(groupText('ready'), '');
  }

  function sanitizeFilename(value) {
    return String(value || 'group-order').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'group-order';
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var words = String(text || '').split(/\s+/);
    var line = '';
    var lines = 0;
    for (var i = 0; i < words.length; i += 1) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        lines += 1;
        line = words[i];
        if (maxLines && lines >= maxLines) return y;
      } else {
        line = test;
      }
    }
    if (line && (!maxLines || lines < maxLines)) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
    return y;
  }

  function downloadCanvas(canvas, slipNumber) {
    var link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'san-group-order-slip-' + sanitizeFilename(slipNumber) + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadGroupSlip() {
    if (!groupSlipState || !groupSlipState.qrDataUrl) return;
    var image = new Image();
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1180;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff9ed';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(70, 60, 760, 1060);
      ctx.strokeStyle = '#d8e5dc';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 60, 760, 1060);
      ctx.fillStyle = '#335c3b';
      ctx.font = '700 30px Arial, sans-serif';
      ctx.fillText('SAN Coffee & Tea', 120, 130);
      ctx.fillStyle = '#172015';
      ctx.font = '800 44px Arial, sans-serif';
      ctx.fillText(groupText('shareTitle'), 120, 195);
      ctx.fillStyle = '#5f6d63';
      ctx.font = '700 24px Arial, sans-serif';
      ctx.fillText(groupText('slipNumber'), 120, 255);
      ctx.fillStyle = '#172015';
      ctx.font = '900 76px Arial, sans-serif';
      ctx.fillText(groupSlipState.slipNumber, 120, 335);
      ctx.drawImage(image, 250, 400, 400, 400);
      ctx.fillStyle = '#172015';
      ctx.font = '700 26px Arial, sans-serif';
      var y = 860;
      y = drawWrappedText(ctx, groupText('orderLimitResult') + ': ' + groupSlipState.maxOrders, 120, y, 660, 34, 2);
      y = drawWrappedText(ctx, groupText('name') + ': ' + groupSlipState.name, 120, y + 8, 660, 34, 2);
      y = drawWrappedText(ctx, groupText('phone') + ': ' + groupSlipState.phone, 120, y + 8, 660, 34, 2);
      y = drawWrappedText(ctx, groupText('address') + ': ' + groupSlipState.address, 120, y + 8, 660, 34, 3);
      if (groupSlipState.expiresAt) {
        y = drawWrappedText(ctx, groupText('expiresAt') + ': ' + formatDateTime(groupSlipState.expiresAt), 120, y + 8, 660, 34, 2);
      }
      ctx.fillStyle = '#5f6d63';
      ctx.font = '700 22px Arial, sans-serif';
      drawWrappedText(ctx, groupText('shareText').replace('{slip}', groupSlipState.slipNumber), 120, 1075, 660, 30, 2);
      downloadCanvas(canvas, groupSlipState.slipNumber);
    };
    image.src = groupSlipState.qrDataUrl;
  }

  function shareGroupSlip() {
    if (!groupSlipState || !groupSlipState.qrUrl) return;
    var shareText = groupText('shareText').replace('{slip}', groupSlipState.slipNumber);
    if (navigator.share) {
      navigator.share({
        title: groupText('shareTitle'),
        text: shareText,
        url: groupSlipState.qrUrl
      }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(groupSlipState.qrUrl).then(function () {
        setGroupStatus(groupText('copied'), '');
      }).catch(function () {
        setGroupStatus(groupText('copyFailed'), 'error');
      });
      return;
    }
    setGroupStatus(groupText('copyFailed'), 'error');
  }

  function money(value) {
    var locale = state.lang === 'en' ? 'en-US' : 'vi-VN';
    return new Intl.NumberFormat(locale).format(Number(value || 0)) + ' ₫';
  }

  function parseTranslations(value) {
    if (!value) return {};
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    try {
      var parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (ignored) {
      return {};
    }
  }

  function localizedValue(baseValue, translations, lang) {
    var map = parseTranslations(translations);
    return map[lang] || baseValue || '';
  }

  function itemName(item) {
    return localizedValue(item.modelName || item.name, item.modelNameTranslations, state.lang) || 'SAN';
  }

  function itemCategory(item) {
    return localizedValue(item.category, item.categoryTranslations, state.lang);
  }

  function normalizeSearch(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function itemSearchText(item) {
    return normalizeSearch([itemName(item), itemCategory(item), item.ingredients].filter(Boolean).join(' '));
  }

  function filteredRows() {
    var query = normalizeSearch(state.search);
    return (state.rows || []).filter(function (item) {
      var category = itemCategory(item);
      if (state.category && category !== state.category) return false;
      if (query && itemSearchText(item).indexOf(query) < 0) return false;
      return true;
    });
  }

  function safeImage(value) {
    if (!value) return '/dailocoffee/images/gallery_9.jpeg';
    if (/^https?:\/\//i.test(value)) return value;
    if (String(value).charAt(0) === '/') return demoOrigin() + value;
    return value;
  }

  function updateLanguageUi() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-san-lang-code]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-san-lang-code') === state.lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-san-lang-select]').forEach(function (select) {
      select.value = state.lang;
    });
    document.querySelectorAll('[data-san-shop-menu]').forEach(function (a) {
      a.href = hasShopConfig() ? orderUrl('') : '#';
      a.textContent = menuLabels[state.lang] || menuLabels.en;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-san-order]').forEach(function (a) {
      a.href = hasShopConfig() ? orderUrl('') : '#';
      a.textContent = orderLabels[state.lang] || orderLabels.en;
      a.removeAttribute('target');
      a.removeAttribute('rel');
    });
    document.querySelectorAll('.san-search-label').forEach(function (label) {
      var updated = false;
      Array.prototype.forEach.call(label.childNodes, function (node) {
        if (!updated && node.nodeType === 3) {
          node.nodeValue = menuText('label') + ' ';
          updated = true;
        }
      });
      if (!updated) label.insertBefore(document.createTextNode(menuText('label') + ' '), label.firstChild);
    });
    if (searchInput) searchInput.placeholder = menuText('placeholder');
    updateGroupOrderUi();
  }

  function setLanguage(lang) {
    var normalized = normalizeLanguage(lang) || 'vi';
    if (state.lang === normalized) return;
    state.lang = normalized;
    try { localStorage.setItem('san_shop_language', state.lang); } catch (ignored) {}
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', state.lang);
      window.history.replaceState({}, '', url.toString());
    } catch (ignored) {}
    updateLanguageUi();
    renderCategoryFilters();
    renderMenu();
  }

  function renderCategoryFilters() {
    if (!categoryList) return;
    var categories = [];
    (state.rows || []).forEach(function (item) {
      var category = itemCategory(item);
      if (category && categories.indexOf(category) < 0) categories.push(category);
    });
    categories.sort(function (a, b) { return a.localeCompare(b); });
    if (state.category && categories.indexOf(state.category) < 0) state.category = '';
    categoryList.innerHTML = '';
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'san-category-filter';
    all.textContent = menuText('all');
    all.setAttribute('aria-pressed', state.category ? 'false' : 'true');
    all.addEventListener('click', function () {
      state.category = '';
      renderCategoryFilters();
      renderMenu();
    });
    categoryList.appendChild(all);
    categories.forEach(function (category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'san-category-filter';
      button.textContent = category;
      button.setAttribute('aria-pressed', state.category === category ? 'true' : 'false');
      button.addEventListener('click', function () {
        state.category = state.category === category ? '' : category;
        renderCategoryFilters();
        renderMenu();
      });
      categoryList.appendChild(button);
    });
  }

  function renderMenu() {
    if (!grid) return;
    var rows = filteredRows();
    if (menuCount) {
      menuCount.hidden = !(state.rows || []).length;
      menuCount.textContent = rows.length + ' / ' + (state.rows || []).length + ' ' + menuText('itemUnit');
    }
    grid.innerHTML = '';
    if (!rows.length) {
      grid.hidden = true;
      if (status) {
        status.hidden = false;
        status.textContent = state.search || state.category ? menuText('noMatch') : menuText('empty');
      }
      return;
    }
    rows.forEach(function (item) {
      var name = itemName(item);
      var category = itemCategory(item);
      var card = document.createElement('article');
      card.className = 'san-card';

      var image = document.createElement('img');
      image.src = safeImage(item.imageUrl || item.thumbnailUrl);
      image.alt = name;

      var body = document.createElement('div');
      body.className = 'san-card-body';

      if (category) {
        var categoryEl = document.createElement('div');
        categoryEl.className = 'san-category';
        categoryEl.textContent = category;
        body.appendChild(categoryEl);
      }

      var title = document.createElement('h3');
      title.textContent = name;
      body.appendChild(title);

      if (item.ingredients) {
        var ingredients = document.createElement('p');
        ingredients.className = 'san-ingredients';
        ingredients.textContent = item.ingredients;
        body.appendChild(ingredients);
      }

      var actions = document.createElement('div');
      actions.className = 'san-card-actions';

      var price = document.createElement('span');
      price.className = 'san-price';
      price.textContent = money(item.sellingPrice != null ? item.sellingPrice : item.price);

      var order = document.createElement('a');
      order.className = 'san-card-order';
      order.href = orderUrl(name);
      order.removeAttribute('target');
      order.removeAttribute('rel');
      order.textContent = orderLabels[state.lang] || orderLabels.en;
      order.addEventListener('click', function (event) {
        openOrder(name, event);
      });

      actions.appendChild(price);
      actions.appendChild(order);
      body.appendChild(actions);
      card.appendChild(image);
      card.appendChild(body);
      grid.appendChild(card);
    });
    if (status) status.hidden = true;
    grid.hidden = false;
  }

  document.querySelectorAll('[data-san-lang-code]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.getAttribute('data-san-lang-code'));
    });
  });
  document.querySelectorAll('[data-san-lang-select]').forEach(function (select) {
    select.addEventListener('change', function () {
      setLanguage(select.value);
    });
  });
  document.querySelectorAll('[data-san-shop-menu]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      openOrder('', event);
    });
  });
  document.querySelectorAll('[data-san-order]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      openOrder('', event);
    });
  });
  document.querySelectorAll('[data-san-group-order]').forEach(function (link) {
    link.addEventListener('click', groupOrder);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && groupModal && !groupModal.hidden) closeGroupOrder();
  });
  window.groupOrder = groupOrder;
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = searchInput.value || '';
      renderMenu();
    });
  }
  updateLanguageUi();

  fetch('/api/public/shopfront/current', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('Không đọc được cấu hình cửa hàng.');
    return r.json();
  }).then(function (cfg) {
    if (!cfg.tenantId || !cfg.companyId) throw new Error('Chưa cấu hình Tenant ID và Company ID trong Portal Admin → SAN Shop Connection.');
    state.config = cfg;
    updateLanguageUi();
    if (cfg.address) document.querySelectorAll('[data-san-address]').forEach(function (el) { el.textContent = cfg.address; });
    if (cfg.openingHours) document.querySelectorAll('[data-san-hours]').forEach(function (el) { el.textContent = cfg.openingHours; });
    if (!grid) return [];
    return fetch('/api/public/shopfront/current/menu', { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('Không tải được menu từ demo (' + r.status + ').');
      return r.json();
    });
  }).then(function (menu) {
    if (!grid) return;
    var rows = Array.isArray(menu) ? menu : (menu.items || menu.content || []);
    if (!rows.length) throw new Error('Cửa hàng chưa có món đang bán.');
    state.rows = rows;
    renderCategoryFilters();
    renderMenu();
  }).catch(function (error) {
    if (status) status.textContent = error.message;
  });
}());
