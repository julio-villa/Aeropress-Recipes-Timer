import { useState, useEffect } from 'react';
import { Recipes } from './Components/Recipes.jsx';

const Main = () => {

  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const apiUrl = 'http://localhost:3001/data';
    setIsLoading(true);
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Assumes server responds with JSON
      })
      .then(data => {
        console.log(data); // Process the JSON data
        setRecipes(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setError(err);
        setIsLoading(false);
      });;
  }, []);


  if (error) return <h1>Error loading recipes: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading delicious recipes...</h1>;
  if (!recipes) return <h1>No recipes found</h1>;

  return (
    <div>
      <Recipes recipes={recipes} />
    </div>
  );
}
function App() {

  return (
    <>
      <Main />
    </>
  );
}

export default App;
