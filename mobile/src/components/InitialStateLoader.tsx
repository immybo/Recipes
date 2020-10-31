import { fetchRecipes } from "../actions/RecipeActions";
import { fetchIngredients } from "../actions/IngredientActions";
import { View } from "react-native";
import React from "react";
import { connect } from "react-redux";
import { LoadingType, beginLoading, endLoading } from "../actions/LoadingActions";
import { setApiErrorToDisplay, removeDisplayedError, hasConnectionToServer } from "../actions/NetworkActions";
import TimeoutError from "../services/TimeoutError";

interface InitialStateLoaderProps extends React.Props<InitialStateLoader> {
    fetchRecipes: () => Promise<void>
    fetchIngredients: () => Promise<void>
    shouldReload: boolean
    beginLoading: (type: LoadingType) => void
    endLoading: (type: LoadingType) => void
    setApiErrorToDisplay: (message: string) => void
    removeDisplayedError: () => void
    hasConnectionToServer: (hasConnection: boolean) => void
    onLoad: () => void
}

interface InitialStateLoaderState {
    isLoading: boolean
}

const mapDispatchToProps = {
    fetchRecipes,
    fetchIngredients,
    beginLoading,
    endLoading,
    setApiErrorToDisplay,
    removeDisplayedError,
    hasConnectionToServer
};

const mergeProps = (stateProps: InitialStateLoaderProps, dispatchProps: InitialStateLoaderProps, ownProps: InitialStateLoaderProps): InitialStateLoaderProps => {
    return {
        fetchRecipes: dispatchProps.fetchRecipes,
        fetchIngredients: dispatchProps.fetchIngredients,
        shouldReload: ownProps.shouldReload,
        beginLoading: dispatchProps.beginLoading,
        endLoading: dispatchProps.endLoading,
        setApiErrorToDisplay: dispatchProps.setApiErrorToDisplay,
        removeDisplayedError: dispatchProps.removeDisplayedError,
        hasConnectionToServer: dispatchProps.hasConnectionToServer,
        onLoad: ownProps.onLoad
    }
}

class InitialStateLoader extends React.Component<InitialStateLoaderProps, InitialStateLoaderState> {
    constructor(props: InitialStateLoaderProps) {
        super(props);

        this.state = {
            isLoading: false
        }
    }
    
    public render(): JSX.Element {
        return <View />;
    }

    public componentDidMount(): void {
        this.fetchData();
    }

    public componentDidUpdate(): void {
        if (this.props.shouldReload && !this.state.isLoading) {
            this.fetchData();
        }
    }

    private fetchData(): void {
        this.props.beginLoading(LoadingType.InitialState);
        this.setState({ isLoading: true });
        this.props.fetchRecipes()
            .then(
                _ => this.props.fetchIngredients(),
                failureReason => this.fail(failureReason))
            .then(_ => {
                this.setState({ isLoading: false });
                this.props.endLoading(LoadingType.InitialState);
                this.props.onLoad();
            });
            
    }

    private fail(failureReason: Error) {
        if (failureReason instanceof TimeoutError) {
            this.props.removeDisplayedError();
            this.props.hasConnectionToServer(false);
        } else {
            this.props.setApiErrorToDisplay(failureReason.message);
        }
    }
}

export default connect(null, mapDispatchToProps, mergeProps)(InitialStateLoader);