let pokemonArray = [];
let pokemonArrayNew = [];

window.onload = function () {
    getPokemonJSON();

}

function getPokemonJSON() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        pokemonArray = JSON.parse(this.responseText);

        TransformData(pokemonArray);
        genCard(pokemonArrayNew);

    }
    xhr.open("GET", "https://raw.githubusercontent.com/apprunner/pokemon.json/master/pokedex.json");
    xhr.send();
}

function TransformData(dataArray) {
    dataArray.forEach(item => {
        let id = item.id.toString().padStart(3, "0");
        let type = item.type[0]; 
        let name = item.name.chinese;
        let hp = item.base.HP;
        let attack = item.base.Attack;
        let defense = item.base.Defense;
        let sp_attack = item.base["Sp. Attack"];
        let sp_defense = item.base["Sp. Defense"];
        let speed = item.base.Speed;
        let img = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png`;
        let pokemon = {
            Id: id,
            Type: type,
            Name: name,
            Hp: hp,
            Attack: attack,
            Defense: defense,
            SpAttack: sp_attack,
            SpDefense: sp_defense,
            Img: img
        };
        pokemonArrayNew.push(pokemon);
        console.log(pokemonArrayNew);
    });
}

function genCard(pokemonArrayNew) {
    let row = document.querySelector('.row');
   
    pokemonArrayNew.forEach(item => {
        let card = document.querySelector('#cardMonster');
        let cloneContent = card.content.cloneNode(true);
      
        cloneContent.querySelector("img").src =
            `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${item.Id}.png`;
        cloneContent.querySelector('.card-text').innerText = item.Type;
        cloneContent.querySelector('.btn').setAttribute('data-defense', `${item.Defense}`);
        cloneContent.querySelector('.btn').setAttribute('data-name', `${item.Name}`);
        cloneContent.querySelector('.btn').setAttribute('data-hp', `${item.Hp}`);
        cloneContent.querySelector('.btn').setAttribute('data-attack', `${item.Attack}`);
        cloneContent.querySelector('.btn').setAttribute('data-spa', `${item.SpAttack}`);
        cloneContent.querySelector('.btn').setAttribute('data-spd', `${item.SpDefense}`);
        cloneContent.querySelector('.btn').setAttribute('data-id', `${item.Id}`);
        cloneContent.querySelector('.btn').innerText = `${item.Name}`;

        row.appendChild(cloneContent);


    })

    showModal();

}

function showModal() {
    var buttons = document.querySelectorAll(".btn-primary");
    buttons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            this.setAttribute("data-toggle", "modal");
            this.setAttribute("data-target", "#exampleModal");
            let modal = document.querySelector("#exampleModal");
            modal.querySelector("h5").innerText = e.target.dataset.name;
            modal.querySelector(".defense").innerText = `防禦率：${e.target.dataset.defense}`;
            modal.querySelector(".hp").innerText = `HP：${e.target.dataset.hp}`;
            modal.querySelector(".attack").innerText = `攻擊力：${e.target.dataset.attack}`;
            modal.querySelector(".special-attack").innerText = `特殊攻擊：${e.target.dataset.spa}`;
            modal.querySelector(".special-defense").innerText = `特殊防禦：${e.target.dataset.spd}`;
            modal.querySelector(".monsterImage").src=`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${e.target.dataset.id}.png`;
            
        })
    })
};


