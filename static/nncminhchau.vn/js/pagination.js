function loadPage(event, element, page) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    var shouldScrollToGroup = event && event.type === 'click' && event.isTrusted !== false;
    element.style.color = 'gray';
    element.innerHTML = '...(' + page + ')';

    var productCode = element.getAttribute('id');
    var urlParams = new URLSearchParams(window.location.search);
    var requestParams = new URLSearchParams();

    requestParams.append('page', page);
    requestParams.append('group', productCode);
    requestParams.append('keyword', urlParams.get('keyword') || '');
    requestParams.append('catalog', urlParams.get('catalog') || '0');
    urlParams.getAll('brandFilter').forEach(function (brand) {
        requestParams.append('brandFilter', brand);
    });
    if (urlParams.get('minPrice')) {
        requestParams.append('minPrice', urlParams.get('minPrice'));
    }
    if (urlParams.get('maxPrice')) {
        requestParams.append('maxPrice', urlParams.get('maxPrice'));
    }
    urlParams.forEach(function (value, key) {
        if (key.indexOf('attributeMin_') === 0 || key.indexOf('attributeMax_') === 0) {
            requestParams.append(key, value);
        }
    });

    return $.ajax({
        method: 'GET',
        url: 'products.html?' + requestParams.toString(),
        success: function (response) {
            setTimeout(function () {
                var $target = $('#productList' + productCode);
                var replacement = $(response).find('#productList' + productCode);
                if (!replacement.length) {
                    return;
                }
                $target.html(replacement.html());
                if (shouldScrollToGroup) {
                    scrollProductGroupToTop($target);
                }

                var $row    = $target.find('.row.posts.isotope');
                var $imgs   = $target.find('img');
                var total   = $imgs.length;
                var settled = 0;
                var done    = false;

                var forceTimer = setTimeout(relayout, 3000);

                function relayout() {
                    if (done) return;
                    done = true;
                    clearTimeout(forceTimer);
                    $row.css({ height: 'auto', overflow: 'visible' });
                    if ($row.data('isotope')) {
                        $row.isotope('layout');
                    } else {
                        $row.isotope({ itemSelector: '.item', isFitWidth: true });
                    }
                    $(window).trigger('resize');
                }

                if (!total) { relayout(); return; }

                $imgs.each(function () {
                    var img = this;
                    if (img.complete && img.naturalWidth > 0) {
                        if (++settled >= total) relayout();
                    } else {
                        $(img).one('load error', function () {
                            if (++settled >= total) relayout();
                        });
                    }
                });
            }, 200);
        },
        error: function () {
            // silent
        }
    });
}

function scrollProductGroupToTop($target) {
    if (!$target || !$target.length) {
        return;
    }

    requestAnimationFrame(function () {
        var offset = getFixedHeaderOffset();
        var top = $target[0].getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: Math.max(top, 0),
            behavior: 'smooth'
        });
    });
}

function getFixedHeaderOffset() {
    var offset = 8;
    var fixedElements = document.querySelectorAll('header, .navbar, .fixed-top, .sticky-top, .navbar-fixed-top');

    fixedElements.forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position === 'fixed' || style.position === 'sticky') {
            offset = Math.max(offset, element.getBoundingClientRect().height + 8);
        }
    });

    return offset;
}

document.addEventListener('submit', function (event) {
    var form = event.target.closest('.remove-product-from-group-form');
    if (!form) return;

    event.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    var groupCodeInput = form.querySelector('input[name="groupStringId"]');
    var groupCode = groupCodeInput ? groupCodeInput.value : '';
    var section = form.closest('[id^="productList"]');
    var activePage = section ? section.querySelector('.store-pagination li.active a, .store-pagination a.active') : null;
    var page = activePage ? parseInt(activePage.textContent, 10) : 1;
    if (!isFinite(page) || page < 1) page = 1;

    if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Đang xóa...';
    }

    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(new FormData(form)).toString(),
        credentials: 'same-origin'
    }).then(function (response) {
        if (!response.ok) throw new Error('Remove failed');
        var pageLink = document.createElement('a');
        pageLink.id = groupCode;
        return loadPage(null, pageLink, page);
    }).catch(function () {
        if (button) {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Xóa khỏi nhóm';
        }
        window.alert('Không thể xóa sản phẩm khỏi nhóm. Vui lòng thử lại.');
    });
});

function initProductGroupPageOneObserver() {
    var groups = Array.prototype.slice.call(
        document.querySelectorAll('[data-auto-page-one]')
    );
    if (!groups.length || !('IntersectionObserver' in window)) {
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting || entry.target.dataset.pageOneTriggered === 'true') {
                return;
            }

            var pageOne = entry.target.querySelector('.store-pagination li a');
            if (!pageOne) {
                return;
            }

            entry.target.dataset.pageOneTriggered = 'true';
            observer.unobserve(entry.target);
            pageOne.click();
        });
    }, {
        threshold: 0.01
    });

    groups.forEach(function (group) {
        observer.observe(group);
    });
}
