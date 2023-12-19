function deleteFriend(friendId) {
    

    fetch(`https://facbook-nodejs.onrender.com/friends/${user.id}/${friendId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then(() => getAllFriends());
  }

  function editFriend(ele, friendId) {
    
    const formContainer = ele.parentNode.parentNode;

    // Create and populate the form
    const formContent = `
   <div class="title-edit">Edit Friend</div>
<form id="edit-form" onsubmit="submitEdit(event, ${friendId})">
  <div class="form-group">
    <label class="label-edit" for="username">User Name:</label>
    <div style="display: flex; justify-content: center; align-items: center" class="input-group">
      <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
      <input
        placeholder="Username"
        type="text"
        class="form-control custom-input"
        name="username"
        required
      />
    </div>
  </div>
  <div class="form-group">
    <label class="label-edit" style="margin-top: 10px" for="email">Email:</label>
    <div style="display: flex; justify-content: center; align-items: center" class="input-group">
      <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
      <input
        placeholder="Email"
        type="text"
        class="form-control custom-input"
        name="email"
        required
      />
    </div>
  </div>
  <div class="form-group">
    <label class="label-edit" style="margin-top: 10px" for="age">Age:</label>
    <div style="display: flex; justify-content: center; align-items: center" class="input-group">
      <span class="input-group-text"><i class="bi bi-calendar-fill"></i></span>
      <input
        placeholder="Age"
        type="number"
        class="form-control custom-input"
        name="age"
        required
      />
    </div>
  </div>
  <div class="form-group">
    <label class="label-edit" style="margin-top: 10px" for="image_src"><i class="bi bi-image-fill"></i>Image:</label>
    <div style="display: flex; justify-content: center; align-items: center"  class="input-group">
        <input style="margin-left: 40px;background-color:white;opacity: 0.7;font-weight: bold;" type="file" name="image_src" class="custom-file-input" id="image_src">
    </div>
  </div>
  <div class="text-errors"></div>
  <button style="margin-top: 10px; margin-left: 10px;" type="button" class="btn btn-dark"  onclick="cancelEdit('${friendId}', '${user.id}', this)"><i class="bi bi-x-lg"></i> Cancel</button>
  <button style="margin-top: 10px;" type="submit" class="btn btn-warning">
     Update <i class="bi bi-pencil-fill"></i>
  </button>
</form>
    `;


    formContainer.innerHTML = formContent;
  }


  function cancelEdit(friendId, userId, cancelButton) {
  const friendCard = cancelButton.parentNode.parentNode;

  fetch(`https://facbook-nodejs.onrender.com/friends/${userId}/${friendId}`).then((res) => res.json())
  .then((data) => {
    const friend = data.result[0]
    const back_card_friend = `
              <img src="/img/${friend.image_src}" alt="Friend Photo" class="img-best-friends card-img-top" />
              <h5 class="card-title"><span style="background-color:white;opacity: 0.7;font-weight: bold;">ID: ${friend.id}</span></h5>
              <p class="card-text"><span style="background-color:white;opacity: 0.7;font-weight: bold;">Username: ${friend.username}</span></p>
              <p class="card-text"><span style="background-color:white;opacity: 0.7;font-weight: bold;">Email: ${friend.email}</span></p>
              <p class="card-text"><span style="background-color:white;opacity: 0.7;font-weight: bold;">Age: ${friend.age}</span></p>
              <div class="button-container">
                <button class="btn btn-primary edit-button" onclick="editFriend(this,${friend.id})"><i class="bi bi-pencil-fill"></i> Edit</button>
                <button class="btn btn-danger delete-button" onclick="deleteFriend(${friend.id})">Delete <i class="bi bi-trash-fill"></i></button>
              </div>
         `
          friendCard.innerHTML = back_card_friend;
  })
}

  function submitEdit(event, friendId) {
    event.preventDefault();
    const form = document.getElementById("edit-form");
    const errorText = document.querySelector(".text-errors");

    // Get the updated data from the form
    const updatedFriend = {
      username: form.username.value,
      email: form.email.value,
      age: form.age.value,
      image_src: form.image_src.files[0].name
    };

    fetch(`https://facbook-nodejs.onrender.com/friends/${user.id}/${friendId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedFriend),
    }).then((response) => response.json())
      .then((data) => {
        if(data.status){
          getAllFriends()
        }
        else if(data.errors){
          const errors = data.errors;
        let errorHTML = '';
        Object.values(errors).forEach((properties) => {
      errorHTML += `<span class=" error">${properties}</span>`;
    });
    errorText.innerHTML = errorHTML;
        }
      })
      .catch((e) => console.log(e));
  }

  function submitAdd(e) {
    e.preventDefault();
    const form = document.getElementById("add-form");
    const errorText = document.querySelector(".text-errors");
    

// Get new friend from the form

    const newFriend = {
      username: form.username.value,
      email: form.email.value,
      id_user_log: user.id,
      age: form.age.value,
      image_src: form.image_src.files[0].name
    };

    
     fetch(`https://facbook-nodejs.onrender.com/friends/${user.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(newFriend),
    }).then((response) => response.json())
    .then((data) => {
      if(data.new_friend){
        getAllFriends();
        form.reset(); // Rest the form container
        errorText.innerHTML = "";
        $('#addFriendModal').modal('hide'); // Close the modal
      }
      else if(data.errors){
        const errors = data.errors;
        let errorHTML = '';
        Object.values(errors).forEach((properties) => {
      errorHTML += `<span class=" error">${properties}</span>`;
    });
    errorText.innerHTML = errorHTML;
      }
    })
      .catch((e) => console.log(e));
  }

  function create_search_bar() {
  const searchBarForm = document.createElement('form');
  searchBarForm.className = 'd-flex';

  const searchBar = `<div class="input-group">
    <span class="input-group-text"><i class="bi bi-search"></i></span>
    <input id="search_username" class="form-control form-control-sm" type="search" placeholder="Search by username...." aria-label="Search">
  </div>`;

  searchBarForm.innerHTML = searchBar;
  document.querySelector('nav').children[0].children[0].append(searchBarForm);

  const searchInput = document.getElementById('search_username');


  searchInput.addEventListener('input', function () {
    filterUsername(searchInput.value);
  });
}

