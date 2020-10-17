function addStyleForString(objectValue = { value: null, matchedWords: [] }) {
  const { value, matchedWords } = objectValue;
  const strStyled = `<span style="background: yellow; font-weight: 600;">${matchedWords[0]}</span>`;

  return value ? value.replace(/<em>(.|\n)*?<\/em>/g, strStyled) : '<span style="color: gray;">(empty)</span>';
}

export function mappingData(data) {
  const newData = data.map((item) => {
    const { title, objectID, author, _highlightResult } = item;

    return {
      id: objectID,
      title: addStyleForString(_highlightResult.title) || title,
      author: addStyleForString(_highlightResult.author) || author,
    };
  });
  console.log(newData);
  return newData;
}
