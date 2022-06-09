import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {

  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);

  const fetchImages = async () => {
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`

    if(query){
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }else{
      url = `${mainUrl}${clientID}${urlPage}`
    }

    try {
      setLoading(true)
      const response = await fetch(url);
      const data = await response.json()
      console.log(data);
      setPhotos((oldImages)=>{
        if(query && page === 1){
          return data.results
        }
        else if(query){
          return [...oldImages,...data.results]
        }else{
          return [...oldImages,...data]
        }
      });
      setNewImages(false);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      setNewImages(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line
  }, [page])

  // useEffect(()=>{
  //   const event = window.addEventListener('scroll', ()=>{
  //     // console.log(`innerHeight ${window.innerHeight}`);
  //     // console.log(`scoll ${window.scrollY}`);
  //     // console.log(`scollHeight ${document.body.scrollHeight}`);
  //     if( !loading && window.innerHeight + window.scrollY >= document.body.scrollHeight -2){
  //       setPage((oldpage)=>{
  //         return oldpage + 1;
  //       })
  //     }
  //   })
  //   return () => window.removeEventListener('scroll',event)
  //   // eslint-disable-next-line
  // },[])

  useEffect(()=>{
    if( !mounted.current ){
      mounted.current = true;
      return;
    }
    if(!newImages) return ;
      if(loading) return;
      setPage((oldpage)=>
        oldpage + 1
      )
  },[newImages])


  const event = () => {
    if( !loading && window.innerHeight + window.scrollY >= document.body.scrollHeight -2){
          setNewImages(true);
        }
      };

  useEffect(()=>{
    window.addEventListener('scroll', event);
    return ()=> window.removeEventListener('scroll', event)
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    if( !query ) return;
    if(page === 1){
      fetchImages()
    }
    setPage(1);
  }

  return <main>
    <section className='search'>
      <form className='search-form'>
        <input type='text' placeholder="Search" className='form-input' value={query} onChange={(e)=> setQuery(e.target.value)}/>
        <button type='submit' className='submit-btn' onClick={handleSubmit}>
          < FaSearch />
        </button>
      </form>
    </section>

    <section className='photos'>
      <div className='photos-center'>
        {photos.map((images, index) => {
          return <Photo key={images.id} {...images} />
        })}
      </div>
      {loading && <h2 className='loading'>Loading...</h2>}
    </section>

  </main>
}

export default App
