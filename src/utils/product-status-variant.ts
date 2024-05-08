export const getProductStatusVariant = (title) => {
  switch (title) {
    case 'published':
      return 'success'
    case 'draft':
    default:
      return 'default'
  }
}
