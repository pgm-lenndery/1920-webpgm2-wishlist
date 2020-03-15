import '../styles/main.min.css';
import {AIRTABlE_KEY} from './config';

const appID = 'app8rag1axCaXV6TD'
const apiURI = `https://api.airtable.com/v0/${appID}/wishlist`;

// console.log(apiURI + `?api_key=${AIRTABlE_KEY}`);

const table = document.querySelector('[data-label="wishlistItems"] .table');
const contextMenu = document.querySelector('[data-label="contextMenu"]');

let fieldMode = 'add'; // or edit

const wishList = {
  initialize() {
    this.addItemButton = document.querySelector('#addItem_magic');
    
    this.readyState();
    this.generateContextMenu();
    this.getAirtableData();
    this.selectedRecordID = '';
    
    this.addItemButton.addEventListener('click', () => {
      if (fieldMode == 'edit') {
        this.updateRecord(this.selectedRecordID);
        fieldMode == 'add';
      } else {
        this.addRecord();
        // this.addNewRecordToExistingList(this.getInputValues());
      }
      // this.addRecord();
      // this.addNewRecordToExistingList(this.getInputValues());
    })
  },
  
  readyState() {
    table.innerHTML = `
      <div class="table-head">
        <div class="col-3 th">Titel</div>
        <div class="col-1 th">Prijs</div>
        <div class="col-5 th">Omschrijving</div>
        <div class="col-3 th">Link</div>
      </div>
    `;
    fieldMode = 'add';
    this.addItemButton.innerHTML = 'Item toevoegen';
    this.selectedRecordID = '';
  },
  
  getInputValues() {
    return {
      title: document.querySelector('#addItem_title').value,
      price: document.querySelector('#addItem_price').value,
      amount: document.querySelector('#addItem_amount').value,
      description: document.querySelector('#addItem_description').value,
      url: document.querySelector('#addItem_url').value,
      imgUrl: document.querySelector('#addItem_img_url').value,
    }
  },
  
  generateContextMenu() {
    // ADD ITEMS TO CONTEXTMENU
    contextMenu.innerHTML = '';
    const menuItem = document.createElement('div');
    menuItem.innerHTML = 'delete item';
    menuItem.className = 'contextMenu-item';
    menuItem.addEventListener('click', () => {
      this.deleteRecord(this.selectedRecordID);
      document.querySelector(`[data-itemid="${this.selectedRecordID}"]`).remove();
      this.generateContextMenu();
    });
    contextMenu.appendChild(menuItem);
    
    const menuItem2 = document.createElement('div');
    menuItem2.innerHTML = 'edit item';
    menuItem2.className = 'contextMenu-item';
    menuItem2.addEventListener('click', () => {
      fieldMode = 'edit';
      this.loadDataIntoInputFielfs(this.selectedRecordID);
      this.generateContextMenu();
    });
    contextMenu.appendChild(menuItem2);
    
    document.body.addEventListener("contextmenu", (event) => {
      const element = event.target.parentNode;
      
      event.preventDefault();
      
      this.selectedRecordID = element.dataset.itemid;
      let xPos = event.clientX, yPos = event.clientY;

      if (element.classList.value.includes('tr')) {       
        contextMenu.style.top = yPos + 'px';
        contextMenu.style.left = xPos + 'px';
        contextMenu.classList.remove('hidden');
      } else if (element.classList.value.includes('tr') == false && element.id != 'app') {
        contextMenu.classList.add('hidden');
      }
    },false);
    
    document.addEventListener('click', () => {
      contextMenu.classList.add('hidden');
    })
  },
  
  getAirtableData() {
    fetch(apiURI, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABlE_KEY}`,
        'Content-Type': 'application/json'
      })
    })
    .then(response => response.json())
    .then (data => {
      this.generateWishlist(data);
    });
  },
  
  generateWishlist(data) {
    data.records.map(record => {
      const itemData = record.fields;
      
      const itemUrlDomain = itemData.url.split('/')[2].replace('www.', '');
      const div = document.createElement('div');
      div.classList.add('tr', 'mb-3');
      div.setAttribute('data-itemid', record.id);
      
      div.innerHTML = `
        <div class="col-3 td">
          <a href="${itemData.url}" target="_blank">${itemData.title}</a>
        </div>
        <div class="col-1 td">€${itemData.price.toString().replace('.',',')}</div>
        <div class="col-5 td">${itemData.description}</div>
        <div class="col-3 td">
          <a href="${itemData.url}" target="_blank">Bekijk op ${itemUrlDomain}</a>
        </div>
      `
      table.appendChild(div);
    })
  },
  
  addNewRecordToExistingList(input) {
    const itemUrlDomain = input.url.split('/')[2].replace('www.', '');
    const div = document.createElement('div');
    div.classList.add('tr', 'mb-3');
    // div.setAttribute('data-itemid', record.id);
    
    div.innerHTML = `
      <div class="col-3 td">
        <a href="${input.url}" target="_blank">${input.title}</a>
      </div>
      <div class="col-1 td">€${parseFloat(input.price).toString().replace('.',',')}</div>
      <div class="col-5 td">€${input.description}</div>
      <div class="col-3 td">
        <a href="${input.url}" target="_blank">Bekijk op ${itemUrlDomain}</a>
      </div>
    `
    table.appendChild(div);
  },
  
  loadDataIntoInputFielfs(inputID) {
    fetch(`${apiURI}/${inputID}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABlE_KEY}`,
        'Content-Type': 'application/json'
      })
    })
    .then(respone => respone.json())
    .then(data => {
      const itemData = data.fields
      document.querySelector('#addItem_title').value = itemData.title;
      document.querySelector('#addItem_price').value = itemData.price;
      document.querySelector('#addItem_amount').value = itemData.amount;
      document.querySelector('#addItem_description').value = itemData.description;
      document.querySelector('#addItem_url').value = itemData.url;
      document.querySelector('#addItem_img_url').value = itemData.img[0].url;
    });
    this.addItemButton.innerHTML = 'Item updaten';
  },
  
  updateRecord(inputID) {
    const input = this.getInputValues();
    
    fetch(`${apiURI}/${inputID}`, {
      method: 'put',
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABlE_KEY}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "fields": {
          "price": parseFloat(input.price),
          "title": input.title,
          "amount": parseFloat(input.amount),
          "description": input.description,
          "url": input.url,
          "img": [
            {
              "url": input.imgUrl
            }
          ]
        }
      })
    })
    .then(response => response.json())
    .then (data => {
      this.readyState();
      this.getAirtableData();
    })
  },
  
  addRecord() {
    const input = this.getInputValues();
    
    fetch(apiURI, {
      method: 'post',
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABlE_KEY}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        records: [{
          fields: {
            "price": parseFloat(input.price),
            "title": input.title,
            "amount": parseFloat(input.amount),
            "description": input.description,
            "url": input.url,
            "img": [
              {
                "url": input.imgUrl
              }
            ]
          }
        }]
      })
    })
    .then(response => response.json())
    .then (data => {
      this.readyState();
      this.getAirtableData();
    })
  },
  
  deleteRecord(inputID) {
    fetch(`${apiURI}/${inputID}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${AIRTABlE_KEY}`,
        'Content-Type': 'application/json'
      })
    })
    .then(respone => respone.text()) // or res.json()
    .then(data => {console.log(data)});
  }
}

// https://api.airtable.com/v0/app8rag1axCaXV6TD/wishlist/recd5X0aQXgisJuvH

wishList.initialize();