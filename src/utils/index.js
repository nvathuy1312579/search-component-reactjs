export function mappingData(data) {
  console.log(data);
  const newData = data.map((item) => ({
    id: item.objectID,
    title: item.title,
    storyTitle: item.story_title,
    author: item.author,
  }));
  return newData;
}
