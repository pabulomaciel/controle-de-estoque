// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const quantityInput = document.getElementById('quantity-input');
  const taskList = document.getElementById('task-list');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  const exportExcelBtn = document.getElementById('export-excel');
  const exportPdfBtn = document.getElementById('export-pdf');

  let items = JSON.parse(localStorage.getItem('estoque')) || [];

  function renderItems(filter = '') {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    const sorted = [...filtered];
    const sortBy = sortSelect.value;

    if (sortBy === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'low') {
      sorted.sort((a, b) => a.quantity - b.quantity);
    }

    taskList.innerHTML = '';
    sorted.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="task-info">
          <span>${item.name}</span>
          <span>Quantidade: ${item.quantity}</span>
          <span class="status ${item.quantity <= 5 ? 'low' : 'ok'}">
            ${item.quantity <= 2 ? 'Esgotando' : item.quantity <= 5 ? 'Baixo Estoque' : 'Disponível'}
          </span>
        </div>
        <div class="actions">
          <button class="edit" onclick="editItem(${index})">Editar</button>
          <button class="delete" onclick="deleteItem(${index})">Excluir</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  function saveItems() {
    localStorage.setItem('estoque', JSON.stringify(items));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = taskInput.value.trim();
    const quantity = parseInt(quantityInput.value);

    if (name && quantity > 0) {
      items.push({ name, quantity });
      taskInput.value = '';
      quantityInput.value = '';
      renderItems();
      saveItems();
    }
  });

  searchInput.addEventListener('input', () => {
    renderItems(searchInput.value);
  });

  sortSelect.addEventListener('change', () => {
    renderItems(searchInput.value);
  });

  window.editItem = (index) => {
    const newName = prompt('Editar nome:', items[index].name);
    const newQty = prompt('Editar quantidade:', items[index].quantity);

    if (newName !== null && newQty !== null && parseInt(newQty) >= 0) {
      items[index].name = newName.trim();
      items[index].quantity = parseInt(newQty);
      renderItems(searchInput.value);
      saveItems();
    }
  };

  window.deleteItem = (index) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      items.splice(index, 1);
      renderItems(searchInput.value);
      saveItems();
    }
  };

  // EXPORTAÇÃO PARA EXCEL (.xlsx)
  exportExcelBtn.addEventListener('click', () => {
    const worksheetData = items.map(item => ({
      Produto: item.name,
      Quantidade: item.quantity,
      Status: item.quantity <= 2 ? 'Esgotando' : item.quantity <= 5 ? 'Baixo Estoque' : 'Disponível'
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    XLSX.writeFile(wb, "Estoque.xlsx");
  });

  // GERAÇÃO DE PDF ESTILIZADO E PREMIUM
  // GERAÇÃO DE PDF ESTILIZADO E PREMIUM
exportPdfBtn.addEventListener('click', () => {
  // Cria um container temporário para montar o layout do PDF
  const container = document.createElement('div');
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.padding = '20px';
  container.style.backgroundColor = '#fff';
  container.style.color = '#000';

  // Cabeçalho do PDF
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 style="text-align: center; color: #6e00ff; font-size: 24px; margin-bottom: 5px;">
      Controle de Estoque - Empresa XYZ
    </h1>
    <p style="text-align: center; font-size: 14px; color: #555; margin-top: 0;">
      Data: ${new Date().toLocaleDateString()}
    </p>
    <hr style="border: 1px solid #ddd; margin: 20px 0;">
  `;
  container.appendChild(header);

  // Tabela de estoque
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  table.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  table.style.borderRadius = '8px';
  table.style.overflow = 'hidden';

  // Cabeçalho da tabela
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="background-color: #6e00ff; color: white;">
      <th style="padding: 12px; border: 1px solid #fff;">Produto</th>
      <th style="padding: 12px; border: 1px solid #fff;">Quantidade</th>
      <th style="padding: 12px; border: 1px solid #fff;">Status</th>
    </tr>
  `;
  table.appendChild(thead);

  // Corpo da tabela
  const tbody = document.createElement('tbody');

  if (items.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="3" style="text-align:center; padding: 20px; font-style: italic; color: #777;">
        Nenhum produto cadastrado.
      </td>
    `;
    tbody.appendChild(tr);
  } else {
    items.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = i % 2 === 0 ? '#f9f9f9' : '#fff';
      tr.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;
                   background-color: ${
                     item.quantity <= 2 ? '#ffe0e0' :
                     item.quantity <= 5 ? '#fff5e0' : '#e0ffe0'
                   };
                   color: ${
                     item.quantity <= 2 ? '#a00' :
                     item.quantity <= 5 ? '#b75' : '#060'
                   };">
          ${item.quantity <= 2 ? 'Esgotando' : item.quantity <= 5 ? 'Baixo Estoque' : 'Disponível'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  table.appendChild(tbody);

  container.appendChild(table);

  // Rodapé
  const footer = document.createElement('div');
  footer.innerHTML = `
    <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 30px;">
      Este documento foi gerado automaticamente pelo sistema de controle de estoque.
    </p>
  `;
  container.appendChild(footer);

  // Inserir temporariamente no DOM para html2canvas funcionar corretamente
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.appendChild(container);
  document.body.appendChild(tempContainer);

  // Aguardar um breve momento para garantir renderização
  setTimeout(() => {
    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save("Estoque_Premium.pdf");

      // Limpar elemento temporário
      document.body.removeChild(tempContainer);
    });
  }, 200); // Pequeno delay para garantir a renderização completa
});

  renderItems(); // ← Essencial para carregar os dados ao abrir a página
});