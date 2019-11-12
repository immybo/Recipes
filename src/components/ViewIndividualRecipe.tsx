import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import RecipeComponent from './shared/RecipeCompactDisplay';
import { withNavigation } from 'react-navigation';
import IngredientDisplay from './shared/IngredientDisplay';
import { styles } from '../style/Style';

interface ViewIndividualRecipeProps extends React.Props<ViewIndividualRecipe> {
  navigation: any
}

interface ViewIndividualRecipeState {
  recipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {};
}

class ViewIndividualRecipe extends React.Component<ViewIndividualRecipeProps, ViewIndividualRecipeState> {
  constructor(props: ViewIndividualRecipeProps) {
    super(props);

    this.state = {
      recipe: this.props.navigation.getParam("recipe", null)
    };
  }

  public render(): JSX.Element {
    if (this.state.recipe == null) {
      return <View />;
    }

    return (
      <View>
        <Text style={styles.h1}>{this.state.recipe.name}</Text>
        <Text>{this.state.recipe.description}</Text>
        {this.getIngredientList()}
        {this.getCategoryList()}
      </View>
    );
  }

  private getIngredientList(): JSX.Element[] {
    return this.state.recipe.ingredients.map((ingredient, key) => <IngredientDisplay key={key} ingredient={ingredient} />);
  }

  private getCategoryList(): JSX.Element {
    return <Text>{this.state.recipe.categories.map(x => x.name).join(", ")}</Text>
  } 
}

export default withNavigation(connect(mapStateToProps)(ViewIndividualRecipe));
