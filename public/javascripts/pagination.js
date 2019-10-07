function calculatePageList( pageNo, paginationCount, totalPage ) {
  let pageGroup = Math.ceil( pageNo / paginationCount );
  let lastPage = pageGroup * paginationCount;

  const firstPage = lastPage - paginationCount + 1;
  if(lastPage > totalPage) {
    lastPage = totalPage;
  }

  return {
    prev: ( firstPage - 1 ) < 0 ? 0 : firstPage - 1,
    first: firstPage,
    last: lastPage,
    next: ( lastPage < totalPage )? lastPage + 1 : 0
  }
}

function makeLists ( pageNo, paginationCount, totalPage) {
  let pageGroup = Math.ceil( totalPage / 14 );
  const calculatedPageList = calculatePageList( pageNo, paginationCount, pageGroup );




};



function paintList( pageNo, paginationCount, totalPage, videolist, query, title ) {
  const wrapperPageList = document.querySelector( '.pagination ul' );

  removePageListBox(wrapperPageList);

  let pageGroup = Math.ceil( totalPage / 14 );
  const calculatedPageList = calculatePageList( pageNo, paginationCount, pageGroup );
  console.log(JSON.stringify(calculatedPageList));
  if( calculatedPageList.prev ) {

    const pageBox = makePageListBox({
      id: 'prev',
      text: '<<',
      number: calculatedPageList.prev
    });

    wrapperPageList.appendChild(pageBox);
  }

  for( let i = calculatedPageList.first; i <= calculatedPageList.last; i++ ) {

    const pageBox = makePageListBox({
      id: i,
      text: i,
      number: i
    });

    wrapperPageList.appendChild(pageBox);
  }

  if( calculatedPageList.next ) {

    const pageBox = makePageListBox({
      id: 'next',
      text: '>>',
      number: calculatedPageList.next
    });
    console.log('next');
    wrapperPageList.appendChild(pageBox);
  }

  return wrapperPageList.childNodes;
}

function paintPageList( pageNo, paginationCount, totalPage, query, videolist ) {
  const wrapperPageList = document.querySelector( '.pagination ul' );
 
  query('/videos/pages')
  .then( (response) => {
    let pageGroup = Math.ceil( response.total_pages / 14 );
    const calculatedPageList = calculatePageList( pageNo, paginationCount, pageGroup );

    console.log(JSON.stringify(calculatedPageList));
    if( calculatedPageList.prev ) {

      const pageBox = makePageListBox({
        id: 'prev',
        text: '<<',
        callback : function( ) {
          
          removePageListBox(wrapperPageList);
          paintPageList( calculatedPageList.prev, paginationCount, pageGroup, query, videolist );
  
          videolist(query, '/videos?page_no='+calculatedPageList.prev+'&count_per_page=14');
        }
      });
  
      wrapperPageList.appendChild(pageBox);
    }
  
    for( let i = calculatedPageList.first; i <= calculatedPageList.last; i++ ) {
  
      const pageBox = makePageListBox({
        id: i,
        text: i,
        callback : function( ) {
          let s = '/videos?page_no='+i+'&count_per_page=14';
          console.log('i:'+i+', s:'+s);
          videolist(query, s);
        }
      });
  
      wrapperPageList.appendChild(pageBox);
    }
  
    if( calculatedPageList.next ) {
  
      const pageBox = makePageListBox({
        id: 'next',
        text: '>>',
        callback : function( ) {
          removePageListBox(wrapperPageList);
          paintPageList( calculatedPageList.next, paginationCount, pageGroup, query, videolist );
          console.warn('fasfafaf');
          console.log('prev:'+calculatedPageList.next);
          videolist(query, '/videos?page_no='+calculatedPageList.next+'&count_per_page=14');
        }
      });
      console.log('next');
      wrapperPageList.appendChild(pageBox);
    }
  });
}

function makePageListBox( json ) {
  let liTag = document.createElement('li');

  let aTag = document.createElement('a');
  aTag.setAttribute('href', '#');
  aTag.setAttribute('id', json.id);
  aTag.text = json.text;

  aTag.addEventListener('click', json.callback);

  liTag.setAttribute('data-number', json.number);
  liTag.appendChild(aTag);
  return liTag;
}

function removePageListBox(wrapperTag) {
  while( wrapperTag.hasChildNodes() ) {
    wrapperTag.removeChild(wrapperTag.firstChild);
  }
}
