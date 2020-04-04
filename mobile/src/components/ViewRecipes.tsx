import React from 'react';
import {
    View,
    Text,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation, ScrollView } from 'react-navigation';
import { RouteAddRecipe, RouteViewIndividualRecipe, RouteEditRecipe, RouteAddIngredient, RouteMealPlanner } from '../Routes';
import { deleteRecipe } from '../actions/RecipeActions';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';
import { styles } from '../style/Style';
import NavigationBar from './shared/NavigationBar';

interface ViewRecipesProps extends React.Props<ViewRecipes> {
    navigation: any,
    recipes: Recipe[],
    deleteRecipe: (deletedRecipe: Recipe) => void
}

const mapStateToProps = (state: AppState) => {
    return {
        recipes: state.recipes.recipes
    };
}

const mapDispatchToProps = {
    deleteRecipe
};

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
    constructor(props: ViewRecipesProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View>
                        {this.getRecipeList()}
                    </View>
                    <View style={styles.bottomButtonContainer}>
                        <NavigationBar navigate={route => this.props.navigation.navigate(route)} />
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewRecipes));
