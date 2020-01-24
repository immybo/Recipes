/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { store } from './src/reducers/Reducers';
import React from 'react';
import { Provider } from 'react-redux';

AppRegistry.registerComponent(appName, () => Index);

class Index extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}