import React from 'react';
import { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ViewRecipes from './components/ViewRecipes';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { store } from './reducers/Reducers';
import AddRecipe from './components/AddRecipe';
import ViewIndividualRecipe from './components/ViewIndividualRecipe';
import EditRecipe from './components/EditRecipe';

const MainNavigator = createStackNavigator({
  ViewRecipes: {screen: ViewRecipes},
  AddRecipe: {screen: AddRecipe},
  ViewIndividualRecipe: {screen: ViewIndividualRecipe},
  EditRecipe: {screen: EditRecipe}
});

let Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}