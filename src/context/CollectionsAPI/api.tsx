import { collectionsGraphqlRequest } from "CollectionsGraphqlClient";
import { AppContextState } from "context/AppContext";
import { CollectionFragment } from "./fragments";
import { CollectionsQueryInput } from "./models";
import { get } from "lodash-es";

export const createCollection = async (
  context: AppContextState,
  collectionName: string,
  isPublic: boolean
) => {
  const CollectionAddMutation = `
    mutation collectionAdd($name: String!, $isPublic: Boolean!) {
      collectionAdd(name: $name, isPublic: $isPublic) {
        ${CollectionFragment}
      }
    }
  `;
  const resp = await collectionsGraphqlRequest(context, CollectionAddMutation, {
    name: collectionName,
    isPublic: isPublic,
  });
  return resp && get(resp, "collectionAdd");
};

export const getCollections = async (
  context: AppContextState,
  variables: CollectionsQueryInput
) => {
  const CollectionsQuery = `
    query collections($limit: Int!, $offset: Int!, $slug: String, $collectionId: Int, $searchName: String, $sort: CollectionSortInput) {
      collections(limit: $limit, offset: $offset, slug: $slug, collectionId: $collectionId, searchName: $searchName, sort: $sort) {
        data {
          ${CollectionFragment}
        }
        count
      }
    }
  `;
  const resp = await collectionsGraphqlRequest(
    context,
    CollectionsQuery,
    variables
  );
  return resp && get(resp, "collections.data");
};