function filterUsername(searchValue) {
  const friendListItems = document.querySelectorAll('.friend-list-item');

  const empty_search_result = document.createElement('div');
  empty_search_result.className = "empty-search-result";
  empty_search_result.textContent = `There is no username matching: ${searchValue}`;
  const friendlistContainer = document.getElementById("friendlist-container");

  searchValue = searchValue.toLowerCase().trim();

  let hasResults = false;

  if(friendListItems.length > 0){
  friendListItems.forEach((item) => {
    const username = item.querySelector('.friend-username').innerHTML.replace('Username: ', '').toLowerCase();

    if (username.includes(searchValue)) {
      item.style.display = 'block';
      hasResults = true;
      document.getElementById("footer").classList.remove("fixed-bottom");
    } else {
      item.style.display = 'none';
    }
  });

  const existingEmptySearchResult = friendlistContainer.querySelector('.empty-search-result');

  if (hasResults) {
    if (existingEmptySearchResult) {
      friendlistContainer.removeChild(existingEmptySearchResult);
    }
  } else {
    if (existingEmptySearchResult) {
      existingEmptySearchResult.textContent = `There is no username matching: ${searchValue}`;
    } else {
      document.getElementById("footer").classList.add("fixed-bottom");
      friendlistContainer.appendChild(empty_search_result);
    }
  }
}
}


function getAllFriends() {
      fetch(`https://facbook-nodejs.onrender.com/friends/${user.id}`)
      .then((res) =>  {
    if (res.status === 204) {
      return {}; // Return an empty object
    }  else {
      return res.json();
    }
  }).then((data) => {
        // Call a function to handle the rendering of the friendlist data
        renderFriendlist(data.friendlist);   
      })
      .catch((e) => console.log(e));
  }

  function renderFriendlist(friendlist) {
      const friendlistContainer = document.getElementById("friendlist-container");
      friendlistContainer.innerHTML = ""; // Clear the container
      
      if (friendlist && friendlist.length > 0) {
        friendlist.forEach((friend) => {
          const card = document.createElement("div");
          card.className = "friend-list-item col-md-3";
          const cardContent = `
          <div style="border: 4px solid black" class="card mb-3">
            <div style="background-image: url('/img/background.avif');background-size: cover;" class="card-body text-black text-center">
              <img src="/img/${friend.image_src}" alt="Friend Photo" class="img-best-friends card-img-top" />
              <h5 class="card-title"><span style="background-color:white;opacity: 0.7;font-weight: bold;">ID: ${friend.id}</span></h5>
              <p class="card-text"><span class ="friend-username" style="background-color:white;opacity: 0.7;font-weight: bold;">Username: ${friend.username}</span></p>
              <p class="card-text"><span style="background-color:white;opacity: 0.7;font-weight: bold;">Email: ${friend.email}</span></p>
              <p class="card-text"><span style="background-color:white;opacity: 0.7;font-weight: bold;">Age: ${friend.age}</span></p>
              <div class="button-container">
                <button class="btn btn-primary edit-button" onclick="editFriend(this,${friend.id})"><i class="bi bi-pencil-fill"></i> Edit</button>
                <button class="btn btn-danger delete-button" onclick="deleteFriend(${friend.id})">Delete <i class="bi bi-trash-fill"></i></button>
              </div>
            </div>
          </div>
        `;

          card.innerHTML = cardContent;
          friendlistContainer.appendChild(card);
          document.getElementById("footer").classList.remove("fixed-bottom");
        });
      } else {
        const noFriendsMessage = document.createElement("div");
        noFriendsMessage.className = "no-friends-message";
        noFriendsMessage.textContent =
          `${user.username} has no good friends`;
        friendlistContainer.appendChild(noFriendsMessage);
        document.getElementById("footer").classList.add("fixed-bottom");
      }
    }


  create_search_bar();
  getAllFriends();
