// admin.js - quản trị đơn giản (lưu vào localStorage)
(function(){
  const productsKey = 'bc_products';
  const newsKey = 'bc_news';
  // ensure arrays exist
  if(!localStorage.getItem(productsKey)) localStorage.setItem(productsKey, JSON.stringify([]));
  if(!localStorage.getItem(newsKey)) localStorage.setItem(newsKey, JSON.stringify([]));

  // Helpers
  function uid(){ return Date.now() + Math.floor(Math.random()*1000); }
  function getProducts(){ return JSON.parse(localStorage.getItem(productsKey)||'[]'); }
  function setProducts(arr){ localStorage.setItem(productsKey, JSON.stringify(arr)); renderProductTable(); }

  function getNews(){ return JSON.parse(localStorage.getItem(newsKey)||'[]'); }
  function setNews(arr){ localStorage.setItem(newsKey, JSON.stringify(arr)); renderNewsTable(); }

  // Render product table
  function renderProductTable(){
    const list = getProducts();
    const container = document.getElementById('productTableContainer');
    if(!container) return;
    if(list.length === 0){
      container.innerHTML = '<div class="alert alert-info">Chưa có sản phẩm.</div>';
      return;
    }
    let html = `<table class="table table-striped">
      <thead><tr><th>#</th><th>Tên</th><th>Độ tuổi</th><th>Giá</th><th>Hành động</th></tr></thead><tbody>`;
    list.forEach((p,i)=>{
      html += `<tr>
        <td>${i+1}</td>
        <td>${p.title}</td>
        <td>${p.age||''}</td>
        <td>${p.price||''}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-product" data-id="${p.id}">Sửa</button>
          <button class="btn btn-sm btn-danger delete-product" data-id="${p.id}">Xóa</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    // bind actions
    container.querySelectorAll('.edit-product').forEach(btn=>{
      btn.addEventListener('click', function(){
        const id = this.dataset.id;
        const obj = getProducts().find(x=>x.id == id);
        if(!obj) return alert('Không tìm thấy');
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        const form = document.getElementById('productForm');
        form.id.value = obj.id;
        form.title.value = obj.title;
        form.age.value = obj.age || '';
        form.price.value = obj.price || '';
        form.desc.value = obj.desc || '';
        modal.show();
      });
    });
    container.querySelectorAll('.delete-product').forEach(btn=>{
      btn.addEventListener('click', function(){
        if(!confirm('Chắc chắn xóa?')) return;
        const id = this.dataset.id;
        const arr = getProducts().filter(x=>x.id != id);
        setProducts(arr);
      });
    });
  }

  // Render news table
  function renderNewsTable(){
    const list = getNews();
    const container = document.getElementById('newsTableContainer');
    if(!container) return;
    if(list.length === 0){
        container.innerHTML = '<div class="alert alert-info">Chưa có tin tức.</div>';
      return;
    }
    let html = `<table class="table table-striped">
      <thead><tr><th>#</th><th>Tiêu đề</th><th>Hành động</th></tr></thead><tbody>`;
    list.forEach((n,i)=>{
      html += `<tr>
        <td>${i+1}</td>
        <td>${n.title}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-news" data-id="${n.id}">Sửa</button>
          <button class="btn btn-sm btn-danger delete-news" data-id="${n.id}">Xóa</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.edit-news').forEach(btn=>{
      btn.addEventListener('click', function(){
        const id = this.dataset.id;
        const obj = getNews().find(x=>x.id == id);
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        const form = document.getElementById('newsForm');
        form.id.value = obj.id;
        form.title.value = obj.title;
        form.content.value = obj.content || '';
        modal.show();
      });
    });

    container.querySelectorAll('.delete-news').forEach(btn=>{
      btn.addEventListener('click', function(){
        if(!confirm('Chắc chắn xóa?')) return;
        const id = this.dataset.id;
        setNews(getNews().filter(x=>x.id != id));
      });
    });
  }

  // Add product event
  document.getElementById('addProductBtn').addEventListener('click', function(){
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const form = document.getElementById('productForm');
    form.reset(); form.id.value = '';
    modal.show();
  });

  document.getElementById('productForm').addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const id = form.id.value || uid().toString();
    const data = { id, title: form.title.value, age: form.age.value, price: form.price.value, desc: form.desc.value };
    let arr = getProducts();
    const idx = arr.findIndex(x=>x.id == id);
    if(idx >= 0) arr[idx] = data; else arr.push(data);
    setProducts(arr);
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
  });

  // news
  document.getElementById('addNewsBtn').addEventListener('click', function(){
    const modal = new bootstrap.Modal(document.getElementById('newsModal'));
    const form = document.getElementById('newsForm');
    form.reset(); form.id.value = '';
    modal.show();
  });
  document.getElementById('newsForm').addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const id = form.id.value || uid().toString();
    const data = { id, title: form.title.value, content: form.content.value };
    let arr = getNews();
    const idx = arr.findIndex(x=>x.id == id);
    if(idx >= 0) arr[idx] = data; else arr.push(data);
    setNews(arr);
    bootstrap.Modal.getInstance(document.getElementById('newsModal')).hide();
  });

  // init
  renderProductTable();
  renderNewsTable();

  // logout demo
  document.getElementById('logoutBtn').addEventListener('click', function(){ alert('Đã logout (demo)'); });

  // admin name (demo)
  document.getElementById('adminName').innerText = 'Administrator';

})();