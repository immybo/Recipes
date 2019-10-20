import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';

interface IngredientComponentProps {
  ingredient: string
}

const mapStateToProps = (state: AppState) => 
{
  return {
  };
}

class IngredientComponent extends React.Component<IngredientComponentProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <Text>{this.props.ingredient}</Text>
    );
  }
}

export default connect(mapStateToProps)(IngredientComponent);
