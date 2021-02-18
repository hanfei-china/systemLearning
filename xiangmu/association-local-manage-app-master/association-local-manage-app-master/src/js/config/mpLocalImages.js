import image1 from '../../assets/mpLocal/1.png';

const images = [image1];

export function getMPLocalImage(path) {
    return images[path - 1];
}
