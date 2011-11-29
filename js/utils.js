function realloc(array, type, minSize) {
    if (array.length >= minSize)
        return array;
    var size = array.length;
    while(size < minSize)
        size *= 2;
    return new type(size);

}
