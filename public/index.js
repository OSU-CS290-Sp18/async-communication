function getPersonIdFromURL() {
  var path = window.location.pathname;
  var pathParts = path.split('/');
  // console.log("== pathParts:", pathParts);
  if (pathParts[1] === "people") {
    return pathParts[2];
  } else {
    return null;
  }
}

function handleModalAcceptClick() {

  var photoURL = document.getElementById('photo-url-input').value.trim();
  var caption = document.getElementById('photo-caption-input').value.trim();

  if (!photoURL || !caption) {
    alert("You must fill in all of the fields!");
  } else {

    var request = new XMLHttpRequest();
    var personID = getPersonIdFromURL();
    var url = "/people/" + personID + "/addPhoto";
    request.open("POST", url);

    var requestBody = JSON.stringify({
      photoURL: photoURL,
      caption: caption
    });

    request.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        var photoCardTemplate = Handlebars.templates.photoCard;
        var newPhotoCardHTML = photoCardTemplate({
          photoURL: photoURL,
          caption: caption
        });
        var photoCardContainer = document.querySelector('.photo-card-container');
        photoCardContainer.insertAdjacentHTML('beforeend', newPhotoCardHTML);
      } else {
        alert("Error storing photo: " + event.target.response);
      }
    });

    request.setRequestHeader('Content-Type', 'application/json');
    request.send(requestBody);

    hideModal();

  }

}


function showModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}


function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-photo-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}


function hideModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  var addPhotoButton = document.getElementById('add-photo-button');
  addPhotoButton.addEventListener('click', showModal);

  var modalAcceptButton = document.getElementById('modal-accept');
  modalAcceptButton.addEventListener('click', handleModalAcceptClick);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hideModal);
  }

});
