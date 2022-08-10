## Available Endpoints

### => `https://koireai.herokuapp.com/orders`

const options = {method: 'GET', headers: {'': '', Authorization: 'Basic Og=='}};

fetch('https://koireai.herokuapp.com/orders', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

### => `https://koireai.herokuapp.com/add`

const options = {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: '{"customer":"Mayank","customerPhone":"9119209907","orderStatus":"Placed","orderDate":"10/08/2022","orderQuantity":100,"orderTotal":20}'
};

fetch('https://koireai.herokuapp.com/add', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

### => `https://koireai.herokuapp.com/update/<id of order>`

const options = {
method: 'PATCH',
headers: {'Content-Type': 'application/json'},
body: '{"customer":"xxyyzz","customerPhone":9119209907,"orderStatus":"Dispatch","orderQuantity":27,"orderTotal":100,"orderDate":"02/08/2022"}'
};

fetch('https://koireai.herokuapp.com/update/62f37487da40f851bcb51c51', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

### => `https://koireai.herokuapp.com/updateStatus/<id of order>`

const options = {
method: 'PATCH',
headers: {'Content-Type': 'application/json'},
body: '{"customer":"xxyyzz","customerPhone":9119209907,"orderStatus":"Dispatch","orderQuantity":27,"orderTotal":100,"orderDate":"02/08/2022"}'
};

fetch('https://koireai.herokuapp.com/update/62f37487da40f851bcb51c51', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

### => `https://koireai.herokuapp.com/delete/<id of order>`

const options = {method: 'DELETE'};

fetch('https://koireai.herokuapp.com/delete/62f3503b178f05c9d2ce8f55', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

### => `https://koireai.herokuapp.com/checkCapacity/<date>`

const options = {method: 'GET'};

fetch('https://koireai.herokuapp.com/checkCapacity/10-08-2022', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));
