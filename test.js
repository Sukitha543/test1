let addToCartButtons = document.querySelectorAll(".addToCart");
let cartTable = document.getElementById("cartTable");
let grandTotalCell = document.getElementById("grandTotal");
let grandTotal = 0;
let cartItems = [];


// Fetch the drugs data from the JSON file
fetch("./data/pharmacy.json")
  .then(response => response.json())
  .then(data => {
  let categories = data.categories;

    // Dynamically populate categories and drugs in the HTML
    let container = document.querySelector(".container");
    categories.forEach((category, index) => {
      let categoryDiv = document.createElement("div");
      categoryDiv.className = "drugs";
      categoryDiv.innerHTML = `
        <h2>${category.name}</h2>
        <img class="img" src="${category.image}" alt="${category.name}">
        <select id="drugSelect${index}">
          <option value="0">Select Drug</option>
          ${category.drugs.map((drug) => `
            <option value="${drug.name}" data-price="${drug.price}">${drug.name} - LKR. ${drug.price}</option>
          `)}
        </select>
        <input type="number" id="quantity${index}" min="1" placeholder="Quantity">
        <button class="addToCart">Add to Cart</button>
      `;
      container.appendChild(categoryDiv);
    });

    // Add event listener to each "Add to Cart" button
    addToCartButtons = document.querySelectorAll(".addToCart"); // Re-select after dynamic content load
    addToCartButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        let drugSelect = document.getElementById(`drugSelect${index}`);
        let quantityInput = document.getElementById(`quantity${index}`);

        let selectedDrug = drugSelect.value;
        let drugPrice = drugSelect.options[drugSelect.selectedIndex].getAttribute("data-price");
        let selectedQuantity = quantityInput.value;

        // Validate inputs
        if (selectedDrug === "0" || !selectedQuantity || selectedQuantity <= 0) {
          alert("Please select a drug and enter a valid quantity.");
          return;
        }

        // Parse price and quantity as numbers
        drugPrice = parseInt(drugPrice);
        selectedQuantity = parseInt(selectedQuantity);

        // Store the new item in the cartItems array
        cartItems.push({
          drug: selectedDrug,
          price: drugPrice,
          quantity: selectedQuantity
        });
       

        // Save cartItems array to localStorage
        localStorage.setItem("cart", JSON.stringify(cartItems));

        // Update the cart table and grand total
        updateCartTable();

        // Clear the inputs for the next item
        drugSelect.value = "0";
        quantityInput.value = "";
      });
    });
  })
 

// Function to update the grand total and table rows
function updateCartTable() {
    // Clear existing rows
    cartTable.tBodies[0].innerHTML = "";

    // Reset grand total
    grandTotal = 0;

    // Loop through cart items to add rows to the table
    cartItems.forEach(item => {
        // Calculate item total
        let itemTotal = item.price * item.quantity;

        // Add item total to grand total
        grandTotal += itemTotal;

        // Create new row for the table
        let newRow = cartTable.tBodies[0].insertRow();

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4); // New cell for the Remove button

        cell1.textContent = item.drug;
        cell2.textContent = item.price;
        cell3.textContent = item.quantity;
        cell4.textContent = itemTotal;

        // Create and append the Remove button
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "removeBtn";
        cell5.appendChild(removeButton);

        // Add event listener to Remove button
        removeButton.addEventListener("click", () => {
            // Remove this item from cartItems array
            cartItems = cartItems.filter(cartItem => cartItem !== item);
             //update the cart data in the local storage
            localStorage.setItem("cart",JSON.stringify(cartItems));

            // Recalculate and update grand total
            updateCartTable();
        });

        // Create and append edit button
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "editBtn";
        cell5.appendChild(editButton);

        // Add event listner to Edit button
        editButton.addEventListener("click",() =>{
          let newQuantity;
          while (true) {
            newQuantity = prompt(`Update your quantity for ${item.drug}`);
            
            // Check if the user clicked "Cancel"
            if (newQuantity === null) {
                alert("Edit cancelled.");
                return; // Exit the function without making any changes
            }
    
            // Check if the input is a valid number greater than 0
            if (!isNaN(newQuantity) && newQuantity > 0) {
                break; // Exit the loop if the input is valid
            }
    
            alert("Please enter a valid quantity."); // Alert if input is invalid
        }

          item.quantity = parseInt(newQuantity);
          localStorage.setItem("cart",JSON.stringify(cartItems));

          updateCartTable();

        });


    });

    // Update the grand total in the table
    grandTotalCell.textContent = grandTotal;
}

// Add event listener to "Save to Favourites" button
document.getElementById("saveToFavourites").addEventListener("click", () => {
    // Save the cartItems array to localStorage
    localStorage.setItem("fav", JSON.stringify(cartItems));
    alert("Cart saved to favourites!");
});

// Add event listener to "Apply Favourites" button
document.getElementById("applyFavourites").addEventListener("click", () => {
    // Retrieve the cartItems from localStorage
    let savedCart = localStorage.getItem("fav");

        if (savedCart) {
          // Parse the saved cart and update the cartItems array
          cartItems = JSON.parse(savedCart);
  
          // Sync favourites with the cart key in localStorage
          localStorage.setItem("cart", JSON.stringify(cartItems));


        // Update the cart table and grand total with saved items
        updateCartTable();
    } else {
        alert("No saved favourites found.");
    }
})

// Add event listner to "reset" button
document.getElementById("reset").addEventListener("click", () => {
    localStorage.clear();
    cartItems = [];
    alert("Your Favourites list and Cart have been successfully emptied");
    updateCartTable();
});