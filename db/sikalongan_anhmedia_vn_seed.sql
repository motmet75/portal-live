-- Sika Long An / Công ty Huỳnh Toàn prospect seed
-- Source snapshot: https://sikalongan.com (captured 2026-10-02 with TLS verification disabled because the source certificate is expired).
-- PostgreSQL, UTF-8, rerunnable. Run ONLY in the cloned tenant database for sikalongan.anhmedia.vn.
-- Login: sikalongan / sikalongan
-- Source prices were all 0 VND, so the storefront intentionally displays “Liên hệ báo giá”.

BEGIN;

ALTER TABLE IF EXISTS public.producttb
    ADD COLUMN IF NOT EXISTS productstockqty numeric(15,3) DEFAULT 0;

ALTER TABLE IF EXISTS public.usertb
    ADD COLUMN IF NOT EXISTS lasttenantid varchar(36),
    ADD COLUMN IF NOT EXISTS lastcompanyid varchar(36),
    ADD COLUMN IF NOT EXISTS assignedtenantid varchar(36),
    ADD COLUMN IF NOT EXISTS assignedcompanyid varchar(36);

-- Public page routes and complete source-page HTML.
CREATE TEMP TABLE tmp_sikalongan_pages (
    articleid text, articlelink text, title text, description text, content text,
    template text, sort_index text, published_at timestamp
) ON COMMIT DROP;

INSERT INTO tmp_sikalongan_pages VALUES
($pa0a$SIKALONGAN-PAGE-4375$pa0a$, $pa0b$hinh-anh.html$pa0b$, $pa0c$Hình ảnh$pa0c$, $pa0d$Album 2 Album 3 Album 6$pa0d$, $pa0e$	<section class="section" id="section_230694474">
		<div class="bg section-bg fill bg-fill  bg-loaded" >

			
			
			

		</div>

		<div class="section-content relative">
			

  
    <div class="row large-columns-2 medium-columns- small-columns-">
          <div class="gallery-col col" >
          <div class="col-inner">
            <a class="image-lightbox lightbox-gallery" href="/sikalongan.com/images/pages/hinh-anh-1.jpg" title="">            <div class="box has-hover gallery-box box-overlay dark">
              <div class="box-image" >
                <img width="1600" height="1067" src="/sikalongan.com/images/pages/hinh-anh-1.jpg" class="attachment-original size-original" alt="" ids="4716,4380,4382,4384" lightbox_image_size="original" columns="2" image_size="original" />                                  <div class="overlay fill"
                      style="background-color: rgba(0,0,0,.15)">
                  </div>
                                                              </div>
              <div class="box-text text-left" >
                 <p></p>
              </div>
            </div>
            </a>          </div>
         </div>
                 <div class="gallery-col col" >
          <div class="col-inner">
            <a class="image-lightbox lightbox-gallery" href="/sikalongan.com/images/pages/hinh-anh-2.jpg" title="Album 2">            <div class="box has-hover gallery-box box-overlay dark">
              <div class="box-image" >
                <img width="1280" height="960" src="/sikalongan.com/images/pages/hinh-anh-2.jpg" class="attachment-original size-original" alt="" ids="4716,4380,4382,4384" lightbox_image_size="original" columns="2" image_size="original" />                                  <div class="overlay fill"
                      style="background-color: rgba(0,0,0,.15)">
                  </div>
                                                              </div>
              <div class="box-text text-left" >
                 <p>Album 2</p>
              </div>
            </div>
            </a>          </div>
         </div>
                 <div class="gallery-col col" >
          <div class="col-inner">
            <a class="image-lightbox lightbox-gallery" href="/sikalongan.com/images/pages/hinh-anh-3.jpg" title="Album 3">            <div class="box has-hover gallery-box box-overlay dark">
              <div class="box-image" >
                <img width="1362" height="823" src="/sikalongan.com/images/pages/hinh-anh-3.jpg" class="attachment-original size-original" alt="" ids="4716,4380,4382,4384" lightbox_image_size="original" columns="2" image_size="original" />                                  <div class="overlay fill"
                      style="background-color: rgba(0,0,0,.15)">
                  </div>
                                                              </div>
              <div class="box-text text-left" >
                 <p>Album 3</p>
              </div>
            </div>
            </a>          </div>
         </div>
                 <div class="gallery-col col" >
          <div class="col-inner">
            <a class="image-lightbox lightbox-gallery" href="/sikalongan.com/images/pages/hinh-anh-4.jpg" title="Album 6">            <div class="box has-hover gallery-box box-overlay dark">
              <div class="box-image" >
                <img width="1134" height="709" src="/sikalongan.com/images/pages/hinh-anh-4.jpg" class="attachment-original size-original" alt="" ids="4716,4380,4382,4384" lightbox_image_size="original" columns="2" image_size="original" />                                  <div class="overlay fill"
                      style="background-color: rgba(0,0,0,.15)">
                  </div>
                                                              </div>
              <div class="box-text text-left" >
                 <p>Album 6</p>
              </div>
            </div>
            </a>          </div>
         </div>
         </div>
		</div>

		
<style>
#section_230694474 {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
	</section>
	
$pa0e$, $pa0f$gallery.html$pa0f$, '0', TIMESTAMP '2022-08-23 08:48:56'),
($pa1a$SIKALONGAN-PAGE-4321$pa1a$, $pa1b$lien-he.html$pa1b$, $pa1c$Liên hệ$pa1c$, $pa1d$CÔNG TY TNHH SẢN XUẤT SƠN HUỲNH TOÀN 153 Quốc Lộ 62, Phường 2, Tp Tân An, Long An, Việt Nam Hotline: 0909 933 575 Quản lý bán hàng: 0933 866 505 – Nhung Website: sikalongan.com Họ và Tên: Số điện thoại: Địa chỉ Email: Tin nhắn của bạn:$pa1d$, $pa1e$<p><strong>CÔNG TY TNHH SẢN XUẤT SƠN HUỲNH TOÀN</strong><br />
<i class="fas fa-hospital-alt "></i> 153 Quốc Lộ 62, Phường 2, Tp Tân An, Long An, Việt Nam<br />
<i class="fas fa-phone-square-alt "></i> Hotline: 0909 933 575<br />
<i class="fas fa-phone-square-alt "></i> Quản lý bán hàng: 0933 866 505 &#8211; Nhung<br />
<i class="fas fa-link "></i> Website: sikalongan.com</p>
<div class="lienhe"><div class="row"  id="row-356690703">
	<div id="col-6035332" class="col medium-1/2 large-6"  >
		<div class="col-inner"  >
			
			
<div role="form" class="wpcf7" id="wpcf7-f1917-o1" lang="vi" dir="ltr">
<div class="screen-reader-response"><p role="status" aria-live="polite" aria-atomic="true"></p> <ul></ul></div>
<form action="/wp-json/wp/v2/pages?per_page=100&#038;_embed=1#wpcf7-f1917-o1" method="post" class="wpcf7-form init" novalidate="novalidate" data-status="init">
<div style="display: none;">
<input type="hidden" name="_wpcf7" value="1917" />
<input type="hidden" name="_wpcf7_version" value="5.4.2" />
<input type="hidden" name="_wpcf7_locale" value="vi" />
<input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f1917-o1" />
<input type="hidden" name="_wpcf7_container_post" value="0" />
<input type="hidden" name="_wpcf7_posted_data_hash" value="" />
</div>
<p><label> Họ và Tên:<br />
    <span class="wpcf7-form-control-wrap your-name"><input type="text" name="your-name" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" /></span> </label><br />
<label> Số điện thoại:<br />
<span class="wpcf7-form-control-wrap tel-603"><input type="tel" name="tel-603" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-tel wpcf7-validates-as-required wpcf7-validates-as-tel" aria-required="true" aria-invalid="false" /></span> </label><br />
<label> Địa chỉ Email:<br />
    <span class="wpcf7-form-control-wrap your-email"><input type="email" name="your-email" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email" aria-required="true" aria-invalid="false" /></span> </label></p>
<p><label> Tin nhắn của bạn:<br />
    <span class="wpcf7-form-control-wrap your-message"><textarea name="your-message" cols="40" rows="10" class="wpcf7-form-control wpcf7-textarea" aria-invalid="false"></textarea></span> </label></p>
<p><input type="submit" value="Gửi" class="wpcf7-form-control wpcf7-submit" /></p>
<div class="wpcf7-response-output" aria-hidden="true"></div></form></div>
		</div>
			</div>

	

	<div id="col-1202324543" class="col medium-1/2 large-6"  >
		<div class="col-inner"  >
			
			
<p><iframe style="border: 0;" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.4683476043347!2d106.39708327832378!3d10.542475636654006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310ab7bbd73ef6d7%3A0xe0bec060ed35848d!2zQ8OUTkcgVFkgVE5ISCBTWCBTxqBOIEhV4buyTkggVE_DgE4!5e0!3m2!1svi!2s!4v1692713908556!5m2!1svi!2s" width="600" height="450" allowfullscreen="allowfullscreen"></iframe></p>
		</div>
			</div>

	
</div>
</div>
$pa1e$, $pa1f$contact.html$pa1f$, '1', TIMESTAMP '2022-08-19 03:40:38'),
($pa2a$SIKALONGAN-PAGE-3628$pa2a$, $pa2b$gioi-thieu.html$pa2b$, $pa2c$Giới thiệu$pa2c$, $pa2d$Giới thiệu về công ty Huỳnh Toàn Đôi nét về Huỳnh Toàn và thương hiệu sơn KANSHIELD Khởi đầu kinh doanh với vai trò là nhà phân phối sơn nhỏ lẻ tại thành phố Tân An, tỉnh Long An từ năm 2011, đến nay Huỳnh Toàn đã trở thành đại lý phân phối chính thức hóa chất xây dựng SIKA, là địa chỉ cung cấp sơn $pa2d$, $pa2e$<div class="detail clearfix mb10">
<div class="title-inpage">
<h1>Giới thiệu về công ty Huỳnh Toàn</h1>
</div>
</div>
<div class="detail">
<h2><span style="color: #0000cd;"><strong><em>Đôi nét về Huỳnh Toàn và thương hiệu sơn KANSHIELD</em></strong></span></h2>
<p>Khởi đầu kinh doanh với vai trò là nhà phân phối sơn nhỏ lẻ tại thành phố Tân An, tỉnh Long An từ năm 2011, đến nay Huỳnh Toàn đã trở thành đại lý phân phối chính thức hóa chất xây dựng SIKA, là địa chỉ cung cấp sơn cao cấp uy tín số 1 tại miền Nam, nhận đơn hàng lớn nhỏ trên toàn quốc.</p>
<p>Với những bước đi vững chắc cùng kế hoạch kinh doanh sáng suốt, từ 07/2013, Công ty TNHH MTV TM DV Huỳnh Toàn không ngừng phát triển, nâng cao chất lượng từ sản phẩm đến dịch vụ để khẳng định vị thế của mình. Tự hào trở thành đơn vị phân phối độc quyền sản phẩm SƠN &amp; CHỐNG THẤM tại tỉnh Long An và các khu vực lân cận, chúng tôi luôn nỗ lực để mang đến những dòng sơn chất lượng, sản phẩm chính hãng, an toàn, sẵn sàng tiếp thu ý kiến đóng góp của khách hàng để hoàn thiện mình hơn, trở thành đối tác, đơn vị phân phối đáng tin cậy.</p>
<h3><span style="color: #0000cd;"><strong><em>Khó khăn không thể ngăn bước thành công</em></strong></span></h3>
<p>Khó khăn ập đến với công ty Huỳnh Toàn khi dịch bệnh Covid 19 bùng phát vào năm 2019 và tất cả hàng hóa đều bị hạn chế lưu thông, thời gian giao hàng chậm trễ, công việc kinh doanh gặp nhiều bất lợi. Đối diện với thử thách ấy, anh Huỳnh Toàn – Giám đốc công ty đã không chấp nhận từ bỏ mà quyết tâm tìm một hướng đi mới bằng cách tự sản xuất thương hiệu sơn của riêng mình. Và thành công đã mỉm cười với anh khi đến cuối năm 2020, công ty Huỳnh Toàn đã hoàn thành thủ tục và cho ra mắt 5 dòng sản phẩm sơn chống thấm mang thương hiệu <span style="color: #fd0000;"><strong>KANSHIELD</strong></span>, nhận được sự yêu thích và tin dùng của đông đảo khách hàng.</p>
<p>Dòng sơn chống thấm ngoài trời  mang lại giải pháp toàn diện cho người dùng, bảo vệ tổ ấm khỏi những tác động của thời tiết bên ngoài, có tính thẩm mỹ cao, giá cả phải chăng, thi công dễ dàng, tiện lợi và an toàn cho sức khỏe người dùng. Đến với Huỳnh Toàn là đến với dòng sơn chất lượng, an toàn, giá cả hợp lý, là sự lựa chọn hàng đầu của người dân trên toàn quốc.</p>
<p>CÔNG TY TNHH MTV TM DV HUỲNH TOÀN (Mã số doanh nghiệp : 1101708633) cung cấp đa dạng chủng loại sơn bao gồm sơn lót, sơn chống thấm, sơn nước nội thất, sơn ánh kim, sơn giả gỗ, sơn ngoại thất,&#8230;Là đơn vị phân phối độc quyền sản phẩm SIKA trên địa bàn tỉnh Long An từ năm 2013 và là nhà sản xuất 5 dòng sơn mang thương hiệu KANSHIELD ra mắt thị trường năm 2020. Chúng tôi hướng tới sứ mệnh mang lại dòng sơn chất lượng, tiện ích với giá cả cạnh tranh cùng thái độ phục vụ tận tình nhất cho khách hàng.</p>
<p>Chúng tôi cam kết cung cấp loại sơn tốt với đủ 5 yếu tố:<br />
&#8211; Màu sắc đẹp<br />
&#8211; Độ phủ cao<br />
&#8211; Không độc hại, an toàn với người dùng<br />
&#8211; Bền bỉ với thời gian, phù hợp với khí hậu Việt Nam<br />
&#8211; Giá cả phù hợp</p>
<p>Chúng tôi nói KHÔNG với hàng kém chất lượng. Sản phẩm sơn KANSHIELD tại Huỳnh Toàn đã được Liên Hiệp Các Hội Khoa Học Và Kỷ Thuật Việt Nam Trung Tâm Kiểm Nghiệm Và Chứng Nhận Chất Lượng TQC đánh giá phù hợp với các yêu cầu của Tiêu Chuẩn Quốc Tế.</p>
<p>Bằng những nỗ lực không ngừng, Cty Huỳnh Toàn đã trở thành đơn vị phân phối sơn quen thuộc với người dân, cửa hàng bán lẻ ở rất nhiều tỉnh thành trên cả nước như TP.HCM, Long An, Tiền Giang, Bến Tre, Trà Vinh, Bình Phước, Đà Lạt, Bình Thuận,…</p>
<p>Hãy để Huỳnh Toàn trở thành người đồng hành, cùng bảo vệ mái ấm gia đình bạn!</p>
<p><span style="color: #fd0000;"><em>Kanshield Paint sơn chống thấm cho nhà Việt!</em></span></p>
</div>
$pa2e$, $pa2f$about.html$pa2f$, '2', TIMESTAMP '2022-03-29 03:29:25'),
($pa3a$SIKALONGAN-PAGE-2092$pa3a$, $pa3b$products.html$pa3b$, $pa3c$Sản Phẩm$pa3c$, $pa3d$$pa3d$, $pa3e$$pa3e$, $pa3f$products.html$pa3f$, '3', TIMESTAMP '2021-03-13 13:45:43'),
($pa4a$SIKALONGAN-PAGE-188$pa4a$, $pa4b$home$pa4b$, $pa4c$Sika Long An$pa4c$, $pa4d$GIỚI THIỆU VỀ CÔNG TY HUỲNH TOÀN Khởi đầu kinh doanh với vai trò là nhà phân phối sơn nhỏ lẻ tại thành phố Tân An, tỉnh Long An từ năm 2011, đến nay Huỳnh Toàn đã trở thành đại lý phân phối chính thức hóa chất xây dựng SIKA, là địa chỉ cung cấp sơn cao cấp uy tín số 1 tại miền Nam, nhận đơn hàng lớn$pa4d$, $pa4e$<br />
<section class="section" id="section_603591378">
<div class="bg section-bg fill bg-fill  " ></div>
<div class="section-content relative">
<div class="row"  id="row-290355117">
<div id="col-273390254" class="col medium-6 small-12 large-6"  >
<div class="col-inner"  >
<div class="title-about">GIỚI THIỆU VỀ CÔNG TY HUỲNH TOÀN</div>
<div class="desc-mota-about">
<p style="text-align: justify;">Khởi đầu kinh doanh với vai trò là nhà phân phối sơn nhỏ lẻ tại thành phố Tân An, tỉnh Long An từ năm 2011, đến nay Huỳnh Toàn đã trở thành đại lý phân phối chính thức hóa chất xây dựng SIKA, là địa chỉ cung cấp sơn cao cấp uy tín số 1 tại miền Nam, nhận đơn hàng lớn nhỏ trên toàn quốc.</p>
<p style="text-align: justify;">Với những bước đi vững chắc cùng kế hoạch kinh doanh sáng suốt, từ 07/2013, <span style="color: #ff0000;">Công ty TNHH MTV TM DV Huỳnh Toàn</span> không ngừng phát triển, nâng cao chất lượng từ sản phẩm đến dịch vụ để khẳng định vị thế của mình. Tự hào trở thành đơn vị phân phối độc quyền sản phẩm <span style="color: #ff0000;"><strong>SƠN &amp; CHỐNG THẤM</strong></span> tại tỉnh Long An và các khu vực lân cận, chúng tôi luôn nỗ lực để mang đến những dòng sơn chất lượng, sản phẩm chính hãng, an toàn, sẵn sàng tiếp thu ý kiến đóng góp của khách hàng để hoàn thiện mình hơn, trở thành đối tác, đơn vị phân phối đáng tin cậy.</p>
</div>
<p><a data-animate="fadeInLeft" href="http://sikalongan.com/gioi-thieu" target="_self" class="button primary is-smaller lowercase"  style="border-radius:99px;"><br />
    <span>Xem thêm</span><br />
  <i class="icon-angle-right" ></i></a></p></div>
</p></div>
<div id="col-1614836004" class="col medium-6 small-12 large-6"  >
<div class="col-inner"  >
<div class="video video-fit mb" style="padding-top:56.25%;">
<p><iframe title="TỔ ẤM ĐẸP XINH || HTV7 || SƠN CHỐNG THẤM HUỲNH TOÀN LONG AN" width="1020" height="574" src="https://www.youtube.com/embed/YNHYvYGuwh0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></p>
</div></div>
</p></div>
</div></div>
<style>
#section_603591378 {
  padding-top: 30px;
  padding-bottom: 30px;
}
#section_603591378 .section-bg.bg-loaded {
  background-image: url(/sikalongan.com/images/pages/trang-chu-bg-1.png);
}
</style>
</section>
<section class="section hide-for-medium" id="section_1520352321">
<div class="bg section-bg fill bg-fill  bg-loaded" ></div>
<div class="section-content relative">
<div class="row"  id="row-1968009936">
<div id="col-1392790392" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<ul class="sidebar-wrapper ul-reset">
<aside id="nav_menu-2" class="widget widget_nav_menu"><span class="widget-title "><span>DANH MỤC SẢN PHẨM</span></span></p>
<div class="is-divider small"></div>
<div class="menu-danh-muc-san-pham-container">
<ul id="menu-danh-muc-san-pham" class="menu">
<li id="menu-item-4226" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4226"><a href="https://sikalongan.com/san-pham/vat-lieu-chong-tham">VẬT LIỆU CHỐNG THẤM</a></li>
<li id="menu-item-4209" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4209"><a href="https://sikalongan.com/san-pham/bot-tret-tuong">BỘT TRÉT TƯỜNG</a></li>
<li id="menu-item-4210" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4210"><a href="https://sikalongan.com/san-pham/chat-bao-ve-thep">CHẤT BẢO VỆ THÉP</a></li>
<li id="menu-item-4211" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4211"><a href="https://sikalongan.com/san-pham/chat-ket-dinh-cuong-do-cao">CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO</a></li>
<li id="menu-item-4212" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4212"><a href="https://sikalongan.com/san-pham/chat-tay-ri">CHẤT TẨY RỈ</a></li>
<li id="menu-item-4213" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4213"><a href="https://sikalongan.com/san-pham/keo-cha-ron">KEO CHÀ RON</a></li>
<li id="menu-item-4214" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4214"><a href="https://sikalongan.com/san-pham/keo-dan-gach">KEO DÁN GẠCH</a></li>
<li id="menu-item-4215" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4215"><a href="https://sikalongan.com/san-pham/keo-pu-truong-no">KEO PU TRƯƠNG NỞ</a></li>
<li id="menu-item-4216" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4216"><a href="https://sikalongan.com/san-pham/keo-silicone">KEO SILICONE</a></li>
<li id="menu-item-4217" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4217"><a href="https://sikalongan.com/san-pham/lop-phu-va-bao-ve-san">LỚP PHỦ VÀ BẢO VỆ SÀN</a></li>
<li id="menu-item-4218" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4218"><a href="https://sikalongan.com/san-pham/luoi-thuy-tinh">LƯỚI THỦY TINH</a></li>
<li id="menu-item-4219" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4219"><a href="https://sikalongan.com/san-pham/mang-chong-tham">MÀNG CHỐNG THẤM</a></li>
<li id="menu-item-4220" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4220"><a href="https://sikalongan.com/san-pham/may-bom-keo">MÁY BƠM KEO</a></li>
<li id="menu-item-4221" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4221"><a href="https://sikalongan.com/san-pham/phu-gia-be-tong">PHỤ GIA BÊ TÔNG</a></li>
<li id="menu-item-4222" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4222"><a href="https://sikalongan.com/san-pham/san-pham-ho-tro-be-tong">SẢN PHẨM HỖ TRỢ BÊ TÔNG</a></li>
<li id="menu-item-4223" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4223"><a href="https://sikalongan.com/san-pham/son-chong-nong">SƠN CHỐNG NÓNG</a></li>
<li id="menu-item-4224" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4224"><a href="https://sikalongan.com/san-pham/sua-chua-va-bao-ve-be-tong">SỮA CHỮA VÀ BẢO VỆ BÊ TÔNG</a></li>
<li id="menu-item-4225" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4225"><a href="https://sikalongan.com/san-pham/tram-khe">TRÁM KHE</a></li>
<li id="menu-item-4227" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4227"><a href="https://sikalongan.com/san-pham/vua-kho-tron-san">VỮA KHÔ TRỘN SẴN</a></li>
<li id="menu-item-4228" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4228"><a href="https://sikalongan.com/san-pham/vua-rot-dinh-vi">VỮA RÓT ĐỊNH VỊ</a></li>
<li id="menu-item-4229" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4229"><a href="https://sikalongan.com/san-pham/vua-tu-san-bang">VỮA TỰ SAN BẰNG</a></li>
</ul>
</div>
</aside>
<aside id="nav_menu-3" class="widget widget_nav_menu"><span class="widget-title "><span>THƯƠNG HIỆU</span></span></p>
<div class="is-divider small"></div>
<div class="menu-thuong-hieu-container">
<ul id="menu-thuong-hieu" class="menu">
<li id="menu-item-4231" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4231"><a href="https://sikalongan.com/thuong-hieu/basf">BASF</a></li>
<li id="menu-item-4232" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4232"><a href="https://sikalongan.com/thuong-hieu/bestmix">BESTMIX</a></li>
<li id="menu-item-4233" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4233"><a href="https://sikalongan.com/thuong-hieu/cover">COVER</a></li>
<li id="menu-item-4234" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4234"><a href="https://sikalongan.com/thuong-hieu/khac">KHÁC</a></li>
<li id="menu-item-4235" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4235"><a href="https://sikalongan.com/thuong-hieu/kova">KOVA</a></li>
<li id="menu-item-4236" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4236"><a href="https://sikalongan.com/thuong-hieu/mapei">MAPEI</a></li>
<li id="menu-item-4237" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4237"><a href="https://sikalongan.com/thuong-hieu/penetron">PENETRON</a></li>
<li id="menu-item-4238" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4238"><a href="https://sikalongan.com/thuong-hieu/shell">SHELL</a></li>
<li id="menu-item-4239" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4239"><a href="https://sikalongan.com/sika">SIKA</a></li>
<li id="menu-item-4240" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4240"><a href="https://sikalongan.com/son-tinh">SƠN TINH</a></li>
<li id="menu-item-4241" class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4241"><a href="https://sikalongan.com/thuong-hieu/weber">WEBER</a></li>
</ul>
</div>
</aside>
<aside id="block-4" class="widget widget_block">
<p><span class="widget-title"><br />
<span>HOTLINE</span></span></p>
<p><img src="/sikalongan.com/images/pages/trang-chu-1.jpg"></p>
<div class="hotline"><img src="/sikalongan.com/images/pages/trang-chu-2.png"></div>
</p>
<div class="sdt"><a href="tel:0909933575">0909 933 575</a>
</div>
</aside>
<aside id="block-2" class="widget widget_block">
<p><span class="widget-title"><br />
<span>FACEBOOK</span></span></p>
<p><iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcongtyhuynhtoan%2F&amp;tabs=timeline&amp;width=340&amp;height=150&amp;small_header=false&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId" width="340" height="150" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></p>
</aside>
<aside id="block-3" class="widget widget_block">
<p><span class="widget-title"><br />
<span>QUÉT MÃ QR</span></span></p>
<p><span class="ketnoi">KẾT NỐI ZALO VỚI SIKA LONG AN</span></p>
<p><img src="/sikalongan.com/images/pages/trang-chu-3.jpg"></p>
</aside>
<aside id="block-9" class="widget widget_block widget_media_image">
<div class="wp-block-image">
<figure class="aligncenter size-full is-resized"><a href="/sikalongan.com/images/pages/trang-chu-4.png"><img src="/sikalongan.com/images/pages/trang-chu-4.png" alt="" class="wp-image-4745" width="242" height="804" /></a></figure>
</div>
</aside>
</ul></div>
</p></div>
<div id="col-885419741" class="col medium-9 small-12 large-9"  >
<div class="col-inner"  >
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">VẬT LIỆU CHỐNG THẤM</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4777 status-publish first instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-5.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4777" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu nội thất Kanshield Max&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4767 status-publish instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-6.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4767" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu ngoại thất Kanshield Plush&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4495 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikatop-109-seal-vn"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-7.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikatop-109-seal-vn" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4495" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaTop®-109 Seal VN&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4493 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-monotop-166-migrating"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-8.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-monotop-166-migrating" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4493" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sika MonoTop®-166 Migrating&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4491 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-632-r"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-9.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-632-r" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4491" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-632 R&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4489 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-590"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-10.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-590" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4489" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-590&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4487 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-110"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-11.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-110" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4487" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-110&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4485 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikacoat-plus"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-12.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikacoat-plus" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4485" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaCoat Plus&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4443 status-publish last instock product_cat-bestmix product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-waterbar-v20-eco"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-13.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-waterbar-v20-eco" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4443" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA WATERBAR V20 ECO&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4441 status-publish first instock product_cat-bestmix product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/separol-25l"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-14.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/separol-25l" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4441" data-product_sku="" aria-label="Đọc thêm về &ldquo;Separol - 25l&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4403 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-20-crack-seal-ab"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-15.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-20-crack-seal-ab" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4403" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikadur 20 Crack Seal (AB)&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4401 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikaflex-construction-j-g"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-16.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikaflex-construction-j-g" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4401" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikaflex Construction (j) G&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4399 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-tilebond-gp-25-kg-keo-dan-gach"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-17.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-tilebond-gp-25-kg-keo-dan-gach" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4399" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sika Tilebond GP - 25 kg - keo dán gạch&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4397 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-590-20kg-chong-tham-san-mai"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-18.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-590-20kg-chong-tham-san-mai" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4397" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic 590-20kg - chống thấm sàn mái&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4395 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-731"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-19.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-731" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4395" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikadur 731&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4393 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikatop-seal-107"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-20.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikatop-seal-107" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4393" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaTop Seal 107&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="banner has-hover" id="banner-297717715">
<div class="banner-inner fill">
<div class="banner-bg fill" >
<div class="bg fill bg-fill "></div>
<div class="overlay"></div>
</p></div>
<div class="banner-layers container">
<div class="fill banner-link"></div>
<div id="text-box-1167168162" class="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text">
<div class="text-box-content text dark">
<div class="text-inner text-center">
<h3 class="uppercase">CÔNG TY TNHH SẢN XUẤT SƠN HUỲNH TOÀN</h3>
<p><span style="font-size: 100%;">Chuyên cung cấp đa dạng chủng loại sơn bao gồm sơn lót, sơn chống thấm, sơn nước nội thất, sơn ánh kim, sơn giả gỗ, sơn ngoại thất,… Đến với Huỳnh Toàn là đến với dòng sơn chất lượng, an toàn, giá cả hợp lý, là sự lựa chọn hàng đầu của người dân trên toàn quốc.</span></p>
<p><a data-animate="bounceInUp" href="http://sikalongan.com/san-pham" target="_self" class="button white lowercase"  ><br />
    <span>Xem sản phẩm</span><br />
  <i class="icon-angle-right" ></i></a></p></div>
