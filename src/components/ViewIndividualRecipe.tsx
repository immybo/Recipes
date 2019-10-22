import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import RecipeComponent from './shared/RecipeCompactDisplay';
import { withNavigation } from 'react-navigation';
import IngredientDisplay from './shared/IngredientDisplay';

interface ViewIndividualRecipeProps extends React.Props<ViewIndividualRecipe> {
  recipe?: Recipe
}

const mapStateToProps = (state: AppState) => 
{
  return {
    recipe: state.recipes.recipeContext
  };
}

class ViewIndividualRecipe extends React.Component<ViewIndividualRecipeProps, any> {
  constructor(props: ViewIndividualRecipeProps) {
    super(props);
  }

  public render(): JSX.Element {
    if (this.props.recipe == null) {
      return <View />;
    }

    return (
      <View>
        <Text>{this.props.recipe.name}</Text>
        <Text>{this.props.recipe.description}</Text>
        {this.getIngredientList()}
      </View>
    );
  }

  private getIngredientList(): JSX.Element[] {
    return this.props.recipe.ingredients.map((ingredient, key) => <IngredientDisplay key={key} ingredient={ingredient} />);
  }
}

export default withNavigation(connect(mapStateToProps)(ViewIndividualRecipe));
