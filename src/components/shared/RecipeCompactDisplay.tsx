import React from 'react';
import {
  View,
  Button
} from 'react-native';
import { Recipe } from '../../model/Recipe';

interface RecipeCompactDisplayProps {
  recipe: Recipe,
  onClick?: (recipe: Recipe) => void
}

class RecipeCompactDisplay extends React.Component<RecipeCompactDisplayProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <View>
            <Button title={this.props.recipe.name} onPress={(event) => this.props.onClick && this.props.onClick(this.props.recipe)}>{this.props.recipe.name}</Button>
        </View>
    );
  }
}

export default RecipeCompactDisplay;
