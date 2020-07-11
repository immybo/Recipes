import React from 'react';
import ViewRecipes from './components/ViewRecipes';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, StackHeaderTitleProps, StackHeaderProps } from '@react-navigation/stack'
import { Provider, connect } from 'react-redux';
import { store, AppState } from './reducers/Reducers';
import AddRecipe from './components/AddRecipe';
import InitialStateLoader from './components/InitialStateLoader';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from './style/Colors';
import { styles } from './style/Style';
import NoConnectionToServer from './components/NoConnectionToServer';
import AddIngredient from './components/AddIngredient';
import MealPlanner from './components/MealPlanner';
import ErrorDisplay from './components/ErrorDisplay';
import ViewIngredients from './components/ViewIngredients';
import { NavigationContainer } from '@react-navigation/native';
import EditRecipe from './components/EditRecipe';
import EditIngredient from './components/EditIngredient';
import { RouteViewIndividualRecipe, RouteEditRecipe, RouteEditIngredient, RouteViewRecipes, RouteAddRecipe, RouteAddIngredient, RouteMealPlanner, RouteViewIngredients } from './Routes';
import ViewIndividualRecipe from './components/ViewIndividualRecipe';
import NavigationToggle from './components/NavigationToggle';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName={RouteViewRecipes} drawerType={"back"}>
        <Drawer.Screen name={RouteViewRecipes} component={ViewRecipes} />
        <Drawer.Screen name={RouteAddRecipe} component={AddRecipe} />
        <Drawer.Screen name={RouteAddIngredient} component={AddIngredient} />
        <Drawer.Screen name={RouteMealPlanner} component={MealPlanner} />
        <Drawer.Screen name={RouteViewIngredients} component={ViewIngredients} />
    </Drawer.Navigator>
)

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

                { this.props.isLoaded && this.props.hasNetworkConnectivity && this.getNavigator()}

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

    private getNavigator(): JSX.Element {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ header: (props: StackHeaderProps) => <NavigationToggle stackNavigation={props.navigation} pageTitle={props.scene.route.name} /> }}>
                    <Stack.Screen options={{headerShown: false}} name="Main" component={DrawerNavigator} />
                    <Stack.Screen name={RouteEditRecipe} component={EditRecipe} />
                    <Stack.Screen name={RouteEditIngredient} component={EditIngredient} />
                    <Stack.Screen name={RouteViewIndividualRecipe} component={ViewIndividualRecipe} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);