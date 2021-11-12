'use strict'

const API_KEY = 'api_key=4c46a0efde3aca3a9688a55c3a69b78d';
const BASE_URL = 'https://api.themoviedb.org/3';
const POPULAR_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const COMING_SOON_URL = BASE_URL + '/discover/movie?with_genres=18&primary_release_year=2021&' + API_KEY;
const tvShows_URL = BASE_URL + '';
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;


let headerWishlistCount = document.querySelector("#headerWishlistCount");
const wishlist = [];


window.onload = () => {
    const trendingMoviesDiv = document.querySelector('#trendingMovies .movieDiv');
    const comingSoonMoviesDiv = document.querySelector('#comingSoonMovies .movieDiv');
    const wishlistDiv = document.querySelector('.wishL');
    const wishListCount = document.querySelector("#headerWishlistCount");
    const form = document.querySelector("#form");
    const wishListToggle = document.querySelector(".wishList");
    const wishListHeart = document.querySelector("#headerWishlist");

    fetchMovies(POPULAR_URL, trendingMoviesDiv);
    fetchMovies(COMING_SOON_URL, comingSoonMoviesDiv);


    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = search.value;
        if (searchTerm) {
            if (window.location.href.search("index") > 0) {
                fetchMovies(SEARCH_URL + "&query=" + searchTerm, trendingMoviesDiv);
                document.querySelector("#banner").remove();
                document.querySelector("#trendingMovies").style.paddingTop = "8rem";
            } else if (window.location.href.search("newRelease") > 0) {
                fetchMovies(SEARCH_URL + "&query=" + searchTerm, comingSoonMoviesDiv);
            }

            document.querySelector(".section-heading").textContent = `Search results for ${searchTerm.charAt(0).toUpperCase()+searchTerm.slice(1)}`
        }
    })


    trendingMoviesDiv.addEventListener('click', function (e) {
        const movie = e.target.closest('.movie');
        const id = +movie.dataset.id;
        const title = movie.querySelector('.movie-title').textContent;
        const image = movie.querySelector('.movie-image').src;
        const existing = wishlist.find(mov => mov.id === id);

        if (e.target.classList.contains("addToFavourites")) {
            if (existing) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${title} is Already in Your Wishlist!`,
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                wishlist.push({
                    id,
                    title,
                    image
                });

                

                renderWishlist(wishlistDiv);
                setToStorage(id);

                e.target.classList.add('fas');
                wishListCount.textContent = wishlist.length;
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${title}`,
                    text: "Has Been Successfully Added To Wishlist",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    });



    wishListHeart.addEventListener("click", function () {
        wishListToggle.classList.toggle("hidden")
    })


    wishlistDiv.addEventListener('click', function (e) {
        const id = +e.target.closest('.row').dataset.id;
        const index = wishlist.findIndex(mov => mov.id === id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                wishlist.splice(index, 1);

                

                wishListCount.textContent = wishlist.length;
                trendingMoviesDiv.querySelector(`[data-id='${id}']`).querySelector(".addToFavourites").classList.remove('fas');
                renderWishlist(wishlistDiv);
                // removeFromStorage(id);
            }
        })

    });
}


function setToStorage(params){
    const str = localStorage.getItem("wishlist");
    const storage = str ? JSON.parse(str) : [];
    localStorage.setItem("wishlist", JSON.stringify([...storage, params]));
}

function getStorage(){
    const str = localStorage.getItem("wishlist");
    return str ? JSON.parse(str) : [];
}

// function removeFromStorage(params){
//     const str = localStorage.getItem("wishlist");
//     let storage = str ? JSON.parse(str) : [];
//     storage = [...storage.filter(e => e !== params)];
// }

function fetchMovies(url, div) {
    fetch(url)
        .then(response => response.json())
        .then(data => getMovies(data.results, div));
};


