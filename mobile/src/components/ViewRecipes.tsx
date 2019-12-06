import React from 'react';
import {
    View,
    Text,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteAddRecipe, RouteViewIndividualRecipe, RouteEditRecipe } from '../Routes';
import { selectRecipe, deleteRecipe } from '../actions/RecipeActions';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';
import { styles } from '../style/Style';

interface ViewRecipesProps extends React.Props<ViewRecipes> {
    navigation: any,
    recipes: Recipe[],
    selectRecipe: (newSelectedRecipe: Recipe) => void,
    deleteRecipe: (deletedRecipe: Recipe) => void
}

const mapStateToProps = (state: AppState) => {
    return {
        recipes: state.recipes.recipes
    };
}

const mapDispatchToProps = {
    selectRecipe,
    deleteRecipe
};

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
    constructor(props: ViewRecipesProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <View>
                    {this.getRecipeList()}
                </View>
                <View style={styles.bottomButtonContainer}>
                    <Button title="Add Recipe" onPress={(event: any) => this.props.navigation.navigate(RouteAddRecipe)}>Add Recipe</Button>
                </View>
            </View>
        );
    }

    private getRecipeList(): JSX.Element[] {
        return this.props.recipes.map((recipe, key) =>
            <RecipeCompactDisplay
                onClick={(recipe) => this.selectRecipe(recipe)}
                onEdit={(recipe) => this.editRecipe(recipe)}
                onDelete={(recipe) => this.deleteRecipe(recipe)}
                key={key}
                recipe={recipe} />);
    }

    private selectRecipe(recipe: Recipe) {
        this.props.selectRecipe(recipe);
        this.props.navigation.navigate(RouteViewIndividualRecipe, { recipe: recipe });
    }

    private editRecipe(recipe: Recipe) {
        this.props.selectRecipe(recipe);
        this.props.navigation.navigate(RouteEditRecipe, { recipe: recipe });
    }

    private deleteRecipe(recipe: Recipe) {
        this.props.deleteRecipe(recipe);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewRecipes));