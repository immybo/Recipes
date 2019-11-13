import React from 'react';
import ViewRecipes from './components/ViewRecipes';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { store } from './reducers/Reducers';
import AddRecipe from './components/AddRecipe';
import ViewIndividualRecipe from './components/ViewIndividualRecipe';
import EditRecipe from './components/EditRecipe';
import InitialStateLoader from './components/InitialStateLoader';

const MainNavigator = createStackNavigator({
    ViewRecipes: { screen: ViewRecipes },
    AddRecipe: { screen: AddRecipe },
    ViewIndividualRecipe: { screen: ViewIndividualRecipe },
    EditRecipe: { screen: EditRecipe }
});

let Navigation = createAppContainer(MainNavigator);

interface AppLocalState {
    isLoaded: boolean
}

export default class App extends React.Component<any, AppLocalState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false
        };
    }

    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <InitialStateLoader onLoad={() => this.setState({isLoaded: true})} />
                { this.state.isLoaded && <Navigation />}
            </Provider>
        );
    }
}