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

export const deleteCollection = async (
  context: AppContextState,
  collectionId: number
) => {
  const collectionDeleteMutation = `
    mutation collectionDelete($id: Int!) {
      collectionDelete(id: $id) }`;
  const resp = await collectionsGraphqlRequest(
    context,
    collectionDeleteMutation,
    {
      id: collectionId,
    }
  );
  return resp && get(resp, "collectionDelete");
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
      {
        collectionId: collectionId,
        position: 0,
        upload: {
          id: uploadId,
        },
      }
    );
    return resp && get(resp, "collectionAddUpload");
  }
};

export const renameCollection = async (
  context: AppContextState,
  collectionId: number,
  collectionName: string
) => {
  const collectionEditMutation = `
    mutation collectionEdit($id: Int!, $name: String) {
      collectionEdit(id: $id, name: $name)
      }`;
  const resp = await collectionsGraphqlRequest(
    context,
    collectionEditMutation,
    {
      id: collectionId,
      name: collectionName,
    }
  );
  return resp && get(resp, "collectionEdit");
};

export const duplicateCollection = async (
  context: AppContextState,
  collectionId: number,
  collectionName: string
) => {
  const collectionCloneMutation = `
    mutation collectionClone($id: Int!, $name: String!) {
      collectionClone(id: $id, name: $name){
        ${CollectionFragment}
        }
      }`;
  const resp = await collectionsGraphqlRequest(
    context,
    collectionCloneMutation,
    {
      id: collectionId,
      name: collectionName,
    }
  );
  return resp && get(resp, "collectionClone");
};

export const deleteItem = async (
  context: AppContextState,
  collectionId: number,
  itemId: number
) => {
  const collectionRemoveItem = `
    mutation collectionRemoveItem($collectionId: Int!, $itemId: Int!) {
      collectionRemoveItem(collectionId: $collectionId, itemId: $itemId)
      }`;
  const resp = await collectionsGraphqlRequest(context, collectionRemoveItem, {
    collectionId: collectionId,
    itemId: itemId,
  });
  return resp && get(resp, "collectionRemoveItem");
};

export const acceptInvitation = async (
  context: AppContextState,
  id: number,
  token: string
) => {
  const collectionAcceptInvitation = `
    mutation collectionAcceptInvitation($id: Int!, $token: String!) {
      collectionAcceptInvitation(id: $id, token: $token)
      }`;
  const resp = await collectionsGraphqlRequest(
    context,
    collectionAcceptInvitation,
    {
      id: id,
      token: token,
    }
  );
  return resp && get(resp, "collectionAcceptInvitation");
};
