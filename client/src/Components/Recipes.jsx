import { Recipe } from './Recipe';

export const Recipes = ({ recipes }) => {
    return (
        <div>
            {recipes.map(recipe => (
                <Recipe recipe= {recipe}  />
            ))}
        </div>
    );
};