
function paintVideos(items) {
  let boards = document.querySelector('.section_board ul');
  clearListUnderParent(boards);
    for( let i = 0; i < items.items.length; i++ ) {
      boards.appendChild(makeRow(items.items[i]));
    } 
}

function paintVideoList(query, cmd) {

  console.warn(cmd);
  query(cmd)
  .then( (response) => {
    console.log(response);
    let boards = document.querySelector('.section_board ul');
    clearListUnderParent(boards);

    console.dir(boards);
    console.dir(response);

    for( let i = 0; i < response.length; i++ ) {
      boards.appendChild(makeRow(response[i]));
    }
  });
}

function clearListUnderParent(parent) {
  
  let firstChild = parent.firstElementChild;
  //let nextSibling = firstChild.nextElementSibling;

  while(firstChild) {
    let current = firstChild;
    firstChild = firstChild.nextElementSibling;
    parent.removeChild(current);
  }
}

function makeRow(json) {

  let liTag = document.createElement('li');
  let divTitle = document.createElement('div');
  divTitle.classList.add('title_board');

  let a_tag = document.createElement('a');
  //a_tag.href = encodeURI('/video-play?video='+json.path);
  a_tag.text = json.title;
  divTitle.appendChild(a_tag);

  let divSummary = document.createElement('div');
  divSummary.classList.add('summary_board');
  divSummary.innerText = 'Billy';

  let divAuthor = document.createElement('div');
  divAuthor.classList.add('author_board');
  divAuthor.innerText = json.created;

  liTag.appendChild(divTitle);
  liTag.appendChild(divSummary);
  liTag.appendChild(divAuthor);

  return liTag;
}

