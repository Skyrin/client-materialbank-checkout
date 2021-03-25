export const PaletteFragment = `
  id
  customerId
  name
  isShared
  createdAt
  items {
    id
    sku
    image
    metadata {
      imageSharedUrl
      imageUrl
    }
  }
`;

export const UploadFragment = `
  id
  name
  fileName
  fileType
  blurhash
  url
  updatedBy
  createdOn
  updatedOn
`;

export const CollectionItemFragment = `
  id
  collectionId
  position
  name
  objectId
  objectType
  json
  palette {
    ${PaletteFragment}
  }
  material {
    sku
  }
  room {
    id
  }
  upload {
   ${UploadFragment}
  }
  updatedBy
  createdOn
  updatedOn
`;

export const CollectionFragment = `
  id
  userId
  name
  isPublic
  createdOn
  updatedOn
  items {
    ${CollectionItemFragment}
  }
  collaborators {
    userId
    access
  }
`;
