import { AsyncStorage } from 'react-native';

export default AsyncAuthFetch = async (URL) => {
    const token = await AsyncStorage.getItem("SlugSpace:JWT").then(token => token).catch(error => console.log(err))
    return fetch(URL, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
    }).then(response => response.json());
}
