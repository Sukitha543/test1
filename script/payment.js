// Get the table body and grand total cell from the DOM
let orderTableBody = document.getElementById("orderTable");
let grandTotalCell = document.getElementById("grandTotal");
let checkoutForm = document.getElementById("checkoutForm");
let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let dod = document.getElementById("dod");

// Function to load cart data from localStorage and display in the table
function loadCartData() {

    
    // Get the cart data from localStorage
     let savedCart = localStorage.getItem("cart");
     
     if (savedCart) {
        
        // Parse the JSON string into an array
        let cartItems = JSON.parse(savedCart);
        let grandTotal = 0;

        // Loop through each item in the cart
        cartItems.forEach(item => {
            // Calculate the total for this item
            let itemTotal = item.price * item.quantity;

            // Add the item total to the grand total
            grandTotal += itemTotal;

            // Create a new row in the table
            let newRow = orderTableBody.tBodies[0].insertRow();

            // Add cells for drug name, unit price, quantity, and total
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            let cell4 = newRow.insertCell(3);

            // Fill the cells with data
            cell1.textContent = item.name;
            cell2.textContent = item.price;
            cell3.textContent = item.quantity;
            cell4.textContent = itemTotal;
        });

        // Update the grand total cell
        grandTotalCell.textContent = grandTotal;
}else{
    alert(" The Cart is empty");
}
}
// Call the function to load cart data when the page loads
loadCartData();

//addventlistner to pay button
checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page
    // Display the success message
    alert(`Payment is done successfully and your order will be delivered on ${dod.value}`);
    p1.innerHTML = '<img src="./images/check_mark.png" alt="payment sucess" id=img1>'
    p2.innerHTML = `Your payment is done sucessfully and your order will be delivered on ${dod.value}`
    // Optionally, reset the form
    checkoutForm.reset();
});


















      
       
              
       
        


       



   