</p></div>
<style>
#text-box-1167168162 {
  width: 60%;
}
#text-box-1167168162 .text-box-content {
  font-size: 100%;
}
</style>
</p></div>
</p></div>
</p></div>
<div class="height-fix is-invisible"><img width="1979" height="674" src="/sikalongan.com/images/pages/trang-chu-21.jpg" class="attachment-original size-original" alt="" /></div>
<style>
#banner-297717715 .bg.bg-loaded {
  background-image: url(/sikalongan.com/images/pages/trang-chu-21.jpg);
}
#banner-297717715 .overlay {
  background-color: rgba(0, 0, 0, 0.285);
}
</style>
</p></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">SƠN KANSHIELD</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4777 status-publish instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-5.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4777" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu nội thất Kanshield Max&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4773 status-publish last instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-lot-chong-kiem-cao-cap-kanshield-curved"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-22.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-lot-chong-kiem-cao-cap-kanshield-curved" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4773" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn lót chống kiềm cao cấp Kanshield Curved&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4767 status-publish first instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-6.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4767" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu ngoại thất Kanshield Plush&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4707 status-publish instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-tuong-trong-nha-kanshield"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-23.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-tuong-trong-nha-kanshield" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4707" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét tường trong nhà Kanshield&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4705 status-publish last instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-ngoai-that-kanshield"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-24.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-ngoai-that-kanshield" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4705" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp ngoại thất Kanshield&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4701 status-publish first instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-chong-tham-kanshield-ks9999"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-25.png" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-chong-tham-kanshield-ks9999" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4701" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn chống thấm KANSHIELD KS9999&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4691 status-publish instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-26.png" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4691" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp KANSHIELD KS3333&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4690 status-publish last instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-27.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4690" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nước ngoại thất Kanshield KS 2222&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4684 status-publish first instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/kanshield-ks1111"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-28.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/kanshield-ks1111" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4684" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nước trong nhà KANSHIELD KS1111&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4483 status-publish instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-29.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4483" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp Kanshield KS3333&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4481 status-publish last instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-noi-that-cao-cap-kanshield-ks6666"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-30.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-noi-that-cao-cap-kanshield-ks6666" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4481" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nội thất cao cấp Kanshield KS6666&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4477 status-publish first instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-bong-cao-cap-kanshield-ks8888-5l"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-31.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-bong-cao-cap-kanshield-ks8888-5l" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4477" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn bóng cao cấp Kanshield KS8888 5L&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="banner has-hover" id="banner-1449958397">
<div class="banner-inner fill">
<div class="banner-bg fill" >
<div class="bg fill bg-fill "></div>
<div class="overlay"></div>
</p></div>
<div class="banner-layers container">
<div class="fill banner-link"></div>
<div id="text-box-368701485" class="text-box banner-layer x95 md-x95 lg-x95 y50 md-y50 lg-y50 res-text">
<div class="text-box-content text ">
<div class="text-inner text-center">
<p style="text-align: center;"><span style="font-size: 150%; color: #ffffff;">Liên hệ ngay để được tư vấn miễn phí</span></p>
<p><a href="tel:0909933575" target="_self" class="button primary is-larger lowercase"  ><br />
  <i class="icon-phone" ></i>  <span>0909 933 575</span><br />
  </a></p></div>
</p></div>
<style>
#text-box-368701485 {
  width: 60%;
}
#text-box-368701485 .text-box-content {
  font-size: 100%;
}
@media (min-width:550px) {
  #text-box-368701485 {
    width: 40%;
  }
}
</style>
</p></div>
</p></div>
</p></div>
<div class="height-fix is-invisible"><img width="2000" height="700" src="/sikalongan.com/images/pages/trang-chu-32.jpg" class="attachment-original size-original" alt="" /></div>
<style>
#banner-1449958397 .bg.bg-loaded {
  background-image: url(/sikalongan.com/images/pages/trang-chu-32.jpg);
}
#banner-1449958397 .overlay {
  background-color: rgba(84, 84, 84, 0.349);
}
</style>
</p></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">VỮA RÓT &#8211; ĐỊNH VỊ</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4557 status-publish instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-212-11"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-33.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-212-11" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4557" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 212-11&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4540 status-publish last instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-42mp"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-34.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-42mp" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4540" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 42MP&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4537 status-publish first instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-214-11-hs"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-35.jpeg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-214-11-hs" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4537" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 214-11 HS&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4534 status-publish instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-214-11-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-36.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-214-11-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4534" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 214-11&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4497 status-publish last instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-gp"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-37.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-gp" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4497" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaGrout® GP&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4565 status-publish first instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-731-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-38.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-731-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4565" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 731&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4562 status-publish instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-732"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-39.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-732" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4562" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 732&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4556 status-publish last instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-752"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-40.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-752" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4556" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 752&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4549 status-publish first instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-20-crack-seal"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-41.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-20-crack-seal" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4549" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 20 CRACK SEAL&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4538 status-publish instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-anchorfix-3001"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-42.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-anchorfix-3001" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4538" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA ANCHORFIX 3001&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4533 status-publish last instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-anchorfix-s"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-43.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-anchorfix-s" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4533" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA ANCHORFIX S&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
</p></div>
</p></div>
</div></div>
<style>
#section_1520352321 {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
</section>
<section class="section dark hide-for-small" id="section_1084277704">
<div class="bg section-bg fill bg-fill  " >
<div class="section-bg-overlay absolute fill"></div>
<div class="loading-spin centered"></div>
</p></div>
<div class="section-content relative">
<div class="row"  id="row-366659947">
<div id="col-425291881" class="col medium-8 small-12 large-8"  >
<div class="col-inner"  >
<div class="slider-wrapper relative hide-for-small" id="slider-775018250" >
<div class="slider slider-nav-circle slider-nav-large slider-nav-light slider-style-normal"
        data-flickity-options='{
            "cellAlign": "center",
            "imagesLoaded": true,
            "lazyLoad": 1,
            "freeScroll": false,
            "wrapAround": true,
            "autoPlay": 6000,
            "pauseAutoPlayOnHover" : true,
            "prevNextButtons": true,
            "contain" : true,
            "adaptiveHeight" : true,
            "dragThreshold" : 10,
            "percentPosition": true,
            "pageDots": false,
            "rightToLeft": false,
            "draggable": false,
            "selectedAttraction": 0.1,
            "parallax" : 0,
            "friction": 0.6        }'
        ></p>
<div class="row"  id="row-1535713335">
<div id="col-1846560017" class="col small-12 large-12"  >
<div class="col-inner"  >
<div class="icon-box testimonial-box icon-box-center text-center is-small">
<div class="icon-box-img testimonial-image circle" style="width: 100px">
              <img width="150" height="150" src="/sikalongan.com/images/pages/trang-chu-44.png" class="attachment-thumbnail size-thumbnail" alt="" />        </div>
<div class="icon-box-text p-last-0">
<div class="star-rating"><span style="width:100%"><strong class="rating"></strong></span></div>
<div class="testimonial-text line-height-small italic test_text first-reset last-reset is-italic">
<p style="text-align: center;">Huỳnh Toàn cho tôi những lời khuyên chuyên nghiệp trong việc lựa chọn màu sắc và vật liệu là tuyệt vời! Giá cả phù hợp, tư vấn nhiệt tình luôn luôn hỗ trợ một cách chu đáo</p>
<p style="text-align: center;"><span style="font-size: 115%;"><strong>Nguyễn Sinh An</strong></span></p>
</p></div>
<div class="testimonial-meta pt-half">
             <strong class="testimonial-name test_name"></strong><br />
                          <span class="testimonial-company test_company"></span>
          </div>
</p></div>
</p></div>
</p></div>
</p></div>
<style>
#row-1535713335 > .col > .col-inner {
  padding: 40px 0px 0px 0px;
}
</style>
</div>
<div class="row"  id="row-2109995476">
<div id="col-429513692" class="col small-12 large-12"  >
<div class="col-inner"  >
<div class="icon-box testimonial-box icon-box-center text-center is-small">
<div class="icon-box-img testimonial-image circle" style="width: 100px">
              <img width="150" height="150" src="/sikalongan.com/images/pages/trang-chu-45.png" class="attachment-thumbnail size-thumbnail" alt="" />        </div>
<div class="icon-box-text p-last-0">
<div class="star-rating"><span style="width:100%"><strong class="rating"></strong></span></div>
<div class="testimonial-text line-height-small italic test_text first-reset last-reset is-italic">
<p style="text-align: center;">Tôi đánh giá cao ở khâu chăm sóc khách hàng của Huỳnh Toàn, ở đây không chỉ tư vấn cho bạn lựa chọn loại sơn phù hợp mà còn hỗ trợ rất nhiệt tình các vấn đề tôi gặp phải trong quá trình sử dụng sơn</p>
<p style="text-align: center;"><span style="font-size: 115%;"><strong>Trần Thúy Liễu</strong></span></p>
</p></div>
<div class="testimonial-meta pt-half">
             <strong class="testimonial-name test_name"></strong><br />
                          <span class="testimonial-company test_company"></span>
          </div>
</p></div>
</p></div>
</p></div>
</p></div>
<style>
#row-2109995476 > .col > .col-inner {
  padding: 40px 0px 0px 0px;
}
</style>
</div></div>
<div class="loading-spin dark large centered"></div>
</p></div>
</p></div>
</p></div>
</div></div>
<style>
#section_1084277704 {
  padding-top: 30px;
  padding-bottom: 30px;
}
#section_1084277704 .section-bg-overlay {
  background-color: rgba(19, 19, 19, 0.331);
}
#section_1084277704 .section-bg.bg-loaded {
  background-image: url(/sikalongan.com/images/pages/trang-chu-bg-2.jpg);
}
</style>
</section>
<section class="section hide-for-medium" id="section_1591011583">
<div class="bg section-bg fill bg-fill  bg-loaded" ></div>
<div class="section-content relative">
<div class="row"  id="row-109636543">
<div id="col-1796006941" class="col small-12 large-12"  >
<div class="col-inner"  >
<div class="title-about">Đối tác</div>
</p></div>
</p></div>
<div id="col-1468300122" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<div class="img has-hover x md-x lg-x y md-y lg-y" id="image_1543703613">
<div class="img-inner dark" >
			<img width="465" height="210" src="/sikalongan.com/images/pages/trang-chu-46.jpg" class="attachment-original size-original" alt="" />
					</div>
<style>
#image_1543703613 {
  width: 100%;
}
</style>
</p></div>
</p></div>
</p></div>
<div id="col-726639227" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<div class="img has-hover x md-x lg-x y md-y lg-y" id="image_63765349">
<div class="img-inner dark" >
			<img width="465" height="210" src="/sikalongan.com/images/pages/trang-chu-47.jpg" class="attachment-original size-original" alt="" />
					</div>
<style>
#image_63765349 {
  width: 100%;
}
</style>
</p></div>
</p></div>
</p></div>
<div id="col-233780902" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<div class="img has-hover x md-x lg-x y md-y lg-y" id="image_556782319">
<div class="img-inner dark" >
			<img width="465" height="210" src="/sikalongan.com/images/pages/trang-chu-48.jpg" class="attachment-original size-original" alt="" />
					</div>
<style>
#image_556782319 {
  width: 100%;
}
</style>
</p></div>
</p></div>
</p></div>
<div id="col-2098075147" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<div class="img has-hover x md-x lg-x y md-y lg-y" id="image_398602095">
<div class="img-inner dark" >
			<img width="465" height="210" src="/sikalongan.com/images/pages/trang-chu-49.jpg" class="attachment-original size-original" alt="" />
					</div>
