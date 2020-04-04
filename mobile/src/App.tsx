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

const MainNavigator = createStackNavigator({
    ViewRecipes: { screen: ViewRecipes },
    AddRecipe: { screen: AddRecipe },
    ViewIndividualRecipe: { screen: ViewIndividualRecipe },
    EditRecipe: { screen: EditRecipe },
    AddIngredient: { screen: AddIngredient },
    MealPlanner: { screen: MealPlanner }
});

let Navigation = createAppContainer(MainNavigator);

interface AppLocalState {
    isLoaded: boolean
}

interface AppProps extends React.Props<App> {
    hasNetworkConnectivity: boolean,
    currentError: string | null
}

const mapStateToProps = (state: AppState) => {
    return {
        hasNetworkConnectivity: state.network.hasConnectionToServer,
        currentError: state.network.currentError
    };
}

class App extends React.Component<AppProps, AppLocalState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false
        };
    }

    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <InitialStateLoader shouldReload={!this.state.isLoaded} onLoad={() => this.setState({isLoaded: true})} />
                { this.state.isLoaded && this.props.hasNetworkConnectivity && <Navigation />}

                { !this.state.isLoaded && 
                    <View style={styles.centerAlign}>
                        <ActivityIndicator size={72} color={Colors.Blue}/>
                    </View>
                }

                { this.props.currentError != null &&
                    <ErrorDisplay errorMessage={this.props.currentError} />
                }

                { !this.props.hasNetworkConnectivity && this.state.isLoaded &&
                    <NoConnectionToServer attemptReload={() => this.setState({isLoaded: false})}/>
                }
            </Provider>
        );
    }
}

export default connect(mapStateToProps)(App);