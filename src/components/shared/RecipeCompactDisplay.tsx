import React from 'react';
import {
  View,
  Button
} from 'react-native';
import { Recipe } from '../../model/Recipe';

interface RecipeCompactDisplayProps {
  recipe: Recipe,
  onClick: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
}

class RecipeCompactDisplay extends React.Component<RecipeCompactDisplayProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <View>
            <Button title={this.props.recipe.name} onPress={(event) => this.props.onClick(this.props.recipe)} />
            <Button title="x" onPress={(event) => this.props.onDelete(this.props.recipe)} />
        </View>
    );
  }
}

export default RecipeCompactDisplay;
