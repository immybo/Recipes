import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { Recipe } from '../../model/Recipe';
import IngredientDisplay from './IngredientDisplay';

interface RecipeComponentProps {
  recipe: Recipe
}

class RecipeComponent extends React.Component<RecipeComponentProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <View>
            <Text>{this.props.recipe.name}</Text>
            <Text>{this.props.recipe.description}</Text>
            {this.getIngredientList()}
        </View>
    );
  }

  private getIngredientList(): JSX.Element[] {
      return this.props.recipe.ingredients.map(ingredient => <IngredientDisplay key={ingredient} ingredient={ingredient} />);
  }
}

export default RecipeComponent;
