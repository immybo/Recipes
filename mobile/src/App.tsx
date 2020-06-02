import React from 'react';
import ViewRecipes from './components/ViewRecipes';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { store, AppState } from './reducers/Reducers';
import AddRecipe from './components/AddRecipe';
import ViewIndividualRecipe from './components/ViewIndividualRecipe';
import EditRecipe from './components/EditRecipe';
import InitialStateLoader from './components/InitialStateLoader';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from './style/Colors';
import { styles } from './style/Style';
import NoConnectionToServer from './components/NoConnectionToServer';
import AddIngredient from './components/AddIngredient';
import MealPlanner from './components/MealPlanner';
import ErrorDisplay from './components/ErrorDisplay';
import ViewIngredients from './components/ViewIngredients';
import { removeDisplayedError } from './actions/NetworkActions';
import EditIngredient from './components/EditIngredient';

const PageHeaderStyle = {
    headerTitleStyle: {
        fontWeight: 'bold'
    }
};

const MainNavigator = createStackNavigator({
    ViewRecipes: { screen: ViewRecipes, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Recipe List" })},
    AddRecipe: { screen: AddRecipe, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Add Recipe" })},
    ViewIndividualRecipe: { screen: ViewIndividualRecipe, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "View Recipe" })},
    EditRecipe: { screen: EditRecipe, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Edit Recipe" })},
    AddIngredient: { screen: AddIngredient, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Add Ingredient" })},
    MealPlanner: { screen: MealPlanner, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Meal Planner" })},
    ViewIngredients: { screen: ViewIngredients, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Ingredient List" })},
    EditIngredient: { screen: EditIngredient, navigationOptions: Object.assign({}, PageHeaderStyle, { title: "Edit Ingredient" })}
});

let Navigation = createAppContainer(MainNavigator);

interface AppLocalState {
}

interface AppProps extends React.Props<App> {
    hasNetworkConnectivity: boolean,
    currentError: string | null,
    isLoaded: boolean
}

const mapStateToProps = (state: AppState) => {
    return {
        hasNetworkConnectivity: state.network.hasConnectionToServer,
        currentError: state.network.currentError,
        isLoaded: state.loadingState.currentlyLoading == null ? true : state.loadingState.currentlyLoading.size === 0
    };
}

const mapDispatchToProps = {
};

class App extends React.Component<AppProps, AppLocalState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <InitialStateLoader shouldReload={!this.props.isLoaded} />
                { this.props.isLoaded && this.props.hasNetworkConnectivity && <Navigation />}

                { !this.props.isLoaded && 
                    <View style={styles.centerAlign}>
                        <ActivityIndicator size={72} color={Colors.Blue}/>
                    </View>
                }

                { this.props.currentError != null &&
                    <ErrorDisplay errorMessage={this.props.currentError} />
                }

                { !this.props.hasNetworkConnectivity && this.props.isLoaded &&
                    <NoConnectionToServer attemptReload={() => this.setState({isLoaded: false})}/>
                }
            </Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);