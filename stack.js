
   /* This is a client-side Single-Page Application. The entirety of this script is written in vanilla JavaScript. */



function app() {
   if (!window.indexedDB) {
      window.alert("Your browser doesn't support IndexedDB. Stack-It Inventory Manager will not be available.");
   };
}

app();


//Set up IndexedDB database...


   const Db_Name = "stack-it-inventory-manager";
   const Db_Version = 1;
   const Db_Store = "inventory";

   var db;

   function openDb() {
       var request = window.indexedDB.open(Db_Name, Db_Version);
       request.onerror = function(e) {
           console.error("Database failed to open:", e.target.errCode);
       };

       request.onsuccess = function(e) {
          db = request.result;
          console.log("Database opened successfully");
       };

       request.onupgradeneeded = function(e) {
          db = e.target.result;
          var store = db.createObjectStore(Db_Store, {keyPath: 'id', autoIncrement: true});
         
          store.createIndex('name', 'name', {unique: false});
          store.createIndex('quantity', 'quantity', {unique: false});
          store.createIndex('price', 'price', {unique: false});

          console.log("Database setup complete.");
       };
   }

   openDb();



//Simple validation of entries...


   function errorNote1() {
        let warn1 = document.getElementById('note1');
        let payAtten1 = document.createElement('p');

        payAtten1.textContent = "NAME OF ITEM REQUIRED";
    
        warn1.appendChild(payAtten1);
   }


   function errorNote2() {
      let warn2 = document.getElementById('note2');
      let payAtten2 = document.createElement('p');

      payAtten2.textContent = "NUMBER OF UNITS REQUIRED";

      warn2.appendChild(payAtten2);
   }


//Message-Board 1...


   function showSuccess() {
       var next = document.getElementById('note');
       var shoe = document.createElement('p');
       shoe.textContent = "ITEM ADDED SUCCESSFULLY.";
       next.appendChild(shoe);

       setTimeout(function() {
          next.removeChild(shoe);
       }, 2000);
   }


//Message-Board 2...

   function disMsg() {
       var info = document.getElementById('msg');
       var para = document.createElement('p');
       para.textContent = "All items within inventory";
       info.appendChild(para);
    }
   


//Message-Board...

   function delMsg() {
       var infoMsg = document.getElementById('msg');
       var stamp = document.createElement('p');
       stamp.textContent = "Item was deleted successfully.";
       stamp.style.color = 'white';
       infoMsg.appendChild(stamp);

       setTimeout(function() {
            infoMsg.removeChild(stamp);
       }, 4000);
   }




//Add an item to the inventory...


   function addItem() {
     if (typeof store == 'undefined') {
         store = db.transaction([Db_Store], 'readwrite')
                   .objectStore(Db_Store);
     }

      let nameValue  = document.getElementById('item-name').value;  
      let quantityValue = document.getElementById('item-quantity').value;
      let priceValue  = document.getElementById('item-price').value;

      if (nameValue.length == 0) {errorNote1();};
      if (quantityValue.length == 0) {errorNote2();}

      else {
           var newItem = 
               {
                  name: nameValue,
                  quantity: quantityValue,
                  price: priceValue
               };
         
           var request = store.add(newItem);

           request.onsuccess = function(e) {

               showSuccess();
           };
      };

      transaction.onerror = function(e) {
         console.error("Transaction failed:", e.target.errCode);
      };

      transaction.oncomplete = function(e) {
         console.log("Transaction complete.");        
      };
          
      let clear1 = document.getElementById('note1');
      let clear2 = document.getElementById('note2');
 
      if (nameValue.length !== 0) {
          clear1.removeChild(clear1.firstChild);
      };

      if (quantityValue.length !== 0) {
          clear2.removeChild(clear2.firstChild);
      };
   }



//Open inventory to view stored items...


   function displayItemList() {
       var list = document.getElementById('store-items-list');

       if (list.firstChild) {
          list.removeChild(list.firstChild);
       };

       if (typeof store == 'undefined') {
           store = db.transaction([Db_Store])
                     .objectStore(Db_Store);
              
           var request = store.openCursor();
           request.onsuccess = function(e) {
               var cursor = e.target.result;
            
               if (cursor) {
                  var listItem = document.createElement('li');
   
                  var para1 = document.createElement('p');
                  var para2 = document.createElement('p');
                  var para3 = document.createElement('p');

                  para1.textContent = `Name: ${cursor.value.name}`; 
                  para2.textContent = `Quantity: ${cursor.value.quantity}`;
                  para3.textContent = cursor.value.price ? `Price: ${cursor.value.price}` : "Price:  Nil";

                  listItem.appendChild(para1);
                  listItem.appendChild(para2);
                  listItem.appendChild(para3);

                  listItem.setAttribute('data-inventory-id', cursor.value.id);

                  var deleteBtn = document.createElement('button');
                  deleteBtn.textContent = "Delete Item";
                  listItem.appendChild(deleteBtn);

                  deleteBtn.onclick = deleteItem; 

                  list.appendChild(listItem);

                  cursor.continue();
              } else {
                  if (!list.firstChild) {
                     var stilItem = document.createElement('li');
                     stilItem.textContent = "No items stored"; 
                     list.appendChild(stilItem);
                  }
              }
           }       
           console.log("All items displayed.");

           disMsg();

           var closeBtn = document.createElement('button');
           closeBtn.textContent = "Close Store"; 

           var closeStore = document.getElementById('close-store');
           closeStore.appendChild(closeBtn);

           closeBtn.onclick = close_Store;
       };
   }





//Deleting a stored item...


   function deleteItem(e) {
      const message = "This Item will be deleted.";    

      if (window.confirm(message)) {

          store = db.transaction([Db_Store], 'readwrite')
                    .objectStore(Db_Store);
         
          var itemId = e.target.parentNode.getAttribute('data-inventory-id');
          var key = Number(itemId);  

         var request = store.delete(key);
         request.onsuccess = alert('Item deleted. Inventory will close and return to Homepage.'); 
       }
  
       transaction.oncomplete = function(e) {

            delMsg();
              
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);

            disMsg();
     
            console.log(`Item has been deleted.`);

             if (!list.firstChild) {
                 var stilItem = document.createElement('li');
                 stilItem.textContent = "No items stored"; 
                 list.appendChild(stilItem);
             }
        };
   }
        
        

//Shut the inventory after perusal...


   function close_Store() {
      var closeStore = document.getElementById('close-store');

      while (closeStore.firstChild) {
         closeStore.removeChild(closeStore.firstChild);
      };
     
      var vanish = document.getElementById('msg');
      vanish.removeChild(vanish.firstChild);
   }

