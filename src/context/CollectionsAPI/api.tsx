import { collectionsGraphqlRequest } from "CollectionsGraphqlClient";
import { AppContextState } from "context/AppContext";

export const createCollection = async (
  context: AppContextState,
  collectionName: string,
  isPublic: boolean
) => {
  const CollectionAddMutation = `
    mutation collectionAdd($name: String!, $isPublic: Boolean!) {
      collectionAdd(name: $name, isPublic: $isPublic) {
        id
        name
        isPublic
      }
    }
  `;
  const resp = await collectionsGraphqlRequest(context, CollectionAddMutation, {
    name: collectionName,
    isPublic: isPublic,
  });
  return resp && resp["collection"];
};