<style>
#image_398602095 {
  width: 100%;
}
</style>
</p></div>
</p></div>
</p></div>
</div></div>
<style>
#section_1591011583 {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
</section>
<section class="section show-for-small" id="section_1446060487">
<div class="bg section-bg fill bg-fill  bg-loaded" ></div>
<div class="section-content relative">
<div class="row"  id="row-681855859">
<div id="col-1563677614" class="col medium-9 small-12 large-9"  >
<div class="col-inner"  >
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">VẬT LIỆU CHỐNG THẤM</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4777 status-publish first instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-5.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4777" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu nội thất Kanshield Max&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4767 status-publish instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-6.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4767" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu ngoại thất Kanshield Plush&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4495 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikatop-109-seal-vn"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-7.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikatop-109-seal-vn" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4495" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaTop®-109 Seal VN&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4493 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-monotop-166-migrating"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-8.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-monotop-166-migrating" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4493" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sika MonoTop®-166 Migrating&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4491 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-632-r"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-9.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-632-r" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4491" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-632 R&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4489 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-590"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-10.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-590" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4489" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-590&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4487 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-110"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-11.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-110" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4487" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic®-110&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4485 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikacoat-plus"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-12.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikacoat-plus" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4485" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaCoat Plus&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4443 status-publish last instock product_cat-bestmix product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-waterbar-v20-eco"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-13.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-waterbar-v20-eco" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4443" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA WATERBAR V20 ECO&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4441 status-publish first instock product_cat-bestmix product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/separol-25l"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-14.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/separol-25l" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4441" data-product_sku="" aria-label="Đọc thêm về &ldquo;Separol - 25l&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4403 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-20-crack-seal-ab"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-15.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-20-crack-seal-ab" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4403" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikadur 20 Crack Seal (AB)&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4401 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikaflex-construction-j-g"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-16.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikaflex-construction-j-g" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4401" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikaflex Construction (j) G&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4399 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-tilebond-gp-25-kg-keo-dan-gach"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-17.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-tilebond-gp-25-kg-keo-dan-gach" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4399" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sika Tilebond GP - 25 kg - keo dán gạch&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4397 status-publish instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikalastic-590-20kg-chong-tham-san-mai"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-18.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikalastic-590-20kg-chong-tham-san-mai" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4397" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikalastic 590-20kg - chống thấm sàn mái&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4395 status-publish last instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-731"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-19.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-731" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4395" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sikadur 731&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4393 status-publish first instock product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikatop-seal-107"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-20.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikatop-seal-107" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4393" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaTop Seal 107&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">SƠN KANSHIELD</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4777 status-publish instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-5.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-noi-that-kanshield-max" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4777" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu nội thất Kanshield Max&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4773 status-publish last instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-lot-chong-kiem-cao-cap-kanshield-curved"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-22.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-lot-chong-kiem-cao-cap-kanshield-curved" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4773" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn lót chống kiềm cao cấp Kanshield Curved&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4767 status-publish first instock product_cat-san-pham product_cat-son-kanshield product_cat-vat-lieu-chong-tham has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-6.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/chong-tham-pha-mau-ngoai-that-kanshield-plush" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4767" data-product_sku="" aria-label="Đọc thêm về &ldquo;Chống thấm pha màu ngoại thất Kanshield Plush&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4707 status-publish instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-tuong-trong-nha-kanshield"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-23.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-tuong-trong-nha-kanshield" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4707" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét tường trong nhà Kanshield&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4705 status-publish last instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-ngoai-that-kanshield"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-24.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-ngoai-that-kanshield" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4705" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp ngoại thất Kanshield&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4701 status-publish first instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-chong-tham-kanshield-ks9999"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-25.png" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-chong-tham-kanshield-ks9999" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4701" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn chống thấm KANSHIELD KS9999&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4691 status-publish instock product_cat-san-pham product_cat-bot-tret-tuong product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-26.png" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4691" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp KANSHIELD KS3333&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4690 status-publish last instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-27.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4690" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nước ngoại thất Kanshield KS 2222&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4684 status-publish first instock product_cat-san-pham product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/kanshield-ks1111"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-28.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/kanshield-ks1111" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4684" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nước trong nhà KANSHIELD KS1111&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4483 status-publish instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-29.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/bot-tret-cao-cap-kanshield-ks3333" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4483" data-product_sku="" aria-label="Đọc thêm về &ldquo;Bột trét cao cấp Kanshield KS3333&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4481 status-publish last instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-noi-that-cao-cap-kanshield-ks6666"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-30.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-noi-that-cao-cap-kanshield-ks6666" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4481" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn nội thất cao cấp Kanshield KS6666&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4477 status-publish first instock product_cat-son-kanshield has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/son-bong-cao-cap-kanshield-ks8888-5l"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-31.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/son-bong-cao-cap-kanshield-ks8888-5l" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4477" data-product_sku="" aria-label="Đọc thêm về &ldquo;Sơn bóng cao cấp Kanshield KS8888 5L&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">VỮA RÓT &#8211; ĐỊNH VỊ</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4557 status-publish instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-212-11"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-33.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-212-11" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4557" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 212-11&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4540 status-publish last instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-42mp"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-34.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-42mp" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4540" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 42MP&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4537 status-publish first instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-214-11-hs"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-35.jpeg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-214-11-hs" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4537" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 214-11 HS&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4534 status-publish instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-214-11-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-36.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-214-11-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4534" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKAGROUT 214-11&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4497 status-publish last instock product_cat-vua-rot-dinh-vi has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikagrout-gp"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-37.webp" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikagrout-gp" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4497" data-product_sku="" aria-label="Đọc thêm về &ldquo;SikaGrout® GP&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
<div class="title">
<h3><span style="color: #0000ff; font-size: 90%;">CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO</span></h3>
</div>
<div class="row large-columns-4 medium-columns-3 small-columns-2 row-small has-shadow row-box-shadow-1 row-box-shadow-1-hover">
<div class="product-small col has-hover product type-product post-4565 status-publish first instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-731-2"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-38.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-731-2" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4565" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 731&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4562 status-publish instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-732"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-39.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-732" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4562" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 732&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4556 status-publish last instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-752"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-40.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-752" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4556" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 752&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4549 status-publish first instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sikadur-20-crack-seal"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-41.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sikadur-20-crack-seal" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4549" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKADUR 20 CRACK SEAL&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4538 status-publish instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-anchorfix-3001"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-42.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-anchorfix-3001" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4538" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA ANCHORFIX 3001&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div>
<div class="product-small col has-hover product type-product post-4533 status-publish last instock product_cat-san-pham product_cat-chat-ket-dinh-cuong-do-cao has-post-thumbnail shipping-taxable product-type-simple">
<div class="col-inner">
<div class="badge-container absolute left top z-1">
</div>
<div class="product-small box ">
<div class="box-image">
<div class="image-zoom">
				<a href="https://sikalongan.com/sika-anchorfix-s"><br />
					<img width="300" height="300" src="/sikalongan.com/images/pages/trang-chu-43.jpg" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" />				</a>
			</div>
<div class="image-tools is-small top right show-on-hover">
							</div>
<div class="image-tools is-small hide-for-small bottom left show-on-hover">
							</div>
<div class="image-tools grid-tools text-center hide-for-small bottom hover-slide-in show-on-hover">
							</div>
</p></div>
<div class="box-text box-text-products text-center grid-style-2">
<div class="title-wrapper"></div>
<div class="price-wrapper"></div>
<div class="add-to-cart-button"><a href="https://sikalongan.com/sika-anchorfix-s" data-quantity="1" class="primary is-small mb-0 button product_type_simple is-bevel" data-product_id="4533" data-product_sku="" aria-label="Đọc thêm về &ldquo;SIKA ANCHORFIX S&rdquo;" rel="nofollow">Đọc tiếp</a></div>
</p></div>
</p></div>
</p></div>
</div></div>
</p></div>
</p></div>
<div id="col-170819443" class="col medium-3 small-12 large-3"  >
<div class="col-inner"  >
<ul class="sidebar-wrapper ul-reset">
<aside id="nav_menu-2" class="widget widget_nav_menu"><span class="widget-title "><span>DANH MỤC SẢN PHẨM</span></span></p>
<div class="is-divider small"></div>
<div class="menu-danh-muc-san-pham-container">
<ul id="menu-danh-muc-san-pham-1" class="menu">
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4226"><a href="https://sikalongan.com/san-pham/vat-lieu-chong-tham">VẬT LIỆU CHỐNG THẤM</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4209"><a href="https://sikalongan.com/san-pham/bot-tret-tuong">BỘT TRÉT TƯỜNG</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4210"><a href="https://sikalongan.com/san-pham/chat-bao-ve-thep">CHẤT BẢO VỆ THÉP</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4211"><a href="https://sikalongan.com/san-pham/chat-ket-dinh-cuong-do-cao">CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4212"><a href="https://sikalongan.com/san-pham/chat-tay-ri">CHẤT TẨY RỈ</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4213"><a href="https://sikalongan.com/san-pham/keo-cha-ron">KEO CHÀ RON</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4214"><a href="https://sikalongan.com/san-pham/keo-dan-gach">KEO DÁN GẠCH</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4215"><a href="https://sikalongan.com/san-pham/keo-pu-truong-no">KEO PU TRƯƠNG NỞ</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4216"><a href="https://sikalongan.com/san-pham/keo-silicone">KEO SILICONE</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4217"><a href="https://sikalongan.com/san-pham/lop-phu-va-bao-ve-san">LỚP PHỦ VÀ BẢO VỆ SÀN</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4218"><a href="https://sikalongan.com/san-pham/luoi-thuy-tinh">LƯỚI THỦY TINH</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4219"><a href="https://sikalongan.com/san-pham/mang-chong-tham">MÀNG CHỐNG THẤM</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4220"><a href="https://sikalongan.com/san-pham/may-bom-keo">MÁY BƠM KEO</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4221"><a href="https://sikalongan.com/san-pham/phu-gia-be-tong">PHỤ GIA BÊ TÔNG</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4222"><a href="https://sikalongan.com/san-pham/san-pham-ho-tro-be-tong">SẢN PHẨM HỖ TRỢ BÊ TÔNG</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4223"><a href="https://sikalongan.com/san-pham/son-chong-nong">SƠN CHỐNG NÓNG</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4224"><a href="https://sikalongan.com/san-pham/sua-chua-va-bao-ve-be-tong">SỮA CHỮA VÀ BẢO VỆ BÊ TÔNG</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4225"><a href="https://sikalongan.com/san-pham/tram-khe">TRÁM KHE</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4227"><a href="https://sikalongan.com/san-pham/vua-kho-tron-san">VỮA KHÔ TRỘN SẴN</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4228"><a href="https://sikalongan.com/san-pham/vua-rot-dinh-vi">VỮA RÓT ĐỊNH VỊ</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4229"><a href="https://sikalongan.com/san-pham/vua-tu-san-bang">VỮA TỰ SAN BẰNG</a></li>
</ul>
</div>
</aside>
<aside id="nav_menu-3" class="widget widget_nav_menu"><span class="widget-title "><span>THƯƠNG HIỆU</span></span></p>
<div class="is-divider small"></div>
<div class="menu-thuong-hieu-container">
<ul id="menu-thuong-hieu-1" class="menu">
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4231"><a href="https://sikalongan.com/thuong-hieu/basf">BASF</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4232"><a href="https://sikalongan.com/thuong-hieu/bestmix">BESTMIX</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4233"><a href="https://sikalongan.com/thuong-hieu/cover">COVER</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4234"><a href="https://sikalongan.com/thuong-hieu/khac">KHÁC</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4235"><a href="https://sikalongan.com/thuong-hieu/kova">KOVA</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4236"><a href="https://sikalongan.com/thuong-hieu/mapei">MAPEI</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4237"><a href="https://sikalongan.com/thuong-hieu/penetron">PENETRON</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4238"><a href="https://sikalongan.com/thuong-hieu/shell">SHELL</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4239"><a href="https://sikalongan.com/sika">SIKA</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4240"><a href="https://sikalongan.com/son-tinh">SƠN TINH</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4241"><a href="https://sikalongan.com/thuong-hieu/weber">WEBER</a></li>
</ul>
</div>
</aside>
<aside id="block-4" class="widget widget_block">
<p><span class="widget-title"><br />
<span>HOTLINE</span></span></p>
<p><img src="/sikalongan.com/images/pages/trang-chu-1.jpg"></p>
<div class="hotline"><img src="/sikalongan.com/images/pages/trang-chu-2.png"></div>
</p>
<div class="sdt"><a href="tel:0909933575">0909 933 575</a>
</div>
</aside>
<aside id="block-2" class="widget widget_block">
<p><span class="widget-title"><br />
<span>FACEBOOK</span></span></p>
<p><iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcongtyhuynhtoan%2F&amp;tabs=timeline&amp;width=340&amp;height=150&amp;small_header=false&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId" width="340" height="150" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></p>
</aside>
<aside id="block-3" class="widget widget_block">
<p><span class="widget-title"><br />
<span>QUÉT MÃ QR</span></span></p>
<p><span class="ketnoi">KẾT NỐI ZALO VỚI SIKA LONG AN</span></p>
<p><img src="/sikalongan.com/images/pages/trang-chu-3.jpg"></p>
</aside>
<aside id="block-9" class="widget widget_block widget_media_image">
<div class="wp-block-image">
<figure class="aligncenter size-full is-resized"><a href="/sikalongan.com/images/pages/trang-chu-4.png"><img src="/sikalongan.com/images/pages/trang-chu-4.png" alt="" class="wp-image-4745" width="242" height="804" /></a></figure>
</div>
</aside>
</ul></div>
</p></div>
</div></div>
<style>
#section_1446060487 {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
</section>
$pa4e$, $pa4f$index.html$pa4f$, '4', TIMESTAMP '2019-02-27 05:54:32');

INSERT INTO public.articletb (
    articleid, username, articlelink, articlecategory, articlelangcode, articlesubcategory,
    articletitle, articlekeyword, articlethumnailurl, articledescription, articlecontent,
    createdtime, modifiedtime, isvisible, isapproved, islocked, rejectedbyuser,
    rejectedreason, articletime, originauthor, menustringid, viewcount, rating, postid,
    articletemplate, "index"
)
SELECT page.articleid, 'sikalongan', page.articlelink, 'page', 'vi', 'none',
       page.title, 'Sika Long An, Huỳnh Toàn, Sika, Kanshield',
       '/sikalongan.com/images/product-placeholder.svg', page.description, page.content,
       page.published_at, CURRENT_TIMESTAMP, TRUE, TRUE, FALSE, 'none', 'none',
       page.published_at, 'Công ty Huỳnh Toàn', 'none', 0, 0, 'n', page.template, page.sort_index
FROM tmp_sikalongan_pages page
WHERE NOT EXISTS (SELECT 1 FROM public.articletb a WHERE a.articleid = page.articleid);

UPDATE public.articletb a SET
    articlelink=page.articlelink, articletitle=page.title, articledescription=page.description,
    articlecontent=page.content, articletemplate=page.template, "index"=page.sort_index,
    isvisible=TRUE, isapproved=TRUE, islocked=FALSE, modifiedtime=CURRENT_TIMESTAMP
FROM tmp_sikalongan_pages page WHERE a.articleid=page.articleid;

-- Product catalogs from the source taxonomy.
CREATE TEMP TABLE tmp_sikalongan_catalogs (code text, name text, sort_index integer) ON COMMIT DROP;
INSERT INTO tmp_sikalongan_catalogs VALUES
($ca0a$bot-tret-tuong$ca0a$, $ca0b$BỘT TRÉT TƯỜNG$ca0b$, 1),
($ca1a$chat-bao-ve-thep$ca1a$, $ca1b$CHẤT BẢO VỆ THÉP$ca1b$, 2),
($ca2a$chat-ket-dinh-cuong-do-cao$ca2a$, $ca2b$CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$ca2b$, 3),
($ca3a$lop-phu-va-bao-ve-san$ca3a$, $ca3b$LỚP PHỦ VÀ BẢO VỆ SÀN$ca3b$, 4),
($ca4a$mang-chong-tham$ca4a$, $ca4b$MÀNG CHỐNG THẤM$ca4b$, 5),
($ca5a$san-pham-ho-tro-be-tong$ca5a$, $ca5b$SẢN PHẨM HỖ TRỢ BÊ TÔNG$ca5b$, 6),
($ca6a$son-kanshield$ca6a$, $ca6b$SƠN KANSHIELD$ca6b$, 7),
($ca7a$tram-khe$ca7a$, $ca7b$TRÁM KHE$ca7b$, 8),
($ca8a$vat-lieu-chong-tham$ca8a$, $ca8b$Vật liệu chống thấm$ca8b$, 9),
($ca9a$vua-kho-tron-san$ca9a$, $ca9b$VỮA KHÔ TRỘN SẴN$ca9b$, 10),
($ca10a$vua-rot-dinh-vi$ca10a$, $ca10b$VỮA RÓT ĐỊNH VỊ$ca10b$, 11),
($ca11a$vua-tu-san-bang$ca11a$, $ca11b$VỮA TỰ SAN BẰNG$ca11b$, 12);

INSERT INTO public.productcatalogtb (catalogname, catalogcode, catalogshortdes, cataloglongdes, catalogimageurl1, catalogimagedesurl, catalogvideoadd, language, path, createdtime, modifiedtime, isvisible, isapproved, islocked, catalogindex)
SELECT c.name, c.code, c.name, c.name || ' tại Sika Long An – Huỳnh Toàn.', 'none', 'none', 'none', 'vi', c.code, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, TRUE, FALSE, c.sort_index
FROM tmp_sikalongan_catalogs c
WHERE NOT EXISTS (SELECT 1 FROM public.productcatalogtb pc WHERE lower(pc.catalogcode)=lower(c.code));

UPDATE public.productcatalogtb pc SET catalogname=c.name, catalogshortdes=c.name, cataloglongdes=c.name || ' tại Sika Long An – Huỳnh Toàn.', isvisible=TRUE, isapproved=TRUE, islocked=FALSE, catalogindex=c.sort_index, modifiedtime=CURRENT_TIMESTAMP
FROM tmp_sikalongan_catalogs c WHERE lower(pc.catalogcode)=lower(c.code);

-- Brands represented in the captured catalog.
CREATE TEMP TABLE tmp_sikalongan_brands (code text, name text, description text) ON COMMIT DROP;
INSERT INTO tmp_sikalongan_brands VALUES
($br0a$sika$br0a$, $br0b$Sika$br0b$, $br0c$Hóa chất xây dựng và giải pháp kỹ thuật Sika.$br0c$),
($br1a$kanshield$br1a$, $br1b$Kanshield$br1b$, $br1c$Sơn và chống thấm Kanshield.$br1c$),
($br2a$bestmix$br2a$, $br2b$BestMix$br2b$, $br2c$Sản phẩm vật liệu xây dựng BestMix.$br2c$);

INSERT INTO public.productbrandtb (brandname, brandcode, brandshortdes, brandlongdes, brandimageurl1, brandimagedesurl, brandvideoadd, language, path, createdtime, modifiedtime, isvisible, isapproved, islocked)
SELECT b.name, b.code, b.description, b.description, 'none', 'none', 'none', 'vi', b.code, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE, TRUE, FALSE
FROM tmp_sikalongan_brands b
WHERE NOT EXISTS (SELECT 1 FROM public.productbrandtb pb WHERE lower(pb.brandcode)=lower(b.code));

UPDATE public.productbrandtb pb SET brandname=b.name, brandshortdes=b.description, brandlongdes=b.description, isvisible=TRUE, isapproved=TRUE, islocked=FALSE, modifiedtime=CURRENT_TIMESTAMP
FROM tmp_sikalongan_brands b WHERE lower(pb.brandcode)=lower(b.code);

-- Complete product catalog: descriptions and local image paths are preserved from the source.
CREATE TEMP TABLE tmp_sikalongan_products (
    row_no integer, source_id integer, product_code text, product_slug text, product_name text,
    catalog_code text, brand_code text, category_names text, short_description text,
    long_description text, image_urls text, featured_image text, published_at timestamp
) ON COMMIT DROP;

