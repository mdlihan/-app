let select_box = document.querySelector('#select_box');
let card_box_container = document.querySelector('#card_box_container');
let formUpdateCard = document.querySelector('#formUpdateCard');
let addCardForm = document.querySelector('#addCardForm');

let form = document.querySelector('form');
let input = document.querySelector('#text');

let card_container =[
  {
    card_name: "অসম্পূর্ণ",
    bg_color: "bg-pink-200",
    id: 101
    },
  {
    card_name: "অপেক্ষমান",
    bg_color: "bg-emerald-200",
    id: 102
    },
  {
    card_name: "সম্পন্ন",
    bg_color: "bg-purple-200",
    id: 103
    },
]

//form & input configuration;
input.addEventListener('input', () => {
  if (input.value !== '') {
    addCardForm.disabled=false;
    formUpdateCard.disabled=false;
    addCardForm.classList.add('bg-green-500', 'text-black');
    addCardForm.classList.remove('bg-gray-200', 'text-gray-500');
  } else {
    addbtn()
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  let time = new Date().toLocaleTimeString();
  let randomId = Date.now();

  const formData = {
    text: input.value,
    select: select_box.value,
    randomId,
    time
  };
  addbtn()
  if (isUpdating) {
    updateCard(formData);
  } else {
    createCard(formData);
     //localStorage 
     saveToLocalStorage({
       randomId,
       select: select_box.value,
       text: input.value,
       time,
       updateTime: null,
     })
  }
input.value=''

});


//create card box
const card_box = (el) => {
  card_box_container.innerHTML+=`<div>
 <div class='h-full'>
  <div class='flex justify-between items-center'>
    <h2>${el.card_name} কাজ</h2>
    <h3 id='total_card'>(${0})</h3>
  </div>
  <div id='${el.card_name}' class="boxes ${el.bg_color} w-full h-[60vh] p-2 rounded-md mt-4 overflow-y-auto">
  </div>
</div></div>
  `;
  total_card(el)
}


//option form
card_container.forEach((el)=>{
  let option = document.createElement('option');
  option.value = el.card_name;
  option.innerText = el.card_name;
  select_box.appendChild(option);
  card_box(el)
})

// মুসুন  function
card_box_container.addEventListener('click',e=>{
  if (e.target.classList.contains('delete-addCardForm')) {
    const card = e.target.closest('div[id]');
    if (card) {
      let unConfirm = confirm('আপনি কি সত্যি মুছে ফেলতে চান?');
      if (unConfirm) {
        const box = card.parentElement;
        deleteFromLocalStorage(card.id);
        card.remove();
        total_card(box);
      }
    }
  }
});

//হালনাগাদ করুন functional;
card_box_container.addEventListener('click', e => {
  if (e.target.classList.contains('update_addCardForm')) {
    const card = e.target.closest('div[id]');
    if (card) {
     input.value= card.querySelector('#input_text').innerText 
     select_box.value=card.querySelector('#select_value').innerText;
      card.querySelector('.card_btn').classList.remove('hidden');
      card.querySelector('.card_btns').classList.add('hidden')

     currentCardId = card.id;
     isUpdating = true;
     formUpdateCard.classList.remove('hidden');
     addCardForm.classList.add('hidden');
     
     //বাতিল করুন functionality;
     batilKorun(card)
    }
  }
});


let boxes = card_box_container.querySelectorAll('.boxes');
let currentCardId = null;
let isUpdating = false;

// Function to update a card
function updateCard({ select, text }) {
  let time = new Date().toLocaleTimeString();
  let cardToUpdate = document.getElementById(currentCardId);
  if (cardToUpdate) {
    cardToUpdate.querySelector('#input_text').innerText = text;
    cardToUpdate.querySelector('.text-gray-600').innerText = select;
    cardToUpdate.querySelector('#update_time_title').classList.remove('hidden')
    cardToUpdate.querySelector('#update_time').innerText = time;
    cardToUpdate.querySelector('.card_btn').classList.add('hidden');
    cardToUpdate.querySelector('.card_btns').classList.remove('hidden')
    
    addCardForm.classList.remove('hidden');
    formUpdateCard.classList.add('hidden');
  
  boxes.forEach(el => {
  if (el.id === select) {
        el.prepend(cardToUpdate)
        total_card(el)
       }
    })
   
   //update data 
   let updatedCardData = {
     id: currentCardId,
     select,
     text,
     updateTime: time,
   };
   updateLocalStorage(updatedCardData);
   
  }
 
  addCardForm.disabled = true;
  addCardForm.classList.add('bg-gray-200', 'text-gray-500');
  addCardForm.classList.remove('bg-green-500', 'text-black');
  currentCardId = null;
  isUpdating = false;
  form.reset()
}

//card create 
function createCard({select,text,randomId,time}) {
  boxes.forEach(el => {
    if (select === el.id) {
      let newDiv = document.createElement('div');
      newDiv.id = randomId;
      newDiv.setAttribute('draggable', 'true');
       newDiv.innerHTML=`<div class="bg-white my-3 p-4 rounded-lg shadow-md max-w-xs">
        <h2 id='input_text' class="font-bold text-gray-700 text-lg mb-4">${text}</h2>
        <div class="space-y-2">
            <div class="flex items-center space-x-2">
                <span>📅</span>
                <span id='select_value' class="text-gray-600">${select}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span>📅</span>
                <span class="text-gray-600">তৈরি করা হয়েছে ${time}</span>
            </div>
            <div id='update_time_title' class="flex items-center space-x-2 hidden">
                <span>📅</span>
                <span class="text-gray-600">সর্বশেষ সংরক্ষণ <span id="update_time">${time}</span></span>
            </div>
        </div>
 
        <div class="mt-4 flex space-x-2 justify-end card_btns">
            <button class="bg-yellow-500 px-4 py-2 rounded-md update_addCardForm">হালালগাদ</button>
            <button class="bg-red-500 px-4 py-2 rounded-md delete-addCardForm">মুছুন</button>
        </div>
        <div class="flex justify-end hidden card_btn">
          <button class="bg-yellow-500 px-4 py-2 rounded-md batil">বাতিল করুন </button>
        </div>
    </div>`
  
      el.prepend(newDiv)
      total_card(el)
      autoscroll(el,newDiv)
    }
  })
};

//বাতিল করুন functionality;
function batilKorun(card) {
  card_box_container.addEventListener('click', e => {
  if (e.target.classList.contains('batil')) {
    const card = e.target.closest('div[id]');
    addCardForm.classList.remove('hidden');
    formUpdateCard.classList.add('hidden');
    card.querySelector('.card_btn').classList.add('hidden');
    card.querySelector('.card_btns').classList.remove('hidden')
    isUpdating=false
    addbtn()
    form.reset()
  }
})
}

//add btn functional 
function addbtn() {
  addCardForm.disabled = true;
  formUpdateCard.disabled = false;
  addCardForm.classList.add('bg-gray-200', 'text-gray-500');
  addCardForm.classList.remove('bg-green-500', 'text-black');
}


//boxes cards;
function total_card(box) {
    let cardParent = box.parentElement;
    if (cardParent) {
      let total_cards = box.children.length;
      let cardsChildren = cardParent.querySelector('#total_card');
      cardsChildren.innerText=`(${total_cards})`
    }
}

//auto scroll
function autoscroll(el,newDiv) {
  const boxPaddingTop = parseFloat(getComputedStyle(el).paddingTop);

  const cardHeight = (newDiv.offsetHeight) * (el.childElementCount)
    el.scrollBy({
      top: -(cardHeight + boxPaddingTop),
      behavior: 'smooth',
    });
}



//drag and drop full config
let dragFromgetId = null; 
card_box_container.addEventListener('dragstart', (e) => {
  let box = e.target.closest('.boxes');
  if (e.target.getAttribute('draggable')){
      e.dataTransfer.setData('text', e.target.id);
    }
  dragFromgetId = box.id;
});

card_box_container.addEventListener('dragover', (e) => {
  e.preventDefault();
});

card_box_container.addEventListener('drop', (e) => {
  e.preventDefault();
  const box = e.target.closest('.boxes');
  if (box) {
    const cardId = e.dataTransfer.getData('text');
    const card = document.getElementById(cardId);
    const getFormId = document.getElementById(dragFromgetId);
    let time = new Date().toLocaleTimeString();
    
    if(box.id !== dragFromgetId) {
      box.prepend(card);
      
      autoscroll(box,card)
      let update_time = card.querySelector('#update_time');
      card.querySelector('#update_time_title').classList.remove('hidden');
      let select_value_drop = card.querySelector('#select_value');
      update_time.innerText = time;
      select_value_drop.innerText = box.id;
      
    } else {
      return
    }
    //update storage
    let text = card.querySelector('#input_text').innerText;
    
    let updatedCardData = {
        id: cardId,
        select: box.id,
        text: text,
        updateTime: time,
      };
    updateLocalStorage(updatedCardData);
    
    total_card(getFormId)
  }
  total_card(box)
});


//local storage configuration last 3 function;
function saveToLocalStorage(data) {
  let allData = JSON.parse(localStorage.getItem('allLocaldata')) || [];
  allData.push(data);
  localStorage.setItem('allLocaldata', JSON.stringify(allData));
}

function updateLocalStorage(updatedCard) {
 let allData = JSON.parse(localStorage.getItem('allLocaldata')) || [];
 //atka ase
 allData = allData.map(card => {
   if (card.randomId === Number(updatedCard.id)) {
      return {
         ...card,
          select: updatedCard.select,
          text: updatedCard.text,
          updateTime: updatedCard.updateTime
        };
   }
   return card;
 });
 //atka আসে
  localStorage.setItem('allLocaldata', JSON.stringify(allData));
}

function deleteFromLocalStorage(cardId) {
  let allData = JSON.parse(localStorage.getItem('allLocaldata')) || [];
  allData = allData.filter(card => card.randomId !== Number(cardId))
  localStorage.setItem('allLocaldata', JSON.stringify(allData));
}

//lode data
function loadData() {
  let localStorageGetData = JSON.parse(localStorage.getItem('allLocaldata')) || [];
  localStorageGetData.forEach(card => {
    createCard({
      select: card.select,
      text: card.text,
      randomId : card.randomId,
      time: card.time
    });
    
  let cardElement = document.getElementById(card.randomId);
  if (card.updateTime) {
      cardElement.querySelector('#update_time_title').classList.remove('hidden');
      cardElement.querySelector('#update_time').innerText = card.updateTime;
    }
  });
}
loadData();