export class TreeUtils {
  // Recursive, depth-first. Will call the callbackOnLeaf when a leaf has been found
  public static traverseTree(
    // recursive, depth-first
    value: any,
    callbackOnLeaf: (...params: any) => any,
    topDownKeysList: (string | number)[] = [] // topDownKeysList should not be sent by caller
  ): void {
    if (!value || typeof value !== "object") {
      // If is non-object => it's leaf node => call the callback function on it
      callbackOnLeaf(value, topDownKeysList);
    } else if (Array.isArray(value)) {
      // If is Array => loop through it and call traverseTree
      value.forEach((el, index) => {
        TreeUtils.traverseTree(
          el,
          callbackOnLeaf,
          topDownKeysList.concat([index])
        );
      });
    } else {
      Object.keys(value).forEach((key) => {
        // If is dictionary => loop through its attributes and call traverseTree
        TreeUtils.traverseTree(
          value[key],
          callbackOnLeaf,
          topDownKeysList.concat([key])
        );
      });
    }
  }

  // Recursive. Will return the node found (can be either a leaf, a subtree, or undefined)
  public static accessTreeByTopDownKeysList(
    tree: any,
    keysList: (string | number)[]
  ): any {
    // recursive
    if (keysList?.length && tree) {
      return TreeUtils.accessTreeByTopDownKeysList(
        tree[keysList.shift()],
        keysList
      );
    } else {
      return tree;
    }
  }
}
