import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Composant modal de détail
const RecipeModal = ({ recipe, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full border-t-4 border-[#ff6b6b] shadow-lg">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#2d3436] flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-[#ff6b6b]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {recipe.title}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-[#ff6b6b]">
          ✕
        </button>
      </div>
      <p className="text-gray-700 bg-[#ffeaa71a] p-4 rounded-lg border-l-2 border-[#ffeaa7]">
        {recipe.description}
      </p>
    </div>
  </div>
);

// Modal pour ajouter une recette
const NewRecipeModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      await onSave({ title: title.trim(), description: description.trim() });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full border-t-4 border-[#ff9f43] shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#2d3436] flex items-center">Create New Recipe</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#ff9f43]">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium mb-2">Recipe Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-2 border rounded-lg h-32"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#ff9f43] text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);

  // Récupération des recettes depuis le backend
  const fetchRecipes = async () => {
    try {
      const res = await fetch("http://localhost:3001/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes :", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Enregistrement d'une nouvelle recette
  const handleSaveNewRecipe = async (newRecipe) => {
    try {
      const res = await fetch("http://localhost:3001/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      const saved = await res.json();
      setRecipes((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Erreur lors de l’ajout :", error);
    }
  };

  const filteredRecipes = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen p-8 sm:p-20`}>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#2d3436]">Yummy Recipes</h1>
        <p className="text-[#666] italic">Discover delicious meals to cook at home</p>
        <div className="w-24 h-1 bg-[#ff6b6b] mx-auto rounded-full mt-2"></div>
      </header>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            className="flex-1 p-2 border rounded-lg mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowNewRecipeModal(true)}
            className="px-4 py-2 bg-[#ff9f43] text-white rounded-lg"
          >
            New Recipe
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-500">No recipes found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredRecipes.map((recipe) => (
              <li key={recipe.id}>
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-medium">{recipe.title}</h2>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
      {showNewRecipeModal && (
        <NewRecipeModal
          onClose={() => setShowNewRecipeModal(false)}
          onSave={handleSaveNewRecipe}
        />
      )}
    </div>
  );
}
