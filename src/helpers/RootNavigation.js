import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigateWithReset(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name }],
        })
    }
}