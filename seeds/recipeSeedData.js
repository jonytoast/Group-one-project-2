// imports Recipe Model
const { Recipe } = require('../models');

// array of recipe seed data
const recipeSeedData = [
    {
        title: "Omelette",
        recipe_text: "Melt butter over medium high heat. Add the eggs and cook just until a skin forms, about 10 to 15 seconds. Add the fillings, then start to shake the pan to roll the eggs up and over the cheese. Cook another 10 to 15 seconds where the outside is pale golden and the interior is soft and creamy. Roll it out onto a plate and you're done!",
        main_ingredient: "Eggs",
        user_id: 1,
    },
    {
        title: "Spaghetti",
        recipe_text: "Boil pasts in salt water. Add meat sauce on top. Serve.",
        main_ingredient: "Beef",
        user_id: 2,
    },
    {
        title: "Lemon Black Tea",
        recipe_text: "Steep black tea in pitcher. Add ice cubes to tea. Squeeze 1 whole lemon into pitcher. Serve.",
        main_ingredient: "Black Tea",
        user_id: 2,
    },
    {
        title: "Fried Chicken",
        recipe_text: "Prep breading. Cover chicken legs with breading throughly. Deep-fry until breading is golden-brown. Serve.",
        main_ingredient: "Chicken",
        user_id: 3,
    },
    {
        title: "Instant Noodles",
        recipe_text: "Boil water in pot. Add instant noodle seasoning pack. Add instant noodles. Add vegetables as desired. Cook for 2 minutes. Serve.",
        main_ingredient: "Noodles",
        user_id: 4,
    },
];

// function to seed recipe data
const seedRecipe = () =>{

    Recipe.bulkCreate(recipeSeedData);

};

// exports recipe seeding function
module.exports = seedRecipe;