INSERT INTO tmp_sikalongan_products VALUES
(1, 4777, $pr0a$SIKALONGAN-4777$pr0a$, $pr0b$chong-tham-pha-mau-noi-that-kanshield-max$pr0b$, $pr0c$Chống thấm pha màu nội thất Kanshield Max$pr0c$, $pr0d$vat-lieu-chong-tham$pr0d$, $pr0e$kanshield$pr0e$, $pr0f$Sản phẩm | SƠN KANSHIELD | Vật liệu chống thấm$pr0f$, $pr0g$Chống thấm pha màu nội thất Kanshield Max – liên hệ để được tư vấn kỹ thuật và báo giá.$pr0g$, $pr0h$<p><img class="aligncenter size-full wp-image-4780" src="/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-2.png" alt="" width="594" height="839" /></p>
<p><img class="aligncenter size-full wp-image-4779" src="/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-3.png" alt="" width="594" height="839" /></p>$pr0h$, $pr0i$/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-1.jpg
/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-2.png
/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-3.png$pr0i$, $pr0j$/sikalongan.com/images/products/chong-tham-pha-mau-noi-that-kanshield-max-1.jpg$pr0j$, TIMESTAMP '2023-09-29 05:25:47'),
(2, 4773, $pr1a$SIKALONGAN-4773$pr1a$, $pr1b$son-lot-chong-kiem-cao-cap-kanshield-curved$pr1b$, $pr1c$Sơn lót chống kiềm cao cấp Kanshield Curved$pr1c$, $pr1d$son-kanshield$pr1d$, $pr1e$kanshield$pr1e$, $pr1f$Sản phẩm | SƠN KANSHIELD$pr1f$, $pr1g$Sơn lót chống kiềm cao cấp Kanshield Curved – liên hệ để được tư vấn kỹ thuật và báo giá.$pr1g$, $pr1h$<p><img class="aligncenter size-full wp-image-4776" src="/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-2.png" alt="" width="594" height="840" /></p>
<p><img class="aligncenter size-full wp-image-4775" src="/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-3.png" alt="" width="594" height="841" /></p>$pr1h$, $pr1i$/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-1.jpg
/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-2.png
/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-3.png$pr1i$, $pr1j$/sikalongan.com/images/products/son-lot-chong-kiem-cao-cap-kanshield-curved-1.jpg$pr1j$, TIMESTAMP '2023-09-29 05:21:55'),
(3, 4767, $pr2a$SIKALONGAN-4767$pr2a$, $pr2b$chong-tham-pha-mau-ngoai-that-kanshield-plush$pr2b$, $pr2c$Chống thấm pha màu ngoại thất Kanshield Plush$pr2c$, $pr2d$vat-lieu-chong-tham$pr2d$, $pr2e$kanshield$pr2e$, $pr2f$Sản phẩm | SƠN KANSHIELD | Vật liệu chống thấm$pr2f$, $pr2g$Chống thấm pha màu ngoại thất Kanshield Plush – liên hệ để được tư vấn kỹ thuật và báo giá.$pr2g$, $pr2h$<p><img class="aligncenter size-full wp-image-4772" src="/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-2.png" alt="" width="594" height="839" /></p>
<p><img class="aligncenter size-full wp-image-4771" src="/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-3.png" alt="" width="594" height="840" /></p>$pr2h$, $pr2i$/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-1.jpg
/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-2.png
/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-3.png$pr2i$, $pr2j$/sikalongan.com/images/products/chong-tham-pha-mau-ngoai-that-kanshield-plush-1.jpg$pr2j$, TIMESTAMP '2023-09-29 04:38:21'),
(4, 4707, $pr3a$SIKALONGAN-4707$pr3a$, $pr3b$bot-tret-tuong-trong-nha-kanshield$pr3b$, $pr3c$Bột trét tường trong nhà Kanshield$pr3c$, $pr3d$bot-tret-tuong$pr3d$, $pr3e$kanshield$pr3e$, $pr3f$Sản phẩm | BỘT TRÉT TƯỜNG | SƠN KANSHIELD$pr3f$, $pr3g$Độ bám dính cao Dễ thi công Bề mặt nhẵn mịn$pr3g$, $pr3h$<p>Độ bám dính cao</p>
<p>Dễ thi công</p>
<p>Bề mặt nhẵn mịn</p>$pr3h$, $pr3i$/sikalongan.com/images/products/bot-tret-tuong-trong-nha-kanshield-1.jpg$pr3i$, $pr3j$/sikalongan.com/images/products/bot-tret-tuong-trong-nha-kanshield-1.jpg$pr3j$, TIMESTAMP '2023-08-23 10:43:58'),
(5, 4705, $pr4a$SIKALONGAN-4705$pr4a$, $pr4b$bot-tret-cao-cap-ngoai-that-kanshield$pr4b$, $pr4c$Bột trét cao cấp ngoại thất Kanshield$pr4c$, $pr4d$bot-tret-tuong$pr4d$, $pr4e$kanshield$pr4e$, $pr4f$Sản phẩm | BỘT TRÉT TƯỜNG | SƠN KANSHIELD$pr4f$, $pr4g$– Che lấp Khe Nứt Nhỏ – Tạo Bề Mặt Nhẵn Mịn – Độ Bám Dính Cao – Dễ Thi Công$pr4g$, $pr4h$<p>&#8211; Che lấp Khe Nứt Nhỏ</p>
<p>&#8211; Tạo Bề Mặt Nhẵn Mịn</p>
<p>&#8211; Độ Bám Dính Cao</p>
<p>&#8211; Dễ Thi Công</p>$pr4h$, $pr4i$/sikalongan.com/images/products/bot-tret-cao-cap-ngoai-that-kanshield-1.jpg$pr4i$, $pr4j$/sikalongan.com/images/products/bot-tret-cao-cap-ngoai-that-kanshield-1.jpg$pr4j$, TIMESTAMP '2023-08-23 10:39:56'),
(6, 4701, $pr5a$SIKALONGAN-4701$pr5a$, $pr5b$son-chong-tham-kanshield-ks9999$pr5b$, $pr5c$Sơn chống thấm KANSHIELD KS9999$pr5c$, $pr5d$son-kanshield$pr5d$, $pr5e$kanshield$pr5e$, $pr5f$Sản phẩm | SƠN KANSHIELD$pr5f$, $pr5g$CHỐNG THẤM TƯỜNG NGOÀI CAO CẤP – CHỊU ĐƯỢC THỜI TIẾT VÀ KHÁNH TIA UV – DỄ SỬ DỤNG VÀ THI CÔNG – KHÔNG DÙNG LỚP LÓT – BÁM DÍNH TỐT VỚI NHIỀU LOẠI VẬT LIỆU – ĐÀN HỒI TỐT – KHÔNG ĐỘC HẠI – KHÔNG THÚC ĐẨY PHÁT TRIỂN RÊU, NẤM$pr5g$, $pr5h$<p>Mô tả sản phẩm:</p>
<p>Hợp chất chống thấm đàn hồi kháng UV dạng sệt gốc Acrylic</p>
<p>Ứng dụng:</p>
<p>Sàn mái bê tông</p>
<p>Bề mặt hoàn thiện</p>
<p>Trám khe nối nối và trám ốc viest cho nhiều loại mái (gạch, Amiiang, tôn kẽm,…)</p>
<p>Các chân tường trên mái</p>
<p>Tường ngoài</p>
<p>Định mức:</p>
<p>Không sử dụng lớp gia cường: &#8211; 0.6-0.8kg/m2</p>
<p>Dùng lớp gia cường kết hợp: -2.0-2.4kg/m2</p>
<p>Độ dày sau khi khô: 1.0 – 1.20mm (dùng lớp gia cường)</p>
<p>Thông tin kỹ thuật</p>
<p>Màu sắc: Trắng, xám.</p>
<p>Thời gian khô: 2-3 giờ, tùy thuộc vào điều kiện môi trường</p>
<p>Cường độ keo: 3N/mm2 khi không có gia cường, 5N/mm2 khi có gia cường</p>
<p>Lực bám dính: 1.5N/mm2 (trên bê tông: 40MPa)</p>
<p>Khả năng giãn dài tới đứt: 120% khi không có gia cường, 20% khi có gia cường</p>
<p>Chỉ số cháy: 0.4</p>
<p>Khả năng cháy: Loại 2</p>
<p>Khoảng thời tiết: Không thay đổi sau 3000 giờ</p>
<p>Độc hại: Không độc hại</p>
<p>Hạn sử dụng:  Hạn sử dụng 1 năm nếu được bảo quản đúng trong bao bì kín chưa mở và tránh ánh nắng mặt trời</p>
<p>Đóng gói: 5kg/20kg</p>
<p><img class="aligncenter size-full wp-image-4703" src="/sikalongan.com/images/products/son-chong-tham-kanshield-ks9999-2.jpg" alt="" width="1280" height="902" /></p>$pr5h$, $pr5i$/sikalongan.com/images/products/son-chong-tham-kanshield-ks9999-1.png
/sikalongan.com/images/products/son-chong-tham-kanshield-ks9999-2.jpg$pr5i$, $pr5j$/sikalongan.com/images/products/son-chong-tham-kanshield-ks9999-1.png$pr5j$, TIMESTAMP '2023-08-23 10:18:33'),
(7, 4691, $pr6a$SIKALONGAN-4691$pr6a$, $pr6b$bot-tret-cao-cap-kanshield-ks3333-2$pr6b$, $pr6c$Bột trét cao cấp KANSHIELD KS3333$pr6c$, $pr6d$bot-tret-tuong$pr6d$, $pr6e$kanshield$pr6e$, $pr6f$Sản phẩm | BỘT TRÉT TƯỜNG | SƠN KANSHIELD$pr6f$, $pr6g$– BỀN VỚI THỜI TIẾT – BỀ MẶT TRẮNG MỊN – DỄ THI CÔNG$pr6g$, $pr6h$<p>Bột trét tường KS3333 là loại bột vừa lót mịn, được đặc chết để sử dụng làm phẳng, mịn bề măt trước khi sơn, giúp hoàn thiện phẳng đẹp.</p>
<p><img class="aligncenter size-full wp-image-4692" src="/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-2-2.png" alt="" width="589" height="812" /></p>
<p><strong>THÀNH PHẦN CẤU TẠO VÀ ĐỘ CHE PHỦ</strong></p>
<p>&#8211; Bột khoáng, xu măng và phụ gia</p>
<p>&#8211; Độ che phủ từ 1 – 1.2m3/kg/2 lớp với độ dày từ 2-3mm/2 lớp</p>
<p><strong>HƯỚNG DẪN SỬ DỤNG:</strong></p>
<p>&#8211; Vệ sinh bề mặt sạch, không bụi bẩn, tạp chất và dầu mỡ.</p>
<p>&#8211; Trường hợp tường khá khô và bề mặt hút nước, hoặc bề mặng nóng trên 40 độ C cần phải làm ẩm và giảm nhiệt độ bề mặt tường bằng nước sạch theo phương pháp phun sương hoặc làm bằng ru lô ướt trước khi trét bột.</p>
<p>&#8211; Trộn 01 bao bột trét KS3333 với khoảng 14-17 lít nước sạch. Cho nước vào trong thùng  trước, sau đó cho bột vào từ từ để tránh vốn cục. DÙng dụng cụ khuấy trộn thích hợp cho đến khi có được sự hỗn hợp dẻo đồng nhất. Sử dụng trong vòng 4-6g sau khi trộn.</p>
<p>&#8211; Dùng bay trét (kim loại hoặc bằng nhựa).</p>
<p>&#8211; Để có bề mặt phẳng nên trét 2 lớp, mỗi lớp cách nhau 2 – 3h.</p>
<p>&#8211; Sau khi trét xong từ 1-2 ngày chà phẳng lại bằng giấy nhám.</p>
<p>&#8211; Vệ sinh bụi sau khi chà nhám</p>
<p>&#8211; Thực hiện sơn lót sau khi tường khô.</p>
<p><img class="aligncenter size-full wp-image-4693" src="/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-2-3.jpg" alt="" width="1179" height="824" /></p>$pr6h$, $pr6i$/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-2-2.png
/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-2-3.jpg$pr6i$, $pr6j$/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-2-2.png$pr6j$, TIMESTAMP '2023-08-23 09:55:10'),
(8, 4690, $pr7a$SIKALONGAN-4690$pr7a$, $pr7b$son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222$pr7b$, $pr7c$Sơn nước ngoại thất Kanshield KS 2222$pr7c$, $pr7d$son-kanshield$pr7d$, $pr7e$kanshield$pr7e$, $pr7f$Sản phẩm | SƠN KANSHIELD$pr7f$, $pr7g$Sơn nước ngoại thất cao cấp Kanshield KS 2222 – ĐỘ BÁM DÍNH CAO, ĐỘ PHỦ CAO – GIỮ MÀU SẮC BỀN LÂU – MÀNG SƠN MỊN MÀNG NHƯ LỤA – LAU CHÙI ĐƯỢC, THÂN THIỆN VỚI MÔI TRƯỜNG$pr7g$, $pr7h$<p>Sơn ngoại thất cao cấp KS2222 là loại sơn gốc nước trong nhà chất lượng. Được sản xuất theo tiêu chuẩn công nghệ hiện đại KANSHIELD phù hợp với điều kiện khí hậu VIệt Nam. Giữ màu tuyệt đối, màng bóng mờ sang trọng, mịn màng như lụa, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời, là giải pháp hoàn hảo trong việc trang trí và bảo vệ các mặt tường trong nhà.</p>
<p><img class="aligncenter size-full wp-image-4689" src="/sikalongan.com/images/products/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222-2.jpg" alt="" width="2560" height="2176" /></p>
<p><strong>THÀNH PHẦN CẤU TẠO</strong></p>
<p>Nước, bột màu, 100% nhựa Acrylic, phụ gia(không chứa chì và thủy nhân).</p>
<p><strong>TIÊU CHUẨN CHẤT LƯỢNG CHỦ YẾU</strong></p>
<p>&#8211; Độ phủ lý thuyết 10-12m2 lít/lớp</p>
<p><strong>HƯỚNG DẪN SỬ DỤNG:</strong></p>
<p>Chuẩn bị bề mặt:</p>
<p>Bề mặt sơn phải sạch, khô, độ ấm tường dưới 16%, không có tạp chất làm giảm sự bám dính như bụi, dầu mỡ, nấm mốc</p>
<p><strong>HỆ THỐNG SƠN ĐỀ NGHỊ:</strong></p>
<p>Bề mặt tường cũ:</p>
<p>&#8211; Dùng giấy nhám thích hợp để chà nhám rồi quét sạch bụi. Phải xử lý bề mặt tường có dấu hiệu nấm mốc hoặc rong rêu.</p>
<p>&#8211; Sau khi xử lý kỹ bề mặt, sơn 1 lớp lót KS7777</p>
<p>&#8211; Sơn hai lớp sơn hoàn thiện KS6666</p>
<p><strong>Bề mặt tường mới:</strong></p>
<p>&#8211; Làm phẳng bề mặt bằng 2 lớp bột trét KS3333</p>
<p>&#8211; Sơn 1 &#8211; 2 lớp sơn lót KS7777</p>
<p>&#8211; Sau 1 &#8211; 2 lớp sơn hoàn thiện KS1111</p>
<p><strong>BẢO QUẢN:</strong></p>
<p>&#8211; Đặt thùng sơn ở vị trí thẳng đứng, an toàn, đậy chặt nắp.</p>
<p>&#8211; Tồn trữ trong điều kiện thông thoáng, mát mẻ.</p>
<p>&#8211; Sau khi mở nắp thùng, sơn phải được sử dụng hết trong vòng 24 giờ.</p>
<p><img class="aligncenter size-full wp-image-4688" src="/sikalongan.com/images/products/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222-3.jpg" alt="" width="1179" height="828" /></p>
<p>&nbsp;</p>$pr7h$, $pr7i$/sikalongan.com/images/products/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222-2.jpg
/sikalongan.com/images/products/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222-3.jpg$pr7i$, $pr7j$/sikalongan.com/images/products/son-nuoc-ngoai-that-cao-cap-kanshield-ks-2222-2.jpg$pr7j$, TIMESTAMP '2023-08-23 09:41:47'),
(9, 4684, $pr8a$SIKALONGAN-4684$pr8a$, $pr8b$kanshield-ks1111$pr8b$, $pr8c$Sơn nước trong nhà KANSHIELD KS1111$pr8c$, $pr8d$son-kanshield$pr8d$, $pr8e$kanshield$pr8e$, $pr8f$Sản phẩm | SƠN KANSHIELD$pr8f$, $pr8g$SƠN NƯỚC CAO CẤP TRONG NHÀ – ĐỘ BÁM DÍNH CAO, ĐỘ PHỦ CAO – GIỮ MÀU SẮC BỀN LÂU – MÀNG SƠN MỊN MÀNG NHƯ LỤA – LAU CHÙI ĐƯỢC, THÂN THIỆN VỚI MÔI TRƯỜNG$pr8g$, $pr8h$<p>Sơn nước cao cấp KS1111 là loại sơn gốc nước trong nhà chất lượng. Được sản xuất theo tiêu chuẩn công nghệ hiện đại KANSHIELD phù hợp với điều kiện khí hậu Việt Nam. Giữ màu tuyệt đối, màng bông mờ sang trọng, mịn màng như lụa, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời, là giải pháp hoàn hải trong việc trang trí và bảo vệ các mặt tường trong nhà.</p>
<p><img class="aligncenter size-full wp-image-4686" src="/sikalongan.com/images/products/kanshield-ks1111-2.jpg" alt="" width="2560" height="2176" /></p>
<p><strong>THÀNH PHẦN CẤU TẠO</strong></p>
<p>Nước, bột màu, 100% nhựa Acryluc, phụ gia(không chứa chì và thủy ngân).</p>
<p><strong>TIÊU CHUẨN CHẤT LƯỢNG CHỦ YẾU</strong></p>
<p>Độ phủ lý thuyết 10 &#8211; 12m2 lít/lớp.</p>
<p><strong>HƯỚNG DẪN SỬ DỤNG:</strong></p>
<p>Chuẩn bị bề mặt:</p>
<p>Bề mặt sơn phải sạch, khô, độ ẩm tường dưới 16%, không có tạp chất làm giảm sự bám dính như bụi, dầu mỡ, nấm mốc,&#8230;</p>
<p><strong>HỆ THỐNG SƠN ĐỀ NGHỊ:</strong></p>
<p>Bề mặt tường cũ:</p>
<p>&#8211; Dùng giấy nhám thích hợp để chà nhám rồi quét sạch bụi. Phải xử lý bề mặt tường có dấu hiệu nấm mốc hoặc rong rêu.</p>
<p>&#8211; Sau khi xử lý kỹ bề mặt, sơn 1 lớp lót KS7777</p>
<p>&#8211; Sơn hai lớp sơn hoàn thiện KS6666</p>
<p><strong>Bề mặt tường mới:</strong></p>
<p>&#8211; Làm phẳng bề mặt bằng 2 lớp bột trét KS3333</p>
<p>&#8211; Sơn 1 &#8211; 2 lớp sơn lót KS7777</p>
<p>&#8211; Sau 1 &#8211; 2 lớp sơn hoàn thiện KS1111</p>
<p><strong>BẢO QUẢN:</strong></p>
<p>&#8211; Đặt thùng sơn ở vị trí thẳng đứng, an toàn, đậy chặt nắp.</p>
<p>&#8211; Tồn trữ trong điều kiện thông thoáng, mát mẻ.</p>
<p>&#8211; Sau khi mở nắp thùng, sơn phải được sử dụng hết trong vòng 24 giờ.</p>
<p><img class="aligncenter size-full wp-image-4685" src="/sikalongan.com/images/products/kanshield-ks1111-3.jpg" alt="" width="1179" height="828" /></p>$pr8h$, $pr8i$/sikalongan.com/images/products/kanshield-ks1111-2.jpg
/sikalongan.com/images/products/kanshield-ks1111-3.jpg$pr8i$, $pr8j$/sikalongan.com/images/products/kanshield-ks1111-2.jpg$pr8j$, TIMESTAMP '2023-08-23 09:28:28'),
(10, 4607, $pr9a$SIKALONGAN-4607$pr9a$, $pr9b$sikawall-skimcoat-vn$pr9b$, $pr9c$SIKAWALL SKIMCOAT VN$pr9c$, $pr9d$bot-tret-tuong$pr9d$, $pr9e$sika$pr9e$, $pr9f$BỘT TRÉT TƯỜNG$pr9f$, $pr9g$SikaWall SkimCoat VN là lớp phủ nhẵn mịn cho bề mặt tường và trần$pr9g$, $pr9h$<h2>MÔ TẢ VỀ SIKAWALL SKIMCOAT VN</h2>
<p>SikaWall SkimCoat VN (hay Skimcoat Sika hay Sika Skimcoat) là vật liệu phủ bề mặt cao cấp gốc xi măng được thiết kế với công thức đặc biệt dùng để làm lớp phủ cho các bề mặt tường và trần. Sau khi thi công thì tạo thành lớp phủ kiến trúc nhẵn mịn, có độ bám dính tuyệt hảo và phù hợp cho việc thi công cho các hạng mục trong nhà cũng như ngoài trời.</p>
<p>&nbsp;</p>
<h2>CÁC ỨNG DỤNG CỦA BỘT TRÉT SKIMCOAT SIKA</h2>
<p>Bột trét SkimCoat Sika thích hợp với các bề mặt như bê tông, sàn bê tông nhẹ, các tấm bê tông đúc sẵn, tường gạch xây, mặt dưới vòm, tường gạch block, gạch bê tông khí trưng áp, vữa trát.</p>$pr9h$, $pr9i$/sikalongan.com/images/products/sikawall-skimcoat-vn-1.png$pr9i$, $pr9j$/sikalongan.com/images/products/sikawall-skimcoat-vn-1.png$pr9j$, TIMESTAMP '2022-09-19 08:35:08'),
(11, 4605, $pr10a$SIKALONGAN-4605$pr10a$, $pr10b$inertol-poxitar-f$pr10b$, $pr10c$INERTOL POXITAR F$pr10c$, $pr10d$chat-bao-ve-thep$pr10d$, $pr10e$sika$pr10e$, $pr10f$CHẤT BẢO VỆ THÉP$pr10f$, $pr10g$Inertol Poxitar F là lớp phủ gốc epoxy – hắc ín – dầu công nghệ cao cho bê tông và thép$pr10g$, $pr10h$<h2><strong>CÁC ỨNG DỤNG CỦA INERTOL POXITAR F</strong></h2>
<ul>
<li>Inertol Poxitar F thích hợp thi công trên bê tông và thép đặc biệt trong các trường hợp thi công lên các bề mặt ẩm, đồng thời cũng được dùng làm lớp phủ bên trong và bên ngoài cho các kết cấu ngập trong nước hoặc chôn dưới đất chẳng hạn như hệ thống nước thải, công nghiệp hóa chất…</li>
<li>Inertol Poxitar F không thích hợp cho những bề mặt phải tiếp xúc với nước uống, nhà cửa, chuồng trại.</li>
</ul>$pr10h$, $pr10i$/sikalongan.com/images/products/inertol-poxitar-f-1.jpg$pr10i$, $pr10j$/sikalongan.com/images/products/inertol-poxitar-f-1.jpg$pr10j$, TIMESTAMP '2022-09-19 08:33:44'),
(12, 4599, $pr11a$SIKALONGAN-4599$pr11a$, $pr11b$sikabit-w-15$pr11b$, $pr11c$SIKABIT W-15$pr11c$, $pr11d$mang-chong-tham$pr11d$, $pr11e$sika$pr11e$, $pr11f$MÀNG CHỐNG THẤM$pr11f$, $pr11g$SikaBit W-15 là màng chống thấm gốc bitum cải tiến, thi công ướt$pr11g$, $pr11h$<h2><strong>CÁC ỨNG DỤNG CỦA SIKABIT W-15</strong></h2>
<p>SikaBit W-15 được thiết kế cho việc thi công chống thấm ở các vị trí không lộ thiên như:</p>
<ul>
<li>Các móng</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Sàn tầng hầm và tường</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Các sàn của đài móng</li>
</ul>
<p>&nbsp;</p>
<h2><strong>ƯU ĐIỂM CỦA SIKABIT W-15</strong></h2>
<ul>
<li>Dễ thi công, nhanh chóng và an toàn</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Không cần dụng cụ thi công đặc biệt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Thi công trực tiếp lên bề mặt ẩm ướt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Bám dính hoàn hảo cả trong thời gian đầu cũng như lâu dài</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Bám dính trên toàn bộ bề mặt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Không cho nước chảy bên dưới bề mặt nền và màng bitum</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Khả năng che phủ vết nứt tốt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Kháng xé rách tốt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Kháng đâm thủng tốt</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>Kháng lại sự ăn mòn hóa chất</li>
</ul>
<p>&nbsp;</p>$pr11h$, $pr11i$/sikalongan.com/images/products/sikabit-w-15-1.jpg$pr11i$, $pr11j$/sikalongan.com/images/products/sikabit-w-15-1.jpg$pr11j$, TIMESTAMP '2022-09-19 08:26:26'),
(13, 4597, $pr12a$SIKALONGAN-4597$pr12a$, $pr12b$sikafloor-81-epocem$pr12b$, $pr12c$SIKAFLOOR 81 EPOCEM$pr12c$, $pr12d$vua-tu-san-bang$pr12d$, $pr12e$sika$pr12e$, $pr12f$LỚP PHỦ VÀ BẢO VỆ SÀN | VỮA TỰ SAN BẰNG$pr12f$, $pr12g$Sikafloor 81 Epocem là vữa tự san phẳng gốc xi măng epoxy siêu mịn$pr12g$, $pr12h$<h2><strong>MÔ TẢ VỀ VỮA TỰ SAN PHẲNG SIKAFLOOR 81 EPOCEM</strong></h2>
<p>Sikafloor 81 Epocem là loại vữa tự san bằng (vữa tự san phẳng) 3 thành phần, gốc xi măng epoxy cải tiến</p>
<h2><strong>CÁC ỨNG DỤNG CỦA VỮA TỰ SAN PHẲNG SIKAFLOOR 81 EPOCEM</strong></h2>
<ul>
<li>Sikafloor 81 Epocem dùng cho lớp vữa cán tự san bằng dày 1.5 &#8211; 3mm</li>
<li>Lớp ngăn độ ẩm tạm thời (độ dày tối thiểu 2 mm)</li>
<li>Làm phẳng hoặc dặm vá bề mặt bê tông</li>
<li>Áp dụng trên sàn bê tông không có màng chống thấm, trên bề mặt ẩm và những nơi không yêu cầu thẩm mỹ cao.</li>
<li>Lớp dặm vá cho các lớp phủ epoxy cũng như các lớp phủ epoxy cũng như các lớp phủ công nghiệp</li>
<li>Được thiết kế cho tất cả các bề mặt nền gốc xi măng</li>
</ul>$pr12h$, $pr12i$/sikalongan.com/images/products/sikafloor-81-epocem-1.webp$pr12i$, $pr12j$/sikalongan.com/images/products/sikafloor-81-epocem-1.webp$pr12j$, TIMESTAMP '2022-09-19 08:24:56'),
(14, 4594, $pr13a$SIKALONGAN-4594$pr13a$, $pr13b$sikamur-75-ready-mix-vn$pr13b$, $pr13c$SIKAMUR 75 READY MIX VN$pr13c$, $pr13d$vua-kho-tron-san$pr13d$, $pr13e$sika$pr13e$, $pr13f$VỮA KHÔ TRỘN SẴN$pr13f$, $pr13g$Vữa khô trộn sẵn đa năng chất lượng cao mác 75 được trộn sẵn và đóng gói bao bì tại nhà máy Vữa khô trộn sẵn (vữa trộn sẵn) cũng chính là vữa xây tô trộn sẵn, vữa xây dựng, vữa xây và vữa trát đang rất được ưa chuộng hiện nay cũng như trở thành xu hướng và dần thay thế vữa truyền thống$pr13g$, $pr13h$<h2>MÔ TẢ VỀ VỮA KHÔ TRỘN SẴN SIKAMUR 75 READY MIX VN</h2>
<ul>
<li>SikaMur 75 Ready Mix VN là loại vữa khô chất lượng cao mác 75# được trộn sẵn và đóng gói bao bì tại nhà máy.</li>
<li>Thành phần chính của vữa trộn sẵn Sika gồm hỗn hợp chất kết dính xi măng Polyme, cát sấy khô được chọn lọc (loại bỏ hết bùn, sét và các tạp chất có hại) và các phụ gia đa chức năng khác</li>
<li>Bề mặt tường không xảy ra tình trạng rạn nứt cũng như phản ứng vôi hóa khi trát vữa</li>
</ul>
<h2>CÁC ỨNG DỤNG CỦA VỮA XÂY DỰNG SIKAMUR 75 READY MIX VN</h2>
<p>SikaMur 75 Ready Mix VN là loại vữa khô trộn sẵn (vữa xây dựng) đa năng mác 75# chuyên dùng để xây gạch thông thường, trát hoặc phun tường và phủ sàn trong nhà và ngoài trời</p>
<h2>ƯU ĐIỂM CỦA VỮA XÂY VÀ VỮA TRÁT SIKAMUR 75 READY MIX VN</h2>
<ul>
<li>Vữa khô Sika với chất lượng vữa được đảm bảo tại nhà máy và đạt tiêu chuẩn quốc gia: vữa sạch tạp chất cũng như tuổi thọ cao gấp 2 &#8211; 3 lần so với vữa truyền thống.</li>
<li>Vữa xây dựng Sika với ưu điểm là dễ sử dụng, rút ngắn 1/4 thời gian thi công, sớm đưa công trình vào sử dụng là do giảm thời gian chờ giữa các công đoạn, không cần sàng cát và giảm 90% thời gian dọn vệ sinh và vận chuyển phế thải ra khỏi công trình.</li>
<li>Phạm vi sử dụng của vữa xây và vữa trát Sika là trong nhà và ngoài trời.</li>
<li>Vữa khô trộn sẵn Sika tiết kiệm trên 15% vật liệu và chi phí so với vữa truyền thống là do tỷ trọng vữa SikaMur 75 Ready Mix VN nhẹ hơn, chiều dày thi công giảm 1/3 và đặc biệt tỷ lệ hao phí rất thấp, giảm trên 97% hao phí sử dụng vật tư cho phép theo định mức Nhà nước.</li>
<li>Đặc biệt là vữa trộn sẵn đóng bao Sika rất thân thiện với môi trường.</li>
</ul>$pr13h$, $pr13i$/sikalongan.com/images/products/sikamur-75-ready-mix-vn-1.webp$pr13i$, $pr13j$/sikalongan.com/images/products/sikamur-75-ready-mix-vn-1.webp$pr13j$, TIMESTAMP '2022-09-19 08:23:22'),
(15, 4590, $pr14a$SIKALONGAN-4590$pr14a$, $pr14b$sika-latex-th-25lit$pr14b$, $pr14c$SIKA LATEX TH 25LIT$pr14c$, $pr14d$san-pham-ho-tro-be-tong$pr14d$, $pr14e$sika$pr14e$, $pr14f$SỮA CHỮA VÀ BẢO VỆ BÊ TÔNG | SẢN PHẨM HỖ TRỢ BÊ TÔNG$pr14f$, $pr14g$Sika Latex TH là phụ gia chống thấm và tác nhân kết nối$pr14g$, $pr14h$<h2><strong>MÔ TẢ VỀ SIKA LATEX TH 25LIT</strong></h2>
<p>Sika Latex TH là phụ gia loại nhũ tương Styrene butadiene cải tiến dùng trộn với xi măng hoặc vữa xi măng &#8211; cát nhằm gia tăng tính kết dính và khả năng chống thấm.</p>
<h2><strong>CÁC ỨNG DỤNG CỦA SIKA LATEX TH 25LIT</strong></h2>
<p>Sika Latex TH là loại nhũ tương cao cấp, cải thiện đáng kể chất lượng của vữa xi măng như:</p>
<ul>
<li>Lớp hồ dầu kết nối</li>
<li>Lớp vữa dặm vá mỏng</li>
<li>Lớp vữa trát chống thấm</li>
<li>Lớp vữa cán sàn</li>
<li>Vữa sửa chữa bê tông</li>
<li>Lớp lót chống mài mòn</li>
<li>Vữa dán gạch</li>
<li>Vữa xây</li>
</ul>$pr14h$, $pr14i$/sikalongan.com/images/products/sika-latex-th-25lit-1.jpg$pr14i$, $pr14j$/sikalongan.com/images/products/sika-latex-th-25lit-1.jpg$pr14j$, TIMESTAMP '2022-09-19 08:18:00'),
(16, 4581, $pr15a$SIKALONGAN-4581$pr15a$, $pr15b$antisol-e-5lit$pr15b$, $pr15c$ANTISOL E$pr15c$, $pr15d$san-pham-ho-tro-be-tong$pr15d$, $pr15e$sika$pr15e$, $pr15f$SẢN PHẨM HỖ TRỢ BÊ TÔNG | Sản phẩm$pr15f$, $pr15g$Antisol E là hợp chất bảo dưỡng bê tông$pr15g$, $pr15h$<p><strong>MÔ TẢ VỀ ANTISOL E 5LIT</strong><br />
Antisol E là một hợp chất bảo dưỡng gốc parafin được nhũ tương hóa.</p>
<p>Antisol E là sản phẩm được chế tạo để sử dụng được ngay và dễ thi công.</p>
<p>Antisol E sẽ tạo thành một lớp màng mỏng bao phủ bề mặt bê tông để ngăn cản sự bốc hơi nước sớm.</p>
<p>Antisol E tuân theo tiêu chuẩn ASTM C 309 Loại 1A.</p>
<p><strong>CÁC ỨNG DỤNG CỦA ANTISOL E 5LIT</strong><br />
Antisol E được sử dụng chủ yếu cho các cấu trúc bề mặt bê tông nơi không yêu cầu các bước xử lý bề mặt tiếp theo như bề mặt bê tông lộ thiên.</p>
<p>Antisol E được phun lên bề mặt bê tông vừa mới đổ, làm thành một lớp mỏng cản lại sự bốc hơi nước sớm. Do không ảnh hưởng đến quá trình ninh kết thông thường nên bê tông được bảo dưỡng và đạt được các đặc tính tối ưu. Antisol E đặc biệt thích hợp cho các bề mặt bê tông dùng trong lĩnh vực giao thông và bê tông lộ thiên có diện tích lớn như:</p>
<p>Đường quốc lộ</p>
<p>Đường băng và đường dẫn máy bay ra đường băng</p>
<p>Bãi đỗ cho máy bay và xe hơi</p>
<p>Mái che</p>
<p>Tường chắn đất</p>
<p>Dầm dự ứng lực và trụ dự ứng lực</p>
<p>Các cấu kiện đúc sẵn</p>
<p><strong>ƯU ĐIỂM CỦA ANTISOL E 5LIT</strong><br />
Antisol E cung cấp các ưu điểm sau cho bề mặt bê tông:</p>
<p>Giảm tỉ lệ nứt do co mềm</p>
<p>Đạt cường độ thiết kế</p>
<p>Giảm tối đa sự co ngót.</p>
<p>Giảm sự bám bụi.</p>
<p>Tăng khả năng kháng sương giá.</p>
<p>Giảm các phương pháp tốn kém khác như dùng bao bố ướt, &#8230;</p>$pr15h$, $pr15i$/sikalongan.com/images/products/antisol-e-5lit-1.jpg$pr15i$, $pr15j$/sikalongan.com/images/products/antisol-e-5lit-1.jpg$pr15j$, TIMESTAMP '2022-09-19 08:16:20'),
(17, 4583, $pr16a$SIKALONGAN-4583$pr16a$, $pr16b$sikafloor-chapdur-grey$pr16b$, $pr16c$SIKAFLOOR CHAPDUR GREY$pr16c$, $pr16d$lop-phu-va-bao-ve-san$pr16d$, $pr16e$sika$pr16e$, $pr16f$LỚP PHỦ VÀ BẢO VỆ SÀN$pr16f$, $pr16g$Sikafloor Chapdur Grey là chất tăng cứng có màu, vô cơ, rắc khô không chứa kim loại dùng để gia cố bề mặt sàn, các lớp trát có yêu cầu chống mài mòn cao$pr16g$, $pr16h$<h2><strong>MÔ TẢ VỀ HARDENER SIKAFLOOR CHAPDUR GREY</strong></h2>
<ul>
<li>Hardener Sikafloor Chapdur Grey là chất làm cứng sàn gốc xi măng, sử dụng được ngay, ở dạng rắc khô.</li>
<li>Sikafloor Chapdur Grey có chứa các cốt liệu thiên nhiên rất cứng có kích cỡ thành phần hạt được chọn lọc kỹ.</li>
</ul>
<h2>CÁC ỨNG DỤNG CỦA HARDENER SIKAFLOOR CHAPDUR GREY</h2>
<p>Hardener Sikafloor Chapdur Grey để gia cố cho bề mặt sàn và các tấm bê tông, để tăng khả năng kháng mài mòn và nhờ đó giảm thiểu sự hình thành bụi</p>
<p>Thích hợp sử dụng cho các mặt sàn phải chịu sự mài mòn cơ học nghiêm trọng và có nhu cầu thi công một lớp phủ đặc biệt cứng như:</p>
<ul>
<li>Nhà kho</li>
<li>Các tuyến lưu thông</li>
<li>Xưởng cơ khí</li>
<li>Bãi đậu xe</li>
<li>Các trạm bảo hành</li>
<li>Garages…</li>
</ul>$pr16h$, $pr16i$/sikalongan.com/images/products/sikafloor-chapdur-grey-1.webp$pr16i$, $pr16j$/sikalongan.com/images/products/sikafloor-chapdur-grey-1.webp$pr16j$, TIMESTAMP '2022-09-19 08:14:30'),
(18, 4580, $pr17a$SIKALONGAN-4580$pr17a$, $pr17b$sikaflex-construction-ap$pr17b$, $pr17c$SIKAFLEX CONSTRUCTION AP$pr17c$, $pr17d$tram-khe$pr17d$, $pr17e$sika$pr17e$, $pr17f$TRÁM KHE$pr17f$, $pr17g$Hợp chất trám khe một thành phần, đàn hồi vĩnh cửu gốc polyurethane$pr17g$, $pr17h$<h2><strong>MÔ TẢ VỀ SIKAFLEX CONSTRUCTION AP</strong></h2>
<p>Sikaflex Construction AP là chất trám khe một thành phần, đàn hồi vĩnh cữu gốc Polyurethane dùng để trám nhét các khe co giãn trong kết cấu công trình</p>
<h2><strong>CÁC ỨNG DỤNG CỦA SIKAFLEX CONSTRUCTION AP</strong></h2>
<p>Sikaflex Construction AP là hợp chất trám khe đa năng và là hợp chất dùng để trám nhét các khoảng hở, các khe co giãn được dùng chủ yếu trong công trình xây dựng nhà cao tầng.</p>
<p><u><em>Cho khe giãn nở trong:</em></u></p>
<ul>
<li>Kết cấu bê tông đúc sẵn</li>
<li>Lan can</li>
<li>Công son kết cấu cầu</li>
<li>Tường chắn</li>
<li>Đường xe điện ngầm</li>
</ul>
<p><u><em>Dùng để trám các khe</em></u></p>
<ul>
<li>Cửa và cửa sổ trượt</li>
<li>Viền chân tường</li>
<li>Khe giữa tường và sàn</li>
<li>Cửa chớp</li>
<li>Bơm ron cho các loại vách ngăn phòng tắm</li>
<li>Chống thấm phần tiếp giáp giữa các phần tiếp xúc bồn tắm</li>
<li>Chống thấm các lỗ đinh trên mái tôn…</li>
</ul>$pr17h$, $pr17i$/sikalongan.com/images/products/sikaflex-construction-ap-1.webp$pr17i$, $pr17j$/sikalongan.com/images/products/sikaflex-construction-ap-1.webp$pr17j$, TIMESTAMP '2022-09-19 08:13:12'),
(19, 4576, $pr18a$SIKALONGAN-4576$pr18a$, $pr18b$bestseal-ep712$pr18b$, $pr18c$BESTSEAL EP712$pr18c$, $pr18d$chat-bao-ve-thep$pr18d$, $pr18e$sika$pr18e$, $pr18f$CHẤT BẢO VỆ THÉP | Sản phẩm$pr18f$, $pr18g$Hợp chất chống thấm gốc Epoxy, hai thành phần$pr18g$, $pr18h$<p><strong>MÔ TẢ VỀ BESTSEAL EP712</strong><br />
BestSeal EP712 là hợp chất chống thấm ngược tuyệt đối, trong suốt, gốc epoxy, hai thành phần<br />
BestSeal EP712 chịu áp lực cao, kháng dung môi, kháng hóa chất và chống ăn mòn xâm thực dùng để chống thấm bề mặt các kết cấu thường xuyên tiếp xúc với nước hoặc các hợp chất có tính ăn mòn cao trong các kết cấu xây dựng</p>
<p><strong>CÁC ỨNG DỤNG CỦA BESTSEAL EP712</strong><br />
BestSeal EP712 dùng để chống thấm cho các hạng mục như:</p>
<p>Tường, đáy tầng hầm, hố móng cầu thang máy, đường hầm, mặt cầu, …<br />
Tường, đáy hồ bơi, bễ chứa nước, đường ống cấp nước, …<br />
Các kết cấu khác không tiếp xúc trực tiếp với tia tử ngoại.</p>
<p><strong>ƯU ĐIỂM CỦA BESTSEAL EP712</strong><br />
Không mùi, không độc, thân thiện với môi trường<br />
Độ thẩm thấu cao, chèn bít các vết nứt li ti hoặc mao dẫn triệt để<br />
Dễ thi công bằng các dụng cụ đơn giản như cọ quét, ru lô lông ngắn, &#8230;<br />
Liên kết tốt với tất cả các bề mặt có độ nhám thích hợp<br />
Phát triển cường độ nhanh nhằm mau đưa vào sử dụng<br />
Độ phân tán cao nên tiết kiệm và kinh tế<br />
Kháng hóa chất và kháng mài mòn cơ học cao<br />
Kháng cacbonat hóa, kháng nấm mốc tốt và chịu cọ xát cơ học tối đa<br />
Có thể thi công trực tiếp lên bề mặt ẩm</p>$pr18h$, $pr18i$/sikalongan.com/images/products/bestseal-ep712-1.jpg$pr18i$, $pr18j$/sikalongan.com/images/products/bestseal-ep712-1.jpg$pr18j$, TIMESTAMP '2022-09-19 08:10:38'),
(20, 4565, $pr19a$SIKALONGAN-4565$pr19a$, $pr19b$sikadur-731-2$pr19b$, $pr19c$SIKADUR 731$pr19c$, $pr19d$chat-ket-dinh-cuong-do-cao$pr19d$, $pr19e$sika$pr19e$, $pr19f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr19f$, $pr19g$Sikadur 731 là loại vữa sửa chữa và chất kết dính hai thành phần, không dung môi và là sự kết hợp giữa nhựa epoxy và chất trám cường độ cao. Độ sệt dẻo của sản phẩm cho phép thi công một cách dễ dàng và đa dụng$pr19g$, $pr19h$<p>Sikadur 731 là loại vữa sửa chữa và chất kết dính hai thành phần, thixotropic, không dung môi và là sự kết hợp giữa nhựa epoxy và chất trám cường độ cao được chọn lọc đặc biệt để neo cấy thép và trám khe kết nối. Độ sệt dẻo của sản phẩm cho phép thi công một cách dễ dàng và đa dụng.</p>
<p><strong>CÁC ỨNG DỤNG CỦA SIKADUR 731</strong></p>
<p>Sikadur 731 – chất kết dính gốc nhựa epoxy hai thành phần có các ứng dụng sau:</p>
<p>Lớp kết nối mỏng vững chắc</p>
<p>Có thể dùng cho bê tông, sắt, thép, nhôm, gạch ceramic, gỗ, thủy tinh, polyester, epoxy, &#8230;</p>
<p>Sửa chữa bê tông</p>
<p>Trám các lỗ hổng</p>
<p>Chất kết dính cho các thanh thép chờ</p>
<p>Trám các vết nứt và bề mặt</p>
<p><strong>ƯU ĐIỂM CỦA SIKADUR 731</strong></p>
<p>Sikadur 731 &#8211; chất kết dính hai thành phần là sản phẩm rất hữu dụng, cung cấp cho người sử dụng các ưu điểm sau:</p>
<p>Dễ thi công</p>
<p>Thích hợp thi công cho cả bề mặt khô và ẩm ướt</p>
<p>Sản phẩm không bị võng, ngay cả khi nhiệt độ cao</p>
<p>Không đông cứng, không gây co ngót</p>
<p>Kết dính tuyệt hảo với bê tông và nhiều vật liệu khác</p>
<p>Cường độ cao, sớm</p>
<p>Các thành phần có màu khác nhau (để kiểm soát việc trộn)</p>
<p>Kháng mài mòn cao</p>$pr19h$, $pr19i$/sikalongan.com/images/products/sikadur-731-2-1.jpg$pr19i$, $pr19j$/sikalongan.com/images/products/sikadur-731-2-1.jpg$pr19j$, TIMESTAMP '2022-09-19 07:53:24'),
(21, 4562, $pr20a$SIKALONGAN-4562$pr20a$, $pr20b$sikadur-732$pr20b$, $pr20c$SIKADUR 732$pr20c$, $pr20d$chat-ket-dinh-cuong-do-cao$pr20d$, $pr20e$sika$pr20e$, $pr20f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr20f$, $pr20g$Sikadur 732 là chất kết nối gốc epoxy chọn lọc, 2 thành phần, không dung môi. Sau khi thi công lên bề mặt bê tông cũ sản phẩm sẽ tạo sự kết dính tuyệt hảo với bê tông mới$pr20g$, $pr20h$<p>Sikadur 732 là chất kết nối gốc epoxy chọn lọc, 2 thành phần, không dung môi. Sau khi thi công lên bề mặt bê tông cũ sản phẩm sẽ tạo sự kết dính tuyệt hảo với bê tông mới.</p>
<p>Sikadur 732 phù hợp với ASTM C 881-02, loại II, cấp 2, phần B+C</p>
<p><strong>CÁC ỨNG DỤNG CỦA SIKADUR 732</strong></p>
<p>Sikadur 732 được dùng trong:</p>
<p>Kết nối vĩnh viễn cho vữa hoặc bê tông mới trộn với bê tông đã đông cứng, gạch, gạch men, thép hoặc các chất vật liệu xây dựng khác.</p>
<p>Sikadur 732 cũng được dùng để trám các vết nứt chân chim và được dùng như lớp phủ bảo vệ cho các bộ phận thép như bệ neo.</p>$pr20h$, $pr20i$/sikalongan.com/images/products/sikadur-732-1.jpg$pr20i$, $pr20j$/sikalongan.com/images/products/sikadur-732-1.jpg$pr20j$, TIMESTAMP '2022-09-19 07:51:18'),
(22, 4556, $pr21a$SIKALONGAN-4556$pr21a$, $pr21b$sikadur-752$pr21b$, $pr21c$SIKADUR 752$pr21c$, $pr21d$chat-ket-dinh-cuong-do-cao$pr21d$, $pr21e$sika$pr21e$, $pr21f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr21f$, $pr21g$Sikadur 752 là dung dịch để bơm, có độ nhớt thấp, không dung môi, gốc nhựa epoxy cường độ cao. Sau khi trộn, sản phẩm được bơm vào các lỗ hổng và các vết nứt trong bê tông khi đã bảo dưỡng sẽ trở nên rất cứng và có cường độ cao.$pr21g$, $pr21h$<p>Sikadur 752 là dung dịch để bơm, có độ nhớt thấp, không dung môi, gốc nhựa epoxy cường độ cao. Sau khi trộn, sản phẩm được bơm vào các lỗ hổng và các vết nứt trong bê tông khi đã bảo dưỡng sẽ trở nên rất cứng và có cường độ cao.</p>
<p>Sikadur 752 đúng theo tiêu chuẩn ASTM C 881- 02. Loại I, Cấp 1, Phần B + C</p>
<p><strong>CÁC ỨNG DỤNG CỦA SIKADUR 752</strong></p>
<p>Sikadur 752 được dùng để bơm và chèn các lỗ, hốc và các vết nứt trong các kết cấu như cột, dầm, móng, sàn và các kết cấu giữ nước.</p>
<p>Sản phẩm không chỉ hình thành một lớp ngăn sự thẩm thấu của nước hữu hiệu, mà còn là lớp kết nối giữa các thành phần bê tông với nhau, nhờ đó phục hồi lại cường độ ban đầu của kết cấu bê tông</p>$pr21h$, $pr21i$/sikalongan.com/images/products/sikadur-752-1.jpg$pr21i$, $pr21j$/sikalongan.com/images/products/sikadur-752-1.jpg$pr21j$, TIMESTAMP '2022-09-19 07:47:46'),
(23, 4557, $pr22a$SIKALONGAN-4557$pr22a$, $pr22b$sikagrout-212-11$pr22b$, $pr22c$SIKAGROUT 212-11$pr22c$, $pr22d$vua-rot-dinh-vi$pr22d$, $pr22e$sika$pr22e$, $pr22f$VỮA RÓT ĐỊNH VỊ$pr22f$, $pr22g$Sikagrout 212-11 là vữa gốc xi măng, tự san bằng, không co ngót với thời gian cho phép thi công được kéo dài để thích ứng với nhiệt độ địa phương. Sikagrout 212-11 được dùng để rót vữa cho nền móng máy, định vị bu lông, các lỗ hổng và nơi sửa chữa cần cường độ cao$pr22g$, $pr22h$<h2><strong>CÁC ỨNG DỤNG CỦA SIKAGROUT 212-11</strong></h2>
<p>Sikagrout 212-11 thích hợp cho các công việc rót vữa sau:</p>
<ul>
<li>Nền móng máy (không rung động)</li>
<li>Bệ đường ray</li>
<li>Trụ cột trong các kết cấu đúc sẵn</li>
<li>Định vị bu lông</li>
<li>Gối cầu</li>
<li>Các lỗ hổng</li>
<li>Các khe hở</li>
<li>Các hốc tường</li>
<li>Nơi sửa chữa cần cường độ cao.</li>
</ul>
<p>&nbsp;</p>
<h2><strong>ƯU ĐIỂM CỦA SIKAGROUT 212-11</strong></h2>
<p>Sikagrout 212-11 là một loại vữa rất kinh tế và dễ sử dụng, ngoài ra còn có một số ưu điểm khác bao gồm:</p>
<ul>
<li>Độ chảy lỏng tuyệt hảo</li>
<li>Ổn định kích thước tốt</li>
<li>Cường độ cao, độ sệt có thể điều chỉnh</li>
<li>Không tách nước</li>
<li>Không độc hại, không bị ăn mòn</li>
<li>Đã được trộn sẵn và sử dụng được ngay chỉ cần thêm nước</li>
<li>Kháng va đập, rung động</li>
<li>Có thể bơm vữa bằng máy bơm thích hợp.</li>
</ul>
<p>&nbsp;</p>
<p><strong>THÔNG TIN VỀ SẢN PHẨM SIKAGROUT 212-11</strong></p>
<ul>
<li>Dạng/Màu: Bột/Xám bê tông</li>
<li>Đóng gói: 25 kg/bao</li>
<li>Lưu trữ: nơi khô mát có bóng râm</li>
<li>Thời hạn sử dụng: tối thiểu 6 tháng nếu được lưu trữ đúng cách trong bao bì nguyên chưa mở.</li>
</ul>$pr22h$, $pr22i$/sikalongan.com/images/products/sikagrout-212-11-1.jpg$pr22i$, $pr22j$/sikalongan.com/images/products/sikagrout-212-11-1.jpg$pr22j$, TIMESTAMP '2022-09-19 07:47:29'),
(24, 4549, $pr23a$SIKALONGAN-4549$pr23a$, $pr23b$sikadur-20-crack-seal$pr23b$, $pr23c$SIKADUR 20 CRACK SEAL$pr23c$, $pr23d$chat-ket-dinh-cuong-do-cao$pr23d$, $pr23e$sika$pr23e$, $pr23f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr23f$, $pr23g$Sikadur 20 Crack Seal là keo Epoxy hai thành phần, dạng lỏng, đàn hồi nhẹ không dung môi dùng để trám khe nứt có độ rộng 1 cm và lỗ rỗng trong bê tông một cách nhanh chóng đồng thời đạt được hiệu quả cao$pr23g$, $pr23h$<p>Sikadur 20 Crack Seal là keo gốc epoxy 2 thành phần, dạng lỏng đàn hồi nhẹ, không dung môi.</p>
<p>Đặc biệt phù hợp để trám khe nứt nông (không phải nứt kết cấu) và lỗ rỗng trong bê tông</p>
<p><strong>CÁC ỨNG DỤNG CỦA SIKADUR 20 CRACK SEAL</strong></p>
<p>Sikadur 20 Crack Seal được sử dụng trong các trường hợp như</p>
<p>Dùng để trám khe nứt nông và các lỗ rỗng trong cấu kiện bê tông như sàn, ban công, mái bê tông, khu vực ẩm ướt, hồ bơi và áp dụng trước công tác chống thấm</p>
<p>Đồng thời sửa chữa chống thấm khe gạch dưới sàn khu vực ẩm ướt.</p>
<p><strong>ƯU ĐIỂM CỦA SIKADUR 20 CRACK SEAL</strong></p>
<p>Sikadur 20 Crack Seal có những ưu điểm tiêu biểu như</p>
<p>Trám khe nứt có tính đàn hồi nhẹ</p>
<p>Độ nhớt thấp</p>
<p>Phù hợp cho cả khu vực khô và ướt</p>
<p>Cường độ bám dính cao</p>
<p>Không co ngót</p>$pr23h$, $pr23i$/sikalongan.com/images/products/sikadur-20-crack-seal-1.jpg$pr23i$, $pr23j$/sikalongan.com/images/products/sikadur-20-crack-seal-1.jpg$pr23j$, TIMESTAMP '2022-09-19 07:44:24'),
(25, 4538, $pr24a$SIKALONGAN-4538$pr24a$, $pr24b$sika-anchorfix-3001$pr24b$, $pr24c$SIKA ANCHORFIX 3001$pr24c$, $pr24d$chat-ket-dinh-cuong-do-cao$pr24d$, $pr24e$sika$pr24e$, $pr24f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr24f$, $pr24g$Keo khoan cấy thép chuyên dụng, chất lượng cao$pr24g$, $pr24h$<p>Sika Anchorfix 3001 là sản phẩm neo thép chất lượng cao, hai thành phần, gốc epoxy, không dung môi, có tính xúc biến, ứng dụng cho việc neo thép có ren và thép chịu lực trong các cấu kiện bê tông bị nứt và không bị nứt.</p>
<p><strong>CÁC ỨNG DỤNG CỦA SIKA ANCHORFIX 3001</strong></p>
<p>Sika Anchorfix 3001 nên được thi công bởi những nhà thầu chuyên nghiệp. Sản phẩm dùng để cố định các loại neo móc không biến dạng trong</p>
<p>Kết cấu:</p>
<p>Neo thép, thép chịu lực trong các công trình sửa chữa hoặc xây mới</p>
<p>Thép có ren</p>
<p>Bulông và các hệ thống neo móc định vị đặc biệt</p>
<p><strong>Cơ khí và mộc:</strong></p>
<p>Neo móc các tay vịn, hệ khung</p>
<p>Lan can</p>
<p>Cố định các loại khung cửa, cửa sổ</p>
<p><strong>Các loại bề mặt nền:</strong></p>
<p>Bê tông (nứt và không nứt)</p>
<p>Gạch rỗng và gạch đặc</p>
<p>Gỗ</p>
<p>Đá tự nhiên và đá nhân tạo</p>
<p>Các bề mặt nền này có thể không đồng nhất đặc biệt là về cường độ, thành phần cấu tạo và độ rỗng. Do đó phải kiểm tra sự tương thích giữa Sika Anchorfix 3001 đối với từng ứng dụng cụ thể bằng cách thi công kiểm tra trên cùng một khu vực. Đặc biệt chú ý về cường độ bám dính, sự ố màu và sự phai màu.</p>$pr24h$, $pr24i$/sikalongan.com/images/products/sika-anchorfix-3001-1.jpg$pr24i$, $pr24j$/sikalongan.com/images/products/sika-anchorfix-3001-1.jpg$pr24j$, TIMESTAMP '2022-09-19 07:40:15'),
(26, 4540, $pr25a$SIKALONGAN-4540$pr25a$, $pr25b$sikadur-42mp$pr25b$, $pr25c$SIKADUR 42MP$pr25c$, $pr25d$vua-rot-dinh-vi$pr25d$, $pr25e$sika$pr25e$, $pr25f$VỮA RÓT ĐỊNH VỊ$pr25f$, $pr25g$ƯU ĐIỂM CỦA SIKADUR 42MP Sikadur 42MP có những ưu điểm sau Không dung môi Độ chảy lỏng cao ngay cả khi lớp vữa mỏng. Đông cứng nhanh Thích hợp để thi công cả trên bề mặt khô và ẩm. Đông cứng không gây co ngót. Bảo dưỡng nhanh Kháng dầu, dầu nhờn tổng hợp, …$pr25g$, $pr25h$<h2><strong>ƯU ĐIỂM CỦA SIKADUR 42MP</strong></h2>
<p>Sikadur 42MP có những ưu điểm sau</p>
<ul>
<li>Không dung môi</li>
<li>Độ chảy lỏng cao ngay cả khi lớp vữa mỏng.</li>
<li>Đông cứng nhanh</li>
<li>Thích hợp để thi công cả trên bề mặt khô và ẩm.</li>
<li>Đông cứng không gây co ngót.</li>
<li>Bảo dưỡng nhanh</li>
<li>Kháng dầu, dầu nhờn tổng hợp, nước và phần lớn các hóa chất.</li>
<li>Cường độ cơ học cao.</li>
<li>Chịu được sự rung động</li>
</ul>
<h2><strong>HƯỚNG DẪN THI CÔNG SIKADUR 42MP</strong></h2>
<p><u><strong>Chuẩn bị bề mặt:</strong></u></p>
<ul>
<li>Tất cả các bề mặt phải sạch, không đọng nước và không dính các tạp chất dễ bong tróc</li>
<li>Bụi xi măng phải được loại bỏ bằng dụng cụ cơ khí ví dụ như máy phun cát.</li>
</ul>
<p><u><strong>Lớp lót:</strong></u> không cần</p>
<p><u><strong>Trộn:</strong></u></p>
<ul>
<li>Trộn 2 thành phần A với B lại với nhau trong vòng ít nhất 3 phút bằng cần trộn điện với tốc độ thấp (không quá 400 vòng/phút).</li>
<li>Sau đó cho cốt liệu (thành phần C) vào và tiếp tục trộn cho đến khi đạt được vữa chảy lỏng đồng nhất (~ 5 phút)</li>
</ul>
<p><u><strong>Thi công:</strong></u></p>
<ul>
<li>Khi rót vữa vào dưới các tấm đế, phải đảm bảo đủ áp suất để duy trì dòng vữa rót.</li>
<li>Phải để bọt khí thoát hết. Với thể tích lớn nên thi công nhiều lớp, phải chắc chắn lớp vữa rót trước đã thi công cứng và nguội.</li>
</ul>
<p><u><strong>Vệ sinh:</strong></u> làm sạch tất cả các dụng cụ và thiết bị bằng Thinner C ngay sau khi sử dụng</p>$pr25h$, $pr25i$/sikalongan.com/images/products/sikadur-42mp-1.jpg$pr25i$, $pr25j$/sikalongan.com/images/products/sikadur-42mp-1.jpg$pr25j$, TIMESTAMP '2022-09-19 07:39:11'),
(27, 4537, $pr26a$SIKALONGAN-4537$pr26a$, $pr26b$sikagrout-214-11-hs$pr26b$, $pr26c$SIKAGROUT 214-11 HS$pr26c$, $pr26d$vua-rot-dinh-vi$pr26d$, $pr26e$sika$pr26e$, $pr26f$VỮA RÓT ĐỊNH VỊ$pr26f$, $pr26g$Sikagrout 214-11 HS là vữa rót gốc xi măng, không co ngót, đạt cường độ cao sớm$pr26g$, $pr26h$<h2><strong>CÁC ỨNG DỤNG CỦA SIKAGROUT 214-11 HS</strong></h2>
<ul>
<li>Sikagrout 214-11 HS được thiết kế để kháng lại sự co ngót thông thường của bê tông và vữa đồng thời hấp thụ và giảm thiểu các ảnh hưởng của sự rung động đến nền móng.</li>
<li>Tính năng đạt cường độ cao sớm rất thích hợp cho những nơi có yêu cầu chịu tải trọng sớm như móng máy, cột chịu lực, dầm dự ứng lực, gối cầu, thanh tà vẹt và bu lông định vị…</li>
</ul>
<h2><strong>ƯU ĐIỂM CỦA SIKAGROUT 214-11 HS</strong></h2>
<ul>
<li>Độ chảy lỏng tuyệt hảo</li>
<li>Ổn định về kích thước tốt</li>
<li>Kiểm soát được sự giãn nở</li>
<li>Không có clorua, không bị rỉ sét, tách nước hoặc làm tổn hại kim loại khi tiếp xúc</li>
<li>Đạt cường độ nén cao sớm, cho phép chịu tải sớm và giảm tối thiểu chi phí</li>
<li>Việc tạo cường độ sớm làm giảm tối thiểu thời gian chờ để bảo trì và sửa chữa</li>
<li>Không độc, không ăn mòn</li>
<li>Dễ dàng sử dụng được ngay</li>
<li>Hiệu quả kinh tế cao</li>
</ul>
<h2><strong>THÔNG TIN VỀ SẢN PHẨM </strong><strong>SIKAGROUT 214-11 HS</strong></h2>
<ul>
<li><strong><u>Dạng/Màu</u></strong>: Bột/Xám bê tông</li>
<li><strong><u>Đóng gói</u></strong>: 25 kg/bao</li>
<li><strong><u>Lưu trữ</u></strong>: nơi khô mát có bóng râm</li>
<li><strong><u>Thời hạn sử dụng</u></strong>: tối thiểu 6 tháng nếu được lưu trữ đúng cách trong bao bì nguyên chưa mở.</li>
</ul>$pr26h$, $pr26i$/sikalongan.com/images/products/sikagrout-214-11-hs-1.jpeg$pr26i$, $pr26j$/sikalongan.com/images/products/sikagrout-214-11-hs-1.jpeg$pr26j$, TIMESTAMP '2022-09-19 07:37:48'),
(28, 4533, $pr27a$SIKALONGAN-4533$pr27a$, $pr27b$sika-anchorfix-s$pr27b$, $pr27c$SIKA ANCHORFIX S$pr27c$, $pr27d$chat-ket-dinh-cuong-do-cao$pr27d$, $pr27e$sika$pr27e$, $pr27f$Sản phẩm | CHẤT KẾT DÍNH CƯỜNG ĐỘ CAO$pr27f$, $pr27g$Keo khoan cấy thép thông dụng gốc epoxy, 2 thành phần$pr27g$, $pr27h$<p><strong>MÔ TẢ VỀ SIKA ANCHORFIX S</strong></p>
<p>Sika Anchorfix S là sản phẩm keo khoan cấy thép 2 thành phần gốc Styrenated polyester</p>
<p>CÁC ỨNG DỤNG CỦA SIKA A ANCHORFIX S</p>
<p>Sika AnchorFix S nên được thi công bởi những nhà thầu chuyên nghiệp.</p>
<p>Keo khoan cấy thép chuyên dụng cho các hạng mục sau:</p>
<p>Neo thép/ thép chịu lực</p>
<p>Thép ren</p>
<p>Bulông hay các hệ thống cố định đặc biệt trên các bề mặt:</p>
<p>&#8211; Bê tông</p>
<p>&#8211; Bề mặt gạch đặc hay rỗng</p>
<p>&#8211; Đá cứng tự nhiên*</p>
<p>&#8211; Đá mồ côi</p>
<p>** Các bề mặt nền này có thể không đồng nhất đặc biệt là về cường độ, thành phần cấu tạo và độ rỗng. Do đó phải kiểm tra sự tương thích của Sika AnchorFix S đối với từng ứng dụng cụ thể bằng cách thi công sản phẩm trên khu vực mẫu. Đặc biệt chú ý về cường độ bám dính, sự ố màu và sự phai màu.</p>
<p><strong>ƯU ĐIỂM CỦA SIKA ANCHORFIX S</strong></p>
<p>Đóng rắn nhanh</p>
<p>Không võng, kể cả trên phương đứng</p>
<p>Đánh giá thử nghiệm neo thép trong bê tông không nứt theo ETA</p>
<p>Ít hao hụt.</p>$pr27h$, $pr27i$/sikalongan.com/images/products/sika-anchorfix-s-1.jpg$pr27i$, $pr27j$/sikalongan.com/images/products/sika-anchorfix-s-1.jpg$pr27j$, TIMESTAMP '2022-09-19 07:36:19'),
(29, 4534, $pr28a$SIKALONGAN-4534$pr28a$, $pr28b$sikagrout-214-11-2$pr28b$, $pr28c$SIKAGROUT 214-11$pr28c$, $pr28d$vua-rot-dinh-vi$pr28d$, $pr28e$sika$pr28e$, $pr28f$VỮA RÓT ĐỊNH VỊ$pr28f$, $pr28g$Sikagrout 214-11 là vữa gốc xi măng, tự san bằng, không co ngót với thời gian cho phép thi công được kéo dài để thích ứng với nhiệt độ địa phương. Sikagrout 214-11 được dùng để rót vữa cho nền móng máy, định vị bu lông, các lỗ hổng và nơi sửa chữa cần cường độ cao$pr28g$, $pr28h$<p>CÁC ỨNG DỤNG CỦA SIKAGROUT 214-11<br />
Sikagrout 214-11 thích hợp cho các công việc rót vữa sau</p>
<p>Nền móng máy (không rung động)<br />
Bệ đường ray<br />
Trụ cột trong các kết cấu đúc sẵn<br />
Định vị bu lông<br />
Gối cầu<br />
Các lỗ hổng<br />
Các khe hở<br />
Các hốc tường<br />
Nơi sửa chữa cần cường độ cao.</p>
<h2><strong>ƯU ĐIỂM CỦA SIKAGROUT 214-11</strong></h2>
<p>Sikagrout 214-11 là một loại vữa rất kinh tế và dễ sử dụng, ngoài ra còn có một số ưu điểm khác bao gồm:</p>
<ul>
<li>Độ chảy lỏng tuyệt hảo</li>
<li>Ổn định kích thước tốt</li>
<li>Cường độ cao, độ sệt có thể điều chỉnh</li>
<li>Không tách nước</li>
<li>Không độc hại, không bị ăn mòn</li>
<li>Đã được trộn sẵn và sử dụng được ngay chỉ cần thêm nước</li>
<li>Kháng va đập, rung động</li>
<li>Có thể bơm vữa bằng máy bơm thích hợp.</li>
</ul>$pr28h$, $pr28i$/sikalongan.com/images/products/sikagrout-214-11-2-1.webp$pr28i$, $pr28j$/sikalongan.com/images/products/sikagrout-214-11-2-1.webp$pr28j$, TIMESTAMP '2022-09-19 07:35:27'),
(30, 4497, $pr29a$SIKALONGAN-4497$pr29a$, $pr29b$sikagrout-gp$pr29b$, $pr29c$SikaGrout® GP$pr29c$, $pr29d$vua-rot-dinh-vi$pr29d$, $pr29e$sika$pr29e$, $pr29f$VỮA RÓT ĐỊNH VỊ$pr29f$, $pr29g$Vữa rót gốc xi măng, không co ngót, có thể bơm được dùng cho các mục đích thông thường$pr29g$, $pr29h$<h3>Ứng dụng</h3>
<p>SikaGrout GP thích hợp cho các công việc rót vữa sau:</p>
<ul>
<li>Nền móng máy (không rung động)</li>
<li>Bệ đường ray</li>
<li>Trụ cột trong các kết cấu đúc sẵn</li>
<li>Định vị bu lông</li>
<li>Gối cầu</li>
<li>Các lỗ hổng</li>
<li>Các khe hở</li>
<li>Các hốc tường</li>
<li>Sửa chữa bê tông</li>
</ul>$pr29h$, $pr29i$/sikalongan.com/images/products/sikagrout-gp-1.webp$pr29i$, $pr29j$/sikalongan.com/images/products/sikagrout-gp-1.webp$pr29j$, TIMESTAMP '2022-09-17 09:06:09'),
(31, 4495, $pr30a$SIKALONGAN-4495$pr30a$, $pr30b$sikatop-109-seal-vn$pr30b$, $pr30c$SikaTop®-109 Seal VN$pr30c$, $pr30d$vat-lieu-chong-tham$pr30d$, $pr30e$sika$pr30e$, $pr30f$Vật liệu chống thấm$pr30f$, $pr30g$SikaTop®-109 Seal VN là lớp phủ chống thấm 2 thành phần, có tính đàn hồi, sản phẩm được thi công lên bề mặt bê tông hay vữa để ngăn nước.$pr30g$, $pr30h$<h3>Ứng dụng</h3>
<p>SikaTop®-109 Seal VN dùng chống thấm, trám vết nứt chân chim và cũng là lớp bảo vệ chống lại sự thâm nhập của khí carbonic, kháng lại quá trinh hình thành băng tuyết. Sản phẩm được dùng chống thấm cho: bể nước, bể bơi, tầng hầm, ban công, sân thượng, cầu, tường chắn, sàn và tường phòng tắm, nhà bếp, khu vực ẩm ướt.</p>$pr30h$, $pr30i$/sikalongan.com/images/products/sikatop-109-seal-vn-1.webp$pr30i$, $pr30j$/sikalongan.com/images/products/sikatop-109-seal-vn-1.webp$pr30j$, TIMESTAMP '2022-09-17 08:58:59'),
(32, 4493, $pr31a$SIKALONGAN-4493$pr31a$, $pr31b$sika-monotop-166-migrating$pr31b$, $pr31c$Sika MonoTop®-166 Migrating$pr31c$, $pr31d$vat-lieu-chong-tham$pr31d$, $pr31e$sika$pr31e$, $pr31f$Vật liệu chống thấm$pr31f$, $pr31g$Vữa chống thấm gốc xi-măng một thành phần cải tiến với cốt liệu chọn lọc và thành phần hóa học hoạt tính. Vữa sẽ thẩm thấu vào trong mao dẫn của bê tông để ngăn thấm nước vào kết cấu.$pr31g$, $pr31h$<h3>Ứng dụng</h3>
<ul>
<li>​​​​​Ứng dụng: sàn hầm đáy trước khi đổ bê tông tươi</li>
<li>Nội thất/ Ngoại thất</li>
<li>Sàn hầm gửi xe, tầng hầm</li>
<li>Bề mặt: bê tông, vữa</li>
</ul>$pr31h$, $pr31i$/sikalongan.com/images/products/sika-monotop-166-migrating-1.webp$pr31i$, $pr31j$/sikalongan.com/images/products/sika-monotop-166-migrating-1.webp$pr31j$, TIMESTAMP '2022-09-17 08:56:49'),
(33, 4491, $pr32a$SIKALONGAN-4491$pr32a$, $pr32b$sikalastic-632-r$pr32b$, $pr32c$Sikalastic®-632 R$pr32c$, $pr32d$vat-lieu-chong-tham$pr32d$, $pr32e$sika$pr32e$, $pr32f$Vật liệu chống thấm$pr32f$, $pr32g$Sikalastic®-632 R là chất chống thấm gốc polyurethane nguyên chất, 1 thành phần, thi công lỏng, khô nhanh nhờ phản ứng với độ ẩm không khí, có khả năng phủ vết nứt tốt. Sau thi công tạo màng liên tục, không mối nối, kháng hóa chất, là giải pháp chống thấm bền lâu cho sàn mái ngoài trời.$pr32g$, $pr32h$<p>Sikalastic®-632 R là chất chống thấm gốc polyurethane nguyên chất, 1 thành phần, thi công lỏng, khô nhanh nhờ phản ứng với độ ẩm không khí, có khả năng phủ vết nứt tốt. Sau thi công tạo màng liên tục, không mối nối, kháng hóa chất, là giải pháp chống thấm bền lâu cho sàn mái ngoài trời.</p>$pr32h$, $pr32i$/sikalongan.com/images/products/sikalastic-632-r-1.webp$pr32i$, $pr32j$/sikalongan.com/images/products/sikalastic-632-r-1.webp$pr32j$, TIMESTAMP '2022-09-16 06:52:52'),
(34, 4489, $pr33a$SIKALONGAN-4489$pr33a$, $pr33b$sikalastic-590$pr33b$, $pr33c$Sikalastic®-590$pr33c$, $pr33d$vat-lieu-chong-tham$pr33d$, $pr33e$sika$pr33e$, $pr33f$Vật liệu chống thấm$pr33f$, $pr33g$Sikalastic®-590 là hợp chất chống thấm thi công lỏng, 1 thành phần, gốc PU-Acrylic phân tán, được cải thiện khả năng kháng lại sự đọng nước, kháng tia UV tuyệt hảo, khả năng phủ vết nứt tốt và có tính thẩm mỹ cao.$pr33g$, $pr33h$<p>Sikalastic®-590 là hợp chất chống thấm thi công lỏng, 1 thành phần, gốc PU-Acrylic phân tán, được cải thiện khả năng kháng lại sự đọng nước, kháng tia UV tuyệt hảo, khả năng phủ vết nứt tốt và có tính thẩm mỹ cao.</p>$pr33h$, $pr33i$/sikalongan.com/images/products/sikalastic-590-1.webp$pr33i$, $pr33j$/sikalongan.com/images/products/sikalastic-590-1.webp$pr33j$, TIMESTAMP '2022-09-16 06:52:18'),
(35, 4487, $pr34a$SIKALONGAN-4487$pr34a$, $pr34b$sikalastic-110$pr34b$, $pr34c$Sikalastic®-110$pr34c$, $pr34d$vat-lieu-chong-tham$pr34d$, $pr34e$sika$pr34e$, $pr34f$Vật liệu chống thấm$pr34f$, $pr34g$Sikalastic®-110 là sản phẩm chống thấm 1 thành phần Polyurethane cải tiến, gốc nước phân tán, tạo thành một lớp màng chống thấm không mối nối, có khả năng phủ vết nứt và có độ đàn hồi cao.$pr34g$, $pr34h$<p>Sikalastic®-110 là sản phẩm chống thấm 1 thành phần Polyurethane cải tiến, gốc nước phân tán, tạo thành một lớp màng chống thấm không mối nối, có khả năng phủ vết nứt và có độ đàn hồi cao.</p>$pr34h$, $pr34i$/sikalongan.com/images/products/sikalastic-110-1.webp$pr34i$, $pr34j$/sikalongan.com/images/products/sikalastic-110-1.webp$pr34j$, TIMESTAMP '2022-09-16 06:51:43'),
(36, 4485, $pr35a$SIKALONGAN-4485$pr35a$, $pr35b$sikacoat-plus$pr35b$, $pr35c$SikaCoat Plus$pr35c$, $pr35d$vat-lieu-chong-tham$pr35d$, $pr35e$sika$pr35e$, $pr35f$Vật liệu chống thấm$pr35f$, $pr35g$Màng chống thấm đàn hồi đa năng thi công lỏng một thành phần gốc acrylic. Có thể thi công trên bề mặt tường đứng, tường ngoài,…$pr35g$, $pr35h$<h3>Ứng dụng</h3>
<p>SikaCoat Plus được sử dụng cho:</p>
<ul>
<li>Lớp vữa trát mới<sup>(*)</sup></li>
<li>Bề mặt hoàn thiện</li>
<li>Trám khe, mái dốc và trám ốc vít cho nhiều loại mái như (mái lát gạch, mái lợp tấm amiang, mái tôn)</li>
<li>Tường đứng</li>
<li>Tường ngoài</li>
</ul>
<p>(*) Bê tông sau 3 ngày tuổi, độ ẩm &lt; 25 % và pH &lt; 7</p>$pr35h$, $pr35i$/sikalongan.com/images/products/sikacoat-plus-1.webp$pr35i$, $pr35j$/sikalongan.com/images/products/sikacoat-plus-1.webp$pr35j$, TIMESTAMP '2022-09-16 06:50:42'),
(37, 4483, $pr36a$SIKALONGAN-4483$pr36a$, $pr36b$bot-tret-cao-cap-kanshield-ks3333$pr36b$, $pr36c$Bột trét cao cấp Kanshield KS3333$pr36c$, $pr36d$son-kanshield$pr36d$, $pr36e$kanshield$pr36e$, $pr36f$SƠN KANSHIELD$pr36f$, $pr36g$Bột trét cao cấp Kanshield KS3333 là loại bột vữa lót mịn, được đặc chế để sử dụng làm phẳng, mịn bề mặt trước khi sơn, giúp hoàn thiện, phẳng đẹp. Đóng gói: 40kg$pr36g$, $pr36h$<p>Bột trét cao cấp Kanshield KS3333 là loại bột vữa lót mịn, được đặc chế để sử dụng làm phẳng, mịn bề mặt trước khi sơn, giúp hoàn thiện, phẳng đẹp.<br />
Đóng gói: 40kg</p>$pr36h$, $pr36i$/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-1.jpg$pr36i$, $pr36j$/sikalongan.com/images/products/bot-tret-cao-cap-kanshield-ks3333-1.jpg$pr36j$, TIMESTAMP '2022-09-16 06:49:23'),
(38, 4481, $pr37a$SIKALONGAN-4481$pr37a$, $pr37b$son-noi-that-cao-cap-kanshield-ks6666$pr37b$, $pr37c$Sơn nội thất cao cấp Kanshield KS6666$pr37c$, $pr37d$son-kanshield$pr37d$, $pr37e$kanshield$pr37e$, $pr37f$SƠN KANSHIELD$pr37f$, $pr37g$Sơn nội thất cao cấp Kanshield KS6666 là loại sơn gốc nước trong nhà chất lượng. Được sản xuất theo công nghệ hiện đại của Kanshield phù hợp với điều kiện khí hậu Việt Nam. Giữ màu tuyệt đối, màng sơn bóng mờ sang trọng. Đóng gói: 18 lít$pr37g$, $pr37h$<p>Sơn nội thất cao cấp KS6666 là loại sơn gốc nước ngoài trời chất lượng. Được sản xuất theo tiêu chuẩn công nghệ hiện đại KANSHIELD phù hợp với điều kiện khí hậu Việt Nam. Giữ màu tuyệt đối, màng bóng mờ sang trọng, mịn màng như lụa, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời, là giải pháp hoàn hảo trong việc trang trí và bảo vệ các mặt tường trong nhà.</p>
<p><img class="aligncenter size-full wp-image-4699" src="/sikalongan.com/images/products/son-noi-that-cao-cap-kanshield-ks6666-2.jpg" alt="" width="1280" height="902" /></p>
<p><strong>THÀNH PHẦN CẤU TẠO</strong></p>
<p>Nước, bột màu, 100% nhựa Acrylic, phụ gia(không chứa chì và thủy nhân).</p>
<p><strong>TIÊU CHUẨN CHẤT LƯỢNG CHỦ YẾU</strong></p>
<p>&#8211; Độ phủ lý thuyết 10-12m2 lít/lớp</p>
<p>Chuẩn bị bề mặt:</p>
<p>Bề mặt sơn phải sạch, khô, độ ấm tường dưới 16%, không có tạp chất làm giảm sự bám dính như bụi, dầu mỡ, nấm mốc</p>
<p><strong>HỆ THỐNG SƠN ĐỀ NGHỊ:</strong></p>
<p>Bề mặt tường cũ:</p>
<p>&#8211; Dùng giấy nhám thích hợp để chà nhám rồi quét sạch bụi. Phải xử lý bề mặt tường có dấu hiệu nấm mốc hoặc rong rêu.</p>
<p>&#8211; Sau khi xử lý kỹ bề mặt, sơn 1 lớp lót KS7777</p>
<p>&#8211; Sơn hai lớp sơn hoàn thiện KS6666</p>
<p><strong>Bề mặt tường mới:</strong></p>
<p>&#8211; Làm phẳng bề mặt bằng 2 lớp bột trét KS3333</p>
<p>&#8211; Sơn 1 &#8211; 2 lớp sơn lót KS7777</p>
<p>&#8211; Sau 1 &#8211; 2 lớp sơn hoàn thiện KS6666</p>
<p><strong>BẢO QUẢN:</strong></p>
<p>&#8211; Đặt thùng sơn ở vị trí thẳng đứng, an toàn, đậy chặt nắp.</p>
<p>&#8211; Tồn trữ trong điều kiện thông thoáng, mát mẻ.</p>
<p>&#8211; Sau khi mở nắp thùng, sơn phải được sử dụng hết trong vòng 24 giờ.</p>$pr37h$, $pr37i$/sikalongan.com/images/products/son-noi-that-cao-cap-kanshield-ks6666-1.jpg
/sikalongan.com/images/products/son-noi-that-cao-cap-kanshield-ks6666-2.jpg$pr37i$, $pr37j$/sikalongan.com/images/products/son-noi-that-cao-cap-kanshield-ks6666-1.jpg$pr37j$, TIMESTAMP '2022-09-16 06:48:47'),
(39, 4477, $pr38a$SIKALONGAN-4477$pr38a$, $pr38b$son-bong-cao-cap-kanshield-ks8888-5l$pr38b$, $pr38c$Sơn bóng cao cấp Kanshield KS8888 5L$pr38c$, $pr38d$son-kanshield$pr38d$, $pr38e$kanshield$pr38e$, $pr38f$SƠN KANSHIELD$pr38f$, $pr38g$Sơn đặc chủng chống thấm ngoài trời KS8888 là loại sơn gốc nước ngoài trời chất lượng.Sản phẩm giúp giữ màu tuyệt đối, màng sơn siêu bóng, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời. Đây là giài pháp hoàn hảo trong việc trang trí và bảo vệ mặt tường ngoài nhà. Hình ảnh bên cạnh là mẫu 1 của sản phẩm này. Đóng gói: 1 lít – 5 lít – 18 lít$pr38g$, $pr38h$<p>Sơn đặc chủng chống thấm ngoài trời KS8888 là loại sơn gốc nước ngoài trời chất lượng.Sản phẩm giúp giữ màu tuyệt đối, màng sơn siêu bóng, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời. Đây là giài pháp hoàn hảo trong việc trang trí và bảo vệ mặt tường ngoài nhà. Hình ảnh bên cạnh là mẫu 1 của sản phẩm này. Đóng gói: 1 lít – 5 lít – 18 lít</p>$pr38h$, $pr38i$/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-5l-1.jpg$pr38i$, $pr38j$/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-5l-1.jpg$pr38j$, TIMESTAMP '2022-09-16 06:47:34'),
(40, 4475, $pr39a$SIKALONGAN-4475$pr39a$, $pr39b$son-bong-cao-cap-kanshield-ks8888-18l$pr39b$, $pr39c$Sơn bóng cao cấp Kanshield KS8888$pr39c$, $pr39d$son-kanshield$pr39d$, $pr39e$kanshield$pr39e$, $pr39f$SƠN KANSHIELD$pr39f$, $pr39g$Sơn đặc chủng siêu bóng chống thấm ngoài trời KS8888 là loại sơn gốc nước ngoài trời chất lượng. Được sản xuất theo tiêu chuẩn công nghệ hiện đại KANSHIELD phù hợp với điều kiện khí hậu Việt Nam.$pr39g$, $pr39h$<p>Sơn đặc chủng siêu bóng chống thấm ngoài trời KS8888 là loại sơn gốc nước ngoài trời chất lượng. Được sản xuất theo tiêu chuẩn công nghệ hiện đại KANSHIELD phù hợp với điều kiện khí hậu Việt Nam. Giữ màu tuyệt đối, màng bóng mờ sang trọng, mịn màng như lụa, kháng kiềm, chống bám bụi, chống rêu mốc tuyệt vời, là giải pháp hoàn hảo trong việc trang trí và bảo vệ các mặt tường trong nhà.</p>
<p><img class="aligncenter size-full wp-image-4696" src="/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-18l-2.jpg" alt="" width="1280" height="902" /></p>
<p><strong>THÀNH PHẦN CẤU TẠO</strong></p>
<p>Nước, bột màu, 100% nhựa Acrylic, phụ gia(không chứa chì và thủy nhân).</p>
<p><strong>TIÊU CHUẨN CHẤT LƯỢNG CHỦ YẾU</strong></p>
<p>&#8211; Độ phủ lý thuyết 11-13m2 lít/lớp</p>
<p>Chuẩn bị bề mặt:</p>
<p>Bề mặt sơn phải sạch, khô, độ ấm tường dưới 16%, không có tạp chất làm giảm sự bám dính như bụi, dầu mỡ, nấm mốc</p>
<p><strong>HỆ THỐNG SƠN ĐỀ NGHỊ:</strong></p>
<p>Bề mặt tường cũ:</p>
<p>&#8211; Dùng giấy nhám thích hợp để chà nhám rồi quét sạch bụi. Phải xử lý bề mặt tường có dấu hiệu nấm mốc hoặc rong rêu.</p>
<p>&#8211; Sau khi xử lý kỹ bề mặt, sơn 1 lớp lót KS7777</p>
<p>&#8211; Sơn hai lớp sơn hoàn thiện KS6666</p>
<p><strong>Bề mặt tường mới:</strong></p>
<p>&#8211; Làm phẳng bề mặt bằng 2 lớp bột trét KS3333</p>
<p>&#8211; Sơn 1 &#8211; 2 lớp sơn lót KS7777</p>
<p>&#8211; Sau 1 &#8211; 2 lớp sơn hoàn thiện KS8888</p>
<p><strong>BẢO QUẢN:</strong></p>
<p>&#8211; Đặt thùng sơn ở vị trí thẳng đứng, an toàn, đậy chặt nắp.</p>
<p>&#8211; Tồn trữ trong điều kiện thông thoáng, mát mẻ.</p>
<p>&#8211; Sau khi mở nắp thùng, sơn phải được sử dụng hết trong vòng 24 giờ.</p>$pr39h$, $pr39i$/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-18l-1.jpg
/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-18l-2.jpg$pr39i$, $pr39j$/sikalongan.com/images/products/son-bong-cao-cap-kanshield-ks8888-18l-1.jpg$pr39j$, TIMESTAMP '2022-09-16 06:46:53'),
(41, 4472, $pr40a$SIKALONGAN-4472$pr40a$, $pr40b$son-chong-tham-cao-cap-kanshield-ks9999$pr40b$, $pr40c$Sơn chống thấm cao cấp Kanshield KS9999$pr40c$, $pr40d$son-kanshield$pr40d$, $pr40e$kanshield$pr40e$, $pr40f$SƠN KANSHIELD$pr40f$, $pr40g$Sơn chống thấm cao cấp Kanshield KS9999 sử dụng hợp chất chống thấm đàn hồi kháng UV dạng sệt gốc Acrylic giúp chống thấm tốt trên sàn mái bê tông, bề mặt hoàn thiện, khe mối nối và các vị trí ốc vít, chân tường trên mái, tường ngoài. Đóng gói: 5kg/20kg$pr40g$, $pr40h$<p>Sơn chống thấm cao cấp Kanshield KS9999 sử dụng hợp chất chống thấm đàn hồi kháng UV dạng sệt gốc Acrylic giúp chống thấm tốt trên sàn mái bê tông, bề mặt hoàn thiện, khe mối nối và các vị trí ốc vít, chân tường trên mái, tường ngoài.<br />
Đóng gói: 5kg/20kg</p>$pr40h$, $pr40i$/sikalongan.com/images/products/son-chong-tham-cao-cap-kanshield-ks9999-1.png$pr40i$, $pr40j$/sikalongan.com/images/products/son-chong-tham-cao-cap-kanshield-ks9999-1.png$pr40j$, TIMESTAMP '2022-09-16 06:45:22'),
(42, 4443, $pr41a$SIKALONGAN-4443$pr41a$, $pr41b$sika-waterbar-v20-eco$pr41b$, $pr41c$SIKA WATERBAR V20 ECO$pr41c$, $pr41d$vat-lieu-chong-tham$pr41d$, $pr41e$bestmix$pr41e$, $pr41f$BESTMIX | Vật liệu chống thấm$pr41f$, $pr41g$Sử dụng: Chống thấm mạch ngừng bê tông Đóng gói: Cuộn 20 mét$pr41g$, $pr41h$<p>Sử dụng: Chống thấm mạch ngừng bê tông Đóng gói: Cuộn 20 mét</p>$pr41h$, $pr41i$/sikalongan.com/images/products/sika-waterbar-v20-eco-1.jpg$pr41i$, $pr41j$/sikalongan.com/images/products/sika-waterbar-v20-eco-1.jpg$pr41j$, TIMESTAMP '2022-09-05 06:32:58'),
(43, 4441, $pr42a$SIKALONGAN-4441$pr42a$, $pr42b$separol-25l$pr42b$, $pr42c$Separol – 25l$pr42c$, $pr42d$vat-lieu-chong-tham$pr42d$, $pr42e$bestmix$pr42e$, $pr42f$BESTMIX | Vật liệu chống thấm$pr42f$, $pr42g$Sika Separol là tác nhân tháo dỡ cho các loại khuôn gỗ, thép. Separol giúp cho việc tháo dỡ và làm vệ sinh ván khuôn được dễ dàng.$pr42g$, $pr42h$<p>Sika Separol là tác nhân tháo dỡ cho các loại khuôn gỗ, thép. Separol giúp cho việc tháo dỡ và làm vệ sinh ván khuôn được dễ dàng.</p>$pr42h$, $pr42i$/sikalongan.com/images/products/separol-25l-1.jpg$pr42i$, $pr42j$/sikalongan.com/images/products/separol-25l-1.jpg$pr42j$, TIMESTAMP '2022-09-05 06:31:02'),
(44, 4438, $pr43a$SIKALONGAN-4438$pr43a$, $pr43b$son-lot-cao-cap-kanshield-ks7777$pr43b$, $pr43c$Sơn lót cao cấp Kanshield KS7777$pr43c$, $pr43d$son-kanshield$pr43d$, $pr43e$kanshield$pr43e$, $pr43f$SƠN KANSHIELD$pr43f$, $pr43g$Sơn lót cao cấp Kanshield KS7777 là loại sơn lót cao cấp ngoài trời, kháng kiềm, gốc nước thân thiện với môi trường. Đóng gói: Thùng 18 lít/ lon 5 lít$pr43g$, $pr43h$<p>Sơn lót kháng kiềm ngoại thất KS7777 là loại sơn lót cao cấp ngoài trời gốc nước thân thiện với môi trường.</p>
<p>Sơn lót kháng kiềm ngoại thất KS7777 được pha chế đặc biệt với sự gia tăng hơn 40% lượng nhựa Acrylic đem lại sự bảo vệ và kháng kiềm, kháng muỗi vượt trội, giúp ngăn ngừa sự phai màu và xuống cấp của màng sơn đồng thời làm tăng độ bám dính của cả hệ thống sơn.</p>
<p>Sơn lót kháng kiềm KS7777 đặc biệt hữu hiệu trong việc chống rêu, mốc đồng thời giữ cho màu sắc lớp sơn phủ được bền màu.</p>
<p><img class="aligncenter size-full wp-image-4694" src="/sikalongan.com/images/products/son-lot-cao-cap-kanshield-ks7777-2.jpg" alt="" width="1280" height="902" /></p>
<p>Đặc điểm của sơn lót kháng kiềm KS7777</p>
<p>&#8211; Chống kiềm hóa vượt trội với sự gia tăng hơn 40% lượng nhựa Acrylic chống kiềm.</p>
<p>&#8211; Ngăn chặn hữu hiệu sự phai màu của lớp sơn phủ do hiện tượng muỗi hóa gây ra.</p>
<p>&#8211; Độ bám dính tốt,</p>
<p>&#8211; Dùng sơn lót cho bền mặt ngoại thất và nội thất</p>
<p>&#8211; Khả năng chống rêu và nấm mốc.</p>
<p>&#8211; Chịu được môi trường PH cao.</p>
<p>&#8211; Khô nhanh, rất thuận tiện để thi công lớp kế tiếp</p>
<p>&#8211; Dễ thi công</p>
<p>HƯỚNG DẪN SỬ DỤNG</p>
<p>Chuẩn bị bề mặt:</p>
<p>&#8211; Bề mặt phải sạch, khô và ổn định, không có tạp chất làm giảm độ bám dính như bụi, dầu, mỡ,…</p>
<p>&#8211; Dùng hóa chất thích hợp để xử lý bề mặt cỏ rêu mốc.</p>
<p>&#8211; Đối với bề mặt cũ bị phân hóa, cần loại bỏ màng sơn cũ bằng dụng cụ thích hợp trước khi thi công.</p>
<p>&#8211; Xử lý triệt để các vết nứt tường trước khi thi công sơn</p>
<p>Pha loãng: Được phép pha loãng không quá 5% lượng nước sạch.</p>
<p>Thi công:</p>
<p>&#8211; Dùng ngayy sau khi mở nắp.</p>
<p>&#8211; Độ ẩm của bề mặt dưới 16% theo máy đo độ ẩm Protimeter hay để bề mặt tường khô từ 21 đến 28 ngày trong điều kiện bình thường (nhiệt độ trung bình 30 độ C, độ ẩm môi trường 80%)</p>$pr43h$, $pr43i$/sikalongan.com/images/products/son-lot-cao-cap-kanshield-ks7777-1.jpg
/sikalongan.com/images/products/son-lot-cao-cap-kanshield-ks7777-2.jpg$pr43i$, $pr43j$/sikalongan.com/images/products/son-lot-cao-cap-kanshield-ks7777-1.jpg$pr43j$, TIMESTAMP '2022-09-05 06:28:56'),
(45, 4403, $pr44a$SIKALONGAN-4403$pr44a$, $pr44b$sikadur-20-crack-seal-ab$pr44b$, $pr44c$Sikadur 20 Crack Seal (AB)$pr44c$, $pr44d$vat-lieu-chong-tham$pr44d$, $pr44e$sika$pr44e$, $pr44f$Vật liệu chống thấm$pr44f$, $pr44g$Keo gốc epoxy 2 thành phần, dạng lỏng đàn hồi nhẹ, không dung môi. Đặc biệt phù hợp để trám khe nứt nông (không phải nứt kết cấu) và lỗ rỗng trong bê tông.$pr44g$, $pr44h$<p>Keo gốc epoxy 2 thành phần, dạng lỏng đàn hồi nhẹ, không dung môi. Đặc biệt phù hợp để trám khe nứt nông (không phải nứt kết cấu) và lỗ rỗng trong bê tông.</p>$pr44h$, $pr44i$/sikalongan.com/images/products/sikadur-20-crack-seal-ab-1.jpg$pr44i$, $pr44j$/sikalongan.com/images/products/sikadur-20-crack-seal-ab-1.jpg$pr44j$, TIMESTAMP '2022-08-23 09:12:27'),
(46, 4401, $pr45a$SIKALONGAN-4401$pr45a$, $pr45b$sikaflex-construction-j-g$pr45b$, $pr45c$Sikaflex Construction (j) G$pr45c$, $pr45d$vat-lieu-chong-tham$pr45d$, $pr45e$sika$pr45e$, $pr45f$Vật liệu chống thấm$pr45f$, $pr45g$Hợp chất trám khe một thành phần, gốc polyurethane. Dùng như chất trám khe đa năng và là hợp chất trám trét các khoảng hở, được dùng chủ yếu trong xây dựng nhà cao tầng.$pr45g$, $pr45h$<p>Hợp chất trám khe một thành phần, gốc polyurethane. Dùng như chất trám khe đa năng và là hợp chất trám trét các khoảng hở, được dùng chủ yếu trong xây dựng nhà cao tầng.</p>$pr45h$, $pr45i$/sikalongan.com/images/products/sikaflex-construction-j-g-1.jpg$pr45i$, $pr45j$/sikalongan.com/images/products/sikaflex-construction-j-g-1.jpg$pr45j$, TIMESTAMP '2022-08-23 09:11:52'),
(47, 4399, $pr46a$SIKALONGAN-4399$pr46a$, $pr46b$sika-tilebond-gp-25-kg-keo-dan-gach$pr46b$, $pr46c$Sika Tilebond GP – 25 kg – keo dán gạch$pr46c$, $pr46d$vat-lieu-chong-tham$pr46d$, $pr46e$sika$pr46e$, $pr46f$Vật liệu chống thấm$pr46f$, $pr46g$Sika® TileBond GP là keo dán gạch đóng gói sẵn, gốc xi măng.$pr46g$, $pr46h$<p>Sika® TileBond GP là keo dán gạch đóng gói sẵn, gốc xi măng.</p>$pr46h$, $pr46i$/sikalongan.com/images/products/sika-tilebond-gp-25-kg-keo-dan-gach-1.jpg$pr46i$, $pr46j$/sikalongan.com/images/products/sika-tilebond-gp-25-kg-keo-dan-gach-1.jpg$pr46j$, TIMESTAMP '2022-08-23 09:10:52'),
(48, 4397, $pr47a$SIKALONGAN-4397$pr47a$, $pr47b$sikalastic-590-20kg-chong-tham-san-mai$pr47b$, $pr47c$Sikalastic 590-20kg – chống thấm sàn mái$pr47c$, $pr47d$vat-lieu-chong-tham$pr47d$, $pr47e$sika$pr47e$, $pr47f$Vật liệu chống thấm$pr47f$, $pr47g$Sikalastic®-590 là hợp chất chống thấm thi công lỏng, 1 thành phần, gốc PU-Acrylic phân tán, được cải thiện khả năng kháng lại sự đọng nước, kháng tia UV tuyệt hảo, khả năng phủ vết nứt tốt và có tính thẩm mỹ cao.$pr47g$, $pr47h$<p>Sikalastic®-590 là hợp chất chống thấm thi công lỏng, 1 thành phần, gốc PU-Acrylic phân tán, được cải thiện khả năng kháng lại sự đọng nước, kháng tia UV tuyệt hảo, khả năng phủ vết nứt tốt và có tính thẩm mỹ cao.</p>$pr47h$, $pr47i$/sikalongan.com/images/products/sikalastic-590-20kg-chong-tham-san-mai-1.jpg$pr47i$, $pr47j$/sikalongan.com/images/products/sikalastic-590-20kg-chong-tham-san-mai-1.jpg$pr47j$, TIMESTAMP '2022-08-23 09:08:00'),
(49, 4395, $pr48a$SIKALONGAN-4395$pr48a$, $pr48b$sikadur-731$pr48b$, $pr48c$Sikadur 731$pr48c$, $pr48d$vat-lieu-chong-tham$pr48d$, $pr48e$sika$pr48e$, $pr48f$Vật liệu chống thấm$pr48f$, $pr48g$Ứng dụng: cấy thép vào trong bê tông, Vữa sửa chữa bê tông Màu: Xám (thành phần A: Trắng, thành phần B: đen) Đóng gói: 1 Kg / bộ Thời hạn sử dụng: 12 tháng Định mức sử dụng sikadur 731: Khoảng 1.70 Kg/lít$pr48g$, $pr48h$<p>Ứng dụng: cấy thép vào trong bê tông, Vữa sửa chữa bê tông Màu: Xám (thành phần A: Trắng, thành phần B: đen) Đóng gói: 1 Kg / bộ Thời hạn sử dụng: 12 tháng Định mức sử dụng sikadur 731: Khoảng 1.70 Kg/lít</p>$pr48h$, $pr48i$/sikalongan.com/images/products/sikadur-731-1.jpg$pr48i$, $pr48j$/sikalongan.com/images/products/sikadur-731-1.jpg$pr48j$, TIMESTAMP '2022-08-23 09:07:24'),
(50, 4393, $pr49a$SIKALONGAN-4393$pr49a$, $pr49b$sikatop-seal-107$pr49b$, $pr49c$SikaTop Seal 107$pr49c$, $pr49d$vat-lieu-chong-tham$pr49d$, $pr49e$sika$pr49e$, $pr49f$Vật liệu chống thấm$pr49f$, $pr49g$Sử dụng: Chống thấm thuận và ngược Đóng gói: Bộ 25 kg 2 thành phần Xuất xứ: Sika Việt Nam$pr49g$, $pr49h$<p>Sử dụng: Chống thấm thuận và ngược Đóng gói: Bộ 25 kg 2 thành phần Xuất xứ: Sika Việt Nam</p>$pr49h$, $pr49i$/sikalongan.com/images/products/sikatop-seal-107-1.jpg$pr49i$, $pr49j$/sikalongan.com/images/products/sikatop-seal-107-1.jpg$pr49j$, TIMESTAMP '2022-08-23 09:06:37'),
(51, 4391, $pr50a$SIKALONGAN-4391$pr50a$, $pr50b$sikafloor-chapdur-grey-xoa-nen-mau-xam$pr50b$, $pr50c$Sikafloor Chapdur Grey – xoa nền màu xám$pr50c$, $pr50d$vat-lieu-chong-tham$pr50d$, $pr50e$sika$pr50e$, $pr50f$Vật liệu chống thấm$pr50f$, $pr50g$Sikafloor Chapdur Grey là chất làm cứng sàn gốc xi măng, sử dụng được ngay ở dạng rắc khô. Sikafloor Chapdur có chứa các cốt liệu thiên nhiên rất cứng có kích cỡ thành phần hạt được chọn lọc kỹ.$pr50g$, $pr50h$<p>Sikafloor Chapdur Grey là chất làm cứng sàn gốc xi măng, sử dụng được ngay ở dạng rắc khô. Sikafloor Chapdur có chứa các cốt liệu thiên nhiên rất cứng có kích cỡ thành phần hạt được chọn lọc kỹ.</p>$pr50h$, $pr50i$/sikalongan.com/images/products/sikafloor-chapdur-grey-xoa-nen-mau-xam-1.jpg$pr50i$, $pr50j$/sikalongan.com/images/products/sikafloor-chapdur-grey-xoa-nen-mau-xam-1.jpg$pr50j$, TIMESTAMP '2022-08-23 09:05:55'),
(52, 4389, $pr51a$SIKALONGAN-4389$pr51a$, $pr51b$sikafloor-chapdur-green-xoa-nen-mau-xanh-la$pr51b$, $pr51c$Sikafloor Chapdur Green$pr51c$, $pr51d$vat-lieu-chong-tham$pr51d$, $pr51e$sika$pr51e$, $pr51f$Vật liệu chống thấm$pr51f$, $pr51g$Sikafloor Chapdur Green là chất làm cứng sàn gốc xi măng, sử dụng được ngay ở dạng rắc khô. Sikafloor Chapdur có chứa các cốt liệu thiên nhiên rất cứng có kích cỡ thành phần hạt được chọn lọc kỹ.$pr51g$, $pr51h$<p>Sikafloor Chapdur Green là chất làm cứng sàn gốc xi măng, sử dụng được ngay ở dạng rắc khô. Sikafloor Chapdur có chứa các cốt liệu thiên nhiên rất cứng có kích cỡ thành phần hạt được chọn lọc kỹ.</p>$pr51h$, $pr51i$/sikalongan.com/images/products/sikafloor-chapdur-green-xoa-nen-mau-xanh-la-1.jpg$pr51i$, $pr51j$/sikalongan.com/images/products/sikafloor-chapdur-green-xoa-nen-mau-xanh-la-1.jpg$pr51j$, TIMESTAMP '2022-08-23 09:05:14'),
(53, 4387, $pr52a$SIKALONGAN-4387$pr52a$, $pr52b$sikagrout-214-11$pr52b$, $pr52c$SIKAGROUT 214-11$pr52c$, $pr52d$vat-lieu-chong-tham$pr52d$, $pr52e$bestmix$pr52e$, $pr52f$Vật liệu chống thấm | BESTMIX$pr52f$, $pr52g$Sử dụng: Vữa rót không co ngót gốc xi măng, Vữa trộn sẵn Đóng gói: Bao 25 kg / 76 bao ~ 1m3 vữa$pr52g$, $pr52h$<div><strong>MÔ TẢ</strong></div>
<div>SikaGrout 214-11 là vữa rót gốc xi măng, tự san bằng, không co ngót với thời gian thi công được kéo dài để thích ứng với nhiệt độ địa phương.</div>
<div></div>
<div><strong>ƯU ĐIỂM</strong></div>
<div>SikaGrout 214-11 là một loại vữa rất kinh tế và dễ sử dụng. Những ưu điểm gồm:</div>
<ul>
<li>Độ chảy lỏng tuyệt hảo.</li>
<li>Ổn định về kích thước tốt.</li>
<li>Cường độ cao, độ sệt có thể điều chỉnh.</li>
<li>Không tách nước</li>
<li>Sử dụng ngay chỉ cần thêm nước.</li>
<li>Không độc, không ăn mòn.</li>
<li>Kháng va đạp dung động.</li>
<li>Có thể bơm vữa bằng máy bơm thích hợp.</li>
</ul>
<div></div>
<div><strong>ỨNG DỤNG VỮA RÓT SIKAGROUT 214-11</strong></div>
<div>SikaGrout 214-11 thích hợp cho các công việc rót vữa sau:</div>
<ul>
<li>Nền móng máy</li>
<li>Bệ đường ray</li>
<li>Cột trong các kết cấu đúc sẵn</li>
<li>Định vị bu lông</li>
<li>Gối cầu</li>
<li>Các lỗ hổng</li>
<li>Các khe hở</li>
<li>Các hốc tường</li>
<li>Nơi sửa chữa cần cường độ cao</li>
</ul>
<div></div>
<div><strong>THÔNG TIN SẢN PHẨM SIKAGROUT 214-11</strong></div>
<ul>
<li>Dạng / Màu                 : Bột / Xám bê tông</li>
<li>Đóng gói                     : 25Kg/bao</li>
<li>Điều kiện lưu chữ       : Nơi khô mát có bong râm</li>
<li>Thời hạn sử dụng        : Tối thiểu 06 tháng nếu lưu trữ đúng cách trong bao bì nguyên chưa mở.</li>
</ul>
<div></div>
<div><strong>THÔNG SỐ KỸ THUẬT SIKAGROUT 214-11</strong></div>
<div>Khối lượng thể tích:</div>
<div>&#8211; 1.60 Kg/lít theo khối lượng đổ đống của bột</div>
<div>&#8211; 2.20 Kg/lít theo khối lượng thể tích của vữa mới trộn</div>
<div>Tỷ lệ trộn: cho độ sệt để vữa có thể chảy được</div>
<div>Sikagrout 214-11 : Nước = 1 Kg : 0.15 Kg theo khối lượng</div>
<div>~ 3.75 lít nước sạch cho một bao 25 Kg</div>
<div></div>
<div><strong>HƯỚNG DẪN SỬ DỤNG VỮA RÓT SIKAGROUT 214-11</strong></div>
<div>Chuẩn bị bề mặt:</div>
<div>Bề mặt bê tông phải sạch, đặc chắc, không dính dầu mỡ và các tạp chất khác</div>
<div>Các bề mặt bằng kim loại sắt và thép phải không có vảy, rỉ sét hoặc dầu mỡ.</div>
<div>Bề mặt hút nước phải được bão hòa hoàn toàn, nhưng không để đọng nước.</div>
<div>Khuấy Trộn:</div>
<div>Bột được thêm từ từ vào nước đã được định lượng trước sao cho thích hợp với độ sệt mong muốn.</div>
<div>Trộn bằng máy trộn có cần trộn với tốc độ thấp, tối đa 500 vòng/phút ít nhất 3 phút cho đến khi đạt được độ sệt mịn.</div>
<div>Có thể sử dụng thiết bị trộn 2 cần loại máy trộn cưỡng bức.</div>
<div>Thi công rót vữa:</div>
<div>Rót vữa sau khi trộn. phải bảo đảm không khí bị nhốt trong vữa được giải thoát hết.</div>
<div>Khi rót vữa vào đế phải duy trì cột áp suất để giữ cho dòng chảy của vữa không bị gián đoạn.</div>
<div>Phải bảo đảm ván khuôn được dựng chắc chắc và kín nước.</div>
<div>Để đạt hiệu quả giãn nở tối ưu, thi công vữa càng nhanh càng tốt (tốt nhất là trong vòng 15 phút sau khi trộn)</div>
<div>Rót vữa lỏng ở các bệ máy:</div>
<div>Tưới nước toàn bộ nhưng không để đọng nước trên các lỗ bu lông.</div>
<div>Nếu có thể, rót vữa lỏng vào các lỗ leo trước, sau đó rót vữa lỏng vào đế. Giữ cho dòng vữa chảy liên tục.</div>
<div>Rót vữa lỏng vào mặt đáy:</div>
<div>Tưới nước trước khoảng 24 giờ, không để đọng nước.</div>
<div>Giữ áp suất thủy lực không đổi để cho vữa chảy liên tục.</div>
<div>Dùng cáp hoặc dây xích để đảm bảo các lỗ hổng được lắp đầy.</div>
<div>Phải đảm bảo bọt khí thoát ra hết dễ dàng</div>
<div>Rót vữa lỏng vào các hốc lớn/thể tích lớn:</div>
<div>Tùy thuộc vào thể tích cần lấp và độ dày của khoảng hở, có thể thêm cốt liệu lớn vào vữa lỏng SikaGrout 214 -11 với tỷ lệ 50 -100% khối lượng của bột SikaGrout 214 11.</div>
<div>Các cốt liệu tròn thích hợp hơn cốt liệu dẹt.</div>
<div>Khi rót vữa vào các khu vực có độ dày lớn hơn 6 Cm, việc dùng thêm cốt liệu lớn hoặc nước lạnh sẽ làm giảm nhiệt độ phát sinh trong giai đoạn đông cứng ban đầu.</div>
<div>Các trường hợp neo đặc biệt neo bu lông vách đá trong đường hầm.</div>
<div>Bảo dưỡng:</div>
<div>Giữ bề mặt lộ thiên có thể nhìn thấy được càng nhỏ càng tốt và bảo vệ vữa tránh mất hơi nước sớm bằng các biện pháp bảo dưỡng thông thường (giữ ẩm, phủ bao bố ướt, dùng hợp chất bảo dưỡng như Antisol E).</div>
<div></div>$pr52h$, $pr52i$/sikalongan.com/images/products/sikagrout-214-11-1.jpg$pr52i$, $pr52j$/sikalongan.com/images/products/sikagrout-214-11-1.jpg$pr52j$, TIMESTAMP '2022-08-23 09:03:23');

INSERT INTO public.producttb (
    productname, productcode, productcatalog, productshortdes, productlongdes, productstatus,
    productimageurl1, productimageurl2, productimagedesurl, productvideoadd,
    productpriceamount, productdiscont, productpricecurrency, language, path,
    createdtime, modifiedtime, isvisible, isapproved, islocked, productsubcatalog,
    pagekeyword, isnew, productbrand, productgroupstring, publishedtime,
    productvideotype, productstockqty
)
SELECT p.product_name, p.product_code, p.catalog_code, p.short_description, p.long_description,
       'quotation', p.image_urls, p.featured_image, p.featured_image, 'none',
       0, 0, 'VND', 'vi', p.product_slug, p.published_at, CURRENT_TIMESTAMP,
       TRUE, TRUE, FALSE, p.category_names,
       p.product_name || ', Sika Long An, Huỳnh Toàn, ' || p.category_names,
       p.row_no <= 10, p.brand_code, '#sikalongan#' || p.catalog_code || '#',
       p.published_at, 'Unknown', 0
FROM tmp_sikalongan_products p
WHERE NOT EXISTS (SELECT 1 FROM public.producttb product WHERE product.productcode=p.product_code);

UPDATE public.producttb product SET
    productname=p.product_name, productcatalog=p.catalog_code, productshortdes=p.short_description,
    productlongdes=p.long_description, productstatus='quotation', productimageurl1=p.image_urls,
    productimageurl2=p.featured_image, productimagedesurl=p.featured_image, productvideoadd='none',
    productpriceamount=0, productdiscont=0, productpricecurrency='VND', language='vi',
    path=p.product_slug, modifiedtime=CURRENT_TIMESTAMP, isvisible=TRUE, isapproved=TRUE,
    islocked=FALSE, productsubcatalog=p.category_names,
    pagekeyword=p.product_name || ', Sika Long An, Huỳnh Toàn, ' || p.category_names,
    isnew=(p.row_no <= 10), productbrand=p.brand_code,
    productgroupstring='#sikalongan#' || p.catalog_code || '#', publishedtime=p.published_at,
    productvideotype='Unknown', productstockqty=0
FROM tmp_sikalongan_products p WHERE product.productcode=p.product_code;

-- Enabled prospect administrator. No activation/first-login gate and no MFA authority.
-- BCrypt $2b$, cost 13; plaintext password: sikalongan
INSERT INTO public.usertb (
    username, password, firstname, lastname, email,
    isaccountnonexpired, isaccountnonlocked, iscredentialsnonexpired,
    isallowmarketing, isenabled, createdtime, validationcode, leaderid
) VALUES (
    'sikalongan', '$2b$13$Upokew74rpFUI6nkDsgns.5lKz/pac/M2a2jGlYA1qez5JM9RYYGO',
    'Sika Long An', 'Huỳnh Toàn', 'sonhuyntoan@gmail.com',
    TRUE, TRUE, TRUE, FALSE, TRUE, CURRENT_TIMESTAMP, '', 0
)
ON CONFLICT (username) DO UPDATE SET
    password=EXCLUDED.password, firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname,
    email=EXCLUDED.email, isaccountnonexpired=TRUE, isaccountnonlocked=TRUE,
    iscredentialsnonexpired=TRUE, isenabled=TRUE, validationcode='';

INSERT INTO public.authorities (username, authority, description, visible)
SELECT 'sikalongan', role.authority, role.description, TRUE
FROM (VALUES
    ('ROLE_ADMIN', 'Sika Long An tenant administrator'),
    ('ROLE_USER', 'Sika Long An user')
) AS role(authority, description)
WHERE NOT EXISTS (SELECT 1 FROM public.authorities a WHERE lower(a.username)='sikalongan' AND a.authority=role.authority);

-- In this application, an authority named gototp with a long description enables MFA.
DELETE FROM public.authorities WHERE lower(username)='sikalongan' AND lower(authority)='gototp';

COMMIT;

-- Verification (expected: 5 pages, 53 products, enabled=true, no gototp row):
-- SELECT count(*) FROM public.articletb WHERE articleid LIKE 'SIKALONGAN-PAGE-%';
-- SELECT count(*) FROM public.producttb WHERE productcode LIKE 'SIKALONGAN-%';
-- SELECT username, isenabled, isaccountnonlocked, iscredentialsnonexpired FROM public.usertb WHERE username='sikalongan';
-- SELECT authority FROM public.authorities WHERE username='sikalongan' ORDER BY authority;
