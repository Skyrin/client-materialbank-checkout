import { collectionsGraphqlRequest } from "CollectionsGraphqlClient";
import { AppContextState } from "context/AppContext";
import { CollectionFragment } from "./fragments";
import { CollectionsQueryInput, UploadPhotoInput } from "./models";
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

export const getCollection = async (
  context: AppContextState,
  collectionId: number
) => {
  const CollectionQuery = `
    query collection($collectionId: Int) {
      collections(limit: 1, offset: 0, collectionId: $collectionId) {
        data {
          ${CollectionFragment}
        }
      }
    }
  `;
  const resp = await collectionsGraphqlRequest(context, CollectionQuery, {
    collectionId: collectionId,
  });
  return resp && get(resp, "collections.data[0]");
};

export const uploadPhoto = async (
  context: AppContextState,
  collectionId: number,
  uploadInput: UploadPhotoInput
) => {
  const UploadAddMutation = `
    mutation uploadAdd($name: String!, $fileName: String!, $file: String!) {
      uploadAdd(name: $name, fileName: $fileName, file: $file) {
        id
      }
    }
  `;

  const CollectionAddUploadMutation = `
    mutation collectionAddUpload($collectionId: Int!, $position: Int!, $upload: UploadInput!) {
      collectionAddUpload(collectionId: $collectionId, position: $position, upload: $upload)
    }
  `;

  const uploadResp = await collectionsGraphqlRequest(
    context,
    UploadAddMutation,
    uploadInput
  );
  const uploadId = get(uploadResp, "uploadAdd.id");
  if (uploadId) {
    const resp = await collectionsGraphqlRequest(
      context,
      CollectionAddUploadMutation,
      { id: uploadId }
    );
    return resp && get(resp, "collectionAddUpload");
  }
};
