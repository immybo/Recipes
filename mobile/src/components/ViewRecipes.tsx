import React from 'react';
import {
    // Previously we used ScrollView from react-navigation, no longer necessary
    View, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { RouteViewIndividualRecipe, RouteEditRecipe } from '../Routes';
import { deleteRecipe } from '../actions/RecipeActions';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';
import { styles } from '../style/Style';
import { removeDisplayedError } from '../actions/NetworkActions';
import NavigationToggle from './NavigationToggle';

interface ViewRecipesProps extends React.Props<ViewRecipes> {
    navigation: any,
    recipes: Recipe[],
    deleteRecipe: (deletedRecipe: Recipe) => void,
    removeDisplayedError: () => void
}

const mapStateToProps = (state: AppState) => {
    return {
        recipes: state.recipes.recipes
    };
}

const mapDispatchToProps = {
    deleteRecipe,
    removeDisplayedError
};

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
    constructor(props: ViewRecipesProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <NavigationToggle navigation={this.props.navigation} pageTitle="View Recipes" />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View>
                        {this.getRecipeList()}
                    </View>
                </ScrollView>
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
        this.props.navigation.navigate(RouteViewIndividualRecipe, { recipe: recipe });
    }

    private editRecipe(recipe: Recipe) {
        this.props.navigation.navigate(RouteEditRecipe, { recipe: recipe });
    }

    private deleteRecipe(recipe: Recipe) {
        this.props.deleteRecipe(recipe);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRecipes);
