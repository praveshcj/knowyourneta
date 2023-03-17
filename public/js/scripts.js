function fetchCSVData(url) {
    return fetch(url)
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split('\n');
        const headers = rows[0].split('\t');
  
        const data = rows.slice(1).map((row) => {
          const values = row.split('\t');
          if (values.length !== headers.length) {
            return null;
          }
  
          const rowData = {};
          headers.forEach((header, index) => {
            header = header? header.trim(): '';
            rowData[header] = values[index] ? values[index].trim() : '';
          });
          return rowData;
        }).filter(row => row !== null);
  
        return data;
      });
  }


  function createPagination(totalPages, currentPage, table, data, limit) {
    const pagination = document.createElement('ul');
    pagination.classList.add('pagination');

  
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      li.id = i.toString() +"_page";
      if (i === currentPage) {
        li.classList.add('active');
      }
  
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('page-link');
      button.dataset.page = i;
      button.addEventListener('click', (event) =>{
        event.preventDefault();
        table.querySelector('tbody').innerHTML = '';
        appendRowsToTable(data, table, (i - 1) * limit, limit);
        for(let j = 1;j<= totalPages;j++){
            const li_remove = document.getElementById(j.toString()+"_page");
            li_remove.classList.remove('active');   
        }
        const li_active = document.getElementById(i.toString()+"_page");
        li_active.classList.add('active');
      })
  
      li.appendChild(button);
      pagination.appendChild(li);
    }
  
    return pagination;
  }
  
  

  function appendRowsToTable(data, table, start, limit) {
    const tbody = table.querySelector('tbody');
    const sliceEnd = start + limit > data.length ? data.length : start + limit;
  
    data.slice(start, sliceEnd).forEach((row) => {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
  
      const headers = ['img_src', 'name', 'constituency', 'party' ];

      headers.forEach((key) => {
        const td = document.createElement('td');
        if (key === 'img_src') {
          const img = document.createElement('img');
          img.src = row[key];
          img.style.width = '50px';
          img.style.height = 'auto';
          td.appendChild(img);
        } else {
          td.textContent = row[key];
        }
        tr.appendChild(td);
      });
    });
  }
  
  
  
  function createTable(data, start, limit) {
    const table = document.createElement('table');
    table.classList.add('table');
  
    const thead = document.createElement('thead');
    table.appendChild(thead);
  
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
  
    const headers = ['img_src', 'name', 'constituency', 'party' ];
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      if(header === 'name')th.textContent = 'Name';
      else if (header === 'constituency')th.textContent = 'Constituency';
      else if(header === 'party')th.textContent = 'Party';
      else if(header === 'img_src')th.textContent = '';
      headerRow.appendChild(th);
    });
  
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    const sliceEnd = start + limit > data.length ? data.length : start + limit;

    data.slice(start, sliceEnd).forEach((row) => {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
  
      headers.forEach((header) => {
        const td = document.createElement('td');
        if (header === 'img_src') {
            const img = document.createElement('img');
            img.src = row["img_src"];
            img.style.width = '50px';
            img.style.height = 'auto';
            td.appendChild(img);
          } else {
            td.textContent = row[header];
        }
        tr.appendChild(td);
      });
    });
  
    return table;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('loksabha-members');
  
    // file_location =
    const url = './lok_sabha_members.csv';
    const limit = 10; // Number of rows to load at a time
    fetchCSVData(url).then((data) => {
        const totalPages = Math.ceil(data.length / limit);
        let currentPage = 1;
      
        const table = createTable(data, 0, limit);
        const tableContainer = document.getElementById('table-container');
        tableContainer.appendChild(table);
      
        const pagination = createPagination(totalPages, currentPage, table, data, limit);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.appendChild(pagination);
      
        // pagination.addEventListener('click', (event) => {
        //   if (event.target.tagName === 'BUTTON') {
        //     currentPage = parseInt(event.target.dataset.page, 10);
        //     console.log("Added Event", currentPage)
        //     // Clear the table rows and add new ones for the current page
            
      
        //     // Update the pagination element
        //     paginationContainer.innerHTML = '';
        //     const updatedPagination = createPagination(totalPages, currentPage);
        //     paginationContainer.appendChild(updatedPagination);
        //   }
        // });
      });
  });
  