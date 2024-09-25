const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const closeButton = document.querySelector("#search-close-icon");
const notFoundPokemon = document.querySelector("#not-found-pokemon");

let pokemonList = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    pokemonList = data.results;
    displayPokemonList(pokemonList);
})

async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise
        .all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((response) => response.json()
        )
    ])
    return true
    } catch(error) {
        console.error("Failed to fetch Pokemon data before redirect");
    }
}

function displayPokemonList(pokemon) {
    listWrapper.innerHTML = ""; 

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
        <div class = "number-wrap">
            <p class = "caption-fonts">#${pokemonID}</p>
        </div>
        <div class = "img-wrap">
            <img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"" alt = "${pokemon.name}" 
            />
        </div>
        <div class = "name-wrap">
        <p class = "caption-fonts">${pokemon.name}</p>
        </div>
        `
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                window.location.href = `/detail.html?id=${pokemonID}`;
            }
        })

        listWrapper.appendChild(listItem)

    })
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchPokemon = searchInput.value.toLowerCase(); 
    let searchedPokemons;

    if (numberFilter.checked) {
        searchedPokemons = pokemonList.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchPokemon);
        });
    } else if (nameFilter.checked) {
        searchedPokemons = pokemonList.filter((pokemon) =>
          pokemon.name.toLowerCase().startsWith(searchPokemon)
        );
    } else {
        searchedPokemons = pokemonList; 
    }
    displayPokemonList(searchedPokemons);

    if (searchedPokemons.length == 0) {
        notFoundPokemon.style.display = "block"; 
    } else {
        notFoundPokemon.style.display = "none"; 
    }
}

closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemonList(pokemonList);
    notFoundPokemon.style.display = "none"; 
}



