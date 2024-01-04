// pokedex

// https://pokeapi.co/docs.v2

// create a page that displays 40 pokemon in cards by default
// each card should display an image, name, type
// for each card, if you click them it should open a dialogue that lists the abilities of that pokemon
// search bar that filters the list of cards that displays on the page

// extra time, get evolution chain of pokemon aswell

const filterSubmit = document.querySelector(".filter-form");
const filterInput = document.querySelector(".filter-form__input");
let evolutionData = [];

filterSubmit.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (filterInput.value.length > 2) {
    const filterValue = filterInput.value;
    const filteredArray = await getFilteredPokemon(filterValue);
    renderPokemon(filteredArray);
  } else alert("Search must be at least 3 characters long");
});

const getFilteredPokemon = async (filterValue) => {
  const pokemonResults = await fetchData(
    `https://pokeapi.co/api/v2/pokemon?limit=1025`
  );
  const pokemonList = pokemonResults.results;
  let filteredPokemon = pokemonList.reduce((acc, pokemon) => {
    if (pokemon.name.includes(filterValue) && acc.length < 40) {
      acc.push(pokemon);
    }
    return acc;
  }, []);
  return filteredPokemon;
};

const fetchData = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const getPokemonOnLoad = async () => {
  const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=40`);
  const pokemon = data.results;
  return pokemon;
};

const getPokemonTypeAbil = async (pokeList) => {
  let pokeTypesList = [];
  let pokeAbilitiesList = [];

  const promises = pokeList.map((pokemon) => fetchData(pokemon.url));

  const results = await Promise.all(promises);

  for (let data of results) {
    // do types
    const types = data.types;
    const pokeTypes = types.map((type) => type.type.name);
    pokeTypesList.push(
      pokeTypes.length === 1 ? pokeTypes[0] : pokeTypes.join(" | ")
    );
    // do abilities
    const abilities = data.abilities;
    const pokeAbilities = abilities.map((ability) => ability.ability.name);
    pokeAbilitiesList.push(
      pokeAbilities.length === 1 ? pokeAbilities[0] : pokeAbilities.join(" | ")
    );
  }

  return [pokeTypesList, pokeAbilitiesList];
};

const renderPokemon = async (list) => {
  const container = document.querySelector(".pokemon-list");
  container.innerHTML = "...loading pokemon";

  // get list of pokemon
  const pokemonList = await list;

  // get pokemon types and abilities
  const pokeTypeAbil = await getPokemonTypeAbil(pokemonList);
  console.log(pokeTypeAbil);
  // extract types
  const pokeTypes = pokeTypeAbil[0];
  // extract abilities
  const pokeAbilities = pokeTypeAbil[1];

  // create pokemon cards
  class PokemonDisplay {
    constructor(name, types, image, abilities, id) {
      this.name = name;
      this.types = types;
      this.abilities = abilities;
      this.image = image;
      this.id = id;
    }

    async getEvolutionChain() {
      const speciesData = await fetchData(
        `https://pokeapi.co/api/v2/pokemon-species/${this.id}`
      );
      const evolutionChainData = await fetchData(
        speciesData.evolution_chain.url
      );
      return evolutionChainData;
    }

    getTypeColor() {
      const typeArray = this.types.split(" | ");
      const typeColorMap = {
        normal: "#acad99",
        fighting: "#c45d4c",
        flying: "#90aad7",
        poison: "#b369af",
        ground: "#ceb250",
        rock: "#baa85e",
        bug: "#acc23e",
        ghost: "#816db6",
        steel: "#9fa9af",
        fire: "#e87a3d",
        water: "#639ce4",
        grass: "#82c95b",
        electric: "#e7c536",
        psychic: "#e96c95",
        ice: "#81cfd7",
        dragon: "#8572c8",
        dark: "#79726b",
        fairy: "#e8b0eb",
      };
      return typeColorMap[typeArray[0]] || "#ffffff";
    }

    createCard() {
      // get type color
      const color = this.getTypeColor();

      // get card elements
      const borderDiv = document.createElement("div");
      borderDiv.classList.add("pokemon-list__border");

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("pokemon-list__card");
      cardDiv.style.backgroundColor = color;

      const nameP = document.createElement("p");
      nameP.classList.add("pokemon-list__card__name");
      nameP.textContent = capitalizeFirstLetter(this.name);

      const imageDiv = document.createElement("div");
      imageDiv.classList.add("pokemon-list__card__image");

      const image = document.createElement("img");
      image.classList.add("pokemon-list__card__image--img");
      image.src = this.image;

      const types = document.createElement("p");
      types.classList.add("pokemon-list__card__types");
      types.textContent = capitalizeFirstLetter(this.types);

      // get dialog elements
      const borderDivD = document.createElement("dialog");
      borderDivD.classList.add("pokemon-list__border-d");

      const cardDivD = document.createElement("div");
      cardDivD.classList.add("pokemon-list__dialog");
      cardDivD.style.backgroundColor = color;

      const namePD = document.createElement("p");
      namePD.classList.add("pokemon-list__dialog__name");

      const imageDivD = document.createElement("div");
      imageDivD.classList.add("pokemon-list__dialog__image");

      const imageD = document.createElement("img");
      imageD.classList.add("pokemon-list__dialog__image--img");
      imageD.src = this.image;

      const typesHeadD = document.createElement("p");
      typesHeadD.classList.add("pokemon-list__dialog__types");
      typesHeadD.textContent = "Types";

      const typesD = document.createElement("p");
      typesD.classList.add("pokemon-list__dialog__types");
      typesD.textContent = capitalizeFirstLetter(this.types);

      const abilitiesD = document.createElement("div");
      abilitiesD.classList.add("pokemon-list__dialog__abilities");

      const abilitiesTextHeadD = document.createElement("p");
      abilitiesTextHeadD.classList.add("pokemon-list__dialog__abilities--text");
      abilitiesTextHeadD.textContent = "Abilities";

      const abilitiesTextD = document.createElement("p");
      abilitiesTextD.classList.add("pokemon-list__dialog__abilities--text");
      abilitiesTextD.textContent = capitalizeFirstLetter(this.abilities);

      // append dialog elements
      abilitiesD.appendChild(abilitiesTextHeadD);
      abilitiesD.appendChild(abilitiesTextD);
      imageDivD.appendChild(imageD);
      cardDivD.appendChild(namePD);
      cardDivD.appendChild(imageDivD);
      cardDivD.appendChild(typesHeadD);
      cardDivD.appendChild(typesD);
      cardDivD.appendChild(abilitiesD);
      borderDivD.appendChild(cardDivD);
      // append elements
      imageDiv.appendChild(image);
      cardDiv.appendChild(nameP);
      cardDiv.appendChild(imageDiv);
      cardDiv.appendChild(types);
      borderDiv.appendChild(cardDiv);
      borderDiv.appendChild(borderDivD);

      //adding event listeners
      cardDiv.addEventListener("click", async (event) => {
        event.stopPropagation();
        const loadingDialog = document.querySelector(".loading-dialog");
        loadingDialog.showModal();
        const evolutionChain = await this.getEvolutionChain();

        // Create and append evolution chain elements
        const evolutionDiv = document.createElement("div");
        evolutionDiv.classList.add("pokemon-list__dialog__evolution");

        const chain = evolutionChain.chain;
        let currentStage = chain;

        while (currentStage) {
          const speciesName = currentStage.species.name;
          const speciesId = currentStage.species.url.split("/")[6];
          const speciesImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`;

          const speciesP = document.createElement("p");
          speciesP.classList.add("pokemon-list__dialog__evolution--name");
          namePD.textContent = capitalizeFirstLetter(speciesName);
          speciesP.textContent = capitalizeFirstLetter(speciesName);

          const speciesImg = document.createElement("img");
          speciesImg.classList.add("pokemon-list__dialog__evolution--img");
          speciesImg.src = speciesImage;

          evolutionDiv.appendChild(speciesP);
          evolutionDiv.appendChild(speciesImg);

          currentStage = currentStage.evolves_to[0];
        }
        cardDivD.appendChild(evolutionDiv);
        loadingDialog.close();
        borderDivD.showModal();
      });

      document.addEventListener("click", (event) => {
        if (!cardDivD.contains(event.target) && borderDivD.open) {
          borderDivD.close();
          const evolutionDiv = cardDivD.querySelector(
            ".pokemon-list__dialog__evolution"
          );
          if (evolutionDiv) {
            cardDivD.removeChild(evolutionDiv);
          }
        }
      });

      return borderDiv;
    }
  }

  const pokemonCards = pokemonList.map((pokemon, ind) => {
    const pokeNum = pokemon.url.split("/")[6];
    const pokeDisplay = new PokemonDisplay(
      pokemon.name,
      pokeTypes[ind],
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeNum}.png`,
      pokeAbilities[ind],
      pokeNum
    );
    return pokeDisplay.createCard();
  });
  container.innerHTML = "";
  pokemonCards.forEach((card) => container.appendChild(card));
};

const capitalizeFirstLetter = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

renderPokemon(getPokemonOnLoad());
