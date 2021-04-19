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
export const CollectionHotspotFragment = `
  id
  name
  type
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
  hotspot{
   ${CollectionHotspotFragment}
  }
  updatedBy
  createdOn
  updatedOn
`;

export const CollaboratorFragment = `
  userId
  access
  firstName
  lastName
  email
  profileImage
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
    ${CollaboratorFragment}
  }
`;

export const HotspotFragment = `
  id,
  name,
  description,
  imageUrl,
  type,
  color,
  priceSign,
  tags,
  createdOn,
  updatedOn,
  markers{
    id,
    hotspotId,
    xCoord,
    yCoord,
    sku,
    createdOn,
    updatedOn,
    related{
      id,
      markerId,
      position,
      sku,
      createdOn,
      updatedOn
    }
  }
`;
