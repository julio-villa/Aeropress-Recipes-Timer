export const Recipe = ({ recipe }) => {
    return (
        <div>
            <div key={recipe.id}>
                    <h1>{recipe.title}</h1>
                    <p>{recipe.description}</p>
                </div>
        </div>
    );
};

