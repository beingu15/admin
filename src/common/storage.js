import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';

const uploadImage = async (path) => {
    try {
        const uri = path;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const pathForFirebaseStorage = await getPathForFirebaseStorage(uri);
        console.log('Uploading file:', pathForFirebaseStorage);

        const storageRef = storage().ref(filename);
        await storageRef.putFile(pathForFirebaseStorage);

        const downloadURL = await storageRef.getDownloadURL();
        console.log('File uploaded successfully:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

const getPathForFirebaseStorage = async (uri) => {
    if (Platform.OS === 'ios') {
        return uri;
    }

    try {
        const stat = await RNFetchBlob.fs.stat(uri);
        console.log('File stat:', stat);
        return stat.path;
    } catch (error) {
        console.error('Error getting file path for Firebase Storage:', error);
        throw error;
    }
}

export default uploadImage;