function getMovies(data, div) {
    div.innerHTML = "";
    data.forEach(movie => {
        const {
            id,
            title,
            poster_path,
            vote_average,
            release_date
        } = movie;
        data.forEach(movie => {
            div.insertAdjacentHTML('beforeend', `
            <div class="col-lg-4 col-md-4 col-sm-6 col-12">
                <div class="card movie" data-id="${movie.id}">
                    <div class="card-image">
                        <a href="https://www.google.com/search?q=${movie.title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"><img
                        src="${IMAGE_URL}${movie.poster_path}" class="card-img-top movie-image"
                        alt="${movie.title}"></a>
                        <a href="https://www.google.com/search?q=${movie.title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"
                        class="far fa-play-circle play-btn"></a>
                        <a class="far fa-heart addToFavourites"></a>
                    </div>
                    <div class="card-body movie-info ps-0 pe-0">
                        <h5 class="card-title movie-title">${movie.title}</h5>
                        <div class="movie-extra-info d-flex justify-content-between">
                            <p class="card-text movie-year">${movie.release_date.slice(0, 4)}</p>
                            <p class="movie-rating">${movie.vote_average}</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
        });
    });
}

const renderWishlist = (container) => {
    container.innerHTML = '';
    wishlist.forEach(mov => {
        container.insertAdjacentHTML('afterbegin', `
        <div class="row" data-id="${mov.id}">
            <div class="col-4">
                <div class="wishlistMovieImg">
                    <a href="https://www.google.com/search?q=${mov.title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"><img
                    class="w-100" src="${IMAGE_URL}${mov.image}" alt="${mov.title}}"></a>
                </div>
            </div>
            <div class="col-8">
                <div class="wishlistMovieInfo">
                    <p class="wishlistMovieTitle">${mov.title}</p>
                    <i class="fas fa-times wishlistDelete"></i>
                </div>
            </div>
        </div>
        `);
    });
}


// fetch(POPULAR_URL)
//     .then(res => res.json())
//     .then(data => {
//         data.results.forEach(movie => {
//             trendingMoviesDiv.insertAdjacentHTML('beforeend', `
//         <div class="col-lg-4 col-md-4 col-sm-6 col-12">
//             <div class="card movie" data-id="${movie.id}">
//                 <div class="card-image">
//                     <a href="https://www.google.com/search?q=${movie.title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"><img
//                     src="${IMAGE_URL}${movie.poster_path}" class="card-img-top movie-image"
//                     alt="${movie.title}"></a>
//                     <a href="https://www.google.com/search?q=${movie.title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"
//                     class="far fa-play-circle play-btn"></a>
//                     <button style="border:none" class="far fa-heart addToFavourites"></button>
//                 </div>
//                 <div class="card-body movie-info ps-0 pe-0">
//                     <h5 class="card-title movie-title">${movie.title}</h5>
//                     <div class="movie-extra-info d-flex justify-content-between">
//                         <p class="card-text movie-year">${movie.release_date.slice(0, 4)}</p>
//                         <p class="movie-rating">${movie.vote_average}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);
//         });
//         data.results.forEach(m => trendingMoviesArr.push(m));


//     });


// comingSoonMoviesDiv.addEventListener('click', function (e) {
//     console.log(e.target);
//     const movie = e.target.closest('.movie');
//     const id = +movie.dataset.id;
//     const title = movie.querySelector('.movie-title').textContent;
//     const image = movie.querySelector('.movie-image').src;

//     const existing = wishlist.find(mov => mov.id === id);

//     if (existing) return;

//     wishlist.push({
//         id,
//         title,
//         image
//     });

//     renderWishlist(wishlistDiv);

//     e.target.classList.add('fas');
//     wishListCount.textContent = wishlist.length;
// });





///////////////////////////////////




// window.onload = () => {
//     const trendingMovies = document.querySelector("#trendingMovies .container .row");
//     const comingSoonMovies = document.querySelector("#comingSoonMovies .container .row");
//     const tvShows = document.querySelector("#tvShows .container .row");
//     const form = document.querySelector("#form");
//     const search = document.querySelector("#search");
//     const wishListButton = document.querySelector("#headerWishlist");


//     fetchMovies(POPULAR_URL, trendingMovies);
//     fetchMovies(COMING_SOON_URL, comingSoonMovies);
//     setTimeout(() => {
//         var addToFav = document.querySelectorAll(".addToFavourites");
//         console.log(addToFav);
//         addToFav.forEach(element => {
//             element.addEventListener("click", function (e) {
//                 wishlistAdd(e);
//                 // console.log(wishListArr.length);
//                 const deleteFav = document.querySelectorAll(".wishlistDelete");
//                 deleteFav.forEach(element => {
//                     element.addEventListener("click", function (e) {
//                         wishlistDelete(e);


//                     })
//                 });
//             })
//         });
//     }, 1000);

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();
//         const searchTerm = search.value;
//         if (searchTerm) {
//             if (window.location.href.search("index") > 0) {
//                 fetchMovies(SEARCH_URL + "&query=" + searchTerm, trendingMovies);
//                 document.querySelector("#banner").remove();
//                 document.querySelector("#trendingMovies").style.paddingTop = "8rem";
//             } else if (window.location.href.search("newRelease") > 0) {
//                 fetchMovies(SEARCH_URL + "&query=" + searchTerm, comingSoonMovies);
//             } else if (window.location.href.search("tvShows") > 0) {
//                 fetchMovies(SEARCH_URL + "&query=" + searchTerm, tvShows);
//             } else if (window.location.href.search("pickRandom") > 0) {
//                 fetchMovies(SEARCH_URL + "&query=" + searchTerm, tvShows);
//             }
//             document.querySelector(".section-heading").textContent = `Search results for ${searchTerm.charAt(0).toUpperCase()+searchTerm.slice(1)}`
//         }
//     })

//     wishListButton.addEventListener("click", function () {
//         var menu = document.querySelector(".wishList");
//         menu.classList.toggle("hidden");
//     })

//     // const deleteFav = document.querySelectorAll(".wishlistDelete");
//     // deleteFav.forEach(element => {
//     //     element.addEventListener("click", function (e) {
//     //         wishlistDelete(e);
//     //     })
//     // });


// }




// function wishlistAdd(e) {
//     let cardImgSrc = e.target.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.getAttribute("src");
//     let cardText = e.target.parentElement.parentElement.lastElementChild.firstElementChild.textContent;
//     const wishlist = document.querySelector(".wishL");
//     const newWishListEl = document.createElement("div");
//     newWishListEl.classList.add("row");
//     newWishListEl.innerHTML = `
//     <div class="col-4">
//         <div class="wishlistMovieImg">
//              <a href="https://www.google.com/search?q=${cardText}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"><img class="w-100" src="${cardImgSrc}" alt="${cardText}}"></a>
//         </div>
//      </div>
//     <div class="col-8">
//         <div class="wishlistMovieInfo">
//         <p class="wishlistMovieTitle">${cardText}</p>
//         <i class="fas fa-times wishlistDelete"></i>
//         </div>
//     </div>
//     `
//     if (!wishListArr.includes(cardText)) {
//         wishlist.appendChild(newWishListEl);
//         Swal.fire({
//             position: 'top-end',
//             icon: 'success',
//             title: `${cardText}`,
//             text: "Has Been Successfully Added To Wishlist",
//             showConfirmButton: false,
//             timer: 1500
//         })
//         wishListArr.push(cardText);
//         e.target.classList.add("fas");
//         headerWishlistCount.textContent = wishListArr.length;

//     } else {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: `${cardText} is Already in Your Wishlist!`,
//         })
//     }

// }

// function wishlistDelete(e) {
//     const wishlist = document.querySelector(".wishL");
//     const title = e.target.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.firstElementChild.textContent;
//     Swal.fire({
//         title: 'Are you sure?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             wishlist.removeChild(e.target.parentElement.parentElement.parentElement)
//             let newArr = wishListArr.filter(function(e) { return e !== `${title}` });
//             wishListArr = newArr;
//             for (const a of document.querySelectorAll("h5")) {
//                 if (a.textContent.includes(e.target.parentElement.parentElement.lastElementChild.firstElementChild.textContent)) {
//                     a.parentElement.parentElement.firstElementChild.lastElementChild.classList.toggle("fas");
//                 }
//             }
//             headerWishlistCount.textContent = wishListArr.length;

//             Swal.fire(
//                 'Deleted!',
//                 'The Movie Has Been Removed from Wishlist!',
//                 'success'
//             )

//         }
//     })



// }


// // function fetchMovies(url, div) {
// //     fetch(url)
// //         .then(response => response.json())
// //         .then(data => getMovies(data.results, div));
// // };

// async function fetchMovies(url, div) {
//     const res = await fetch(url);
//     const data = await res.json();
//     getMovies(data.results, div);
// };


// function getMovies(data, div) {
//     div.innerHTML = "";
//     data.forEach(movie => {
//         const {
//             title,
//             poster_path,
//             vote_average,
//             release_date
//         } = movie;
//         const movieEl = document.createElement("div");
//         movieEl.classList.add("col-lg-4", "col-md-4", "col-sm-6", "col-12");
//         movieEl.innerHTML = `
//         <div class="card movie">
//              <div class="card-image">
//                 <a href="https://www.google.com/search?q=${title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8"><img src="${IMAGE_URL + poster_path}" class="card-img-top movie-image" alt="${title}"></a>
//                 <a href="https://www.google.com/search?q=${title}+movie&oq=hard+mo&aqs=chrome.0.69i59j69i57j0i512l3j0i457i512j0i512l3j0i67.2376j0j9&sourceid=chrome&ie=UTF-8" class="far fa-play-circle play-btn"></a>
//                 <a class="far fa-heart addToFavourites"></a>
//              </div>
//              <div class="card-body movie-info ps-0 pe-0">
//                 <h5 class="card-title movie-title">${title}</h5>
//                 <div class="movie-extra-info d-flex justify-content-between">
//                     <p class="card-text movie-year">${release_date.slice(0, 4)}</p>
//                     <p class="movie-rating">${vote_average}</p>
//                 </div>
//             </div>
//         </div> `;
//         div.appendChild(movieEl);
//     });
// };