let typingTimer;
const typingDelay = 300; // 300ms

document.getElementById('searchBox').addEventListener('input', function () {
  clearTimeout(typingTimer);
  const query = this.value.trim();
  const resultsDiv = document.getElementById('searchResults');

  if (query.length < 3) {
    resultsDiv.style.display = 'none';
    return;
  }

  typingTimer = setTimeout(() => {
    fetch(`/api/article-search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        resultsDiv.innerHTML = '';
        if (data.length === 0) {
          resultsDiv.style.display = 'none';
          return;
        }

        // chỉ show tối đa 5 records
        data.slice(0, 5).forEach(item => {
          const div = document.createElement('div');
          div.classList.add('search-result-item');
          div.innerHTML = `
            <img src="${item.articleThumnailURLWithHost2}" alt="">
            <div class="info">
              <div class="title"><a href="/${item.menuStringId}/${item.articleLink}">${item.articleTitle}</a></div>
              <div class="desc">${item.articleDescription}</div>
            </div>
          `;
          resultsDiv.appendChild(div);
        });

        // thêm link "Show all results"
        const showAll = document.createElement('div');
        showAll.classList.add('show-all');
        showAll.innerHTML = `<a href="/marine.html?searchTerm=${encodeURIComponent(query)}">Xem tất cả kết quả</a>`;
        resultsDiv.appendChild(showAll);

        resultsDiv.style.display = 'block';
      })
      .catch(err => {
        console.error(err);
        resultsDiv.style.display = 'none';
      });
  }, typingDelay);
});

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', function (e) {
  const resultsDiv = document.getElementById('searchResults');
  const searchBox = document.getElementById('searchBox');
  if (resultsDiv && searchBox && !searchBox.contains(e.target) && !resultsDiv.contains(e.target)) {
    resultsDiv.style.display = 'none';
  }
});
